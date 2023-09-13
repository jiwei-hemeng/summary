## this 指向问题

> this 是在调用的时候才会确定指代谁；而作用域是在定义的时候就决定；this  指代的是某个对象或者window

- 在普通函数中，this指向 *window*
- 在事件处理程序中，this 指向  *事件源*
- 在构造函数中，this 指向 创建的对象
- 在对象的方法中，this 指向当前方法所属的对象

## Bind、Call() 和apply的区别

### 区别

- apply()方法 接收两个参数，一个是函数运行的作用域（this），另一个是参数数组，会立即执行
- call()方法 第一个参数和apply()方法的一样，但是传递给函数的参数必须列举出来，会立即执行
- Bind()和call很相似，第一个参数是this的指向，从第二个参数开始是接收的参数列表，不会立即执行

### Apply 实现

```js
Function.prototype.apply = function (context, params) {
  if(typeof context === 'undefined' || context === null) {
    context = window;
  }
  let self = this, result;
  let key = Symbol("KEY");
  context[key] = self;
  if(params) {
    result = context[key](...params);
  } else {
    result = context[key]();  
  }
  delete context[key]
  return result;
}
```

### Bind 实现

```js
Function.prototype.bind = function (context, ...params) {
  if(typeof context === 'undefined' || context === null) {
    context = window;
  }
  let self = this;
  let key = Symbol("KEY");
  context[key] = self;
  return function (...args) {
    context[key](params.concat(args));
    delete context[key];
  };
}
```

### Call 实现

```js
Function.prototype.call = function (context, ...params) {
  if(typeof context === 'undefined' || context === null) {
    context = window;
  }
  let self = this, result;
  let key = Symbol("KEY");
  context[key] = self;
  if(params) {
    result = context[key](...params);
  } else {
    result = context[key]();  
  }
  delete context[key]
  return result;
}
```

##  构造函数的成员

实例成员：构造函数内部的成员，只能通过实例对象调用

```js
function Star(uname, age) {
  this.uname = uname;
  this.age = age;
}
const obj = new Star("zfs", 18)
console.log(obj.name); // 只能通过实例对象调用
```

静态成员： 在构造函数本身上添加的成员，只能由构造函数本身访问

```js
function Star() {}
Star.sex = "男"
console.log(Star.sex); // 只能由构造函数本身访问
```

##  es5中的继承

> 继承的优点： 可以更好的共享属性和方法

**继承方式有以下几种**

- 原型继承
- 构造继承
- 实例继承
- call/apply继承（组合继承）
- ES6 使用class extends 继承

### 构造函数的继承

> 原理： 在子类使用call方法改变this指向即可

```js
function Father(uname, age) {
  this.uname = uname;
  this.age = age;
}
function Son(uname, age, score) {
  Father.call(this, uname, age); // 在子类使用call方法改变this指向即可
  this.score = score;
}
const obj = new Son("zsf", 23, 99);
console.log(obj);    // result: {uname: "zsf", age: 23, score: 99}
```

**优点：**

解决了原型链继承中子类实例共享父类引用对象的问题，实现了多继承，创建子类实例时，可以向父类传递参数

**缺点**

构造继承只能继承父类实例属性和方法，不能继承父类原型上的属性和方法

### 原型链的继承

> 原理： 将父类的实例对象赋值给子类的原型对象，再使用子类的constructor指向子类的构造函数

```js
function Father() {}
Father.prototype.say = function () {
  console.log("hello, 我是父类的方法")
}
function Son() {}
Son.prototype = new Father();
Son.prototype.constructor = Son;
Son.prototype.hi = function () {
  console.log("hi, 我是子类的方法")
}
let obj = new Son();
obj.say(); // hello, 我是父类的方法
obj.hi(); // hi, 我是子类的方法
```

**优点**

继承了父类的模板，又继承了父类的原型对象

**缺点**

无法实现多继承，无法向父类的构造函数传递参数

### 组合继承

组合继承是将原型链继承和构造函数的继承组合在一起。

+ 使用**原型链继承**来保证子类能够继承到父类原型中的属性和方法
+ 使用**构造函数继承**来保证子类能继承到父类实例的属性和方法

### 寄生组合式继承

>  构造函数 + 原型链 方式，一方面在子构造函数中调用了父类构造函数，一方面又给子构造函数的原型 new了父构造函数，相当于两次调用父类构造函数。前者是我们所需要的步骤，即让父类构造函数属性成为子类实例属性不被共享，而后者会导致父类的属性在子类构造函数原型上，被所有对象所共享，这是我们不需要的。

```js
function Parent(name) {
  this.name = name
}
Parent.prototype.getName = function () {
  return this.name
}

function Son(name, age) {
  // 这里其实就等于 this.name = name
  Parent.call(this, name)
  this.age = age
}

Son.prototype.getAge = function () {
  return this.age
}
Son.prototype.__proto__ = Object.create(Parent.prototype)

const son1 = new Son('shao', 20)

console.log(son1.getName()) // shao
console.log(son1.getAge()) // 20
```

## es6 中的继承

```js
class Father {
  constructor(uname, age) {
    this.uname = uname;
    this.age = age;
  }
  say() {
    console.log("hello, 我是父类的方法")
  }
}
class Son extends Father {
  constructor(uname, age, score) {
    super(uname, age);
    this.score = score;
  }
  hi() {
    console.log("hi, 我是子类的方法")
  }
}
const obj = new Son("zsf", 22, 98);
console.log(obj); // result: {uname: "zsf", age: 22, score: 98}
obj.say(); // hello, 我是父类的方法
obj.hi(); // hi, 我是子类的方法
```
## instanceof底层是如何工作的

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
// 调用: per instanceof Person
instance_of(per, Person)
```

## new 操作符具体干了什么

+ 创建了一个空对象

  ```js
  let obj = new Object();
  ```

+ 设置原型链

  ```js
  obj.__proto__ = Func.prototype;
  ```

+ 改变Func 中的this指向，并指向Fun函数体

  ```js
  let result = Func.call(this);
  ```

+ 将创建的该对象返回

## 完整的原型图

![完整的原型图](https://user-images.githubusercontent.com/62381906/164414464-35968d69-3ddd-4936-9b26-b96fb1357b38.jpg)

