const mongoose = require('mongoose')
const Koa = require('koa')
const koaBody = require('koa-body')
const Router = require('koa-router')

const auth = require('./router/auth')
const bot = require('./bot')
const { connectionString } = require('../config')

mongoose.set('useNewUrlParser', true)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)
mongoose.connect(connectionString)
mongoose.connection.on('error', console.error)

const app = new Koa()

app.use(koaBody())

const router = new Router()

router.get('/auth', auth)

app.use(router.routes())
app.listen(process.env.PORT || 8778)

bot.updates.startPolling()
