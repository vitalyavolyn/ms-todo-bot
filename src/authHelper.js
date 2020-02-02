const oauth = require('simple-oauth2')
const redis = require('./redis')
const config = require('../config')

const credentials = {
  client: {
    id: config.clientId,
    secret: config.secret
  },
  auth: {
    tokenHost: 'https://login.microsoftonline.com',
    authorizePath: 'common/oauth2/v2.0/authorize',
    tokenPath: 'common/oauth2/v2.0/token'
  }
}

const oauth2 = oauth.create(credentials)

const authState = {}

const getAuthUrl = (id) => {
  const state = Math.random().toString(36).substring(2, 15)
  authState[state] = id

  const { redirectUri, scope, clientId } = config

  return `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?scope=${encodeURI(scope)}&client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&state=${state}`
}

const getIdFromState = (str) => authState[str]

const getTokenFromCode = async (code) => {
  const result = await oauth2.authorizationCode.getToken({
    code,
    redirect_uri: config.redirectUri,
    scope: config.scope
  })

  const token = oauth2.accessToken.create(result)
  return token.token
}

const refreshToken = async (refreshToken) => {
  const newToken = await oauth2.accessToken.create({ refresh_token: refreshToken }).refresh()
  return newToken.token
}

const cacheAccessToken = (token, id) => {
  redis.set(`ms-token-${id}`, token.access_token, 'ex', token.expires_in)
}

const getToken = async (user) => {
  let token = await redis.get(`ms-token-${user.id}`)
  if (!token) {
    token = await refreshToken(user.refreshToken)
  }

  return token
}

module.exports = {
  getAuthUrl,
  getIdFromState,
  getTokenFromCode,
  refreshToken,
  cacheAccessToken,
  getToken
}
