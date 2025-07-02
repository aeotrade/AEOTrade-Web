
<script setup>
  import sha256 from 'crypto-js/sha256'
  import wordArray from 'crypto-js/lib-typedarrays'
  import md5 from 'crypto-js/md5'
  import {getBlockchainInfoFromPython , getBlockchainInfoFromJava} from '@/api/connect'
       const illegalFile = ref(false)  // 不合法文件
       const  dialogVisible = ref(false)
       const fileHash256 = ref('')   // 文件的hash256
       const codeImgUrl = ref('')      // 验证码url
       const codeImgMd5 = ref('')      // 验证码的md5
       const  codeInputVal = ref('')     // 用户输入的验证码
       const  finalJavaRes =  ref({})
       const  finalPythonRes = ref({})
       const  loading = ref(false)
       const  uploadFileList = ref([])
       const docVerifyRef = ref(null)
       const verifyStatus = ref('')
       const verifyStatusMapping = ref({
         '': {},
         'fail': {title: '核验失败', titleColor: '#ff8800'},
         'success': {title: '核验通过', titleColor: 'rgba(16, 16, 16, 1)'},
         'process': {title: '上链中…', titleColor: 'var(--el-color-primary)'}
       })

  const Config = useAppConfig()

      // 获取验证码
      const  getVerifyCode = ()=>{
        if(codeImgUrl.value) URL.revokeObjectURL(codeImgUrl.value)

        let baseUrl = import.meta.env.VITE_BASE_URL
        let urlImg = baseUrl + '/sys/admin/chain/code/image';
        const xhr = new XMLHttpRequest();
        xhr.open('GET', urlImg);
        xhr.responseType = 'blob';
        xhr.onload = () => {
          const headers = xhr.getAllResponseHeaders();

          codeInputVal.value = ''
          // 获取 Last-Modified 响应头，即图片最后修改时间
          codeImgMd5.value = xhr.getResponseHeader('Vcode')
          // 创建 URL 对象
          codeImgUrl.value = URL.createObjectURL(xhr.response);
        };
        xhr.send();
      }
      // 文件生成hash 256数据
      const  checkFileAndGenHash256 = (file) =>{
        let type = file.type
        if(['text/xml', 'image/png', 'application/pdf', 'image/jpeg'].includes(type)){
          illegalFile.value = false
          return new Promise((resolve) => {
            let reader = new FileReader()
            reader.onload = (evt) => {
              let wa = wordArray.create(evt.target.result)
              let hash = sha256(wa).toString()
              fileHash256.value = hash
              resolve()
            }
            reader.readAsArrayBuffer(file)
          })
        }else{
          illegalFile.value = true
          return false
        }
      }
      const  fileHttpReq=()=>{
        // 文件校验通过，请求接口
        // console.log('22222')
      }
      const fileListChange = (file, fileList) => {
        uploadFileList.value = fileList
      }
      const overLimitNum = (files, fileList)=>{
        // 清空已经上传的文件
        docVerifyRef.value.clearFiles()
        // 重新处理当前的文件
        nextTick(() => {
          checkFileAndGenHash256(files[0])
          docVerifyRef.value.handleStart(files[0])
        })
      }

     const docVerify=(hash)=>{
       finalJavaRes.value = {}
       finalPythonRes.value = {}
       verifyStatus.value = ''
       loading.value = true
        getBlockchainInfoFromPython({
          tp: 'file',
          hash: hash || fileHash256.value
        }).then(res => {
          dialogVisible.value = true
          loading.value = false
          if(!res.data){
            // 没数据，没查询到
            verifyStatus.value = 'fail';
          }else if(!res.data.transaction_id){
            verifyStatus.value = 'process';
            finalPythonRes.value = res.data;
          } else {
            verifyStatus.value = 'success';
            loading.value = true;
            finalPythonRes.value = res.data;
            getBlockchainInfoFromJava({txId: res.data.transaction_id}).then(javaRes => {
              loading.value = false
              finalJavaRes.value = javaRes.result
            })
          }
        }).catch(e => {
          loading.value = false
          dialogVisible.value = true
        })
     }
    const handleClickVerify = () => {
      // 校验验证码
      if(illegalFile.value) return   // 文件类型不符合
      if(!codeInputVal.value) return ElMessage.error('请输入验证码！')
      if(!uploadFileList.value.length) return ElMessage.error('请上传存证文件！')
      let codeHash =  md5(codeInputVal.value.toLowerCase()).toString()
      if(codeHash !== codeImgMd5.value) return ElMessage.error('验证码错误!')
      docVerify()
    }

    onMounted(()=>{
     nextTick(()=>{
      getVerifyCode()
       const hash = useRoute().query.hash
       if(hash) docVerify(hash)
     })
    })
</script>

<template>
  <div style="height: 100%">
    <div style="margin: 0px auto;padding: 16px;height: 100%">
      <div style="margin-bottom: 16px">
        <img src="@/assets/img/docVerify/banner.png" alt="" class="banner-image">
      </div>
      <div v-loading="loading" style="background-color: #fff;padding-top: 42px;height: calc(100% - 176px);padding-bottom: 60px">
        <el-row style="margin-bottom: 45px">
          <el-col :span="3" class="left-label">
            存证文件：
          </el-col>
          <el-col :span="21">
            <el-upload
              :class="{'upload-file-verify': true, 'illegal-file': illegalFile}"
              drag
              ref="docVerifyRef"
              action=""
              :http-request="fileHttpReq"
              :before-upload="checkFileAndGenHash256"
              :limit="1"
              :on-exceed="overLimitNum"
              :on-change="fileListChange"
              :show-file-list="false"
              :multiple="false">
              <template v-if="illegalFile">
                <i class="el-icon-circle-close" style="font-size: 40px;color: #f00;margin-top: 35px;"></i>
                <div class="illegal-file-tips" style="margin-top: 5px;line-height: 32px;color: rgba(255, 0, 13, 1);font-size: 14px;transform: translateY(-75px);padding-top: 75px;">
                  支持XML、PDF、JPG、JPEG、PNG文件的核验
                  <br>
                  <span style="text-decoration: underline;cursor: pointer">重新上传文件</span>
                </div>
              </template>
              <template v-else>
                <img style="width: 84px;height: 84px;margin-top: 20px" src="~/assets/img/docVerify/upload-icon.png">
                <div class="el-upload__text">
                  <div v-if="uploadFileList.length === 0">
                    <span style="color: rgba(16, 16, 16, 1);font-size: 14px">
                      点击或将文件拖拽到这里上传
                    </span>
                    <br>
                    <span style="display: block;margin-top:10px;color: #919AAC; font-size: 12px">
                      支持的文件格式：XML、PDF、JPG、JPEG、PNG格式
                  </span>
                  </div>

                  <div v-else>
                    <span style="color: var(--el-color-primary);font-size: 14px">
                 <i class="el-icon-document"></i> {{uploadFileList[0].name}}
                </span>
                  </div>
                </div>
              </template>
            </el-upload>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 100px">
          <el-col :span="3" class="left-label">
            验证码：
          </el-col>
          <el-col :span="21">
            <el-input style="width: 38%" v-model.trim="codeInputVal" placeholder="请输入验证码"></el-input>
            <img :src="codeImgUrl" @click="getVerifyCode" style="width: 96px;height: 32px;vertical-align: top;margin-left: 6px">
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="3" class="left-label">
            &nbsp;
          </el-col>
          <el-col :span="21">
            <el-button style="width: 100%; height: 40px;font-size: 16px;" type="primary" @click="handleClickVerify">开始核验</el-button>
          </el-col>
        </el-row>
      </div>
    </div>

    <client-only>
      <el-dialog
          title="核验结果"
          v-model="dialogVisible"
          width="712px"
          :append-to-body="true"
          :modal-append-to-body="true"
          :close-on-click-modal="false"
          @close="getVerifyCode"
          class="doc-verify-dialog"
      >
      <div v-loading="loading">
        <el-row style="width: 100%">
          <el-col :span="3">
            <img v-if="verifyStatus == 'success'" src="~/assets/img/docVerify/check-success.png" style="width: 60px; height: 60px">
            <img v-if="verifyStatus == 'fail'" src="~/assets/img/docVerify/check-fail.png" style="width: 60px; height: 60px">
            <img v-if="verifyStatus == 'process'" src="~/assets/img/docVerify/check-process.png" style="width: 60px; height: 60px">
          </el-col>
          <el-col :span="12">
            <div :style="{fontSize: '20px',fontWeight: 700, color: verifyStatusMapping[verifyStatus].titleColor, marginBottom: '15px'}">{{verifyStatusMapping[verifyStatus].title}}</div>
            <template v-if="verifyStatus == 'success'">
              <div style="margin-bottom: 10px">
                <img src="~/assets/img/docVerify/check-success.png" style="width: 16px;height: 16px;vertical-align: bottom;margin-right: 10px">
                电子文件已在区块链上存证
              </div>
              <div>
                <img src="~/assets/img/docVerify/check-success.png" style="width: 16px;height: 16px;vertical-align: bottom;margin-right: 10px">
                电子文件完整性校验通过，数据未被篡改
              </div>
            </template>
            <template v-if="verifyStatus == 'fail'">
              <div>
                该电子文件尚未在区块链上存证，或与链上存证数据不一致。
              </div>
            </template>
            <template v-if="verifyStatus == 'process'">
              <div>
                文件上链中，暂无链上交易信息
              </div>
            </template>
          </el-col>
          <el-col :span="9">
            <img :style="{visibility: verifyStatus ? 'visible' : 'hidden'}" src="~/assets/img/docVerify/doc-detail.png" style="width: 160px; height: 160px;transform: translateY(-20px);">
          </el-col>
        </el-row>

        <!--     区块链详细信息-->
        <template v-if="verifyStatus == 'success' || verifyStatus == 'process'">
          <div style="border-bottom: 1px solid #bbb;margin: 40px auto 20px"></div>

          <el-row class="block-detail">
            <el-col v-if="finalJavaRes.txId" :span="4" class="block-row-title">区块交易ID</el-col>
            <el-col v-if="finalJavaRes.txId" :span="20"><a target="_blank" style="color: var(--el-color-primary);cursor: pointer" :href="Config.chainBrowserAddress+'/transaction/' + finalJavaRes.txId">{{finalJavaRes.txId}}</a></el-col>

            <el-col v-if="finalJavaRes.blockHash" :span="4" class="block-row-title">区块Hash</el-col>
            <el-col v-if="finalJavaRes.blockHash" :span="20"><a target="_blank" style="color: var(--el-color-primary);cursor: pointer" :href="Config.chainBrowserAddress+'/block/' + finalJavaRes.blockHeight">{{finalJavaRes.blockHash}}</a></el-col>

            <el-col v-if="finalJavaRes.blockHeight" :span="4" class="block-row-title">区块高度</el-col>
            <el-col v-if="finalJavaRes.blockHeight" :span="20">{{finalJavaRes.blockHeight}}</el-col>

            <el-col v-if="finalJavaRes.preBlockHash" :span="4" class="block-row-title">前区块Hash</el-col>
            <el-col v-if="finalJavaRes.preBlockHash" :span="20"><a target="_blank" style="color: var(--el-color-primary);cursor: pointer" :href="Config.chainBrowserAddress+'/block/' + (finalJavaRes.blockHeight - 1)">{{finalJavaRes.preBlockHash}}</a></el-col>

            <el-col :span="24">&nbsp;</el-col>

            <el-col v-if="finalPythonRes.hash_value" :span="4" class="block-row-title">文件Hash</el-col>
            <el-col v-if="finalPythonRes.hash_value" :span="20">{{finalPythonRes.hash_value}}</el-col>

            <el-col v-if="finalPythonRes.contract_id" :span="4" class="block-row-title">所属合约</el-col>
            <el-col v-if="finalPythonRes.contract_id" :span="20">{{finalPythonRes.contract_id}}</el-col>

            <el-col v-if="finalPythonRes.chain_identity_id" :span="4" class="block-row-title">链上身份ID</el-col>
            <el-col v-if="finalPythonRes.chain_identity_id" :span="20">{{finalPythonRes.chain_identity_id}}</el-col>

            <el-col v-if="finalPythonRes.up_chain_org_name" :span="4" class="block-row-title">存证组织</el-col>
            <el-col v-if="finalPythonRes.up_chain_org_name" :span="20">{{finalPythonRes.up_chain_org_name}}</el-col>

            <el-col v-if="finalPythonRes.up_chain_time" :span="4" class="block-row-title">存证时间</el-col>
            <el-col v-if="finalPythonRes.up_chain_time" :span="20">{{finalPythonRes.up_chain_time}}</el-col>
          </el-row>
        </template>
      </div>
      </el-dialog>
    </client-only>

  </div>
</template>


<style lang="scss" scoped>
  .banner-image{
    width: 100%;
    border-radius: 10px;
    min-width: 900px;
  }
  .el-row{
    width: 822px;
    margin: 0 auto;
  }
  .upload-file-verify{
    :deep(.el-upload){
      width: 100%;
    }
    :deep(.el-upload-dragger){
      width: 100%;
    }
  }
  .left-label{
    text-align: right;
    line-height: 30px;
  }
  .illegal-file{
    :deep(.el-upload-dragger) {
      background-color: #fff0f1;
      border-color: rgba(255, 0, 0, 0.2);
    }
    :deep(.el-upload-dragger:hover){
      border-color: rgba(255, 0, 0, 0.7);
    }
  }
  :deep(){
    .el-dialog__wrapper{
    .el-row{
      width: 100%;
    }
  }
  }

  .block-row-title{
    color: rgba(38, 38, 38, 1);
    font-weight: bold;
  }
  .block-detail{
    .el-col{
      height: 20px;
      margin-bottom: 5px;
    }
    .el-col-21{
      padding-left: 30px;
    }
  }
  :deep(.doc-verify-dialog .el-dialog__header){
      padding-left: 30px;
  }
  :deep(.doc-verify-dialog .el-dialog__title){
      font-size: 16px;
      color: rgba(16, 16, 16, 1);
      font-weight: bold;
  }
  :deep(.doc-verify-dialog .el-dialog__body){
      padding: 30px;
  }
</style>
