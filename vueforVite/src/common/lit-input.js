/* eslint-disable no-undef */
import { LitElement, html } from "lit";

class LitInput extends LitElement {
  static properties = {
    modelValue: { type: String },
    debounce: { type: Number },
    type: { type: String },
    placeholder: { type: String }
  };

  constructor() {
    super();
    this.modelValue = "";
    this.debounce = 0;
    /** @type {number | null} */
    this.debounceTimer = null;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    requestAnimationFrame(() => {
      this.initProps();
    });
  }

  initProps() {
    // 从属性中获取初始值
    const initialValue = this.getAttribute("model-value") || "";
    this.modelValue = initialValue;
  }

  updateVal(v) {
    if (this.debounce > 0) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        // 防抖结束后，检查值是否仍然匹配
        const inputEl = this.renderRoot?.querySelector("input");
        if (inputEl && inputEl.value === v) {
          this.#emitValue(v);
        }
        this.debounceTimer = null;
      }, this.debounce);
    } else {
      this.#emitValue(v);
    }
  }

  #emitValue(v) {
    if (this.modelValue === v) return; // 避免重复设置
    this.modelValue = v;
    this.dispatchEvent(
      new CustomEvent("update:model-value", {
        detail: v,
        bubbles: true,
        composed: true
      })
    );
  }

  render() {
    const inputType = this.type || "text";
    return html`
      <input
        type="${inputType}"
        placeholder="${this.placeholder}"
        .value="${this.modelValue}"
        @input="${(e) => this.updateVal(e.target.value)}"
      />
    `;
  }
}

customElements.define("lit-input", LitInput);
export default LitInput;
