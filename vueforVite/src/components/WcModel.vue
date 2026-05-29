<template>
  <component :is="tagName" ref="wcDom" v-bind="attrs" :model-value="modelValue">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </component>
</template>

<script setup>
import { useTemplateRef, computed, onMounted, onBeforeUnmount, useAttrs, watch } from "vue";
// eslint-disable-next-line vue/require-prop-types
const props = defineProps(["modelValue", "tagName"]);
const emit = defineEmits(["update:modelValue", "native-change"]);
const wcDomRef = useTemplateRef("wcDom");
let handler = null;
const $attrs = useAttrs();
const attrs = computed(() => {
  const raw = { ...$attrs };
  Object.keys(raw).forEach((key) => {
    if (key.startsWith("on")) delete raw[key];
  });
  return raw;
});

watch(
  () => props.modelValue,
  (val) => {
    if (wcDomRef.value) {
      wcDomRef.value.modelValue = val;
    }
  },
  { flush: "post" }
);

onMounted(() => {
  if (!wcDomRef.value) return;
  handler = (e) => {
    emit("update:modelValue", e.detail);
    emit("native-change", e);
  };
  wcDomRef.value.addEventListener("update:model-value", handler);
});

onBeforeUnmount(() => {
  if (wcDomRef.value && handler) {
    wcDomRef.value.removeEventListener("update:model-value", handler);
  }
});
</script>
