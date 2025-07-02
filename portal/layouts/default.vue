<template>
  <div :key="key" class="contrain">
    <Loading v-show="loading"></Loading>
    <slot></slot>
  </div>
</template>
<script setup>

import {useErrors} from "~/composables/states/useUser";
const config=useAppConfig()
const connectBackground =   config['connectBackground']
const menuBackGround =   config['menuBackGround']
const workbenchHeadBackground =   config['workbenchHeadBackground']


const route = useRoute()
const {errorMsg}=useErrors();
watch(errorMsg, (val, oldVal) => {
    console.log('errorMsg Val: ', val, oldVal)
      if(!val) return
      if(val===oldVal) return
      ElMessage({
        type: 'error',
        message:val
      })
      setTimeout(()=>{
        errorMsg.value = ''
      },3000)
      // nextTick(() => errorMsg.value = '')
    },{ immediate: true, flush: 'post' }
);


const key = ref(1)
const nuxtApp = useNuxtApp()
const loading = ref(false)

// 挂载重新渲染方法
nuxtApp.reRenderApp = () => {
  navigateTo('/workbench')
  key.value = Math.random() * 100
  loading.value = true
  setTimeout(() => loading.value = false, 400)
}

onMounted(() => {
  loading.value = false
})
definePageMeta({
  colorMode: 'light',
})
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
.contrain{
  --el-menu-hover-bg-color: rgba(var(--el-color-primary-rgb),0.04);
  --aeo-connect-background:v-bind(connectBackground);
  --aeo-workbench-menu-backround-:v-bind(menuBackGround);
  --aeo-workbench-haed-backround-:v-bind(workbenchHeadBackground);
  --aeo-workbench-haed-color-:#ffffff; /* 顶部公司名称*/
  --aeo-workbench-haed-downLoad-color-:#ffffff; /* 下载客户端颜色 */
  --aeo-dark-connect-menu-hover-backround:#2B58CD ;/* 黑暗模式 工作台菜单选中背景颜色*/
}

</style>
