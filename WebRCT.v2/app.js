const path = require('path')
const Koa = require('koa')
const static = require('koa-static')
const router = require('./router/index')

// koa仅作为静态资源服务器
const app = new Koa()

app.use(static(path.resolve(__dirname, './client')))
app.use(router.routes())

module.exports = app
