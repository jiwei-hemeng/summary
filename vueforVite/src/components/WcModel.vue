<template>
  <component :is="tagName" ref="wcDom" v-bind="attrs" :model-value="modelValue">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </component>
</template>

<script setup lang="ts">
import { useTemplateRef, computed, onMounted, onBeforeUnmount, useAttrs, watch } from "vue";

// 定义 Props 类型
interface Props {
  modelValue?: any;
  tagName?: string;
}

// 定义 Emits 类型
interface Emits {
  (e: "update:modelValue", value: any): void;
  (e: "native-change", event: Event): void;
}

// 扩展 HTMLElement 类型以包含 modelValue 属性
interface WebComponentElement extends HTMLElement {
  modelValue?: any;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const wcDomRef = useTemplateRef<WebComponentElement>("wcDom");
let handler: ((e: CustomEvent) => void) | null = null;

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

  handler = (e: CustomEvent) => {
    emit("update:modelValue", e.detail);
    emit("native-change", e);
  };

  wcDomRef.value.addEventListener("update:model-value", handler as (e: Event) => void);
});

onBeforeUnmount(() => {
  if (wcDomRef.value && handler) {
    wcDomRef.value.removeEventListener("update:model-value", handler as (e: Event) => void);
  }
});
</script>
