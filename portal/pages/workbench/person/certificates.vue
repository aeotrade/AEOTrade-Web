<script setup>
    import {apiGetCertList} from '~/api/api'

    const state = reactive({
        dialogVisible:false,
        dialogVisible2:false,
        time:null,
        input:null,
        nodeInfo:{},
        certificate:null,
        currentPage:1,
        pageSize:10
    })

    const download = (content,fileName,type) => {
        let txtFile = new Blob([content]);
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(txtFile);
        link.download = fileName+'.'+type;
        link.click();
        window.URL.revokeObjectURL(link.href);
    }
    const getInfo = () => {
        let params = {
            staffId:cookies.getItem('staffId'),
            pageNo:state.currentPage,
            pageSize:state.pageSize
        }
        apiGetCertList(params).then(res=>{
            state.nodeInfo = res.result;
        })
    }
    const showCertificate = (content) => {
        state.certificate = content;
        state.dialogVisible2 = true;
    }
    const handleSizeChange = (val) => {
        state.currentPage = 1;
        state.pageSize = val;
        getInfo();
        console.log(`每页 ${val} 条`);
    }
    const handleCurrentChange = (val) => {
        state.currentPage = val;
        getInfo();
        console.log(`当前页: ${val}`);
    }

    await getInfo()

</script>

<template>
  <div style="width: 100%;height: 100%">
    <div style="color: rgba(16, 16, 16, 1);padding-left: 20px;background-color:#fff;font-size: 14px;margin-bottom: 16px;height: 40px;line-height: 40px">证书管理<span style="color: #424242;font-size: 12px;line-height: 40px;margin-left: 20px">即用户可以查看、下载在信贸链上所拥有的用户证书、组织证书。</span></div>
    <div style="padding:0 16px;background-color: #F7F8F9;flex: 1;height: calc(100% - 72px)">
      <el-card style="height: 100%">
        <el-table
            class="padding-table"
            :data="state.nodeInfo.records"
            style="width: 100%">
          <el-table-column
              prop="did"
              align="center"
              label="DID">
            <template #default="scope">
              <span>{{scope.row.did||'---'}}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="userType"
              align="center"
              label="用户类型">
          </el-table-column>
          <el-table-column
              prop="organName"
              align="center"
              label="所属组织">
          </el-table-column>
          <el-table-column
              prop="creatTime"
              align="center"
              label="开通时间">
          </el-table-column>
          <el-table-column
              prop="address"
              align="center"
              label="证书">
            <template #default="scope">
              <el-link
                  :underline="false"
                  @click="showCertificate(scope.row.stringStringMap)"
                  type="primary">
                查看
              </el-link>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin: 20px auto 50px;float:right">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="state.currentPage"
              :page-sizes="[5, 10, 20]"
              :page-size="state.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="Number(state.nodeInfo.total)">
          </el-pagination>
        </div>
      </el-card>


      <el-dialog
          title="查看证书"
          v-model="state.dialogVisible2"
          width="1000px">
        <div class="dialog-container" v-if="state.certificate">
          <div class="keys">
            <div class="keys-title">签名证书</div>
            <el-scrollbar style="height: 100px;border:2px solid rgba(223, 223, 223, 100);box-shadow: 0px 2px 6px 0px rgba(var(--el-color-primary-rgb), .15);">
              <div class="keys-info">
                {{state.certificate.signcert}}
              </div>
            </el-scrollbar>
            <el-button @click="download(state.certificate.signcert,'签名证书','crt')" type="primary" size="small" style="margin-top:8px">下载</el-button>
          </div>
          <div class="keys">
            <div class="keys-title">tls证书</div>
            <el-scrollbar style="height: 100px;border:2px solid rgba(223, 223, 223, 100);box-shadow: 0px 2px 6px 0px rgba(var(--el-color-primary-rgb), .15);">
              <div class="keys-info">
                {{state.certificate.tlscert}}
              </div>
            </el-scrollbar>
            <el-button @click="download(state.certificate.tlscert,'tls证书','crt')" type="primary" size="small" style="margin-top:8px">下载</el-button>
          </div>
          <div class="keys">
            <div class="keys-title">签名私钥</div>
            <el-scrollbar style="height: 100px;border:2px solid rgba(223, 223, 223, 100);box-shadow: 0px 2px 6px 0px rgba(var(--el-color-primary-rgb), .15);">
              <div class="keys-info">
                {{state.certificate.signprivatekey}}
              </div>
            </el-scrollbar>
            <el-button @click="download(state.certificate.signprivatekey,'签名私钥','key')" type="primary" size="small" style="margin-top:8px">下载</el-button>
          </div>
          <div class="keys">
            <div class="keys-title">tls私钥</div>
            <el-scrollbar style="height: 100px;border:2px solid rgba(223, 223, 223, 100);box-shadow: 0px 2px 6px 0px rgba(var(--el-color-primary-rgb), .15);">
              <div class="keys-info">
                {{state.certificate.tlsprivatekey}}
              </div>
            </el-scrollbar>
            <el-button @click="download(state.certificate.tlsprivatekey,'tls私钥','key')" type="primary" size="small" style="margin-top:8px">下载</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>

</template>

<style lang="scss" scoped>
    .keys{
        margin-bottom:30px;
        width:440px;
        margin-right: 16px;
        .keys-title{
            color: rgba(16, 16, 16, 100);
            font-size: 12px;
            font-weight: bold;
            margin-bottom:10px;
        }
        .keys-info{
            font-size: 12px;
            white-space: pre-line;
            padding: 0;
            color: rgb(155,155,155);
        }
    }
    :deep(.el-scrollbar__wrap){
            overflow-x: hidden;
    }
    :deep(.el-input__inner){
        border-radius: 3px;
    }
    :deep(.el-table th){
        background-color: #F7F8FA;
        color: #424242;
        font-weight: bold;
    }
    :deep(.el-dialog__header){
        padding: 15px;
    }
    :deep(.el-dialog__headerbtn){
        top: 18px;
        right: 12px;
    }


    .padding-table{
        :deep(tr th){
            padding: 12px 0px;
        }
        :deep(tr td){
            padding: 12px 0px;
        }
    }
    .line{
        margin:28px 0;
        height:1px;
        background-color:rgba(var(--el-color-primary-rgb), .1);
    }
    .container{
        /*min-height:92.5vh;*/
        /*padding: 20px;*/
        /*background-color: #F7F8FA;*/
        /*margin-top: 8px;*/
        .wrapper{
            min-height:100%;
            background-color: #fff;
            padding: 25px 20px 35px 20px;
            .title{
                color: rgba(16, 16, 16, 100);
                font-size: 18px;
            }
        }
    }
    .list{
        margin: 30px 0;
        display: flex;
        justify-content: space-between;
        .list-item{
            width: 32%;
            color: rgba(16, 16, 16, 100);
            .list-title{
                font-size: 14px;
                margin-bottom: 20px;
            }
            .list-info{
                font-size: 16px;
                font-weight: bold;
                padding: 25px 30px;
                background-color: rgba(var(--el-color-primary-rgb), .04);
                border: 1px solid rgba(var(--el-color-primary-rgb), .15);
            }
        }
    }
    .dialog-container{
        display:flex;
        flex-wrap:wrap;
        justify-content: center;
        padding: 10px 18px 10px 18px;
    }
    .el-card{
        border: none;
    }
    .is-always-shadow{
        box-shadow: none;
    }
</style>
