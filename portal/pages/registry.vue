<script setup>
    import {sendCode, findMobile, checkCodeApi, bangdingApi} from '@/api/api'

    const {user} = useUser();
    const router = useRouter();
    const route = useRoute();
    const ruleForm = ref(null)
    const data = reactive({
        ruleForm: {
            url: 'http://aeotrade-launch-advisor.oss-cn-zhangjiakou.aliyuncs.com/cf092c99-8131-4c52-a063-9a977d064a7e.png',
            staffname: user.value.bind.staffname,
            phone: '',
            code: ''
        },
        show: false,
        count: 60,
        timer: null,
        checked: true,
        actionUrl: import.meta.env.VITE_BASE_URL + '/img/oss/upload',
        phoneTimeOut: null,
        isRegistry: false,
        loginMessage: user.value.bind,
        rules: {
            url: [
                {required: true, message: '请上传头像', trigger: 'blur'},
            ],
            staffname: [
                {required: true, message: '请输入姓名', trigger: 'blur'},
            ],
            phone: [
                {required: true, message: '请输入手机号', trigger: 'blur'},
                {min: 11, max: 11, message: '请输入正确手机号', trigger: 'blur'}
            ],
            code: [
                {required: true, message: '请输入验证码', trigger: 'blur'},
            ]
        }
    })

    function handleAvatarSuccess(res, file) {
        data.ruleForm.url = res.result.fileDownloadUri
    }

    function beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt4M = file.size / 1024 / 1024 < 4;

        if (!(isJPG || isPNG)) {
            ElMessage.error('上传头像图片只能是 JPG、PNG 格式!');
        }
        if (!isLt4M) {
            ElMessage.error('上传头像图片大小不能超过 4MB!');
        }
        return (isJPG || isPNG) && isLt4M;
    }

    function changePhone() {
        if (data.ruleForm.phone.length !== 11) return false
        clearTimeout(data.phoneTimeOut); // 每次进来的时候都将之前的清除掉，如果还没到一秒的时候就将之前的清除掉，这样就不会触发之前setTimeout绑定的事件， 如果超过一秒，之前的事件就会被触发下次进来的时候同样清除之前的timer
        data.phoneTimeOut = setTimeout(() => {
            // 切换为搜索
            checkPhone();
        }, 800);
    }

    function checkPhone() {
        findMobile({phone: data.ruleForm.phone}).then((res) => {
            if (res.result == 1) {
                data.isRegistry = true
                ElMessage({
                    'message': '当前号码已经注册!',
                    'type': 'error'
                });
            } else {
                data.isRegistry = false
            }
        });
    }

    function submitPhone() {
        if (!data.checked) {
            ElMessage({message: '请阅读并同意《平台协议》和《隐私政策》', type: 'error'})
            return false
        }
        ruleForm.value.validate((valid) => {
            if (valid) {
                let params = {
                    url: data.ruleForm.url,
                    staffname: data.ruleForm.staffname,
                    mobile: data.ruleForm.phone,
                    staffId: data.loginMessage.staffid,
                }
                checkCodeApi({phone: data.ruleForm.phone, code: data.ruleForm.code}).then((res) => {
                    if (res.code == 200) {
                        bangdingApi(params).then((res) => {

                            let bindData = user.value.bind
                            if (!bindData.lastMemberId) {
                                cookies.setItem('memberId', bindData.memberid)
                                cookies.setItem('kindId', 99)
                                // window.location.replace(process.env.macroApp)
                            } else {
                                cookies.setItem('memberId', bindData.lastMemberId)
                                cookies.setItem('kindId', bindData.lastKindId)
                                cookies.setItem('WORKBENCHN', bindData.workbenchName)
                                cookies.setItem('DefaultWORKBENCHNID', bindData.lastWorkbenchId)
                                cookies.setItem('WORKBENCHNID', bindData.lastWorkbenchId)
                                cookies.setItem('channelColumnsId', bindData.channelColumnsId)
                                // window.location.replace(process.env.macroApp)
                            }


                            window.location.replace(route.query.path ? route.query.path : '/workbench')
                        })
                    } else {
                        ElMessage({message: '验证码错误', type: 'error'})
                    }
                }).catch(err => {

                });
            } else {
                console.log('error submit!!');
                return false;
            }
        });
    }

    function getCode() {
        if (data.isRegistry) {
            ElMessage({
                'message': '当前号码已经注册,请换个手机号!',
                'type': 'error'
            });
            return false
        }
        data.ruleForm.phone = data.ruleForm.phone.trim()
        if (data.ruleForm.phone.length !== 11) {
            ruleForm.value.validateField('phone', (string) => {
                console.log(string)
            });
            return false;
        }
        sendCode({phone: data.ruleForm.phone}).then((res) => {
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

    function jump(url) {
        window.location.replace(url);
    }

    function exsit() {
        delCookie()
        window.location.href = '/';
    }

    function delCookie() {
        let keys = document.cookie.match(/[^ =;]+(?==)/g)
        if (keys) {
            for (var i = keys.length; i--;) {
                document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString() // 清除当前域名下的,例如：m.ratingdog.cn
                document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString() // 清除当前域名下的，例如 .m.ratingdog.cn
                document.cookie = keys[i] + '=0;path=/;domain=aeotrade.com;expires=' + new Date(0).toUTCString() // 清除一级域名下的或指定的，例如 .ratingdog.cn
            }
        }
    }
</script>

<template>
    <div :style="{position:'relative'}" class="back-color main-container">
        <div class="top-bar">
            <div class="login-header">
                <img height="34px" src="@/assets/img/portal/logo.svg" alt="" class="logoImg">
                <span class="color-black" style="flex: 1;text-align: right">开启您的贸易数字化之旅</span>
                <!--        <div class="m-user" title="退出系统" @click="exsit" style="margin-left:20px;width: 26px;height: 26px;border-radius: 100%;background-color: #fff;color: #333;display: flex;align-items: center;justify-content: center;box-shadow: 1px 1px 4px rgba(0,21,41,.08);">-->
                <!--          <img src="../static/new_image/exit.svg" class="m-user-head" style=" width: 12px;height: 12px;cursor: pointer;" title="退出系统">-->
                <!--        </div>-->
            </div>
        </div>
        <main>
            <div class="hmm-card ">
                <div class="main-tooltip color-deepBlue">
                    <span>请完善您的个人信息，开启您的慧贸之旅</span>
                </div>

                <el-form
                        :model="data.ruleForm"
                        :rules="data.rules"
                        ref="ruleForm"
                        label-width="100px"
                        class="demo-ruleForm">
                    <el-form-item label="头像">
                        <template slot="label">
                            <span style="line-height: 80px">头像</span>
                        </template>
                        <div style="display: flex;align-items: center">
                            <div class="avatar-uploader">
                                <img v-if="data.ruleForm.url" :src="data.ruleForm.url" class="avatar"
                                     style="width: 100%">
                            </div>
                            <el-upload
                                    :action="data.actionUrl"
                                    :show-file-list="false"
                                    :on-success="handleAvatarSuccess"
                                    :before-upload="beforeAvatarUpload"
                                    :headers="{
                                        'Authorization': 'Bearer ' + cookies.getItem('token')
                                    }"
                            >
                                <el-button style="margin-left: 20px" size="mini">编辑头像</el-button>
                            </el-upload>
                        </div>
                    </el-form-item>
                    <el-form-item label="姓名" prop="staffname">
                        <el-input v-model="data.ruleForm.staffname" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop="phone">
                        <el-input v-model="data.ruleForm.phone" @input="changePhone" placeholder="请输入手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="验证码" prop="code">
                        <el-input v-model="data.ruleForm.code" placeholder="请输入手机验证码"></el-input>
                        <span class="getCheckCode support-click" v-if="!data.show" @click="getCode">获取验证码</span>
                        <span class="getCheckCode" v-else>{{data.count}}s</span>
                    </el-form-item>
                </el-form>
                <div class="checkbox">
                    <el-checkbox v-model="data.checked">已阅读并同意<span class="color-deepBlue">
            <a href="https://help.aeotrade.com/b01d/4522" target="_blank">《平台协议》</a>
            <span style="color:#424242">和</span><a target="_blank" href="https://help.aeotrade.com/b01d/136a">《隐私政策》</a>
                        <!--            <router-link :to="{path:'/agreement',query:{id:'148100'}}" target="_blank">《平台协议》</router-link>-->
          </span></el-checkbox>
                    <br>
                    <button class="btn" @click="submitPhone">确认</button>
                </div>
            </div>

            <div class="m-copyright">
                <div>
                    <p>Copyright@2019Aeotrade.All Rights Reserved-慧贸天下·版权所有 <span>慧贸天下(北京)科技有限公司</span></p>
                    <p><a href="https://beian.miit.gov.cn" target="_blank">京ICP备16013219号-1</a></p>
                </div>
            </div>
        </main>
    </div>
</template>


<style scoped lang="scss">
    .top-bar {
        width: 100%;
        height: 90px;
        background-color: #fff;
        box-shadow: 0px 1px 4px 0px rgba(var(--el-color-primary-rgb), 0.1);
    }

    .login-header {
        width: 1200px;
        height: 90px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 auto;

        .logoImg {
            width: 276px;
            /*height: 52px;*/
            cursor: pointer;
        }

        span {
            font-size: 18px;
        }
    }

    main {
        height: calc(100vh - 90px);
        padding-top: 50px;
    }

    .hmm-card {
        width: 1200px;
        height: 580px;
        margin: 0 auto;
        padding: 0 50px;
    }

    .main-tooltip {
        text-align: center;
        height: 100px;
        line-height: 100px;
        border-bottom: 1px solid var(--el-color-primary);

        span {
            font-size: 20px;
        }
    }

    .demo-ruleForm {
        width: 500px;
        margin: 20px auto;
    }

    .getCheckCode {
        position: absolute;
        width: fit-content;
        right: 16px;
        top: 0px;
        color: var(--el-color-primary);
    }

    .checkbox {
        text-align: center;
    }

    .btn {
        color: var(--el-color-primary);
        width: 98px;
        height: 40px;
        line-height: 39px;
        border-radius: 3px;
        background-color: rgba(var(--el-color-primary-rgb), 100);
        color: rgba(255, 255, 255, 100);
        border: 1px solid rgba(255, 255, 255, 100);
        margin-top: 23px;
        cursor: pointer;

        &:hover {
            background-color: #5370fb;
        }
    }

    .m-copyright {
        position: absolute;
        bottom: 0px;
        width: 100%;
        display: flex;
        background-color: #404347;
        justify-content: center;
        line-height: 30px;
        color: #fff;
        text-align: center;
        border-top: 1px solid #a9acb3;

        span {
            margin-left: 30px;
        }
    }

    @media screen and (max-height: 700px) {
        main {
            min-height: 700px;
        }
    }

    .avatar-uploader {
        width: 80px;
        height: 80px;
        border: 1px dotted #ccc;
        border-radius: 40px;
        line-height: 80px;
        display: flex;
        overflow: hidden;
        align-items: center;
        text-align: center;
    }

</style>

<style scoped>
    :deep(.is-checked .el-checkbox__inner){
        background-color: var(--el-color-primary) !important;
        border-color: var(--el-color-primary) !important;
    }

    :deep(.el-checkbox__label){
        color: #424242 !important;
    }
</style>
