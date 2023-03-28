/** 
 * @param {string} tranvalue 需要转换的数字
 * @return {string}
 */
export function transform(tranvalue) {
  try {
    var i = 1;
    var dw2 = ["", "万", "亿"]; //大单位
    var dw1 = ["拾", "佰", "仟"]; //小单位
    var dw = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
    //整数部分用
    //以下是小写转换成大写显示在合计大写的文本框中
    //分离整数与小数
    var source = splits(tranvalue);
    var num = source[0];
    var dig = source[1];
    //转换整数部分
    var k1 = 0; //计小单位
    var k2 = 0; //计大单位
    var sum = 0;
    var str = "";
    var len = source[0].length; //整数的长度
    for (i = 1; i <= len; i++) {
      var n = source[0].charAt(len - i); //取得某个位数上的数字
      var bn = 0;
      if (len - i - 1 >= 0) {
        bn = source[0].charAt(len - i - 1); //取得某个位数前一位上的数字
      }
      sum = sum + Number(n);
      if (sum != 0) {
        str = dw[Number(n)].concat(str); //取得该数字对应的大写数字，并插入到str字符串的前面
        if (n == "0") sum = 0;
      }
      if (len - i - 1 >= 0) {
        //在数字范围内
        if (k1 != 3) {
          //加小单位
          if (bn != 0) {
            str = dw1[k1].concat(str);
          }
          k1++;
        } else {
          //不加小单位，加大单位
          k1 = 0;
          var temp = str.charAt(0);
          if (temp == "万" || temp == "亿")
            //若大单位前没有数字则舍去大单位
            str = str.substr(1, str.length - 1);
          str = dw2[k2].concat(str);
          sum = 0;
        }
      }
      if (k1 == 3) {
        //小单位到千则大单位进一
        k2++;
      }
    }
    //转换小数部分
    var strdig = "";
    if (dig != "") {
      var n = dig.charAt(0);
      if (n != 0) {
        strdig += dw[Number(n)] + "角"; //加数字
      }
      var n = dig.charAt(1);
      if (n != 0) {
        strdig += dw[Number(n)] + "分"; //加数字
      }
    }
    str += "元" + strdig;
  } catch (e) {
    return "0元";
  }
  return str;
}
//拆分整数与小数
export function splits(tranvalue) {
  var value = ["", ""];
  let temp = tranvalue.split(".");
  for (var i = 0; i < temp.length; i++) {
    value = temp;
  }
  return value;
}

/** 
 * 将数字按照每隔3位逗号分割
 * @param {number} tranvalue 需要转换的数字
 * @return {string}
 */

export function numberPutCommaShow(value) {
  let installVal = value;
  if (value != "") {
    value = Number(value).toFixed(2)
    let intPart = Math.trunc(value) // 获取整数部分
    let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,") // 将整数部分逢三一断
    let floatPart = ".00" // 预定义小数部分
    let value2Array = value.split(".")
    // =2表示数据有小数位
    if (value2Array.length === 2) {
      floatPart = value2Array[1].toString() // 拿到小数部分
      if (floatPart.length === 1) { // 补0,实际上用不着
        return intPartFormat + "." + floatPart + "0"
      } else {
        if (installVal < 0 && intPartFormat == 0) {
          return "-" + intPartFormat + "." + floatPart
        } else {
          return intPartFormat + "." + floatPart
        }
      }
    } else {
      return intPartFormat + floatPart
    }
  } else if (value == 0 && String(value)) {
    return "0.00"
  }
}
// 每三个数字一个，分割
export function ThousandNum(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function formatNumber(value) {
  value += '';
  const list = value.split('.');
  const prefix = list[0].charAt(0) === '-' ? '-' : '';
  let num = prefix ? list[0].slice(1) : list[0];
  let result = '';
  while (num.length > 3) {
    result = `,${num.slice(-3)}${result}`;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
}

/** 
 * 将数字按照每隔3位逗号分割
 * @param {number} number 需要转换的数字
 * @param {number} prec 保留几位小数
 * @param {string} dec 小数点符号
 * @param {string} sep 千分位符号
 * @return {string}
 */

export function moneyFormat (number, prec = 2, dec = ".", sep = ",") {
  number = (number + '').replace(/[^0-9+-Ee.]/g, '')
  const n = !isFinite(+number) ? 0 : +number
  let s = ''
  const toFixedFix = function(n, prec) {
    const k = Math.pow(10, prec)
    return '' + Math.ceil(n * k) / k
  }
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
  const re = /(-?\d+)(\d{3})/
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, '$1' + sep + '$2')
  }

  if ((s[1] || '').length < prec) {
    s[1] = s[1] || ''
    s[1] += new Array(prec - s[1].length + 1).join('0')
  }
  return s.join(dec)
}
