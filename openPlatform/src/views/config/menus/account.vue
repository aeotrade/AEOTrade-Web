<template>
  <div class="menu-container">
    <div class="title">账号配置</div>
    <div class="set-list">
      <el-radio-group v-model="radio">
        <div :class="{'set-item':true,'active':radio === setList[i].id,'disabled':!item.is_available}" v-for="(item,i) in setList" :key="i" @click="change(item)">
          <div class="set-title">
            <span><el-radio :label="item.id" :disabled="!item.is_available">{{item.name}}</el-radio></span>
            <div class="set-tip">
              适用场景：{{item.desc}}
            </div>
          </div>
          <el-button size="small" :disabled="!item.is_available" @click.stop="set(item)">字段配置</el-button>
        </div>
      </el-radio-group>
    </div>
    <el-drawer
      :size="info.code=='DIY'?1433:773"
      append-to-body
      :wrapperClosable="false"
      :visible.sync="drawer">
      <div class="drawer-head" slot="title">
        <div class="drawer-title">{{info.name}}</div>
        <div class="drawer-info">{{info.desc}}</div>
      </div>
      <div style="display: flex;justify-content: space-between;margin-bottom: 20px">
        <div></div>
        <div>
          <el-button v-if="info.code=='DIY'" size="small" style="margin-right: 8px;width: 80px;padding: 9px 10px;color:var(--aeo-primary-color);border-color: var(--aeo-primary-color)" @click="show = true">导入JSON</el-button>
          <el-button v-if="info.code!=='DXP'" type="primary" size="small" style="margin-right: 30px;width: 80px;" @click="save">保存</el-button>
        </div>

      </div>


      <fc-designer
        v-if="info.code=='DIY'"
        style="height: 92%;"
        ref="designer"
        :config="config"
        :menu="menu"
      />
      <div v-else-if="info.code == 'DXP'" if="false" style="display: flex;height: 92%;">
        <div class="sp-preview">
          <div style="font-size: 14px;font-weight: bold;margin-bottom: 30px;">预览</div>
          <div class="preview-item">
            <div class="title">电子口岸DXPID</div>
            <el-input class="readonly"
                      readonly placeholder="请输入在电子口岸数据交换平台申请通过后分配的数据交换用户ID"></el-input>
          </div>
          <div class="preview-item">
            <div class="title">接收队列信息</div>
            <el-form label-width="124px" label-position="left">
              <el-form-item label="传输方式" required>
                  <el-radio class="readonly" v-model="radio2" label="IBMMQ"></el-radio>
                  <el-radio class="readonly" label="RabbitMQ"></el-radio>
              </el-form-item>
              <el-form-item label="接收队列名称：">
                <el-input class="readonly"
                          readonly placeholder="请输入接收队列名称"></el-input>
              </el-form-item>
              <el-form-item label="服务器地址：">
                <el-input class="readonly"
                          readonly placeholder="请输入服务器地址"></el-input>
              </el-form-item>
              <el-form-item label="监听端口：">
                <el-input class="readonly"
                          readonly placeholder="请输入监听端口"></el-input>
              </el-form-item>
              <el-form-item label="队列管理器名称：">
                <el-input class="readonly"
                          readonly placeholder="请输入队列管理器名称"></el-input>
              </el-form-item>
              <el-form-item label="连接通道名称：">
                <el-input class="readonly"
                          readonly placeholder="请输入连接通道名称"></el-input>
              </el-form-item>
              <el-form-item label="接收队列用户名：">
                <el-input class="readonly"
                          readonly placeholder="请输入接收队列用户名"></el-input>
              </el-form-item>
              <el-form-item label="接收队列密码：">
                <el-input class="readonly"
                          readonly placeholder="请输入接收队列密码"></el-input>
              </el-form-item>
              <el-form-item label="备注信息：">
                <el-input class="readonly"
                          readonly placeholder="请输入备注信息"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="preview-item">
            <div class="title">发送队列信息</div>
            <el-form label-width="124px" label-position="left">
              <el-form-item label="传输方式" required>
                  <el-radio class="readonly" v-model="radio2" label="IBMMQ"></el-radio>
                  <el-radio class="readonly" label="RabbitMQ"></el-radio>
              </el-form-item>
              <el-form-item label="发送队列名称：">
                <el-input class="readonly"
                          readonly placeholder="请输入发送队列名称"></el-input>
              </el-form-item>
              <el-form-item label="服务器地址：">
                <el-input class="readonly"
                          readonly placeholder="请输入服务器地址"></el-input>
              </el-form-item>
              <el-form-item label="监听端口：">
                <el-input class="readonly"
                          readonly placeholder="请输入监听端口"></el-input>
              </el-form-item>
              <el-form-item label="队列管理器名称：">
                <el-input class="readonly"
                          readonly placeholder="请输入队列管理器名称"></el-input>
              </el-form-item>
              <el-form-item label="连接通道名称：">
                <el-input class="readonly"
                          readonly placeholder="请输入连接通道名称"></el-input>
              </el-form-item>
              <el-form-item label="发送队列用户名：">
                <el-input class="readonly"
                          readonly placeholder="请输入发送队列用户名"></el-input>
              </el-form-item>
              <el-form-item label="发送队列密码：">
                <el-input class="readonly"
                          readonly placeholder="请输入发送队列密码"></el-input>
              </el-form-item>
              <el-form-item label="备注信息：">
                <el-input class="readonly"
                          readonly placeholder="请输入备注信息"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="config" style="width: 100%;text-align: center;">
          <img src="@/assets/connector/dxp.svg" width="260px;" style="margin-top: 150px">
          <div style="line-height: 22px;font-weight: bold;margin-top: 20px">
            当前字段配置复杂，不支持字段配置，<br>
            可联系工作人员进行复杂字段配置，<br>
            联系方式：010-86398171
          </div>
        </div>
      </div>
      <div v-else style="display: flex;height: 92%;">
        <div class="preview">
          <div style="font-size: 14px;font-weight: bold;margin-bottom: 30px;">预览</div>
          <div class="preview-item" v-for="(item,i) in rule" :key="i">
            <div class="title">{{item.title}}</div>
            <el-input
              class="readonly"
              readonly
              :type="item.props.type?item.props.type:'text'"
              :disabled="item.props.disabled !== undefined && item.props.disabled === true"
              :placeholder="item.props.placeholder"
            >
            </el-input>
          </div>
        </div>
        <div class="config">
          <div style="font-size: 14px;font-weight: bold;margin-bottom: 30px;">配置</div>
          <div class="config-item" v-for="(item,i) in rule" :key="i" v-if="item.title !== 'Token'">
            <div class="config-title">
              {{item.title}}
            </div>
            <div class="config-content">
              <span>字段名称：</span>
              <el-input v-model="item.title"></el-input>
            </div>
            <div class="config-content">
              <span>字段ID：</span>
              <el-input v-model="item.field"></el-input>
            </div>
            <div class="config-content">
              <span>是否必填：</span>
              <el-radio-group v-model="item.$required">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
    <codemirror v-if="show" @importJson="importJson"></codemirror>
  </div>
</template>

<script>
  import codemirror from '@/components/Codemirror'
  import radio from "@form-create/designer/src/config/rule/radio";
  import checkbox from "@form-create/designer/src/config/rule/checkbox";
  import date from "@form-create/designer/src/config/rule/date";
  import span from "@form-create/designer/src/config/rule/span";
  import button from "@form-create/designer/src/config/rule/button";
  import divider from "@form-create/designer/src/config/rule/divider";
  import input from "@form-create/designer/src/config/rule/input";
  export default {
    name: "account",
    components: {
      codemirror
    },
    data(){
      return{
        radio2:'IBMMQ',
        show:false,
        config:{
          showFormConfig:false
        },
        menu:[
          {
            name: 'main',
            title: '组件',
            list: [
              input,radio,checkbox,date,span
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
        rule:[],
        setList:[],
        radio:'',
        drawer:false,
        info:{},
        tempId:''
      }
    },
    mounted() {
      this.getList();
    },
    methods:{
      importJson(rule) {
        this.$refs.designer.setRule(rule)
        this.show = false
      },
      getList(){
        this.$api.connector.getAccount(this.$route.query.id).then(res=>{
          this.setList = res.data
          this.setList.forEach(item=>{
            if(item.is_checked){
              this.radio = item.id;
            }
          })
        })
      },
      onSubmit(){

      },
      save(){
        let config_json = this.$refs.designer?this.$refs.designer.getJson():JSON.stringify(this.rule)
        this.$api.connector.saveAccountInfo(this.$route.query.id,this.tempId,{config_json}).then(res=>{
          this.drawer = false;
          this.$message.success('账号配置成功')
          this.getList()
        })
      },
      set(item){
        this.tempId = item.id;
        this.$api.connector.getAccountInfo(this.$route.query.id,item.id).then(res=>{
          this.info = res.data;
          this.drawer = true;
          this.rule = JSON.parse(this.info.config_json)
          if(this.info.code == 'DIY'){
            this.$nextTick(()=>{
              this.$refs.designer.setRule(this.rule)
            })
          }
        })


      },
      change(item){
        if(!item.is_available){
          return;
        }
        this.$api.connector.changeAccount(this.$route.query.id,item.id).then(res=>{
          this.getList();
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  ::v-deep{
    .readonly{
      cursor: auto;
      .el-input__inner,.el-radio__inner,.el-radio__input{
        border-color: #dcdfe6!important;
        cursor: auto;
      }
    }
    .el-main{
      padding: 0!important;
    }
    .el-aside._fc-l,._fc-m-tools{
    }
    .el-form-item{
      margin-bottom: 2px;
    }
    ._fc-r ._fc-r-tab.active{
      color: var(--aeo-primary-color);
      border-color: var(--aeo-primary-color);
    }
    .set-list{
      .el-radio-group{
        width: 100%;
      }
      .el-radio__label{
        color: rgba(16, 16, 16, 1)!important;
        font-size: 16px;
        font-weight: bold;
      }
    }

  }
  .sp-preview{
    flex-shrink: 0;
    height: 100%;
    width: 400px;
    padding: 0 20px 0 26px;
    border-right: 1px solid #E4E4E4;
    .preview-item{
      margin-bottom: 8px;
      .title{
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
        margin-bottom: 5px;
        font-weight: bold;
      }
      ::v-deep{
        .el-input__inner{
          height: 35px;
        }
      }
    }
  }
  .preview{
    height: 100%;
    width: 350px;
    padding: 0 0 0 26px;
    border-right: 1px solid #E4E4E4;
    .preview-item{
      margin-bottom: 17px;
      .title{
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
        margin-bottom: 10px;
        font-weight: bold;
      }
      ::v-deep{
        .el-input__inner{
          width: 260px;
          height: 40px;
        }
      }
    }

  }
  .config{
    color: rgba(16, 16, 16, 1);
    font-size: 14px;
    padding: 0 0 0 16px;
    .config-item{
      margin-bottom: 20px;
      border-bottom: 1px solid #bbb;
      &:last-child{
        border-bottom: none;
      }
      .config-title{
        margin-bottom: 10px;
        font-weight: bold;
      }
      .config-content{
        display: flex;
        align-items: center;
        padding-left: 20px;
        margin-bottom: 17px;
        span{
          flex-shrink: 0;
          width: 75px;
        }
        ::v-deep{
          .el-input__inner{
            width: 260px;
            height: 40px;
          }
        }
      }
    }

  }
  .drawer-head{
    color: rgba(16, 16, 16, 1);

    .drawer-title{
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 6px;
    }
    .drawer-info{
      font-weight: 14px;
    }
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
    }
  }
  .set-list{
    margin-top: 40px;
    .set-item{
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 90px;
      padding:0 20px 0 28px;
      border-radius: 4px;
      border: 1px solid #BBBBBB;
      margin-bottom: 20px;
      cursor: pointer;
      &:hover{
        border-color: var(--aeo-primary-color);
      }
      &.active{
        border-color: var(--aeo-primary-color);
      }
      &.disabled{
        cursor: not-allowed;
        background-color: #F4F4F5;
        color: #CDCDCD!important;
        ::v-deep{
          .el-radio__label{
            color: #CDCDCD!important;
          }
        }
        &:hover{
          border-color: #BBBBBB;
        }
      }
      .set-title{
        display: flex;
        flex-direction: column;
        justify-content: center;
        span{
          margin-bottom: 10px;
        }
        .set-tip{
          font-size: 14px;
        }
      }

    }
  }
</style>
