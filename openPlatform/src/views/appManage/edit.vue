<template>
  <div>
    <div class="section">
      <div class="title-bar">应用管理<span style="color: rgba(16, 16, 16, 1);font-size: 14px;font-weight: normal"> / {{$route.query.f ? '创建' : '修改'}}应用</span></div>
    </div>
    <div class="section">
      <div class="title">应用凭证</div>
      <div style="margin-bottom: 20px">
        client_id：{{ruleForm.clientId}}
        <el-popover
          placement="top"
          title=""
          width="80"
          popper-class="client-id-copy-tips"
          trigger="click"
          content="已复制">
          <i slot="reference" title="复制" @click="() => copyValue(ruleForm.clientId)" class="el-icon-copy-document ctrl-icon"></i>
        </el-popover>
      </div>
      <div style="margin-bottom: 50px">client_secret：{{clientSecret || '***************'}}
        <span v-if="clientSecret" style="color: #E49F43">
          <el-popover
                    placement="top"
                    title=""
                    width="80"
                    popper-class="client-id-copy-tips"
                    trigger="click"
                    content="已复制">
          <i slot="reference" title="复制" @click="() => copyValue(clientSecret)" class="el-icon-copy-document ctrl-icon"></i>
          </el-popover>
          <i class="el-icon-warning"></i>
          client_secret仅支持查看一次，请及时复制
        </span>
        <i v-else title="重置" @click="resetAppSecret(ruleForm.clientId)" class="el-icon-refresh-right ctrl-icon"></i>
      </div>
      <div class="title">应用凭证</div>

      <el-form style="margin-bottom: 130px" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
        <el-form-item label="应用名称：" prop="appName">
          <el-input v-model="ruleForm.appName" placeholder="请输入应用名称"></el-input>
        </el-form-item>
        <el-form-item label="应用副标题：" prop="subhead">
          <el-input placeholder="请输入应用副标题" v-model="ruleForm.subhead"></el-input>
        </el-form-item>
        <el-form-item label="图标：" prop="appLogo">
          <div style="display: flex;align-items: center">
            <img width="70px" height="70px" style="margin-right: 21px;object-fit: cover;border-radius:50%;"
                 :src="ruleForm.appLogo">
            <upLoad v-model="ruleForm.appLogo"></upLoad>
          </div>
          <div class="upload-tip">请上传JPG/PNG格式、240*240px以上、1:1 、2MB 以内的无圆角图标</div>
        </el-form-item>
        <el-form-item label="认证协议：" prop="isRequertType">
          <el-radio class="noMargin" v-model="ruleForm.isRequertType" :label="1">无</el-radio>
          <el-popover
            placement="top"
            width="460"
            trigger="hover" offset="-100">
            <template>
              <span>认证协议选择“无”则仅在应用中心为您创建一个应用的快捷入口</span>
            </template>
            <i slot="reference" style="margin-right: 70px" class="el-icon-question"></i>
          </el-popover>
          <el-radio class="noMargin" v-model="ruleForm.isRequertType" :label="2">OAuth 2.0</el-radio>
          <el-popover
            placement="top"
            width="300"
            trigger="hover" offset="-100">
            <template>
              <span>慧贸贸OAuth2.0授权登录协议</span>
              <a class="learn-more" href="https://help.aeotrade.com/c289/293d" target="_blank">查看文档</a>
            </template>
            <i slot="reference" class="el-icon-question"></i>
          </el-popover>
        </el-form-item>
        <el-form-item :key="ruleForm.isRequertType" :label="ruleForm.isRequertType == 1 ? '应用跳转链接：' : '重定向URL：'" prop="url">
          <el-input style="width: 95%" :placeholder="ruleForm.isRequertType == 1 ? '请输入应用跳转链接，例如：https://www.baidu.com/' : '请输入重定向URL'" v-model.trim="ruleForm.url"></el-input>
          <el-popover
            v-if="ruleForm.isRequertType == 2"
            placement="top-start"
            width="350"
            trigger="hover">
            <template>
              <span>填写重定向 URL 作为免登授权码跳转地址</span>
              <a class="learn-more" href="https://help.aeotrade.com/c289/293d#header-4" target="_blank">查看文档</a>
            </template>
            <i slot="reference" class="el-icon-question"></i>
          </el-popover>
        </el-form-item>
        <el-form-item v-if="ruleForm.isRequertType == 2" label="应用地址：">
          <el-input style="width: 95%" placeholder="请输入应用地址" v-model="ruleForm.state"></el-input>
          <el-popover
            placement="top-start"
            width="320"
            trigger="hover">
            <template>
              <span>填写登录后需要跳转的指定页面地址</span>
              <a class="learn-more" href="https://help.aeotrade.com/c289/293d#header-4" target="_blank">查看文档</a>
            </template>
            <i slot="reference" class="el-icon-question"></i>
          </el-popover>
        </el-form-item>
      </el-form>
      <div style="display: flex;justify-content: end" class="demo-ruleForm">
        <el-button size="small" @click="() => $router.back()">取消</el-button>
        <el-button size="small" @click="submit" type="primary">保存并发布</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import upLoad from "@/components/Upload/singleUpload";
  import {copyValue} from '@/utils/index'
  export default {
    name: 'editApp',
    components: { upLoad },
    data(){
      const checkName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请填写应用名称'));
        } else {

          callback();
        }
      };
      const checkUrl = (rule, value, callback) => {
        if(value === '' || value === null){
          if(this.ruleForm.isRequertType == 1)return callback(new Error('请输入应用跳转链接'))
          return callback(new Error('请输入重定向URL'))
        }else{
          callback()
        }
      }
      return {
        ruleForm: {},
        rules: {
          appName: [
            {required: true, validator: checkName, trigger: 'blur'},
            {min: 0, max: 32, message: '应用名称长度在32个字符内', trigger: 'blur'}
          ],
          subhead: [
            {required: true, message: '请输入应用副标题', trigger: 'blur'},
            {min: 0, max: 255, message: '应用副标题长度在255个字符内', trigger: 'blur'}
          ],
          isRequertType: [
            {required: true, message: '请选择认证协议', trigger: 'blur'},
          ],
          state: [
            {required: true, message: '请输入应用地址', trigger: 'blur'},
          ],
          url: [
            {required: true, validator: checkUrl, trigger: 'blur'},
          ]
        },
        copyValue,
        clientSecret: '',
      }
    },
    watch: {
      'ruleForm.isRequertType': function (val, oldVal) {
        if(val == 2){
          this.$refs['ruleForm'].clearValidate('url')
        }else{
          this.$refs['ruleForm'].clearValidate('state')
        }
      }
    },
    created() {
      const {id, cid} = this.$route.query
      if(id && cid){
        this.getAppInfoById(id, cid)
      }
    },
    methods: {
      submit(){
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.$api.appmng.updateApp(this.ruleForm).then(res => {
              if (res.code == 200) {
                this.$message.success(res.message)
                this.$router.push({path: 'index'})
              }
            }).catch(error => {
            })
          }
        })
      },
      getAppInfoById(id, clientId){
        this.$api.appmng.getAppDetailById({id}).then(res => {
          if(!res.result.isRequertType) res.result.isRequertType = 1
          res.result.publishStatus = 1
          this.ruleForm = res.result
        }).catch(e => {
        })

        this.$api.appmng.getAppSecretById({client: clientId}).then(res => {
          this.clientSecret = res.result || ''
        })
      },
      resetAppSecret(clientId){
        if(!clientId) return;
        this.$confirm('重置后原有的client_secret将会消失，登录功能无法正常，确定重置client_secret吗？', '提示', {
          confirmButtonText: '重置',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.appmng.resetAppSecret({client: clientId}).then(res => {
            this.clientSecret = res.result || ''
            this.$message({
              type: 'success',
              message: '重置成功!'
            });
          })
        }).catch(() => {

        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .section {
    margin-bottom: 20px;
    padding: 17px 20px 14px 20px;
    background-color: #fff;
    font-size: 14px;
    color: rgba(16, 16, 16, 1);
    .title-bar {
      position: relative;
      color: rgba(16, 16, 16, 1);
      font-size: 14px;
      font-weight: bold;
      padding-left: 14px;

      &::before {
        position: absolute;
        content: '';
        top: -4px;
        left: 0;
        width: 4px;
        height: 24px;
        background-color: rgba(71, 87, 255, 0.9);
      }
    }
    .title{
      color: rgba(16, 16, 16, 1);
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 22px;
    }
    .ctrl-icon{
      font-size: 18px;
      cursor: pointer;
      color: var(--aeo-primary-color);
    }
  }
  .demo-ruleForm{
    width: 600px;
  }
  .noMargin{
    margin-right: 5px;
  }

</style>

<style>
  .client-id-copy-tips{
    padding: 4px;
    min-width: 50px;
    width: auto!important;
  }
</style>
