<script setup>
 const Config = useAppConfig()
    const emit = defineEmits(['change'])
    const props = defineProps({
        menuData: {
          type: Array,
          required: true,
          default: [],
          validator(value){
              if(value.length){
                  let item = value[0]
                  return item.id && item.title && item.children
              }else{
                  return false
              }
          }
        },
        leftStyle: String,
        rightStyle: String,
        menuItemHeight: {
            type: String,
            default: '50px'
        },
        menuItemActiveBgColor: {
            type: String,
            default: '#ecefff'
        }
    })
    const router = useRouter()
    const menuList = props.menuData
    const currentPath = ref('')
    const route = useRoute()
    watch(()=>route,(val)=>{
        currentPath.value = val.fullPath
        nextTick(()=>{
            setTimeout(()=>{
                if(currentPath.value === '/workbench'){
                    router.push(menuList[0].path)
                }
            },500)

        })
    },{ deep: true, immediate: true })
    const {user} = useUser()
    const state = reactive({
        role:0,
        id: user.value.bind.staffid,
        member: user.value.bind.memberid,
        membername: user.value.bind.membername,
        staffname: user.value.user.staffname
    })
    const sellErpHost = Config.SELLERERP
    const serviceErpHost = Config.SERVICERERP
    const articleErpHost = Config.ARTICLEERP
</script>

<template>
   <div :style="`--aeo-menu-item-height: ${props.menuItemHeight}`" class="menu-container">
        <div class="left-menu" :style="props.leftStyle" style="background-color: var(--aeo-workbench-menu-backround-);">
            <el-scrollbar style="height: 80vh">
                <el-menu :default-active="currentPath">
                    <workbench-menu-list :data="menuList"></workbench-menu-list>
                </el-menu>
            </el-scrollbar>
        </div>

    </div>
</template>

<style scoped lang="scss">
    $color: var(--el-color-primary);
    $left-min-width: 180px;
    $right-min-width: 160px;
    $menu-item-margin-bottom: 5px;
    .menu-container{
        display: flex;
        --aeo-menu-item-height: v-bind('props.menuItemHeight');
    }
    @mixin menu-item-active-common-style{
        color: $color;
        background-color: var(--el-menu-hover-bg-color);
        .svg-icon{
         color: $color;
      }
    }
    .el-menu{
        border-right: none;
    }
    .menu-item{
        cursor: pointer;
        //height: var(--aeo-menu-item-height);
        margin-bottom: 5px;
        line-height: var(--aeo-menu-item-height);
        padding-left: 30px;
        &:hover{
            @include menu-item-active-common-style;
        }
        .svg-icon{
            margin-right: 12px;
            color: #a5b1ce;
        }
    }
    .left-menu{
        min-width: $left-min-width;
        padding: 0 15px;
        .active{
            @include menu-item-active-common-style;
        }
    }
    .right-menu{
        min-width: $right-min-width;
    }
    :deep(.el-sub-menu div.el-sub-menu__title,li.el-menu-item){
        margin-bottom: $menu-item-margin-bottom;
    }
    li.el-menu-item{
        margin-bottom: $menu-item-margin-bottom;
    }
    .el-menu-item.is-active{
        background-color: var(--el-menu-hover-bg-color);
    }
    .dark-mode{
      .menu-item{
        color: #ffffff;
        &:hover{
          background-color: var(--aeo-dark-connect-menu-hover-backround);
          color: #ffffff;
        }
        .svg-icon{
          color:#ffffff;
        }
      }
      .left-menu{
        .active{
          background-color: var(--aeo-dark-connect-menu-hover-backround);
        }
      }
    }

</style>
