import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useToken = defineStore("token", () => {
  const token = ref(sessionStorage.getItem("token"));
  const isLogin = computed(() => !!token.value);
  function setToken(value) {
    token.value = value;
    sessionStorage.setItem("token", value);
  }
  return { token, isLogin, setToken };
});
