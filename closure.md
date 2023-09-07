# 闭包 

> [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)

## 定义

**闭包**（closure）是一个函数以及其捆绑的周边环境状态（**lexical environment**，**词法环境**）的引用的组合。换而言之，闭包让开发者可以从内部函数访问外部函数的作用域。在 JavaScript 中，闭包会随着函数的创建而被同时创建。

### 本质

闭包是将函数内部和函数外部连接起来的桥梁。

### 形成闭包的必要条件：

- 两个函数形成嵌套关系
- 内部函数访问外部函数的变量

### 闭包的例子

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

### 优点

外部函数能访问到内部变量

延长变量的生命周期（函数内部的变量是局部变量垃圾回收机制不能自动清除，所以会延长生命周期）

### 缺点

会形成数据的缓存，用完之后需要手动清空（给该变量赋一个空值null）

### 为啥没有销毁变量

+ 被赋值就有了引用关系，那么内部的函数就不会销毁（其函数的作用域自然也就不会销毁）
+ 闭包的作用域：在函数**定义**的地方开始向上查找

## 使用

### 用闭包模拟私有方法

> 编程语言中，比如 Java，是支持将方法声明为私有的，即它们只能被同一个类中的其它方法所调用。而 JavaScript 没有这种原生支持，但我们可以使用闭包来模拟私有方法。私有方法不仅仅有利于限制对代码的访问：还提供了管理全局命名空间的强大能力，避免非核心的方法弄乱了代码的公共接口部分。

```js
var makeCounter = function() {
  var privateCounter = 0;
  function changeBy(val) {
    privateCounter += val;
  }
  return {
    increment: function() {
      changeBy(1);
    },
    decrement: function() {
      changeBy(-1);
    },
    value: function() {
      return privateCounter;
    }
  }
};

var Counter1 = makeCounter();
var Counter2 = makeCounter();
console.log(Counter1.value()); /* logs 0 */
Counter1.increment();
Counter1.increment();
console.log(Counter1.value()); /* logs 2 */
Counter1.decrement();
console.log(Counter1.value()); /* logs 1 */
console.log(Counter2.value()); /* logs 0 */
```

### 模拟块级作用域

```js
for (var i = 0; i < 10; i++) {
  (function(i) {
    setTimeout(() => {
      console.log(i)
    }, 5000)
  })(i)
}
```

### 柯里化

> 柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数(最初函数的第一个参数)的函数，并且返回接受余下的参数且返回结果的新函数的技术。

```js
function foo() {
  console.log(this.name);
}
const obj = {
  name: "xiaom",
};
const obj1 = {
  name: "xiaoh"
}
function curryingFn(fn) {
  return (obj) => {     
    return fn.bind(obj)
  }
}
const newFoo = curryingFn(foo)
newFoo(obj)() // xiaom
newFoo(obj1)() // xiaoh
```

**柯里化实例**

```js
function curring(reg) {
  return (str) => {
    return reg.test(str);
  };
}
var checkPhone = curring(/^1[34578]\d{9}$/);
var checkEmail = curring(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/);
console.log(checkPhone("183888888")); // false
console.log(checkPhone("17654239819")); // true
console.log(checkEmail("exy@163.com")); // true
```

### 防抖与节流

```js
// 防抖
function debounce(fn, wait = 50) {
  let timer;
  return function () {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
    }, wait);
  };
}
// 节流
function throttle(fn, wait = 50) {
  let canRun = true;
  return function () {
    if (canRun) {
      setTimeout(() => {
        fn.apply(this, arguments);
        canRun = true;
      }, wait);
      canRun = false;
    }
  };
}
```

### 树形数组转普通数组

```js
export function treeToArr(data) {
  const result = [];
  data.forEach(item => {
    const loop = data => {
      result.push({
        id: data.key, // 此处的id对应子节点的parentId
        termName: data.termName,
        termValue: data.termValue,
        parentId: data.parentId
      });
      let child = data.children
      if (child) {
        for (let i = 0; i < child.length; i++) {
          loop(child[i])
        }
      }
    }
    loop(item);
  })
  return result;
}
```

### 普通数组转树形数组

```js
export function arrToTree(data, pId) {
  const loop = parentId => {
    const res = []
    data.forEach(item => {
      if (item.parentId === parentId) {
        const childArr = loop(item.id);
        if(childArr.length > 0) {
          item.children = childArr;
        } 
        res.push(item)
      }
    })
    return res
  }
  return loop(pId)
}
```

