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
  _isDisconnected = false;
  _cleanups = new Set();

  connectedCallback() {
    if (this.shadowRoot) return;

    this.attachShadow({ mode: "open" });
    this._initReactiveState();
    this._setupRenderEffect();

    // 延迟执行 mounted，确保首次渲染完成
    requestAnimationFrame(() => {
      if (!this._isDisconnected) {
        this.mounted?.();
      }
    });
  }

  disconnectedCallback() {
    this._isDisconnected = true;
    this.unmounted?.();
    this._cleanupEffects();
  }

  _initReactiveState() {
    // 支持默认状态
    const defaultState = this.defaultState?.() || {};
    this.state = reactive({ ...defaultState, ...this.state });
  }

  _setupRenderEffect() {
    const stop = effect(() => {
      if (this._isDisconnected) return;

      const content = this.render();

      // 使用 requestAnimationFrame 优化渲染时机
      requestAnimationFrame(() => {
        if (!this._isDisconnected && this.shadowRoot) {
          render(content, this.shadowRoot);
        }
      });
    });

    this._cleanups.add(stop);
  }

  _cleanupEffects() {
    this._cleanups.forEach((cleanup) => {
      try {
        cleanup();
      } catch (error) {
        console.error("Cleanup error:", error);
      }
    });
    this._cleanups.clear();
  }

  // 工具方法：批量更新状态
  setState(updates) {
    Object.assign(this.state, updates);
  }

  // 工具方法：强制重新渲染
  forceUpdate() {
    if (!this._isDisconnected) {
      const content = this.render();
      render(content, this.shadowRoot);
    }
  }
}
