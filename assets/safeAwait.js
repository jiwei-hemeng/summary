/**
 * 安全地等待一个 Promise 的结果。
 *
 * @param promise 要等待的 Promise 对象。
 * @returns 一个包含三个元素的数组，第一个元素表示 Promise 是否成功解决（true 表示成功，false 表示失败），
 * 第二个元素是错误对象（如果 Promise 成功解决则为 null），第三个元素是 Promise 的结果（如果 Promise 失败则为 null）。
 */
async function safeAwait(promise) {
  try {
    const result = await promise;
    return [true, null, result];
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    return [false, error, null];
  }
}

function fetchlist() {
  const { promise, resolve, reject } = Promise.withResolvers();
  if (Math.random() > 0.5) {
    resolve(true);
  } else {
    reject(false);
  }
  return promise;
}

async function a() {
  const [ok, error, result] = await safeAwait(fetchlist());

  if (ok) {
    console.log("成功了", result);
  } else {
    console.log("失败了", error);
  }
}
a();
