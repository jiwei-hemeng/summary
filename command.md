### **Git 常用命令**

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
# 显示某一特定用户（例如，用户 Agil）在两个指定的日期之间的提交记录
git log --oneline --since="2022-04-22" --until="2022-04-24" --author="Agil"
# 查看已经暂存起来的文件(staged)和上次提交时的快照之间(HEAD)的差异
git diff --staged
# 查询lib/component/BasicInfoCard.jsx 文件1539行最后一次修改信息
git blame -L 1539,1539 lib/component/BasicInfoCard.jsx
git blame -C -w -L 2,2 lib/index.jsx
```

### **Git 配置命令**

```shell
# 设置用户名
git config --global user.name 'userName'
# 设置邮箱
git config --global user.email 'example@xx.com'
# 设置log 的时间格式
git config --global log.date format:'%Y-%m-%d %H:%M:%S'
# 基于RSA算法，生成密钥对命令如下：
ssh-keygen -t rsa -C "你的邮箱地址"
# 基于ED25519算法，生成密钥对命令如下：
ssh-keygen -t ed25519 -C "your_email@example.com"
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
# 通过传递标识符作为最后一个参数来选择你想要弹出或应用的储藏
git stash pop stash@{1}
# 删除某个本地缓存
git stash drop stash@{0}
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

### git 别名

```shell
# 定义别名
git config --global alias.lg "log --pretty='%C(red)%h%Creset%C(yellow)%d%Creset %s %C(cyan)(%ar)%Creset'"
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
# 使用别名
git lg
# 提交到本地仓库
git config --global alias.cm "commit -m"
# 使用别名
git cm "xxxx"
```

### git 版本升级

```shell
# 下载安装包
winget install --id Git.Git -e --source winget
# 通过 git 命令升级
git update-git-for-windows
```

### git hook 使用

**创建文件**

```shell
cd .git/hooks && touch pre-commit
```

**编辑文件内容**

```js
#!/usr/bin/env node
const child_process = require("child_process");
const fs = require("fs");
const command = "git diff --cached --name-only --diff-filter=ACMR -- .";
const trimReg = /(\ +)|([ ])|([\r\n]|(["]))/g;
let commitFile = child_process.execSync(command).toString();
commitFile = commitFile.split("\n");
const fileList = [];
for (let i = 0; i < commitFile.length; i++) {
  const name = commitFile[i];
  if (!name) break;
  fileList.push(decodeURIComponent(name.replace(trimReg, "")));
}
const editFiles = [];
fileList.forEach((file) => {
  const txt = fs.readFileSync(file, "utf8");
  if (txt.includes("debugger")) {
    editFiles.push(file);
    fs.writeFileSync(file, txt.replace(/(debugger);?(\s*\n)*/g, ""));
    const commandAdd = "git add " + file;
    child_process.execSync(commandAdd).toString();
  }
});
process.exit(0);
```

**赋予可执行权限**

```shell
chmod +x pre-commit
```

此时再次执行`git commit` 就能运行 `git hooks` 清除 提交文件的 `debugger` 了

**其他常见的 hooks**

commit-msg

```js
#!/usr/bin/env node
const childProcess = require("child_process");
const fs = require("fs");

const email = childProcess.execSync("git config user.email").toString().trim();
const msg = fs.readFileSync(process.argv[2], "utf-8").trim(); // 索引 2 对应的 commit 消息文件
const commitRE =
  /^(feat|fix|docs|style|refactor|perf|test|workflow|build|ci|chore|release|workflow)(\(.+\))?: .{1,100}/;

if (!commitRE.test(msg)) {
  console.log();
  console.error("不合法的 commit 消息格式，请使用正确的提交格式：");
  console.error("feat: add 'comments' option");
  console.error("fix: handle events on blur (close #28)");
  console.error(
    "详情请查看 git commit 提交规范：https://github.com/woai3c/Front-end-articles/blob/master/git%20commit%20style.md。"
  );
  process.exit(1);
}

if (!/@qq\.com$/.test(email)) {
  console.error("此用户没有权限，具有权限的用户为： xxx@qq.com");
  process.exit(1);
}
```

pre-push 提交之前修改版本号

```js
#!/usr/bin/env node
const child_process = require("child_process");
const fs = require("fs");
const txt = fs.readFileSync("package.json", "utf8");
const parseTxt = JSON.parse(txt);
let min = Number(parseTxt.version.split(".")[1]);
let patch = Number(parseTxt.version.split(".")[2]);
patch++;
let command = "npm version patch";
if (patch == 100) {
  min += 1;
  command = "npm version minor";
}

if (min == 100) {
  command = "npm version major";
}
child_process.execSync(command).toString();
process.exit(0);
```

### cmd 常用命令

```shell
# 列出所有连接过的WiFi的配置文件
netsh wlan show profiles
# 查询当前wifi信息
netsh wlan show network mode=bssid 
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
# PowerShell 终端中创建软连接
New-Item -Path D:\App\client -ItemType SymbolicLink -Value D:\App\runarch\client
# 清除日志垃圾
%temp%
# 删除恶意软件
MRT
# 查看系统配置
dxdiag
# 查看系统服务
services.msc
# 查找被占用的端口号的pid号
netstat -ano | findstr 8001
# 杀死进程
taskkill /f /pid 9020
# 查看全局安装的npm包
npm list -g
# 刷新网络
ipconfig /release
# 重新获取DHCP给的地址
ipconfig /renew
# 刷新dns记录
ipconfig /flushdns
```

### cmd 安装 jdk 并配置环境变量

```shell
# 引号中换成自己的路径
setx JAVA_HOME "C:\Program Files\Java\jdk1.8.0"
setx Path "%PATH%;%JAVA_HOME%\bin";
# 设置classpath命令
setx -m CLASSPATH "%JAVA_HOME%\lib;%CLASSPATH%";
```

### PowerShell 中使用函数

```powershell
# 定义函数
function make-link ($target, $link) {
   New-Item -Path $link -ItemType SymbolicLink -Value $target
}
# 使用函数
make-link D:\App\runarch\client D:\App\client
```

### npm 如何优雅的升级版本

#### 升级主版本号 Major

```shell
npm version major
```

当前版本号是 1.0.0，执行该命令后版本号变成 2.0.0。

#### 升级次版本号 Minor

```shell
npm version minor
```

当前版本号是 1.0.0，执行该命令后版本号变成 1.1.0。

#### 升级修订号 Patch

```shell
npm version patch
```

当前版本号是 1.0.0，执行该命令后版本号变成 1.0.1。

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

使用 ssh config 配置文件来管理 ssh 连接

```
Host ll252
  HostName 10.10.10.252
  User hais_dev00
  Port 22

Host jw
  HostName 192.168.1.111
  User u0_a238
  Port 8022
  IdentityFile ~/.ssh/id_rsa
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
# 添加可执行的权限
chmod +x [文件名]
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
df -h --total
# lsof 命令用于查看端口占用情况
lsof -i:3000
# 将css.md 文件复制到 docs目录下
cp css.md docs
# 将assets 文件复制到 docs 目录下
cp -r assets docs
# 查看文件的最后400行
tail -n 400 /d/App/1.sh
# 实时查看文件的最后400行
tail -f /d/App/1.sh
```

### find 命令

```shell
# 通过文件名查找文件所在路径
find /d/summary -name "exp.html"
# 模糊匹配查找
find /d/summary -name "*.log"
# 查找指定目录/d/summary下大小大于1M的文件
find /d/summary -size +1M
# 在当前目录下查找最近7天内被修改过的文件
find . -mtime -7
# 当前目录下查找大小大于1MB并且小于10MB的文件
find . -size +1M -size -10M
# 当前目录下查找所有的包含csdn.net字样的文件，并输出文件名
find . | xargs grep -ri "csdn.net" -l
# 在当前目录下递归查找特定字符串并打印行
grep -r 'zh-CN' .
```

### git reset 三棵树

移动 HEAD 指向的分支 （若指定了 --soft，则到此停止）；

```shell
# 它本质上是撤销了上一次 git commit 命令
git reset --soft HEAD~
```

重置 index 以便和 HEAD 相匹配 （若未指定 --hard，则到此停止）；**默认的可以不用带该参数**

```shell
# 它依然会撤销一上次提交，但还会取消所有暂存。 于是，我们回滚到了所有 git add 和 git commit 的命令执行之前。
git reset --mixed HEAD~
# 相当于执行
git reset HEAD~
```

使工作目录看起来像索引

```shell
# 撤销了最后的提交（git commit ）、git add 和工作目录中的所有工作。
git reset --hard HEAD~
```

HEAD 说明：

- HEAD 表示当前版本
- HEAD^ 上一个版本
- HEAD^^ 上上一个版本

可以使用 ～数字表示

- HEAD~0 表示当前版本
- HEAD~1 上一个版本
- HEAD~2 上上一个版本

### nrm

> 作用：1. 更换国内镜像包源，解决国内 npm 国外包慢的问题 2. 更换某些内网独立的包源，实现安装内网独立的 npm 包

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

### yarn

```shell
# 查看yarn全局缓存目录
yarn cache dir
# 清除缓存
yarn cache clean
# 设置缓冲目录
yarn config set cache-folder
# 切换淘宝镜像源
yarn config set registry https://registry.npm.taobao.org
```

### Termux

[Github 地址](https://github.com/termux/termux-app/releases)

```shell
# 更换源
termux-change-repo
# ssh 登录
ssh u0_a238@192.168.1.113 -p 8022
# 安装 openssh
pkg install openssh
# 安装 openssl
pkg install openssl
# 更改密码
passwd
# 开启sshd服务
sshd
# 生成主机密钥
ssh-keygen -A
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

按 f12 , 再按 ctrl+shift+P ,输入 Capture full size screenshot

### Windows 下实现端口映射

**查询某一个 IP 的所有端口映射情况**

> 语法： netsh interface portproxy show v4tov4 | find "[IP]"

```shell
netsh interface portproxy show v4tov4 | find "192.168.1.1"
```

**增加一个端口映射**

> 语法： netsh interface portproxy add v4tov4 listenaddress=[外网 IP] listenport=[外网端口] connectaddress=[内网 IP] connectport=[内网端口]

```shell
netsh interface portproxy add v4tov4 listenaddress=2.2.2.2 listenport=80 connectaddress=192.168.1.110 connectport=8000
```

**删除一个端口映射**

> 语法： netsh interface portproxy delete v4tov4 listenaddress=[外网 IP] listenport=[外网端口]

```shell
netsh interface portproxy delete v4tov4 listenaddress=2.2.2.2 listenport=80
```

### 解决 github 网速慢的方案

修改 host 文件

```txt
https://raw.hellogithub.com/hosts
```
