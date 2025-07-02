import { useHttpGet, useHttpPost } from "@/composables";
export const getHttpGoodsList = (params) => {
  return useHttpGet("demo/goods", params, { lazy: true });
};

export const getRevenue = (params) => {
  return useHttpPost("/group/revenue/getRevenue", params,{ lazy: false, });
};
export const apiLogin = async (url, params, type, headers) => {
  if (type == "get") {
    return await useHttpGet(url, params, { lazy: false });
  } else {
    return await useHttpPost(url, params, { lazy: false, headers });
  }
};
export const getWxloginQR = async (params) => {
  return await useHttpPost('/mq/wx/user/weChatQrCode', params, { lazy: false});
};

export const pollingWxloginStatus = async (params) => {
  return await useHttpGet('/uaa/social/login/scan/ck', params, {lazy: false});
}

export const sendCode = async (params) => {
  return useHttpPost("/uac/uac/vcode/sms/send", params, { lazy: false });
};
export const findMobile = async (params) => {
  return useHttpGet("/uaa/social/find/mobile", params, { lazy: false });
};
export const apiGetUserInfo = (params) => {
  return useHttpGet("/uac/uac/manager/details", params, { lazy: false });
};

export const apiGetCatalogDetails = async (params) => {
  return await useHttpGet("/pms/catalog/list/details", params, { lazy: false });
};

export const getWxCover = async (params, options) => {
  return await useHttpGet("/wx/wxcat/cover", params, { lazy: false, ...options });
};

export const getUseCaseCatalogList = async (params) => {
  return await useHttpGet("/pms/catalog/list", params, { lazy: false });
};

export const getAdverList = async (params) => {
  return  await useHttpGet("/pms/home/advertise/list", params, { lazy: false });
};
// // 获取大屏数据
// export const getBcData=async(params)=>{
//     return useHttpGet('/bc/get/data', { lazy: false,params })
// }
// // 获取数据
// export const getScreenData=async(params)=>{
//     return useHttpGet('/uaa/social/big/screen', { lazy: false,params })
// }

export const getVipTypeCode = async (params) => {
  return useHttpGet("/mam/uaw/VipType/findbycode", params, { lazy: false });
};
// 获取banner 广告图片
export const getAdvertisebanner = async (params) => {
  return useHttpGet("/pms/home/advertise/list", params, { lazy: false });
};

// 获取链接器分类
export const getConncetKind = async (params) => {
  return useHttpGet('/conmngsys/api/connectors-categories', params, { lazy: false });
};


// 获取链接器
export const getConnectors = async (params) => {
  return useHttpGet('/conmngsys/api/connectors', params, { lazy: false });
};

// 获取链接器详情
export const getConnectorsDetails = async (id) => {
  return useHttpGet('/conmngsys/api/connectors/'+id, {}, { lazy: false });
};

// 开通链接器
export const openConnectors = async (params) => {
  return useHttpPost('/conmngsys/api/org-connectors',params, { lazy: false });
};

//获取合约模板分类
export const getContractKinds = async (params) => {
  return useHttpGet('/contractserver/contracttplkind', params, { lazy: false });
};

// 获取合约模板列表

export const getContractList= async (params) => {
  return useHttpGet('/contractserver/contracttpl', params, { lazy: false });
};

// 获取合约模板详情
export const getContractListDetails= async (id) => {
  return useHttpGet('/contractserver/contracttpl/'+id, {}, { lazy: false });
};



/**
 * 获取工作台左侧菜单
 * @param params
 * @return {Promise<*>}
 */
export const apiGetFindMenu = async (params) => {
  return useHttpGet("/mam/uaw/WorkbenchMenu/find/menu", params, {
    lazy: false,
  });
};

export const apiGetCompanyList =  (params) => {
  return useHttpGet("/uac/uac/manager/lists", params, { lazy: false });
};
export const insertLast = async (params) => {
  return useHttpGet("/mam/uaw/Workbench/insert/last", params, { lazy: false });
};
export const getCode = async (params) => {
  return useHttpPost("/uac/uac/vcode/sms/send", params, { lazy: false });
};
export const createOrgApi = async (params) => {
  return useHttpPost("/uac/uac/manager/add/member", params, { lazy: false });
};
export const checkKnownTipsApi = async (params) => {
  return useHttpGet('/uac/uac/staff/status', params, { lazy: false });
}
export const knownTipsApi = async (params) => {
  return useHttpGet("/uac/uac/staff/update/status", params, { lazy: false });
};
export const getClassIdApi = async (params) => {
  return useHttpGet("/mam/uaw/Rights/findByClassId", params, { lazy: false });
};

export const apiSetClientCookie = async (params) => {
  return useHttpPost(
    "/controller/example/setCookie",
    params,
    { lazy: false, requestBaseUrl: 'client' }
  );
};
export const apiGetClientCookie = async (params) => {
  return useHttpGet("/controller/example/getCookie", params, { lazy: false, requestBaseUrl: 'client' });
};
//会员中心id
export const getAppId = async (params) => {
  return useHttpGet("/mam/uaw/Workbench/get/appid", params, { lazy: false });
};
//会员中心菜单
export const getMemberMenu = async (params) => {
  return useHttpGet("/mam/uaw/WorkbenchMenu/find/menu", params, { lazy: false });
};
//会员中心banner
export const getBannerApi = async (params) => {
  return useHttpGet("/pms/home/advertise/list", params, { lazy: false });
};
export const getTxListApi = async (params) => {
  return useHttpGet('/bc/chain/cert/ca/tenant/get/byid/'+ params, {},{ lazy: false });
};
export const getFirmStaffInfoApi = async (params) => {
  return useHttpGet('/uac/sys/user/info',params, { lazy: false });
};
// 获取角色
export const getHmmRolesApi = async (params) => {
  return useHttpGet('/mam/uaw/VipType/find/mam',params, { lazy: false });
};
//获取企业信息
export const getFirmMessageApi = async (params) => {
  return useHttpGet('/uac/uac/member/findlist',params, { lazy: false });
};
//获取首页信息入驻资质列表
export const getIntelligenceListApi = async (params) => {
  return useHttpGet('/mam/uaw/VipMessage/findMessage',params, { lazy: false });
};
//修改企业信息
export const changeFirmMessageApi = async (params) => {
  return useHttpPost('/uac/uac/member/update',params, { lazy: false });
};
//获取主管理员
export const  getMainManagerApi = async (params) => {
  return useHttpGet('/uac/sys/master/admin',params, { lazy: false });
};
//获取员工列表
export const getStaffListApi = async (params) => {
  return useHttpGet('/uac/uac/staff/list',params, { lazy: false });
};
//设置主管理员
export const setMainManagertApi = async (params) => {
  return useHttpGet('/uac/sys/admin',params, { lazy: false });
};
//添加员工
export const addStaffApi = async (params) => {
  return useHttpGet('/uaa/social/staff/callback',params, { lazy: false });
};
//删除员工
export const delStaffApi = async (params) => {
  return useHttpGet('/uac/uac/manager/delete/staff',params, { lazy: false });
};
//获取已有角色类型
export const getRolesByUserIdApi = async (params) => {
  return useHttpGet('/sys/admin/hmm/role',params, { lazy: false });
};
//获取角色类型
export const getRolesListApi = async (params) => {
  return useHttpGet('/sys/role/listAll',params, { lazy: false });
};
//分配角色类型
export const assignRolesApi = async (params) => {
  return useHttpGet('/sys/admin/staff/update', params, {lazy: false });
};
//分配角色类型
export const businessManageApi = async (params) => {
  return useHttpGet('/mam/uaw/WorkbenchMenu/findbyDefault',params, { lazy: false });
};
//获取角色模型相关菜单
export const listRoleApi = async (params) => {
  return useHttpGet('/sys/role/listMenu/'+params,{}, { lazy: false });
};
//获取角色类型
export const getRolesListsApi = async (params) => {
  return useHttpGet('/sys/role/list',params, { lazy: false });
};
//获取角色类型
export const updateRoleStatusApi = async (id,params) => {
  return useHttpGet('/sys/role/updateStatus/' + id + '?status=' + params.status,{}, { lazy: false });
};
export const deleteRoleApi = async (params) => {
  return useHttpPost('/sys/role/delete?'+params,{}, { lazy: false });
};
export const addRoleApi = async (params) => {
  return useHttpPost('/sys/role/create',params,{ lazy: false });
};
export const updateRoleApi = async (params) => {
  return useHttpPost('/sys/role/update',params,{ lazy: false });
};
export const addRoleMenuApi = async (params) => {
  return useHttpPost('/sys/role/allocMenu',params,{ lazy: false });
};
export const getNodeInfoApi = async (params) => {
  return useHttpGet('/bc/chain/cert/ca/tenant/findById',params,{ lazy: false });
};
export const getGroupListApi = async (params) => {
  return useHttpGet('/mam/uaw/VipTypeGroup/findPageAll',params,{ lazy: false });
};
export const getIntelligenceApi = async (params) => {
  return useHttpGet('/mam/uaw/VipMessage/findMessage',params,{ lazy: false });
};
//获取会员类型列表
export const getMemberClassListApi = async (params) => {
  return useHttpGet('/mam/uaw/VipClass/findBytid',params,{ lazy: false });
};
//获取会员类型列表
export const checkOrderApi = async (params) => {
  return useHttpGet('/pay/query/payment',params,{ lazy: false });
};
//获取会员类型列表
export const payOrderApi = async (params) => {
  return useHttpPost('/pay/execute/payment',params,{ lazy: false });
};
//获取会员类型列表
export const orderDetailApi = async (params) => {
  return useHttpGet('/pay/hmm/order/find/order/bynumber',params,{ lazy: false });
};
//开通会员获取订单类型
export const getOrderTypeApi = async (params) => {
  return useHttpPost('/mam/uaw/VipClass/findtype',params,{ lazy: false });
};
//开通会员
export const openMemberApi = async (params) => {
  return useHttpPost('/pay/hmm/order/insert',params,{ lazy: false });
};
//获取资质类型对应列表
export const isAouthApi = async (params) => {
  return useHttpGet('/uac/uac/manager/isAouth',params,{ lazy: false });
};
//取消订单
export const cancelOrderApi = async (params) => {
  return useHttpGet('/pay/hmm/order/cancelorder',params,{ lazy: false });
};
//订单开票
export const invoiceOrderApi = async (params) => {
  return useHttpGet('/pay/hmm/order/invoiceorder',params,{ lazy: false });
};
//获取订单详情
export const buyOrderApi = async (params) => {
  return useHttpPost('/pay/hmm/order/mam/page',params,{ lazy: false });
};
//获取订单详情
export const getAuthenticationTypeListApi = async (params) => {
  return useHttpGet('/uac/sgs/list/all/front',params,{ lazy: false });
};
//检查验证码
export const checkCodeApi = async (params) => {
  return useHttpGet('/uac/uac/manager/note',params,{ lazy: false });
};
export const bangdingApi = async (params) => {
  return useHttpGet('/uaa/social/login/bangding',params,{ lazy: false });
};
//获取开户银行
export const getBankApi = async (params) => {
  return useHttpGet('/uac/uac/BankName/find/BankName',params,{ lazy: false });
};
//提交银行信息
export const submitBankInfoApi = async (params) => {
  return useHttpPost('/uac/sgs/bank/save',params,{ lazy: false });
};
//验证金额
export const checkMoneyApi = async (params) => {
  return useHttpGet('/uac/sgs/bank/money',params,{ lazy: false });
};//提交企业认证信息
export const submitCredentialInfoApi = async (params) => {
  return useHttpPost('/uac/sgs/member/idc/save',params,{ lazy: false });
};

export const staffApi = async (params) => {
  return useHttpGet('/bc/chain/cert/user/member/list/staff',params,{ lazy: false });
};
//部门列表
export const deptListApi = async (params) => {
  return useHttpGet('/uac/dept/list',params,{ lazy: false });
};
//添加部门
export const deptSaveApi = async (params) => {
  return useHttpPost('/uac/dept/save',params,{ lazy: false });
};
//编辑部门
export const deptEditApi = async (params) => {
  return useHttpPost('/uac/dept/update',params,{ lazy: false });
};
//详情部门
export const deptDetailApi = async (params) => {
  return useHttpGet('/uac/dept/findByid',params,{ lazy: false });
};
//删除部门
export const deptDeleteApi = async (params) => {
  return useHttpGet('/uac/dept/delete',params,{ lazy: false });
};
export const staffInfoApi = async (params) => {
  return useHttpGet('/uac/uac/find/staff/info',params,{ lazy: false });
};
/**
 * 获取工作台列表
 * @param params
 * @return {Promise<*>}
 */
export const apiGetWorkbenchList=(params)=>{
  return useHttpGet("/mam/uaw/VipMessage/findMessage", params, { lazy: false });

}
/**
 * 获取默认工作台
 * @param params
 * @return {Promise<*>}
 */
export const apiGetDefaultWorkbench=(params)=>{
  return useHttpGet("/mam/uaw/Workbench/get/redis", params, { lazy: false });

}
/**
 * 获取工作台详情
 * @param params
 * @return {Promise<*>}
 */
export const apiGetWorkbenchDetail=(params)=>{
  return useHttpGet("/uaa/social/find/status", params, { lazy: false });
}
/**
 * 设置最后一次登录工作台
 * @param params
 * @return {Promise<*>}
 */
export const apiGetWorkbenchLast=(params)=>{
  return useHttpGet("/mam/uaw/Workbench/insert/last", params, { lazy: false });
}
/**
 * 获取客户端版本信息
 * @param params
 * @return {Promise<*>}
 */
export const apiGetAppNewVersion=async (params)=>{
  return useHttpGet('/sys/client/version/list/new?number='+params);
}
/**
 * 获取客户端版本详情
 * @param params
 * @return {Promise<*>}
 */
export const apiGetAppDetail=async (params)=>{
  return useHttpGet('/sys/client/version/get/version/number/'+params);
}

/**
 * 绑定微信账号
 * @param params
 * @return {Promise<any>}
 */
export const apiBindingWxAccount = async (params) => {
  return useHttpPost("/uaa/social/wechat/build", params)
}

/**
 * 根据用户id获取用户信息
 * @param params
 * @return {Promise<any>}
 */
export const apiGetStaffInfo = (params) => {
  return useHttpGet('/uac/uac/staff', params)
}
// 和上面的接口一样，只是用于区分
export const apiGetStaffInfoCopy = (params) => {
  return useHttpGet('/uac/uac/staff/user', params)
}

export const apiGetStaffPwd = (params) => {
  return useHttpGet('/uaa/social/find/user/staff/id', params)
}

/**
 * 获取我的企业列表
 * @param params
 * @return {Promise<any>}
 */
export const apiGetMyCompanyList = (params) => {
  return useHttpGet('/uac/uac/manager/staff/member/list', params)
}

export const apiUpdateUserInfo = (params) => {
  return useHttpPost('/uac/uac/update', params)
}

/**
 * 修改密码
 * @param params
 * @return {Promise<any>}
 */
export const apiUpdateUser = (params) => {
  return useHttpPost('/uaa/social/update/user', params)
}

/**
 * 给当前账号添加账号和密码
 * @param params
 * @return {Promise<any>}
 */
export const apiAddUserAccount = (params) => {
  return useHttpPost('/uaa/social/binding/user', params)
}

/**
 * 校验手机短信验证码
 * @param params
 * @return {Promise<any>}
 */
export const apiVerifyPhoneCode = (params) => {
  return useHttpGet('/uac/uac/manager/note', params)
}

/**
 * 绑定/更换手机号
 * @param params
 * @return {Promise<any>}
 */
export const apiBindingPhone = (params) => {
  return useHttpGet('/uaa/social/binding/mobile', params)
}

/**
 * 检查用户名是否已存在
 * @param params
 * @return {Promise<any>}
 */
export const apiCheckUserName = (params) => {
  return useHttpGet('/uaa/social/find/user', params)
}

/**
 * 发送短信验证码
 * @param params
 * @return {Promise<any>}
 */
export const apiSendPhoneCode = (params) => {
  return useHttpPost('/uac/uac/vcode/sms/send', params)
}

/**
 * 检查能否退出企业
 * @param params
 * @return {Promise<any>}
 */
export const apiQuitCompanyCheck = (params) => {
  return useHttpGet('/uac/uac/manager/quit/member', params)
}

/**
 * 删除员工
 * @param params
 * @return {Promise<any>}
 */
export const apiDelStaff = (params) => {
  return useHttpGet('/uac/uac/manager/delete/staff', params)
}

/**
 * 获取信贸链上的用户证书和组织证书
 * @param params
 * @return {Promise<any>}
 */
export const apiGetCertList = (params) => {
  return useHttpGet('/bc/chain/cert/user/member/list/staff', params)
}

/**
 * 查询应用是否开通  已废弃
 * @param params
 * @return {Promise<any>}
 */
export const apiQueryAppState = (params) => useHttpGet('/cloud/app/cloud/appinfo/query', params)

/**
 * 查询自建应用信息
 * @param params
 * @return {Promise<any>}
 */
export const apiGetSelfAppInfo = (params) => useHttpGet('/cloud/app/cloud/skip/url', params)

/**
 * 获取所有应用
 * @param params
 * @return {Promise<any>}
 */
export const apiGetAppCategoryList = (params) => useHttpGet('/mam/category/find/vip/all', params)

// 获取员工状态
export const getUserStatus = (params) => useHttpGet('/uac/uac/staff/status', params)
// 更新员工状态
export const updateUserStatus = (params) => useHttpGet('/uac/uac/staff/update/status', params)

// 企业重置为未认证状态
export const changeSysStutes = (params) => useHttpGet('/uac/sgs/member/update/sgs/status', params)
//获取所有应用
export const getCloudAllAppList = (params) => useHttpGet('/cloud/app/list/all', params)
// 单一窗口登录
export const singleAccesstoken = (params) => useHttpPost('/uaa/open/get/accesstoken', params)
export const singleLogin = (params) => useHttpPost('/uaa/single/get/user', params)
export const ysLogin = (params) => useHttpGet('/uaa/oms/user/login', params)
export const bjbgLogin = (params) => useHttpPost('/drainage/ccba/login', params) // 北京报关协会登录

// 应用管理页面 - 获取应用列表
export const apiGetAppList = (params) => useHttpGet('/cloud/app/cloud/find/open/app', params)

// 应用管理页面 - 获取应用分类
export const apiGetAppCategory = (params) => useHttpGet('/cloud/app/cloud/category/all')

// 应用管理页面 - 保存应用权限
export const apiPostSaveAppAuthority = (data) => useHttpPost('/cloud/app/cloud/find/open/app', data)

// 获取系统配置
export const apiGetSystemConfig = (params) => useHttpGet('/sys/theme/current', params)

// 注册接口
export const registerApi = (params) => useHttpPost("/uaa/social/register", params, { lazy: false });

// 添加员工到当前企业
export const apiAddStaff = (params) => useHttpPost('/uac/uac/manager/admin/add/staff', params)
/**
 * 消息中心
 * @param params
 * @return {Promise<any>}
 */
// 根据用户id查询用户所有信息
export const getMsgInfoApi = (params) => useHttpGet('/msgs/message/find/message/bystaffid', params)
//获取消息详情
export const getMsgDetailApi = (params) => useHttpGet('/msgs/message/find/message/byid', params)
//标记已读
export const handleReadApi = (params) => useHttpGet('/msgs/message/update/all/read', params)

// aiChatbotServer 接口

export const loadAiScreen = (params) => useHttpPost('/aiChatbotServer/api/kimi/asst/position/asst_detail', params, { lazy: false, })


// ai 登录
export const aiAccountLogin = (params) => useHttpPost('/aiChatbotServer/api/account/oauth/login_by_hmm_token', params, { lazy: false, })



// 开放平台查询企业创建的所有应用

export const appFindCloud = (params) => useHttpGet('/mam/app/find/cloud', params)

 // 获取自建应用 /cloud/app/cloud/find/cloud
 export const getSelfApp = (params) => useHttpGet('/cloud/app/cloud/find/cloud', params)

// 获取凭证列表
export const vcList = async (params) => {return useHttpGet('/chain/did/vc/list',params,{ lazy: false });};
// 获取认证记录
export const vcLog = async (params) => {return useHttpGet('/chain/did/vc/apply/log',params,{ lazy: false });};
export const refreshDid = async (params) => {return useHttpPost('/uac/uac/manager/send/chain/add/member',params,{ lazy: false });};

// 获取我的圈子列表
export const getMyCircleList = (params) => useHttpGet('/chain/circle/my', params)

// 获取我加入的圈子列表
export const getJoinedCircleList = (params) => useHttpGet('/chain/circle/my/join', params)

// 获取我创建或加入的圈子列表(下拉选项使用)
export const getMyOrJoinedCircleList = (params) => useHttpGet('/chain/circle/my/own', params)

// 获取推荐的圈子列表
export const getRecommendCircleList = (params) => useHttpGet('/chain/circle/recommend', params)

// 获取圈子详情
export const getCircleDetail = (params) => useHttpGet('/chain/circle/detail', params)

// 获取圈子成员列表
export const getCircleMemberList = (params) => useHttpGet('/chain/circle/member/list', params)

// 加入圈子
export const postJoinCircle = (params) => useHttpPost('/chain/circle/join', params)

// 退出圈子
export const postQuitCircle = (params) => useHttpPost('/chain/circle/quit', params)

// 保存需求
export const postSaveDemand = (params) => useHttpPost('/chain/requirement/create', params)

// 获取需求详情
export const getDemandDetail = (params) => useHttpGet('/chain/requirement/detail', params)

// 更新需求
export const postUpdateDemand = (params) => useHttpPost('/chain/requirement/update', params)

// 发布需求或产品到圈子
export const postPublish = (params) => useHttpPost('/chain/info/publish', params)

// 撤销发布
export const postUnPublish = (params) => useHttpPost('/chain/info/cancel', params)

// 获取需求列表
export const getDemandList = (params) => useHttpGet('/chain/requirement/list', params)

// 获取产品列表
export const getProductList = (params) => useHttpGet('/chain/product/list', params)

// 保存产品
export const postSaveProduct = (params) => useHttpPost('/chain/product/create', params)

// 更新产品
export const postUpdateProduct = (params) => useHttpPost('/chain/product/update', params)

// 获取产品详情
export const getProductDetail = (params) => useHttpGet('/chain/product/detail', params)

// 供需匹配分析
export const getAiMatch = (params) => useHttpGet('/chain/info/match', params)

// 需求匹配产品列表
export const getAiMatchProduct = (params) => useHttpGet('/chain/match/supply/list', params)

// 产品匹配需求列表
export const getAiMatchDemand = (params) => useHttpGet('/chain/match/demand/list', params)