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
xhr.upload.onprogress = function(e) { ... };
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
  if (response.data.status === 400) {
    // 移除 token
    localStorage.getItem("token")
  }
  return response
})
```

### axios 基础地址的配置

```js
// 导入axios 模块
import axios from 'axios'
let API = axios.create({
  baseURL: 'xx.com'
})
```

### fetch()

> `fetch()`是 XMLHttpRequest 的升级版，用于在 JavaScript 脚本里面发出 HTTP 请求.
>
> [相关链接](https://www.ruanyifeng.com/blog/2020/12/fetch-tutorial.html)

`fetch()`的功能与 XMLHttpRequest 基本相同，但有三个主要的差异。

（1）`fetch()`使用 Promise，不使用回调函数，因此大大简化了写法，写起来更简洁。

（2）`fetch()`采用模块化设计，API 分散在多个对象上（Response 对象、Request 对象、Headers 对象），更合理一些；相比之下，XMLHttpRequest 的 API 设计并不是很好，输入、输出、状态都在同一个接口管理，容易写出非常混乱的代码。

（3）`fetch()`通过数据流（Stream 对象）处理数据，可以分块读取，有利于提高网站性能表现，减少内存占用，对于请求大文件或者网速慢的场景相当有用。XMLHTTPRequest 对象不支持数据流，所有的数据必须放在缓存里，不支持分块读取，必须等待全部拿到后，再一次性吐出来

**`fetch()`第二个参数的完整 API**

```js
const response = fetch(url, {
  method: "GET",
  headers: {
    "Content-Type": "text/plain;charset=UTF-8"
  },
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
  headers: {
    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
  },
  body: 'foo=bar&lorem=ipsum',
});
const json = await response.json();
```

提交 JSON 数据

```js
const user =  { name:  'John', surname:  'Smith'  };
const response = await fetch('/article/fetch/post/user', {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json;charset=utf-8'
  }, 
  body: JSON.stringify(user) 
});
const json = await response.json();
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
- cors（后台设置）
- 服务端代理（前端配置）

**Jsonp 的原理和特点是什么**

- 原理
  - img,script,这种标签如果有相应的src，那么便会发起一个htttp请求来请求相应的资源,如果有script标签对应的路径是一个js文件，那么在下载完毕这个js之后会马上执行
- 特点
  - 只能发送get请求
  - 需要后台配合

## H5C3

### html5调用系统拍照或者摄像

```html
<label>照相机</label>
<input type="file" id="image" accept="image/*" capture="camera" />
<br />
<label>摄像机</label>
<input type="file" id="video" accept="video/*" capture="camcorder" />
```

### **iframe的使用**

> 同源iframe可共享localStorage、sessionStorage

```html
<iframe name="fm" src="index.html" style="width: 100%; heigth: 100%"></iframe>
<!-- src 指向默认页面 -->
```

通过点击超链接

```html
<a href="home" target="fm">首页</a>
<!-- target 属性指向特定的iframe -->
```

### 超链接的一些实用属性

**download** 属性表明当前链接用于下载。而不是跳转到例另外一个URL。如果*download* 属性设置了值，表示下载的文件名。

```html
<a href="demo.html" download="demo.html">点击下载</a>
```

**邮件链接**

```html
<a href="mailto:1441036958@qq.com?subject=主题&body=邮件内容&cc=抄送&bcc=密送">联系我们</a>
```

**电话链接**

```html
<a href="tel:18834177065">联系我</a>
```

### H5新特性

- 多媒体，用于媒介回放的video和audio元素
- 图像效果，用于绘画的canvas元素，svg元素等。
- 离线&存储，对本地离线存储能够更好地支持，比如localstorage,Cookies等
- 设备兼容特性

### localStorage与sessionStorage与cookie的区别总结

+ **共同的** ：都保存在浏览器端，且同源
+ **不同点**
  + 传递的数据量不同，cookie不能超过4k，而localStorage 与 sessionStorage大小为5M
  + 传递方式不同，cookie在浏览器和服务器间来回传递（即使不需要），而localStorage 与 sessionStorage不会自动把数据发给服务器，仅在本地保存。
  + 生命周期不同:localStorage永久保存, sessionStorage当前会话, 都可手动清除，cookie只在设置的cookie过期时间之前一直有效，即使窗口或浏览器关闭。
  + 作用域不同sessionStorage不在不同的浏览器窗口中共享，即使是同一个页面；localStorage 在所有同源窗口中都是共享的；cookie也是在所有同源窗口中都是共享的。

### 前端网站常规优化方案

+ 合并、压缩、混淆html/css/js文件（webpack实现，减小资源大小）
+ Nginx开启Gzip，进一步压缩资源（减小资源大小）
+ 图片资源使用CDN加速（提高加载速度）
+ 符合条件的图标做base64处理（减小资源大小）
+ 样式表放首部，JS放尾部（JS单线程，会阻塞页面；资源加载方式）
+ 设置缓存（强缓存和协商缓存，提高加载速度）
+ link或者src添加rel属性，设置prefetch或preload可预加载资源。（加载时机）
+ 如果使用了UI组件库，采用按需加载（减小资源大小）
+ SPA项目，通过import或者require做路由按需（减小资源大小）
+ 服务端渲染SSR，加快首屏渲染，利于SEO
+ 页面使用骨架屏，提高首页加载速度（提高加载速度）
+ 使用 JPEG 2000, JPEG XR, and WebP 的图片格式来代替现有的jpeg和png，当页面图片较多时，这点作用非常明显
+ 使用图片懒加载-lazyload

## javascript

### 写Javascript的基本规范

- 不要在一行申明多个变量
- 使用  *===* 或 *！==*  来比较true/false
- switch必须带有default分支
- 函数应该返回值
- for if else 必须使用大括号
- 语句结束加分号
- 命名要有意义，使用驼峰命名法

### 本地存储

- 保存数据到本地   *localStorage.setItem(key, value)*
-  获取本地存储的数据  *localStorage.setItem(key)*
-  从本地存储中移除数据  *localStorage.removeItem(key)*

### Js 数据类型如何判断

+ typeof 可以用此来判断`number`, `string`, `object`, `boolean`, `function`, `undefined` ，但是对于对象、数组、`null` 返回的值是 `object`
+ `instanceof`运算符用于检测构造函数的 `prototype`属性是否出现在某个实例对象的原型链上,返回值为布尔值，用于指示一个变量是否属于某个对象的实例。

### instanceof底层是如何工作的

```js
function instance_of(L, R) {//L 表示左表达式，R 表示右表达式 
    var O = R.prototype;   // 取 R 的显示原型 
    L = L.__proto__;  // 取 L 的隐式原型
    while (true) {    
        if (L === null) {
            return false;
        }
        if (O === L){
            // 当 O 显式原型 严格等于  L隐式原型 时，返回true
            return true;
        }         
        L = L.__proto__;  
    }
}
```

**调用方式**

```js
// per instanceof Person
instance_of(per, Person)
```

### input 事件和change 事件的区别

input输入框的onchange事件，要在 input 失去焦点的时候才会触发；

在输入框内容变化的时候不会触发change，当鼠标在其他地方点一下才会触发；

onchange 事件也可用于单选框与复选框改变后触发的事件。

### 简单数据类型和复杂数据类型的存储方式？

- 简单数据类型存放到栈 Number、String、布尔类型(boolean)、null  、Symbol
- 复杂数据类型存放到堆 Object function Set Map

- 栈和堆的区别

    - 栈：由编译器自动分配释放，存放函数的参数值，局部变量等
    - 堆：一般由程序员分配释放，若程序员不释放，程序结束可能由操作系统释放

### JavaScript的作用域链

当需要从局部函数查找某一属性或方法时，如果当前作用域没有找到，就会上溯到上层作用域查找，直至全局作用域，这种组织形式就是作用域链

### 如何获取Dom元素？

- *document.getElementById(‘id’)*  通过id获取元素
- *document.querySelect()*  通过选择器获取元素
- *document.querrySelectAll()*  通过选择器获取一类元素，得到伪数组

### new 操作符具体干了什么

- 创建一个空对象，并且this 变量引用该对象，同时继承了该函数的原型
- 属性和方法被加入到this应用的对象中
- 新创建的对象由this所应用，并且最后隐式返回this

### **this 指向问题**

- 在普通函数中，this指向 *window*
- 在事件处理程序中，this 指向  *事件源*
- 在构造函数中，this 指向 创建的对象
- 在对象的方法中，this 指向当前方法所属的对象

### **关于原型链**

每一个函数都拥有一个prototype属性，每一个函数的实例对象都有一个`__proto__` 属性，而这个属性指向了函数的prototype，当我们访问实例对象的属性或方法时回先从自身的构造函数中查找，如果没有找到就会去`__proto__` 中查找，这个查找过程就是原型链

### **原生javascript的dom操作**

**获取dom元素**

```js
var box = document.querySelector(".box")
```

**添加类名**

```js
box.classList.add("one")
```

**删除类名**

```js
box.classList.remove("one")
```

**设置属性**

```js
box.setAttribute("title", "哎呀，不错呀！！")
```

**获取属性**

```js
var title = box.getAttribute("title")
console.log("得到的标题是：", title)
```

**创建dom元素**

```js
var li = document.createElement("li")
```

**给 *li* 元素添加内容**

```js
li.innerHTML = "我是li的内容"
```

**将 *li* 元素追加到box**

```js
box.appendChild(li)
```

**将box里面的li元素删除掉**

```js
box.removeChild(li)
```

**操作style样式**

```js
box.style.backgroundColor = "red"
```

### 原生javascript的事件委托注册

> 事件委托的原理是事件冒泡，常用于为页面中相同的元素注册事件

在页面

```html
<ul>
    <li>132</li>
    <li>456</li>
    <li>456</li>
    <li>sahxj</li>
    <li>sahxjsxh</li>
</ul>
```

在js中

```js
document.querySelector("ul").addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        console.log("事件源", e.target); // 用于指向事件源
        console.log("事件源的父元素", e.target.parentNode); // 得到的结果是伪元素
        console.log("事件源的子元素", e.target.childNodes); // 得到的结果是伪元素
    }
});
```

### 设置 element 的滚动条位置

```js
element.scrollTop = 0; // 设置 element 的滚动条位置居首
element.scrollTop = element.scrollHeight; // 设置 element 的滚动条位置始终居底
```

### 0.1 + 0.2 === 0.3 嘛？为什么

在两数相加时，会先转换成二进制，0.1 和 0.2 转换成二进制的时候尾数会发生无限循环，然后进行对阶运算，JS 引擎对二进制进行截断，所以造成精度丢失。

> **总结：**精度丢失可能出现在进制转换和对阶运算中

### 实现函数能够深度克隆基本类型

> 递归的方法实现

```js
function deepCopy(obj) {
  if (typeof obj === 'object') {
    let result = obj.constructor === Array ? [] : {};
    for (let i in obj) {
      result[i] = typeof obj[i] === 'object' ? deepCopy(obj[i]) : obj[i];
    }
  } else {
    let result = obj;
  }
  return result;
}
```

**深度克隆的其他方法：** JSON.stringify转为字符串再JSON.parse

### 原生js实现拍照

在html中

```html
<video id="video" width="480" height="320" controls></video>
<div>
    <button id="capture">拍照</button>
</div>
<canvas id="canvas" width="480" height="320"></canvas>
```

在js中定义方法

```js
//访问用户媒体设备的兼容方法
function getUserMedia(constraints, success, error) {
    if (navigator.mediaDevices.getUserMedia) {
        //最新的标准API
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(success)
            .catch(error);
    } else if (navigator.webkitGetUserMedia) {
        //webkit核心浏览器
        navigator.webkitGetUserMedia(constraints, success, error);
    } else if (navigator.mozGetUserMedia) {
        //firfox浏览器
        navigator.mozGetUserMedia(constraints, success, error);
    } else if (navigator.getUserMedia) {
        //旧版API
        navigator.getUserMedia(constraints, success, error);
    }
}
function success(stream) {
    //兼容webkit核心浏览器
    let CompatibleURL = window.URL || window.webkitURL;
    //将视频流设置为video元素的源
    console.log(stream);
    //video.src = CompatibleURL.createObjectURL(stream);
    video.srcObject = stream;
    video.play();
}
function error(error) {
    console.log(`访问用户媒体设备失败${error.name}, ${error.message}`);
}
```

调用

```js
let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
if (
    navigator.mediaDevices.getUserMedia ||
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia
) {
    //调用用户媒体设备, 访问摄像头
    getUserMedia({ video: { width: 480, height: 320 } }, success, error);
    // 调用移动端后摄像头
    getUserMedia(
        { audio: true, video: { facingMode: { exact: "environment" } } },
        success,
        error
    );
} else {
    alert("不支持访问用户媒体");
}

document.getElementById("capture").addEventListener("click", function () {
    context.drawImage(video, 0, 0, 480, 320);
    let imgBase64 = canvas.toDataURL("image/jpeg", 0.7);
});
```

### **创建对象的方式**

字面量的方式 

```js
var obj = {}
```

*new Object()*  的方式创建对象

```js
var obj = new Obect()
```

自定义构造函数创建对象

```js
function  CreateHero ( name, age, height ) {
    this.name = name;
    this.age = age;
    this.height = height;
 }
```

工厂的方式创建对象

```js
function  create ( name, age, height ) {
   var  Ob = new Object()
   Ob.name = name;
   Ob.age = age;
   Ob.height = height;
   Ob.eat = function () {}
   return Ob;
}
```

### 获取URL参数的对象

```js
export function getURLParameters(url) {
    const str = url.match(/([^?=&]+)(=([^&]*))/g) || []
    return str.reduce((a, v) => ((a[decodeURIComponent(v.slice(0, v.indexOf('=')))] = decodeURIComponent(v.slice(v.indexOf('=') + 1))), a), {})
}
```

### URL的编码与解码

- 编码使用encodeURI()函数---> 解码使用decodeURI()函数
- 编码使用encodeURIComponent()函数 ---> 解码使用decodeURIComponent()函数

### 原生js实现给图片加水印

**步骤一** 在html中

```html
<!-- 此div是用来输出结果的 -->
<div id="container"></div>
<button id="btn">点击</button>
```

**步骤二** 创建三个方法

```js
// 本地读取图像文件渲染到img标签
function blobToImg (blob) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.addEventListener('load', () => {
            let img = new Image()
            img.src = reader.result
            img.addEventListener('load', () => resolve(img))
        })
        reader.readAsDataURL(blob)
    })
}
// 将img标签内容绘制到canvas画布
function imgToCanvas (img) {
    let canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    let ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    return canvas
}
// canvas画布上绘制水印并转换为Blob对象
function watermark (canvas, text) {
    return new Promise((resolve, reject) => {
        let ctx = canvas.getContext('2d')
        // 设置填充字号和字体，样式
        ctx.font = "24px 宋体"
        ctx.fillStyle = "#FFC82C"
        // 设置右对齐
        ctx.textAlign = 'right'
        // 在指定位置绘制文字，这里指定距离右下角20坐标的地方
        ctx.fillText(text, canvas.width - 20, canvas.height - 20)
        canvas.toBlob(blob => resolve(blob))
    })
}
```

 **步骤三**图片添加水印

```js
function imgWatermark (dom, text) {
    let input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.onchange = async () => {
        let img = await blobToImg(input.files[0])
        let canvas = imgToCanvas(img)
        let blob = await watermark(canvas, text)
        // 此处将Blob读取到img标签，并在dom内渲染出来；如果是上传文件，可以将blob添加到FormData中
        let newImage = await blobToImg(blob)
        dom.appendChild(newImage)
    }
    input.click()
}
```

**步骤四** 调用

```js
let dom = document.querySelector('#container')
let btn = document.querySelector('#btn')
btn.addEventListener("click", function () {
    imgWatermark(dom, '水印文字')
})
```

### 原生js实现图片转base64

html中写文件组件及按钮

```html
<input type="file" multiple  id="file" />
<button id="btn">点击获取base64</button>
```

在js中实现

```js
document.querySelector("#btn").addEventListener("click", function (e) {
    let url = window.URL.createObjectURL(document.querySelector("#file").files[0]);
    let imgobj = new Image();
    imgobj.src = url;
    let imgBaseStr=undefined;
    imgobj.onload = function () {
        imgBaseStr = getBase64Image(this)
        console.log('base64 数据', imgBaseStr)
    }
})
function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
  	//将图片绘制到canvas中
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
  	//转换图片为dataURL
    var dataURL = canvas.toDataURL("image/" + ext);
    return dataURL;
}
```
### 关于reduce函数的介绍
+ reduce函数有两个参数
  + 累加器函数
  + 初始值
+ 累加器函数的参数说明
  + 第一个参数表示reduce函数的初始值或者上一次回调的返回值
  + 第二个参数表示当前要处理的值
  + 第三个参数表示当前元素在数组中的索引
  + 第四个参数表示调用reduce函数的数组本身
+ 初始值非必传函数

**使用例子**
```js
// reduce累加
let arr = [1, 2, 3, 4];
arr.reduce((pre, cru, index, arr) => {
  return pre + cru;
}, 0)
// result: 10

// 获取arr的最大值
arr.reduce((pre, cru, index, arr) => {
  return Math.max(pre, cru);
})
// result: 4
```

### 原生js实现base64转blob对象

**创建方法**

```js
function convertBase64UrlToImgFile(urlData,fileName,fileType) {
    var bytes = window.atob(urlData);
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Int8Array(ab);
    var i;
    for (i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    var blob=new Blob([ab], {type:fileType});
    blob.lastModifiedDate = new Date();
    blob.name = fileName;
    return blob;
}
```

**调用方法**

```js
const base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA..."
// 随机文件名
const fileName = (new Date()).getTime()+".jpeg";
let imageURI = base64.split(",")[1]
// 调用方法获取文件对象
const imgfile = convertBase64UrlToImgFile(imageURI,fileName,'image/jpeg');
```

### 二维码相关

**二维码的生成方法**

```html
<!-- 引入JQuery -->
<script type="text/javascript" src="http://static.runoob.com/assets/jquery/2.0.3/jquery.min.js"></script>

<!-- 引入qrcodjs库 -->
<script type="text/javascript" src="http://static.runoob.com/assets/qrcode/qrcode.min.js"></script>

<!-- 使用 -->
<input id="text" type="text" value="http://www.runoob.com" style="width:80%" /><br />
<div id="qrcode" style="width:100px; height:100px; margin-top:15px;"></div>

<script type="text/javascript">
var qrcode = new QRCode(document.getElementById("qrcode"), {
	width : 100,
	height : 100,
	colorDark : "#000000",
	colorLight : "#ffffff",
	correctLevel : QRCode.CorrectLevel.H
});

function makeCode () {		
	var elText = document.getElementById("text");
	
	if (!elText.value) {
		alert("Input a text");
		elText.focus();
		return;
	}
	
	qrcode.makeCode(elText.value);
}

makeCode();
let text = document.querySelector("#text");
text.addEventListener("blur", function () {
  makeCode()
})
text.addEventListener("keydown", function (e) {
  if (e.keyCode == 13) {
    makeCode()
  }
})
</script>
```

**二维码的解析**

```html
<!-- 引入jsQr库 -->
<script src="https://cozmo.github.io/jsQR/jsQR.js"></script>
<script>
  let canvas = document.createElement("canvas");
  canvas.setAttribute("id", "qrcanvas");
  document.querySelector("body").append(canvas);
  document.querySelector("#pictureChange").addEventListener("change", function (e) {
    let file = e.target.files[0];
    if (window.FileReader) {
      let fr = new FileReader()
      fr.readAsDataURL(file);
      fr.onloadend = function (ev) {
        let base64Data = ev.target.result;
        base64ToqR(base64Data)
      }
    }
  })
  function base64ToqR(data) {
    var c = document.getElementById("qrcanvas");
    var ctx = c.getContext("2d");
    var img = new Image();
    img.src = data;
    img.onload = function () {
      let qrcanvas = document.querySelector("#qrcanvas");
      qrcanvas.setAttribute("width", img.width);
      qrcanvas.setAttribute("height", img.height);
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var imageData = ctx.getImageData(0, 0, img.width, img.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });
      if (code) {
        showCode(code.data)
      } else {
        alert("识别错误")
      }
    };
  }
  function showCode(code) {
    let alink = document.createElement("a");
    alink.setAttribute("href", code);
    alink.click()
  }
</script>
```

### 数组转树形数组的方法

**定义方法**

```js
function totree(list, parId) {
  let obj = {};
  let result = [];
  list.map(el => {
    obj[el.id] = el;
  })
  for (let i = 0, len = list.length; i < len; i++) {
    let id = list[i].parentId;
    if (id == parId) {
      result.push(list[i]);
      continue;
    }
    if (obj[id].children) {
      obj[id].children.push(list[i]);
    } else {
      obj[id].children = [list[i]];
    }
  }
  return result;
}
```

**调用方法**

```js
let arr = [
  { id: 2, name: '部门B', parentId: 0 },
  { id: 3, name: '部门C', parentId: 1 },
  { id: 1, name: '部门A', parentId: 2 },
  { id: 4, name: '部门D', parentId: 1 },
  { id: 5, name: '部门E', parentId: 2 },
  { id: 6, name: '部门F', parentId: 3 },
  { id: 7, name: '部门G', parentId: 2 },
  { id: 8, name: '部门H', parentId: 4 }
];
let res1 = totree(arr, 0)
```

### 数组的常用方法

- *join(separator)* 将数组的元素组起一个字符串
- *push()* 追加数组元素，将其放在数组的最后一个位置，并增加数组的长度
- *pop()* 数组末尾移除最后一项，减少数组的 length 值，然后返回移除的项。
- *shift()* 删除原数组第一项，并返回删除元素的值；如果数组为空则返回undefined 。
- *unshift()* 将参数添加到原数组开头，并返回数组的长度 。
- *splice(index, length)* 删除数组中的元素，参数一：删除的开始位置，参数二：删除数组元素的条目数
- *forEach()* 对数组进行遍历循环，对数组中的每一项运行给定函数。这个方法没有返回值。参数都是function类型，默认有传参，参数分别为：遍历的数组内容；第对应的数组索引，数组本身。
- *map()* 循环遍历数组 参数是一个函数，该函数的第一个参数是item表示遍历项目，第二个参数是遍历项的索引,第三个参数循环项本身

### javascript中Object常用方法使用总结

- Object构造函数继承

    只有构造函数才有prototype属性

    js每个对象都有一个__proto__属性 === 构造函数的prototype属性

    ```js
    function conObj () {}
    conObj.prototype.age = '12'
    let newPreObj = new conObj()
    console.log(newPreObj.age) // 12
    console.log(newPreObj.__proto__ === conObj.prototype) // true
    ```

- Object.assgin()

    用于将一个或者多个对象的可枚举的值从源对象复制到目标对象。返回目标对象

    ```js
    let target = {name: 'xiaomin'};
    let source = {age: '14',name:'hua'};
    const finalObj = Object.assign(target, source)
    console.log(target, finalObj) // {name: 'hua', age: '14'}
    ```

- Object.defineProperty()

    用于直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象

- Object.keys()、Object.values()

    Object.keys()返回一个指定对象可枚举属性的属性名组成的数组

     Object.values()返回一个指定对象可枚举属性的属性值组成的数组

    ```js
    let myObj = {name:'xioamin', age:'12'};
    console.log(Object.keys(myObj)); // ["name", "age"]
    console.log(Object.values(myObj)); // ["xiaomin", "12"]
    ```

### 获取文件对象的blob

```js
const blob = window.URL.createObjectURL(this.$refs.file.files[0])
// this.$refs.file.files[0] 为文件的文件对象
```

js原生用法

```js
// 获取表单对象
var form = document.querySelector(".form")
// 为表单对象设置提交事件
form.addEventListener("submit", (e) => {
    // 阻止表单默认提交行为
    e.preventDefault()
    // 获取文件对象
    var file = document.querySelector(".file").files[0]
    // 获取blob数据
    var blob = window.URL.createObjectURL(file)
    // 创建formdata对象
    var fd = new FormData()
    // 追加提交属性
    fd.append("file", blob)
    // 查看formdata对象
    console.log(fd.get('file'))
}
```

### 字符串常用的方法

- *split()* 用于将字符串按照某个分隔符分隔，得到一个数组

    ```js
    var myStr = "I,Love,You,Do,you,love,me"
    var substrArray = myStr.split(",")    // ["I", "Love", "You", "Do", "you", "love", "me"];
    ```

- *str.length()* 用于计算字符串长度

- *indexOf()* 用于查找某个字符在字符串中的位置

- 常用的转换为大写或者小写字符串函数，如下：

    ```js
    var myStr = "I,love,you,Do,you,love,me"
    var lowCaseStr = myStr.toLowerCase()
    //"i,love,you,do,you,love,me"
    var upCaseStr = myStr.toUpperCase()
    //"I,LOVE,YOU,DO,YOU,LOVE,ME"
    ```

- *字符串切割和提取*

    有三种可以从字符串中抽取和切割的方法，如：

    第一种，使用slice():

    ```js
    var myStr = "I,love,you,Do,you,love,me"
    var subStr = myStr.slice(1,5)	//",lov"
    ```

    第二种，使用substring():

    ```js
    var myStr = "I,love,you,Do,you,love,me"
    var subStr = myStr.substring(1,5)	 //",lov"
    ```

    第三种，使用substr():

    ```js
    var myStr = "I,love,you,Do,you,love,me"
    var subStr = myStr.substr(1,5)	 //",love"
    ```

    与第一种和第二种不同的是，substr()第二个参数代表截取的字符串最大长度，如上结果所示

- *replace()* 用于字符串的替换

    ```js
    var myStr = "I,love,you,Do,you,love,me"
    var replacedStr = myStr.replace(/love/g,"hate")
    ```

- *charAt(8)* 查找给定位置的字符或其字符编码值

  ```js
  var myStr = "I,love,you,Do,you,love,me"
  var theChar = myStr.charAt(8)		// "o",同样从0开始
  ```

### 事件的组成以及执行是什么？

- 事件的组成：事件源、事件类型、事件处理函数
- 在js中绑定的事件默认执行时间是在冒泡阶段执行，而非在捕获阶段

### 如何阻止事件的冒泡？如何阻止时间的默认行为？

- 阻止事件冒泡 *event.stopPropagation()*
- 阻止默认行为 *event.preventDefault()*

### 事件委托的原理是什么？

- 事件冒泡
- 当事件冒泡到上级元素时会被上级监听并捕获，可以通过e.target找到事件源

### JQuery的两大特点是什么

- 链式编程
- 隐式迭代

### 继承方式有以下几种

- 原型继承
- 构造继承
- 实例继承
- call/apply继承（组合继承）
- ES6 使用class extends 继承

### 获取一段范围内的随机数

```js
function GetRandomNum(Min,Max) {   
    var Range = Max - Min;   
    var Rand = Math.random();   
    return(Min + Math.round(Rand * Range));   
}   
var num = GetRandomNum(1,10); 
```

### 获取随机字符串

```js
var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

function generateMixed(n) {
     var res = "";
     for(var i = 0; i < n ; i ++) {
         var id = Math.ceil(Math.random()*(chars.length -1));
         res += chars[id];
     }
     return res;
}
```

### Bind、Call() 和apply的区别

- apply()方法 接收两个参数，一个是函数运行的作用域（this），另一个是参数数组。
- call()方法 第一个参数和apply()方法的一样，但是传递给函数的参数必须列举出来
- Bind()和call很相似，第一个参数是this的指向，从第二个参数开始是接收的参数列表，不会立即执行

### 闭包的优点和缺点是什么 

- 在本质上，闭包是将函数内部和函数外部连接起来的桥梁。

- 形成闭包的必要条件：

  - 两个函数形成嵌套关系
  -  内部函数访问外部函数的变量
  - 内部函数作为返回值返回 

  ```js
  function warp () {
      let num = 1
      return function () {
          console.log(num)
      }
  }
  const p = warp()
  p()
  ```
  
-  优点
  
    - 外部函数能访问到内部变量
  - 延长变量的生命周期（函数内部的变量是局部变量垃圾回收机制不能自动清除，所以会延长生命周期）
  
- 缺点
  
    - 会形成数据的缓存，用完之后需要手动清空（给该变量赋一个空值null）

### 防抖与节流

**防抖**

```js
var timer = null
function debounce(){
    if(timer) clearTimeout(timer);
    timer = setTimeout(()=>{
        ...
        timer = false
    },100)
}
debounce()
```

**节流**

```js
let canRun = true;
document.getElementById("throttle").onscroll = function(){
  if(!canRun){
    // 判断是否已空闲，如果在执行中，则直接return
    return;
  }
  canRun = false;
  setTimeout(function(){
    console.log("函数节流");
    canRun = true;
  }, 1000);
}
```

**防抖与节流的异同**

防抖与节流都是希望在同一时间内，不要重复触发请求。

防抖主要是在规定的时间内只触发一次，如果再次调用，事件重新计算

节流是要是在规定的时间内只触发一次

### 数组扁平化的方式

**方法一：**

```js
const arr = [1,[2,[3,[4,5]]],6]
//  方法一：数组自带的扁平化方法,flat的参数代表的是需要展开几层，如果是Infinity的话，就是不过嵌套几层，全部都展开
console.log(arr.flat(Infinity))
```

**方法二**

```js
const newArr = (arr)=>{
     return arr.reduce((pre,cur)=>{
          return pre.concat(Array.isArray(cur) ? newArr(cur) : cur)
     },[])
}
console.log(newArr(arr),"reduce方法")
```

### 分析 JS 与 CSS 是否阻塞 DOM 的渲染和解析

- `CSS`不会阻塞`DOM`解析，但是会阻塞`DOM`渲染，严谨一点则是`CSS`会阻塞`render tree`的生成，进而会阻塞`DOM`的渲染
- `JS`会阻塞`DOM`解析
- `CSS`会阻塞`JS`的执行
- 浏览器遇到`<script>`标签且没有`defer`或`async`属性时会触发页面渲染
- `Body`内部的外链`CSS`较为特殊，请慎用

## JQuery

### jQuery获取元素的兄弟节点的几种方法

```js
$('#id').siblings()   // 当前元素所有的兄弟节点
$('#id').prev()       // 当前元素前一个兄弟节点
$('#id').prevaAll()   // 当前元素之前所有的兄弟节点
$('#id').next()       // 当前元素之后第一个兄弟节点
$('#id').nextAll()    // 当前元素之后所有的兄弟节点
```

### width方法与height方法

```js
// 带参数表示设置高度
$('img').height(200);
// 不带参数获取高度
$('img').height();
```

### jQuery操作属性

**attr操作**

```js
// 设置单个属性
$('img').attr('alt','哎哟，不错哦');
// 同时设置多个属性
$('img').attr({
    title:'哎哟，不错哦',
    alt:'哎哟，不错哦',
    style:'opacity:.5'
});
```

**prop操作**

```js
// 在jQuery1.6之后，对于checked、selected、disabled这类boolean类型的属性来说，不能用attr方法，只能用prop方法。
// 设置属性
$(':checked').prop('checked',true);
// 获取属性
$(':checked').prop('checked');// 返回true或者false
```

### jQuery操作样式

**CSS操作**

```js
// 获取单个样式
$('#one').css('background','gray'); // 将背景色修改为灰色
// 获取多个样式
$('#one').css({
    'background':'gray',
    'width':'400px',
    'height':'200px'
});
```

**class操作**

```js
// 添加样式类
$('div').addClass('one');
// 移除样式类
$('div').removeClass('one');
// 判断是否有某个样式类
$('div').hasClass('one');
// 切换样式类
$('div').toggleClass('one');
```

### jQuery的节点操作

**append()**  父元素将子元素追加到末尾

```js
$("#father").append($('.son'))  // 将son添加到father元素内部，并且在末尾
```

**prepend()**  父元素将子元素追加到开头

```js
$("#father").prepend($('.son'))  // 将son添加到father元素内部，并且在开头
```

**appendTo()**   将子元素添加到父元素的末尾

```js
$(".son").appendTo($(".father"))  // 将son添加到father内部，并且在末尾
```

**prependTo()**  将子元素添加到父元素的开头

```js
$(".son").prependTo($(".father"))  // 将son添加到father内部，并且在开头
```

**remove()**  移除元素

```js
$(".one").remove()    // 将对象删除掉
```

**empty()**  清空元素的所有后代元素。

```js
$(".one").empty()    // 将对象的后代元素全部清空，但是保留当前对象以及其属性节点
```

### jQuery筛选选择器(方法)

| 名称               | 用法                        | 描述                             |
| ------------------ | --------------------------- | :------------------------------- |
| children(selector) | $('ul').children('li')      | 相当于$('ul>li')，子类选择器     |
| find(selector)     | $('ul').find('li');         | 相当于$('ul li'),后代选择器      |
| siblings(selector) | $('#first').siblings('li'); | 查找兄弟节点，不包括自己本身。   |
| parent()           | $('#first').parent();       | 查找父亲                         |
| eq(index)          | $('li').eq(2);              | 相当于$('li:eq(2)'),index从0开始 |
| next()             | $('li').next()              | 找下一个兄弟                     |
| prev()             | $('li').prev()              | 找上一次兄弟                     |

如何快速收集form表单数据

```js
使用$(form表单).serialize()快速收集表单信息。
注意：
- 在使用serialize()收集表单数据时，必须为每个表单元素添加name属性，并且属性值一定要和接口中定义的参数名称相同。
- 通过serialize()获取到的数据是查询字符串的格式，不能用来提交文件。
```

### 关于正则表达式

| 代码 | 说明                                       |
| :--- | :----------------------------------------- |
| .    | 匹配除换行符以外的任意字符                 |
| \w   | 匹配字母或数字或下划线                     |
| \s   | 匹配任意的空白符                           |
| \d   | 匹配数字                                   |
| \b   | 匹配单词的开始或结束                       |
| ^    | 匹配行的开始                               |
| $    | 匹配行的结束                               |
| \W   | 匹配任意不是数字、字母或者下划线的汉字字符 |
| \S   | 匹配任意不是空白的字符                     |
| \D   | 匹配任意非数字的字符                       |
| \B   | 匹配不是单词的开头或结尾的字符             |

**常用重复限定符**

| 代码   | 说明              |
| ------ | ----------------- |
| *      | 重复零次或更多次  |
| +      | 重复一次或更多次  |
| ？     | 重复零次或一次    |
| {n}    | 重复n次           |
| {n,}   | 重复n次或者更多次 |
| {n, m} | 重复n到m次        |

### 正则表达式分组

> 通俗来说，分组就是在正则表达式中用（）包起来的内容代表了一个分组

**案例一**

```js
var reg = /(\d{4})-(\d{2})-(\d{2})/;
var dateStr = '2018-04-18';
reg.test(dateStr);  //true
RegExp.$1   //2018
RegExp.$2   //04
RegExp.$3   //18
```

**案例二**

```js
var dateStr = '2018/04/18';
var reg = /(\d{4})\/(\d{2})\/(\d{2})/;
dateStr = dateStr.replace(reg, '$1-$2-$3')  // "2018-04-18"
```



