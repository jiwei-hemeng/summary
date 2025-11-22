// @ts-nocheck
import { createApp } from "vue";
import pinia from "@/stores";
import App from "@/App.vue";
import router from "@/router";
import IndexDB from "@/utils/indexDB";
import slideIn from "@/directives/v-slide-in";
import lazyLoad from "@/directives/v-lazy-load";
import "@/assets/main.css";
IndexDB.getIndexDB().then(() => {
  const app = createApp(App);
  app.directive("slide-in", slideIn);
  app.directive("lazy-load", lazyLoad);
  app.config.performance = true; // 开启性能模式
  app.use(pinia);
  app.use(router);
  app.mount("#app", true);
});
