<script setup>
const dayjs = useDayjs();
import {
  postUserCompanyNameByid,
  showHiddenContract as showHiddenContractApi,
  hiddenContract,
  getContracttplType,
  delContract as delContractApi,
  getStratCom,
  getPartInfo,
  startContract as startContractApi,
  stopContract as stopContractApi,
  getmyContracttplList,
  editContracttpl,
  getmyContracttplListDetail,
} from "@/api/connect";
import { getFirmStaffInfoApi } from "@/api/api";
const router = useRouter();
const route = useRoute();
const successStartNums = ref(0); //本次批量启动成功的数量
const shouldAbort = ref(false); //是否中断批量启动
const startStatus = ref(false); //判断是否启动完成的状态
const multipleDialogVisible = ref(false);
const companyArr = reactive({ data: [] });
const errorInfo = reactive({ data: {} }); // 警告提示框
const errorDialogVisible = ref(false);
const partDialogVisible = ref(false);
const contractTableData = reactive({ data: [] }); //合约数据
const DialogVisible = ref(false);
const memberId = ref(cookies.getItem("memberId"));
const pagination = reactive({
  pageInfo: {
    currentpage: 1,
    pagesize: 10,
  },
  totalInfo: 0,
});
const olvData = ref({});
const loopId = ref(0); // 定时器id
const loading = ref(false);
const multipleSelection = ref([]);
const stateMap = {
  1: "待执行",
  2: "执行中",
  3: "执行中", // 执行中异常 但是对外显示执行中
  4: "已暂停",
  5: "执行异常",
  6: "执行完成",
};
const stateArray = [
  { label: "全部", value: "" },
  { label: "待执行", value: "1" },
  { label: "执行中", value: "2" },
  { label: "执行中(异常)", value: "3" }, // 执行中异常 但是对外显示执行中
  { label: "已暂停", value: "4" },
  { label: "执行异常", value: "5" },
  { label: "执行完成", value: "6" },
];
const colroMap = {
  1: "#000000",
  2: "var(--el-color-primary)",
  3: "var(--el-color-primary)",
  4: "#A1A1A1",
  5: "#FF0000",
  6: "#000000",
};
const useStateMap = {
  1: "暂存",
  2: "全部启用",
  3: "停用",
  4: "部分启用",
};
const useStateArr = [
  { label: "全部", value: "" },
  { label: "暂存", value: "1" },
  { label: "部分启用", value: "4" },
  { label: "全部启用", value: "2" },
  { label: "停用", value: "3" },
];
const formInline = reactive({
  contractname: "",
  orgid: "",
  releasestatus: "",
  executestatus: "",
  categoryCode: [""],
  hidden: false,
});
const memberNameMap = reactive({}); //menberId - 公司名称键值对
const partInfo = reactive({ data: {} });
const navbarList = reactive({ data: [] }); // 合约分类
const formAble = reactive({
  contractname: false,
  orgid: false,
  releasestatus: false,
  executestatus: false,
  categoryCode: false,
});
const showHiddenContract = ref(false);
const authonDialog = ref(null);
const { user } = useUser();
const loginMessage = user.value.bind;

const titleShow = computed(() => {
  if (!route.query.titleShow) return false;
  let emptyKeyValue = ["null", "undefined", ""];
  if (emptyKeyValue.indexOf(route.query.titleShow) > -1) return false;
  return true;
});
onMounted(() => {
  // 判断页面参数是否有查询的字段 如果有就加入到query 中
  let query = route.query;
  Object.keys(query).forEach((item) => {
    if (formInline.hasOwnProperty(item)) {
      formAble[item] = true;
      if (item != "categoryCode") {
        formInline[item] = query[item];
      } else {
        formInline[item] = query[item].split(",");
      }
    }
  });
  nextTick(() => {
    getContractKind();
    getStratCom().then((res) => {
      companyArr.data = res.data;
      // postUserCompanyNameByid({ ids: res.data }).then((res1) => {
        
      //   // res1.result.map((item) => {
      //   //   memberNameMap[item.id] = item.memberName;
      //   // });
      // });
      searchList();
    });

    loopId.value = setInterval(() => {
      if (!multipleDialogVisible.value) {
        searchList();
      }
    }, 1000 * 60 * 2); // 每两分钟更新一次列表
  });
});
onBeforeUnmount(() => {
  clearInterval(loopId.value);
});

const numberComputed = (numberData, executeStatus) => {
  // 返回的是数字
  if (typeof numberData === "number") {
    // -1 为 持续采集
    if (numberData === -1) {
      return "-";
    }
    // 小于 -1 为 计算中
    else if (numberData <= -2) {
      return "计算中";
    } else {
      return numberData;
    }
  } else {
    //  返回的是null

    //执行状态为 1 待启动  显示  -
    if (executeStatus == 1) {
      return "-";
    } else {
      // 其他状态显示 计算中
      return "计算中";
    }
  }
};
const windowOpen = (url) => {
  window.open(url);
};
const openQAWindow = (url) => {
  if (window.openInBrowser) {
    // 客户端使用打开
    window.openInBrowser(url);
  } else {
    window.open(url);
  }
};
const showHiddenRowContract = (id, row) => {
  row.loading = true;
  showHiddenContractApi({ contractId: id, hidden: false })
    .then((res) => {
      if (res.code === "0000") {
        ElMessage.success("撤销隐藏合约成功");
        searchList();
      }
    })
    .finally(() => {
      row.loading = false;
    });
};
//  隐藏合约
const hiddenRowContract = (id, row) => {
  ElMessageBox.confirm("确认隐藏该合约？", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
  }).then((res) => {
    row.loading = true;
    hiddenContract({ contractId: id, hidden: true })
      .then((res) => {
        if (res.code === "0000") {
          ElMessage.success("隐藏合约成功");
          searchList();
        }
      })
      .finally(() => {
        row.loading = false;
      });
  });
};
const handleTagMove = (e) => {
  if (formAble.categoryCode) {
    formInline.categoryCode.push(e);
    return;
  }
  if (!e || formInline.categoryCode.length === 0) {
    formInline.categoryCode = [""];
  }
};
const handleKindsChange = (e) => {
  // 判断数据是否有点击到全部选项
  if (e[e.length - 1] === "") {
    formInline.categoryCode = [""];
  } else {
    if (e[e.length - 2] === "") {
      let data = e[e.length - 1];
      formInline.categoryCode = [data];
    }
  }
};
// 获取合约模板分类
const getContractKind = () => {
  getContracttplType().then((res) => {
    navbarList.data = [{ categoryName: "全部", categoryCode: "" }, ...res.data];
  });
};
// 删除暂存的合约
const delContract = (id, row) => {
  ElMessageBox.confirm("确定删除暂存的合约?", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
  }).then((res) => {
    row.loading = true;
    delContractApi(id)
      .then((res) => {
        if (res.code == "0000") {
          ElMessage.success("删除成功");
        }
        searchList();
      })
      .finally(() => {
        row.loading = false;
      });
  });
};
const reset = () => {
  Object.assign(formInline, {
    contractname: "",
    orgid: "",
    releasestatus: "",
    executestatus: "",
    categoryCode: [""],
    hidden: false,
  });
  pagination.pageInfo.currentpage = 1;
  searchList();
};
const onSubmit = () => {
  pagination.pageInfo.currentpage = 1;
  searchList();
};
// 查看多协作方合约启用状态(部分启用可看)
const openPartstart = (item) => {
  partInfo.data = item;
  getPartInfo({ contractid: item.contractId }).then((res) => {
    let map = {};
    let data = res.data;
    if (data.length) {
      data.forEach((item) => {
        map[item.collaborationOrgId] = item.releaseStatus;
      });
      partInfo.data.orgAlias.forEach((item) => {
        item.readstate = map[item.collaborationOrgId] || 1;
        item.releaseTime = data.find(
          (state) => state.collaborationOrgId === item.collaborationOrgId
        ).releaseTime;
      });
    }
    partDialogVisible.value = true;
    // collaborationOrgId
  });
};
// 将查询到的 企业信息转换为 id-name 对象结结构
const toMap = (arr) => {
  // 一个方法
  let numberArr = arr.map(
    (item) => item.collaborationOrgId || item.organizationId
  )
  let numeberArr2 = [];
  arr.forEach((item) => {
    if (item.orgAlias.length) {
      item.orgAlias.forEach((item1) => {
        let num = item1.collaborationOrgId || item1.organizationId;
        numeberArr2.push(num);
      });
    }
  });
  numberArr = numberArr.concat(numeberArr2).concat(companyArr.data);;
  let numberNameArr = [...new Set(numberArr)];
  postUserCompanyNameByid({ ids: numberNameArr }).then((res) => {
    res.result.map((item) => {
       memberNameMap[item.id] = item.memberName;
    });
  });
};

const selectRecord = (name, id) => {
  router.push({ path: "/connect/recording", query: { name, id } });
};
const getAuthor = () => {
  return new Promise((resolve) => {
    getFirmStaffInfoApi({ memberId: loginMessage.memberid }).then((res) => {
      if (res.result && res.result.sgsStatus == 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};
//启用合约
const changeContract = async (
  id,
  state,
  releaseStatus,
  multiple,
  fun,
  errs
) => {
  if (releaseStatus != 1 && releaseStatus != 4) {
    return;
  }
  let res = await getmyContracttplListDetail(id);
  let memberId = loginMessage.memberid;
  let query = {
    contractId: id,
    name: res.data.name,
    releaseStatus: 2,
    orgAlias: res.data.orgAlias,
    processDefine: res.data.processDefine, // xml bpmn
  };

  if (releaseStatus == 1) {
    //hiddenMessage 不提示报错信息
    await editContracttpl(query, { hiddenMessage: true })
      .then((res) => {
        if (res.code == "0000") {
          fun();
        }
      })
      .catch((e) => {
        errs();
      });
  }
  if (releaseStatus == 4) {
    let res1 = await getPartInfo({ contractid: id });
    let release = res1.data.find(
      (item1) => item1.collaborationOrgId == memberId
    ).releaseStatus;
    console.log("----release----", release);
    if (release == "2") {
      // 对于当前用户来说该合约处于已启用状态
      errs();
    } else {
      // 对于当前用户的合约来说事未执行 执行合约  不提示报错信息
      await editContracttpl(query, { hiddenMessage: true })
        .then((res) => {
          if (res.code == "0000") {
            fun();
          }
        })
        .catch((e) => {
          errs();
        });
    }
  }
};
// 执行合约
const startContract = async (id, state, releaseStatus, row) => {
  if (releaseStatus == 1) {
    // 处于部分启用状态

    ElMessage.error("请先启用合约后执行操作");

    return;
  }
  if (releaseStatus == 4) {
    ElMessage.error("合约没有全部启用，无法执行合约");

    return;
  }
  row.loading = true;
  //id
  await startContractApi(id)
    .then((res) => {
      if (res.code == "0000") {
        ElMessage.success("执行合约成功");
        searchList();
      }
    })
    .catch((e) => {})
    .finally(() => {
      row.loading = false;
    });
};
//暂停合约
const stopContract = (id, row) => {
  console.log(id);
  row.loading = true;
  stopContractApi(id)
    .then((res) => {
      if (res.code == "0000") {
        ElMessage.success("暂停合约成功");
        searchList();
      }
    })
    .finally(() => {
      row.loading = false;
    });
};
// 打开执行异常消息弹窗
const openErrorMessage = (id, readstate, index) => {
  errorDialogVisible.value = true;
  errorInfo.data = contractTableData.data[index];
  return;
};
// 跳转协作合约详情
const goto = (id, readstate, index) => {
  if (window.self != window.top) {
    let url = route.query.targetUrl ? route.query.targetUrl : document.referrer;
    sessionStorage.setItem("contractBackUrl", url);
    // 处于子页面
    // window.parent.postMessage({ type: 'navigate', route: "/connect/processEngine/baseInfo?id=" + id }, '*');

    window.parent.location.replace("/connect/processEngine/baseInfo?id=" + id);
  } else {
    // 没有被嵌套
    router.push("/connect/processEngine/baseInfo?id=" + id);
  }
};
const goEdit = (id, readstate, index) => {
  if (showHiddenContract.value) return;
  if (window.self != window.top) {
    let url = route.query.targetUrl ? route.query.targetUrl : document.referrer;
    sessionStorage.setItem("contractBackUrl", url);
    // 处于子页面
    window.parent.location.replace("/connect/processEngine/baseInfo?id=" + id);
    //window.parent.postMessage({ type: 'navigate', route: "/connect/processEngine/baseInfo?id=" + id }, '*');
  } else {
    // 没有被嵌套
    router.push("/connect/processEngine/baseInfo?id=" + id);
  }
  // window.open('/connect/#/baseInfo?id='+id)
};
// 获取数据列表
const searchList = () => {
  loading.value = true;
  let params = {};
  if (formInline.contractname) {
    params.contractname = formInline.contractname;
  }
  if (formInline.orgid) {
    params.orgid = formInline.orgid;
  }
  if (formInline.releasestatus) {
    params.releasestatus = formInline.releasestatus;
  }
  if (formInline.executestatus) {
    params.executestatus = formInline.executestatus;
  }

  params.hidden = formInline.hidden;

  if (formInline.categoryCode[formInline.categoryCode.length - 1] !== "") {
    params.categorycode = formInline.categoryCode.join(","); // 实际入参是小写categorycode
  }

  getmyContracttplList({ ...pagination.pageInfo, ...params })
    .then((res) => {
      if (res.code === "1000") {
        contractTableData.data = [];
        pagination.totalInfo = 0;
        toMap([]);
        return;
      }
      showHiddenContract.value = params.hidden;
      contractTableData.data = res.data.records;
      pagination.totalInfo = res.data.total * 1;
      toMap(res.data.records);
    })
    .finally(() => {
      loading.value = false;
    });
};
// 每页条数变更
const handleSizeChange = (val) => {
  pagination.pageInfo.currentpage = 1;
  pagination.pageInfo.pagesize = val;
  searchList();
};
// 页数调整
const handleCurrentChange = (val) => {
  pagination.pageInfo.currentpage = val;
  searchList();
};
const names = (arr) => {
  let str = "";
  if (arr.length) {
    arr.forEach((item) => {
      let name =
        memberNameMap[item.collaborationOrgId] || "待设置具体的协作组织";
      str = str + item.aliasName + ":" + name + " ";
    });
  }
  return str || "待设置具体的协作组织";
};

// filters: {
//   timeRange(value, type){
//     if(!value) return
//     if(type === 'by_time_continue'){
//       return '持续采集'
//     }else{
//       let arr = value.split(',')
//       let sDate = new Date(arr[0]).valueOf()
//       let startDate = formatDate((new Date(arr[0])).valueOf(), 'Y-M-D').slice(0, 10)
//       let endDate = formatDate((new Date(arr[1])).valueOf(), 'Y-M-D').slice(0, 10)
//       return startDate + ' 至 ' + endDate
//     }
//   }
// },
const handleSelectionChange = (val) => {
  console.log(val);
  multipleSelection.value = val;
};
// 批量启用合约
const startContractBySelection = async () => {
  if (!multipleSelection.value.length) {
    ElMessage.error("请选择要启用的合约");
    return false;
  }
  let flag = await getAuthor();
  if (!flag) {
    authonDialog.value = true;
    multipleDialogVisible.value = false;
    return;
  }
  shouldAbort.value = false;
  successStartNums.value = 0;
  startStatus.value = false;
  multipleDialogVisible.value = true;
  const concurrencyLimit = 5; // 同时发起请求的最大数量
  let concurrentRequests = 0; // 当前并发请求数量的计数器
  let currentIndex = 0; // 当前处理的索引

  while (currentIndex < multipleSelection.value.length && !shouldAbort.value) {
    // 若当前的并发请求数量小于最大限制，则可以发起新的请求
    if (concurrentRequests < concurrencyLimit) {
      const currentIndexSelection = multipleSelection.value[currentIndex];

      // 发起请求前，增加并发请求数量的计数器
      concurrentRequests++;

      // 使用try/catch捕获请求的异常，以便处理错误
      try {
        console.log(memberId.value, currentIndexSelection.organizationId);
        console.log(currentIndexSelection.executeStatus, "异常");
        if (
          currentIndexSelection.releaseStatus != 1 &&
          currentIndexSelection.releaseStatus != 4
        ) {
          concurrentRequests--;
        } else {
          console.log(currentIndexSelection, "正常");
          await changeContract(
            currentIndexSelection.contractId,
            currentIndexSelection.executeStatus,
            currentIndexSelection.releaseStatus,
            true,
            function () {
              successStartNums.value++;
              concurrentRequests--;
            },
            () => {
              concurrentRequests--;
            }
          );
        }
      } catch (error) {
        // concurrentRequests--;
      }

      // 请求完成后，减少并发请求数量的计数器

      currentIndex++;
      console.log(currentIndex);
    } else {
      // 当前并发请求数量达到最大限制，等待一段时间后继续检查
      await new Promise((resolve) => setTimeout(resolve, 3000)); // 可根据需要调整等待时间
    }
  }

  console.log("所有数据状态修改完成");
  startStatus.value = true;
  console.log(successStartNums.value);
  console.log(concurrentRequests);
  // searchList();
};

//终止批量
const abortStartContractBySelection = () => {
  multipleDialogVisible.value = false;
  shouldAbort.value = true;
  searchList();

  console.log("批量启动终止");
};
const closeStart = () => {
  multipleDialogVisible.value = false;
  searchList();
};
const jumpCanvas = () => {
  if (window.self != window.top) {
    // 处于子页面
    sessionStorage.setItem("contractBackUrl", "");
    window.parent.location.replace("/connect/processEngine/baseInfo");
  } else {
    // 没有被嵌套
    router.push("/connect/processEngine/baseInfo");
  }
};
const jump = (val)=>{
  if(val==='0'){
    router.push('/connect/shop/connectContract')
  }else {
    jumpCanvas()
  }
}
</script>

<template>
  <div style="width: 100%; height: 100%; overflow: auto">
    <div class="title" v-if="titleShow">我的合约</div>
    <div
      style="
        width: 100%;
        display: flex;
        padding: 0 16px 16px;
        flex-direction: column;
        margin-top: 16px;
      "
    >
      <div class="head">
        <div>
          <el-form
            :inline="true"
            :model="formInline"
            class="demo-form-inline"
            style="width: 100%; display: flex"
          >
            <el-row :gutter="20" style="max-width: 1440px">
              <el-col :span="4">
                <el-form-item label="合约名称:">
                  <el-input
                    :disabled="formAble.contractname"
                    v-model.trim="formInline.contractname"
                    placeholder="请输入合约名称"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="合约发起方:">
                  <el-select
                    v-model="formInline.orgid"
                    placeholder="请选择合约发起方"
                    :disabled="formAble.orgid"
                    filterable
                  >
                    <el-option label="全部" value=""></el-option>
                    <el-option
                      :label="memberNameMap[item]"
                      :value="item"
                      v-for="item in companyArr.data"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="合约分类:">
                  <el-select
                    v-model="formInline.categoryCode"
                    @remove-tag="handleTagMove"
                    :multiple="true"
                    @change="handleKindsChange"
                    collapse-tags
                  >
                    <el-option
                      :label="item.categoryName"
                      :disabled="formAble.categoryCode"
                      :value="item.categoryCode"
                      v-for="(item, index) in navbarList.data"
                      :key="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="启用状态:">
                  <el-select
                    v-model="formInline.releasestatus"
                    placeholder="请选择启用状态"
                    :disabled="formAble.releasestatus"
                  >
                    <el-option
                      :label="item.label"
                      :value="item.value"
                      v-for="(item, index) in useStateArr"
                      :key="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="执行状态:">
                  <el-select
                    v-model="formInline.executestatus"
                    placeholder="请选择执行状态"
                  >
                    <el-option
                      :label="item.label"
                      :value="item.value"
                      v-for="(item, index) in stateArray"
                      :key="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="显示状态:">
                  <el-select v-model="formInline.hidden">
                    <el-option label="可见" :value="false"></el-option>
                    <el-option label="隐藏" :value="true"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <div style="flex: 1; text-align: right; margin-right: 20px">
              <el-button @click="reset">重置</el-button>
              <el-button type="primary" @click="onSubmit">查询</el-button>
            </div>
          </el-form>
        </div>
      </div>
      <div style="background-color: #fff" class="card">
        <!--          <el-button  style="margin-bottom: 20px;float: right;border: 1px solid var(--el-color-primary);color: var(--el-color-primary)"-->
        <!--          @click="showHiddenContract = !showHiddenContract"-->
        <!--          >{{showHiddenContract?'未隐藏合约':'已隐藏合约'}}</el-button>-->

        <el-button
          @click="startContractBySelection"
          style="
            margin-bottom: 20px;
            border: 1px solid var(--el-color-primary);
            color: var(--el-color-primary);
          "
          size="small"
          >启用合约</el-button
        >
        <el-dropdown trigger="click" @command="jump">
          <el-button style="margin-left: 12px;border: 1px solid var(--el-color-primary);color: var(--el-color-primary);" size="small">
            创建合约
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="0">模板创建</el-dropdown-item>
              <el-dropdown-item command="1">空白创建</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-table
          :data="contractTableData.data"
          style="width: 100%; height: calc(100vh - 310px)"
          v-loading="loading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column align="center" label="合约名称">
            <template #default="scope"
              ><span
                :class="[showHiddenContract ? '' : 'contractName']"
                @click="
                  goEdit(
                    scope.row.contractId,
                    scope.row.executeStatus,
                    scope.$index
                  )
                "
                >{{ scope.row.name }}</span
              ></template
            >
          </el-table-column>
          <el-table-column label="执行状态:已执行/未执行" align="center">
            <template #default="scope">
              <div style="display: flex; justify-content: center">
                <!-- 执行中异常             -->
                <el-tooltip
                  v-if="scope.row.executeStatus == '3'"
                  popper-class="noBorder"
                  placement="top"
                  effect="light"
                  :enterable="false"
                >
                  <div style="color: #FF0000">
                    <svg-icon
                      icon-class="warning"
                      style="color: #ff8e04; font-size: 14px"
                    />
                    {{ stateMap[scope.row.executeStatus] }}
                  </div>
                  <template #content>
                    <div
                      style="margin-bottom: 4px; max-width: 400px"
                      v-for="(item, index) in scope.row.executeStatusMessage"
                    >
                      <span v-if="scope.row.executeStatusMessage.length != 1"
                        >{{ index + 1 }}、</span
                      ><span v-html="item.replace(/\r\n/g, '<br>')"></span>
                    </div>
                  </template>
                </el-tooltip>
                <!-- 执行异常               -->
                <div
                  v-else-if="scope.row.executeStatus == '5'"
                  @click="
                    openErrorMessage(
                      scope.row.contractId,
                      scope.row.executeStatus,
                      scope.$index
                    )
                  "
                  class="errorMessage"
                  :style="{ color: colroMap[scope.row.executeStatus] }"
                >
                <svg-icon
                      icon-class="warning"
                      style="color: #ff0000; font-size: 14px"/>
                  {{ stateMap[scope.row.executeStatus] }}
                </div>
                <!--    其他状态            -->
                <div
                  v-else
                  :style="{ color: colroMap[scope.row.executeStatus] }"
                >
                  {{ stateMap[scope.row.executeStatus] }}
                </div>
                <span style="margin: 0 3px;">
                  :
                </span>
                <div
                  style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                >
                <!-- 已执行数 -->
                  <span
                    @click="selectRecord(scope.row.name, scope.row.contractId)"
                    :class="[scope.row.executedNum ? 'executedNum' : '']"
                    >{{
                      typeof scope.row.executedNum === "number"
                        ? scope.row.executedNum
                        : "-"
                    }}</span
                  >
                  <span style="margin: 0 3px;">/</span>
                      <!-- 待执行数 -->
                  <!--                  <svg-icon iconClass="infinity" style="font-weight: bold;font-size: 18px" v-if="scope.row.remainingNum==-1"></svg-icon>-->
                  <span v-if="scope.row.remainingNum == -1">- <tip :messages="['持续执行合约，执行次数会持续增长，无法计算“未执行”数量']"></tip></span>
                  <span v-else>{{
                    numberComputed(
                      scope.row.remainingNum,
                      scope.row.executeStatus
                    )
                  }}</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="合约发起方">
            <template #default="scope">{{
              memberNameMap[scope.row.organizationId]
            }}</template>
          </el-table-column>
          <el-table-column align="center" width="230" label="合约协作方">
            <template #header="{ column, $index }">
              <div>
                <span>{{ column.label }}</span>
                <tip :messages="['共同编辑合约的组织机构']"></tip>
              </div>
            </template>
            <template #default="scope">
              <div
                style="
                  width: 210px;
                  cursor: pointer;
                  text-decoration: underline;
                "
                class="ellipsis"
                @click="
                  olvData = scope.row;
                  DialogVisible = true;
                "
                v-if="scope.row.orgAlias"
              >
                {{ names(scope.row.orgAlias) }}
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建时间">
            <template #default="scope"
              ><span>{{
                dayjs(scope.row.createDate).format("YYYY-MM-DD HH:mm:ss")
              }}</span></template
            >
          </el-table-column>
          <el-table-column label="启用状态" align="center">
            <template #header="{ column, $index }">
              <div>
                <span>{{ column.label }}</span>
                <tip :messages="['单个或多个协作方完成编辑合约的状态']"> </tip>
              </div>
            </template>
            <template #default="scope">
              <div v-if="scope.row.releaseStatus != 4">
                {{ useStateMap[scope.row.releaseStatus] }}
              </div>
              <!--   处于部分启用状态             -->
              <div
                style="color: var(--el-color-primary); cursor: pointer"
                v-else
                @click="openPartstart(scope.row)"
              >
                {{ useStateMap[scope.row.releaseStatus] }}
              </div>
            </template>
          </el-table-column>
          <!--          <el-table-column label="执行状态" align="center">
            <template #default="scope">
              &lt;!&ndash;   执行中异常             &ndash;&gt;
              <el-tooltip
                v-if="scope.row.executeStatus == '3'"
                popper-class="noBorder"
                placement="top"
                effect="light"
                :enterable="false"
              >
                <div style="color: var(&#45;&#45;el-color-primary)">
                  {{ stateMap[scope.row.executeStatus] }}
                  <svg-icon
                    icon-class="warning"
                    style="color: #ff8e04; font-size: 14px"
                  />
                </div>
                <template #content>
                  <div
                    style="margin-bottom: 4px;max-width: 400px;"
                    v-for="(item, index) in scope.row.executeStatusMessage"
                  >
                  <span v-if="scope.row.executeStatusMessage.length != 1">{{ index + 1 }}、</span><span v-html="item.replace(/\r\n/g, '<br>')"></span>
                  </div>
                </template>
              </el-tooltip>
              &lt;!&ndash; 执行异常               &ndash;&gt;
              <div
                v-else-if="scope.row.executeStatus == '5'"
                @click="
                  openErrorMessage(
                    scope.row.contractId,
                    scope.row.executeStatus,
                    scope.$index
                  )
                "
                class="errorMessage"
                :style="{ color: colroMap[scope.row.executeStatus] }"
              >
                {{ stateMap[scope.row.executeStatus] }}
              </div>
              &lt;!&ndash;    其他状态            &ndash;&gt;
              <div v-else :style="{ color: colroMap[scope.row.executeStatus] }">
                {{ stateMap[scope.row.executeStatus] }}
              </div>
            </template>
          </el-table-column>-->
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <div
                v-if="!showHiddenContract"
                v-loading="scope.row.loading"
                style="--el-loading-spinner-size: 24px"
              >
                <el-tooltip
                  popper-class="noBorder"
                  content="编辑"
                  placement="top"
                  effect="light"
                  :enterable="false"
                >
                  <span
                    style="cursor: pointer"
                    class="font"
                    @click="
                      goto(
                        scope.row.contractId,
                        scope.row.executeStatus,
                        scope.$index
                      )
                    "
                  >
                    <el-icon style="font-size: 16px; margin-right: 10px">
                      <Edit />
                    </el-icon>
                  </span>
                </el-tooltip>
                <!-- 执行中2 , 执行中异常3 可暂停  ,其他可执行 , 执行完成6 或者 合约协作方(非合约发起方)隐藏执行功能-->
                <el-tooltip
                  popper-class="noBorder"
                  :content="(scope.row.executeStatus != '2'  && scope.row.executeStatus != '3') ? '执行' : '暂停'"
                  placement="top"
                  effect="light"
                  :enterable="false"
                  v-if="
                    memberId == scope.row.organizationId &&
                    scope.row.executeStatus != '6'
                  "
                >
                  <span
                    style="cursor: pointer"
                    class="font"
                    v-if="scope.row.executeStatus != '2' && scope.row.executeStatus != '3' "
                    @click="
                      startContract(
                        scope.row.contractId,
                        scope.row.executeStatus,
                        scope.row.releaseStatus,
                        scope.row
                      )
                    "
                  >
                    <el-icon style="font-size: 16px"><VideoPlay /></el-icon>
                  </span>
                  <span
                    style="cursor: pointer"
                    class="font"
                    v-else
                    @click="stopContract(scope.row.contractId, scope.row)"
                  >
                    <el-icon style="font-size: 16px"><VideoPause /></el-icon>
                  </span>
                </el-tooltip>
                <el-tooltip
                  popper-class="noBorder"
                  content="隐藏"
                  placement="top"
                  effect="light"
                  :enterable="false"
                >
                  <span style="cursor: pointer" class="font">
                    <svg-icon
                      icon-class="hidden"
                      style="font-size: 16px; margin-left: 10px"
                      @click="
                        hiddenRowContract(scope.row.contractId, scope.row)
                      "
                    ></svg-icon>
                  </span>
                </el-tooltip>
                <el-tooltip
                  popper-class="noBorder"
                  content="刪除"
                  placement="top"
                  effect="light"
                  :enterable="false"
                >
                  <span
                    style="cursor: pointer; position: absolute"
                    class="font"
                    v-show="scope.row.releaseStatus == 1"
                    @click="delContract(scope.row.contractId, scope.row)"
                  >
                    <el-icon style="font-size: 16px; margin-left: 13px">
                      <Delete />
                    </el-icon>
                  </span>
                </el-tooltip>
              </div>
              <span
                v-else
                style="color: var(--el-color-primary); cursor: pointer"
                @click="showHiddenRowContract(scope.row.contractId, scope.row)"
                >取消隐藏</span
              >
            </template>
          </el-table-column>
        </el-table>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 30px;
          "
        >
          <p style="color: #929ab0">已选择 {{ multipleSelection.length }} 条</p>
          <el-pagination
            style="display: flex"
            class="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="pagination.pageInfo.currentpage"
            :page-size.sync="pagination.pageInfo.pagesize"
            :page-sizes="[10, 20, 30, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.totalInfo"
          >
          </el-pagination>
        </div>
      </div>
      <!--  执行异常弹窗   -->
      <el-dialog
        title="执行异常"
        top="30vh"
        v-model="errorDialogVisible"
        width="30%"
        class="partDialog"
        append-to-body
      >
        <div style="display: flex">
          <div style="line-height: 23px; font-size: 14px; padding-right: 24px">
            <div v-for="(item, index) in errorInfo.data.executeStatusMessage">
              {{ index + 1 }}、{{ item }}
            </div>
            <div style="margin-top: 30px; padding-bottom: 50px">
              异常解决办法详见
              <span
                style="cursor: pointer; color: var(--el-color-primary)"
                @click="
                  openQAWindow('https://help.aeotrade.com/3328/6ab3/219c')
                "
                >协作合约Q&A。</span
              >如果以上操作仍未解决问题，请拨打热线010-86398171或通过
              <span
                style="cursor: pointer; color: var(--el-color-primary)"
                @click="
                  openQAWindow(
                    'https://work.weixin.qq.com/kfid/kfc2982fbad7f93897a'
                  )
                "
                >在线客服</span
              >联系我们。
            </div>
          </div>
        </div>

        <!--          <div slot="footer" class="dialog-footer" style="text-align: right">-->
        <!--          <el-button @click="errorDialogVisible = false">取 消</el-button>-->
        <!--          <el-button type="primary" @click="errorDialogVisible = false">确 定</el-button>-->
        <!--          </div>-->
      </el-dialog>
      <!--  查看协作方弹窗      -->
      <el-dialog
        title="查看协作方"
        top="30vh"
        v-model="DialogVisible"
        width="750px"
        append-to-body
        class="partDialog"
        v-if="olvData.name"
      >
        <div style="margin-bottom: 15px; color: #424242">
          合约名称: {{ olvData.name }}
        </div>
        <div v-if="olvData.name">
          <div
            v-for="(item, index) in olvData.orgAlias"
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              height: 40px;
              border: 1px #ccc solid;
              margin-bottom: 10px;
            "
          >
            <div style="display: flex; align-items: center">
              <img
                src="~/assets/img/collaborationCenter/user.png"
                style="width: 40px; height: 40px; margin: 0 10px"
              />
              {{ item.aliasName }}
            </div>
            <div style="width: 200px">
              {{
                memberNameMap[item.collaborationOrgId] || "待设置具体的协作组织"
              }}
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align: right">
          <el-button type="primary" @click="DialogVisible = false"
            >确认</el-button
          >
        </div>
      </el-dialog>
      <!--  部分启用状态      -->
      <el-dialog
        title="查看启用状态"
        top="30vh"
        v-model="partDialogVisible"
        width="750px"
        class="partDialog"
        append-to-body
        v-if="partInfo.data.name"
      >
        <div style="margin-bottom: 15px; color: #424242">
          {{
            partInfo.data.name.length > 20
              ? partInfo.data.name.slice(0, 20) + "..."
              : partInfo.data.name
          }}
        </div>
        <div v-if="partInfo.data.name && partInfo.data.orgAlias.length">
          <div
            v-for="(item, index) in partInfo.data.orgAlias"
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              height: 40px;
              border: 1px #ccc solid;
              margin-bottom: 10px;
            "
          >
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 12px;
                width: 100%;
              "
            >
              <div style="display: flex; align-items: center">
                <img
                  src="~/assets/img/collaborationCenter/user.png"
                  style="width: 40px; height: 40px; margin: 0 10px"
                />{{ item.aliasName }}
              </div>
              <div class="ellipsis" style="width: 200px">
                {{ memberNameMap[item.collaborationOrgId] }}
              </div>
              <div>
                {{ dayjs(item.releaseTime).format("YYYY-MM-DD HH:mm:ss") }}
              </div>
              <div
                style="margin-right: 30px; width: 50px; text-align: center"
                v-if="item.readstate == 2"
              >
                已启用
              </div>
              <div
                style="margin-right: 30px; width: 50px; text-align: center"
                v-else
              >
                {{ useStateMap[item.readstate] }}
              </div>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align: right">
          <el-button type="primary" @click="partDialogVisible = false"
            >确认</el-button
          >
        </div>
      </el-dialog>

      <!--  批量启动弹窗   -->
      <el-dialog
        title="启用合约"
        top="30vh"
        v-model="multipleDialogVisible"
        width="480px"
        class="partDialog"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :destroy-on-close="true"
        append-to-body
        @close="abortStartContractBySelection"
      >
        <div
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          "
        >
          <div class="sk-circle" v-if="!startStatus">
            <div class="sk-circle1 sk-child"></div>
            <div class="sk-circle2 sk-child"></div>
            <div class="sk-circle3 sk-child"></div>
            <div class="sk-circle4 sk-child"></div>
            <div class="sk-circle5 sk-child"></div>
            <div class="sk-circle6 sk-child"></div>
            <div class="sk-circle7 sk-child"></div>
            <div class="sk-circle8 sk-child"></div>
            <div class="sk-circle9 sk-child"></div>
            <div class="sk-circle10 sk-child"></div>
            <div class="sk-circle11 sk-child"></div>
            <div class="sk-circle12 sk-child"></div>
          </div>

          <el-icon
            v-else-if="
              startStatus && successStartNums == multipleSelection.length
            "
            color="var(--el-color-primary)"
            :size="100"
            ><SuccessFilled
          /></el-icon>
          <el-icon v-else color="#FEB83D" :size="100"><Warning /></el-icon>
          <!--                <div v-if="startStatus">已完成</div>-->
          <div style="margin-top: 20px" v-if="!startStatus">
            正在启用合约中，一分钟大约能启动十个合约，请耐心等候。
          </div>
          <div
            style="margin-top: 15px"
            v-else-if="
              startStatus && successStartNums === multipleSelection.length
            "
          >
            已完成
          </div>
          <div style="margin-top: 15px" v-else>
            您有未启用成功的合约，请返回合约列表查看。
          </div>
          <div
            style="margin-top: 15px; color: var(--el-color-primary)"
            v-if="!startStatus"
          >
            若关闭该弹框或切换页面，将停止启用合约。
          </div>
          <div style="margin-top: 40px">
            选择合约数：<span style="font-weight: bold; margin-right: 100px"
              >{{ multipleSelection.length }} </span
            >启用成功：<span style="font-weight: bold">{{
              successStartNums
            }}</span>
          </div>
          <div v-if="startStatus" @click="closeStart" class="know">
            我知道了
          </div>
        </div>
      </el-dialog>
      <!--  认证   -->
      <el-dialog
        :align-center="true"
        v-model="authonDialog"
        :close-on-click-modal="false"
        :append-to-body="true"
        title="提示"
        width="390px"
      >
        <p style="margin-bottom: 10px">
          请先进行组织
          <span
            @click="windowOpen('/memberCenter/authenticationCenter')"
            style="
              cursor: pointer;
              text-decoration: underline;
              color: var(--el-color-primary);
            "
            >实名认证</span
          >，在启用合约！
        </p>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="authonDialog = false">取消</el-button>
            <el-button
              type="primary"
              @click="windowOpen('/memberCenter/authenticationCenter')"
            >
              去认证
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.errorMessage {
  &:hover {
    cursor: pointer;
    //text-decoration: underline;
  }
}
.font {
  &:hover {
    color: var(--el-color-primary);
  }
}
.head {
  //display: flex;
  //justify-content: space-between;
  //align-items: center;
  padding-left: 20px;
  padding-top: 20px;
  background-color: #fff;
  box-sizing: border-box;
  margin-bottom: 16px;
  //margin-bottom: 18px ;
}
.title {
  background-color: #fff;
  padding-left: 20px;
  height: 40px;
  line-height: 40px;
  color: rgba(16, 16, 16, 1);
  box-sizing: border-box;
  font-size: 14px;
  font-family: SourceHanSansSC-regular;
  position: sticky;
  top: 0;
  z-index: 10;
}

:deep() {
  .demo-form-inline {
    white-space: nowrap;
    .el-form-item__label {
      margin-right: 30px;
      font-size: 13px;
      font-weight: bold;
      padding: 0;
    }
    .el-tag--small {
      padding: 0;
    }
    //.el-input__wrapper {
    //  background-color: #f7f8fa;
    //}
    .el-form-item {
      width: 100%;
    }
    .el-form-item__label {
      position: absolute;
    }
    .el-form-item__content {
      width: 100%;
      padding-left: 70px;
    }
    .el-select,
    .el-input_inner {
      width: 100%;
    }
  }
  .el-dialog__footer {
    text-align: center;
  }
  .el-radio {
    margin-right: 60px;
  }
  .el-form-item__label {
    padding-right: 40px;
    font-weight: normal;
  }
  .el-dialog__title {
    font-weight: bold;
    font-size: 16px;
  }
}

.card {
  flex: 1;
  box-sizing: border-box;
  background-color: #fff;
  padding: 20px;
}

.learn-more {
  color: #409eff;
}
.el-icon-question {
  color: #a9a9a9;
}
.el-icon-question:hover {
  color: var(--el-color-primary);
}
.ctrl-item {
  display: inline-block;
  //margin: 0px 20px;
  width: 40px;
}

.contractName {
  color: var(--el-color-primary);
  cursor: pointer;
}
.executedNum {
  color: var(--el-color-primary);
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
}

.partDialog {
  :deep() {
    .el-dialog__body {
      padding-top: 12px;
      padding-bottom: 12px;
    }
  }
}
.sk-circle {
  width: 80px;
  height: 80px;
  position: relative;
}
.sk-circle .sk-child {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.sk-circle .sk-child:before {
  content: "";
  display: block;
  margin: 0 auto;
  width: 15%;
  height: 15%;
  background-color: var(--el-color-primary);
  border-radius: 100%;
  animation: sk-circleBounceDelay 1.3s infinite ease-in-out both;
}
.sk-circle .sk-circle2 {
  -webkit-transform: rotate(30deg);
  -ms-transform: rotate(30deg);
  transform: rotate(30deg);
}
.sk-circle .sk-circle3 {
  -webkit-transform: rotate(60deg);
  -ms-transform: rotate(60deg);
  transform: rotate(60deg);
}
.sk-circle .sk-circle4 {
  -webkit-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  transform: rotate(90deg);
}
.sk-circle .sk-circle5 {
  -webkit-transform: rotate(120deg);
  -ms-transform: rotate(120deg);
  transform: rotate(120deg);
}
.sk-circle .sk-circle6 {
  -webkit-transform: rotate(150deg);
  -ms-transform: rotate(150deg);
  transform: rotate(150deg);
}
.sk-circle .sk-circle7 {
  -webkit-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}
.sk-circle .sk-circle8 {
  -webkit-transform: rotate(210deg);
  -ms-transform: rotate(210deg);
  transform: rotate(210deg);
}
.sk-circle .sk-circle9 {
  -webkit-transform: rotate(240deg);
  -ms-transform: rotate(240deg);
  transform: rotate(240deg);
}
.sk-circle .sk-circle10 {
  -webkit-transform: rotate(270deg);
  -ms-transform: rotate(270deg);
  transform: rotate(270deg);
}
.sk-circle .sk-circle11 {
  -webkit-transform: rotate(300deg);
  -ms-transform: rotate(300deg);
  transform: rotate(300deg);
}
.sk-circle .sk-circle12 {
  -webkit-transform: rotate(330deg);
  -ms-transform: rotate(330deg);
  transform: rotate(330deg);
}
.sk-circle .sk-circle2:before {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}
.sk-circle .sk-circle3:before {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}
.sk-circle .sk-circle4:before {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}
.sk-circle .sk-circle5:before {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}
.sk-circle .sk-circle6:before {
  -webkit-animation-delay: -0.7s;
  animation-delay: -0.7s;
}
.sk-circle .sk-circle7:before {
  -webkit-animation-delay: -0.6s;
  animation-delay: -0.6s;
}
.sk-circle .sk-circle8:before {
  -webkit-animation-delay: -0.5s;
  animation-delay: -0.5s;
}
.sk-circle .sk-circle9:before {
  -webkit-animation-delay: -0.4s;
  animation-delay: -0.4s;
}
.sk-circle .sk-circle10:before {
  -webkit-animation-delay: -0.3s;
  animation-delay: -0.3s;
}
.sk-circle .sk-circle11:before {
  -webkit-animation-delay: -0.2s;
  animation-delay: -0.2s;
}
.sk-circle .sk-circle12:before {
  -webkit-animation-delay: -0.1s;
  animation-delay: -0.1s;
}

@keyframes sk-circleBounceDelay {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
.know {
  width: 347px;
  height: 48px;
  border-radius: 4px;
  background-color: rgba(var(--el-color-primary-rgb), 1);
  color: rgba(255, 255, 255, 1);
  font-size: 18px;
  text-align: center;
  line-height: 48px;
  margin-top: 39px;
  cursor: pointer;
}
:deep(.el-table__row) {
  &:hover {
    .el-loading-mask {
      background-color: var(--el-table-row-hover-bg-color);
    }
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
