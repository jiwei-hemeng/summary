<script setup lang="ts">
import { computed } from "vue";
import { useToken } from "@/stores/useInfo";
import { Button as Abutton, Space as ASpace, QRCode as AQRCode } from "ant-design-vue";
import WcModel from "@/components/WcModel.vue";
import PoweroffOutlined from "@ant-design/icons-vue/PoweroffOutlined";
// 可以在组件中的任意位置访问 `store` 变量 ✨
const url = computed(() => {
  return location.href + "?id=" + store.token;
});
const store = useToken();
function setToken() {
  store.setToken(Date.now().toString());
}
function ttt(e: Event) {
  console.log("原生事件", (e as CustomEvent<any>).detail);
}
</script>
<template>
  <div class="about">
    <div>token:{{ store.token }}</div>
    <WcModel
      v-model="store.token"
      tag-name="lit-input"
      type="text"
      placeholder="请输入token"
      @native-change="ttt"
    />
    <Abutton type="primary" size="small" @click="setToken">
      <template #icon>
        <PoweroffOutlined />
      </template>
      设置token
    </Abutton>
    <a-space direction="vertical" align="center">
      <AQRCode :value="url" icon="https://www.antdv.com/assets/logo.1ef800a8.svg" />
    </a-space>
  </div>
</template>
