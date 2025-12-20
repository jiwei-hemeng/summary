import { LitElement, html } from "lit";
import { repeat } from "lit/directives/repeat.js"; // 循环
import { when } from "lit/directives/when.js"; // 条件渲染
class MyComponent extends LitElement {
  static get properties() {
    return {
      name: { type: String },
      age: { type: Number },
      items: {
        type: Array,
        converter: {
          fromAttribute: (attrValue, attrName) => {
            return attrValue ? JSON.parse(attrValue) : [];
          },
          toAttribute: (propValue, attrName) => {
            // 将属性值转为字符串（用于反射到 attribute）
            return propValue ? JSON.stringify(propValue) : "";
          },
        },
      },
      loading: Boolean,
    };
  }

  constructor() {
    super();
    this.name = "John Doe";
    this.age = null;
    this.loading = false;
    this.items = [];
  }

  render() {
    return html`
      <style>
        p {
          color: blue;
        }
        ul,
        li {
          padding: 0;
          list-style: none;
        }
      </style>
      <p>Hello, my name is ${this.name}. I am ${this.age} years old.</p>
      <slot name="header"></slot>
      <ul>
        ${repeat(
          this.items,
          (item) => item.id,
          (item, index) =>
            html`<li @click="${this.deleteItem.bind(this, index)}">
              ${item.name}
            </li>`
        )}
      </ul>
      ${when(
        this.loading,
        () => html`<p>Loading...</p>`,
        () => html`<p>Content loaded</p>`
      )}
      <input id="test-input" type="number" value="${this.age}" />
      <button @click="${this._onClick}">Update Age</button>
      <button @click="${this._addItem}">新增</button>
      <button @click="${() => (this.loading = !this.loading)}">切换</button>
    `;
  }

  _onClick() {
    this.age += 1; // 自动触发重新渲染
  }
  _addItem() {
    this.items = [...this.items, { name: "New Item", id: Date.now() }];
  }

  deleteItem(index) {
    // 使用 filter 创建新数组，确保响应式更新
    this.items = this.items.filter((_, i) => i !== index);
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      console.log(
        `${propName} changed from`,
        JSON.stringify(oldValue),
        "to",
        JSON.stringify(this[propName])
      );
    });
  }
  firstUpdated() {
    // 可以在这里访问 Shadow DOM 内的元素
    this.shadowRoot.querySelector("#test-input")?.focus();
  }
}

customElements.define("jw-component", MyComponent);
