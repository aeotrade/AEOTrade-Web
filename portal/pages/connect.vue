<template>
    <nuxt-page @click="handleClick" style="background-color: var(--aeo-connect-background);"></nuxt-page>
</template>

<script setup>
const config=useAppConfig()
function handleClick(){
  if( window.parent){
    window.parent.postMessage('clickEvent', '*');
  }
}

  if(process.client){
    if (window.self !== window.top) {
      // 页面被嵌套时，修改主题颜色为#3d5afe
      changeTheme(config.iframeTheme)
    }
  }



  </script>

  <style scoped>

  </style>
