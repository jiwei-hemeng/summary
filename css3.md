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
.content-warpper::-webkit-scrollbar {
    width: 2px;
    background-color: #dbdbdb;
    border-radius: 1px;
}
.content-warpper::-webkit-scrollbar:active {
    background-color: #616161;
}
```

## 禁用用户选择

```CSS
.content-header h2 {
    user-select: none;
}
```

## 竖排文字

```css
.sidebar h3 {
    writing-mode: lb-rl;
    transform: rotate(-180deg)
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

## 让flex布局的最后一行左对齐

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

## c3 盒模型

> div p 等元素的大小会受到内边距、外边距以及边框的影响，可以通过设置c3 和模型使其更稳固的结构，意味着如果添加border或padding会造成真正放置内容的区域变小

```css
div {
   box-sizing: border-box; 
}
```

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
