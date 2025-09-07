const offset = 200; // 偏移量
const duration = 500; // 动画持续时间
const map = new WeakMap();
const ob = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 元素进入视口
        const animation = map.get(entry.target); // 获取动画实例
        animation.play();
        ob.unobserve(entry.target); // 取消观察，防止重复触发
      }
    });
  },
  { threshold: 0, rootMargin: `-60px 0px 0px 0px`, root: null }
);
function belowViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top > window.innerHeight;
}
export default {
  mounted(el) {
    if (!belowViewport(el)) {
      return;
    }
    const animattion = el.animate(
      [
        { transform: `translateY(${offset}px)`, opacity: 0.5 },
        { transform: "translateY(0)", opacity: 1 }
      ],
      {
        duration: duration,
        easing: "ease-out",
        fill: "forwards"
      }
    );
    animattion.pause();
    ob.observe(el);
    map.set(el, animattion);
  },
  unmounted(el) {
    // 清理逻辑代码
    ob.unobserve(el);
  }
};
