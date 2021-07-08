### **Git常用命令**

```shell
# 初始化仓库
git init
# 工作区提交到暂存区
git add file
# 从暂存区提交到本地仓库
git commit -m '提交说明'
# 删除文件
git rm file
# 查看版本库日志信息
git log
# 查看当前文件修改状态
git status
# 添加远程仓库
git remote add origin git@github.com:jiwei-hemeng/node-96.git
# 将本地仓库推送到远程仓库
git push -u origin master
# 清除远程仓库
git remote rm origin
# 将未提交的文件移入缓存区
git stash save "test1"
# 将最新暂存的文件移入工作区
git stash pop
# 撤回未提交的更改
git checkout src/view/index/index.vue
# 比较文件
git diff src/view/index/index.vue
# 清除本地库的缓存
git rm -r --cached .
```

### **Git 配置命令**

> 相关链接 https://www.liuvv.com/p/a9407b5.html

```shell
# 设置用户名
git config --global user.name 'userName'
# 设置邮箱
git config --global user.email 'example@xx.com'
# 配置SSH
ssh-keygen -t rsa -C "你的邮箱地址"
# 查看你的 public key
cat ~/.ssh/id_rsa.pub
# 测试是否连接到github, 现在带上私钥
ssh -T git@github.com -i github
# 测试是否连接到码云, 现在带上私钥
ssh -T git@gitee.com -i mayun
```

### **关于分支的命令**

```shell
# 查看当前分支
git branch
# 查看所有分支
git branch -a
# 创建分支
git branch name
# 修改当前分支名称
git branch -m oldName newName
# 创建分支并切换分支
git checkout -b name
# 切换分支
git checkout name
# 合并dev到当前分支
git merge dev
# 删除dev分支
git branch -D dev
```

### **工作中想将dev分支合并到master分支，操作如下：**

**首先切换到master分支上**

```shell
git  checkout master
```

**如果是多人开发的话 需要把远程master上的代码pull下来**

```shell
git pull origin master
# 如果是自己一个开发就没有必要了，为了保险起见还是pull
```

**然后我们把dev分支的代码合并到master上**

```shell
git  merge dev
```

**然后查看状态及执行提交命令**

```shell
git status

On branch master
Your branch is ahead of 'origin/master' by 12 commits.
  (use "git push" to publish your local commits)
nothing to commit, working tree clean

//上面的意思就是你有12个commit，需要push到远程master上 
> 最后执行下面提交命令
git push origin master
```