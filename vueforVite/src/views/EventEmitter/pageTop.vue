<template>
  <div>count: {{ count }}</div>
</template>
<script>
export default {
  name: "EventEmitter"
};
</script>
<script setup>
import { ref, onUnmounted } from "vue";
import eventEmitter from "@/utils/EventEmitter";
const count = ref(0);
function sysLanguageChange (e){
  count.value = e
}
onUnmounted(() => {
  eventEmitter.off("sysLanguageChange", sysLanguageChange);
})
eventEmitter.on("sysLanguageChange", sysLanguageChange)
</script>
