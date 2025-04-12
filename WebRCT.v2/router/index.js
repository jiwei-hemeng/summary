const Router = require('koa-router')

let router = new Router()

router.get('/', async ctx => {
  ctx.body = `
    # 访问 127.0.0.1:3003/test-1.html 演示h5媒体流捕获
    # 访问 127.0.0.1:3003/local.html 演示rtc 本地传输
    # 访问 127.0.0.1:3003/p2p.html 演示局域网端对端视屏 
  `
})

module.exports = router
