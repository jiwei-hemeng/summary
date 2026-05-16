<script setup lang="ts">
import { ref, onMounted } from 'vue'

const video = ref<HTMLVideoElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const photoList = ref<string[]>([])

// 打开摄像头（APP 兼容版）
const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'environment', // 后置摄像头
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    })

    if (video.value) {
      video.value.srcObject = stream
      video.value.play()
    }
  } catch (err) {
    console.error('打开相机失败：', err)
    alert('相机打开失败，请允许权限')
  }
}

// 拍照
const takePhoto = () => {
  if (!video.value || !canvas.value) return

  const v = video.value
  const ctx = canvas.value.getContext('2d')
  if (!ctx) return

  // 强制宽高，解决 APP 获取不到宽高的问题
  const w = v.videoWidth || 640
  const h = v.videoHeight || 480

  canvas.value.width = w
  canvas.value.height = h
  ctx.drawImage(v, 0, 0, w, h)

  // 生成图片
  const base64 = canvas.value.toDataURL('image/jpeg', 0.8)
  photoList.value.unshift(base64)
}

// 关闭摄像头
const stopCamera = () => {
  if (video.value?.srcObject) {
    const stream = video.value.srcObject as MediaStream
    stream.getTracks().forEach(track => track.stop())
    video.value.srcObject = null
  }
}

// 页面加载自动打开
onMounted(() => {
  startCamera()
})
</script>

<template>
  <div class="camera-page">
    <!-- 视频区域 -->
    <div class="video-box">
      <video ref="video" autoplay playsinline muted></video>
    </div>

    <!-- 画布（隐藏） -->
    <canvas ref="canvas" class="canvas"></canvas>

    <!-- 按钮 -->
    <div class="btns">
      <button @click="startCamera">打开相机</button>
      <button @click="takePhoto">拍照</button>
      <button @click="stopCamera">关闭相机</button>
    </div>

    <!-- 照片列表 -->
    <div class="photos">
      <img v-for="(item, i) in photoList" :key="i" :src="item" />
    </div>
  </div>
</template>

<style scoped>
.camera-page {
  padding: 10px;
}

.video-box {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

video {
  width: 100%;
  background: #000;
  border-radius: 8px;
}

.canvas {
  display: none;
}

.btns {
  margin: 15px 0;
  text-align: center;
}

button {
  padding: 10px 16px;
  margin: 0 6px;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 6px;
}

.photos {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.photos img {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 6px;
}
</style>