<script setup>
// import LF from '../../components/LF/index.vue'
// const router = useRouter()
import {getContracttplType,getBanner as getBannerApi,getContracttplDetail,getContracttpl  } from '@/api/connect'

const route = useRoute();
const navbarList = reactive({ data: [] });
const cateMap = ref(new Map());
const loading = ref(true);
const banner = ref("");
const dialogVisible1 = ref(false);
const activeName = ref("scend"); // 隐藏方案介绍 暂时显示合约模板信息
const timer = ref(null); // 防抖
const topHeight = ref("");
const contractDetailInfo = reactive({ data: {} });
const xmldata = reactive({ xml: null });
const showHand = ref(false);
const scrollbar =  ref(null)
const query = reactive({
  value: "",
  categoryCode: route.query.categoryCode || "",
  currentpage: 1,
  pagesize: 1000,
});
const resultTableData = reactive({ data: [] }); // 最终返回结果
const bannerHidden = ref(false);
const searchInputHidden = ref(false);

onMounted(() => {
  route.query.value && (query.value = route.query.value);
  route.query.bannerHidden && (bannerHidden.value = true);
  route.query.searchInputHidden && (searchInputHidden.value = true);
  nextTick(() => {
    getBanner();
    getType();
    getList();
    window.addEventListener("scroll", load);
  });
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", load);
});

const load = () => {
  let scrollTop =
    document.documentElement.scrollTop ||
    document.body.scrollTop;
  if (scrollTop >= 10) {
    showHand.value = true;
  } else {
    showHand.value = false;
  }
};

const getType = async () => {
  let res = await getContracttplType();
  res.data.forEach((item) => {
    cateMap.value.set(item.categoryCode, {
      categoryName: item.categoryName,
      description: item.description,
    });
  });
  navbarList.data = res.data;
};
const close = () => {
  // 弹窗回归至默认状态
  activeName.value = "scend";
  topHeight.value = 0;
};
const getBanner = () => {
  getBannerApi(21).then((res) => {
    banner.value = res.data.list[0].pic;
  });
};
const useTpl = () => {
  // 处于子页面
  let url = route.query.targetUrl ? route.query.targetUrl : document.referrer;
  sessionStorage.setItem("contractBackUrl", url);
  window.parent.location.replace(
    "/connect/processEngine/baseInfo?tplId=" + contractDetailInfo.data.contractTplId
  );
};
const rightScrollEvent = (e) => {
  debounce(() => {
    let scrollTop = e.scrollTop; // 滚动的高度
    console.log(scrollTop);
    topHeight.value = scrollTop;
  }, 20);
};
// 防抖
const debounce = (fn, time) => {
  if (timer.value) {
    clearTimeout(timer.value);
  }
  timer.value = setTimeout(() => {
    timer.value = null;
    fn();
  }, time);
};
const open = (id) => {
  getContracttplDetail(id).then((res) => {
    contractDetailInfo.data = res.data;
    // xmldata.xml=res.data.processDefine
    xmldata.xml = res.data.processDefine; //组件视图未更新
    dialogVisible1.value = true; // 先进行数据更后继续进行视图渲染
  });

  nextTick(() => {
    if (scrollbar.value) {
      scrollbar.value.addEventListener('scroll', rightScrollEvent);
      }
  });
};
const getList = () => {
  window.scrollTo(0, 0);
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  loading.value = true;
  if (timer.value) {
    clearTimeout(timer.value);
  }
  timer.value = setTimeout(() => {
    let params = {
      currentpage: 1,
      pagesize: 1000,
    };
    let categoryArray = [];
    if (query.value) {
      params.tplname = query.value;
    }

    if (query.categoryCode) {
      categoryArray = query.categoryCode.split(",");
    } else {
      categoryArray = navbarList.data.map((item) => item.categoryCode);
    }

    const requests = categoryArray.map((cate) => {
      return getContracttpl({ ...params, ccode: cate });
    });
    Promise.all(requests)
      .then((res) => {
        let nullArray = true;
        console.log(res);
        res.forEach((item, index) => {
          let tempalteCate = [];
          if (item.code === "0000") {
            tempalteCate = item.data.records;
            nullArray = false;
          } else {
            tempalteCate = [];
          }
          resultTableData.data[index] =  {
            data: tempalteCate,
            categoryCode: categoryArray[index],
          }
        });
        // 所有的数组长度都为空
        if (nullArray) {
          resultTableData.data = [];
        }
      })
      .finally(() => {
        loading.value = false;
      });
    if (query) {
      return resultTableData.data;
    }
  }, 500);
};
const querySearchAsync = (queryString, cb) => {
  //queryString 输入框内的值 cb 展示搜索结果的一个函数
  if (queryString) {
    query.value = queryString;
    console.log(query.value)
    let res = getList();
    cb(res);
    //展示空结果
  } else {
    cb([]); //展示空结果
  }
};
</script>

<template>
  <div style="min-height: 100%">
    <div style="margin: 0px auto; padding: 30px">
      <div class="banner" v-if="!bannerHidden">
        <div class="text">
          <p style="font-size: 36px; font-weight: bold; margin-top: 32px">
            快速搭建您的自动化场景
          </p>
          <p style="font-size: 18px; margin-top: 22px">
            从合约模板中选择您要创建的合约
          </p>
        </div>
      </div>
      <div
        style="
          display: flex;
          justify-content: space-between;
          padding-bottom: 60px;
        "
      >
        <div style="flex: 1; min-width: 0">
          <div
            style="
              position: sticky;
              top: 0px;
              background-color: #fff;
              z-index: 1;
              padding: 0px 20px;
              margin: 0 -20px;
            "
            v-if="!searchInputHidden"
          >
            <el-autocomplete
              style="width: 100%"
              @input="getList(true)"
              :fetch-suggestions="querySearchAsync"
              v-model.trim="query.value"
              prefix-icon="Search"
              placeholder="请输入合约模板名称进行搜索"
            ></el-autocomplete>
            <div
              :class="[showHand ? 'shadow' : '']"
              style="font-size: 18px; padding: 18px 0"
            >
              <!--              {{ location}}-->
            </div>
          </div>
          <template v-if="resultTableData.data.length || loading">
            <div v-for="item1 in resultTableData.data" v-loading="loading">
              <div
                style="font-size: 18px; margin-bottom: 20px"
                v-if="item1.data.length"
              >
                {{ cateMap.get(item1.categoryCode).categoryName }}
                <el-popover
                  popper-class="templatePopoverClass"
                  placement="top"
                  trigger="hover"
                  :content="cateMap.get(item1.categoryCode).description"
                >
                <template  #reference>
                  <el-icon
                    class="icon-ques"
                    style="margin-left: 5px; color: #bbb"
                    ><QuestionFilled
                  /></el-icon>
                </template>
                </el-popover>
              </div>
              <div
                class="cardList"
                style="min-width: 0; margin-bottom: 30px"
                v-if="item1.data.length"
              >
                <div
                  class="shopCard"
                  v-for="(item, index) in item1.data"
                  @click="open(item.contractTplId)"
                  :key="item.connector_id"
                >
                  <div class="content">
                    <div class="card-header">
                      <div class="img-list">
                        <img :src="item.icon" style="" alt="" />
                        <!--                  <img src="../../assets/image/contact.png" style="height: 55px" alt="">-->
                      </div>
                      <span class="special" v-if="item.recommend == 1"
                        >推荐</span
                      >
                    </div>
                  </div>
                  <div class="card-content">
                    <div class="card-title ellipsis">{{ item.name }}</div>
                    <div class="card-app">{{ item.decription }}</div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div class="no-data" v-else>
            <img
              src="~/assets/img/collaborationCenter/no_data.svg"
              width="130"
              height="130"
              style="opacity: 0.2"
            />
            <div class="tip">
              暂未搜索到您想要的合约模板，更多合约模板发布中，可扫码提需求
            </div>

            <el-popover
              placement="top"
              width="200"
              trigger="hover"
              :visible-arrow="false"
            >
            <template #reference>
              <div class="btn">扫码提需求</div>
            </template>
              <div style="text-align: center" class="qr-box">
                <img
                  src="~/assets/img/collaborationCenter/qr.png"
                  class="qr"
                 style=" width:160px"

                />
                <div class="info">微信扫码添加小慧提需求</div>
                <div class="tel">
                  <img
                    src="~/assets/img/collaborationCenter/phone.svg"
                  />010-86398171
                </div>
              </div>
            </el-popover>
          </div>
        </div>
        <el-dialog
          v-model="dialogVisible1"
          width="1000px"
          style="position: relative;"
          append-to-body
          @close="close"
          top="80px"
          :close-on-click-modal="false"
        >
        <template #header>
            <div style="height: 80vh; position: relative">
              <el-scrollbar
                class="preview-left"
                style="height: 80vh"
                wrap-style="overflow-x:hidden;"
                ref="scrollbar"
                @scroll="rightScrollEvent"
              >
                <div class="scrollbar-box">
                  <div class="top-bar">
                    <div class="title">合约模板详情</div>
                    <div class="prd-name">
                      <span>{{ contractDetailInfo.data.name }}</span>
                      <el-button
                        style="width: 120px"
                        type="primary"
                        @click="useTpl"
                        >立即创建</el-button
                      >
                    </div>
                    <div class="prd-desc">
                      {{ contractDetailInfo.data.decription }}
                    </div>
                    <img
                      :src="contractDetailInfo.data.icon"
                      style="
                        height: 60px;
                        margin-top: 17px;
                        margin-bottom: 27px;
                      "
                      alt=""
                    />
                  </div>
                  <div class="top-title" v-show="topHeight > 80">
                    <div class="head">
                      <div class="prd-name">
                        <img
                          :src="contractDetailInfo.data.icon"
                          style="height: 40px; margin-right: 20px"
                          alt=""
                        />
                        <span>{{ contractDetailInfo.data.name }}</span>
                      </div>
                      <el-button
                        style="width: 120px"
                        type="primary"
                        @click="useTpl"
                        >立即创建</el-button
                      >
                    </div>
                  </div>
                  <el-tabs
                    v-model="activeName"
                    :class="{ fixed: topHeight > 80 }"
                  >
                    <!--                    <el-tab-pane label="方案介绍" name="first"></el-tab-pane>-->
                    <el-tab-pane label="模板预览" name="scend"></el-tab-pane>
                  </el-tabs>
                  <div
                    class="words"
                    v-html="contractDetailInfo.data.solutiondescription"
                    v-if="activeName == 'first'"
                  ></div>
                  <div v-else>
                    <div
                      style="
                        padding: 15px;
                        box-sizing: border-box;
                        box-shadow: rgba(var(--el-color-primary-rgb), 0.12) 0px 4px 12px 0px;
                        position: relative;
                      "
                    >
                      <div
                        class="mask"
                        style="
                          position: absolute;
                          height: 90%;
                          width: 100%;
                          z-index: 20;
                          top: 15%;
                          left: 0;
                        "
                      ></div>
                      <div
                        class="mask"
                        style="
                          position: absolute;
                          height: 50px;
                          width: 100%;
                          z-index: 20;
                          top: 0;
                          left: 0;
                        "
                      ></div>
                      <ConnectLogic
                        :xmldata="xmldata"
                        v-if="xmldata.xml && dialogVisible1"
                        type="read"
                      ></ConnectLogic>
                    </div>

                    <div
                      class="words"
                      style=""
                      v-html="contractDetailInfo.data.solutiondescription"
                    ></div>
                  </div>
                </div>
              </el-scrollbar>
            </div>
        </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.shadow {
  box-shadow: 0 4px 8px -4px rgba(var(--el-color-primary-rgb), 0.1);
}
:deep() {
  .el-dialog {
    border-radius: 6px;
  }
  .el-dialog__headerbtn {
    top: 30px;
    right: 30px;
    font-size: 16px;
    z-index: 9999;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-tabs__nav-wrap::after {
    background-color: #fff;
  }
  .el-tabs__item {
    padding: 0 30px;
    font-size: 14px;
    height: 40px;
  }
  .el-tabs__nav-wrap {
    height: 40px;
  }
  .el-tabs__nav {
    height: 40px;
  }
  .is-active {
    font-weight: bold;
    color: #101010;
  }
  .el-tabs__active-bar {
    width: 30px !important;
    margin-left: 13px;
    height: 4px;
    border-radius: 8px;
  }
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
}
.banner-image {
  width: 100%;
  border-radius: 10px;
}
.banner-text {
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: 55%;
  width: 200px;
  height: 35px;
}
.banner {
  color: #fff;
  position: relative;
  border-radius: 3px;
  margin-bottom: 32px;
  height: 160px;
  background: linear-gradient(
    180deg,
    rgba(68, 118, 255, 1) 41%,
    rgba(77, 93, 249, 1) 98%
  );
  .text {
    height: 100%;
    width: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    flex-direction: column;
    p {
      margin: 0;
    }
  }
}
.cardList {
  display: grid;
  grid-template-columns: repeat(auto-fill, 330px);
  gap: 20px;
  .shopCard {
    background: #fff;
    box-sizing: border-box;
    border-radius: 3px;
    height: 180px;
    width: 330px;
    font-size: 14px;
    cursor: pointer;
    position: relative;
    box-shadow: 0px 4px 12px 0px rgba(var(--el-color-primary-rgb), 0.12);
    transition: all 0.3s ease 0s;
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0px 8px 16px 0px rgba(var(--el-color-primary-rgb), 0.16);
    }
    .card-header {
      width: calc(100% - 40px);
      margin: 0px auto;
      height: 72px;
      border-bottom: 1px solid rgb(206, 215, 230);
      box-shadow: rgba(255, 255, 255, 0.5) 0px 1px 6px 0px inset;
      border-radius: 6px 6px 0px 0px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      position: relative;
      img {
        height: 40px;
      }
    }
    .special {
      position: absolute;
      right: -20px;
      top: 26px;
      width: 40px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      text-align: center;
      color: rgb(255, 255, 255);
      border-radius: 19px 0px 0px 19px;
      background: linear-gradient(
        180deg,
        rgba(254, 112, 61, 0.9) 0%,
        rgba(255, 146, 48, 0.9)
      );
    }
    .card-content {
      padding: 20px 0px 0px;
      height: 50px;
    }
    .card-title {
      font-weight: 400;
      height: 20px;
      line-height: 20px;
      font-size: 16px;
      padding: 0 20px;
    }
    .card-app {
      overflow: hidden;
      display: -webkit-box;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      padding: 0 20px;
      margin-top: 8px;
      font-size: 12px;
      line-height: 20px;
      color: #a2a7b0;
    }
    .card-info {
      .app-name {
        line-height: 24px;
        font-size: 16px;
      }
      .app-desc {
        color: #a2a7b0;
        margin-top: 3px;
        font-size: 12px;
        line-height: 17px;
      }
    }
  }
}
.navbar {
  background-color: #fff;
  margin-right: 50px;
  padding-bottom: 30px;
  padding-top: 30px;
  position: sticky;
  height: 100%;
  top: 0px;
  .nav-head {
    padding-left: 25px;
    font-size: 16px;
    height: 40px;
    line-height: 35px;
    margin-bottom: 5px;
    font-weight: bold;
  }
  .nav-item {
    cursor: pointer;
    width: 180px;
    height: 40px;
    margin-bottom: 5px;
    line-height: 40px;
    font-size: 14px;
    padding-left: 25px;
    &:hover {
      background-color: rgba(var(--el-color-primary-rgb), 0.04);
      color: var(--el-color-primary);
    }
  }
  .active {
    background-color: rgba(var(--el-color-primary-rgb), 0.04);
    color: var(--el-color-primary);
  }
}

.no-data {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 200px;
  .tip {
    color: rgba(162, 167, 176, 1);
    font-size: 12px;
    margin-top: 20px;
  }
  .btn {
    width: 98px;
    height: 32px;
    margin-top: 30px;
    line-height: 32px;
    border-radius: 4px;
    background-color: rgba(var(--el-color-primary-rgb), 0.9);
    color: rgba(255, 255, 255, 1);
    font-size: 12px;
    text-align: center;
    cursor: pointer;
    &:hover {
      background-color: rgba(var(--el-color-primary-rgb), 0.8);
    }
  }
}
.tip {
  position: relative;
  text-align: center;
  margin-top: 55px;
  span {
    color: var(--el-color-primary);
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
.qr-box {
  background-color: #fff;
  font-size: 12px;
  text-align: center;
  .info {
    margin: 12px auto;
    line-height: 18px;
  }
  .tel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 13px;
    img {
      margin-right: 10px;
    }
    font-weight: bold;
  }
}

.scrollbar-box {
  box-sizing: border-box;
  padding: 30px 30px 0;
  .top-bar {
    .title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 26px;
    }
    .prd-name {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      margin-bottom: 10px;
      span {
        font-weight: bold;
        font-size: 22px;
      }
    }
    .prd-desc {
      font-size: 14px;
      color: #a2a7b0;
    }
  }
  .top-title {
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 6px;
    z-index: 9997;
    height: 120px;
    width: 100%;
    background-color: #fff;
    box-shadow: 0px 4px 12px 0px rgba(var(--el-color-primary-rgb), 0.1);
    box-sizing: border-box;
    padding: 20px 84px 0px 30px;
    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .prd-name {
      display: flex;
      align-items: center;
      font-weight: bold;
      font-size: 16px;
    }
  }
  .fixed {
    position: absolute;
    top: 70px;
    z-index: 30000;
  }
}

.words img {
  max-width: 100%;
}
.words {
  margin-top: 15px;
}
</style>

<style>
.templatePopoverClass {
  padding: 5px 10px !important;
}
</style>
