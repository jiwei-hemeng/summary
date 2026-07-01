import { createApp } from "vue";
import AntDesignVue from "ant-design-vue";
import App from "@/App.vue";
import router from "@/router/index";
import IndexDB from "@/utils/indexDB";
import slideIn from "@/directives/v-slide-in";
import lazyLoad from "@/directives/v-lazy-load";
import "ant-design-vue/dist/reset.css";
import "@/assets/main.css";
import pinia from "./stores";
import "@/common/index.js";
import i18n from "@/lang/index";
IndexDB.getIndexDB().then(() => {
  const app = createApp(App);
  app.directive("slide-in", slideIn);
  app.directive("lazy-load", lazyLoad);
  app.config.performance = true; // 开启性能模式
  app.use(AntDesignVue);
  app.use(pinia);
  app.use(i18n);
  app.use(router);
  app.mount("#app", true);
});
console.log("性能模式已开启");
