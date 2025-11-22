// 获取页面中所有的卡片元素
const cards = document.querySelectorAll(".card");
// 初始化所有卡片为激活状态
cards.forEach((card) => card.classList.add("is-active"));
// 监听鼠标进入事件，使用捕获阶段确保事件能正确触发
document.addEventListener(
  "mouseenter",
  (event) => {
    // 查找最近的卡片父元素
    const card = event.target.closest(".card");
    if (card) {
      // 移除所有卡片的激活状态
      cards.forEach((c) => c.classList.remove("is-active")); // 为当前卡片添加激活状态
      card.classList.add("is-active");
    }
  },
  true
);
// 监听鼠标离开事件，使用捕获阶段确保事件能正确触发
document.addEventListener(
  "mouseleave",
  (event) => {
    // 查找最近的卡片父元素
    const card = event.target.closest(".card");
    if (card) {
      // 重新激活所有卡片
      cards.forEach((c) => c.classList.add("is-active"));
    }
  },
  true
);
