import JSEncrypt from "jsencrypt";
//公钥
const PUBLIC_KEY = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC3+2kBT+EJq8PqSrleCgsddWtwuIDaNtSwWunuyaRuSGWhBJxFApWXv8xfdchhbw5ti/2z3w5ipAufXJ/5R9FwBGSGEivbpUUCpVuk7iFY8vE+yfZTobEkfJ0vsO9FllG9AofYDAP5dlKYfTnXpNv7HrPrZfleB5HOtXS1OMt02wIDAQAB';
//私钥
const PRIVATE_KEY = 'MIICXAIBAAKBgQC3+2kBT+EJq8PqSrleCgsddWtwuIDaNtSwWunuyaRuSGWhBJxFApWXv8xfdchhbw5ti/2z3w5ipAufXJ/5R9FwBGSGEivbpUUCpVuk7iFY8vE+yfZTobEkfJ0vsO9FllG9AofYDAP5dlKYfTnXpNv7HrPrZfleB5HOtXS1OMt02wIDAQABAoGBALb3QIL8hGjQt+JNc7EwvcMLHdEYu5PHiZbkotZFE9BVETSjWCFNI6WpKT8Z7C/xeOC6opB52F2ClMhkHfeTU5SpQx2YoRXjQGxCigTaRvlMo2q8q05sy4cxKpE+7c4yMaZSPldrx5HjLLlJzso7xngtHqnP/wQsbNnARhQ31tIhAkEA58D7SxU0i8UWSR1hPrXC4iPfDXTwtFOVyyHWCCId5fNFH6omlyHzleH4WLSYe/ZBAJRpPUqUeLlSKtkzonIgsQJBAMs693OXOeQpZdWUFlEl0hvcQFclaSID2TPbcL/doMslYd7tegyhBIrQRIzUQooZF5lbcsBLwb1hFPx0N7E6MUsCQH6pIC5W9pL1MkrffchyOoKxrDSElxFXJWURpxJm4wRMQpkdu12aNrDSAZMpkLUfT0Nr2WCgJCkez+OPNgMwcOECQGlMMBHv9MrGuECk7bs1wVs2DxAYDhTVsaAwvoZqqnkW8VKz8FzCwLu7lQjyoVc0EQogW6BOoB8jQeBbxs9Iu2kCQAFzAhRnjj1Rn2uvMqRCva+ez3RPaLHK4BzC5UdgF/qTu58+K29UqKSLenMB8ZZ1VQIJ83VnKSiIyHqeHBjl6LE=';
// 公钥加密
export function encrypt(str) {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey('-----BEGIN PUBLIC KEY-----' + PUBLIC_KEY + '-----END PUBLIC KEY-----');
  return encryptor.encrypt(str);
}
// 私钥解密
export function decrypt(str) {
  const encryptor = new JSEncrypt();
  encryptor.setPrivateKey('-----BEGIN RSA PRIVATE KEY-----' + PRIVATE_KEY + '-----END RSA PRIVATE KEY-----');
  return encryptor.decrypt(str); 
}
