import { customRef, onUnmounted } from "vue";
export function useDebouncedRef<T>(value: T, delay = 300) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  onUnmounted(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
  });
  return customRef<T>((track, trigger) => ({
    get() {
      track();
      return value;
    },
    set(newVal: T) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        value = newVal;
        trigger();
      }, delay);
    }
  }));
}
