### 关于*var* 、 *const* 、*let* 的区别

|       | 初始值   | 更改值 | 重新声明 | 变量提升 | 块级作用域 | window调用 |
| ----- | -------- | ------ | -------- | -------- | ---------- | ---------- |
| var   | 可有可无 | √      | √        | √        | ×          | √          |
| const | 必须有   | ×      | ×        | ×        | √          | ×          |
| let   | 可有可无 | √      | ×        | ×        | √          | ×          |

### 箭头函数与普通函数的异同？

+ 普通函数 *this* 指向 window；箭头函数没有 *this* 指向，所以箭头函数的 *this* 指向上级作用域
+ 普通函数有arguments；而箭头函数没有必须使用剩余参数 *...* 
+ 箭头函数不能用于构造函数: 普通函数可以用于构造函数

### Set 新的数据类型

> `Set`是ES6引入的一种类似Array的新的数据结构，Set实例的成员类似于数组item成员
>
> `区别`是Set实例的成员都是唯一，不重复的。这个特性可以轻松地实现数组去重

```js
var arr = [1,2,3,4,5,6];
var newArr = [...new Set(...arr)];
```

### Map 新的数据类型

>  `Map`是ES6引入的一种类似`Object`的新的数据结构。
> `Map`可以理解为是`Object`的超集，**打破了以传统键值对形式定义对象，对象的key不再局限于字符串，也可以是Object**。可以更加全面的描述对象的属性。 

```js
let myMap = new Map()
const obj = {p: "123"}
myMap.set(obj, "ok")
myMap.size() // 1
myMap.get(obj) // "ok"
myMap.has(obj) // true
map.delete(obj) // true
myMap.has(obj) // false
myMap.clear() // 清除所有
myMap.keys() // 返回键名的遍历器
myMap.values() // 返回值的遍历器
```

### Symbol 数据类型

> synbol, 表示独一无二的值，每个symbol类型的值都不相同。特点不能使用new 关键字调用它

```js
let sy = Symbol("test");
let sy1 = Symbol("test");
console.log(tepeof sy) // "symbol"
sy == sy1; // false
```

### **es6中的class**

```js
class Person {
  constructor(age) {
    this.age = age
  }
}
class Student extends Person {
    constructor(name){
        // 如果有super必须写在最强面
      	super()
        this.name = name
    }
    doSth(){
        console.log(this.name)
    }
}
let s1 = new Student('若川')
s1.doSth();
```

### **模板字符串**

```js
let str = `bhjdc ${item}`
```

### **promise的异步封装**

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

### 函数默认值

> ES6 之前，函数的形参是无法给默认值的，只能在函数内部通过变通的方法实现。

```js
function ES6func(a=1, b=2) {
  console.log(a, b)
}
ES6func()  // 1, 2
```

### 关于ES6的 `Proxy`

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
        console.log("xhg", target, key);
        return target[key];
    },
    set(target, key, value) {
        if (key === "age" && typeof value !== "number") {
            throw Error("age字段必须为Number类型");
        }
        return Reflect.set(target, key, value);
    },
});
console.log("姓名", person.name);
person.age = 20;
console.log("年龄", person.age);
person.cls = "1-2"; // 不是响应式的不能修改
```

### Reflect

> **Reflect** 是一个内置的对象，它提供拦截 JavaScript 操作的方法。与大多数全局对象不同`Reflect`并非一个构造函数，所以不能通过[new运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)对其进行调用，或者将`Reflect`对象作为一个函数来调用。`Reflect`的所有属性和方法都是静态的（就像[`Math`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math)对象）。

**静态方法**

+ Reflect.set(target, key, value)   在一个对象上设置一个属性, 返回一个[`Boolean`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean)，如果更新成功，则返回`true`
+ Reflect.has(target, key)  检测一个对象是否存在特定属性,返回一个[`Boolean`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean)，如果存在，则返回`true`
+ Reflect.deleteProperty(target, key) 允许用于删除属性, 如果删除成功，则返回`true`

### **async** 函数

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

