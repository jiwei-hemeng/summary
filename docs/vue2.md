## Vue学习笔记

### vue 插槽slot向父组件传值

**子组件，里面有slot插槽，并在slot上绑定了text值**

```html
<template>
  <div>
    <slot name="icon" :text="text"></slot>
  </div>
</template>
<script>
 export default{
  data(){
    return {
      text:"我是子组件"
    }
  }
}
</script>
```
**父组件通过slot-scope就可以拿到子组件slot上绑定的值，并且2.5.0版本可以用于任意元素上**

```html
<template>
  <div id="app">
    <car v-model="index">
      <!-- 这里的 data 是个形参，可以随便写 -->
      <div slot="icon" slot-scope="data">
        {{data.text}}
      </div>
    </car>    
  </div>
</template>
```

###  **单页面应用和多页面应用区别及优缺点** 

> 单页面应用（SPA），通俗一点说就是指只有一个主页面的应用，浏览器一开始要加载所有必须的 html, js, css。所有的页面内容都包含在这个所谓的主页面中。但在写的时候，还是会分开写（页面片段），然后在交互的时候由路由程序动态载入，单页面的页面跳转，仅刷新局部资源。多应用于pc端。
> 多页面（MPA），就是指一个应用中有多个页面，页面跳转时是整页刷新 

**单页面的优点：**
用户体验好，快，内容的改变不需要重新加载整个页面，基于这一点spa对服务器压力较小；前后端分离；页面效果会比较炫酷（比如切换页面内容时的专场动画）。
**单页面缺点：**
不利于seo；导航不可用，如果一定要导航需要自行实现前进、后退。（由于是单页面不能用浏览器的前进后退功能，所以需要自己建立堆栈管理）；初次加载时耗时多；页面复杂度提高很多。

### vue 指令

```html
<!-- 方法处理器 -->
<button v-on:click="doThis"></button>
 
<!-- 内联语句 -->
<button v-on:click="doThat('hello', $event)"></button>
 
<!-- 缩写 -->
<button @click="doThis"></button>
 
<!-- 停止冒泡 -->
<button @click.stop="doThis"></button>
 
<!-- 阻止默认行为 -->
<button @click.prevent="doThis"></button>
 
<!-- 阻止默认行为，没有表达式 -->
<form @submit.prevent></form>
 
<!--  串联修饰符 -->
<button @click.stop.prevent="doThis"></button>
 
<!-- 键修饰符，键别名 -->
<input @keyup.enter="onEnter">
 
<!-- 键修饰符，键代码 -->
<input @keyup.13="onEnter">
 
<!-- 点击回调只会触发一次 -->
<button v-on:click.once="doThis"></button>
 
<!-- 对象语法 (2.4.0+) -->
<button v-on="{ mousedown: doThis, mouseup: doThat }"></button>
```
### 对vue核心的理解

+ 数据驱动视图
  + 数据的改变会驱动视图的自动更新。
  + 传统的做法是手动改变DOM来使视图更新，而vue只需改变数据
+ 组件化开发
  + 可以降低数据之间的耦合度
  + 代码封装成组件之后更够高度复用，提高代码的可用性
+ “渐近式框架” & “自底向上逐层应用”
+ 响应式的数据双向绑定

### Vue的组件传值

- 父-->子
  - 父组件：v-bind绑定自定义属性
  - 子组件：组件实例对象中使用Prop对象接收
- 子--> 父	
  - 子组件：$emit(‘字定义事件名’，值)
  - 父组件：v-on绑定该自定义事件

### vue-router 的路由懒加载

首先，可以将异步组件定义为返回一个 Promise 的工厂函数 (该函数返回的 Promise 应该 resolve 组件本身)：

```js
const Foo = () => Promise.resolve({ /* 组件定义对象 */ })
```

第二，在 Webpack 2 中，我们可以使用[动态 import](https://github.com/tc39/proposal-dynamic-import)语法来定义代码分块点 (split point)：

```js
import('./Foo.vue') // 返回 Promise
```

结合这两者，这就是如何定义一个能够被 Webpack 自动代码分割的异步组件。

```js
const Foo = () => import('./Foo.vue')
```

在路由配置中什么都不需要改变，只需要像往常一样使用 `Foo`：

```js
const router = new VueRouter({
  routes: [
    { path: '/foo', component: Foo }
  ]
})
```

### 把组件按组分块

有时候我们想把某个路由下的所有组件都打包在同个异步块 (chunk) 中。只需要使用 [命名 chunk](https://webpack.js.org/guides/code-splitting-require/#chunkname)，一个特殊的注释语法来提供 chunk name (需要 Webpack > 2.4)。

```js
const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')
```

### *vue-router*  导航守卫用

- 全局守卫

  - 全局前置守卫

    ```js
    router.beforeEach((to, from) => {});
    ```

  - 全局解析守卫

    ```js
    router.beforeResolve((to, form) => {});
    ```

  - 全局后置钩子

    ```js
    router.afterEach((to, form) => {});
    ```

- 路由独享的守卫

  - beforeEnter

    ```js
    const routes = [
      {
        path: '/users/:id',
        component: UserDetails,
        beforeEnter: (to, from) => {
          return false
        },
      },
    ]
    ```

- 组件级的守卫

  - `beforeRouteEnter`
  - `beforeRouteUpdate`
  - `beforeRouteLeave`


```js
const UserDetails = {
  template: `...`,
  beforeRouteEnter(to, from) {
    // 在渲染该组件的对应路由被验证前调用
  },
  beforeRouteUpdate(to, from) {
    // 在当前路由改变，但是该组件被复用时调用
  },
  beforeRouteLeave(to, from) {
    // 在导航离开渲染该组件的对应路由时调用
  },
}
```

### 不打包第三方包

我们推荐使用第三方的 CDN 来加载资源，所谓的 CDN 说白了就是一个在线链接。

```html
<!-- element 依赖了 Vue，所以这里也必须加载 Vue -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/element-ui@2.13.1/lib/theme-chalk/index.css">
<script src="https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/element-ui@2.13.1/lib/index.js"></script>
<script src="https://cdn.jsdelivr.net/npm/echarts@4.7.0/dist/echarts.min.js"></script>
```

在项目的根目录创建 `vue.config.js`

```js
// 该配置文件必须导出一个对象（Node 中的模块语法）
module.exports = {
  // 自定义 VueCLI 中的 webpack 配置
  configureWebpack: {
    // 告诉 webpack 使用 script 标签加载的那个资源，而不是去 node_moudles 中打包处理
    externals: {
      // 属性名：你加载的那个包名
      // 属性值：script 标签暴露的全局变量，注意，写到字符串中！！！
      // 'element-ui': 'ELEMENT'
      'vue': 'Vue',
      'element-ui': 'ELEMENT',
      'echarts': 'echarts'
    }
  }
}
```

### Vue的生命周期

- BeforeCreate 实例创建之前
- Created 实例创建完成
- BeforeMount 渲染模板之前
- Mounted 渲染模板完成
- BeforeUpdate 更新组件之前
- Updated 更新组件之后
- BeforeDestroy 组件销毁之前
- Destoryed 组件销毁完毕

- v-module的语法糖原理

  - *v-modle* 默认接受 *input* 事件，相当于 *@input=“事件名”*  默认发送  *:value=“数据 ”*  的数据。

### 模块化开发和组件开发的区别

-  组件是具体的
-  组件开发更多的关注UI部分
-  模块是抽象的
-  模块开发侧重于数据的分装

### 对比jQuery、vue有什么不同

jQuery专注于视图层，通过操作Dom去实现页面的一些逻辑渲染；vue专注于数据层，通过数据的双向绑定，最终表现在DOM层面，减少了DOM的操作

### vuex中有几个核心，分别是什么

state唯一数据源，Vue实例中的data遵循相同的规则

getters可以认为是store的计算属性，就像计算属性一样，getters的返回值会根据它的依赖被缓存起来，且只有当它的值改变时才会被重新计算

mutation更改Vuex的store中的状态的唯一方法是提交mutation，非常类似于事件

action类似于mutation，不同在于action提交的是mutation，而不是直接改变状态，action可以包含任意异步操作

module能够将store分隔成模块module

```js
const moduleA = {
    state: ()=>({...}),
    mutation:{...}
}
const moduleB = {
    state: ()=>({...}),
    mutation:{...}
}
const store = new Vuex.Store({
    module:{
        a:moduleA,
        b:moduleB
    }
})
store.state.a    // moduleA的状态
store.state.b    // moduleB的状态
```

### Vue实现数据双向绑定的原理:

采用**数据劫持结合发布者-订阅者模式**的方式，通过  **Object.defineProperty()** 来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应监听回调

### Vue 自定义过滤器

局部过滤器

```js
var vm=new Vue({
    el:"#app",
    data:{
        msg:''
    },
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      }
    }
})
```

全局过滤器

```js
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})
```

### 对keep-alive 的了解

keep-alive是 Vue 内置的一个组件，可以使被包含的组件保留状态，或避免重新渲染。

```html
<keep-alive include='include_components' exclude='exclude_components'>
  <component>
    <!-- 该组件是否缓存取决于include和exclude属性 -->
  </component>
</keep-alive>
```

参数解释
include - 字符串或正则表达式，只有名称匹配的组件会被缓存
exclude - 字符串或正则表达式，任何名称匹配的组件都不会被缓存
include 和 exclude 的属性允许组件有条件地缓存。二者都可以用“，”分隔字符串、正则表达式、数组。当使用正则或者是数组时，要记得使用v-bind 。

### **vue常用的修饰符**

+ *prevent* 提交事件不再重载页面；
+ *stop* 阻止单击事件冒泡，相当于JavaScript中的e.stopPropagation()
+ *self* 当事件发生在该元素本身而不是子元素的时候会触发；
+ *capture* 事件侦听，事件发生的时候会调用

### Vue的路由实现：hash模式 和 history模式

+ **hash模式：**
  + 在浏览器中符号“#”，#以及#后面的字符称之为hash，用window.location.hash读取；
  + 特点：
    + hash虽然在URL中，但不被包括在HTTP请求中；用来指导浏览器动作，对服务端安全无用，hash不会重加载页面。
    + hash 模式下，仅 hash 符号之前的内容会被包含在请求中，如 [http://www.xxx.com](http://www.xxx.com/)，因此对于后端来说，即使没有做到对路由的全覆盖，也不会返回 404 错误。
+ **history 模式：**
  + history采用HTML5的新特性；且提供了两个新方法：pushState（），replaceState（）可以对浏览器历史记录栈进行修改，以及popState事件的监听到状态变更。
  + history 模式下，前端的 URL 必须和实际向后端发起请求的 URL 一致，如 http://www.xxx.com/items/id。后端如果缺少对 /items/id 的路由处理，将返回 404 错误。

### **vue指令有哪些，分别作用是什么**

+ v-html 绑定DOM元素并解析
+ v-text 绑定元素解析为文本
+ v-on:事件名=’方法名’  绑定事件  等价于简写方式@click=’方法名’
+ v-show=’布尔值’  控制节点的显示隐藏
+ v-if=’布尔值’  控制节点的显示隐藏
+ v-model=’渲染的数据’  数据的双向绑定，和表单元素配置使用
+ v-for  DOM遍历  for = ‘item of arr’
+ v-once  让DOM中的数据只渲染一次，不能再改动
+ v-bind  绑定DOM属性 :简写方式
+ v-cloak  当数据真正渲染到DOM上之后才进行显示
+ v-pre 让DOM中的数据不进行解析
+ for循环写法繁杂  for..in遍历对象使用，不适合遍历数组forEach 不能和continue break return配合使用  for..of修正以上缺点

###  **methods和computed的作用**

methods方法调用时计算逻辑的过程，相当于js function结算逻辑的过程,computed直接拿到的结果，是一个值，相当于js函数中的return返回值

### **methods,computed和watch的区别**

methods调用一次计算一次，使用计算好的返回值时没有computed性能高。computed计算好的结果会进行缓存，如果没有变动，重复使用时，直接取到缓存的结果拿来使用，不会再进行计算。监听属性配合表单使用，当表单中绑定的属性变化时，会触发监听属性下对应的方法进行操作，当使用固定返回值要使用computed代替watch和methods

### v-show和v-if指令的共同点和不同点

**相同点**

v-show和v-if都能控制元素的显示和隐藏

**不同点**

实现本质方法不同:v-show本质就是通过设置css中的display设置为none;控制隐藏v-if是动态的向DOM树内添加或者删除DOM元素；v-show只编译一次，后面其实就是控制css，而v-if不停的销毁和创建，如果要频繁切换某节点时，故v-show性能更好一点

### **v-for中的key**

v-for的key值需要使用v-bind去绑定唯一的key，当 Vue 正在更新使用 v-for 渲染的元素列表时，需要使用key来给每一个节点做一个唯一标识,Diff算法就可以正确的识别此节点,**key的作用主要是为了高效的更新虚拟DOM**

### v-for 与 v-if 的优先级

v-for的优先级高于v-if

### **vue的优点**

+ 轻量级
+ 数据的双向绑定
+ 组件化开发
+ 视图、数据、结构分离
+ 虚拟DOM

### **vue和react的区别**

Vue通过getter/setter以及一些函数的劫持，能精确知道数据的变化，不需要特别的优化就能实现很好的性能。React则是通过diff算法比较不同，可能导致大量不必要的VDOM的重新渲染

### Vue 可以在哪个生命周期发送请求

可以在created、beforeMounte、Mounted发送ajax请求，但是我们建议在created发送请求。应为在服务端渲染（ssr）只支持beforeCreated、created两个生命周期钩子函数

### Vue生命周期在beforeMount和mounted 做了什么

在**beforemount**周期钩子函数生成了V-DOM，而mounted 真实的Dom已经生成

### vant组件的进阶（rem适配）

Vant 中的样式默认使用 `px` 作为单位，如果需要使用 `rem` 单位，推荐使用以下两个工具：

+ [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem) 是一款 postcss 插件，用于将 px 单位转化为 rem
+ [lib-flexible](https://github.com/amfe/lib-flexible) 用于设置 rem 基准值

使用方法：

**（1）使用 [lib-flexible](https://github.com/amfe/lib-flexible) 动态设置 REM 基准值（html 标签的字体大小）**

安装依赖：

```shell
# yarn add amfe-flexible
npm i amfe-flexible
```

然后在 `main.js` 中加载执行该模块：

```js
import 'amfe-flexible'
```

**（2）使用 [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem) 将 `px` 转为 `rem`**

安装依赖：

```shell
# yarn add -D postcss-pxtorem
# -D 是 --save-dev 的简写
npm install postcss-pxtorem -D
```

然后在**项目根目录**中创建 `postcss.config.js` 文件：

```js
module.exports = {
  plugins: {
    'autoprefixer': {
      browsers: ['Android >= 4.0', 'iOS >= 8']
    },
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*']
    }
  }
}
```

配置完毕，**重新启动服务**。

### 动态路由

概念：不同的路由地址，指向同一个组件，此时需要使用动态路由。

```html
<!-- 路径传参  路由规则{path:'/article/:id'}-->
<router-link to="/article/10001"></router-link>
```

总结：

- 在路由规则中，匹配到不同的地址，指向同一个组件
- 代码：`{path:'/article/:id', component: ArticleItem}`
- 数据：模板 `{{$route.params.id}}`  组件  `this.$route.params.id`

### vue-router-属性to

+ 直接使用字符串，简单路径跳转。

  ```html
  <router-link to="/list"></router-link>
  ```

+ 也可以使用字符串，进行带参数的跳转。

  ```html
  <!-- 路径传参  路由规则{path:'/article/:id'}-->
  <router-link to="/article/10001"></router-link>
  <!-- 键值对传参 路由规则{path:'/article'}-->
  <router-link to="/article?id=10001"></router-link>
  ```

+ 注意：如果有复杂的参数传递，拼接字符串挺麻烦，**to属性支持对象写法**。

### vue-router-属性to的对象写法

+ 普通跳转

  ```html
  <router-link :to="{path:'/list'}"></router-link>
  ```

+ 路径传参（对象写法）

  ```js
  // 路由规则 (命名路由)
  const routes = [{path:'/article/:id',name:'article',component:ArticleItem}]
  ```

  ```html
  <router-link :to="{name:'article',params:{id: 10001}}"></router-link>
  <!-- /article/10001 -->
  ```

  获取 使用$route.params.id 

  **特点：**

  只能使用name，不能使用path；参数不会显示在路径上；浏览器强制刷新参数会被清空

+ 键值对传参（对象写法）

  ```js
  const routes = [{path:'/article',component:ArticleItem}]
  ```

  ```html
  <router-link :to="{path:'/article',query:{id: 10001}}"></router-link>
  <!-- /article?id=10001 -->
  ```

  获取 使用$route.query.id 
  
  **特点：** 参数会显示在路径上，刷新不会清空

### vue-router-编程式导航

+ 导航：可以发生路由跳转（地址hash值得改变）
  + <router-link /> 这个标签可以实现导航功能,**声明式导航**。
  + 通过 `$router.push()`  这个函数可以实现导航功能，**编程式导航**。

### md5 在vue项目中的使用

+ 安装

  ```shell
  npm install --save js-md5
  ```

+ 在*main.js*导入

  ```js
  import md5 from 'js-md5';
  Vue.prototype.$md5 = md5;
  ```

+ 使用：

  ```js
  this.$md5('hello world')  // 5eb63bbbe01eeed093cb22bb8f5acdc3
  ```

### vue 中结合实现头像裁切

**安装**

```shell
npm install cropperjs
```

**在 `html` 中**

```html
<template> 
  <!-- 用块元素（容器）包装图像或画布元素 -->
  <div class="updata-photo">
    <img class="image" :src="image" ref="image">
  </div>
  <van-nav-bar
    class="toolbar"
    left-text="取消"
    right-text="确认"
    @click-left="$emit('close')"
    @click-right="onConfirm"
  />
</template>
```

**在 `js` 中**

```js
<script>
import { updateUserPhoto } from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
export default {
  name: 'updataPhoto',
  methods: {
    // 将获取裁剪结果的方法包装成promise
    getCroppedCanvas () {
      return new Promise(resolve => {
        this.cropper.getCroppedCanvas().toBlob((file) => {
          resolve(file)
        })
      })
    },
    // 点击确认按钮
    async onConfirm () {
      this.$toast.loading({
        message: '保存中',
        forbidclick: true,
        duration: 0 // 展示时间，0 表示持续展示
      })
      // 获取裁切后的结果
      const file = await this.getCroppedCanvas()
      const fd = new FormData()
      fd.append('photo', file)
      // 调用上传文件的接口
      await updateUserPhoto(fd)
      // 更新父组件中的用户头像
      this.$emit('update-photo', window.URL.createObjectURL(file))
      // 关闭弹出层
      this.$emit('close')
      this.$toast.success('保存成功')
    }
  },
  props: {
    file: {
      required: true
    }
  },
  mounted () {
    const image = this.$refs.image
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })
  },
  data () {
    return {
      image: window.URL.createObjectURL(this.file),
      cropper: null // 裁切器实例
    }
  }
}
</script>
```

**在 `css` 中**

```less
.updata-photo {
  height: 100%;
}
/* 确保图像尺寸完全适合容器 */
.image {
  display: block;
  max-width: 100%;
}
```

### vue项目中使用RSA加密

+ 安装

  ```shell
  npm install --save jsencrypt
  ```

+ 在main.js中

  ```js
  
  import JSEncrypt from 'jsencrypt';
  // 加密
  Vue.prototype.$getRsaCode = function(str){
    let pubKey = `-----BEGIN PUBLIC KEY-----
   rqerewrrrweqrwqewrwqrerwqrsfsafafsafsafqrewqrwqrqwreqer
    -----END PUBLIC KEY-----`;
    let encryptStr = new JSEncrypt();
    encryptStr.setPublicKey(pubKey); // 设置 加密公钥
    let  data = encryptStr.encrypt(str.toString());  // 进行加密
    return data;
  }
  // 解密
  Vue.prototype.$decrypt(txt) {
      let privatekey = `MFwwDQYJKoZIhvcNAQ78k3RiZHWx5AfJqdH9xRNBmD9wGD`
      const encryptor = new JSEncrypt()
    	encryptor.setPrivateKey(privateKey)
      return encryptor.decrypt(txt)
  }
  ```

+ 使用加密方法

  ```js
  let rasUserName = this.$getRsaCode(this.loginForm.userName); // ras 加密 用户名
  let rasPw = this.$getRsaCode(this.loginForm.password); // ras 加密 密码
  ```

### vue之watch属性使用方法

+ 用法一：基本数据监听

  ```js
  new Vue({
      el: '#myVue',
      data: {
          title:'123'
      },
      watch: {
          title: function(val){ //（new, old） new:变化后的值；old：变化前的值
              console.log(val)  // 打印出title变化后的数据
          }
      } 
  })
  ```

  这种用法有个特殊的地方：当值第一次绑定的时候，不会执行监听函数，只有值发生改变才会执行

+ 用法二：immediate和handler

  用法一有个不足的地方就是我们在初始值的时候不会执行handler方法。为了解决这个问题我们就需要用到immediate属性了

  ```js
  new Vue({
      el: '#myVue',
      data: {
          people: {id: 1, name: 'tom'}
      },
      watch: {
          people: {
              immediate: true
              handler(val) {
          		console.log(val)
  			}
       	}
  	} 
  })
  ```

  使用场景：父组件向子组件动态传值时，子组件props首次获取到父组件传来的默认值时，也需要执行函数，
  这时只需要将immediate设为true就行了

+ 用法三：deep

  监听一个对象的变化时，普通的watch方法无法监听到对象内部属性的变化，这时就需要使用deep属性对对象进行深度监听。

  ```js
  new Vue({
    el: '#vmyVue',
    data: {
      student: {id: 1, name: 'Tom',sex: '男'}
    },
    watch: {
      student: {
        handler(val) {
          console.log(val)
        },
        deep: true,
      }
    }, 
  })
  ```

  这种写法有个问题就是会监听对象中的全部的属性变化，只要有一个属性发生变化就会执行handler函数.在实际项目中我们
  可能只需要监听对象中的某一个属性。这时我们可以使用字符串的形式监听对象属性：
  下面的代码只会监听对象中的name属性，只有name属性发生变化的时候才会触发handler函数

  ```js
  new Vue({
    el: '#vmyVue',
    data: {
      student: {id: 1, name: 'Tom',sex: '男'}
    },
    watch: {
      'student.name': {
          handler(val) {
          	console.log(val)
          },
          deep: true,
       }
     } 
  })
  ```


### mock-server 的使用

> 当我们在做前后端分离的项目时，有时候不一定后端已经将接口写好，但是我们前端希望能够同时开发，这是我们就可以通过工具模拟出一些接口方便我们开发。常用请求方式：DELETE (删除)	GET(获取数据)	PUT(全部修改)	PATCH(局部修改)	POST(添加数据)

+ 安装

  ```shell
  npm i json-server -g
  ```

+ 接口数据

  ```json
  {
    "brands": [
      { "id": 1, "name": "宝马", "time": "2019-10-10 10:10:46" },
      { "id": 2, "name": "奥迪", "time": "2019-12-10 10:10:46" },
      { "name": "奔驰", "time": "2020-04-13T11:09:55.423Z", "id": 3},
      { "name": "奥托", "time": "2020-04-13T11:10:03.953Z", "id": 4}
    ],
    "heroes": [
      { "heroName": "德玛西亚", "gender": "女", "cTime": "2020-05-08T00:36:56.530Z","id": 10001 },
      { "id": 10002, "heroName": "刘三姐", "gender": "女", "cTime": "Fri Apr 17 2020 16:24:42 GMT+0800 (中国标准时间)" },
      { "id": 10003, "heroName": "超人", "gender": "男","cTime": "2020/10/10 10:10:10"},
      { "cTime": "2020-04-18T02:59:44.920Z", "heroName": "小乔", "gender": "女","id": 10004}
    ]
  }
  ```
  
+ 启动

  ```shell
  json-server db.json
  ```
  
+ 也可以直接使用npx的方式启动

  ```shell
  npx json-server --watch --port 3000 db.json  
  ```


### 递归组件的使用

> 有时候我们不知道后端返回数据的深度，而我们需要深度渲染各层的数据，我们就要使用到递归组件。

当我们定义组件是一定要设置name属性，而且递归组件一定要有递归结束，而不能使其无限制的一直递归下去，即递归是有限的。

```html
<template>
  <div class="WarpItem">
    <WarpItem />
  </div>
</template>

<script>
  export default {
    name: "WarpItem",
    components: {},
    data() {
      return {};
    },
    watch: {},
    created() {},
    methods: {},
  };
</script>
<style lang="scss" scoped></style>
```

递归组件向外传递数据直接用$emit是无法实现的。因为是递归的原因。

解决办法：用eventBus实现：这种方法用在兄弟组件之间通信很常见。当然也可以用在爷爷组件和孙子组件之间的传递数据。

+ 来创建出我们的eventBus，我们把它命名为bus.js

  ```js
  import Vue from 'vue';  
  export default new Vue();
  ```

+ 在递归组件和使用它的组件同时引入：

  ```js
  import Bus from 'common/js/bus.js';  
  ```

+ 在递归组件里面触发事件：

  ```js
  addCart(event) {  
      Bus.$emit('getTarget', event.target);   
  }   
  ```

+ 在使用递归组件的父组件里面监听事件：

  ```js
  created() {  
      Bus.$on('getTarget', target => {  
          console.log(target);  
      });  
  }
  ```

  

### vue 插槽

> 组件的插槽，提供的是界面上高度复用。

默认插槽（组件只有一处内容不固定）

```html
<div id="app">
    <!-- 组件标签之间的内容，插入定义组件的slot标签位置 -->
    <page>内容1</page>
    <page>内容2</page>
    <page>内容3</page>
  </div>
  <script src="./vue.js"></script>
  <script>
    // 组件
    Vue.component('page',{
      template: `<div class="page">
          <header>头部</header>
          <section>
            <!-- 默认插槽 -->
            <slot></slot>
          </section>
          <footer>底部</footer>
        </div>`
    })
    const vm = new Vue({
      el: '#app'
    })
  </script>
```

具名插槽（如果组件中有多处内容不固定）

```html
<div id="app">
    <!-- 组件标签之间的内容，插入定义组件的slot标签位置 -->
    <page>
      <!-- slot="插槽的名字" 把当前标签内的结构插入到名字为content的插槽中 -->
      <div slot="content">内容1</div>
      <div slot="footer">底部1</div>
    </page>
 </div>
<script>
    // 组件
    Vue.component('page',{
        template: `<div class="page">
            <header>头部</header>
            <section>
                <!-- 具名插槽 -->
                <slot name="content"></slot>
            </section>
            <footer>
                <!-- 具名插槽 -->
                <slot name="footer"></slot>
            </footer>
        </div>`
    })
    const vm = new Vue({
        el: '#app'
    })
</script>
```

### vue中style scope深度访问方式

> **使用场景:** 当我们需要覆盖element-ui中的样式时只能通过深度作用选择器

+ **>>>**

  如果vue的style使用的是css，那么则

  ```css
  <style lang="css" scoped>
  .a >>> .b {
  /* ... */
  }
  </style>
  ```

  但是像scss等预处理器却无法解析>>>，所以我们使用下面的方式.

+ **/deep/**

  ```scss
  <style lang="scss" scoped>
  .a{
  /deep/ .b {
  /* ... */
  }
  }
  </style>
  ```

  但是有些开发者反应，在vue-cli3编译时，deep的方式会报错或者警告。

+ **::v-deep**

  ```scss
  <style lang="scss" scoped>
  .a{
  ::v-deep .b {
  /* ... */
  }
  }
  </style>
  ```


### webpack项目的require.context的作用

> 在我们项目开发中，经常需要import或者export各种大量有规则模块

我们会这样引入组件：

```js
import A from 'components/A'
import B from 'components/B'
import C from 'components/C'
import D from 'components/D'
```

也可以使用**require.context**

```js
require.context(directory, useSubdirectories, regExp)
```

1. directory: 要查找的文件路径
2. useSubdirectories: 是否查找子目录
3. regExp: 要匹配文件的正则

例如：

```js
const ctx = require.context('./components/', true, /\.js$/)
console.log(ctx.keys())
// 相当于Object.keys 结果是["./A.js", "./B.js", "./C.js", "./D.js"]
```

其实 *ctx.keys()* 就是

```js
var map = {
	"./A.js": "./src/components/test/components/A.js",
	"./B.js": "./src/components/test/components/B.js",
	"./C.js": "./src/components/test/components/C.js",
	"./D.js": "./src/components/test/components/D.js"
};

Object.keys(map)
```

只不过map是模块内部变量，无法直接访问，所以通过其实提供的keys方法访问

那么如何引入ABCD组件呢？

```js
const ctx = require.context('./components/', true, /\.js$/)
const map = {}
for (const key of ctx.keys()) {
  map[key] = ctx(key)
}
console.log(map)
```

###  **vue常用工具函数总结**

```js
// 识别ie--浅识别
export const isIe = () => {
    let explorer = window.navigator.userAgent;
        //判断是否为IE浏览器
    if (explorer.indexOf("MSIE") >= 0) {
        return true;
    }else {
        return false
    }
}
// 颜色16进制转rgba
export function hex2Rgba(hex, opacity) {
	if(!hex) hex = "#2c4dae";
    return "rgba(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7)) + "," + (opacity || "1") + ")";
}
// 去除html标签
export const htmlSafeStr = (str) => {
    return str.replace(/<[^>]+>/g, "")
}
```

### vue中纯前端实现导出简单Excel表格的功能

> 在许多的后台系统中少不了导出Excel表格的功能，下面就是我在实际的项目中纯前端使用vue-json-excel插件来实现简单Excel表格的导出功能

**下载**

```bash
npm install vue-json-excel
```

**在模板中使用**

```js
<JsonExcel
  :data="json_data"
  :fields="json_fields"
  name="filename.xls"
>
  <el-button type="primary" size="small">导出EXCEL</el-button>
</JsonExcel>
```

**Excel表格表头的设置**

```js
import JsonExcel from 'vue-json-excel'
export default{
   data(){
       return{
          json_fields: {  //导出Excel表格的表头设置
            '序号': 'type',
            '姓名': 'userName',
            '年龄': 'age',
            '手机号': 'phone',
            '注册时间': 'createTime',
          },
       }
    }
 }
```

**Excel表格中的数据**

```js
export default{
   data(){
       return{
          json_data:[
            {"userName":"张三","age":18,"gender":"phone":15612345612,"createTime":"2019-10-22"},
            {"userName":"李四","age":17,"gender":"phone":15612345613,"createTime":"2019-10-23"},
            {"userName":"王五","age":19,"gender":"phone":15612345615,"createTime":"2019-10-25"},
            {"userName":"赵六","age":18,"gender":"phone":15612345618,"createTime":"2019-10-15"},     
          ]
       }
   }
}
```

### Vue 前端开发——打印功能实现

> 业务场景常见于一些订单记录发票等的一些pdf 打印

**下载安装**

```SHELL
npm install vue-print-nb --save
```

**main.js 中导入注册**

```shell
import Print from 'vue-print-nb'
Vue.use(Print);
```

**数据测试**

```html
<el-button type="primary" v-print="'#printDetail'">打印</el-button>
<div id="printDetail">要打印的内容</div>
```

### 计算属性

计算属性是`vue`实例中的一个配置选项：`computed`

> 通常里面都是一个个计算相关的函数，函数里头可以写大量的逻辑，最后返回计算出来的值
>  即我们可以把这些计算的过程写到一个计算属性中去，然后让它动态的计算。

```js
var vm = new Vue({
    el:'.app',
    data:{
        Math:88,
        English: 77,
        chemistry:99,
    },
    computed:{
        sum:function(){
            return this.Math+ this.English+this.chemistry;
        },
        average:function(){
            return Math.round(this.sum/3);
        }
    }
});
```

**计算属性一般就是用来通过其他的数据算出一个新数据，而且它有一个好处就是，它把新的数据缓存下来了，当其他的依赖数据没有发生改变，它调用的是缓存的数据，这就极大的提高了我们程序的性能**

computer 如果是一个对象，有get和set两个选项

和methods的区别：methods可以接受参数，而computer不能；computer可以缓存，而methods不能

### **vue中provide和inject 用法**

> **由于vue有$parent属性可以让子组件访问父组件。但孙组件想要访问祖先组件就比较困难。通过provide/inject可以轻松实现跨级访问祖先组件的数据**

**案例**

在app组件

```html
<template>
  <div
    id="app"
  >
    <router-view
      v-if="isRouterAlive"
    />
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    MergeTipDialog,
    BreakNetTip
  },
  data () {
    return {
      isShow: false,
      isRouterAlive: true
  },

  // 父组件中返回要传给下级的数据
  provide () {
    return {
      reload: this.reload
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }
}
</script>
```

在后代组件

```html
<template>
  <popup-assign
    :id="id"
    @success="successHandle"
  >
    <div class="confirm-d-tit"><span class="gray-small-btn">{{ name }}</span></div>
    <strong>将被分配给</strong>
    <a
      slot="reference"
      class="unite-btn"
    >
      指派
    </a>
  </popup-assign>
</template>
<script>
import PopupAssign from '../PopupAssign'
export default {
//引用vue reload方法
  inject: ['reload'],
  components: {
    PopupAssign
  },
methods: {
    // ...mapActions(['freshList']),
    async successHandle () {
      this.reload()
    }
  }
}
</script>
```

### **vue项目如何使用animate.css**

**安装**

```shell
# 使用npm
npm i animate.css
# 使用yarn
yarn add animate.css
```

**引入**

```js
import animated from 'animate.css'
vue.use(animated)
```

**使用**

```html
<transition enter-active- leave-active- >
  <div v-if="isShow">123</div>
</transition>
```

### vue 中webscoket的使用

**安装**

```shell
npm i socket.io-client
```

**使用**

```js
import io from 'socket.io-client'
import { getItem, setItem } from '@/utils/storage'
export default {
  name: 'UserChat',
  data () {
    return {
      message: '',
      socket: null, // WebSocket 通信对象
      messages: getItem('chat-messages') || [] // 消息列表
    }
  },
  computed: {},
  watch: {
    messages () {
      setItem('chat-messages', this.messages)
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    }
  },
  created () {
    const socket = io('http://ttapi.research.itcast.cn/')
    this.socket = socket
    socket.on('connect', () => {
      console.log('连接建立成功了')
    })
    socket.on('disconnect', () => {
      console.log('断开连接了')
    })
    socket.on('message', data => {
      this.messages.push(data)
    })
  },
  mounted () {
    this.scrollToBottom()
  },
  methods: {
    onSend () {
      const data = {
        msg: this.message,
        timestamp: Date.now()
      }
      this.socket.emit('message', data)
      this.messages.push(data)
      this.message = ''
    },

    scrollToBottom () {
      const list = this.$refs['message-list']
      list.scrollTop = list.scrollHeight
    }
  }
}
```

### vue 的混入(mixin)

**组件自行混入**(单个组件使用)

```html
  <div id="app">
    <com-a></com-a>
    <com-b></com-b>
  </div>
  <script src="./vue.js"></script>
  <script>
    // 待混入的对象
    const mixin = {
      mounted () {
        // 组件容器dom对象
        const dom = this.$refs.dom
        // 获取高度,赋值给height数据
        this.height = dom.offsetHeight
      }
    }
    Vue.component('com-a',{
      template: `<div ref="dom" style="height:100px">组件A {{height}}</div>`,
      data() {
        return {
          height: 0
        }
      },
      // 获取组件的高度,显示在组件中
      mixins: [mixin]
    })

    Vue.component('com-b',{
      template: `<div ref="dom" style="height:120px">组件B {{height}}</div>`,
      data() {
        return {
          height: 0
        }
      },
      // 获取组件的高度,显示在组件中
      mixins: [mixin]
    })
    const vm = new Vue({
      el: '#app'
    })
  </script>
```

**全局混入**

```html
 <div id="app" ref="dom">
    {{msg}}
    <com-a></com-a>
    <com-b></com-b>
  </div>
  <script src="./vue.js"></script>
  <script>
    Vue.mixin({
      // 全局混入的时候，关于dom操作，在mouted中遇到问题。
      // 这样写，所有的组件和vue实例，都会混mounted,都需要dom的ref属性。
      // 但是其他的选项是可以混入的
      mounted () {
        // 组件容器dom对象
        const dom = this.$refs.dom
        this.height = dom.offsetHeight
      },
      data () {
        return {
          msg: '混入数据'
        }
      },
      methods: {
        say () {
          return '混入的函数'
        }
      }
    }) 
    Vue.component('com-a',{
      template: `<div ref="dom" style="height:100px">组件A {{height}} {{msg}} {{say()}}</div>`,
      data() {
        return {
          height: 0
        }
      }
    })

    Vue.component('com-b',{
      template: `<div ref="dom" style="height:120px">组件B {{height}} {{msg}}</div>`,
      data() {
        return {
          height: 0
        }
      }
    })
    const vm = new Vue({
      el: '#app'
    })
  </script>
```

### js 中如何获取路由对象

**使用router.currentRoute.fullPath**

```js
import router from "@/route"
function redireatLogin() {
  router.replace({
    name: "login",
    query: {
      redireat: router.currentRoute.fullPath
    }
  })
}
```

### vue 的自定义指令

**vue 自定义指令控制按钮权限**

定义自定义指令

```js
import Vue from "vue";
const permissionList = ["B0.1add", "B0.2remove", "B0.3export"];
Vue.directive("permission", {
  inserted(el, binding, vnode) {
    const name = binding.value;
    const index = persissionList.indexOf(name);
    if(index === -1) {
      el.parentNode.removeChild(el);
    }
  }
})
```

在`main.js`引入项目

```js
import "@/utils/permission.js"
```

使用指令

```html
<!-- 控制添加按钮的权限 -->
<el-button v-permission="B0.1add">添加</el-button>
<!-- 控制编辑按钮的权限 -->
<el-button v-permission="B0.5edit">修改</el-button>
```

### Vue2 中的 this 为啥能够直接获取到 data 和 methods 

通过 this 直接访问到 data 里面的数据的原因是：data里的属性最终会存储到new Vue的实例（vm）上的 _data对象中，访问 this.xxx，是访问Object.defineProperty代理后的 this._data.xxx。

通过this直接访问到methods里面的函数的原因是：因为methods里的方法通过 bind指定了this为 new Vue的实例(vm)

### 完整的导航解析流程
> [vue 官网连接](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E5%AE%8C%E6%95%B4%E7%9A%84%E5%AF%BC%E8%88%AA%E8%A7%A3%E6%9E%90%E6%B5%81%E7%A8%8B)
- 导航被触发。
- 在失活的组件里调用 beforeRouteLeave 守卫。
- 调用全局的 beforeEach 守卫。
- 在重用的组件里调用 beforeRouteUpdate 守卫(2.2+)。
- 在路由配置里调用 beforeEnter。
- 解析异步路由组件。
- 在被激活的组件里调用 beforeRouteEnter。
- 调用全局的 beforeResolve 守卫(2.5+)。
- 导航被确认。
- 调用全局的 afterEach 钩子。
- 触发 DOM 更新。
- 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。



