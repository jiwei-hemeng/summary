// server.js
const express = require("express");
const http = require("http");
const path = require("path");
const WebSocket = require("ws");
let app = express();

const server = http.createServer(app);
app.use(express.static(path.join(__dirname, "public")));
// WebSocket 信令服务（附加到同一个 HTTP 服务器）
const wss = new WebSocket.Server({ server });
const clients = {};

wss.on("connection", (ws) => {
  let id = Math.random().toString(36).substr(2, 6);
  clients[id] = ws;
  ws.send(JSON.stringify({ type: "id", id }));
  console.log(`✅ 客户端连接: ${id} (在线: ${Object.keys(clients).length})`);

  ws.on("message", (data) => {
    try {
      const msg = JSON.parse(data);
      console.log(`↪️ 消息: ${id} -> ${msg.target || "广播"}`);
      if (msg.target && clients[msg.target]) {
        // 转发给目标客户端
        clients[msg.target].send(JSON.stringify(msg));
        console.log(`📨 转发: ${data}`);
      }
    } catch (error) {
      console.error("❌ 消息解析错误:", error.message);
    }
  });

  ws.on("close", () => {
    delete clients[id];
    console.log(`❌ 客户端断开: ${id} (在线: ${Object.keys(clients).length})`);
  });
});

// 启动服务器
const PORT = 8080;
server.listen(PORT, function () {
  console.log(`
  ═══════════════════════════════════════
     🚀 服务器启动成功
  ═══════════════════════════════════════
     📡 HTTP:      http://localhost:${PORT}
     🔌 WebSocket: ws://localhost:${PORT}
     📁 静态目录:  /
  ═══════════════════════════════════════
  `);
});
