<script setup>
import ComSelect from "@/components/CompanySelect";
import {
  creatContracttpl,
  getContracttplDetail,
  getUserCompanyNameByid,
  getmyContracttplListDetail,
  editContracttpl,
  getPartInfo, apiConnectorsOpened,
} from "@/api/connect";
const router = useRouter();
const route = useRoute();
const ContractName =  useContractName()

definePageMeta({
  title: '/connect/processEngine/baseInfo'
})
const isEdit = ref(false);
const form = ref({});
const formLabelAlign = {
  name: "",
  region: "chain",
  type: "",
  desc: "",
};
// const rules = {
//   name: [{ required: true, message: "请输入名称", trigger: "change" }],
// };
const value = ref("");
const tableList = reactive({ data: [{}] });
const info = reactive({ data: { name: "未命名的合约", decription: "" } });
const xmldata = reactive({ xml: "" });
const isSave = ref(false);
const enbale = ref(false);
const memberNameMap = reactive({});
const tableListstr = ref("");
const infostr = ref("");
const partreleaseStatus = ref(1);
const userNameInput = ref(null);
const uploadRefs = ref([]);
const iconSelect = ref([]);
const step = useContractStep()



const toMap = (arr) => {
  // 一个方法
  let numberNameArr = [...new Set(arr.map((item) => item.collaborationOrgId))];
  getUserCompanyNameByid({ ids: numberNameArr.join(",") }).then((res) => {
    res.result.map((item) => {
      memberNameMap[item.id] = item.memberName;
    });
  });
};
const hideHandle = (index) => {
  // 获取子组件  在父组件调用子组件的方法清空子组件内容
  iconSelect[index].value.clear();
};
const editStatusChange = (index) => {
  tableList.data[index].isEdit = !tableList.data[index].isEdit;
  nextTick(() => {

    uploadRefs.value[index].focus();
  });
};
const titleNamehandleClick = () => {
  isEdit.value = !isEdit.value;
  nextTick(() => {
    userNameInput.value.focus();
  });
};
const save = () => {
  if (!info.data.name) {
    ElMessage.error("请输入名称");
    return;
  }

  // 检测参数是否填写完整
  for (let i = 0; i < tableList.data.length; i++) {
    if (!tableList.data[i].aliasName) {
      ElMessage.error("请输入协作方名称");
      return;
    }
    if (!tableList.data[i].collaborationOrgId) {
      ElMessage.error("请选择协作组织");
      return;
    }
  }

  saveProcessData("useSave", () => {},'');
};

const del = (index) => {
  if (enbale.value) {
    ElMessage.error("该状态不可编辑");
    return;
  }
  tableList.data.splice(index, 1);
};
const pointer = (index) => {
  if (enbale.value) {
    ElMessage.error("该状态不可编辑");
    return;
  }
  if (tableList.data.length - 1 === index || index === 0) {
    //  不是数组最后一个为增加 第一个为增加
    tableList.data.push({
      aliasName: "协作方-" + (index + 2),
      companyName: "",
      aliasId: "",
      isEdit: false,
    });
  } else {
    // 删除
    tableList.data.splice(index, 1);
  }
};
const companySelect = (index, e) => {
  let flag = tableList.data.find((item) => item.collaborationOrgId === e.id);
  if (flag) {
    ElMessage.error("一个组织不能同时关联多个角色");
    return;
  }
  tableList.data[index].collaborationOrgId = e.id;
  tableList.data[index].companyName = e.memberName;
};
const getDetail = () => {
  // 创建模板获取模板详情
  getContracttplDetail(route.query.tplId).then((res) => {
    info.data = res.data;
    ContractName.value = info.data.name
    xmldata.xml = res.data.processDefine;
    // 如果模板数据为空 添加一个模板
    let memberId = cookies.getItem("memberId");
    // 没有协作方创建一个默认协作方
    if (!res.data.orgAlias.length) {
      getUserCompanyNameByid({ ids: memberId }).then((res1) => {
        // 数据更新但是视图未更新 故使用此方法
        tableList.data[0].collaborationOrgId = res1.result[0].id;
        tableList.data[0].companyName = res1.result[0].memberName;
        tableList.data[0].aliasName = "协作方-1";
        tableList.data[0].isEdit = false;
      });
    } else {
      // 有数据 第一行模板设置为协作发起方
      getUserCompanyNameByid({ ids: memberId }).then((res2) => {
        tableList.data = res.data.orgAlias.map((item) => {
          return { ...item, isEdit: false, collaborationOrgId: "" };
        });
        // map 添加 id - name 键值对
        memberNameMap[res2.result[0].id] = res2.result[0].memberName;
        // 第一个的collaborationOrgId合约发起方的
        tableList.data[0].collaborationOrgId = res2.result[0].id;
      });
    }
  });
};
const getConnectorIds=(xmldata)=>{
  let parser = new DOMParser();
  let xmlDoc = parser.parseFromString(xmldata, "text/xml");

  // 使用XPath选择器获取所有包含connector_id的property元素
  let connectorIdElements = xmlDoc.evaluate('//flowable:property[@name="connector_id"]', xmlDoc,
      (prefix) => prefix === 'flowable' ? 'http://camunda.org/schema/1.0/bpmn' : null,
      XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
  // 存储所有connector_id的数组
  let connectorIds = [];
  // 遍历结果集并提取connector_id的值
  let connectorIdElement = connectorIdElements.iterateNext();
  while (connectorIdElement) {
    let connectorId = connectorIdElement.getAttribute('value');
    connectorIds.push(connectorId);
    connectorIdElement = connectorIdElements.iterateNext();
  }
  return connectorIds
}




const getInfo = async () => {
  // 获取已经创建合约信息
  let res = await getmyContracttplListDetail(route.query.id);
  info.data = res.data;
  ContractName.value = info.data.name
  xmldata.xml = res.data.processDefine;




  tableList.data = res.data.orgAlias.map((item) => {
    return { ...item, isEdit: false };
  });
  // 字符串赋值
  infostr.value = JSON.stringify(info.data);
  tableListstr.value = JSON.stringify(tableList.data);
  let memberId = cookies.getItem("memberId");
  // 处于合约
  toMap(res.data.orgAlias);

  if (memberId != res.data.memberId) {
    // 处于非编辑状态
    enbale.value = true;
  }
  // 获取当前合约执行状态
  let executeStatus = res.data.executeStatus;
  if (executeStatus >= 2) {
    // 执行状态处于执行中 不可编辑
    enbale.value = true;
  }
  // 获取当前合约状态 (启用状态)
  if (res.data.releaseStatus === "2" || res.data.releaseStatus === "3") {
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
        partreleaseStatus.value = 2;
      }
    });
  }
};
const makeRequest=async (collaborationOrgId,connectorIds)=>{
  let params={
    check_info:[]
  }
  if(connectorIds.length){
    connectorIds.forEach((item=>{
      params.check_info.push({enterprise_id:collaborationOrgId,connector_id:item})
    }))
  }

  apiConnectorsOpened(params).then(res=>{
    console.log(res)
  })
}
// 检查是否开通对应连接器
const checkConnect= async ()=>{
  console.log( tableList.data)
  console.log(getConnectorIds(xmldata.xml))
  let connectorIds=getConnectorIds(xmldata.xml)
  for (let i=0;i<tableList.data.length;i++) {
    try {
      await makeRequest(tableList.data[i].collaborationOrgId, connectorIds);

      // 在这里可以执行下一次循环前的操作

    } catch (error) {
      // 在这里处理中断循环的情况
      console.error('Loop interrupted due to error:', error.message);
      break;
    }
  }
}
const saveProcessData = (type, next,to) => {



  let params = {
    contractTplId: info.data.contractTplId ?? "",
    releaseStatus: 1,
    name: info.data.name,
    decription: info.data.decription,
    orgAlias: tableList.data,
    processDefine: xmldata.xml, // xml bpmn 字段 需要补充
  };
  // checkConnect()
  // return
  if (route.query.tplId) {
    //处于创建模板状态
    creatContracttpl(params).then((res) => {
      if (res.code == "0000") {
        getDataSuccessCallBack(type, next, "创建成功", res.data.contractId,to);
      }
    });
  } else if (route.query.id) {
    //  处于编辑状态
    (params.releaseStatus =
      info.data.releaseStatus == 4
        ? partreleaseStatus.value
        : info.data.releaseStatus),
      (params.contractId = route.query.id);
    editContracttpl(params).then((res) => {
      if (res.code == "0000") {
        getDataSuccessCallBack(type, next, "修改状态成功", res.data.contractId,to);
      }
    });
  } else {
    // 空模板创建
    creatContracttpl(params).then((res) => {
      if (res.code == "0000") {
        getDataSuccessCallBack(type, next, "创建成功", res.data.contractId,to);
      }
    });
  }
};
// 页面离开回调
const getDataSuccessCallBack = (type, next, successStr, id,to) => {
  successStr &&  ElMessage.success(successStr)

  // 跳过路由守卫
  isSave.value = true;
 console.log( to.fullPath)
   //  to 的地址是workbench 直接去workbench
   if( to.fullPath == "/workbench/connect/myContract"){
        console.log("/workbench/connect/myContract",22)
             next({
              path: to.fullPath,
            });
   }else if(to.fullPath =='/workbench/connect/contractBackUrl'){
    // 外链地址
    let backUrl = sessionStorage.getItem('contractBackUrl')
      window.location.replace(backUrl)
   }
   else{
          if (type == "useSave") {
          router.push({
            path: "/connect/processEngine/editActive",
            query: { id },
          });
        } else {
          next({
            path: to.fullPath,
            query: { id },
          });
        }
   }


};

onBeforeRouteLeave((to, from, next) => {

  if (!isSave.value) {
    // isSave 为 true---> 主观上的页面跳转, 避免触发路由拦截
    // 以下其他方式被动触发路由守卫
    // 可编辑状态 检测数据是否发生变化
    let infostr1 = JSON.stringify(info.data);
    let tableListstr1 = JSON.stringify(tableList.data);
    if (infostr1 === infostr.value && tableListstr1 === tableListstr.value) {
      // 当前暂无修改 直接页面放过但是要判断要去哪里
      next();
    } else {

      ElMessageBox.confirm("检测到离开当前页面,是否保存已有更改?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "不保存",
        closeOnClickModal: false,
        distinguishCancelAndClose: true,
      })
        .then((res) => {
          saveProcessData("routerleave", next,to);
        })
        .catch((mes) => {
          if (mes == "cancel") {
            //点击取消  准备跳转路由
            if (route.query.id) {
              // 非创建 可直接通行
              getDataSuccessCallBack('', next, '', route.query.id,to)
            }else {
              if(to.fullPath.indexOf('/connect/processEngine') != -1 ){
                  ElMessage.error('需要创建合约后才可进行下一步')
                  step.value = '/connect/processEngine/baseInfo'
              }else{
                getDataSuccessCallBack('', next, '', route.query.id,to)
              }
            }
          }else{
            step.value = '/connect/processEngine/baseInfo'
          }
        });
    }
  } else {
    next();
  }
});

onMounted(() => {
  if (route.query.tplId) {
    // 属于使用模板状态
    nextTick(() => {
      getDetail();
    });
  } else if (route.query.id) {
    //处于修改状态
    nextTick(() => {
      getInfo();
    });
  } else {
    // 处于自定义创建模板状态
    // 默认创建一个新的协作费模板
    let memberId = cookies.getItem("memberId");
    ContractName.value = info.data.name
    nextTick(()=>{
      getUserCompanyNameByid({ ids: memberId }).then((res) => {
      tableList.data[0].collaborationOrgId = res.result[0].id;
      tableList.data[0].companyName = res.result[0].memberName;
      tableList.data[0].isEdit = false;
      tableList.data[0].aliasName = "协作方-1";
      console.log(tableList.data)
    });
    })
  }
});
</script>

<template>
  <div>
    <div class="list_background">
      <div class="info-card">
        <el-form
          label-position="top"
          label-width="80px"
          :model="info.data"
          ref="ruleForm"
        >
          <el-form-item
            style="padding-bottom: 5px; border-bottom: 1px #dce0e7 solid"
            prop="name"
          >
            <div v-if="!isEdit" style="display: flex; align-items: center">
              <div class="titleEdit" @click="titleNamehandleClick">
                {{ info.data.name
                }}
                <el-icon
                  style="cursor: pointer; margin-left: 1em"
                >
                <Edit />
              </el-icon>
              </div>
            </div>
            <div v-else>
              <el-input
                ref="userNameInput"
                v-model="info.data.name"
                :autofocus="true"
                size="small"
                @blur="()=>{ContractName = info.data.name;isEdit = !isEdit}"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label="描述" prop="decription">
            <el-input
              v-model="info.data.decription"
              type="textarea"
              placeholder="请填写描述"
              :rows="2"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属协作网络" required class="network">
            <el-select
              v-model="formLabelAlign.region"
              :disabled="enbale"
              placeholder="请选择所属协作网络"
            >
              <el-option label="信贸链" value="chain"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item required>
            <template #label>
              <span>
                <span class="span-box">
                  <span>协作组织</span>
                  <el-popover
                    placement="top"
                    trigger="hover"
                    content="共同编辑合约的组织机构"
                    :visible-arrow="false"
                  >
                    <template #reference>
                      <el-icon class="icon-ques" style="margin-left: 5px">
                        <QuestionFilled />
                      </el-icon>
                    </template>
                  </el-popover>
                </span>
              </span>
            </template>
            <div
              class="item-box"
              v-for="(item, index) in tableList.data"
              :key="index"
            >
              <div class="select" :style="{ width: enbale ? '100%' : '450px' }">
                <div class="left-card">
                  <div v-if="enbale" class="mask"></div>
                  <img
                    src="~/assets/img/collaborationCenter/user.png"
                    alt=""
                    style="height: 40px"
                  />
                  <div
                    v-if="!item.isEdit"
                    style="display: flex; align-items: center"
                    class="item-ails"
                  >
                    <div
                      style="
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        max-width: 120px;
                        margin-right: 6px;
                      "
                      @click="editStatusChange(index)"
                    >
                      {{ item.aliasName || "未命名的组织-" + 1 + index }}
                    </div>
                    <el-icon @click="editStatusChange(index)">
                      <Edit />
                    </el-icon>
                  </div>
                  <div v-else>
                    <el-input
                      :ref=" el =>uploadRefs[index] = el"
                      v-model.trim="item.aliasName"
                      size="small"
                      @blur="item.isEdit = !item.isEdit"
                    ></el-input>
                  </div>
                </div>
                <div class="rigth-search">
                  <el-popover
                    placement="bottom-end"
                    width="450"
                    trigger="click"
                    :visible-arrow="false"
                    :offset="10"
                    @hide="hideHandle(index)"
                  >
                    <template #default>
                      <ComSelect
                        ref="iconSelect"
                        @selected="companySelect(index, $event)"
                      />
                    </template>
                    <template #reference>
                      <div
                        style="
                          text-align: right;
                          cursor: pointer;
                          display: flex;
                          align-items: center;
                        "
                        class="icon-select"
                      >
                        <div class="ellipsis" style="width: 180px">
                          {{
                            memberNameMap[item.collaborationOrgId] ||
                            item.companyName ||
                            "请选择组织"
                          }}
                        </div>
                        <el-icon style="transition: all 0.5s">
                          <Edit />
                        </el-icon>
                      </div>
                    </template>
                  </el-popover>
                </div>
              </div>
              <div v-if="!enbale" style="flex: 1; display: flex">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="
                    index === tableList.data.length - 1 ? '删除' : '删除'
                  "
                  placement="top"
                  v-if="
                    tableList.data.length - 1 == index &&
                    tableList.data.length - 1 != 0
                  "
                >
                  <el-icon
                    style="
                      font-size: 16px;
                      color: var(--el-color-primary);
                      cursor: pointer;
                      margin-right: 4px;
                    "
                    @click="del(index)"
                  >
                    <Remove />
                  </el-icon>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="
                    index === tableList.data.length - 1 || index === 0
                      ? '添加'
                      : '删除'
                  "
                  placement="top"
                  v-if="!(index === 0 && tableList.data.length > 1)"
                >
                  <el-icon
                    v-if="!(index === 0 && tableList.data.length > 1)"
                    style="font-size: 16px; color: var(--el-color-primary); cursor: pointer"
                    @click="pointer(index)"
                  >
                    <CirclePlus
                      v-if="index === tableList.data.length - 1 || index === 0"
                    />
                    <Remove v-else />
                  </el-icon>
                </el-tooltip>
              </div>
            </div>
          </el-form-item>
          <el-form-item style="padding-top: 12px">
            <div style="display: flex; justify-content: center;width: 100%;">
              <el-button type="primary" @click="save">下一步</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep() {
  .el-form-item__label {
    padding-bottom: 0;
  }
  .el-form-item {
    margin-bottom: 18px;
  }
  .el-select {
    width: 100%;
  }
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.list_background {
  width: 100%;
  height: 100vh;
  background: radial-gradient(circle at 1px 1px, #ababab 1px, transparent 0);
  background-size: 22px 22px; //圆点间隔（自定义值） 第一值是左右间隔  第二个值是上下间隔
}

.info-card {
  width: 550px;
  transform: translateY(80px);
  margin: 0px auto 0px;
  box-sizing: border-box;
  padding: 25px 30px 40px;
  background-color: #fff;
  box-shadow: 0px 4px 12px 0px rgba(var(--el-color-primary-rgb), 0.12);
}
.item-box {
  //justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  display: flex;
  flex:1;
  .select {
    font-size: 14px;
    position: relative;
    height: 40px;
    margin-right: 4px;
    border: #dce0e7 1px solid;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 12px;
    padding-left: 0px;
    transition: all 0.5s;
    border-radius: 3px;
    //&:hover{
    //  border: 1px solid var(--el-color-primary);
    //}
    .left-card {
      display: flex;
    }
    .rigth-search {
      :deep() {
        .el-input__inner {
          text-align: right;
          border: 0;
        }
        .el-select-dropdown__item {
          width: 450px !important;
        }
        .el-select-dropdown {
          transform: translateX(-255px);
        }
      }
    }
  }
}

.icon-select {
  &:hover {
    color: var(--el-color-primary);
    //i{
    //  //transform: rotateZ(-180deg);;
    //}
  }
}

.mask {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 50;
  background-color: #e4e7ed4d;
  cursor: not-allowed;
}

.titleEdit {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    color: var(--el-color-primary);
  }
}

.item-ails {
  cursor: pointer;
  &:hover {
    color: var(--el-color-primary);
  }
}
.icon-ques {
  cursor: pointer;
  &:hover {
    color: var(--el-color-primary);
  }
}
</style>
