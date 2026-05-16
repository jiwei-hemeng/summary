/**
 * 设置 cookie
 * @param {string} key - Cookie的键
 * @param {string} value - Cookie的值
 * @param {number} expire - Cookie的过期时间（天）
 * @return {void}
 */
export function setCookie(key, value, expire) {
  const d = new Date();
  d.setDate(d.getDate() + expire);
  document.cookie = `${key}=${value};expires=${d.toUTCString()}`;
}
/**
 * 获取 cookie
 * @param {string} key - Cookie的键
 * @returns {string} - Cookie的值
 */
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
}
/**
 * 删除 cookie
 * @param {string} key - Cookie的键
 * @return {void}
 */
export function delCookie(key) {
  document.cookie = `${encodeURIComponent(key)}=;expires=${new Date()}`;
}
