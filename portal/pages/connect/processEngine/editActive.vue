<script setup>
const router = useRouter();
const route = useRoute();
import {
  getmyContracttplListDetail,
  getPartInfo,
  editContracttpl,
} from "@/api/connect";
// import LF from "@/components/LF/index.vue";
import { baseXml } from "@/composables/utils/baseXmlStr";
const oldxml = ref("");
const info = reactive({
  data: null,
});
const enbale = ref(false);
const xmldata = reactive({ xml: null });
const loading = ref(false);
const create = ref(null);
const xmlInfo = ref(""); // 缓存的xml信息
const xmlFlag = ref(false); // xml是否更改
const organizationId = ref("");
const lf = ref(null);
const ContractName =  useContractName()
definePageMeta({
  title: '/connect/processEngine/baseInfo'
})

const jump = () => {
  if( !lf.value.checkReceiveTask())return

  let passThrough = enbale.value; // 真正判断是否已经处于不可编辑状态  true --> 处于不可編輯状态 false --> 处于可编辑状态
  enbale.value = true; // 取消路由拦截
  // console.log(passThrough);
  let id = route.query.id;
  let query = {
    contractId: route.query.id,
    name: info.data.name,
    releaseStatus: 1,
    orgAlias: info.data.orgAlias,
    processDefine: xmlInfo.value, // 缓存的xml 信息
  };
  if (!passThrough) {
    editContracttpl(query).then((res) => {
      if (res.code == "0000") {
        ElMessage.success("保存成功");
        router.push({ path: "/connect/processEngine/startContract", query: { id } });
      }
    });
  } else {
    router.push({ path: "/connect/processEngine/startContract", query: { id } });
  }
};

const getInfo = async () => {
  let res = await getmyContracttplListDetail(route.query.id);
  console.log(res)
  info.data = res.data;
  ContractName.value = info.data.name
  xmldata.xml = res.data.processDefine || baseXml;
  organizationId.value = res.data.organizationId; // 发起方id
  oldxml.value = res.data.processDefine;
  // 处于合约
  if (res.data.releaseStatus == "2" || res.data.releaseStatus == "3") {
    // 合约状态处于全部不启用不可编辑  或者取消启用
    enbale.value = true;
  }
  // 处于 部分启用状态时需要查看当前企业合约下的执行状态 暂存 || 全部启用
  if (res.data.releaseStatus === "4") {
    // 查询当前合约部分启用状态
    getPartInfo({ contractid: route.query.id }).then((res) => {
      let release = res.data.find(
        (item) => item.collaborationOrgId == memberId
      ).releaseStatus;
      if (release == "2") {
        // 执行状态处于执行中 不可编辑
        enbale.value = true;
      }
    });
  }
};

onMounted(() => {
  nextTick(()=>{
    if (route.query.type) {
    getDetail();
    if (route.query.type == "create") {
      // create = "create";
    }
  } else {
    getInfo();
  }
  })

});
const submitHandle=(e)=>{
  xmlFlag.value = true
  xmlInfo.value = e.xml
};
const changXml=(xml)=>{
  if(xml){
    console.log(xml)
    xmldata.xml=xml
    loading.value=false
  }
}
onBeforeRouteLeave((to,from,next)=>{
  // 先判断该合约对当前而企业来说是否处于已经执行状态
  if(!enbale.value){
    if(xmlFlag.value){
      // xml 已经修改
      ElMessageBox.confirm('检测到离开当前页面,是否保存已有更改?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '不保存',
        closeOnClickModal:false,
        distinguishCancelAndClose:true
      }).then(res=>{
        if( !lf.value.checkReceiveTask()){
          // 没保存触发事件，返回第二步
          const step = useContractStep()
          step.value = '/connect/processEngine/editActive'
          return
        }
        let query = {
          contractId:route.query.id,
          name:info.data.name,
          // releaseStatus:this.info.releaseStatus,
          releaseStatus:1,
          orgAlias:info.data.orgAlias,
          // processDefine:this.xmldata.xml, // xml bpmn
          processDefine: xmlInfo.value, // 缓存的xml 信息
        }
        editContracttpl(query).then(res=>{
          if(res.code == '0000'){
            ElMessage.success('编辑活动成功')
            next()
          }
        })
      }).catch((mes)=>{
        if (mes == 'cancel'){
          //点击取消  准备跳转路由
          next()
        }else{
          //点击关闭 图标
          const step = useContractStep()
          step.value = '/connect/processEngine/editActive'
        }

      })
    }else{
      next()
    }
  }else{
      next()
  }
})
</script>

<template>
  <div>
    <div>
      <div v-loading="loading" style="height: calc(100vh - 5px)">
        <ConnectLogic ref="lf" :xmldata="xmldata"  @submit="submitHandle"  @change="changXml"  v-if="xmldata.xml && info.data.orgAlias"  :orgAlias="info.data.orgAlias"  :organizationId="organizationId"  type="create"></ConnectLogic>
        <div class="next-step">
          如果编辑活动完成,请点击
          <el-button
            type="primary"
            style="width: 80px; margin-left: 5px"
            size="small"
            @click="jump"
            >下一步</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.next-step {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 291px;
  height: 88px;
  font-size: 14px;
  box-shadow: 0px 2px 6px 0px rgba(var(--el-color-primary-rgb), 0.2);
  position: fixed;
  left: 86px;
  bottom: 68px;
  background-color: #fff;
}
</style>
