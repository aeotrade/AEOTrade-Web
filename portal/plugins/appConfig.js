import theme from '@/assets/themeconfig'
import {apiGetSystemConfig} from "~/api/api";

export default defineNuxtPlugin(async nuxtApp => {
    const config = await apiGetSystemConfig({theme: '门户及工作台配置'})
    if(config.result && config.result.themeContent){
        let data = {}
        try{
            data = JSON.parse(config.result.themeContent)
        }catch (e){
            data = {}
        }
        updateAppConfig(Object.assign(theme,data))

    }
})
