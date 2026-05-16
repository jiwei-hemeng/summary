import BigNumber from "bignumber.js";
// 加法
console.log(new BigNumber(0.1).plus(0.2));
// 减法
console.log(new BigNumber(0.2).minus(0.05));
// 乘法
console.log(new BigNumber(3).times(0.8));
// 除法
console.log(new BigNumber(3).div(0.8));
// 指数运算
console.log(new BigNumber(0.3).pow(2));
// 开平方
console.log(new BigNumber(0.04).sqrt(2));
console.log(new BigNumber(9999999999999999000).plus(1).toString());
