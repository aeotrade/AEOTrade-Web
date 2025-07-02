<script setup>
import { getMainManagerApi, getStaffListApi, setMainManagertApi } from '@/api/api'
const { user } = useUser();
const loginMessage = user.value.bind
const isAdmin = ref(false);
const show = ref(false);
const radio = ref(null);
const total = ref(0);
const mainManagerInfo = ref([]);
const staffList = ref([]);
const pageObj = reactive({
    pageSize: 10,
    pageNo: 1
});
watch(show, () => {
    radio.value = null;
});
onMounted(async () => {
    await nextTick()
    getList()
})

function getList() {
    mainManagerInfo.value = []
    getMainManagerApi({ memberId: loginMessage.memberid }).then((res) => {
        isAdmin.value = cookies.getItem('staffId') == res.result.id ? 1 : 0;
        mainManagerInfo.value.push(res.result);
    });
}

function changeMainManager() {
    getChildManagerList()
    show.value = true;
}

function getChildManagerList() {
    let params = {
        memberId: loginMessage.memberid,
        pageSize: pageObj.pageSize,
        pageNo: pageObj.pageNo,
        workbenchId: cookies.getItem('WORKBENCHNID')
    }
    getStaffListApi(params).then((res) => {
        total.value = res.totalSize;
        staffList.value = res.result;
    });
}

function sure() {
    if (radio.value === null) {
        ElMessage({
            message: '请选择员工！',
            type: 'error'
        });
        return false;
    }
    setMainManager();
}

function setMainManager() {
    let params = {
        memberId: loginMessage.memberid,
        staffId: radio.value
    }
    setMainManagertApi(params).then((res) => {
        ElMessage({
            message: '设置成功！',
            type: 'success'
        });
        show.value = false;
        getList();
    });
}

function handleSizeChange(val) {
    pageObj.pageSize = val;
    getChildManagerList();
}

function handleCurrentChange(val) {
    pageObj.pageNo = val;
    getChildManagerList();
}
</script>


<template>
    <div class="sm-container" style="min-height: 717px;width:980px;">
        <div class="clearfixHeader">
            <div style="font-size: 18px;color: rgb(16, 16, 16)">主管理员</div>
            <div v-if="isAdmin" class="btn" @click="changeMainManager">修改主管理员 ></div>
        </div>
        <div>
            <el-table :data="mainManagerInfo" style="width: 100%">
                <el-table-column prop="staffName" align="center" label="姓名">
                </el-table-column>
                <el-table-column prop="date" align="center" label="角色">
                    <template #default="scope">
                        <div>主管理员</div>
                    </template>
                </el-table-column>
                <el-table-column prop="tel" align="center" label="手机">
                </el-table-column>
                <el-table-column prop="contactEmail" align="center" label="邮箱">
                </el-table-column>
            </el-table>
        </div>


        <el-dialog custom-class="" v-model="show" :close-on-click-modal="false" title="修改主管理员" top="9vh" width="680px">
            <template #header>
                <div style="font-size:16px;">修改主管理员<span
                        style="font-size: 12px;font-weight: normal;margin-left: 12px;">修改主管理员后你将失去主管理员角色，如需特殊权限请联系新的主管理员为你分配权限。</span>
                </div>
            </template>
            <el-table row-key="tel" :data="staffList" max-height="528px" style="width: 100%;">
                <el-table-column label="选择" align="center" width="55">
                    <template #default="scope">
                        <el-radio v-model="radio" :label="scope.row.id">&nbsp;
                        </el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="staffName" align="center" label="姓名">
                </el-table-column>
                <el-table-column prop="role" label="角色">
                    <template #default="scope">
                        {{ scope.row.role === '主管理员' ? '主管理员' : scope.row.role && JSON.parse(scope.row.role).join('，')
                        }}
                    </template>
                </el-table-column>
                <el-table-column prop="tel" align="center" label="手机">
                </el-table-column>
                <el-table-column prop="contactEmail" align="center" label="邮箱">
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="pageObj.pageNo" :page-sizes="[10, 15, 20]" :page-size="pageObj.pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>

            <div style="height: 48px"></div>
            <div style="text-align: center;">
                <el-button style="width: 80px;font-size: 14px" @click="show = false">取消</el-button>
                <el-button style="width: 80px;font-size: 14px" type="primary" @click="sure">保存</el-button>
            </div>
            <div style="height: 10px"></div>
        </el-dialog>
    </div>
</template>


<style scoped lang="scss">
.pagination {
    margin: 30px 0 0 135px;
}

.sm-container {
    background-color: #fff;
    padding: 0 20px 50px;
}

.clearfixHeader {
    height: 80px;
    color: #424242;
    font-size: 18px;
    border-bottom: 1px solid #EEEEEE;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    i:hover {
        cursor: pointer;
        color: var(--el-color-primary);
    }

    .btn {
        line-height: 20px;
        font-size: 14px;
        cursor: pointer;
        background-color: rgba(255, 255, 255, 0);
        text-align: center;
        color: var(--el-color-primary);
    }
}

.messageBox {
    width: 100%;
    height: 100vh;
    position: fixed;
    z-index: 999;
    top: 0px;
    left: 0;

    .modal {
        width: 100%;
        height: 100%;
        background-color: #000;
        opacity: .2;
    }
}

.messageBoxContent {
    position: absolute;
    left: 0;
    right: 0;
    top: 130px;
    margin: 0 auto;
    padding: 0 30px 30px 30px;
    width: 1030px;
    line-height: 20px;
    background-color: #fff;
    border-radius: 3px;
    background-color: rgba(255, 255, 255, 1);
    border: 1px solid rgba(255, 255, 255, 0);
}

.sure {
    width: 123px;
    height: 30px;
    line-height: 30px;
    border-radius: 68px;
    background-color: rgba(255, 255, 255, 0);
    text-align: center;
    border: 1px solid rgba(var(--el-color-primary-rgb), 0.3);
    color: var(--el-color-primary);
    margin: 20px;
    cursor: pointer;
}
</style>
