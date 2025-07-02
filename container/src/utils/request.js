import axios from 'axios'
import {Message} from 'element-ui';
import token from '@/utils/auth'
import JSONbig from 'json-bigint';
import crypto from '@/api/crypto'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000 // request timeout

})

service.interceptors.request.use(
  config => {
    if (token.getItem('token')) {
      config.headers['Authorization'] ='bearer ' + token.getItem('token');
      let time=new Date().getTime();
      config.headers['time'] =time;
      config.headers['uscc'] =token.getItem('UC');
      if(config.method=="post"&&config.data&&config.url.indexOf('controller')<0){
        let data=crypto.encrypt(config.data,time)
        config.data={param:data}
      }
      if(config.url.includes('conmngsys')){
        config.headers['memberId'] =  token.getItem('memberId');
      }
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(

  response => {
    const res = response.data
    if (parseInt(res.code) != 200 &&  parseInt(res.code) != 0) {
      Message({
        'message': res.message,
        'type': 'error',
        'duration': 5 * 1000
      });
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      if(response.headers.time){
        let result=res.result;
        result= crypto.decrypt(res.result,response.headers.time);
        let lastResult=JSONbig.parse(result)
        if(lastResult.code==200 || lastResult.code == 0 ){
          return lastResult;
        }else {
          return Promise.reject(new Error(lastResult.message || 'Error'))
        }
      }
      return res;
    }
  },
  error => {
    return Promise.reject(error)
  }
)
// get方法
export function get(url, params) {
  return new Promise((resolve, reject) => {
    service.get(url, {
      params,
    }).then((res) => {
      resolve(res);
    }).catch((err = {}) => {
      reject(err);
    });
  });
}

// post方法
export function post(url, params) {
  return new Promise((resolve, reject) => {
    service.post(url, params).then((res) => {
      resolve(res.data);
    }).catch((err = {}) => {
      reject(err);
    });
  });
}

export default service
