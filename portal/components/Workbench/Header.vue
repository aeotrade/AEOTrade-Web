<script setup>
import {
    getMsgInfoApi,
    apiGetCompanyList,
    apiGetUserInfo,
    insertLast,
    apiSetClientCookie,
    knownTipsApi,
    apiGetAppNewVersion, apiGetAppDetail,
    apiGetWorkbenchList
} from "@/api/api";
import { cookies } from "../../composables";
import { apiGetWorkbenchLast } from "../../api/api";
const colorMode = useColorMode()
const Config=useAppConfig();
const host = getClientDomain('protocol')
const isPersonal = ref((cookies.getItem('kindId') && parseInt(cookies.getItem('kindId')) >= 88) ? true : false);
const showExit = ref(false);
const theme=Config
const companyInfo = reactive({
    show: false,
    list: [],
    filterList: [],
    search: '',
    createOrgDialogVisible: false,
    isComposing:false
})
const systype = ref('info')
const sysDialog = ref(false)
const loading = ref(false)
const { user } = useUser();
const route = useRoute();
const { workbench } = useWorkbench();
const userData = user.value
const companyRes = await apiGetCompanyList({ id: userData['bind'].staffid })
const clientUrl = import.meta.env.VITE_BASE_URL + "/sys/client/version/find/new";
// 是否有新消息
const msgCenterDialogVisible = ref(false)
// 环境监测状态对应关系

let memberId = userData['bind'].memberid;
companyRes.result.forEach(item => {
    item.selected = false;
    if (memberId == item.id) {
        item.selected = true;
    }
});
companyInfo.list = companyRes.result;
companyInfo.filterList = companyRes.result;
const dialogVisible = ref(false)
if (workbench.value[0].vipstatus === 0){
    dialogVisible.value = true
    }
const toRenew = () => {
window.location.href=`${host}memberCenter/memberPackage/package?id=${workbench.value[0].viptypeId}&&name=${workbench.value[0].typeName}`
}

watch(() => companyInfo.search, (val) => {
    companyInfo.filterList = companyInfo.list.filter(item => item.memberName.includes(val))
});
watch(() => route.path, () => {
    getMsg()
});
const msgInfo = ref(null)
const getMsg = async () => {
    msgInfo.value = await getMsgInfoApi({
        staffId: cookies.getItem('staffId'),
        memberId: cookies.getItem('memberId'),
        readMark: '',
        pageNo: 1,
        pageSize: 100
    })
    hasNewMsg.useHasMsg.value = Number(msgInfo.value.result['1count']) + Number(msgInfo.value.result['2count']) + Number(msgInfo.value.result['3count']) + Number(msgInfo.value.result['4count'])
}
getMsg()






const sysClick = (e) => {
    e.stopPropagation()
    sysDialog.value = true
}
// 切换企业
async function switchRoles(type, item) {
    let relaunchAppFlag = false;
    cookies.removeItem('WORKBENCHNID');
    switchMember(type, item, relaunchAppFlag);
}
async function switchMember(type, item, relaunchAppFlag) {
    let params = {
        staffId: cookies.getItem('staffId'),
        memberId: '',
        type: ''
    };
    if (type == 'person') {
        window.dispatchEvent(new Event('app:logout'))
        params.type = 1;
        await insertLast({
            memberId: '',
            workBenchId: '1',
            staffId: cookies.getItem('staffId')
        });
    } else {
        params.memberId = item.id.toString();
        params.type = 2;
    }
    apiGetUserInfo(params).then(async res => {
        if (type === 'person') {
            cookies.setItem('WORKBENCHNID', '1')
        }
        if (type === 'firm') {
            let params = {
                apply: 1,
                id: item.id.toString()
            }
            let res = await apiGetWorkbenchList(params)
            let list = res.result
            workbench.value = res.result
            let currentWorkbench = list[0]
            cookies.setItem('WORKBENCHNID', currentWorkbench?.workbenchId)
            cookies.setItem('WORKBENCHN', currentWorkbench?.workbenchName)
            let data = {
                memberId: item.id.toString(),
                workBenchId: currentWorkbench?.workbenchId,
                staffId: cookies.getItem('staffId')
            }
            apiGetWorkbenchLast(data)
        }

        cookies.setItem('kindId', res.result['bind'].kindid);
        sessionStorage.setItem("isLogin", null)
        nextTick(async function () {
            if (type == 'firm') {
                cookies.setItem('memberId', item.id);
                cookies.setItem('memberName', item.memberName);
                sessionStorage.setItem('WORKBENCHINDEX', 1);
            }
            cookies.removeItem('wbin');
            cookies.setItem('jump', 1);
           user.value = res.result
            setTimeout(() => {
              reRenderHtml()
            }, 200);

        });

    });
}
const reRenderHtml = () => {
    loading.value = true
    window.location.href =  '/workbench'
}
function reload() {
    cookies.setItem('wbin', '0-0-0');
    location.reload();
}
function backCompany() {
    let id = cookies.getItem('memberId');
    let v = '';
    companyInfo.list.some(item => {
        if (item.id == id) {
            v = item;
            return true;
        }
    })
    if (!v) {
        v = companyInfo.list[0];
    }
    switchRoles('firm', v);
}

function knownTips(type) {
    let staffId = cookies.getItem('staffId');
    knownTipsApi({
        memberId: cookies.getItem('memberId'),
        staffId,
        value: 1,
        type
    }).then(res => {
        // console.log(res2)
    })
}
const changeInfo = (e) => { systype.value = e }
const showMore = useMsgCenter()
const hasNewMsg = useHasMsg()

function handleMouseLeave() {
  if (!companyInfo.isComposing) {
    companyInfo.show = false
  }
}
</script>

<template>
    <div class="header">
        <Loading v-if="loading"></Loading>
        <div class="info">
            <div class="company-info" v-if="!isPersonal">
                <img :src="userData['bind'].memberimg" @click="reload">
                <div style="cursor: pointer;display: flex;align-items: center;margin-left: 10px;">
                    <div class="company-name">
                        {{ userData['bind'].membername }}
                    </div>

                </div>
            </div>
            <div class="user-info" v-else>
                <img class="logo" :src="userData.headimgurl">
                <div class="line"></div>
                <img style="width: 24px;height:24px" src="@/assets/img/workbench/quanzi.svg" />
                <span>个人中心</span>
                <div class="switch-btn" @click="backCompany" v-if="companyInfo.list.length">切换回组织工作台</div>
            </div>
        </div>
        <div class="handle-btn">
            <div class="management btn-item" v-if="!isPersonal">
                <img style="width: 14px;height:14px" src="@/assets/img/workbench/management.svg">
                <NuxtLink :to="isPersonal ? '/memberCenter/staffSetting' : '/memberCenter/firmSetting'">组织管理</NuxtLink>
            </div>

            <el-tooltip popper-class="pop_show" effect="dark" content="消息中心" placement="bottom">
                <el-badge is-dot :hidden="!hasNewMsg.useHasMsg.value" style="margin-right: 20px;">
                    <el-icon
                        @click="(e) => { e.stopPropagation(); showMore.msgCenter.value = !showMore.msgCenter.value; }"
                        style="font-size:14px;cursor: pointer;color: #F4A850;">
                        <Message />
                    </el-icon>
                </el-badge>
            </el-tooltip>

            <div class="line" v-show="theme.helpDoc || theme.wxKeFu"></div>
            <div class="logo" @click="showExit = !showExit" @mouseleave="showExit = false">

                <img :src="userData.headimgurl" v-if="!isPersonal">
                <div class="name" v-else>
                    <span>{{ userData.bind.staffname }}</span>
                    <el-icon v-if="!showExit" :color="colorMode.preference == 'dark' ? '#ffffff' : '#919AAC'" size="12">
                        <CaretBottom />
                    </el-icon>
                    <el-icon v-else :color="colorMode.preference == 'dark' ? '#ffffff' : 'var(--el-color-primary)'"
                        size="12">
                        <CaretTop />
                    </el-icon>
                </div>
            </div>
            <div class="exit-box" v-show="showExit" @mouseenter="showExit = true" @mouseleave="showExit = false">
                <div class="item" @click="switchRoles('person')" v-if="!isPersonal">
                    <img width="14px" height="14px" src="@/assets/img/workbench/personal.svg" />
                    <span>个人中心</span>
                    <i class="el-icon-arrow-right"></i>
                </div>
                <div class="box-line" v-if="!isPersonal"></div>

                <div class="item" @click="loginOutCommon">
                    <img width="14px" height="14px" src="@/assets/img/workbench/exit.svg" />
                    <span>退出登录</span>
                    <i class="el-icon-arrow-right"></i>
                </div>
            </div>

        </div>
        <workbench-CreateOrgDialog v-if="companyInfo.createOrgDialogVisible" :loginMessage="userData.bind"
            v-model:visible="companyInfo.createOrgDialogVisible" @create="knownTips('personCreateOrgTip')">
        </workbench-CreateOrgDialog>


        <!--  消息中心右上角弹窗 -->
        <workbench-msg-more-dialog v-model:visible="msgCenterDialogVisible"></workbench-msg-more-dialog>


        <workbench-msg-notice v-if="msgInfo" @refresh="getMsg" :list="msgInfo.result.popList"></workbench-msg-notice>
    </div>
    <el-dialog v-model="dialogVisible" width="480px">
        <div class="prop-box">
            <img src="@/assets/member.svg">
            <div class="prop-txt">
                <div class="title">你的会员已到期</div>
                <div style="line-height: 25px;">
                    当前您的企业会员权益已终止，暂时不能正常<br />
                    使用慧贸OS功能，请前去续费！
                </div>
            </div>
            <div class="btn" @click="toRenew">
                续费会员
            </div>
        </div>
    </el-dialog>
</template>

<style scoped lang="scss">
.prop-box {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding-top: 78px;
    img{
      width: 280px;
      margin-bottom: 30px;
    }
    .prop-txt {
      text-align: center;
      color: rgba(16, 16, 16, 1);
      font-size: 14px;
      margin-bottom: 36px;
      .title{
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 20px;
      }
    }
    .btn{
      width: 120px;
      height: 32px;
      line-height: 32px;
      border-radius: 4px;
      background-color: rgba(61, 90, 254, 1);
      color: rgba(255, 255, 255, 1);
      font-size: 14px;
      text-align: center;
      cursor: pointer;
      margin-bottom: 30px;
      &:hover{
        background-color: rgba(61, 90, 254, 0.9);
      }
    }
  }
.pop-icon {
    width: 14px;
    height: 14px;
    margin-right: 20px;
    cursor: pointer;
}

.pop-icon:last-child {
    margin-right: 0px;
}

.company-name {
    max-width: 240px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    padding: 0 20px;
    position: relative;
    z-index: 501;
    box-shadow: rgba(0, 21, 41, 0.08) 0px 1px 4px;
    background-color: var(--aeo-workbench-haed-backround-);

    .info {
        font-size: 12px;

        .company-info {
            display: flex;
            align-items: center;
            position: relative;

            .line {
                width: 1px;
                height: 18px;
                background-color: rgb(224, 224, 224);
                margin: 0 20px;
            }

            .companyList {
                position: absolute;
                left: 2px;
                top: 40px;
                background-color: #fff;
                z-index: 999;
                box-shadow: 0px 1px 6px 0px rgba(var(--el-color-primary-rgb), .2);

                .company-section {
                    font-size: 14px;
                    margin-bottom: 10px;
                    font-weight: bold;
                    color: #333333;
                    text-align: left;
                }

                .companyList-box {
                    width: 300px;
                    padding: 0px 10px 45px 10px;
                    border: 1px solid rgba(255, 255, 255, 100);

                }

                .companyListEmpty-box {
                    padding-top: 20px;
                    width: 300px;
                    height: 130px;
                    margin: 0 auto;
                    border: 1px solid rgba(255, 255, 255, 100);
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                }

                .companyList-item {
                    display: flex;
                    align-items: center;
                    height: 60px;
                    border-bottom: 1px solid #F0F2FF;
                    color: #616161;
                    cursor: pointer;

                    &.active {
                        background-color: #F7F8FA;
                        color: var(--el-color-primary);
                    }

                    &:hover {
                        color: var(--el-color-primary);
                        background-color: #F7F8FA;
                    }

                    img {
                        border-radius: 100%;
                        width: 36px;
                        height: 36px;
                    }
                }

                .createBtn {
                    width: 120px;
                    height: 30px;
                    border-radius: 4px;
                    line-height: 28px;
                    text-align: center;
                    border: 1px solid var(--el-color-primary);
                    color: var(--el-color-primary);
                    cursor: pointer;

                    &:hover {
                        background-color: var(--el-color-primary);
                        color: #fff;
                    }
                }
            }

            img {
                height: 34px;
                width: 34px;
                cursor: pointer;
                border-radius: 50%;
                object-fit: cover;
            }

            i {
                margin-left: 8px;
            }

            .vip {
                color: var(--el-color-primary);

            }
        }

        .user-info {
            display: flex;
            align-items: center;

            .logo {
                height: 34px;
                width: 34px;
                cursor: pointer;
                border-radius: 50%;
                object-fit: cover;
            }

            .line {
                width: 1px;
                height: 20px;
                background-color: rgb(224, 224, 224);
                margin: 0 20px;
            }

            span {
                margin-left: 20px;
                font-size: 14px;
                cursor: pointer;
            }

            .switch-btn {
                width: 120px;
                height: 20px;
                margin-left: 20px;
                line-height: 18px;
                border-radius: 24px;
                color: var(--el-color-primary);
                text-align: center;
                cursor: pointer;
                border: 1px solid rgba(var(--el-color-primary-rgb), 100);

                &:hover {
                    background-color: var(--el-color-primary);
                    color: #fff;
                }
            }
        }
    }

    .handle-btn {
        position: relative;
        height: 50px;
        font-size: 12px;
        display: flex;
        align-items: center;

        .svg-icon {
            cursor: pointer;
            color: #a9afb8;
            font-size: 14px;

            &:hover {
                color: var(--el-color-primary);
            }
        }

        .btn-item {
            display: flex;
            align-items: center;

            img {
                margin-right: 10px;
            }

            a {
                cursor: pointer;
                border-right: 1px solid #E0E0E0;
                padding-right: 20px;
                margin-right: 25px;

                &:hover {
                    text-decoration: underline;
                }
            }

            &.download a {
                color: var(--el-color-primary);
            }

            &.management a {
                color: #FD5C3F;
            }
        }

        .line {
            width: 1px;
            height: 14px;
            background-color: rgb(224, 224, 224);
            margin: 0 20px;
        }

        .logo {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
                height: 34px;
                width: 34px;
                cursor: pointer;
                border-radius: 50%;
                object-fit: cover;
            }

            .name {
                cursor: pointer;

                span {
                    margin-right: 10px;
                }
            }
        }

        .exit-box {
            position: absolute;
            z-index: 999;
            top: 50px;
            right: -20px;
            width: 150px;
            background-color: #fff;
            box-shadow: 0px 2px 6px 0px rgba(var(--el-color-primary-rgb), .15);
            padding: 10px 0px;

            .item {
                display: flex;
                align-items: center;
                padding: 8px 18px;
                cursor: pointer;

                img {
                    width: 14px;
                    height: 14px;
                    margin-right: 15px;
                }

                span {
                    margin-right: 25px;
                }

                &:hover {
                    background-color: #F7F8FF;
                }
            }

            .box-line {
                margin: 5px 0;
                border-bottom: 1px solid rgba(235, 241, 255, 100);
            }
        }
    }
}

.mask-m {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 9999;
    top: 0;
    left: 0;
    background: #0B0B0B40;
}

.mask-m .box {
    width: 560px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    z-index: 99;
    box-shadow: 0px 2px 12px 0px rgba(var(--el-color-primary-rgb), .15);

    .info {
        position: relative;
        height: 280px;

        .el-icon-close {
            font-size: 15px;
            color: #fff;
            position: absolute;
            top: 13px;
            right: 13px;
            cursor: pointer;
        }

        img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            z-index: -1;
        }

        /*<!--background:url('../assets/undate.png') left top/ 100% 100%;-->*/
        .title {
            color: #fff;
            font-size: 28px;
            font-weight: bold;
            padding-top: 40px;
            letter-spacing: 1px;
            padding-left: 40px;
            margin-bottom: 20px;
        }

        .words {
            color: #ffffff;
        }
    }
}

/* 黑暗模式处理*/
.dark-mode {
    .company-name {
        color: #ffffff
    }

    .download a {
        color: #ffffff !important;
    }

    .user-info {
        color: #ffffff
    }

    .name {
        color: #ffffff
    }

    .switch-btn {
        border: 1px solid #ffffff !important;
        color: #fff !important;

        &:hover {
            background-color: #fff !important;
            color: var(--el-color-primary) !important;
        }
    }

}
</style>
