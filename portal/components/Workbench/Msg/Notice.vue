<script setup>
  import {getMsgDetailApi,handleReadApi} from "@/api/api"
  import {cookies} from "../../../composables";
  const emit = defineEmits(['refresh'])
  const props = defineProps({
    visible: Boolean,
    list:Array
  })
// 公告提示组件（工作台右下角）

// 公告列表
const noticeList = ref([])
const currentNotice = ref(null)
const msgDetails = ref({})
let intervalId = null

// 获取公告信息
const getNotice = () => {
  noticeList.value = Array.from(props.list)
  currentNotice.value = noticeList.value.shift()
}

const closeNotice = async() => {
  handleReadApi({memberId: currentNotice.value.mamberId,staffId: cookies.getItem('staffId'),msgMessageId:currentNotice.value.messageId}).then(res=>{
    currentNotice.value = null
    emit('refresh')
  })
}

  const look = (msg)=>{
    const id = msg.messageId
    getMsgDetailApi({id}).then(res=>{
      handleReadApi({memberId: msg.mamberId,staffId: cookies.getItem('staffId'),msgMessageId:id}).then(res=>{
        emit('refresh')
      })
      if(res.result.detailsType == 1){
        dialogVisible.value = true;
        msgDetails.value = res.result
      }else if(res.result.detailsType == 2){
        window.open(res.result.messageDetails)
      }

    })
  }
  watch(()=>props.list, () => {
    getNotice()
  });
onMounted(() => {
  getNotice()
})
onBeforeUnmount(() => {
  intervalId && clearInterval(intervalId);
})

const dialogVisible = ref(false)

</script>

<template>
  <Transition name="slide-fade">
    <div v-if="currentNotice" class="notice-box pd-15">
      <div class="title-wrap">
        <div style="font-size: 16px">消息</div>
        <el-icon class="close-icon" @click="closeNotice"><Close /></el-icon>
      </div>
      <img style="width: 350px;height: 120px;object-fit: cover;" :src="currentNotice.popCover"/>
      <div style="font-weight: bold;font-size: 16px;margin: 10px 0 ">{{currentNotice.messageTitle}}</div>
      <div class="content-wrap">{{currentNotice.messageContent}}</div>
      <div style="padding: 0 15px;margin: 10px 0">
        <el-divider style="margin: 0;--el-border-color: #f0f0f0"/>
      </div>
      <div class="foot-wrap" v-if="currentNotice.detailsType != 3">
        <span @click="look(currentNotice)">{{currentNotice.detailButton}}</span>
        <span @click="look(currentNotice)"> > </span>
      </div>
    </div>
  </Transition>

  <workbench-msg-dialog v-model:visible="dialogVisible" :msgDetails="msgDetails"></workbench-msg-dialog>
</template>

<style lang="scss" scoped>
$marginBottom: 10px;
.notice-box{
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 390px;
  //max-height: 300px;
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: 0 2px 6px 0px rgba(var(--el-color-primary-rgb), 0.15);
}
.pd-15{
  padding: 15px;
}
.title-wrap{
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  //margin-bottom: $marginBottom;
}
.close-icon{
  cursor: pointer;
  font-size: 16px;
  &:hover{
    color: var(--el-color-primary);
  }
}
.content-wrap{

}
.foot-wrap{
  display: flex;
  justify-content: space-between;
  margin-bottom: $marginBottom;
  cursor: pointer;
  color: var(--el-color-primary);
}

//过渡效果
.slide-fade-enter-active {
  transition: all 0.2s ease-in;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
