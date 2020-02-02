const axios = require('axios')

const api = axios.create({
  baseURL: 'https://outlook.office.com/api/v2.0/me'
})

const createTask = (token, text) => {
  return api('/tasks', {
    method: 'POST',
    data: {
      Subject: text
    },
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

module.exports = { api, createTask }
