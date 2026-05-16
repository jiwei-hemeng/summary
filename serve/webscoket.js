// @ts-nocheck
import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 3000 });
function getURLParameters(url = location.href) {
  const str = url.match(/([^?=&]+)(=([^&]*))/g) || [];
  return str.reduce(
    (a, v) => (
      (a[decodeURIComponent(v.slice(0, v.indexOf("=")))] = decodeURIComponent(
        v.slice(v.indexOf("=") + 1)
      )),
      a
    ),
    {}
  );
}
wss.on("connection", (ws, req) => {
  const query = getURLParameters(req.url);
  ws.sessionId = `${query.fromUserId}-${query.toUserId}`;
  ws.on("message", (message) => {
    let msgData = JSON.parse(message);
    if (msgData.type === "open") {
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
    console.log("连接关闭", wss.clients);
  });
});
