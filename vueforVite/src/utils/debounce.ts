export default function debounce<T extends any[], R>(
  fn: (...args: T) => R,
  delay: number
): (...args: T) => R | undefined {
  let timer: ReturnType<typeof setTimeout> | null;
  let lastResult: R | undefined;

  return (...args: T): R | undefined => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      lastResult = fn(...args);
    }, delay);
    return lastResult;
  };
}
