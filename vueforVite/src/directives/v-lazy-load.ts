const ob = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 元素进入视口
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src; // 设置真实的图片地址
        ob.unobserve(entry.target); // 取消观察，防止重复触发
      }
    });
  },
  { threshold: 0, rootMargin: "0px", root: null }
);

export default {
  mounted(el) {
    ob.observe(el);
  },
  unmounted(el) {
    // 清理逻辑代码
    ob.unobserve(el);
  }
};
