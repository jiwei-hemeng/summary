import NodeRSA from "node-rsa";
import fs from "fs";
import path from "path";
const key = new NodeRSA({ b: 512 });
key.setOptions({ encryptionScheme: "pkcs1" });
/**
 * 加密函数
 * @param {string} data 需要加密的字符串
 * @returns {string} 加密后的结果
 */
export function encrypt(data) {
  key.importKey(
    fs.readFileSync(path.join("./", "publicPem.txt"))
  );
  return key.encrypt(data, "base64");
}
/**
 * 解密函数
 * @param {string} cioherText 需要解密的字符串
 * @returns {string} 解密后的结果
 */
export function decrypt(cioherText) {
  key.importKey(
    fs.readFileSync(path.join("./", "privatePem.txt"))
  );
  return key.decrypt(cioherText, "utf8");
}
