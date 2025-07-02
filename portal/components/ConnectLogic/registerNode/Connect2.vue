<template>
  <div class="connect">
    <!--    <div class="top-title" :style="{'background':bgColor}">{{activeId}}</div>-->
    <div class="text-value" :style="{'background':props.backgroundColor} ">
      <img src="@/assets/img/connect.png"  alt="">
      <div>
        <div style="color: #101010;font-size: 18px"> {{props.name}}</div>
      </div>

    </div>
  </div>
</template>

<script setup>
const props=defineProps({
  name: {
    type:String,
    default:'未命名'
  },
  eventAction:{
    type:String,
    default:'默认动作'
  },
  bgColor:{
    type:String,
    default:'#4dd079'
  },
  backgroundColor:{
    type:String,
    default:''
  }
})

</script>

<style scoped>
  .text-value{

    width:99%;
    height: 135px;
    color: #101010;
    text-align: center;
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 6px;
    border: 8px solid #f4efc3;
  }
  .lf-node-selected .text-value{
    background-color: rgba(244, 239, 195, 0.7) !important;

    border: 8px solid #f4efc3;
  }
  .top-title{
    width: 95%;
    height: 37px;
    color: #fff;
    font-family: SourceHanSansSC-regular;
    border-radius:  12px 12px 0px 0px;
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
    transform: translateX(5px);
    line-height: 37px;
    padding-left: 16px;
  }
  .connect {
    width: 100%;
    height: 100%;
    /*position: relative;*/
    /*background: #FFF;*/
    /*box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);*/
    box-sizing: border-box;
  }
  .connect img{
    pointer-events: none;
  }
  .connect p {
    margin: 0;
  }
  .button-list {
    position: absolute;
    bottom: 10px;
  }
</style>
