import { customRef } from "vue";

export function useDebouncedRef(value, delay = 300) {
  let timeout;
  return customRef((track, trigger) => ({
    get() {
      track();
      return value;
    },
    set(newVal) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        value = newVal;
        trigger();
      }, delay);
    }
  }));
}
