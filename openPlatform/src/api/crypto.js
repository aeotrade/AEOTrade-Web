import CryptoJS from 'crypto-js'
import MD5Encrypt from 'js-md5'
import tokenBox from "@/utils/auth";
//CBC模式
export default {
  // 特别注意：此次是将密文写死到函数内部，也可以当成函数的参数进行动态绑定密文,列如：
  // 只是前两句不一样，外加两个形参.
  // encrypt(word,keyStr, ivStr){ keyStr = keyStr ? keyStr : "abcdefG1234567"; ivStr = ivStr ? ivStr : "abcdefG1234567"; ...........(之后内容与以下一样)}
  // 加密
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
    let result=decryptedStr.substring(0,decryptedStr.lastIndexOf('}')+1)
    return result

  }
}
