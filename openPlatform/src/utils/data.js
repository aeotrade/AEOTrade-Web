// 档案类型 下拉框 数据
import store from "@/store";
import router from "@/router";
import wordArray from "crypto-js/enc-utf8";
import base64 from "crypto-js/enc-base64";

export const archivesType = [
      { 'label': '全部类型','value': ''},
      { 'label': '一般进口','value': 'jin_kou'},
      {'label': '一般出口','value': 'i_e_dec_mesagges'},
      {'label': '保税进口','value': 'baoshuijinkou'},
      {'label': '保税出口','value': 'baoshuichukou'},
      {'label': '跨境进口','value': 'kuajingjinkou'},
      {'label': '跨境出口','value': 'kuajingchukou'},
  ];

// 单证类型 自动采集单证
export const docTypeParse = {
  "dec_order": "报关单",
  "customs_tax_order": "税费单",
  "tax_refund_order": "退税单",
  "check_register": "核注清单",
  "ceb_import_inventory": "跨境进口清单",
  "ceb_export_inventory": "跨境出口清单",
  "inv_data_collector": "发票",
  "purchase_order": "采购订单",
  "sales_order": "销售订单",
  "work_sheel": "物流工单"
}

// 单证类型
export const docType = [
  {name: ''}
]

// 数据来源  下拉
export const dataSource = [
  {name: '单一窗口', value: 'sw'},
  {name: '卖家ERP', value: 'mj'},
  {name: '服务商ERP', value: 'fw'},
  {name: '税控设备', value: 'sk'}
]

// 数据来源  列表解析
export const dataSourceParse = {
  "sw": "单一窗口",
  "mj": "卖家ERP",
  "fw": "服务商ERP",
  "sk": "税控设备"
}

export const collectStatusParse = {
  "0": "未启动",
  "1": "采集中",
  "2": "已完成",
  "3": "失败",
  "4": "等待中"
}

// 报关单回执状态解析
export const receiptStatusParse = {
  '0' : '暂存',
  'L' : '入库',
  '2' : 'QP接收成功，上载发往数据中心',
  '6' : 'QP接收成功，申报发往数据中心',
  'N' : '重传文件',
  '3' : '上载成功',
  '4' : '上载失败',
  '7' : '申报成功',
  '8' : '上载未申报（无申报权限）',
  '9' : '上载申报失败（与数据中心联系）',
 // 'L' : '海关已接收',
  'B' : '担保放行',
  'E' : '不被受理',
  'H' : '需手工申报',
  'Z' : '退回修改',
  'G' : '报关单已审结',
  'F' : '放行交单',
  'T' : '需交税费',
  'Y' : '申报失败',
  'D' : '海关删单',
  'M' : '报关单重审',
  'R' : '结关',
  'P' : '报关单放行',
  'W' : '进出口审结/查验/放行通知',
  'I' : '进出口审结/查验/放行通知',
  'C' : '出口查验通知',
  'S' : '施检',
  'a' : '签证',
  'K' : '提货放行',
  '1' : '要求补充申报通知',
}

export function apiLogInfo(){
  // ------------ 用户名称和企业名称，用于后端日志记录 --------------
  let staffname = '', membername = '', pagename = '', belongsystem = '', pagemenuid = '';
  if(store.state.user.info){
    let info = store.state.user.info
    staffname = info.user.staffname
    membername = info.bind.membername
  }
  pagename = router.currentRoute.meta.title
  belongsystem = router.currentRoute.meta.webSys
  pagemenuid = router.currentRoute.meta.menuId
  let wa = wordArray.parse(`${staffname},${membername},${pagename},${belongsystem},${pagemenuid}`)
  let b64 = base64.stringify(wa)
  return b64
}

