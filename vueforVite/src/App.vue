<script setup lang="ts">
import Loadding from "@/components/Loadding.vue"
import { ConfigProvider } from "ant-design-vue"
import zhCN from "ant-design-vue/es/locale/zh_CN"
import dayjs from "dayjs"
import "dayjs/locale/zh-cn"
dayjs.locale("zh-cn")
</script>
<template>
  <ConfigProvider :locale="zhCN">
    <router-view v-slot="{ Component, route }">
      <template v-if="Component">
        <transition mode="out-in" name="nested">
          <suspense>
            <template #default>
              <component :is="Component" :key="route.fullPath"></component>
            </template>
            <template #fallback>
              <Loadding />
            </template>
          </suspense>
        </transition>
      </template>
    </router-view>
  </ConfigProvider>
</template>

<style scoped>
.nested-enter-active,
.nested-leave-active {
  transition: all 0.3s ease-in-out;
}

.nested-enter-from,
.nested-leave-to {
  transform: translateX(30px);
  opacity: 0;
}
</style>
