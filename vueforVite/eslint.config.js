import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import ts from "@typescript-eslint/eslint-plugin";
import vueParser from "vue-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import globals from "globals";
export default [
  // 忽略配置...
  js.configs.recommended,
  ...vue.configs["flat/recommended"],
  {
    files: ["**/*.ts", "**/*.vue"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
      // 这里保留 globals，但最终可能被后面的覆盖，但没关系
      globals: { ...globals.browser }
    },
    plugins: { "@typescript-eslint": ts },
    rules: { ...ts.configs.recommended.rules }
  },
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: tsParser, ecmaVersion: "latest", sourceType: "module" }
    }
  },
  prettier,
  // 在最后添加一个配置对象，为所有文件提供全局变量
  {
    languageOptions: {
      globals: {
        ...globals.browser // 确保所有文件都能识别浏览器全局变量
        // 或者单独添加 console: 'readonly',
      }
    },
    rules: {
      "no-console": process.env.NODE_ENV === "production" ? "off" : "off",
      "vue/multi-word-component-names": "off",
      "vue/order-in-components": [
        "error",
        {
          order: ["alphabetical"] // 按字母顺序
        }
      ]
    }
  }
];
