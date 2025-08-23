<template>
  <svg aria-hidden="true" :fill="props.color"
    :style="{ width: props.size, height: props.size }">
    <use :href="symbolId" />
  </svg>
</template>
<script lang="ts">
export default {
  name: "JIcon"
}
</script>
<script setup lang="ts">
import { computed } from "vue"
import type { Ref } from 'vue'
interface Props {
  name: string
  color?: string
  size?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  color: '#000',
  size: '1em'
})
interface symbolId {
  name: string
  color?: string
  size?: string | number
}
const symbolId: Ref<string> = computed<string>(() => `#icon-${props.name}`)
</script>
