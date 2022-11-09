### 手动将项目部署到`GitHub Pages`

目录下，创建内容如下的 `deploy.sh` (可以适当地取消注释) 并运行它以进行部署：

```shell
#!/usr/bin/env sh
# 当发生错误时中止脚本
set -e
# 安装依赖文件
npm ci
# 构建
npm run build
# cd 到构建输出的目录下
cd dist
# 部署到自定义域域名
echo 'www.example.com' > CNAME
git init
git add -A
git commit -m 'deploy'
# 部署到 https://<USERNAME>.github.io
git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master
# 部署到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
cd -
```

### ftp 使用

**批量上传脚本代码**

```shell
#!/usr/bin/env sh
# 当发生错误时中止脚本
set -e
ftp -v -n <<EOF
open 192.168.0.199 21
user ftpuser ftppwd
binary
hash
cd /ftphome/uploadData
lcd /ftphome/getUploadData
prompt
mput *
bye
#here document
EOF
echo "commit to ftp successfully"
```

**批量下载脚本代码**

```shell
#!/bin/sh
ftp -vn <<EOF
open 192.168.0.199 21
user ftpuser ftppwd
binary
cd /ftphome/downloadData
lcd /local/getDownloadData
prompt
mget *
bye
EOF
echo "download from ftp successfully"
```
**根据PID过滤进程所有信息**
```shell
#! /bin/bash
# Function: 根据用户输入的PID，过滤出该PID所有的信息
read -p "请输入要查询的PID: " P
n=`ps -aux| awk '$2~/^'$P'$/{print $11}'|wc -l`
if [ $n -eq 0 ];then
 echo "该PID不存在！！"
 exit
fi
echo "--------------------------------"
echo "进程PID: $P"
echo "进程命令：`ps -aux| awk '$2~/^'$P'$/{print $11}'`"
echo "进程所属用户: `ps -aux| awk '$2~/^'$P'$/{print $1}'`"
echo "CPU占用率：`ps -aux| awk '$2~/^'$P'$/{print $3}'`%"
echo "内存占用率：`ps -aux| awk '$2~/^'$P'$/{print $4}'`%"
echo "进程开始运行的时刻：`ps -aux| awk '$2~/^'$P'$/{print $9}'`"
echo "进程运行的时间：`ps -aux| awk '$2~/^'$P'$/{print $10}'`"
echo "进程状态：`ps -aux| awk '$2~/^'$P'$/{print $8}'`"
echo "进程虚拟内存：`ps -aux| awk '$2~/^'$P'$/{print $5}'`"
echo "进程共享内存：`ps -aux| awk '$2~/^'$P'$/{print $6}'`"
echo "--------------------------------"
```
**实现磁盘分区的**
```shell
#! /bin/bash
# Function:对硬盘进行分区,得到一个标准的linux文件系统(ext4/xfs)的主分区
cat /proc/partitions > old
read -p "请输入你要分区的硬盘(写绝对路径，如：/dev/sda)：" A
if [ -e $A ];then
  echo "true"
else
  echo "该设备不存在！！"
  exit
fi
read -p "请输入你要创建的磁盘分区类型(这里只能是主分区，默认按回车即可):" B
read -p "请输入分区数字，范围1-4，默认从1开始，默认按回车即可：" C
read -p "请输入扇区起始表号，默认按回车即可：" D
read -p "请输入你要分区的分区大小(格式：如 +5G )：" E
fdisk $A << EOF
n
p
$C
$D
$E
w
EOF
echo "一个标准的linux文件系统的分区已经建立好！！"
partprobe $A
echo "-------------------------------"
cat /proc/partitions
cat /proc/partitions > new
F=`diff new old | grep "<" | awk '{print $5}'`
echo "-------------------------------"
echo $F
echo "你想对新分区设定什么类型的文件系统？有以下选项："
echo "A：ext4文件系统"
echo "B：xfs文件系统"
read -p "请输入你的选择：" G
case $G in
        a|A)
           mkfs.ext4 /dev/$F
           echo "该分区将被挂载在 "/mnt/$F" 下" 
           m=`ls /mnt/|grep $F | wc -l`
           if [ $m -eq 0 ];then
            mkdir /mnt/$F
           fi
           n=`cat /etc/fstab | grep /dev/$F| wc -l`
           if [ $n -eq 0 ];then
              echo "/dev/$F     /mnt/$F     ext4         defaults          0      0" >> /etc/fstab
           else
              sed -i '/^\/dev\/$F/c\/dev/$F     /mnt/$F     ext4         defaults          0      0' /etc/fstab
           fi
           mount -a
           df -Th
;;
        b|B)
           mkfs.xfs -f /dev/$F
           echo "该分区将被挂载在 "/mnt/$F" 下" 
           m=`ls /mnt/|grep $F | wc -l`
           if [ $m -eq 0 ];then
              mkdir /mnt/$F
           fi
           n=`cat /etc/fstab | grep /dev/$F | wc -l`
           if [ $n -eq 0 ];then
              echo "/dev/$F     /mnt/$F      xfs       defaults          0      0" >> /etc/fstab
           else
              sed -i '/^\/dev\/$F/c\/dev/$F     /mnt/$F     xfs         defaults          0      0' /etc/fstab
           fi
           mount -a
           df -Th
;;
        *)
           echo "你的输入有误！！"
esac
```

