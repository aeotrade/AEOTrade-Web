<script setup>
  import { checkKnownTipsApi, knownTipsApi, apiGetFindMenu,getUserStatus } from '~/api/api'
  import {nextTick, useWorkbenchMenu} from "../.nuxt/imports";

  const Config = useAppConfig()
  const theme=Config
  definePageMeta({
    middleware: ['workbench']
  })
  let { author } = useAuthor();

  const state = reactive({
    win: null,   // appcenter
  })
  const {workbenchMenu}=useWorkbenchMenu();
  const iframeUrl = ref('')
  const kindId = cookies.getItem('kindId')
  const staffId = cookies.getItem('staffId')
  const WORKBENCHNID = cookies.getItem('WORKBENCHNID')
  const memberId = cookies.getItem('memberId')
  const workbenchType = ref('')
  if(kindId < 88){
    workbenchType.value = 'firm'
  }else{
    workbenchType.value = 'person'
  }

  // 获取工作台菜单
  const getMenuParams = {
    id: staffId,
    workbenchId: WORKBENCHNID,
  }
  if(kindId && (kindId-0) < 88){
    getMenuParams.memberId = memberId;
  }else{
    getMenuParams.workbenchId = '1'
  }
  let res= await apiGetFindMenu(getMenuParams);
  workbenchMenu.value=res.result
  const {user} = useUser()
  const createOrgDialogVisible = ref(false)
  const firstCreateOrgTipsVisible = ref(false)
  const NoviceGuideDialogVisible = ref(false)

  const createBtn = () => {
    if(workbenchType.value === 'person'){
      // 创建组织弹窗
      createOrgDialogVisible.value = true
    }else{
      // 创建合约
      location.href = '/workbench/connect/#/baseInfo';
    }
  }

  // 个人工作台，提示创建企业
  const firstCreateOrgTipsCheck =() => {
    let staffId = user.value.bind.staffid
    let type = 'personCreateOrgTip'
    checkKnownTipsApi({memberId: user.value.bind.memberid, staffId, type}).then(res => {
      if (res.result == 0 || !res.result) {
        // 值为 0 或 不存在
        firstCreateOrgTipsVisible.value = true
      } else {
        firstCreateOrgTipsVisible.value = false
      }
    })
  }
  const knownTips = (type) => {
    let staffId = user.value.bind.staffid
    knownTipsApi({
      memberId: user.value.bind.memberid,
      staffId,
      value: 1,
      type
    }).then(res => {
      // console.log(res2)
    })
  }
  const closeHandle=()=>{
       NoviceGuideDialogVisible.value = false
      }
  // 应用中心
  const showAppCenter = ref(false)

  const changeIframe = (url) => {
      iframeUrl.value = url
  }
  const openAppCenter = () => {
    const router = useRouter()
    router.push('/workbench/appcenter')
      setTimeout(()=>{
          changeIframe('')
      },500)
  }

  const tabsRef = ref(null)


  provide("changeIframe",changeIframe)
  const addTab = (menu) => {
    const tabItem = {
      name: menu.title || menu.meta?.title || menu.name,
      icon: menu.icon || menu.meta?.icon,
      url: menu.iframe ? menu.iframeUrl : (menu.path || menu.url)
    }
    tabsRef.value.addTab(tabItem)
  }
  const getUserGuide=()=>{
        let staffId = user.value.bind.staffid
        let type =  'webVideo'
        getUserStatus({memberId: user.value.bind.memberid, staffId, type}).then(res => {
          if (res.result == 0 || !res.result) {
            // 值为 0 或 不存在
              NoviceGuideDialogVisible.value = true
          } else {
              NoviceGuideDialogVisible.value = false
          }
        })
      }

  onMounted(async()=>{
     nextTick(() => {
      getUserGuide();
    })
  })

</script>

<template>
  <WorkbenchHeader></WorkbenchHeader>
  <!--  实名认证弹窗-->
  <div v-if="!author && Config.realNameAuthRule === 'enableWorkbench' && workbenchType === 'firm'" style="position: fixed;z-index: 50;left: 0;top: 50px;width: 100vw;height: calc(100vh - 50px);background: rgba(0,0,0,0.5);">
    <div style="text-align: center;color: #101010;width: 390px;height: 200px;margin: 0 auto;background-color: #fff;transform: translateY(30vh)">
      <div style="margin-bottom: 25px;padding-top: 20px;font-weight: bold">实名认证提醒</div>
      <div style="margin-bottom: 50px">完成组织实名认证后，才可进行更多操作</div>
      <nuxt-link to="/memberCenter/authenticationCenter">
        <el-button type="primary">前往认证</el-button>
      </nuxt-link>
    </div>
  </div>
  <div style="display: flex" v-if="workbenchMenu?.length">

      <WorkbenchMenu
              :menu-data="workbenchMenu"
              :left-style="`width: 220px;border-right: 1px solid #eaeaea;padding: 30px 0px 0px;height: calc(100vh - 50px);box-shadow: 0 1px 5px rgba(61,90,254,.2);`"
              right-style="background-color: #fbfcfd;transform:translateX(2px);padding-top: 10px"
              menu-item-height="45px"
              menu-item-active-bg-color="#eceefa"
              @change="addTab">
        ></WorkbenchMenu>
      <template v-if="workbenchType === 'firm' && theme.appCenter === true">
        <div class="app-center" @click="openAppCenter">
          <img src="~/assets/img/workbench/app_center.svg" width="20" height="20">
          <span>应用中心</span>
        </div>
      </template>



    <!--  右侧内容区-->
    <div style="width: 100%;height: calc(100vh - 50px);max-height: calc(100vh - 50px);display: flex;overflow: auto;background-color: #f7f8f9;">

<!--      <workbench-tabs ref="tabsRef"></workbench-tabs>-->
      <iframe ref="iframeRef" v-if="iframeUrl" id="myIframe" :src="iframeUrl" style="height: 100%;width: 100%;border: none"></iframe>
      <div style="flex: 1;" v-else>
        <nuxt-page ></nuxt-page>
      </div>


    </div>
  </div>

  <workbench-create-org-dialog v-if="createOrgDialogVisible" v-model:visible="createOrgDialogVisible" :loginMessage="user.bind"></workbench-create-org-dialog>
  <workbench-AppCenter v-el-drag-dialog v-if="showAppCenter" v-model:showApp="showAppCenter" :menu="workbenchMenu" style="transform: translate(0, 0);top:calc(50% - 340px);left: calc(50% - 510px);"></workbench-AppCenter>
  <workbench-NoviceGuideDialog  @dialogClose="closeHandle"  v-if="theme.helpCenter && NoviceGuideDialogVisible"></workbench-NoviceGuideDialog>
  <workbench-helpCenter v-if="theme.helpCenter" @userOpenNovice="()=>{NoviceGuideDialogVisible = true}"></workbench-helpCenter>

</template>


<style lang="scss" scoped>
  .create-btn{
    position: fixed;
    top: 70px;
    left: 20px;
    width: 180px;
    height: 40px;
    line-height: 40px;
    border-radius: 3px;
    background-color: var(--el-color-primary);
    color: #fff;
    font-size: 14px;
    text-align: center;
    box-shadow: 0px 4px 6px 0px rgba(var(--el-color-primary-rgb), .2);
    cursor: pointer;
    i{
      font-size: 16px;
    }
    &:hover{
      background-color: rgba(var(--el-color-primary-rgb), 0.8);
    }
  }
  .first-create-tips{
    .title{
      color: rgba(var(--el-color-primary-rgb), 1);
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    .el-icon-close{
      float: right;
      cursor: pointer;
    }
    .desc{
      color: rgba(66, 66, 66, 1);
      font-size: 12px;
      margin-bottom: 20px;
    }
    .el-button{
      width: 80px;
      float: right;
    }
  }
  .app-center {
    position: fixed;
    bottom: 50px;
    left: 20px;
    width: 180px;
    height: 40px;
    border-radius: 3px;
    margin-top: 20px;
    color: #fff;
    font-size: 16px;
    font-weight: bold;
    background: linear-gradient(180deg, rgba(253,182,16,1) 0%,rgba(251,139,14,1) 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    img {
      margin-right: 8px;
    }
  }
  /* 黑暗模式处理*/
  .dark-mode{
    .create-btn{
      border: 1px solid #ffffff;
      &:hover{
         background-color: #ffffff;
         color:var(--el-color-primary)
      }
    }
  }
</style>
