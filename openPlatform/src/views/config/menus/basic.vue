<template>
  <div class="menu-container">
    <div class="title">基本信息</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="106px" class="demo-ruleForm">
      <el-form-item label="编码：">
        <span>{{ruleForm.code}}</span>
      </el-form-item>
      <el-form-item label="名称：" prop="name">
        <el-input v-model.trim="ruleForm.name" placeholder="请输入连接器名称"></el-input>
      </el-form-item>
      <el-form-item label="描述：" prop="desc">
        <el-input :rows="4" type="textarea" placeholder="请输入连接器描述" v-model.trim="ruleForm.desc"></el-input>
      </el-form-item>
      <el-form-item label="类型：" prop="category">
        <el-select v-model="ruleForm.category" multiple placeholder="请选择连接器类型" style="width: 430px;">
          <el-option v-for="(item,i) in category" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提供商：">
        <span>{{ruleForm.provider}}</span>
      </el-form-item>
      <el-form-item label="图标：" prop="region">
        <div style="display: flex;align-items: center">
          <img width="70px" height="70px" style="margin-right: 21px;object-fit: cover;border-radius:50%;"
               :src="ruleForm.image">
          <upLoad v-model="ruleForm.image"></upLoad>
        </div>
        <div class="upload-tip">请上传JPG/PNG格式、240*240px以上、1:1 、2MB 以内的无圆角图标</div>
      </el-form-item>
      <el-form-item prop="visibility">
           <span slot="label">
              <span>自动开通</span>
              <el-tooltip style="diaplay:inline"  content="新注册用户自动开通本连接器" placement="top">
                  <i class="el-icon-question" />
              </el-tooltip>
              <span>：</span>
           </span>
        <el-radio-group v-model="ruleForm.is_auto_open">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="可见范围：" prop="resource">
        <div style="font-weight: bold;">{{visibilityObj[ruleForm.visibility]}}</div>
        <div style="font-size: 10px;line-height: 20px" v-for="(item,i) in company" :key="i">{{item.memberName}}</div>
      </el-form-item>
      <el-form-item>
        <div style="position: fixed;left: 808px;bottom: 70px;">
          <el-button type="primary" @click="submit" size="small"
                     style="width: 80px;height: 30px;line-height: 10px;">保存
          </el-button>
        </div>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  import upLoad from "@/components/Upload/singleUpload";
    export default {
        name: "basic",
      components: {upLoad},
      data(){
        var checkName = (rule, value, callback) => {
          if (value === '') {
            callback(new Error('请填写连接器名称'));
          } else {

            callback();
          }
        };
          return {
            company:[],
            visibilityObj:{
              "public":"公开",
            "private":"私有",
            "partial":"部分可见"
            },
            category:[],
            ruleForm: {
              code:'',
              name: '',
              desc: '',
              category: [],
              provider: '',
              image: '',
              visibility: '',
              visible_org: [],
              is_auto_open:false
            },
            rules: {
              name: [
                {required: true, validator: checkName, trigger: 'blur'},
                {min: 0, max: 32, message: '连接器名称长度在32个字符内', trigger: 'blur'}
              ],
              desc: [
                {required: true, message: '请填写连接器描述', trigger: 'blur'},
                {min: 0, max: 255, message: '连接器描述长度在255个字符内', trigger: 'blur'}
              ],
              category:[
                {required: true, message: '请选择连接器类型', trigger: 'change'}
              ]
            },
          }
      },
      mounted() {
        this.getInfo()
        this.getCategory()

      },
      methods:{
        //根据id获取公司信息
        getCompanyInfo(ids){
          this.$api.app.getUserCompanyNameByid({ids}).then(res => {
            this.company = res.result;
          })
        },
        getCategory() {
          this.$api.connector.getCategories().then(res => {
            this.category = res.data
          })
        },
        getInfo(){
          this.$api.connector.getCategoriesInfo(this.$route.query.id).then(res=>{
            this.ruleForm = res.data;
            if(res.data.visible_org.length){
              this.getCompanyInfo(res.data.visible_org.toString())
            }
            this.$store.state.user.connectorInfo =  JSON.parse(JSON.stringify(this.ruleForm));
          })
        },
        submit() {
          this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
              let params = Object.assign({},this.ruleForm)
              delete params.code
              delete params.provider
              delete params.visibility
              delete params.visible_org
              delete params.status
              delete params.server_url
              delete params.deployment_method
              this.$api.connector.updateCategoriesInfo(params,this.$route.query.id).then(res=>{
                this.$message.success('编辑基本信息成功')
                this.getInfo();
              }).catch((error => {

              }))

            }

          });
        },
      }
    }
</script>

<style scoped lang="scss">
  .demo-ruleForm {
    width: 530px;

    ::v-deep {
      .el-input__inner {
        height: 30px;
        line-height: 30px;
        border-radius: 4px;
      }
    }
  }
  .upload-tip {
    height: 20px;
    color: rgba(187, 187, 187, 1);
    font-size: 12px;
  }
  .menu-container{
    color: rgba(16, 16, 16, 1);
    background-color: #fff;
    padding: 16px 25px;
    height: 100%;
    .title{
      font-weight: bold;
      color: rgba(16, 16, 16, 1);
      font-size: 18px;
      margin-bottom: 30px;
    }
  }
</style>
