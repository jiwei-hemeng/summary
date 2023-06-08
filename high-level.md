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

+ 代码按调用顺序执行
+ 先执行同步代码，再执行异步代码
+ 异步代码中微任务优先于宏任务

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
// 订阅消息
eventEmitter.on("sysLanguageChange", sysLanguageChange)
// 发布订阅
eventEmitter.emit("sysLanguageChange", "ZH");
// 关闭订阅
eventEmitter.off("sysLanguageChange", sysLanguageChange)
```

### 进程和线程

- 进程是cpu资源分配的最小单位（是能拥有资源和独立运行的最小单位），比作**车间**
- 线程是cpu调度的最小单位（线程是建立在进程的基础上的一次程序运行单位，一个进程中可以有多个线程）比作**车间中的工人**

**单线程与多线程**，都是指**在一个进程内**的单和多。（所以核心还是得属于一个进程才行）
