##  前后端交互

### 原生ajax如何执行？

**GET 请求案例**

```js
// 1. 创建xhr对象
var xhr = new XMLHttpRequest();
//设置xhr请求的超时时间
xhr.timeout = 3000;
// 2. 调用open方法，设置请求方式和url
xhr.open('GET', 'http://www.liulongbin.top:3006/api/getbooks?id=3');
// 3. 调用send方法，发送请求
xhr.send();
// 4. 设置onreadystatechange事件，事件内部使用responseText属性接受结果
xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
        var res = this.responseText; // 是JSON格式的结果
        console.log(JSON.parse(res));
    }
}
xhr.ontimeout = function(e) { ... };
xhr.onerror = function(e) { ... };
// 接口请求成功后触发的事件 等价于readyState === 4
xhr.onLoad = function(e) {
  console.log(this.reponse);
}
```

**POST 请求案例**

```js
// 1. 创建xhr对象
var xhr = new XMLHttpRequest();
// 2. 调用open，设置请求方式和url
xhr.open('POST', 'http://www.liulongbin.top:3006/api/addbook');
// 3. 设置Content-Type属性（通过请求头来设置）
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
// 4. 调用send，发送请求
xhr.send('bookname=水浒&author=施耐庵&publisher=顺义出版社');
// 5. 注册onreadystatechange事件，事件内部使用responseText接受结果
xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
        var res = JSON.parse(xhr.responseText);
        console.log(res);
    }
}
// 上传文件进度触发事件
xhr.upload.onprogress = function(e) { ... };
// 文件上传成功时触发的事件              
xhr.upload.onLoad = function(e) {}
```

### axios 的拦截器

```js
// 请求拦截器 常用来添加token
axios.interceptors.request.use(config => {
  if(config.url.startsWith('/user') && config.url !== '/user/login'){
    config.headers.authorization = localStorage.getItem("token")
  }
  return config
})

// 响应拦截器 常用来处理错误的请求
axios.interceptors.response.use(response => {
  // 响应成功
  return response
}, error => {
  // error.config 是请求的配置项，可以用来做无感触的刷新token
  // 响应失败
  if(error.code === 401) {
    // 清楚token 重新登陆
  }
})
```

### axios 基础地址的配置

```js
// 导入axios 模块
import axios from 'axios'
let API = axios.create({
  baseURL: 'xx.com',
  withCredentials: true // 允许携带cookie
  timeout: 5000, // 请求的超时时间
})
```

### fetch()

> `fetch()`是 XMLHttpRequest 的升级版，用于在 JavaScript 脚本里面发出 HTTP 请求.
>
> [相关链接](https://www.ruanyifeng.com/blog/2020/12/fetch-tutorial.html) [MDN连接](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)

`fetch()`的功能与 XMLHttpRequest 基本相同，但有三个主要的差异。

（1）`fetch()`使用 Promise，不使用回调函数，因此大大简化了写法，写起来更简洁。

（2）`fetch()`采用模块化设计，API 分散在多个对象上（Response 对象、Request 对象、Headers 对象），更合理一些；相比之下，XMLHttpRequest 的 API 设计并不是很好，输入、输出、状态都在同一个接口管理，容易写出非常混乱的代码。

（3）`fetch()`通过数据流（Stream 对象）处理数据，可以分块读取，有利于提高网站性能表现，减少内存占用，对于请求大文件或者网速慢的场景相当有用。XMLHTTPRequest 对象不支持数据流，所有的数据必须放在缓存里，不支持分块读取，必须等待全部拿到后，再一次性吐出来

**`fetch()`第二个参数的完整 API**

```js
const response = fetch(url, {
  method: "GET",
  headers: new Headers({
    "Content-Type": "text/plain;charset=UTF-8"
  }),
  body: undefined,
  referrer: "about:client",
  referrerPolicy: "no-referrer-when-downgrade",
  mode: "cors", 
  credentials: "same-origin", // fetch默认不会带cookie，需要添加配置项： credentials: 'include'
  cache: "default",
  redirect: "follow",
  integrity: "",
  keepalive: false,
  signal: undefined
});
```

**判断请求是否成功**

```js
async function fetchText() {
  let response = await fetch('/readme.txt');
  if (response.status >= 200 && response.status < 300) {
    return await response.text();
  } else {
    throw new Error(response.statusText);
  }
}
```

另一种方法是判断`response.ok`是否为`true`

```js
if (response.ok) {
  // 请求成功
} else {
  // 请求失败
}
```

**定制 HTTP 请求**

POST 请求(application/x-www-form-urlencoded)

```js
const response = await fetch(url, {
  method: 'POST',
  headers: new Headers({
    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
  }),
  body: 'foo=bar&lorem=ipsum',
});
const json = await response.json();
```

提交 JSON 数据

```js
const user =  { name:  'John', surname:  'Smith'  };
const response = await fetch('/article/fetch/post/user', {
  method: 'POST',
  headers: new Headers({
   'Content-Type': 'application/json;charset=utf-8'
  }), 
  body: JSON.stringify(user) 
});
if(response.ok) {
    const json = await response.json();
} else {
   throw new Error('Network response was not ok.'); 
}
```

提交表单

```js
const form = document.querySelector('form');
const response = await fetch('/users', {
  method: 'POST',
  body: new FormData(form)
})
```

文件上传

```js
const input = document.querySelector('input[type="file"]');
const data = new FormData();
data.append('file', input.files[0]);
data.append('user', 'foo');
fetch('/avatars', {
  method: 'POST',
  body: data
});
```

上传二进制数据

```js
let blob = await new Promise(resolve =>   
  canvasElem.toBlob(resolve,  'image/png')
);
let response = await fetch('/article/fetch/post/image', {
  method:  'POST',
  body: blob
});
```

获取二进制文件

```js
const response = await fetch('flower.jpg');
const myBlob = await response.blob();
const objectURL = URL.createObjectURL(myBlob);
```

获取流媒体文件

```js
const response = await fetch('song.ogg');
const buffer = await response.arrayBuffer();
```
取消fetch请求

> fetch()请求发送后，如果中途想要取消，需要使用AbortController对象

```js
//创建一个AbortController实例
let controller = new AbortController();
fetch(url, {
  signal: controller.signal
});
//给controller.signal绑定监听事件，controller.signal的值改变则会触发abort事件
controller.signal.addEventListener('abort',
  () => console.log('abort!')
);
// controller.abort()方法用于发出取消信号。这时会触发abort事件，这个事件可以监听

controller.abort(); // 取消

// 可以通过controller.signal.aborted属性判断取消信号是否已经发出
console.log(controller.signal.aborted); // true
```

**底层接口**

`Response.body`是 Response 对象暴露出的底层接口，返回一个 `ReadableStream` 对象，供用户操作

例如：用来分块读取内容，显示下载的进度

```js
function chunkFileToFile(bigFile) {
  return new Blob(bigFile, {
    type: "application/octet-stream",
  });
}
fetch("http://localhost:3000/ubuntu-18.04.2-desktop-amd64.iso").then(
  async (response) => {
    // response.body.getReader()方法返回一个遍历器
    const reader = response.body.getReader();
    let process = 0;
    let chunkFile = []
    const contentLength = response.headers.get("Content-Length");
    console.log("文件的总大小: ", contentLength);
    while (true) {
      // 这个遍历器的read()方法每次返回一个对象，表示本次读取的内容块
      const { done, value } = await reader.read();
      // done属性是一个布尔值，用来判断有没有读完
      if (done) {
        break;
      }
      process += value.length;
      chunkFile.push(value);
      const bit = ((process / contentLength) * 100).toFixed(2);
      // value属性是一个 arrayBuffer 数组，表示内容块的内容，而value.length属性是当前块的大小
      console.log(`Received ${value.length} bytes`);
      console.log(`已下载 ${bit} %`);
    }
    // 最后合成的文件对象
    const blob = chunkFileToFile(chunkFile);
  }
);
```

**创建副本（clone）**

Stream 对象只能读取一次，读取完就没了,这意味着五个读取方法，只能使用一个，否则会报错。

```js
let text =  await response.text();
let json =  await response.json();  // 报错
```

Response 对象提供`Response.clone()`方法，创建Response对象的副本，实现多次读取。

```js
const response2 = response1.clone();
const myBlob1 = await response.blob();
const myBlob2 = await response1.json();
```

**fetch存在问题**

1. fetch只对网络请求报错，对400，500都当做成功的请求，服务器返回 400，500 错误码时并不会 reject，只有网络错误这些导致请求不能完成时，fetch 才会被 reject。
2. fetch默认不会带cookie，需要添加配置项： fetch(url, {credentials: 'include'})
3. fetch不支持abort，不支持超时控制，使用setTimeout及Promise.reject的实现的超时控制并不能阻止请求过程继续在后台运行，造成了流量的浪费
4. fetch没有办法原生监测请求的进度，而XHR可以

### https和http的区别主要如下：

- http是超文本传输协议，信息是明文传输，https则是具有安全性的ssl加密传输协议。
- 用的端口也不一样，http是80，https是443。
- http和https使用的是完全不同的连接方式
- http的连接很简单，是无状态的；HTTPS协议是由SSL+HTTP协议构建的可进行加密传输、身份认证的网络协议，比http协议安全。

### TCP协议的三次握手

- 客户端发送了一个带有SYN的tcp报文到服务器，表示客户端想要和服务端建立连接
- 服务端接收到客户端的请求，返回客户端报文，这个报文带有SYN和ACK标志，询问客户端是否准备好。
- 客户端再次响应服务端一个ACK，表示我已经准备好

### GET和POST的区别：

**本质上：** GET 一般只是获取服务端数据；POST 可以修改服务端数据

**安全上：** POST比GET安全

**传输数据量上：** POST没有限制，而GET有限制

### 同源策略及产生的影响

> 如果协议、域名、端口号不一致时就会非同源，就会阻止dom获取和操作，无法发送Ajax请求

**如何解决跨域**

- Jsonp（本质是js调用）
  + 返回的js脚本通常是服务端动态生成的
  + 整个脚本通常有且仅有一条语句，且是一个函数调用
  + 脚本中调用到的函数，是页面上存在的一个函数，其函数名通过get参数传递给服务端，服务端再将其回写到js脚本中。
  + 函数的参数，是服务端处理后的结果数据，以json格式直接写在脚本中。这也是jsonp得名的由来。
- cors（后台设置）
- 服务端代理（前端配置）

### Jsonp 的原理和特点是什么

- 原理
  
  - script 标签的src 属性引进来的javaScript文件不受跨域的影响
  
- 实现

  客服端定义函数，并发生jsonp 请求

  ```html
  <script>
    function sucess(data) {
      console.log("获取到的data数据")
  	}
  </script>
  <!-- 通过<script>标签，请求接口数据 -->
  <script src="https://localhost/api/jsonp?callback=success&name=zs&age=12"></script>
  ```

  服务端返回的javaScript 文件

  ```js
  sucess({name: "zs", age: 12});
  ```

- 特点
  
  - 只能发送get请求
  - 需要后台配合

### HTTP 请求流程

- 浏览器中的 HTTP 请求从发起到结束一共经历如下八个阶段：构建请求、查找缓存、准备 IP 和端口、等待 TCP 队列、建立 TCP 连接、发起 HTTP 请求、服务器处理请求、服务器返回请求和断开连接；
- 构建请求。浏览器构建请求行，构建好后，准备发起网络请求；
- 查找缓存。在真正发起请求前浏览器会查询缓存中是否有请求资源副本，有则拦截请求，返回资源副本，否则进入网络请求；
- 准备 IP 地址和端口。HTTP 网络请求需要和服务器建立 TCP 连接，而建立 TCP 连接需要准备 IP 地址和端口号，浏览器需要请求 DNS 返回域名对应的 IP，同时会缓存域名解析结果，供下次查询使用；
- 等待 TCP 队列。Chrome 机制，同一个域名同时最多只能建立 6 个 TCP 连接；
- 建立 TCP 连接。TCP 通过“三次握手”建立连接，传输数据，“四次挥手”断开连接；
- 发送 HTTP 请求。建立 TCP 连接后，浏览器就可以和服务器进行 HTTP 数据传输了，首先会向服务器发送请求行，然后以请求头形式发送一些其他信息，如果是 POST 请求还会发送请求体；
- 服务器处理请求。首先服务器会返回响应行，随后，服务器向浏览器发送响应头和响应体。通常服务器返回数据，就要关闭 TCP 连接，如果请求头或者响应头有 Connection:keep-alive TCP 保持打开状态；

### 如何跨域携带cookie？
+ 前端请求时在request对象中配置"withCredentials": true；
+ 服务端在response的header中配置"Access-Control-Allow-Origin", "http://xxx:${port}";
+ 服务端在response的header中配置"Access-Control-Allow-Credentials", "true"
