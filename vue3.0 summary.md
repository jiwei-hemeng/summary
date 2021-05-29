## vue3.0 新特征

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

**关于 Suspense 组件**

+ Suspense是Vue3.0推出的一个内置特殊组件，用来定义具有异步请求数据的组建的显示。如果使用Suspense，要setup函数中需要返回一个promise
+ Suspense组件内置了两个具名插槽slot,一个是default，用来显示异步组件请求成功的内容；一个是fallback用来显示异步组件请求响应前页面显示的内容
+ default插槽可以有多个组件，但是需要有一个根节点

