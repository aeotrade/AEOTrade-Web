import {useInfoState} from "~/composables";
export default defineNuxtPlugin (async(nuxtApp)=>{
    const route=useRoute()
    const path = route.path
    if(path === '/login') return

    let  {user}=useUser()
    const token = useCookie('token')
    let  userLoginData=useIsLogin().value
    if(!user.value && token.value){
       let  res =  null
        res = await useInfoState().catch(e => {
            console.warn('plugin[user]: get user info error', e)
        })
        user.value=res
        userLoginData.isLogin = true
    }


})
