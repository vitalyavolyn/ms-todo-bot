// Обманул, роутеров здесь нет

const User = require('../models/user')
const { getTokenFromCode, getIdFromState, cacheAccessToken } = require('../authHelper')
const bot = require('../bot')

module.exports = async (ctx) => {
  const { code, state } = ctx.query

  if (!code || !state) {
    ctx.throw(401, 'No auth code')
    return
  }

  const id = getIdFromState(state)

  if (!id) {
    ctx.throw(400, 'Ссылка для авторизации устарела.')
  }

  const token = await getTokenFromCode(code)
  cacheAccessToken(token, id)

  const user = new User({ id, refreshToken: token.refresh_token })
  await user.save()

  ctx.body = 'Вы вошли успешно. Вкладку можно закрыть.'
  bot.api.messages.send({ peer_id: id, message: 'Вы вошли успешно. Для создания новой задачи достаточно отправить мне сообщение с ее текстом.' })
}
