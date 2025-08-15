import express from "express";
import { expressjwt } from "express-jwt";
import { createProxyMiddleware } from "http-proxy-middleware";
import { secretKey } from "./utils/jwtOtion.js";
import fileUpaLoad from "./router/file.js";
import user from "./router/user.js";
import dbServe from "./router/bd.js";
import cors from "cors";
let app = express();
let port = process.env.DB_PORT || 80;
app.use(
  cors({
    origin: true, // 发送请求的源
    credentials: true, // 相应的请求
  })
);
app.use(express.static("proxy_public"));
app.use(
  "/api",
  createProxyMiddleware({
    target: "https://www.lilianinfo.com:12000",
    changeOrigin: true, //是否跨域
    secure: false, // 如果是https接口，需要配置这个参数
    pathRewrite: {
      "/api": "",
    },
  })
);
app.use(
  expressjwt({ secret: secretKey, algorithms: ["HS256"] }).unless({
    path: [/^\/user\//, /^\/db\//, /^\/fs\//],
  })
);
app.use(express.json());
app.use("/fs", fileUpaLoad);
app.use("/db", dbServe);
app.use("/user", user);
app.use((err, req, res, next) => {
  if (err) {
    if (err.name === "UnauthorizedError") {
      res.status(401).send("身份认证失败");
    } else {
      res.status(500).send(err.name);
    }
  } else {
    next();
  }
});
app.listen(port, function () {
  console.log(`Running: http://localhost:${port}`);
});
