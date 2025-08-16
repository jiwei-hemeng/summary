import { isReactive, isRef, ref, watch, onUnmounted } from "vue";

/**
 * 自定义 Hook，用于监听 `state` 中指定字段的变化。
 *
 * @params state - 一个 `Ref` 或 `reactive` 类型的响应式对象，它的字段值会被监听。
 * @params fields - 一个字符串数组，指定要监听的字段名。
 * @params options.debounceDelay - 防抖延迟时间，单位毫秒。默认为 300ms，传递 `undefined` 或 `0` 时关闭防抖
 * @params options.immediate - 是否在初始化时立即执行一次回调函数，默认为 `false`。
 *
 * @returns onChange - 一个触发事件的函数，可以用于获取字段变化的详细信息。
 */
export function useWatchFields(state, fields, options) {
  const listeners = ref([]); // 存储监听回调函数
  let debounceTimeout = null; // 防抖定时器

  // 手动触发事件的函数
  const trigger = (data) => {
    listeners.value.forEach((listener) => listener(data));
  };

  // 防抖函数：延迟触发
  const debouncedTrigger = (data) => {
    if (debounceTimeout) {
      // 清除上一个定时器
      clearTimeout(debounceTimeout);
    }
    // 设置新的定时器
    debounceTimeout = setTimeout(() => trigger(data), options.debounceDelay);
  };

  // 使用 Vue 的 watch API 监听多个字段的变化
  watch(
    () =>
      fields.map((field) => {
        if (isRef(state)) {
          // 如果是 Ref 类型，返回对应字段的值
          return state.value[field];
        } else if (isReactive(state)) {
          // 如果是 reactive 类型，返回对应字段的值
          return state[field];
        }
        return undefined;
      }),
    (newValues, oldValues) => {
      // 用于存储发生变化的字段
      const changedFields = [];
      // 用于存储每个字段的变化前后值
      const fieldChangeMap = {};

      newValues.forEach((newValue, index) => {
        // 获取当前字段
        const field = fields[index];
        // 获取字段的旧值
        const oldValue = oldValues[index];

        // 如果新值与旧值不同，表示字段发生了变化
        if (newValue !== oldValue) {
          changedFields.push(field);
          fieldChangeMap[field] = { newValue, oldValue };
        }
      });

      const data = {
        changedFields,
        fields,
        fieldChangeMap
      };

      // 根据 debounceDelay 的值判断是否启用防抖
      if (options?.debounceDelay && options?.debounceDelay > 0) {
        debouncedTrigger(data); // 启用防抖
      } else {
        trigger(data); // 直接触发，不启用防抖
      }
    },
    { deep: true, immediate: options?.immediate }
  );

  // 清理防抖定时器
  onUnmounted(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout); // 组件销毁时清除定时器
    }
  });

  // 返回一个注册回调的函数
  return {
    onChange: (listener) => {
      listeners.value.push(listener);
    }
  };
}
