import { ElMessage } from 'element-plus'
import JSONbig from 'json-bigint'

import type { FetchResponse, SearchParameters } from 'ofetch'
import type { UseFetchOptions, NuxtApp } from '#app'
import type { NavigateToOptions } from '#app/composables/router'
import { callWithNuxt } from '#app'
import {useErrors, useIsLogin} from "~/composables";
import type {RouteLocationRaw} from "#vue-router";
import {useApiLogInfo} from "~/composables/utils/common";
import themeconfig from "assets/themeconfig";


export interface ResOptions<T> {
  result?: T
  data?: T
  code: number | string
  message: string
}

type UrlType = string

export type HttpOption<T> = UseFetchOptions<ResOptions<T>>

function handleError<T>(response: FetchResponse<ResOptions<T>> & FetchResponse<ResponseType>) {
  const err = (text: string) => {
    ElMessage.error(text)

  }
  if (!response._data) {
    err('请求超时，服务器无响应！')
    return
  }
  // const userStore = useUserStore()
  const handleMap: { [key: number]: () => void } = {
    404: () => err('服务器资源不存在'),
    500: () => err('服务器内部错误'),
    403: () => err('没有权限访问该资源'),
    401: () => {
      err('登录状态已过期，需要重新登录')
      //userStore.clearUserInfo()
      // TODO 跳转实际登录页
      navigateTo('/login')
    },
  }
  handleMap[response.status] ? handleMap[response.status]() : err('未知错误！')
}
// get方法传递数组形式参数
function paramsSerializer(params?: SearchParameters) {
  if (!params)
    return

  // const query = useCloneDeep(params)
  const query = JSON.parse(JSON.stringify(params))
  Object.entries(query).forEach(([key, val]) => {
    if (typeof val === 'object' && Array.isArray(val) && val !== null) {
      query[`${key}[]`] = toRaw(val).map((v: any) => JSON.stringify(v))
      delete query[key]
    }
  })
  return query
}


const handleResponseError = async(nuxtApp:any, response:any, data:any,hiddenMessage=false) => {
  if (hiddenMessage)return
  const {errorMsg} = await callWithNuxt(nuxtApp, useErrors)
  nuxtApp.runWithContext(async () =>{
    // @ts-ignore
    // errorMsg.value='访问令牌不合法'
    // ElMessage.error('访问令牌不合法')
    // cookies.removeItem('token')
    const token:any = cookies.getItem('token')
    // console.log(token)
    // console.log( nuxtApp.payload)
    // const currentUrl = nuxtApp.payload?.path.split('?')[0]
    console.log(response)
    if(response?.status === 500 || data?.value?.code == 500){
      errorMsg.value = response?._data?.message || data?.value?.message || '请求出错';

      if(errorMsg.value === '该账户已在其他设备登录' || errorMsg.value === '企业或个人id不能为空'){
        console.log('token过期')
        loginOutCommon()
        // cookies.setItem('token',null)// 清除token
        // await redirectTo(nuxtApp, `/login`, { replace: true })
        // nextTick(() => {
        //   ElMessage({
        //     type: 'error',
        //     message:errorMsg.value
        //   })
        // })
        // return
      }
    }else if(response.status === 401 || data?.value?.code == 401){
      errorMsg.value = response?._data?.message || data?.value?.message ||  '登录信息过期，请重新登录'
      loginOutCommon()
      // cookies.setItem('token',null)
      // await redirectTo(nuxtApp, `/login`, { replace: true })
      // return
    }else{
      errorMsg.value = response?._data?.message || data?.value?.message || '服务器内部异常，请联系管理员！'
    }


  } )

}

// 重定向方法
const redirectTo = async(nuxtApp: NuxtApp, url: RouteLocationRaw | undefined | null, options?: NavigateToOptions): Promise<any> => {
  if(nuxtApp.payload.path !== url){
    if(process.server){
      await callWithNuxt(nuxtApp, navigateTo, [url, options])
    }else{
      navigateTo({path:'/login',replace:true});
      // location.href = url as string
    }
  }

}

export async function fetch<T>(url: UrlType, option: any) {
  let baseUrl = ''
  const nuxtApp = useNuxtApp();
  const token = cookies.getItem("token");
  console.log('token',token)
  const memberId = cookies.getItem('memberId')
  const aiToken = cookies.getItem('aiToken')

  switch (option.requestBaseUrl) {
    case "client":
      baseUrl = 'http://127.0.0.1:7071';
      break;
    case "none":
      baseUrl = '';
      break;
    default:
      baseUrl = useRuntimeConfig().public.baseUrl;
  }
  return new Promise(async (resolve, reject) => {
    await useFetch<ResOptions<T>>(baseUrl + url, {
      // 请求拦截器,
      onRequest({ options }:any) {
        // get方法传递数组形式参数
        options.params = paramsSerializer(options.params)
        // 添加请求头,没登录不携带token
        // const userStore = useUserStore()

        options.headers = new Headers(options.headers)
        // options.headers.set('Access-Control-Allow-Origin', '*');
        // options.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        // options.headers.set('Access-Control-Allow-Headers', 'Content-Type');
        if(url.includes('aiChatbotServer')){
          if(aiToken){
            options.headers.set('Authorization', "Bearer " + aiToken)
          }
        }else {
          if(token){
            options.headers.set('Authorization', "Bearer " + token)
          }
        }

        let time=new Date().getTime();
        if(!url.includes('chainmaker')&&!url.includes('cbd-py')){
          options.headers.set('time', time)
        }
        // options.headers.set('Content-Type', 'application/json')
        if(url.includes('conmngsys') || url.includes('contractserver')){
          options.headers.set('memberId', memberId)
        }
        if(!process.server){
          let log = useApiLogInfo()
          if(log) options.headers.set('log', log)
        }
      },
      // 响应拦截
      async  onResponse(response :any) {
        // console.log(response )
      },
      // 响应错误拦截  400 < status < 600
      async onResponseError({ request, response, options }) {
        console.log('this is onResponseError!!!!!!!!!!!!!!!!!!!!', response)
        console.log('this is request!!!!!!!!!!!!!!!!!!!!', request)
        let resp=null;
        let awaitData=null;
        resp=response;
        if(response._data){
            try{
              awaitData=await response._data
            }catch(e){
              console.log('await error', e)
            }

            console.log('awaitData', awaitData)
            if(awaitData?.message==='该账户已在其他设备登录'){
            resp={status:500,_data:{message:'该账户已在其他设备登录'}}
            }
            // 返回值为空 状态码为401
            if(!awaitData && response.status == 401 ){
              resp={status:401,_data:{message:'用户身份已过期，请重新登陆'}}
            }
        }
         console.log('resp', resp)
        await handleResponseError(nuxtApp, resp, {},options.hiddenMessage)
        reject(resp._data)
      },
      credentials: option.requestBaseUrl === 'client' ? 'same-origin': 'include',
      async parseResponse (responseText:string){
        return JSONbig.parse(responseText)
      },
      // 合并参数
      ...option,

    }).then( async({ data, error }:any) => {
      // 有的接口状态码为200，但响应内容中code码是401或者500
      const code = parseInt(data?.value?.code || 0)
      if(code !== 200 && code != 0 && code != 1000){
        // 处理200和0以外的状态码
        // console.log('response code is :', code)
        await handleResponseError(nuxtApp, {}, data)
        reject(data.value)
      }else if(error.value){
        // console.log('response code is :', error.value)
        // await handleResponseError(nuxtApp, {}, data)
        reject(data.value)
      }

      resolve(data.value || {})

    })
  })

}

// 自动导出
export const useHttp = {
  get: <T>(url: UrlType, params?: any, option?: HttpOption<T>) => {
    return fetch<T>(url, { method: 'get', params, ...option })
  },

  post: <T>(url: UrlType, body?: any, option?: HttpOption<T>) => {
    return fetch<T>(url, { method: 'post', body, ...option })
  },

  put: <T>(url: UrlType, body?: any, option?: HttpOption<T>) => {
    return fetch<T>(url, { method: 'put', body, ...option })
  },

  delete: <T>(url: UrlType, body?: any, option?: HttpOption<T>) => {
    return fetch<T>(url, { method: 'delete', body, ...option })
  },
}

// GET请求
export  const  useHttpGet = <T>(url: UrlType, params?: any, option?: HttpOption<T>) => {
  return fetch<T>(url, { method: 'get', params, ...option })
}

// POST请求
export  const   useHttpPost = async<T>(url: UrlType, body?: any, option?: HttpOption<T>) => {
  return await  fetch<T>(url, { method: 'post', body, ...option })
}

// put 请求
export  const   useHttpPut = async<T>(url: UrlType, body?: any, option?: HttpOption<T>) => {
  return await  fetch<T>(url, { method: 'put', body, ...option })
}

// put 请求
export  const   useHttpDelete = async<T>(url: UrlType, body?: any, option?: HttpOption<T>) => {
  return await  fetch<T>(url, { method: 'delete', body, ...option })
}

