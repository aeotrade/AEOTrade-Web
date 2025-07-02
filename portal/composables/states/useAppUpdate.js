import { useState } from "nuxt/app";



// 用户信息
export const useAppUpdate = () =>{
    return useState("appUpdate",() => {
        return{
            show:false, updateInfo:null
        }

    });

}



export const useCurrentVersion =()=>{
    const currentVersion= useState("currentVersion",() => 0)
    return currentVersion
}


