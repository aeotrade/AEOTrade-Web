<script lang="ts" setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import theme from '@/assets/themeconfig'
const   locale = ref(zhCn)
let colorMode = useColorMode()
console.log(theme.themeModel)
colorMode.preference = theme.themeModel
</script>

<template>

  <Html >
    <Body
    >
    <el-config-provider :locale="locale">
      <NuxtLayout>
        <NuxtLoadingIndicator :height="2" :duration="3000" :throttle="400"  />
        <NuxtPage />
      </NuxtLayout>
    </el-config-provider>


    </Body>
  </Html>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}
.layout-enter-from,
.layout-leave-to {
  filter: grayscale(1);
}
</style>
