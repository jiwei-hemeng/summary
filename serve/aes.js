import CryptoJS from "crypto-js";
// AES密钥以及偏移量
const key = CryptoJS.enc.Utf8.parse("0123456789abcdef"); // 密钥, AES-128 需16个字符, AES-256 需要32个字符
const iv = CryptoJS.enc.Utf8.parse("abcdef0123456789"); // 密钥偏移量，16个字符
// AES 加密
const AESencrypt = (message) => {
  let result;
  let src = CryptoJS.enc.Utf8.parse(message);
  result = CryptoJS.AES.encrypt(src, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  // return result.ciphertext.toString().toUpperCase();
  return result.ciphertext.toString();
};
// AES解密
const AESdecrypt = (secret) => {
  let encryptedHexStr = CryptoJS.enc.Hex.parse(secret);
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
  let decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr;
};
const secret = AESencrypt("加密字符串aaaaAAAA----啦啦啦啦啦%%%%&&&&****");
console.log("加密结果：" + secret);
const decryptedStr = AESdecrypt(secret);
console.log("解密结果：" + decryptedStr);