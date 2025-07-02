import { useHttpGet as get, useHttpPost as post, useHttpDelete as deleteF, useHttpPut as put } from "@/composables";


function obj2Params(data) {
  if(!data) return ''
  return Object.keys(data).map(key => {
    if(data[key] === undefined) return encodeURIComponent(key) + '='
    if(typeof data[key] === 'object'){
      return encodeURIComponent(key) + '=' + encodeURIComponent(JSON.stringify(data[key]))
    }
    return encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
  }).join('&')
}

   export const getUserInfo =  (params) => get('/uac/uac/manager/details',params)                      // 获取用户信息
   export const getUserCompany =  (params) => get('/uac/uac/member/name',params)                      // 获取用户公司
   export const getUserCompanyNameByid =  (params) => get('/uac/uac/member/ids',params)                      // 获取用户公司
   export const postUserCompanyNameByid =  (params) => post('/uac/uac/member/ids',params)                      // 获取用户公司 post方法
   export const getConnector = (params) => get('/conmngsys/api/connectors',params)                      // 获取连接器
   export const getConnectorType =  (params) => get('/conmngsys/api/connectors-categories',params,)                      // 获取连接器分类
   export const getBanner =  (params) => get('/pms/home/advertise/list?&pageNum=1&pageSize=10&type='+params,{},)                      // 获取连接器图片
   export const getMyConnector =  (params) => get('/conmngsys/api/org-connectors',params,)                      // 获取我的连接器
   export const getMyConnectorDetail =  (params) => get('/conmngsys/api/org-connectors/'+params,{},)                     // 获取我的连接器详情
   export const getConnectorDetail =  (params) => get('/conmngsys/api/connectors/'+params,{})                      // 获取连接器详情
   export const getConnectorsAccounts =  (params) => get('/conmngsys/api/org-connectors-accounts',params)                      // 获取连接器账号列表
   export const getConnectorsAccountsDetail =  (params) => get('/conmngsys/api/org-connectors-accounts/'+params,{})         // 获取连接器账号列表详情
   export const getConnectorsConfig =  (params) => get('/conmngsys/api/org-connectors-account-config-item',params)         // 获取连接器账号配置项
   export const delConnectorsAccounts =  (params) => deleteF('/conmngsys/api/org-connectors-accounts/'+params,{})         // 获取连接器账号列表详情
   export const EditConnectorsAccounts =  (id,params) => put('/conmngsys/api/org-connectors-accounts/'+id,params)        // 编辑连接器账号
   export const testConnect =  (params) => post('/conmngsys/api/org-connectors-accounts/connect-test',params)         // 测试连接
   export const addAccounts =  (params) => post('/conmngsys/api/org-connectors-accounts',params,{})         //  添加我的连接器账号
   export const openUserConnect =  (params) => post('/conmngsys/api/org-connectors',params)         //  开启我的连接器
   export const openUserOtherParams =  (params) => get('/conmngsys/api/org-connectors-event-action-params',params)         //  开启我的连接器
   export const getChainMessage =  (params) => get('/conmngsys/api/connector-up-chain-records',params)         //  获取链上信息
   export const getVersionNo =  (id1,id2) => get(`/conmngsys/api/org-connectors/${id1}/version-status?client_ex_id=${id2}`,{})       //  组织连接器客户端版本状态
   export const saveUserTokenNew =  (params) => get('/atcl/connector/api/save_user_token/', params)   // 保存用户token new
   export const getRemoteParams =  (params,url) => get(url,params,{'requestBaseUrl':'none'})                      // 获取连接器账号列表
   export const postRemoteParams =  (params,url) => post(url,params,{'requestBaseUrl':'none'})                      // 获取连接器账号列表

    //与海龙对接协作合约模块接口
  export const  getContracttpl = (params)=>get('/contractserver/contracttpl',params) // 获取合约模板市场列表
  export const  getContracttplType = (params)=>get('/contractserver/contracttplkind',params) // 获取合约模板市场列表分類
  export const  getContracttplDetail = (params)=>get('/contractserver/contracttpl/'+params,{}) // 获取合约模板详情
  export const  creatContracttpl = (params)=>post('/contractserver/contract',params) //   从模板创建协作合约
  export const  editContracttpl = (params,options)=>put('/contractserver/contract',params,options) //    修改协作合约
  export const  getmyContracttplList = (params)=>get('/contractserver/contract',params) // 获取我的协作合约列表
  export const  getmyContracttplListDetail = (params)=>get('/contractserver/contract/'+params,{}) // 查看协作合约详情
  export const  getContractrecord = (params)=>get('/contractserver/contractrecord',params)  // 获取协作记录
  export const  getContractrecordProcess = (params)=>get('/contractserver/contractprocess',params)  // 获取协作过程
  export const  startContract = (params)=>put(`/contractserver/contract/${params}/start`,{}) // 启动合约
  export const  stopContract = (params)=>put(`/contractserver/contract/${params}/shutdown`,{}) //暂停合约
  export const  delContract = (params)=>deleteF(`/contractserver/contract/${params}`,{}) // 刪除暫存的合约
  export const  getStratCom = (params)=>get(`/contractserver/contract/participate`,{params}) //获取所有合约发起方
  export const  getPartInfo = (params)=>get('/contractserver/cor',params) //获取部分启动合于信息
  export const  hiddenContract = (params)=>post('/contractserver/coc',params) //隐藏合约
  export const  showHiddenContract = (params)=>put('/contractserver/coc',params) //显示隐藏合约
  // stopContract:(params)=>put(`/contract/${params}/shutdown`,{},'third'), //暂停合约
    export const apiConnectorsOpened = (params) => post(`/conmngsys/api/connectors-opened`,params)  // 获取文件类型


   // 冲刺01旧接口
     export const getConnectorTemplateList = (params) => get('/satcl/api/connection_contract_model/',params)        // 获取合约模板信息列表
     export const getMainData = (params) => get('/conmngsys/api/master-data-models',params)        // 获取合约模板信息列表
     export const searchShareData =  (params) => post('/satcl/api/connect_record/',params)        // 获取合约模板信息列表
     export const authConnector =  (data) => post('/satcl/api_user_new/start_user_auth/', obj2Params(data))   // 授权协议 我的连接器
     export const saveUserToken = (params) => get('/satcl/api_user_new/save_user_token/', params)   // 保存用户token
     export const createConnectorCert = (params) => get('/cloud/app/cloud/save/robot/ccie', params)         // 创建连接器证书
     export const getMainModelList = (params) => get('/satcl/api_user_new/get_doc_type/')  // 获取主数据模型
     export const getTemplateModelList = () => get('/satcl/api_user_new/get_contract_type/')  // 获取合约模板信息列表2  只包含id和名称
     export const getMyShareContract = (data) => post('/satcl/api_user_new/collection_task/', obj2Params(data))   // 获取我的共享合约列表
     export const createMyShareContract = (data) => post('/satcl/api_user_new/create_task_status/',obj2Params(data)) // 创建我的共享合约
     export const startMyShareContract = (data) => post('/satcl/api_user_new/start_task_status/', obj2Params(data))   // 启动
     export const delMyShareContract  = (data) => post('/satcl/api_user_new/delete_task/', obj2Params(data))  // 删除我的共享合约
     export const stopMyShareContract  = (data) => post('/satcl/api_user_new/stop_task_status/', obj2Params(data))   // 暂停
     export const getMyShareContractStatus = (data) => post('/satcl/api_user_new/get_collection_type/', obj2Params(data))  // 获取我的共享合约状态
     export const apiGetFileTypeList = () => get('/atcl/query/record/file/all')  // 获取文件类型
     export const apiPostFileTypeRecord = (params) => post(`/atcl/query/record/file/lable`,params)  // 获取文件类型


  // 存证校验的api
  export const checkHashExist =  (data) => post('/chaingrpc/query/contract', data)   // 检查hash是否上链
  export const getBlockchainInfoFromJava =  (data) => post('/chaingrpc/query/block', data)   // 从java获取一部分区块链信息
  export const getBlockchainInfoFromPython =  (params) => get('/conmngsys/api/connector-up-chain-verification', params, )  // 从python获取一部分区块链信息
