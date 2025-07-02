const env = import.meta.env.VITE_THEME || 'hmm'
let  themeConfig  = {
  "hmm": {
    themeColor : `@use "@/assets/style/element/index.scss" as element;`, // element主题颜色配置
    link:"/favicon.svg",// 站点图标 替换需要在public目录下进行
    theme:'var(--el-color-primary)',
    themeModel:'light',//  黑暗模式 or 白天模式
    webTitle:'慧贸OS', // 名称 下面的是站点描述
    webKeywords: '慧贸OS, AEOTradeOS, 产业互联操作系统,贸易科技联盟,慧贸贸, 慧贸天下,信贸链, 智能合约, ai, AI, AI助理, BI工具,数据资产保管箱, 电子档案, 全球订单追踪,单一窗口申报, 单一窗口订阅, 报关单, 税费单, 退税单, 核注清单, 跨境清单',
    webDesc:"慧贸OS，建立在EBC技术理念上的产业级软件平台。它帮助用户将各种系统和组件以“服务积木”的形式组装集成，让用户通过一个操作平台完成全场景业务运营与管理工作，并实现全量全要素数据归集、确权和利用，推动业务操作、经营决策和客户服务全面数字化、智能化。慧贸OS与“信贸链”可信贸易协作网络无缝连接，帮助用户轻松与合作伙伴进行信息共享、业务协同，形成共生、共赢产业协作生态。“慧贸OS+应用矩阵+信贸链”，为用户提供了超越传统ERP模式的数字化转型新范式，用户数字化升级将更加敏捷、高效，低成本，低风险！",
    cookieDomain:'', // cookie 增删改查相关
    componentsMode:"hmm", // 组件使用模式  @/assets/theme/ 下的组件的使用模式
    loadingImg:'http://aeotrade-launch-advisor.oss-cn-zhangjiakou.aliyuncs.com/e0f77754-0e5a-4f4f-8552-22c31ecffaf2.png',
    laodingDesc:'小慧正在为您努力加载中，请稍后......', // loading组件
    spaLoadingPage:'spa-loading-template.html',// 页面刷新时的loading html页面
  }
}

const theme = themeConfig[env]
export default theme

