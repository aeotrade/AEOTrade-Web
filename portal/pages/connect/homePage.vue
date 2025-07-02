<script setup>
 const dayjs = useDayjs()
const router = useRouter();
const route = useRoute();
import { getmyContracttplList,getContractrecord} from "@/api/connect";
import { getBannerApi} from "@/api/api";
const contractList = ref();
const bannerList = ref([])
 let loop = null
 let recodLoop = null
const recodingList = reactive({data:[]})
const commentQuery = {
  currentpage: 1,
  pagesize: 1,
  hidden: false,
};
const recodingQuery = {
      currentpage: 1,
      pagesize: 20,
      contractname: '',
      contractrecordid:'',
      categorycode:'',
      startdate: '',
      enddate: '',
}
const getBanner = ()=>{
  getBannerApi({pageNum: 1, pageSize: 10, type: 24}).then(res=>{
    bannerList.value = res.data.list.slice(0,5);
    console.log(bannerList.value,777)
  })
}
async function getContractData() {
  contractList.value = await Promise.all([
    // 执行中
    getmyContracttplList({ ...commentQuery, executestatus: 2 }).then((res) => {
      return {
        total: res.data.total,
        title: "执行中合约数",
        roundColor:'#D8DEFF80',
        color: "#3d5afe",
        bgc: "#F6F9FF",
        img: "/connect/executeImg1.png",
        executestatus: 2,
      };
    }),
    // 待执行
    getmyContracttplList({ ...commentQuery, executestatus: 1 }).then((res) => {
      return {
        total: res.data.total,
        title: "待执行合约数",
        roundColor:'#E4E4E480',
        color: "#909090",
        bgc: "#F7F7F7",
        img: "/connect/executeImg2.png",
        executestatus: 1
      };
    }),
    // 执行异常
    getmyContracttplList({ ...commentQuery, executestatus: 5 }).then((res) => {
      return {
        total: res.data.total,
        title: "执行异常合约数",
        roundColor:'#FFE5E680',
        color: "#FF7D81",
        bgc: "#FEF6F6",
        img: "/connect/executeImg3.png",
        executestatus: 5
      };
    }),
    // 执行完成
    getmyContracttplList({ ...commentQuery, executestatus: 6 }).then((res) => {
      return {
        total: res.data.total,
        title: "执行完成合约数",
        roundColor:'#D4F1E780',
        color: "#29B786",
        bgc: "#F6FCFA",
        img: "/connect/executeImg4.png",
        executestatus: 6
      };
    }),
  ]);
  console.log(contractList.value);
}

function jumpContract(executestatus){
   router.push('/connect/myContract?executestatus='+executestatus)
}
 //跳转到详情页
 const  goto=(id,entContractRecordNo,contractId,contacrtName)=>{
    router.push({path:'/connect/recordDetail',query:{id,entContractRecordNo,contractId,contacrtName}})
  }
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
async function getRecodingData(){
 let res = await getContractrecord(recodingQuery)
  recodingList.data = res.data.records
}
function handleRowclick(row, column, event){
  console.log(1111)
  goto( row.contractRecordId,row.entContractRecordNo,row.contractId,row.contractName)
}
function autoScroll(tBodyName, delay = 50) {
  const tBody = document.querySelector(`${tBodyName}`);
  let control = {
    isScroll: true, // 是否滚动
    isSelect: false, // 是否被选中
  };
  tBody.addEventListener("mousemove", () => {
    control.isScroll = false;
  });
  tBody.addEventListener("mouseleave", () => {
    control.isScroll = true;
  });
  let timer = null;

  loop =  setInterval(() => {
    const scrollHeight = tBody.scrollHeight;
    const clientHeight = tBody.clientHeight;
    if (
        Math.abs(tBody.scrollTop + clientHeight - scrollHeight) <= 5 &&
        !control.isSelect
    ) {
      if (timer != null) {
        return;
      }
      timer = setTimeout(() => {
        tBody.scrollTop = 0;
        timer = null;
      }, 1000);
    } else {
      if (control.isScroll && !control.isSelect) {
        tBody.scrollTop += 1;
      }
    }
    // console.log(
    //   "===============>",
    //   tBody.scrollTop,
    //   scrollHeight,
    //   clientHeight
    // );
  }, delay);
  return control;
}
onMounted(async () => {

  await nextTick();
  getBanner();
  getContractData();
  getRecodingData().then(() => {
    autoScroll('.xzrz .el-scrollbar__wrap')
  })
  // 每60s刷新一次协作日志
  recodLoop =  setInterval(() => {
    getRecodingData()
  }, 60000)
});
 onBeforeUnmount(() => {
   clearInterval(loop);
   clearInterval(recodLoop);
 });
</script>

<template>
  <div class="content">
<!--    <div class="banner">-->
<!--      <div class="text">-->
<!--        <p style="font-size: 30px; font-weight: bold; margin-top: 56px">-->
<!--          使用模板创建合约，快速搭建你的自动化场景-->
<!--        </p>-->
<!--        <p style="font-size: 14px; margin-top: 22px">-->
<!--          您也可以使用空白创建自定义合约场景-->
<!--        </p>-->
<!--        <div style="margin-top: 30px; display: flex">-->
<!--          <div class="button template" @click="router.push('/connect/shop/connectContract')">-->
<!--            <img src="~/assets/img/collaborationCenter/botton2.png" />-->
<!--            模板创建-->
<!--          </div>-->

<!--          <div class="button newContract" @click="jumpCanvas">-->
<!--            <svg-icon  icon-class="mdqueue" style="color: #3D5AFE; width: 20px;height: 20px; margin-right: 15px;"></svg-icon>-->
<!--            空白创建-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

    <div class="left">
      <div class="carousel">
        <el-carousel height="230px">
          <el-carousel-item v-for="(item,i) in bannerList" :key="i">
            <a :href="item.url" target="blank">
              <img :src="item.pic"/>
            </a>
          </el-carousel-item>
        </el-carousel>
      </div>
      <workbenchMsgNewCenter/>
    </div>
    <div class="right">
      <div class="contract item-box">
        <div class="title">
          <span>我的合约</span>
        </div>
        <div
                style="
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
              "
        >
          <div
                  v-for="(item, index) in contractList"
                  :key="index"
                  :style="{ color: item.color, background: item.bgc }"
                  class="stutes-box"
                  @click="jumpContract(item.executestatus)"
          >
            <div style="display: flex;align-items: center;">
              <img :src="item.img" />

              <div class="number">
                <div class="con-title">
                  {{ item.title }}
                </div>
                <div class="total">
                  {{ item.total }} <span style="font-size: 14px;color: #777;margin-left: 16px;">条</span>
                </div>
              </div>
            </div>
            <div class="rbg-button" :style="{'--bgcolor':item.roundColor}"><el-icon style="font-size: 20px;"><ArrowRight /></el-icon></div>
          </div>
        </div>
      </div>
      <div class="recoding item-box">
        <div class="title">
          <span>协作日志</span>
          <div style="color:#909090;font-size:14px;cursor: pointer;" @click="router.push('/connect/recording')">查看更多 ></div>
        </div>
        <div v-if="recodingList.data.length">
          <el-table class="xzrz" :row-style="{'cursor':'pointer'}" @row-click="handleRowclick" :data="recodingList.data" :show-header="false" width="100%" height="276px">
            <el-table-column label="协作记录ID" align="center"  prop="contractRecordId">
            </el-table-column>
            <el-table-column align="center" prop="contractName" label="合约名称">
            </el-table-column>
            <el-table-column align="center" label="最近活动完成时间">
              <template #default="scope">
                {{
                scope.row.activityTime
                ? dayjs(scope.row.activityTime).format("YYYY-MM-DD HH:mm")
                : ""
                }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else style="text-align: center;">
          <svg-icon style="width: 238px;height: 238px;" icon-class="nodata" alt=""></svg-icon>
          <br>
          <span>暂无数据!</span>

        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-table__cell){
  border-bottom: none
}
.content {
  padding: 17px 15px;
  display: flex;
  justify-content: space-between;
  .left{
    flex: 1;
    margin-right: 16px;
  }
  .right{
    width: 520px;
    flex-shrink: 0;
    .item-box {

      border-radius: 10px;
      padding: 26px 20px 0 20px;
      background-color: #fff;
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 18px;
        padding-bottom: 10px;
        font-weight: bold ;
        border-bottom: 1px solid #bbbbbb80;
        margin-bottom: 30px;
      }
      .stutes-box {
        width: 49%;
        cursor: pointer;
        height: 110px;
        padding: 22px;
        display: flex;
        border-radius: 6px;
        margin-bottom: 30px;
        align-items: center;
        justify-content: space-between;
        img {
          width: 60px;
          height: 60px;
          border-radius: 10px;
        }
      }
      .number{
        margin-left: 10px;
        height: 60px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        font-size: 14px;
        .total{
          font-weight: bold;
          font-size: 18px;
          display: flex;
          align-items: baseline;
        }
      }

      &.contract{
        margin-bottom: 16px;
      }
      &.recoding{
        padding-bottom: 40px;
      }
    }
  }

  .carousel{
    img{
      height: 100%;
      width: 100%;
      object-fit: cover;
      object-position: left;
    }
    ::v-deep{
      .el-carousel__arrow{
        display: none!important;
      }
    }

  }
}
</style>
