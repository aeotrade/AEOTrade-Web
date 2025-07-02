<template>
  <div style="text-align: center" class="page404">
    <h2  v-if="props.error.statusCode == 404">404 - 您访问的页面不存在</h2>
    <h2 v-else>500 - 服务器崩溃</h2>
    <ul style="margin-top: 50px;">
      <li><nuxt-link to="/portal">返回首页</nuxt-link></li>
    </ul>
  </div>
</template>

<script setup>
  const props=defineProps({
      error:null
  })
  if(props.error.statusCode===500&&props.error.message==='该账户已在其他设备登录'){
      loginOutCommon()
  }
  console.log(props)
</script>
<style scoped>
  .page404{
    text-align: center;
    margin-top: 100px;
  }
</style>
