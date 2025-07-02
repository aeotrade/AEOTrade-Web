<script setup>
   import { getMainData } from '@/api/connect'

        const mianData = reactive({data:[]})
        const formInline = reactive( {
          search:''
        })
       const pagination = reactive({
          pageInfo:{
            currpage:1,
            pagesize:10,
          },
          totalInfo:0,
        })
        const loading = ref(true)

     const  reset=()=>{
        formInline.search = ''
        getMainDataModel()
      }
      const onSubmit=()=>{
        pagination.pageInfo.currentpage = 1
        getMainDataModel()
      }
      const tableHandleClick = (row, column, event)=>{
        if (row.model_detail_url){
          window.open(row.model_detail_url)
        }
      }
      const jump = (item)=>{
        if(item.model_detail_url){
          window.open(item.model_detail_url)
        }
      }
      const getMainDataModel = ()=>{
        loading.value = true
        getMainData({...formInline,...pagination.pageInfo}).then(res=>{
             mianData.data = res.data.records
             pagination.totalInfo = res.data.total
             loading.value = false
        })
      }
      const infoSizeSearch = (val) =>{
        /* 改变显示数量 */
        pagination.pageInfo.pagesize = val
        pagination.pageInfo.currpage = 1
        getMainDataModel()
      }
     const  infoCurrSearch = (val)=> {
        /* 改变当前页 */
        pagination.pageInfo.currpage = val
        getMainDataModel()
      }


      onMounted(()=>{
        nextTick(()=>{
            getMainDataModel()
        })
    })


  </script>
  <template>

    <div style="height: 100%;overflow: auto">
      <div class="title">
        数据目录  <span style="font-weight: normal;line-height: 40px;margin-left: 20px;font-size: 12px;color: #424242;">联盟成员一起定义数据模型供各种数据互通场景使用</span>
      </div>

      <div style="height: calc(100% - 56px);width: 100%;padding: 0 15px 16px;display: flex;flex-direction: column"   v-loading="loading">

        <div class="head">

          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="名称:">
              <el-input v-model.trim="formInline.search" placeholder="请输入数据名称"  @keyup.enter.native="onSubmit"></el-input>
            </el-form-item>
            <el-form-item style="position: absolute;right: 20px;margin-right: 0px">
              <el-button @click="reset" style="background-color: #f7f8fa;">重置</el-button>
              <el-button type="primary"  @click="onSubmit" >查询</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="card mytable">
          <!--        <div class="mainDataName">-->
          <!--          名称-->
          <!--        </div>-->
          <!--        <div style="min-height: 450px;border: 1px #CCC solid;width: 500px">-->
          <!--            <div class="mianData-item" v-for="item in mianData" @click="jump(item)">{{item.model_name}}</div>-->
          <!--        </div>-->
          <el-table
              :data="mianData.data"
              border
              width="400"
              @row-click="tableHandleClick"
          >
            <el-table-column
                align="center"
                label="名称"
            >
              <template #default="scope">
                <span style="color: var(--el-color-primary)">{{scope.row.model_name}}</span>
              </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="版本号"
            >
              <template #default="scope">
                <span>{{scope.row.model_version}}</span>
              </template>
            </el-table-column>
          </el-table>
          <div style="display: flex;justify-content: flex-end;margin-top: 30px">
            <el-pagination
                class="hs-pagination"
                @size-change="infoSizeSearch"
                @current-change="infoCurrSearch"
                :current-page="pagination.pageInfo.currpage"
                :page-size="pagination.pageInfo.pagesize"
                :page-sizes="[10,20,30]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.totalInfo">
            </el-pagination>
          </div>
        </div>
      </div>
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
    .demo-form-inline{
      .el-form-item__label{
        margin-right: 10px;
        font-size: 14px;
        font-weight: bold;
        padding: 0  ;
      }
    //  .el-input__wrapper {
    //  background-color: #f7f8fa;
    //}
    //  .el-range-input{
    //    background-color: #f7f8fa;
    //  }
    }

  }
  .head{
    position: relative;
    padding: 20px;
    margin-bottom: 16px;
    background-color: #fff;
    box-sizing: border-box;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    font-weight: bold;
  }
  .title{
    display: flex;
    padding-left: 20px;
    color: rgba(16, 16, 16, 100);
    box-sizing: border-box;
    background-color: #fff;
    height: 40px;
    line-height: 40px;
    margin-bottom: 16px;
    font-size: 14px;
    font-family: SourceHanSansSC-regular;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .card{
    box-sizing: border-box;
    background-color: #fff;
    padding: 20px;
    flex: 1;
  }

  .mainDataName{
    width: 500px;
    height: 45px;
    background-color: #F7F8FA;
    line-height: 45px;
    text-align: center;
    //margin-top: 40px;
  }

  .mianData-item{
    width: 500px;
    text-align: center;
    background-color:#fff;
    height: 45px;
    line-height: 45px;
    border-right: 1px #ccc solid;
    border-bottom: 1px #ccc solid;
    cursor: pointer;
  }
  .el-form-item{
    margin-bottom: 0;
  }

  </style>

