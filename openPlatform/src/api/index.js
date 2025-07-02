import {post, get ,deleteF ,put} from './request';

export default {
  app: {
    getUserInfo: (params) => get('/uac/uac/manager/details', params),
    getUserCompanyList: (params) => get('/uac/uac/manager/lists', params),
    updateLastMemberId: (params) => get('/mam/uaw/Workbench/insert/last', params),
    userLogin: (data) => post('/uaa/social/login', data),
    getUserCompany: (params) => get('/uac/uac/member/name', params),
    getUserCompanyNameByid: (params) => get('/uac/uac/member/ids', params),
    vipList:(params)=>get('/mam/uaw/VipMessage/list',params),
    getModels: (params) => get('/api/master-data-models',params,'second'),
    getVipInfos: (params) => get('/mam/uaw/VipMessage/findMessage', params),
    getVipType: (params) => get('/mam/uaw/VipType/find/mam', params),
    createApp: (data) => post('/mam/app/save', data),
    updateApp: (data) => post('/mam/app/update', data),
    delApp: (params) => get('/mam/app/delete/byid', params),
    getAppList: (params) => get('/mam/app/find/cloud', params),
    getAppByID : (params) => get('/mam/app/find/byid', params)
  },
  appmng: {
    getAppList: (data) => get('/cloud/app/cloud/find/cloud', data),
    createApp: (data) => post('/cloud/app/cloud/save', data),
    updateApp: (data) => post('/cloud/app/cloud/update', data),
    delApp: (data) => get('/cloud/app/cloud/delete', data),
    getAppDetailById: (data) => get('/cloud/app/cloud/findById', data),
    getAppSecretById: (data) => get('/cloud/app/cloud/get/secret', data),
    resetAppSecret: (data) => get('/cloud/app/cloud/secret', data)
  },
  connector:{
    getConnectors: (params) => get('/open-platform/api/connectors',params,'second'),
    delConnector: (id) => deleteF('/open-platform/api/connectors/'+id,{},'second'),
    createConnector: (params) => post('/open-platform/api/connectors',params,'second'),
    getCategories: () => get('/open-platform/api/connectors-categories',{},'second'),
    getCategoriesInfo: (id) => get('/open-platform/api/connectors/'+id,{},'second'),
    updateCategoriesInfo: (params,id) => post('/open-platform/api/connectors/'+id,params,'second'),
    getAccount: (id) => get('/open-platform/api/connectors/'+id+'/account-model-configs',{},'second'),
    getAccountInfo: (id,configId) => get('/open-platform/api/connectors/'+id+'/account-model-configs/'+configId,{},'second'),
    changeAccount: (id,configId) => post('/open-platform/api/connectors/'+id+'/account-choose/'+configId,{},'second'),
    saveAccountInfo: (id,configId,params) => post('/open-platform/api/connectors/'+id+'/account-model-configs/'+configId,params,'second'),
    getEvent: (id,params) => get('/open-platform/api/connectors/'+id+'/trigger-events',params,'second'),
    infoEvent: (id,eventId) => get('/open-platform/api/connectors/'+id+'/trigger-events/'+eventId,{},'second'),
    creatEvent: (id,params) => post('/open-platform/api/connectors/'+id+'/trigger-events',params,'second'),
    editEvent: (id,eventId,params) => post('/open-platform/api/connectors/'+id+'/trigger-events/'+eventId,params,'second'),
    delEvent: (id,eventId) => deleteF('/open-platform/api/connectors/'+id+'/trigger-events/'+eventId,{},'second'),
    getAction: (id,params) => get('/open-platform/api/connectors/'+id+'/execute-actions',params,'second'),
    infoAction: (id,actionId) => get('/open-platform/api/connectors/'+id+'/execute-actions/'+actionId,{},'second'),
    creatAction: (id,params) => post('/open-platform/api/connectors/'+id+'/execute-actions',params,'second'),
    editAction: (id,actionId,params) => post('/open-platform/api/connectors/'+id+'/execute-actions/'+actionId,params,'second'),
    delAction: (id,actionId) => deleteF('/open-platform/api/connectors/'+id+'/execute-actions/'+actionId,{},'second'),
    getVersion: (id,params) => get('/open-platform/api/connectors/'+id+'/versions',params,'second'),
    infoVersion: (id,versionId) => get('/open-platform/api/connectors/'+id+'/versions/'+versionId,{},'second'),
    creatVersion: (id,params) => post('/open-platform/api/connectors/'+id+'/versions',params,'second'),
    editVersion: (id,id1,params) => post('/open-platform/api/connectors/'+id+'/versions/'+id1,params,'second')
  }
};


