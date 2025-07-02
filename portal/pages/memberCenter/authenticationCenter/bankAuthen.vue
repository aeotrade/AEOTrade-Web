<script setup>
import { getBankApi, submitBankInfoApi, checkMoneyApi } from "@/api/api";

const router = useRouter();
const route = useRoute();
const { user } = useUser();
let { author } = useAuthor();
const data = reactive({
    step: 1,
    sgsTypeName: null,
    sgsUserStatus: null,
    dialogVisible: false,
    checked: '',
    loginMessage: user.value.bind,
    bankList: [],
    bankValue: '',
    bankInfo: {
        bankAccountName: '',
        bankAccount: '',
        bankSub: ''
    },
    monney: null,
    authticStatus: false
})
onMounted(async () => {
    await nextTick()
    data.sgsTypeName = route.query.sgsTypeName
    data.sgsUserStatus = route.query.sgsUserStatus
    data.vcTemplateId = route.query.vcTemplateId
    data.credentialName = route.query.credentialName
    data.issuerId = route.query.issuerId
    data.issuerName = route.query.issuerName
    if (data.sgsUserStatus == 1) {
        data.step = 3
    }
    getBankList();
})

function getBankList() {
    getBankApi().then(res => {
        data.bankList = res.result;
    });
}

function next() {
    data.step += 1;
}
function kefu() {
    let url = 'https://work.weixin.qq.com/kfid/kfc2982fbad7f93897a'
    if (window.openInBrowser) {
        window.openInBrowser(url)
    } else {
        window.open(url)
    }
}

function submitInfo() {
    if (data.loginMessage.membername !== data.bankInfo.bankAccountName) {
        ElMessage({
            message: '银行开户名与组织名称不一致，请核对信息是否正确',
            type: 'error'
        });
        return
    }
    if (!data.bankInfo.bankAccountName || !data.bankValue || !data.bankInfo.bankSub || !data.bankInfo.bankAccount) {
        ElMessage({
            message: '请检查信息是否填写完整',
            type: 'error'
        });
        return
    }
    if (!data.checked) {
        ElMessage({
            message: '请确认并勾选银行对公账号信息真实有效',
            type: 'error'
        });
        return
    }

    let obj = {
        bankOfDeposit: data.bankValue,
        memberName: data.loginMessage.membername,
        uscc: data.loginMessage.uscc,
        memberId: data.loginMessage.memberid,
        sgsTypeName: data.sgsTypeName
    };
    let bankInfoCopy = { ...data.bankInfo, ...obj };
    submitBankInfoApi({ ...bankInfoCopy }).then(res => {
        data.step = 3;
    });
}

function last() {
    data.step -= 1;
}

function sure() {
    data.dialogVisible = false;
    data.step = 4;
}

function checkMoney() {
    if (data.monney === null) {
        ElMessage({
            message: '请输入到账金额',
            type: 'error'
        });
        return
    }

    if (data.monney <= 0) {
        ElMessage({
            message: '请输入大于 0 的金额',
            type: 'error'
        });
        return
    }


    checkMoneyApi({
        bankMoney: data.monney,
        memberId: data.loginMessage.memberid,
        vcTemplateId: route.query.vcTemplateId,
        credentialName: route.query.credentialName,
        issuerId: route.query.issuerId,
        issuerName: route.query.issuerName,
        staffId: route.query.staffId,
        sgsConfigId: route.query.sgsConfigId
    }).then(res => {
        if (res.result.bank && res.result.bank == 1) {
            data.authticStatus = false;
            author.value = true
        } else {
            data.authticStatus = true;
        }
        data.step += 1;
    });
}
</script>


<template>
    <div>
        <div class="title">银行对公账户认证</div>
        <div class="process">
            <div class="fist process-item success">第一步：确认主体信息</div>
            <div :class="{ 'middle': true, 'process-item': true, 'success': data.step > 1 }">第二步：银行对公账户打款</div>
            <div :class="{ 'middle': true, 'process-item': true, 'success': data.step > 2 }">第三步：输入到账金额</div>
            <div :class="{ 'last': true, 'process-item': true, 'success': data.step > 3 }">第四步：完成</div>
        </div>

        <div class="subContainer">
            <div style="font-size: 18px" v-if="data.step != 4">
                <span class="dian"></span> <span>{{ data.step == 1 ? '主体信息' : data.step == 2 ? '请输入银行对公账户信息' : ''
                    }}</span>
                <span style="font-size: 14px;" v-if="data.step == 3">请在2个工作日内，查询组织银行账户由“慧贸天下（北京）科技有限公司”打款的到账金额，若未收到，请通过
                    <span style="color: var(--el-color-primary);text-decoration: underline;cursor: pointer;"
                        @click="kefu">在线客服</span> 或热线电话010-86398171联系我们。</span>
            </div>
            <el-row type="flex" style="margin-top: 30px" v-if="data.step == 1">
                <el-col :span="2" :push="0">
                    <div class="" style="text-align: center;line-height: 40px;color:#616161">企业名称</div>
                </el-col>
                <el-col :span="7">
                    <div class="">
                        <el-input v-model="data.loginMessage.membername" readonly></el-input>
                    </div>
                </el-col>
                <el-col :span="3">
                    <div class="" style="text-align: center;line-height: 40px;color:#616161">社会信用代码</div>
                </el-col>
                <el-col :span="7">
                    <div class="">
                        <el-input v-model="data.loginMessage.uscc" readonly></el-input>
                    </div>
                </el-col>
            </el-row>

            <div v-if="data.step == 2">
                <el-row type="flex" style="margin-top: 30px">
                    <el-col :span="4" :push="0">
                        <div class="" style="text-align: center;line-height: 40px">银行开户名</div>
                    </el-col>
                    <el-col :span="8">
                        <div class="">
                            <el-input placeholder="银行开户名和企业名称保持一致" v-model="data.bankInfo.bankAccountName"></el-input>
                        </div>
                    </el-col>
                </el-row>
                <el-row type="flex" style="margin-top: 30px">
                    <el-col :span="4" :push="0">
                        <div class="" style="text-align: center;line-height: 40px">开户银行</div>
                    </el-col>
                    <el-col :span="8">
                        <div class="">
                            <el-select v-model="data.bankValue" placeholder="请下拉选择或输入名称快速搜索" filterable clearable>
                                <el-option v-for="item in data.bankList" :key="item.id" :label="item.bankName"
                                    :value="item.bankName">
                                </el-option>
                            </el-select>
                        </div>
                    </el-col>
                    <el-col :span="10" :push="1">
                    </el-col>
                </el-row>
                <el-row type="flex" style="margin-top: 30px">
                    <el-col :span="4" :push="0">
                        <div class="" style="text-align: center;line-height: 40px">开户支行</div>
                    </el-col>
                    <el-col :span="8">
                        <div class="">
                            <el-input placeholder="请输入开户支行名称" v-model="data.bankInfo.bankSub"></el-input>
                        </div>
                    </el-col>
                </el-row>
                <el-row type="flex" style="margin-top: 30px">
                    <el-col :span="4" :push="0">
                        <div class="" style="text-align: center;line-height: 40px">银行账号</div>
                    </el-col>
                    <el-col :span="8">
                        <div class="">
                            <el-input placeholder="请输入企业对公账号" v-model="data.bankInfo.bankAccount"></el-input>
                        </div>
                    </el-col>
                </el-row>
                <hr style="background-color: #eee;border:none;height: 1px;margin: 20px 0">
                <!--<hr style="background-color: #eee;border:none;height: 1px;margin: 20px 0">-->
                <el-checkbox v-model="data.checked">
                    我确认填写的银行对公账户信息真实有效，若有虚假信息，由此带来的结果全部由本人承担。
                </el-checkbox>
            </div>

            <div v-if="data.step == 3">
                <div class="moneyBox">
                    <div>
                        金额
                        <input type="number" class="inputMoney" placeholder="请输入到账金额" v-model="data.monney">
                        元
                    </div>
                </div>
            </div>

            <div style="display: flex;justify-content: center" v-if="data.step !== 4">
                <div class="hyBtn margin-center" @click="next" v-if="data.step == 1">下一步</div>
                <div class="hyBtn margin-center" @click="last" v-if="data.step != 1 && data.step != 3">上一步</div>
                <div class="hyBtn margin-center" @click="submitInfo" v-if="data.step == 2">提交</div>
                <div class="hyBtn margin-center" @click="checkMoney" v-if="data.step == 3">立即认证</div>
            </div>

            <div v-if="data.step == 4" class="successBox">
                <div v-if="!data.authticStatus">
                    <el-icon class="el-icon">
                        <SuccessFilled />
                    </el-icon>
                    <h3>认证成功</h3>
                    <p style="margin: 40px 0;">恭喜您认证成功，您现在可以享受更多应用服务。</p>
                </div>
                <div v-else>
                    <el-icon class="el-icon" style="color:#FF7272">
                        <CircleCloseFilled />
                    </el-icon>
                    <h3 style="color:#FF7272">认证失败</h3>
                    <p style="margin: 40px 0;">填写金额与实际打款金额不一致，请重新发起认证</p>
                </div>

                <div class="toWorkBench" @click="router.push('/memberCenter/authenticationCenter')">返回首页</div>
            </div>
        </div>

        <div class="messageBox" v-if="data.dialogVisible">
            <div class="modal"></div>
            <transition name="el-zoom-in-top">
                <div v-show="data.dialogVisible">
                    <div class="messageType">
                        <p class="promptShit">请耐心等候金额</p>
                        <div class="hyBtn margin-center" @click="sure">确定</div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>


<style scoped lang="scss">
.color-blue {
    color: var(--el-color-primary);
}

.lineHeight-40 {
    line-height: 40px;
}

.margin-center {
    margin: 30px 20px;
}

.hyBtn {
    width: 120px;
    height: 30px;
    line-height: 30px;
    border-radius: 90px 90px 90px 90px;
    background-color: rgba(var(--el-color-primary-rgb), 1);
    color: #fff;
    font-size: 14px;
    text-align: center;
    box-shadow: 0px 2px 6px 0px rgba(64, 96, 250, 0.25);
    border: 1px solid rgba(255, 255, 255, 0);
    cursor: pointer;
}

.title {
    color: #616161;
    font-size: 18px;
    padding: 40px 0;
    border-bottom: 1px solid #E0E0E0;
}

.dian {
    width: 6px;
    height: 6px;
    display: inline-block;
    border-radius: 6px;
    background-color: rgba(var(--el-color-primary-rgb), 1);
    border: 1px solid rgba(255, 255, 255, 0);
    margin-right: 5px;
    position: relative;
    top: -3px;
}

.process {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.process-item {
    width: 270px;
    height: 50px;
    line-height: 50px;
    background-color: #fff;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0);
    position: relative;
    margin-right: 59px;
    color: #616161;
    text-indent: 26px;
    font-size: 16px;

    &:last-child {
        margin: 0;
    }
}

.fist:after {
    content: '';
    position: absolute;
    height: 0;
    width: 0;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    border-color: #fff transparent transparent transparent;
    border-style: solid;
    border-width: 46px 34px 10px 21px;
    transform: rotate(25deg);
    right: -41px;
    top: 8px;
}

.middle:before {
    content: '';
    position: absolute;
    height: 0;
    width: 0;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    border-color: #F2F3F5 transparent transparent transparent;
    border-style: solid;
    border-width: 46px 34px 10px 21px;
    transform: rotate(25deg);
    left: -19px;
    top: 8px;
}

.middle:after {
    content: '';
    position: absolute;
    height: 0;
    width: 0;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    border-color: #fff transparent transparent transparent;
    border-style: solid;
    border-width: 46px 34px 10px 21px;
    transform: rotate(25deg);
    right: -41px;
    top: 8px;
}

.last:before {
    content: '';
    position: absolute;
    height: 0;
    width: 0;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
    border-color: #F2F3F5 transparent transparent transparent;
    border-style: solid;
    border-width: 46px 34px 10px 21px;
    transform: rotate(25deg);
    left: -19px;
    top: 8px;
}

.success {
    color: #fff;
    background-color: var(--el-color-primary);

    &:after {
        border-color: var(--el-color-primary) transparent transparent transparent;
    }
}

.subContainer {
    width: 100%;
    line-height: 20px;
    box-shadow: 0px 2px 6px 0px rgba(var(--el-color-primary-rgb), 0.1);
    border: 2px solid rgba(255, 255, 255, 0);
    margin-top: 20px;
    background-color: #fff;
    padding: 20px;
}

.loginBox {
    width: 510px;
    height: 350px;
    background-color: rgba(255, 255, 255, 1);
    color: rgba(16, 16, 16, 1);
    box-shadow: 0px 4px 10px 0px rgba(var(--el-color-primary-rgb), 0.2);
    border: 1px solid rgba(255, 255, 255, 0);
    margin: 60px auto;
    padding: 20px;

    .loginTitle {
        color: rgba(74, 74, 74, 1);
        font-size: 18px;
        text-align: center;
        border-bottom: 1px solid #EEEEEE;
        padding: 20px 0;
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
        border: none;
        border-bottom: 1px solid #f8f8f8;
        text-indent: 30px;
        cursor: pointer;
    }

    .getCheckCode {
        position: absolute;
        right: 0px;
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


.btn-group {
    display: flex;
    justify-content: center;

    .hyBtnSmall {
        width: 80px;
        height: 24px;
        line-height: 22px;
        border-radius: 100px 100px 100px 100px;
        text-align: center;
        margin-left: 10px;
        cursor: pointer;
    }

    .bac-white {
        background-color: rgba(255, 255, 255, 1);
        color: #616161;
        border: 1px solid rgba(220, 223, 230, 1);
    }

    .bac-blue {
        background-color: var(--el-color-primary);
        color: #fff;
    }
}

.successBox {
    text-align: center;
    margin-top: 30px;

    .el-icon {
        font-size: 56px;
        color: #34C758;
    }

    h3 {
        font-size: 18px;
        color: #34C758;
        margin: 20px 0;
    }

    p {
        color: #616161;
        line-height: 30px;
    }
}

.toWorkBench {
    width: 200px;
    height: 40px;
    line-height: 40px;
    border-radius: 46px;
    background-color: rgba(var(--el-color-primary-rgb), 0.03);
    color: var(--el-color-primary);
    font-size: 16px;
    margin: 30px auto 50px;
    cursor: pointer;
    text-align: center;
    border: 1px solid rgba(var(--el-color-primary-rgb), 1);
}

.moneyBox {
    width: 100%;
    padding: 60px 0;
    margin: 30px 0;
    border-top: 1px solid #E0E0E0;
    border-bottom: 1px solid #E0E0E0;
    color: #FF9100;
    font-size: 20px;
    display: flex;
    justify-content: center;

    .inputMoney {
        width: 382px;
        outline: none;
        border: none;
        border-bottom: 1px solid #FF9100;
        font-size: 40px;
        text-align: center;
        color: #FF9100;
    }

    .inputMoney::-webkit-input-placeholder {
        color: rgba(247, 178, 39, 0.63);
        font-size: 22px;
    }

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
    width: 464px;
    height: 275px;
    border-radius: 3px;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0px 5px 12px 0px rgba(var(--el-color-primary-rgb), 0.25);
    border: 1px solid rgba(255, 255, 255, 0);
    position: absolute;
    left: 0;
    right: 0;
    top: 200px;
    margin: 0 auto;
    padding: 30px;

    .promptShit {
        color: rgba(97, 97, 97, 1);
        font-size: 16px;
        padding: 20px 0;
    }
}
</style>

<style scoped>
:deep(.el-input__wrapper) {

    width: 100%;
    height: 40px;
    line-height: 40px;
    background-color: #f2f3f5;
    border: 1px solid rgba(255, 255, 255, 0);
}

:deep(.el-select) {
    width: 100%;
}

:deep(.el-checkbox__label) {
    color: #424242;
}
</style>
