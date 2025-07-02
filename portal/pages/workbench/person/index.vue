<script setup>
    // import wxLogin from 'vue-wxlogin';

    import {apiBindingWxAccount,apiGetStaffInfoCopy,apiGetStaffPwd,apiGetMyCompanyList,apiUpdateUserInfo,apiUpdateUser,apiAddUserAccount,apiVerifyPhoneCode,apiBindingPhone,apiCheckUserName,apiSendPhoneCode } from '@/api/api';
    const Config = useAppConfig()
    const {user} = useUser()

    const ruleFormRef = ref('')
    const accountFormRef = ref('')
    const openWxLoginAppId = Config.wxAccountAppId
    const openWxLoginRedirect = encodeURIComponent(getClientDomain('protocol') + '/workbench/person')

    const checkUserName = (rule, value, callback) =>  {
      if(data.info.username) return callback();
      apiCheckUserName({name: data.accountForm.userName}).then((res) => {
        if (res.result == 1) {
          callback('用户名已存在')
        } else {
          callback()
        }
      });
    }

    const data = reactive({
            rules: {
                staffName: [
                    {min: 0, max: 10, message: "姓名不超过10个字", trigger: "blur"},
                ]
            },
            dialogWx:false,
            loginMessage: user ? user.value.bind : null,
            userMessage: user ? user.value.user : null,
            staff:{},//员工信息
            staffCopy:null,//员工信息副本
            userName: null,
            info: {},
            myOrgList: [], // 我创建的企业
            meJoinedOrgList: [], // 我加入的企业
            dialogVisible: false,
            createOrgDialogVisible: false, // 创建企业弹窗
            dialogType: '', // 弹窗类型
            dialogTitle: { 'info': '编辑个人信息', 'account': '编辑账号信息', 'phone': '更换手机号'},
            infoForm: {
                userName: '',

            },
            accountForm: {

            },
            phoneForm: {

            },
            accountFormRules: {
                userName: [
                  { required: true, message: '请输入账号', trigger: 'blur' },
                  { validator: checkUserName , trigger: 'blur' }
                ]
            },
            timer: null,
            timer2: null,
            show: false,
            count: 60,
            showPassword1: false,
            showPassword2: false,
            companyLoading: false,  // 加载我创建的企业列表
        })

    const changeWx = () => {
        let code=useRoute().query.code;
        if(!code)return
        apiBindingWxAccount({staffId:data.loginMessage.staffid.toString(),code:code}).then(res=>{
            const message = res.result
            const event = new CustomEvent('updateWxUserAvatar', { detail: message })
            window.dispatchEvent(event)
            // this.$store.state.user.info.headimgurl = message
            ElMessage.success('绑定成功');
        });
    }

    const getStaffMessage = async() => {
        const res = await apiGetStaffInfoCopy({staffId:data.loginMessage.staffid.toString()})
        data.staff=res.result;
        data.staffCopy=JSON.parse(JSON.stringify(res.result));
    }
    const getPwd = async() => {
        const res = await apiGetStaffPwd({staffId: data.loginMessage.staffid})
        if (res.result) {
            data.info = res.result;
            data.userName = data.info.username;
        }
    }
    // 获取我的企业信息
    const getMyOrgInfo = () => {
        data.companyLoading = true
        apiGetMyCompanyList({id: data.loginMessage.staffid}).then(res => {
            data.myOrgList = res.result.admin || []
            data.meJoinedOrgList = res.result.staff || []
            data.companyLoading = false
        }).catch(e => { data.companyLoading = false })
    }
    // 切换企业
    const switchRoles = (item) => {
        cookies.removeItem('WORKBENCHNID');
        if (cookies.getItem('WORKBENCHNID')) {
            cookies.removeItem('WORKBENCHNID');
        } else {
            switchMember(item);
        }
    }
    // 个人切换到企业工作台
    const switchMember = (item) => {
        let params = {
            staffId: cookies.getItem('staffId'),
            memberId: item.id.toString(),
            type: 2
        }

        apiGetUserInfo(params).then(res => {
            cookies.setItem('kindId', res.result.bind.kindid);

            nextTick(function () {
                if ('firm' == 'firm') {
                    cookies.setItem('memberId', item.id);
                    sessionStorage.setItem('WORKBENCHINDEX', 1);
                }
                // this.$store.state.user.info='';
                cookies.removeItem('wbin');
                // this.$setGlobalState({change:true});
                cookies.setItem('jump', 1);

                if (cookies.getItem('clientType') === 'client') {
                    let res = {}
                    document.cookie.split(";").forEach((item) => {
                        if(item.split("=")[0].trim() !== 'AppCenter'){
                            res[item.split("=")[0].trim()] = item.split("=")[1]
                        }
                    });
                    apiSetClientCookie(res).finally(res => {
                        window.location.href = process.env.VUE_APP_BASE_MACRO_HOST;
                    })
                } else {
                    window.location.href = process.env.VUE_APP_BASE_MACRO_HOST;
                }
            });

        });
    }
    const edit = (type) => {
        data.dialogType = type
        data.dialogVisible = true
        if(type === 'info'){
            data.infoForm = JSON.parse(JSON.stringify(data.staff))

        }else if(data.dialogType === 'account'){
            data.accountForm = {
                userName: data.info.username,
                passWord: '',
                passWordCopy: ''
            }
        }else if(data.dialogType === 'phone'){
            data.phoneForm = {
                mobile: data.info.mobile,
                code: ''
            }
        }else if(data.dialogType === 'wx'){
            data.dialogVisible = false;
            data.dialogWx = true;



        }
    }
    const saveForm = async() => {
        if(data.dialogType === 'info'){
            // console.log('Ref', ruleFormRef)
            ruleFormRef.value.validate((valid) => {
                if(data.infoForm.staffName.length>10)return
                let params={
                    ...data.infoForm,
                    id:data.loginMessage.staffid
                }
                apiUpdateUserInfo(params).then((res)=>{
                    getStaffMessage();
                    ElMessage({
                        message: '编辑个人信息成功！',
                        type: 'success'
                    });
                    data.dialogVisible=false;
                });
            })

        }else if(data.dialogType === 'account'){
            // if (this.promptStatus) {
            //   return false;
            // }
            let reg=/\s+/
            if (reg.test(data.accountForm.passWord)){
                ElMessage({
                    message:'密码中含有非法字符！',
                    type:'error'
                });
                return  false;
            }
            if (data.accountForm.passWord != data.accountForm.passWordCopy || !data.accountForm.passWord) {
                ElMessage({
                    message: '密码为空或者密码不一致，请重新输入',
                    type: 'error'
                });
                return false;
            }

            //密码加密
            let passWord = data.accountForm.passWord;
            passWord = btoa(btoa(passWord));
            passWord = passWord.split('').reverse().join('');

            let params = {};
            let urlWord = '';
            if (data.info.username) {
                urlWord = 'updatePwd';
                params = {
                    password: passWord,
                    username: data.info.userName,
                    staffId: data.loginMessage.staffid,
                    userId: data.info.userId
                };
            } else {
                await accountFormRef.value.validateField(['userName'])
                urlWord = 'submitPwd';
                params = {
                    passWord: passWord,
                    userName: data.accountForm.userName,
                    staffId: data.loginMessage.staffid
                };
            }
            const apiMaping = {
                updatePwd: apiUpdateUser,
                submitPwd: apiAddUserAccount
            }
            apiMaping[urlWord](params).then((res) => {
                ElMessage({
                    message: '编辑账号信息成功！',
                    type: 'success'
                });
                getPwd();
                data.accountForm.passWord = null;
                data.accountForm.passWordCopy = null;
                data.dialogVisible=false;
            });
        }else if(data.dialogType === 'phone'){
            let obj={
                mobile:data.phoneForm.mobile,
                staffId:data.loginMessage.staffid,
            }
            apiVerifyPhoneCode({phone:data.phoneForm.mobile,code:data.phoneForm.code}).then((res)=>{
                apiBindingPhone(obj).then((res)=>{
                    ElMessage({
                        message:'更换手机号成功！',
                        type:'success'
                    });
                    getPwd();
                    data.dialogVisible=false;
                });
            });
        }
    }


    const getCode = () => {
        let {mobile} = data.phoneForm;
        if (!/^1[3456789]\d{9}$/.test(mobile)) {
            ElMessage({
                message: '请输入正确手机号！',
                type: 'error'
            });
            return false;
        }
        apiSendPhoneCode({phone: mobile}).then((res) => {
            ElMessage({
                'message': '短信发送成功！',
                'type': 'success'
            });
            // this.loading=false;
            codeTimer();
        });
    }
    // 验证码倒计时
    const codeTimer = () => {
        data.show = false;
        if (!data.timer2) {
            data.count = 60;
            data.timer2 = setInterval(() => {
                if (data.count > 0 && data.count <= 60) {
                    data.show = true;
                    data.count--;
                } else {
                    data.show = false;
                    clearInterval(data.timer2);
                    data.timer2 = null;
                }
            }, 1000);
        }
    }

    onMounted(async() => {
        await nextTick()
        await getStaffMessage();
        await getPwd()
        getMyOrgInfo()
        changeWx()
    })


</script>

<template>
    <div class="main"  style="padding:0 16px;background-color: #F7F8FA;flex: 1;">
        <img style="margin-top: 16px;margin-bottom: 16px;width: 100%" src="~/assets/img/workbench/person/person-banner.png">
        <el-row :gutter="20" style="margin-bottom:16px;">
            <el-col :span="24">
                <el-card>
                    <div class="title-wrap">
                        <div class="card-title">个人信息</div>
                        <div class="title-control" @click="edit('info')">编辑个人信息 ></div>
                    </div>
                    <el-row style="display: flex;align-items: center;margin-bottom: 16px;">
                        <el-col :span="1" style="text-align: right;padding-right: 10px;margin-left: 5px;">
                            <div class="rowName text-no-wrap">头像：</div>
                        </el-col>
                        <el-col :span="6">
                            <div class=""><img :src="user.headimgurl || ''" alt="" style="width: 60px;height: 60px;border-radius: 50%"></div>
                        </el-col>
                    </el-row>
                    <div style="display: flex;margin-left:-10px;margin-top:30px">
                        <div class="info">
                            <div class="rowName text-no-wrap">姓名：</div>
                            <div class="rowValue" v-if="data.staff.staffName" >{{data.staff.staffName}}</div>
                            <div class="rowValue" style="color: #a2a7b0;font-size: 14px" v-else >待完善</div>
                        </div>
                        <div class="info">
                            <div class="rowName text-no-wrap">邮箱：</div>
                            <div class="rowValue" v-if="data.staff.contactEmail" >{{data.staff.contactEmail}}</div>
                            <div class="rowValue" style="color: #a2a7b0;font-size: 14px" v-else >待完善</div>
                        </div>
                        <div class="info">
                            <div class="rowName text-no-wrap">手机号码：</div>
                            <div class="rowValue" v-if="data.staff.tel" >{{data.staff.tel}}</div>
                            <div class="rowValue" style="color: #a2a7b0;font-size: 14px" v-else >待完善</div>
                        </div>
                    </div>
                    <div style="height:10px"></div>
                </el-card>
            </el-col>


        </el-row>

        <client-only>
            <el-dialog
                    class=""
                    v-model="data.dialogVisible"
                    :close-on-click-modal="false"
                    :title="data.dialogTitle[data.dialogType]"
                    top="27vh"
                    width="480px"
            >
                <template v-if="data.dialogType === 'info'">
                    <el-form ref="ruleFormRef" key="info" size="large" :model="data.infoForm" label-width="100px" :rules="data.rules">
                        <el-form-item label="姓名：" prop="staffName">
                            <el-input placeholder="请输入姓名" v-model.trim="data.infoForm.staffName"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱：">
                            <el-input placeholder="请输入邮箱" v-model.trim="data.infoForm.contactEmail"></el-input>
                        </el-form-item>
                        <!--          <el-form-item label="QQ号码：">-->
                        <!--            <el-input placeholder="请输入QQ号码" v-model.trim="infoForm.contactQq"></el-input>-->
                        <!--          </el-form-item>-->
                    </el-form>
                </template>
                <template v-else-if="data.dialogType === 'account'">
                    <el-form key="account" ref="accountFormRef" size="large" :rules="data.accountFormRules" :model="data.accountForm" label-width="100px">
                        <el-form-item label="账号：" prop="userName">
                            <el-input placeholder="请输入账号" v-model.trim="data.accountForm.userName" :readonly="data.info.username ? true : false"></el-input>
                        </el-form-item>
                        <el-form-item label="新密码：">
                            <el-input :type="data.showPassword1 ? 'text': 'password'" placeholder="请输入新密码" v-model.trim="data.accountForm.passWord">
                                <i slot="suffix" class="el-icon-view" @click="data.showPassword1 = !data.showPassword1" style="margin-right:10px;font-size: 16px;line-height: 40px;cursor: pointer"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="确认密码：">
                            <el-input :type="data.showPassword2 ? 'text': 'password'" placeholder="请再次输入新密码" v-model.trim="data.accountForm.passWordCopy">
                                <i slot="suffix" class="el-icon-view" @click="data.showPassword2 = !data.showPassword2" style="margin-right:10px;font-size: 16px;line-height: 40px;cursor: pointer"></i>
                            </el-input>
                            <span style="color: #999999;font-size: 12px">请输入大小写英文及数字设置密码，让您的密码更安全</span>
                        </el-form-item>
                    </el-form>
                </template>
                <template v-else-if="data.dialogType === 'phone'">
                    <el-form key="phone" size="large" :model="data.phoneForm" label-width="100px">
                        <el-form-item label="手机号码：">
                            <el-input placeholder="请输入手机号" v-model.trim="data.phoneForm.mobile"></el-input>
                        </el-form-item>
                        <el-form-item label="验证码：">
                            <el-input class="valicode-input" placeholder="请输入验证码" v-model.trim="data.phoneForm.code">
                                <template #append class="eeee" style="box-shadow: none">
                                    <span class="getCode" v-if="!data.show" @click="getCode">获取验证码</span>
                                    <span class="getCode" v-else> {{data.count}}s</span>
                                </template>
                            </el-input>
                        </el-form-item>
                    </el-form>
                </template>
                <div style="height: 10px"></div>
                <div style="text-align: center;">
                    <el-button style="width: 80px" @click="data.dialogVisible = false">取消</el-button>
                    <el-button style="width: 80px" type="primary" @click="saveForm">保存</el-button>
                </div>
            </el-dialog>
        </client-only>


        <el-card style="margin-bottom:16px;">
            <div class="card-box">
                <div class="acc-info">
                    <img width="42" src="~/assets/img/workbench/person/acc.png">
                    <div class="words">
                        <div class="title">账号信息</div>
                        <div class="tips">经常更改您的账户密码，以防止他人未经授权访问您的账户</div>
                    </div>
                </div>
                <div class="edit" @click="edit('account')">编辑账号信息 ></div>
            </div>
        </el-card>

        <el-card style="margin-bottom:16px;">
            <div class="card-box">
                <div class="acc-info">
                    <img width="42" src="~/assets/img/workbench/person/bd_phone.png">
                    <div class="words">
                        <div class="title">绑定手机号码</div>
                        <div class="tips">真实的手机号可用于接收短信相关的提醒推送</div>
                    </div>
                </div>
                <div class="edit" @click="edit('phone')">修改手机号码 ></div>
            </div>
        </el-card>
    </div>
</template>

<style lang="scss" scoped>
    .qr-box{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        overflow: hidden;
        iframe{
            height: 200px !important;
        }
        .tips{
            color: #010101;
            font-size: 12px;
            margin: 30px 0 50px 0;
        }
    }
    .card-box{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .acc-info{
            display: flex;
            align-items: center;
            .words{
                margin-left: 16px;
                font-size: 14px;
                .title{
                    font-weight: bold;
                    margin-bottom: 6px;
                }
            }
        }
        .edit{
            font-size: 14px;
            color: var(--el-color-primary);
            cursor: pointer;
        }
    }

    .info{
        display:flex;
        flex-wrap:wrap;
        margin-bottom: 15px;
        margin-right:105px;
        .rowValue{
            width:240px;
        }
        .rowName{
            width:70px;
            text-align:right;
        }
    }
    .title-wrap{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    .base-title{
        height: 20px;
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
    }
    .card-title{
        @extend .base-title;
        font-weight: bold;
    }
    .card-title:before{
        content: '';
        width: 2px;
        height: 17px;
        background-color: #3370FF;
        display: inline-block;
        vertical-align: middle;
        margin-right: 15px;
    }
    .title-control{
        @extend .base-title;
        color: var(--el-color-primary);
        cursor: pointer;
    }
    .rowName{
        line-height: 32px;
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
    }
    .rowValue{
        background-color: rgba(247, 248, 250, 1);
        border: 1px solid rgba(220, 224, 231, 1);
        height: 32px;
        border-radius: 3px;
        line-height: 32px;
        padding: 0 10px;
    }
    .account-info{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 183px;
        background-color: rgba(255, 248, 232, 0.2);
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
        text-align: center;
        font-family: Roboto;
        border: 1px solid rgba(255, 248, 232, 1);
    }
    .company-wrap{
        display: flex;
        /*justify-content: space-between;*/
        flex-wrap: wrap;
    }
    .company-item {
        width: 25%;
        padding-right: 7%;
        text-overflow: ellipsis;
        overflow: hidden;
        color: rgba(16, 16, 16, 1);
        font-size: 16px;
        white-space: nowrap;
        margin-top: 15px;
        margin-bottom: 15px;
    }
    .hover-active:hover{
        cursor: pointer;
        color: var(--el-color-primary);
    }
    .valicode-input{
        :deep(.el-input-group__append){
            position: absolute;
            top: 0;
            right: 0;
            background-color: transparent;
            cursor: pointer;
            color: var(--el-color-primary);
            line-height: 40px;
            border: none;
            letter-spacing: normal;
            box-shadow: none;
        }
    }
    div.el-card{
        border: none;
        box-shadow: none;
    }
    .is-always-shadow{
        box-shadow: none;
    }
    .text-no-wrap{
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .el-icon-question{
        color: #A9AFB8;
    }
    .el-icon-question:hover {
        color: var(--el-color-primary);
    }
</style>

