var express = require("express");
var app = express();
var wsServer = require("express-ws")(app);
// var webSocket = require("./websocket.js");

app.ws("/test-ws", (ws, req) => {
  ws.on("message", (msg) => {
    ws.send(msg);
  });
});

// app.use("/websocket", webSocket);

app.listen(3000);
