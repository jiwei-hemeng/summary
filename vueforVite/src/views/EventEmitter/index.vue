<template>
  <div>
    <PageTop ref="page-top" />
    <PageBotton @sysLanguageChange="sysLanguageChange" />
  </div>
</template>
<script lang="ts">
export default {
  name: "EventEmitter"
}
</script>
<script setup lang="ts">
import PageTop from "./pageTop.vue"
import PageBotton from "./pagebotton.vue"
import IndexDB from "@/utils/indexDB"
import useCompRef from "@/hook/useCompRef"
const allData = await IndexDB.readAll()
const timeList = await IndexDB.getDataByIndex("moduleType", "timeStarp")
const cursorList = await IndexDB.cursorGetDataByIndexAndPage("moduleType", "routers", 3, 2)
console.log("all-data", allData)
console.log("timeList", timeList)
console.log("cursorList", cursorList)
function sysLanguageChange(count: number) {
  useCompRef(PageTop).value?.setCount(count)
  console.log("sysLanguageChange", count)
}
</script>
