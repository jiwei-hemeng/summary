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

### 比较全面的actions

```yml
name: Deploy GitHub Pages
# 触发条件：在 push 到 main 分支后触发
on:
  push:
    branches:
      - main
# 任务
jobs:
  build-and-deploy:
    # 服务器环境：最新版 Ubuntu
    runs-on: ubuntu-latest
    steps:
      # 拉取代码
      - name: Checkout
        uses: actions/checkout@v2
        with:
          persist-credentials: false

      # 1、生成静态文件
      - name: Build
        run: npm install && npm run build

      # 2、部署到 GitHub Pages
      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@releases/v3
        with:
          ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
          BRANCH: gh-pages # 推送分支
          FOLDER: dist # 部署目录

      # 3、同步到 gitee 的仓库
      - name: Sync to Gitee
        uses: wearerequired/git-mirror-action@master
        env:
          # 注意在 Settings->Secrets 配置 GITEE_RSA_PRIVATE_KEY
          SSH_PRIVATE_KEY: ${{ secrets.GITEE_RSA_PRIVATE_KEY }}
        with:
          # 注意替换为你的 GitHub 源仓库地址
          source-repo: git@github.com:somenzz/somenzz.github.io.git
          # 注意替换为你的 Gitee 目标仓库地址
          destination-repo: git@gitee.com:somenzz/somenzz.git

      # 4、部署到 Gitee Pages
      - name: Build Gitee Pages
        uses: yanglbme/gitee-pages-action@main
        with:
          # 注意替换为你的 Gitee 用户名
          gitee-username: somenzz
          # 注意在 Settings->Secrets 配置 GITEE_PASSWORD
          gitee-password: ${{ secrets.GITEE_PASSWORD }}
          # 注意替换为你的 Gitee 仓库，仓库名严格区分大小写，请准确填写，否则会出错
          gitee-repo: somenzz/somenzz
          # 要部署的分支，默认是 master，若是其他分支，则需要指定（指定的分支必须存在）
          branch: master

      # 5、部署到 somenzz.cn 服务器
      - name: rsync deployments
        uses: burnett01/rsync-deployments@4.1
        with:
          switches: -avzh # 这里是 rsync 的参数 switches: -avzh --delete --exclude="" --include="" --filter=""
          path: dist/
          remote_path: /home/ubuntu/public/ # 服务器的文件存放绝对路径
          remote_host: somenzz.cn # 服务器域名或者IP地址
          remote_port: 22 # ssh远程端口(如果没修改过ssh远程端口，默认是22)
          remote_user: ubuntu # 使用ssh登录的用户
          remote_key: ${{ secrets.MY_UBUNTU_RSA_PRIVATE_KEY }} # 能够远程到服务器的电脑私钥
```

### SCP发布到自有服务器上

```yml
name: Deploy CI

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Use Node.js 16
        uses: actions/setup-node@v3
        with:
          node-version: '16.x'

      - name: Build Project
        run: |
          yarn install
          yarn run build

      - name: SSH Deploy
        uses: easingthemes/ssh-deploy@v2.2.11
        env:
          SSH_PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}  # 服务器SSH登录的私钥
          ARGS: '-avzr --delete'
          SOURCE: 'build'
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }} # 服务器的ip地址
          REMOTE_USER: 'root'
          TARGET: '/www/wwwroot/blog'  # 服务器 部署目录
```

### 同步到 gitee 的仓库

```yml
name: Deploy GitHub Pages
# 触发条件：在 push 到 main 分支后触发
on:
  push:
    branches:
      - main
# 任务
jobs:
  build-and-deploy:
    # 服务器环境：最新版 Ubuntu
    runs-on: ubuntu-latest
    steps:
      # 3、同步到 gitee 的仓库
      - name: Sync to Gitee
        uses: wearerequired/git-mirror-action@master
        env:
          SSH_PRIVATE_KEY: ${{ secrets.GITEE_RSA_PRIVATE_KEY }} # 对应gitee 上设置的公钥的私钥
        with:
          # 注意替换为你的 GitHub 源仓库地址
          source-repo: git@github.com:jiwei-hemeng/summary.git
          # 注意替换为你的 Gitee 目标仓库地址
          destination-repo: git@gitee.com:jiwei-hemeng/summary.git
```

