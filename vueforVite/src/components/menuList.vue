<script setup>
// @ts-nocheck
const props = defineProps({
  list: {
    type: Array,
    required: true
  }
});
const emit = defineEmits(["changePage"]);
function changePage(item) {
  emit("changePage", item.path);
}
</script>
<template>
  <div>
    <div v-for="(item, index) in props.list" :key="index" @click="changePage(item)">
      {{ item.name }}
    </div>
  </div>
</template>
