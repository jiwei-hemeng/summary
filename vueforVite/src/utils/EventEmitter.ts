type EventCallback = (...args: any[]) => void;

class EventEmitter {
  private events: Record<string, EventCallback[]>;

  constructor() {
    this.events = {};
  }

  /**
   * 监听事件
   * @param name 事件名
   * @param callback 回调函数
   */
  on(name: string, callback: EventCallback): void {
    if (this.events[name]) {
      this.events[name].push(callback);
    } else {
      this.events[name] = [callback];
    }
  }

  /**
   * 取消监听
   * @param name 事件名
   * @param callback 可选，不传则清空整个事件
   */
  off(name: string, callback?: EventCallback): void {
    if (!this.events[name]) {
      return;
    }

    if (!callback) {
      delete this.events[name];
      return;
    }

    this.events[name] = this.events[name].filter((item) => item !== callback);
  }

  /**
   * 触发事件
   * @param name 事件名
   * @param args 传递的参数
   */
  emit(name: string, ...args: any[]): void {
    if (!this.events[name]) {
      return;
    }

    this.events[name].forEach((cb) => cb(...args));
  }
}

export default new EventEmitter();
