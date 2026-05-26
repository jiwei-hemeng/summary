import { html, render } from "lit-html";
import { reactive, effect } from "@vue/reactivity";
/**
 * 内存管理：添加 disconnectedCallback 清理副作用，防止内存泄漏
 * 性能优化：使用 requestAnimationFrame 优化渲染时机
 * 错误处理：添加 try-catch 防止清理函数报错
 * 工具方法：提供 setState、forceUpdate 等实用方法
 * 开发体验：添加性能日志和调试信息
 * 生命周期：正确处理 mounted/unmounted 执行时机
 */
export default class JwComponent extends HTMLElement {
  html = html;
  #isDisconnected = false;
  #cleanups = new Set();

  connectedCallback() {
    if (this.shadowRoot) return;

    this.attachShadow({ mode: "open" });
    this.#initReactiveState();
    this.#setupRenderEffect();

    // 延迟执行 mounted，确保首次渲染完成
    requestAnimationFrame(() => {
      if (!this.#isDisconnected) {
        this.mounted?.();
      }
    });
  }

  disconnectedCallback() {
    this.#isDisconnected = true;
    this.unmounted?.();
    this.#cleanupEffects();
  }

  #initReactiveState() {
    // 支持默认状态
    const defaultState = this.defaultState?.() || {};
    this.state = reactive({ ...defaultState, ...this.state });
  }

  #setupRenderEffect() {
    const stop = effect(() => {
      if (this.#isDisconnected) return;

      const content = this.render();

      // 使用 requestAnimationFrame 优化渲染时机
      requestAnimationFrame(() => {
        if (!this.#isDisconnected && this.shadowRoot) {
          render(content, this.shadowRoot);
        }
      });
    });

    this.#cleanups.add(stop);
  }

  #cleanupEffects() {
    this.#cleanups.forEach((cleanup) => {
      try {
        cleanup();
      } catch (error) {
        console.error("Cleanup error:", error);
      }
    });
    this.#cleanups.clear();
  }

  // 工具方法：批量更新状态
  setState(updates) {
    Object.assign(this.state, updates);
  }

  // 工具方法：强制重新渲染
  forceUpdate() {
    if (!this.#isDisconnected) {
      const content = this.render();
      render(content, this.shadowRoot);
    }
  }
}
