const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const config = require('./config/config')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')

const index = require('./routes/index')
// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(cors({
  origin: function (ctx) {
    return 'app://.' // only work for electron
  },
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization']
}))
const adminKey = process.env.ADMIN_KEY || config.adminKey
if (adminKey === undefined) { console.warn('Admin key undefined! Please set ADMIN_KEY to your variable.') }
app.use((ctx, next) => {
  if (ctx.request.path !== '/login') {
    const key = ctx.cookies.get('admin')
    if (adminKey === key) { return next() } else { ctx.response.status = 403 }
  } else { return next() }
})

// routes
app.use(index.routes(), index.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
