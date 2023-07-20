// @ts-nocheck
// base64 文件转为file 对象
export function base64UrlToFile(base64Url, filename) {
  const arr = base64Url.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
/**
 * 下载文件
 * @params {string} url
 * @params {string} filename
 */
export function downloadFile(url, filename) {
  const alink = document.createElement("a");
  alink.setAttribute("href", url);
  alink.setAttribute("download", filename);
  document.body.appendChild(alink);
  alink.click();
  document.body.removeChild(alink);
}

/**
 * 文件切片
 * @params {file} file
 * @params {number} chunkSize
 */

export function chunkFile(file, chunkSize = 1024 * 1024 * 10) {
  let start = 0;
  let count = 0;
  const chunkTime = Math.ceil(file.size / chunkSize); // 分割次数
  while (count < chunkTime) {
    start = count * chunkSize;
    const fileChunk = file.slice(start, start + chunkSize); // 得到切片文件
    count += 1;
  }
}
/**
 * 将多个切片文件合成一个文件
 * @params {array[file]}
 * @return {file}
 */
export function chunkFileToFile(bigFile) {
  return new Blob(bigFile, {
    type: "application/octet-stream",
  });
}

