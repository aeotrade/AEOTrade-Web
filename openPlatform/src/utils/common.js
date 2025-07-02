/************正则开始**************/
/**
 * 验证不能包含字母
 * @param { string } value
 */
export const isNoWord = value => /^[^A-Za-z]*$/g.test(value);

/**
 * 验证中文和数字
 * @param { string } value
 */
export const isCHNAndEN = value => /^((?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])|(\d))+$/g.test(value);

/**
 * 验证中文
 * @param { string } value
 */
export const isChineseCharacter = value => /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/g.test(value);

/**
 * 验证英文
 * @param { string } value
 */
export const isEnglish = value => /^[a-zA-Z]+$/g.test(value);

/**
 * 验证大写英文字母
 * @param { string } value
 */
export const isCapital = value => /^[A-Z]+$/g.test(value);

/**
 * 验证小写英文字母
 * @param { string } value
 */
export const isLowercase = value => /^[a-z]+$/g.test(value);

/**
 * 验证手机号中国(严谨), 根据工信部2019年最新公布的手机号段
 * @param { string } value
 */
export const isMPStrict = value => /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/g.test(value);

/**
 * 验证身份证号(2代,18位数字),最后一位是校验位,可能为数字或字符X
 * @param { string } value
 */
export const isEmail = value => /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/g.test(value);

/**
 * 验证email(邮箱)
 * @param { string } value
 */
export const isIDCardNew = value => /^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}[\dXx]$/g.test(value);

/**
 * 验证小数
 * @param { string } value
 */
export const isDecimal = value => /^\d+\.\d+$/g.test(value);

/**
 * 验证数字
 * @param { string } value
 */
export const isNumber = value => /^\d{1,}$/g.test(value);

/************正则结束**************/

/**
 * 金钱格式化，三位加逗号
 *  @param { number } num
 */
export const formatMoney = num => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");


/**
 * 获取url参数
 * @param {*} name
 * @param {*} origin
 */
export function getUrlParams(name, origin = null) {
  let url = location.href;

  if(origin){
    url=origin;
  }

  let temp1 = url.split('?');

  let pram = temp1[1];

  let keyValue = pram.split('&');

  let obj = {};

  for (let i = 0; i < keyValue.length; i++) {
    let item = keyValue[i].split('=');

    let key = item[0];

    let value = item[1];

    obj[key] = value;
  }
  return obj[name];
}

/**
 * 获取滚动条距顶部高度
 */
export function getPageScrollTop() {
  let a = document;

  return a.documentElement.scrollTop || a.body.scrollTop;
}

/**
 * 截取字符串并加身略号
 */
export function subText(str, length) {
  if (str.length === 0) {
    return '';
  }
  if (str.length > length) {
    return str.substr(0, length) + "...";
  }
  return str;
}

/**
 * 获取文件base64编码
 * @param file
 * @param format  指定文件格式
 * @param size  指定文件大小(字节)
 * @param formatMsg 格式错误提示
 * @param sizeMsg   大小超出限制提示
 * @returns {Promise<any>}
 */
export function fileToBase64String(file, format = ['jpg', 'jpeg', 'png', 'gif'], size = 20 * 1024 * 1024, formatMsg = '文件格式不正确', sizeMsg = '文件大小超出限制') {
  return new Promise((resolve, reject) => {
    // 格式过滤
    let suffix = file.type.split('/')[1].toLowerCase();

    let inFormat = false;

    for (let i = 0; i < format.length; i++) {
      if (suffix === format[i]) {
        inFormat = true;
        break;
      }
    }
    if (!inFormat) {
      reject(formatMsg);
    }
    // 大小过滤
    if (file.size > size) {
      reject(sizeMsg);
    }
    // 转base64字符串
    let fileReader = new FileReader();

    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      let res = fileReader.result;

      resolve({base64String: res, suffix: suffix});
      reject('异常文件，请重新选择');
    };
  });
}

/**
 * base64转file
 *  @param { base64 } base64
 *  @param { string } filename 转换后的文件名
 */
export const base64ToFile = (base64, filename )=> {
  let arr = base64.split(',');

  let mime = arr[0].match(/:(.*?);/)[1];

  let suffix = mime.split('/')[1] ;// 图片后缀

  let bstr = atob(arr[1]);

  let n = bstr.length;

  let u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], `${filename}.${suffix}`, { type: mime })
};


/**
 * file转base64
 * @param { * } file 图片文件
 */
export const fileToBase64 = file => {
  let reader = new FileReader();

  reader.readAsDataURL(file);
  reader.onload = function (e) {
    return e.target.result;
  };
};

/**
 * 判断手机是Andoird还是IOS
 *  0: ios
 *  1: android
 *  2: 其它
 */
export function getOSType() {
  let u = navigator.userAgent;

  let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;

  let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

  if (isIOS) {
    return 0;
  }
  if (isAndroid) {
    return 1;
  }
  return 2;
}

/**
 * 函数防抖
 * @param { function } func
 * @param { number } wait 延迟执行毫秒数
 * @param { boolean } immediate  true 表立即执行，false 表非立即执行
 */
export function debounce(func,wait,immediate) {
  let timeout;
  return function () {
    let context = this;
    let args = arguments;

    if (timeout) clearTimeout(timeout);
    if (immediate) {
      let callNow = !timeout;
      timeout = setTimeout(() => {
        timeout = null;
      }, wait);
      if (callNow) func.apply(context, args)
    }
    else {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait);
    }
  };
}

/**
 * 判断数据类型
 * @param {*} target
 */
export function type(target) {
  let ret = typeof(target);
  let template = {
    "[object Array]": "array",
    "[object Object]":"object",
    "[object Number]":"number - object",
    "[object Boolean]":"boolean - object",
    "[object String]":'string-object'
  };

  if(target === null) {
    return 'null';
  }else if(ret == "object"){
    let str = Object.prototype.toString.call(target);
    return template[str];
  }else{
    return ret;
  }
}

/**
 * 加法函数（精度丢失问题）
 * @param { number } arg1
 * @param { number } arg2
 */
export function add(arg1, arg2) {
  let r1, r2, m;

  try { r1 = arg1.toString().split(".")[1].length; } catch (e) { r1 = 0; }
  try { r2 = arg2.toString().split(".")[1].length; } catch (e) { r2 = 0; }
  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
}

/**
 * 去除空格
 * @param { string } str 待处理字符串
 * @param  { number } type 去除空格类型 1-所有空格  2-前后空格  3-前空格 4-后空格 默认为1
 */
export function trim(str, type = 1) {
  if (type && type !== 1 && type !== 2 && type !== 3 && type !== 4){ return;}
  switch (type) {
    case 1:
      return str.replace(/\s/g, "");
    case 2:
      return str.replace(/(^\s)|(\s*$)/g, "");
    case 3:
      return str.replace(/(^\s)/g, "");
    case 4:
      return str.replace(/(\s$)/g, "");
    default:
      return str;
  }
}

/**
 * 大小写转换
 * @param { string } str 待转换的字符串
 * @param { number } type 1-全大写 2-全小写 3-首字母大写 其他-不转换
 */

export function turnCase(str, type) {
  switch (type) {
    case 1:
      return str.toUpperCase();
    case 2:
      return str.toLowerCase();
    case 3:
      return str[0].toUpperCase() + str.substr(1).toLowerCase();
    default:
      return str;
  }
}

/**
 * 转义html(防XSS攻击)
 * @param { string } str 待转换
 */
export const escapeHTML = str =>{
  str.replace(
    /[&<>'"]/g,
    tag =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
  );
};
