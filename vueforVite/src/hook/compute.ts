import { computed, type ComputedRef } from "vue";
export function useComputed<Args extends unknown[], T>(
  fn: (...args: Args) => T
): (...args: Args) => ComputedRef<T> {
  const map = new Map<string, ComputedRef<T>>();

  return function (...args: Args): ComputedRef<T> {
    const key = JSON.stringify(args);
    if (!map.has(key)) {
      map.set(
        key,
        computed(() => fn(...args))
      );
    }
    return map.get(key)!;
  };
}

// 使用示例
function totalPrice(row: { price: number; quantity: number }) {
  return row.price * row.quantity;
}

const computedTotalPrice = useComputed(totalPrice);
const result = computedTotalPrice({ price: 10, quantity: 2 });
console.log(result.value); // 输出: 20
