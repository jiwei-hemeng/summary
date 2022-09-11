const NodeRSA = require("node-rsa");
const key = new NodeRSA({ b: 512 });
key.setOptions({ encryptionScheme: "pkcs1" });
// 私钥
const privatePem = key.exportKey("pkcs1-private-pem");
// 公钥
const publicPem = key.exportKey("pkcs1-public-pem");
console.log("=================私钥:===============")
console.log(privatePem)
console.log("=================公钥================")
console.log(publicPem)
const data = "我是加密前的数据";
const encrypt = new NodeRSA(privatePem)
console.log("正在加密中...")
const cioherText = encrypt.encryptPrivate(data, "base64");
console.log("加密后是：", cioherText);
console.log("加密后长度：", cioherText.length);
const decrypt = new NodeRSA(publicPem);
console.log("正在解密中...")
const rowText = decrypt.decryptPublic(cioherText, "utf8");
console.log("解密后是：", rowText);
