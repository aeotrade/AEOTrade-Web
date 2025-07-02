
<script setup>
// import LF from '../../components/LF/index.vue'
import { getContractrecordProcess ,getChainMessage} from '@/api/connect'
import moment from 'moment'
const Config = useAppConfig()
const route = useRoute()
const dialogVisible = ref(false)
const chainInfo = reactive({})
const tableData = reactive({data:[]})
const chainTableData =reactive({data:[]})
const xmldata =  reactive({xml:null})
const loading = ref(false)

const titleShow = computed(()=>{
  if(!route.query.titleShow) return false
  let emptyKeyValue = ['null','undefined','','false']
  if (emptyKeyValue.indexOf(route.query.titleShow) > -1)  return  false
  return  route.query.titleShow
})
   const tableHandleClick=(row, column, event)=>{
      if (row.transaction_id){
        window.open( Config.chainBrowserAddress+"/transaction/"+row.transaction_id)
      }
    }
   const getList=()=>{
      console.log(route.query.id)
      getContractrecordProcess({contractrecordid:route.query.id}).then(res=>{
        tableData.data = res.data.contractProcessVos
        xmldata.xml =   res.data.processDefine
      })
    }

    const getChainInfo = () =>{
      loading.value = true
      getChainMessage({...chainInfo,biz_collaboration_id:route.query.entContractRecordNo}).then(res=>{
         chainTableData.data =  res.data
         loading.value = false
      }).catch(err=>{
        loading.value = false
      })
    }
  const  openDetail = (item) =>{
      chainInfo.contract_id =  route.query.contractId
      chainInfo.activity_code = item.activityId
      getChainInfo()
      dialogVisible.value = true
    }


  onMounted( () =>{
    nextTick(()=>{
      getList()
    })
  })


const getWrapperHeight = computed(()=>{
  return `${document.documentElement.clientHeight - 300}px`
})


</script>
<template>
  <div style="width: 100%;height: 100%;display: flex;overflow:auto;flex-direction: column">
      <el-breadcrumb separator="/" style="margin-top:3px; " class="title" v-if="titleShow">
        <el-breadcrumb-item :to="{ path: '/connect/recording' ,query:{titleShow:'true'}}"><span style="font-size: 14px;color:#666;font-weight: normal">协作日志</span></el-breadcrumb-item>
        <el-breadcrumb-item>{{route.query.contacrtName}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="baseInfo" style="flex: 1;padding: 15px 16px 16px;"
      >
        <div class="table-list" style="position: relative;margin-bottom: 20px;padding: 32px;background-color: #fff;width: 100%;height: 371px" >
          <el-row  class="tab" >
            <el-col :span="1"><div class="grid-title">节点</div></el-col>
            <el-col :span="4"><div class="grid-title">协作记录ID</div></el-col>
            <el-col :span="6"><div class="grid-title">活动</div></el-col>
            <el-col :span="6"><div class="grid-title">活动发生时间</div></el-col>
            <el-col :span="4"><div class="grid-title">数据模型</div></el-col>
            <el-col :span="3"><div class="grid-title">上链信息</div></el-col>
          </el-row>
          <el-scrollbar style="height:250px" wrap-style="overflow-x:hidden;">
              <el-row v-for="(item, index) in tableData.data.filter(item=>item.onTable)" :key="index" class="row" >
                <el-col :span="1"><div class="grid-title" style="display: flex;align-items: center;justify-content: center;position: relative">
                  <div class="radioLine"></div>
                  <div class="radio-box">
                    <div class="radio"><div></div></div></div>
                </div>
                </el-col>

                <el-col :span="4"><div class="grid-title">{{route.query.id}}</div></el-col>
                <el-col :span="6"><div class="grid-title">{{item.activityName}}</div></el-col>
                <el-col :span="6"><div class="grid-title">{{ moment(item.activityTriggerTime ).format('YYYY-MM-DD HH:mm:ss')}}</div></el-col>
                <el-col :span="4"><div class="grid-title">{{item.masterDataModelName}}</div></el-col>
                <el-col :span="3"><div class="grid-title"> <el-button type="primary" size="small" @click="openDetail(item)">查看</el-button></div></el-col>
              </el-row>
          </el-scrollbar>
        </div>
        <ConnectLogic   style="flex: 1" :xmldata="xmldata"  type="read" v-if="tableData.data.length" :showyellow="true" :style="{height: getWrapperHeight}" :tableData="tableData.data"></ConnectLogic>
      </div>
    <el-dialog
      title="上链信息"
      v-model="dialogVisible"
      width="1000px"
      top="30vh"
      append-to-body
    >
      <div class="mytable">
        <el-table
          v-loading="loading"
          :data="chainTableData.data"
          stripe
          style="width: 100%"
          @row-click="tableHandleClick"
        >
          <el-table-column
            prop="up_chain_type"
            width="80"
            align="center"
            label="上链类型">
          </el-table-column>
          <el-table-column
            width="180"
            align="center"
            label="区块链交易ID">
            <template v-slot="scope">
              <el-tooltip  popper-class="noBorder" :content="scope.row.transaction_id" placement="top" effect="light" :enterable="false" >
                <p style="cursor: pointer;width:175px; white-space: nowrap;text-overflow: ellipsis;overflow: hidden" class="font">{{scope.row.transaction_id}}</p>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="chain_name"
            align="center"
            width="150"
            label="所属区块链">
          </el-table-column>
          <el-table-column
            prop="transaction_time"
            width="180"
            align="center"
            label="区块链交易时间">
          </el-table-column>
          <el-table-column
            width="120"
            align="center"
            label="区块链交易状态">
            <template v-slot="scope">
             {{ scope.row.transaction_status == "失败"?'上链中':scope.row.transaction_status }}
            </template>
          </el-table-column>
          <el-table-column
            prop="trader_identity"
            width="250"
            align="center"
            label="链上身份">
          </el-table-column>

        </el-table>
      </div>

    </el-dialog>
  </div>
</template>


<style scoped lang="scss">

:deep(){
  .mytable{
    .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell{
      cursor: pointer;
      color: var(--el-color-primary);
    }
  }
}
.head{
  padding: 15px 10px 15px;
  background-color: #fff;
  box-sizing: border-box;
  margin-bottom: 13px ;
  box-shadow: 0px 2px 6px 0px rgba(var(--el-color-primary-rgb), 0.15);
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
  position: sticky;
  top: 0;
  z-index: 10;
}
.info-title{
  font-size: 14px;
  font-weight: bold;
}

.table-list{
  width:  850px;
  margin: 0 auto;

}

.tab{
  .grid-title{
    font-size: 16px;
    font-weight: bold;
  }
}
.grid-title{
  height: 50px;
  font-size: 14px;
  line-height: 50px;
  text-align: center;
}

//.li::after{
//  content: '';
//  display: block;
//   width: 16px;
//   height: 16px;
//   border-radius: 50%;
//  transform: translateY(8px);
//  background-color: #D7D7D7;
//}

//.table-list::after{
//   content:'';
//   height: 250px;
//   width: 0px;
//   border-left: 1px dashed var(--el-color-primary)33;
//   top: 35px;
//   left: 8px;
//   background-color: #D7D7D7;
//   position: absolute;
//}
.radioLine{
   position: absolute;
   z-index: 0;
  width: 0px;
  border-left: 1px dashed var(--el-color-primary);
  height: 100%;
}
.radio-box{
  padding:5px ;
  background-color: #fff;
  z-index: 1;
}
.radio{
  z-index: 1;
  width: 16px;
  padding-top: 7px;
  padding-bottom: 7px;
  background-color: #fff;
  height: 16px;
  border-radius: 50%;
  border: 1px solid var(--el-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  div{
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--el-color-primary);
  }
}

.baseInfo{
  display: flex;
  flex-direction: column;
}
</style>
<style>
.noBorder{
  border: 0px!important;
  box-shadow: 0px 2px 6px 0px rgba(var(--el-color-primary-rgb), 0.15);
}
.noBorder .popper__arrow{
  display: none;
}
.customTimePopoverClass .el-popover__title{
  text-align: center;
}
</style>
