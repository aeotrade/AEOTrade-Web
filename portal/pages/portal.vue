<template>
  <div>
    <ThemeHeader :type="type"></ThemeHeader>
    <nuxt-page style="padding-bottom: 100px;min-height: 70vh;"></nuxt-page>
    <ThemeFooter></ThemeFooter>
    <PortalRightSide></PortalRightSide>
    <PortalPromotion></PortalPromotion>
  </div>
</template>

<script setup>
 const  router = useRoute()
 const type = computed(()=>{
   if (router.path === '/portal/aboutUs'){
     return 8
   }else if (router.path === '/portal/userCase'){
     return  7
   }
 })
</script>

<style scoped lang="scss">

</style>
