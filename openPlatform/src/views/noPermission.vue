<template>
    <div class="container">
      <img src="../assets/noPermission.svg">
      <span>您当前无访问权限暂时无法进入页面，请联系主管理员为您配置页面访问权限！</span>
    </div>
</template>

<script>
    export default {
        name: "noPermission"
    }
</script>
<style scoped lang="scss">
  .container{
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    img{
      width: 400px;
    }
    span{
      margin-top: 20px;
      font-size: 16px;
    }
  }

</style>
