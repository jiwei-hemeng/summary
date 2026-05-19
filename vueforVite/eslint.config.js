import js from "@eslint/js";
import vue from "eslint-plugin-vue";
import ts from "@typescript-eslint/eslint-plugin";
import vueParser from "vue-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
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

  js.configs.recommended,
  ...vue.configs["flat/recommended"],

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
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".vue"]
      }
    },
    plugins: {
      "@typescript-eslint": ts
    }
  },

  prettier,

  {
    files: ["eslint.config.js"],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  {
    rules: {
      "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
      "no-unused-vars": "off",
      semi: ["error", "always"],
      quotes: ["error", "double"],

      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/semi": "off",
      "@typescript-eslint/quotes": "off",
      "@typescript-eslint/no-empty-object-type": "off",

      "vue/multi-word-component-names": "off",
      "vue/order-in-components": ["error", { order: ["alphabetical"] }]
    }
  }
];
