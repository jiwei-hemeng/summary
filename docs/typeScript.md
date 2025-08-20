## typeScript

### 什么是typeScript?

> TypeScript是JavaScript的超集，TypeScript的数据类型就是JavaScript的数据类型，大致可以分为基本数据类型和对象类型，基本类型包括boolean、number、string、undefine以及在ES6中的新类型Symbol和ES10中的新类型BigInt

+ TypeScript 是添加了类型系统的 JavaScript，适用于任何规模的项目。
+ TypeScript 是一门静态类型、弱类型的语言。
+ TypeScript 是完全兼容 JavaScript 的，它不会修改 JavaScript 运行时的特性。
+ TypeScript 可以编译为 JavaScript，然后运行在浏览器、Node.js 等任何能运行 JavaScript 的环境中。
+ TypeScript 拥有很多编译选项，类型检查的严格程度由你决定。

### boolean类型

boolean类型是最基本的数据类型，只有false和true两个值，在TypeScript可以通过以下代码来声明boolean类型

```ts
let isDone: boolean = false;
```

其中需要注意的是使用构造函数Boolean构造的对象并不死boolean值，而是一个对象：

```ts
let createByNewBoolean: Boolean = new Boolean(1);
```

### number类型

```ts
let decLiteral: number = 6;
//16进制数
let hexLiteral: number = 0xf00d;
//二进制数
let binaryLiteral: number = 0b1010;
//八进制数
let octalLiteral: number = 0O744;
let notNumber: number = NaN;
let infinityNumber: number = Infinity;
```

### 字符串string

```ts
let myName: string = "Tom";
let myAge: number = 26;
```

### 数组

**类型+方括号表示法**

```ts
let numberArray: number[] = [1, 1, 2, 3];
```

**数组泛型**

```ts
let numberArray: Array<number> = [1, 2, 3, 4, 5]
```

**any在数组中的使用**

```ts
let list: any[] = ['xcatliu', 25, { website: 'http://xcatliu.com' }];
```

### void

在JavaScript中没有void的概念，在TypeScript中void表示不是任何类型，常用于函数没有返回值：

```ts
function alertName(): void {
    alert('My name is Tom');
}
```

### Any类型

如果变量是一个普通的类型，在赋值的过程中是不可以改变类型的，例如一下如果声明为string类型如果渎职number则会报错：

```ts
ley myNumber: string = "six";
myNumber = 6; // 报错
```

但是如果是any类型，则可以赋值为任意类型：

```ts
let myFavoriteNumber: any = 'seven';
myFavoriteNumber = 7;
```

### 联合类型

联合类型（Union Types）表示取值可以为多个类型中的一种，联合类型使用|分隔每一个类型，例子如下：

```ts
let myFavoriteNumber: string | number;
myFavoriteNumber = "seven";
myFavoriteNumber = 7;
```

### 访问联合类型的属性或方法

```ts
function getLength(something: string | number): number {
    return something.length;
}
```

在上述例子中会报错，因为number是没有length属性的，如果访问共有属性则没有问题，例子如下：

```ts
function getString(something: string | number): string {
    return something.toString();
}
```

## 什么是接口

> 接口是一个非常重要的概念，它是对于行为的抽象，具体的行为是需要由类去实现的。在TypeScript中接口是一个非常灵活的概念，除了可用于对类的一部分行为进行抽象外，也可以用于对对象的`形状`进行描述，这里的形状就可以理解为对象的属性。

一个简单的例子如下:

```ts
interface Person {
    name: string;
    age: number;
}
let tom: Person = {
    name: "Tom",
    age: 25
}
```

在上面的例子中，我们定义来一个接口Person，接着定义了一个变量tom，它的类型是Person，这样就约束了tom的属性必须和接口一致，如果少了或者多了属性都会报错。

### 可选属性

```ts
interface Person {
    name: string;
    age?: number;
}
let tom: Person = {
    name: "Tom"
}
let jerry: Person = {
    name: "Jerry",
    age: 24
}
```

从上述例子可以看出可以通过?来设置可选属性，如果一个属性设置为可选属性，那么该属性可以存在也可以不存在。通过可选属性可以设置属性存不存在，但是还是不能添加属性，否则回报错

### 任意属性

有时候我们会希望一个接口允许有任意的属性，可以使用以下方式：

```TS
interface Person {
    name: string;
    age?: number;
    [propName: string]: any
}

let jerry: Person = {
    name: "Jerry",
    gender: "male"
}
```

### 只读属性

有时候我们希望对象中的一些字段只能在创建的时候被赋值，那么可以用 readonly 定义只读属性：

```ts
interface Person {
    readonly id: number;
    name: string;
    age?: number;
    [propName: string]: string | number
}

let jerry: Person = {
    id: 9527,
    name: "Jerry",
    age: 25,
    gender: "male"
}

jerry.id = 213 // 报错，只读属性
```

### 函数

```ts
function sun(x: number, y: number): number {
    return x + y;
}
```

说明： 表示这是个需要参数x是number 类型、y是number 类型，返回值是number 类型 的函数

如果是函数表达式可以如下定义：

```ts
let sum = function (x: number, y: number): number {
    return x + y;
}
```

可选参数

```ts
function buildName(firstName: string, lastName?: string) {
    if (lastName) {
        return firstName + " " + lastName;
    } else {
        return firstName;
    }
}
```

参数默认值

```ts
function buildName(firstName: string, lastName: string = "Cat") {
    if (lastName) {
        return firstName + " " + lastName;
    } else {
        return firstName;
    }
}
```

剩余参数

```ts
function push(array, ...items) {
    items.forEach(function(item) {
        array.push(item);
    });
}
let a: any[] = [];
push(a, 1, 2, 3);
```

## vue 相关

### 在 Composition API 中获取组件实例的引用

```ts
import {ref} from "vue";

// 这是一个泛型函数，接受一个组件构造函数作为参数
export default function <T extends new (...args: any[]) => void>(_comp: T) {
  // 返回一个 ref，其值的类型是指定组件构造函数的实例类型
  return ref<InstanceType<T>>();
}
```

使用
```ts
import useCompRef from "./useCompRef";
const formRef = useCompRef(ELForm)
formRef.value?.submit()
```

## TypeScript （TS）中的InstanceType

> TypeScript （TS）中的InstanceType是内置类型操作符，用于从类构造函数中提取实例类型。其核心功能是获取类构造函数的实例类型，常用于类型推断和通用函数定义

```ts
class MyClass {  
  name: string;  
  age: number;  
  constructor(name: string, age: number) {  
    this.name = name;  
    this.age = age;  
  }  
}  
type MyInstance = InstanceType<typeof MyClass>;  
let instance: MyInstance = new MyClass("John", 25);  
```

## 泛型（Generics）

函数泛型

```ts
// 简单的身份函数
function echo<T>(arg: T): T {
    return arg;
}

const result = echo("hello");  // T 被推断为 string
const result2 = echo<number>(123); // 显式指定 T 为 number
```

接口泛型

```ts
interface ApiResponse<T> {
    code: number;
    data: T;  // data 的类型由使用时的 T 决定
    message: string;
}

// 使用
const userResponse: ApiResponse<User> = {
    code: 200,
    data: { id: 1, name: "John" },  // data 必须是 User 类型
    message: "success"
};

const productResponse: ApiResponse<Product> = {
    code: 200,
    data: { id: 1, price: 100 },  // data 必须是 Product 类型
    message: "success"
};
```

类泛型

```ts
class Box<T> {
    private content: T;
    
    constructor(value: T) {
        this.content = value;
    }
    
    getValue(): T {
        return this.content;
    }
}

// 使用
const numberBox = new Box<number>(42);
const stringBox = new Box<string>("hello");
```

类型别名泛型

```ts
type Pair<T, U> = {
    first: T;
    second: U;
};

// 使用
const numberStringPair: Pair<number, string> = {
    first: 1,
    second: "hello"
};
```

## TypeScript 内置方法

### Uppercase 化为大写

使用`Uppercase`方法将其全部转化为大写。

```ts
type Role = "admin" | "user" | "guest";
// 不好的做法 💩
type UppercaseRole = "ADMIN" | "USER" | "GUEST";
// 正确的做法 ✅
type UppercaseRole = Uppercase<Role>; // "ADMIN" | "USER" | "GUEST"
```

### Lowercase 转化为小写

使用`Lowercase`方法将其全部转化为小写。

```ts
type Role = "ADMIN" | "USER" | "GUEST";
*// 不好的做法 💩*
type LowercaseRole = "admin" | "user" | "guest";
*// 正确的做法 ✅*
type LowercaseRole = Lowercase<Role>; *// "admin" | "user" | "guest"*
```

### Capitalize 首字母大写

将所有属性的首字母大写

```ts
type Role = "admin" | "user" | "guest";
// 不好的做法 💩
type CapitalizeRole = "Admin" | "User" | "Guest";
// 正确的做法 ✅
type CapitalizeRole = Capitalize<Role>; // "Admin" | "User" | "Guest"
```

### Uncapitalize 取消首字母大写

与`Capitalize`相反，将所有属性取消首字母大写。

```ts
type Role = "Admin" | "User" | "Guest";
// 不好的做法 💩
type UncapitalizeRole = "admin" | "user" | "guest";
// 正确的做法 ✅
type UncapitalizeRole = Uncapitalize<Role>; // "admin" | "user" | "guest"
```

### Partial 可选属性

将定义的接口中的属性设置为可选属性。

```ts
interface User {
  name: string;
  age: number;
  password: string;
}
// 不好的做法 💩
interface PartialUser {
  name?: string;
  age?: number;
  password?: string;
}
// 正确的做法 ✅
type PartialUser = Partial<User>;
```

###  Required 设置为必需

与Partial相反，Required可以将接口中的可选属性设置为必需。

```ts
interface User {
  name?: string;
  age?: number;
  password?: string;
}
// 不好的做法 💩
interface RequiredUser {
  name: string;
  age: number;
  password: string;
}
// 正确的做法 ✅
type RequiredUser = Required<User>;
```

### Readonly 设置为只读

将属性设置为只读

```ts
interface User {
  role: string;
}
// 不好的做法 💩
const user: User = { role: "ADMIN" };
user.role = "USER";
// 正确的做法 ✅
type ReadonlyUser = Readonly<User>;
const user: ReadonlyUser = { role: "ADMIN" };
user.role = "USER"; // 将属性'role'设置为只读后，再次对'role'设值就会报错
```

### Record 映射一个类型的属性到另一个类型

构造一个对象类型，其属性key是`Keys`,属性value是`Tpye`。被用于映射一个类型的属性到另一个类型。

```ts
interface Address {
  street: string;
  pin: number;
}
interface Addresses {
  home: Address;
  office: Address;
}
// Alternative ✅
type AddressesRecord = Record<"home" | "office", Address>;
```

### Pick 取出几个想要的类型

就是从一个复合类型中，取出几个想要的类型的组合，例如：

```ts
interface User {
  name: string;
  age: number;
  password: string;
}
// 不好的做法 💩
interface UserPartial {
  name: string;
  age: number;
}
// 正确的做法 ✅
type UserPartial = Pick<User, "name" | "age">;
```

### Omit 剔除某些属性

`Omit`是TypeScript3.5新增的一个辅助类型，它的作用主要是：以一个类型为基础支持剔除某些属性，然后返回一个新类型。

```ts
interface User {
  name: string;
  age: number;
  password: string;
}
// 不好的做法 💩
interface UserPartial {
  name: string;
  age: number;
}
// 正确的做法 ✅
type UserPartial = Omit<User, "password">;
```

### Exclude  属性排除

将类型中其中一些属性排除，并创建排除属性后的新类型。

```ts
type Role = "ADMIN" | "USER" | "GUEST";
// 不好的做法 💩
type NonAdminRole = "USER" | "GUEST";
// 正确的做法 ✅
type NonAdmin = Exclude<Role, "ADMIN">; // "USER" | "GUEST"
```

### Extract 分配给联合的类型中提取所有联合成员来创建新类型

它通过从可分配给联合的类型中提取所有联合成员来创建新类型。

```ts
type Role = "ADMIN" | "USER" | "GUEST";

// 不好的做法 💩
type AdminRole = "ADMIN";

// 正确的做法 ✅
type Admin = Extract<Role, "ADMIN">; // "ADMIN"
```

### NonNullable 从类型中排除`null`和`undefined`来创建新类型

通过从类型中排除`null`和`undefined`来创建新类型。

```ts
type Role = "ADMIN" | "USER" | null;
// 不好的做法 💩
type NonNullableRole = "ADMIN" | "USER";
// 正确的做法 ✅
type NonNullableRole = NonNullable<Role>; // "ADMIN" | "USER"
```
