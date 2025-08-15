import { execSync } from "child_process";
// 设置命令行编码为UTF-8，以支持显示中文字符
execSync("chcp 65001");
// 获取所有Wi-Fi配置文件的名称
const profilesInfo = execSync("netsh wlan show profiles").toString();
const profileNames = profilesInfo
  .match(/All User Profile\s*:\s*(.*)/g)
  .map((s) => s.split(":")[1].trim());

// 获取每个Wi-Fi的密码并输出
for (const name of profileNames) {
  const passwordInfo = execSync(
    `netsh wlan show profile name="${name}" key=clear`
  );
  const passwordMatch = passwordInfo.toString().match(/Key Content\s*:\s*(.*)/);
  const password = passwordMatch ? passwordMatch[1].trim() : "无密码";
  console.log(`${name}: ${password}`);
}
