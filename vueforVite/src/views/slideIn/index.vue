<template>
  <div>
    <div v-for="(item) in 23" :key="item" v-slide-in class="item">
      <img
        v-lazy-load
        src=""
        data-src="/images/lazy-load-image.png" alt="图片加载失败" />
    </div>
  </div>
</template>
<style scoped>
.item {
  height: 600px;
  background-color: darkslateblue;
  margin-bottom: 20px;

  &:nth-of-type(5n + 1) {
    background-color: aqua;
  }

  &:nth-of-type(5n + 2) {
    background-color: coral;
  }

  &:nth-of-type(5n + 3) {
    background-color: fuchsia;
  }

  &:nth-of-type(5n + 4) {
    background-color: olive;
  }
}
</style>