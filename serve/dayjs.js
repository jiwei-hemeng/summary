import dayjs from "dayjs";
import zh_CN from "dayjs/locale/zh-cn.js";
import relativeTime from "dayjs/plugin/relativeTime.js";
// 使用插件
dayjs.extend(relativeTime);
// 设置语言
dayjs.locale(zh_CN);
console.log(dayjs().format("YYYY-MM-DD HH:mm:ss"));
console.log(dayjs("1996-04-22").fromNow());
console.log("距离今天:" + dayjs().diff(dayjs("1996-04-22"), "days") + "天");
console.log(dayjs().add(1, "day").format("YYYY-MM-DD"));
