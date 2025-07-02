<script setup>
import {
  getConnectorType,
  getBanner as getBannerApi,
  getConnector,
  openUserConnect,
} from "@/api/connect";
const value = ref("");
const input = ref("");
const LinkMarket = ref([]);
const openid = ref("");
const dialogVisible = ref(false);
const navbarList = ref([]);

const activeIndex = ref(0);
const banner = ref("");
const location = ref("全部");
const loading = ref(true);
const showHand = ref(false);
const timer = ref(null);

const load = () => {
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollTop >= 10) {
    showHand.value = true;
  } else {
    showHand.value = false;
  }
};
const select = (i) => {
  activeIndex.value = i;
  getAll();
};
const getType = async () => {
  let res = await getConnectorType();
  navbarList.value = [{ category_name: "全部", category_id: "" }, ...res.data];
};
const getBanner = () => {
  getBannerApi(22).then((res) => {
    banner.value = res.data.list[0].pic;
  });
};
const openDialog = (id, isopened) => {
  if (isopened) {
    ElMessage.warning("您已开通该连接器，可在我的连接器查看");
    return;
  }
  openid.value = id;
  dialogVisible.value = true;
};

const getAll = (query) => {
  loading.value = true;
  window.scrollTo(0, 0);
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  if (timer.value) {
    clearTimeout(timer.value);
  }
  timer.value = setTimeout(() => {
    let params = {
      currentpage: 1,
      pagesize: 100,
    };
    if (value) params.search = value.value;
    if (navbarList.value[activeIndex.value]?.category_id) {
      params.category_id = navbarList.value[activeIndex.value].category_id;
    }

    getConnector(params)
      .then((res) => {
        console.log(res.data, "2222");
        LinkMarket.value = res.data;
        if (value.value) {
          location.value = "搜索到" + LinkMarket.value.length + "个";
        }
        if (!value.value) {
          location.value = navbarList.value[activeIndex.value].category_name;
        }
      })
      .finally(() => {
        loading.value = false;
      });
  }, 500);
};
const open = (id) => {
  dialogVisible.value = false;
  let formdata = new FormData();
  formdata.append("connector_id", id);
  openUserConnect(formdata).then((res) => {
    if (res.data) {
      ElMessage.success("恭喜你,开通成功");
      getAll();
    } else {
      if (res.message == "invalid operation") {
        ElMessage.warning("您已开通该连接器，可在我的连接器查看");
      }
    }
  });
};
const jump = (id) => {
  const router = useRouter();
  router.push({
    path: "/connect/shop/connectSystemDetail",
    query: { index: id },
  });
};
const search = (query) => {
  getConnector({ search: query.value }).then((res) => {
    console.log(res.data,'22222222')
    LinkMarket.value = res.data;
  });
};
const querySearchAsync = (queryString, cb) => {
  //queryString 输入框内的值 cb 展示搜索结果的一个函数
  if (queryString) {
    cb([]); //展示空结果
  } else {
    cb([]); //展示空结果
  }
};
onMounted(() => {
  nextTick(async () => {
    await getType();
    getAll();
    getBanner();

    window.addEventListener("scroll", load);
  });
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", load);
});
</script>

<template>
  <div style="min-height: calc(100vh - 68px)">
    <div
      style="margin: 16px;"
    >
      <div class="banner">
        <img :src="banner" alt="" class="banner-image" />
      </div>
      <div style="background-color: rgb(255, 255, 255);">
        <div style="
          padding: 0px 20px 60px;
          display: flex;
          justify-content: space-between;
          margin: 12px auto;
          max-width: 1300px;">
          <div class="navbar">
            <div class="nav-head">连接器类型</div>
            <div
                :class="['nav-item', activeIndex == i ? 'active' : '']"
                v-for="(item, i) in navbarList"
                :key="i"
                @click="select(i)"
            >
              <svg-icon
                  :icon-class="item.category_name === '全部' ? '全部' : item.image"
                  style="margin-right: 10px"
              ></svg-icon>
              {{ item.category_name }}
            </div>
          </div>
          <div style="flex: 1; min-width: 0" v-loading="loading">
            <div
                style="
              position: sticky;
              top: 0px;
              background-color: #fff;
              z-index: 1;
              padding: 20px 20px 0px;
              margin: 0 -20px 10px;
            "
            >
              <el-autocomplete
                  style="width: 100%"
                  @input="getAll(true)"
                  v-model.trim="value"
                  prefix-icon="Search"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="请输入连接器名称进行搜索"
              ></el-autocomplete>
              <div
                  :class="[showHand ? 'shadow' : '']"
                  style="font-size: 18px; padding: 18px 0 8px"
              >
                {{ location }}
              </div>
            </div>
            <div class="cardList" v-if="LinkMarket.length || loading">
              <div
                  class="shopCard"
                  v-for="(item, index) in LinkMarket"
                  @click="jump(item.connector_id)"
                  :key="item.connector_id"
              >
                <img :src="item.connector_image" alt="" class="icon-image" />
                <div class="card-info">
                  <div class="ellipsis app-name">
                    {{
                      item.connector_name.length > 10
                          ? item.connector_name
                          : item.connector_name || ""
                    }}
                  </div>
                  <div class="ellipsis app-desc">
                    {{ item.connector_desc || "" }}
                  </div>
                </div>

                <!--              <div class="card-item" >-->
                <!--             -->
                <!--&lt;!&ndash;                <div class="open-button" @click.stop="openDialog(item.connector_id,item.opened)">{{item.opened?'已开通':'开通'}}</div>&ndash;&gt;-->
                <!--              </div>-->
              </div>
            </div>
            <div class="no-data" v-else>
              <img
                  src="~/assets/img/collaborationCenter/no_data.svg"
                  width="130"
                  height="130"
                  style="opacity: 0.2"
              />
              <div class="tip">
                暂未搜索到您想要的连接器，更多连接器接入中，可扫码提需求
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
                  <img src="~/assets/img/collaborationCenter/qr.png" class="qr" />
                  <div class="info">微信扫码添加小慧提需求</div>
                  <div class="tel">
                    <img
                        src="~/assets/img/collaborationCenter/phone.svg"
                    />010-86398171
                  </div>
                </div>
              </el-popover>
            </div>
            <div class="tip" v-if="LinkMarket.length">
              更多连接器接入中,
              <el-popover
                  placement="top"
                  width="200"
                  trigger="hover"
                  :visible-arrow="false"
              >
                <div style="text-align: center" class="qr-box">
                  <img
                      src="~/assets/img/collaborationCenter/qr.png"
                      class="qr"
                      style="margin-top: 8px"
                  />
                  <div class="info">微信扫码添加小慧提需求</div>
                  <div class="tel">
                    <img
                        src="~/assets/img/collaborationCenter/phone.svg"
                    />010-86398171
                  </div>
                </div>
                <template #reference>
              <span style="color: var(--el-color-primary)"
              >扫码提需求 <el-icon> <ArrowRight />
                </el-icon>
              </span>
                </template>
              </el-popover>
            </div>
            <!--          <div class="more">-->
            <!--            <span>更多应用程序接入中，</span>-->
            <!--            <button type="button" class="ant-btn ant-btn-link btn">-->
            <!--              <span>提需求</span></button>-->
            <!--          </div>-->
          </div>
        </div>
      </div>
      <el-dialog
        title="提示"
        v-model="dialogVisible"
        append-to-body
        width="30%"
      >
        <span>是否开通该连接器?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="open(openid)">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped lang="scss">
.shadow {
  box-shadow: 0 4px 8px -4px rgba(var(--el-color-primary-rgb), 0.1);
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
}
.ellipsis {
  white-space: nowrap;
}
.banner-image {
  width: 100%;
  object-fit: cover; object-position: 50% 50%; width: 100%; height: 160px;
  border-radius: 10px;
}
.banner {
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
  //display: flex;
  //flex-wrap: wrap;
  //flex: 1;
  display: grid;
  grid-template-columns: repeat(3, calc((100% - 40px) / 3));
  gap: 20px;
  .shopCard {
    background: #fff;
    box-sizing: border-box;
    border-radius: 3px;
    height: 100px;
    font-size: 14px;
    cursor: pointer;
    position: relative;
    padding: 28px 20px 28px 100px;
    box-shadow: 0px 4px 12px 0px rgba(var(--el-color-primary-rgb), 0.12);
    transition: transform 0.3s ease 0s;
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0px 6px 14px 0px rgba(var(--el-color-primary-rgb), 0.14);
    }
    img {
      position: absolute;
      top: 50%;
      left: 30px;
      transform: translateY(-50%);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      box-shadow: rgba(40, 89, 153, 0.19) 0px 5px 10px 0px;
    }
    .card-info {
      .app-name {
        line-height: 24px;
        font-size: 16px;
        max-width: 180px;
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
  padding-top: 20px;
  position: sticky;
  height: 100%;
  top: 0px;
  min-height: 620px;
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

  .qr{
    width: 160px;
    height: 160px;
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
</style>
