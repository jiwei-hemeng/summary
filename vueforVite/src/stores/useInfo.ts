import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useToken = defineStore("token", () => {
  const token = ref<string>("");
  const isLogin = computed(() => !!token.value);
  function setToken(value: string) {
    token.value = value;
  }
  return { token, isLogin, setToken };
});
