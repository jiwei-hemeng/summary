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
</style>
