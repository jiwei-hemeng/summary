# web_components

> web-componets 类似于vue以及react中组件定制，将一组ui以及公共逻辑抽取，并且封装成为一个公共组件。在页面可以随处调用

## 生命周期

```js
class Dialog extends HTMLElement {
  constructor() {
    super();
    // 是否有disable
    this.disabled = this.hasAttribute("disabled");
    // 获取到className 属性
    this.className = this.getAttribute("class-name");
    this.dialogText = this.getAttribute("dialog-text");
  }
  static get observedAttributes() {
    return ["dialog-text", "disabled", "class-name"];
  }
  connectedCallback() {
    console.log("dialog element added to page.");
  }
  disconnectedCallback() {
    console.log("dialog element removed from page.");
  }
  attributeChangedCallback(name, oldValue, newValue) {
    console.log("dialog element attributes changed.");
    if (name === "dialog-text") {
      this.dialogText = newValue;
    }
  }
}
```

## 插槽的使用

```html
<!-- 这段代码不会在页面展示 -->
<template id="task-list">
  <style>
    .task-list {
      list-style: none;
      background-color: gray;
    }
  </style>
  <ul>
    <li class="item"><p>1</p></li>
    <li class="item">2</li>
    <!-- 使用name属性定义插槽名称 -->
    <li><slot name="other-item">base item</slot></li>
  </ul>
</template>
<task-list>
  <p slot="other-item">this is slot content</p>
</task-list>
<script>
  customElements.define(
    "task-list",
    class extends HTMLElement {
      constructor() {
        super();
        let template = document.getElementById("task-list");
        let templateContent = template.content;
        this.attachShadow({ mode: "open" }).appendChild(
          templateContent.cloneNode(true),
        );
      }
    },
  );
</script>
```

## 使用shadow root外部样式影响不到组件

```html
<div style="width: 300px; height: 300px; border: 1px solid red">
  <task-list data-list="[1,2,3,4,5,6,7,8]"></task-list>
</div>
<script>
  class TaskList extends HTMLElement {
    constructor() {
      super();
      // 这里的this就是task-list元素

      // 创建一个shadow root
      const shadow = this.attachShadow({ mode: "open" });

      // 通过getAttribute方法获取标签上的属性
      const dataList = JSON.parse(this.getAttribute("data-list") || "[]");

      // 创建一个ul元素
      const ul = document.createElement("ul");
      ul.classList.add("task-list");

      // 循环创建li元素
      dataList.forEach((item) => {
        const li = document.createElement("li");
        li.classList.add("task-item");
        li.textContent = item;
        li.addEventListener("click", this.showItemContent.bind(this, li));
        ul.appendChild(li);
      });

      // 创建样式
      const style = document.createElement("style");
      style.textContent = this.defineStyle();

      // 将样式添加至shadow 根节点
      shadow.appendChild(style);

      // 将ul添加至shadow 根节点
      shadow.appendChild(ul);
    }
    /**
     * 定义组件样式，外部style无法影响组件样式
     */
    defineStyle() {
      return `
            .task-list{
                list-style: none;
            }
        `;
    }

    showItemContent(ele) {
      console.log(ele.textContent, `ele.textContent`);
    }
  }
  // 定义task-list组件
  customElements.define("task-list", TaskList);
</script>
```

## 定义Customized built-in elements组件

```html
<div style="width: 300px; height: 300px; border: 1px solid red">
  <ul is="task-list" data-list="[1,2,3,4,5,6,7,8]"></ul>
</div>
<script>
  class TaskList extends HTMLUListElement {
    constructor() {
      super();
      // 这里的this就是task-list元素
      this.classList.add("task-list");
      // 通过getAttribute方法获取标签上的属性
      const dataList = JSON.parse(this.getAttribute("data-list") || "[]");

      // 循环创建li元素
      dataList.forEach((item) => {
        const li = document.createElement("li");
        li.classList.add("task-item");
        li.textContent = item;
        this.appendChild(li);
      });
    }
  }

  customElements.define("task-list", TaskList, { extends: "ul" });
</script>
```

## lit-html 基本使用

```js
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
      },
      loading: Boolean,
    };
  }

  constructor() {
    super();
    this.name = "John Doe";
    this.age = 30;
    this.loading = false;
    this.items = [
      { id: 1, name: "第一项" },
      { id: 2, name: "第二项" },
    ];
  }

  render() {
    return html`
      <style>
        p {
          color: blue;
        }
      </style>
      <p>Hello, my name is ${this.name}. I am ${this.age} years old.</p>
      <slot name="header"></slot>
      <ul>
        ${repeat(
          this.items,
          (item) => item.id,
          (item) => html`<li>${item.text}</li>`,
        )}
      </ul>
      ${when(
        this.loading,
        () => html`<p>Loading...</p>`,
        () => html`<p>Content loaded</p>`,
      )}
      <button @click="${this._onClick}">Update Age</button>
    `;
  }

  _onClick() {
    this.age += 1; // 自动触发重新渲染
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      console.log(`${propName} changed from ${oldValue} to ${this[propName]}`);
    });
  }
  firstUpdated() {
    // 可以在这里访问 Shadow DOM 内的元素
    this.shadowRoot.querySelector("button")?.focus();
  }
}

customElements.define("my-component", MyComponent);
```

## Web组件基类

```js
import { html, render } from "lit-html";
import { reactive, effect } from "@vue/reactivity";
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
```

基本使用

```js
import JwComponent from "./JwComponent";

class MyCounter extends JwComponent {
  state = {
    count: 1,
  };
  mounted() {
    console.log("Component mounted");
  }

  increment() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return this.html`
      <div>
        <h2>Count: ${this.state.count}</h2>
        <button @click=${() => this.increment()}>
          Increment
        </button>
      </div>
    `;
  }
}

customElements.define("my-counter", MyCounter);
```

## Vue + Lit 集成生命周期 / 事件常见冲突与解决方案

### `disconnectedCallback` 提前 / 滞后触发

**现象**：Vue `v-if` 销毁组件时，Lit 元素 `disconnectedCallback` 不执行（资源不释放、定时器 / 监听残留）；或 Vue 组件更新 diff 临时移除 DOM 再挂载，Lit 反复 `connected/disconnected` 重复初始化。

**原因**：Vue diff 机制临时挪 DOM 节点（文档碎片），元素脱离文档又快速插回，WebComponent 规范：**脱离文档 > 瞬间复入不会触发 disconnected**；`v-if` 销毁 Vue 实例先卸载子组件 DOM，Vue 异步更新队列和 Lit 同步 DOM 生命周期时序错位。

```html
<!-- 避免v-if频繁切换，v-show只改display不删DOM -->
<lit-comp v-show="show" />
```

需要`v-if`时在 Vue `onUnmounted`手动调用 Lit 清理：

```js
import { ref, onUnmounted } from "vue";
const litRef = ref(null);
onUnmounted(() => {
  litRef.value?.disconnectedCallback?.();
});
```

### Lit 初始化晚于 Vue 传参，`attributeChangedCallback` 漏初始属性

**现象**：Vue 通过`:attr="val"`绑定属性，Lit 首次拿不到初始值，属性监听回调不触发；后续更新正常。

**原因**：Vue 模板属性赋值在 DOM 挂载后异步执行，Lit `constructor/connectedCallback` 执行更早，属性还未注入 DOM。

**方案**

1. Lit 内部`connectedCallback`延迟一帧读取属性：`requestAnimationFrame(()=>{this.initProps()})`
2. Vue 改用`ref`挂载后手动赋值属性 /prop。

### 自定义事件无法用 Vue `@event` 捕获（原生 CustomEvent 和 Vue 事件模型不兼容）

**现象**：Lit `this.dispatchEvent(new CustomEvent('change',{detail:xx}))`，Vue 写`@change="handler"`收不到事件。

**根因**：Vue 模板`@xxx`默认**合成事件**，WebComponent 派发的是**原生 DOM 事件**；Vue3 对原生自定义事件部分兼容，但**冒泡配置、cancelable 缺省会拦截**。

```js
// Lit组件内
this.dispatchEvent(
  new CustomEvent("select", {
    detail: data,
    bubbles: true, // 事件向上冒泡到Vue父DOM
    composed: true, // 穿透shadowDom（Lit默认开shadow）
  }),
);
```

Vue 写法：`<lit-comp @select="handleSelect" />`

### v-model 双向绑定失效

Lit 自定义组件无法被 Vue 原生 v-model 识别，`v-model="val"`事件收不到。

```js
/* eslint-disable no-undef */
import { LitElement, html } from "lit";

class LitInput extends LitElement {
  static properties = {
    modelValue: { type: String },
    debounce: { type: Number },
    type: { type: String },
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
    console.log("LitInput initialized with modelValue:", this.modelValue);
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
        composed: true,
      }),
    );
  }

  render() {
    const inputType = this.type || "text";
    return html`
      <input
        type="${inputType}"
        .value="${this.modelValue}"
        @input="${(e) => this.updateVal(e.target.value)}"
      />
    `;
  }
}

customElements.define("lit-input", LitInput);
export default LitInput;
```

封装通用 WebComponent 适配器（Vue3 setup + 兼容原生 WC v-model、可拿完整 Event.detail）

```html
<template>
  <component :is="tagName" ref="wcDom" v-bind="attrs" :model-value="modelValue">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </component>
</template>

<script setup>
  import {
    useTemplateRef,
    computed,
    onMounted,
    onBeforeUnmount,
    useAttrs,
    watch,
  } from "vue";
  // eslint-disable-next-line vue/require-prop-types
  const props = defineProps(["modelValue", "tagName"]);
  const emit = defineEmits(["update:modelValue", "native-change"]);
  const wcDomRef = useTemplateRef("wcDom");
  let handler = null;
  const $attrs = useAttrs();
  const attrs = computed(() => {
    const raw = { ...$attrs };
    Object.keys(raw).forEach((key) => {
      if (key.startsWith("on")) delete raw[key];
    });
    return raw;
  });

  watch(
    () => props.modelValue,
    (val) => {
      if (wcDomRef.value) {
        wcDomRef.value.modelValue = val;
      }
    },
    { flush: "post" },
  );

  onMounted(() => {
    if (!wcDomRef.value) return;
    handler = (e) => {
      emit("update:modelValue", e.detail);
      emit("native-change", e);
    };
    wcDomRef.value.addEventListener("update:model-value", handler);
  });

  onBeforeUnmount(() => {
    if (wcDomRef.value && handler) {
      wcDomRef.value.removeEventListener("update:model-value", handler);
    }
  });
</script>
```

vue 代码

```html
<script setup lang="ts">
  import { computed } from "vue";
  import { useToken } from "@/stores/useInfo";
  import WcModel from "@/components/WcModel.vue";
  // 可以在组件中的任意位置访问 `store` 变量 ✨
  const url = computed(() => {
    return location.href + "?id=" + store.token;
  });
  const store = useToken();
  function setToken() {
    store.setToken(Date.now().toString());
  }
</script>
<template>
  <div class="about">
    <WcModel
      v-model="store.token"
      tag-name="lit-input"
      placeholder="请输入token"
    />
    <button @click="setToken">设置token</button>
  </div>
</template>
```
