<template>
  <div>
    <input v-model="text" type="text" />
    <p>{{ text }}</p>
  </div>
</template>
<script setup lang="ts">
import { useDebouncedRef } from '@/hook/useDebouncedRef.ts'
const text = useDebouncedRef<string>('', 500)
</script>