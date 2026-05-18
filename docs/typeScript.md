## typeScript

### 什么是 typeScript?

> TypeScript 是 JavaScript 的超集，TypeScript 的数据类型就是 JavaScript 的数据类型，大致可以分为基本数据类型和对象类型，基本类型包括 boolean、number、string、undefine 以及在 ES6 中的新类型 Symbol 和 ES10 中的新类型 BigInt

- TypeScript 是添加了类型系统的 JavaScript，适用于任何规模的项目。
- TypeScript 是一门静态类型、弱类型的语言。
- TypeScript 是完全兼容 JavaScript 的，它不会修改 JavaScript 运行时的特性。
- TypeScript 可以编译为 JavaScript，然后运行在浏览器、Node.js 等任何能运行 JavaScript 的环境中。
- TypeScript 拥有很多编译选项，类型检查的严格程度由你决定。

### boolean 类型

boolean 类型是最基本的数据类型，只有 false 和 true 两个值，在 TypeScript 可以通过以下代码来声明 boolean 类型

```ts
let isDone: boolean = false;
```

其中需要注意的是使用构造函数 Boolean 构造的对象并不死 boolean 值，而是一个对象：

```ts
let createByNewBoolean: Boolean = new Boolean(1);
```

### number 类型

```ts
let decLiteral: number = 6;
//16进制数
let hexLiteral: number = 0xf00d;
//二进制数
let binaryLiteral: number = 0b1010;
//八进制数
let octalLiteral: number = 0o744;
let notNumber: number = NaN;
let infinityNumber: number = Infinity;
```

### 字符串 string

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
let numberArray: Array<number> = [1, 2, 3, 4, 5];
```

**any 在数组中的使用**

```ts
let list: any[] = ["xcatliu", 25, { website: "http://xcatliu.com" }];
```

### void

在 JavaScript 中没有 void 的概念，在 TypeScript 中 void 表示不是任何类型，常用于函数没有返回值：

```ts
function alertName(): void {
  alert("My name is Tom");
}
```

### Any 类型

如果变量是一个普通的类型，在赋值的过程中是不可以改变类型的，例如一下如果声明为 string 类型如果渎职 number 则会报错：

```ts
ley myNumber: string = "six";
myNumber = 6; // 报错
```

但是如果是 any 类型，则可以赋值为任意类型：

```ts
let myFavoriteNumber: any = "seven";
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

在上述例子中会报错，因为 number 是没有 length 属性的，如果访问共有属性则没有问题，例子如下：

```ts
function getString(something: string | number): string {
  return something.toString();
}
```

## 什么是接口

> 接口是一个非常重要的概念，它是对于行为的抽象，具体的行为是需要由类去实现的。在 TypeScript 中接口是一个非常灵活的概念，除了可用于对类的一部分行为进行抽象外，也可以用于对对象的`形状`进行描述，这里的形状就可以理解为对象的属性。

一个简单的例子如下:

```ts
interface Person {
  name: string;
  age: number;
}
let tom: Person = {
  name: "Tom",
  age: 25,
};
```

在上面的例子中，我们定义来一个接口 Person，接着定义了一个变量 tom，它的类型是 Person，这样就约束了 tom 的属性必须和接口一致，如果少了或者多了属性都会报错。

### 可选属性

```ts
interface Person {
  name: string;
  age?: number;
}
let tom: Person = {
  name: "Tom",
};
let jerry: Person = {
  name: "Jerry",
  age: 24,
};
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
  [propName: string]: string | number;
}

let jerry: Person = {
  id: 9527,
  name: "Jerry",
  age: 25,
  gender: "male",
};

jerry.id = 213; // 报错，只读属性
```

### 函数

```ts
function sun(x: number, y: number): number {
  return x + y;
}
```

说明： 表示这是个需要参数 x 是 number 类型、y 是 number 类型，返回值是 number 类型 的函数

如果是函数表达式可以如下定义：

```ts
let sum = function (x: number, y: number): number {
  return x + y;
};
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
  items.forEach(function (item) {
    array.push(item);
  });
}
let a: any[] = [];
push(a, 1, 2, 3);
```

### 获取函数参数的类型

```ts
import { login } from "./api";
// 0 表示第一个参数
const params: Parameters<typeof login>[0] = {
  username: "jiwei",
  pwd: "123123",
};
```

### 防抖函数如何做类型标注

```ts
export default function debounce<T extends any[], R>(
  fn: (...args: T) => R,
  delay: number
): (...args: T) => R | undefined {
  let timer: ReturnType<typeof setTimeout> | null;
  let lastResult: R | undefined;

  return (...args: T): R | undefined => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      lastResult = fn(...args);
    }, delay);
    return lastResult;
  };
}
```

### 获取函数返回值的类型

```ts
const resp: ReturnType<typeof login> = {};
```

## vue 相关

### 在 Composition API 中获取组件实例的引用

```ts
import { ref } from "vue";

// 这是一个泛型函数，接受一个组件构造函数作为参数
export default function <T extends new (...args: any[]) => void>(_comp: T) {
  // 返回一个 ref，其值的类型是指定组件构造函数的实例类型
  return ref<InstanceType<T>>();
}
```

使用

```ts
import useCompRef from "./useCompRef";
const formRef = useCompRef(ELForm);
formRef.value?.submit();
```

## TypeScript （TS）中的 InstanceType

> TypeScript （TS）中的 InstanceType 是内置类型操作符，用于从类构造函数中提取实例类型。其核心功能是获取类构造函数的实例类型，常用于类型推断和通用函数定义

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

## ts 中的对象观测器

```ts
type Watcher<T> = {
  on<K extends string & keyof T>(
    eventName: `${K}Changed`,
    callback: (newValue: T[K], oldValue: T[K]) => void,
  ): void;
  value: T;
};

function watch<T extends object>(obj: T): Watcher<T> {
  const eventMap = new Map<
    `${string & keyof T}Changed`,
    Array<(newVal: any, oldVal: any) => void>
  >();

  // 代理对象（只有修改这个，才会触发监听）
  const proxy = new Proxy(obj, {
    set(target, propertyKey: string | symbol, value, receiver) {
      if (typeof propertyKey !== "string") {
        return Reflect.set(target, propertyKey, value, receiver);
      }

      const oldValue = Reflect.get(target, propertyKey, receiver);
      const success = Reflect.set(target, propertyKey, value, receiver);

      if (oldValue !== value) {
        const eventName =
          `${propertyKey}Changed` as `${string & keyof T}Changed`;
        const callbacks = eventMap.get(eventName);
        callbacks?.forEach((cb) => cb(value, oldValue));
      }

      return success;
    },
  });

  return {
    on(eventName, callback) {
      const prop = eventName.replace("Changed", "") as keyof T;
      if (!(prop in proxy)) {
        console.warn(`监听无效：对象不存在属性 ${String(prop)}`);
        return;
      }
      if (!eventMap.has(eventName)) {
        eventMap.set(eventName, []);
      }
      eventMap.get(eventName)!.push(callback);
    },
    // 👇 把代理对象暴露出去
    value: proxy,
  };
}

const personWatch = watch({
  name: "张三",
  age: 28,
  sex: "男",
});

// 监听 age 变化
personWatch.on("ageChanged", (newValue, oldValue) => {
  console.log("年龄变化：", newValue, oldValue);
});

// 监听 name 变化
personWatch.on("nameChanged", (newVal, oldVal) => {
  console.log("姓名变化：", newVal, oldVal);
});

// ✅ 关键：必须修改 .value 上的属性！
personWatch.value.age = 29; // 输出：年龄变化：29 28
personWatch.value.name = "李四"; // 输出：姓名变化：李四 张三
```

## 泛型（Generics）

> [相关链接](https://www.bookstack.cn/read/wangdoc-typescript-tutorial/docs-generics.md)

### 函数泛型

```ts
// 简单的身份函数
function echo<T>(arg: T): T {
  return arg;
}

const result = echo("hello"); // T 被推断为 string
const result2 = echo<number>(123); // 显式指定 T 为 number
```

函数名后面尖括号的部分<T>，就是类型参数，参数要放在一对尖括号（<>）里面。本例只有一个类型参数 T，可以将其理解为类型声明需要的变量，需要在调用时传入具体的参数类型

多个类型参数的例子

```ts
function map<T, U>(arr: T[], f: (arg: T) => U): U[] {
  return arr.map(f);
}
// 用法实例
const newarr = map<string, number>(["1", "2", "3"], (n) => parseInt(n)); // 返回 [1, 2, 3]
```

类型参数的约束条件

```ts
function comp<T extends { length: number }>(a: T, b: T) {
  if (a.length >= b.length) {
    return a;
  }
  return b;
}
```

上面示例中，T extends { length: number }就是约束条件，表示类型参数 T 必须满足{ length: number }，否则就会报错

```ts
comp([1, 2], [1, 2, 3]); // 正确
comp("ab", "abc"); // 正确
comp(1, 2); // 报错
```

类型参数的约束条件采用下面的形式。

```ts
<TypeParameter extends ConstraintType>
```

上面语法中，TypeParameter 表示类型参数，extends 是关键字，这是必须的，ConstraintType 表示类型参数要满足的条件，即类型参数应该是 ConstraintType 的子类型。

类型参数可以同时设置约束条件和默认值，前提是默认值必须满足约束条件。

```ts
type Fn<A extends string, B extends string = "world"> = [A, B];
type Result = Fn<"hello">; // ["hello", "world"]
```

上面示例中，类型参数 A 和 B 都有约束条件，并且 B 还有默认值。所以，调用 Fn 的时候，可以只给出 A 的值，不给出 B 的值。

如果有多个类型参数，一个类型参数的约束条件，可以引用其他参数。

```ts
<T, U extends T>
// 或者
<T extends U, U>
```

上面示例中，U 的约束条件引用 T，或者 T 的约束条件引用 U，都是正确的。

但是，约束条件不能引用类型参数自身。

```ts
<T extends T>               // 报错
<T extends U, U extends T>  // 报错
```

上面示例中，T 的约束条件不能是 T 自身。同理，多个类型参数也不能互相约束（即 T 的约束条件是 U、U 的约束条件是 T），因为互相约束就意味着约束条件就是类型参数自身。

### 接口泛型

```ts
interface ApiResponse<T> {
  code: number;
  data: T; // data 的类型由使用时的 T 决定
  message: string;
}

// 使用
const userResponse: ApiResponse<User> = {
  code: 200,
  data: { id: 1, name: "John" }, // data 必须是 User 类型
  message: "success",
};

const productResponse: ApiResponse<Product> = {
  code: 200,
  data: { id: 1, price: 100 }, // data 必须是 Product 类型
  message: "success",
};
```

### 类泛型

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

### 类型别名泛型

```ts
type Pair<T, U> = {
  first: T;
  second: U;
};

// 使用
const numberStringPair: Pair<number, string> = {
  first: 1,
  second: "hello",
};
```

## ts 中的 infer

```ts
// 场景一: 获取函数类型的返回值

type sum = (a: number, b: number) => number;
type RETEN<T> = T extends (...arg: any[]) => infer R ? R : T;
const sumResult: RETEN<sum> = 123;

// 场景二: 获取函数类型的第一个参数

type FirsArg<T> = T extends (a: infer R, ...arg: any[]) => any ? R : T;
const fa: FirsArg<sum> = 123;

// 场景三: 获取函数类型的第一个参数

type PromiseType<T> = T extends Promise<infer R> ? R : T;
const pt: PromiseType<Promise<string>> = "123";

// 场景四: 获取数组的类型

type ArrayType<T> = T extends (infer U)[] ? U : T;

type ItemType = ArrayType<[number, string, null]>;
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

### Required 设置为必需

与 Partial 相反，Required 可以将接口中的可选属性设置为必需。

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

构造一个对象类型，其属性 key 是`Keys`,属性 value 是`Tpye`。被用于映射一个类型的属性到另一个类型。

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

`Omit`是 TypeScript3.5 新增的一个辅助类型，它的作用主要是：以一个类型为基础支持剔除某些属性，然后返回一个新类型。

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

### Exclude 属性排除

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
