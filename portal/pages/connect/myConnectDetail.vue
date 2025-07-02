<script setup>
import {getMyConnectorDetail,testConnect,delConnectorsAccounts,getConnectorsAccountsDetail ,addAccounts,getConnectorsAccounts, getConnectorsConfig ,getVersionNo,EditConnectorsAccounts } from '@/api/connect'
const route = useRoute();
const router = useRouter();

const account_id = ref("");
const dialogVisible = ref(false);
const lookBookDialogVisible = ref(false);
const showVersionLog = ref(false);
const connectorData = reactive({ data: {} });
const connectInfo = reactive({ data: {} });
const activeName = ref("first");
const org_connector_id = ref(route.query.index);
const account_list = reactive({ data: [] });
const settingForm = ref({});
const account_name = ref("");
const isCreat = ref(false);
const option = reactive({
  form: {
    labelPosition: "right",
    size: "small",
    hideRequiredAsterisk: false,
    showMessage: true,
    inlineMessage: false,
  },
  submitBtn: false,
  resetBtn: false,
});
const fApi = ref();
const rules = reactive({ data: [] });
const isUpdate = ref(false);
const version_desc = ref(""); //版本内容
const version_no = ref(""); //版本号
const pagination= reactive({
      pageInfo:{
        currentpage:1,
        pagesize:10,
      },
      totalInfo:10,
    })

const   infoSizeSearch = (val) =>{
    /* 改变显示数量 */
    pagination.pageInfo.currentpage = 1
    pagination.pageInfo.pagesize = val
  }
  const   infoCurrSearch = (val) => {
    /* 改变当前页 */
    pagination.pageInfo.currentpage = val
    console.log(val)
  }

const version = () => {
  let client_ex_id = cookies.getItem("uuid") || "";
  getVersionNo(org_connector_id.value, client_ex_id).then((res) => {
    isUpdate.value = res.data.status === "1" ? false : true;
    version_desc.value = res.data.desc;
    version_no.value = res.data.version_no;
  });
};
// 表格单元格点击回调函数
const cellClickHandle = (row, column) => {
  if (column.label === "名称") {
    // 点击名称跳转 文章
    if (row.detail_url) {
      window.open(row.detail_url);
    }
  }
  if (column.label === "数据模型") {
    // 点击主数据跳转帮助中心-->主数据模型链接
    if (row.master_data_model_detail_url) {
      window.open(row.master_data_model_detail_url);
    }
  }
};
//测试连接
const testconect = () => {
  let formData = new URLSearchParams();
  formData.append("account_id",account_id.value);
  testConnect(formData).then((res) => {
    if (res.code == 0) {
      ElMessage.success("测试连接成功");
      console.log(1111);
    } else {
       ElMessage.error("测试链接失败");
    }
  });
};
//删除账号
const delAcc = (id) => {
  ElMessageBox.alert("请确认是否删除本条账号信息?", "删除提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  })
    .then(() => {
      delConnectorsAccounts(id).then((res) => {
        ElMessage({
          type: "success",
          message: "删除成功!",
        });
        getAccountsList();
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "已取消删除",
      });
    });
};
// 获取我的连接器配置详情
const accidDetail = (id) => {
  account_id.value = id;
  getConnectorsAccountsDetail(id).then((res) => {
    settingForm.value = res.data.account_config_json;
    account_name.value = res.data.account_name;
  });
  dialogVisible.value = true;
  isCreat.value = false;
};
const getConfig = () => {
  // 获取配置信息
  getConnectorsConfig({ org_connector_id: org_connector_id.value }).then(
    (res) => {
      if (res.data.config_item_json) {
        rules.data = JSON.parse(res.data.config_item_json);
      }
    }
  );
};
const opendialog = () => {
  // 打开账号弹窗
  getConfig();
  isCreat.value = true; // 处于添加账号状态
  dialogVisible.value = true;
  // fApi.value.resetFields();
  // this.settingForm = {}
  account_name.value = "";
  account_id.value = "";
};
const getAccountsList = () => {
  getConnectorsAccounts({ org_connector_id: org_connector_id.value }).then(
    (res) => {
      account_list.data = res.data.account_list;
    }
  );
};
const handleClick = (tab, event) => {
  pagination.pageInfo.pagesize = 10
  pagination.pageInfo.currentpage = 1
   if(tab.paneName === 'second'){
    pagination.totalInfo =   connectorData.data.trigger_event_list.length
   }

   if(tab.paneName === 'third'){
    pagination.totalInfo =   connectorData.data.execute_action_list.length
   }
};
const getData = () => {
  let index = route.query.index;
  // 获取我的连接器详情信息
  getMyConnectorDetail(index).then((res) => {
    org_connector_id.value = res.data.org_connector_id;
    
    connectorData.data = res.data;
    connectInfo.data = res.data;
  });
};
// 下载证书
const download = (content, fileName, type) => {
  let txtFile = new Blob([content]);
  let link = document.createElement("a");
  link.href = window.URL.createObjectURL(txtFile);
  link.download = fileName + "." + type;
  link.click();
  window.URL.revokeObjectURL(link.href);
};
const confirm = () => {
  if (!account_name.value) {
    ElMessage.error("请输入账号名称");
    return;
  }
  
  if (Object.keys(rules.data).length === 0) {
    // 无账号配置 直接添加
    addAcc();
    return;
  }
  console.log(rules.data)
  // 有账号配置 进行校验
  fApi.value.validate(async (valid, fail) => {
    if (valid) {
      addAcc();
      dialogVisible.value = false;
    }
  });
}; 
const trigger_event_list  = computed(()=>{
let cur =  (pagination.pageInfo.currentpage -1) * pagination.pageInfo.pagesize
let size = pagination.pageInfo.pagesize * pagination.pageInfo.currentpage
  return  connectorData.data.trigger_event_list.slice(cur,size)
})

const execute_action_list = computed(()=>{
  let cur = (pagination.pageInfo.currentpage -1) * pagination.pageInfo.pagesize
  let size = pagination.pageInfo.pagesize * pagination.pageInfo.currentpage
  return connectorData.data.execute_action_list.slice(cur,size)
  })
const addAcc = async () => {
  if (isCreat.value) {
    // 处于新建账号
    let formData = new FormData();
    let account_config_json = JSON.stringify(settingForm.value);
    formData.append("account_config_json", account_config_json);
    formData.append("account_name", account_name.value);
    formData.append("org_connector_id", org_connector_id.value);
    let { code, msg } = await addAccounts(formData);
    if (code == 0) {
      ElMessage.success("添加成功");
      getAccountsList();
    } 
  } else {
    // 处于修改账号
    let formData = new FormData();
    let account_config_json = JSON.stringify(settingForm.value);
    formData.append("account_config_json", account_config_json);
    formData.append("account_name", account_name.value);
    let { code, msg } = await EditConnectorsAccounts(
      account_id.value,
      formData
    );
    if (code == 0) {
      ElMessage.success("编辑成功");
      getAccountsList();
    }
  }
  // fApi.value.resetFields();
  dialogVisible.value = false;
  account_name.value = "";
  account_id.value = "";
};
onMounted(() => {
  nextTick(()=>{
 // 获取详情
 getData();
  // 获取用户账号列表
  getAccountsList();
  getConfig();
  // 获取客户端版本信息
  version();
  })
 
});
</script>


<template>
  <div
    style="
      height: 100%;
      min-height: 680px;
      display: flex;
      flex-direction: column;
    "
  >
    <el-breadcrumb separator="/" class="title">
      <el-breadcrumb-item :to="{ path: '/connect/myConnect' }">
        <span style="color:#666;font-weight: normal"
          >我的连接器</span
        ></el-breadcrumb-item
      >
      <el-breadcrumb-item>
        <span style="font-size: 14px; color: #101010">{{
          connectInfo.data.connector_name
        }}</span></el-breadcrumb-item
      >
    </el-breadcrumb>
    <div
    style=" padding: 15px;"
    >
      <div class="card">
        <div class="main-info">
          <img
              :src="connectInfo.data.connector_image"
              alt=""
              style="
            width: 90px;
            height: 90px;
            border-radius: 50%;
            box-shadow: 0px 2px 6px 0px rgba(103, 149, 255, 0.2);
          "
          />
          <div style="margin-left: 30px">
            <div style="margin-bottom: 13px; font-weight: bold; font-size: 28px">
              {{ connectInfo.data.connector_name }}
            </div>
            <div style="margin-bottom: 10px">
              <span style="font-weight: bold">链上身份ID: </span>
              {{ connectInfo.data.chain_identity_id }}
              <span @click="lookBookDialogVisible = true" class="lookBook"
              >(查看证书)</span
              >
            </div>
            <div>
            <span style="font-weight: bold">描述: </span
            >{{ connectInfo.data.connector_desc }}
            </div>
          </div>
          <div class="newVersion">
            <div id="loader8" :style="{ opacity: isUpdate ? 1 : 0 }"></div>
            <div
                class="openbtn"
                :style="{ cursor: isUpdate ? 'not-allowed' : 'auto' }"
            >
              {{ isUpdate ? "正在升级连接器" : "已是最新版本" }}
            </div>
            <div class="versionNo">
              版本号:
              <span
                  style="
                cursor: pointer;
                color: var(--el-color-primary);
                text-decoration: underline;
              "
                  @click="showVersionLog = true"
              >{{ version_no }}</span
              >
            </div>
          </div>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="账号配置" name="first">
            <div>
              <el-button
                  type="primary"
                  style="margin-bottom: 30px"
                  @click="opendialog"
              >添加账号</el-button
              >
              <el-table
                  v-if="activeName == 'first'"
                  :data="account_list.data"
                  border
                  width="100%"
              >
                <el-table-column
                    prop="account_name"
                    align="center"
                    label="账号名称"
                >
                </el-table-column>
                <el-table-column align="center" label="添加时间">
                  <template #default="scope">
                    <span>{{ scope.row.create_time }}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="修改时间">
                  <template #default="scope">
                    <span>{{ scope.row.update_time }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template #default="scope">
                    <el-tooltip
                        popper-class="noBorder"
                        content="编辑"
                        placement="top"
                        effect="light"
                        :enterable="false"
                    >
                      <el-icon
                          style="cursor: pointer; margin-right: 15px"
                          @click="accidDetail(scope.row.account_id)"
                          class="font"
                      >
                        <Edit />
                      </el-icon>
                    </el-tooltip>
                    <el-tooltip
                        popper-class="noBorder"
                        content="删除"
                        placement="top"
                        effect="light"
                        :enterable="false"
                    >
                      <el-icon
                          style="cursor: pointer"
                          @click="delAcc(scope.row.account_id)"
                          class="font"
                      >
                        <Delete />
                      </el-icon>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="触发事件" name="second">
            <div class="eventList">
              <!--            <div class="eventName">触发事件列表</div>-->
              <div class="eventDesc">
                {{ connectorData.data.trigger_event_desc || "" }}
              </div>
              <div class="mytable">
                <el-table
                    v-if="activeName == 'second'"
                    :data="trigger_event_list"
                    border
                    width="100%"
                >
                  <el-table-column align="center" label="名称">
                    <template #default="{ row, column, $index }">
                      <p class="cellHover" @click="cellClickHandle(row, column)">
                        {{ row.name }}
                      </p>
                    </template>
                  </el-table-column>
                  <el-table-column label="描述" align="center">
                    <template #default="{ row, column, $index }">
                      {{ row.desc }}
                    </template>
                  </el-table-column>
                  <el-table-column label="数据模型" align="center">
                    <template #default="{ row, column, $index }">
                      <p class="cellHover" @click="cellClickHandle(row, column)">
                        {{ row.master_data_model }}
                      </p>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div style="display: flex;justify-content: end; margin-top: 32px">
                <el-pagination
                    class="hs-pagination"
                    @size-change="infoSizeSearch"
                    @current-change="infoCurrSearch"
                    :current-page.sync="pagination.pageInfo.currentpage"
                    :page-size.sync="pagination.pageInfo.pagesize"
                    :page-sizes="[10, 50, 100]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pagination.totalInfo"
                >
                </el-pagination>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="执行动作" name="third">
            <div class="eventList">
              <!--            <div class="eventName">执行动作列表</div>-->
              <div class="eventDesc">
                {{ connectorData.data.execute_action_desc || "" }}
              </div>
              <div class="mytable">
                <el-table
                    v-if="activeName == 'third'"
                    :data="execute_action_list"
                    border
                    width="100%"
                >
                  <el-table-column label="名称" align="center">
                    <template #default="{ row, column, $index }">
                      <p @click="cellClickHandle(row, column)" class="cellHover">
                        {{ row.name }}
                      </p>
                    </template>
                  </el-table-column>
                  <el-table-column label="描述" align="center">
                    <template #default="{ row, column, $index }">
                      {{ row.desc }}
                    </template>
                  </el-table-column>
                  <el-table-column label="数据模型" align="center">
                    <template #default="{ row, column, $index }">
                      <p @click="cellClickHandle(row, column)" class="cellHover">
                        {{ row.master_data_model }}
                      </p>
                    </template>
                  </el-table-column>
                </el-table>
                <div style="display: flex;justify-content: end; margin-top: 32px">
                  <el-pagination
                      class="hs-pagination"
                      @size-change="infoSizeSearch"
                      @current-change="infoCurrSearch"
                      :current-page.sync="pagination.pageInfo.currentpage"
                      :page-size.sync="pagination.pageInfo.pagesize"
                      :page-sizes="[10, 50, 100]"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="pagination.totalInfo"
                  >
                  </el-pagination>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <el-dialog
      :title="isCreat ? '添加账号' : '编辑账号'"
      v-model="dialogVisible"
      append-to-body
      :close-on-click-modal="false"
      :destroy-on-close="true"
      width="700px"
    >
      <el-scrollbar>
        <el-form label-position="right" label-width="125px" ref="form">
          <el-form-item required label="账号名称">
            <el-input v-model.trim="account_name" placeholder="请输入账号名称">
            </el-input>
          </el-form-item>
        </el-form>
        <form-create
          v-if="dialogVisible"
          v-model:api="fApi"
          :rule="rules.data"
          :option="option"
          v-model="settingForm"
        ></form-create>
      </el-scrollbar>
      <div
        slot="footer"
        class="dialog-footer"
        style="font-size: 14px; text-align: right"
      >
        <el-button @click="testconect" v-if="account_id && false"
          >测试连接</el-button
        >
        <!--  暂时隐藏测试链接按钮      -->
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="confirm" size="small">{{
          isCreat ? "确 定" : "保 存"
        }}</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="版本内容"
      v-model="showVersionLog"
      append-to-body
      :modal="false"
      width="400px">
      <div style="font-size: 14px">
      {{version_desc}}
      </div>
    </el-dialog>
    <el-dialog
      title="证书详情"
      v-model="lookBookDialogVisible"
      append-to-body
      width="506px"
    >
      <div class="dialog-container">
        <div class="keys" style="width: 470px; margin-right: 0px">
          <div class="keys-title">签名证书</div>
          <el-scrollbar
            style="
              height: 100px;
              border: 2px solid rgba(223, 223, 223, 100);
              box-shadow: 0px 2px 6px 0px rgba(var(--el-color-primary-rgb), 0.15);
            "
          >
            <div class="keys-info">
              {{ connectInfo.data.chain_identity_sign_cert }}
            </div>
          </el-scrollbar>
          <el-button
            @click="
              download(
                connectInfo.data.chain_identity_sign_cert,
                '签名证书',
                'crt'
              )
            "
            type="primary"
            size="small"
            style="margin-top: 8px"
            >下载</el-button
          >
        </div>
        <div class="keys" style="width: 470px; margin-right: 0px">
          <div class="keys-title">tls证书</div>
          <el-scrollbar
            style="
              height: 100px;
              border: 2px solid rgba(223, 223, 223, 100);
              box-shadow: 0px 2px 6px 0px rgba(var(--el-color-primary-rgb), 0.15);
            "
          >
            <div class="keys-info">
              {{ connectInfo.data.chain_identity_tls_cert }}
            </div>
          </el-scrollbar>
          <el-button
            @click="
              download(
                connectInfo.data.chain_identity_sign_cert,
                'tls证书',
                'crt'
              )
            "
            type="primary"
            size="small"
            style="margin-top: 8px"
            >下载</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>


<style scoped lang="scss">
.font {
  &:hover {
    color: var(--el-color-primary);
  }
}
.title{
  background-color: #fff;
  padding-left: 20px;
  height: 40px;
  line-height: 40px;
  color: rgba(16, 16, 16, 1);
  box-sizing: border-box;
  font-size: 14px;
  font-family: SourceHanSansSC-regular;
}
.card {
  //box-shadow: 0px 2px 6px 0px rgba(var(--el-color-primary-rgb), 0.15);
  flex: 1;
  padding-top: 40px;
  box-sizing: border-box;
  background-color: #fff;
  padding: 24px 40px;
  .main-info {
    display: flex;
    position: relative;
    align-items: center;
    font-size: 14px;
    margin-bottom: 36px;
  }

  .eventList {
    .eventName {
      margin-bottom: 7px;
      font-weight: bold;
    }
    .eventDesc {
      margin-bottom: 26px;
      line-height: 20px;
      font-size: 14px;
      font-family: SourceHanSansSC-regular;
    }
  }
  .line {
    background-color: #bbb;
    height: 1px;
    margin-top: 15px;
    margin-bottom: 15px;
  }
}

:deep() {
  .el-scrollbar__wrap {
    overflow-x: hidden;
    max-height: 50vh;
  }
  .el-tabs__item {
    padding: 0 60px;
  }
  .mytable {
    .cellHover {
      margin: 0;
      &:hover {
        color: var(--el-color-primary);
        cursor: pointer;
      }
    }
  }
  .el-message-box__title {
    font-weight: bold;
  }
  .el-message-box {
    padding-bottom: 15px !important;
  }
  .el-dialog__footer {
    text-align: center;
  }

  .el-dialog__title {
    font-weight: bold;
    font-size: 16px;
  }
  .el-tabs__nav-wrap::after {
    background-color: #fff;
  }
  .el-tabs__item {
    padding: 0 50px;
    font-size: 16px;
    height: 60px;
  }
  .el-tabs__nav-wrap {
    height: 60px;
  }
  .el-tabs__nav {
    height: 60px;
  }
  .is-active {
    font-weight: bold;
    color: #101010;
  }
  .el-tabs__active-bar {
    height: 4px;
    border-radius: 8px;
    width: 40px !important;
    margin-left: 12px;
  }
  .el-tab-pane {
    padding: 0px 0px 40px;
    // box-shadow: 0px 4px 12px 0px rgba(var(--el-color-primary-rgb), 0.12);
    border-radius: 3px;
  }
  .el-tabs__content {
    overflow: visible;
  }
}
.agreementDialogContent {
  min-height: 400px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 16px;
  line-height: 25px;
  div {
    margin: 15px 0px;
    text-indent: 30px;
  }
  h3 {
    margin-bottom: 30px;
  }
  .content {
    span {
      color: #755aef;
    }
    span:nth-child(3) {
      color: rgba(0, 0, 0, 0.65);
      font-weight: bolder;
    }
  }
}
.dialog-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 10px 18px 10px 18px;
}
.keys {
  margin-bottom: 30px;
  width: 440px;
  margin-right: 16px;
  .keys-title {
    color: rgba(16, 16, 16, 100);
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .keys-info {
    font-size: 12px;
    white-space: pre-line;
    padding: 0;
    color: rgb(155, 155, 155);
  }
}

.lookBook {
  cursor: pointer;
  color: var(--el-color-primary);
  text-decoration: underline;
  &:hover {
    font-weight: bold;
  }
}
.newVersion {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  right: 40px;
  padding-top: 30px;
  .openbtn {
    width: 140px;
    height: 40px;
    line-height: 40px;
    border-radius: 20px;
    background-color: rgba(var(--el-color-primary-rgb), 0.04);
    color: rgba(165, 177, 206, 1);
    font-size: 14px;
    text-align: center;
    border: 1px solid rgba(165, 177, 206, 1);
  }
  .versionNo {
    text-align: center;
    margin-top: 10px;
  }
}

#loader8 {
  font-size: 10px;
  margin-bottom: 10px;
  text-indent: -9999em;
  border-top: 0.8em solid var(--el-color-primary);
  border-right: 0.8em solid var(--el-color-primary);
  border-bottom: 0.8em solid var(--el-color-primary);
  border-left: 0.8em solid #c5dbff;
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
#loader8,
#loader8:after {
  border-radius: 50%;
  width: 42px;
  height: 42px;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>

<style>
.noBorder {
  border: 0px !important;
  box-shadow: 0px 2px 6px 0px rgba(var(--el-color-primary-rgb), 0.15);
}
.noBorder .popper__arrow {
  display: none;
}
.customTimePopoverClass .el-popover__title {
  text-align: center;
}
</style>
