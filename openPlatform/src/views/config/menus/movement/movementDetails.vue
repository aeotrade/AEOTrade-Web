<template>
  <div class="menu-container">
    <div class="title" v-if="!isConfig">
      <span @click="$router.go(-1)">
        <i class="el-icon-arrow-left"></i>返回
      </span>
      / {{isDisabled?'编辑执行动作':'添加执行动作'}}
    </div>
    <div class="title" v-else>
      <span @click="isConfig = false">
        <i class="el-icon-arrow-left"></i>返回
      </span>
      / {{isDisabled?'编辑执行动作':'添加执行动作'}} / 配置
    </div>
    <el-form v-if="!isConfig" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="名称：" prop="name">
        <el-input v-model.trim="ruleForm.name" placeholder="请输入执行动作名称"></el-input>
      </el-form-item>
      <el-form-item label="描述：" prop="desc">
        <el-input :rows="4" type="textarea" placeholder="请输入执行动作描述" v-model.trim="ruleForm.desc"></el-input>
      </el-form-item>
      <el-form-item label="编码：" prop="code">
        <el-input :disabled="isDisabled" v-model.trim="ruleForm.code" placeholder="编码为执行动作的唯一标识，支持大小写英文、下划线"></el-input>
      </el-form-item>
      <el-form-item label="数据模型：" prop="data_model">
        <el-select filterable v-model="ruleForm.data_model" style="width: 400px;">
          <el-option :label="item.model_name" :value="item.model_id" v-for="(item,i) in models" :key="i"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="配置参数：" prop="params">
        <div style="display: flex;align-items: center;margin: 0 0 10px 0;">
          <el-button size="small" type="primary" style="width: 80px;" @click="setConfig">配置</el-button>
          <el-popover
            placement="top-start"
            width="600"
            trigger="hover"
            content="通过字段编辑器，可以设置多种类型的字段展现在前端，用户可以在前端添加字段内容。">
            <i slot="reference" class="el-icon-question"
               style="font-size: 24px;margin:7px 0 0 10px;vertical-align: -3px;"></i>
          </el-popover>
        </div>
        <el-input :rows="4" type="textarea" placeholder="" v-model="ruleForm.params"></el-input>
        <div class="tip">涉及复杂的参数配置，如参数联动、动态参数等请联系工作人员进行配置，联系方式：010-86398171</div>
      </el-form-item>
      <el-form-item>
        <div style="text-align: right;margin-top: 170px">
          <el-button  @click="$router.go(-1)" size="small" style="width: 80px;height: 30px;line-height: 10px;">取消
          </el-button>
          <el-button type="primary" @click="submit" size="small"
                     style="width: 80px;height: 30px;line-height: 10px;">保存
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <div style="height: 93%;padding-top:30px;" v-else>
      <div style="display: flex;justify-content: space-between;margin-bottom: 20px">
        <div></div>
        <div>
          <el-button @click="show = true" size="small"
                     style="margin-right: 8px;width: 80px;padding: 9px 10px;color:var(--aeo-primary-color);border-color: var(--aeo-primary-color)">导入JSON
          </el-button>
          <el-button type="primary" size="small" style="width: 80px;" @click="save">保存</el-button>
        </div>

      </div>
      <fc-designer
        ref="designer"
        :config="config"
        :menu="menu"
      />
      <codemirror v-if="show" @importJson="importJson"></codemirror>
    </div>

  </div>
</template>

<script>
  import codemirror from '@/components/Codemirror'
  import input from "@form-create/designer/src/config/rule/input";
  import radio from "@form-create/designer/src/config/rule/radio";
  import checkbox from "@form-create/designer/src/config/rule/checkbox";
  import date from "@form-create/designer/src/config/rule/date";
  import button from "@form-create/designer/src/config/rule/button";
  import span from "@form-create/designer/src/config/rule/span";
  import divider from "@form-create/designer/src/config/rule/divider";
  import chooseAccount from '@/components/Formdesigner/input'


  export default {
    name: "movementDetails",
    components: {
      codemirror
    },
    data() {
      return {
        menu: [
          {
            name: 'main',
            title: '组件',
            list: [
              chooseAccount, radio, checkbox, date, span
            ]
          },
          {
            name: 'aide',
            title: '辅助组件',
            list: [
              button, divider
            ]
          },
        ],
        show: false,
        isConfig: false,
        ruleForm: {
          name: '',
          desc: '',
          code: '',
          data_model: '',
          params: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入执行动作名称', trigger: 'blur'},
            {min: 0, max: 32, message: '执行动作名称在32个字符内', trigger: 'blur'}
          ],
          desc: [
            {required: true, message: '请输入执行动作描述', trigger: 'blur'},
            {min: 0, max: 255, message: '执行动作描述长度在255个字符内', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '请输入执行动作编码', trigger: 'blur'},
            {min: 0, max: 50, message: '执行动作编码长度在50个字符内', trigger: 'blur'}
          ],
          data_model: [
            {required: true, message: '请选择对应数据模型', trigger: 'change'}
          ]
        },
        config: {
          showFormConfig: false,//表单配置
        },
        models: []
      }
    },
    computed:{
      isDisabled(){
        return this.$route.query.ids;
      }
    },
    mounted() {
      this.getModels()
      if(this.$route.query.ids){
        this.getInfo()
      }
    },
    methods: {
      getInfo(){
        this.$api.connector.infoAction(this.$route.query.id,this.$route.query.ids).then(res=>{
          this.ruleForm = res.data
        })
      },
      getModels() {
        this.$api.app.getModels({pagesize: 999999, currpage: 1}).then(res => {
          this.models = res.data.records
        })
      },
      setConfig() {
        this.isConfig = true;
        this.$nextTick(() => {
          if (this.ruleForm.params) {
            this.$refs.designer.setRule(this.ruleForm.params)
          }
          this.$refs.designer.addComponent(chooseAccount);
        })

      },
      save() {
        this.ruleForm.params = this.$refs.designer.getJson();
        this.isConfig = false;
      },
      submit() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (this.$route.query.ids) {
              let params = Object.assign({},this.ruleForm)
              delete params.create_time
              this.$api.connector.editAction(this.$route.query.id, this.$route.query.ids,params).then(res => {
                if (res.code == 0) {
                  this.$message.success('编辑执行动作成功')
                  this.$router.go(-1)
                }
              })
            } else {
              this.$api.connector.creatAction(this.$route.query.id, this.ruleForm).then(res => {
                if (res.code == 0) {
                  if(this.$store.state.user.connectorInfo.status === '未发布'){
                    this.$message.success('创建执行动作成功')
                  }else if(this.$store.state.user.connectorInfo.status === '已发布') {
                    this.$message({
                      dangerouslyUseHTMLString: true,
                      message: '重新发布连接器后配置生效 <span style="cursor: pointer" class="publish">发布连接器</span>',
                      type: 'success'
                    });
                    let target = document.getElementsByClassName('publish')[0]
                    target.onclick = ()=>{
                      this.$router.push({path:'/config/version',query:{id:$route.query.id}})
                    }
                  }
                  this.$router.go(-1)
                }
              })
            }


          }

        });
      },
      importJson(rule) {
        this.$refs.designer.setRule(rule)
        this.show = false
      }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep {
    .el-popover--plain {
      padding: 6px 20px !important;
    }

    ._fc-r ._fc-r-tab.active {
      color: var(--aeo-primary-color);
      border-color: var(--aeo-primary-color);
    }
  }

  .tip {
    margin-top: 10px;
    line-height: 18px;
    color: rgba(102, 102, 102, 1);
    font-size: 12px;
  }

  .menu-container {
    color: rgba(16, 16, 16, 1);
    background-color: #fff;
    padding: 16px 25px;
    height: 100%;

    .title {
      color: rgba(16, 16, 16, 1);
      font-size: 18px;

      span {
        cursor: pointer;
        font-weight: bold;
      }

      i {
        font-weight: bold;
      }
    }
  }

  .demo-ruleForm {
    width: 500px;
    margin-top: 26px;

    ::v-deep {
      .el-input__inner {
        height: 30px;
        line-height: 30px;
        border-radius: 4px;
      }
    }
  }
</style>
