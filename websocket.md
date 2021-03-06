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

