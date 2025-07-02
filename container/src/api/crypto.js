import CryptoJS from 'crypto-js'
import MD5Encrypt from 'js-md5'
import tokenBox from "@/utils/auth";
//CBC模式
export default {
  encrypt(word,time) {
    let uscc=tokenBox.getItem('UC');
    let keys=`${time}${uscc}`
    let ivs=`${uscc}${time}`
    let keyStr= MD5Encrypt(keys);
    let ivStr= MD5Encrypt(ivs);
    keyStr=keyStr.substring(0,16)
    ivStr=ivStr.substring(0,16)
    let key = CryptoJS.enc.Utf8.parse(keyStr);
    let iv = CryptoJS.enc.Utf8.parse(ivStr);
    let srcs = CryptoJS.enc.Utf8.parse(JSON.stringify(word));
    let encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    });
    return encrypted.toString();
  },
  // 解密
  decrypt(word,time) {
    let uscc=tokenBox.getItem('UC');
    let keys=`${time}${uscc}`
    let ivs=`${uscc}${time}`
    let keyStr= MD5Encrypt(keys);
    let ivStr= MD5Encrypt(ivs);
    keyStr=keyStr.substring(0,16)
    ivStr=ivStr.substring(0,16)
    let key = CryptoJS.enc.Utf8.parse(keyStr);
    let iv = CryptoJS.enc.Utf8.parse(ivStr);
    let decrypt = CryptoJS.AES.decrypt(word, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    });
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.substring(0,decryptedStr.lastIndexOf('}')+1)

  }
}
