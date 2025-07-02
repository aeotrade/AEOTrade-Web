<script setup>
    const props = defineProps({
        data:{}
    })
    const router = useRouter()

    const changeIframe = inject("changeIframe")
    const goPage = (menu)=>{
        if(menu.iframe){
            changeIframe(menu.iframeUrl || menu.meta.iframeUrl)
        }else{
            if(menu.path && menu.path.startsWith('http')){
                window.open(menu.path)
            }else{
                router.push(menu.path)
                setTimeout(()=>{
                    changeIframe('')
                },500)

            }
        }
    }

</script>

<template>
    <div>
        <template v-for="item in data">
            <el-menu-item
                    :class="{'has-line':item.isGroup}"
                    v-if="!item.children.length"
                    :key="item.id"
                    :index="item.path"
                    @click="goPage(item)"
            >
                <div>
                    <svg-icon v-if="item.icon&&item.icon!=='bug'" :iconClass="item.icon"></svg-icon>
                    <span>{{ item.title }}</span>
                </div>
                <div class="bottom-line" v-if="item.isGroup"></div>
            </el-menu-item>

            <el-sub-menu v-else :key="item.id" :index="item.id" :class="{'has-line':item.isGroup}">
                <template #title>
                    <div>
                        <svg-icon v-if="item.icon&&item.icon!=='bug'" :iconClass="item.icon"></svg-icon>
                        <span>{{ item.title }}</span>
                    </div>
                    <div class="bottom-line" v-if="item.isGroup"></div>
                </template>
                <workbench-menu-list :data="item.children"></workbench-menu-list>
            </el-sub-menu>
        </template>
    </div>

</template>

<style scoped lang="scss">


    $color: var(--el-color-primary);
    ::v-deep{
        .el-menu--inline{
            background-color: #f7f8f9!important;
        }
        .el-sub-menu__title{
            margin-bottom: 0!important;
        }
    }
    .el-menu-item{
        height: 56px!important;
        transition: none;
        &:hover{
            color: $color;
            .svg-icon{
                color: $color;
            }
        }
        .svg-icon{
            margin-right: 12px;
            color: #a5b1ce;
        }
        &.is-active{
            background-color: var(--el-menu-hover-bg-color);
            .svg-icon{
                color: $color;
            }
        }
        &.has-line{
            position: relative;
            display: block;
            margin-bottom: 25px;
        }
    }
    .el-sub-menu__title{
        transition: none;
        .svg-icon{
            margin-right: 12px;
            color: #a5b1ce;
        }
        &:hover{
            color: $color;
            .svg-icon{
                color: $color;
            }
        }
    }
    .bottom-line{
        position: absolute;
        left: 15px;
        top: 68px;
        width: 85%;
        height: 1px;
        background-color: #dcdfe7;
    }
    .el-sub-menu.has-line{
        position: relative;
        display: block;
        margin-bottom: 25px;

    }
</style>
