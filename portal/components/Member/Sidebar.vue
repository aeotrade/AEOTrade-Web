<script setup>
const router = useRouter();
const route = useRoute();
const currentPath = ref(route.fullPath);
const props = defineProps({
    routes: {
        type: Array,
        default: []
    },
    parentRoute: {
        type: String,
        default: ''
    }
});
watch(() => route.path, (val) => {
    currentPath.value = val;
});

function changeRouter(route) {
    let path = '/memberCenter/' + props.parentRoute + (route.path == 'index' ? '' : '/' + route.path)
    router.push(path);
}


function comparePath(route) {
    const lastPath = currentPath.value.split('?').shift().split('/').pop()
    if (lastPath == props.parentRoute) {
        return route.path === 'index'
    }
    return lastPath == route.path;
}


</script>


<template>
    <div v-if="props.routes.length" class="slider-content">
        <ul class="slider-box">
            <li v-for="(route) in routes" :key="route.path" :class="[{ active: comparePath(route) }, { slider: true }]">
                <span @click="changeRouter(route)"><svg-icon :icon-class="route.meta.icon" /> <label
                        style="margin-left: 5px;cursor: pointer;">{{ route.meta.title }}</label></span>
            </li>
        </ul>
    </div>
</template>


<style lang="scss" scoped>
.slider-content {
    width: 220px;
    min-width: 220px;
}

.slider-box {
    width: 200px;
    line-height: 20px;
    background-color: rgba(255, 255, 255, 1);
    color: rgba(16, 16, 16, 1);
    font-size: 14px;
    border: 1px solid rgba(255, 255, 255, 0);
    padding: 20px 0;

    li {
        cursor: pointer;
        padding-left: 45px;
    }
}

.active {
    color: var(--el-color-primary) !important;
    border-left: 5px solid var(--el-color-primary);
    text-indent: -5px;
    background-color: rgba(var(--el-color-primary-rgb), 0.04);
}

.slider {
    color: #333;
    font-size: 16px;
    height: 35px;
    line-height: 35px;
    position: relative;
    padding: 0;
    margin: 10px 0;
    cursor: pointer;

    &:hover {
        color: var(--el-color-primary);
    }
}
</style>
