<script setup>
import {getWxCover} from "~/api/api";

const route = useRoute()
const articleContent = ref('')
if(!route.query.id){
  onMounted(() => {
    ElMessage.error('文章id不能为空');
  })
}else{
  try{
    const res = await getWxCover({ id: route.query.id })
    articleContent.value = res?.data.wxUcd ?? ""
  }catch (e) {}
}
</script>

<template>
  <!--  文章预览  -->
  <div class="article" v-if="articleContent?.content" v-html="articleContent?.content"></div>
</template>

<style lang="scss" scoped>
.article{
  width: 1200px;
  margin: 0 auto;
}
</style>
