import {useState} from "nuxt/app";

export  const useIsLogin = () => useState("IsLogin",()=>{
    return {
        isLogin:false,
        isError:false
    }
})
