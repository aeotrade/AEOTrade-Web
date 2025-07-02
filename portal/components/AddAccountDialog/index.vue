<script setup>
import {getConnectorsConfig,addAccounts} from '@/api/connect'
const props =  defineProps({
  dialogVisible:{
    type: Boolean,
    default: false
  },
  org_connector_id:{
    type:String,
    default:''
  }
})
const emit = defineEmits(['close','submit'])
const account_name = ref('')
const account_id =ref('')
const isCreat = ref(true)
const settingForm =reactive({
  data:{},
  fApi:{},
  rules:[],
  value:''
})
const option =  {
  "form": {
    "labelPosition": "right",
    "size": "normal",
    "hideRequiredAsterisk": false,
    "showMessage": true,
    "inlineMessage": false
  },
  "submitBtn": false,
  "resetBtn": false
};
const close=()=>{
  settingForm.data = {}
  account_name.value = ''
  account_id.value = ''
  emit('close')
}
const getConfig=()=>{
  // 获取配置信息
  getConnectorsConfig({org_connector_id:props.org_connector_id}).then(res=>{
    if(res.data.config_item_json){
      settingForm.rules = JSON.parse(res.data.config_item_json)
    }
  })
}
const confirm=()=>{
  if( !account_name.value ){
    ElMessage.error('请输入账号名称')
    return
  }
  if (Object.keys(settingForm.rules).length === 0){
    // 无账号配置 直接添加
    addAcc()
    return;
  }
  // 有账号配置 进行校验
  settingForm.fApi.validate( async (valid, fail) => {
    if(valid===true){
      addAcc()
    }else {
      ElMessage.error('请完善信息！')
      return false
    }
  })

}
const addAcc=async()=>{
  if(isCreat.value){
    // 处于新建账号
    let formData = new FormData()
    let account_config_json= JSON.stringify(settingForm.value)
    formData.append('account_config_json',account_config_json)
    formData.append('account_name',account_name.value)
    formData.append('org_connector_id',props.org_connector_id)
    try {
      let {code,msg} = await addAccounts(formData)
      if(code == 0){
        ElMessage.success('添加成功')
        emit('submit')
        return
      }
    }catch (e) {
      close()
    }
  }
  settingForm.resetFields()
  close()
}


onMounted(()=> {
  nextTick(()=>{
    getConfig()
  })
})


</script>

<template>
  <div>
    <el-dialog
        :title="isCreat?'添加账号':'编辑账号'"
        v-model="props.dialogVisible"
        append-to-body
        :close-on-click-modal="false"
        :before-close="close"
        width="600px"
    >
      <el-scrollbar>
        <el-form label-position="right" label-width="125px">
          <el-form-item required  label="账号名称">
            <el-input v-model.trim="account_name" placeholder="请输入账号名称">
            </el-input>
          </el-form-item>
        </el-form>
        <form-create v-if="settingForm.rules" v-model:api="settingForm.fApi" id="fApi"  :rule="settingForm.rules" :option="option" v-model="settingForm.value"></form-create>
      </el-scrollbar>

      <div slot="footer" class="dialog-footer" style="font-size:14px;text-align: right">
        <el-button @click="close" size="small">取 消</el-button>
        <el-button type="primary" @click="confirm" size="small">{{isCreat?'确 定':'保 存'}}</el-button>
      </div>
    </el-dialog>
  </div>

</template>




<style scoped lang="scss">
:deep(.el-scrollbar__wrap){
  overflow-x: hidden;
  max-height: 50vh;
  padding-bottom: 18px;
}
</style>
