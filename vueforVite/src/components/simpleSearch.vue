<template>
  <div :style="{ display: 'flex', flexWrap: 'wrap', gap: `${gap}px` }">
    <!-- 默认表单项 -->
    <div v-for="item in items" :key="item.key" :style="{ width: `${width}px` }">
      <a-form-item>
        <!-- 自定义 label 插槽 -->
        <template #label>
          <a-tooltip :title="item.label" placement="top" :open="isLabelOverflow[item.key] ? undefined : false">
            <span :ref="(el) => setLabelRef(el, item.key)" class="form-label">
              {{ item.label }}
            </span>
          </a-tooltip>
        </template>

        <!-- 支持自定义表单项内容的 slot -->
        <slot :name="`item-${item.key}`" :item="item" :form-data="formData">
          <component
            :is="item.component || 'a-input'"
            v-model:value="formData[item.key]"
            v-bind="item.props"
          />
        </slot>
      </a-form-item>
    </div>

    <!-- 额外表单项 slot（在 items 之后） -->
    <slot name="extra-items" />

    <!-- 按钮区域 -->
    <div :style="{ width: buttonWidth ? `${buttonWidth}px` : 'auto' }">
      <slot name="action">
        <!-- 默认按钮 -->
        <a-button type="primary" @click="emit('search')">
          <template #icon><SearchOutlined /></template>
          查询
        </a-button>
        <a-button @click="emit('reset')">
          <template #icon><ReloadOutlined /></template>
          重置
        </a-button>
        <slot name="extra-buttons" />
      </slot>
    </div>

    <!-- 其他自定义内容 -->
    <slot name="other" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, onMounted, watch, onBeforeUnmount } from "vue";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons-vue";

// 定义 Props 类型
interface FormItem {
  key: string;
  label: string;
  component?: string;
  props?: Record<string, any>;
}

interface Props {
  items: FormItem[];
  width?: number;
  gap?: number;
  modelValue: Record<string, any>;
  labelWidth?: number;
  buttonWidth?: number; // 按钮区域固定宽度
}

// 定义 Emits 类型
interface Emits {
  (e: "update:modelValue", value: Record<string, any>): void;
  (e: "search"): void;
  (e: "reset"): void;
}

// 声明 props 和 emits
const props = withDefaults(defineProps<Props>(), {
  width: 320,
  gap: 20,
  labelWidth: 98,
  buttonWidth: undefined
});

const emit = defineEmits<Emits>();

// 存储每个 label 的溢出状态
const isLabelOverflow = ref<Record<string, boolean>>({});
// 存储 label 元素的 ref
const labelRefs = ref<Record<string, HTMLElement>>({});

// 设置 label 元素的 ref
const setLabelRef = (el: any, key: string) => {
  if (el) {
    labelRefs.value[key] = el;
  }
};

// 检查单个 label 是否溢出
const checkOverflow = (key: string) => {
  const el = labelRefs.value[key];
  if (el) {
    isLabelOverflow.value[key] = el.scrollWidth > el.clientWidth;
  }
};

// 检查所有 label 是否溢出
const checkAllOverflow = () => {
  nextTick(() => {
    props.items.forEach((item) => {
      checkOverflow(item.key);
    });
  });
};

// 监听 items 变化，重新检查溢出
watch(
  () => props.items,
  () => {
    checkAllOverflow();
  },
  { deep: true }
);

// 组件挂载后检查
onMounted(() => {
  checkAllOverflow();
  window.addEventListener("resize", checkAllOverflow);
});

// 组件卸载时移除监听
onBeforeUnmount(() => {
  window.removeEventListener("resize", checkAllOverflow);
});

// 计算属性实现 v-model 双向绑定
const formData = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val)
});

// 暴露方法给父组件
defineExpose({
  checkAllOverflow,
  formData
});
</script>

<style scoped>
.form-label {
  display: inline-block;
  max-width: v-bind('props.labelWidth + "px"');
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: help;
  vertical-align: middle;
}

:deep(.ant-form-item-label) {
  width: v-bind('props.labelWidth + "px"') !important;
  flex-basis: v-bind('props.labelWidth + "px"') !important;
  flex-shrink: 0 !important;
  text-align: right !important;
  padding-right: 8px;
}

:deep(.ant-form-item-control-input) {
  flex: 1;
  min-width: 0;
}

:deep(.ant-form-item) {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-bottom: 18px;
}

:deep(.ant-input),
:deep(.ant-select),
:deep(.ant-picker) {
  width: 100%;
}

:deep(.ant-btn + .ant-btn) {
  margin-left: 12px;
}
</style>
