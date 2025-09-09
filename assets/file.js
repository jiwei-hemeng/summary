// @ts-check
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
/***
 * 将ArrayBuffer对学校转为blob对象
 */

function bufToBlob(buf, mimeType) {
  return new Blob([buf], { type: mimeType });
}

/**
 * 下载文件
 * @param {string} url
 * @param {string} filename
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
 * @param {File} file
 * @param {number} chunkSize
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
 * 将大文件转换为Blob对象
 * @param {Array<ArrayBuffer|File|Blob>} bigFile - 需要转换的文件对象，可以是File、ArrayBuffer或ArrayBuffer数组
 * @returns {Blob} 返回一个新的Blob对象，类型为application/octet-stream
 * @example
 * // 使用File对象
 * const file = document.querySelector('input[type="file"]').files[0];
 * const blob = chunkFileToFile(file);
 * // 使用ArrayBuffer
 * const arrayBuffer = new ArrayBuffer(1024);
 * const blob = chunkFileToFile(arrayBuffer);
 */
export function chunkFileToFile(bigFile) {
  return new Blob(bigFile, {
    type: "application/octet-stream",
  });
}

/**
 * 获取文件的扩展名
 * @param {string} filename
 * @returns {string}
 */

export function getFileExtension(filename) {
  const extRegex = /\.([0-9a-z]+)(?:[\?#]|$)/i;
  const match = extRegex.exec(filename);
  return match ? match[1] : "";
}
