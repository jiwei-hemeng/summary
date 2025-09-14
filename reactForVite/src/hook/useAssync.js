import { useState, useEffect, useCallback } from "react";
export default function useAsync(fn, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState({ result: false, message: null });
  const [loading, setLoading] = useState(false);

  // 关键点1：useCallback避免无限重渲染
  const run = useCallback(async () => {
    setLoading(true);

    try {
      const result = await fn();
      setData(result);
      setError({ result: true, message: null });
    } catch (err) {
      setError({ result: false, message: err.toString() });
    } finally {
      setLoading(false); // 关键点3：无论如何都要重置loading
    }
  }, deps);

  useEffect(() => {
    if (fn) run();
  }, [run]);

  return { data, error, loading, run };
}
