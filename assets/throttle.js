// 防抖
export function debounce(fn, delay = 200) {
  let timeout = null;
  if (timeout !== null) clearTimeout(timeout);
  timeout = setTimeout(fn, delay);
}
// 节流
export function throttle(handler, wait) {
  let lastTime = 0; // 上一次触发的时间，第一次默认为0
  return function () {
    let newTime = Date.now(); // 新的触发时的时间
    if (newTime - lastTime > wait) {
      handler.apply(this, arguments);
      lastTime = newTime; // 更新上一次触发的时间
    }
  };
}
