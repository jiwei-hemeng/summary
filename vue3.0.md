## vue3.0 新特征

> 建议阅读迁移 https://v3.cn.vuejs.org/guide/migration/array-refs.html

**setup函数的特性**

+ setup函数是vue3.0新特性，与之对应的是vue2.0的BeforeCreate 和Created 两个生命周期。由于在setup函数中vue实例并没有创建出来，所以该函数没有this
+ setup 函数有props、ctx两个参数。其中props对应vue2.0的props(响应式的，不能解构)，ctx 对应this(非响应式的，可以解构)
+ 在setup中return回去的数据在视图中才能用到

**ref 和 reactive 的异同点**

+ 相同的
  + 都是为数据添加响应式状态
+ 不同点
  + ref 创建出来的是简单数据类型的相应数据
  + reactive 创建出来的是复杂数据类型
  + 从ref返回的引用将自动解包，因此模板中使用不需要.value。在setup中访问必须需要`.value`

**toRef 和 toRefs的区别**

+ toRef 用于为源响应式对象上的属性新建一个ref，从而保持对其源对象属性的响应式连接。接受两个参数：源相应对象和属性名，返回一个ref数据。获取数据值的时候需要加上.value;toRef后的ref数据不是原始数据的拷贝，而是引用，改变结果数据的值也会同时改变原始数据
+ toRefs 用于将响应式对象转化为结果对象，其中结果对象的每个属性都是指向原始对象相应属性的ref.toRef需要结合reactive 使用

**计算属性(案例)**

```js
import { computed } from "vue";
export default {
  setup() {
    const user = computed(() => {
      return {
        userName: state.user.userName,
        age: state.user.age,
      };
    });
    return {
      user,
    }
  }
}
```

**watch 和 watchEffect**

+ watch 是需要传入侦听的数据源，而 watchEffect 是自动收集数据源作为依赖。
+ watch 可以访问侦听状态变化前后的值，而 watchEffect 没有。
+ watch 是属性改变的时候执行，而 watchEffect 是默认会执行一次，然后属性改变也会执行

案例

```js
import { reactive, toRefs, watchEffect, watch } from "vue";
export default {
  setup() {
    const userInfo = reactive({
      name: "小娜",
      age: 10
    })
    watchEffect(() => {
      console.log("改变了", testmr.age);
    });
    watch(
      () => userInfo.age,
      (newVal, oldVal) => {
        console.log("watch监听数据的变化", newVal, oldVal);
      },
      {
        deep: true,
        immediate: true,
      }
    );
    return {
      ...toRefs(userInfo)
    }
  }
}
```

**通过ref获取和操作DOM**

单个DOM案例

```html
<template>
  <input type="number" name="userName" id="" ref="dom" />
</template>
<script>
import { ref, nextTick } from "vue";
export default {
  name: "refDom",
  setup() {
    // 单个dom获取
    const dom = ref(null);
    // 下次Dom树更新时
    nextTick(() => {
      console.log("单个dom", dom.value);
    });
    return {
      dom,
    };
  },
};
</script>
```

多个DOM(案例)

> [官网链接](https://v3.cn.vuejs.org/guide/migration/array-refs.html)

```html
<template>
  <ul>
    <li v-for="(item, index) in arr" :key="index" :ref="setRef">
      {{ item }}
    </li>
  </ul>
</template>

<script>
import { ref, nextTick } from "vue";
export default {
  name: "refDom",
  setup() {
    const arr = ref([1, 2, 3]);
    // 存储dom数组
    const myRef = ref([]);
    const setRef = (el) => {
      myRef.value.push(el);
    };
    // 下次Dom树更新时
    nextTick(() => {
      console.dir(myRef.value);
    });
    return {
      arr,
      setRef,
    };
  },
};
</script>
```

**vue3.0 jsx语法**

```js
import { defineComponent } from "vue";
const Button = defineComponent({
  props: {
    type: { type: String, default: () => "primary" },
  },
  setup(props, { slots, emit }) {
    return () => (
      <button
        class={`mybtn-${props.type}`}
        onClick={() => {
          emit("addchage", "hahhah");
        }}
      >
        {slots.default()}
      </button>
    );
  },
});
export default Button;
```

**vue3.0 插槽**

> v-slot:default 可以简写为 #default

```html
<Suspense>
    <template v-slot:default>
      <div>
        <AsyncShow />
      </div>
    </template>
    <template v-slot:fallback>
      <h1>Loading...</h1>
    </template>
  </Suspense>
```

作用域插槽

```html
<!-- 子组件-->
<ul>
  <li v-for="( item, index ) in items">
    <slot :item="item"></slot>
  </li>
</ul>
<!-- 父组件-->
<todo-list>
  <template v-slot:default="slotProps">
    <i class="fas fa-check"></i>
    <span class="green">{{ slotProps.item }}</span>
  </template>
  <template v-slot:other="otherSlotProps">
    ...
  </template>
</todo-list>
```

**关于 Suspense 组件**

> 相关链接 https://v3.cn.vuejs.org/guide/migration/suspense.html#%E4%BA%8B%E4%BB%B6

+ Suspense是Vue3.0推出的一个内置特殊组件，用来定义具有异步请求数据的组建的显示。如果使用Suspense，要setup函数中需要返回一个promise
+ Suspense组件内置了两个具名插槽slot,一个是default，用来显示异步组件请求成功的内容；一个是fallback用来显示异步组件请求响应前页面显示的内容
+ default插槽可以有多个组件，但是需要有一个根节点

```html
<router-view v-slot="{ Component }">
  <template v-if="Component">
    <transition mode="out-in">
      <keep-alive>
        <suspense>
          <template #default>
            <component :is="Component"></component>
          </template>
          <template #fallback>
            <div>
              Loading...
            </div>
          </template>
        </suspense>
      </keep-alive>
    </transition>
  </template>
</router-view>
```

**挂载全局的属性和方法**

方法一：

```js
// main.js
app.config.globalProperties.$title = "vue3.0 测试";
// used.vue
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
console.log("$title", proxy, proxy.$title);
```

方法二(推荐)：

```js
// main.js
app.provide($title, "vue3.0 测试")
// used.vue
import { inject } from "vue"
const $title = inject($title)
```

**vuex在setup函数中的使用**

获取状态

```js
import { computed } from "vue";
import { useStore } from "vuex";
setup() {
    const store = useStore();
    const state = store.state;
    const userInfo = computed(() => {
        return {
            userName: state.user.userName,
        		age: state.user.age,
        }
    })
    return {
        userInfo
    }
}
```

修改状态

```js
setup() {
    const store = useStore();
    // 同步修改 提交Mutation
    store.commit("setAcAge", 2)
    // 异步修改 提交action
    store.dispatch("setAcAge", 2);
}
```

**表单输入绑定v-model**

`v-model` 在内部为不同的输入元素使用不同的 property 并抛出不同的事件：

+ text 和 textarea 元素使用 `value` property 和 `input` 事件

+ checkbox 和 radio 使用 `checked` property 和 `change` 事件；

+ select 字段将 `value` 作为 prop 并将 `change` 作为事件

**在 `setup` 中访问路由和当前路由**

> [相关链接](https://next.router.vuejs.org/zh/guide/advanced/composition-api.html)

因为我们在 `setup` 里面没有访问 `this`，所以我们不能再直接访问 `this.$router` 或 `this.$route`。作为替代，我们使用 `useRouter` 函数：

```js
import { useRouter, useRoute } from 'vue-router'
export default {
  setup() {
    const router = useRouter()
    const route = useRoute()
    function pushWithQuery(query) {
      router.push({
        name: 'search',
        query: {
          ...route.query,
        },
      })
    }
  },
}
```

`route` 对象是一个响应式对象，所以它的任何属性都可以被监听，但你应该**避免监听整个 `route`** 对象

```js
import { useRoute } from 'vue-router'
export default {
  setup() {
    const route = useRoute()
    const userData = ref()
    // 当参数更改时获取用户信息
    watch(
      () => route.params,
      async newParams => {
        userData.value = await fetchUser(newParams.id)
      }
    )
  },
}
```

**v-model用于自定义组件时**

> [相关链接](https://v3.cn.vuejs.org/guide/migration/v-model.html#%E6%A6%82%E8%A7%88)

prop：`value` -> `modelValue`

event：`input` -> `update:modelValue`；

**自定义指令**

定义

```js
app.directive("permission", {
  mounted(el, binding) {
    // 获取到的角色权限
    const permissionList = ["B0.1add", "B0.2remove", "B0.3export"];
    const name = binding.value;
    const index = persissionList.indexOf(name);
    if(index === -1) {
      el.style.display = "none";
    }
  }
})
```

使用

```html
<!-- 拥有该权限 -->
<button v-permission="B0.1add">新增</button>
<!-- 没有该权限 -->
<button v-permission="C0.1remove">删除</button>
```

动态指令参数

```js
const app = Vue.createApp({
  template: `<div class="box" v-abs:left="100px"></div>`
})
app.directive("abs", (el, binding) => {
  el.style[binding.arg] = binding.value;
})
```

**自定义修饰符**

> [相关链接](https://v3.cn.vuejs.org/guide/component-custom-events.html#%E5%A4%84%E7%90%86-v-model-%E4%BF%AE%E9%A5%B0%E7%AC%A6)

让我们创建一个示例自定义修饰符 `capitalize`，它将 `v-model` 绑定提供的字符串的第一个字母大写。

```html
<my-component v-model.capitalize="myText"></my-component>
```

```js
app.component('my-component', {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  methods: {
    emitValue(e) {
      let value = e.target.value
      if (this.modelModifiers.capitalize) {
        value = value.charAt(0).toUpperCase() + value.slice(1)
      }
      this.$emit('update:modelValue', value)
    }
  },
  template: `<input
    type="text"
    :value="modelValue"
    @input="emitValue">`
})
```

**proxy与defineProperty的区别**

Object.defineProperty只能监听到对象的读取或写入，Proxy除了可以监听读写还可以监听对象属性的删除、对象当中方法的调用

**多页面应用程序**

配置 `vue.config.js`

```javascript
module.exports = {
    pages: {
        index1: {
            // page 的入口
            entry: “src/views/index1/main.js”,
            // 模板来源
            template: “src/views/index1/index.html”,
            // 在 dist/index.html 的输出
            filename: “index1.html”,
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <%= htmlWebpackPlugin.options.title %>
            title: “IndexPage”,
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: [“chunk-vendors”, “chunk-common”, “index1”]
        },
        index2: {
            // page 的入口
            entry: “src/views/index2/main.js”,
            // 模板来源
            template: “src/views/index2/index.html”,
            // 在 dist/index.html 的输出
            filename: “index2.html”,
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <%= htmlWebpackPlugin.options.title %>
            title: “jhd”,
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            chunks: [“chunk-vendors”, “chunk-common”, “index2”]
        }
    },
}
```

**父子组件生命周期的执行顺序**

+ 父子组件在加载的时候，执行的先后顺序为

  父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount->子mounted->父mounted。

+ 子组件更新过程

  父beforeUpdate->子beforeUpdate->子updated->父updated

+ 父组件更新过程

  父beforeUpdate->父updated

+ 销毁过程

  父beforeDestroy->子beforeDestroy->子destroyed->父destroyed

**vue 的渲染过程**

+ 把模板编译成render函数
+ 实例进行挂载，根据根节点render函数的调用，递归生成虚拟DOM
+ 对比虚拟DOM，渲染真实的DOM
+ 组件内部的data发生变化，组件和子组件的data作为props重新调用render函数生成虚拟DOM，使用diff算法对比新旧虚拟DOM，将变化的DOM更新

**语法糖**

 虽然`Composition API`用起来已经非常方便了，但是我们还是有很烦的地方，比如 

+ 组件引入了还要注册
+ 属性和方法都要在`setup`函数中返回，有的时候仅一个`return`就十几行甚至几十行

 `Vue3`官方提供了`script setup`语法糖 

 只需要在`script`标签中添加`setup`，组件只需引入不用注册，属性和方法也不用返回，`setup`函数也不需要，甚至`export default`都不用写了，不仅是数据，计算属性和方法，甚至是自定义指令也可以在我们的`template`中自动获得。 

但是这么过瘾的语法糖，还是稍微添加了一点点心智负担，因为没有了`setup`函数，那么`props`，`emit`，`attrs`怎么获取呢，就要介绍一下新的语法了。

setup script`语法糖提供了三个新的`API`来供我们使用：`defineProps`、`defineEmit`和`useContext

+  **defineProps** 用来接收父组件传来的值`props` 
+  **defineEmit** 用来声明触发的事件表 
+  **useContext** 用来获取组件上下文`context` 

`父组件`

```html
<template>
  <div>
    <h2>我是父组件！</h2>
    <Child msg="hello"
           @child-click="handleClick" />
  </div>
</template>

<script setup>
import Child from './components/Child.vue'

const handleClick = (ctx) => {
  console.log(ctx)
}
</script>
```

`子组件`

```html
<template>
  <span @click="sonClick">msg: {{ props.msg }}</span>
</template>

<script setup>
import { useContext, defineProps, defineEmit } from 'vue'

const emit = defineEmit(['child-click'])
const ctx = useContext()
const props = defineProps({
  msg: String,
})

const sonClick = () => {
  emit('child-click', ctx)
}
</script>
```

`script setup语法糖请注意`

 如果在父组件中通过`ref='xxx'`的方法来获取子组件实例，子组件使用了`script setup`语法糖,那么子组件的数据需要用expose的方式导出，否则会因为获取不到数据而报错。 

**跨组件通讯mitt.js**

>  `Vue2`中怎么实现跨组件通讯呢,很多人第一想法就是`event bus`。但是`Vue3`移除了`$on`,`$once`,`$off`导致不能使用这个方法。但是`Vue`官方给大家推荐了`mitt.js`,它的原理就是`event bus`。 

安装

```shell
npm i mitt -s
```

封装一个hook

```js
//mitt.js
import mitt from 'mitt'
const emitter = mitt();
export default emitter;
```

 子组件1 

```html
<template>
  <div>
    我是子组件1
    <h1>{{msg}}</h1>
  </div>
</template>

<script>
import { ref, onUnmounted } from 'vue'
import emitter from '../mitt'
export default {
  name: '',

  setup() {
    //初始化
    const msg = ref('hello')
    const changeMsg = () => {
      msg.value = 'world'
    }
    // 监听事件,更新数据
    emitter.on('change-msg', changeMsg)
    // 显式卸载
    onUnmounted(() => {
      emitter.off('change-msg', changeMsg)
    })
    return {
      msg,
      changeMsg,
    }
  },
}
</script>
```

组件2

```html
<template>
  <div>
    我是子组件2
  </div>
  <button @click='changeMsg'>点击修改msg</button>
</template>

<script>
import { ref } from 'vue'
import emitter from '../mitt'

export default {
  name: '',

  setup() {
    const changeMsg = () => {
      emitter.emit('change-msg')
    }
    return {
      changeMsg,
    }
  },
}
</script>
```

