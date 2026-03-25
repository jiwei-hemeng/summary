import { useRef, useCallback } from "react";
/**
 * 防抖hook
 * @param {Function} fn - 防抖函数
 * @param {number} [delay=300] - 默认时间
 * @returns {Function}
 * @example
 * const onSearch = useDebounceFn((value) => {
 *    fetchList(value);
 *  }, 500);
 * <input onChange={e => onSearch(e.target.value)} />
 */
export default function useDebounceFn(fn, delay = 300) {
  const timer = useRef(null);
  const fnRef = useRef(fn);

  // 始终指向最新 fn，解决闭包问题
  fnRef.current = fn;

  const debounce = useCallback(
    (...args) => {
      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = window.setTimeout(() => {
        fnRef.current(...args);
      }, delay);
    },
    [delay]
  );

  return debounce;
}
// 使用案例
