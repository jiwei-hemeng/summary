import { useEffect, useRef } from "react";

export default function useWorker(workerPath) {
  const worker = useRef(null);

  useEffect(() => {
    worker.current = new Worker(workerPath);

    worker.current.onerror = (err) => {
      console.error("Worker error:", err);
    };

    return () => {
      worker.current?.terminate();
    };
  }, [workerPath]);

  function emit(e, transferList) {
    if (worker.current) {
      worker.current.postMessage(e, transferList);
    }
  }

  function $on(fun) {
    if (!fun) return;
    const handler = (e) => fun(e.data);
    worker.current?.addEventListener("message", handler);
    // 返回一个清理函数
    return () => {
      worker.current?.removeEventListener("message", handler);
    };
  }

  return { emit, $on };
}
