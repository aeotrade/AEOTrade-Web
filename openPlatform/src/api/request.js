import axios from 'axios';
import { Message,Loading,Notification,MessageBox } from 'element-ui';
import store from '@/store';
import token from '@/utils/auth';
import tokenBox from "@/utils/auth";
import {getClientDomain} from "@/utils";
const loadingInstances = [];

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API1,
})

service.interceptors.request.use(
  config => {
    const loadingInstance = Loading.service({
      background: 'rgb(0,0,0,0)'
    });
    if (config.requestBaseUrl === 'second') {
      config.baseURL = process.env.VUE_APP_BASE_API2;
    }else if(config.requestBaseUrl === 'third'){
      config.baseURL = process.env.VUE_APP_BASE_API3;
    }else{
      config.baseURL = process.env.VUE_APP_BASE_API1;
    }
    loadingInstances.push(loadingInstance);
    if (token.getItem('token')) {
      config.headers['Authorization'] ='bearer ' + token.getItem('token');
       config.headers['memberid'] =  token.getItem('memberId');  //暂时注释 上测试记得放开

    }
    return config;
  },
  error => {

    return Promise.reject(error);
  }
)

service.interceptors.response.use(

  res => {

    const code = parseInt(res.data.code);
    loadingInstances.pop().close();
      if (code != 200 && code != 0 && code != 2 && code != 3 && code != 4 && code != 1000) {
      Message({
        message: res.data.message,
        type: 'error'
      })
      return Promise.reject( res.data);
    }
    return res.data;

  },
  error => {
    loadingInstances.pop().close();
    if(error.response.status === 401){
      store.state.info=''
      token.removeItem('token');

      if (window.self != window.top ){
        window.parent.location.href=getClientDomain('protocol')+'/login'
      }else{
        window.location.href=getClientDomain('protocol')+'/login'
      }
    }

    else if(error.response.status === 500 && error.response.data.message === '该账户已在其他设备登录'){

      MessageBox.confirm(
        '该账户已在其他设备登录！',
        '系统提示',
        {
          confirmButtonText: '确定',
          showCancelButton: false,
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          type: 'warning'
        }
      ).then(() => {
        tokenBox.removeItem('kindId');
        tokenBox.removeItem('token');
        tokenBox.removeItem('memberId');
        tokenBox.removeItem('staffId');
        if (window.self != window.top ){
          window.parent.location.href = getClientDomain('protocol')+'/login'
        }else{
          window.location.href = getClientDomain('protocol')+'/login'
        }

      })
    }else{

      let msg = ''
      if(error == 'Error: Network Error'){
        msg = '网络错误'
      }
      Message({
        'message': msg || error.response.data.message || error.message,
        'type': 'error',
        'duration': 5 * 1000
      });

    }
  }
)
// get方法
export function get(url, params,requestBaseUrl) {
  return new Promise((resolve, reject) => {
    service.get(url, {
      params,
      requestBaseUrl
    }).then((res) => {
      resolve(res);
    }).catch((err = {}) => {
      reject(err);
    });
  });
}

// post方法
export function post(url, params,requestBaseUrl) {
  return new Promise((resolve, reject) => {
    service.post(url, params,{requestBaseUrl}).then((res) => {
      resolve(res);
    }).catch((err = {}) => {
      reject(err);
    });
  });
}


// delete方法
export function deleteF(url, params,requestBaseUrl) {
  return new Promise((resolve, reject) => {
    service.delete(url, {params,requestBaseUrl}).then((res) => {
      resolve(res);
    }).catch((err = {}) => {
      reject(err);
    });
  });
}

// put方法
export function put(url, params,requestBaseUrl) {
  return new Promise((resolve, reject) => {
    service.put(url, params,{requestBaseUrl}).then((res) => {
      resolve(res);
    }).catch((err = {}) => {
      reject(err);
    });
  });
}

export default service;
