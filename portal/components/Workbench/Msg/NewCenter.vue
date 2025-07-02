<script setup>
    import {getMsgInfoApi,getMsgDetailApi,handleReadApi} from "@/api/api"
    const hasNewMsg = useHasMsg()
    const activeName = ref('')
    const dialogActiveName = ref('')
    const sortList = ref([])
    const msgList = ref([])
    const msgDetails = ref({})
    const loading = ref(false)
    const moreVisible = ref(false)
    const dialogVisible = ref(false)
    const msgType = ref('')
    const showMore = useMsgCenter()
    const msgData = reactive({
        staffId: cookies.getItem('staffId'),
        memberId: cookies.getItem('memberId'),
        readMark:'',
        messageType:'',
        pageNo:1,
        pageSize:100
    })
    sortList.value = [
        {label:'全部',name:'',readMark:'0'},
        {label:'提醒',name:'3',readMark:'0'},
        {label:'通知',name:'2',readMark:'0'},
        {label:'公告',name:'1',readMark:'0'},
    ]
    const getMsg = async ()=>{
        loading.value = true;
        let res = await getMsgInfoApi({...msgData})
        loading.value = false;
        msgList.value = res.result.pagelist.records;
        sortList.value.forEach(item=>{
            if(item.label === '提醒'){
                item.readMark = res.result['3count'];
            }else if(item.label === '通知'){
                item.readMark = res.result['2count'];
            } else if(item.label === '公告'){
                item.readMark = res.result['1count'];
            }
        })
        sortList.value[0].readMark = Number(res.result['1count']) + Number(res.result['2count']) + Number(res.result['3count'])+ Number(res.result['4count'])
        hasNewMsg.useHasMsg.value = sortList.value[0].readMark
    }
    onMounted(async()=>{
        await nextTick()
        getMsg()
    })

    const look = (msg)=>{
        const id = msg.messageId
        getMsgDetailApi({id}).then(res=>{
            handleReadApi({memberId: msg.mamberId,staffId: cookies.getItem('staffId'),msgMessageId:id}).then(res=>{
                getMsg()
            })
            if(res.result.detailsType == 1){
                dialogVisible.value = true;
                msgDetails.value = res.result
            }else if(res.result.detailsType == 2){
                window.open(res.result.messageDetails)
            }
        })
    }

    const more = ()=>{
        showMore.msgCenter.value = true
    }
    const tabChange = ()=>{
        msgData.messageType = activeName.value
        getMsg()
    }

    const reset = (done)=>{
        msgData.readMark = ''
        done()
    }
    watch(()=>showMore.msgCenter.value,(val)=>{
        if(!val){
            getMsg()
        }
    })
</script>

<template>
    <div class="msg">
        <div class="head">
            <div class="title">消息中心</div>
            <div class="btn" @click="more">查看全部 ></div>
        </div>
        <el-tabs v-model="activeName" class="demo-tabs" @tab-change="tabChange">
            <el-tab-pane v-for="(item,i) in sortList" :key="i" :label="item.label" :name="item.name">
                <template #label>
                    <div class="custom-tabs-label">
                        <div class="red-dot" v-if="item.readMark!='0'"></div>
                        {{item.label}}
                    </div>
                </template>
            </el-tab-pane>
        </el-tabs>
        <div v-loading="loading">
            <el-scrollbar class="msg-list" v-if="msgList.length">
                <div class="item" v-for="(msg,i) in msgList" :key="i" >
                    <div :class="{'info':true,'is-read':msg.readMark==1}">
                        <img v-if="msg.messageType == 1" class="icon" width="30" height="30" src="@/assets/img/workbench/gg.png"/>
                        <img v-else-if="msg.messageType == 2" class="icon" width="30" height="30" src="@/assets/img/workbench/tz.png"/>
                        <img v-else-if="msg.messageType == 3" class="icon" width="30" height="30" src="@/assets/img/workbench/tx.png"/>
                        <div class="words">
                            <div class="title">
                                <span>{{msg.messageTitle}}</span>
                                <div class="time">{{msg.sendTime.slice(0,16)}}</div>
                            </div>
                            <div class="content">{{msg.messageContent}}</div>
                            <div class="company">
                                <span>{{msg.mamberName}}</span>
                                <div v-if="msg.detailsType != 3">
                                    <div v-if="!msg.mamberId || msg.mamberId==cookies.getItem('memberId')"  class="btn" @click.stop="look(msg)">{{msg.detailButton}}</div>
                                    <div v-else-if="msg.mamberId!=cookies.getItem('memberId')">
                                        <el-popconfirm
                                                width="276px"
                                                confirm-button-text="确定"
                                                cancel-button-text="取消"
                                                :hide-icon="true"
                                                :teleported="true"
                                                placement="top-end"
                                                :title="`确定将组织切换为${msg.mamberName}企业查看消息详情吗？`"
                                                @confirm="switchRoles('firm',{id:msg.mamberId})">
                                            <template #reference>
                                                <div class="btn">{{msg.detailButton}}</div>
                                            </template>
                                        </el-popconfirm>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
<!--                    <div class="handle">-->
<!--                        <div class="time">{{msg.sendTime.slice(0,16)}}</div>-->
<!--                        <div v-if="msg.detailsType != 3">-->
<!--                            <div v-if="!msg.mamberId || msg.mamberId==cookies.getItem('memberId')"  class="btn" @click.stop="look(msg)">{{msg.detailButton}}</div>-->
<!--                            <div v-else-if="msg.mamberId!=cookies.getItem('memberId')">-->
<!--                                <el-popconfirm-->
<!--                                        width="276px"-->
<!--                                        confirm-button-text="确定"-->
<!--                                        cancel-button-text="取消"-->
<!--                                        :hide-icon="true"-->
<!--                                        :teleported="true"-->
<!--                                        placement="top-end"-->
<!--                                        :title="`确定将组织切换为${msg.mamberName}企业查看消息详情吗？`"-->
<!--                                        @confirm="switchRoles('firm',{id:msg.mamberId})">-->
<!--                                    <template #reference>-->
<!--                                        <div class="btn">{{msg.detailButton}}</div>-->
<!--                                    </template>-->
<!--                                </el-popconfirm>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </div>-->
                </div>
            </el-scrollbar>
            <div class="msg-list no-data" v-else>
                <img src="@/assets/img/workbench/nodata.png"/>
                <div>你还没有收到消息哟！</div>
            </div>
        </div>
    </div>
    <workbench-msg-dialog v-model:visible="dialogVisible" :msgDetails="msgDetails"></workbench-msg-dialog>
</template>

<style scoped lang="scss">
    .dialog-btn{
        position: absolute;
        right: 20px;
        top: 75px;
    }
    .custom-tabs-label{
        position: relative;
        .red-dot{
            position: absolute;
            top: 0;
            left: 30px;
            width: 7px;
            height: 7px;
            background-color: red;
            border-radius: 50%;
        }
    }
    .msg-list{
        height: 425px;
        margin-top: 5px;
        .item{
            padding: 15px 10px;
            border-bottom: 1px solid rgba(187, 187, 187, 0.5);
            .info{
                display: flex;
                .icon{
                    margin-right: 10px;
                }
                .words{
                    flex: 1;
                    color: rgba(154, 154, 154, 1);
                    .title{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        color: rgba(16, 16, 16, 1);
                        font-size: 14px;
                        margin-bottom: 7px;
                        .time{
                            color: rgba(153, 153, 153, 1);
                            font-size: 12px;
                            margin-bottom: 7px;
                        }
                    }
                    .content{
                        font-size: 12px;
                        margin-bottom: 6px;
                    }
                    .company{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 10px;
                        .btn{
                            float: right;
                            font-size: 12px;
                            color: var(--el-color-primary);
                            cursor: pointer;
                        }
                    }
                }
                &.is-read{
                    opacity: .5;
                }
            }
            .handle{
                flex-shrink: 0;
                width: 95px;
                .time{
                    color: rgba(153, 153, 153, 1);
                    font-size: 12px;
                    margin-bottom: 7px;
                }
                .btn{
                    float: right;
                    font-size: 12px;
                    color: var(--el-color-primary);
                    cursor: pointer;
                }
            }

        }
        &.no-data{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            img{
                width: 250px;
            }
        }
    }
    .msg{
        margin-top: 16px;
        border-radius: 10px;
        background-color: rgba(255, 255, 255, 1);
        padding: 20px;
        .head{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .title{
                color: rgba(64, 64, 64, 1);
                font-size: 18px;
                font-weight: bold;
            }
            .btn{
                font-size: 14px;
                color: #909090;
                cursor: pointer;
            }
        }


    }
</style>
