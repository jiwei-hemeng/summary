## webSocket

> 实现实时通信

### 原生websocket 体验

```js
const ws = new WebSocket("wss://echo.websocket.org");
ws.onopen = function(evt) {
  console.log("建立连接成功");
  ws.send("hello webscoket");
}
ws.onmessage = function(evt) {
  console.log("接收到的消息", evt.data);
}
ws.onclose = function(evt) {
  console.log("连接已关闭");
}
```
### 原生websocket 常用方法

**发送消息**
```js
const message = {
  id: 1,
  title: '发送ws数据'
}
ws.send(JSON.stringify(message));    // 复杂的数据结构要先进行序列化
```
**断开连接**
```js
ws.close()

```

### socketIo

> 相关连接：[github 仓库](https://github.com/socketio/socket.io-client)       [客户端 API](https://socket.io/docs/v4/client-api/)

**安装**

```shell
npm i socket.io-client
```

**使用**

```js
import io from "socket.io-client";
// 建立连接
const socket = io(http://localhost?token=abc);
socket.on("connect", function() {
  console.log("连接建立成功")
})
socket.on("event", function() {})
socket.on("disconnect", function() {
  console.log("断开连接了")
})
```

**发送消息**

> 语法： socket.emit("消息类型", "消息内容");

```js
socket.emit("message", {
  msg: "你好",
  timestamp: Date.now()
})
```

**接收消息**

> 语法： socket.on("消息类型", callback)

```js
socket.on("message", (data) => {
  const.log("message", data)
})
```

### 服务端

**广播消息给除当前客户端之外的所有在线客户端**

```js
socket.broadcast.emit('user connected');
```

**当前房间的客户端广播消息**

```js
io.on('connection', (socket) => {
  // to one room
  socket.to('others').emit('an event', { some: 'data' });
  // to multiple rooms
  socket.to('room1').to('room2').emit('hello');
  // a private message to another socket
  socket.to(/* another socket id */).emit('hey');
});
```

**与当客户端的连接丢失后，会自动的将其从房间移除**

```js
socket.leave(room[, callback])
```

### 实例

**nodejs**

```js
const express = require("express");
const app = express();
app.use(express.static("public"));
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: true, // 解决报跨域的问题
});
let userList = [];
io.on('connection', (socket) => {
  console.log("websocket建立连接成功")
  socket.on("jojn", function (room) {
    userList.push({ id: socket.id, room })
    socket.join(room);
  });
  socket.on("chat-message", function (msg) {
    socket.emit("chat-message", { type: "发给自己的消息", msg })
    const user = userList.find(item => { return item.id === socket.id })
    io.to(user.room).emit("feature-message", {
      msg
    });
  });
});
server.listen(3000);
```

**页面**

```js
const socket = io("http://localhost:3000");
socket.on("connect", function () {
  console.log("连接建立成功")
  socket.emit("jojn", location.search)
  const input = document.querySelector("#message")
  input.addEventListener("blur", () => {
    socket.emit("chat-message", input.value)
  });
})
socket.on("feature-message", function (data) {
  console.log("发给我的消息", data)
})
socket.on("chat-message", function (data) {
  console.log("发给我的消息", data)
})
socket.on("disconnect", function () {
  console.log("断开连接了")
})
```

