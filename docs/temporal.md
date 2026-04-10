# Temporal 核心对象

| 类型                   | 用途                       |
| ---------------------- | -------------------------- |
| Temporal.PlainDate     | 纯日期（无时区）2026-04-06 |
| Temporal.PlainTime     | 纯日期（无时区）2026-04-06 |
| Temporal.PlainDateTime | 日期+时间（无时区）        |
| Temporal.ZonedDateTime | 带时区的完整日期时间       |
| Temporal.Instant       | 时间戳（精确时刻）         |
| Temporal.Duration      | 时间段（加减计算）         |

# 快速上手

```js
const date = Temporal.PlainDate.from({ year: 2026, month: 4, day: 6 });
console.log(date.month);
console.log(date.toString());
const d2 = Temporal.PlainDate.from("2026-04-06");
console.log(d2.year, d2.month, d2.day);
const today = Temporal.Now.plainDateISO();
console.log(today.toString());
```

# 日期计算（再也不用 dayjs）

```js
const today = Temporal.PlainDate.from("2026-04-06");
const nextWeek = today.add({ days: 7 });
const lastMonth = today.subtract({ months: 1 });
const nextYear = today.add({ years: 1 });
console.log(nextWeek.toString());
console.log(lastMonth.toString());
console.log(nextYear.toString());

// 计算两个日期之差
const start = Temporal.PlainDate.from("2026-01-01");
const end = Temporal.PlainDate.from("2026-04-06");
const diff = start.until(end);
console.log(diff.days); // 95（天数）
```

# 倒计时与持续时间

```js
function countdown(targetDateStr) {
  const today = Temporal.Now.plainDateISO();
  const target = Temporal.PlainDate.from(targetDateStr);
  const diff = today.until(target, { largestUnit: "day" });
  if (diff.days < 0) return "已过期";
  if (diff.days === 0) return "就是今天！";
  return `还有 ${diff.days} 天`;
}
```

# 生产环境建议通过 Polyfill 使用

```sh
npm install @js-temporal/polyfill
```

引入

```js
// 方式一：按需导入
import { Temporal } from "@js-temporal/polyfill";
// 方式二：全局注入（适合旧项目）
import "@js-temporal/polyfill/global";
```
