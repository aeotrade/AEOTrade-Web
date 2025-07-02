<script setup>
import { getBannerApi, getTxListApi, getFirmStaffInfoApi } from '@/api/api'
import Sidebar from './Sidebar';

const memberBanner = ref('');
const caOrgId = ref('');
const parentRoute = ref('');
const firmStaffInfo = ref(null);
const router = useRouter();
const route = useRoute();
let { author } = useAuthor();
const { user } = useUser();
const loginMessage = user.value.bind
const currentPath = ref(route.fullPath.split('?')[0])

let { menu } = useMemberCenter();

const isCompanyAuth = computed(() => {
    return author.value
})
const navTitle = computed(() => {
    let routes = menu.value;
    let title = '';
    let currentParentPath = currentPath.value.substring(13)
    currentParentPath = currentParentPath.split('/')[1]
    if (!currentParentPath) currentParentPath = '//'
    try {
        routes.forEach((item) => {
            if (item.path.substring(1) == currentParentPath) {
                title = item.meta
                throw ('')
            }
        });
    } catch (e) {

    }
    return title;
})
const routes = computed(() => {
    let routes = menu.value;
    let currentParentPath = currentPath.value.substring(13)
    currentParentPath = currentParentPath.split('/')[1]
    parentRoute.value = currentParentPath
    routes = routes.filter((item) => {
        return item.path.substring(1) == currentParentPath;
    });
    if (routes[0]) {
        if (whileChildRouteIsHidden(routes)) {
            return [];
        } else {
            routes = [...routes[0].children];
            routes = routes.filter((item) => {
                return !item.hidden;
            });
            if (routes.length === 1) {
                return [];
            } else {
                return routes;
            }
        }
    } else {
        return [];
    }
})
watch(() => route.path, (val) => {
    currentPath.value = val;
});

async function getBanner() {
    const res = await getBannerApi({ pageNum: 1, pageSize: 10, type: 20 })
    nextTick(() => {
        memberBanner.value = res.data.list[0] && res.data.list[0].pic || ''
    })
}

// 获取链上身份节点信息
function getTxList() {
    getTxListApi(loginMessage.memberid).then(res => {
        caOrgId.value = res.result && res.result.caOrgId
    })
}

//获取企业管理员，人数信息
function getFirmStaffInfo() {
    getFirmStaffInfoApi({ memberId: loginMessage.memberid }).then(res => {
        firmStaffInfo.value = res.result;
        if (firmStaffInfo.value && firmStaffInfo.value.sgsStatus == 0) {
            author.value = false
        } else {
            author.value = true
        }
    });
}

function whileChildRouteIsHidden(routes) {
    return routes[0].children.some((item) => {
        return item.path == currentPath.value.split('?')[0] && item.hidden == true;
    });
}
onMounted(async () => {
    await nextTick()
    getFirmStaffInfo();
    getBanner();
});
</script>

<template>
    <div class="main-container">
        <section class="app-main">
            <div style="height: 30px"></div>
            <div style="display: flex;width: 1200px;">
                <Sidebar :routes="routes" :parentRoute="parentRoute" />
                <div style="flex: 1;">
                    <nuxt-page />
                </div>
            </div>
        </section>
    </div>
</template>

<style lang="scss" scoped>
.main-container {
    flex: 1;
    overflow-y: auto;
    padding-top: 90px;
    box-sizing: border-box;
    position: relative;
    background-color: #f7f8fa;
}

.banner {
    width: 1200px;
    margin: 30px auto;
}



.app-main {
    min-height: calc(100vh - 90px);
    width: 1200px;

    margin: 0 auto;
    position: relative;
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

.long {
    padding: 0 !important;
}
</style>

<style lang="scss">
.el-popup-parent--hidden {
    .fixed-header {
        padding-right: 15px;
    }
}

.navTitle {
    display: flex;
    line-height: 80px;
    border-bottom: 1px solid #eee;
    align-items: center;
    font-size: 18px;
}

.svgIcon {
    color: var(--el-color-primary);
    width: 23px;
    height: 23px;
    font-size: 23px;
    margin-right: 20px;
}
</style>
