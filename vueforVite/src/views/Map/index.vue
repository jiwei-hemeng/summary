<template>
  <div id="container"></div>
</template>
<script>
export default {
  name: "BMapTest"
};
</script>
<script setup>
import { onMounted } from "vue";
const BMAP_ANCHOR_TOP_RIGHT = window.BMAP_ANCHOR_TOP_RIGHT;
const BMapGL = window.BMapGL;
onMounted(() => {
  const myCity = new BMapGL.LocalCity();
  myCity.get(myFun);
  function myFun(result) {
    const cityName = result.name;
    const map = new BMapGL.Map("container");
    const point = new BMapGL.Point(result.center.lng, result.center.lat);
    map.centerAndZoom(point, 11);
    const zoomCtrl = new BMapGL.ZoomControl({
      anchor: BMAP_ANCHOR_TOP_RIGHT
    }); // 添加缩放控件
    map.addControl(zoomCtrl);

    const opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMapGL.Size(-30, -15) // 设置文本偏移量
    };
    const label = new BMapGL.Label("", opts);
    label.setContent(`
        <div class="overlay">${cityName}</div>
        `);
    label.setStyle({
      border: "0 none",
      padding: 0
    });
    map.addOverlay(label);
    map.enableScrollWheelZoom();
  }
});
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
