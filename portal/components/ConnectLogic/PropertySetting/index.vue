<template>
  <el-drawer
    title="配置活动"
    v-model="dialogVisible"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    :wrapperClosable="false"
    direction="rtl"
    size="500px"
    :before-close="closeDialog">
    <div class="property-panel" ref="propertyPanel" :v-loading="loading" style="display: flex;justify-content: space-between;flex-direction: column;height: 100%">
      <div style="overflow: auto">
        <el-form label-position="top" :model="nodeData" label-width="100px" size="small" style="margin-left: 37px">
          <el-form-item>
            活动ID:  {{nodeData.id}}
          </el-form-item>
          <el-form-item v-if="form.text.value">
            活动名称: {{nodeData.text.value}}
          </el-form-item>
          <el-form-item v-if="nodeData.$type=='sendTask'">
            活动类型: 执行动作
          </el-form-item>
          <el-form-item v-else>
            活动类型: 触发事件
          </el-form-item>

          <el-form-item label="关联连接器"  >
            <el-select v-model="nodeData.extensionElements.member_connector_id" placeholder="请选择"   @change="changeMemberConnector">
              <el-option :value="item.org_connector_id" :label="item.connector_name" :key="item.org_connector_id" v-for="item in LinkMarket"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="关联的执行动作" v-if="form.$type=='bpmn:SendTask'" @change="getOtherParams">
            <el-select v-model="nodeData.extensionElements.event_action_id"   placeholder="请选择"    >
              <el-option :value="item.id" :label="item.name" :key="item.id" v-for="item in execute_action_list"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联的触发事件" v-else >
            <el-select v-model="nodeData.extensionElements.event_action_id"   placeholder="请选择"    @change="getOtherParams">
              <el-option :value="item.id" :label="item.name" :key="item.id" v-for="item in trigger_event_list"></el-option>
            </el-select>
          </el-form-item>
          <div>

          </div>

        </el-form>
        <div style="padding-left: 37px" v-if="rule.length">
          <form-create v-model="fApi" id="fApi"  :rule="rule" :option="option" :value.sync="value"></form-create>
        </div>
      </div>


      <el-form label-position="top" v-if="type!=='read'" label-width="100px" size="small" style="margin-left: 37px;height: 100px;">
        <el-form-item>
          <el-button type="primary" @click="submmit" style="margin-right: 20px;width: 80px;height: 30px">保存</el-button>
          <el-button  @click="cancel" style="width: 80px;height: 30px">取消</el-button>
        </el-form-item>
      </el-form>

    </div>
  </el-drawer>

</template>

<script>
  export default {
    name: "PropertyPanel",
    props: {
      nodeData: {
        type: Object,
        required: true
      },
      dialogVisible: {
        type: Boolean
      },
      type:null
    },


    data() {
      return {
        element: {},
        memberList:[
          {'label':'慧贸天下有限公司',"value":"8888"}
        ],  //协作组织
        LinkMarket:null,
        trigger_event_list:null,
        execute_action_list:null,
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
        loading:false
      };
    },
    created() {
      this.getMyConnector()
    },
    mounted() {
      console.log(this.readOnly)
      this.handleModeler();
      // this.initProperties()
    },
    methods: {
      changeMemberConnector(v){
        this.extensionElements.event_action_id=''
        this.rule=[]
        this.getConnectorDetail()
      },
      getConnectorDetail(){//获取连接器详情里面的触发事件
        if(!this.extensionElements.member_connector_id){
          return
        }
        this.$api.app.getMyConnectorDetail(this.extensionElements.member_connector_id).then(res=>{
          console.log( res.data.trigger_event_list)
          this.trigger_event_list = res.data.trigger_event_list;
          this.execute_action_list = res.data.execute_action_list;
          this.getConnectorsAccounts()

        })
      },
      getConnectorsAccounts(){
        // this.$set(this.rule[0],'options',[])
        if(this.rule.length&&this.rule[0].options){
          this.rule[0].options=[]
        }
        this.$api.app.getConnectorsAccounts({org_connector_id:this.extensionElements.member_connector_id}).then(res=>{

         let options=res.data.account_list;
         let array=[]
          options.forEach(item=>{
            array.push({label:item.account_name,value:item.account_id})
          })
          this.$set(this.rule[0],'options',array)
        })
      },
      getMyConnector(){  //获取连接器
        this.loading=true
        this.$api.app.getMyConnector().then(res=>{
          this.loading=false
          this.LinkMarket = res.data
          this.getConnectorDetail()
          if(this.extensionElements.event_action_id){
            this.getOtherParams()
          }

        })
      },
      getOtherParams(){
        this.rule=[]

        this.$api.app.openUserOtherParams({event_action_id:this.extensionElements.event_action_id}).then(res=>{
          if(res.data){
            this.getConnectorsAccounts()
            let data=JSON.parse(res.data);
            console.log(this.extensionElements.connector_task_para)
            // let str=this.extensionElements.connector_task_para;

            if(this.extensionElements.connector_task_para){
              let list=JSON.parse(this.extensionElements.connector_task_para)
              // data.forEach(item=>{
              //   if(list[item.field]){
              //     item.value=list[item.field]
              //   }
              // })
              this.value=list
            }
            this.rule=data

          }






        })
      },

      submmit(){

        if(!this.extensionElements.member_connector_id || !this.extensionElements.event_action_id ){
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
          this.extensionElements.connector_task_para=this.value;
        }
        this.$emit('formChange',Object.assign({},this.extensionElements))
      },
      cancel(){
        this.$emit('closeDialog',false)
      },
      closeDialog () {
        // this.dialogVisible = false;
        this.$emit('closeDialog',false)
      },
      handleModeler() {


      },
      // 属性面板名称，更新回流程节点
      nameChange(name) {
        const modeling = this.modeler.get("modeling");
        modeling.updateLabel(this.element, name);
      },
      // 属性面板颜色，更新回流程节点
      colorChange(color) {
        const modeling = this.modeler.get("modeling");
        modeling.setColor(this.element, {
          fill: null,
          stroke: color
        });
        modeling.updateProperties(this.element, { color: color });
      },
      // 任务节点配置人员
      addUser(properties) {
        this.updateProperties(
          Object.assign(properties, {
            userType: Object.keys(properties)[0]
          })
        );
      },
      // 切换人员类型
      typeChange() {
        const types = ["assignee", "candidateUsers", "candidateGroups"];
        types.forEach(type => {
          delete this.element.businessObject.$attrs[type];
          delete this.form[type];
        });
      },
      // 在这里我们封装一个通用的更新节点属性的方法
      updateProperties(properties) {
        const modeling = this.modeler.get("modeling");
        modeling.updateProperties(this.element, properties);
      }
    }
  };
</script>

<style lang="scss" scoped>

  /*.property-panel {*/
  /*  position: absolute;*/
  /*  right: 0px;*/
  /*  top: 100px;*/
  /*  border-left: 1px solid #cccccc;*/
  /*  padding: 20px 0;*/
  /*  width: 300px;*/
  /*  height: 100%;*/
  /*}*/
  :deep() {
    .el-form-item__label{
      padding-bottom:0px ;
    }
  }
</style>
<style lang="scss">
  #fApi{
    .el-button{
      display: none;
    }
    .el-input__suffix{
      right: 18px !important;
    }
  }


</style>
