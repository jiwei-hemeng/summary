const KEYPREFIX = "paina:state:";

export default (context: { store: any }) => {
  console.log("🚀 persistPlugin instantiated!"); // ← 加这行
  const { store } = context;
  const KEY = KEYPREFIX + store.$id;
  // 存
  window.addEventListener("beforeunload", () => {
    localStorage.setItem(KEY, JSON.stringify(store.$state));
  });
  // 取
  const item = localStorage.getItem(KEY);
  if (!item) {
    return;
  }
  try {
    const originState = JSON.parse(item);
    store.$patch(originState);
  } catch {
    console.error("存储格式失败");
  }
};
