<template>
  <div>
    <Abutton type="primary" @click="selectFileBtn">选择图片</Abutton>
    <input accept="image/*" ref="selectFile" v-show="false" type="file" @change="fileChange" />
    <Modal
      v-model:open="open"
      title="编辑图片"
      @ok="handleOk"
      :afterClose="afterClose"
      :maskClosable="false"
    >
      <div class="preview-image-warp">
        <img class="preview-image" :src="blobUrl" alt="" ref="preview" />
      </div>
    </Modal>
  </div>
</template>
<script>
export default {
  name: "cropper-js"
};
</script>
<script setup>
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";
import { ref, nextTick } from "vue";
import { Button as Abutton, Modal } from "ant-design-vue";
const selectFile = ref();
const preview = ref();
const open = ref(false);
const blobUrl = ref("");
const cropper = ref(null);
function selectFileBtn() {
  selectFile.value.click();
}
async function fileChange(e) {
  const file = e.target.files[0];
  blobUrl.value = URL.createObjectURL(file);
  open.value = true;
  await nextTick();
  cropper.value = new Cropper(preview.value, {
    viewMode: 1, // 查看模式
    dragMode: "move", // 拖动模式
    aspectRatio: 1, // 截图比例
    autoCropArea: 0.8, // 自动区域
    cropBoxMovable: false, // 不允许截图区域移动
    cropBoxResizable: false, // 不允许截图区域缩放
    modal: true, // 显示阴影区域
    // movable: false
    background: false, // 关闭背景
    movable: true // 允许移动
  });
}
function getCroppedBlob() {
  return new Promise((resolve) => {
    resolve(cropper.value.getCroppedCanvas().toDataURL())
  });
}
function afterClose() {
  cropper.value.destroy();
  cropper.value = null;
  URL.revokeObjectURL(blobUrl.value);
  selectFile.value.value = ""
}
async function handleOk() {
  open.value = false;
  const blobUrl = await getCroppedBlob();
  console.log(blobUrl);
  // window.open(blobUrl)
}
</script>
<style scoped>
.preview-image-warp {
  width: 100%;
  height: 450px;
}
.preview-image {
  max-width: 100%;
  height: 450px;
  display: block;
}
</style>
