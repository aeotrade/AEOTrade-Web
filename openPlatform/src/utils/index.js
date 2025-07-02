
import {Message } from 'element-ui';
import he from "element-ui/src/locale/lang/he";

/*
两边空格
@s:字符串
*/
export function trim(s){
  if(s !=='' && s!==undefined && s!==null){
    return s.replace(/(^\s*)|(\s*$)/g, "");
  }

}
/*
* 判断是否是obj
* @obj:对象
* */

function isObject (obj) {
  return obj !== null && typeof obj === 'object';
}
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';

  let date;

  if (typeof time === 'object') {
    date = time;
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)


    ) {
      time = parseInt(time);
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    'y': date.getFullYear(),
    'm': date.getMonth() + 1,
    'd': date.getDate(),
    'h': date.getHours(),
    'i': date.getMinutes(),
    's': date.getSeconds(),
    'a': date.getDay()
  };

  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];

    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ]; }
    return value.toString().padStart(2, '0');
  });

  return time_str;
}

export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 2) {
    return '1天前';
  }
  if (option) {
    return parseTime(time, option);
  }
  return (
    d.getMonth() +
    1 +
    '月' +
    d.getDate() +
    '日' +
    d.getHours() +
    '时' +
    d.getMinutes() +
    '分'
  );
}

export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}


export function addClass(ele, cls) {
  if (!hasClass(ele, cls)){ele.className += ' ' + cls;}
}

export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');

    ele.className = ele.className.replace(reg, ' ');
  }
}
/*
* 判断字符串和对象是否为空
* @obj：可以是字符串，也可以是对象
* */
export function isEmpty(obj){
  if(obj===''){

    return false;
  }
  if(obj instanceof String){ //判断是否为字符串
    obj=trim(obj);
    if(obj.length>0){
      return true;
    }
    return false;
  }else if(isObject(obj)) {
    let array=Object.keys(obj);

    for (let i=0;i<array.length;i++){
      if(obj[array[i]]===''){
        return false;
        break;
      }
      let trimObj=obj[array[i]];

      if(trimObj.length<=0){
        return false;
        break;
      }
    }
    return true;

  }

}
/*
* 删除对象中空的属性
* @data：对象
* */

export function deleteEmptyProperty(object){
  for (let i in object) {
    let value = object[i];

    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        if (value.length == 0) {
          delete object[i];
          continue;
        }
      }
      deleteEmptyProperty(value);
      if (isEmptyProperty(value)) {
        delete object[i];
      }
    } else {
      if (value === '' || value === null || value === undefined) {
        delete object[i];
      }
    }
  }

  return object;
}
function isEmptyProperty(object) {
  for (let name in object) {
    return false;
  }
  return true;
}

/*
表单验证空提示
@obj:对象或者字符串
*/


export function formEmptyWarning(obj){
 if (obj===null ||obj === ''|| obj === undefined){
   Message({
     'message': '信息不完整！',
     'type': 'error',
     'duration': 5 * 1000
   });
   return false;
 }
/*
 for(let i in obj){
   if(typeof obj[i]=== 'object'){
     if (Array.isArray(obj[i])) {
       if (obj[i].length == 0) {
         Message({
           'message': '内容不能为空！',
           'type': 'error',
           'duration': 5 * 1000
         });
         return false;

       }
     }
     if (obj[i]===null ||obj[i] === ''|| obj[i] === undefined){
       Message({
         'message': '内容不能为空！',
         'type': 'error',
         'duration': 5 * 1000
       });
       return false;
     }
   }
 }
*/





 if(typeof obj === 'object'){
   if (obj.length===undefined){
     for (let key in obj){
       if (obj[key]===''||obj[key]===null||obj[key]===undefined){
         Message({
           'message': '内容不能为空！',
           'type': 'error',
           'duration': 5 * 1000
         });
         return false;
       }
     }
   } else{
     if(obj.length==0){
       Message({
         'message': '内容不能为空！',
         'type': 'error',
         'duration': 5 * 1000
       });
       return false;
     }
     for (let i=0;i<obj.length;i++){
       if (obj[i]===null ||obj[i] === ''|| obj[i] === undefined) {
         Message({
           'message': '内容不能为空！',
           'type': 'error',
           'duration': 5 * 1000
         });
         return false;
       }
     }
   }


 }
 return true;
}
/*timeStamp：时间戳，
@type ：根据自己的需要设置格式： Y-M-D   Y-M-D H 等等
@auto ：为false是转化格式，为true是输入之前到今天的此时时间
*/
export function formatDate(timeStamp, type = 'Y-M-D H:I:S', auto = false) {
  if(!timeStamp){
    return '';
  }
  let time = (timeStamp + '').length === 10 ? new Date(parseInt(timeStamp) * 1000) : new Date(parseInt(timeStamp));
  let _year = time.getFullYear();
  let _month = (time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1);
  let _date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
  let _hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
  let _minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
  let _secconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
  let formatTime = '';
  let distinctTime = new Date().getTime() - time.getTime();

  if (auto) {
    if (distinctTime <= (1 * 60 * 1000)) {
      let _s = Math.floor((distinctTime / 1000) % 60);
      formatTime = _s + '秒前';
    } else if (distinctTime <= (1 * 3600 * 1000)) {
      let _m = Math.floor((distinctTime / (60 * 1000)) % 60);
      formatTime = _m + '分钟前';
    } else if (distinctTime <= (24 * 3600 * 1000)) {
      let _h = Math.floor((distinctTime / (60 * 60 * 1000)) % 24);
      formatTime = _h + '小时前';
    } else if (distinctTime <= (30 * 24 * 3600 * 1000)) {
      let _d = Math.floor((distinctTime / (24 * 60 * 60 * 1000)) % 30);
      formatTime = _d + '天前';
    } else {
      // 30天以外只显示年月日
      formatTime = _year + '-' + _month + '-' + _date;
    }
  } else {

    switch (type) {
      case 'Y-M-D H:I:S':
        formatTime = _year + '-' + _month + '-' + _date + ' ' + _hours + ':' + _minutes + ':' + _secconds;
        break;
      case 'Y.M.D H:I:S':
        formatTime = _year + '.' + _month + '.' + _date + ' ' + _hours + ':' + _minutes + ':' + _secconds;
        break;
      case 'yyMMddHHmmss':
        formatTime = _year + '' + _month + '' + _date + '' + _hours + '' + _minutes + '' + _secconds;
        break;
      case 'Y-M-D H:I:S zh':
        formatTime = _year + '年' + _month + '月' + _date + '日  ' + _hours + ':' + _minutes + ':' + _secconds;
        break;
      case 'Y-M-D H:I':
        formatTime = _year + '-' + _month + '-' + _date + ' ' + _hours + ':' + _minutes;
        break;
      case 'Y-M-D H':
        formatTime = _year + '-' + _month + '-' + _date + ' ' + _hours;
        break;
      case 'Y-M-D':
        formatTime = _year + '-' + _month + '-' + _date;
        break;
      case 'Y-M-D zh':
        formatTime = _year + '年' + _month + '月' + _date + '日';
        break;
      case 'YMD':
        formatTime = _year+ ''+_month +''+ _date ;
        break;
      case 'H:I:S':
        formatTime = _hours + ':' + _minutes + ':' + _secconds;
        break
      case 'YM':
        formatTime = _year+ ''+_month+'00' ;
        break;
      case 'Y-M':
        formatTime = _year + '-' + _month;
        break;
      case 'Y':
        formatTime = _year;
        break;
      case 'M':
        formatTime = _month;
        break;
      case 'D':
        formatTime = _date;
        break;
      case 'H':
        formatTime = _hours;
        break;
      case 'I':
        formatTime = _minutes;
        break;
      case 'S':
        formatTime = _secconds;
        break;
      default:
        formatTime = _year + '-' + _month + '-' + _date + ' ' + _hours + ':' + _minutes + ':' + _secconds;
        break;
    }
  }
  // 返回格式化的日期字符串
  return formatTime;
}
/*获取日期相差天数*/
export function getDaysBetween(dateString1,dateString2){
  var  startDate = Date.parse(dateString1);
  var  endDate = Date.parse(dateString2);
  var days=(endDate - startDate)/(1*24*60*60*1000);
  return  days;
}

/**
 * 数字转中文数字
 * @param { num } number 待转换的数字
 */
export const toChinesNum = (num) => {
  let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  let unit = ["", "十", "百", "千", "万"];
  num = parseInt(num);
  let getWan = (temp) => {
    let strArr = temp.toString().split("").reverse();
    let newNum = "";
    for (var i = 0; i < strArr.length; i++) {
      newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
    }
    return newNum;
  }
  let overWan = Math.floor(num / 10000);
  let noWan = num % 10000;
  if (noWan.toString().length < 4) {
    noWan = "0" + noWan;
  }
  return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
}

/**
 *
 * @param baseUrl http头，例如 https://api1.aeotrade.com
 * @param url     需要添加http头的url，例如 /img/oss/aa/a.pdf
 * @returns {string}
 */
export const addHttpBase = (baseUrl, url) => {
  let test1 = /\/$/
  let test2 = /^\//
  // 去掉baseUrl最后的/
  if(test1.test(baseUrl)){
    baseUrl = baseUrl.substring(0, baseUrl.length - 1)
  }
  // 去掉url最前面的/
  if(test2.test(url)){
    url = url.substring(1)
  }
  return baseUrl + '/' + url
}

/** 根据表格内容动态计算每列的宽度
 * @param tableData  传入表格数据
 * @return {key: width, key: width}  返回每个key的宽度
 */
export const calcTableColumnWidth = (tableData) => {
  if(tableData.length === 0)return false   //数组为空，返回false
  let data = JSON.parse(JSON.stringify(tableData))
  // 过滤出需要计算宽度的属性
  let allkeys = Object.keys(data[0])
  // 不需要计算的列  数组
  let unWanted = [
    "_id",
    "DecLists_DecList_CodeTS",
    "InvtHeadType_DclPlcCuscd",
    "InvtHeadType_ImpexpPortcd",
    "InvtHeadType_InvtType",
    "Subscription_blockchain_right_flag",
    "chainHash",
    "biz_id",
    "customs_tax_order_seq_no",
   // "customs_tax_order_tax_order_no",    税费单号
   // "customs_tax_order_tax_type_code",  税费种类代码
    "memberName",
    "tax_refund_order_declare_batch_no",
    "tax_refund_order_declare_month",
   // "tax_refund_order_order_no",   // 退税单号
    "tax_refund_order_refund_amount",
    "uscc",
    "DecLists_DecList_GName",
    "DecLists_DecList_chapter",
    "DecLists_DecList_kind",
    "_unique_key",
    "bid",
    "rule_id",
    "table_type",
    "doc_id",
    "documentCode",
    "dataTypeCode",
    "show_id",
    "count",
    "id",
    "DecHead_DespPortCode",
  ]
  // 得到需要计算宽度的列
  let needCalcKeys = allkeys.filter(item => {return unWanted.indexOf(item) === -1})
  // 初始化每列宽度为 0
  let result = {}
  needCalcKeys.forEach(key => {
    result[key] = 190
  })
  for(let i = 0; i < data.length; i++){
    if(i > 20){   // 考虑性能问题，只计算前21条
      break
    }
    const item = data[i]
    for(let key of needCalcKeys){

      const dom = document.createElement('span');
      dom.style.display = 'inline-block';
      dom.textContent = item[key];
      document.body.appendChild(dom);
      const width = dom.clientWidth;
      document.body.removeChild(dom)

      if(width + 30  > result[key]){
        result[key] = width + 80
      }
    }
  }
  return result
}

/*
节流方法
 */

export const throttle = (callback, time) => {
  let mark = true
  function fun2(e){
    if(mark){
      setTimeout(() => {
        callback(e)
        mark = true
      }, time)
    }
    mark = false
  }
  return fun2
}

/**
 * 清除请求数据对象里面的空属性 例如 {usrname: 'abc', pwd: '123', age: ''} , 清除age属性
 */

export const transReqObj = (Obj) => {
  let temp = {}
  for(let i in Obj){
    if(Obj[i]) temp[i] = Obj[i]
  }
  return temp
}

/**
 * 复制数据
 */
export const copyValue = (value) => {
  let text = value; // 要复制的文本
  let tag = document.createElement('input');
  tag.setAttribute('id', 'copy_content');
  tag.value = text;
  document.getElementsByTagName('body')[0].appendChild(tag);
  document.getElementById('copy_content').select();
  document.execCommand('copy');
  document.getElementById('copy_content').remove();
}

/**
 *  跳转区块链浏览器
 */
export const jumpToBlock = (id) => {
  window.open('https://blockchain-browser.aeotrade.com/aeotradechain/transaction/' + id)
}


/**
 * 延时方法
 * @param time
 * @return {*}
 */
export const sleep = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

/**
 * 重试方法
 * @param asyncFun
 * @param waitTimeArray
 * @return {Promise<boolean|*>}
 */
export const reTry = async (asyncFun, waitTimeArray) => {
  try{
    let waitTime = waitTimeArray.shift()
    if(waitTime){
      await sleep(waitTime)
      return await asyncFun()
    }else{
      // 重试完成，仍然失败，返回false
      return false
    }
  }catch (e) {
    await reTry(asyncFun, waitTimeArray)
  }
}


import wordArray from "crypto-js/enc-utf8";
import base64 from "crypto-js/enc-base64";
import Utf8 from "crypto-js/enc-utf8"

/**
 * Base64加解密方法
 * @type {{encode: (function(*=): *), decode: (function(*=): *)}}
 */
export const Base64 = {
  encode: (str) => {
    return base64.stringify(wordArray.parse(str))
  },
  decode: (str) => {
    return base64.parse(str).toString(Utf8)
  }
}
//获取当前域名及协议
export async function getClientDomain(type) {
  let hostname=window.location.hostname
  let protocol=window.location.protocol
  // 客户端获取域名和协议
  if(type==='protocol'){
    return protocol + "//" + hostname;
  }
  return hostname;
};

