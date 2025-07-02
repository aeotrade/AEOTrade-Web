<script setup>
     import {getUserStatus,updateUserStatus} from '@/api/api'
     const props = defineProps({
      popclick:false,
      type:Boolean
     })
     const emits = defineEmits(['userOpenNovice'])
     const {user} = useUser()
     const showFlag= ref(false)
     const activeIndex = ref(0)
     const showHelp= ref(true)
     const  member =user.value.bind.memberid

  onMounted(()=>{
    nextTick(()=>{
      let staffId = cookies.getItem('staffId')
      let type =  'webNew'
      getUserStatus({memberId: member, staffId, type}).then(res => {
        if (res.result == 0 || !res.result) {
          // 值为 0 或 不存在
          showHelp.value = true
        } else {
          showHelp.value = false
        }
      })
    })
  })

    function  hideHald(){
      activeIndex.value = 0
    }
    function   helpchange(index) {
      activeIndex.value = index
      if (index === 5){
        kefu()
      }
      if (index === 3){
        let  url = 'http://help.aeotrade.com'
        if(globalThis.openInBrowser){
          globalThis.openInBrowser(url)
        }else{
          window.open(url)
        }
      }
      if (index === 4){
        let  url = 'https://appg2suui8v3678.pc.xiaoe-tech.com/'
        if(globalThis.openInBrowser){
          // 客户端使用打开
          globalThis.openInBrowser(url)
        }else{
          window.open(url)
        }
      }
      if (index === 1){
        showHelp.value=true
        let staffId = cookies.getItem('staffId')
        let type =  'webNew'
        updateUserStatus({
          memberId: member,
          staffId,
          value: 0,
          type
        }).then(res => {
          // console.log(res2)
        })
        imgclik()
      }
    }
    function   kefu() {
      let url = 'https://work.weixin.qq.com/kfid/kfc2982fbad7f93897a'
      if(globalThis.openInBrowser){
        globalThis.openInBrowser(url)
      }else{
        window.open(url)
      }
    }
    function   userColse(){
      // 关闭新手弹窗
      showHelp.value = false
      let staffId = cookies.getItem('staffId')
      let type =  'webNew'
      updateUserStatus({
        memberId: member,
        staffId,
        value: 1,
        type
      }).then(res => {
        // console.log(res2)
      })
    }
    function    imgclik(){
      // 打开视频
      let staffId = cookies.getItem('staffId')
      let type =  'webVideo'
      updateUserStatus({
        memberId: member,
        staffId,
        value: 0,
        type
      }).then(res => {
        // console.log(res2)
      })
      emits('userOpenNovice')
    }

</script>


<template>
<div>
  <el-popover
    placement="top-end"
    width="140"
    trigger="click"
    :visible-arrow="true"
    popper-class="pop_show"
    v-model="showFlag"
    @hide="hideHald"
    >
    <div style="padding: 0px 0px 10px" class="foot">
       <div  :class="['item-box',activeIndex === 1 ? 'active':'']" @click="helpchange(1)"><svg-icon icon-class="newUserGarden" class="helpIcon" /> 新手引导</div>
      <el-popover
        placement="left"
        width="200"
        trigger="hover"
        :visible-arrow="false"
        popperClass="pop"
        class="pop"
        :offset="10"
      >
      <template #reference>
        <div :class="['item-box',activeIndex === 2 ? 'active':'','need']"   @click="helpchange(2)"><svg-icon icon-class="requireEmit" class="helpIcon" /> 需求反馈</div>
      </template>



        <div style="text-align: center" class="qr-box">
          <img style="width: 160px;height: 160px;" src="~/assets/img/workbench/help/qr.png" class="qr" >
          <div class="info">微信扫码添加小慧提需求</div>
          <div class="tel"><img src="~/assets/img/workbench/help/phone.svg">010-86398171</div>
        </div>
      </el-popover>

      <div style="border-bottom: 1px solid rgba(var(--el-color-primary-rgb), 0.08);margin: 7px 0"></div>
       <div :class="['item-box',activeIndex === 3 ? 'active':'']" @click="helpchange(3)"><svg-icon icon-class="helpDoc" class="helpIcon" /> 帮助文档</div>
       <div :class="['item-box',activeIndex === 4 ? 'active':'']" @click="helpchange(4)"><svg-icon icon-class="videoLearn" class="helpIcon" /> 视频教程</div>
       <div :class="['item-box',activeIndex === 5 ? 'active':'']" @click="helpchange(5)"><svg-icon icon-class="onlineKefu" class="helpIcon" /> 在线客服</div>
       <div></div>
    </div>
    <template #reference>
      <div style=""   class="help-name">
      <svg-icon  icon-class="enter"  :class="[showFlag?'active':'','icon']" >
      </svg-icon>
    </div>
    </template>
  </el-popover>

  <div class="help" v-show="showHelp">
  <img src="~/assets/img/workbench/help/enter.png" alt="" @click="imgclik">
    <el-icon style="margin-top:9px;color: #BDBDC0;font-size: 18px;cursor: pointer" @click="userColse">
      <CircleCloseFilled />
    </el-icon>
</div>
</div>
</template>

<style scoped lang="scss">
 .help-name{
   //font-size: 44px;
   color: #333;
   position: fixed;
   height: 44px;
   z-index:500;
   width: 44px;
   right: 33px;
   cursor: pointer;
   bottom: 80px;
   border-radius: 50%;
   box-shadow: 0px 6px 14px 0px rgba(186, 188, 207, 100);
   //box-shadow: 0px 6px 14px 0px rgba(173, 175, 199, 100);
   .icon{
     font-size: 44px;
     &:hover{
       color: var(--el-color-primary);
     }
   }

 }

.active{
  color: var(--el-color-primary);
}

.help{
  position: fixed;
  z-index: 10;
  right: 18px;
  bottom: 253px;
  width: 74px;
  display: flex;
  flex-direction: column;
  align-items: center;
  //transform: translateX(13px);
  img{
    width: 100%;
    cursor: pointer;
  }
}
 .item-box{
   height: 30px;
   line-height: 30px;
   padding-left: 8px;
   box-sizing: border-box;
   font-size: 12px;
    cursor: pointer;
   &:hover{
     color: var(--el-color-primary);
     background-color: rgba(var(--el-color-primary-rgb), 0.04);
   }
 }
 .active{
   color: var(--el-color-primary);
   background-color: rgba(var(--el-color-primary-rgb), 0.04);
 }
 .qr-box{
   background-color: #fff;
   font-size: 12px;
   text-align: center;
   .info{
     margin: 12px auto;
     line-height: 18px;
   }
   .tel{
     display: flex;
     align-items: center;
     justify-content: center;
     padding-bottom: 13px;
     img{
       margin-right: 10px;
     }
     font-weight: bold;
   }
 }
 .helpIcon{
   margin-right: 8px;
 }
</style>

<style>
.pop{
  transform: translateX(-10px);
}
.el-popover{
  min-width: 140px;
}
</style>
