import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import ts from "@typescript-eslint/eslint-plugin";
import vueParser from "vue-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  // 全局忽略文件（你原来注释的位置，建议补上）
  {
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      "*.log",
      "*.local",
      ".vscode/",
      ".idea/",
      "public/"
    ]
  },

  // 基础共享配置（所有文件通用）
  js.configs.recommended,
  ...vue.configs["flat/recommended"],

  // TypeScript + Vue 通用配置
  {
    files: ["**/*.ts", "**/*.vue"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser
      }
    }
  },

  // TypeScript 独立配置
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser
    },
    plugins: {
      "@typescript-eslint": ts
    },
    rules: {
      ...ts.configs.recommended.rules
    }
  },

  // Vue 专用配置（关键：必须正确配置嵌套解析器）
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser, // 让 Vue 文件内部使用 TS 解析
        extraFileExtensions: [".vue"]
      }
    }
  },

  // Prettier 兼容配置
  prettier,
  {
    files: ["eslint.config.js"],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  // 最终自定义规则（统一在这里覆盖）
  {
    rules: {
      // 通用
      "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
      "no-unused-vars": "off",
      semi: ["error", "always"],
      quotes: ["error", "double"],

      // TypeScript
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/semi": "off",
      "@typescript-eslint/quotes": "off",

      // Vue
      "vue/multi-word-component-names": "off",
      "vue/order-in-components": ["error", { order: ["alphabetical"] }]
    }
  }
];
