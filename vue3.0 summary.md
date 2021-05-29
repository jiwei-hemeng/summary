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

