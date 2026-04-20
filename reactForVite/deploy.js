import { NodeSSH } from "node-ssh";
const ssh = new NodeSSH();
const localDir = "./dist";
const remoteDir = "/root/yilingju-web/dist";
ssh
  .connect({
    host: "124.70.59.36",
    port: 22,
    username: "root",
    password: "XXXXXX",
  })
  .then(() => {
    ssh
      .execCommand(`rm -rf  ${remoteDir}/*`)
      .then(() => {
        console.log("正在部署中...");
        ssh
          .putDirectory(localDir, remoteDir, {
            recursive: true,
            concurrency: 10,
          })
          .then((res) => {
            res
              ? console.log(
                  "\x1b[32m部署成功^_^  测试环境地址 http://124.70.59.36:3002 \x1b[0m"
                )
              : console.log("\x1b[31m部署失败\x1b[0m");
          })
          .catch(() => {
            console.log("\x1b[31m部署失败\x1b[0m");
          })
          .finally(() => {
            ssh.dispose();
          });
      })
      .catch(() => {
        console.log("\x1b[31m删除远程文件失败\x1b[0m");
        ssh.dispose();
      });
  })
  .catch(() => {
    console.log("\x1b[31m服务器链接异常\x1b[0m");
  });
