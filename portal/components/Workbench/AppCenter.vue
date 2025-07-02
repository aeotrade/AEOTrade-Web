<script setup>
    import { apiQueryAppState, apiGetSelfAppInfo, apiGetAppCategoryList } from '~/api/api'
    const Config = useAppConfig()
    onMounted(() => {
        window.onbeforeunload = (e) => {
            cookies.setItem('AppCenter','off');
        }

        getAppType();
        if(Config.loginEnv=='development'||Config.loginEnv=='staging'){
            state.loginUrl1 = 'sellerptest';
            state.loginUrl2 = 'servicerptest';
            state.loginUrl3 = 'apperp-test';
        }else if(Config.loginEnv=='training'){
            state.loginUrl1 = 'sellerptrain';
            state.loginUrl2 = 'servicerptrain1';
            state.loginUrl3 = 'apperptrain';
        }else {
            state.loginUrl1 = 'sellerpro';
            state.loginUrl2 = 'servicerp';
            state.loginUrl3 = 'apperp';
        }
      
    })

    const props = defineProps({
        showApp: {
            type: Boolean,
            default: false
        },
        menu: {
            type: Array,
            default: []
        },
        url: {
            type: String,
            default: ''
        }
    })
    const emits = defineEmits(['update:showApp'])

    const rightItemRef = ref(null)
    const scrollbarRef = ref(null)
    const {user} = useUser()

    const state = reactive({
        loginUrl1: '',//卖家
        loginUrl2: '',//物流
        loginUrl3: '',//应用
        role:0,
        id: user.value.bind.staffid,
        member: user.value.bind.memberid,
        membername: user.value.bind.membername,
        staffname: user.value.user.staffname,
        appList:[],
        loading:false,
        showLoading:null,
        value:'',
        searchList:[],
        options:[],
        selectedIndex: 0,
        timer: null,  // 防抖
    })
    const nuxtApp = useNuxtApp()
    // 打开窗口
    const openWindow = (url) => {
        if(url.startsWith('/')){
            url=window.location.origin+'/microapp'+url
        }
        if(cookies.getItem('clientType') == 'client'){
            window.open(url,'','width=1200,height=800,maxWidth=9999,maxHeight=9999,resizable=true,frame=true')
        }else{
            window.open(url)
        }
    }
    const close = () => {
        if(cookies.getItem('clientType') == 'client'){
            window.close();
        }else {
            // this.$parent.showAppCenter = false;
            emits('update:showApp')
        }

        // this.$tokenBox.setItem('AppCenter','off');

    }
    const openApp = (data, options) => {
        console.log(data,options)
        if(typeof data == 'object'){
            if(data && data.clientId && data.clientId == '3aa16fa80'){
                // 打开自建应用
                openSelfApp(data)
            }else{
                if(data.url && data.url.indexOf('sso_login') !== -1){
                    data.url += `&user_token=E3C81766939E292F943A4EFED58E92B3&hmm_user_id=${state.id}&hmm_user_name=${state.staffname}&hmm_company_id=${state.member}&hmm_company_name=${state.membername}&hmm_user_role=${state.role}&erp_menu=product_list`
                }
                let params = {
                    memberId: state.member,
                    appId : data.id
                }
                apiQueryAppState(params).then(res=>{
                    if(res.result.openStatus){
                        state.showLoading = data.id;
                        setTimeout(()=>{
                            state.showLoading = null;
                            openWindow(data.url)
                        },1000)
                    }else {
                        openWindow(data.url)
                    }
                });
            }
        }else {
            // 搜索应用，点击
            // 先判断是否是自建应用
            let item = options.filter(op => op.url === data)[0]
            if(item.clientId == '3aa16fa80'){
                // 自建应用
                openSelfApp(item)
            }else{
                if(state.value){
                    if(state.value.indexOf('sso_login') !== -1){
                        state.value += `&user_token=E3C81766939E292F943A4EFED58E92B3&hmm_user_id=${state.id}&hmm_user_name=${state.staffname}&hmm_company_id=${state.member}&hmm_company_name=${state.membername}&hmm_user_role=${state.role}&erp_menu=product_list`
                    }
                    openWindow(state.value)
                    state.value = ''
                    state.options = [];
                }
            }
        }
    }
    // 打开自建应用
    const openSelfApp = (item) => {
        // 自建应用
        apiGetSelfAppInfo({id: item.id}).then(res=>{
            openWindow(res.result)
        })
    }
    const remoteMethod = (query) => {
        if (query !== '') {
            state.loading = true;
            setTimeout(() => {
                state.loading = false;
                state.options = state.searchList.filter(item => {
                    return item.appName.indexOf(query) > -1;
                });
            }, 200);
        } else {
            state.options = [];
        }
    }

    const getAppType = async() => {
        await nextTick()
        const list = await useWorkbenchList()
        apiGetAppCategoryList({vipTypeId: list[0].viptypeId, memberId: state.member}).then(res=>{
            state.appList = res.result;
            state.appList.forEach(item=>{
                if(item.appList.length){
                    state.searchList.push(...item.appList)
                }
            })
            // setTimeout(()=>{},100)
            setLastMargin();
        })
    }
    const setLastMargin = () => { // 这个方法直接在mounted里面执行
        nextTick(() => {
            let dom = rightItemRef.value[state.appList.length - 1]
            let scrollbarEl = scrollbarRef.value?.wrapRef;
            scrollbarEl.onscroll = (e)=>{
                rightScrollEvent(e)
            }
            let height = parseInt(window.getComputedStyle(dom).height)
            dom.style.marginBottom = `calc(100% - ${height + 50}px)`  // 这里减去容器的padding
        })
    }
    const typeClick = (index) => {
        // 高亮并滚动
        state.selectedIndex = index
        rightItemRef.value[index].scrollIntoView({behavior: 'smooth'})
    }
    const rightScrollEvent = (e) => {
        debounce(() => {
            let rightWrapEle = e.target
            let scrollTop = rightWrapEle.scrollTop  // 滚动的高度
            console.log(scrollTop)
            for(let i = 0 ; i < rightItemRef.value.length; i++){
                let item = rightItemRef.value[i]
                let offsetTop = item.offsetTop  // 元素距离容器顶部的距离
                let scrollHeight = item.scrollHeight // 元素的高度
                if(scrollTop < (offsetTop + scrollHeight) && scrollTop > (offsetTop-55)){ // 这里注意减去容器上padding
                    state.selectedIndex = i
                }
            }
        }, 50)
    }
    // 防抖
    const debounce = (fn, time) => {
        if(state.timer){
            clearTimeout(state.timer)
        }
        state.timer = setTimeout(() => {
            state.timer = null;
            fn()
        }, time)
    }
    const createApp = () => {
        // 判断是否有开发平台菜单
        let menu = props.menu
        if(menu && menu.some(m => m.title === '开放平台')){
            // 有菜单跳转开放平台
            let openMenu = menu.filter(m => m.title === '开放平台')[0];
            openMenu &&  openWindow(openMenu.path)
        }else if(props.url){
            openWindow(props.url)
        }else{
            // 没菜单提示没权限
            ElMessage.warning({
                message: '当前您暂无开放平台创建应用权限，请联系管理员！',
                offset: 190
            })
        }
    }
</script>

<template>
    <div class="app-box">
        <div class="app-header" style='-webkit-app-region: drag;'>
<!--        <div class="app-header">-->
            <div style="display: flex;align-items: center;">
                <div class="title">
                    <img src="~/assets/img/workbench/top_icon.svg" width="18" height="18">
                    应用中心
                </div>
                <div class="search-box" style="-webkit-app-region: no-drag;">
                    <el-icon>
                        <Search />
                    </el-icon>
                    <el-select
                            v-model="state.value"
                            style="width:250px"
                            filterable
                            clearable
                            remote
                            reserve-keyword
                            @change="(val) => openApp(val, state.options)"
                            placeholder="请输入应用名称"
                            :remote-method="remoteMethod"
                            :loading="state.loading">
                        <el-option
                                v-for="item in state.options"
                                :key="item.id"
                                :label="item.appName"
                                :value="item.url">
                            <img :src="item.appLogo" width="20px" height="20px" style="margin-right: 3px;vertical-align: -4px">
                            <span>{{item.appName}}<span style="color: #9199AC;margin-left: 5px;font-size: 12px">{{item.subhead.length>10?item.subhead.slice(0,10)+'...':item.subhead}}</span></span>
                        </el-option>
                    </el-select>
                    <span>搜索</span>
                </div>
            </div>
            <el-icon @click="close" style="-webkit-app-region: no-drag;cursor: pointer"><Close /></el-icon>
        </div>
        <div class="app-list">
            <el-scrollbar class="left">
                <div style="padding: 17px 20px;">

                    <a
                            @click="typeClick(index)"
                            :class="['type-title', state.selectedIndex === index ? 'active' : '']"
                            v-for="(type, index) in state.appList"
                            :key="type.cid"
                    >
                        <svg-icon v-if="type.img" :icon-class="type.img" style="font-size:14px;"></svg-icon>
                        <span style="margin-left: 5px">{{type.appTypeName}}</span>
                    </a>
                </div>
                <el-button type="primary" @click="createApp" class="create-app-btn">
                    <el-icon style="margin-right:5px"><CirclePlus /></el-icon>
                    创建应用
                </el-button>
            </el-scrollbar>
            <el-scrollbar ref="scrollbarRef" style="height: 100%;margin-left:160px;">
                <div style="padding: 25px 40px 25px 35px;">
                    <div ref="rightItemRef" v-for="(item) in state.appList" :key="item.cid" class="right-item">
                        <div :id="item.cid" class="type-name">{{item.appTypeName}}</div>
                        <div class="app-wrap">
                            <div @click="openApp(app)" class="app-item" v-for="app in item.appList" :key="app.id" v-show="app.isShow">
                                <div style="width: 50px;height: 50px;position: relative;margin-right: 12px;">
                                    <img :src="app.appLogo" width="50" height="50" style="border-radius: 50%;object-fit: cover;">
                                    <div v-show="state.showLoading===app.id" class="loading"></div>
                                </div>

                                <div class="app-dsc">
                                    <div class="title">{{app.appName}}</div>
                                    <div class="app-info" v-if="app.subhead">{{app.subhead.length>10?app.subhead.slice(0,10)+'...':app.subhead}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-scrollbar>

        </div>
        <!--    <iframe style="display: none"  frameborder=0 name="showHere" scrolling=auto-->
        <!--             :src="'https://'+loginUrl1+'.aeotrade.com/web/sso_login?user_token=E3C81766939E292F943A4EFED58E92B3&hmm_user_id='+id+'&hmm_user_name='+staffname+'&hmm_company_id='+member+'&hmm_company_name='+membername+'&hmm_user_role='+role+'&erp_menu=product_list'">-->
        <!--    </iframe>-->
        <!--    <iframe style="display: none"  frameborder=0 name="showHere" scrolling=auto-->
        <!--             :src="'https://'+loginUrl2+'.aeotrade.com/web/sso_login?user_token=E3C81766939E292F943A4EFED58E92B3&hmm_user_id='+id+'&hmm_user_name='+staffname+'&hmm_company_id='+member+'&hmm_company_name='+membername+'&hmm_user_role='+role+'&erp_menu=product_list'">-->
        <!--    </iframe>-->
        <!--    <iframe style="display: none"  frameborder=0 name="showHere" scrolling=auto-->
        <!--             :src="'https://'+loginUrl3+'.aeotrade.com/web/sso_login?user_token=E3C81766939E292F943A4EFED58E92B3&hmm_user_id='+id+'&hmm_user_name='+staffname+'&hmm_company_id='+member+'&hmm_company_name='+membername+'&hmm_user_role='+role+'&erp_menu=product_list'">-->
        <!--    </iframe>-->
    </div>
</template>

<style scoped lang="scss">
   :deep(.el-input__inner){
        background: transparent;
        border: none;
        color: #919AAC!important;
    }
    .loading{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        border-radius: 50%;
        background-image: conic-gradient(transparent 0deg, transparent 95deg, black 95deg);
        opacity: .4;
    }
    .app-box{
        /*height: 100%;*/
        position: fixed;
        width: 1020px;
        height: 680px;
        z-index: 2000;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #fff;
        color: rgba(16, 16, 16, 100);
        box-shadow: 0px 8px 22px 0px rgba(6, 11, 42, .15);
    }
    .app-header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        padding:0px 20px 0px 30px;
        box-shadow: 0px 2px 6px 0px rgba(var(--el-color-primary-rgb), .10);
        .title{
            color: rgba(16, 16, 16, 100);
            font-size: 16px;
            font-weight: bold;
            display: flex;
            align-items: center;
            img{
                margin-right: 8px;
            }
        }
        .search-box{
            padding-right: 10px;
            height: 33px;
            margin-left: 90px;
            padding-left: 12px;
            display: flex;
            align-items: center;
            background-color: rgba(242, 244, 249, 100);
            font-size: 12px;
            border-radius: 27px;
            color: #919AAC;
            span{
                cursor: pointer;
            }
            :deep(.el-input__wrapper){
                background-color: #f2f4f9;
                border: none;
                box-shadow: none!important;
            }
        }
        .el-icon-close{
            font-size: 16px;
            cursor: pointer;
        }
    }
    .app-list{
        width: 100%;
        /*height: calc(100% - 50px);*/
        height: 630px;
        position: relative;
    }

    .app-list .left{
        position: absolute;
        top: 0;
        left: 0;
        width: 160px;
        height: 100%;
        border-right: 1px solid #E9E9EE;

        .type-title{
            display: flex;
            align-items: center;
            color: rgba(85, 90, 111, 100);
            font-size: 12px;
            height: 30px;
            padding-left: 10px;
            margin-bottom: 5px;
            &:hover{
                cursor: pointer;
                background: #F6F7FF;
            }
        }
        .active{
            background: #F6F7FF;
            color: var(--el-color-primary);
        }
    }
    .app-list{
        .right-item{
            margin-bottom: 26px;
            .type-name{
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 18px;
            }
            .app-wrap{
                display: flex;
                flex-wrap: wrap;
                margin: 0 -10px;
                .app-item{
                    margin: 0 10px 20px 10px;
                    width: 248px;
                    height: 86px;
                    display: flex;
                    font-size: 14px;
                    color:#101010 ;
                    align-items: center;
                    padding-left: 20px;
                    border: 1px solid rgba(242, 242, 247, 100);
                    background: #fff;
                    cursor: pointer;
                    &:hover{
                        box-shadow: 0px 0px 20px 0px rgba(var(--el-color-primary-rgb), .10);
                    }
                    .title{
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        -webkit-box-orient: vertical;
                    }
                    .app-info{
                        font-size: 12px;
                        margin-top: 2px;
                        color: #9199AC;
                    }
                }
            }

        }
    }
    .create-app-btn{
        line-height: 30px;
        position: absolute;
        padding: 0;
        bottom: 105px;
        left: 26px;
        width: 108px;
        height: 30px;
        border-radius: 22px;
        font-size: 14px;
        text-align: center;
    }
</style>
