import { useState } from "nuxt/app";
import {
    apiGetUserInfo,
    apiGetWorkbenchList,
    apiGetDefaultWorkbench,
    apiGetWorkbenchDetail,
    apiGetWorkbenchLast, apiGetFindMenu
} from "~/api/api";
import {cookies, useWorkbench, useWorkbenchMenu} from "~/composables";



// 通用状态
export const commonStates = () => useState("commonStates",() => {
    return {
        routerWhiteList: ['/login', '/registry', '/',"/blockChain"]
    }
})
// 获取登录信息
export const useInfoState = async () => {
    let kindId = cookies.getItem('kindId');
    let params = {
        memberId: '',
        staffId: cookies.getItem('staffId'),
        type: ''
    }
    if(!params.staffId ){
        window.dispatchEvent(new Event('app:logout'))
        loginOutCommon()
        return
    }
    if (kindId == 99||kindId==88) {
        params.type=1
    }else{
        let memberId = cookies.getItem('memberId');
        params.memberId=memberId
        params.type=2
    }
    return new Promise((resolve, reject) => {
        apiGetUserInfo(params).then(res=>{
            resolve(res.result)
        }).catch(e => {
            reject(e)
        })

    })
}

// 获取工作台列表
export const useWorkbenchList = async () => {
    const kindId=cookies.getItem('kindId');
    const {workbench} = useWorkbench();
    let params={
        apply:kindId==99?0:1,
        id:kindId==99?cookies.getItem('staffId'):cookies.getItem('memberId')
    }
    //获取工作台列表
    let res= await apiGetWorkbenchList(params)
    let list=res.result;
    if(list.length>=1){
        list.sort((a,b)=>{return a.workBenchId - b.workBenchId})
    }
    workbench.value=list
    return  list
}

// 获取工作台列表
export const useDefaultWorkbench = async () => {
    let params={
        memberId:cookies.getItem('memberId'),
        staffId:cookies.getItem('staffId')
    }
    let res=await apiGetDefaultWorkbench(params)
    return res.result
}


// 工作台入口处理
export const useWorkbenchPermission= async () => {
    const {workbenchMenu}=useWorkbenchMenu();
    const {workbench} = useWorkbench();

    const staffId = cookies.getItem('staffId');
    const memberId = cookies.getItem('memberId')
    const kindId=cookies.getItem('kindId');
    const WORKBENCHNID=cookies.getItem('WORKBENCHNID');


    // 获取工作台列表
    let params={
        apply:kindId==99?0:1,
        id:kindId==99? staffId : memberId
    }
    let res= await apiGetWorkbenchList(params)
    let list=res.result;
    if(list.length>=1){
        list.sort((a,b)=>{return a.workBenchId - b.workBenchId})
    }
    workbench.value=list


    // 获取默认工作台
    let defaultWorkbench=null
    let params2 = {
        memberId: memberId,
        staffId: staffId
    }
    let res2 = await apiGetDefaultWorkbench(params2)

    defaultWorkbench = res2.result


    if(list.length>0){
        let items=list.find((n)=>n.workbenchStatus>0);

        if(defaultWorkbench){
            try {
                list.forEach((item,index)=>{
                    if(item.workbenchId===defaultWorkbench){
                        items=item;
                        list.splice(index,1);
                        list.unshift(item)
                        workbench.value=list
                        throw ''
                    }
                })
            }catch (e) {

            }

        }
        let params={
            "staffId": staffId,
            "memberId": staffId
        };

        // 如果已经缓存了工作台id
        // eslint-disable-next-line no-invalid-this
        if(WORKBENCHNID){

            // try {
            //   list.forEach((item)=>{
            //     // eslint-disable-next-line no-invalid-this
            //     if(item.workbenchId==WORKBENCHNID){
            //       items=item;
            //       // eslint-disable-next-line no-throw-literal
            //       throw '匹配到了';
            //     }
            //   });
            // }catch (e) {
            //   console.log('catch bench id')
            //   params.code=items.code;
            //   await workbenchJump(items,params);
            // }

            let filterItem = list.filter(item => item.workbenchId==WORKBENCHNID)[0]
            if(filterItem){
                items = filterItem
                params.code=items.code;
                await workbenchJump(items,params);
            }

        }else {
            // items=workbenchList[0];
            params.code=list[0].code;
            await workbenchJump(items,params );
        }

        // const kindId=cookies.getItem('kindId');
        const getMenuParams = {
            id: staffId,
            workbenchId: WORKBENCHNID,
        }
        if(kindId && (kindId-0) < 88){
            // 企业工作台
            getMenuParams.memberId = memberId;
        }
        let res= await apiGetFindMenu(getMenuParams);
        workbenchMenu.value=res.result

    }
}
//工作台跳转
export  const workbenchJump= async (items,params)=>{
    // console.log(items,params)
    const kindId = cookies.getItem('kindId')
    const staffId = cookies.getItem('staffId')
    const memberId = cookies.getItem('memberId')

    cookies.setItem('channelColumnsId',items.channelColumnsId)
    cookies.setItem('WORKBENCHN',items.workbenchName)
    cookies.setItem('groupId',items.groupId);
    sessionStorage.setItem('WORKBENCHNTYPE',`<a target="_blank" style="color: #3D5AFE;margin-left: 12px;font-size: 12px;text-decoration: none;" href="${getClientDomain('protocol')}/memberCenter/memberPackage/package?id=${items.viptypeId}&&name=${items.typeName}">${items.uawVipClass.className}</a>`)
    cookies.setItem('WORKBENCHNID',items.workbenchId)



    let data={
        memberId:memberId,
        workBenchId:items.workbenchId,
        staffId:staffId
    }
    if(kindId>88){
        data={
            memberId:'',
            workBenchId:1,
            staffId:staffId
        }
    }

    // await apiGetWorkbenchLast(data)
    // await apiGetWorkbenchDetail(params)
    await Promise.all([ apiGetWorkbenchLast(data), apiGetWorkbenchDetail(params)])

}

// 合约名称 -- 父子路由通信

export const useContractName =()=>{
    const ContractName= useState("ContractName",() => '')
    return ContractName

}

// 合约当前执行节点


export const useContractStep =()=>{
    const ContractStep= useState("ContractStep",() => '/connect/processEngine/baseInfo')
    return ContractStep

}
