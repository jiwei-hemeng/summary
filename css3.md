## 文本选择颜色

```css
::selection {
    background-color: #ccc;
    color: #666;
}
```

## 首字下沉

> 使用 first-letter 伪元素来装饰你的第一个字母，不需要使用 span 和 .dropcap 类名。

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

## 平滑滚动

```css
html {
    scorll-behavior: smooth !important;
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
.content-warpper {
    width: 100%;
    height: 260px;
}
/* 滚动条的样式 */
.content-warpper::-webkit-scrollbar {
    width: 2px;
    background-color: #dbdbdb;
    border-radius: 1px;
}
.content-warpper::-webkit-scrollbar:active {
    background-color: #616161;
}
/* 滚动条里面的小方块 */
.content-warpper::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: skyblue;
}
/* 滚动条里面的轨道 */
.content-warpper::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rbga(0,0,0, 0.5);
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
background-image: url('./fisrtbg.jpg');
/* 背景图片的尺寸  */
background-size: cover;
/* 背景图像是否固定或者随着页面的其余部分滚动，默认值scroll, 默认会滚动 */
background-attachment: fixed;
/* 设置背景图片的位置 */
background-position: center;
```

## object-fit

> 当图片比例不固定，想让图片自适应，一般都会使用background-size: cover/contain, 但是这个只适用背景图。css 可以使用object-fit属性来解决图片被拉伸或者被缩放的问题；

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



![image-20210812095044739](https://jiwei-hemeng.github.io/summary/assets/images/image-20210812095044739.png)

 fill: 默认值。内容拉伸填满整个content box, 不保证保持原有的比例。contain: 保持原有尺寸比例。长度和高度中长的那条边跟容器大小一致，短的那条等比缩放，可能会有留白。cover: 保持原有尺寸比例。宽度和高度中短的那条边跟容器大小一致，长的那条等比缩放。可能会有部分区域不可见。（常用）none: 保持原有尺寸比例。同时保持替换内容原始尺寸大小。scale-down:保持原有尺寸比例,如果容器尺寸大于图片内容尺寸，保持图片的原有尺寸，不会放大失真；容器尺寸小于图片内容尺寸，用法跟contain一样。 

## css中的attr()函数

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

## css的calc()函数

**在less或sass中经常会遇到**

```css
$width = 100px;
.box {
    width: $width + 100px;
}
```

然而 **clac()**  函数提供了更好的

```css
.box {
    width: clac(100% - 50px);
}
```

表示box元素的宽度总是小于父元素的50px

**应用1：创建根栅格尺寸**

```css
html {
    font-size: calc(100vw / 750);
}
```

**应用2：实现元素的居中**

```css
.box {
    position: absolute;
    top: calc(50% - 150px);
    left: calc(50% - 150px);
}
```

## 使用CSS自定义属性（变量）

> [相关链接](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Using_CSS_custom_properties)
>
> **自定义属性**（有时候也被称作**CSS变量**或者**级联变量**）是由CSS作者定义的，它包含的值可以在整个文档中重复使用。由自定义属性标记设定值（比如： **`--main-color: black;`**），由[var() ](https://developer.mozilla.org/zh-CN/docs/Web/CSS/var())函数来获取值（比如： `color: **var(--main-color)**;`）

```css
:root {
  --main-bg-color: brown;
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

## 常见的让盒子居中显示的方法

**方法一：**

父盒子给 position：relative；

盒子给 position：absolute；top：0；right：0；bottom：0；left：0；margin：auto；

**方法二：**

父盒子给 position：relative；

盒子给 position：absolute；top：50%；left：50%；transform：translate（-50%，-50%）；

**方法三：**

父盒子给 display: flex;align-items: center;justify-content: center;

## C3新特性

- CSS实现圆角（border-radius）,阴影（box-shadow）,边框图片border-image
- 对文字加特效（text-shadow）,强制文本换行（word-wrap）,线性渐变（linear-gradient）
- 旋转，缩放，定位，倾斜
- 媒体查询（@media）,多栏布局（flex）

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

**2. 父级添加overflow方法**：

```css
.father {
    overflow: hidden;
}
```

**3. 使用after伪元素清除浮动**

```css
.clearfix::after {
    content: "";
    display: block;
    clear: both;
    width:0;
    visibility: hidden;
    height: 0
}
.clearfix {
    /*   IE6、7、8的写法  */
    zoom: 1
}
```

## 关于flex布局

+ flex-direction：设置主轴的方向
+ justify-content：设置主轴上的子元素排列方式
+ flex-wrap：设置子元素是否换行  
+ align-content：设置侧轴上的子元素的排列方式（多行）
+ align-items：设置侧轴上的子元素排列方式（单行）
+ flex-flow：复合属性，相当于同时设置了 flex-direction 和 flex-wrap

### 让flex布局的最后一行左对齐

**方案一：行数固定解决办法**

**对应的html**

```html
<div class="container">
  <div class="list"></div>
  <div class="list"></div>
  <div class="list"></div>
  <div class="list"></div>
  <div class="list"></div>
</div>
```

**对应的css**

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

**方案二：每一行列数不固定**

**对应的html**

```html
<div class="container">
  <div class="list"></div>
  <div class="list"></div>
  <div class="list"></div>
  <div class="list"></div>
  <div class="list"></div>
  <div class="list"></div>
  <!--比div少一个-->
  <i></i><i></i><i></i><i></i><i></i> 
</div>
```

**对应的css**

```css
.container {
  display: flex;
  jusify-content: space-between;
  flex-wrap: wrap;
  margin-right: -10px;
}
.list {
  width: 100px;
  height: 100px;
  background-color: skyblue;
  margin: 15px 10px 0 0;
}
.container>i {
  /* 此处必须和list宽度保持一致 */
  width: 100px;
  margin-right: 10px;
}
```

## 关于媒体查询

H5的新特性，为了移动端的使用而新增的特性，使用 @media 查询，你可以针对不同的媒体类型定义不同的样式，响应式布局就是使用媒体查询的原理

```css
/*and  可以将多个媒体特性链接到一块,相当于且*/
/*only   指定某个特定的媒体类型, 可以省略*/
@media only screen and (min-width: 320px) and (max-width: 767px) {}
/* 横屏显示 */
@media screen and (orientation: landscape) {}
/* 竖屏显示 */
@media screen and (orientation: portrait) {}
```

## 怎么让Chrome支持小于12px 的文字

> 谷歌Chrome最小字体是12px，不管你设置成8px还是10px，在浏览器中只会显示12px，那么如何解决这个坑爹的问题呢？

```css
p span{
    font-size:10px;
    -webkit-transform:scale(0.8);
    display:block;
}
```

## 文字溢出时显示点点点

**单行**

```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

**多行**

```css
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3;  //这里是在第二行有省略号
overflow: hidden;
```

## px 、em 和 rem 的区别

+ px 是一个固定单位
+ em是一个相对单位，相对于当前标签的字体大小
+ rem是一个相对单位，相对于html的字体大小

## 纯css的遮罩层

在html中定义html元素

```html
<div class="mask"></div>
```

在css中写样式

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

## 移动端特殊的css

```css
/* 清除移动端高亮 */
-webkit-tap-highlight-color: transparent;
/* 清除ios默认样式 */
-webkit-appearance: none;
/* 禁止长按弹出菜单 */
-webkit-touch-callout: none;
```

## content-visibility

> content-visibility是一个css属性，它控制一个元素是否呈现其内容，能让用户潜在地控制元素的呈现。用户可以使用它跳过元素的呈现(包括布局和绘制)，直到用户需要为止，让页面的初始渲染得到极大的提升。

content-visibility属性有三个可选值:

+ visible: 默认值。对布局和呈现不会产生什么影响。
+ hidden: 元素跳过其内容的呈现。用户代理功能（例如，在页面中查找，按Tab键顺序导航等）不可访问已跳过的内容，也不能选择或聚焦。类似于对其内容设置了display: none属性
+ auto: 对于用户可见区域的元素，浏览器会正常渲染其内容；对于不可见区域的元素，浏览器会暂时跳过其内容的呈现，等到其处于用户可见区域时，浏览器在渲染其内容。

## 去掉数字输入框中上下箭头

```css
input[type="number"] {
    -moz-appearance: textfield;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
```

## 伪类选择器 `:focus-within`

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

## 标准盒模型和怪异盒模型的区别

标准盒模型 box-sizing: content-box; IE盒子模型 box-sizing: border-box; 

标准盒与怪异盒的区别在于他们的总宽度的计算公式不一样。

+ 标准模式(也称w3c盒模型)下总宽度=width+margin（左右）+ padding（左右）+ border（左右）；
+ 怪异模式下总宽度=width+margin（左右）（就是说width已经包含了padding和border值）

## flex属性 是哪些属性的简写

> flex: 1就是flex-grow: 0; flex-shrink; 1; flex-basis: auto 的简写。

 **flex-grow**

该属性用来设置当父元素的宽度大于所有子元素的宽度的和时（即父元素会有剩余空间），子元素如何分配父元素的剩余空间。 `flex-grow`的默认值为0，意思是该元素不索取父元素的剩余空间，如果值大于0，表示索取。值越大，索取的越厉害。

**flex-shrink**

该属性用来设置，当父元素的宽度小于所有子元素的宽度的和时（即子元素会超出父元素），子元素如何缩小自己的宽度的。 `flex-shrink`的默认值为1，当父元素的宽度小于所有子元素的宽度的和时，子元素的宽度会减小。值越大，减小的越厉害。如果值为0，表示不减小。

**flex-basis**

该属性用来设置元素的宽度，其实，width也可以设置宽度。如果元素上同时设置了width和flex-basis，那么width 的值就会被flex-basis覆盖掉。

##  li与li之间有看不见的空白间隔是什么原因引起的？有什么解决方法？

> 行框的排列会受到之间空白(回车空格)等的影响，因为空格也属于字符，这些空白也会被应用样式，占据空间，所以会用空格

**解决办法**

+ 可以将<li>代码写成一排
+ 浮动li中float: left;
+ 在ul中用font-size: 0(谷歌不支持);可以使用letter-space: -3px;

##  行内元素什么时候会显示间隙

> 元素被当成行内元素排版时，原来的html代码这回车换行被转换成一个空白字符，在字体不为0的情况下，空白符会占据一定的宽度，所以行内元素会显示间隙

**解决办法**

+ 给父元素设置字体为0
+ 改变书写方式
+ 使用margin负值
+ 使用word-spacing或者letter-spacing

## 关于1px的问题

> 在移动端web开发中, UI设计稿中设置的边框为1px,在开发过程中前端会设置border: 1px;但是在某些机型上测试，1px会比较粗。

**方案一: transform: scale(0.5)**

```css
div {
  border: 1px;
  -webkit-transform: scaleY(0.5);
}
```

**方案二： 媒体查询以用设备像素比缩放**

```css
.border {
  border: 1px solid #999;
}
@media screen and (-webkit-min-device-pixel-ratio: 2) {
  .border {
    border: 0.5px solid #999;
  }
}
@media screen and (-webkit-min-device-pixel-ratio: 3) {
  .border {
    border: 0.33 solid #999;
  }
}
```

## css 的阴影和渐变

**渐变**

```css
.box {
  // 线性渐变
  background: linear-gradient(45deg, #f00 20%, #0f0 40%, #0f0 60%);
  // 径向渐变 ellipse 为椭圆 circle 为正元
  background: radial-gradient(ellipse, #0f0, #f00, #00f)
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

## @font-face的用法

自定义字体

```css
@font-face {
  font-family: 'MyWebFont';
  src: url('webfont.eot'); /* IE9 Compat Modes */
  src: url('webfont.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
       url('webfont.woff') format('woff'), /* Modern Browsers */
       url('webfont.ttf')  format('truetype'), /* Safari, Android, iOS */
       url('webfont.svg#svgFontName') format('svg'); /* Legacy iOS */
}

body {
  font-family: 'MyWebFont';
}
```

## 圣杯布局

> 两边固定，中间自适应的布局叫圣杯布局

**实现方式1**

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

**实现方法2**

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

##  二倍精灵图

> **概念**：设置的图片的分辨率和图片的宽高是2倍的关系称为**二倍图**

**步骤**

1. 利用background-image引入二倍精灵图    
2. 将二倍精灵图在fw软件中缩小至一倍，查看此时图片的宽度，利用background-size设置背景大小
3. 利用fw软件测量此时需要的图标的定位，利用background-position设置背景定位

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
.laterr {
  width: 230px;
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

## **解决vertical-align属性不生效**

 在使用vertical-align:middle实现垂直居中的时候，经常会发现不生效的情况。这里需要注意它生效需要满足的条件： 

+ 作用环境 :  父元素设置line-height。需要和height一致。或者将display属性设置为table-cell，将块元素转化为单元格。 
+  作用对象 :  子元素中的inline-block和inline元素 

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
input[type="search"]::-webkit-search-cancel-button{
  -webkit-appearance: none;
}
```
## 解决margin塌陷的方法
+ 给父盒子设置border，添加border后父盒子和子盒子就不会贴在一起了
+ 给父盒子添加overflow：hidden  让他溢出隐藏
+ 给父盒子设定padding值 

## accent-color 应用场景

> 表单控件颜色设置  

```css
input[type=radio] {
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

