<script setup lang="ts">
import { ref, onMounted } from "vue"
const video = ref<HTMLVideoElement | null>(null)
const canvasDom = ref<HTMLCanvasElement | null>(null)
const imgSrc = ref<string>("")
const image = ref<string[]>([])
onMounted(() => {
  getCamera()
})
// 打开相机
const open = () => {
  getCamera()
}
const getCamera = () => {
  if (navigator.mediaDevices && video.value) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        // 摄像头开启成功
        video.value!.srcObject = stream
        video.value!.play()
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
// 拍照 绘制图片
const takePhoto = () => {
  if (canvasDom.value && video.value) {
    // 设置画布大小与摄像大小一致
    canvasDom.value.width = video.value.videoWidth
    canvasDom.value.height = video.value.videoHeight
    // 执行画的操作
    canvasDom.value.getContext("2d")!.drawImage(video.value, 0, 0)
    // 将结果转换为可展示的格式
    imgSrc.value = canvasDom.value.toDataURL("image/webp")
    console.log(imgSrc.value)
    image.value.push(imgSrc.value)
  }
  function closeCamera() {
    if (video.value && video.value.srcObject) {
      const tracks = (video.value.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      video.value.srcObject = null
    }
  }
  video.value.srcObject.getTracks()[0].stop()
}
</script>
<template>
  <div id="body">
    <div class="body">
      <div class="camera">
        <video ref="video"></video>
        <canvas style="display: none" id="canvasCamera"
          ref="canvasDom"></canvas>
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
        <button @click="closeCamera">关闭相机</button>
      </div>
    </div>
  </div>
</template>
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
