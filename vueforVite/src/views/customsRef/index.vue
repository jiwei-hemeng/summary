<template>
  <div>
    <input type="text" v-model="text" />
    <p>{{ text }}</p>
  </div>
</template>
<script setup lang="ts">
import { useDebouncedRef } from '@/hook/useDebouncedRef.ts'
const text = useDebouncedRef('', 500)
</script>