import { useEffect } from "react";
import useWorker from "@/hook/useWorker";
export default function TestUseWorker() {
  const { emit, $on } = useWorker(new URL("./worker.js", import.meta.url).href);
  useEffect(() => {
    $on((data) => {
      console.log("Data:", data); // 是否执行？
    });
  }, []);
  function emitNumber() {
    emit(2);
  }
  return (
    <div>
      <button onClick={emitNumber}>发送消息</button>
    </div>
  );
}
