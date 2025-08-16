<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="loading">
    <div class="loading_bg"></div>
    <div class="loading_box">
      <ul>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  z-index: 99999;
}

.loading_bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  background: #f6f6f6;
}

.loading_box {
  height: 100vh;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading_box ul {
  height: 20px;
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: 0px;
}

.loading_box ul li {
  width: 14px;
  height: 14px;
  border-radius: 1rem;
  margin-right: 10px;
  list-style-type: none;
}

.loading_box ul li:nth-child(1) {
  background: #f4433c;
  animation: loading-v3 3s 0s infinite;
}

.loading_box ul li:nth-child(2) {
  background: #ff9800;
  animation: loading-v3 3s 0.2s infinite;
}

.loading_box ul li:nth-child(3) {
  background: #ffeb3b;
  animation: loading-v3 3s 0.4s infinite;
}

.loading_box ul li:nth-child(4) {
  background: #64e291;
  animation: loading-v3 3s 0.6s infinite;
}

.loading_box ul li:nth-child(5) {
  background: #2d85f0;
  animation: loading-v3 3s 0.8s infinite;
}

.loading_box ul li:nth-child(6) {
  background: #794c74;
  animation: loading-v3 3s 1s infinite;
}

@keyframes loading-v3 {
  25%,
  50% {
    height: 60px;
    transform: translateY(-30px);
  }
  75%,
  100% {
    height: 14px;
    transform: translateY(-7px);
  }
}
</style>
