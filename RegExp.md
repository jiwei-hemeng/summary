## 关于正则表达式

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

## 正则表达式分组

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
  let reg = /[_-](\w)/g;
  return str.replace(reg, (_, char) => {
    return char.toUpperCase();
  })
}
let str = "border_top_color";
console.log(toHumpName(str)); // result: borderTopColor
```

## 断言

### 先行断言(?=)

`x(?=y)`，如果x后面跟的是y，则匹配x。如字符串`xyz`中的x会被匹配，而后面的`y`是不会被匹配的。

### 后行断言(?!)

表示后面不能跟相应的内容. `(?!\d)`表示后面不能再跟数字了

## JavaScript 正则表达式的方法

### match()

方法返回 3 个可能的值：

+ 如果正则表达式包含一个 g 标记，即为全局匹配，它将返回一个包含所有匹配项的数组，没捕获组信息；
+ 如果正则表达式没有 g 标记，它将返回一个包含第一个匹配项和其相关的捕获组的数组；
+ 如果根本没有匹配项，则返回 null 。

```js
const strText = "Hello China";
const regex = /[a-zA-Z]{1,}/g; // 大写字母正则表达式
console.log(strText.match(regex)); // [ 'Hello', 'China' ]
```

### test()

test() 用于测试指定字符串和正则表达式之间是否匹配，接受一个字符串作为其参数，并根据是否匹配返回 true 或 false 。

```js
const strText = "hello china";
const regex = /china/;
console.log(regex.test(strText)); // true
```

### search()

search() 方法是一个字符串方法，用于在字符串中搜索匹配项, 方法返回第一个匹配项在整个字符串中的位置（索引），如果没有匹配项，则返回 -1。

```js
const strText = "hello china，i love china";
const regex = /china/;
console.log(strText.search(regex)); // 6
```

### replace()

replace() 是在字符串中搜索指定的值或正则表达式并将其替换为另一个值

```js
const strText = "hello world,i love world";
const regex = /world/;
console.log(strText.replace(regex, "china")); // hello china,i love world
```

### replaceAll()

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

### 验证数字类型

```js
const reg = /^(([1-9]{1}\d*)|(0{1}))((.\d{1,})?)$/;
// 小数点后只能包含两位小数
const reg = /^(([1-9]{1}\d*)|(0{1}))((.\d{1,2})?)$/;
// 包含负数
const reg = /^(-{0,1}([1-9]{1}\d*)|(0{1}))((.\d{1,})?)$/;
reg.test(123.2323) // result: true
```

### 验证特殊字符

正则1

```js
const reg = /\$|\@|\#|\~|\!|\%|\^|\&|\*|\￥|\(|\)/;
reg.test('123'); // result: false
reg.test("12@33"); // result: true
```

正则2

```js
const reg = /\W{1,}/;
reg.test('123'); // result: false
reg.test("12@33"); // result: true
```

### 匹配汉字

```js
const reg = /[\u4E00-\u9FA5]/g;
reg.test("汉字"); // result: true
reg.test("hanzi"); // result: false
"我是".match(reg); // result: ['我', '是']
```

```js
const regs = /[\u4E00-\u9FA5]{1,}/g
"你好啊，中国！！".match(regs); // result: ['你好啊', '中国']
```

### 常用的正则

```js
// 手机号校验规则
const moblieReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
// 座机号校验规则
const phone = /^0{1,2}\d{2,3}-?\d{7,8}$|^\d{7,8}$/;
```

### 去除字符串首尾空格

```js
let pathion = "  12  23  ";
pathion = pathion.replace(/(^\s*)|(\s*$)/g, ""); // result: '12  23'
// 或者可以使用
pathion = pathion.trim(); // result: '12  23'
```

### 获取路由参数

```js
function getURLQuery(url) {
  const queryObj = {}
  url.replace(/([^?&=]+)=([^&]*)/g, (_, k, v) => queryObj[k] = v)
  return queryObj;
}
getURLQuery("http://www.baidu.com/aaaa?a=1&b=2&c=3");
```

### 数字千分位按照`,`分割

[相关链接](https://blog.csdn.net/qq_37152533/article/details/108485385)

```js
function ThousandNum(num) {
  return num.toFixed(3).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
ThousandNum(123456789); // '123,456,789'
```

`(?=(\d{3})+(?!\d))`代表的是：后面需要跟3的倍数个数字，且在这（`3`的倍数个数字）之后不能再有数字了。
