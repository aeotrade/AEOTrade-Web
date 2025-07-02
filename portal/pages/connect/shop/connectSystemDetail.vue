<script setup>
import { openUserConnect, getConnectorDetail } from "@/api/connect";
const route = useRoute();
const connectInfo = ref({});
const activeName = ref("first");
const pagination = reactive({
  pageInfo: {
    currentpage: 1,
    pagesize: 10,
  },
  totalInfo: 10,
});

const infoSizeSearch = (val) => {
  /* 改变显示数量 */
  pagination.pageInfo.currentpage = 1;
  pagination.pageInfo.pagesize = val;
};
const infoCurrSearch = (val) => {
  /* 改变当前页 */
  pagination.pageInfo.currentpage = val;
  console.log(val);
};
const handleClick = (tab, event) => {
  pagination.pageInfo.pagesize = 10
  pagination.pageInfo.currentpage = 1
   if(tab.paneName === 'first'){
    pagination.totalInfo =   connectInfo.value.trigger_event_list.length || 0
   }

   if(tab.paneName === 'second'){
    pagination.totalInfo =   connectInfo.value.execute_action_list.length || 0
   }
};
const cellClickHandle = (row, column) => {
  console.log(column);
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
const tableHandleClick = (row, column, event) => {
  if (row.detail_url) {
    window.open(row.detail_url);
  }
};
const open = () => {
  ElMessageBox.confirm("确认是否开通该连接器?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  }).then(() => {
    if (connectInfo.value.opened) {
      ElMessage.warning("您已开通该连接器，可在我的连接器查看");
      return;
    }
    let formdata = new FormData();
    formdata.append("connector_id", route.query.index);
    openUserConnect(formdata).then((res) => {
      if (res.code == 0) {
        ElMessage.success("恭喜你,开通成功");
        getData();
      } else {
        if (res.message == "invalid operation") {
          ElMessage.warning("您已开通该连接器，可在我的连接器查看");
        }
      }
    });
  });
};
const getData = () => {
  let index = route.query.index;

  getConnectorDetail(index).then((res) => {
    Object.assign(connectInfo.value, res.data);
  });
};

onMounted(() => {
  nextTick(() => {
    getData();
  });
});

const trigger_event_list = computed(() => {
  let cur =
    (pagination.pageInfo.currentpage - 1) * pagination.pageInfo.pagesize;
  let size = pagination.pageInfo.pagesize * pagination.pageInfo.currentpage;
  let data = connectInfo.value.trigger_event_list || []
  return  data.slice(cur, size);
});

const execute_action_list = computed(() => {
  let cur =
    (pagination.pageInfo.currentpage - 1) * pagination.pageInfo.pagesize;
  let size = pagination.pageInfo.pagesize * pagination.pageInfo.currentpage;
  let data = connectInfo.value.execute_action_list || []
  return data
    .slice(cur, size)
    .filter((item, index) => {
      return !item.name && !item.desc && !item.master_data_model ? false : true;
    });
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
      <el-breadcrumb-item :to="{ path: '/connect/shop/connectSystem' }">
        <span style="font-weight: normal; color:#666;"
          >连接器中心</span
        ></el-breadcrumb-item
      >
      <el-breadcrumb-item>
        <span style="font-size: 14px; color: #101010">{{
          connectInfo.connector_name
        }}</span></el-breadcrumb-item
      >
    </el-breadcrumb>
    <div
        style=" padding: 15px;"
    >
      <div class="card" style="padding-top: 31px;">
        <div class="main-info" v-if="connectInfo.connector_image">
          <img
              :src="connectInfo.connector_image"
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
              {{ connectInfo.connector_name }}
            </div>
            <div style="margin-bottom: 10px">
            <span style="font-weight: bold">描述: </span
            >{{ connectInfo.connector_desc }}
            </div>
            <div>
            <span style="font-weight: bold">提供商：</span
            >{{ connectInfo.connector_provider }}
            </div>
          </div>
          <div class="openbtn" v-if="connectInfo.opened">已开通</div>
          <div class="openbtn kt" v-else @click="open">立即开通</div>
          <!--          <el-button type="primary" size="small" style="width: 80px;height: 32px" class="openbtn" @click="open">{{connectInfo.opened ?'已开通':'开通'}}</el-button>-->
        </div>
        <!--        <div class="line"></div>-->
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="触发事件" name="first">
            <div class="eventList">
              <!--            <div class="eventName">触发事件列表</div>-->
              <div class="eventDesc">
                {{ connectInfo.trigger_event_desc || "" }}
              </div>
              <div class="mytable">
                <el-table :data="trigger_event_list" border width="100%">
                  <el-table-column label="名称" align="center">
                    <template #default="scope">
                      <p
                          @click="cellClickHandle(scope.row, scope.column)"
                          class="cellHover"
                      >
                        {{ scope.row.name }}
                      </p>
                    </template>
                  </el-table-column>
                  <el-table-column label="描述" align="center">
                    <template #default="scope">
                      {{ scope.row.desc }}
                    </template>
                  </el-table-column>
                  <el-table-column label="数据模型" align="center">
                    <template #default="scope">
                      <p
                          @click="cellClickHandle(scope.row, scope.column)"
                          class="cellHover"
                      >
                        {{ scope.row.master_data_model }}
                      </p>
                    </template>
                  </el-table-column>
                </el-table>
                <div
                    style="display: flex; justify-content: end; margin-top: 32px"
                >
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
          <el-tab-pane label="执行动作" name="second">
            <div class="eventList">
              <!--            <div class="eventName">执行动作列表</div>-->
              <div class="eventDesc">
                {{ connectInfo.execute_action_desc || "" }}
              </div>
              <div class="mytable">
                <el-table :data="execute_action_list" border width="100%">
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
                <div
                    style="display: flex; justify-content: end; margin-top: 32px"
                >
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

  </div>
</template>

<style scoped lang="scss">
:deep() {
  .mytable {
    .cellHover {
      &:hover {
        color: var(--el-color-primary);
        cursor: pointer;
      }
    }
    p {
      margin: 0;
    }
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
.head {
  padding: 15px 10px 15px;
  background-color: #fff;
  box-sizing: border-box;
  margin-bottom: 13px;
}
.title {
  .buleLine {
    width: 4px;
    height: 24px;
    background-color: var(--el-color-primary);
    margin-right: 13px;
    font-family: SourceHanSansSC-bold;
  }
  display: flex;
  align-items: center;
  color: rgba(16, 16, 16, 100);
  box-sizing: border-box;
  font-size: 14px;
  font-family: SourceHanSansSC-bold;
  font-weight: bold;
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
  box-sizing: border-box;
  background-color: #fff;
  padding: 24px 40px;
  .main-info {
    display: flex;
    position: relative;
    align-items: center;
    font-size: 14px;
    margin-bottom: 36px;
    .openbtn {
      width: 120px;
      height: 40px;
      line-height: 40px;
      border-radius: 20px;
      background-color: #cdcdcd;
      color: #fff;
      font-size: 14px;
      text-align: center;
      cursor: pointer;
      position: absolute;
      right: 0px;
      top: 16px;
      &.kt {
        background-color: var(--el-color-primary);
        color: #fff;
        cursor: pointer;
        &:hover {
          background-color: rgba(var(--el-color-primary-rgb), 0.9);
        }
      }
    }
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
    }
  }
  .line {
    background-color: #bbb;
    height: 1px;
    margin-top: 15px;
    margin-bottom: 15px;
  }
}
</style>
