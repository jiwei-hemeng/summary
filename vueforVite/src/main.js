// @ts-nocheck
import { createApp } from "vue";
// import { createPinia } from "pinia";
import pinia from "@/stores";
import App from "@/App.vue";
import router from "@/router";
import IndexDB from "@/utils/indexDB.js";
import "@/assets/main.css";
IndexDB.getIndexDB().then(() => {
  const app = createApp(App);
  app.config.performance = true; // 开启性能模式
  app.use(pinia);
  app.use(router);
  app.mount("#app", true);
});
