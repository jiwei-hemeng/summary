## 浏览器渲染过程是怎么样的

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

## Event Loop(事件循环)

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

+ 代码按调用顺序执行
+ 先执行同步代码，再执行异步代码
+ 异步代码中微任务优先于宏任务

## 发布订阅者模式

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
// 订阅消息
eventEmitter.on("sysLanguageChange", sysLanguageChange)
// 发布订阅
eventEmitter.emit("sysLanguageChange", "ZH");
// 关闭订阅
eventEmitter.off("sysLanguageChange", sysLanguageChange)
```

## 进程和线程

> **单线程与多线程**，都是指**在一个进程内**的单和多。（所以核心还是得属于一个进程才行）

- 进程是cpu资源分配的最小单位（是能拥有资源和独立运行的最小单位），比作**车间**
- 线程是cpu调度的最小单位（线程是建立在进程的基础上的一次程序运行单位，一个进程中可以有多个线程）比作**车间中的工人**

### 浏览器是多进程的

- 浏览器是多进程的
- 浏览器之所以能够运行，是因为系统给它的进程分配了资源（cpu、内存）
- 简单点理解，每打开一个Tab页，就相当于创建了一个独立的浏览器进程。

### 浏览器都包含哪些进程

1. rowser进程：浏览器的主进程（负责协调、主控），只有一个。作用有

   + 负责浏览器界面显示，与用户交互。如前进，后退等

   - 负责各个页面的管理，创建和销毁其他进程
   - 将Renderer进程得到的内存中的Bitmap，绘制到用户界面上
   - 网络资源的管理，下载等

3. 第三方插件进程：每种类型的插件对应一个进程，仅当使用该插件时才创建

4. GPU进程：最多一个，用于3D绘制等

4. 浏览器渲染进程（浏览器内核）（Renderer进程，内部是多线程的）：默认每个Tab页面一个进程，互不影响。主要作用为

   + 页面渲染，脚本执行，事件处理等

### 浏览器内核（渲染进程）

1. GUI渲染线程

   + 负责渲染浏览器界面，解析HTML，CSS，构建DOM树和RenderObject树，布局和绘制等。

   - 当界面需要重绘（Repaint）或由于某种操作引发回流(reflow)时，该线程就会执行
   - 注意，**GUI渲染线程与JS引擎线程是互斥的**，当JS引擎执行时GUI线程会被挂起（相当于被冻结了），GUI更新会被保存在一个队列中**等到JS引擎空闲时**立即被执行。

2. JS引擎线程

   + 也称为JS内核，负责处理Javascript脚本程序。（例如V8引擎）

   - JS引擎线程负责解析Javascript脚本，运行代码。
   - JS引擎一直等待着任务队列中任务的到来，然后加以处理，一个Tab页（renderer进程）中无论什么时候都只有一个JS线程在运行JS程序
   - 同样注意，**GUI渲染线程与JS引擎线程是互斥的**，所以如果JS执行的时间过长，这样就会造成页面的渲染不连贯，导致页面渲染加载阻塞。

3. 事件触发线程

   + 归属于浏览器而不是JS引擎，用来控制事件循环（可以理解，JS引擎自己都忙不过来，需要浏览器另开线程协助）

   - 当JS引擎执行代码块如setTimeOut时（也可来自浏览器内核的其他线程,如鼠标点击、AJAX异步请求等），会将对应任务添加到事件线程中
   - 当对应的事件符合触发条件被触发时，该线程会把事件添加到待处理队列的队尾，等待JS引擎的处理
   - 注意，由于JS的单线程关系，所以这些待处理队列中的事件都得排队等待JS引擎处理（当JS引擎空闲时才会去执行）

4. 定时触发器线程

   + 传说中的`setInterval`与`setTimeout`所在线程

   - 浏览器定时计数器并不是由JavaScript引擎计数的,（因为JavaScript引擎是单线程的, 如果处于阻塞线程状态就会影响记计时的准确）
   - 因此通过单独线程来计时并触发定时（计时完毕后，添加到事件队列中，等待JS引擎空闲后执行）
   - 注意，W3C在HTML标准中规定，规定要求setTimeout中低于4ms的时间间隔算为4ms。

5. 异步http请求线程

   + 在XMLHttpRequest在连接后是通过浏览器新开一个线程请求

   - 将检测到状态变更时，如果设置有回调函数，异步线程就**产生状态变更事件**，将这个回调再放入事件队列中。再由JavaScript引擎执行。

## web work

js采用的是单线程模型,所有任务只能在一个线程上完成，一次只能做一件事。前面的任务没做完，后面的任务只能等着。随着电脑计算能力的增强，尤其是多核 CPU 的出现，单线程带来很大的不便，无法充分发挥计算机的计算能力。相对的webwork就是为js创造多线程的环境,允许主线程创建webwork线程,将未处理的一些任务分给后者 运行.在js主线程运行的同时,work线程在后台运行,两者互不打扰,等到webwork线程的任务结束后,把结果返回给主线程。

### web work的注意点

+ 同源限制：分配给 Worker 线程运行的脚本文件，必须与主线程的脚本文件同源。
+ DOM限制：Worker 线程所在的全局对象，与主线程不一样，无法读取主线程所在网页的 DOM 对象，也无法使用document、window、parent这些对象。但是，Worker 线程可以navigator对象和location对象
+ 通信联系：Worker 线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过消息完成
+ 脚本限制:Worker 线程不能执行`alert()`方法和`confirm()`方法，但可以使用 XMLHttpRequest 对象发出 AJAX 请求。
+ 文件限制: Worker 线程无法读取本地文件，即不能打开本机的文件系统（`file://`），它所加载的脚本，必须来自网络

### 使用

#### 主线程

```js
var worker = new Worker('work.js');
// 发送消息
worker.postMessage('Hello World');
worker.postMessage({method: 'echo', args: ['Work']});
// 接收消息
worker.addEventListener("message", function (e) {
  console.log("接收到的消息", e.data)
});
// 关闭 Worker
worker.terminate();
```

#### Worker 线程

```js
// 监听来自主线程的消息
self.addEventListener('message', function (e) {
  var data = e.data;
  switch (data.cmd) {
    case 'start':
      self.postMessage('WORKER STARTED: ' + data.msg);
      break;
    case 'stop':
      self.postMessage('WORKER STOPPED: ' + data.msg);
      self.close(); // Terminates the worker.
      break;
    default:
      self.postMessage('Unknown command: ' + data.msg);
  };
}, false);
// 关闭 Worker
self.close();
```

