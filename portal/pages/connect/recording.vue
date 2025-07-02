<script setup>
   const dayjs = useDayjs()
   const router = useRouter()
   const route = useRoute()

   import { getContracttplType,getContractrecord} from '@/api/connect'
   const tableData = reactive({data:[
    ]})
   const pagination = reactive({
      pageInfo:{
        currentpage:1,
        pagesize:10,
      },
      totalInfo:10,
    })
   const navbarList = reactive({data:[]})
   const formInline = reactive( {
      contractname: '',
      contractrecordid:'',
      time:'',
      categoryCode:['']
    })
   const formAble =reactive( {
      contractname: false,
      contractrecordid:false,
      time:false,
      categoryCode:false
    })
  const loading = ref(false)
 onMounted(()=>{
  if (route.query.name){
    formInline.contractname = route.query.name
  }
  // 判断页面参数是否有查询的字段 如果有就加入到query 中
  let query = route.query
  Object.keys(query).forEach(item=>{
    if (formInline.hasOwnProperty(item)){
      formAble[item] = true
      if (item != 'categoryCode'){
        formInline[item] = query[item]
      }else {
        formInline[item] = query[item].split(',')
      }

    }
  })

  nextTick(()=>{
    onSubmit()
    getContractKind()
  })
})

const  handleTagMove =(e)=>{
    if (formAble.categoryCode){
      formInline.categoryCode.push(e)
      return
    }
    if(!e || formInline.categoryCode.length === 0){
      formInline.categoryCode = ['']
    }
  }
  const  handleKindsChange = (e)=>{
    // 判断数据是否有点击到全部选项
    if ( e[e.length-1] === ''){
      formInline.categoryCode = ['']
    }else{
      if (e[e.length-2] === ''){
        let data = e[e.length-1]
       formInline.categoryCode = [data]
      }
    }
  }
  const   getContractKind=()=>{
    getContracttplType().then(res=>{
      navbarList.data = [{categoryName:'全部',categoryCode:''},...res.data]
    })
  }
  const   reset=()=>{
    formInline.contractname=  ''
    formInline.contractrecordid = ''
    formInline.time=''
    formInline.categoryCode=['']

     formInline = {
      contractname: '',
      contractrecordid:'',
      time:'',
      categoryCode:[''],
    }
    getList()
  }
  // 查询
  const   onSubmit=()=>{
    pagination.pageInfo.currentpage = 1
    getList()
    console.log('test')
  }
  // 获取协作列表
  const   getList=()=>{
    loading.value =true
    let formData = {}
    let id = route.query.id
    let { time,categoryCode,...params} = toRefs(formInline)

    if (categoryCode[categoryCode.length -1 ] !== ''){
      params.categorycode = categoryCode.value.join(',') // 实际入参是小写categorycode
    }
    !time.value && (time.value = ['',''])
      params.startdate=time.value[0] || ''
      params.enddate=time.value[1] || ''

    if (id){
      formData = {
        contractid:id,
        ...pagination.pageInfo,
      }
    }else{
       formData = {
        ...pagination.pageInfo,
         ...params
      }
    }
    getContractrecord(formData).then(res=>{
        tableData.data = res.data.records
        pagination.totalInfo =  res.data.total*1
        loading.value = false
    }).catch(err=>{
      tableData.data = []
      pagination.totalInfo = 0
      loading.value = false
    })
  }
  //跳转到详情页
  const  goto=(id,entContractRecordNo,contractId,contacrtName,titleShow)=>{
    router.push({path:'/connect/recordDetail',query:{id,entContractRecordNo,contractId,contacrtName,titleShow}})
  }
  const   infoSizeSearch = (val) =>{
    /* 改变显示数量 */
    pagination.pageInfo.currentpage = 1
    pagination.pageInfo.pagesize = val
    getList()
  }
  const   infoCurrSearch = (val) => {
    /* 改变当前页 */
    pagination.pageInfo.currentpage = val
    getList()
  }
  const    dateTimePickerOptions = ()=> {  // 日期时间只能选择当前日期之前
    return {
      disabledDate: (time) => {
        return time.getTime() > new Date().getTime();
      }
    }
  }


 const titleShow = computed(()=>{
    if(!route.query.titleShow) return false
    let emptyKeyValue = ['null','undefined','']
    if (emptyKeyValue.indexOf(route.query.titleShow) > -1)  return  false
    return  route.query.titleShow
 })
</script>

<template>
  <div
    style="width: 100%; height: 100%;overflow: auto"
  >
    <div class="title" v-if="titleShow">协作日志</div>
    <div
      style="
        margin-top: 16px;
        width: 99%;
        height: 835px;
        padding: 0px 16px 16px;
        display: flex;
        flex-direction: column;
        min-height: 680px;
      "
    >
      <div class="head">

        <el-form
          :inline="true"
          :model="formInline"
          class="demo-form-inline"
          style="flex: 1"
        >
          <el-row>
            <el-col :span="4">
              <el-form-item label="合约名称:">
                <el-input
                  v-model.trim="formInline.contractname"
                  placeholder="请输入合约名称"
                  :disabled="formAble.contractname"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="5">
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
              <el-form-item label="协作记录ID:">
                <el-input
                  v-model.trim="formInline.contractrecordid"
                  placeholder="请输入协作记录ID"
                  :disabled="formAble.contractrecordid"
                ></el-input> </el-form-item
            ></el-col>
            <el-col :span="8">
              <el-form-item label="创建时间:">
                <el-date-picker
                  v-model="formInline.time"
                  :disabled="formAble.time"
                  type="datetimerange"
                  range-separator="至"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  :picker-options="dateTimePickerOptions"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker> </el-form-item
            ></el-col>

            <el-col :span="3" style="position: relative">
              <el-form-item style="height: 30px;">
                <el-button
                  @click="reset"
                  style="
                    right: 90px;
                    position: absolute;
                  "
                  >重置</el-button
                >
                <el-button
                  type="primary"
                  @click="onSubmit"
                  style="right: 20px; position: absolute"
                  >查询</el-button
                >
              </el-form-item></el-col
            >
          </el-row>

          <!--        <el-form-item label="主数据内容：">-->
          <!--          <el-input v-model="formInline.region" placeholder="单行输入"></el-input>-->
          <!--        </el-form-item>-->
        </el-form>
      </div>
      <div class="card">
        <el-table :data="tableData.data" width="100%" v-loading="loading">
          <el-table-column label="协作记录ID" align="center"  prop="contractRecordId">
          </el-table-column>
          <el-table-column align="center" prop="contractName" label="合约名称">
          </el-table-column>
          <el-table-column align="center" prop="activity" label="最近活动">
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
          <el-table-column align="center" label="查看协作过程">
            <template #default="scope">
              <div
                style="color: var(--el-color-primary); cursor: pointer"
                @click="
                  goto(
                    scope.row.contractRecordId,
                    scope.row.entContractRecordNo,
                    scope.row.contractId,
                    scope.row.contractName,
                    titleShow
                  )
                "
              >
                查看
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建时间">
            <template #default="scope">
              {{
                scope.row.createTime
                  ? dayjs(scope.row.createTime).format("YYYY-MM-DD HH:mm")
                  : ""
              }}
            </template>
          </el-table-column>
        </el-table>
        <div style="display: flex;justify-content: flex-end; margin-top: 32px">
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
  </div>
</template>

<style scoped lang="scss">
.head {
  padding-left: 20px;
  padding-top: 20px;
  background-color: #fff;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  //align-items: center;
  box-sizing: border-box;
  //margin-bottom: 18px ;
}
.title {
  //.buleLine{
  //  width: 4px;
  //  height: 24px;
  //  background-color: var(--el-color-primary);
  //  margin-right: 13px;
  //  font-family: SourceHanSansSC-bold;
  //}
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
.card {
  flex: 1;
  box-sizing: border-box;
  background-color: #fff;
  padding: 20px;
}
:deep() {
  .demo-form-inline {
    .el-form {
      white-space: nowrap;
    }
    .el-form-item__label {
      //margin-right: 10px;
      font-size: 14px;
      font-weight: bold;
      padding: 0;
    }
    .el-form-item {
      width: 95%;
    }
    .el-form-item__label {
      position: absolute;
    }
    .el-form-item__content {
      width: 100%;
      padding-left: 80px;
    }
    .el-select,
    .el-input_inner,
    .el-input__inner {
      width: 100%;
    }
    //.el-input__wrapper {
    //  background-color: #f7f8fa;
    //}
    //.el-range-input {
    //  background-color: #f7f8fa;
    //}
  }
  .el-dialog__footer {
    text-align: center;
  }
  .el-radio {
    margin-right: 60px;
    margin-bottom: 30px;
  }
}
</style>

<style>
.noBorder {
  border: 0px !important;
}
.noBorder .popper__arrow {
  display: none;
}
.customTimePopoverClass .el-popover__title {
  text-align: center;
}
</style>
