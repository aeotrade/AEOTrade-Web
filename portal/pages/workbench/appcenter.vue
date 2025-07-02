<script setup>
import { apiQueryAppState, apiGetSelfAppInfo, apiGetAppCategoryList ,getSelfApp } from '~/api/api'
import {useWorkbenchMenu} from "~/composables";
const Config = useAppConfig();

const {workbenchMenu}=useWorkbenchMenu();

onMounted(async () => {

  getAppType();
  if(Config.loginEnv=='development'||Config.loginEnv=='staging'){
    state.loginUrl1 = 'sellerptest';
    state.loginUrl2 = 'servicerptest';
    state.loginUrl3 = 'apperp-test';
  }else if(Config.loginEnv=='training'){
    state.loginUrl1 = 'sellerptrain';
    state.loginUrl2 = 'servicerptrain1';
    state.loginUrl3 = 'apperptrain';
  }else {
    state.loginUrl1 = 'sellerpro';
    state.loginUrl2 = 'servicerp';
    state.loginUrl3 = 'apperp';
  }
  await nextTick()
  setTimeout(()=>{
    imgHeight.value = appHeader.value.clientHeight
  },0)

})
const rightItemRef = ref(null)
const scrollbarRef = ref(null)
const {user} = useUser()

const state = reactive({
  loginUrl1: '',//卖家
  loginUrl2: '',//物流
  loginUrl3: '',//应用
  role:0,
  id: user.value.bind.staffid,
  member: user.value.bind.memberid,
  membername: user.value.bind.membername,
  staffname: user.value.user.staffname,
  appList:[],
  loading:false,
  showLoading:null,
  value:'',
  searchList:[],
  options:[],
  selectedIndex: 0,
  timer: null,  // 防抖
  searchResultVisible: false,
  inputFocusShadowColor: "#c0c4cc"
})
const fixed = ref(false);
const appHeader = ref(null);
const imgHeight = ref(0);
const load = () => {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollTop >= 10) {
    fixed.value = true;
  } else {
    fixed.value = false;
  }
};
const nuxtApp = useNuxtApp()
// 打开窗口
const openWindow = (url) => {
  if(url.startsWith('/')){
    url=window.location.origin+'/microapp'+url
  }
  window.open(url)
}
const openApp = (data, options) => {
  console.log(data,options)
  if(typeof data == 'object'){
    if(data && data.clientId && data.clientId ){
      openSelfApp(data)
    }else{
      if(data.url && data.url.indexOf('sso_login') !== -1){
        data.url += `&user_token=E3C81766939E292F943A4EFED58E92B3&hmm_user_id=${state.id}&hmm_user_name=${state.staffname}&hmm_company_id=${state.member}&hmm_company_name=${state.membername}&hmm_user_role=${state.role}&erp_menu=product_list`
      }
      let params = {
        memberId: state.member,
        appId : data.id
      }
      openWindow(data.url)
    }
  }else {
    let item = options.filter(op => op.url === data)[0]
    console.log(item)
    if(item.clientId ){
      openSelfApp(item)
    }else{
      if(state.value){
        if(state.value.indexOf('sso_login') !== -1){
          state.value += `&user_token=E3C81766939E292F943A4EFED58E92B3&hmm_user_id=${state.id}&hmm_user_name=${state.staffname}&hmm_company_id=${state.member}&hmm_company_name=${state.membername}&hmm_user_role=${state.role}&erp_menu=product_list`
        }
        openWindow(state.value)
        state.value = ''
        state.options = [];
      }
    }
  }
}
// 打开自建应用
const openSelfApp = (item) => {
  apiGetSelfAppInfo({id: item.id}).then(res=>{
    openWindow(res.result)
  })
}
const remoteMethod = (query) => {
  if (query !== '') {
    state.loading = true;
    setTimeout(() => {
      state.loading = false;
      state.options = state.searchList.filter(item => {
        return item.appName.indexOf(query) > -1;
      });
    }, 200);
  } else {
    state.options = [];
  }
}

const getAppType = async() => {
  await nextTick()
  const list = await useWorkbenchList()
 const {result} =  await getSelfApp({
            pageNo:1,
            pageSize:100,
            sort:'desc',
            memberId:state.member
            })

      let selfObj = {
        cid:"10000",
        appTypeName:'自建应用',
        img:'blockChain',
        appCloudList:result
      }
      console.log(result,'result')
  apiGetAppCategoryList({vipTypeId: list[0].viptypeId,status:1}).then(res=>{
    let appList = res.result
    appList.unshift(selfObj)
    state.appList = appList?.filter(item => item.appCloudList?.length);
    state.appList.forEach(item=>{
      if(item.appCloudList.length){
        state.searchList.push(...item.appCloudList)
      }
    })
    setLastMargin();
  })
}
const setLastMargin = () => { // 这个方法直接在mounted里面执行
  nextTick(() => {
    let dom = rightItemRef.value[state.appList.length - 1]
    let scrollbarEl = scrollbarRef.value?.wrapRef;
    scrollbarEl.onscroll = (e)=>{
      rightScrollEvent(e)
    }

    let height = parseInt(window.getComputedStyle(dom).height)
    dom.style.marginBottom = `calc(100vh - ${height + 350}px)`
  })
}
const typeClick = (index) => {
  // 高亮并滚动
  state.selectedIndex = index
  rightItemRef.value[index].scrollIntoView({behavior: 'smooth'})
}
const rightScrollEvent = (e) => {
  debounce(() => {
    let rightWrapEle = e.target
    let scrollTop = rightWrapEle.scrollTop  // 滚动的高度
    for(let i = 0 ; i < rightItemRef.value.length; i++){
      let item = rightItemRef.value[i]
      let offsetTop = item.offsetTop
      let scrollHeight = item.scrollHeight
      if(scrollTop < (offsetTop + scrollHeight) && scrollTop > (offsetTop-55)){
        state.selectedIndex = i
      }
    }
  }, 50)
}
// 防抖
const debounce = (fn, time) => {
  if(state.timer){
    clearTimeout(state.timer)
  }
  state.timer = setTimeout(() => {
    state.timer = null;
    fn()
  }, time)
}
const createApp = () => {
  // 判断是否有开发平台菜单
  let menu = workbenchMenu.value
  if(menu && menu.some(m => m.title === '开放平台')){
    // 有菜单跳转开放平台
    let openMenu = menu.filter(m => m.title === '开放平台')[0];
    openMenu &&  openWindow(openMenu.path)
  }else{
    // 没菜单提示没权限
    ElMessage.warning({
      message: '当前您暂无开放平台创建应用权限，请联系管理员！',
      offset: 190
    })
  }
}
const tempFlag = ref(false)
</script>

<template>
  <div style="margin: 0 auto;padding: 16px 15px;width: 100%">
    <div class="app-header">
      <img src="@/assets/img/workbench/search-bg.png" ref="appHeader">
      <div class="search-box">
        <el-input :style="`--el-input-focus-border-color: #fff;--el-input-hover-border-color: #fff`" class="search-input"
                  v-model="state.value"
                  @click="tempFlag = true"
                  @blur="tempFlag = false"
                  @input="remoteMethod"
                  placeholder="搜索关键词或应用"
                  clearable
                  prefix-icon="search">
        </el-input>
        <div class="result" v-if="(tempFlag || state.searchResultVisible) && state.options.length" @mouseenter="state.searchResultVisible=true" @mouseleave="state.searchResultVisible = false">
          <div class="result-item el-select-dropdown__item" v-for="item in state.options" :key="item.id" @click="openApp(item, state.options)">
            <span style="font-weight: bold">{{item.appName}}</span>&nbsp;&nbsp;{{item.subhead?.length>15?item.subhead?.slice(0,15)+'...':item.subhead}}
          </div>
        </div>
        <div style="text-align:center;color:#666;" class="result" v-if="(tempFlag || state.searchResultVisible) && !state.options.length && state.value" @mouseenter="state.searchResultVisible=true" @mouseleave="state.searchResultVisible = false">
          <span>无数据</span>
        </div>
      </div>
    </div>
    <div class="app-list" :style="{height:`calc(100vh - ${imgHeight + 100}px)`}">
      <div :class="{'fixed':fixed}" v-if="Config.appCenterCategory || Config.appCenterCreateBtn" style="border-bottom: 1px solid #dbdbdb;height: 50px;display: flex">
        <el-scrollbar v-if="Config.appCenterCategory" style="flex: 1;height: 50px;" class="left">
          <div style="display: flex;column-gap: 50px;">
            <a
                @click="typeClick(index)"
                :class="['type-title', state.selectedIndex === index ? 'active' : '']"
                v-for="(type, index) in state.appList"
                :key="type.cid"
            >
              <svg-icon v-if="type.img" :icon-class="type.img" style="font-size:14px;"></svg-icon>
              <span style="margin-left: 5px">{{type.appTypeName}}</span>
            </a>
          </div>
        </el-scrollbar>
        <el-button style="margin-left: auto;position: relative;top: -4px;" v-if="Config.appCenterCreateBtn" type="primary" @click="createApp" class="create-app-btn">
          创建应用
        </el-button>
      </div>

      <el-scrollbar ref="scrollbarRef" style="height: calc(100% - 50px);margin-top:20px;">
        <div style="padding: 25px 0px 25px 0px;">
          <div ref="rightItemRef" v-for="(item) in state.appList" :key="item.cid" class="right-item">
            <div :id="item.cid" v-if="Config.appCenterCategory" class="type-name">{{item.appTypeName}}</div>
            <div class="app-wrap">
              <div @click="openApp(app)" class="app-item" v-for="app in item.appCloudList" :key="app.id" >
                <div style="width: 50px;height: 50px;position: relative;margin-right: 12px;">
                  <img :src="app.appLogo" width="50" height="50" style="border-radius: 50%;object-fit: cover;">
                  <div v-show="state.showLoading===app.id" class="loading"></div>
                </div>

                <div class="app-dsc">
                  <div class="title">{{app.appName}}</div>
                  <div class="app-info" v-if="app.subhead">{{app.subhead.length>10?app.subhead.slice(0,10)+'...':app.subhead}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>

    </div>
    <!--    <iframe style="display: none"  frameborder=0 name="showHere" scrolling=auto-->
    <!--             :src="'https://'+loginUrl1+'.aeotrade.com/web/sso_login?user_token=E3C81766939E292F943A4EFED58E92B3&hmm_user_id='+id+'&hmm_user_name='+staffname+'&hmm_company_id='+member+'&hmm_company_name='+membername+'&hmm_user_role='+role+'&erp_menu=product_list'">-->
    <!--    </iframe>-->
    <!--    <iframe style="display: none"  frameborder=0 name="showHere" scrolling=auto-->
    <!--             :src="'https://'+loginUrl2+'.aeotrade.com/web/sso_login?user_token=E3C81766939E292F943A4EFED58E92B3&hmm_user_id='+id+'&hmm_user_name='+staffname+'&hmm_company_id='+member+'&hmm_company_name='+membername+'&hmm_user_role='+role+'&erp_menu=product_list'">-->
    <!--    </iframe>-->
    <!--    <iframe style="display: none"  frameborder=0 name="showHere" scrolling=auto-->
    <!--             :src="'https://'+loginUrl3+'.aeotrade.com/web/sso_login?user_token=E3C81766939E292F943A4EFED58E92B3&hmm_user_id='+id+'&hmm_user_name='+staffname+'&hmm_company_id='+member+'&hmm_company_name='+membername+'&hmm_user_role='+role+'&erp_menu=product_list'">-->
    <!--    </iframe>-->
  </div>
</template>

<style scoped lang="scss">

:deep(.el-input__inner){
  background: transparent;
  border: none;
  color: #919AAC!important;
}
.fixed{
  position: fixed;
  top: 100px;
}
.loading{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 50%;
  background-image: conic-gradient(transparent 0deg, transparent 95deg, black 95deg);
  opacity: .4;
}
.app-list{
  width: 100%;
  /*height: calc(100vh - 265px);*/
  /*height: 71vh;*/
  /*height: 630px;*/
  padding: 10px 20px 20px 20px;
  background-color: #fff;
  position: relative;
}

.app-list .left{

  .type-title{
    display: flex;
    align-items: center;
    color: rgba(85, 90, 111, 100);
    font-size: 14px;
    height: 47px;
    line-height: 47px;
    padding-left: 5px;
    padding-right: 5px;
    flex-shrink: 0;
    &:hover{
      cursor: pointer;
      color: var(--el-color-primary);
    }
  }
  .active{
    box-sizing: content-box;
    border-bottom: 3px solid var(--el-color-primary);
    color: var(--el-color-primary);
  }
}
.app-list{
  .right-item{
    margin-bottom: 26px;
    .type-name{
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 18px;
    }
    .app-wrap{
      display: flex;
      flex-wrap: wrap;
      .app-item{
        margin: 0 20px 20px 0px;
        width: 300px;
        height: 105px;
        display: flex;
        font-size: 14px;
        color:#101010 ;
        align-items: center;
        padding-left: 20px;
        border: 1px solid rgba(242, 242, 247, 100);
        background: #fff;
        cursor: pointer;
        &:hover{
          box-shadow: 0px 0px 20px 0px rgba(var(--el-color-primary-rgb), .10);
        }
        .title{
          display: -webkit-box;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-box-orient: vertical;
        }
        .app-info{
          font-size: 12px;
          margin-top: 2px;
          color: #9199AC;
        }
      }
    }

  }
}
.app-header{
  position: relative;
  /*height: 200px;*/
  /*background: url("@/assets/img/workbench/search-bg.png");*/
  /*background-size: 100% 100%;*/
  /*padding-top: 75px;*/
  z-index: 1;
  margin-bottom: 16px;
  .search-box{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 660px;
    margin: 0 auto;
    :deep(.el-input__prefix){
      margin-left: 5px;
      font-size: 20px;
    }
    .result{
      width: 100%;
      position: absolute;
      background-color: #fff;
      padding: 10px 45px;
      /*position: relative;*/
      box-shadow: 0px 2px 6px 0px rgba(var(--el-color-primary-rgb), 0.15);
      z-index: 10;
      .result-item{
        padding: 0;
      }
    }
  }
}
.search-input{
  width: 660px;
  height: 50px;
  margin: 0 auto;
}
.create-app-btn{
  line-height: 30px;
  padding: 0;
  width: 80px;
  height: 30px;
  transform: translateY(10px);
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
}
</style>
