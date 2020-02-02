const { VK } = require('vk-io')

const User = require('../models/user')
const { getAuthUrl, getToken } = require('../authHelper')
const { createTask } = require('../toDoApi')
const { token, groupId } = require('../../config')

const vk = new VK({
  token,
  apiLimit: 20,
  pollingGroupId: groupId
})

const { updates } = vk

updates.use(async (ctx, next) => {
  const user = await User.findOne({ id: ctx.senderId })
  if (!user) {
    ctx.send('Привет! Это бот для создания задач в Microsoft To Do. Для начала работы необходимо авторизоваться: ' + getAuthUrl(ctx.senderId))
    return
  }

  ctx.state = { user }
  next()
})

// Самый последний middleware в очереди
// Если не в какой-либо сцене и дошли до этого шага,
// то добавить задачу с текстом сообщения
updates.use(async ctx => {
  const token = await getToken(ctx.state.user)
  await createTask(token, ctx.text)
  ctx.send('Задача создана успешно!')
})

module.exports = vk
