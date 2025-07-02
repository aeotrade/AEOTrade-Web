<template>
  <div v-if="!item.hidden " class="menu-wrapper" >

    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <div v-if="onlyOneChild.meta.different" style="border-top:2px solid #F6F8FA;margin: 10px auto;width: 80%;"></div>
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}" >
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>
    <el-submenu v-else ref="subMenu"   :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path';
import { isExternal } from '@/utils/validate';
import Item from './Item';
import AppLink from './Link';
import FixiOSBug from './FixiOSBug';

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    },
    sidebarIndexRoute:{
    }
  },
  data() {
    // TODO: refactor with render function
    this.onlyOneChild = null
    return{

    };
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false;
        } else {
          this.onlyOneChild = item;
          return true;
        }
      })

      if (showingChildren.length === 1) {
        return true;
      }
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true };
        return true;
      }

      return false;
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);

    }
  }
};
</script>
<style scoped>
  .svg-icon{
    font-size: 30px;
  }
  .el-menu-item:hover{
    background-color: transparent!important;
  }
  .submenu-title-noDropdown.is-active,{
    background-color: rgba(var(--aeo-primary-color-rgb), .05)!important;
    color: var(--aeo-primary-color)!important;
  }
  .el-menu-item.is-active{
    color: var(--aeo-primary-color)!important;
  }
  .router-link-active .el-menu-item::before {
    content: '';
    display: inline-block;
    width: 0px;
    height: 0px;
    background-color: #3243d9;
    position: absolute;
    left: 0px;
    top: 20px;
  }

</style>
