# IntersectionObserver：元素进入视口了吗？

基础用法

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img); // 加载完就取消观察
    }
  });
});
document.querySelectorAll("img[data-src]").forEach((img) => {
  observer.observe(img);
});
```

进阶用法：控制触发时机

```js
const observer = new IntersectionObserver(callback, {
  root: null, // null = 视口
  rootMargin: "0px 0px -100px 0px", // 距离底部100px时就触发
  threshold: [0, 0.5, 1], // 0%、50%、100% 可见时分别触发
});
```

实战：滚动动画触发

```js
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".card").forEach((el) => observer.observe(el));
```

# ResizeObserver：元素尺寸变了

基础用法

```js
const observer = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    const { width, height } = entry.contentRect;
    console.log(`元素新尺寸：${width} x ${height}`);
  });
});
observer.observe(document.querySelector(".box"));
```

实战：响应式 Canvas 自适应

```js
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    redraw(); // 重新绘制内容
  }
});
resizeObserver.observe(canvas);
```

实战：文字溢出自动缩小字号

```js
function fitText(el) {
  const observer = new ResizeObserver(() => {
    let fontSize = 24;
    el.style.fontSize = fontSize + "px";
    while (el.scrollWidth > el.clientWidth && fontSize > 10) {
      fontSize -= 1;
      el.style.fontSize = fontSize + "px";
    }
  });
  observer.observe(el);
}
```

# MutationObserver：DOM 变了

基础用法

```js
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    console.log("变化类型：", mutation.type);
    console.log("新增节点：", mutation.addedNodes);
    console.log("删除节点：", mutation.removedNodes);
    console.log("属性变化：", mutation.attributeName);
  });
});
observer.observe(document.querySelector("#app"), {
  childList: true, // 监听子节点增删
  subtree: true, // 监听所有后代
  attributes: true, // 监听属性变化
  characterData: true, // 监听文本内容变化
});
```

实战：第三方内容注入监控

```js
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1 && node.tagName === "IFRAME") {
        console.warn("检测到非预期 iframe 注入：", node);
        node.remove(); // 直接移除
      }
    });
  });
});
observer.observe(document.body, { childList: true, subtree: true });
```
