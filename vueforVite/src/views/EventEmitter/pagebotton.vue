<template>
  <div>
    <button @click="setCount">count++</button>
  </div>
</template>
<script>
export default {
  name: "EventEmitter"
};
</script>
<script setup>
import eventEmitter from "@/utils/EventEmitter";
let count = 0;
function setCount() {
  count++;
  eventEmitter.emit("sysLanguageChange", count);
}
</script>
