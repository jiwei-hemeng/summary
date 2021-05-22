## 仿京东轮播图

**在html页面**

```html
<div id="bannerCenter" class="banenr-center">
  <!-- 轮播项 -->
  <div class="content">
    <div class="item">
      <a href="#">
        <img src="/assets/2-21010610513XQ.jpg">
      </a>
    </div>
  </div>
  <!-- 左按钮 -->
  <a class="btn btn-left" href="javascript:">&lt;</a>
  <!-- 右按钮 -->
  <a class="btn btn-right" href="javascript:">&gt;</a>
  <!-- 轮播图指示器 -->
  <ul class="controls">
    <li class="active"></li>
    <li></li>
  </ul>
</div>
```

**javascript**

```js
// 移动特效
function moveElement(element, targetVal, speedVal) {
  window.clearInterval(dsq);
  dsq = window.setInterval(function () {
    // 获取左边的距离
    var leftVal = element.offsetLeft;
    // 判断
    if (leftVal == targetVal) {
      window.clearInterval(dsq);
      return;
    }
    if (Math.abs(targetVal - leftVal) < speedVal) {
      element.style.left = targetVal + 'px';
    } else {
      if (targetVal > leftVal) { // 正方向
        leftVal = leftVal + speedVal;
      } else {
        leftVal = leftVal - speedVal;
      }
      element.style.left = leftVal + 'px';
    }
  }, 100);
}
// 获取轮播图数据的方法
async function getCarouselData(list) {
  // 获取轮播图的盒子
  const rootDom = document.querySelector("#bannerCenter .content");
  // 获取指示器的盒子
  const indicatorDom = document.querySelector("#bannerCenter .controls");
  rootDom.innerHTML = "";
  indicatorDom.innerHTML = "";
  list.forEach((item, iIndex) => {
    const liDom = document.createElement("li");
    if (iIndex === 0) {
      liDom.setAttribute("class", "active")
    }
    indicatorDom.append(liDom)
  })
  list.push(list[0]);
  list.forEach((item, LIndex) => {
    const craouseItem = document.createElement("div");
    const newA = document.createElement("a");
    const img = document.createElement("img");
    craouseItem.setAttribute("class", "item");
    newA.setAttribute("href", "/");
    img.setAttribute("src", item);
    img.setAttribute("alt", "轮播图" + LIndex);
    newA.append(img)
    craouseItem.append(newA)
    rootDom.append(craouseItem)
  })
  swarp()
}

function swarp() {
  // 获取元素
  const bannerCenter = document.getElementById('bannerCenter');
  const content = document.querySelector('#bannerCenter .content');
  const btnLeft = document.querySelector('.btn-left');
  const btnRight = document.querySelector('.btn-right');
  const lis = document.querySelectorAll('.controls li');
  const Imgs = document.querySelectorAll("#bannerCenter.banenr-center img");
  const mIndex = content.querySelectorAll(".item").length;

  // 定义索引值
  let cindex = 0;
  // 获取宽度
  const width = bannerCenter.offsetWidth;
  for (let i = 0; i < Imgs.length; i++) {
    Imgs[i].style.width = width + "px";
  }
  content.style.width = width * mIndex + "px";
  // 1、点击右按钮换图
  btnRight.onclick = function () {
    if (cindex == 0) {
      // 瞬间移动到初始位置
      content.style.left = '0px';
    }
    // 点击按钮cindex++,那么cindex++之前cindex是谁
    lis[cindex].className = '';
    // 索引改变
    cindex++;
    var moveVal = -cindex * width;
    // 调用动画
    moveElement(content, moveVal, 300);
    if (cindex == mIndex - 1) {
      cindex = 0;
    }
    // 添加类名
    lis[cindex].className = 'active';
  }

  // 2、点击左按钮换图
  btnLeft.onclick = function () {
    lis[cindex].className = '';
    // 索引值
    cindex--;
    if (cindex < 0) {
      // cindex = 0;
      cindex = mIndex - 2;
      content.style.left = -(mIndex - 1) * width + 'px';
    }
    // 计算要移动的距离
    var moveVal = -cindex * width;
    // 调用动画
    moveElement(content, moveVal, 300);
    // 添加类名
    lis[cindex].className = 'active';
  }

  // 3、点击小点换图
  for (var i = 0; i < lis.length; i++) {
    lis[i].newIndex = i;
    lis[i].onclick = function () {
      // 点击li获取点击li的索引值,吧li索引值给了index
      lis[cindex].className = '';
      cindex = this.newIndex;
      // 计算要移动的距离
      var moveVal = -cindex * width;
      // 调用动画
      moveElement(content, moveVal, 100);
      // 添加类名
      lis[cindex].className = 'active';
    }
  }

  // 5、自动轮播图片
  var lb = window.setInterval(function () {
    btnRight.onclick();
  }, 2000);

  // 6、鼠标进图停止轮播,鼠标离开继续轮播图片
  bannerCenter.onmouseover = function () {
    window.clearInterval(lb);
  }
  // 鼠标离开轮播图继续播放轮播图
  bannerCenter.onmouseout = function () {
    lb = window.setInterval(function () {
      btnRight.onclick();
    }, 2000);
  }
}
let dsq = null;
// 调用方法
getCarouselData([
  "/assets/2-21010610513XQ.jpg",
  "/assets/img_nature_wide.jpg"
]);
```

**css 样式 **

```js
/* 轮播图样式 */
#bannerCenter.banenr-center {
  width: 100%;
  height: 450px;
  position: relative;
  overflow: hidden;
}
#bannerCenter.banenr-center img {
  display: inline-block;
  width: 100%;
  height: 450px;
}
/* 轮播项容器 */
#bannerCenter.banenr-center .content {
  /* width: 3600px; */
  /* height: 454px; */
  position: absolute;
}

#bannerCenter.banenr-center .content .item {
  float: left;
}

/* 左右按钮 */
#bannerCenter.banenr-center .btn {
  width: 30px;
  height: 50px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(41, 34, 34, 0.4);
  text-align: center;
  font: bold 18px/50px '宋体';
  color: #fff;
  display: none;
}
#bannerCenter.banenr-center .btn-right {
  right: 0;
}
#bannerCenter.banenr-center:hover .btn {
  display: block;
}
/* 小点样式 */
#bannerCenter.banenr-center li {
  width: 8px;
  height: 8px;
  border: 1px solid #ccc;
  border-radius: 50%;
  float: left;
  margin-left: 20px;
  position: relative;

}
#bannerCenter.banenr-center li:first-child {
  margin-left: 0;
}
#bannerCenter.banenr-center li::after {
  width: 16px;
  height: 16px;
  background: rgba(255, 255, 255, 0.6);
  position: absolute;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  content: '';
  display: none;
}
#bannerCenter.banenr-center li.active {
  background: #fff;
}
#bannerCenter.banenr-center li.active::after {
  display: block;
}
#bannerCenter.banenr-center ul {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}
/* 超小设备（手机） */
@media screen and (min-width: 320px) and (max-width: 767px) {
  #bannerCenter.banenr-center {
    height: 190px;
  }
  #bannerCenter.banenr-center img {
    height: 190px;
  }
}
```

## 仿照elementui 的提示框

在页面中

```html
<div id="tip"></div>
<botton>弹框</botton>
```

在javascript中

```js
// 提示框淡入
function message_danchu(dom) {
  let top = -30;
  let timer = setInterval(function () {
    top += 10;
    if (top > 30) {
      clearInterval(timer);
    }
    dom.style.top = top + "px";
  }, 20);
}

// 提示框淡出
function message_fadeOut(dom) {
  let top = 30;
  let timer = setInterval(function () {
    top -= 10;
    if (top < -60) {
      clearInterval(timer);
    }
    dom.style.top = top + "px";
  }, 10);
}
function message(obj) {
  let { type = "sucess", msg = "操作成功", duration = 3000 } = obj;
  let root = document.querySelector("#tip");
  root.innerHTML = "";
  let i = document.createElement("i");
  let span = document.createElement("span");
  span.innerText = msg;
  if (type === "success") {
    root.setAttribute("class", "success root");
    i.setAttribute("class", "iconfont icon-success");
  } else {
    root.setAttribute("class", "warning root");
    i.setAttribute("class", "iconfont icon-warning");
  }
  root.append(i);
  root.append(span);
  message_danchu(root);
  setTimeout(function () {
    message_fadeOut(root);
  }, duration);
}
```

在css样式中

```css
.root {
  position: fixed;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 420px;
  height: 40px;
  display: flex;
  align-items: center;
  line-height: 40px;
  text-align: center;
  margin: 0 auto;
  background: #F0F9EB;
  z-index: 9999999999;
  border-radius: 5px;
  border: 1px solid #74C55C;
}
#tip .iconfont {
  margin-right: 120px;
}
#tip.success .icon-success,
#tip.warning .icon-warning {
  color: #67C23A;
  font-size: 30px;
  margin-left: 20px;
}
#tip.warning .icon-warning {
  color: #E6A23C;
}
#tip.warning {
  background-color: #FDF6EC;
  border: 1px solid #E6A23C;
}
#tip.success span {
  color: #74C55C;
}
#tip.warning span {
  color: #E6A23C;
}
#tip span {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
@media screen and (min-width: 320px) and (max-width: 767px) {
  .root {
    width: 80%;
  }
  #tip .iconfont {
    margin-right: 60px;
  }
}
```

使用方式

```js
document.querySelector("botton").addEventListener("click", function() {
  message({
    type: "success",
    msg: "操作成功",
    duration: 5000,
  })
})
```

## 淡入与淡出效果

```js
// js 淡入效果
function fadeIn(element, speed = 30) {
  if (element.style.opacity != 1) {
    var num = 0;
    var st = setInterval(function () {
      num++;
      element.style.opacity = num / 10;
      if (num >= 10) {
        clearInterval(st);
      }
    }, speed);
  }
}
// js 实现淡出效果
function fadeOut(element, speed = 30) {
  if (element.style.opacity != 0) {
    var num = 10;
    var st = setInterval(function () {
      num--;
      element.style.opacity = num / 10;
      if (num <= 0) {
        clearInterval(st);
      }
    }, speed);
  }
}
```

## 锚点链接的平滑滚动

```js
// 平滑滚动函数的封装
function smoothScroll(el, speed = 200) {
  // el 是滚动的目标Dom speed 是每次滚动的距离
  let h = el.offsetTop;
  var init = 0;
  let timer = setInterval(function () {
    init += speed;
    if (init >= h) {
      clearInterval(timer);
    }
    document.documentElement.scrollTop = init;
    document.body.scrollTop = init;
  }, 30);
}
// 锚点链接的平滑滚动
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    smoothScroll(document.querySelector(this.getAttribute("href")));
  });
});
```
## 移动端_判断是左滑还是右滑

```html
<!-- 结构 -->
<div id="rootDom"></div>
<!-- js 部分 -->
<script>
  let rootDom = document.querySelector("#rootDom");
  let wn = null;
  rootDom.addEventListener("touchstart", function(e) {
    console.log("e", e)
    wn = e.touches[0].clientX
  })
  rootDom.addEventListener("touchend", function(e) {
    if(wn < e.changedTouches[0].clientX) {
      alert("123")
    } else {
      alert("465")
    }
  })
</script>
<!-- 样式 部分 -->
<style>
  #rootDom {
    width: 100%;
    height: 100px;
    background-color: skyblue;
  }
</style>
```

