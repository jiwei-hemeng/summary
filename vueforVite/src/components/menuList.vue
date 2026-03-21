<script setup lang="ts">
const props = defineProps({
  list: {
    type: Array,
    required: true
  }
})
const emit = defineEmits(["changePage"])
interface MenuItem {
  name: string
  path: string
}

function changePage(item: MenuItem) {
  emit("changePage", item.path)
}
</script>
<template>
  <div>
    <div
      v-for="(item, index) in props.list as MenuItem[]" :key="index"
      @click="changePage(item)">
      {{ item.name }}
    </div>
  </div>
</template>
