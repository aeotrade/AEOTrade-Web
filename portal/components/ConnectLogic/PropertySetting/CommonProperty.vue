<template>
  <el-scrollbar class="protoBox"  v-loading="data.loading" >
    <div>
      <div v-if="props.isGroup=='edge'" style="font-size: 16px;border-bottom: 1px solid rgba(233, 236, 250, 1);height: 49px;line-height: 49px;padding-left: 37px">配置条件</div>
      <div v-else style="font-size: 16px;border-bottom: 1px solid rgba(233, 236, 250, 1);height: 49px;line-height: 49px;padding-left: 37px">配置活动</div>
      <div v-if="props.isGroup=='subProcess'&&props.nodeData.groupData">
        <el-form label-position="top" :model="props.nodeData" label-width="100px"  style="margin-left: 37px;padding-right: 10px">
          <el-form-item label="循环模式"  >
            <el-select v-model="props.nodeData.groupData['isSequential']" placeholder="请选择循环模式" style="width: 100%">
              <el-option value="true" label="串行" key="串行" ></el-option>
              <el-option value="false" label="并行" key="并行" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item  >
             <span slot="label">
                     <span class="span-box">
                       <span>循环变量表达式</span>
                        <el-tooltip style="diaplay:inline" effect="dark" content="表达式编写规范请联系客服获取" placement="top">
                          <i class="el-icon-question" style="color: var(--el-color-primary);" />
                        </el-tooltip>
                     </span>
                   </span>
            <el-input v-model="props.nodeData.groupData.loopCardinality" style="width: 100%"></el-input>
          </el-form-item>

        </el-form>

      </div>
      <div v-else-if="props.isGroup=='edge'&&props.nodeData.edgeProperties">
        <el-form label-position="top" :model="props.nodeData" label-width="100px"  style="margin-left: 37px;padding-right: 10px">

          <el-form-item label="条件名称">
            <el-input v-model="props.nodeData.edgeProperties.text" style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item >
             <span slot="label">
                     <span class="span-box">
                       <span>条件表达式</span>
                        <el-tooltip style="diaplay:inline" effect="dark" content="表达式编写规范请联系客服获取" placement="top">
                          <i class="el-icon-question" style="color: var(--el-color-primary)" />
                        </el-tooltip>
                     </span>
                   </span>
            <el-input v-model="props.nodeData.edgeProperties.conditionExpression" style="width: 100%"></el-input>
          </el-form-item>

        </el-form>

      </div>
      <div v-else>
        <el-form label-position="top" :model="props.nodeData" label-width="100px"  style="margin-left: 37px;padding-right: 10px">
          <el-form-item label="活动ID">
            <el-input v-model="props.nodeData.id" disabled style="width: 100%" ></el-input>
          </el-form-item>
          <el-form-item  label="活动名称">
            <el-input v-model="props.nodeData.name" style="width: 100%" :disabled="!data.isCreator&&!data.isActivityOwner"></el-input>
          </el-form-item>
          <el-form-item  label="活动类型">
            <el-input :value='props.nodeData.type=="receiveTask"?"触发事件":"执行动作"' style="width: 100%" disabled></el-input>
          </el-form-item>

          <el-form-item label="协作角色"  >
            <el-select v-model="props.nodeData.extensionElements.alias_id" placeholder="请选择" :disabled="!data.isCreator"   @change="getOrgChange" >
              <el-option :value="item.aliasId" :label="item.aliasName" :key="item.aliasId" v-for="item in orgAlias" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="data.memberName" label="协作组织">
            <el-input v-model="data.memberName" disabled style="width: 100%"></el-input>
          </el-form-item>
          <el-form-item label="关联连接器"  >
            <el-select filterable  v-model="props.nodeData.extensionElements.member_connector_id" placeholder="请选择" :disabled="!data.isCreator&&!data.isActivityOwner"  @change="getConnectorDetailChange" >
              <el-option :value="item.org_connector_id" :label="item.connector_name" :key="item.org_connector_id" v-for="item in data.LinkMarket"></el-option>
            </el-select>
          </el-form-item>
          <div v-if="(data.isActivityOwner||data.isCreator) && props.nodeData.extensionElements.member_connector_id">
            <el-form-item label="关联的执行动作" v-if="nodeData.type=='sendTask'">
              <el-select filterable  v-model="props.nodeData.extensionElements.event_action_id"   placeholder="请选择"  :disabled="!data.isCreator&&!data.isActivityOwner"    @change="getOtherParams(1)">
                <el-option :value="item.id" :label="item.name" :key="item.id" v-for="item in data.execute_action_list"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关联的触发事件" v-else >
              <el-select filterable  v-model="props.nodeData.extensionElements.event_action_id"   placeholder="请选择" :disabled="!data.isCreator&&!data.isActivityOwner"  @change="getOtherParams(1)">
                <el-option :value="item.id" :label="item.name" :key="item.id" v-for="item in data.trigger_event_list"></el-option>
              </el-select>
            </el-form-item>

          </div>

        </el-form>

        <div style="padding-left: 37px;position: relative" v-if="data.rule.length&& data.isActivityOwner&& props.nodeData.extensionElements.member_connector_id">
          <form-create ref="form"  v-model:api="data.fApi" id="fApi"  :rule="data.rule" :option="data.option" v-model="data.value"></form-create>
          <div v-if="data.addBtnShow" @click="showDialog"  style="width: 80px;height: 28px;position: absolute;    top: 32px;
    left: 237px;text-align: center;line-height:28px;background-color: var(--el-color-primary);color: #fff;border-radius: 5px;font-size: 14px;cursor: pointer">添加账号</div>
        </div>
      </div>

      <el-form label-position="top" v-if="props.type!=='read'" size="small" style="margin-left: 37px;height: 100px;">
        <el-form-item>
          <el-button type="primary" @click="submmit" style="margin-right: 20px;width: 80px;height: 30px;margin-top: 10px">保存</el-button>
        </el-form-item>
      </el-form>
    </div>

   <AddAccountDialog v-if="data.dialogVisible" :dialogVisible="data.dialogVisible" @submit="handleSubmit" @close="dialogClose" :org_connector_id="props.nodeData.extensionElements.member_connector_id"></AddAccountDialog>
  </el-scrollbar>
</template>
<script setup>
import {
  getUserCompanyNameByid,
  getMyConnector,
  openUserOtherParams,
  getMyConnectorDetail,
  getConnectorsAccounts,
  getConnectorDetail, getRemoteParams
} from "~/api/connect";
  const emit = defineEmits(['formChange'])
  const form=ref('')

  const props=defineProps({
    nodeData:  {
      type: Object,
      default: null
    },
    lf: Object || String,
    type:null,
    isGroup:{
      type: String,
      default: "node"
    },
    orgAlias:{
      type:Array,
      default:[]
    },
    organizationId:""
  })
  const data=reactive({
    dialogVisible:false,
    loading:false,
    LinkMarket:[],
    trigger_event_list:[],
    execute_action_list:[],
    option: {
      "form": {
        "labelPosition": "top",
        "size": "mini",
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
    memberName:'',
    isCreator:false,
    isActivityOwner:false,
    addBtnShow:false,
    // hmm01Show:false
  })
  const hmm01Confirm=(val)=>{
    if(data.value.hasOwnProperty('hmm01')){
      data.value.hmm01=val
    }
    console.log( data.value.hmm01)
  }
  const handleSubmit=()=>{
    data.dialogVisible = false
    getOtherParams(1)
  }
  const dialogClose=()=>{
    data.dialogVisible = false
  }
  //打开编辑账号窗口
  const showDialog=()=>{
    data.dialogVisible = true
  }
  const getOrg= async(connector_id)=>{
    if(props.nodeData.extensionElements.alias_id){
      let obj= props.orgAlias.filter((v)=>{return v.aliasId==props.nodeData.extensionElements.alias_id})
      if(obj.length) {
        let res= await  getUserCompanyNameByid({ids:obj[0].collaborationOrgId});
        data.memberName=res.result[0].memberName;
        props.nodeData.extensionElements.member_id=obj[0].collaborationOrgId
          if(props.nodeData.extensionElements.connector_id){
              const res1= await  getMyConnector({connector_id: props.nodeData.extensionElements.connector_id,org_id:obj[0].collaborationOrgId})
              props.nodeData.extensionElements.member_connector_id=res1.data[0]?res1.data[0].org_connector_id:'';
            if(props.nodeData.extensionElements.member_connector_id){
              await getConnectorDetailChange(1)
            }
          }else {
            const res1= await  getMyConnector({connector_id: connector_id,org_id:obj[0].collaborationOrgId})
            props.nodeData.extensionElements.member_connector_id=res1.data[0]?res1.data[0].org_connector_id:'';
            if(props.nodeData.extensionElements.member_connector_id){
              await getConnectorDetailChange(1)
            }
          }


        if(cookies.getItem("memberId")==props.nodeData.extensionElements.member_id){  //是活动拥有方
          data.isActivityOwner=true
        }else {
          data.isActivityOwner=false
        }

      }
    }
  }
  const getOrgChange=async()=>{
    if(props.nodeData.extensionElements.alias_id){
      let obj= props.orgAlias.filter((v)=>{return v.aliasId==props.nodeData.extensionElements.alias_id})
      if(cookies.getItem("memberId")==obj[0].collaborationOrgId){  //是活动拥有方
        data.isActivityOwner=true
      }else {
        data.isActivityOwner=false
      }
      if(obj.length) {
        getUserCompanyNameByid({ids:obj[0].collaborationOrgId}).then( async res=>{
          data.memberName=res.result[0].memberName;
          props.nodeData.extensionElements.member_id=obj[0].collaborationOrgId;
          props.nodeData.extensionElements.member_connector_id=""
          props.nodeData.extensionElements.event_action_id=""
          data.trigger_event_list=[]
          data.execute_action_list=[]
            await getMyConnectorHandle()
            await getConnectorDetailChange()
        })
      }
    }
  }
  const init= async ()=>{
    data.loading=true
    data.value={}
    data.rule=[]
    if(props.organizationId===cookies.getItem("memberId")){  //是创建方
      data.isCreator=true
    }else {
      data.isCreator=false
    }
    if(props.isGroup=="node"){

      if(!props.nodeData.extensionElements.alias_id){
        if(props.orgAlias){
          props.nodeData.extensionElements.alias_id=props.orgAlias[0].aliasId;
          await getOrg()
        }
      }else {
        await  getOrg()
      }
      await getMyConnectorHandle()
      await getConnectorDetailHandle()
      if(props.nodeData.extensionElements.event_action_id){
        getOtherParams()
      }
    }
    data.loading=false
    emit('loadingControl',false)
  }
  const getOtherParams=(Change)=>{
    if(Change){
      data.rule=[]
      data.value={}
    }
    data.addBtnShow=false
    openUserOtherParams({event_action_id:props.nodeData.extensionElements.event_action_id}).then(async res=>{
      if(res.data){
        let dataObj=JSON.parse(res.data);
        for (const item of dataObj) {
          if (item.type=='select'&& item.fetch && item.fetch.url) {
            try {
              let remoteData=await getRemoteData(item.fetch.url,{organization_id:props.organizationId})
              item.options=remoteData
            } catch (error) {
              console.error(`Failed to fetch data for ${item.field}:`, error);
              item.options = [];
            }
          }else if(item.type=='select'&&item.field=='account_id'){
            try {
              let  accounts= await  getConnectorsAccountsHandel()
              item.options=accounts
              data.addBtnShow=true
            } catch (error) {
              console.error(`Failed to fetch data for ${item.field}:`, error);
              item.options = [];
            }
          }
        }
        data.rule=dataObj
        if(!Change){
          let connector_task_para=props.nodeData.extensionElements.connector_task_para
          if(connector_task_para){
            if(connector_task_para=="{}"){
              data.value={}
            }else if(connector_task_para.indexOf('&#34;')>=0){
              let list=JSON.parse(connector_task_para.replaceAll("&#34;",'"'))
              data.value=list
            }else {
              let list=JSON.parse(connector_task_para)
              data.value=list
            }

          }
        }

      }else {
        data.rule=[]
        data.value={}
        data.addBtnShow=false
      }
    })
  }
  const  getConnectorsAccountsHandel=async()=>{ //根据事件id获取自定义json
    let array=[]
    if(props.nodeData.extensionElements.member_connector_id){
      let  res= await  getConnectorsAccounts({org_connector_id:props.nodeData.extensionElements.member_connector_id})
      let options=res.data.account_list;

      options.forEach(item=>{
        array.push({label:item.account_name,value:item.account_id})
      })
    }

    return array
  }
  const  getMyConnectorHandle=async()=>{  //获取所有连接器
    data.loading=true;
    let  LinkMarket= await getMyConnector({org_id:props.nodeData.extensionElements.member_id})
    data.loading=false;
    data.LinkMarket = LinkMarket.data
  }
  const getConnectorDetailChange=async(c_type)=>{
    data.rule=[]
    data.value={}
    let member_connector_id=props.nodeData.extensionElements.member_connector_id
    if(!member_connector_id){
      return
    }
    let  action_list_res= await getMyConnectorDetail(member_connector_id)
      if(c_type !==1){
          props.nodeData.extensionElements.event_action_id=null
      }

    props.nodeData.extensionElements.connector_id=action_list_res.data.connector_id;
    data.trigger_event_list = action_list_res.data.trigger_event_list;
    data.execute_action_list = action_list_res.data.execute_action_list;
  }
  const getConnectorDetailHandle=async ()=>{//获取连接器详情里面的触发事件
    if(!props.nodeData.extensionElements.member_connector_id){
      return
    }
    let  action_list_res= await  getMyConnectorDetail(props.nodeData.extensionElements.member_connector_id)
    data.trigger_event_list = action_list_res.data.trigger_event_list;
    data.execute_action_list = action_list_res.data.execute_action_list;
  }
  const onSubmit=(formData)=>{
    const { id,text } = props.nodeData
    props.lf.setProperties(id, {
      nodeFormData:{ formData,...data.value},
      nodeJSON: data.fApi.toJson(data.rule),
      backgroundColor: text && text.value != '' ? '#fff000':''
    });
  }
  const submmit=()=>{
    if(props.isGroup=="subProcess"){
      emit('formChange',Object.assign({},props.nodeData),"submit")

    }else if(props.isGroup=="edge"){
      emit('formChange',Object.assign({},props.nodeData),"submit")

    }
    else {

      if(!props.nodeData.extensionElements.member_connector_id || !props.nodeData.extensionElements.event_action_id ){
        ElMessage.error('信息未填写完整!')
        return
      }
      if(!data.rule.length|| !data.isActivityOwner){
        emit('formChange',Object.assign({},props.nodeData),"submit")
        return false
      }
      data.fApi.validate( (valid,faill)=>{
        if (valid!==true){
          ElMessage.error('信息未填写完整!')
          return
        }
        if(data.rule.length&&data.isActivityOwner){


          try {
            Object.keys(data.value).forEach(item=>{

              if(!data.value[item]){
                throw ''
              }

            })
          }catch (e) {
            ElMessage.error('信息未填写完整!')
            return;
          }
          if(data.value.range_value){
            let timeArray=data.value.range_value
            let timeArray0=timeArray[0].replaceAll('-','/')
            let timeArray1=timeArray[1].replaceAll('-','/')
            if(new Date(timeArray0).getTime() > Date.now() - 8.64e6){
              ElMessage.error('不能选择大于今天的时间!')
              return;
            }
            if(new Date(timeArray1).getTime() > Date.now() - 8.64e6){
              ElMessage.error('不能选择大于今天的时间!')
              return;
            }
          }
        }
        props.nodeData.extensionElements.connector_task_para=data.value;
        emit('formChange',Object.assign({},props.nodeData),"submit")
      })


    }



  }
  const getRemoteData=async (url,params) =>{
    let res= await getRemoteParams(params,url)
    console.log(res)
    return res.result
  }
defineExpose({
    init
  })
</script>

<style scoped>

  .protoBox{
    position: fixed;
    right: 0;
    top:75px;
    width: 500px;
    height: calc(100% - 100px);
    background-color: #fff;
    box-shadow: 0px 4px 12px 0px rgba(61, 90, 254, .12);
    border: 1px solid rgba(61, 90, 254, 0.1);
  }

</style>
<!--<style>-->
<!--#fApi .el-form-item{-->
<!--    margin-bottom: 0px !important;-->
<!--}-->
<!--</style>-->

