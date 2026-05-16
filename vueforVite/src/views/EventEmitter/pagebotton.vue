<template>
  <div>
    <button @click="setCount">count++</button>
  </div>
</template>
<script>
export default {
  name: "EventEmitter"
}
</script>
<script setup>
import eventEmitter from "@/utils/EventEmitter"
const emit = defineEmits(["sysLanguageChange"])
let count = 0
function setCount() {
  count++
  eventEmitter.emit("sysLanguageChange", count)
  emit("sysLanguageChange", count)
}
</script>
