// @ts-nocheck
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import gitHash from "./plugins/git-hash";
// 插件
import { visualizer } from "rollup-plugin-visualizer";
import importToCDN from "vite-plugin-cdn-import";
import VueDevTools from "vite-plugin-vue-devtools";
export default ({ mode }) => {
  return {
    base: mode === "production" ? "./" : "./",
    plugins: [
      VueDevTools(),
      vue({
        vapor: true // 启用 Vapor 模式
      }),
      visualizer({ open: false, gzipSize: true, brotliSize: true }),
      gitHash()
    ],
    optimizeDeps: {
      include: ["vue", "vue-router", "dayjs"],
      force: false
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 可选的 SCSS 配置
          additionalData: `@import "@/styles/variables.scss";`
        }
      }
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        cropperjs: fileURLToPath(new URL("./node_modules/cropperjs", import.meta.url))
      },
      // 确保解析 CSS 扩展名
      extensions: [".ts", ".js", ".vue", ".json", ".css"]
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
          manualChunks(id) {
            const groupHome = [
              "/views/index.vue",
              "/views/HomeView.vue",
              "/views/AuthRouter.vue",
              "/views/NotFound404.vue",
              "/views/cropperjs/index.vue"
            ];
            const groupDemo = [
              "/views/Key-frames.vue",
              "/views/AboutView.vue",
              "/views/EventEmitter/index.vue",
              "/views/Map/index.vue",
              "/views/chinaMap/index.vue",
              "/views/camera/index.vue"
            ];
            function isGroup(arr, idStr) {
              let flag = false;
              for (let item of arr) {
                if (idStr.indexOf(item) > -1) {
                  flag = true;
                }
              }
              return flag;
            }
            if (id.includes("node_modules")) {
              // 可以进一步细分 vendor chunk
              if (id.includes("echarts")) return "vendor-echarts";
              if (id.includes("lodash")) return "vendor-lodash";
              if (id.includes("vue")) return "vendor-vue";
              if (id.includes("pinia")) return "vendor-pinia";
              return "vendor";
            } else if (isGroup(groupHome, id)) {
              return "group-home";
            } else if (isGroup(groupDemo, id)) {
              return "group-demo";
            }
            return null;
          }
        }
      }
    }
  };
};
