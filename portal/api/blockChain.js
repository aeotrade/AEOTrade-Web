import { useHttpGet, useHttpPost } from "@/composables";

export const getCbdData = (query,params) => {
    return useHttpGet('/cbd-py/api/cbd/' + query + '?type=global', params, { lazy: false });
  };


  export const getBlockData1 = (params) => {
    return useHttpGet('/bc/find/chainmaker?ChainId=aeotradechain&cmb=Decimal', params, { lazy: false });
  };

  export const getBlockData2 = (params) => {
    return useHttpGet('/bc/find/chainmaker?ChainId=aeotradechain&Limit=20&cmb=GetBlockList', params, { lazy: false });
  };

  export const getBlockData3 = (params) => {
    return useHttpGet('/bc/find/chainmaker?ChainId=aeotradechain&Limit=20&cmb=GetTxList', params, { lazy: false });
  };

  export const getBlockData4 = (params) => {
    return useHttpGet('/chain/chainmaker?ChainId=aeotradechain&Offset=0&Limit=20&NodeName=&OrgId=&cmb=GetNodeList', params, { lazy: false });
  };

  export const getBlockData5 = (params) => {
    return useHttpGet('/chain/chainmaker?ChainId=aeotradechain&cmb=GetTransactionNumByTime', params, { lazy: false });
  };

  export const getBlockData6 = (params) => {
    return useHttpGet('/uaa/social/big/screen', params, { lazy: false });
  };


  // 存正校验
  export const getCheckData = (query,params) => {
    return useHttpGet( `/chain/chainmaker?Id=${query}&ChainId=aeotradechain&cmb=Search`  , params, { lazy: false });
  };

// 获取大屏数据
  export const getBcData=async(params)=>{
      return useHttpGet('/bc/get/data', { lazy: false,params })
  };

