<template>
  <div id="container"></div>
</template>
<script>
export default {
  name: "BMapTest"
}
</script>
<script setup>
import { onMounted } from "vue"

// 假设 BMapGL 已通过类型声明扩展 Window
const BMapGL = window.BMapGL
const BMAP_ANCHOR_TOP_RIGHT = BMapGL?.BMAP_ANCHOR_TOP_RIGHT

onMounted(() => {
  if (!BMapGL) {
    console.error("BMapGL 未加载")
    return
  }

  const myCity = new BMapGL.LocalCity()
  myCity.get(myFun)

  function myFun(result) { // 添加类型注解以提高安全性
    const cityName = result.name
    const map = new BMapGL.Map("container")
    const point = new BMapGL.Point(result.center.lng, result.center.lat)
    map.centerAndZoom(point, 11)

    const zoomCtrl = new BMapGL.ZoomControl({
      anchor: BMAP_ANCHOR_TOP_RIGHT
    })
    map.addControl(zoomCtrl)

    const opts = {
      position: point,
      offset: new BMapGL.Size(-30, -15)
    }
    const label = new BMapGL.Label("", opts)
    label.setContent(`<div class="overlay">${cityName}</div>`)
    label.setStyle({
      border: "0 none",
      padding: 0
    })
    map.addOverlay(label)
    map.enableScrollWheelZoom()
  }
})
</script>
<style scoped>
#container {
  width: 600px;
  height: 400px;
  margin: 20px auto;
}

:deep(.overlay) {
  width: 60px;
  height: 30px;
  box-sizing: border-box;
  color: blue;
  border-radius: 5px;
  border-color: #ccc;
  font-size: 16px;
  text-align: center;
  line-height: 30px;
  font-family: "微软雅黑";
}

/* 去掉版权信息 */
:deep(.anchorBL) {
  display: none;
}
</style>
