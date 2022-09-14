const NodeRSA = require("node-rsa");
const key = new NodeRSA({ b: 512 });
key.setOptions({ encryptionScheme: "pkcs1" });
// 私钥 - 解密
const privatePem = key.exportKey("pkcs8-private-pem");
// 公钥 - 加密
const publicPem = key.exportKey("pkcs8-public-pem");
const data = "我是加密前的数据";
key.importKey(publicPem)
console.log("正在加密中...")
const cioherText = key.encrypt(data, "base64");
console.log("加密后是：", cioherText);
key.importKey(privatePem);
console.log("正在解密中...")
const rowText = key.decrypt(cioherText, "utf8");
console.log("解密后是：", rowText);
