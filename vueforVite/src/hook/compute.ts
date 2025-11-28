import { computed } from "vue";
export function useComputed(fn: Function) {
  const map = new Map();
  return function (...args: any[]) {
    const key = generateKey(args);
    if (map.has(key)) {
      return map.get(key);
    }
    const result = computed(() => fn(...args));
    map.set(key, result);
    return result;
  };
}
/**
 * 生成唯一键的函数
 * @param args 参数数组
 * @returns 返回生成的唯一键
 */
function generateKey(args: any) {
  return args
    .map((arg: any) => {
      if (typeof arg === "object" && arg !== null) {
        return Object.entries(arg)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([k, v]) => `${k}:${v}`)
          .join("|");
      }
      return String(arg);
    })
    .join("_");
}
/**
 * 计算某一行的总价
 * @param {Object} row - 包含价格和数量的对象
 * @param {number} row.price - 单价
 * @param {number} row.quantity - 数量
 * @returns {number} - 返回该行的总价
 */
function totalPrice(row: { price: number; quantity: number }) {
  return row.price * row.quantity;
}

const computedTotalPrice = useComputed(totalPrice);
