<template>
  <div class="breadWrap">
    <div class="breadHead"></div>
    <el-breadcrumb class="app-breadcrumb" separator="/">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
          <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
          <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>

</template>

<script>
import pathToRegexp from 'path-to-regexp';

export default {
  data() {
    return {
      levelList: null
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  created() {
    this.getBreadcrumb();
  },
  computed:{
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title);
      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false);
    },
    pathCompile(path) {
      const { params } = this.$route;

      var toPath = pathToRegexp.compile(path);

      return toPath(params);
    },
    handleLink(item) {
      const { redirect, path } = item;

      if (redirect) {
        this.$router.push(redirect)
        return;
      }
      this.$router.push(this.pathCompile(path));
    }
  }
};
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
    color: rgba(16, 16, 16, 100);
    font-weight: bolder;
  }
}
  .title{
    font-size: 12px;
    color: #333;
    line-height: 50px;
  }
.el-breadcrumb__inner, .el-breadcrumb__inner a{
  font-weight: bold!important;
}
  .breadWrap{
    display: flex;
    align-items: center;
  }
  .breadHead{
    margin-right: 2px;
    background-color: #3D5AFE;
  }
</style>
