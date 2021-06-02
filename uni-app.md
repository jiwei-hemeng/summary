## 小程序的生命周期

+ onLaunch 启动就执行
+ onShow 切换到前台运行时
+ onHide 切后台时
+ onError 小程序抛出错误时，捕获错误时
+ onPageNotFound 没用找到页面时

小程序中将生命周期分成两类：应用级别App；页面级别Page。

## 小程序原生的api

* 加载框

  ```js
  wx.showLoading({
    title: '加载中',
  })
  
  setTimeout(function () {
    wx.hideLoading()；
  }, 2000)
  ```

+ 显示一个弹出框，确定和取消按钮

  ```js
  wx.showModal({
    title: '提示',
    content: '这是一个模态弹窗',
    // 点击按钮的执行函数；
    success (res) {
      if (res.confirm) {
        console.log('用户点击确定')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
  ```

+ 点击组件，后简单的信息提示

  ```js
  wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
  })
  ```

+ 模拟类似于系统的菜单，菜单项可以进行设置，选择后知道选择是哪个

  ```js
  wx.showActionSheet({
    itemList: ['A', 'B', 'C'],
    success (res) {
      console.log(res.tapIndex);
    },
    fail (res) {
      console.log(res.errMsg)
    }
  })
  ```

+ 选择图片

  ```js
  wx.chooseImage({
   // 选择几张照片
    count: 1,
    // 所选的图片的尺寸：原图，压缩图
    sizeType: ['original', 'compressed'],
    // 来源：相册、相机
    sourceType: ['album', 'camera'],
    // 选择其中一项后的回调
    success (res) {
      // 临时的文件地址
      const tempFilePaths = res.tempFilePaths;
    }
  })
  ```

+ 给服务器传递数据

  ```js
  wx.uploadFile({
      url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
      filePath: "https://xx.com/asd/xxx.png",   // 上传的文件！形式：网络地址形式；
      name: 'image_file',  // 后台接受图片文件的字段；后台定；
      success (res){
  		// 请求成功的时候回调
      }
  })
  ```

## 地址参数

在页面上的使用

```html
<navigator wx:for="{{List}}" to="/page/index?id={{item.id}}">{{item.name}}</navigator>
```

在js中的获取

```js
Page({
    onLoad: function(query){
        console.log(query)
    }
})
```

## 在项目中使用less的步骤

不能直接使用，必须先安装，再使用

```shell
npm i less less-loader -D
```

配置：

```html
<style lang="less"></style>
```

## open 系列小结

+ 组件：`<button> open-type属性：会有一些行为:客服、意见、获取电话、用户信息`【button设计理念：用户**主动**（潜意识，自己同意被获取自己信息）点击才有效，属性可以设置获取用户隐私信息；】需要用户自己点击；
+ 组件：`<open-data> type 展示用户昵称、头像、性别、国家等非隐私信息`  【不需要用户同意，代码直接进行获取】

## 地图相关

+ 展示：组件map

  ```html
  <map longitude="113.324520" latitude="23.099994"></map>
  ```

+ 获取经纬度：需要在pages.json增加配置：位置信息是用户隐私；

  ```js
  wx.getLocation({success(res){
      // 用户经纬度：GPS模块；
  }});
  ```

+ 使用**getLocation**前的page.json的配置

  ```json
  {
    "pages": ["pages/index/index"],
    "permission": {
      "scope.userLocation": {
        "desc": "你的位置信息将用于小程序位置接口的效果展示" 
      }
    }
  }
  ```

## uni-ui 使用说明

安装

```shell
npm install @dcloudio/uni-ui
# 如果没有导入sass
npm i sass sass-loader -D
```

 在 `script` 中引用组件： 

 例如我们需要导入 `uni-badge` 组件 

```js
import {uniBadge} from '@dcloudio/uni-ui'
export default {
    components: {uniBadge}
}
```

使用 `cli` 安装好 `uni-ui` 之后，需要配置 `easycom` 规则，让 `npm` 安装的组件支持 `easycom`

打开项目根目录下的 `pages.json` 并添加 `easycom` 节点：

```js
// pages.json
{
    "easycom": {
        "autoscan": true,
        "custom": {
            // uni-ui 规则如下配置
            "^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue"
        }
    },
    // 其他内容
    pages:[
        // ...
    ]
}
```

## 小程序获取token的步骤

**步骤一：** 点击按钮调用getUserInfo方法获取用户信息

```html
<button type="primary" open-type="getUserInfo" @getuserinfo="btn_getInfo">微信登录</button>
```

**步骤二：** 在组件methods中

```js
async btn_getInfo (res) {
    this.getUserToken(res.detail)
},
async getUserToken (userInfo) {
    // 获取登录的code
    const [err,codeObj] = await uni.login();
    const {message,meta} = await this.http({
        url: "/api/public/v1/users/wxlogin",
        method: "POST",
        data:{
            encryptedData: userInfo.encryptedData,
            iv: userInfo.iv,
            rawData: userInfo.rawData,
            signature: userInfo.signature,
            code: codeObj.code,
        }
    });
    if (meta.status === 200) {
        uni.setStorageSync("token",message.token);
        uni.navigateBack();
    }
}
```

## 统一分装请求

**步骤一** 在*mian.js*中引入分装的请求文件

```js
import request from '@/utils/request'
Vue.use(request)
```

**步骤二：** 在 *utils/request.js* 中，将请求挂在到vue的原型上

```js
export default function(Vue) {
  const baseUrl = "https://api-ugo-web.itheima.net";
  // Vue 的本质是一个构造函数，其他方法可以挂在到它的原型上
  Vue.prototype.http = async function(opts) {
    const { url } = opts;
    uni.showLoading({
      title: "数据加载中...",
      mask: true
    });
    opts.url = baseUrl + opts.url
    const [err, res] = await uni.request(opts)
    uni.hideLoading();
    return res.data;
  }
}
```

## uniapp的动态传参

在起始页面跳转到test.vue页面并传递参数 

```js
uni.navigateTo({    url: 'test?id=1&name=uniapp' }); 
```

 在test.vue页面接受参数 

```js
export default {
    onLoad: function (option) { 
        console.log(option.id); //打印出上个页面传递的参数。
        console.log(option.name); //打印出上个页面传递的参数。
    }
}
```

 url有长度限制，太长的字符串会传递失败，可使用[窗体通信](https://uniapp.dcloud.io/collocation/frame/communication)、[全局变量](https://ask.dcloud.net.cn/article/35021)，或`encodeURIComponent`等多种方式解决，如下为`encodeURIComponent`示例。 

```html
<navigator :url="'/pages/test/test?item='+ encodeURIComponent(JSON.stringify(item))"></navigator>
```

 在test.vue页面接受参数 

```js
onLoad: function (option) {
    const item = JSON.parse(decodeURIComponent(option.item));
}
```

## 跨端兼容

>  uni-app 已将常用的组件、JS API 封装到框架中，开发者按照 uni-app 规范开发即可保证多平台兼容，大部分业务均可直接满足 , 但每个平台有自己的一些特性，因此会存在一些无法跨平台的情况 

### [组件的条件编译](https://uniapp.dcloud.io/platform?id=组件的条件编译)

```html
<!--  #ifdef  %PLATFORM% -->
平台特有的组件
<!--  #endif -->
```

### [样式的条件编译](https://uniapp.dcloud.io/platform?id=样式的条件编译)

```css
/*  #ifdef  %PLATFORM%  */
平台特有样式
/*  #endif  */
```

### [API 的条件编译](https://uniapp.dcloud.io/platform?id=api-的条件编译)

```js
// #ifdef  %PLATFORM%
平台特有的API实现
// #endif
```

## 分包[subPackages](https://uniapp.dcloud.io/collocation/pages?id=subpackages)

>  因小程序有体积和资源加载限制，各家小程序平台提供了分包方式，优化小程序的下载和启动速度。 

 假设支持分包的 `uni-app` 目录结构如下： 

```
┌─pages               
│  ├─index
│  │  └─index.vue    
│  └─login
│     └─login.vue    
├─pagesA   
│  ├─static
│  └─list
│     └─list.vue 
├─pagesB    
│  ├─static
│  └─detail
│     └─detail.vue  
├─static             
├─main.js       
├─App.vue          
├─manifest.json  
└─pages.json   
```

 则需要在 pages.json 中填写 

```json
{
    "pages": [{
        "path": "pages/index/index",
        "style": { ...}
    }, {
        "path": "pages/login/login",
        "style": { ...}
    }],
    "subPackages": [{
        "root": "pagesA",
        "pages": [{
            "path": "list/list",
            "style": { ...}
        }]
    }, {
        "root": "pagesB",
        "pages": [{
            "path": "detail/detail",
            "style": { ...}
        }]
    }],
    "preloadRule": {
        "pagesA/list/list": {
            "network": "all",
            "packages": ["__APP__"]
        },
        "pagesB/detail/detail": {
            "network": "all",
            "packages": ["pagesA"]
        }
    }
}
```

分包配置项[preloadRule](https://uniapp.dcloud.io/collocation/pages?id=preloadrule)

| **字段** |  **类型**   | **必填** | **默认值** |                           **说明**                           |
| :------: | :---------: | :------: | :--------: | :----------------------------------------------------------: |
| packages | StringArray |    是    |     无     | 进入页面后预下载分包的 `root` 或 `name`。`__APP__` 表示主包。 |
| network  |   String    |    否    |    wifi    | 在指定网络下预下载，可选值为：all（不限网络）、wifi（仅wifi下预下载） |

## 判断当前是否是微信客户端

```js
function isWechart() {
  let ua = navigator.userAgent.toLowerCase();
  return ua.match(/MicroMessenger/i) == "micromessenger"
}
```

## 安装jdk并配置环境变量

```powershell
# 引号中换成自己的路径
setx JAVA_HOME "C:\Program Files\Java\jdk1.8.0"
setx Path "%PATH%;%JAVA_HOME%\bin";
# 设置classpath命令
setx -m CLASSPATH "%JAVA_HOME%\lib;%CLASSPATH%";
```

## 安卓证书

**生成**

>  test.keystore 是文件名； testalias 是别名

```powershell
keytool -genkey -alias testalias -keyalg RSA -keysize 2048 -validity 36500 -keystore test.keystore
```

**查看证书信息**

```shell
keytool -list -v -keystore test.keystore
Enter keystore password: //输入密码，回车
```

## 微信网页版支付

不建议使用JSSDK，示例代码：

```js
export default {  
    isWechat:function(){  
        var ua = window.navigator.userAgent.toLowerCase();  
        if(ua.match(/micromessenger/i) == 'micromessenger'){  
            return true;  
        }else{  
            return false;  
        }  
    },  
    jsApiCall(data ,callback_succ_func ,callback_error_func){  
        //使用原生的，避免初始化appid问题  
        WeixinJSBridge.invoke('getBrandWCPayRequest', {  
            appId:data['appId'],  
            timeStamp: data['timeStamp'],  
            nonceStr: data['nonceStr'], // 支付签名随机串，不长于 32 位  
            package: data['package'], // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）  
            signType: data['signType'], // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'  
            paySign: data['paySign'], // 支付签名  
        },  
        function(res) {  
            var msg = res.err_msg ?res.err_msg :res.errMsg;  
            //WeixinJSBridge.log(msg);  
            switch (msg) {  
                case 'get_brand_wcpay_request:ok': //支付成功时  
                    if(callback_succ_func){  
                        callback_succ_func(res);  
                    }  
                    break;  
                default: //支付失败时  
                    WeixinJSBridge.log('支付失败!'+msg+',请返回重试.');  
                    if(callback_error_func){  
                        callback_error_func({msg:msg});  
                    }  
                    break;  
            }  
        })  
    },  
    payment:function(data ,callback_succ_func ,callback_error_func){  
        if(!this.isWechat()){  
            return ;  
        }  
        if (typeof WeixinJSBridge == "undefined") {  
            if (document.addEventListener) {  
                document.addEventListener('WeixinJSBridgeReady', this.jsApiCall, false);  
            } else if (document.attachEvent) {  
                document.attachEvent('WeixinJSBridgeReady', this.jsApiCall);  
                document.attachEvent('onWeixinJSBridgeReady', this.jsApiCall);  
            }  
        } else {  
            this.jsApiCall(data ,callback_succ_func ,callback_error_func);  
        }  
    }  
}
```



