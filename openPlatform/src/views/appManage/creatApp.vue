<template>
    <div>
      <div class="section">
        <div class="title-bar">应用管理<span style="color: rgba(16, 16, 16, 1);font-size: 14px;font-weight: normal"> / {{$route.query.id ? '修改' : '发布'}}应用</span></div>
      </div>
      <div class="section">
        <el-form style="margin-bottom: 130px" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" class="demo-ruleForm">
          <el-form-item label="应用名称：" prop="appName">
            <el-input v-model="ruleForm.appName" maxlength="20" show-word-limit placeholder="请输入应用名称"></el-input>
          </el-form-item>
          <el-form-item label="应用图标：" prop="appLogo">
            <div style="display: flex;align-items: center">
              <img width="70px" height="70px" style="margin-right: 21px;object-fit: cover;border-radius:50%;"
                   :src="ruleForm.appLogo">
              <upLoad v-model="ruleForm.appLogo"></upLoad>
            </div>
            <div class="upload-tip">请上传JPG/PNG格式、240*240px以上、1:1 、2MB 以内的无圆角图标</div>
          </el-form-item>
          <el-form-item label="应用介绍：" prop="subhead">
            <el-input placeholder="请输入应用介绍" maxlength="50" show-word-limit v-model="ruleForm.subhead"></el-input>
          </el-form-item>
          <el-form-item label="应用URL：" prop="url">
            <el-input style="width: 95%" placeholder="请输入应用跳转链接，例如：https://www.baidu.com/" v-model.trim="ruleForm.url"></el-input>
          </el-form-item>
          <el-form-item label="应用适用会员：" prop="vipTypeId">
            <el-select  placeholder="请选择" v-model.trim="ruleForm.vipTypeId" multiple  >
                <el-option v-for="(item, index) in vipTypeList" :key="index" :label="item.vipTypeName" :value="item.vipTypeId"></el-option>
            </el-select>
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
    import upLoad from '@/components/Upload/singleUpload';
    import {copyValue, Base64} from '@/utils/index';
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
            return callback(new Error('请输入重定向URL'));
          }
            callback();

        };

        return {
          ruleForm: {},
          rules: {
            appName: [
              {required: true, validator: checkName, trigger: 'blur'},
              {min: 0, max: 20, message: '应用名称长度在20个字符内', trigger: 'blur'}
            ],
            subhead: [
              {required: true, message: '请输入应用介绍', trigger: 'blur'},
              {min: 0, max: 50, message: '应用介绍长度在50个字符内', trigger: 'blur'}
            ],
            vipTypeId: [
              {required: true, message: '请选择会员类型', trigger: 'blur'}
            ],
            url: [
              {required: true, message: '请输入跳转链接', trigger: 'blur'}
            ],
            appLogo: [
              {required: true, message: '请选择图标', trigger: 'blur'}
            ]
          },
          copyValue,
          clientSecret: '',
          vipTypeList: []
        };
      },
      watch: {

      },
      created() {
        this.getVipInfos();
        const {id} = this.$route.query;

        if(id ){
          this.getAppInfoById(id);
        }
      },
      methods: {
        getVipInfos(){
          this.$api.app.getVipType({}).then(res => {
            if(res.code == 200){
              this.vipTypeList = res.result.map(item=>{
                return {vipTypeId:item.id,vipTypeName:item.typeName};
              });
            }
          });
        },
        submit(){
          this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
                let api = this.$route.query.id ? this.$api.app.updateApp : this.$api.app.createApp;

              let params = {
                  ...this.ruleForm,
                  publishStatus:0,
                  sort:1,
                  appType:0,
                  isWindows:1,
                  memberId: this.$store.state.user.memberId,
                  memberName: this.$store.state.user.name,
                  createdBy : this.$store.state.user.info.bind.staffname
                };

                params.vipTypeId = this.ruleForm.vipTypeId.map(item => {
                  return {
                    vipTypeName: this.vipTypeList.filter(vip => vip.vipTypeId == item)[0].vipTypeName,
                    vipTypeId: item
                  };
                });
                api(params).then(res => {
                if (res.code == 200) {
                  this.$message.success(res.message);
                  this.$router.push({path: 'index',query: { activeTab:'second'}});
                }
              }).catch(error => {
              });
            }
          });
        },
        getAppInfoById(appId){
          this.$api.app.getAppByID({appId}).then(res => {
            this.ruleForm = res.result;
            this.ruleForm.vipTypeId = this.ruleForm.vipTypeId.map(item => {
              return item.vipTypeId;
            });
          })
        }
      }
    };
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
