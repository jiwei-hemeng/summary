# View Transitions API

## 什么是 View Transitions API

它是浏览器提供的原生页面切换动画 API。它的工作流程非常直观：

- 页面切换时，浏览器自动捕捉当前页面状态（旧视图）
- 执行 DOM 更新（路由跳转、内容替换等）
- 捕捉更新后的新页面状态（新视图）
- 自动在两帧之间插值，生成平滑过渡动画

核心优势：

- 无需手动编写 CSS 动画
- 自动匹配新旧视图中的相同元素
- 浏览器底层优化，性能极佳

## 基础用法

```html
<a href="/about" onclick="event.preventDefault(); navigateTo('/about')">
  关于我们
</a>
<script>
  async function navigateTo(page) {
    document.startViewTransition(() => {
      window.location = page;
    });
  }
</script>
```

## 在 React 中与 React Router 配合使用

```jsx
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  async function handleNavigate(path) {
    if (document.startViewTransition) {
      await document.startViewTransition(() => {
        navigate(path);
      }).finished;
    } else {
      navigate(path); // 不支持 API 则直接跳转
    }
  }
  return (
    <nav>
      <button onClick={() => handleNavigate("/")}>首页</button>
      <button onClick={() => handleNavigate("/about")}>关于</button>
    </nav>
  );
}
```

## Vue Router 示例

```js
import { useRouter } from "vue-router";
const router = useRouter();
async function navigate(path) {
  if (document.startViewTransition) {
    await document.startViewTransition(() => {
      router.push(path);
    }).finished;
  } else {
    router.push(path);
  }
}
return { navigate };
```

## 进阶用法：自定义元素匹配

```html
<template>
  <div>
    <button @click="toggle">切换页面</button>
    <div
      class="test-container"
      :class="{ active: isActive }">
      {{ isActive ? '页面B' : '页面A' }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const isActive = ref(false)
function toggle() {
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      isActive.value = !isActive.value
    })
  } else {
    isActive.value = !isActive.value
  }
}
</script>

<style>
.test-container {
  view-transition-name: test-container;
  padding: 20px;
  background: #f0f0f0;
}

::view-transition-old(test-container),
::view-transition-new(test-container) {
  animation-duration: 0.3s;
}

/* 旧视图：从左边滑出 */
::view-transition-old(test-container) {
  animation: slide-out-left 0.3s ease-in-out;
}

/* 新视图：从右边滑入 */
::view-transition-new(test-container) {
  animation: slide-in-right 0.3s ease-in-out;
}
</style>
```

工作原理

+ 定义名称：通过 view-transition-name: test-container 标记元素
+ 触发过渡：调用 document.startViewTransition() 改变 DOM
+ 选择状态：浏览器生成伪元素树，::view-transition-old(test-container) 代表旧快照 ::view-transition-new(test-container) 代表新快照

## 自定义过渡动画

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.3s;
}

/* 旧视图：从左边滑出 */
::view-transition-old(root) {
  animation: slide-out-left 0.3s ease-in-out;
}

/* 新视图：从右边滑入 */
::view-transition-new(root) {
  animation: slide-in-right 0.3s ease-in-out;
}

@keyframes slide-out-left {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-30px);
    opacity: 0;
  }
}

@keyframes slide-in-right {
  from {
    transform: translateX(30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

可用的伪元素

- `::view-transition-old(root)` 旧视图的动画
- `::view-transition-new(root)` 新视图的动画
