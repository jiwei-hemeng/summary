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

**本月 **

```js
const begin = moment().startOf('month');
const end = moment().endOf('month');
```

**上月 **

```js
const begin = moment().subtract(1, 'month').startOf('month');
const end = moment().subtract(1, 'month').endOf('month');
```
**前三天 **

```js
const begin = moment().subtract(2, 'day').startOf('day');
const end = moment().endOf('day');
```

**本周 **

```js
const begin = moment().startOf('week');
const end = moment().endOf('week');
```

**上一周 **

```js
const begin = moment().subtract(1, 'week').startOf('week');
const end = moment().subtract(1, 'week').endOf('week');
```

**本季度 **

```js
const  start = moment().startOf('quarter').format('YYYY-MM-DD')   // 开始
const end = moment().endOf('quarter').format('YYYY-MM-DD')   // 结束
```

**上季度 **
```js
const start = moment().quarter(moment().quarter() - 1).startOf('quarter').format('YYYY-MM-DD')
const end = moment().quarter(moment().quarter() - 1).endOf('quarter').format('YYYY-MM-DD')
```


