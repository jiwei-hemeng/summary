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

###  如何配置 Webpack 可以让图片以base64方式显示 

```shell
npm install  url-loader file-loader -D
```

配置

```js
module.exports = {
  rules: [
    {
      test: /\.(png|jpg|gif|svg)$/, // 匹配图片文件类型
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192, // 小于等于8KB（8192字节）的图片会被转换成Base64编码
            name: '[name].[ext]', // 输出文件名格式
            outputPath: 'images/', // 图片输出目录
            esModule: false, // 如果你遇到图片路径问题，可以尝试设置此选项为false
          },
        },
      ],
    }, 
  ]
}
```

  此外，如果你希望保留图片的原始名称并在文件名前加上哈希值以防止缓存问题，你可以这样调整 `name` 属性 

```txt
name: '[hash:8]-[name].[ext]',
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

#### 使用parallel-webpack插件

```js
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

#### 使用HappyPack插件

```js
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

#### thread-loader

> [文档地址](https://webpack.docschina.org/loaders/thread-loader/)

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

### Webpack 5 内置缓存

```js
module.exports = {
  cache: {
    type: 'filesystem', // 使用文件系统缓存
    buildDependencies: {
      config: [__filename], // 当webpack配置变化时自动失效缓存
    },
    cacheDirectory: path.resolve(__dirname, '.temp_cache'), // 自定义缓存目录
    name: 'my-app-cache', // 多配置项目时区分缓存
    compression: 'gzip', // 压缩缓存内容
  }
};
```

优势

- 默认缓存到 `node_modules/.cache/webpack`
- 比 Webpack 4 的 `cache-loader` 更高效
- 支持配置依赖自动失效

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

###  如何配置 Webpack 可以让图片以base64方式显示 

安装

```shell
npm install --save-dev url-loader file-loader
```

webpack配置

```js
const path = require('path');

module.exports = {
// 其他配置...
module: {
    rules: [
      {
        test: /\.(png|jpg|gif|svg)$/, // 匹配图片文件类型
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // 小于等于8KB（8192字节）的图片会被转换成Base64编码
              name: '[name].[ext]', // 输出文件名格式
              outputPath: 'images/', // 图片输出目录
              esModule: false, // 如果你遇到图片路径问题，可以尝试设置此选项为false
            },
          },
        ],
      },
    ],
  },
}
```

 此外，如果你希望保留图片的原始名称并在文件名前加上哈希值以防止缓存问题，你可以这样调整 `name` 属性 

```js
name: '[hash:8]-[name].[ext]',
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

### 获取环境变量

```js
export const baseUrl = import.meta.env.VITE_APP_BASE_URL;
```

### 配置代理服务器

```js
export default {
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,// 是否改变请求头中的源Origin
        rewirite: (path) => path.replace(/^\/api/, ""),
      },
      "/auth": {
        target: "http://localhost:3000",
        changeOrigin: true,// 是否改变请求头中的源Origin
        rewirite: (path) => path.replace(/^\/auth/, ""),
        ws: true, // 处理websocket请求
      }
    }
  }
}
```

### **rollup-plugin-remove-others-console**

>  在生产环境中可以根据 git 作者信息移除非自己的 console 语句，无任何配置负担，优化开发体验～ 

安装

```shell
npm install rollup-plugin-remove-others-console --save-dev
```

配置

```js
import { defineConfig } from 'vite';
import removeConsole from 'rollup-plugin-remove-others-console';

export default defineConfig({
  plugins: [removeConsole()],
});
```

###  vite-plugin-vconsole 

>  集成 VConsole，帮助开发者在移动设备上进行调试 

```shell
npm install vite-plugin-vconsole --save-dev
```

配置

```js
import { defineConfig } from 'vite';
import vconsole from 'vite-plugin-vconsole';

export default defineConfig({
  plugins: [
    vconsole({
      entry: 'src/main.js',
      enabled: process.env.NODE_ENV === 'development',
    }),
  ],
});
```

###  vite-plugin-find-image-duplicates

>  在构建时查找项目中的重复图像，优化资源管理 

```shell
npm install vite-plugin-find-image-duplicates -D
```

配置

```js
import { defineConfig } from "vite";
import findImageDuplicates from "vite-plugin-find-image-duplicates";

export default defineConfig({
  plugins: [findImageDuplicates({ imagePath: ["src/assets/images"] })],
});
```

###  vite-plugin-qrcode 

>  Vite 开发服务器启动时显示 QR 码，方便移动设备访问本地开发环境 

```shell
npm install --save-dev vite-plugin-qrcode
```

配置

```js
import { defineConfig } from "vite";
import { qrcode } from "vite-plugin-qrcode";

export default defineConfig({
  plugins: [qrcode()],
});
```

 在开发模式下，使用下面的命令启动 

```shell
vite --host
```

