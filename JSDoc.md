# JSDoc 基础知识

JSDoc和TypeScript都解决了编写和维护纯JavaScript代码的问题。然而，它们采用了不同的方法，各有利弊。

## JSDoc相对于TypeScript的优势

- **灵活性和兼容性：**JSDoc只是JavaScript注释，这意味着它可以添加到任何JavaScript代码库中，而不受语言版本的限制，并且不像TypeScript那样与编译器绑定。
- **代码注释：**JSDoc不仅可以用于类型检查，还可以用于添加更多的文档，描述函数的工作原理，并生成文档网站，从而提供价值以增强代码的可维护性和理解性。
- **无需编译步骤：**这是从TypeScript转换到JSDoc最具动力的原因之一。TypeScript需要编译将TypeScript代码转换为JavaScript，以便浏览器能够理解，而JSDoc不需要任何其他步骤，因为它们只是“注释”，这是JavaScript本身支持的特性。与每次进行更改时都需要使用必要的TypeScript构建流程相比，这可以简化并加快开发工作流程。

## 向代码块添加代码描述

```js
/** The name of the language JSDoc is written for*/
const language = "JavaScript"
```

## 为值添加类型

```js
/** 
 * This represents the writer of this blog
 * @type {string}
 */
const writerName = "Elijah"
```

## 向对象和数组添加类型

```js
/** 
* @type {Array<string>}
*/
const colours = ['red', 'blue', 'green']

/**
 * @type {number[]}
 */
const primeNumbers = [1, 2, 3, 5, 7]
```

两种方法在JSDoc中都是有效的（与Typescript相同）。

通过使用 @typedef 指令可以创建一个对象类型。

```js
/**
 * * @typedef {Object} User - A user schema 
 * @property {number} id 
 * @property {string} username
 * @property {string} email
 * @property {Array<number>} postLikes
 * @property {string[]} friends
 */

/**@type {User} */
const person1 = {
  id: 847,
  username: "Elijah",
  email: "elijah@user.com",
  postLikes: [44, 22, 24, 39],
  friends: ['fede', 'Elijah']
}
```

## 输入函数（参数、返回值和预期错误类型）

```js
/**
 * Divide two numbers.
 * @param {number} dividend - The number to be divided.
 * @param {number} divisor - The number to divide by.
 * @returns {number} The result of the division.
 */
function divideNumbers(dividend, divisor) {
    return dividend/divisor;
}
```

关键字 @param 后面定义一个类型，表示定义的函数将接受的值。你也可以在连字符（-）后面加上参数的描述。

关键字 @returns 用于定义函数返回的内容。这对于大型函数特别有用。可能很难浏览所有的代码，包括早期返回，以确定函数的预期行为。

此外，您可以使用 @throws 指令添加函数可能抛出的错误。

改进除法函数，我们可以指定如果除数为零则返回错误，并在代码中处理这种情况。

```js
/**
 * Divide two numbers.
 * @param {number} dividend - The number to be divided.
 * @param {number} divisor - The number to divide by.
 * @returns {number} The result of the division.
 * @throws {ZeroDivisionError} Argument divisor must be non-zero
 */
function divideNumbers(dividend, divisor) {
    if (divisor === 0) {
        throw new DivisionByZeroError('Cannot Divide by zero')
    }
    return dividend/divisor;
}
```

## 输入完整的类（描述、构造函数和方法）

```js
/**
 * A Rectangle Class
 * @class
 * @classdec A four-sided polygon with opposite sides of equal length and four right angles
 */
class Rectangle {
  /**
   * Initializing a Rectangle object.
   * @param {number} length - The length of the rectangle.
   * @param {number} width - The width of the rectangle.
   */
  constructor(length, width) {
    this.length = length;
    this.width = width;
  }

  /**
   * Calculate the area of the rectangle.
   * @returns {number} The area of the rectangle.
   */
  calculateArea() {
    return this.length * this.width;
  }

  /**
   * Calculate the perimeter of the rectangle.
   * @returns {number} The perimeter of the rectangle.
   */
  calculatePerimeter() {
    return 2 * (this.length + this.width);
  }
}
```

## 添加代码作者

```js
/**
  * Possible title for this article
  * @type {string} 
  * @author Elijah [elijah@example.com]
 */
const articleTitle =  "Demystifying JSDoc"
```

## 版本控制

```js
/** 
 * @version 1.0.0
 * @type {number} 
 * */
const meaningOfLife = 42
```

## 有用的链接

```js
/** 
 * How to use the link tags
 * Also see the {@link https://jsdoc.app/tags-inline-link.html official docs} for more information
 * @tutorial getting-started
 * */
function myFunction (){
}
```

