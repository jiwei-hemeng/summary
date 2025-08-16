<template>
  <svg aria-hidden="true" :fill="color"
    :style="'width:' + size + ';height:' + size">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script setup>
import { computed } from "vue"
const props = defineProps({
  // icon 名字
  name: {
    type: String,
    default: "",
  },
  // 填充颜色
  color: {
    type: String,
    default: "black",
  },
  // 大小
  size: {
    type: String,
    default: "1em",
  },
})
const symbolId = computed(() => `#icon-${props.name}`)
</script>