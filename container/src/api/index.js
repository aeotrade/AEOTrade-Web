import {post, get} from '@/utils/request';
export default {
    detail:{
        getInfo: (params) => get('/uac/uac/manager/details', params),
        getAppDetail: (params) => get('/sys/client/version/get/version/number/'+params),
        getAppNewVersion: (params) => get('/sys/client/version/list/new?number='+params)
    },
    user:{
        getIntelligenceList:(params)=>get('/mam/uaw/VipMessage/findMessage',params),
        knownTips:(params)=>get('/uac/uac/staff/update/status',params),
        insertLast:(params)=>get('/mam/uaw/Workbench/insert/last',params),
        details:(params)=>get('/uac/uac/manager/details',params),//
        setCookie:(params)=>post('http://127.0.0.1:7071/controller/example/setCookie',params),
        getCompanyList:(params)=>get('/uac/uac/manager/lists',params),
    }
}
