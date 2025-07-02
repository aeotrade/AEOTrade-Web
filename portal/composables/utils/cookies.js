import { useCookie } from "nuxt/app";
import theme from "@/assets/themeconfig";

export const cookies={
    getItem:(key)=>{
        return useCookie(key).value
    },
    setItem:(key,val)=>{
        useCookie(key).value=val
    },
    removeItem:(key)=>{
        useCookie(key,{ expires: new Date(0)}).value=null;
    }
}
