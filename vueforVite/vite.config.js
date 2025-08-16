// @ts-nocheck
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
// 插件
import { visualizer } from "rollup-plugin-visualizer";
import importToCDN from "vite-plugin-cdn-import";
import VueDevTools from "vite-plugin-vue-devtools";
export default ({ mode }) => {
  const plugins = [
    VueDevTools(),
    vue({
      vapor: true // 启用 Vapor 模式
    }),
    visualizer({ open: true })
  ];
  if (mode === "production") {
    plugins.push(
      importToCDN({
        modules: [
          {
            name: "vue",
            var: "Vue",
            path: "https://cdn.bootcdn.net/ajax/libs/vue/3.4.12/vue.global.min.js"
          },
          {
            name: "vue-demi",
            var: "VueDemi",
            path: "https://cdn.bootcdn.net/ajax/libs/vue-demi/0.14.6/index.iife.min.js"
          },
          {
            name: "vue-router",
            var: "VueRouter",
            path: "https://cdn.bootcdn.net/ajax/libs/vue-router/4.2.5/vue-router.global.min.js"
          },
          {
            name: "pinia",
            var: "Pinia",
            path: "https://cdn.bootcdn.net/ajax/libs/pinia/2.1.6/pinia.iife.min.js"
          },
          {
            name: "echarts",
            var: "echarts",
            path: "https://cdn.bootcdn.net/ajax/libs/echarts/5.4.3/echarts.min.js"
          }
        ]
      })
    );
  }
  return {
    base: mode === "production" ? "./" : "./",
    plugins,

    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    },
    server: {
      proxy: {
        "/api": {
          // target: "https://www.bilibili.com",
          target: "http://10.10.10.252:8002",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "")
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "group-home": [
              "./src/views/index.vue",
              "./src/views/HomeView.vue",
              "./src/views/AuthRouter.vue",
              "./src/views/NotFound404.vue",
              "./src/views/cropperjs/index.vue"
            ],
            "group-demo": [
              "./src/views/Key-frames.vue",
              "./src/views/AboutView.vue",
              "./src/views/EventEmitter/index.vue",
              "./src/views/Map/index.vue",
              "./src/views/chinaMap/index.vue",
              "./src/views/camera/index.vue"
            ]
          }
        }
      }
    }
  };
};
