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

router.get("/api/test/:id", function(req, res) {
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
app.use("/", Test)
```

## 开放静态资源

在*app.js*中

```js
app.use(express.static("public"))
```

## 关于**jsonwebtoken**

**安装**

```shell
yarn add jsonwebtoken express-jwt -S
```

**使用**(生成token)

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
        expiresIn: "1h",
      }),
    });
  });
});
```

**配置不需要token认证的接口**

```js
const expressJWT = require("express-jwt");
app.use(expressJWT({ secret: secretKey, algorithms: ["HS256"] }).unless({ path: [/^\/api\//] }));
```

**解密**

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

## mysql

安装

```shell
cnpm install mysql
```

创建*db.js* 

```js
const mysql = require("mysql");
module.exports = (sql, params) => {
  return new Promise((resolve, reject) => {
    const conn = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      port:3306, // 端口号
      database: "heroes_manager", // 数据库名，不是表名
      timezone: "08:00", // 设置时区
    });
    // 3. 连接到mysql服务器
    conn.connect();
    // 4. 完成增删改查
    conn.query(sql, params, (err, result) => {
      // 将数据库返回的结果转为json
      results = results.map(v => Object.assign({}, v));
      resolve([err, result])
    });
    // 5. 关闭连接
    conn.end();
  })
};
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

```js
const fs = require("fs");
fs.mkdir(path[, mode], callback)
fs.mkdirSync(path[, mode])
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
import NodeRSA from "node-rsa"
const key = new NodeRSA({ b: 512 });
key.setOptions({ encryptionScheme: "pkcs1" });
// 私钥
const privatePem = key.exportKey("pkcs8-private-pem");
// 公钥
const publicPem = key.exportKey("pkcs8-public-pem");
console.log("=================私钥:===============")
console.log(privatePem)
console.log("=================公钥================")
console.log(publicPem)
const data = "我是加密前的数据";
// const encrypt = new NodeRSA(privatePem)
key.importKey(publicPem)
console.log("正在加密中...")
const cioherText = key.encrypt(data, "base64");
console.log("加密后是：", cioherText);
key.importKey(privatePem);
console.log("正在解密中...")
const rowText = key.decrypt(cioherText, "utf8");
console.log("解密后是：", rowText);
```

