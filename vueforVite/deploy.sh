#!/usr/bin/env sh

# 当发生错误时中止脚本
set -e

# 构建
npm run build

# cd 到构建输出的目录下
cd dist

# 部署到自定义域域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# 部署到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 部署到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:jiwei-hemeng/vueforVite.git master:gh-pages
# 通过scp 命令上传到服务器
# scp -r -C -P 8022 /d/web/viteForVue/dist u0_a238@192.168.1.110:~/dist
cd -