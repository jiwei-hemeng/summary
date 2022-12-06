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

### hash模式与history模式

**hash模式**

> hsah 模式是一种把前端路由的路径用`#`拼接在真实的URL后面的模式。当`#`号后面的路径变化时，浏览器并不会重新发起请求，而是会触发`hashchange`事件。

```html
<a href="#/a"></a>
<a href="#/b"></a>
<div id="app"></div>
<script>
  function render() {
    const app = document.querySelector("#app");
    app.innerHTML = window.location.hash;
  }
  window.addEventListener("hashchange", render);
</script>
```

**history模式**

> history API 是h5 提供的新特性，允许开发者直接更改前端路由，即`更改前端路由而不重新发起网络请求`

```html
<a href="javascript: toA();">A页面</a>
<a href="javascript: toB();">B页面</a>
<div id="app"></div>
<script>
  function render() {
    console.log("render");
    app.innerHTML = window.location.pathname;
  }
  function ToA() {
    history.pushState({}, null, "/a");
    render();
  }
  function ToB() {
    history.pushState({}, null, "/b");
    render();
  }
  window.addEventListener("popState", render)
</script>
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

## 使用标签元素触发隐藏文件输入元素

> [MDN](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications)

```html
<input type="file" id="fileElem" multiple accept="image/*" class="visually-hidden">
<label for="fileElem">Select some files</label>
```

```css
.visually-hidden {
  position: absolute !important;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
}
input.visually-hidden:focus + label {
  outline: thin dotted;
}
input.visually-hidden:focus-within + label {
  outline: thin dotted;
}
```

> clip: rect(1px, 1px, 1px, 1px); 将编译成 left:1px;  rigth: 1px; top: 1px; bottom:1px;

### H5新特性

- 多媒体，用于媒介回放的video和audio元素
- 图像效果，用于绘画的canvas元素，svg元素等。
- 离线&存储，对本地离线存储能够更好地支持，比如localstorage,Cookies等
- 设备兼容特性
- 语义化标签（nav、header、footer、aside）
- 表单标签（Email、tel、password、color）
- 地理位置

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

### 浏览器渲染过程是怎么样的

+ 构建DOM树

  DOM树是HTML文档在浏览器中的对象表示。浏览器只有一个主线程负责解析HTML，如果遇到`<script>`, 那么浏览器主线程暂停解析HTML，然后开始加载javaScript文件并执行里面的代码，只有js代码执行完之后才会继续解析。对于图片和css文件、或者设置了defer或asynch 的js文件，他们不会影响主线程，而是异步加载。

  另外，浏览器有一个预扫描（Pre Scanner）线程，它会扫描html代码，提前把css文件、字体以及js文件下载下来，加速文件的下载，并且不会影响主线程。

+ 构建CSSOM树

  CSSOM是css在浏览器中的对象表示，也是树状结构

+ 合并DOM和CSSDOM

  浏览器会从DOM的根节点，合并CSSOM中的样式到每个节点，形成一颗渲染树（Render Tree）

+ 布局

  生成渲染树之后，浏览器会根据样式，计算每个（没有设置display: none ）的宽高和位置等，对所有节点进行布局规划。

  对于像图片这样的节点，如果没有指定宽高，那么浏览器会先忽略它的大小，在图片加载完成之后，浏览器根据图片的宽高和位置，再次计算受影响的节点的宽高和位置，这个过程叫**回流**。

+ 绘制

  在完成第一次布局以后，浏览器会把真正的节点和节点样式（例如背景、阴影、边框等）绘制到屏幕上，这个过程必须十分快速，否则会影响动画和交互的性能。如果之前的布局发生了回流，浏览器还会发生**重绘**，把变化的布局重新绘制到屏幕上。
  
+ 合并

  这一步将绘制过程的分层合并，确保它们以正确的顺序绘制到屏幕上。

### 分析 JS 与 CSS 是否阻塞 DOM 的渲染和解析

- `CSS`不会阻塞`DOM`解析，但是会阻塞`DOM`渲染，严谨一点则是`CSS`会阻塞`render tree`的生成，进而会阻塞`DOM`的渲染
- `JS`会阻塞`DOM`解析
- `CSS`会阻塞`JS`的执行
- 浏览器遇到`<script>`标签且没有`defer`或`async`属性时会触发页面渲染
- `Body`内部的外链`CSS`较为特殊，请慎用

### Js 数据类型如何判断

+ typeof 可以用此来判断`number`, `string`, `object`, `boolean`, `function`, `undefined` ，但是对于对象、数组、`null` 返回的值是 `object`
+ `instanceof`运算符用于检测构造函数的 `prototype`属性是否出现在某个实例对象的原型链上,返回值为布尔值，用于指示一个变量是否属于某个对象的实例。

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

### this 指向问题

- 在普通函数中，this指向 *window*
- 在事件处理程序中，this 指向  *事件源*
- 在构造函数中，this 指向 创建的对象
- 在对象的方法中，this 指向当前方法所属的对象

### **关于原型链**

当查找一个对象的某个属性时，会先从它自身的属性上查找，如果找不到的话会从它的_proto_属性上查找，就是这个构造函数的prototype属性，如果还没找到就会一直往上层查找，直到到null还没有找到，则返回`undefined`，像这样一层一层去查找形成一个链式的称为原型链

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
// 页面滚动
document.body.scrollTop = 0;
document.documentElement.scrollTop = 0;
```

### Event Loop(事件循环)

> Javascript 是**单线程**，同一时间只能做一件事，原因是作为脚本语言，Javascript 是可以直接操作 DOM，而如果同时有两个线程操作 DOM，浏览器不知道如何进行处理，为了避免复杂性，Javascript 从诞生以来就一直都是单线程。为了充分利用 CPU，Javascript 将任务分为两种：一种是**同步任务**（synchronous）和**异步任务**（asynchronous），其中异步任务又分为两种：**(宏队列)macrotask**和 **(微队列)microtask** 。
>
> 因为 Javascript 单线程的特性，实际上很多需要耗时的任务，Javascript 都会把异步任务都放到`queue` 中，在主线程的事情做完后，会定期的轮询`queue` ，把里面的结果拿出来，这样循环往复的过程就构成了`Event Loop` 。比如：点击了一个元素，不会立刻的执行，但是等到js加载完毕后就会执行刚才点击的操作，能够知道有一个队列记录了所有有待执行的操作，这个队列分为微观和宏观。微观会比宏观执行得更快。

```js
// js 是单线程的，同一时间只能处理一段程序
function Add() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("promise 10");
            resolve({ add: 123 });
        });
        console.log("Promise start");
    });
}
console.log("start");
Add().then((result) => {
    console.log("promise end");
});
setTimeout(() => {
    console.log("setTimeout");
});
console.log("end");
// result:  start       Promise start       end          promise 10        promise end      setTimeout
```

```js
console.log('start');
const promise1 = Promise.resolve().then(() => {
  console.log('promise1');
  const timer2 = setTimeout(() => {
    console.log('timer2')
  }, 0)
});
  
const timer1 = setTimeout(() => {
  console.log('timer1')
  const promise2 = Promise.resolve().then(() => {
    console.log('promise2')
  })
}, 0) 
 
console.log('end');
```
result: start end promise1 timer1 promise2 timer2

**基本原则：**

+ 先执行同步代码，再执行异步代码
+ 同步代码按调用顺序执行

### 检测系统主题

```js
window.addEventListener('theme-mode', event =>{ 
  if(event.mode == 'dark'){}
  if(event.mode == 'light'){} 
})

window.matchMedia('(prefers-color-scheme: dark)') .addEventListener('change', event => { 
  if (event.matches) {} // dark mode
})
```

### 函数的length属性

- 函数的length是js函数对象的一个属性，函数的length代表形参的个数（即有多少必传参数）
- 形参的数量不包括剩余参数的个数，仅包括“第一个具有默认值之前的参数个数”

```js
function a1(a, b, c){}; // result: 3
function a2(a, b = 2, c){}; // result: 1
function a2(a = 1, b, c){}; // result: 0
```

### 0.1 + 0.2 === 0.3 嘛？为什么

在两数相加时，会先转换成二进制，0.1 和 0.2 转换成二进制的时候尾数会发生无限循环，然后进行对阶运算，JS 引擎对二进制进行截断，所以造成精度丢失。

> **总结：** 精度丢失可能出现在进制转换和对阶运算中

### 实现函数能够深度克隆基本类型

**递归的方法实现**

```js
function deepCopy(target) {
  let newObj = Array.isArray(target) ? [] : {};
  for (key in target) {
    if (typeof target[key] === "object" && target[key] !== null) {
      newObj[key] = deepCopy(target[key]);
    } else {
      // 简单数据类型
      newObj[key] = target[key]
    }
  }
  return newObj;
}
let oldVal = { s1: 123, s2: [1, 2, 3], s3: { a: 1, b: 2 } };
let newVal = deepCopy(oldVal);
newVal.s1 = 456;
newVal.s3.a = 66;
console.log("newVal", newVal, oldVal);
```

**深度克隆的其他方法：** 

JSON.stringify转为字符串再JSON.parse

序列化深拷贝的缺点： 

+ JSON.stringify() 会默认一处函数
+ 无法拷贝Map、Set、 RegExp 这些特殊数据类型
+ 循环引用会报错

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

### ES5对ES6中的let和const的实现

**let的实现**

```js
function outputNum(count){
//块级作用域
  (function(){
    for(var i = 0; i < count; i ++){
      console.log(i)
    }
  })();
  console.log(i) // i is not defined
}
outputNum(5)
```

**const的实现**

```jsx
var __const = function __const(data, value) {
  window.data = value // 把要定义的data挂载到window下，并赋值value
  Object.defineProperty(window, data, { // 利用Object.defineProperty的能力劫持当前对象，并修改其属性描述符
    enumerable: false,
    configurable: false,
    get: function () {
      return value
    },
    set: function (data) {
      if (data !== value) { // 当要对当前属性进行赋值时，则抛出错误！
        throw new TypeError('Assignment to constant variable.')
      } else {
        return value
      }
    }
  })
}
__const('a', 10)
console.log(a)
delete a
console.log(a)
for (let item in window) { // 因为const定义的属性在global下也是不存在的，所以用到了enumerable: false来模拟这一功能
  if (item === 'a') { // 因为不可枚举，所以不执行
    console.log(window[item])
  }
}
a = 20 // 报错
```

### 获取URL参数的对象

**方法一**

```js
export function getURLParameters(url) {
    const str = url.match(/([^?=&]+)(=([^&]*))/g) || []
    return str.reduce((a, v) => ((a[decodeURIComponent(v.slice(0, v.indexOf('=')))] = decodeURIComponent(v.slice(v.indexOf('=') + 1))), a), {})
}
```

**方法二**

```js
function getURLParameters(url) {
  const hash = decodeURIComponent(url).split("?");
  if (hash.length >= 2) {
    const json = "{\"" + hash[1].replace(/&/g, "\",\"").replace(/\=/g, "\":\"") + "\"}";
    return JSON.parse(json)
  }
  return {}
}
const str = "http://wwww.baidu.com?sear=aaa&keyword=bbbb";
console.log("test", getURLParameters(str)) // reslut: test {sear: 'aaa', keyword: 'bbbb'}
```

**方法三**

```js
function getearcgParams() {
  const searchPar = new URLSearchParams(location.search)
  const searchObj = {}
  for (const [key, value] of searchPar.entries()) {
    searchObj[key] = value
  }
  return searchObj
}
```

### 将键值对拼接成URL带参数

```js
export function fnParamsToUrl(obj) {
      let aUrl = []
      let fnAdd = function(key, value) {
        return key + '=' + value
      }
      for (var k in obj) {
        aUrl.push(fnAdd(k, obj[k]))
      }
      return encodeURIComponent(aUrl.join('&'))
 }
```

### 复制到剪切板

[相关连接](https://www.ruanyifeng.com/blog/2021/01/clipboard-api.html)

```js
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
}
async function clipboardReadText() {
  const text = await navigator.clipboard.readText();
  console.log(text);
}
copyToClipboard("哈哈哈")
```

### 让当前的元素滚动到浏览器窗口的可视区域内

```js
element.scrollIntoView()
element.scrollIntoViewIfNeeded()
```
scrollIntoView  只接受一个参数，但接受两种类型的参数，分别是Boolean型参数和Object型参数; 
+ Boolean型参数，顾名思义，参数可以使true和false。如果为true，元素的顶端将和其所在滚动区的可视区域的顶端对齐。若为false，元素的底端将和其所在滚动区的可视区域的底端对齐
+ Object型参数，这个对象有两个选项，也就是对象里面的key。block与之前的Boolean型参数一致，不过值不再是true和false，是更语义化的start和end。另一个选项是behavior，MDN上给出三个可取的值，分别是auto、instant与smooth。这个选项决定页面是如何滚动的

scrollIntoViewIfNeeded 可以接受一个Boolean型参数，和scrollIntoView不同，true为默认值，但不是滚动到顶部，而是让元素在可视区域中居中对齐；false时元素可能顶部或底部对齐，视乎元素靠哪边更近

### URL的编码与解码

- 编码使用encodeURI()函数---> 解码使用decodeURI()函数
- 编码使用encodeURIComponent()函数 ---> 解码使用decodeURIComponent()函数

### 关于FileReader

> fileReader是一种一部文件读取机制，结合input:file可以很方便地读取本地文件

**创建File Reader对象**

```js
const fileReader = new FileReader();
```

**FileReader对象的常用方法**

+ **readerAsArrayBuffer(file)** 按字节读取文件内容，结果为ArrayBuffer对象
+ **raederAsBinaryString(file)** 按字节读取文件内容，结果为二进制串
+ **raederAsDataUrl(file)** 结果为base64文件

**案例**

```html
<input type="file" id="file" />
<script>
  document.querySelector("#file").addEventListener("change", (fileList) => {
  const file = fileList.target.files[0];
  const fileReader = new FileReader();
  fileReader.raederAsDataUrl(file);
  fileReader.onload = function(e) {
    console.log("base64文件", e.target.result)
  }
})
</script>
```

### 发布订阅者模式

> 应用场景： react 总线通信

```js
class EventEmitter {
  constructor() {
    this.events = {}
  }
  on(name, callback) {
    if (this.events[name]) {
      this.events[name].push(callback)
    } else {
      this.events[name] = [callback]
    }
  }
  off(name, callback) {
    if (!this.events[name]) return;
    if (!callback) {
      // 如果没有callback,就删掉整个事件
      this.events[name] = undefined;
    }
    this.events[name] = this.events[name].filter((item) => item !== callback);

  }
  emit(name, ...args) {
    if (!this.events[name]) return
    this.events[name].forEach(cb => cb(...args))
  }
}
function sysLanguageChange(e) {
  console.log("接受到的消息", e); // 接受订阅
}
const eventEmitter = new EventEmitter();
eventEmitter.on("sysLanguageChange", sysLanguageChange)
// 发布订阅
eventEmitter.emit("sysLanguageChange", "ZH");
// 关闭订阅
eventEmitter.off("sysLanguageChange", sysLanguageChange)
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

### 数组的常用方法

- *join(separator)* 将数组的元素组起一个字符串
- *push()* 追加数组元素，将其放在数组的最后一个位置，并增加数组的长度
- *pop()* 数组末尾移除最后一项，减少数组的 length 值，然后返回移除的项。
- *shift()* 删除原数组第一项，并返回删除元素的值；如果数组为空则返回undefined 。
- *unshift()* 将参数添加到原数组开头，并返回数组的长度 。
- *splice(index, length)* 删除数组中的元素，参数一：删除的开始位置，参数二：删除数组元素的条目数
- *forEach()* 对数组进行遍历循环，对数组中的每一项运行给定函数。这个方法没有返回值。参数都是function类型，默认有传参，参数分别为：遍历的数组内容；第对应的数组索引，数组本身。
- *map()* 循环遍历数组 参数是一个函数，该函数的第一个参数是item表示遍历项目，第二个参数是遍历项的索引,第三个参数循环项本身

### 数组sort()函数

```js
let arr = [5, 2, 3, 1, 4];
arr.sort((a, b) => {
  return a - b;
})
console.log(arr);    // result [1, 2, 3, 4, 5]
```

 对于callback(a，b)：主要根据返回值的正负来确定a，b的位置 

如果返回值小于0，则sort()函数自动将a排列到 b之前；

如果返回值等于0，则a与b的相对位置不变；

 如果返回值大于0，则sort()函数自动将a排列到b之后；

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

### 获取文件对象的blob地址

```js
const blob = window.URL.createObjectURL(this.$refs.file.files[0])
// this.$refs.file.files[0] 为文件的文件对象
```

### 加入收藏夹

```js
function addFavorite(sURL, sTitle) {
  try {
    window.external.addFavorite(sURL, sTitle);
  } catch (e) {
    try {
      window.sidebar.addPanel(sTitle, sURL, "");
    } catch (e) {
      alert("加入收藏失败，请使用Ctrl+D进行添加");
    }
  }
}
```

### 压缩CSS样式代码

```js
function compressCss(s) {
  //压缩代码
  s = s.replace(/\/\*(.|\n)*?\*\//g, ""); //删除注释
  s = s.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
  s = s.replace(/\,[\s\.\#\d]*\{/g, "{"); //容错处理
  s = s.replace(/;\s*;/g, ";"); //清除连续分号
  s = s.match(/^\s*(\S+(\s+\S+)*)\s*$/); //去掉首尾空白
  return s == null ? "" : s[1];
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

    > 语法：slice(start, [end])

    ```js
    var myStr = "I,love,you,Do,you,love,me"
    var subStr = myStr.slice(1,5)	//",lov"
    ```

    第二种，使用substring():

    > 语法： substring(start, [end])

    ```js
    var myStr = "I,love,you,Do,you,love,me"
    var subStr = myStr.substring(1,5)	 //",lov"
    ```

    第三种，使用substr():

    > 语法: subsrt(index, [length])

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

### 一段范围内的随机数

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

### 变量提升

> ES6之前我们一般使用var来声明变量，提升简单来说就是把我们所写的类似于var a = 123;这样的代码，声明提升到它所在作用域的顶端去执行，到我们代码所在的位置来赋值。

```js
function test() {
    console.log(a);
    var a = 123;
}
test(); // undefined
// 它的实际执行顺序如下：
function test() {
    vat a;
    console.log(a);
    a = 123;
}
```

下面来看一道经典面试题：

```js
console.log(a);
var a = 100
function foo() {
    console.log(a);
    var a = 200;
    console.log(a)
}
foo()
console.log(a) 
// result: undefined undefined 200 100
```

**函数提升**

```js
console.log(bar)
function bar() {
    console.log(123)
}
// result: f bar() {console.log(123) }
执行顺序相当于：
function bar() {
    console.log(123);
}
console.log(bar);
```

函数提升是整个代码块提升到它所在的作用域的最开始执行, 这就是**函数优先规则**

```js
foo();
var foo;
function foo() {
    console.log(1)
}
foo = function() {
    console.log(2)
}
// result: 1
```

### 防抖与节流

**防抖**

> 只有最后一次出发生效

```js
var timer = null
function debounce(){
    if(timer) clearTimeout(timer);
    timer = setTimeout(()=>{
        // 在这里可以获取搜索建议
    },150)
}
debounce()
```

**节流**

> 减少事件的触发频率，选择性的执行事件

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
  }, 200);
}
```

**防抖与节流的异同**

防抖与节流都是希望在同一时间内，不要重复触发请求。

防抖主要是在规定的时间内只触发一次，如果再次调用，事件重新计时

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

| 代码 |      类       |                    说明                    |
| :--: | :-----------: | :----------------------------------------: |
|  .   |               |         匹配除换行符以外的任意字符         |
|  \w  | [a-zA-Z0-0_]  |           匹配字母或数字或下划线           |
|  \s  | [\f\r\n\t\v]  |              匹配任意的空白符              |
|  \d  |     [0-9]     |                  匹配数字                  |
|  \D  |    [^0-9]     |                                            |
|  \b  |               |            匹配单词的开始或结束            |
|  ^   |               |                匹配行的开始                |
|  $   |               |                匹配行的结束                |
|  \W  | [^a-zA-Z0-0_] | 匹配任意不是数字、字母或者下划线的汉字字符 |
|  \S  | [^\f\r\n\t\v] |           匹配任意不是空白的字符           |

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

**案例三：**

> 使用正则分组实现字符串的驼峰命名

```js
function toHumpName(str) {
  let reg = /\_(\w)/g;
  return str.replace(reg, ($0, $1) => {
    return $1.toUpperCase();
  })
}
let str = "border_top_color";
console.log(toHumpName(str)); // result: borderTopColor
```

也可以使用其他方法

```js
function toHumpName(str) {
  let arr = str.split("_");
  for(let i = 1; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
  }
  return arr.join("");
}
```

### JavaScript 正则表达式的方法

**match()**

方法返回 3 个可能的值：

+ 如果正则表达式包含一个 g 标记，即为全局匹配，它将返回一个包含所有匹配项的数组，没捕获组信息；
+ 如果正则表达式没有 g 标记，它将返回一个包含第一个匹配项和其相关的捕获组的数组；
+ 如果根本没有匹配项，则返回 null 。

```js
const strText = "Hello China";
const regex = /[A-Z]/g; // 大写字母正则表达式
console.log(strText.match(regex)); // [ 'H', 'C' ]
```

**test()**

test() 用于测试指定字符串和正则表达式之间是否匹配，接受一个字符串作为其参数，并根据是否匹配返回 true 或 false 。

```js
const strText = "hello china";
const regex = /china/;
console.log(regex.test(strText)); // true
```

**search()**

search() 方法是一个字符串方法，用于在字符串中搜索匹配项, 方法返回第一个匹配项在整个字符串中的位置（索引），如果没有匹配项，则返回 -1。

```js
const strText = "hello china，i love china";
const regex = /china/;
console.log(strText.search(regex)); // 6
```

**replace()**

replace() 是在字符串中搜索指定的值或正则表达式并将其替换为另一个值

```js
const strText = "hello world,i love world";
const regex = /world/;
console.log(strText.replace(regex, "china")); // hello china,i love world
```

**replaceAll()**

replaceAll() 类似于方法 replace() ，但它允许替换字符串中所有匹配的值或正则表达式。

```js
const strText = "hello world,i love world";
console.log(strText.replaceAll("world", "china")); // hello china,i love china
```

等效于如下代码：

```js
const strText = "hello world,i love world";
const regex = /world/g;
console.log(strText.replaceAll(regex, "china")); // hello china,i love china
```
**验证数字类型**
```js
const reg = /^(([1-9]{1}\d*)|(0{1}))((.\d{1,})?)$/;
reg.test(123.2323) // result: true
```
