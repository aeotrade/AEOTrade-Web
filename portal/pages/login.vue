<script setup>

    import {apiLogin, sendCode} from "~/api/api";
    const Config = useAppConfig()
    const route = useRoute()
    const data = reactive({
        see: false,
        version: '',
        activeName: Object.values(Config.loginMethods).shift(),
        loading: false,
        loginType: 0,
        loginPwdObj: {
            user: '',
            password: '',
            vcode: ''
        },
        intervalQueryIfWxLoginedId: '',
        UID: "",
        captchaImgUrl: "",
        loginPwdONotifacationObj: {
            user: null,
            password: null,
            vcode: null
        },
        loginMessageObj: {
            user: '',
            password: ''
        },
        loginMessageNotifacationObj: {
            user: null,
            password: null
        },
        agreement: false,
        show: false,
        count: 60,
        client: cookies.getItem('clientType') || 'web'


    })
    const notifacation = (type, notiType) => {
        for (let key in data[type + 'Obj']) {
            data.type + 'Obj'[key] ? data[notiType + 'Obj'][key] = null : data[notiType + 'Obj'][key] = true
        }

    }
    const login = () => {
        let obj
        let url
        let type
        if (data.activeName === 'third') {
            notifacation('loginPwd', 'loginPwdONotifacation')
            let username = data.loginPwdObj.user.trim();
            let password = data.loginPwdObj.password.trim();
            let vcode = data.loginPwdObj.vcode;
            obj = {
                username,
                password,
                loginType: data.client,
                vcode
            }
            url = '/uaa/social/login'
            type = 'post'
            if (!username || !password || !obj.vcode) {
                return false;
            }
        } else {
            notifacation('loginMessage', 'loginMessageNotifacation')
            let mobile = data.loginMessageObj.user.trim();
            let code = data.loginMessageObj.password.trim();
            obj = {
                mobile,
                code,
                loginType: data.client
            }
            url = '/uaa/social/login/mobile'
            type = 'get'

            if (!mobile || !code) {
                return false;
            }
        }
        /* loginAgreement  */
        if(!data.agreement && Config.platformAgreementVisible){
            return ElMessage({
                message: '请阅读并同意《平台协议》和《隐私政策》',
                type: 'error',
            });
        }
        data.loading = true;
        apiLogin(url, obj, type, { 'U-ID': data.UID }).then(res => {
            // console.log(res)
            if(res.code != 200){
                return data.loading = false
            }
            loginCommon(JSON.parse(JSON.stringify(res)), route.query.path)
        }).catch(error => {
            console.log(error, 33333)
            data.loading = false;
        })
    }
    const getCode = () => {
        data.loginMessageObj.user=data.loginMessageObj.user.trim()
        if(!data.loginMessageObj.user.length){
            ElMessage.error('请输入手机号')
            return false;
        }
        var reg = /^1[3-9]\d{9}$/;
        if (!reg.test(data.loginMessageObj.user)) {
            ElMessage({
                message: '手机号格式错误',
                type: 'error',
            });
            return false;
        }
        sendCode({phone: data.loginMessageObj.user}).then(() => {
            ElMessage({
                message: '短信发送成功',
                type: 'success',
            });
            codeTimer();
        });
    }
    // 验证码倒计时
    const codeTimer = () => {
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
    // 获取账号登录验证码
    const getNumberCode = () => {
        let baseUrl = import.meta.env.VITE_BASE_URL
        let urlImg = baseUrl +'/sys/admin/code/random/image?time='+new Date().getTime();
        const xhr = new XMLHttpRequest();
        xhr.open('GET', urlImg);
        xhr.responseType = 'blob';
        xhr.onload = () => {
            const headers = xhr.getAllResponseHeaders();
            data.UID = xhr.getResponseHeader('U-ID')
            data.captchaImgUrl = URL.createObjectURL(xhr.response);
        };
        xhr.send();
    }

    onMounted(async() => {
        await nextTick()
        getNumberCode()
    })

</script>

<template>
    <div class="main-container">
        <div class="banner">
            <div class="left-background-img" v-if="Config.loginBackgroundImageUrl" :style="{ backgroundImage: `url(${Config.loginBackgroundImageUrl})`}"></div>
            <div v-else class="left-background-img left-background-default"></div>
            <div class="logo">

                <nuxt-link to="/" v-if="data.client !== 'client'">
                    <img v-if="Config.loginLogoImageUrl" style="cursor:pointer" :src="Config.loginLogoImageUrl">
                    <img v-else style="cursor:pointer" src="@/assets/img/login_logo.svg">
                </nuxt-link>
                <div v-else>
                    <img v-if="Config.loginLogoImageUrl" :src="Config.loginLogoImageUrl">
                    <img v-else src="@/assets/img/login_logo.svg">
                </div>
                <!--                <img v-else src="@/assets/img/login_logo.svg">-->
            </div>
            <div class="words" v-if="Config.loginDescription" v-html="Config.loginDescription"></div>
            <div class="words" v-else>
                <div class="title">慧贸OS（AEOTradeOS）</div>
                <div class="info">
                    该系统是各组织连接到信贸链的标准化程序套件！它融合区块链、智能交换、流程编排、RPA、AI等多种技术，帮助各政企组织无需改造系统，就可以像搭积木一样将不同业务系统以插拔方式快速集成起来，并通过信贸链进行数据的在线交换与存证，从而实现各业务场景的无纸化、自动化、可视化。
                </div>
            </div>

        </div>

        <div class="login" v-loading="data.loading">
            <div class="box">
                <div class="info" v-if="Config.loginTitle" v-html="Config.loginTitle"></div>
                <div class="info" v-else>
                    <div class="title">开启您的贸易数字化之旅</div>
                    <div class="tips">如您还未创建组织，请扫码进入个人中心创建</div>
                </div>
                <el-tabs v-model="data.activeName">

                    <el-tab-pane v-if="Object.values(Config.loginMethods).includes('second')" label="手机号" name="second">
                        <div class="input-item">
                            <input type="text" name="phone" autocomplete="tel" placeholder="请输入手机号" v-model="data.loginMessageObj.user">
                        </div>
                        <p class="notification"
                           v-if="data.loginMessageNotifacationObj.user&&!data.loginMessageObj.user">请输入账号或已验证的手机号</p>
                        <p class="notification" v-else></p>
                        <div class="input-item">
                            <input type="text" name="phoneCaptcha" autocomplete="off" placeholder="请输入验证码" v-model="data.loginMessageObj.password">
                            <span class="getCheckCode" style="cursor: pointer;" v-if="!data.show"
                                  @click="getCode">获取验证码</span>
                            <span class="getCheckCode" v-else>{{data.count}}s</span>
                        </div>
                        <p class="notification"
                           v-if="data.loginMessageNotifacationObj.password&&!data.loginMessageObj.password">请输入验证码</p>
                        <p class="notification" v-else></p>
                    </el-tab-pane>
                    <el-tab-pane v-if="Object.values(Config.loginMethods).includes('third')" label="账号/密码" name="third">
                        <div class="input-item">
                            <input type="text" name="account" placeholder="请输入账号" v-model="data.loginPwdObj.user">
                        </div>
                        <p class="notification" v-if="data.loginPwdONotifacationObj.user&&!data.loginPwdObj.user">
                            请输入账号</p>
                        <p class="notification" v-else></p>
                        <div class="input-item">
                            <input name="password" :type="data.see?'text':'password'" placeholder="请输入密码"
                                   v-model="data.loginPwdObj.password">
                            <el-icon  class="el-icon" @click="data.see = !data.see"><View />  </el-icon>
                        </div>
                        <p class="notification"
                           v-if="data.loginPwdONotifacationObj.password&&!data.loginPwdObj.password">请输入密码</p>
                        <p class="notification" v-else></p>

                        <div class="input-item">
                            <input placeholder="请输入验证码" name="captcha" style="width: 73%;display: inline-block" v-model="data.loginPwdObj.vcode">
                            <img alt="图片验证码" @click="getNumberCode" style="cursor: pointer;width: 25%;height: 40px;vertical-align: middle" :src="data.captchaImgUrl" />
                        </div>
                        <p class="notification" v-if="data.loginPwdONotifacationObj.vcode&&!data.loginPwdObj.vcode">请输入验证码</p>
                        <p class="notification" v-else></p>
                    </el-tab-pane>
                </el-tabs>
                <el-button type="primary" style="width: 400px;height:40px;" v-if="['second','third'].includes(data.activeName)"
                           @click="login">登录
                </el-button>
                <div v-if="['second','third'].includes(data.activeName) && Config.platformAgreementVisible" class="agreement-wrap" style="margin: 10px 0px">
                    <el-checkbox style="margin-right: 8px" v-model="data.agreement"></el-checkbox>我已阅读并同意<a class="agreement" v-if="Config.platformAgreementUrl" title="平台协议" target="_blank" :href="Config.platformAgreementUrl">《平台协议》</a><a class="agreement" v-if="Config.privacyPolicyUrl" target="_blank" :href="Config.privacyPolicyUrl">《隐私政策》</a>
                </div>

            </div>

            <div class="other-rich-text" v-if="Config.loginGuideIntro" v-html="Config.loginGuideIntro"></div>
        </div>
    </div>
</template>

<style scoped lang="scss">
$boxItemWidth: 400px;
.left-background-img{
  width: 628px;
  height: 100%;
  background-size: cover;
  background-position: center;
}
.left-background-default{
  background-image: url("@/assets/img/login_banner_nowords.jpg")
}
    #login_container {
        width: 200px;
        height: 200px;
        margin: 0 auto;
        transition: .3s;
        border-radius: 10px;
        text-align: center;
        padding-top: 20px;
        border: 1px solid rgba(236, 236, 236, 1);
        color: rgba(42, 42, 42, 1);
        font-size: 14px;
        line-height: 20px;
        &:hover {
            transform: translateX(-90px);

            & + img {
                opacity: 1;
            }
        }

        & + img {
            position: absolute;
            opacity: 0;
            top: 0;
            left: 200px;
            transition: .3s;
            object-fit: cover;
        }
    }

    .other {
        /*position: absolute;*/
        margin-top: 30px;
        width: $boxItemWidth;
        display: flex;
        align-items: center;
        .other-item{
            width: 200px;
            height: 46px;
            display: flex;
            align-items: center;
            border: 1px solid rgba(233, 233, 233, 1);
            cursor: pointer;
            img {
                cursor: pointer;
                width: 34px;
                height: 34px;
                margin:0 12px 0 10px;
            }
            &:hover{
                border: 1px solid rgba(61, 90, 254, 1);
            }
        }
    }
    .other-rich-text{
      margin-top: 30px;
      width: $boxItemWidth;
      max-height: 180px;
      overflow-y: hidden;
    }

    :deep(.el-tabs__item ) {
        color: #999999;
        font-weight: bold;
        padding: 0 20px;

        &:hover {
            color: #010101;
        }

        &.is-active {
            color: var(--el-color-primary);
        }

    }
    :deep(.el-tabs__header ) {
        margin-bottom: 40px;
    }
    .main-container {
        height: calc(100vh);
        min-height: 830px;
        display: flex;
        color: rgba(66, 66, 66, 1);

        .banner {
            position: relative;
            height: 100%;
            flex-shrink: 0;

            img {
                height: calc(100% - 4px);
            }

            .logo {
                width: 486px;
                position: absolute;
                left: 50%;
                top: 48px;
                transform: translateX(-50%);

                img {
                    height: 34px;
                }
            }

            .words {
                width: 486px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -55%);
                color: rgba(66, 66, 66, 1);
                font-size: 18px;

                .title {
                    font-weight: bold;
                    font-size: 42px;
                    color: var(--el-color-primary);

                    &.p {
                        margin: 20px 0 55px 0;
                        color: rgba(66, 66, 66, 1);
                    }
                }

                .info {
                    line-height: 42px;
                    letter-spacing: 1.2px;
                    width: 474px;
                    text-align: justify;
                }
            }
        }

        .login {
            width: 100%;
            display: flex;
            margin-top: calc( 206 / 947 * 100vh);
            align-items: center;
            flex-direction: column;

            .box {
                width: $boxItemWidth;

                .info {
                    margin-bottom: 40px;

                    .title {
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 10px;
                    }

                    .tips {
                        font-size: 14px;
                    }
                }

                .input-item {
                    position: relative;

                    .getCheckCode {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        color: var(--el-color-primary);
                    }

                    input {
                        font-size: 14px;
                        padding-left: 10px;
                        width: 400px;
                        height: 40px;
                        border-radius: 4px;
                        border: 1px solid rgba(227, 231, 240, 1);

                        &:hover {
                            border: 1px solid var(--el-color-primary);
                        }

                        &:focus {
                            border: 1px solid var(--el-color-primary);
                        }

                        &::placeholder {
                            color: #ACB5C6;
                        }
                    }

                    .el-icon {
                        font-size: 16px;
                        position: absolute;
                        top: 12px;
                        right: 14px;
                        cursor: pointer;
                    }
                }

                .notification {
                    color: #ff3d00;
                    font-size: 12px;
                    height: 30px;
                    line-height: 30px;
                }

            }
        }
    }
    .agreement-wrap{
        margin: 10px 0px;
        color: rgba(102, 102, 102, 1);
        a{
            color: var(--el-color-primary);
        }
    }

</style>

<style scoped>
    :deep(.el-input__inner){
        border: none !important;
        padding: 0px !important;
        width: 40px;
    }

    :deep(.el-select--mini){
        width: 63px;
        left: 20px;
        position: absolute;
    }

    :deep(.el-input){
        margin: 6px 0;
    }

</style>
