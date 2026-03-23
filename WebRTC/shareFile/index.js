// server.js
const http = require("http");
const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");
const url = require("url");

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;

  // 默认返回 index.html
  if (pathname === "/") {
    pathname = "/index.html";
  }

  // 构建文件路径（静态文件放在 public 目录）
  const filePath = path.join(__dirname, pathname);

  // 读取文件
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // 文件不存在，返回 404
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>404 Not Found</title></head>
        <body>
          <h1>404 - 页面未找到</h1>
          <p>请求的文件不存在: ${pathname}</p>
          <a href="/">返回首页</a>
        </body>
        </html>
      `);
      return;
    }

    // 设置正确的 MIME 类型
    const ext = path.extname(filePath);
    const contentType =
      {
        ".html": "text/html",
        ".js": "application/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".ico": "image/x-icon",
        ".txt": "text/plain",
      }[ext] || "text/plain";

    res.writeHead(200, {
      "Content-Type": `${contentType}; charset=utf-8`,
      "Access-Control-Allow-Origin": "*",
    });
    res.end(data);
  });
});

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
      console.log(`📨 消息: ${id} -> ${msg.target || "广播"}`);

      if (msg.target && clients[msg.target]) {
        // 转发给目标客户端
        clients[msg.target].send(data);
        console.log(`↪️ 转发: ${id} -> ${msg.target}`);
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
server.listen(PORT, () => {
  console.log(`
  ═══════════════════════════════════════
     🚀 服务器启动成功
  ═══════════════════════════════════════
     📡 HTTP:      http://localhost:${PORT}
     🔌 WebSocket: ws://localhost:${PORT}
     📁 静态目录:  ./public/
  ═══════════════════════════════════════
  `);
});
