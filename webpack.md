## webpack 学习

**加入npm包管理器**

```shell
npm init -y
```

**安装webpack**

```shell
npm i webpack webpack-cli -D
```

**执行打包**

```shell
./node_modules/.bin/webpack
```

> webpack 默认会找到`src/index`作为打包入口，然后从入口分析所有依赖；webpack的默认出口是dist目录下的main.js。当然这些都可以自行配置。

也可以通过配置`package.json`

```json
{
  "name": "webpack-demo",
  "scripts": {
    "build": "webpack",
    "start": "webpack --watch"
  }
}
```

然后执行`npm run build`进行打包操作

```shell
npm run build
```

**webpack的配置文件**

> [参考文档](https://webpack.js.org/configuration)

在项目的根目录上创建文件`webpack.config.js`

```js
const path = require("path");
module.exports = {
  // 打包的入口
  entry: "./src/index.js",
  // 打包的出口
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  },
  // 打包模式 可选production development
  mode: "production",
}
```

**打包css**

安装相关插件

```shell
npm i style-loader css-loader -D
```

修改配置文件

```js
// webpack.config.js
module.exports = {
  rules: [
    test: /\.css$/,
    use: [
    	"style-loader",
    	"css-loader"
  	]
  ]
}
```

**打包图片**

安装相关插件

```shell
npm i file-loader -D
```

修改配置文件

```js
// webpack.config.js
module.exports = {
  rules: [
    // 打包图片
    {
      test: /\.(png|jpg|svg|gif)$/,
      use: [
        "file-loader",
      ]
    },
    // 打包字体文件
    {
      test: /\.(woff|wofff2|eot|ttf|otf)$/,
      use: [
        "file-loader",
      ]
    }
  ]
}
```

**打包less**

安装相关插件

```shell
npm i less-loader less -D
```

修改配置文件

```js
// webpack.config.js
module.exports = {
  rules: [
    test: /\.less$/,
    use: [
    	{
    		"loader": "style-loader"
    	},
  		{
    		loader: "css-loader"
    	},
  		{
    		loader: "less-loader",
  			options: {
          lessOptions: {
            strictMath: true
          }
        }
    	},
  	]
  ]
}
```

**hmtlWebpackPlugin**

安装依赖

```shell
yarn add --dev html-webpack-plugin
```

修改配置文件

```js
// webpack.config.js
const htmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  // 插件
  plugins: [
  	new htmlWebpackPlugin({
  		// title: "Output Management"
  		template: "./index.html"
		})
  ]
}
```

**清除dist**

安装依赖

```shell
npm i clean-webpack-plugin -D
```

修改配置文件

```js
// webpack.config.js
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
  // 插件
  plugins: [
  	new CleanWebpackPlugin(),
  ]
}
```

**babel**

> [官网地址](https://webpack.js.org/loaders/babel-loader/#install)
>
> 使用babel把es6转为es5

安装依赖

```shell
npm install -D babel-loader @babel/core @babel/preset-env
```

修改配置文件

```js
// webpack.config.js
module.exports = {
  // 插件
  rules: [
    {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
            loader: "babel-loader",
            options: {
                presets: ["@babel/preset-env"],
            },
        },
    },
  ]
}
```

babel 默认只能转换基本的语法部分，它不会处理es6新增的API。如果需要兼容可要安装插件babel/polyfill

安装

```shell
npm i @babel/polyfill -S
```

修改配置文件

```js
// webpack.config.js
const path = require("path");
module.exports = {
  // 打包的入口
  entry: ["@babel/polyfill", "./src/index.js"],
  // 打包的出口
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  },
  // 打包模式 可选production development
  mode: "production",
}
```

**开启源码map**

```js
// webpack.config.js
const path = require("path");
module.exports = {
  mode: "development",
  devtool: "inline-source-map"
}
```

**启动开发服务**

安装依赖

```shell
npm i webpack-dev-server -D
```

修改配置文件

```js
// webpack.config.js
module.exports = {
  devServer: {
    contentBase: "./dist",
    open: false, // 自动打开浏览器
    port: 3000, // 打开的端口号，默认8080
    hot: true, // 热更新
  }
}
```

修改pageage.json文件

```json
{
  "name": "webpack-demo",
  "scripts": {
    "build": "webpack",
    "start": "webpack --watch",
    "serve": "webpack-dev-server"
  }
}
```

**可以省略的扩展名**

> webpack 默认只能省略`.js`、`.json`的扩展名

```js
// webpack.config.js
const path = require("path");
module.exports = {
  resolve: {
    extensions: [".js", ".json", ".wasm", ".mjs"],
    // 路径别名
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  }
}
```

**使用ESLint**

安装

```shell
npm i eslint eslint-loader -D
```

修改配置文件

```js
// webpack.config.js
module.exports = {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: ["babel-loader", "eslint-loader"]
    },
  ]
}
```

推荐配置方式

```js
// webpack.config.js
module.exports = {
  rules: [
    {
      enforce: "pre",
      test: /\.js$/,
      exclude: /node_modules/,
      use: "eslint-loader"
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: "babel-loader"
    },
  ]
}
```

 初始化代码格式规范

```shell
# ./node_modules/.bin/eslint.cmd --init
npx eslint --init
```

**压缩 js 文件**

> 使用 uglifyjs-webpack-plugin 将js压缩，减少打包后的 vendor.js , bundle.js 等js的文件大小

安装

```shell
npm install -D uglifyjs-webpack-plugin
```

使用

```js
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// webpack.config.js
module.exports = {
    plugins: [
        new UglifyJsPlugin(), // 压缩 JavaScript
    ],
}
```

