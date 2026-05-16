// @ts-nocheck
async function getModules() {
  const modules = import.meta.glob("../pages/*.jsx");
  for (const path in modules) {
    const module = await modules[path]();
    // 在这里处理导入的模块
  }
}