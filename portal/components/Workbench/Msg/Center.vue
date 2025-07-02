<template>
  <div class="sysDialog" v-if="props.visible" @click="(e) => { e.stopPropagation(); }" ref="box">
    <div class="title pad-15">
      <span>消息中心</span>
        <el-dropdown trigger="click" @command="handleList">
        <span style="cursor: pointer">
          <div style="display:flex;align-items: center;">
            <span>{{!msgType?'全部':msgType==0?'未读':'已读'}}</span>
          <el-icon><Filter /></el-icon>
          </div>
        </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="(e) => {e.stopPropagation();}" command="">
                <div :class="{'dropitem': true, active: msgType === ''}">全部
                  <el-icon class="dropitem-icon" v-if="msgType === ''"><Select /></el-icon>
                  <span class="dropitem-icon" v-else></span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item @click="(e) => {e.stopPropagation();}" command="0">
                <div :class="{'dropitem': true, active: msgType === '0'}">未读
                  <el-icon class="dropitem-icon" v-if="msgType === '0'"><Select /></el-icon>
                  <span class="dropitem-icon" v-else></span>
                </div>
              </el-dropdown-item>
              <el-dropdown-item @click="(e) => {e.stopPropagation();}" command="1">
                <div :class="{'dropitem': true, active: msgType === '1'}">已读
                  <el-icon class="dropitem-icon" v-if="msgType === '1'"><Select /></el-icon>
                  <span class="dropitem-icon" v-else></span>
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
    </div>
    <el-divider style="margin: 0;--el-border-color: #f0f0f0"/>
      <div v-if="showList.length" v-infinite-scroll="loadMore" style="height: 500px;padding: 20px 0;overflow: auto">
        <div class="msg-item" v-for="(msg, i) in showList"  @click="lookBefore(msg)">
          <div class="title-wrap mb-10" style="position: relative;">
            <span class="red-point" v-if="!msg.readMark"></span>
            <div class="title" :title="msg.messageTitle.length > 18 ? msg.messageTitle : ''" style="flex: 1;">
              {{msg.messageTitle}}
            </div>
            <div class="date">{{getMsgDate(msg.sendTime)}}</div>
          </div>
          <div class="content mb-10" style="word-break: break-all;">{{msg.messageContent}}</div>
          <div class="foot-wrap">
            <div class="company" :title="msg.mamberName">{{msg.mamberName}}</div>
            <div v-if="msg.detailsType != 3">
            <div v-if="!msg.mamberId || msg.mamberId==cookies.getItem('memberId')" :class="{'btn': true, 'read': msg.readMark}" @click.stop="look(msg)">{{msg.detailButton}}</div>
            <div v-else-if="msg.mamberId!=cookies.getItem('memberId')">
              <el-popconfirm
                      width="276px"
                      confirm-button-text="确定"
                      cancel-button-text="取消"
                      :hide-icon="true"
                      :teleported="true"
                      placement="top-end"
                      :title="`确定将组织切换为${msg.mamberName}企业查看消息详情吗？`"
                      @confirm="confirmChangeCompany(msg.mamberId)">
                <template #reference>
                  <div :class="{'btn': true, 'read': msg.readMark}">{{msg.detailButton}}</div>
                </template>
              </el-popconfirm>
            </div>
          </div>
          </div>
          <el-divider v-if="(showList.length - 1) !== i" style="margin: 20px 0;--el-border-color: #f0f0f0"/>
        </div>
      </div>
    <!--      没有消息-->
      <div class="no-msg" v-else>
        暂无消息
      </div>
    <el-divider style="margin: 0;--el-border-color: #f0f0f0"/>
    <div class="read-all" @click="readAll">
      <span>
        <el-icon style="font-size: 14px;vertical-align: text-bottom;"><CircleCheck /></el-icon> 一键标记全部已读
      </span>
    </div>
  </div>

  <workbench-msg-dialog v-model:visible="dialogVisible" :msgDetails="msgDetails"></workbench-msg-dialog>
</template>

<script setup>
  import {getMsgDetailApi,handleReadApi} from "@/api/api"
  import {cookies} from "../../../composables";
const emit = defineEmits(['allRead','update:visible','switchRoles','refresh'])
const props = defineProps({
  visible: Boolean,
  list:{}
})
  const showList = ref([])
  showList.value = Array.from(props.list)
  watch(()=>props.list, (val) => {
    showList.value = Array.from(val)
  });
const {user} = useUser();
const loginMessage = user.value.bind;
const box = ref(null)
const msgDetails = ref({})
function boxClick(event) {
  event.stopPropagation(); // 阻止事件冒泡，防止点击盒子时触发 documentClick 事件
}
const readAll = ()=>{
  handleReadApi({staffId: cookies.getItem('staffId')}).then(res=>{
    emit('allRead')
    emit('refresh')
  })
}
const handleList = (val)=>{
  msgType.value = val;
  if(!val){
    showList.value = Array.from(props.list)
    return
  }
  showList.value = props.list.filter(item=>item.readMark == val)

}
const documentClick = (event) => {
  let container = document.getElementById('__nuxt');
  if (container.contains(event.target)&&!box.value.contains(event.target)) {
     emit('update:visible', false)
  }
};
  const lookBefore = (msg)=>{
    if(msg.detailsType==3){
      look(msg)
    }
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
onMounted(() => {
  document.addEventListener("click", documentClick);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", documentClick);
});

const dayjs = useDayjs()
const getMsgDate = (timestampString) => {
    // 将传入的时间字符串转换为日期对象
    const messageDate = new Date(timestampString);
    const messageDayjs = dayjs(timestampString)
    // 获取当前时间
    const now = new Date();
    // 比较年份差异
    const yearDiff = now.getFullYear() - messageDate.getFullYear();
    // 如果时间在今天内
    if (
        now.getDate() === messageDate.getDate() &&
        now.getMonth() === messageDate.getMonth() &&
        now.getFullYear() === messageDate.getFullYear()
    ) {
      // 返回时分格式
      return messageDayjs.format('HH:mm');
    } else if ((now - messageDate) < 365 * 24 * 60 * 60 * 1000) { // 如果时间小于一年，返回月日格式
      return messageDayjs.format('MM-DD');
    } else{ // 更早时间
      return `${numberToChinese(yearDiff)}年前`;
    }
}

// 数字转中文，大于一百后返回一百
function numberToChinese(num) {
  const chineseNumberMap = {
    0: '零',
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    7: '七',
    8: '八',
    9: '九'
  };
  const unitPosition = ['', '十', '百'];
  if (num >= 100)return '一百';
  if (num === 0) return chineseNumberMap[0];
  if (num === 2) return '两';
  const numArray = Array.from(num.toString()).map(Number);
  const chineseArray = numArray.map((digit, index) => {
    if (digit === 0) {
      return '';
    }
    return chineseNumberMap[digit] + unitPosition[numArray.length - index - 1];
  });
  return chineseArray.join('').replace(/零+/g, '零').replace(/零$/, '').replace(/^一十/, '十');
}

const msgType = ref('')
const loadMore = () => {

}

const dialogVisible = ref(false)

const showDetail = (msg) => {
  if(msg.read){
    dialogVisible.value = true ;
    emit('update:visible', false)
  }else{

  }
}

const confirmChangeCompany = (mamberId) => {
  emit('switchRoles','firm',{id:mamberId})
}

</script>

<style lang="scss" scoped>
  .company{
    width: 250px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
.sysDialog {
  background-color: #fff;
  position: absolute;
  top: 55px;
  right: 16px;
  z-index: 9;
  width: 340px;
  box-sizing: border-box;
  box-shadow: 0px 2px 6px 0px rgba(var(--el-color-primary-rgb), 0.2);
  border-radius: 10px;
  >.title{
    display: flex;
    justify-content: space-between;
  }
}
.pad-15{
  padding: 15px;
}
.mb-10{
  margin-bottom: 10px;
}
.dropitem{
  width: 80px;
  display: flex;
  justify-content: center;
  .dropitem-icon{
    width: 30px;
  }
  i.dropitem-icon{
    margin-right: 0;
    transform: translateY(3px);
  }
}

.active{
  color: var(--el-color-primary)
}

.no-msg{
  height: 120px;
  line-height: 120px;
  color: #999;
  text-align: center;
  user-select: none;
  cursor: default;
}


.red-point{
  top: 7px;
  left: -7px;
  position: absolute;
  width: 5px;
  height: 5px;
  background-color: red;
  border-radius: 50%;
  display: inline-block;
  vertical-align: middle;
}
.msg-item{
  color: #999999;
  font-size: 12px;
  margin: 0 16px;
  cursor: pointer;
  .title-wrap{
    display: flex;
    .title{
      color: rgba(16, 16, 16, 1);
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .date{
      min-width: 30px;
    }
  }
  .foot-wrap{
    display: flex;
    justify-content: space-between;
    .btn{
      color: var(--el-color-primary);
      cursor: pointer;
    }
    .read{
      color: #999999;
    }
  }
}
.read-all{
  color: #999999;
  font-size: 12px;
  padding: 15px;
  span:hover{
    cursor: pointer;
    color: var(--el-color-primary);
  }
}
:deep(.el-button--default) {
  color: var(--el-color-primary);
  border: var(--el-color-primary) 1px solid;
}
</style>
