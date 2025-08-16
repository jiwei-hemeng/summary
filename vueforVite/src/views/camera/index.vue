<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="body">
    <div class="body">
      <div class="camera">
        <video ref="video"></video>
        <canvas style="display: none" id="canvasCamera" ref="canvasDom"></canvas>
      </div>
      <div class="img_body">
        <div class="img_content">
          <div class="image" v-for="(item, index) in image" :key="index">
            <img :src="item" alt="" />
          </div>
        </div>
      </div>
      <div>
        <button @click="open">打开相机</button>
        <button @click="takePhoto">拍照</button>
        <button @click="CloseCamera">关闭相机</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
const video = ref(null);
const canvasDom = ref(null);
const imgSrc = ref("");
const image = ref([]);
onMounted(() => {
  getCamera();
});
// 打开相机
const open = () => {
  getCamera();
};
const getCamera = () => {
  if (navigator.mediaDevices) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        // 摄像头开启成功
        video.value.srcObject = stream;
        video.value.play();
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
// 拍照 绘制图片
const takePhoto = () => {
  // 设置画布大小与摄像大小一致
  canvasDom.value.width = video.value.videoWidth;
  canvasDom.value.height = video.value.videoHeight;
  // 执行画的操作
  canvasDom.value.getContext("2d").drawImage(video.value, 0, 0);
  // 将结果转换为可展示的格式
  imgSrc.value = canvasDom.value.toDataURL("image/webp");
  console.log(imgSrc.value);
  image.value.push(imgSrc.value);
};
// 关闭摄像头
const CloseCamera = () => {
  console.log("关闭摄像头");
  video.value.srcObject.getTracks()[0].stop();
};
</script>

<style scoped>
#body {
  width: 100%;
  display: flex;
  justify-content: center;
}
button {
  width: 80px;
  height: 25px;
  background-color: rgb(86, 250, 174);
  margin: 5px;
  border-radius: 5px;
}
.camera {
  margin-top: 10px;
}
.camera video {
  border-radius: 5px;
}
.img_body {
  width: 100%;
}
.img_content {
  width: 100%;
  display: flex;
}
.image {
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.image img {
  width: 80px;
  height: 80px;
  border-radius: 5px;
}
</style>
