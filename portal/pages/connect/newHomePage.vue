<script setup>
 const dayjs = useDayjs()
const router = useRouter();
const route = useRoute();
import { getmyContracttplList,getContractrecord} from "@/api/connect";
import { getBannerApi ,loadAiScreen ,appFindCloud, aiAccountLogin } from "@/api/api";
// const contractList = ref();
const bannerList = ref([])
const services = ref([
 ])
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
// async function getContractData() {
//   contractList.value = await Promise.all([
//     // 执行中
//     getmyContracttplList({ ...commentQuery, executestatus: 2 }).then((res) => {
//       return {
//         total: res.data.total,
//         title: "执行中合约数",
//         roundColor:'#D8DEFF80',
//         color: "#3d5afe",
//         bgc: "#F6F9FF",
//         img: "/connect/executeImg1.png",
//         executestatus: 2,
//       };
//     }),
//     // 待执行
//     getmyContracttplList({ ...commentQuery, executestatus: 1 }).then((res) => {
//       return {
//         total: res.data.total,
//         title: "待执行合约数",
//         roundColor:'#E4E4E480',
//         color: "#909090",
//         bgc: "#F7F7F7",
//         img: "/connect/executeImg2.png",
//         executestatus: 1
//       };
//     }),
//     // 执行异常
//     getmyContracttplList({ ...commentQuery, executestatus: 5 }).then((res) => {
//       return {
//         total: res.data.total,
//         title: "执行异常合约数",
//         roundColor:'#FFE5E680',
//         color: "#FF7D81",
//         bgc: "#FEF6F6",
//         img: "/connect/executeImg3.png",
//         executestatus: 5
//       };
//     }),
//     // 执行完成
//     getmyContracttplList({ ...commentQuery, executestatus: 6 }).then((res) => {
//       return {
//         total: res.data.total,
//         title: "执行完成合约数",
//         roundColor:'#D4F1E780',
//         color: "#29B786",
//         bgc: "#F6FCFA",
//         img: "/connect/executeImg4.png",
//         executestatus: 6
//       };
//     }),
//   ]);
//   console.log(contractList.value);
// }

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
// async function getRecodingData(){
//  let res = await getContractrecord(recodingQuery)
//   recodingList.data = res.data.records
// }
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
  const list = await useWorkbenchList()
  appFindCloud({
    vipTypeId:list[0].viptypeId,
    appType: 2,
    sort: 'asc',
    pageSize: 100,
    pageNo: 1,
    status:1
  }).then(res=>{
    services.value = res.result
  })
  getBanner();
  if( !cookies.getItem('aiToken')){
  aiAccountLogin({
       "app": "kimi",
       "source": "web",
       "token": localStorage.getItem("accessToken"),
     }).then(res=>{
      cookies.setItem('aiToken',res.data.token);
      setTimeout(() => {
        getAiAsstInfo();
      }, 30) // 加一点延迟，不然aiToken没有使用新的值
  })
  }else{
     getAiAsstInfo();
  }

  // getContractData();
  // getRecodingData().then(() => {
  //   // autoScroll('.xzrz .el-scrollbar__wrap')
  // })
  // 每60s刷新一次协作日志
  // recodLoop =  setInterval(() => {
  //   getRecodingData()
  // }, 60000)
});
 onBeforeUnmount(() => {
   clearInterval(loop);
  //  clearInterval(recodLoop);
 });

 const greeting = ref('')
 const tips = ref([])
 const asst_market_id = ref('')
const textarea = ref('')
const aiHost = 'https://aigc.aeotrade.com';
const getAiAsstInfo = () => {
  loadAiScreen({
      position_code:'HOME01',
      scene_code:'HMOS'
    }).then(res=>{
      console.log(res)
      asst_market_id.value = res.data.asst_market_id
      greeting.value = res.data.greeting
      tips.value = res.data.greeting_qst?.filter(it => it.content)?.map(item => item.content)
    })
}
const toReloadAI =(textarea)=>{
  if(asst_market_id.value){
    toAI(`/chat?mid=${asst_market_id.value}&words=`+textarea)
  }
}
const toAI = (url)=>{
  let state = encodeURIComponent(url)
  window.open(`/sso/oauth/authorize?client_id=ai-assistant&response_type=code&scope=read&redirect_uri=${aiHost}/singleLogin&state=${state}`)
}
</script>

<template>
  <div class="content">
    <div class="left">
      <div class="ai">
        <div class="title">
          <img width="60" src="@/assets/img/workbench/AI.gif">
          <span>你好，有什么问题想问我呢？</span>
        </div>
        <div class="input-content">
          <el-input
                  resize="none"
                  v-model="textarea"
                  style="width: 850px"
                  :rows="7"
                  type="textarea"
                  :placeholder="greeting"
          />
          <div class="btn" @click="toReloadAI(textarea)">
            <img width="16" src="@/assets/img/workbench/send.png">
            发送
          </div>
        </div>
        <div class="tips">
          <div class="item" v-for="(item,i) in tips" @click="textarea = item">{{item}}</div>
        </div>
      </div>
      <client-only>
        <div class="services">
          <div class="title">推荐服务</div>
          <div class="list">
            <div class="item" v-for="(item,i) in services" :key="i" @click="toAI(item.url)">
              <img :src="item.appLogo" width="60" height="60">
              <div class="words">
                <h3>{{item.appName}}</h3>
                <!-- <p>{{item.subhead}}</p> -->
              </div>
            </div>
          </div>
        </div>
      </client-only>

    </div>
    <div class="right">
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
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-table__cell){
  border-bottom: none
}
:deep(.el-textarea__inner){
  box-shadow: none;
  padding-top: 10px;
  padding-left: 20px;
}
.words{
  display: flex;
  align-items: center;
}
.content {
  padding: 17px 15px;
  display: flex;
  justify-content: space-between;
  .left{
    flex: 1;
    margin-right: 16px;
    .ai{
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 360px;
      margin-bottom: 16px;
      position: relative;
      background: url("~/assets/img/workbench/aiback.png") no-repeat center;
      border-radius: 10px;
      .title{
        font-weight: bold;
        display: flex;
        justify-content: center;
        align-items: end;
        color: #3D5AFE;
        font-size: 30px;
        margin-bottom: 15px;
        span{
          margin:0 0 10px 20px;
        }
      }
      .input-content{
        position: relative;
        .btn{
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          bottom:15px;
          right: 20px;
          width: 80px;
          height: 32px;
          border-radius: 4px;
          background-color: rgba(61,90,254,1);
          color: rgba(255,255,255,1);
          font-size: 14px;
          cursor: pointer;
          &:hover{
            background-color: rgba(61,90,254,.9);
          }
          img{
            margin-right: 8px;
          }
        }
      }
      .tips{
        width: 850px;
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
        margin-bottom: 20px;
        .item{
          height: 35px;
          line-height: 35px;
          font-size: 14px;
          background-color: #ffffff;
          border-radius: 5px;
          text-align: center;
          margin:0 14px 7px 0;
          padding: 0 20px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          cursor: pointer;
          &:hover{
            color: #3D5AFE;
          }
        }
      }
    }
    .services{
      border-radius: 10px;
      padding: 24px 20px 0 20px;
      background-color: #fff;
      height: calc(100% - 376px);
      .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 18px;
        font-weight: bold ;
        margin-bottom: 12px;
      }
      .list {
        display: grid; // 改用Grid布局
        grid-template-columns: repeat(3, minmax(250px, 1fr)); // 自适应列宽
        gap: 20px; // 设置行列间距
        margin-bottom: 30px;
        .item {
          width: 100%; // 取消固定百分比宽度
          max-width: 400px; // 可选最大宽度限制
          border-radius: 5px;
          background-color: rgba(243,248,255,1);
          padding: 24px 20px;
          display: flex;
          cursor: pointer;
          img {
            margin-right: 15px;
          }
          h3 {
            font-size: 16px;
            margin-bottom: 6px;
          }
          p {
            color: rgba(145,145,145,1);
            font-size: 14px;
            line-height: 20px;
          }
        }
      }
    }
  }
  .right{
    width: 520px;
    flex-shrink: 0;
  }

  .carousel{
    border-radius: 10px;
    img{
      height: 100%;
      width: 100%;
      object-fit: cover;
      object-position: left;
      border-radius: 10px;
    }
    ::v-deep{
      .el-carousel__arrow{
        display: none!important;
      }
    }

  }
}
</style>
