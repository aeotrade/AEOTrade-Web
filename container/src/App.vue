<template>
    <section style="min-height: 100vh;width: 100%;overflow: hidden">
        <div id
             v-if="show && !loading" class="m-box"
             :style="`position: fixed;height: 50px;display: flex;align-items: center;left: 0;top: 0;z-index: 2000;width: 100%;background-color: ${currentAppConfig.headerBackgroundColor||'#fff'};padding-right:20px;box-shadow: 0 1px 4px rgba(0,21,41,0.08);transform: translate3d(0, 0, 0);`">
            <div style="display: flex;align-items: center;cursor: pointer;font-size:16px;color:#5F6E84;padding-left: 10px;">
                <span style="font-size: 16px;padding-left: 20px">{{appName}}</span>
            </div>
            <div class="m-right-menu-item" style=" display: flex;align-items: center;margin-left: auto;font-size: 12px">
                <div style="height: 14px;margin-right: 20px"></div>
                <div style="height: 50px;display: flex;align-items: center;cursor: pointer;position: relative"
                   >
                    <img class="person-icon" :src="loginMessage.headimgurl" width="32px" height="32px"/>

                </div>
            </div>

        </div>
        <div class="main-loading" v-if="loading">
            <img src="@/assets/loading.gif" alt="">
            <p>小慧正在为您努力加载中，请稍后......</p>
        </div>
        <div class="appContainer" style="min-height: 100vh" v-html="combineSubApp"></div>
    </section>
</template>

<script>
    import {generateThemeStyle} from "@/utils/theme";
    export default {
        name: 'framework',
        props: {
            loading: Boolean,
            content: String
        },
        data() {
            return {
                createOrgDialogVisible: false,
                searchCompanyName: '',
                companyList: [],//企业列表
                isPersonal: (this.$tokenBox.getItem('kindId') && parseInt(this.$tokenBox.getItem('kindId')) >= 88) ? true : false,
                loginStatus: this.$tokenBox.getItem('info') ? 1 : 0,
                showExit: false,
                showList: false,
                name: '',
                currentAppConfig: {},
                appName: '',
                appNameEn: '',
                who: '',
                loginMessage: {},
                time: 0,
                kindId: '',
                icon1: require('@/assets/help.png'),
                icon2: require('@/assets/kefu.svg'),
                icon3: require('@/assets/systest.svg'),
                workBenchType: null,
                show: true,
                clientType: this.$tokenBox.getItem('clientType'),
                clientUrl: process.env.VUE_APP_BASE_API + 'sys/client/version/find/new',
                about: false,
                versionInfo: null,
                currentVersion: '',
                newVersion: false,
                versionInfoNew: null,
                sysInfoList: [
                    {loading: false},
                    {loading: false},
                    {loading: false},
                    {loading: false},
                    {loading: false},
                    {loading: false},
                ],
                sysDialog: false,
                sysloading: false,
                systype: 'info',
                clientConnect: [],
                connectorStatueMap: {
                    installing: '安装中',
                    install_failed: '安装异常',
                    install_success: '安装成功',
                    updateing: '更新中',
                    update_failed: '更新异常',
                    update_success: '更新成功'
                },
                connectMap: new Map(),
                subAppThemeStyle: '',
            };
        },
        async created() {

            if (this.GetQueryValue('iframe')) {
                this.show = false
            }

        },
        mounted() {
            this.$actions.onGlobalStateChange(async (state, prev) => {
                this.appName = state.appName;
                this.appNameEn = state.appNameEn;
                let currentAppConfig = {}
                if (this.$configs) {
                    currentAppConfig = this.$configs.filter(item => item.name === state.appNameEn)[0];
                    this.setSiteInfo(currentAppConfig);
                }
                const styleNode = generateThemeStyle('', currentAppConfig.primaryColor || '#3d5afe');
                this.subAppThemeStyle = styleNode.outerHTML
                this.workBenchType = sessionStorage.getItem('WORKBENCHNTYPE')
                if (state.appName == '工作台') {
                    this.name = this.$tokenBox.getItem('WORKBENCHN') ? this.$tokenBox.getItem('WORKBENCHN') : ''
                    this.getInfo()
                }
            })
            this.getInfo1()
            document.addEventListener("click", this.documentClick);
        },
        beforeDestroy() {
            document.removeEventListener("click", this.documentClick);
        },
        methods: {
            setSiteInfo(appConfig) {
                if (!appConfig) return;
                this.currentAppConfig = appConfig;
                document.title = appConfig.title
                // 更换站点图标
                const existingIcon = document.querySelector('link[rel="icon"]');
                existingIcon.href = '/theme/' + appConfig.icon;
            },
            startListening(channel, callBackChannel) {
                window.exportOpenApi.startListening(channel, callBackChannel, (message, serverId) => {
                    if (message.length) {
                        window.exportOpenApi.loggerInfo('[connector_install_update_status]', JSON.stringify(message))
                        const key = 'connector'; // 指定键值对的键名


                        message.forEach(item => {
                            this.connectMap.set(item[key], item);
                        });
                       this.clientConnect.forEach((item, index) => {
                            const valueData = this.connectMap.get(item['connector_code']); //来自message的数据

                            if (valueData) {
                                let isInstall = valueData.status == 'update_success' || valueData.status == 'install_success'
                                let isloading = valueData.status == 'installing' || valueData.status == 'updateing'

                                this.$set(this.clientConnect, index,
                                    {
                                        loading: isloading,
                                        title: item.connector_name,
                                        connector_name: item.connector_name,
                                        subheading: "",
                                        value: isInstall ? '检测符合要求' : '—/—',
                                        isShow: true,
                                        isNormal: isInstall,
                                        helpUrl: 'https://help.aeotrade.com/3328/8473/e76a',
                                        errdesc: '安装异常，自动修复中或',
                                        desc: '安装中',
                                        type: 'connect',
                                        status: valueData.status,
                                        connector_code: item.connector_code
                                    })
                            }
                            let hasErr = this.sysInfoList.concat(this.clientConnect).some(item => item.isShow && !item.isNormal && !item.loading);
                            let hasLoading = this.sysInfoList.concat(this.clientConnect).some(item => item.loading);
                            this.sysloading = false
                            if (hasErr) {
                                // 有错误项优先显示错误项
                                this.systype = 'danger'
                            } else {
                                // 无错误项 判断是否有正在加载项  有加载项显示为 灰色 无加载项的为全部正常
                                this.systype = hasLoading ? 'info' : 'primary'
                            }
                        });

                    }
                });
            },
            documentClick(event) {
                if (this.$refs.box && !this.$refs.box.contains(event.target)) {
                    this.sysDialog = false;
                }
            },
            knownTips(type) {
                let staffId = this.$tokenBox.getItem('staffId');
                this.$api.user.knownTips({
                    memberId: this.$tokenBox.getItem('memberId'),
                    staffId,
                    value: 1,
                    type
                })
            },
            startUpdate() {
                this.$actions.setGlobalState({startUpdate: true, updateInfo: this.versionInfoNew})
                this.about = false
            },
            // 获取企业列表
            getCompanyList() {
                let id = this.loginMessage.bind.staffid;
                let memberId = this.loginMessage.bind.memberid;

                this.$api.user.getCompanyList({id}).then(res => {
                    res.result.forEach(item => {
                        item.selected = false;
                        if (memberId == item.id) {
                            item.selected = true;
                        }
                    });
                    this.companyList = res.result;
                });
            },
            // 切换企业
            async switchRoles(type, item) {
                let relaunchAppFlag = false
                this.$tokenBox.removeItem('WORKBENCHNID');
                if (this.$tokenBox.getItem('WORKBENCHNID')) {
                    this.$tokenBox.removeItem('WORKBENCHNID');
                } else {
                    this.switchMember(type, item, relaunchAppFlag);
                }
            },
            // 切换企业
            switchMember(type, item, relaunchAppFlag) {
                let params = {
                    staffId: this.$tokenBox.getItem('staffId'),
                    memberId: '',
                    type: ''
                };
                if (type == 'person') {
                    window.dispatchEvent(new Event('app:logout'))
                    params.type = 1;
                    this.$api.user.insertLast({
                        memberId: '',
                        workBenchId: '1',
                        staffId: this.$tokenBox.getItem('staffId')
                    });
                } else {
                    params.memberId = item.id.toString();
                    params.type = 2;
                }
                this.$api.user.details(params).then(res => {
                    this.$tokenBox.setItem('kindId', res.result.bind.kindid);
                    sessionStorage.setItem("isLogin", null)
                    this.$nextTick(async function () {
                        if (type == 'firm') {
                            this.$tokenBox.setItem('memberId', item.id);
                            sessionStorage.setItem('WORKBENCHINDEX', 1);
                            let params = {apply: 1, id: item.id.toString()};
                            let res = await this.$api.user.getIntelligenceList(params);
                            let currentWorkbench = res && res.result && res.result[0]
                            if (currentWorkbench) {
                                this.$tokenBox.setItem('WORKBENCHNID', currentWorkbench.workbenchId);
                                this.$tokenBox.setItem('WORKBENCHN', currentWorkbench.workbenchName);
                            }
                        }
                        this.$tokenBox.removeItem('wbin');
                        this.$tokenBox.setItem('jump', 1);

                        if (this.$tokenBox.getItem('clientType') === 'web') {
                            window.location.href = this.$macroHost;
                        }
                    });

                });
            },
            getInfo() {
                let kindId = this.$tokenBox.getItem('kindId');
                let staffId = this.$tokenBox.getItem('staffId');
                let memberId = this.$tokenBox.getItem('memberId') ? this.$tokenBox.getItem('memberId') : ''
                let params = {
                    staffId: staffId,
                    memberId: memberId,
                    type: kindId > 88 ? 1 : 2
                }
                if (!memberId) return
                this.kindId = kindId
                this.$api.detail.getInfo(params).then((res) => {
                    this.loginMessage = res.result
                    this.getCompanyList();
                    this.who = this.loginMessage.user.staffname;
                })
            },
            getInfo1() {
                let kindId = this.$tokenBox.getItem('kindId');
                let staffId = this.$tokenBox.getItem('staffId');
                let memberId = this.$tokenBox.getItem('memberId') ? this.$tokenBox.getItem('memberId') : ''
                let params = {
                    staffId: staffId,
                    memberId: memberId,
                    type: kindId > 88 ? 1 : 2
                }
                if (!memberId) return
                this.kindId = kindId
                this.$api.detail.getInfo(params).then((res) => {
                    this.loginMessage = res.result
                    this.getCompanyList();
                    this.who = this.loginMessage.user.staffname;

                })
            },

            exsit() {
                window.dispatchEvent(new Event('app:logout'))
                setTimeout(() => {
                    this.delCookie()
                    window.location.href = this.$portalHost;
                }, 150)
            },
            delCookie() {
                let clientType = this.$tokenBox.getItem('clientType')
                let keys = document.cookie.match(/[^ =;]+(?==)/g)
                if (keys) {
                    for (var i = keys.length; i--;) {
                        document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString() // 清除当前域名下的,例如：m.ratingdog.cn
                        document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString() // 清除当前域名下的，例如 .m.ratingdog.cn
                        document.cookie = keys[i] + '=0;path=/;domain=aeotrade.com;expires=' + new Date(0).toUTCString() // 清除一级域名下的或指定的，例如 .ratingdog.cn
                    }
                }
                if (clientType === 'web') {
                    window.location.href = '/';
                }
            },
            GetQueryValue(queryName) {
                var query = decodeURI(window.location.search.substring(1));
                var vars = query.split("&");
                for (var i = 0; i < vars.length; i++) {
                    var pair = vars[i].split("=");
                    if (pair[0] == queryName) {
                        return pair[1];
                    }
                }
                return null;
            }
        },
        computed: {
            role() {
                let info = this.$tokenBox.getItem('info');
                if (info) {
                    info = JSON.parse(info);
                    if (info.bind.kindid == 99) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            // 合并子应用和element-ui主题色样式
            combineSubApp() {
                return this.content + this.subAppThemeStyle
            }
        }
    };
</script>

<style lang="scss" scoped>

    ::v-deep .el-button--default {
        color: var(--aeo-primary-color);
        border: var(--aeo-primary-color) 1px solid;
    }

    .sysDialog {
        background-color: #fff;
        position: absolute;
        top: 55px;
        right: 55px;
        z-index: 1999;
        width: 350px;
        padding: 15px 10px;
        box-sizing: border-box;
        box-shadow: 0px 2px 6px 0px rgba(61, 90, 254, 0.20);
        border-radius: 10px;

        .sysItem {
            margin-bottom: 10px;
            width: 330px;
            height: 50px;
            border-radius: 4px;
            border: 1px solid rgba(61, 90, 254, 0.1);
            position: relative;
        }

        .item-left {
            width: 200px;
            display: flex;
            height: 50px;

            .line {
                width: 0px;
                padding-left: 4px;
                margin-right: 10px;
                height: 100%;
            }

            .info {
                .title {
                    margin-top: 7px;
                    color: #9B9B9B;
                    font-size: 12px;
                    overflow: hidden; //超出的文本隐藏
                    text-overflow: ellipsis; //溢出用省略号显示
                    white-space: nowrap;
                    width: 200px;
                }

                .desc {
                    font-size: 10px;
                    color: #000;
                    margin-top: 7px;


                }
            }
        }

        .item-rigth {
            position: absolute;
            top: 0;
            right: 0;
            height: 50px;
            display: flex;
            align-items: center;
            font-size: 8px;

            .errDesc {
                flex: 1;
                text-align: right;
            }

            .sys-icon {
                margin-right: 10px;
                margin-left: 6px;
                font-size: 16px;
                line-height: 50px;
            }
        }

        .normal {
            .line {
                border-radius: 2px 0px 0px 2px;
                background-color: #6B81FF
            }

            .item-left {
                background: linear-gradient(90deg, rgba(61, 90, 254, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
            }
        }

        .warn {
            .line {
                background-color: #FF7D81;
            }

            .item-left {
                background: linear-gradient(90deg, rgba(241, 78, 83, 0.15) 0%, rgba(255, 255, 255, 0) 100%);
            }

        }

        .loading {
            .line {
                background-color: #FFF;
            }

            .item-left {
                background: #FFF;
            }
        }

    }


    .mask-m {
        position: fixed;
        width: 100%;
        height: 100%;
        z-index: 2000;
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
        box-shadow: 0px 2px 12px 0px rgba(61, 90, 254, .15);

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

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        outline: none;
    }

    .switch-btn {
        width: 120px;
        height: 20px;
        margin-left: 20px;
        line-height: 18px;
        border-radius: 24px;
        color: var(--aeo-primary-color-shade);
        font-size: 12px;
        text-align: center;
        cursor: pointer;
        border: 1px solid var(--aeo-primary-color-1);

        &:hover {
            color: var(--aeo-primary-color-1);
        }
    }

    .show-list {
        position: relative;
        height: 60px;

        .companyList {
            position: absolute;
            left: 20px;
            top: 58px;
            background-color: #fff;
            z-index: 2;
            box-shadow: 0px 1px 6px 0px rgba(61, 90, 254, .2);

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

                &.active {
                    background-color: #F7F8FA;
                    color: #3D5AFE;
                }

                &:hover {
                    color: #3D5AFE;
                    background-color: #F7F8FA;
                }

                img {
                    border-radius: 100%;
                    width: 36px;
                    height: 36px;
                }
            }
        }
    }

    .createBtn {
        width: 120px;
        height: 30px;
        border-radius: 4px;
        line-height: 28px;
        text-align: center;
        border: 1px solid #3D5AFE;
        color: #3D5AFE;

        &:hover {
            background-color: #3D5AFE;
            color: #fff;
        }
    }

    .person-icon {
        border-radius: 50%;
        margin-right: 10px;
        vertical-align: -4px;
    }

    .exit-box {
        position: absolute;
        top: 50px;
        left: -80px;
        width: 150px;
        background-color: #fff;
        box-shadow: 0px 2px 6px 0px rgba(61, 90, 254, .15);
        padding: 10px 0px;
    }

    .exit-box .item {
        display: flex;
        align-items: center;
        padding: 8px 18px;
    }

    .exit-box .item:hover {
        background-color: #F7F8FF;
    }

    .exit-box .line {
        margin: 5px 0;
        border-bottom: 1px solid rgba(235, 241, 255, 100);
    }

    .exit-box .item img {
        margin-right: 15px;
    }

    .exit-box .item span {
        margin-right: 25px;
    }

    .act-img:hover + .font {
        color: #3D5AFE;
    }

    .font:hover {
        color: #3D5AFE;
    }

    .changebtn {

        width: 120px;
        height: 25px;
        line-height: 24px;
        border-radius: 32px;
        background-color: rgba(255, 255, 255, 100);
        text-align: center;
        border: 1px solid rgba(61, 90, 254, .30);
        color: #3D5AFE;
    }

    .changebtn:hover {
        background-color: rgba(61, 90, 254, 100);
        border: 1px solid rgba(61, 90, 254, .30);
        color: #fff;
    }

    .main-loading {
        width: 100vw;
        height: 100vh;
        background-color: #fff;
        display: flex;
        position: absolute;
        left: 0;
        top: 0;
        align-items: center;
        z-index: 2000;
        justify-content: center;
        flex-direction: column;
        font-size: 16px;
        color: #424242;
    }

    .main-loading img {
        height: 120px;
        width: 120px;
        margin-bottom: 50px;


    }

    .incoHover {
        &:hover {
            text-decoration: underline;
        }
    }

    /*!*help*!*/
    /*.main-help{*/
    /*  position: relative;*/
    /*  width: 30px;*/
    /*  height: 30px;*/
    /*  border: 1px #3243d9 solid;*/
    /*  border-radius: 50%;*/
    /*  -webkit-animation: rotation 1s ease-in-out infinite;*/
    /*  -moz-animation: rotation 1s ease-in-out infinite;*/
    /*  animation: rotation 1s ease-in-out infinite;*/
    /*  margin: 30px auto;*/
    /*}*/
    /*.main-help:after{*/

    /*  width: 5px;*/
    /*  height: 5px;*/
    /*  background-color: #3243d9;*/
    /*  border-radius: 100%;*/
    /*  position: absolute;*/
    /*  content: "";*/
    /*  left: 3px;*/
    /*  top: 3px;*/
    /*}*/
    /*@-webkit-keyframes rotation{*/
    /*  0%{-webkit-transform: rotate(0deg);}*/
    /*  100%{-webkit-transform: rotate(360deg);}*/
    /*}*/
    /*@-moz-keyframes rotation{*/
    /*  0%{-moz-transform: rotate(0deg);}*/
    /*  100%{-moz-transform: rotate(360deg);}*/
    /*}*/
    /*@keyframes rotation{*/
    /*  0%{transform: rotate(0deg);}*/
    /*  100%{transform: rotate(360deg);}*/
    /*}*/
    //::v-deep{
    //  .el-tooltip__popper{
    //    .is-dark{
    //      background-color: #303133;
    //      color: #fff;
    //    }
    //  }
    //
    //}

    .sys-loading {
        position: relative;
        width: 16px;
        height: 16px;
        border: 3px solid #C5DBFF;
        border-top-color: #AFBBFF;
        border-right-color: #AFBBFF;
        border-bottom-color: #AFBBFF;
        border-radius: 100%;
        animation: circle infinite 1.5s linear;
    }

    .sys-loading-err {
        position: relative;
        width: 16px;
        height: 16px;
        border: 3px solid #FFC1C2;
        border-top-color: #FF8488;
        border-right-color: #FF8488;
        border-bottom-color: #FF8488;
        border-radius: 100%;
        animation: circle infinite 1.5s linear;
    }

    @keyframes circle {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
<style>
    .container-company-search-input .el-input__inner {
        border: none;
        background-color: rgba(247, 248, 250, 1);
        color: rgba(162, 167, 176, 1);
    }
</style>

