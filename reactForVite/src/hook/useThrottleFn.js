import { useRef, useCallback } from "react";
export default function useThrottleFn(fn, delay = 300) {
  const lastTime = useRef(0);
  const fnRef = useRef(fn);

  fnRef.current = fn;

  return useCallback(
    (...args) => {
      const now = Date.now();

      if (now - lastTime.current >= delay) {
        lastTime.current = now;
        fnRef.current(...args);
      }
    },
    [delay]
  );
}
