## moment 插件

> 一个可以用来处理时间的优秀js插件

### 安装

```shell
npm i moment
```
### 常用方法

**格式化时间**

```js
const timeStr = moment().format("YYYY-MM-DD HH:mm:ss"); // 2022-02-22 19:58:37
```

**时间差**

```js
import moment form "moment";
moment.locale("zh-cn");
const time = moment("2022-02-22 19:58:37").startOf("hour").formNow(); // 1小时前
```

**本月**

```js
const begin = moment().startOf('month');
const end = moment().endOf('month');
```

**上月**

```js
const begin = moment().subtract(1, 'month').startOf('month');
const end = moment().subtract(1, 'month').endOf('month');
```
**前三天**

```js
const begin = moment().subtract(2, 'day').startOf('day');
const end = moment().endOf('day');
```

**本周**

```js
const begin = moment().startOf('week');
const end = moment().endOf('week');
```

**明年**

```js
const begin = moment().add(1, "years").startOf("year").format("YYYY-MM-DD HH:mm:ss");
const end = moment().add(1, "years").endOf("year").format("YYYY-MM-DD HH:mm:ss");
```

**上一周**

```js
const begin = moment().subtract(1, 'week').startOf('week');
const end = moment().subtract(1, 'week').endOf('week');
```

**本季度**

```js
const  start = moment().startOf('quarter').format('YYYY-MM-DD')   // 开始
const end = moment().endOf('quarter').format('YYYY-MM-DD')   // 结束
```

**上季度**
```js
const start = moment().quarter(moment().quarter() - 1).startOf('quarter').format('YYYY-MM-DD')
const end = moment().quarter(moment().quarter() - 1).endOf('quarter').format('YYYY-MM-DD')
```

## dayJs

> dayjs 和moment 具有相同的api , 同时具有更小的体积

```js
import dayjs from "dayjs";
import zh_CN from "dayjs/locale/zh-cn.js";
import relativeTime from "dayjs/plugin/relativeTime.js";
// 使用插件
dayjs.extend(relativeTime);
// 设置语言
dayjs.locale(zh_CN);
console.log(dayjs().format("YYYY-MM-DD HH:mm:ss"));
console.log(dayjs("2022-12-12").fromNow());
console.log(dayjs().add(1, "day").format("YYYY-MM-DD"));
```

