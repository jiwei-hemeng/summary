<template>
  <div>count: {{ count }}</div>
</template>
<script setup lang="ts">
import { ref, onUnmounted } from "vue";
import eventEmitter from "@/utils/EventEmitter.ts";
const count = ref(0);
function sysLanguageChange(e: number) {
  count.value = e;
}
onUnmounted(() => {
  eventEmitter.off("sysLanguageChange", sysLanguageChange);
});
eventEmitter.on("sysLanguageChange", sysLanguageChange);
function setCount(count: number) {}
defineExpose({
  setCount
});
</script>
