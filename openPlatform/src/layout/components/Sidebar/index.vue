<template>
  <div :class="{'has-logo':showLogo}" style="display: flex">
    <div class="module-bar" :style="`background-color: ${$store.state.app.themeConfig.menuBackgroundColor}`">
      <ul>
        <li
          v-for="(item,index) in newRoute"
          :key="item.id" @click="changeModule(item.typeId,item.title)"
          :class="{active:moduleActiveIndex==index}"
        >
          <svg-icon :icon-class="item.icon"></svg-icon>
          <p>{{item.title}}</p>
        </li>
      </ul>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper" class="sidebar_box" :style="{display: collapseSubmenu}" v-if="moduleActiveIndex!=9">
      <el-menu
        :default-active="activeMenu"
        :default-openeds="allPath"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
        @open="handleOpen"
        ref="menuRef"
      >
        <sidebar-item
          v-for="(route,index) in data"
          :key="route.id"
          :item="route"
          :base-path="route.path"
          :sidebarIndexRoute="activeMenu"
        />
      </el-menu>

    </el-scrollbar>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Logo from './Logo';
  import SidebarItem from './SidebarItem';
  import variables from '@/styles/variables.scss';
  import tokenBox from '@/utils/auth'

  export default {
    components: {SidebarItem, Logo},
    data() {
      return {
        data: this.routes,
        copyData: [],
        type: this.$route.meta.type,
        info: '',
        didColumn: 100,
        totalColumn: 500,
        moduleActiveIndex: 0,
        usageInfo: '',
        loadInMacro: true,
        newRoute: this.$store.state.app.modules,
        childRouteOrigin:[],
        childRoute:[],
        collapseSubmenu: 'block'
      };
    },
    mounted() {
      let test = this.routes;
      let clientType = tokenBox.getItem('clientType')
      if(clientType === 'client'){
        this.loadInMacro = false
      }

      var id = this.$route.meta.typeId
      this.moduleActiveIndex = id
      this.data = this.data.filter(item => {
        return item.meta && item.meta.typeId == id;

      });
    },
    async created() {
    },
    updated() {
      if (this.$refs.menuRef.items.hasOwnProperty('/fileGrouping/index')) {
        this.$refs.menuRef.open('/fileGrouping')
      }

    },
    methods: {
      changeModule(id,title) {
        //切換模块对应的路由
        if (title=='开发者文档') return window.open('https://help.aeotrade.com/c289')
        this.moduleActiveIndex = id
        sessionStorage.setItem('openPlatformModuleActiveIndex', id)
        this.data = [...this.copyData]
        this.data = this.data.filter(item => {
          return item.meta && item.meta.typeId == id;
        });
        this.$router.push(this.data[0].path);
      },
      // 子菜单展开事件
      handleOpen(key, keypath) {
      },
    },
    watch: {
      $route: {//解决点击浏览器前进后退按钮无法匹配左右模块路由问题
        handler: function (val, oldVal) {
          let regs = /(\/.+?)\//;
          let parentPath = val.fullPath.match(regs)[1]
          let moduleActiveIndex = null
          this.copyData.forEach(item => {
            if (item.path === parentPath) {
              moduleActiveIndex = item.meta.typeId;
            }
          });
          if (moduleActiveIndex!=this.moduleActiveIndex){
            this.data = [...this.copyData]
            this.moduleActiveIndex=moduleActiveIndex
            this.data = this.data.filter(item => {
              return item.meta && item.meta.typeId == moduleActiveIndex;
            });

          }

        },
      },
      data: {
        // 监听当前菜单，如果只有一个二级菜单，且只有一个三级菜单，则隐藏子菜单
        handler: function (val, oldVal) {
          if(val.length === 1 && val[0] && val[0].children && val[0].children.filter(childMenu => childMenu.meta.hidden == 0).length === 1){
            this.collapseSubmenu = 'none'
            this.$emit('collapse', true)
          }else{
            this.collapseSubmenu = 'block'
            this.$emit('collapse', false)
          }
        },
        deep: true,
      }
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'moduleRoutes'
      ]),

      routes() {
        this.data = this.$store.state.permission.addRoutes
        this.copyData = [...this.$store.state.permission.addRoutes]
        return this.$store.state.permission.addRoutes
      },
      activeMenu() {
        const route = this.$route;
        const {meta, path} = route;
        if (meta.activeMenu) {
          return meta.activeMenu;
        }
        return path;
      },
      showLogo() {
        return this.$store.state.settings.sidebarLogo;
      },
      show() {
        return this.$store.getters.sidebar.opened;
      },
      variables() {
        return variables;
      },
      isCollapse() {
        return !this.sidebar.opened;
      },
      allPath() {
        if (this.data) {
          return this.data.map(route => route.path)
        }
        return []
      }
    }
  };
</script>
<style lang="scss" scoped>
  $color-blue: var(--aeo-primary-color);
  .module-bar {
    height: 100%;
    width: 160px;
    padding-top: 5px;
    box-shadow: 0px 1px 4px var(--aeo-primary-color-9);
    z-index: 1;

    & > ul {
      height: 100%;
      position: relative;
    }

    li {
      height: 40px;
      display: flex;
      justify-content: start;
      align-items: center;
      font-size: 14px;
      text-align: center;
      /*padding-left: 10px;*/
      margin-bottom: 5px;
      margin-left: 10px;
      margin-right: 10px;
      box-sizing: border-box;
      cursor: pointer;
      color: #555a6f;

      .svg-icon {
        font-size: 16px;
        margin: 10px !important;
        color: #a5b1ce;
      }

      &.active {
        color: $color-blue;
        background-color: #f4f5ff;
        .svg-icon{
          color: var(--aeo-primary-color);
        }
      }
    }

    .download-li {
      position: absolute;
      bottom: 100px;
      width: 100%;
    }

  }

  .progressBox {
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    position: absolute;
    bottom: 10px;
    /*margin-top: 50px;*/
    /*margin-bottom: 10px;*/
    border-top: 1px solid #dfdfdf;
    /*display: flex;*/
    /*align-items: center;*/
    .progressColumnBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .progressColumnTotal {
      width: 70%;
      background-color: #e8e8e8;
      height: 10px;
      border-radius: 2px
    }

    .progressDidColumn {
      height: 100%;
      background-color: #1a62f7;
    }

  }


  .sidebar_box {
    width: 160px;
    // box-shadow: 0px 1px 8px rgba(0, 21, 41, .08);
    position: relative;
  }

  .slider-header {
    /*margin-top: 5px;*/
  }

  .slider-header-member {
    padding: 0 10% 10px 10%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    /*justify-content: center;*/
    color: #333;
    font-size: 16px;
    width: 100%;

    img {
      width: 40px;
      height: 40px;
      border-radius: 14px;
      margin-right: 10px;
    }

    .name {
      font-size: 12px;
      color: #AEB1B7;
      width: 150px;
      word-break: keep-all;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 5px;
    }
  }


  @keyframes test {
    0% {
      opacity: 0;
      transform: scale(0);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  .enlogo {
    width: 55px !important;
    height: 30px !important;
  }

  .usage {
    display: flex;
    position: absolute;
    bottom: 28px;
    width: 100%;
    justify-content: center;

    .text {
      color: rgba(96, 111, 133, 100);
      font-size: 14px;
      margin-top: 6px;
    }

    span {
      color: rgb(41, 141, 248);
      letter-spacing: 1px;
    }
  }
</style>
