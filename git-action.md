## Git Action

> 自动化打包构建工具

正式开始之前，你需要掌握 GitHub Action 的基础语法：

+ name: 工作流的名称。
+ on: 指定次工作流的触发器。push 表示只要有人将更改推送到仓库就会触发工作流运行。（点击这里了解如何指定特定分支，路径或标签）
+ jobs: 将工作流运行的所有作业组合到一起。
+ build-and-deploy: 定义的作业的名称。
+ runs-on: 将作业配置为在最新版本的 Ubuntu Linux 上运行。这意味着作业将在 GitHub 托管的新虚拟机上执行。有关使用其他运行器的语法示例，请参阅 GitHub 操作的工作流语法。
+ steps: 将作业中运行的所有步骤组合在一起。嵌套在此部分下的每个项都是一个单独的操作或 shell 脚本。
+ uses: 指定需要运行的 action。
+ env: 指定运行 action 时需要用到的环境变量的值。

### 使用方法

```shell
# 在项目的根目录上创建文件夹.github/workflows
mkdir .github/workflows
# 创建文件 main.yml  文件名可以任意
touch main.yml
```

### 部署Git Pages

```yml
name: build and deploy
on:
  push:
    branches:
      - main # main 分支有 push 行为时就触发这个 action
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      # 下载仓库代码
      - uses: actions/checkout@v2
      # 缓存依赖
      - name: Get yarn cache
        id: yarn-cache
        run: echo "::set-output name=dir::$(yarn cache dir)"
      - uses: actions/cache@v1
        with:
          path: ${{ steps.yarn-cache.outputs.dir }}
          key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
          restore-keys: |
            ${{ runner.os }}-yarn-
      # 安装依赖
      - run: yarn
      # 打包构建
      - run: yarn build
        env:
          CI: false
      # 发布到 GitHub Pages
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v2
        env:
          PERSONAL_TOKEN: ${{ secrets.ACCESS_TOKEN }} # 访问秘钥
          PUBLISH_BRANCH: gh-pages # 推送分支
          PUBLISH_DIR: ./dist # 部署目录
```

### 腾讯、阿里等[云服务器](https://so.csdn.net/so/search?q=云服务器&spm=1001.2101.3001.7020)

```yml
name: build and deploy
on:
  push:
    branches:
      - main # main 分支有 push 行为时就触发这个 action
jobs:
  deploy_job:
    runs-on: ubuntu-latest  #运行环境
    name: build
    steps:
      # check out the repository
      - name: Checkout    
        uses: actions/checkout@v2    #这里使用了github官方提供的action,checkout项目到虚拟机上

      - name: Install Dependencies
        run: yarn        # 安装依赖
      - name: Build
        run: yarn build  # 打包构建
        env:
          CI: false

      # 利用action把build好的文件上传到服务器/var/www/react-app路径下,需要确认此目录已在服务端创建
      - name: deploy file to server
        uses: wlixcc/SFTP-Deploy-Action@v1.0 
        with:  
          username: 'root'   #ssh user name
          server: '${{ secrets.SERVER_IP }}' #引用之前创建好的secret
          ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }} #引用之前创建好的secret
          local_path: './build/*'  # 对应我们项目build的文件夹路径
          remote_path: '/var/www/react-app'
```
