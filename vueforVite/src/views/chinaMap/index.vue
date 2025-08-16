<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="chinaMap"></div>
</template>
<script setup>
import { onMounted } from "vue";
import * as echarts from "echarts";
onMounted(async () => {
  const res = await fetch("/assets/map/china.json");
  const chinaJson = await res.text();
  const myChart = echarts.init(document.getElementById("chinaMap"));
  echarts.registerMap("china", chinaJson); //注册可用的地图
  var option = {
    // 存放需要绘制图片类型，以及样式设置
    geo: {
      show: true,
      //设置中心点
      center: [105.194115019541, 35.582111640625],
      map: "china",
      roam: true, //是否允许缩放，拖拽
      zoom: 1.5, //初始化大小
      //缩放大小限制
      scaleLimit: {
        min: 0.9, //最小
        max: 22 //最大
      },
      //各个省份模块样式设置
      itemStyle: {
        normal: {
          areaColor: "#f00",
          borderColor: "#090438",
          borderWidth: "1",
          shadowColor: "#090438",
          shadowOffsetX: 0,
          shadowOffsetY: 0
        }
      },
      //高亮状态
      emphasis: {
        itemStyle: {
          areaColor: "#22c601"
        },
        label: {
          show: true,
          color: "#fff"
        }
      },
      // 显示层级
      z: 10,
      tooltip: {
        trigger: "item",
        formatter: "{b}<br/>{c} (p / km2)"
      }
    }
  };

  myChart.setOption(option);
});
</script>
<style scoped>
#chinaMap {
  height: calc(100vh - 150px);
}
</style>
