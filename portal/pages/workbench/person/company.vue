<script setup>
import {
  apiQuitCompanyCheck,
  apiDelStaff,
  apiGetUserInfo,
  apiSetClientCookie,
  apiGetMyCompanyList,
  apiGetWorkbenchList, apiGetWorkbenchLast
} from '~/api/api'
import {cookies} from "~/composables";

    const {user} = useUser()

    const state = reactive({
        loginMessage: user ? user.value.bind : null,
        companyLoading: false,
        current: cookies.getItem('memberId') || '',
        list: [],
        msg: {
            '1': '组织内已经没有其他成员，退出企业同时关闭该组织。',
            '2': '请指定新的主管理员后再退出组织。',
            '3': '确定退出当前组织？'
        }
    })

    //退出组织弹框信息
    const esc = (item) => {
        let params = {
            memberId: item.id,
            staffId: state.loginMessage.staffid
        }
        apiQuitCompanyCheck(params).then(res => {
            let text = state.msg[res.result];
            ElMessageBox.confirm(text, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                sureEsc(params);
            })
        })
    }
    // 确定退出
    const sureEsc = (params) => {
        apiDelStaff(params).then(res => {
            getMyOrgInfo()
        })

    }
    // 切换企业
    const switchRoles = async(item) => {
        cookies.removeItem('WORKBENCHNID');
        switchMember(item);
    }
    // 个人切换到企业工作台
    const switchMember = async (item) => {
        let params = {
            staffId: cookies.getItem('staffId'),
            memberId: item.id.toString(),
            type: 2
        }
       if('firm' === 'firm'){
          let params={
            apply: 1,
            id: item.id.toString()
          }
          let res= await apiGetWorkbenchList(params)
          let list=res.result
          const {workbench} = useWorkbench()
          workbench.value = res.result
          let currentWorkbench = list[0]

          cookies.setItem('WORKBENCHNID', currentWorkbench?.workbenchId)
          cookies.setItem('WORKBENCHN', currentWorkbench?.workbenchName)
          let data={
            memberId: item.id.toString(),
            workBenchId:currentWorkbench?.workbenchId,
            staffId:cookies.getItem('staffId')
          }
          apiGetWorkbenchLast(data)
        }

        apiGetUserInfo(params).then(res => {
            cookies.setItem('kindId', res.result.bind.kindid);

            nextTick(function () {
                if ('firm' == 'firm') {
                    cookies.setItem('memberId', item.id);
                    sessionStorage.setItem('WORKBENCHINDEX', 1);
                }
                cookies.removeItem('wbin');
                cookies.setItem('jump', 1);
                window.location.href = '/workbench';

            });
        });
    }
    const getMyOrgInfo = () => {
        state.companyLoading = true
        apiGetMyCompanyList({id: state.loginMessage.staffid}).then(res => {
            let myOrgList = res.result.admin || [];
            let meJoinedOrgList = res.result.staff || [];
            myOrgList.forEach(item => {
                item.type = 1
            })
            meJoinedOrgList.forEach(item => {
                item.type = 2
            })
            state.list = [...myOrgList, ...meJoinedOrgList];
            state.companyLoading = false;

        }).catch(e => {
            state.companyLoading = false
        })
    }

    await getMyOrgInfo()
</script>

<template>
  <div style="width: 100%">
    <div style="color: rgba(16, 16, 16, 1);padding-left: 20px;background-color:#fff;font-size: 14px;margin-bottom: 16px;height: 40px;line-height: 40px">我的组织<span style="color: #424242;font-size: 12px;line-height: 40px;font-weight: normal;margin-left: 20px">创建或者加入的组织</span></div>
    <div class="container">
      <div class="list">
        <el-scrollbar v-loading="state.companyLoading" style="height: calc(100vh - 171px);" v-if="state.list.length">
          <div :class="{'item':true,'current':state.current === item.id}" v-for="(item,i) in state.list" :key="i">
            <div class="info">
              <img class="logo" :src="item.logoImg"/>
              <div class="words">
                <div class="name">{{item.memberName}}</div>
                <div class="time">{{(item.type==1?'创建时间':'加入时间') + item.createdTime}}</div>
              </div>
            </div>
            <div class="btn">
              <div class="btn-item" v-if="state.current !== item.id" @click="switchRoles(item)">切换组织</div>
              <div class="btn-item e" @click="esc(item)">退出组织</div>
            </div>
          </div>
        </el-scrollbar>
        <div v-else class="no-data">
          <svg-icon icon-class="no_organization" style="width:230px;height: 230px"></svg-icon>
          <div>你当前还没有创建或者加入的组织！</div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">
    .no-data{
        height: 65vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        div{
            font-size: 14px;
        }
    }
    .container {
        padding:0 20px;
        width: 100%;
        background-color: #F7F8F9;
    }

    .base-title {
        height: 20px;
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
        margin-bottom: 35px;
    }

    .card-title {
        @extend .base-title;
        font-weight: bold;
    }

    .card-title:before {
        content: '';
        width: 2px;
        height: 17px;
        background-color: #3370FF;
        display: inline-block;
        vertical-align: -4px;
        margin-right: 15px;
    }

    .list {
        background-color: #fff;
        padding: 20px;
        border-radius: 3px;
        .item {
            height: 125px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 14px 0 24px;
            border-radius: 4px;
            margin-bottom: 20px;
            background-color: rgba(189, 189, 189, 0.15);

            .info {
                display: flex;
                font-size: 16px;

                .logo {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    margin-right: 14px;
                    object-fit: cover;
                }

                .words {
                    font-size: 16px;
                    display: flex;
                    justify-content: center;
                    /*align-items: center;*/
                    flex-direction: column;
                    .name {
                        font-size: 14px;
                        margin-bottom: 10px;
                        font-weight: bold;
                    }
                    .time{
                        font-size: 12px;
                    }
                }
            }

            .btn {
                display: flex;

                .btn-item {
                    width: 100px;
                    height: 32px;
                    margin: 0 10px;
                    border-radius: 4px;
                    background-color: rgba(var(--el-color-primary-rgb), 1);
                    color: rgba(255, 255, 255, 1);
                    font-size: 14px;
                    text-align: center;
                    line-height: 32px;
                    cursor: pointer;

                    &:hover {
                        background-color: rgba(var(--el-color-primary-rgb), .9);
                    }

                    &.e {
                        color: rgba(255, 0, 0, 1);
                        background-color: transparent;
                        border: 1px solid rgba(255, 0, 0, 1);
                        &:hover{
                            background-color: rgba(255, 0, 0, 0.04);
                        }
                    }
                }
            }

            &.current {
                background-color: #fff;
                border: 1px solid rgba(var(--el-color-primary-rgb), 1);
            }
        }
    }
</style>
