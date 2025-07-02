<template>
  <nuxt-page style="width: 100%; height: 100%;background-color: var(--aeo-connect-background);overflow: auto;"></nuxt-page>
</template>

<script setup>
onBeforeRouteLeave((to, from, next) => {
  if (to.path.indexOf("/connect") === 0 && to.path.indexOf("/workbench") !== 0 && to.path.indexOf("/processEngine") == -1) {
    next({ path: "/workbench/" + to.path.substring(1), query: to.query });
  } else {
    next(); // 允许离开当前路由
  }
});
</script>

<style lang="scss" scoped></style>
