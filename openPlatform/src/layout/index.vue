<!--
  名称：all.vue
  描述：默认框架输出，集成所有默认组件
  创建日期：2019年10月31日15:38:20
  创建人：李黎杰
-->
<template>
  <div :class="classObj" class="app-wrapper">
    <sidebar  class="sidebar-container" v-if="!iframe" style="top:50px;" @collapse="collapseSubmenu"/>
    <HeadColumn class="{'fixed-header':fixedHeader}" v-if="navShow&&!iframe" style="height:60px;"></HeadColumn>

    <div class="main-container" :class="{hasTagsView:needTagsView}" :style="{'margin-left':sliderShow? appMainMarginLeft :'0','margin-top':navShow||iframe?'0px':'50px','width': sliderShow?`calc(100% - ${appMainMarginLeft})!important`:'100%'}">
      <app-main />
    </div>
  </div>
</template>

<script>
import {HeadColumn, Navbar, Sidebar, AppMain } from './components';
import TagsView from './components/TagsView';
import { mapState } from 'vuex';
export default {
  name: 'Layout',
  components: {
    HeadColumn,
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  data(){
    return {
      appMainMarginLeft: '290px',
    }
  },
  created() {
    if(this.$route.query.iframe){
      this.$store.state.app.sidebarHidden=true
    }
  },
  mounted() {
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      fixedHeader: state => state.settings.fixedHeader
    }),
    iframe(){
      return this.$store.state.app.sidebarHidden
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      };
    },
    needTagsView(){
      let path= this.$route.path
      let pathBlack=['/dataAnalysisDisplay/index','/dataAnalysisLicense/index','/dataAnalysis/index','/goodsCoding/index','/addCompany/index','/companyTextOne/index','/companyTextTwo/index','/companyTextWait/index','/companyTextYing/index']
      if(pathBlack.indexOf(path) == -1){
        return true;
      }


    },
    sliderShow(){
      if(this.$route.meta.slider==='hidden'||this.iframe){
        return false;
      }
      return  true;
    },
    navShow(){
      return !window.__POWERED_BY_QIANKUN__
    }

  },
  methods: {
    collapseSubmenu(value){
      if(value){
        this.appMainMarginLeft = '160px'
      }else{
        this.appMainMarginLeft = '320px'
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    height: 60px;
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
  .main-container{
    z-index: 1001;
    box-shadow: 0px 2px 6px 0px var(--aeo-primary-color-9);

  }
</style>
