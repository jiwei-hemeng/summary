<script setup>
import { ref, nextTick } from "vue";
let isDevelop = ref(false);
let reftDom = ref(null);
function developChange() {
  if (isDevelop.value) {
    reftDom.value.style.display = "block";
    nextTick(() => {
      reftDom.value.classList.add("sideLeftIn");
    });
  } else {
    reftDom.value.classList.add("sideLeftOut");
  }
}
function leftAnimationend() {
  isDevelop.value = !isDevelop.value;
  if (isDevelop.value) {
    reftDom.value.style.display = "none";
    reftDom.value.classList.remove("sideLeftOut");
  } else {
    reftDom.value.style.display = "block";
    reftDom.value.classList.remove("sideLeftIn");
  }
}
</script>
<template>
  <div class="contain">
    <div class="left" ref="reftDom" @animationend="leftAnimationend">
      <p class="left-contain">左侧内容左侧内容左侧内容左侧内容左侧内容左侧内容左侧内容左侧内容左侧内容左侧内容左侧内容</p>
    </div>
    <div class="mid sidebar" @click="developChange">
      {{ isDevelop ? "⬆️点击展开⬆️" : "⬇️点击收起⬇️" }}
    </div>
    <div class="right">
      <p>右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容右侧内容</p>
    </div>
  </div>
</template>
<style scoped>
.contain {
  display: flex;
}
.left {
  width: 450px;
  background-color: skyblue;
  overflow: hidden;
}
.left .left-contain {
  width: 450px;
  word-break: break-all;
}
.mid {
  width: 20px;
  height: 600px;
}
.right {
  flex: 1;
  background-color: green;
}
.sidebar {
  text-align: center;
  writing-mode: vertical-lr;
  background-color: #eee;
}
.sideLeftOut {
  animation: sideLeftOut 0.5s;
}
.sideLeftIn {
  animation: sideLeftIn 0.5s;
}

@keyframes sideLeftOut {
  0% {
    width: 450px;
  }
  100% {
    width: 0;
  }
}
@keyframes sideLeftIn {
  0% {
    width: 0;
  }
  100% {
    width: 450px;
  }
}
</style>
