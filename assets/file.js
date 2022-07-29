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
// 下载文件
export function downloadFile(url, filename) {
  const alink = document.createElement("a");
  alink.setAttribute("href", url);
  alink.setAttribute("download", filename);
  document.body.appendChild(alink);
  alink.click();
  document.body.removeChild(alink);
}
