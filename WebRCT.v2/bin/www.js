const http = require('http')
const app = require('../app')
const socketIO = require('../socket.js')


const server = http.createServer(app.callback())

socketIO.attach(server)

server.listen(3003, () => {
  console.log('server start on 127.0.0.1:3003')
})
