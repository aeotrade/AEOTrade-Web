<template>
  <div class="">
    <WorkbenchHeader v-if="(props.error.statusCode == 404||props.error.statusCode == 500)&&props.error.url.startsWith('/workbench')"></WorkbenchHeader>
    <ThemeHeader v-else :type="type"></ThemeHeader>
    <div class="page404">
      <div v-if="props.error.statusCode == 404">
        <img  src="@/assets/img/404.svg" alt="404" width="500" height="500">

        <p class="page404-txt" >很抱歉，没有找到您要的页面！</p>
      </div>
      <div v-else>
        <img  width="500" height="500" src="@/assets/img/500.svg" alt="500">
        <p class="page404-txt" >抱歉，当前访问资源异常，请稍后刷新页面重试！</p>
      </div>
    </div>
    <ThemeFooter v-if="(props.error.statusCode == 404||props.error.statusCode == 500)&&!props.error.url.startsWith('/workbench')"></ThemeFooter>
  </div>
</template>

<script setup>
  import {useWorkbench} from "~/composables/states/useUser";
  import {cookies} from "~/composables";
  import { apiGetWorkbenchList,apiGetClientCookie,getFirmStaffInfoApi } from "~/api/api";
  const  router = useRoute()
  const type = computed(()=>{
    if (router.path === '/portal/aboutUs'){
      return 8
    }else if (router.path === '/portal/userCase'){
      return  7
    }
  })


  const props=defineProps({
      error:null
  })
  if(props.error.statusCode===500&&props.error.message==='该账户已在其他设备登录'){
      loginOutCommon()
  }
  if(props.error.url.startsWith('/workbench')){

    let staffId = cookies.getItem('staffId');
    let memberId = cookies.getItem('memberId')
    let kindId=cookies.getItem('kindId');

    const {workbench} = useWorkbench();

    let { author } = useAuthor();
    if (memberId &&  author.value === '') {
      let res = await  getFirmStaffInfoApi({ memberId: memberId })
      // console.log(res,66666633333)
      if (res.result && res.result.sgsStatus == 0) {
        author.value = false
      }else{
        author.value =  true
      }

    }

    // 获取工作台列表
    let params={
      apply:kindId==99?0:1,
      id:kindId==99? staffId : memberId
    }
    let res= await apiGetWorkbenchList(params).catch(async e => {
      console.log('middleware[workbench]: get workbench list error', e)
      return false
    })

    let list=res.result;
    workbench.value=list
    let currentWorkbench = list[0]  // 每个企业只有一个工作台，取列表的第一个
    cookies.setItem('WORKBENCHNID', currentWorkbench?.workbenchId)
    cookies.setItem('WORKBENCHN', currentWorkbench?.workbenchName)

  }
  console.log(props)
</script>
<style scoped>
  .page404{
    display: flex;
    justify-content: center;
    padding-bottom: 100px;
    min-height: 70vh;
    padding-top: 50px;
  }
  .page404-txt{
    color: #101010;
    font-size: 20px;
    text-align: center;
  }
</style>
