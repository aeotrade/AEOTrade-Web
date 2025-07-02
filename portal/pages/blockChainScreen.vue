
<script setup>
  // import {CountTo as BaseCountTo} from 'vue3-count-to'
  import BlockChainBlockLine from '@/components/BlockChain/BlockLine.vue'
  import {getBlockData1,getBlockData2,getBlockData3,getBlockData4,getBlockData5,getBlockData6,getCheckData,getBcData} from '@/api/blockChain'
      const  input2 = ref('')   // 搜索
      const  nowTime=  ref('') // 当前时间
      const  nodeData = reactive({data:{ BlockHeight: 0,
          TransactionNum: 0,
          ContractNum: 0,
          OrgNum: 0,
          NodeNum: 0,
          UserNum: 0
        }
        })
        const blockData =  reactive({
          blockTableData:[],
        getTxList:[],
        blockCharts:[],
        nodeListOrigin: [], //节点列表原始数据
        nodeList:[],
        getTxListOrigin:[],
        blockTableDataOrigin:[],
        parseRole: {
          consensus: '共识节点'
        }
        })

        useHead({
          title: '信贸链',
        link: [
          { rel: 'icon', href: '/trustedFavicon.ico' }
        ]
        })
  const Config = useAppConfig()
      // 存证校验
    const  checkInfo=()=>{
      getCheckData(input2.value).then(res => {
          if(res?.Response?.Data?.Data){
            window.open(`${Config.chainBrowserAddress}/${res.Response.Data.Type==0?'block':'transaction'}/${res.Response.Data.Data}`)
          }else{
            ElMessage.error({
              type: 'error',
              message: `搜索：${input2.value}没有任何结果`
            });
          }
        })
      }
      // 获取最新数据
      const   getLatestData=async()=>{
        try {
          let [res1,res2,res3,res4,res5,res6,res7] = await Promise.all([
            getBlockData1().then((res) => {
              return res.Response
            }),
            getBlockData2().then((res)=>{
              // 最新区块
              return res.Response
            }),
            getBlockData3().then((res)=>{
              // 最新交易
              return res.Response
            }),
            getBlockData4().then((res)=>{
              // let data=  Base64.decode('ZGFua29nYWk=')
              // 节点状态
              return res.Response
            }),
            getBlockData5().then((res) => {
              // Echarts图的数据
              return res.Response
            }),
            getBlockData6().then(res => {
              // 吴浩写的接口 （暂时代替节点状态接口， res4）
              return res.result
            }),
            getBcData().then(res=>{
              return res.Response
            })
          ]);
          console.log(res5)
            nodeData.data = {
              BlockHeight: res1 && res1.Data && res1.Data.BlockHeight || 0,
              TransactionNum: res7?.Data?.TransactionNum || 0,
              ContractNum: res1 && res1.Data && res1.Data.ContractNum || 0,
              OrgNum: res6.count,
              NodeNum: res1 && res1.Data && res1.Data.NodeNum || 0,
              UserNum: (res6.count - res1.Data.NodeNum) || 0
            }
            blockData.blockTableDataOrigin = res2.GroupList,  // 最新区块
           blockData.getTxListOrigin = res3.GroupList,       // 最新交易
            // nodeList:res4.GroupList,
            blockData.nodeListOrigin = res6.list,            // 节点列表
            blockData.blockCharts = res5.GroupList
        } catch (e) {
          console.log(e)
        }
      }
      // 随机获取节点列表
      const getRandomNode=()=>{
        let len = blockData.nodeListOrigin.length - 5
        let startIndex = Math.floor(Math.random()* len)
        blockData.nodeList = blockData.nodeListOrigin.slice(startIndex, startIndex+5)
      }
      // 随机获取区块
      const  getRandomBlock=()=>{
        let len = blockData.blockTableDataOrigin.length - 4
        let startIndex = Math.floor(Math.random() * len)
        blockData.blockTableData = blockData.blockTableDataOrigin.slice(startIndex, startIndex + 4)
      }
      // 随机获取最新交易
      const  getRandomTx=()=>{
        let len = blockData.getTxListOrigin.length - 5
        let startIndex = Math.floor(Math.random() * len)
        blockData.getTxList = blockData.getTxListOrigin.slice(startIndex, startIndex + 5)
      }
      // 获取当前时间
      const  getNowTime=()=>{
        let time = new Date().valueOf()
        nowTime.value = parseTime(time)
      }


      onMounted(()=>{
        nextTick(async()=>{
          await getLatestData()
          getRandomNode()
          getRandomBlock()
          getRandomTx()
            // 更新时间
          setInterval(() => {
            getNowTime()
          }, 1000)

          // 3分钟获取一次最新数据
          setInterval(() => {
            getLatestData()
          }, 180000)
          setInterval(() => {
            getRandomNode()
          }, 3000)

          setInterval(() => {
            getRandomTx()
          }, 7500)

          setInterval(() => {
            getRandomBlock()
          }, 16500)
            })


       })


</script>

<template>
  <div class="monitor-page" style="height: 100vh">
    <div class="page-bg-bottom"></div>
    <div class="page-bg-center"></div>
    <div class="page-title">
      <div class="title">信贸链-数据大屏</div>
    </div>

    <!--    主体部分-->
    <div class="main-top-wrap">
      <div class="top-item">
        <div class="top-item-top">
          <div class="node-item">
            <div class="node-bg">
              <div>
<!--                {{nodeData.BlockHeight}}-->
                <count-to :startVal='0' :endVal='nodeData.data.BlockHeight' :duration='3000' :autoplay="true"></count-to>
              </div>
            </div>
            区块高度
          </div>
          <div class="node-item">
            <div class="node-bg">
              <div>
<!--                {{nodeData.TransactionNum}}-->
                <count-to :startVal='0' :endVal='nodeData.data.TransactionNum' :duration='3000' :autoplay="true"></count-to>
              </div>
            </div>
            累计交易量
          </div>
          <div class="node-item">
            <div class="node-bg">
              <div>
<!--                {{nodeData.ContractNum}}-->
                <count-to :startVal='0' :endVal='nodeData.data.ContractNum' :duration='3000' :autoplay="true"></count-to>
              </div>
            </div>
            合约数量
          </div>
        </div>
        <div class="top-item-bottom card-padding">
          <div class="item-title">
            <img src="/monitor/block.svg" />
            <div class="title-wrap">
              最新区块
            </div>
          </div>
          <el-table :row-style="{height: '38px'}" :data="blockData.blockTableData" style="width: 100%;background: #000;--el-table-row-hover-bg-color: #00043d;--el-table-text-color: #fff;--el-table-border-color: #00043d;" height="90%">
            <el-table-column prop="BlockHeight" align="center" label="区块高度" width="100"></el-table-column>
            <el-table-column prop="BlockHash" align="center" show-overflow-tooltip label="区块hash"></el-table-column>
            <el-table-column prop="Timestamp" align="center" label="区块生成时间"  width="135">
              <template #default="{row}">
                {{parseTime(row.Timestamp)}}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>


      <div class="top-item">

        <div class="now-time">
          可信时间：{{nowTime}}
        </div>

        <el-input style="margin-bottom:20px;--el-input-border-color: none;--el-input-hover-border-color: none;--el-input-text-color: #fff;" placeholder="请输入区块哈希 / 区块高度 / 交易id / 合约名称搜索" v-model="input2">
          <template #append>
            <el-button @click="checkInfo">存证校验</el-button>
          </template>
        </el-input>

        <div class="map-wrap"></div>
      </div>


      <div class="top-item">
        <div class="top-item-top">
          <div class="node-item">
            <div class="node-bg">
              <div>
<!--                {{nodeData.OrgNum}}-->
                <count-to :startVal='0' :endVal='nodeData.data.OrgNum' :duration='3000' :autoplay="true"></count-to>
              </div>
            </div>
            组织数量
          </div>
          <div class="node-item">
            <div class="node-bg">
              <div>
<!--                {{nodeData.NodeNum}}-->
                <count-to :startVal='0' :endVal='nodeData.data.NodeNum' :duration='3000' :autoplay="true"></count-to>
              </div>
            </div>
            共识节点
          </div>
          <div class="node-item">
            <div class="node-bg">
              <div>
<!--                {{nodeData.UserNum}}-->
                <count-to :startVal='0' :endVal='nodeData.data.UserNum' :duration='3000' :autoplay="true"></count-to>
              </div>
            </div>
            普通节点
          </div>
        </div>
        <div class="top-item-bottom card-padding">
          <div class="item-title">
            <img src="/monitor/statistics.svg" />
            <div class="title-wrap">
              交易统计
            </div>
          </div>
          <client-only>
            <BlockChainBlockLine :data="blockData.blockCharts" />
          </client-only>
        </div>
      </div>
    </div>

    <div class="main-bottom-wrap">
      <div class="bottom-item-card card-padding">
        <div class="item-title">
          <img src="/monitor/transaction.svg" />
          <div class="title-wrap">
            最新交易
          </div>
        </div>
        <el-table :row-style="{height: '43px'}" class="block-chain-table" :data="blockData.getTxList" style="width: 100%;background: #000;--el-table-row-hover-bg-color: #00043d;--el-table-text-color: #fff;--el-table-border-color: #00043d;" height="90%">
          <el-table-column prop="BlockHeight" align="center" label="区块高度" width="100"></el-table-column>
          <el-table-column prop="TxId" align="center" show-overflow-tooltip label="区块链交易ID"></el-table-column>
          <el-table-column prop="Status" align="center" label="交易状态" width="135">
            <template #default="{row}">
              <template v-if="row?.Status?.length > 14">
                <el-tooltip
                    effect="dark"
                    :content="row?.Status"
                    placement="top"
                >
                  <div style="overflow: hidden;white-space: nowrap;text-overflow:ellipsis;color: #0492FF">{{row.Status}}</div>
                </el-tooltip>
              </template>
              <template v-else>
                <span style="color: #0492FF">{{row.Status}}</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="Timestamp" align="center" label="上链时间" width="138">
            <template #default="{row}">
              {{parseTime(row.Timestamp)}}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bottom-item-card card-padding">
        <div class="item-title">
          <img src="/monitor/node.svg" />
          <div class="title-wrap">
            节点状态
          </div>
        </div>
        <el-table :row-style="{height: '43px'}" :data="blockData.nodeList" style="width: 100%;background: #000;--el-table-row-hover-bg-color: #00043d;--el-table-text-color: #fff;--el-table-border-color: #00043d;" height="90%">
          <el-table-column prop="name" align="center" label="节点名称" show-overflow-tooltip></el-table-column>
          <el-table-column prop="organ" align="center" label="所属组织" width="360" show-overflow-tooltip>
            <template #default="{row}">
              <span style="color: #0492FF">{{row.organ}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="Role" align="center" width="100" label="节点角色">
            <template #default="{row}">
              {{row.role}}
            </template>
          </el-table-column>
          <el-table-column prop="Timestamp" align="center" label="创建时间" width="138">
            <template #default="{row}">
              {{parseTime(new Date(row.time).valueOf())}}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>


<style scoped lang="scss">
  *{
    color: #fff;
  }
  .monitor-page{
    background: url("/monitor/page-bg.png");
    background-size: 100% 100%;
    position: relative;
    min-width: 1600px;
    min-height: 900px;
  }
  .page-bg-bottom{
    position: absolute;
    z-index: 0;
    bottom: 0;
    width: 100%;
    height: 24%;
    background: url("/monitor/page-bottom-bg.png");
    background-size: 100% 100%;
  }
  .page-bg-center{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: 0 auto;
    width: 40%;
    height: 50%;
    transform: translateY(35%);
    background: url("/monitor/map-bg.png");
    background-size: 100% 100%;
  }
  .page-title{
    width: 100%;
    height: 10%;
    background: url("/monitor/title-bg.png");
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .title{
      font-size: 22px;
      font-weight: bold;
      text-align: center;
      letter-spacing: 8px;
      transform: translateY(-28%);
    }
  }

  .main-top-wrap{
    display: flex;
    justify-content: space-between;
    height: 50%;
    width: 100%;
    padding: 10px 20px;
    .top-item{
      width: 32%;
      height: 100%;
      .top-item-top{
        height: 40%;
        display: flex;
        justify-content: space-between;
        .node-item{
          width: 30%;
          height: 100%;
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          .node-bg{
            height: 80%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: url("/monitor/node-bg.png");
            background-size: 100% 100%;
            >div{
              color: #2ef8ff;
              font-size: 18px;
              font-weight: bold;
              transform: translateY(50%);
            }
            >div>span{
              color: #2ef8ff;
            }
          }
        }
      }
      .map-wrap{
        width: 100%;
        height: 76%;
        margin: 0 auto;
        background: url("/monitor/map.gif") no-repeat;
        background-size: auto 100%;
        background-position: center;
        position: relative;
        z-index: 20;
      }
      .top-item-bottom{
        height: 60%;
        background: url("/monitor/card-bg.png");
        background-size: 100% 100%;
      }
    }

  }

  /*下部分*/
  .main-bottom-wrap{
    width: 100%;
    height: 39%;
    padding: 10px 20px;
    display: flex;
    justify-content: space-between;
    .bottom-item-card{
      height: 100%;
      width: 49%;
      background: url("/monitor/large-card-bg.png");
      background-size: 100% 100%;
    }
  }

  .now-time{
    font-size: 16px;
    color: #fff;
    text-align: center;
    margin-top: 5px;
    margin-bottom: 20px;
  }

  .item-title{
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
  .title-wrap{
    background: url("/monitor/sm-title-bg.png");
    background-size: 100% 50%;
    background-repeat: no-repeat;
    background-position: 0% 90%;
    width: 100%;
    font-size: 16px;
    font-weight: bold;
    margin-left: 5px;
  }
  .card-padding{
    padding: 15px;
  }


  :deep(){
    .el-table th.is-leaf, .el-table td{
      border: 1px solid #030e33;
    }
    .el-table__empty-block{
      background: #030e33;
    }
    .el-table__empty-text{
      color: #fff;
    }
    .el-table th.el-table__cell.is-leaf, .el-table td.el-table__cell{
      border-bottom: 1px solid #030e33;
    }
    .el-table--group::after, .el-table--border::after, .el-table::before{
      background-color: #030e33;
    }
    .el-input__wrapper{
      background-color: #030b2f;
      border: 1px solid #1563a5;
      color: #fff;
    }
    .el-input-group__append, .el-input-group__prepend{
      background-color: #1459b5;
      border: 1px solid #1459b5;
      color: #fff;
    }
    .el-input__inner:hover{
      border-color: #1563a5;
    }
    .el-table tr{
      background-color: transparent;
    }
    .el-table--enable-row-hover .el-table__body tr:hover > td{
      background-color: #00043d;
    }

    .el-table--small th, .el-table--small td{
      padding: 5px 0;
    }
    .el-table .cell{
      line-height: 18px;
      font-size: 12px;
    }
    .el-table th.is-leaf{
      border: 1px solid #1251b4;
    }

    .el-table__body-wrapper::-webkit-scrollbar-thumb{
      background-color: #0b73da;
      border-radius: 3px;
    }
    .el-table__body-wrapper::-webkit-scrollbar{
      width: 7px;
      height: 7px;
      background: #00043d;
    }
    .el-table__body{
      width: 100%!important;
    }
    .el-table .el-table__header-wrapper th{
      background: #1251b4;
      color: #fff;
    }
  }

</style>

