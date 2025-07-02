<script setup>
import { getAuthenticationTypeListApi, getMainManagerApi, checkCodeApi, apiSendPhoneCode, apiGetStaffInfo, getTxListApi, vcLog } from '@/api/api'
import moment from "moment";
const router = useRouter();
const route = useRoute();
const { user } = useUser();
const Config = useAppConfig()
const data = reactive({
    dialogVisible: false,
    authenticList: [],
    phoneObj: {
        phone: '',
        code: ''
    },
    routerUrl: null,
    loginMessage: user.value.bind,
    anthenStatus: null,
    showPrompt: false,
    phoneStatus: false,
    authenticUrl: {
        '768414024873279488': '/memberCenter/authenticationCenter/bankAuthen',
    },
    currentAuthItemId: '',
    show: false,
    count: 60,
    authenticationTypeList: null,
    sgsTypeName: '',
    sgsUserStatus: '',
    authInfo: null,
    dialogVisibleAuthChain: false,
    did: null,
    logVisible: false,
    logList: [],
    currentPage: 1,
    pageSize: 10,
    totalSize: 0
});
onMounted(async () => {
    await nextTick()
    getList();
    getTxList()
})
function getVcLog() {
    data.logVisible = true;
    vcLog({
        memberId: data.loginMessage.memberid,
        pageNo: data.currentPage,
        pageSize: data.pageSize,
    }).then(res => {
        data.logList = res.result
        data.totalSize = res.totalSize

    })
}
// 获取链上身份节点信息
function getTxList() {
    getTxListApi(data.loginMessage.memberid).then(res => {
        data.did = res.result && res.result.did
    })
}
function getList() {
    let params = {
        id: data.loginMessage.kindid != 99 ? data.loginMessage.memberid : data.loginMessage.staffid,
        type: data.loginMessage.kindid != 99 ? '1' : '0'
    };
    getAuthenticationTypeListApi(params).then((res) => {
        data.authenticList = res.result;
        data.authInfo = res.result[3]
        data.authenticList.forEach(item => {
            if (item.sgsUserStatus == 2) {
                data.showPrompt = true;
            }
        });
    });
}

function getUrl(id) {
    return data.authenticUrl[id];
}

const toAuthen = async (url, type, name, categoryId, authInfo) => {
    if (type == 2) {
        ElMessageBox.alert('您已完成该认证，不能重复进行认证！', '提示', {
            confirmButtonText: '确认',
        })
        return false;
    }
    if (type == 1 && categoryId != '768414024873279488') {
        ElMessageBox.alert('审核中，请等待！', '提示', {
            confirmButtonText: '确认',
        })
        return false;
    }
    data.currentAuthItemId = categoryId
    const res = await apiGetStaffInfo({ staffId: data.loginMessage.staffid.toString() })
    if (res.result && res.result.tel) {
        data.phoneObj.phone = res.result.tel
    }
    data.dialogVisible = true;
    data.routerUrl = url;
    data.sgsTypeName = name;
    data.sgsUserStatus = type;
    data.authInfo = authInfo
}

function sure() {
    if (!data.phoneObj.phone) {
        data.dialogVisible = false;
        return false;
    }
    checkCodeApi({ ...data.phoneObj }).then(res => {
        ElMessage({
            message: '验证成功！',
            type: 'success'
        });
        router.push({
            path: data.routerUrl,
            query: {
                sgsTypeName: data.sgsTypeName, sgsUserStatus: data.sgsUserStatus,
                vcTemplateId: data.authInfo.vcTemplateId, credentialName: data.authInfo.credentialName,
                issuerId: data.authInfo.issuerId, issuerName: data.authInfo.issuerName, staffId: data.loginMessage.staffid.toString(), sgsConfigId: data.authInfo.id.toString()
            }
        });
    });
}

function getCode() {
    if (data.phoneObj.phone.length !== 11) {
        return false;
    }
    apiSendPhoneCode({ phone: data.phoneObj.phone }).then((res) => {
        ElMessage({
            'message': '短信发送成功！',
            'type': 'success'
        });
        codeTimer();
    });
}

// 验证码倒计时
function codeTimer() {
    data.show = false;
    if (!data.timer) {
        data.count = 60;
        data.timer = setInterval(() => {
            if (data.count > 0 && data.count <= 60) {
                data.show = true;
                data.count--;
            } else {
                data.show = false;
                clearInterval(data.timer);
                data.timer = null;
            }
        }, 1000);
    }
}
function handleSizeChange(val) {
    data.currentPage = 1;
    data.pageSize = val;
    getVcLog();
}


function handleCurrentChange(val) {
    data.currentPage = val;
    getVcLog();
}
</script>


<template>
    <div class="sm-container">
        <div class="title">
            <span>请选择需申请的数字凭证</span>
            <button @click="getVcLog">认证记录</button>
        </div>
        <ul class="typeList">
            <li v-for="item in data.authenticList">
                <img :src="item.ico" alt="" style="margin: 10px 0">
                <h3>{{ item.sgsName }}</h3>

                <p style="font-size: 12px;color: #666666">{{ item.description }}</p>
                <button style="margin-bottom:90px"
                    @click="toAuthen(getUrl(item.id), item.sgsUserStatus, item.sgsName, item.id, item)">立即认证
                </button>
                <div style="height: 0px;border-bottom:1px solid rgba(61,90,254,0.1);margin-bottom:5px"></div>
                <div style="text-align: left"><span>颁发机构:</span><span>{{ item.issuerName }}</span></div>
            </li>
        </ul>

        <el-dialog custom-class="auth-center-dialog" v-model="data.dialogVisible" :close-on-click-modal="false"
            title="为确认是您本人操作，请完成以下验证" top="37vh" width="480px">

            <div v-if="data.phoneObj.phone">
                <div class="inputItem">
                    <div style="display: inline-block;line-height:40px;width: 90px;text-align:right">手机号码：</div>
                    <input type="text" style="text-indent: 10px" placeholder="请输入手机号码" v-model="data.phoneObj.phone"
                        disabled>
                </div>
                <p class="notification"></p>
                <div class="inputItem">
                    <div style="display: inline-block;line-height:40px;width: 90px;text-align:right">验证码：</div>
                    <input type="text" placeholder="请输入验证码" style="text-indent: 10px" v-model="data.phoneObj.code">
                    <label @click="getCode" v-if="!data.show" class="getCheckCode">获取验证码</label>
                    <label v-else class="getCheckCode" style="color: #837f86;cursor: default">{{ data.count }}s</label>
                </div>
                <p class="notification"></p>
            </div>

            <div v-else>
                <p class="messageHeader">提示</p>
                <p class="messageText">您好，当前没有可验证的手机号码。请通知管理员绑定手机号码，进行验证。</p>
            </div>

            <div style="height: 18px"></div>
            <div style="text-align: center;">
                <el-button size="small" style="width: 80px;font-size: 14px" @click="data.dialogVisible = false">取消
                </el-button>
                <el-button size="small" style="width: 80px;font-size: 14px" type="primary" @click="sure">确定</el-button>
            </div>
            <div style="height: 10px"></div>
        </el-dialog>

        <el-dialog custom-class="auth-center-dialog" v-model="data.logVisible" :close-on-click-modal="false"
            title="认证记录" top="37vh" width="1120px">
            <el-table :data="data.logList" style="width: 100%">
                <el-table-column prop="credentialName" align="center" label="凭证名称">
                </el-table-column>
                <el-table-column prop="isuserName" align="center" label="凭证颁发机构">
                </el-table-column>
                <el-table-column prop="createAt" align="center" label="申请时间">
                    <template #default="scope">
                        {{ moment(scope.row.createAt).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>
                </el-table-column>
                <el-table-column prop="createAt" align="center" label="认证完成时间">
                    <template #default="scope">
                        {{ moment(scope.row.createAt).format('YYYY-MM-DD HH:mm:ss') }}
                    </template>

                </el-table-column>
                <el-table-column prop="applyStatus" align="center" label="状态">
                </el-table-column>
            </el-table>
            <div style="margin-top: 20px;float:right;padding-bottom: 20px">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="data.currentPage" :page-sizes="[5, 10, 20]" :page-size="data.pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="Number(data.totalSize)">
                </el-pagination>
            </div>
            <div style="margin-top: 20px;padding-bottom: 20px"></div>
        </el-dialog>
    </div>
</template>


<style scoped lang="scss">
.color-61 {
    color: #616161;
}

.color-bd {
    color: rgba(102, 102, 102, 100);
    font-family: SourceHanSansSC-regular;
}

.sm-container {
    background-color: #fff;
    padding: 0 40px 50px;
}

.title {
    height: 80px;
    line-height: 80px;
    color: #101010;
    font-size: 18px;
    border-bottom: 1px solid #EEEEEE;
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
        width: 80px;
        height: 30px;
        line-height: 30px;
        border-radius: 90px 90px 90px 90px;
        background-color: #fff;
        color: rgba(var(--el-color-primary-rgb), 1);
        cursor: pointer;
        text-align: center;
        box-shadow: 0px 2px 6px 0px rgba(64, 96, 250, 0.25);
        border: 1px solid rgba(var(--el-color-primary-rgb), 1);
    }
}

.prompt {
    width: 100%;
    height: 34px;
    line-height: 34px;
    background-color: rgba(255, 196, 0, 0.08);
    color: #424242;
    border: 1px solid rgba(255, 196, 0, 0.6);
    padding-left: 20px;
    margin-top: 20px;
}

.typeList {
    display: flex;
    margin-top: 20px;
    flex-wrap: wrap;

    li {
        padding: 30px 20px 0 20px;
        flex-shrink: 0;
        width: 280px;
        line-height: 40px;
        margin-right: 30px;
        background-color: rgba(255, 255, 255, 1);
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
        text-align: center;
        font-family: Roboto;
        border: 1px solid rgba(var(--el-color-primary-rgb), 0.1);
        margin-bottom: 20px;

        &:nth-child(3n) {
            margin-right: 0px;
        }

        &:hover {
            box-shadow: 0px 10px 16px -3px rgba(var(--el-color-primary-rgb), 0.2);
            font-family: Roboto;
            border: 1px solid rgba(var(--el-color-primary-rgb), 1);
        }
    }

    .disabled {
        background-color: rgba(255, 255, 255, 0);
        border: 1px solid rgba(var(--el-color-primary-rgb), 0.1);

        p {
            color: #ccc !important;
        }

        &:hover {
            box-shadow: none;
        }

        button {
            border-radius: 90px 90px 90px 90px;
            background-color: rgba(204, 204, 204, 100);
            color: rgba(255, 255, 255, 100);
            box-shadow: none;
            cursor: default;
        }

        button:hover {
            cursor: default;
            background-color: rgba(204, 204, 204, 100);
            color: rgba(255, 255, 255, 100);
        }
    }

    h3 {
        color: rgba(var(--el-color-primary-rgb), 1);
        font-size: 20px;
    }

    .successTime {
        color: rgba(255, 61, 0, 1);
        font-size: 12px;
    }

    img {
        width: 60px;
        height: 60px;
    }

    .subTitle {
        color: rgba(66, 66, 66, 1);
        font-size: 14px;
    }

    button {
        width: 120px;
        height: 30px;
        line-height: 30px;
        border-radius: 90px 90px 90px 90px;
        background-color: rgba(var(--el-color-primary-rgb), 1);
        color: #fff;
        cursor: pointer;
        text-align: center;
        box-shadow: 0px 2px 6px 0px rgba(64, 96, 250, 0.25);
        border: 1px solid rgba(255, 255, 255, 0);
        margin-bottom: 26px;
    }

    button:hover {
        background-color: rgba(var(--el-color-primary-rgb), 0.9);
    }

    .status {
        display: flex;
        justify-content: space-between;
    }

    .border-top {
        border-top: 1px solid #eee;
    }

    span {
        font-size: 12px;
    }
}


.inputItem {
    display: flex;
    position: relative;

    .icon {
        position: absolute;
        left: 0;
        top: 13px;
        color: #ccc;
    }

    input {
        width: 100%;
        line-height: 40px;
        border: 1px solid rgba(220, 224, 231, 1);
        text-indent: 30px;
        border-radius: 5px;
        cursor: pointer;
    }

    input:focus {
        border: 1px solid var(--el-color-primary);
    }

    .getCheckCode {
        position: absolute;
        right: 10px;
        top: 10px;
        color: rgba(var(--el-color-primary-rgb), 1);
        cursor: pointer;
    }
}

.notification {
    color: rgba(255, 61, 0, 1);
    font-size: 12px;
    margin: 8px 0;
    height: 16px;
}

.messageBox {
    width: 100%;
    height: calc(100vh - 90px);
    position: fixed;
    z-index: 999;
    top: 90px;
    left: 0;

    .modal {
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: .2;
    }
}

.messageType {
    width: 500px;
    height: 300px;
    border-radius: 3px;
    background-color: rgba(255, 255, 255, 1);
    border: 1px solid rgba(255, 255, 255, 0);
    position: absolute;
    left: 0;
    right: 0;
    top: 200px;
    margin: 0 auto;
    padding: 30px;

    .messageHeader {
        font-size: 18px;
        text-align: center;
        margin: 20px 0px 30px 0;
    }

    .messageText {
        color: #616161;
        margin: 40px 0;
        line-height: 20px;
        text-align: center;
    }

    .promptShit {
        color: rgba(66, 66, 66, 1);
        font-size: 18px;
        font-weight: 600;
        padding: 0px 0px 20px;

        .el-icon-close {
            cursor: pointer;
            float: right;
        }

        .el-icon-close:hover {
            color: rgba(var(--el-color-primary-rgb), 1);
        }
    }
}

.btn-group {
    display: flex;
    justify-content: center;

    .hyBtnSmall {
        width: 120px;
        height: 30px;
        line-height: 30px;
        border-radius: 100px 100px 100px 100px;
        text-align: center;
        cursor: pointer;
        font-size: 16px;
    }

    .hyBtnSmall:nth-child(1) {
        margin-right: 20px;
    }

    .bac-white {
        background-color: rgba(255, 255, 255, 1);
        color: var(--el-color-primary);
        border: 1px solid rgba(var(--el-color-primary-rgb), 0.3);
    }

    .bac-blue {
        background-color: var(--el-color-primary);
        color: #fff;
    }

    .bac-blue:hover {
        background-color: rgba(var(--el-color-primary-rgb), 0.9);
    }
}
</style>

<style scoped>
:deep(.el-input__inner) {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background-color: #f2f3f5;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0);
}

:deep(.el-select .el-input__inner) {
    border: none !important;
    padding: 0px !important;
    width: 40px;
    background-color: #fff;
}

:deep(.el-select--mini) {
    width: 63px;
    left: 20px;
    position: absolute;
}

:deep(.el-select.el-input) {
    margin: 6px 0;
}

:deep(.el-select .el-input.is-disabled .el-input__inner) {
    background-color: #e3e3e3;
    cursor: pointer;
}

:deep(.auth-center-dialog .el-dialog__title) {
    font-size: 16px;
    color: rgb(16, 16, 16);
    font-weight: bold;
}
</style>

<style>
.single-auth-err {
    width: 666px;
}
</style>
