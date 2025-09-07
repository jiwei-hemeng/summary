class FancyConsole {
  constructor() {
    this.styles = {
      info: `background: linear-gradient(135deg, #70a1ff, #1e90ff);color: white;   padding: 3px 10px;border-radius: 4px;border-left: 4px solid #3742fa;font-weight: bold;text-shadow: 1px 1px 2px rgba(0,0,0,0.2);`,
      warn: `background: linear-gradient(135deg, #ffa502, #ff7f50);color: white;padding: 3px 10px;border-radius: 4px;animation: blink 1s infinite;font-weight: bold;text-shadow: 1px 1px 2px rgba(0,0,0,0.3);`,
      error: `background: linear-gradient(135deg, #ff4757, #e84118);color: white;padding: 3px 10px;border-radius: 4px;border-right: 4px solid #ff0000;font-weight: bold;text-shadow: 2px 2px 4px rgba(0,0,0,0.5);position: relative;overflow: hidden;`
    };
  }
  // 通用打印方法（灵魂所在）
  #log(type, icon, ...args) {
    const style = this.styles[type].replace(/\s+/g, " ");
    console.log(`%c${icon} ${type.toUpperCase()}`, style, ...args);
    // 给error加个“血流成河”特效
    if (type === "error") {
      const errorStyle = `background: linear-gradient(45deg, #ff0000, #8b0000);position: absolute;top: 0;left: -50%;width: 200%;height: 100%;opacity: 0.3;pointer-events: none;`;
      console.log("%c", errorStyle);
    }
  }
  info(...args) {
    this.#log("info", "☁️", ...args);
  }
  warn(...args) {
    this.#log("warn", "⚠️", ...args);
  }
  error(...args) {
    this.#log("error", "💀", ...args);
  }
}
// 导出实例（单例模式，避免重复造轮子）
export const fancyConsole = new FancyConsole();
