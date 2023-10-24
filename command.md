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
# 将本地仓库推送到远程仓库
git push -u origin master
# 比较文件
git diff src/view/index/index.vue
# 清除本地库的缓存
git rm -r --cached .
# 撤销已被放入暂存区的文件
git reset HEAD -- .
# 添加远程仓库
git remote add origin git@github.com:jiwei-hemeng/node-96.git
# 更改远程仓库的 URL
git remote set-url origin git@github.com:jiwei-hemeng/node-96.git
# 清除远程仓库
git remote rm origin
# 查找当前存在冲突的文件
git diff --check
# 修改提交信息(commit message)
git commit --amend --only -m 'xxxxxxx'
# 修改上次提交的用户名和邮箱
git commit --amend --author="name <email>" --no-edit
# 强制推送到main分支
git push -f origin mian
# 查看上次提交的内容
git show
```

### **Git 配置命令**

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
#查看git配置
git config --list
git config -l
#查看系统配置
git config --system --list
#查看当前用户（global）全局配置
git config --list --global
#查看当前仓库配置信息
git config --local  --list
```

### git 缓存命令

```shell
# 保存当前未commit的代码并添加备注
git stash save "备注的内容"
# 列出stash的所有记录
git stash list
# 删除stash的所有记录
git stash clear
# 应用最近一次的stash
git stash apply
# 应用最近一次的stash，随后删除该记录
git stash pop
# 删除最近的一次stash
git stash drop
```

### 关于分支的命令

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
# 查看本地分支及追踪的分支
git branch -vv
# 设置追踪, 需要已有该远程分支
git branch --set-upstream-to=origin/dev dev
# 如果是第一次提交, 新建追踪可以使用
git push -u origin dev
# 删除追踪
git branch -r -d origin/dev
# 删除git仓库上的远程dev分支
git push origin --delete dev
```

### git checkout 与 git switch, git resotre 的关系

**git switch**

```shell
# 创建并且切换dev分支
git switch -c dev
# 切换dev分支
git switch dev
# 切换到某一个commit但是不创建新的分支
git switch --detach a434bda
```

**git restore**

```shell
# 放弃工作区的更改，相当于git checkout . 命令
git restore .
git restore --worktree .
# 从暂存区退回到工作区
git restore --staged .
# 用 HEAD 的文件同时重置缓存去和工作区的所有文件
git restore --staged --worktree .
# 用 dev2 分支的 READEME.md 替换当前工作区
git restore --source dev2 READEME.md 
```

### git 版本升级

```shell
# 下载安装包
winget install --id Git.Git -e --source winget
# 通过 git 命令升级
git update-git-for-windows
```

### 在vscode中配置GIT终端

![1953033-20210812175755860-640591619](./assets/images/1953033-20210812175755860-640591619.png)

在settings.json

```json
{
  "terminal.integrates.profiles.windows": {
    "Git-Bash": {
      "path": "D:\\Program Files\\Git\\bin\\bash.exe",
      "args": []
    }
  }
}
```

### vscode如何将生成的html模板中的语言改为中文？

在settings.json

```json
"emmet.variables": {"lang": "zh-CN"}
```

### cmd 常用命令

```shell
# 刷新本地dns
ipconfig /flushdns
# 列出所有连接过的WiFi的配置文件  
netsh wlan show profiles
# 查看到某个具体WiFi的配置详情，包括密码：
netsh wlan show profiles name="XXXXXX" key=clear
# 磁盘检查
chkdsk
# 打开磁盘清理工具
cleanmgr
# 向对方电脑发送一条文本提示
msg /server:192.168.1.109 * "需要发送的消息"
# 磁盘修复
chkdsk d: /f
# D盘下生成一个指向E盘文件夹system\systemconfig的软连接link文件夹
mklink /j D:\systemconfig D:\system\systemconfig
# 清除日志垃圾
%temp%
# 删除恶意软件
MRT
# 查看系统配置
dxdiag
# 查看系统服务
services.msc
```

### cmd 安装jdk并配置环境变量

```shell
# 引号中换成自己的路径
setx JAVA_HOME "C:\Program Files\Java\jdk1.8.0"
setx Path "%PATH%;%JAVA_HOME%\bin";
# 设置classpath命令
setx -m CLASSPATH "%JAVA_HOME%\lib;%CLASSPATH%"; 
```

### npm 如何优雅的升级版本

#### 升级主版本号Major

```shell
npm version major
```

当前版本号是 1.0.0，执行该命令后版本号变成2.0.0。

#### 升级次版本号Minor

```shell
npm version minor
```

当前版本号是 1.0.0，执行该命令后版本号变成1.1.0。

#### 升级修订号Patch

```shell
npm version patch
```

当前版本号是 1.0.0，执行该命令后版本号变成1.0.1。

### ssh 远程操作

```shell
# 远程登陆
ssh root@192.168.5.128 -p 22
# 把本机生成的公钥添加到远程服务器
ssh-copy-id -i ~/.ssh/id_dsa.pub root@192.168.5.128
# 也可以使用第二种，方式添加
cat ~/.ssh/id_rsa.pub | ssh root@192.168.5.128 "mkdir ~/.ssh; cat >> ~/.ssh/authorized_keys"
# 将本地的文件或者文件夹上传到服务器 -r 选项表示上传文件夹
scp -r -P 22 D:\etc\liLianInfo\unpackage\dist\dev\mp-weixin root@192.168.5.128:/home/root/path
# 下载整个目录
scp -r -P 22 root@192.168.5.128:/home/root/path D:/path
# 压缩传输
scp -r -C -P 22 root@192.168.5.128:/home/root/path D:/path
```

### ubantu 的相关命令

```shell
# 解决liunx ifconfig 命令找不到
sudo apt-get install net-tools
# 设置root用户的密码
sudo passwd root
# 切换root用户
su root
# 查找ifconfig 脚本的位置
find / -name ifconfig -print
# linux 安装Openssh
sudo apt-get install openssh-server
# 安装nodejs
sudo apt-get install -y nodejs
```

### linux 命令

> chmod 文件读写权限：
>
> 三个数代表： - 所有者 - 用户组 - 其它用户 
>
> 读写权限： wrx 分别对应读、写、执行，用数字表示 4、2、1

```shell
# 生成公钥
ssh-keygen -t rsa
# 配置ssh文件的权限
chmod 600 authorized_keys
# 删除非空目录
rm -rf [目录名]
# 将2.txt 文件的内容追加到1.txt 文件内容的后面
cat 2.txt >> 1.txt
# 用2.txt 文件的内容替换1.txt 文件内容
cat 2.txt > 1.txt
# 压缩文件
tar -czvf test.tar.gz a.c
# 解压文件
tar -xzvf test.tar.gz a.c
# 建立软连接
ln -s /usr/local/node/node-v18.12.0-linux-x64/bin/node /usr/local/bin/node
ln -s /usr/local/node/node-v18.12.0-linux-x64/bin/npm /usr/local/bin/npm
# 检查文件系统的磁盘空间占用情况
df -h
# lsof 命令用于查看端口占用情况
lsof -i:3000
```

### reset 命令会以特定的顺序重写这三棵树，在你指定以下选项时停止：

#### git reset 三棵树

移动 HEAD 指向的分支 （若指定了 --soft，则到此停止）；
```shell
# 它本质上是撤销了上一次 git commit 命令
git reset --soft HEAD~
```

重置 index 以便和 HEAD 相匹配 （若未指定 --hard，则到此停止）；**默认的可以不用带该参数**
```shell
# 它依然会撤销一上次提交，但还会取消所有暂存。 于是，我们回滚到了所有 git add 和 git commit 的命令执行之前。
git reset --mixed HEAD~
```

使工作目录看起来像索引
```shell
# 撤销了最后的提交（git commit ）、git add 和工作目录中的所有工作。
git reset --hard HEAD~
```

#### HEAD 说明：

- HEAD 表示当前版本
- HEAD^ 上一个版本
- HEAD^^ 上上一个版本

可以使用 ～数字表示

- HEAD~0 表示当前版本
- HEAD~1 上一个版本
- HEAD~2 上上一个版本

###  nrm

> 作用：1. 更换国内镜像包源，解决国内npm国外包慢的问题  2. 更换某些内网独立的包源，实现安装内网独立的npm包

**使用方法**

```shell
# 全局安装
npm install -g nrm
# 查看npm 的包源
nrm ls
# 切换npm包源
nrm use taobao
# 增加npm包源
nrm add npmName http://registry.com
# 删除包源
nrm del npmName
```

### Termux

[Github地址](https://github.com/termux/termux-app/releases)

```shell
# 更换源
termux-change-repo
# ssh 登录
ssh u0_a238@192.168.1.113 -p 8022
# 安装openssh
pkg install openssh
# 更改密码
password
# 开启sshd服务
sshd
# 查看IP
ifconfig
# 查看用户名
whoami
# 需要允许手机的读写存储权限
termux-setup-storage
# 查看进程
ps
# 查看实时进程
top
# 杀死进程
kill [pid]
```

### 谷歌浏览器长截屏

按 f12 ,  再按 ctrl+shift+P ,输入 Capture full size screenshot

### Windows 下实现端口映射

 **查询某一个 IP 的所有端口映射情况** 

> 语法： netsh interface portproxy show v4tov4 | find "[IP]"

```shell
netsh interface portproxy show v4tov4 | find "192.168.1.1"
```

 **增加一个端口映射** 

> 语法： netsh interface portproxy add v4tov4 listenaddress=[外网IP] listenport=[外网端口] connectaddress=[内网IP] connectport=[内网端口]

```shell
netsh interface portproxy add v4tov4 listenaddress=2.2.2.2 listenport=80 connectaddress=192.168.1.110 connectport=8080
```

 **删除一个端口映射** 

> 语法：  netsh interface portproxy delete v4tov4 listenaddress=[外网IP] listenport=[外网端口] 

```shell
netsh interface portproxy delete v4tov4 listenaddress=2.2.2.2 listenport=80
```

