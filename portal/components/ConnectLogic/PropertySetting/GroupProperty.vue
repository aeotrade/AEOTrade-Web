<template>
  <div style="padding-top: 50px" v-loading="loading">
    <el-form label-position="top" :model="nodeData" label-width="100px" size="small" style="margin-left: 37px;padding-right: 10px">
      <el-form-item label="循环模式"  >
        <el-select v-model="nodeData.type" placeholder="请选择" style="width: 100%">
          <el-option value="receiveTask" label="触发事件" key="receiveTask" ></el-option>
          <el-option value="sendTask" label="执行动作" key="sendTask" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="循环变量">
        <el-input v-model="nodeData.id" style="width: 100%"></el-input>
      </el-form-item>

    </el-form>

    <el-form label-position="top" v-if="type!=='read'" label-width="100px" size="small" style="margin-left: 37px;height: 100px;">
      <el-form-item>
        <el-button type="primary" @click="submmit" style="margin-right: 20px;width: 80px;height: 30px">保存</el-button>
        <el-button  @click="cancel" style="width: 80px;height: 30px">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
export default {
  name: '',

  props: {
    nodeData: Object,
    lf: Object || String,
    type:null
  },
  mounted() {

  },

  created() {
    console.log(this.nodeData)
    this.init()

  },
  data () {
    return {
      loading:false,
      LinkMarket:[],
      trigger_event_list:[],
      execute_action_list:[],
      option: {
        "form": {
          "labelPosition": "left",
          "size": "mini",
          "labelWidth": "100px",
          "hideRequiredAsterisk": false,
          "showMessage": true,
          "inlineMessage": false
        },
        "submitBtn": false,
        "resetBtn": false
      },
      rule:[],
      fApi: {},
      value: {},
    }
  },
  methods: {
    async init(){
      this.loading=true

      this.loading=false
    },
    async getOtherParams(){
      this.rule=[]
      this.$api.app.openUserOtherParams({event_action_id:this.nodeData.extensionElements.event_action_id}).then(res=>{
        if(res.data){
           this.getConnectorsAccounts()
          let data=JSON.parse(res.data);
          let connector_task_para=this.nodeData.extensionElements.connector_task_para
          if(connector_task_para){
            if(connector_task_para=={}){
              this.value={}
            }else if(connector_task_para.indexOf('&#34;')>=0){

              let list=JSON.parse(connector_task_para.replaceAll("&#34;",'"'))

              this.value=list
            }else {
              let list=JSON.parse(connector_task_para)

              this.value=list
            }

          }
          this.rule=data
        }
      })
    },
    async getConnectorsAccounts(){ //根据事件id获取自定义json
      if(this.rule.length&&this.rule[0].options){
        this.rule[0].options=[]
      }
      let  res=await this.$api.app.getConnectorsAccounts({org_connector_id:this.nodeData.extensionElements.member_connector_id}).then()
      let options=res.data.account_list;
      let array=[]
      options.forEach(item=>{
        array.push({label:item.account_name,value:item.account_id})
      })
      if(this.rule[0]){
        this.$set(this.rule[0],'options',array)
      }
    },
    async getMyConnector(){  //获取所有连接器
       this.loading=true;
       let  LinkMarket=await this.$api.app.getMyConnector()
      this.LinkMarket = LinkMarket.data
    },
    async getConnectorDetail(){//获取连接器详情里面的触发事件
      if(!this.nodeData.extensionElements.member_connector_id){
        return
      }
      let  action_list_res= await  this.$api.app.getMyConnectorDetail(this.nodeData.extensionElements.member_connector_id)
      this.trigger_event_list = action_list_res.data.trigger_event_list;
      this.execute_action_list = action_list_res.data.execute_action_list;
    },
    onSubmit(formData){
      const { id,text } = this.$props.nodeData
      this.$props.lf.setProperties(id, {
        nodeFormData:{ formData,...this.$data.value},
        nodeJSON: this.fApi.toJson(this.rule),
        backgroundColor: text && text.value != '' ? '#fff000':''
      });
      this.$emit('onClose')
    },
    submmit(){

      if(!this.nodeData.extensionElements.member_connector_id || !this.nodeData.extensionElements.event_action_id ){
        this.$message.error('信息不完整')
        return
      }
      if(this.rule.length){
        try {
          Object.keys(this.value).forEach(item=>{

            if(!this.value[item]){
              throw ''
            }

          })
        }catch (e) {
          this.$message.error('信息未填写完整！')
          return;
        }
        if(this.value.range_value){
          let timeArray=this.value.range_value
          let timeArray0=timeArray[0].replaceAll('-','/')
          let timeArray1=timeArray[1].replaceAll('-','/')
          if(new Date(timeArray0).getTime() > Date.now() - 8.64e6){
            this.$message.error('不能选择大于今天的时间')
            return;
          }
          if(new Date(timeArray1).getTime() > Date.now() - 8.64e6){
            this.$message.error('不能选择大于今天的时间')
            return;
          }
        }

      }

      if(this.rule.length){
        this.nodeData.extensionElements.connector_task_para=this.value;
      }

      this.$emit('formChange',Object.assign({},this.nodeData))
    },
    cancel(){
      this.$emit('closeDialog',false)
    },
  }
}
</script>
<style scoped>
  :deep(.el-input__inner){
    width: 100% !important;
  }
  :deep(.el-input--small){
    width: 100% !important;
  }
</style>
