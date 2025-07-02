import {useWorkbench} from "~/composables/states/useUser";
import {cookies} from "~/composables";
import { apiGetWorkbenchList,apiGetClientCookie,getFirmStaffInfoApi } from "~/api/api";

export default defineNuxtRouteMiddleware(async (to, from) => {
    let  {user}=useUser()
    let staffId = cookies.getItem('staffId');
    let memberId = cookies.getItem('memberId')
    let kindId=cookies.getItem('kindId');
    const {workbench} = useWorkbench();
    let { author } = useAuthor();
    if (memberId &&  author.value === '') {
    let res = await  getFirmStaffInfoApi({ memberId: memberId })
        if (res.result && res.result.sgsStatus == 0) {
          author.value = false
        }else{
          author.value =  true
        }

      }
    let params={
        apply:kindId==99?0:1,
        id:kindId==99? staffId : memberId
    }
    let res= await apiGetWorkbenchList(params).catch(async e => {
            console.log('middleware[workbench]: get workbench list error', e)
            return false
        })
    if(!res) return navigateTo('/login?path=/workbench')

    let list=res.result;
    workbench.value=list
    let currentWorkbench = list[0]
    cookies.setItem('WORKBENCHNID', currentWorkbench?.workbenchId)
    cookies.setItem('WORKBENCHN', currentWorkbench?.workbenchName)

    const mbId = useState('memberId', () => '')
    if(memberId && (mbId.value !== memberId)){
        try{
            mbId.value = memberId
            let orgRes = await getTxListApi(memberId)
            if (orgRes.result) {
                let orgInfo = orgRes.result
                cookies.setItem('did', orgInfo.did)
            }
        }catch(e){
            console.log('apiGetChainInfoErr: ', e )
        }
    }
})
