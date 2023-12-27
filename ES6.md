## 关于*var* 、 *const* 、*let* 的区别

|       | 初始值   | 更改值 | 重新声明 | 变量提升 | 块级作用域 | window调用 |
| ----- | -------- | ------ | -------- | -------- | ---------- | ---------- |
| var   | 可有可无 | √      | √        | √        | ×          | √          |
| const | 必须有   | ×      | ×        | ×        | √          | ×          |
| let   | 可有可无 | √      | ×        | ×        | √          | ×          |

## 箭头函数与普通函数的异同？

箭头函数没有自己的 this 值和 arguments 对象。因此，我们不应该将其用作事件处理程序、对象文字的方法、原型方法，或者当我们有使用参数对象的函数时。

+ 普通函数 *this* 指向 window；箭头函数没有 *this* 指向，所以箭头函数的 *this* 指向上级作用域
+ 普通函数有arguments；而箭头函数没有必须使用剩余参数 *...* 
+ 箭头函数不能用于构造函数: 普通函数可以用于构造函数

## Set 新的数据类型

> `Set`是ES6引入的一种类似Array的新的数据结构，Set实例的成员类似于数组item成员
>
> `区别`是Set实例的成员都是唯一，不重复的。这个特性可以轻松地实现数组去重

```js
var arr = [1,2,3,4,5,6];
var newArr = [...new Set(arr)];
```

## Map 新的数据类型

>  `Map`是ES6引入的一种类似`Object`的新的数据结构。
> `Map`可以理解为是`Object`的超集，**打破了以传统键值对形式定义对象，对象的key不再局限于字符串，也可以是Object**。可以更加全面的描述对象的属性。 

```js
let myMap = new Map()
const obj = {p: "123"}
myMap.set(obj, "ok")
myMap.size // 1
myMap.get(obj) // "ok"
myMap.has(obj) // true
myMap.delete(obj) // true
myMap.has(obj) // false
myMap.clear() // 清除所有
myMap.keys() // 返回键名的遍历器
myMap.values() // 返回值的遍历器
```

## Symbol 数据类型

> synbol, 表示独一无二的值，每个symbol类型的值都不相同。特点不能使用new 关键字调用它

```js
let sy = Symbol("test");
let sy1 = Symbol("test");
console.log(tepeof sy) // "symbol"
sy == sy1; // false
```

## es6中的class

```js
class Person {
  constructor(age) {
    this.age = age
  }
  eat() {
    console.log('eatting');
  }
}
class Student extends Person {
  constructor(name, age){
    // 如果有super必须写在最强面
    super(age)
    this.name = name
  }
  doSth(){
    console.log(this.name)
  }
}
let s1 = new Student('若川', 22)
s1.doSth();
s1.eat(); 
```

## 模板字符串

```js
let str = `bhjdc ${item}`
```

## promise的异步封装

> 用来解决回调地狱

```js
export function formatStatus() {
  return new Promise(async (resolve, reject) => {
    try {
      const { t } = await findAllRoles({  // 异步请求
        roleId: permissions[0],
      })
      resolve(t)
    } catch (err) {
      reject(err)
    }
  })
}
```

## 函数默认值

> ES6 之前，函数的形参是无法给默认值的，只能在函数内部通过变通的方法实现。

```js
function ES6func(a=1, b=2) {
  console.log(a, b)
}
ES6func()  // 1, 2
```

## 关于ES6的 `Proxy`

> `Proxy`是ES6新增的一个构造函数，可以理解为JS语言的一个代理。
>
> 语法： let p = new Proxy(target, handler);

```js
let person = {
  name: "hemeng",
  age: 24,
};
person = new Proxy(person, {
  get(target, key) {
    return Reflect.get(target, key);
  },
  set(target, key, value) {
    if (key === "age" && typeof value !== "number") {
      throw Error("age字段必须为Number类型");
    }
    return Reflect.set(target, key, value);
  },
  deleteProperty(target, key) {
    return Reflect.deleteProperty(target, key);
  },
});
console.log("姓名", person.name);
person.age = 44;
console.log("年龄", person.age);
person.cls = "1-2";
console.log(person.cls);
delete person.cls;
console.log(person);
```

## Reflect

> **Reflect** 是一个内置的对象，它提供拦截 JavaScript 操作的方法。与大多数全局对象不同`Reflect`并非一个构造函数，所以不能通过[new运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)对其进行调用，或者将`Reflect`对象作为一个函数来调用。`Reflect`的所有属性和方法都是静态的（就像[`Math`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math)对象）。

**静态方法**

+ Reflect.set(target, key, value)   在一个对象上设置一个属性, 返回一个[`Boolean`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean)，如果更新成功，则返回`true`
+ Reflect.has(target, key)  检测一个对象是否存在特定属性,返回一个[`Boolean`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean)，如果存在，则返回`true`
+ Reflect.deleteProperty(target, key) 允许用于删除属性, 如果删除成功，则返回`true`

## async 函数

> 可以像执行同步代码一样的写异步代码，async 函数必须是基于Promise

```js
function add(a, b) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(a + b)
    }, 2000)
  })
}
// 函数使用async 标记
async function test() {
  // await 必须写在async函数中
  let num = await add(2,3)
  console.log(num)
}
```

async 函数比Generator函数的优点

+ 内置执行器。Generator函数的执行必须依靠执行器，而async 函数自带执行器，调用方法跟普通函数的调用一样。
+ 更好的语义， async 和await相较于* 和yieId 更加语义化
+ 更广的适应性， yieId 命令后面只能是thunk 函数或promise, 而async函数的await后面可以是promise也可以是原始类型的值
+ async 返回值是promise对象，可以直接使用then()方法经行调用， 而Generator函数返回Iterator对象

在 Promise 中的代码是被当做同步任务立即执行的。而在 async/await 中，在出现 await 出现之前，其中的代码也是立即执行的, 出现在await 后面的代码是 microtask

```js
async function async1() {
 console.log('async1 start');
 await async2();
 console.log('async1 end');
}
```
相当于

```js
async function async1() {
 console.log('async1 start');
 Promise.resolve(async2()).then(() => {
    console.log('async1 end');
  })
}
```

## Generator 函数

> Generator函数是ES6提供的一种异步编程的解决方案，可以先理解为一个状态机，封装了多个内部状态，执行Generator函数返回一个遍历器对象，通过遍历遍历器对象，可以依次获取到Generator函数内部的每个状态。

语法上，Generator函数是一个不同的函数，但是有两个特征：一是，function关键字与函数名之间有一个星号；二是，函数体内部使用yieId表达式，定义不同的内部状态。

```js
function * helloGenerataor() {
  yieId "hello"
  yieId "Generator"
  return "ending"
}
let Generator = helloGenerator()
console.log(Generator.next()) // { value: "hello", done: false}
console.log(Generator.next()) // { value: "Generator", done: false}
console.log(Generator.next()) // { value: "ending", done: true}
```

调用Generator函数后并不执行， 返回的也不是函数运行的结果而是一个指向内部状态的指针对象，也就是遍历器对象。

## super 关键字

> super 关键字既可以当作函数使用，也可以当作对象使用 

**当作函数使用**

```js
class A {}
class B extends A {
  constructor() {
    super();
  }
}
```

注意：super 虽然代表了父类A的构造函数，但是返回的是子类B的实例，即super内部的this指向B的实例，因此super()在这里相当于 `A.prototype.constructor.call(this)`

**当作对象使用**

```js
class A {
  constructor() {
    this.a = 1;
  }
  c() {
    return this.a;
  }
}
class B extends A {
  constructor() {
    super();
    this.a = 2;
    console.log(super.c()); // 2
  }
}
let b = new B();
```

上面案例中，子类B当中的`super.c()` ， 就是将`super`当作一个对象使用。

## 有条件地向对象添加属性

```js
const condition = true;
const person = {
  id: 1,
  name: 'John Doe',
  ...(condition && { age: 16 }),
};
```

## Object.create()介绍

> Object.create(null) 创建的对象是一个空对象，在该对象上没有继承 Object.prototype 原型链上的属性或者方法. 例如：toString(), hasOwnProperty()等方法

我们来看看底层实现

```js
 Object.create =  function (o) {
    var F = function () {};
    F.prototype = o;
    return new F();
}; 
```

Object.create继承的应用：

```js
var A = function () { };
A.prototype.sayName=function () {
    console.log('a');
}

// B的实例继承了A的属性
var B = function () { };
B.prototype.__proto__ = Object.create(A.prototype);
var b = new B();
b.sayName();  // a
```
> 划重点：相对于构造函数的继承Object.create继承实现了将A,B的原型完美分隔 。双方不会互相影响。这是Object.create亮点所在

## 可选的链接运算符

> 可选的链接运算符 (?.) 访问对象的属性或调用函数。如果对象是 undefined 或 null，它返回 undefined 而不是抛出错误。

数据层级嵌套太深, 我没经常见到的是：

```js
const showName = (data) => {
  console.log(data && data.user && data.user.person ...)
}
showName('fatfish')
```

更加优雅的写法是：

```js

const showName = (data) => {
  console.log(data?.user?.name)
}
showName('fatfish')
```

## import maps

`import map`直译过来是 **导入映射**，它与模块的使用有关，一般我们在项目中导入模块，会调用`require`方法，或者使用`import`语句或方法，引入的模块通常使用npm之类的包管理器进行管理。但是`import map`提供了一种支持，让我们可以直接在页面上管理模块，不需要通过打包构建。

`import maps`已经成为了一个 Web 标准，并且在2021年7月正式通过了 W3C 的标准化流程；但是由于这个特性比较新，很多浏览器不支持，后面我们详细聊聊兼容情况。

### import maps 怎么使用

在`import maps`中，可以使用一个 `JavaScript` 对象来定义模块标识符与对应 `URL` 的映射关系，例如：

```html
<script type="importmap">
  {
    "imports": {
      "lodash": "https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.js",
      "react": "/node_modules/react/index.js"
    }
  }
</script>
```

在上述示例中，定义了 `lodash` 模块的 `URL` 为 https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.js，而 `react` 模块的 `URL` 则为相对路径 `/node_modules/react/index.js`。

通过`importmap`，可以在模块中使用字符串形式的模块名称来导入其他模块，而不必关心实际模块资源的 `URL`，例如：

```html
<script type="module">
  import _ from "lodash";
  import React from "react";
</script>
```

### import maps 有何优势

+ 动态加载模块
+ 模块依赖关系管理
+ 减少网络请求

### import maps 兜底映射

```json
{
  "imports": {
    "jquery": [
      "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js",
      "/node_modules/jquery/dist/jquery.js"
    ]
  }
}
```

先加载CDN的资源，如果挂了，就加载本地node_modules里的资源（回退策略只会生效一次，之后便会缓存所有的功能）。

## ESM 和 CommonJS

### 相同点

+ ESM 和 CommonJS 都有缓存

  > 这一点两种模块方案一致，都会缓存模块，模块加载一次后会缓存起来，后续再次加载会用缓存里的模块

### 不同点

+ 不同点：this 的指向不同

+ `_filename`，`__dirname` 在 `CommonJS `中存在，在 `ESM` 中不存在

  > ESM 中不能直接使用 `__filename` 和 `__dirname`。

+ ESM 模块解析是发生在 **编译阶段**, 而 CommonJS模块解析发生在 **执行阶段**
+ CommonJS 不同，ESM 中 `import` 的不是对象， `export` 的也不是对象
+ ESM 模块输出的是值的引用，CommaonJS 模块输出的是值的拷贝

## JavaScript 的常见报错类型

+ RangeError 栈溢出；

  > RangeError: Maximum call stack size exceeded

  ```js
  functiona () {
    b()
  }
  functionb () {
    a()
  }
  a()
  // out: 
  // RangeError: Maximum call stack size exceeded
  ```

+ ReferenceError 打印一个不存在的值

  > ReferenceError: hello is not defined

  ```js
  hello
  // out: 
  // ReferenceError: hello is not defined
  ```

+ `SyntaxError` 当语法不符合 JS 规范时，就会报这种错误

  ```js
  console.log(1));
  // out:
  // console.log(1));
  //               ^
  // SyntaxError: Unexpected token ')'
  ```

+ `TypeError` 当一个基础类型当作函数来用时，就会报这个错误

  > TypeError: a is not a function

  ```js
  vara = 1;
  a()
  // out:
  // TypeError: a is not a function
  ```


## for in 和 for of

- for in：适用于遍历对象、数组；

  - 输出的值为key值；

    ```js
    const arr = [1,2,3];
    for(let key in arr) {console.log(key)} // 0,1,2
    ```

  - 会遍历原型链上的属性；

    ```js
    let arr=[1,2,3,4,5];
    Array.prototype.test=321;
    for (const key in arr) {
      console.log(key);  // 0，1，2，3，4，test
    }
    ```

  - 不能保证返回对象属性的顺序。换句话说，所有可枚举的属性都会返回一次，但返回的顺序可能会因浏览器而异；

- for of：适用于遍历数组等内置迭代器的数据 **(不能遍历对象)**

  - 输出的值为value值；

    ```js
    const arr = [1,2,3];
    for(let key of arr) {console.log(key)} // 1,2,3
    ```

  - 不会遍历原型链上的属性；

    ```js
    let arr=[1,2,3,4,5];
    Array.prototype.test=321;
    for (const key of arr) {
      console.log(key);  // 1，2，3，4，5
    }
    ```

  - 按照可迭代对象的next()方法产生值的顺序迭代元素；

## ===和==的区别

+ 对于string,number等基础类型，==和===是有区别的

  +  不同类型间比较，==之比较“转化成同一类型后的值”看“值”是否相等，===如果类型不同，其结果就是不等
  + 同类型比较，直接进行“值”比较，两者结果一样

+ 对于Array,Object等高级类型，==和===是没有区别的

  进行“指针地址”比较

+ 基础类型与高级类型，==和===是有区别的

  + 对于==，将高级转化为基础类型，进行“值”比较
  + 因为类型不同，===结果为false

## Object.is()和===的区别

Object.is 方法与严格相等比较运算符 === 有些不同。大部分情况下， Object.is(a, b) 与a === b 等价

但是有两种情况不同： NaN ； -0 和 +0 。该算法在 ECMAScript 规范中被称为SameValue 。

+ 当 NaN 和 NaN 比较时，严格相等运算符会返回 false ，因为 NaN 不等于它自身。但是 Object.is方法则会返回 true 。

+ 类似地，当 -0 与 +0 比较时， === 运算符得到的结果是 true ，但 Object.is 返回 false 。

## 比较一个对象是否相等

> [lodash  isEqual 函数](https://www.lodashjs.com/docs/lodash.isEqual#_isequalvalue-other) 

```js
function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}
function isEqual(obj1, obj2) {
  if (!isObject(obj1) || !isObject(obj2)) {
    return obj1 === obj2;
  }
  //判断是否两个参数是同一个变量
  if (obj1 === obj2) {
    return true;
  }
  //判断keys数是否相等
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  if (obj1Keys.length !== obj2Keys.length) {
    return false;
  }
  //深度比较每一个key
  for (let key in obj1) {
    if (!obj2.hasOwnProperty(key)) {
      return false;
    }
    if (!isEqual(obj1[key], obj2[key])) {
      return false;
    }
  }
  return true;
}
const a = { a1: 1, b2: { C1: 23 } };
const b = { a1: 1, b2: { C1: 23 } };
const c = { a1: 1, b2: { C1: 33 } };
isEqual(a, b); // true
isEqual(a, c); // false
```

## 校验数据类型

```js
export function getTypeOf(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
}
```

## 使用 Object.groupBy 分组

```js
const people = [
  { name: "Alice", age: 28 },
  { name: "Bob", age: 30 },
  { name: "Eve", age: 28 },
];
const peopleGroup = Object.groupBy(people, person => person.age);
console.log("peopleGroup", peopleGroup);
```

## JS 中 Map 和 WeakMap 有什么区别

+ Map和WeakMap最大的区别是它们的**键类型限制**。Map对象可以使用任何类型的值作为键，包括基本数据类型和对象类型，而WeakMap对象的键必须是对象类型。这是因为WeakMap使用对象的引用作为键，并且只有对象才有引用。如果尝试使用基本数据类型作为WeakMap的键，会导致TypeError异常。
+ Map和WeakMap对**垃圾回收机制**的影响。在Map对象中，键和值都会被常规垃圾回收机制回收，而在WeakMap对象中，键是弱引用。这意味着，当对象被垃圾回收时，WeakMap中对应的键值对也会被自动删除。这使得WeakMap通常用于缓存或元数据，当对象不再被使用时，WeakMap可以自动清除对应的数据，避免内存泄漏。

## Promise.all、Promise.any、Promise.race 的区别是啥？

+ Promise.all 全部resolve执行then,  只要有一个reject 就执行 catch
+ Promise.any 只要有一个resolve 就执行then，只有全部reject  才会执行catch
+ Promise.race 第一个执行完承诺的是resolve 就执行then，是reject  就执行catch
