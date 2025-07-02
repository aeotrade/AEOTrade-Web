<script setup>
import { getMyConnector } from "@/api/connect";
const router = useRouter()
const LinkMarket = reactive({ data: [] });
const loading = ref(false);
const getAll = () => {
  loading.value = true;
  getMyConnector().then((res) => {
    LinkMarket.data = res.data;
    loading.value = false;
  });
};

const jump = (index) => {
  router.push({ path: "/connect/myConnectDetail", query: { index: index } });
};

onMounted(()=>{
  nextTick(()=>{
    getAll()
  })
})
</script>
<template>
  <div style=" min-height: calc(100% - 32px);overflow: auto;background-color: #fff;margin:  15px">
    <div
      style="margin: 16px auto; padding: 20px  15px 20px;max-width: 1100px"
    >
      <div class="head">
        <div class="title">我的连接器</div>
        <div
          class="desc"
          style="font-size: 12px; color: #a2a7b0; margin-top: 10px"
        >
          以下是已经开通的连接器,您还可以在连接器中心查看更多连接器
        </div>
      </div>
      <div class="cardList" v-loading="loading">
        <div
          class="shopCard"
          v-for="(item, index) in LinkMarket.data"
          @click="jump(item.org_connector_id)"
          :key="item.connector_id"
        >
          <img :src="item.connector_image" alt="" class="icon-image" />
          <div class="card-info">
            <div class="ellipsis app-name">{{ item.connector_name || "" }}</div>
            <div class="ellipsis app-desc">{{ item.connector_name || "" }}</div>
          </div>
          <div class="open-button" size="small">配置</div>
        </div>
      </div>
      <!-- <div
        v-if="LinkMarket.data.length <= 0 && !loading"
        style="text-align: center; padding-top: 150px"
      >
        <img
          src="~/assets/images/empty.svg"
          alt=""
          style="width: 360px; height: 190px"
        />
        <p style="font-size: 14px; margin-top: 30px">
          您目前还没有开通任何连接器！请到连接器市场开通您所需要的连接器！
        </p>
      </div> -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.open-button{
  cursor: pointer;
  position: absolute;
  bottom: 36px;
  right: 30px;
  border-radius: 3px;
  font-size: 12px;
  width: 56px;
  height: 30px;
  border: 1px solid rgba(var(--el-color-primary-rgb),0.3);
  box-sizing: border-box;
  text-align: center;
  line-height: 30px;
  color: var(--el-color-primary);
  background-color: rgba(var(--el-color-primary-rgb),0.04);
  &:hover{
    background-color: var(--el-color-primary);
    color: #fff;
  }

}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.head {
  box-sizing: border-box;
  margin-bottom: 22px;
}
.title {
  color: rgba(16, 16, 16, 100);
  box-sizing: border-box;
  font-size: 16px;
  font-family: SourceHanSansSC-bold;
  font-weight: bold;
}

.banner-image {
  height: 240px;
  width: 100%;
  margin-bottom: 74px;
}
.cardList {
  flex: 1;
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
    padding: 28px 97px 28px 100px;
    box-shadow: 0px 4px 12px 0px rgba(var(--el-color-primary-rgb), 0.12);
    transition: transform 0.3s ease 0s;
    &:hover {
      transform: translateY(-10px);
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
        //font-weight: bold;
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
</style>
