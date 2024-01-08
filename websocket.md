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

### 原生scoket 前后端例子

**nodeJS**

```js
import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 3000 });
wss.on("connection", (ws, req) => {
  ws.on("message", (message) => {
    let msgData = JSON.parse(message);
    if (msgData.type === "open") {
      ws.sessionId = `${msgData.fromUserId}-${msgData.toUserId}`;
      // 给除了自己以外的其他人发消息
      wss.clients.forEach((client) => {
        if (!client.sessionId.startsWith(msgData.fromUserId)) {
          client.send(
            JSON.stringify({
              type: "greet",
              content: `欢迎${msgData.fromUserId}加入`,
            })
          );
        }
      });
    } else {
      let sessionId = `${msgData.toUserId}-${msgData.fromUserId}`;
      wss.clients.forEach((client) => {
        if (client.sessionId === sessionId) {
          msgData.type = "chart-data";
          client.send(JSON.stringify(msgData)); // 给对应的客户端连接发送消息
        }
      });
    }
  });
  // 连接关闭
  ws.on("close", (req) => {
    console.log("连接关闭", req);
  });
});
```

**前端页面**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      #form {
        background: rgba(0, 0, 0, 0.15);
        padding: 0.25rem;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        height: 3rem;
        box-sizing: border-box;
        backdrop-filter: blur(10px);
      }
      #message {
        border: none;
        padding: 0 1rem;
        flex-grow: 1;
        border-radius: 2rem;
        margin: 0.25rem;
      }
      #message:focus {
        outline: none;
      }
      #form > button {
        background: #333;
        border: none;
        padding: 0 1rem;
        margin: 0.25rem;
        border-radius: 3px;
        outline: none;
        color: #fff;
      }
    </style>
  </head>
  <body>
    <ul id="elUl"></ul>
    <div id="form">
      <input type="text" id="message" />
      <button id="send">发送</button>
    </div>
    <script>
      function getURLParameters(url = location.href) {
        const str = url.match(/([^?=&]+)(=([^&]*))/g) || [];
        return str.reduce(
          (a, v) => (
            (a[decodeURIComponent(v.slice(0, v.indexOf("=")))] =
              decodeURIComponent(v.slice(v.indexOf("=") + 1))),
            a
          ),
          {}
        );
      }
      const ws = new WebSocket("ws://localhost:3000?token=123456");
      const elUl = document.querySelector("#elUl");
      const userInfo = getURLParameters();
      let msgData = {
        timeStarp: Date.now(),
        type: "open",
        toUserId: userInfo.toUserId,
        fromUserId: userInfo.fromUserId,
      };
      // 监听连接成功
      ws.onopen = () => {
        document.querySelector("#send").addEventListener("click", () => {
          const messageNode = document.querySelector("#message");
          const messageStr = JSON.stringify({
            timeStarp: Date.now(),
            type: "message",
            toUserId: userInfo.toUserId,
            fromUserId: userInfo.fromUserId,
            content: messageNode.value,
          });
          ws.send(messageStr);
          elUl.innerHTML += `<li class="message-item rigth">${userInfo.fromUserId}：${messageNode.value}</li>`;
          messageNode.value = "";
        });
        ws.send(JSON.stringify(msgData)); // send 方法给服务端发送消息
      };

      // 监听服务端消息(接收消息)
      ws.onmessage = (msg) => {
        let message = JSON.parse(msg.data);
        if(message.type === "chart-data") {
          elUl.innerHTML += `<li class="message-item left">${message.fromUserId}：${message.content}</li>`;
        } else {
          console.log(JSON.stringify(message))
        }
        
      };

      // 监听连接失败
      ws.onerror = () => {
        console.log("连接失败，正在重连...");
      };

      // 监听连接关闭
      ws.onclose = () => {
        console.log("连接关闭");
      };
    </script>
  </body>
</html>
```

