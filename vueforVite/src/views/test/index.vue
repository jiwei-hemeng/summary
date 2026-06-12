<template>
  <div>
    <CustomSelect :options="options" multiple />
  </div>
</template>
<script setup>
import { ref } from "vue";
import CustomSelect from "./CustomSelect.vue";
const options = ref([
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" }
]);
</script>
