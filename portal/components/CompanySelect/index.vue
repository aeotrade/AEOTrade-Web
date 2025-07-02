<!-- @author zhengjie -->
 <script setup>
      
       import {getUserCompany } from '@/api/connect' 
       const emits = defineEmits(['selected'])
       const name = ref('')
       const  iconList=  reactive({data:[]})
       const timer = ref(null)
       const   handleClear=()=>{
        iconList.data = []
      }
      const  clear=()=>{
        name.value = ''
        iconList.data = []
      }
      const getComName=()=>{
        debounce(() => {
          if (name.value.length >= 2 ){
            getUserCompany({uscc:name.value}).then(res=>{
              iconList.data = res.result
            })
          }
        }, 1000)
  
      }
      const  debounce =(fn, time)=>{
        if(timer.value){
          clearTimeout(timer.value)
        }
        timer.value = setTimeout(() => {
          timer.value = null;
          fn()
        }, time)
      }
      const filterIcons=()=> {
        if (name.value) {
          iconList.data = iconList.data.filter(item => item.includes(name.value))
        } else {
          iconList.data = []
        }
      }
      const selectedIcon=(item)=> {
        emits('selected', {memberName:item.memberName,id:item.id})
        document.body.click()
      }
      const reset=()=> {
        name.value = ''
        iconList.data = []
      }
    
  </script>
  
  <template>
    <div class="icon-body">
      <el-input v-model.trim="name" style="position: relative;" clearable @input="getComName" placeholder="请输入组织名称关键字或统一社会信用代码" @clear="handleClear">
        <template #prefix>
        <el-icon class="el-input__icon"> 
         <search /> 
        </el-icon>
        </template>
      </el-input>
      <div class="icon-list" v-if="iconList.data.length">
        <div v-for="(item, index) in iconList.data" :key="index" @click="selectedIcon(item)">
          {{ item.memberName }}
        </div>
      </div>
      <div v-else style="height: 50px;text-align: center;color: #ccc;line-height: 50px;">暂无匹配数据</div>
    </div>
  </template>

  <style rel="stylesheet/scss" lang="scss" scoped>
    .icon-body {
      width: 100%;
      padding: 10px 0px;
      .icon-list {
        height: 100px;
        overflow-y: auto;
        div {
          height: 30px;
          line-height: 30px;
          margin-bottom: -5px;
          padding-left: 20px;
          cursor: pointer;
          &:hover{
            background-color: #F5F7FA;
            color: var(--el-color-primary);
          }
        }
      }
    }
  </style>
  