<script setup>
  const props=defineProps({
    lf: Object
  })


 function  $_zoomIn(){
      props.lf.zoom(true);
    }
    function   $_zoomOut(){
      props.lf.zoom(false);
    }
    function   $_zoomReset(){
      props.lf.resetZoom();
    }
    function  $_translateRest(){
      props.lf.resetTranslate();
    }
    function  $_reset(){
      props.lf.resetZoom();
      props.lf.resetTranslate();
    }
  
</script>

<template>
  <div>
     <el-button-group>
      <el-button type="plain" size="small" @click="$_zoomIn">放大</el-button>
      <el-button type="plain" size="small" @click="$_zoomOut">缩小</el-button>
      <!-- <el-button type="plain" size="small" @click="$_zoomReset">大小适应</el-button> -->
      <!-- <el-button type="plain" size="small" @click="$_translateRest">定位还原</el-button>
      <el-button type="plain" size="small" @click="$_reset">还原(大小&定位)</el-button> -->
    </el-button-group>
  </div>
</template>
<style scoped>
  .demo-control{
    left: 100px;
    top: 55px;
  }
</style>
