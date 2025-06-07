## express 

**安装**

```shell
yarn add express -S
```

**搭建web服务器**

```js
const express = require("express");
let app = express()
let port = 3006
app.get("/test", (req, res) => {
  res.json({
    code: 200,
    msg: "测试成功"
  })
})
app.listen(port, function() {
  console.log(`Hello world is listening at port ${port}`)
})
```

## 关于跨域

跨域的中间件，必须放到最开头

```js
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:8080");
});
```

也可以通过安装*cors* 插件

```shell
yarn add cors -S
```

通过使用中间件

```js
app.use(
  cors({
    origin: true, // 发送请求的源
    credentials: true, // 相应的请求
  })
); 
```

## 设置请求体

**当请求头为*application/json* 时**

```js
app.use(express.json());
```

**当请求头为*application/x-www-form-urlencoded* 时**

```js
app.use(express.urlencoded({
   extended: false;
}));
```

## express的路由

在*/router/test.js*中

```js
const express = require("express");
const router = express.Router();

router.get("/test/:id", function(req, res) {
  res.json({
    code: 200,
    msg: "请求成功",
    data: req.params
  })
});

module.exports = router
```

在*app.js* 中导入并使用

```js
let Test = require("./router/test")
app.use("/api", Test)
```

## 开放静态资源

在*app.js*中

```js
app.use(express.static("public"))
```

## 关于**jsonwebtoken**

### 安装

```shell
yarn add jsonwebtoken express-jwt -S
```

### 生成token

```js
const secretKey = "jiwei-96";
const jwt = require("jsonwebtoken");
router.post("/login", (req, res) => {
  res.json({
    code: 200,
    message: "登录成功",
    token:
      "Bearer " +
      jwt.sign({ username: req.body.username }, secretKey, {
        expiresIn: "2h",
      }),
    });
  });
});
```

### 服务端主动刷新token

```js
import jwt from "jsonwebtoken";
function getTokenExpiresIn(token) {
  // 解析JWT以获取过期时间（exp字段）
  const decoded = jwt.decode(token);
  const expirationTime = new Date(decoded.exp * 1000); // 将秒转换为毫秒
  const currentTime = new Date();
  // 计算剩余时间
  return (expirationTime - currentTime) / 1000;
}

function generateAccessToken(user) {
  return "Bearer " +
    jwt.sign({ username: user.username }, secretKey, {
    expiresIn: "2h",
  })
}

app.use((req, res, next) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  if (accessToken) {
    const expiresIn = getTokenExpiresIn(accessToken);
    if (expiresIn < 60) { // 剩余时间小于 60 秒
      const newAccessToken = generateAccessToken(req.user);
      res.set('New-Access-Token', newAccessToken);
    }
  }
  next();
});

// 客户端逻辑
service.interceptors.response.use(response => {
  const newAccessToken = response.headers['new-access-token'];
  if (newAccessToken) {
    localStorage.setItem('accessToken', newAccessToken);
  }
  return response;
});
```

### 配置不需要token认证的接口

```js
import { expressjwt } from "express-jwt";
app.use(expressjwt({ secret: secretKey, algorithms: ["HS256"] }).unless({ path: [/^\/api\//] }));
```

### 接口中解密token

**使用tokenexpressJWT**

```js
app.post("/api/getUserData", (req, res) => {
  console.log("用户信息", req.user)
})
```

**使用verify**

```js
const secretKey = "jiwei-96";
const jwt = require("jsonwebtoken");
router.post("/getUserInfo", (req, res) => {
  const token = req.headers.sessiontoken //获取前端请求头发送过来的token
  jwt.verify(token, secretKey, function (err, decode) {
    if(err) {
      res.json({
        code: 400,
        msg: "Failed to authenticate token"
      })
    } else {
      console.log("userInfo", decode)
      res.json({
        code: 200,
        msg: "操作成功"
        data: decode
      })
    }
  }
})
```

## 关于动态验证码

**安装**

```shell
yarn add svg-captcha
```

**生成普通验证码**

```js
const svgCaptcha = require("svg-captcha");
router.get("/captcha", function (req, res) {
  let captcha = svgCaptcha.create({}); // 创建验证码对象
  req.session.captcha = captcha.text; // 把验证码上的字母保存到 session 中
  res.type("svg");
  res.status(200).send(captcha.data); // 做出响应
});
```

 调用 `create()` 之后，会返回一个对象，结构如下：`{data:'',text:''}` 

+  **data** 验证码 svg 图片 
+ **text**: 验证码字符

 **create()的参数如下：** 

- `size`: 4 // 验证码长度
- `ignoreChars`: '0o1i' // 验证码字符中排除 0o1i
- `noise`: 1 // 干扰线条的数量
- `color`: true // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
- `background`: '#cc9966' // 验证码图片背景颜色

**创建算数式验证码**

```js
const express = require('express');
const captcha = require('svg-captcha');
const router = express.Router();
router.get('/captcha',(req,res)=>{
  const cap = captcha.createMathExpr();
  req.session.captcha = cap.text; // session 存储
  res.type('svg'); // 响应的类型
  res.send(cap.data);
});
```

**验证验证码是否正确**

```js
router.post("/reguser", (req, res) => {
  if (req.body.vcode.toUpperCase() !== req.session.captcha.toUpperCase()) {
    return res.json({ code: 500, message: "验证码错误" });
  }
  res.json({
    code: 200,
    msg: "验证码正确"
  })
});
```

## 配置session 中间件

**安装**

```shell
npm install express-session
```

**使用**

```js
const session = require("express-session");
app.use(
  session({
    secret: "asdfasfda",
    resave: false, // 随便填
    saveUninitialized: true, // 随便填
    // store: {}
  })
);
```

**清除session**

> req.session.destroy()

```js
app.post('/user/logout',(req,res)=>{
  // 清空session信息
  req.session.destroy()
  res.send({
    status: 200,
    message: "退出登录成功"
  })
})
```

## mysql

安装

```shell
cnpm install mysql
```

创建*db.js* 

```js
// @ts-nocheck
import mysql from "mysql";
export default function db(sql, params = undefined) {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: "10.10.10.252",
      user: "hais",
      password: "hais123",
      database: "hais",
      port: "8006",
      timezone: "08:00",
    });
    connection.connect();
    connection.query(sql, params, (error, results) => {
      if (error) {
        console.log("异常信息:", error.sqlMessage)
        console.log("执行的sql:", error.sql)
        reject(error.sqlMessage);
      }
      try {
        if(results instanceof Array) {
          results = results.map(v => Object.assign({}, v));
          resolve(JSON.parse(JSON.stringify(results)))
        } else {
          resolve(results)
        } 
      } catch(err) {
        console.log("err.name", err.name)
        reject(err)
      }
    });
    connection.end();
  });
}
```

使用

```js
const path = require("path");
const db = require(path.join(__dirname, "../utils", "db.js"));
router.post("/reguser", async (req, res) => {
  if (req.body.vcode.toUpperCase() !== req.session.captcha.toUpperCase()) {
    return res.json({ status: 1, message: "验证码错误" });
  }
  delete req.body.vcode;
  // 3. 添加到数据库，完成注册
  const [err, result] = await db("insert into user set ?", req.body);
  if (err || result.affectedRows < 1) {
    console.log(err);
    res.json({ code: 500, message: "注册失败！" });
  } else {
    res.json({ code: 200, message: "注册成功！" });
  }
});
```

## Node.js 文件系统

**实例**

 创建 input.txt 文件，内容如下： 

```txt
菜鸟教程官网地址：www.runoob.com
文件读取实例
```

**读取文件**

```js
const fs = require("fs");
exports.readfile = (fileUrl) => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileUrl, "utf8", function (err, data) {
      if (err) {
        console.error(err);
        return reject(err);
      }
      return resolve(data.toString());
    });
  });
};
```

**写入文件**

```js
const fs = require("fs");
exports.writeFile = (fileUrl, content) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileUrl, JSON.stringify(content), "utf8", function (err) {
      if (err) {
        console.error(err);
        return reject(err);
      }
      return resolve({
        msg: true,
      });
    });
  });
};
```

**验证路径是否存在**

```js
const fs = require("fs");
fs.exists(path, callback)
fs.existsSync(path)
```

**获取文件信息**

```js
const fs = require("fs");
fs.stat(path, callback)
fs.stat(path)
```

**删除文件**

```js
const fs = require("fs");
fs.unlink(path, callback)
fs.unlinkSync(path)
```

**建立目录**

> 异步：fs.mkdir(path[, mode], callback)   同步： fs.mkdirSync(path[, mode])

```js
const fs = require("fs");
const path = require("path");
fs.mkdir(path.join(__dirname, "test"), { recursive: true }, (err) => {
    if (err) {
        return console.error(err);
    }
    console.log("Directory created successfully!");
});
```

**删除目录**

```js
const fs = require("fs");
fs.rmdir(path, callback)
fs.rmdirSync(path)
```

**重命名文件和目录**

```js
const fs = require("fs");
fs.rename(oldPath, newPath, callback)
fs.renameSync(oldPath, newPath)
```

**监视文件更改**

```js
const fs = require("fs");
fs.watchFile(filename[, options], listener)
```

**获取文件信息状态**

```js
//导入文件系统模块（fs）
const fs = require('fs');
let res = fs.statSync('./文件信息.txt')
console.log(res.isFile()); // 判断是否是一个文件 res.isFile();   是返回true，不是返回false
console.log(res.isDirectory()); //判断是否是一个文件夹 res.isDirectory();  是返回true，不是返回false
```

**查看当前目录下的所有文件及目录**

```js
import path from "path";
import fs from "fs";
for (let filename of fs.readdirSync(path.join())) {
  let res = fs.statSync(filename);
  if (res.isDirectory()) {
    console.log(`${filename} 是一个目录`);
  } else if (res.isFile()) {
    console.log(`${filename} 是一个文件`);
  }
}
```

## path 路径模块

> path 模块是 Node.js 官方提供的、用来处理路径的模块。它提供了一系列的方法和属性，用来满足用户对路径的处理需求。

**路径拼接 `path.join()`**

```js
const path = require('path');
const fs = require('fs');
const pathStr = path.join('/a', '/b/c', '../../', './d', 'e');
console.log(pathStr) // \a\d\e
```

**获取路径中文件名 `path.basename()`**

> path.basename(path[, ext])

```js
const path = require('path');
// 定义文件的存放路径
const fpath = '/a/b/c/index.html'
const fullName = path.basename(fpath)
console.log(fullName) // index.html
const nameWithoutExt = path.basename(fpath, '.html');
console.log(nameWithoutExt) // index
```

**获取路径中文件扩展名**

> 获取路径中文件扩展名 `path.extname()`

```js
const path = require('path')
const fpath = '/a/b/c/index.html'
const fext = path.extname(fpath)
console.log(fext) // .html
```

## 配置微信sdk

**安装**

```js
yarn add wechat-jssdk
```

**使用方法(服务器端)**

```js
// 导入微信的jssdk
const { Wechat } = require("wechat-jssdk");
// 初始化jssdk
const wx = new Wechat({
  appId: "wx58299*****f3198",
  appSecret: "71*****************29e8783",
});
router.get("/getsignature", (req, res) => {
  wx.jssdk.getSignature("http://localhost:3006/").then((signatureData) => {
    res.send(signatureData);
  });
});
```

前端

```html
<script>
  $.ajax({
    url: "/api/getsignature",
    success: function (res) {
      wx.config({
        debug: true, 
        appId: res.appId, // 必填，公众号的唯一标识
        timestamp: res.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.nonceStr, // 必填，生成签名的随机串
        signature: res.signature, // 必填，签名
        jsApiList: [], // 必填，需要使用的JS接口列表
      });
    },
  });
  console.log(wx);
</script>
```

## multer 上传文件

>  Multer是Express官方推出的，用于Node.js `multipart/form-data`请求数据处理的中间件。 

**安装**

```shell
npm install multer --save
```

**使用方法**

```js
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // 配置上传文件的存放目录
router.post("/addhero", upload.single("heroIcon"), (req, res) => {
  // 添加提交的信息到数据库
  let sql = "insert into herose set ?";
  let values = {
    heroname: req.body.heroName,
    nickname: req.body.heroNickName,
    skill: req.body.skillName,
    img_url: req.file.filename,
  };
  db(sql, values, (err, result) => {
    console.log(err);
    if (err || result.affectedRows < 1) {
      res.json({ status: 1, message: "添加失败" });
    } else {
      res.json({ status: 0, message: "添加成功" });
    }
  });
});
```

**磁盘存储引擎 (`DiskStorage`)**

> 磁盘存储引擎可以让你控制文件的存储。

```js
import express from "express";
import multer from "multer";
import path from "path";
const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const __dirname = path.resolve();
    cb(null, path.join(__dirname, "/proxy_public", "/uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, "avatar" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });
router.post("/uploadFile", upload.single("file"), (req, res) => {
  res.json({
    status: 200,
    message: "添加成功",
    user: req.body.user,
    url: "/uploads/" + req.file.filename,
  });
});

export default router;
```

## nodejs代理服务器

**安装**

```shell
yarn add http-proxy-middleware
```

**使用**

```js
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
let app = express();
let port = 5000;
app.use(express.static("proxy_public"));
app.use(
  "/api",
  createProxyMiddleware({
    target: "https://www.bilibili.com",
    changeOrigin: true, //是否跨域
    secure: false, // 如果是https接口，需要配置这个参数
    pathRewrite: {
      "/api": "",
    },
  })
);
app.listen(port, function () {
  console.log(`Running: http://localhost:${port}`);
});

```

## 设置错误中间件(它必须放到所有的接口后面)

```js
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.json({ status: 1, message: "身份认证失败" });
  }
});
```

## Nodejs定时任务

**安装**

```shell
yarn add node-schedule
```

**使用**

```js
let timer = schedule.scheduleJob({ second: 0 }, function () {
  console.log("scheduleObjectLiteralSyntax:" + new Date());
});
```

**配置项**

```txt
dayOfWeek --> 每周第几天
month --> 月
dayOfMonth --> 每月第几天 
hour --> 时 
minute --> 分 
second --> 秒
```

**取消定时器**

```js
timer.cancel();
```

## 对微信加密数据进行解密

```js
const WXBizDataCrypt = require("./WXBizDataCrypt");
exports.decryptData = (appId, sessionKey, encryptedData, iv) => {
  return new WXBizDataCrypt(appId, sessionKey).decryptData(encryptedData, iv);
};
```

##  history模式在node中的配置方法

**安装**

```shell
npm install --save connect-history-api-fallback
```

**使用**

```js
const history = require("connect-history-api-fallback");
const express = require("express");
const app = express();
app.use(history());
```

## https服务

安装

```shell
openssl req -nodes -new -x509 -keyout server.key -out server.cert
```

启动服务

```js
var express = require('express')
var fs = require('fs')
var https = require('https')
var app = express()

app.get('/', function (req, res) {
  res.send('hello world')
})
https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)
.listen(3000, function () {
  console.log('Example app listening on port 3000! Go to https://localhost:3000/')
})
```

## nodemailer 发送电子邮件

**安装**

```shell
npm install nodemailer --save
```

封装(以新浪邮箱为例)

```js
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  // host: 'smtp.ethereal.email',
  host: "smtp.sina.cn",
  // service: "sina", // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  port: 25, // SMTP 端口
  // secureConnection: true, // 使用了 SSL
  auth: {
    user: "jiwei7065@sina.com",
    // 这里密码不是qq密码，是你设置的smtp授权码
    pass: "bd4d210******d3a",
  },
});
exports.sendEmail = (mailOptions) => {
  return new Promise((resolve, reject) => {
      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.log(error);
              return reject(error);
          }
          console.log("info", info);
          resolve();
      });
  });
};
```

调用

```js
let { sendEmail } = require("../utils/sendemail.js");
sendEmail({
    from: '"JavaScript测试" <j******5@sina.com>', // sender address
    to: "144*******8@qq.com", // list of receivers
    subject: "Hello", // Subject line
    // 发送text或者html格式
    // text: 'Hello world?', // plain text body
    html: "<b>Hello world?</b>", // html body
});
```

## 在nodejs 中使用es 模块化规范

在 `package.json` 添加 `type: "module"`

```json
{
  "name": "serve",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "license": "ISC",
}
```

js 文件中就可以直接使用es模块化规范, 如

```js
import express from "express";
import dayjs from "dayjs";
export default function() {return aaa}
```

## NodeRSA

### 安装

```shell
npm install node-rsa --save-dev
```

### 使用

**生成密钥**

```js
import NodeRSA from "node-rsa";
import fs from "fs";
import path from "path";
const key = new NodeRSA({ b: 512 });
key.setOptions({ encryptionScheme: "pkcs1" });
// 私钥
const privatePem = key.exportKey("pkcs8-private-pem");
// 公钥
const publicPem = key.exportKey("pkcs8-public-pem");
fs.writeFileSync(path.join(path.join(), 'publicPem.txt'), publicPem)
fs.writeFileSync(path.join(path.join(), 'privatePem.txt'), privatePem)
```

**加密与解密**

```js
import NodeRSA from "node-rsa";
import fs from "fs";
import path from "path";
const key = new NodeRSA({ b: 512 });
key.setOptions({ encryptionScheme: "pkcs1" });

/**
 * 加密函数
 * @param {string} data 需要加密的字符串
 * @returns {string} 加密后的结果
 */
export function encrypt(data) {
  key.importKey(fs.readFileSync(path.join(path.join(), "publicPem.txt")));
  return key.encrypt(data, "base64");
}
/**
 * 解密函数
 * @param {string} cioherText 需要解密的字符串
 * @returns {string} 解密后的结果
 */
export function decrypt(cioherText) {
  key.importKey(fs.readFileSync(path.join(path.join(), "privatePem.txt")));
  return key.decrypt(cioherText, "utf8");
}

const data = "我是加密前的数据";
const rowText = encrypt(data);
console.log("加密后是：", rowText);
console.log("解密后是：", decrypt(rowText));
```

## RES 加密

### 安装

```shell
npm install crypto-js --save-dev
```

### 使用

```js
import CryptoJS from "crypto-js";
// AES密钥以及偏移量
const key = CryptoJS.enc.Utf8.parse("0123456789abcdef"); // 密钥, AES-128 需16个字符, AES-256 需要32个字符
const iv = CryptoJS.enc.Utf8.parse("abcdef0123456789"); // 密钥偏移量，16个字符
// AES 加密
function AESencrypt(message) {
  let result;
  let src = CryptoJS.enc.Utf8.parse(message);
  result = CryptoJS.AES.encrypt(src, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  // return result.ciphertext.toString().toUpperCase();
  return result.ciphertext.toString();
};
// AES解密
function AESdecrypt(secret) {
  let encryptedHexStr = CryptoJS.enc.Hex.parse(secret);
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  let decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr;
};
const secret = AESencrypt("加密字符串aaaaAAAA----啦啦啦啦啦%%%%&&&&****");
console.log("加密结果：" + secret);
const decryptedStr = AESdecrypt(secret);
console.log("解密结果：" + decryptedStr);
```

## Nodejs 下载文件设置Content-Disposition

> 告诉浏览器返回的文件需要进行下载

```js
import express from "express";
import fs from "fs";
const router = express.Router();
router.get("/api/downLoadFile", async (req, res) => {
  // 指定一个被下载的文件名
  res.setHeader("Content-Disposition","attachment;filename=test.zip");
  const file = await fs.readFile("test.zip", "utf-8");
  res.send(file)
});
export default router;
```

## 设置cookie

```js
import express from "express";
const router = express.Router();
router.get("/api/login", async (req, res) => {
  res.cookie("user", "jay", {
    maxAge: 20000000, // cookie 有效期
    httpOnly: true, // 客户端脚本不可编辑，防止XSS攻击的产生
  });
  res.json({
    cede: 200,
    message: "登录成功"
  })
});
export default router;
```

## child_process

child_process是NodeJs的重要模块。帮助我们创建多进程任务，更好的利用了计算机的多核性能。

当然也支持线程间的通信。

### 基本使用

```js
const child_process = require("child_process");
const command = "git diff --cached --name-only --diff-filter=ACMR -- .";
let commitFile = child_process.execSync(command).toString();
console.log("commitFile", commitFile);
```

### 查看WiFi密码的神奇脚本

```js
const { execSync } = require("child_process");
// 设置命令行编码为UTF-8，以支持显示中文字符
execSync("chcp 65001");
// 获取所有Wi-Fi配置文件的名称
const profilesInfo = execSync("netsh wlan show profiles").toString();
const profileNames = profilesInfo
  .match(/All User Profile\s*:\s*(.*)/g)
  .map((s) => s.split(":")[1].trim());

// 获取每个Wi-Fi的密码并输出
for (const name of profileNames) {
  const passwordInfo = execSync(
    `netsh wlan show profile name="${name}" key=clear`
  );
  const passwordMatch = passwordInfo.toString().match(/Key Content\s*:\s*(.*)/);
  const password = passwordMatch ? passwordMatch[1].trim() : "无密码";
  console.log(`${name}: ${password}`);
}
```

## 获取命令行参数

```js
process.argv.slice(2).forEach((val, index) => {
  console.log(`参数 ${index}: ${val}`);
});
```

输入命令

```shell
node avg.js a b c
# 输出接收到的参数  参数 0: a  参数 1: b    参数 2: c
```

## 如何调试 Node.js 应用？

当启动 Node.js 应用时附加 **--inspect** 选型，Node.js 将初始化一个**调试会话**。此时，可以使用调试客户端连接至该调试会话，以便对 Node.js 应用的执行过程进行控制。

例如： 

```shell
# 正常启动
node index.js
npx nodemon index.js
# 调试启动
node --inspect index.js
npx nodemon --inspect index.js
```

接下来打开浏览器地址栏输入

```txt
chrome://inspect
```

## 解决内存溢出问题

内存溢出主要原因分析

+ nodejs在执行JavaScript时，内存受到v8限制,64位约为1.4g,32位0.7g
+ 限制内存原因：垃圾回收时，js线程会暂停执行（避免JS应用逻辑与垃圾回收器看到的不一样），大量的堆内存回收严重影响性能

通过解决increase-memory-limit的包升级版来解决

+ 安装两个npm包： increase-memory-limit-fixbug 和 cross-env

  ```shell
  npm install increase-memory-limit-fixbug cross-env -g
  ```

+ package.json中 添加如下脚本

  ```json
  "fix-memory-limit": "cross-env LIMIT=4096 increase-memory-limit"
  ```

+ 执行fix-memory-limit脚本

  ```shell
  npm run build
  ```

+ 重新运行项目即可

## 本机环境变量支持

> Node.js 23 支持直接加载 .env 文件，无需使用 dotenv 等库。

在项目的根目录创建`.env`文件

```env
DB_PORT=80
```

在nodeJs文件中这样获取

```js
const port = process.env.DB_PORT || 80;
```

运行命令

```shell
node --env-file=.env config.js
```

## 轻松应对node_modules删除难题

安装

```shell
npm install rimraf -g
```

在package.json中配置

```json
{
  "scripts": {
    "clean": "rimraf node_modules"
  }
}
```

执行命令

```shell
npm run clean
```

系统原生命令的快速删除方案

### windows CMD

```shell
rmdir /s /q node_modules
```

### windows PowerShell  （更快）：

```shell
Remove-Item -Force -Recurse node_modules
```

### Linux/macOS用户

```shell
rm -rf ./node_modules
```

## HTML5 服务器发送事件（Server-Sent Events, SSE）：实时数据传输的新篇章

>  Server-Sent Events为开发者提供了一种简便的实时数据传输方案，特别适合那些不需要双向通信的场景 

 ### 服务器端（Node.js + Express）示例 

```js
const express = require('express');
const app = express();
app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
    
  setInterval(() => {
    const currentTime = new Date().toLocaleTimeString();
    res.write(`data: ${currentTime}\n\n`);
  }, 1000);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

 ### 客户端（HTML + JavaScript）示例

```js
const eventSource = new EventSource('/stream');
eventSource.onmessage = function(event) {
  const currentTime = event.data;
  document.getElementById('time').innerText = currentTime;
};
eventSource.onerror = function(error) {
  console.error('Error occurred:', error);
};
```

## 当前目录启动一个http服务

```shell
npx serve -S .
```

