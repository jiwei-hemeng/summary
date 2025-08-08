/**
 * 将时间段平均分成若干份（以天为最小单位）
 * @param {Date} startDate - 开始日期
 * @param {Date} endDate - 结束日期
 * @param {number} parts - 要分成的份数
 * @returns {Array<{start: Date, end: Date}>} 分割后的时间段数组
 */
function splitTimePeriodByDays(startDate, endDate, parts) {
  // 验证参数
  if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
    throw new Error('startDate and endDate must be Date objects');
  }
  if (parts <= 0 || !Number.isInteger(parts)) {
    throw new Error('parts must be a positive integer');
  }
  if (startDate >= endDate) {
    throw new Error('startDate must be before endDate');
  }

  // 计算总天数（包含开始和结束当天）
  const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const result = [];
  if (parts > totalDays) {
    result.push({start: new Date(startDate), end: new Date(endDate), days: totalDays})
    return result;
  }

  // 计算每份的天数（整数）
  const daysPerPart = Math.floor(totalDays / parts);
  const remainder = totalDays % parts;

  
  let currentStart = new Date(startDate);
  let remainingDays = totalDays;

  for (let i = 0; i < parts; i++) {
    // 计算当前份的天数（处理余数均匀分配）
    let currentPartDays = daysPerPart;
    if (i < remainder) {
      currentPartDays += 1;
    }

    // 计算当前份的结束日期
    let currentEnd = new Date(currentStart);
    currentEnd.setDate(currentStart.getDate() + currentPartDays - 1);
    
    // 确保不超过总结束日期
    if (currentEnd > endDate) {
      currentEnd = new Date(endDate);
    }

    result.push({
      start: new Date(currentStart),
      end: new Date(currentEnd),
      days: currentPartDays
    });

    // 设置下一份的开始日期
    currentStart = new Date(currentEnd);
    currentStart.setDate(currentStart.getDate() + 1);
    
    remainingDays -= currentPartDays;
  }

  return result;
}
