// 设置cookie
export function setCookie(key, value, expire) {
  const d = new Date();
  d.setDate(d.getDate() + expire);
  document.cookie = `${key}=${value};expires=${d.toUTCString()}`;
};
// 获取 cookie
export function getCookie(key) {
  const cookieStr = decodeURIComponent(document.cookie);
  const arr = cookieStr.split("; ");
  let cookieValue = "";
  for (let i = 0; i < arr.length; i++) {
    const temp = arr[i].split("=");
    if (temp[0] === key) {
      cookieValue = temp[1];
      break;
    }
  }
  return cookieValue;
};
// 删除cookie
export function delCookie(key) {
  document.cookie = `${encodeURIComponent(key)}=;expires=${new Date()}`;
};
