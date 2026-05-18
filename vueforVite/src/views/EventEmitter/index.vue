<template>
  <div>
    <PageTop ref="page-top" />
    <PageBotton @sys-language-change="sysLanguageChange" />
  </div>
</template>
<script lang="ts">
export default {
  name: "EventEmitter"
};
</script>
<script setup lang="ts">
import { useTemplateRef } from "vue";
import PageTop from "./pageTop.vue";
import PageBotton from "./pagebotton.vue";
import IndexDB from "@/utils/indexDB";
const pageTop = useTemplateRef<InstanceType<typeof PageTop>>("page-top");
const allData = await IndexDB.readAll();
const timeList = await IndexDB.getDataByIndex("moduleType", "timeStarp");
const cursorList = await IndexDB.cursorGetDataByIndexAndPage("moduleType", "routers", 3, 2);

function sysLanguageChange(count: number) {
  pageTop.value?.setCount(count);
}
</script>
