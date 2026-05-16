import useAsync from "@/hook/useAssync";
export default function TestUseAsync() {
  const { data, error, loading, run } = useAsync(
    () =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.5) {
            resolve("请求成功");
          } else {
            reject("请求失败");
          }
        }, 1000);
      }),
    []
  );
  return (
    <main>
      <h2>TestUseAsync</h2>
      {loading && <p>加载中...</p>}
      {error.result === false && loading === false && (
        <p style={{ color: "red" }}>{error.message}</p>
      )}
      {error.result && loading === false && (
        <p style={{ color: "green" }}>{data}</p>
      )}
      <button onClick={run}>重新请求</button>
    </main>
  );
}
