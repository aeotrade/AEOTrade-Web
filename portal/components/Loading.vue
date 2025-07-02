<template>
  <div class="main-loading" v-loading="!theme.loadingImg" style="--el-loading-spinner-size: 100px;">
    <!--      <div class="m-spinner" >-->
    <!--        <div class="m-bounce1"></div>-->
    <!--        <div class="m-bounce2"></div>-->
    <!--        <div class="m-bounce3"></div>-->

    <!--      </div>-->
    <!--      <span class="main-help"></span>-->
    <template v-if="theme.loadingImg">
      <img :src="theme.loadingImg" alt="">
<!--      <p style="font-size: 14px">小慧正在为您努力加载中，请稍后......</p>-->
    </template>

  </div>
</template>

<script setup>
import  theme from '@/assets/themeconfig'

</script>

<style scoped>
  .main-loading {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 16px;
    color: #424242;
    z-index: 99999;
    background-color: #fff;
  }

  .main-loading img {
    height: 120px;
    width: 120px;
    margin-bottom: 50px;


  }
</style>
