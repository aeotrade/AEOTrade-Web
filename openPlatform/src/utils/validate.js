
import {Message} from 'element-ui';
/**
 * @参数 {string} path
 * @返回值 {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * 验证不为空
 * @参数 {string} str
 * @返回值 {Boolean}
 */
export function validateNotEmpty (value){
  if (value !== null && value!== undefined && value !== '') {
    return true;
  }
  Message({
    'message': '请填写完整的信息！',
    'type': 'error',
    'duration': 5 * 1000
  });
  // callback(new Error('不能为空'));
}
/**
 * 验证手机号
 * @参数 {string} path
 * @返回值 {Boolean}
 */
export function validatePhone(str) {
  if(/^1[3456789]\d{9}$/.test(str)){

    return true;
  }
  Message({
    'message': '手机号码错误！',
    'type': 'error',
    'duration': 5 * 1000
  });
  return false;
}
