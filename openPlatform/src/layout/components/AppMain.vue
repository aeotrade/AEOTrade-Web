<template>
  <section class="app-main" style="padding: 20px;background: #f7f8fa">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="isKeepAlive">
        <router-view />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
  export default {
    name: 'AppMain',
    data(){
      return{
        isKeepAlive:[]
      }
    },
    watch:{
      '$route': {
        immediate: true,
        handler: function (val) {
          if((val.path =='/docSearch/search' || val.path=='/docCabinet/detail') && !val.query.isKeepAlive){
            //正常入口进入不缓存缓存
            this.isKeepAlive = []
          }else {
            this.isKeepAlive = ['docSearch','docCabinetDetail']
          }

        }
      }
    },
    computed: {
      cachedViews() {
        return this.$store.state.tagsView.cachedViews;
      },
      key() {
        return this.$route.path;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .app-main {
    height: calc(100vh - 0px);
    width: 100%;
    overflow-y: auto;
    &::-webkit-scrollbar{
      width: 7px;
      height: 7px;
      background-color: transparent;
    }

    &::-webkit-scrollbar-track {
      border-radius: 10px;
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb{
      border-radius: 10px;
      background-color: #dddee0;
    }
  }

  .fixed-header+.app-main {
    padding-top: 50px;
  }

  .hasTagsView {
    .app-main {
      min-height: calc(100vh - 87px);
    }

    .fixed-header+.app-main {
      padding-top: 87px;
    }
  }
</style>

<style lang="scss">
  .el-popup-parent--hidden {
    .fixed-header {
      padding-right: 15px;
    }
  }
</style>
