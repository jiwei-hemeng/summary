import NodeRSA from "node-rsa";
import fs from "fs";
import path from "path";
const key = new NodeRSA({ b: 512 });
key.setOptions({ encryptionScheme: "pkcs1" });
// 私钥
const privatePem = key.exportKey("pkcs8-private-pem");
// 公钥
const publicPem = key.exportKey("pkcs8-public-pem");
fs.writeFileSync(path.join(path.join(), 'publicPem.txt'), publicPem)
fs.writeFileSync(path.join(path.join(), 'privatePem.txt'), privatePem)
