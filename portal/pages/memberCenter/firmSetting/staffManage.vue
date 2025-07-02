<script setup>
import {
    staffInfoApi,
    deptListApi,
    addStaffApi,
    getStaffListApi,
    delStaffApi,
    getRolesByUserIdApi,
    getRolesListApi,
    assignRolesApi, apiAddStaff
} from '@/api/api'
const Config = useAppConfig()
var checkMobile = (rule, value, callback) => {
    if (value === "") {
        callback(new Error("手机号不可为空"));
    } else {
        if (value !== "") {
            var reg = /^1[3-9]\d{9}$/;
            if (!reg.test(value)) {
                callback(new Error("请输入有效的手机号码"));
            }
        }
        callback();
    }
};
const { user } = useUser();
const data = reactive({
    edit: false,
    editForm: {
        staffName: '',
        tel: '',
        email: '',
        roleId: [],
        deptId: []
    },
    searchForm: {
        roleId: '',
        staffName: '',
        deptId: ''
    },
    docCabinetDetailLeftWidth: 220,
    docCabinetDetailLeftClientX: 0,
    departmentList: [],
    rolesType: [],
    staffMsg: {
        name: '',
        tel: '',
        roleId: [],
        deptId: []
    },
    rules: {
        tel: [
            { required: true, message: "请输入手机号", trigger: "blur" },
            {
                validator: checkMobile,
                min: 11,
                max: 11,
                message: "手机号格式错误",
                trigger: "blur",
            },
        ],
        name: [
            { required: true, message: "请输入姓名", trigger: "blur" },
            { min: 1, max: 10, message: "姓名不超过10个字", trigger: "blur" },
        ],
        roleId: [
            { required: true, message: "请选择员工角色", trigger: "change" }
        ]
    },
    roleList: [],
    assVisible: false,
    allRoleList: [],
    allocRoleIds: '',
    options: [],
    value: [],
    staffId: '',
    tableData: [],
    show: false,
    radio: '',
    pageObj: {
        pageSize: 10,
        pageNo: 1
    },
    total: null,
    loginMessage: user.value.bind,
    dialogVisible: false,
    phone: '',
})
const id = ref(null)
const qrcode = ref(null)
const ruleForm = ref(null)

const leftWidth = computed({
    get() {
        let width = data.docCabinetDetailLeftWidth
        let setWidth = localStorage.getItem('docCabinetDetailLeftWidth')
        width = setWidth || width
        return width + 'px'
    },
    set(val) {
        if (val < 220) val = 220
        if (val > 280) val = 280
        data.docCabinetDetailLeftWidth = val
        localStorage.setItem('docCabinetDetailLeftWidth', val)

        if (val === 220 || val === 280) {
            resizeBarMouseUp()
        }
    }
})
onMounted(async () => {
    await nextTick();
    getAllRoleList()
    let params = getUrlData();
    if (params && params.state) {
        params = Object.assign({}, params, { memberId: data.loginMessage.memberid });
        addUser(params);
    }
    getDeptList();
    getList();
});

function getDeptList() {
    deptListApi({ memberId: data.loginMessage.memberid }).then(res => {
        data.departmentList = res.result;
        data.departmentList[0].disabled = true;
    })
}

const defaultProps = {
    children: 'children',
    label: 'label',
}

function handleEdit(id) {
    data.staffId = id;
    let params = {
        staffId: id,
        memberId: data.loginMessage.memberid,
        workbenchId: cookies.getItem('WORKBENCHNID')
    }
    staffInfoApi(params).then(res => {
        data.editForm = res.result
        data.edit = true
    })
}

function saveInfo() {
    let params = {
        roleId: data.editForm.roleId.toString(),
        deptId: data.editForm.deptId.toString(),
        staffId: data.staffId,
        workBnechId: cookies.getItem('WORKBENCHNID'),
        memberId: data.loginMessage.memberid,
    }
    assignRolesApi(params).then(res => {
        data.edit = false;
        getList();
        getDeptList();
    })
}

function confirmAddStaff() {
    apiAddStaff({
        memberId: user.value.bind.memberid,
        staffId: user.value.bind.staffid,
        roleId: data.staffMsg.roleId,
        deptId: data.staffMsg.deptId,
        mobile: data.staffMsg.tel,
        name: data.staffMsg.name
    }).then(res => {
        if (res.code === 200) {
            ElMessage.success('添加成功')
            data.show = false
        } else {
            ElMessage.error('添加失败');
        }
        getDeptList()
        getList()
    })
}


function hiddenhad() {
    data.show = false
    data.staffMsg.name = '';
    data.staffMsg.tel = '';
}

//分配
function ass(id) {
    data.staffId = id;
    data.assVisible = true;
    getRoleListByAdmin(id);
}

async function getRoleListByAdmin(adminId) {
    let params = {
        adminId: adminId,
        workBnechId: cookies.getItem('WORKBENCHNID'),
        memberId: data.loginMessage.memberid
    }
    const res = await getRolesByUserIdApi(params)
    let allocRoleList = res.data;
    data.allocRoleIds = [];
    if (allocRoleList != null && allocRoleList.length > 0) {
        for (let i = 0; i < allocRoleList.length; i++) {
            data.allocRoleIds.push(allocRoleList[i].id);
        }
    }
}

async function getAllRoleList() {
    const [res, res2] = await Promise.all([getRolesListApi({
        platform: 1,
        platformId: cookies.getItem('WORKBENCHNID'),
        memberId: data.loginMessage.memberid
    }), getRolesListApi({
        platform: 1,
        platformId: cookies.getItem('WORKBENCHNID'),
        memberId: 0
    })])
    let arr = [
        {
            label: '自建角色',
            roles: res.data,
        },
        {
            label: '系统角色',
            roles: res2.data,
        }
    ]
    arr.forEach(item => {
        if (item.roles.length) {
            data.rolesType.push(item)
        }
    })
}

//确认分配
function sureAss() {

    ElMessageBox.confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        let params = new URLSearchParams();
        params.append("staffId", data.staffId);
        params.append("roleId", data.allocRoleIds);
        params.append("workBnechId", cookies.getItem('WORKBENCHNID'));
        params.append("memberId", data.loginMessage.memberid);

        await assignRolesApi(params).then(res => {
            ElMessage({
                message: '分配成功！',
                type: 'success'
            });
            cookies.setItem('res', res.res)
            getList();
            data.assVisible = false;
        })

    })
}

function inviteStaff() {
    data.show = true;
}

function addUser(params) {
    data.loading = true
    addStaffApi(params).then((res) => {
        data.loading = false;
        getList();
    }).catch((error) => {

        data.loading = false;
        getList();
    });
}

function getList() {
    let params = {
        ...data.searchForm,
        memberId: data.loginMessage.memberid,
        pageSize: data.pageObj.pageSize,
        pageNo: data.pageObj.pageNo,
        workbenchId: cookies.getItem('WORKBENCHNID')
    }
    getStaffListApi(params).then((res) => {
        data.tableData = res.result;
        data.total = res.totalSize;
        data.loading = false;
    });
}

function handleSizeChange(val) {
    data.pageObj.pageNo = 1;
    data.pageObj.pageSize = val;
    getList();
}

function handleCurrentChange(val) {
    data.pageObj.pageNo = val;
    getList();
}

function deleteStaff(id) {
    data.staffId = id;
    data.dialogVisible = true;
}

function handleNodeClick(node) {
    data.pageObj.pageNo = 1;
    data.searchForm.deptId = node.id;
    getList();
}

function search() {
    data.pageObj.pageNo = 1;
    getList();
}

function searchAll() {
    myTree.value.setCurrentKey()
    data.pageObj.pageNo = 1;
    data.searchForm.deptId = '';
    getList();
}

function sureDel() {
    delStaffApi({ memberId: data.loginMessage.memberid, staffId: data.staffId }).then((res) => {
        ElMessage({
            message: '删除成功！',
            type: 'success'
        });
        data.dialogVisible = false
        getDeptList()
        getList();
    });
}

function getUrlData() {
    let params = {};

    let arr = location.href.split('?');

    if (arr.length <= 1) {
        return params;
    }
    arr.forEach(ls => {
        ls = ls.split('&');
        if (ls.length > 1) {
            for (let i = 0, l = ls.length; i < l; i++) {
                let a = ls[i].split('=');

                params[a[0]] = a[1];
            }
        }
    })
    return params;
}

// 开始拖拽
function resizeBarMouseDown(e) {
    data.docCabinetDetailLeftClientX = e.clientX
    document.addEventListener('mousemove', resizeBarMouseMove)
    document.addEventListener('mouseup', resizeBarMouseUp, { once: true })
}

// 拖拽中
function resizeBarMouseMove(e) {
    if (e.clientX) {
        let dragDistance = e.clientX - data.docCabinetDetailLeftClientX
        if (dragDistance) {
            leftWidth.value = parseInt(leftWidth.value) + dragDistance
            data.docCabinetDetailLeftClientX = e.clientX
        }
    }
}

// 拖拽完成
function resizeBarMouseUp(e) {
    document.removeEventListener('mousemove', resizeBarMouseMove)
}

const myTree = ref('')
</script>


<template>
    <div class="sm-container" style="min-height: 637px;width:980px;margin-bottom: 30px">
        <div class="clearfixHeader">
            <div style="font-size: 18px;color: rgb(16, 16, 16)">员工管理</div>
            <div style="line-height: 20px;font-size: 14px;cursor: pointer;color: var(--el-color-primary);"
                @click="inviteStaff">添加员工</div>
        </div>
        <div class="content">
            <div class="list" :style="{ width: leftWidth, minWidth: leftWidth }">
                <el-scrollbar style="height: 630px;" v-if="data.departmentList.length">
                    <div class="company" @click="searchAll">
                        <img width="32" src="@/assets/img/member/company.svg">
                        <span class="company-name" :title="data.departmentList[0].deptName">{{
                            data.departmentList[0].deptName }}</span>
                        <span class="nums">（{{ data.departmentList[0].deptCount }}人）</span>
                    </div>
                    <el-tree empty-text="暂无部门，可前往部门管理添加" @node-click="handleNodeClick"
                        :props="{ children: 'children', label: 'label' }" class="my-tree" ref="myTree"
                        :data="data.departmentList[0].children" node-key="id" :expand-on-click-node="false">
                        <template #default="{ node, data }">
                            <div class="item-title" :title="data.deptName">
                                {{ data.deptName }}
                            </div>
                            <div class="nums">（{{ data.deptCount }}人）</div>
                        </template>
                    </el-tree>
                </el-scrollbar>
                <div class="left-resize-bar" draggable="true" @mousedown="resizeBarMouseDown"></div>
            </div>

            <div class="table" :style="{ width: `calc(100% - ${leftWidth})` }">
                <div class="search-box">

                    <div style="display: flex;align-items: center;">
                        <div class="item" style="margin-right: 40px;">
                            <div class="label">角色：</div>
                            <el-select clearable style="width: 200px;" v-model="data.searchForm.roleId"
                                placeholder="全部">
                                <el-option-group v-for="group in data.rolesType" :key="group.label"
                                    :label="group.label">
                                    <el-option v-for="item in group.roles" :key="item.id" :label="item.name"
                                        :value="item.id">
                                        <svg-icon v-if="item.isModel" icon-class="staff"
                                            style="color:#A8B5FF;margin-right: 8px;font-size: 20px;"></svg-icon>
                                        <svg-icon v-else icon-class="staff"
                                            style="color:#FFCE7C;margin-right: 8px;font-size: 20px;"></svg-icon>
                                        <span>{{ item.name }}</span>
                                    </el-option>
                                </el-option-group>
                            </el-select>
                        </div>
                        <div class="item">
                            <div class="label">员工姓名：</div>
                            <el-input style="width: 200px;" v-model="data.searchForm.staffName" placeholder="搜索员工" />
                        </div>
                    </div>
                    <el-button type="primary" style="width: 80px;" @click="search">查找</el-button>
                </div>

                <el-table :data="data.tableData" style="width: 100%">
                    <el-table-column prop="staffName" show-overflow-tooltip align="center" label="姓名">
                        <template #default="scope">
                            {{ decodeURI(scope.row.staffName) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="tel" align="center" show-overflow-tooltip label="手机">
                    </el-table-column>
                    <el-table-column prop="contactEmail" show-overflow-tooltip align="center" label="邮箱">
                    </el-table-column>
                    <el-table-column align="center" label="角色">
                        <template #default="scope">
                            {{ scope.row.role.substr(0, 1) == '[' ? JSON.parse(scope.row.role).join(',') :
                                scope.row.role }}
                        </template>
                    </el-table-column>
                    <el-table-column width="100" prop="date" align="center" label="操作">
                        <template #default="scope">
                            <div style="display: flex;justify-content: space-between"
                                v-show="!(scope.row.role == '主管理员' && data.loginMessage.adminName == scope.row.staffName)">
                                <div style="color:var(--el-color-primary);cursor: pointer"
                                    @click="handleEdit(scope.row.id)">
                                    编辑
                                </div>
                                <div style="color:var(--el-color-primary);cursor: pointer"
                                    @click="deleteStaff(scope.row.id)">
                                    移除
                                </div>
                            </div>

                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <div></div>
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="data.pageObj.pageNo" :page-sizes="[10, 15, 20]"
                        :page-size="data.pageObj.pageSize" layout="total, sizes, prev, pager, next, jumper"
                        :total="data.total">
                    </el-pagination>
                </div>
            </div>

        </div>
        <el-dialog custom-class="" v-model="data.show" :close-on-click-modal="false" @close="hiddenhad" title="添加员工"
            top="28vh" width="480px">
            <el-form :model="data.staffMsg" :rules="data.rules" ref="ruleForm" label-width="100px"
                class="demo-ruleForm">
                <el-form-item label="员工姓名：" prop="name">
                    <el-input v-model="data.staffMsg.name" placeholder="请输入员工姓名"></el-input>
                </el-form-item>
                <el-form-item label="所属部门：">
                    <el-tree-select no-data-text="暂无部门，可前往部门管理添加" node-key="id" style="width: 100%;"
                        :props="{ children: 'children', label: 'deptName' }" v-model="data.staffMsg.deptId"
                        :data="data.departmentList" :render-after-expand="false" default-expand-all multiple
                        show-checkbox check-strictly check-on-click-node />
                </el-form-item>
                <el-form-item label="员工角色：" prop="roleId">
                    <el-select clearable style="width: 400px;" multiple v-model="data.staffMsg.roleId"
                        placeholder="请选择">
                        <el-option-group v-for="group in data.rolesType" :key="group.label" :label="group.label">
                            <el-option v-for="item in group.roles" :key="item.id" :label="item.name" :value="item.id">
                                <svg-icon v-if="item.isModel" icon-class="staff"
                                    style="color:#A8B5FF;margin-right: 8px;font-size: 20px;"></svg-icon>
                                <svg-icon v-else icon-class="staff"
                                    style="color:#FFCE7C;margin-right: 8px;font-size: 20px;"></svg-icon>
                                <span>{{ item.name }}</span>
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机号码：" prop="tel">
                    <el-input v-model="data.staffMsg.tel" placeholder="请输入手机号码"></el-input>
                </el-form-item>
                <div style="text-align: center;margin-bottom: 20px;margin-top: 60px;">
                    <el-button type="primary" @click="confirmAddStaff">确认添加</el-button>
                </div>
                <div style="text-align: center;color: rgba(136, 136, 136, 1);font-size: 14px;">添加成功后，员工可通过手机号登录</div>
            </el-form>
        </el-dialog>
        <el-dialog custom-class="" v-model="data.edit" :close-on-click-modal="false" title="编辑员工信息" top="28vh"
            width="480px">
            <el-form :model="data.editForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="员工姓名：" prop="name">
                    <el-input disabled v-model="data.editForm.staffName" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="手机号码 ：">
                    <el-input disabled v-model="data.editForm.tel" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="邮箱：">
                    <el-input disabled v-model="data.editForm.email" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="角色 ：" prop="tel">
                    <el-select style="width: 400px;" multiple v-model="data.editForm.roleId" placeholder="请选择">
                        <el-option-group v-for="group in data.rolesType" :key="group.label" :label="group.label">
                            <el-option v-for="item in group.roles" :key="item.id" :label="item.name" :value="item.id">
                                <svg-icon v-if="item.isModel" icon-class="staff"
                                    style="color:#A8B5FF;margin-right: 8px;font-size: 20px;"></svg-icon>
                                <svg-icon v-else icon-class="staff"
                                    style="color:#FFCE7C;margin-right: 8px;font-size: 20px;"></svg-icon>
                                <span>{{ item.name }}</span>
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门：">
                    <el-tree-select no-data-text="暂无部门，可前往部门管理添加" node-key="id" style="width: 100%;"
                        :props="{ children: 'children', label: 'deptName' }" v-model="data.editForm.deptId"
                        :data="data.departmentList" :render-after-expand="false" default-expand-all multiple
                        show-checkbox check-strictly check-on-click-node />
                </el-form-item>
                <div style="text-align: center;margin-top:40px;">
                    <el-button style="width: 80px;font-size: 14px" @click="data.edit = false">取消
                    </el-button>
                    <el-button style="width: 80px;font-size: 14px" type="primary" @click="saveInfo">保存
                    </el-button>
                </div>
            </el-form>
        </el-dialog>
        <el-dialog custom-class="" v-model="data.assVisible" :close-on-click-modal="false" title="分配角色" top="28vh"
            width="680px">
            <div class="select-box" style="text-align: center">
                <el-select style="width: 400px;" multiple v-model="data.allocRoleIds" placeholder="请选择">
                    <el-option-group v-for="group in data.rolesType" :key="group.label" :label="group.label">
                        <el-option v-for="item in group.roles" :key="item.id" :label="item.name" :value="item.id">
                            <svg-icon v-if="item.isModel" icon-class="staff"
                                style="color:#A8B5FF;margin-right: 8px;font-size: 20px;"></svg-icon>
                            <svg-icon v-else icon-class="staff"
                                style="color:#FFCE7C;margin-right: 8px;font-size: 20px;"></svg-icon>
                            <span>{{ item.name }}</span>
                        </el-option>
                    </el-option-group>
                </el-select>
            </div>
            <div style="text-align: center;">
                <el-button size="small" style="width: 80px;font-size: 14px" @click="data.assVisible = false">取消
                </el-button>
                <el-button size="small" style="width: 80px;font-size: 14px" type="primary" @click="sureAss">保存
                </el-button>
            </div>
            <div style="height: 10px"></div>
        </el-dialog>

        <el-dialog custom-class="" v-model="data.dialogVisible" :close-on-click-modal="false" title="提示" top="28vh"
            width="480px">
            <p style="color: rgb(66,66,66)">您是否确认要移除员工？</p>
            <div style="height: 30px"></div>
            <div style="text-align: right;">
                <el-button size="small" style="width: 80px;font-size: 14px" @click="data.dialogVisible = false">取消
                </el-button>
                <el-button size="small" style="width: 80px;font-size: 14px" type="primary" @click="sureDel">确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>


<style scoped lang="scss">
::v-deep() {
    .el-tree__empty-text {
        white-space: nowrap;
    }

    .el-select-group__title {
        color: rgba(16, 16, 16, 1);
        font-size: 14px;
        font-weight: bold;
    }

    .my-tree {
        font-size: 14px;
        color: rgb(16, 16, 16);

        .el-tree-node__content {
            height: 32px;

            i {
                margin-left: 16px;
                color: #101010;
            }

            .item-title {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }

        .el-tree-node.is-focusable>.el-tree-node__content {
            background-color: transparent;
        }

        .el-tree-node__content:hover {
            background-color: rgba(61, 90, 254, 0.1) !important;
        }

        .el-tree-node.is-current>.el-tree-node__content {
            background-color: rgba(61, 90, 254, 0.1) !important;
        }
    }
}

.content {
    display: flex;

    .list {
        min-height: 637px;
        flex-shrink: 0;
        padding-right: 16px;
        position: relative;

        .company {
            margin-top: 10px;
            height: 32px;
            padding-left: 12px;
            display: flex;
            align-items: center;
            background-color: rgba(61, 90, 254, 0.1);
            cursor: pointer;

            img {
                margin-right: 2px;
            }

            .company-name {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .nums {
                flex-shrink: 0;
            }
        }

        .left-resize-bar {
            cursor: ew-resize;
            width: 11px;
            height: 637px;
            position: absolute;
            left: 100%;
            top: 0;
            z-index: 1;

            &::after {
                content: "";
                position: absolute;
                height: 100%;
                width: 1px;
                background-color: #bbb;
                top: 0;
                left: 4px;
            }
        }

        .left-resize-bar:hover::after {
            background-color: rgba(61, 90, 254, 0.9);
        }
    }

    .table {
        padding: 8px 0 0 13px;

        .search-box {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;

            .item {
                display: flex;
                align-items: center;
            }
        }
    }
}


#wx_after_scan {
    display: none;
}

.messageBox-main {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;

    .messageBox-main-item {
        width: 220px;
        height: 310px;
        border: 1px solid rgba(var(--el-color-primary-rgb), 0.15);
        padding-top: 30px;

        input {
            border: none;
            margin-top: 25px;
            border-bottom: 1px solid rgba(242, 242, 242, 1);
            text-align: center;
            padding: 10px;
            margin-bottom: 20px;
        }

        &:hover {
            box-shadow: 0px 2px 6px 0px rgba(var(--el-color-primary-rgb), 0.15);
            border: 1px solid rgba(var(--el-color-primary-rgb), 1);
        }
    }

    .title {
        font-size: 14px;
        color: #333333;
        text-align: center;
    }

    .des {
        margin-top: 5px;
        font-size: 12px;
        color: #999;
        text-align: center;
    }
}

.new-btn {
    width: 120px;
    height: 30px;
    margin: 0 15px;
    line-height: 30px;
    border-radius: 46px;
    font-size: 14px;
    text-align: center;
    border: 1px solid rgba(var(--el-color-primary-rgb), .3);
    background-color: #fff;
    color: var(--el-color-primary);
    cursor: pointer;

    &.cancel-btn:hover {
        background-color: rgba(var(--el-color-primary-rgb), .2);
    }

    &.sure-btn {
        background-color: var(--el-color-primary);
        color: #fff;
    }
}

.select-box {
    width: 490px;
    margin: 0px auto;
    padding: 20px 0 60px 0;
}

.erCode {
    text-align: center;

    img {
        width: 145px;
        height: 145px;
        background-color: rgba(235, 238, 242, 1);
        border: 1px solid rgba(255, 255, 255, 0);
    }
}

.pagination {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
}

.sm-container {
    background-color: #fff;
    padding: 0 20px 0px 20px;
}

.clearfixHeader {
    height: 80px;
    color: #424242;
    font-size: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    border-bottom: 1px solid #bbb;

    i:hover {
        cursor: pointer;
        color: var(--el-color-primary);
    }

    .btn {
        width: 120px;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        cursor: pointer;
        border-radius: 158px;
        background-color: rgba(255, 255, 255, 0);
        text-align: center;
        border: 1px solid rgba(var(--el-color-primary-rgb), 0.3);
        color: var(--el-color-primary);

        &:hover {
            background-color: var(--el-color-primary);
            color: #fff;
        }
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
    top: 240px;
    margin: 0 auto;
    padding: 0px 30px 30px 30px;
    width: 1030px;
    line-height: 20px;
    background-color: #fff;
    border-radius: 3px;
    background-color: rgba(255, 255, 255, 1);
    border: 1px solid rgba(255, 255, 255, 0);

    p {
        text-align: center;
        margin-bottom: 20px;
    }
}

.subBox {
    width: 370px;
    border-radius: 3px;
    background-color: rgba(255, 255, 255, 1);
    border: 1px solid rgba(255, 255, 255, 0);
    position: absolute;
    left: 0;
    right: 0;
    top: 200px;
    margin: 0 auto;
    padding: 30px;
    line-height: 30px;

    h3 {
        color: #303133;
        font-weight: normal;
        font-size: 18px;
        text-align: center;

    }

    p {
        color: rgba(96, 98, 102, 1);
        font-size: 12px;
        text-align: center;
        margin: 10px 0;
    }
}

.btn-group {
    display: flex;
    justify-content: center;
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
    margin: 20px auto;
    cursor: pointer;
}

.btnBox {
    display: flex;
    justify-content: center;
    margin-top: 30px;

    .btn {
        width: 120px;
        height: 30px;
        line-height: 30px;
        border-radius: 46px;
        font-size: 14px;
        text-align: center;
        cursor: pointer;
        border: 1px solid rgba(var(--el-color-primary-rgb), 0.3);
        background-color: #fff;
        color: var(--el-color-primary);

        &:hover {
            background-color: var(--el-color-primary);
            color: #fff;
        }
    }

    .color-gray {
        border: 1px solid rgba(var(--el-color-primary-rgb), 0.3);
        background-color: #fff;
        color: var(--el-color-primary);
    }

    .color-blue {
        background-color: var(--el-color-primary);
        color: #fff;
    }
}

.color-gray {
    border: 1px solid rgba(var(--el-color-primary-rgb), 0.3);
    background-color: #fff;
    color: var(--el-color-primary);
}

.color-blue {
    background-color: var(--el-color-primary);
    color: #fff;
}
</style>
