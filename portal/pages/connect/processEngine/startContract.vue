<script setup>
import {
  editContracttpl,
  getmyContracttplListDetail,
  getPartInfo,

} from "@/api/connect";

import{getFirmStaffInfoApi}from '@/api/api'
let { author } = useAuthor();
const Config = useAppConfig()
definePageMeta({
  title: '/connect/processEngine/startContract'
})
const {user} = useUser();
    const loginMessage = user.value.bind
const route = useRoute();
const router = useRouter();
const info = reactive({ data: {} });
const step = ref(1);
const ContractName =  useContractName()
const authonDialog= ref(null)
const contractLoading = ref(false)
const save = () => {
  ElMessageBox.confirm("请确认是否要暂存合约?", "暂存提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then((res) => {
      let query = {
        contractId: route.query.id,
        name: info.data.name,
        releaseStatus: 1,
        orgAlias: info.data.orgAlias,
        processDefine: info.data.processDefine, // xml bpmn
      };
      editContracttpl(query).then((res) => {
        if (res.code == "0000") {
          ElMessage.success("修改状态成功");
          step.value = 3;
        }
      });
    })
    .catch(() => {});
};
const start = () => {
  // 1. 运营后台未配置，默认需要实名认证
  // 2. 运营后台配置“启用合约需要实名认证”，需要实名认证 冲刺41系统配置
  if(!author.value && (!Config.realNameAuthRule || Config.realNameAuthRule === 'enableContract')){
    authonDialog.value = true
    return
  }
  ElMessageBox.confirm("请确认是否要启用合约?", "启用提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then((res) => {
      contractLoading.value  = true
      let query = {
        contractId: route.query.id,
        name: info.data.name,
        releaseStatus: 2,
        orgAlias: info.data.orgAlias,
        processDefine: info.data.processDefine, // xml bpmn
      };
      editContracttpl(query).then((res) => {
        if (res.code == "0000") {
          ElMessage.success("修改状态成功");
          step.value = 2;
        }
      }).finally(()=>{
        contractLoading.value = false
      })
    })
    .catch(() => {});
};
const getInfo = async () => {
  let res = await getmyContracttplListDetail(route.query.id);
  info.data = res.data;

  ContractName.value = res.data.name
  let memberId = cookies.getItem("memberId");
  // 处于合约
  // 获取当前合约执行状态
  let executeStatus = res.data.executeStatus;
  if (executeStatus >= 2) {
    // 执行状态处于执行中 不可编辑
    step.value = 4;
  }
  // 获取当前合约状态 (启用状态)
  if (res.data.releaseStatus === "2" || res.data.releaseStatus === "3") {
    // 合约状态处于全部不启用不可编辑  或者取消启用
    step.value = 4;
  }
  // 处于 部分启用状态时需要查看当前企业合约下的执行状态 暂存 || 全部启用
  if (res.data.releaseStatus === "4") {
    // 查询当前合约部分启用状态

    getPartInfo({ contractid: route.query.id }).then((res1) => {
      let release = res1.data.find(
        (item1) => item1.collaborationOrgId == memberId
      ).releaseStatus;
      if (release == "2") {
        step.value = 2;
      } else {
        step.value = 1;
      }
    });
  }
};
const windowOpen = (url)=>{
  window.open(url);
}
const  getAuthor=()=>{
  getFirmStaffInfoApi({memberId: loginMessage.memberid}).then(res => {
               if (res.result && res.result.sgsStatus == 0){
                author.value = false
               } else{
                author.value = true
               }

        });
}
const  jump=()=>{
      let  url = sessionStorage.getItem('contractBackUrl')
      if (url){
        if (url.indexOf('/workbench') > -1){
          // 返回得url 是工作台首页 设置cookie 跳转到我的合约页面
          let backGroup= JSON.parse(cookies.getItem('backGroup'))
          let  index = backGroup.indexOf('我的合约') >=0 ?  backGroup.indexOf('我的合约') : 0 //兜底判断
          cookies.setItem('wbin',index+'-0-0');
        }
        //
        window.location.replace(url)
      }else {
        // 返回默认工作台 设置cookie 跳转到我的合约页面
        router.push('/workbench/connect/myContract')
      }
    }

onMounted(() => {
  if (route.query.id) {
    getInfo();
    getAuthor()
  }
});
</script>

<template>
  <div>
    <!-- <topTip :name="info.name" @gotoWorkbench="goback"></topTip> -->
    <div class="list_background">
      <div class="card">
        <img
          src="~/assets/img/collaborationCenter/defalut.svg"
          class="img"
          style="width: 180px; height: 130px; margin-top: 52px"
        />
        <div class="contract-info" v-if="step === 2">
          合约已启用，您可以在
          <span style="color: var(--el-color-primary); cursor: pointer" @click="jump"
            >我的合约</span
          >中查看启用状态
        </div>
        <div class="contract-info" v-if="step === 1">合约准备就绪,立即启用</div>
        <div class="contract-info" v-if="step === 3">
          合约已暂存，您可以在<span
            style="color: var(--el-color-primary); cursor: pointer"
            @click="jump"
            >我的合约</span
          >中查看启用状态
        </div>
        <div class="contract-info" v-if="step === 4">
          合约已全部启用，您可以在<span
            style="color: var(--el-color-primary); cursor: pointer"
            @click="jump"
            >我的合约</span
          >中查看
        </div>
        <div class="contract-tip" v-if="step === 2 && info.data.orgAlias.length > 1">
          提示：该合约涉及多个协作方，待所有协作方编辑井启用后合约生效。
        </div>
        <div class="open-button" v-if="step === 1">
          <!--          <el-button style="border: #3D5AFE 1px solid;color:#3D5AFE" @click="save">暂存合约</el-button>-->
          <el-button type="primary"  :loading="contractLoading" @click="start">启用合约</el-button>
        </div>
      </div>
    </div>
    <el-dialog
      align-center="true"
      v-model="authonDialog"
      :close-on-click-modal="false"
      title="提示"
      width="390px"
    >
    <p style="margin-bottom: 10px;">请先进行组织 <span  @click="windowOpen('/memberCenter/authenticationCenter')" style="cursor: pointer;text-decoration: underline;color: var(--el-color-primary);">实名认证</span>，在启用合约！</p>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="authonDialog = false">取消</el-button>
        <el-button type="primary" @click="windowOpen('/memberCenter/authenticationCenter')">
          去认证
        </el-button>
      </span>
    </template>





    </el-dialog>

  </div>
</template>

<style scoped lang="scss">
.list_background {
  width: 100%;
  height: 100vh;
  background: radial-gradient(circle at 1px 1px, #ababab 1px, transparent 0);
  background-size: 22px 22px; //圆点间隔（自定义值） 第一值是左右间隔  第二个值是上下间隔
}

.card {
  width: 550px;
  height: 380px;
  box-shadow: 0px 4px 12px 0px rgba(var(--el-color-primary-rgb), 0.12);
  background-color: #fff;
  transform: translateY(80px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.contract-info {
  font-weight: bold;
  font-size: 18px;
  margin-top: 27px;
  span {
    text-decoration: underline;
  }
}

.contract-tip {
  margin-top: 15px;
  font-size: 14px;
  width: 500px;
  text-align: center;
  line-height: 25px;
}
.open-button {
  margin-top: 27px;
}
</style>
