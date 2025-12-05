// server.js
const wss = new (require("ws").Server)({ port: 8080 });
const clients = {};

wss.on("connection", (ws) => {
  let id = Math.random().toString(36).substr(2, 6);
  clients[id] = ws;
  ws.send(JSON.stringify({ type: "id", id }));

  ws.on("message", (data) => {
    const msg = JSON.parse(data);
    if (msg.target) {
      clients[msg.target]?.send(JSON.stringify(JSON.parse(data))); // 转发给目标客户端
    }
  });

  ws.on("close", () => delete clients[id]);
});

console.log("信令服务器运行在 ws://localhost:8080");
