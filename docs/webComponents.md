# web_components

> web-componets 类似于vue以及react中组件定制，将一组ui以及公共逻辑抽取，并且封装成为一个公共组件。在页面可以随处调用

## web component的基本使用

### 创建一个类或函数来指定web组件的功能

```js
class Dialog extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const p = document.createElement('p');
    const text = this.getAttribute('dialog-text');
    p.textContent = text;
    shadow.appendChild(p);
  }
}
```

### 用 customElements.define() 方法注册自定义的元素 ，并且指定component名称，以及创建的类

```js
customElements.define('dialog-element', Dialog);
```

### 在页面中使用

```html
<body>
  <dialog-element dialog-text="this is dialog-text"></dialog-element>
</body>
```

## 生命周期

+ connectedCallback 

  当 custom element首次被插入文档DOM时，被调用

+ disconnectedCallback

  - 当 custom element从文档DOM中删除时，被调用

+ adoptedCallback

  - 当 custom element被移动到新的文档时，被调用

+ attributeChangedCallback

  - 当 custom element增加、删除、修改自身属性时，被调用

```js
class Dialog extends HTMLElement {
    constructor() {
        super();
    }
    static get observedAttributes() {
        return ['dialog-text'];
    }
    connectedCallback() {
        console.log('dialog element added to page.');
    }
    disconnectedCallback() {
        console.log('dialog element removed from page.');
    }
    adoptedCallback() {
        console.log('dialog element moved to new page.');
    }
    attributeChangedCallback(name, oldValue, newValue) {
        console.log('dialog element attributes changed.');
    }
}
```

## template方式

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
        <li class="item">1</li>
        <li class="item">2</li>
    </ul>
</template>
<!-- 这个组件会在页面展示 -->
<task-list></task-list>
<script>
  customElements.define(
    'task-list',
    class extends HTMLElement {
        constructor() {
            super();
            let template = document.getElementById('task-list');
            let templateContent = template.content;
            // 使用cloneNode方式将templateContent添加到当前元素中
            this.attachShadow({ mode: 'open' }).appendChild(templateContent.cloneNode(true));
        }
    }
);
</script>
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
    'task-list',
    class extends HTMLElement {
        constructor() {
            super();
            let template = document.getElementById('task-list');
            let templateContent = template.content;
            this.attachShadow({ mode: 'open' }).appendChild(templateContent.cloneNode(true));
        }
    }
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
        const shadow = this.attachShadow({ mode: 'open' });

        // 通过getAttribute方法获取标签上的属性
        const dataList = JSON.parse(this.getAttribute('data-list') || '[]');

        // 创建一个ul元素
        const ul = document.createElement('ul');
        ul.classList.add('task-list');

        // 循环创建li元素
        dataList.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('task-item');
            li.textContent = item;
            li.addEventListener('click', this.showItemContent.bind(this, li));
            ul.appendChild(li);
        });

        // 创建样式
        const style = document.createElement('style');
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
customElements.define('task-list', TaskList);
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
        this.classList.add('task-list');
        // 通过getAttribute方法获取标签上的属性
        const dataList = JSON.parse(this.getAttribute('data-list') || '[]');

        // 循环创建li元素
        dataList.forEach(item => {
            const li = document.createElement('li');
            li.classList.add('task-item');
            li.textContent = item;
            this.appendChild(li);
        });
    }
}

customElements.define('task-list', TaskList, { extends: 'ul' });
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
          (item) => html`<li>${item.text}</li>`
        )}
      </ul>
      ${when(
        this.loading,
        () => html`<p>Loading...</p>`,
        () => html`<p>Content loaded</p>`
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
