## webpack 学习

### 基本使用

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

### webpack的配置文件

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

### 打包css

安装相关插件

```shell
npm i style-loader css-loader -D
```

修改配置文件

```js
// webpack.config.js
module.exports = {
  rules: [
    {
      test: /\.css$/,
      use: [
        "style-loader",
    	"css-loader"
  	  ]
    }
    
  ]
}
```

### 打包图片

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

### 打包less

安装相关插件

```shell
npm i less-loader less -D
```

修改配置文件

```js
// webpack.config.js
module.exports = {
  rules: [
    {
      test: /\.less$/,
      use: [
        {
          loader: "style-loader",
        },
        {
          loader: "css-loader",
        },
        {
          loader: "less-loader",
          options: {
            lessOptions: {
              strictMath: true,
            },
          },
        },
      ],
    },
  ],
};
```

### hmtlWebpackPlugin

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

### 重新打包时清除dist目录

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

### 显示打包进度

（1）安装

```shell
npm i progress-bar-webpack-plugin -D
```

（2）配置

```js
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
module.exports = {
  plugins: [
    new ProgressBarPlugin({
      complete: '█',
    }),
  ],
}
```

（3）运行

```shell
npm run build
```

### babel

> [官网地址](https://webpack.js.org/loaders/babel-loader/#install)
>
> 使用babel把es6转为es5

安装依赖

```shell
npm install -D babel-loader @babel/core @babel/preset-env
```

修改配置文件

```js
module.exports = {
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
  ],
};
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

### 开启源码map

```js
// webpack.config.js
const path = require("path");
module.exports = {
  mode: "development",
  devtool: "inline-source-map"
}
```

### 启动开发服务

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

### 可以省略的扩展名

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

### 使用ESLint

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

### 压缩 js 文件

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

### webpack配置---实现某文件夹下的文件不打包

安装插件

```shell
cnpm install --save-dev copy-webpack-plugin
```

创建static目录并修改webpack配置文件

```js
// 在头部引入插件
const CopyWebpackPlugin = require('copy-webpack-plugin');
// 在plugins配置数组中添加一项
plugins: [
  new CopyWebpackPlugin([
    {
      from: path.resolve(__dirname, '../static'),
      to: 'static',
      ignore: ['.*']
    }
  ])
]
```

### 使用多个进程线程可以帮助加快构建速度

```js
// 使用parallel-webpack插件
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

module.exports = {
  plugins: [
    new ParallelUglifyPlugin({
      // 设置并行数，根据电脑核数设置
      workerCount: os.cpus().length,
      // 其他配置项
    }),
  ],
};
```

```js
// 使用HappyPack插件
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'happypack/loader?id=js',
      },
    ],
  },
  plugins: [
    new HappyPack({
      id: 'js',
      threadPool: happyThreadPool,
      loaders: ['babel-loader'],
    }),
  ],
};
```

### 不打包第三方包

```js
// webpack.config.js
module.exports = {
  entry: './main.jsx',
  output: {
    filename: 'bundle.js'
  },
  externals: {
    "echarts": "echarts",
  }
}

```

### webpack开启cpu多线程提升打包效率

> 如果小项目，文件不多，无需开启多进程打包，反而会变慢，因为开启进程是需要花费时间的
>
> [文档地址](https://webpack.docschina.org/loaders/thread-loader/)

安装 thread-loader

```shell
npm i thread-loader -D
```

配置

```js
const Os = require('os');
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "thread-loader",
            options: { 
              workers: Os.cpus().length
            }
          },
          {
            loader: "babel-loader",
            options: { 
              cacheDirectory: true,
            }
          },
        ]
      },
    ],
  },
};
```

### 配置项目中某个目录不进行打包

安装

```shell
npm i  webpack copy-webpack-plugin --save-dev
```

配置

```js
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: 'static',
        ignore: ['.*']
      }
    ])
  ]  
}
```

## vite

### 使用vite 构建 react 项目

```shell
npm create vite@latest
```

### vite raect 项目的配置

```shell
# 打包体积可视化面板
yarn add rollup-plugin-visualizer -D
# 配置cdn方法
yarn add rollup-plugin-external-globals -D
```

配置(vite.config.js)

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import externalGlobals from 'rollup-plugin-external-globals'
export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true }),
  ],
  build: {
    rollupOptions: {
      external: ["react", "react-dom"],
      plugins: [
        externalGlobals({
          react: "React",
          "react-dom": "ReactDOM"
        })
      ]
    }
  },
});
```

vite 配置路径别名

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  resolve: {
    alias: {
      "@": "/src/", //格式一定要写对喽不然没有代码提示或者报错
    },
  },
  plugins: [
    react(),
  ],
});
```

### 配置public 目录

```js
import react from "@vitejs/plugin-react";
export default ({ mode }) => {
  return {
    resolve: {
      alias: {
        "@": "/src/", //格式一定要写对喽不然没有代码提示或者报错
      },
    },
    base: mode === "production" ? "/vite-react-app" : "/",
    plugins: [react()],
};
```

### vite 批量获取模块

```js
async function getModules() {
  const modules = import.meta.glob("../pages/*.jsx");
  for (const path in modules) {
    const module = await modules[path]();
    console.log("module", module);
  }
}
getModules();
```

