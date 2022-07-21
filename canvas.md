## canvas

> h5 新增的画布

### 基本使用

```html
<canvas id="canvas" width="500" height="500"></canvas>
<script>
  // 1.获取canvas画布，这块是通过元素标签获取
  let app = document.querySelector("#canvas");
  // 获取画笔（上文对象实例）
  let context = app.getContext("2d");
</script>
```

**关于画布的宽高的设置**

画布的宽高可是通过css进行设置，也可以通过`canvas` 的width、height 属性进行设置，但是推荐通过js设置，因为css设置的只是视觉上的宽和高。

### 常用方法

**画矩形**

```js
const app = document.querySelector("#canvas")
const context = app.getContext("2d");
// 从（10，10）开始绘制300*100像素的已填矩形，其起点为画布的左上角
context.fillStyle = "teal";
context.fillRect(10, 10, 300, 100); 
// // 从（10，120）开始绘制300*100像素的矩形，其起点为画布的左上角, 边框颜色是orange
context.strokeStyle = "orange"; 
context.strokeRect(10, 120, 300, 100) 
```

 **画布-三角形绘制**

```js
var app = document.querySelector("#app");
// 2.获取画笔（上文对象实例）
var context = app.getContext("2d");
// 3.绘制边框三角形
// 绘制路径：beginPath()：开启一条路径或重置当前路径
context.beginPath();
// 边框三角型样式
context.strokeStyle = "pink"; // 修改直线的颜色
context.lineWidth = "5"; // 修改直线的宽度
// 修改直线两端样式
cxt.lineCap = "round"; // 默认: butt; 圆形: round; 方形: square
context.moveTo(200, 100);
context.lineTo(250, 200);
context.lineTo(150, 200);
context.closePath();
// 进行绘制
context.stroke();
context.fillStyle = "blue"; // 填充背景色
context.fill(); // 开始填充
```

**画布-渐变效果**

线性渐变

> 核心语法：createLinearGradient(起始位置x,起始位置y,结束位置x,结束位置y)

```js
const app = document.querySelector("#canvas")
const context = app.getContext("2d");
context.beginPath();
context.lineTo(200, 210);
context.lineTo(250, 310);
context.lineTo(150, 310);
const grad = context.createLinearGradient(200, 210, 200, 310);
// 对grad对象添加指定位置的颜色
grad.addColorStop(0, "teal");
grad.addColorStop(0.5, "orange");
grad.addColorStop(1, "red");
context.fillStyle = grad;
context.closePath();
// 进行绘制
context.fill();
```

镜像渐变

```js
const app = document.querySelector("#canvas")
const context = app.getContext("2d");
//已填充渐变颜色的圆形
context.arc(100, 100, 50, 0, Math.PI * 2, false);
//该对象的作用域是以(100,100)为圆心、半径为10px的内圆和以(100,100)为圆心、半径为50px的外圆之间的环状区域
let grade = context.createRadialGradient(100, 100, 10, 100, 100, 50);
//在offset为0的位置(即内圆的圆圈处)添加一个蓝色的渐变
grade.addColorStop(0, "blue");
//在offset为0.5的位置(环状区域从内到外放射50%的中间位置)添加一个绿色的渐变
grade.addColorStop(0.5, "green");
//在offset为0的位置(即外圆的圆圈处)添加一个红色的渐变
grade.addColorStop(1, "red");
//将fillStyle的属性值设为该CanvasGradient对象
context.fillStyle = grade;
context.fill();
```

**画布-画圆效果**

> 语法：arc(x, y, r, sAngle, eAngle, counterclockwise)
>
> 参数说明： x - 原点在x轴的坐标，y - 原点在y轴的坐标, r 圆的半径，sAngle - 起始角，eAngle- 结束角，counterclockwise 是否是逆时针

已填充圆形

```js
const app = document.querySelector("#canvas")
const context = app.getContext("2d");
context.fillStyle = "teal";
context.beginPath();
context.arc(300, 100, 50, 0, Math.PI * 2)
context.fill();
```

边框圆形

```js
const app = document.querySelector("#canvas")
const context = app.getContext("2d");
context.strokeStyle = "orange";
context.beginPath();
context.arc(300, 300, 50, 0, Math.PI * 2);
context.stroke();
```

**画布-文字效果**

```js
const app = document.querySelector("#canvas")
const context = app.getContext("2d");
context.font = "24px 宋体"
context.fillStyle = "#FFC82C"
// 设置右对齐
context.textAlign = "right"
// 在指定位置绘制文字，这里指定距离右下角20坐标的地方
context.fillText(text, canvas.width - 20, canvas.height - 20);
```
**旋转**

```js
const app = document.querySelector("#canvas")
const context = app.getContext("2d");
context.translate(230, 230); // 重置中心点
context.rotate(10 * Math.PI / 180);
```

**清除画布**

```js
const app = document.querySelector("#canvas")
const context = app.getContext("2d");
context.clearRect(0, 0, 500, 500);
```

**将图片绘制到画布上**

```js
const app = document.querySelector("#canvas")
const context = app.getContext("2d");
const img = new Image()
img.src = "../case.png";
img.addEventListener("load", () => {
  app.width = img.width;
  app.height = img.height;
  context.drawImage(img, 0, 0);
  const imgBase64 = app.toDataURL("image/jpeg", 0.7);
  console.log("imgBase64", imgBase64);
})
```

**操作点阵图**

```js
const app = document.querySelector("#canvas")
const context = app.getContext("2d");
const img = new Image()
img.src = "../case.png";
img.addEventListener("load", () => {
  let imageData = context.getImageData(0, 0, 480, 320);
  // 处理逻辑
  context.putImageData(imageData, 0 200)
})
```

**HTML canvas drawImage() 方法**

语法 1：在画布上定位图像：
> context.drawImage(img,x,y);
语法 2：在画布上定位图像，并规定图像的宽度和高度
> context.drawImage(img,x,y,width,height);
语法 3： 剪切图像，并在画布上定位被剪切的部分
> context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
参数说明：
+ img	规定要使用的图像、画布或视频。
+ sx	可选。开始剪切的 x 坐标位置。
+ sy	可选。开始剪切的 y 坐标位置。
+ swidth	可选。被剪切图像的宽度。
+ sheight	可选。被剪切图像的高度。
+ x	在画布上放置图像的 x 坐标位置。
+ y	在画布上放置图像的 y 坐标位置。
+ width	可选。要使用的图像的宽度。（伸展或缩小图像）
+ height	可选。要使用的图像的高度。（伸展或缩小图像）
