import { customRef } from 'vue'

function useDebouncedRef(value, delay = 300) {
  let timeout
  return customRef((track, trigger) => ({
    get() {
      track()
      return value
    },
    set(newVal) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        value = newVal
        trigger()
      }, delay)
    }
  }))
}

const searchText = useDebouncedRef('', 500)
