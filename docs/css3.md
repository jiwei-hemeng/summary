# css 中的函数

## css 的 calc()函数

**在 less 或 sass 中经常会遇到**

```css
$width = 100px;
.box {
  width: $width + 100px;
}
```

然而 **clac()** 函数提供了更好的

```css
.box {
  width: clac(100% - 50px);
}
```

表示 box 元素的宽度总是小于父元素的 50px

**应用 1：创建根栅格尺寸**

```css
html {
  font-size: calc(100vw / 750);
}
```

**应用 2：实现元素的居中**

```css
.box {
  position: absolute;
  top: calc(50% - 150px);
  left: calc(50% - 150px);
}
```

## css 中的 attr()函数

> 使用 attr() 函数，你可以检索所选元素的属性值并在样式中使用它。

例如

```html
<p>Some <span data-tooltip="tooltip">text</span> here</p>
```

使用

```css
span::after {
  content: attr(data-tooltip);
}
```

## 使用 CSS 自定义属性（变量）

> [相关链接](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)

**CSS 全局变量**

要在全局范围内声明变量，就要将变量定义在 :`root` 选择器中：

```css
:root {
  --primary-color: #000;
}
```

**CSS 局部变量**

要在局部范围声明变量，只需要在选择器中定义变量即可，这样声明的变量只能在该选择器中使用，如果尝试在其他地方使用，它不会有任何效果：

```css
h2 {
  --h2-color: #999;
  color: var(--h2-color);
}

h3 {
  color: var(--h2-color); /* 不生效 */
}
```

**例子**

```css
:root {
  --main-bg-color: brown;
  --width: 25%;
  --margin: 20px;
}
.one {
  color: white;
  background-color: var(--main-bg-color);
  margin: 10px;
  width: 50px;
  height: 50px;
  display: inline-block;
}
```

除了变量名之外，`var()` 还有第二个参数——**备用值**。在发现变量值不可访问的情况下，将使用备用值来代替它：

```css
div {
  background-color: var(--main-bg-color, red);
}
```

我们甚至可以在**媒体查询**中重新设置变量

```css
@media (max-width: 400px) {
  :root {
    --width: 50%;
    --margin: 10px;
  }
}
```

**SASS 变量 vs CSS 变量**

- SASS 变量代码经过编译后，变量也就消失了。因此，我们不能在 CSS 运行时更改变量值。
- 预处理器中的变量范围归结为嵌套的大括号块。然而，因为 CSS 变量是属性，所以它们的作用域是基于 DOM 的。这意味着 CSS 变量是按元素解析的，而不是按作用域解析的

## clamp

`clamp()` 用于将一个值限制在一个特定的范围内。这个函数接受三个参数：最小值（MIN）、首选值（VAL）和最大值（MAX）。

```css
font-size: clamp(12px, 2rem, 24px);
```

在这个例子中，2rem 是首选值，它根据视口的宽度变化。如果视口宽度很小，导致 2rem 计算出来的值小于 12px，`clamp()` 函数将返回 12px。如果视口宽度很大，导致 2rem 计算出来的值大于 24px，`clamp()` 函数将返回 24px。如果 2rem 计算出来的值在 12px 和 24px 之间，那么 `clamp()` 函数将直接返回这个计算值

# css 嵌套写法

> [现代 CSS：原生 CSS 嵌套快速入门](https://mp.weixin.qq.com/s?__biz=MzI2NjUxODkzOA==&mid=2247485385&idx=2&sn=3b5575ef8ba067d8d9c2185ac4af6f0d&chksm=ea8daf3cddfa262a316559f59ce5953f8b128a15149395d27591c48af11d7d322fba5d798590&scene=21#wechat_redirect)

原生 CSS 嵌套可以像 SASS、LESS 预处理器一样，将相关的选择器组合在一起，从而减少需要编写的规则数量。它可以节省打字时间，并使语法更易于阅读和维护。您可以将选择器嵌套到任意深度，但要小心不要超过两层或三层。嵌套深度没有技术限制，但它会使代码更难以阅读，并且生成的 CSS 可能会变得不必要的冗长。

```css
.button {
  background-color: red;
  padding: 1.5rem;
  .warning {
    background-color: blue;
  }
  &-header { /* 等效于 .card-header */
    font-size: 1.2em;
  }
  &:hover {
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  .icon {
    width: 1rem;
    height: 1rem;
  }
  @media (width <= 768px) {
    padding: 1.1rem;
  }
}
```

## 原生 CSS 嵌套规则

您可以将任何选择器嵌套在另一个选择器中，但它必须以符号开头，例如 `&`, `.`（类选择器）、`#`（ID 选择器）、`@`（对于媒体查询）、`:`、`::`、`+`、 `~`、 `>` 或 `[`。换句话说，它不能是对 HTML 元素的直接引用。下面的代码是无效的，不会对 `input` 元素选择器进行解析：

```css
.parent {
  color: red;

  input {
    margin: 1em;
  }
}
/* Invalid, because "input" is an identifier. */
```

解决此问题的最简单方法是使用与号 ( &)，它以与 Sass 相同的方式引用当前选择器。

```css
.parent {
  color: red;
  & input {
    margin: 1em;
  }
}
```

或者，您可以使用其中之一：

- `> input`：只对子元素生效
- `:is(input)`：将选择器列表作为参数，并选择该列表中任意一个选择器可以选择的元素
- `:where(input)`：优先级总是为 0

# 媒体查询

H5 的新特性，为了移动端的使用而新增的特性，使用 @media 查询，你可以针对不同的媒体类型定义不同的样式，响应式布局就是使用媒体查询的原理

```css
@media only screen and (min-width: 320px) and (max-width: 767px) {
}
@media screen and (width <= 750px) {
}
```

## 横屏、竖屏 显示

```css
@media screen and (orientation: landscape) {
}
@media screen and (orientation: portrait) {
}
```

## 当前的系统主题

```css
@media (prefers-color-scheme: dark) { //... }
@media (prefers-color-scheme: light) { //... }
```

## 像素比

```css
@media screen and (-webkit-min-device-pixel-ratio: 2) {
}
@media screen and (-webkit-min-device-pixel-ratio: 3) {
}
```

## prefers-reduced-motion

> 用于检测用户的系统是否被开启了动画减弱功能

```css
@media screen and (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
```

## CSS 视口 - viewport

**布局视口 layout viewport** 一般移动设备的浏览器都默认设置了一个布局视口，用于解决早期的 PC 端页面在手机上显示的问题，iOS, Android 基本都将这个视口分辨率设置为 980px，所以 PC 上的网页大多都能在手机上呈现，只不过元素看上去很小

**视觉视口 visual viewport** 它是用户正在看到的网站的区域，在移动端就是设备的宽

**理想视口 ideal viewport** 为了使网站在移动端有最理想的浏览和阅读宽度而设定

```html
<meta
  name="viewport"
  content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
/>
```

# flex 布局

## 关于 flex 布局

- flex-direction：设置主轴的方向
- justify-content：设置主轴上的子元素排列方式
- flex-wrap：设置子元素是否换行
- align-content：设置侧轴上的子元素的排列方式（多行）
- align-items：设置侧轴上的子元素排列方式（单行）
- flex-flow：复合属性，相当于同时设置了 flex-direction 和 flex-wrap

## 让 flex 布局的最后一行左对齐

**对应的 html**

```html
<div class="container">
  <div class="list"></div>
  <div class="list"></div>
  <div class="list"></div>
  <div class="list"></div>
  <div class="list"></div>
</div>
```

**对应的 css**

```css
.container {
  display: flex;
  flex-wrap: wrap;
}
.list {
  width: 24%;
  height: 100px;
  background-color: skyblue;
  margin-top: 15px;
}
.list:not(:nth-child(4n)) {
  margin-right: calc(4% / 3);
}
```

## flex 属性 是哪些属性的简写

> flex: 1 就是 flex-grow: 1; flex-shrink; 1; flex-basis: 0% 的简写。

**flex-grow**

该属性用来设置当父元素的宽度大于所有子元素的宽度的和时（即父元素会有剩余空间），子元素如何分配父元素的剩余空间。 `flex-grow`的默认值为 0，意思是该元素不索取父元素的剩余空间，如果值大于 0，表示索取。值越大，索取的越厉害。

**flex-shrink**

该属性用来设置，当父元素的宽度小于所有子元素的宽度的和时（即子元素会超出父元素），子元素如何缩小自己的宽度的。 `flex-shrink`的默认值为 1，当父元素的宽度小于所有子元素的宽度的和时，子元素的宽度会减小。值越大，减小的越厉害。如果值为 0，表示不减小。

**flex-basis**

该属性用来设置元素的宽度，其实，width 也可以设置宽度。如果元素上同时设置了 width 和 flex-basis，那么 width 的值就会被 flex-basis 覆盖掉。

## flex 计算

第一步中：

- `auto`：使用子元素的尺寸
- 长度：使用此固定长度
- 百分比：根据其包含块（即伸缩父容器）的主尺寸计算。如果包含块的主尺寸未定义（即父容器的主尺寸取决于子元素），则计算结果和设为 `auto` 一样

第二步中：

如果经过第一步填充之后，父元素还有剩余宽度，则执行 flex-grow 计算，如果内容超出，则根据 flex-shrink 计算。

### 实例一：拉伸

```html
<style>
  .parent {
    display: flex;
    width: 600px;
  }

  .parent > div {
    height: 100px;
  }

  .item-1 {
    width: 140px;
    flex: 2 1 0%;
    background: blue;
  }

  .item-2 {
    width: 100px;
    flex: 2 1 auto;
    background: darkblue;
  }

  .item-3 {
    flex: 1 1 200px;
    background: lightblue;
  }
</style>
<div class="parent">
  <div class="item-1"></div>
  <div class="item-2"></div>
  <div class="item-3"></div>
</div>
```

第一步：

- 主轴上父容器总尺寸为 600px
- 子元素的总基准值是：0% + auto + 200px = 300px

第二步：

- 剩余空间为 600px - 300px = 300px，有剩余空间，需要拉伸
- 伸缩放大系数之和为： 2 + 2 + 1 = 5
- 剩余空间分配如下：

```
item-1 和 item-2 各分配 2/5，各得 120px
item-3 分配 1/5，得 60px
```

- 各项目最终宽度为：

```ini
item-1 = 0% + 120px = 120px
item-2 = auto + 120px = 220px
item-3 = 200px + 60px = 260px
```

### 实例二：缩小

```html
<style>
  .item-4 {
    width: 100px;
    flex: 2 1 0;
    background: blue;
  }
  .item-5 {
    width: 600px;
    flex: 2 2 auto;
    background: lightblue;
  }
</style>
<div class="parent">
  <div class="item-4"></div>
  <div class="item-5"></div>
</div>
```

**第一步，计算基准值：**

子元素的总基准值是：100px + 600px = 700px，大于 600px，需要缩小；

**第二步，计算缩放：**

设缩小因子为 x；

```ini
100 * x + 600 * 2x = 700 - 600 // result x = 0.076
```

各项目最终宽度为：

```ini
item-1 = 100 - 100 * 0.076 = 92.4
item-2 = 600 - 600 * 0.076 * 2 = 508
```

# 伪元素与伪类

> CSS3 规范中有一部分要求，为了区分伪类和伪元素，伪元素使用两个冒号 (::)， 伪类使用一个冒号 (:)

## 伪类

> 概念: 为处于某个状态的已有元素添加对应的样式，这个状态是根据用户行为而动态改变的

设置鼠标悬停在元素上时的样式： `:hover`

为已访问和未访问链接设置不同的样式： `:link`、`:visited`、`:active`

设置元素获得焦点时的样式： `:focus`

选择每个被选中的元素： `:checked`

表单元素验证是否必填、通过和不通过: `:required`、 `:valid`、`:invalid`

选择页面中为空的元素：`:empty`

不包含：`:not()`

### has()伪类的语法和作用

例如：

```css
a:has(img) {
  display: block;
}
```

表示如果 `<a>` 元素里面有 `<img>` 元素，则这个 `<a>` 元素就会匹配。

`:has()`伪类支持所有的 CSS 选择符，例如：

```css
a:has(> img) {
  display: block;
}
```

表示匹配子元素是 `<img>` 元素的 `<a>` 元素会被匹配，而关系更远的后代元素则不考虑。

```css
h5:has(+ p) {
  font-size: 1rem;
}
```

表示匹配后面跟随 `<p>` 元素的 `<h5>` 元素。

**注意**上面代码中 `:has` 伪类的参数，选择符`>`直接写在了参数的最前面，而不是 `a:has(a > img)` 这样的写法。可以理解为 `:has()` 伪类的参数的最前面有一个看不见的 `:scope` 伪类，因此，`a:has(a > img)`这样的写法是不合法的。

### 伪类选择器 `:focus-within`

> 它表示一个元素获得焦点，或，该元素的后代元素获得焦点。划重点，它或它的后代获得焦点。这也就意味着，它或它的后代获得焦点，都可以触发 `:focus-within`。

```html
<div class="warp">
  <label for="name">姓名</label>
  <input type="text" name="" id="name" />
</div>
<style>
  .warp {
    width: 100%;
    height: 100px;
  }
  .warp:focus-within {
    border: 1px dashed skyblue;
  }
</style>
```

### :placeholder-shown

> 输入框在显示占位符时将应用特殊字体和边框样式

[mdn 地址](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:placeholder-shown)

```css
input {
  background-color: #e8e8e8;
  color: black;
}

input.studentid:placeholder-shown {
  background-color: yellow;
  color: red;
  font-style: italic;
}
```

## 伪元素

> 概念：创建一些不在文档树中的元素，并为其添加样式。(就是选取某些元素前面或后面这种普通选择器无法完成的工作,虽然用户可以看到这些文本，但是这些文本实际上不在文档树中。)

### 设置元素的首字母、首行的样式 `::first-letter`、`::first-line`

```css
p:first-of-type::first-letter {
  color: #666;
  float: left;
  font-family: "Georgio";
  font-size: 4em;
  line-height: 4vh;
  padding-right: 4px;
}
```

### 在元素的内容之前或之后插入内容 `::after`、 `::before`

### 选择用户选择的元素部分 `::selection`

```css
::selection {
  background-color: #ccc;
  color: #666;
}
```

### ::-webkit-input-placeholder

> 修改 input placeholder 样式

```css
.input::-webkit-input-placeholder {
  color: red;
  font-size: 18px;
}
```

# css 新特性

> - CSS 实现圆角（border-radius）,阴影（box-shadow）,边框图片 border-image
> - 对文字加特效（text-shadow）,强制文本换行（word-wrap）,线性渐变（linear-gradient）
> - 旋转，缩放，定位，倾斜
> - 查询（@media）,多栏布局（flex）

## css3 如何同时实现缩放和位移

```css
transform: translate(-24%) scale(0.6);
```

## 什么是 [aspect-ratio](https://so.csdn.net/so/search?q=aspect&spm=1001.2101.3001.7020)?

> 对于一个响应式的网站，在缩放的时候，需要保持图片和视频的纵横比,传统的 CSS 只能通过 `宽高自己计算纵横比`，或者 `保持原始纵横比`. 现在可以使用 `aspect-ratio` 属性来设置固定的纵横比.

任何一个具有宽高的元素都可以使用它

```css
aspect-ratio: 16 / 9; // 纵横比为 16:9
aspect-ratio: 5 / 4; // 纵横比为 5:4
```

`"/"` 和后面的高度比可以省略，默认为 `1` ：

```css
aspect-ratio: 4; // 纵横比为 4:1
```

aspect-ratio 属性值也可以设置为 auto，在缩放的时候，保持一定的纵横比：

```css
aspect-ratio: auto; // 保持原有的纵横比
```

## 平滑滚动

```css
scorll-behavior: smooth !important;
```

## input 光标的样式

```css
input {
  caret-color: red;
}
```

## 投影

```css
.img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: drop-shadow(30px 10px 4px #757575);
}
```

## 自定义滚动条

```css
/* 滚动条样式 */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
/* 当同时含有垂直和水平方向的滚动条时它们的交叉部分。一般是元素的右下角 */
::-webkit-scrollbar-corner {
  background: #c0c0c0;
}
/* 滚动条上的滚动滑块 */
::-webkit-scrollbar-thumb {
  background: #00000033;
  border-radius: 4px;
}
/* 滚动条轨道 */
::-webkit-scrollbar-track {
  background: #f8f9fa;
}
/* 滚动条没有滑块的轨道部分 */
::-webkit-scrollbar-track-piece {
  background: #f8f9fa;
}
```

## 禁用用户选择

```CSS
.content-header h2 {
  user-select: none;
}
```

## 竖排文字

> writing-mode 选项说明：
> horizontal-tb：水平方向自上而下的书写方式。即 left-right-top-bottom；vertical-rl：垂直方向自右而左的书写方式。即 top-bottom-right-left； vertical-lr：垂直方向内内容从上到下，水平方向从左到右； sideways-rl：内容垂直方向从上到下排列； sideways-lr：内容垂直方向从下到上排列

```css
.sidebar h3 {
  text-align: center;
  writing-mode: vertical-lr;
  background-color: #eee;
}
```

## css 实现背景图片固定在浏览器

```css
/* 设置背景图片 */
background-image: url("./fisrtbg.jpg");
/* 背景图片的尺寸  */
background-size: cover;
/* 背景图像是否固定或者随着页面的其余部分滚动，默认值scroll, 默认会滚动 */
background-attachment: fixed;
/* 设置背景图片的位置 */
background-position: center;
```

## object-fit

> 当图片比例不固定，想让图片自适应，一般都会使用 background-size: cover/contain, 但是这个只适用背景图。css 可以使用 object-fit 属性来解决图片被拉伸或者被缩放的问题；

**使用的前提：** 图片的父级容器要有宽高

```css
img {
  width: 100px;
  height: 100px;
  object-fit: scale-down;
  border: 1px dashed #262626;
  border-radius: 4px;
}
```

![image-20210812095044739](../assets/images/image-20210812095044739.png)

fill: 默认值。内容拉伸填满整个 content box, 不保证保持原有的比例。contain: 保持原有尺寸比例。长度和高度中长的那条边跟容器大小一致，短的那条等比缩放，可能会有留白。cover: 保持原有尺寸比例。宽度和高度中短的那条边跟容器大小一致，长的那条等比缩放。可能会有部分区域不可见。（常用）none: 保持原有尺寸比例。同时保持替换内容原始尺寸大小。scale-down:保持原有尺寸比例,如果容器尺寸大于图片内容尺寸，保持图片的原有尺寸，不会放大失真；容器尺寸小于图片内容尺寸，用法跟 contain 一样。

常与`object-position`配合 

```css
object-fit: cover;
object-position: center;
```

## 常见的让盒子居中显示的方法

**方法一：**

父盒子给 position：relative；

盒子给 position：absolute；top：0；right：0；bottom：0；left：0；margin：auto；

**方法二：**

父盒子给 position：relative；

盒子给 position：absolute；top：50%；left：50%；transform：translate（-50%，-50%）；

**方法三：**

父盒子给 display: flex;align-items: center;justify-content: center;

## 关于pointer-events

你有一个覆盖在其他元素上的遮罩层（如半透明的 div），但又不想让它拦截鼠标事件时，可以设置：
```css
.overlay {
    pointer-events: none; /* 鼠标事件穿透遮罩层 */
}
```
在某些情况下，你可能希望某个元素在某些条件下不响应鼠标事件。例如，一个按钮在禁用状态下不响应点击事件

```css
button:disabled {
    cursor: no-drop;
    color: #e5e5e5;
    pointer-events: none; /* 禁用按钮的鼠标事件 */
}
```

**注意：**`pointer-events: none; ` 属性和`cursor: no-drop;`属性互斥


## less 中的混入(mixin)

> 混入作用：提取公用的代码，在组合新的功能，可以混入公用的代码，提高逻辑的复用。

```less
.red {
    color: red;
}
.bg {
    background: #ccc;
}
.box {
    // 同时有上面两个类的特性，并且可以有自己的属性
    .red()
    .bg()
    width: 100px;
}
```

## 清除浮动

**1. 额外标签法**：给谁清除浮动，就在其后额外添加一个空白标签 。

```css
.clear {
  clear: both;
}
```

**2. 父级添加 overflow 方法**：

```css
.father {
  overflow: hidden;
}
```

**3. 使用 after 伪元素清除浮动**

```css
.clearfix::after {
  content: "";
  display: block;
  clear: both;
  width: 0;
  visibility: hidden;
  height: 0;
}
.clearfix {
  /*   IE6、7、8的写法  */
  zoom: 1;
}
```

## 解决 margin 塌陷的方法

- 给父盒子设置 border，添加 border 后父盒子和子盒子就不会贴在一起了
- 给父盒子添加 overflow：hidden 让他溢出隐藏
- 给父盒子设定 padding 值

## 怎么让 Chrome 支持小于 12px 的文字

### 方法一：css3 的 transform: scale

> 谷歌 Chrome 最小字体是 12px，不管你设置成 8px 还是 10px，在浏览器中只会显示 12px，那么如何解决这个坑爹的问题呢？

```css
div {
  height: 40px;
  width: 100px;
  /* scale(0.5) 只是视觉上的缩放，它占据的空间依然不变 */
  overflow: hidden;
}
div p {
  margin: 0;
  /* 此处设置18px 其实际效果是9px */
  font-size: 18px;
  width: 200%;
  transform: scale(0.5);
  transform-origin: 0 0;
  /* 任意字符均可换行 */
  word-break: break-all;
}
```

### 方法二： svg 图标

```html
<svg width="48">
  <text y="8" style="font-size: 8px;">你好，世界！</text>
  <text y="18" style="font-size: 8px;">你好，世界！</text>
  <text y="28" style="font-size: 8px;">你好，世界！</text>
</svg>
```

## 文字溢出时显示点点点

### 单行

```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

text-overflow : clip | ellipsis

clip : 不显示省略标记（...），而是简单的裁切 ellipsis : 当对象内文本溢出时显示省略标记（...）

### 多行

```css
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3; //这里是在第二行有省略号
word-break: break-all;
overflow: hidden;
```

## px 、em 和 rem 的区别

- px 是一个固定单位
- em 是一个相对单位，相对于当前标签的字体大小
- rem 是一个相对单位，相对于 html 的字体大小

## 纯 css 的遮罩层

在 html 中定义 html 元素

```html
<div class="mask"></div>
```

在 css 中写样式

```css
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(101, 101, 101, 0.6);
  z-index: 99;
  display: none;
}
```

## 移动端特殊的 css

```css
/* 清除移动端高亮 */
-webkit-tap-highlight-color: transparent;
/* 清除ios默认样式 */
-webkit-appearance: none;
/* 禁止长按弹出菜单 */
-webkit-touch-callout: none;
```

## content-visibility

> content-visibility 是一个 css 属性，它控制一个元素是否呈现其内容，能让用户潜在地控制元素的呈现。用户可以使用它跳过元素的呈现(包括布局和绘制)，直到用户需要为止，让页面的初始渲染得到极大的提升。

content-visibility 属性有三个可选值:

- visible: 默认值。对布局和呈现不会产生什么影响。
- hidden: 元素跳过其内容的呈现。用户代理功能（例如，在页面中查找，按 Tab 键顺序导航等）不可访问已跳过的内容，也不能选择或聚焦。类似于对其内容设置了 display: none 属性
- auto: 对于用户可见区域的元素，浏览器会正常渲染其内容；对于不可见区域的元素，浏览器会暂时跳过其内容的呈现，等到其处于用户可见区域时，浏览器在渲染其内容。

## 去掉数字输入框中上下箭头

```css
input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
```

## 标准盒模型和怪异盒模型的区别

标准盒模型 box-sizing: content-box; IE 盒子模型 box-sizing: border-box;

标准盒与怪异盒的区别在于他们的总宽度的计算公式不一样。

- 标准模式(也称 w3c 盒模型)下总宽度=width+margin（左右）+ padding（左右）+ border（左右）；
- 怪异模式下总宽度=width+margin（左右）（就是说 width 已经包含了 padding 和 border 值）

## li 与 li 之间有看不见的空白间隔是什么原因引起的？有什么解决方法？

> 行框的排列会受到之间空白(回车空格)等的影响，因为空格也属于字符，这些空白也会被应用样式，占据空间，所以会用空格

**解决办法**

- 可以将`<li>`写成一排

- 浮动 li 中 float: left;

- 在 ul 中用 font-size: 0(谷歌不支持);可以使用 letter-space: -3px;

  > letter-space: 字间距

## 行内元素什么时候会显示间隙

> 元素被当成行内元素排版时，原来的 html 代码这回车换行被转换成一个空白字符，在字体不为 0 的情况下，空白符会占据一定的宽度，所以行内元素会显示间隙

**解决办法**

- 给父元素设置字体为 0
- 改变书写方式
- 使用 margin 负值
- 使用 word-spacing 或者 letter-spacing

## css 的阴影和渐变

**渐变**

```css
.box {
  // 线性渐变
  background: linear-gradient(45deg, #f00 20%, #0f0 40%, #0f0 60%);
  // 径向渐变 ellipse 为椭圆 circle 为正元
  background: radial-gradient(ellipse, #0f0, #f00, #00f);
}
```

**阴影**

```css
.box-shadow {
  // 没有inset是外阴影; 1px -- x轴， 2px -- y轴， 4px -- 模糊程度
  box-shadow: inset 1px 2px 4px #fff;
  box-shadow: 0px 0px 13px 1px rgba(51, 51, 51, 0.1);
}
```

## @font-face 的用法

自定义字体

```css
@font-face {
  font-family: "MyWebFont";
  src: url("webfont.eot"); /* IE9 Compat Modes */
  src: url("webfont.eot?#iefix") format("embedded-opentype"), /* IE6-IE8 */
      url("webfont.woff") format("woff"),
    /* Modern Browsers */ url("webfont.ttf") format("truetype"), /* Safari, Android, iOS */
      url("webfont.svg#svgFontName") format("svg"); /* Legacy iOS */
}

body {
  font-family: "MyWebFont";
}
```

关于 swap

> swap 的作用是，让浏览器先用系统默认字体渲染文本，等自定义字体下载完成后再替换掉。这样用户可以第一时间看到内容，避免了 FOIT。

```css
@font-face  {
    font-family: "MyAwesomeFont";
    src: url("/fonts/my-awesome-font.woff2")  format("woff2");
    font-display: swap;
}
```

## 圣杯布局

> 两边固定，中间自适应的布局叫圣杯布局

**实现方式 1**

```html
<div class="warp">
  <div class="left">1</div>
  <div class="mid">2</div>
  <div class="rigth">3</div>
</div>
```

```css
.warp {
  height: 30px;
  position: relative;
  box-sizing: border-box;
  padding: 0 30px;
}
.left,
.rigth {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 0;
  background-color: aqua;
}
.left {
  left: 0;
}
.rigth {
  right: 0;
}
.mid {
  height: 30px;
  background-color: blueviolet;
}
```

**实现方法 2**

```css
.warp {
  height: 30px;
  position: relative;
}
.left,
.rigth {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 0;
  background-color: aqua;
}
.left {
  left: 0;
}
.rigth {
  right: 0;
}
.mid {
  height: 30px;
  margin: 0 30px;
  background-color: blueviolet;
}
```

## 二倍精灵图

> **概念**：设置的图片的分辨率和图片的宽高是 2 倍的关系称为**二倍图**

**步骤**

1. 利用 background-image 引入二倍精灵图
2. 将二倍精灵图在 fw 软件中缩小至一倍，查看此时图片的宽度，利用 background-size 设置背景大小
3. 利用 fw 软件测量此时需要的图标的定位，利用 background-position 设置背景定位

```css
.warp {
  width: 16px;
  height: 16px;
  background: url(images/dog.jpg) no-repeat;
  background-size: 160px auto; /* 注意：原图宽为320px */
  background-position: -32px -32px; /* 利用background-position设置背景定位 */
}
```

## 中英文自动换行

```css
p {
  /* 只对英文起作用, 以字母作为换行依据 */
  word-break: break-all;
  /* 只对英文起作用, 以单词作为换行依据 */
  word-wrap: break-word;
  /* 只对中文起作用，强制换行 */
  white-space: pre-wrap;
  /* 强制不换行，中英文都起作用 */
  white-space: nowrap;
}
```

## CSS 实现文本两端对齐

```css
p {
  text-align: justify;
}
```

缺点： 文本的最后一行或者单独一行设置是无效的；

**解决方案**： 内部添加一个内联块元素，宽度设置 width:100%,让最后一行变成倒数第二行，问题就解决了，但是这样增加了额外的元素，理想的方法使用伪元素

```html
<p class="content">
  Shanghai is the largest city by population in the People's
</p>
<style>
  .content {
    width: 600px;
    height: 200px;
    border: 3px solid red;
    text-align: justify;
  }
  .content::after {
    content: "";
    display: inline-block;
    width: 100%;
    height: 0;
    visibility: hidden;
  }
</style>
```

也可以使用 **text-align-last**，但是它的兼容性不好。

```css
.laterr {
  text-align: justify;
  text-justify: distribute-all-lines;
  text-align-last: justify;
  -moz-text-align-last: justify;
  -webkit-text-aligin-last: justify;
}
```

## css 大小写的转化

```css
p {
  /* 将所有字母变成大写字母 */
  text-transform: uppercase;
  /* 将所有字母变成小写字母 */
  text-transform: lowercase;
  /* 首字母大写 */
  text-transform: capitalize;
  /* 首字母小写 */
  text-transform: small-caps;
}
```

## **解决 vertical-align 属性不生效**

在使用 vertical-align:middle 实现垂直居中的时候，经常会发现不生效的情况。这里需要注意它生效需要满足的条件：

- 作用环境 : 父元素设置 line-height。需要和 height 一致。或者将 display 属性设置为 table-cell，将块元素转化为单元格。
- 作用对象 : 子元素中的 inline-block 和 inline 元素

## **移动端软键盘变为搜索方式**

默认情况下软键盘上该键位为前往或者确认等文字，要使其变为搜索文字，需要在 input 上加上 type 声明：

```html
<form action="#">
  <input type="search" placeholder="请输入..." name="search" />
</form>
```

需要一个 form 标签套起来,并且设置 action 属性,这样写完之后输入法的右下角就会自动变成搜索

同时，使用了 search 类型后，搜索框上会默认自带删除按钮

如需屏蔽，可以使用如下方式：

```css
input[type="search"]::-webkit-search-cancel-button {
  -webkit-appearance: none;
}
```

## accent-color 应用场景

> 表单控件颜色设置

```css
input[type="radio"] {
  accent-color: red;
}
```

## grid 布局

```html
<div class="wrapper">
  <div class="one item">One</div>
  <div class="two item">Two</div>
  <div class="three item">Three</div>
  <div class="four item">Four</div>
  <div class="five item">Five</div>
  <div class="six item">Six</div>
</div>
```

```css
.wrapper {
  margin: 60px auto;
  /* 声明一个容器 */
  display: grid;
  /* 声明列的宽度,数字3表示的重复3次，即有3列宽度为200px*/
  grid-template-columns: repeat(3, 33%);
  /* 声明行间距和列间距 */
  grid-gap: 10px;
  /* 分别表示两行的高度 */
  grid-template-rows: 100px 120px;
}
.item {
  text-align: center;
  font-size: 200%;
  color: #fff;
}
.one {
  background-color: #b8e8e0;
}
.two {
  background-color: #8cc7b5;
}
.three {
  background-color: #efe3bf;
}
.four {
  background-color: #bee7e9;
}
.five {
  background-color: #e6ceac;
}
.six {
  background-color: #ecad9e;
}
```

## ios 键盘唤起后收起页面不归位

> 问题详情描述: 输入内容，软键盘弹出，页面内容整体上移，但是键盘收起，页面内容不下滑

**出现原因分析**

固定定位的元素 在元素内 input 框聚焦的时候 弹出的软键盘占位 失去焦点的时候软键盘消失 但是还是占位的 导致 input 框不能再次输入 在失去焦点的时候给一个事件

**解决办法**

```html
<div class="list-warp">
  <div class="title">
    <span>投·被保险人姓名</span>
  </div>
  <div class="content">
    <input
      class="content-input"
      placeholder="请输入姓名"
      v-model="peopleList.name"
      @focus="changefocus()"
      @blur.prevent="changeBlur()"
    />
  </div>
</div>
<script>
  // ios键盘唤起后收起页面不归位
  function changeBlur() {
    let u = navigator.userAgent,
      app = navigator.appVersion;
    let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isIOS) {
      setTimeout(() => {
        const scrollHeight =
          document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.scrollTo(0, Math.max(scrollHeight - 1, 0));
      }, 200);
    }
  }
  // 安卓弹出的键盘遮盖文本框
  function changefocus() {
    let u = navigator.userAgent,
      app = navigator.appVersion;
    let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1;
    if (isAndroid) {
      setTimeout(function () {
        document.activeElement.scrollIntoViewIfNeeded();
        document.activeElement.scrollIntoView();
      }, 500);
    }
  }
</script>
```

## clip-path

**正三角形**

```html
<style>
  .pic {
    width: 100px;
    height: 100px;
    background-color: #f00;
    clip-path: polygon(0% 100%, 100% 100%, 0 50%);
  }
</style>
<div class="pic"></div>
```

**圆**

> clip-path: circle([半径] at [圆心 x 轴坐标] [圆心 y 轴坐标]);

```html
<style>
  .pic {
    width: 100px;
    height: 100px;
    background-color: #f00;
    clip-path: circle(30% at 150px 120px);
  }
</style>
<div class="pic"></div>
```

**正五边形**

```html
<style>
  .pic {
    width: 100px;
    height: 100px;
    background-color: #f00;
    clip-path: polygon(
      0% 38.31%,
      50% 0%,
      100% 38.31%,
      80.86% 100%,
      19.14% 100%
    );
  }
</style>
<div class="pic"></div>
```

**椭圆**

> 定义：clip-path: ellipse(圆的水平半径 圆的垂直半径 at 圆心)

```html
<style>
  .pic {
    width: 100px;
    height: 100px;
    background-color: #f00;
    clip-path: ellipse(30% 20% at 50% 50%);
  }
</style>
<div class="pic"></div>
```

**星星**

```css
clip-path: polygon(
  50% 0%,
  61% 35%,
  98% 35%,
  68% 57%,
  79% 91%,
  50% 70%,
  21% 91%,
  32% 57%,
  2% 35%,
  39% 35%
);
```

**对话框**

```css
clip-path: polygon(
  0% 0%,
  100% 0%,
  100% 75%,
  75% 75%,
  75% 100%,
  50% 75%,
  0% 75%
);
```

**八边形**

```css
clip-path: polygon(
  30% 0%,
  70% 0%,
  100% 30%,
  100% 70%,
  70% 100%,
  30% 100%,
  0% 70%,
  0% 30%
);
```

## css 中涉及到的百分比的参照对象总结

- 元素的宽和高的百分比参考分别是基于**父元素**的宽和高
- 设置元素的 margin 为百分比的时候，参考目标是**父元素**的宽度
- 元素的 padding 值的百分比参考是基于**父元素**的宽度来的
- 字体大小的百分比同样是基于**父元素**的字体大小来确定的
- 设置 background-size 值的宽,高是基于**当前元素**的宽和高
- border-radius 设置的百分比是基于**当前元素**的宽和高
- transform:translate(x 轴的百分比,y 轴的百分比) 的百分比形式是基于**当前元素**的的宽和高来确定的
- 行高百分比是基于**当前元素**字体大小（字体大小 \* 所设行高的百分比 = 最终所呈现的行高值）
- 当元素为 fixed 定位时,left,top 的参考分别时**当前视口**的宽和高
- 当定位为 absolute 定位时，left,top 参考的是【从当前元素往外找遇到的第一个定位为非 static 的元素，若没有这样的元素则以当前视口为参考】的宽和高

## 隐藏元素 - display:none 或 visibility:hidden 的区别

visibility:hidden 可以隐藏某个元素，但隐藏的元素仍需占用与未隐藏之前一样的空间。也就是说，该元素虽然被隐藏了，但仍然会影响布局。

## H5 标签中的 hidden 属性

hidden 属性是一个标准的 HTML 属性，可以添加到元素中以指示它应该从视图中隐藏。当 hidden 属性出现在元素上时，浏览器会自动应用 display: none 到该元素，有效地将其隐藏在视图中。在引入 hidden 属性之前，开发人员通常会使用 display: none 来隐藏页面上的元素。然而，这种方法可能有一些缺点。例如，如果开发人员使用 display:none 来隐藏一个元素，然后稍后尝试使用 JavaScript 再次显示它，他们必须首先将 display 属性更改回其原始值（例如 display:block）。这可能很麻烦且容易出错。相比之下，隐藏属性简化了这个过程。当元素具有隐藏属性时，浏览器会根据需要负责应用和删除适当的显示值。因此，如果开发人员想要根据某些条件（例如单击按钮）显示或隐藏元素，他们可以简单地切换隐藏属性的存在，而不是直接修改显示属性。

> 总结： 有了 H5 标签中的 hidden 属性，尽量少用 display: none

## 打印相关的 css

### 媒体查询

```css
@media print {
  @page {
    size: A4 portrait;
    margin: 3.7cm 2.6cm 3.5cm;
  }
}
```

### 去除页眉

```css
@page {
  margin-top: 0;
}
```

### 去除页脚

```css
@page {
  margin-bottom: 0;
}
```

### 页眉页脚全部去掉

```css
@page {
  margin: 0;
}
```

### 设置纸张及其方向 portrait：纵向； landscape: 横向; auto 自动选择

```css
@page {
  size: A4 portrait;
}
```

### **CSS 中 page-break-after 属性**

page-break-after 是 CSS 中用来设置打印[分页](http://www.php.cn/php/php-tp-paging.html)的 CSS 属性，支持所有的浏览器。

page-break-after 有以下几个选择项：

◆auto 默认。如果必要则在元素后插入分页符。

◆always 在元素后插入分页符。

◆avoid 避免在元素后插入分页符。

◆left 在元素之后足够的分页符，一直到一张空白的左页为止。

◆right 在元素之后足够的分页符，一直到一张空白的右页为止。

◆inherit 规定应该从父元素[继承](http://www.php.cn/code/6064.html)page-break-after 属性的设置。

```css
.pageBreakAfter {
  page-break-after: always;
}
```

### 完整案例

```css
@media print {
  @page {
    size: A4 portrait;
    margin: 3.7cm 2.6cm 3.5cm; /* 国家标准公文页边距 GB/T 9704-2012 */
  }
  @page {
    margin: 0;
  }
  h1 {
    page-break-before: always;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  thead,
  tfoot,
  tr,
  th,
  td,
  li {
    page-break-inside: avoid;
  }

  body {
    background-color: white;
    color: black;
  }

  nav,
  aside {
    display: none;
  }

  a::after {
    content: "(" attr(href) ")";
  }

  thead,
  tfoot {
    display: table-row-group;
  }
}
```

## keyframes 关键帧

### 定义动画

```css
@keyframes fadeOut {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 0.3;
    color: red;
  }
  40% {
    opacity: 0.5;
    color: aqua;
  }
  60% {
    opacity: 1;
    color: green;
  }
  80% {
    opacity: 0.5;
    color: palegreen;
  }
  90% {
    opacity: 0.3;
    color: blue;
  }
  100% {
    opacity: 0;
    color: cadetblue;
  }
}
```

### 使用动画

> animation-duration 动画的时长 animation-delay 延时动画 暂停动画 animation-play-state:paused
>
> 运行动画 animation-play-state:running; 循环次数 animation-iteration-count: infinite;

```css
.fadeout {
  animation: fadeOut 1s infinite;
}
```

### 监听动画的事件

```js
var textDom = document.querySelector(".fadeOut");
textDom.addEventListener(
  "animationstart",
  function () {
    console.log("animationstart");
  },
  false
);
textDom.addEventListener(
  "animationend",
  function () {
    console.log("animationend");
  },
  false
);
textDom.addEventListener(
  "animationiteration",
  function () {
    console.log("animationiteration");
  },
  false
);
```

## word-space 与 letter-space

word-space 是单词的字间距；latter-space: 是字符的字间距

## CSS 属性选择器

[attribute="value"] 选择器用于选取带有指定属性和值的元素

```css
a[target="_blank"] {
  background-color: yellow;
}
```

[attribute~="value"] 选择器选取属性值包含指定词的元素。

> **提示** :值必须是完整单词！

```css
[title~="flower"] {
  border: 5px solid yellow;
}
```

> 上面的例子会匹配以下属性的元素：title="flower"、title="summer flower" 以及 title="flower new"，但不匹配：title="my-flower" 或 title="flowers"。

[attribute|="value"] 选择器用于选取指定属性以指定值开头的元素。

> **提示** :值必须是完整单词！

```css
[class|="top"] {
  background: yellow;
}
```

[attribute^="value"] 选择器用于选取指定属性以指定值开头的元素。

```css
[class^="top"] {
  background: yellow;
}
```

[attribute*="value"] 选择器选取属性值包含指定词的元素。

```css
[class*="te"] {
  background: yellow;
}
```

[attribute$="value"] 选择器用于选取指定属性以指定值结尾的元素。

```css
[class$="test"] {
  background: yellow;
}
```

## css 居中

### 行内元素、行内块元素

- 水平方向
  - text-align: center；
- 垂直方向：
- vertical-align: middle;
- 行高等于高

### 块元素

- flex 布局 实现垂直水平居中

- magin: 0 auto; 水平居中

- 定位 + calc (**已知宽高**)

  ```css
  .parent {
    position: relative;
  }
  .child {
    position: absolute;
    left: calc(50% - 150px);
    top: calc(50% - 150px);
  }
  ```

- 定位 (**未知宽高**)

  ```css
  .parent {
    position: relative;
  }
  .child {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  ```

## css 权重

- 内联样式(Specificity of Inline styles)：只对应用于特定元素的样式有效，其权重值最高，为 1000。
- ID 选择器(Specificity of ID selectors)：每个 ID 选择器对应的权重值为 100。
- 类、属性、伪类选择器(Specificity of class， attributes and pseudo-classes selectors)：每个类、属性或伪类选择器对应的权重值为 10。
- 标签、伪元素选择器(Specificity of type and pseudo-elements selectors)：每个标签或伪元素选择器对应的权重值为 1。

## iconFont symbol 的使用方式

```html
<script src="https://at.alicdn.com/t/c/font_3951262_kngq53kqvhf.js"></script>
<style>
  /* 设置颜色 */
  svg:has(symbol) > path {
    fill: var(--icon-color, #000);
  }
  /* 设置图标大小 */
  .icon {
    width: var(--icon-size, 14px);
    height: var(--icon-size, 14px);
  }
</style>
<svg
  class="icon"
  aria-hidden="true"
  style="--icon-color: #ff0000; height: 14px; width: 14px;"
>
  <use xlink:href="#icon-email"></use>
</svg>
<svg
  class="icon"
  aria-hidden="true"
  style="--icon-color: #00ff00; height: 14px; width: 14px;"
>
  <use xlink:href="#icon-email"></use>
</svg>
<svg
  class="icon"
  aria-hidden="true"
  style="--icon-color: #ffff00; height: 14px; width: 14px;"
>
  <use xlink:href="#icon-moblie"></use>
</svg>
<svg
  class="icon"
  aria-hidden="true"
  style="--icon-color: #0000ff; height: 14px; width: 14px;"
>
  <use xlink:href="#icon-moblie"></use>
</svg>
```

## css 实现倒影效果

> 语法： [ above | below | right | left ]? [offset]? [mask-box-image]?

```css
-webkit-box-reflect: below 5px linear-gradient(transparent, rgba(0, 0, 0, 0.3));
```

给倒影增加消隐效果

```css
-webkit-box-reflect: below 0px -webkit-gradient(linear, left top, left bottom, from(transparent), to(rgba(250, 250, 250, 0.1)));
```

## border-collapse

> 为表格设置合并单元格边框

```css
border-collapse: collapse;
```

## CSS @property

什么是@property?

**`@property`** CSS at-rule **是 CSS Houdini API [[🔗](https://developer.mozilla.org/en-US/docs/Web/Guide/Houdini)] 的一部分，它允许开发者显式地定义他们的**CSS 自定义属性, 允许进行属性类型检查、设定默认值以及定义该自定义属性是否可以被继承。

> 在过去，我们使用 CSS 自定义变量（CSS Variables）来存储和复用值，但它们并不具备类型检查和默认值设定的功能。
> 而 CSS @property 则弥补了这一空白，使得自定义属性更加功能丰富和强大。

语法

```css
@property --property-name {
  syntax: "<color>";
  inherits: false;
  initial-value: #c0ffee;
}
```

- `--property-name` : 自定义属性名称
- syntax: 定义了自定义属性接受的值的类型。
  CSS 基本数据类型 - CSS：层叠样式表 | [MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Types)
  可能是（长度）、（数字）、（百分比）、（长度百分比）、（颜色）、（图像）、（URL 地址）、（整数）、（角度）、（时间）、（分辨率）、（变换函数）或（自定义标识符），或者是这些数据类型和关键字值的列表。 +（空格分隔）和 # 字号（逗号分隔）的乘法器表示期望的是一个值的列表，
  例如 <color># 意味着期望的语法是一个以逗号分隔的 <color>值列表。
  竖线（|）可以为预期的语法创建"或"条件，
  例如 <length> | auto 接受 <length>或 auto，而 <color># | <integer># 期望的是以逗号分隔的 <color>值列表 或以 逗号分隔的<integer>值列表。
- inherits: 指定该自定义属性是否可以被子元素继承，默认为 false。
- initial-value:设置自定义属性的默认值。

使用 [JavaScript 中的](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript) [`CSS.registerProperty`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@property)函数：

```js
window.CSS.registerProperty({
  name: "--my-color",
  syntax: "<color>",
  inherits: false,
  initialValue: "#c0ffee",
});
```

## :is() 选择器

在之前，对于多个不同父容器的同个子元素的一些共性样式设置，可能会出现如下 CSS 代码：

```css
.header div:hover,
.main div:hover,
.footer div:hover {
  color: green;
  cursor: pointer;
}
```

而如今，有了 `:is()`选择器，则上述代码可以被改写为：

```css
:is(.header, .main, .footer) div:hover {
  color: green;
  cursor: pointer;
}
```

## timing-function

transition-timing-function 是 CSS3 中用来指定过渡效果的时间函数的属性。它定义了过渡效果在时间上的变化规律，控制了过渡效果的速度曲线，从而影响了元素从开始到结束过渡过程中的动画效果。

- `ease`：默认值，缓慢加速，然后缓慢减速的过渡效果。
- `linear`：匀速过渡效果。
- `ease-in`：缓慢加速的过渡效果。
- `ease-out`：缓慢减速的过渡效果。
- `ease-in-out`：先缓慢加速，再缓慢减速的过渡效果。
- `cubic-bezier(n,n,n,n)`：自定义的贝塞尔曲线函数，通过四个值来定义曲线的控制点，分别对应 `x1`、`y1`、`x2`、`y2`。

## 全新的 CSS 动画合成属性：Animation-Composition

众所周知，抛物线运动是一个水平方向上匀速、垂直方向上匀加速的合成运动。这个其实用 CSS 动画也很好实现，水平和垂直两个方向的位移动画分别用不同的动画缓存函数

```css
@keyframes ballMoveX {
  100% {
    transform: translateX(300px);
  }
}
@keyframes ballMoveY {
  100% {
    transform: translateY(300px);
  }
}
.ball {
  animation: ballMoveX 1s linear infinite alternate, ballMoveY 1s cubic-bezier(
        0.55,
        0,
        0.85,
        0.36
      ) infinite alternate;
  animation-composition: add;
}
```

动画合成属性主要是这 3 个关键词：

- **replace**：覆盖（默认值）。动画会覆盖原有属性。
- **add**：追加。动画追加到原有属性后面。
- **accumulate**：累加。动画会和原有属性相同的部分进行累加。

假设有一个元素，默认有一些样式

```css
div {
  transform-origin: 50% 50%;
  transform: translateX(50px) rotate(45deg);
}
```

然后，给一个动画，关键帧是这样的

```css
@keyframes adjust {
  to {
    transform: translateX(100px);
  }
}
```

结果

- `replace`，也就是默认效果。其实就是直接将`transform`中的`translateX(50px) rotate(45deg)`变成了`translateX(100px)`。
- `add` 可以理解成直接在`transform`后追加，也就是最后变成了`translateX(50px) rotate(45deg) translateX(100px)`，等同于先向右移动`50px`，然后旋转`45deg`，再向右移动`100px`
- accumulate 可以理解成将已有的`translateX(50px)`累加，最后结果是 `translateX(150px) rotate(45deg)`

## CSS 中 特性查询（@supports）详解及使用

> CSS 中的 @supports 用于检测浏览器是否支持 CSS 的某个属性。其实就是条件判断，如果支持某个属性可以写一套样式，如果不支持某个属性，可以提供另外一套样式作为替补。可以放在代码的顶层，也可以嵌套在任何其他条件组规则中。

如：检查是否支持 dispaly: flex

```css
@supports (display: flex) {
  div {
    display: flex;
  }
}
```

函数语法

```css
@supports selector(A > B) {
}
```

not 操作符

> 如果浏览器不支持 display:flex 属性的话，那么 div 的样式就是 float: left \*/

```css
@supports not (display: flex) {
  div {
    float: left;
  }
}
```

和其他操作符一样，not 操作符可以应用在任意复杂度的表达式上。

```css
@supports not (not (transform-origin: 2px)) {
}
@supports (display: grid) and (not (display: inline-grid)) {
}
```

and 修饰符

```css
@supports (display: flex) and (box-shadow: 2px 2px 2px black) {
}
```

## 容器查询

> container 是 container-type 和 container-name 的简写
>
> [演示链接](./docs/2024/container.html)

### container-type：

标识一个作为被查询的容器，取值范围为 normal、size、inline-size、block-size、layout、style、state

- normal 是默认值，表示不建立容器元素，
- size 表示水平和垂直方向都建立，
- inline-size 是只在水平方向建立，会给元素同时应用
- layout、style 和 inline-size 容器状态。

### container-name：

被查询的容器的名字

- container-name 的作用是给容器元素命名，这个属性在页面中存在多个容器元素的时候,可以帮我们区分不同的容器属性，不至于搞混

```html
<div class="container" style="--fc: red">
  <p>容器查询容器查询容器查询容器查询</p>
</div>
```

```css
.container {
  width: 60%;
  margin: 50px auto 0;
  container-type: inline-size;
  container-name: containerName;
  background-color: #ccc;
}
.container p {
  text-align: center;
}
@container containerName (inline-size > 500px) {
  .container p {
    background-color: skyblue;
    text-align: left;
  }
}
```

### 样式查询

> 简单地说，样式查询让我们查询一个容器的[CSS 属性](https://so.csdn.net/so/search?q=CSS属性&spm=1001.2101.3001.7020)或 CSS 变量。

```css
@container containerName style(--fc: red) {
  .container p {
    color: var(--fc);
  }
}
```

## 何为 @scroll-timeline 滚动时间线？

我们可以定义一个动画效果，该动画的开始和结束可以通过容器的滚动进度来进行控制

[演示效果](https://jiwei-hemeng.github.io/summary/docs/2024/scrollProgress)

### 语法

```css
animation: move 3s linear;
animation-timeline: scroll();
```

scroll() 可以接受两个参数

- 滚动元素: 滚动元素提供 scroll progress timeline. 可以取值
  nearest: (默认值)设置 animation-timeline 元素最近的、具有滚动条的祖先元素.
  root: 文档的根元素, 即 <html> 元素
  self: 设置 animation-timeline 的元素自身
- 滚动轴:
  y: 垂直滚动轴
  x: 水平滚动轴
  block: (默认值)与滚动容器中行内文本方向垂直的轴. 对于从左到右书写的文字, 与 y 相同. 对于从上到下书写的文字, 与 x 相同.
  inline: 与滚动容器中行内文本方向水平的轴. 对于从左到右书写的文字, 与 x 相同. 对于从上到下书写的文字, 与 y 相同.

### 创建一个带有名称的时间线

> 有时候结构稍微复杂一点，自动查找就不适用了，并且这里的最近祖先滚动容器还受到绝对定位的影响，因此，我们还需要手动去指定滚动容器。

官方的解决方式是创建一个带有名称的时间线，具体做法是，在滚动容器上添加一个属性 scroll-timeline-name，这个属性值必须以--开头，就像 CSS 变量一样，还可以通过 scroll-timeline-axis 设置滚动方向，此时的 animation-timeline 就不用默认的 scroll()了，而是改用前面设置的变量，示意如下

```css
@keyframes animate-it {
  form {
    width: 100%;
  }
}

/*滚动容器*/
.scroller {
  scroll-timeline-name: --my-scroller;
  scroll-timeline-axis: y;
}
/*动画容器*/
.scroller .subject {
  animation: animate-it linear;
  animation-timeline: --my-scroller;
}
```

## css 混合色彩

```css
:root {
  --main-color: #0066cc;
  --hover-color: color-mix(in srgb, var(--main-color), white 20%);
}
```

#  SCSS  

##  循环 

>  在 SCSS 中，循环是一种强大的控制结构，可以帮助你高效地生成重复样式。主要有两种类型的循环：`@for` 和 `@each`。以下是对这两种循环的详细讲解和示例。 

### `@for` 循环

**through**

```scss
@for $i from 1 through 5 {
  .item-#{$i} {
    width: 20px * $i; // 20px, 40px, 60px, 80px, 100px
  }
}
```

 在这个例子中，循环创建了 `.item-1` 到 `.item-5` 的类，每个类的宽度依次增加。 

**to**

```scss
@for $i from 1 to 5 {
  .item-#{$i} {
    margin-bottom: 10px * $i; // 10px, 20px, 30px, 40px
  }
}
```

###  @each 循环

**迭代列表**

```scss
$colors: red, green, blue;

@each $color in $colors {
  .bg-#{$color} {
    background-color: $color;
  }
}
```

**迭代映射**

```scss
$font-sizes: (
  small: 12px,
  medium: 16px,
  large: 20px,
);

@each $name, $size in $font-sizes {
  .font-#{$name} {
    font-size: $size;
  }
}
```

**循环中的条件语句**

```scss
$breakpoints: (small: 600px, medium: 900px, large: 1200px);

@each $name, $value in $breakpoints {
  @media (max-width: $value) {
    .container-#{$name} {
      padding: 20px;
    }
  }
}
```

