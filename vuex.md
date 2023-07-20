# 关于Vuex

> 官方文档：[Vuex](https://vuex.vuejs.org/zh/) 是一个专为 Vue.js 应用程序开发的**状态管理模式**。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。Vuex 也集成到 Vue 的官方调试工具 [devtools extension](https://github.com/vuejs/vue-devtools)，提供了诸如零配置的 time-travel 调试、状态快照导入导出等高级调试功能。

## Vuex 的介绍

+ Vuex 是专门为 Vue.js 设计的状态管理库
+ 它采用集中式的方式存储需要共享的数据
+ 从使用角度，它就是一个 JavaScript 库
+ 它的作用是进行状态管理，解决复杂组件通信，数据共享

## 安装 *Vuex*

```bash
# 或者 yarn add vuex
npm install vuex
```

## 配置*Vuex*

+ 在项目中新建 *src/store/index.js*

  ```js
  import Vue from "vue";
  import Vuex from "vuex";
  Vue.use(Vuex);
  //创建一个 Vuex 容器实例，用来在组件的外部管理共享的数据状态
  const store = new Vuex.Store({
    state: {
      count: 0
    },
    mutations: {
      increment (state) {
        state.count++
      }
    },
    actions: {
      increment (context) {
        // 执行异步操作
        setTimeout(() => {
          // 提交 mutation 修改 state
            context.commit('increment')
        }, 1000)
      }
    }
  })
  export default store;
  ```

+ 在 `main.js` 将 store 注册到 Vue 根实例

  ```js
  import Vue from "vue";
  import App from "./App.vue";
  import store from "./store/";
  Vue.config.productionTip = false;
  new Vue({
    render: h => h(App),
    store
  }).$mount("#app");
  ```

## 获取 State 数据的方式

+ **store.state（了解即可，不推荐使用）**

  + 在组件的 JavaScript 中：

    ```js
    this.$store.state.count
    ```

  + 在组件的模板中不用加 this：

    ```html
    <p>{{ $store.state.count }}</p>
    ```

+ **使用 mapState 函数（推荐）**

  ```js
  import { mapState } from 'vuex'
  export default {
    computed: {
      // 将容器中的数据映射到本地计算属性中
      ...mapState(['count', 'msg']),
      // 自己写的本地计算属性
      hello () {
        return 'world'
      }
    }
  }
  ```

  如果容器数据名称和本地数据名称有冲突，或者想要使用容器数据和本地数据混合处理使用，则必须使用下面这种方式：

  ```js
  computed: {
    ...mapState({
      count: state => state.count,
      abc: state => state.count, // 改名
      haha: 'count', // 或者直接写个字符串，等价于 state => state.count
      total (state) { // 或者需要将容器数据和本地数据混合处理使用
        return state.count + this.num
      }
    }),
    // 自己写的本地计算属性
    hello () {
      return 'world'
    }
  }
  ```

## mutation 的调用方式

+ **使用 store.commit('mutation')**

  在组件javascript中：

  ```js
  this.$store.commit('xxx')
  ```

  在组件html中,不需要 *this*

  ```html
  <button @click="$store.commit('xxx')">测试</button>
  ```

+ **使用 *mapMutations* 辅助函数**

  ```js
  import { mapMutations } from 'vuex'
  
  export default {
    // ...
    methods: {
      ...mapMutations([
        'increment', // 将this.increment()映射为this.$store.commit('increment')
        'incrementBy'
      ]),
      ...mapMutations({
        add: 'increment' // 将this.add()映射为this.$store.commit('increment')
      })
    }
  }
  ```

## action 的调用方式

+ **使用 *store.dispatch()* 方法**

  在组件的 JavaScript 中：

  ```js
  this.$store.dispatch('xxx')
  ```

  在组件的模板中不用加 this：

  ```html
  <button @click="$store.dispatch(xxx)">测试</button>
  ```

+ **使用 *mapActions* 辅助函数将组件的 methods 映射为 *store.dispatch* 调用**

  ```js
  import { mapActions } from 'vuex'
  export default {
    methods: {
      ...mapActions([
        'increment', 
        'incrementBy' 
      ]),
      // 将this.add()映射为this.$store.dispatch('increment')
      ...mapActions({
        add: 'increment' 
      })
    }
  }
  ```

# pinia

> [中文文档](https://pinia.vuejs.org/zh/core-concepts/)

定义

> Store 是用 `defineStore()` 定义的，它的第一个参数要求是一个**独一无二的**名字：这个**名字** ，也被用作 *id* ，是必须传入的， Pinia 将用它来连接 store 和 devtools。为了养成习惯性的用法，将返回的函数命名为 *use...* 是一个符合组合式函数风格的约定。

## 基本使用

```js
import { ref } from "vue";
import { defineStore } from "pinia";
export const useToken = defineStore("token", () => {
  let token = ref(sessionStorage.getItem("token"));
  function setToken(value) {
    token.value = value;
    sessionStorage.setItem("token", value)
  }
  return { token, setToken };
});
```

使用

```js
import { createApp } from "vue";
import { createPinia } from "pinia";
const app = createApp(App);
app.use(createPinia());
app.mount("#app");
```

组件中使用

```html
<script setup>
import { useToken } from "@/stores/counter";
const store = useToken();
function setToken() {
  store.setToken(Date.now());
}
</script>
<template>
  <div class="about">
    <h1>AboutView 页</h1>
    <div>token:{{ store.token }}</div>
    <button @click="setToken">设置token</button>
  </div>
</template>
```

## 在普通js 中使用pinia

在`@/stores/index` 文件中

```js
import { createPinia } from "pinia";
const pinia = createPinia();
export default pinia;
```

在`main.js` 中

```js
import { createApp } from "vue";
import pinia from "@/stores"
const app = createApp(App);
app.use(pinia)
```

普通js 中

```js
import { useToken } from "@/stores/useInfo";
import pinia from "@/stores";
const store = useToken(pinia);
```

## Pinia 函数式的计算属性

```js
import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useToken = defineStore("token", () => {
  let token = ref(sessionStorage.getItem("token"));
  // 计算属性
  const isLogin = computed(() => !!token.value);
  function setToken(value) {
    token.value = value;
    sessionStorage.setItem("token", value);
  }
  return { token, isLogin, setToken };
});
```

