<script setup>
import theme from 'assets/themeconfig'
const Config = useAppConfig()
const { user } = useUser();
let userData = user.value;
const url = import.meta.env.VITE_THEME
const router = useRouter();
const route = useRoute();
let { menu } = useMemberCenter();
const currentPath = ref(route.fullPath);
const logoutVisible = ref(false);
watch(() => route.path, (val) => {
    currentPath.value = val;
});

function jump(url) {
    router.push(url)
}

function changeRouter(route) {
    let path = null;
    if (route.path.indexOf('connect') != -1 || route.path.indexOf('connectNew') != -1) {
        if (userData.user.isTest == 1) {
            window.location.href = userData.user.jumpAddress
        } else {
            window.location.href = window.location.origin + '/connect'
        }

        return
    }
    if (route.children.length && route.children[0].path != 'index') {
        path = '/memberCenter' + route.path + '/' + route.children[0].path;
    } else {
        path = '/memberCenter' + route.path;
    }

    router.push(path);
}

function comparePath(route) {
    let currentParentPath = currentPath.value.substring(13)
    currentParentPath = currentParentPath.split('/')[1]
    if (!currentParentPath) {
        return route == '/'
    } else {
        return route.substring(1) == currentParentPath
    }
}

function toWorkbench() {
    router.push('/workbench')
}

</script>


<template>
    <div class="new-fixed-header">
        <div class="m-header">
            <div class="logoBox">
                <img v-if="Config.companyManageLogoImageUrl" :src="Config.companyManageLogoImageUrl" class="m-logoImg">
                <img v-else src='/configImg/default/logo1.svg' alt="" class="m-logoImg"
                    @click="jump('/memberCenter/firmSetting')">
            </div>
            <ul class="m-topNav" v-if="route.path != '/memberCenter/createFirm'">
                <li v-for="route in menu" :key="route.path" @click="changeRouter(route)"
                    :class="[{ active: comparePath(route.path) }, 'm-topNavItem']">
                    <svg-icon :icon-class="route.meta.icon" />
                    <span style="margin-left: 5px;">{{ route.meta.title }}</span>
                </li>
            </ul>
            <ul class="m-topNav" style="margin-right: 100px;" v-else></ul>
            <div class="m-regsiter" v-if="userData.bind">
                <div class="isLoginBox" @mouseover="logoutVisible = true" @mouseleave="logoutVisible = false"
                    style="display:flex;align-items:center;position: relative">
                    <div style="display: flex;align-items: center;cursor: pointer;height: 50px">
                        <img :src="userData.bind.memberimg" alt=""
                            style="width: 30px;height: 30px;border-radius: 20px;margin-right: 5px">
                        <div style="font-size:12px;color: #424242;flex-shrink: 0" v-if="userData.bind.kindid == 99">
                            个人-{{ userData.bind.staffname }}
                        </div>

                        <div class="company-name" style="font-size:12px;flex-shrink: 0;display: flex;" v-else>
                            <div style="max-width: 120px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                                {{ userData.bind.membername }}
                            </div>
                        </div>
                    </div>

                    <transition name="el-fade-in">
                        <div class="logout-box" v-show="logoutVisible">
                            <div class="item" @click="loginOutCommon">
                                <el-icon class="switch-button" style="margin-right: 8px">
                                    <SwitchButton />
                                </el-icon>退出登录
                            </div>
                        </div>
                    </transition>
                </div>
                <div class="btn" @click="toWorkbench" style="margin-left: 30px;cursor: pointer">工作台</div>
            </div>

        </div>
    </div>

</template>


<style lang="scss" scoped>
.new-fixed-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
    width: 100%;
    transition: width 0.28s;
    border-bottom: 2px solid #EBECED;
    background-color: #fff;
}

.btn {
    width: 56px;
    height: 25px;
    line-height: 25px;
    border-radius: 3px;
    background-color: rgba(var(--el-color-primary-rgb), 100);
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 100);
    font-size: 12px;
    color: #fff;

    &:hover {
        background-color: var(--el-color-primary-light-3);
    }
}

.m-header {
    display: flex;
    align-items: center;
    width: 1200px;
    margin: 0 auto;
    height: 90px;
    background-color: #fff;

    .logoBox {
        display: flex;
        align-items: center;

        div {
            font-size: 24px;
            border-left: 1px solid;
            padding-left: 20px;
            margin-left: 20px;
            color: #424242;
        }
    }

    .m-logoImg {
        height: 34px;
        cursor: pointer;
        position: relative;
        flex-shrink: 0;
    }

    .m-topNav {
        list-style: none;
        display: flex;
        margin: 0px 0 0px 20px;
        position: relative;
        justify-content: flex-end;
        width: 700px;

        .m-topNavItem {
            margin-right: 40px;
            cursor: pointer;
            font-size: 16px;
            color: #212121;
            text-decoration: none;

            svg {
                color: #212121;
            }

            &:hover {
                color: var(--el-color-primary);

                svg {
                    color: var(--el-color-primary);
                }
            }
        }

        .active {
            color: var(--el-color-primary);
            font-weight: bold;

            svg {
                color: var(--el-color-primary);
            }
        }

        .m-topChildNavBox {
            position: absolute;
            left: 332px;
            z-index: 999;

            .m-directBottom {
                transition: .6s;
                transform: rotate(0deg);
            }

            .m-directTop {
                transition: .6s;
                transform: rotate(180deg);
            }

            .m-topChildNav {
                margin-top: 10px;
                position: relative;
                left: -80px;
                background-color: #fff;
                text-align: center;
                padding: 0 10px;
                box-sizing: border-box;
                line-height: 20px;
                border-radius: 5px;
                background-color: rgba(255, 255, 255, 1);
                color: rgba(16, 16, 16, 1);
                font-size: 14px;
                box-shadow: 0px 0px 3px 0px rgba(115, 115, 115, 0.4);
                border: 1px solid rgba(213, 210, 210, 1);
                transition: .6s;
                display: flex;
                flex-direction: column;
                overflow: hidden;

                .m-topChildNavItem {
                    line-height: 48px;
                    cursor: pointer;
                    border-bottom: 1px solid #ECECEC;
                }
            }

            .m-topChildNavDisplay {
                width: 121px;
                opacity: 1;
                height: 198px;
            }

            .m-topChildNavHidden {
                opacity: 0;
                height: 0px;
                width: 0px;
                overflow: hidden;
            }
        }
    }


    input::-webkit-input-placeholder {
        color: #BBBBBB;
    }

    input:-moz-placeholder {
        color: #BBBBBB;
    }

    input::-moz-placeholder {
        color: #BBBBBB;
    }

    input:-ms-input-placeholder {
        color: #BBBBBB;
    }

    .m-regsiter {
        padding-right: 0px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        position: relative;
        line-height: 24px;

        .m-kefu {
            display: flex;
            align-items: center;
            border-right: 1px solid #E6E6E6;
            margin-right: 10px;
            cursor: pointer;

            span {
                display: inline-block;
                padding: 0px 10px 0 5px;
                color: #666;
                font-size: 14px;
            }
        }
    }

    .logout-box {
        position: absolute;
        top: 45px;
        left: 0;
        width: 100px;
        border-radius: 4px;
        text-align: center;
        box-shadow: 0px 6px 14px 0px rgba(var(--el-color-primary-rgb), 0.2);
        padding: 5px 0px 5px 10px;
        background: #fff;

        .item {
            display: flex;
            align-items: center;
            height: 30px;
            line-height: 30px;
            color: rgba(125, 135, 152, 1);
            font-size: 14px;
        }

        .item:hover {
            cursor: pointer;
            color: var(--el-color-primary);
        }
    }
}

.navbar-list {
    display: flex;
    align-items: center;

    li {
        padding: 0 30px;
        cursor: pointer;
    }
}

.company-name {
    color: #424242;
}

.navbar-box {
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 3;
}


.navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    position: relative;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
    transform: translate3d(0, 0, 0);
    padding: 0 20px;

    .exit {
        margin-right: 10px;
    }

    .exit_box {
        padding: 0 10px;
    }
}

.m-regsiter {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}


.dark-mode {
    .new-fixed-header {
        background-color: var(--aeo-workbench-haed-backround-);
    }

    .m-header {
        background-color: var(--aeo-workbench-haed-backround-);
    }

    .m-topNavItem {
        color: #fff !important;

        .svg-icon {
            color: #fff !important;
        }
    }

    .company-name {
        color: #fff;
    }

    .btn {
        background-color: transparent;
        color: #fff;

        &:hover {
            color: var(--el-color-primary);
            background-color: #fff;
        }
    }
}
</style>
