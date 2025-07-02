<script setup>
import {
    businessManageApi,
    listRoleApi,
    getRolesListsApi,
    updateRoleStatusApi,
    deleteRoleApi,
    addRoleApi,
    updateRoleApi,
    addRoleMenuApi
} from '@/api/api'

const roleForm = {
    "isDefault": 0,
    "platformId": '',
    "platform": 1,
    "name": '',
    "status": 1,
    "sort": "",
    "description": "",
    "isModel": 0
}
const checkName = (rule, value, callback) => {
    if (!value) {
        callback(new Error('请输入角色名称'));
    } else {
        if (!value.trim()) {
            callback(new Error('角色名称不能全为空格'));
        } else {
            callback();
        }
    }

};

const { user } = useUser();
const Data = reactive({
    funcId: '',
    checkList: ['禁用', "选中且禁用"],
    finalCheck: [],
    tempCheck: [],
    showCheck: true,
    loading: false,
    checkIdx: "1",
    type: 1,
    loginMessage: user.value.bind,
    description: '',
    roleTree: [],
    roleData: [],
    roleName: '',
    roleId: '',
    show: false,
    memberTreeList: [],
    menuTreeList: [],
    defaultTreeId: [],
    defaultExpanded: [],
    defaultProps: {
        children: 'children',
        label: 'title',
        disabled: 'isDefault'
    },
    spProps: {
        children: 'children',
        label: 'title',
        disabled: 'title'
    },
    menu: [],
    menuId: '',
    activeName: 'second',
    diaTitle: '添加角色',
    addVisible: false,
    assVisible: false,
    dtlVisible: false,
    filterText: '',
    disabled: false,
    editForm: {},
    roleForm: Object.assign({}, roleForm),
    rules: {
        name: [
            { required: true, validator: checkName, trigger: 'blur' }
        ],
        status: [
            { required: true, message: '请选择是否启用', trigger: 'change' }
        ]
    },
    currentPage: 1,
    pageSize: 20,
    total: 0,
    value: '100',
    tableData: [],
    tableData2: []
});
const ruleForm = ref(null)
const tree = ref(null)
const tree2 = ref(null)
watch([() => Data.dtlVisible, () => Data.assVisible], ([val, val2]) => {
    if (val || val2) {
        treeList()
    }
    Data.funcId = ''
})
watch(() => Data.addVisible, (val) => {
    if (!val) {
        Data.roleForm = Object.assign({}, roleForm)
    }

})
watch(() => Data.checkIdx, () => {
    Data.filterText = '';
    Data.funcId = '';
    tree.value.filter('');
    tree2.value.filter('');
})
watch(() => Data.filterText, (val) => {
    if (Data.checkIdx == 0) {
        tree.value.filter(val);
    } else {
        tree2.value.filter(val);
    }
})
watch(() => Data.menuId, (val) => {
    if (val != 0) {

    }
})
watch(() => Data.activeName, (val) => {
    Data.currentPage = 1;
    getList()
});
let time = 1;
onMounted(async () => {
    await nextTick()
    getList()
})

function test(data, isChecked) {
    if (data.button.length) {
        data.button.forEach(item => {
            if (item.isDefault == 1) return
            if (isChecked) {
                Data.tempCheck.push(item.id)
            } else {
                let ids = Data.tempCheck.indexOf(item.id)
                if (ids > -1) {
                    Data.tempCheck.splice(ids, 1)
                }
            }
        });
        Data.tempCheck = Array.from(new Set(Data.tempCheck))
        time = new Date().getTime();
    }
}
function checkIds(val) {
    if (!Data.tempCheck.includes(val.id)) {
        Data.tempCheck.push(val.id)
    } else {
        Data.tempCheck.forEach((item, i) => {
            if (item == val.id) {
                Data.tempCheck.splice(i, 1)
            }
        })
    }
}


function getChecked(arr, id, state) {
    arr.forEach(item => {
        if (item.button.length) {
            item.button.forEach(item2 => {
                if (item2.id == id) {
                    item2.isChecked = state;
                }
            })
        }
        if (item.children.length) {
            getChecked(item.children, id, state)
        }
    })
}


function lookFunction(data) {
    if (Data.funcId == data.id) {
        Data.funcId = '';
    } else {
        Data.funcId = data.id;
    }
    Data.checkList = data.button;
}

//获取角色已有权限
function getDefaultId(obj, target) {
    obj.forEach(item => {
        if (item.isDefault == 1 && !target.includes(item.id)) {
            target.push(item.id)
        }
        if (item.button.length) {
            item.button.forEach(item2 => {
                if (item2.isDefault == 1 && !Data.finalCheck.includes(item2.id)) {
                    item2.isChecked = true;
                    Data.finalCheck.push(item2.id);
                }
            })
        }
        if (item.children) {
            getDefaultId(item.children, target)
        }
    });
}

//获取所有权限
async function treeList() {
    const { id } = useMemberCenter();
    let wkId = id.value;
    const res = await businessManageApi({
        id: Data.menuId,
        type: Data.type,
        memberId: Data.loginMessage.memberid
    })
    Data.menuTreeList = res.result;
    const res2 = await businessManageApi({
        id: wkId,
        type: Data.type,
        memberId: Data.loginMessage.memberid
    })
    Data.memberTreeList = res2.result;

}

async function getRoleMenu(roleId, type, temp) {
    if (roleId == '00') {
        Data.showCheck = false
    } else {
        Data.showCheck = true
    }
    Data.roleId = roleId;

    const res = await listRoleApi(roleId);
    let menuList = res.data.uawWorkbenchMenus;


    let checkedMenuIds = [];
    let checkedMenuIds2 = [];
    let tempIds = [];

    if (menuList != null && menuList.length > 0) {
        for (let i = 0; i < menuList.length; i++) {
            if (menuList[i].workbenchId == Data.menuId) {
                if (menuList[i].type == 2 && !Data.finalCheck.includes(menuList[i].id)) {
                    tempIds.push(menuList[i].id)
                }
                checkedMenuIds.push(menuList[i].id);
            } else {
                if (menuList[i].type == 2 && !Data.finalCheck.includes(menuList[i].id)) {
                    tempIds.push(menuList[i].id)
                }
                checkedMenuIds2.push(menuList[i].id);
            }
        }
    }
    Data.defaultExpanded = checkedMenuIds;
    Data.defaultTreeId = checkedMenuIds2;

    getDefaultId(Data.menuTreeList, Data.defaultExpanded);
    getDefaultId(Data.memberTreeList, Data.defaultTreeId);

    Data.tempCheck = [...Data.finalCheck, ...tempIds]
    if (!temp) {
        type ? Data.dtlVisible = true : Data.assVisible = true;
    }
}


//获取角色列表
async function getList(val) {
    Data.menuId = cookies.getItem('WORKBENCHNID')
    let res = await getRolesListsApi({
        pageSize: Data.pageSize,
        pageNum: Data.currentPage,
        platform: 1,
        platformId: Data.menuId,
        memberId: Data.activeName == 'first' ? '0' : Data.loginMessage.memberid
    })
    Data.total = res.totalSize;
    if (Data.activeName == 'first') {
        let obj = {
            id: '00',
            status: '1',
            name: '主管理员',
            description: '主管理员'
        }
        Data.tableData = [obj, ...res.result]
        Data.total++
    } else {
        Data.tableData2 = res.result
    }
}

async function handleHidden(id, status) {
    if (id === '00') return
    updateRoleStatusApi(id, { status: status }).then(res => {
        ElMessage({
            type: 'success',
            message: res.message
        });
        getList();
    }).catch(res => {
        getList();
    })

}

function handleDelete(index, row) {
    ElMessageBox.confirm('是否要删除该角色', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'aeo-confirm-dialog'
    }).then(async () => {
        deleteRoleApi('ids=' + row.id).then(res => {
            ElMessage({
                message: '删除成功',
                type: 'success',
                duration: 1000
            });
            if (Data.tableData2.length == 1 && Data.currentPage > 1) {
                Data.currentPage--
            }
            getList();
        })

    });
}

function filterNode(value, Data) {
    if (!value) return true;
    return Data.title.indexOf(value) !== -1;
}

function submitForm() {
    ruleForm.value.validate((valid) => {
        if (valid) {
            Data.roleForm.platformId = Data.menuId
            Data.roleForm.orgid = Data.loginMessage.memberid;
            if (!Data.roleForm.id) {
                addRoleApi(Data.roleForm).then(res => {
                    Data.addVisible = false;
                    getList()
                });
            } else {
                updateRoleApi(Data.roleForm).then(res => {
                    Data.addVisible = false;
                    getList()
                });
            }


        }
    });
}

function submitAssForm() {
    let checkedNodes = tree2.value.getCheckedNodes();
    let memberNodes = tree.value.getCheckedNodes();
    let checkedMenuIds = new Set();
    let checkedMenuIds2 = new Set();
    if (checkedNodes != null && checkedNodes.length > 0) {
        for (let i = 0; i < checkedNodes.length; i++) {
            let checkedNode = checkedNodes[i];
            checkedMenuIds.add(checkedNode.id);
        }
    }
    if (memberNodes != null && memberNodes.length > 0) {
        for (let i = 0; i < memberNodes.length; i++) {
            let checkedNode = memberNodes[i];
            checkedMenuIds2.add(checkedNode.id);
        }
    }
    checkedMenuIds = [...checkedMenuIds, ...checkedMenuIds2, ...Data.tempCheck];
    ElMessageBox.confirm('是否分配菜单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        let params = {
            roleId: Data.roleId,
            menuIds: Array.from(checkedMenuIds)
        }
        if (Data.dtlVisible) {
            params.name = Data.editForm.name;
            params.description = Data.editForm.description;
        }
        addRoleMenuApi(params).then(res => {
            ElMessage({
                message: '分配成功',
                type: 'success',
                duration: 1000
            });
            getList();
            tree2.value.setCheckedKeys([]);
            Data.dtlVisible = false
            Data.assVisible = false;
        })

    })
}

function handleSizeChange(val) {
    Data.currentPage = 1
    Data.pageSize = val
    getList()
}

function handleCurrentChange(val) {
    Data.currentPage = val
    getList()
}
function handleClick() {
    Data.funcId = ''
}

</script>

<template>
    <div class="set-container" style="min-height: 717px;width:980px;margin-bottom: 30px;">
        <el-tabs v-model="Data.menuId">
            <el-tab-pane :label="item.workbenchName" :name="item.id" v-for="(item, i) in Data.menu" :key="i">
            </el-tab-pane>
        </el-tabs>
        <el-tabs v-model="Data.activeName">
            <el-tab-pane label="自建角色" name="second"></el-tab-pane>
            <el-tab-pane label="系统角色" name="first"></el-tab-pane>
        </el-tabs>
        <div v-if="Data.activeName == 'first'">
            <div class="table">
                <el-table v-loading="Data.loading" :data="Data.tableData" style="width: 100%">
                    <el-table-column type="index" label="编号" align="center" width="180">
                    </el-table-column>
                    <el-table-column prop="name" label="角色名称" align="center" width="180">
                    </el-table-column>
                    <el-table-column prop="description" align="center" label="角色描述">
                    </el-table-column>
                    <el-table-column prop="address" align="center" label="操作">
                        <template #default="scope">
                            <el-button
                                @click="Data.disabled = true; Data.editForm = JSON.parse(JSON.stringify(scope.row)); getRoleMenu(scope.row.id, true)"
                                type="text" size="small">
                                查看详情
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div v-if="Data.activeName == 'second'">
            <div class="head-btn" style="border-radius: 26px" @click="Data.addVisible = true; Data.diaTitle = '添加角色'">
                添加角色 >
            </div>
            <div class="table">
                <el-table v-loading="Data.loading" :data="Data.tableData2" style="width: 100%">
                    <el-table-column type="index" label="编号" align="center" width="180">
                    </el-table-column>
                    <el-table-column prop="name" align="center" label="角色名称">
                    </el-table-column>
                    <el-table-column prop="description" align="center" label="角色描述">
                    </el-table-column>
                    <el-table-column prop="createTime" align="center" label="创建时间">
                    </el-table-column>
                    <el-table-column align="center" label="是否启用">
                        <template #default="scope">
                            <el-switch @change="handleHidden(scope.row.id, scope.row.status)" v-model="scope.row.status"
                                active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column prop="address" align="center" label="设置">
                        <template #default="scope">
                            <el-button
                                @click="getRoleMenu(scope.row.id); Data.roleId = scope.row.id; Data.roleName = scope.row.name"
                                type="text" size="small">
                                分配权限
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column width="120" prop="address" align="center" label="操作">
                        <template #default="scope">
                            <el-button
                                @click="Data.addVisible = true; Data.roleForm.id = 1; Data.diaTitle = '编辑角色'; Data.roleForm = JSON.parse(JSON.stringify(scope.row))"
                                type="text" size="small">
                                编辑
                            </el-button>
                            <el-button style="margin: 0;" size="small" type="text"
                                @click="handleDelete(scope.$index, scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="Data.currentPage" :page-sizes="[20]" :page-size="Data.pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="Data.total">
            </el-pagination>
        </div>
        <el-dialog :title="Data.diaTitle" :close-on-click-modal="false" v-model="Data.addVisible" width="680px">
            <div class="dialog-content">
                <el-form :model="Data.roleForm" :rules="Data.rules" ref="ruleForm" label-width="100px"
                    class="demo-ruleForm">
                    <el-form-item label="角色名称：" prop="name">
                        <el-input v-model="Data.roleForm.name" show-word-limit maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="描述：">
                        <el-input type="textarea" maxlength="50" show-word-limit v-model="Data.roleForm.description"
                            :rows="4"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button style="width: 80px;font-size: 14px;" @click="Data.addVisible = false">取消
                </el-button>
                <el-button style="width: 80px;font-size: 14px" type="primary" @click="submitForm('ruleForm')">确定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog :show-close="true" title="分配权限" :close-on-click-modal="false" v-model="Data.assVisible"
            class="assignment-custom-dialog" top="40px" width="680px">
            <div class="dialog-content">
                <div style="font-size:10px;padding-left: 17px;margin-bottom: 20px;transform: translate(-16px, -8px);">
                    注：工作台权限作用范用是控制工作台菜单是否能被角色看见，当设置为可见时则可见。
                </div>
                <el-form label-width="100px" class="demo-ruleForm">
                    <el-form-item label="角色名称：" prop="name">
                        <el-input v-model="Data.roleName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="角色权限：" prop="resource">
                        <div class="tree">
                            <el-tabs v-model="Data.checkIdx" @tab-click="handleClick">
                                <el-tab-pane label="工作台" name="1"></el-tab-pane>
                                <el-tab-pane label="管理后台" name="0"></el-tab-pane>
                            </el-tabs>
                            <el-scrollbar style="height: 360px">
                                <el-input suffix-icon="el-icon-search" v-model="Data.filterText">
                                </el-input>
                                <el-tree :expand-on-click-node="false" @check-change="test" v-if="Data.assVisible"
                                    v-show="Data.checkIdx == 0" :data="Data.memberTreeList"
                                    :filter-node-method="filterNode" show-checkbox default-expand-all node-key="id"
                                    ref="tree" :check-strictly="true" highlight-current
                                    :default-checked-keys="Data.defaultTreeId" :props="Data.defaultProps">
                                    <template class="custom-tree-node" #default="{ node, data }">
                                        <span>{{ node.label }}</span>
                                        <el-popover :hide-after="0" popper-style="transition:none;" placement="right"
                                            width="330" :visible="data.id == Data.funcId">
                                            <el-scrollbar style="height:145px">
                                                <div class="check-box" style="padding-top: 15px">
                                                    <i class="el-icon-close"
                                                        style="position: absolute;right: 4px;top:0;cursor:pointer;"
                                                        @click="Data.funcId = ''"></i>
                                                    <el-checkbox @change="checkIds(item)"
                                                        :disabled="item.isDefault == 1"
                                                        :checked="Data.tempCheck.includes(item.id)"
                                                        v-for="(item, i) in Data.checkList"
                                                        :key="(item.id + time).toString()" :label="item.id">
                                                        {{ item.buttonName }}
                                                    </el-checkbox>
                                                </div>
                                            </el-scrollbar>
                                            <template #reference v-if="data.button.length">
                                                <el-button style="margin-left:30px;" type="text"
                                                    @click="lookFunction(data)">
                                                    功能
                                                    <el-icon>
                                                        <CirclePlus />
                                                    </el-icon>
                                                </el-button>
                                            </template>
                                        </el-popover>
                                    </template>
                                </el-tree>
                                <el-tree :expand-on-click-node="false" @check-change="test" v-show="Data.checkIdx == 1"
                                    v-if="Data.assVisible" :data="Data.menuTreeList" :filter-node-method="filterNode"
                                    show-checkbox default-expand-all node-key="id" :check-strictly="true"
                                    :default-checked-keys="Data.defaultExpanded" ref="tree2" highlight-current
                                    :props="Data.defaultProps">
                                    <template class="custom-tree-node" #default="{ node, data }">
                                        <span>{{ node.label }}</span>
                                        <el-popover :hide-after="0" popper-style="transition:none;" placement="right"
                                            width="330" :visible="data.id == Data.funcId">
                                            <el-scrollbar style="height:145px">
                                                <div class="check-box" style="padding-top: 15px">
                                                    <i class="el-icon-close"
                                                        style="position: absolute;right: 4px;top:0;cursor:pointer;"
                                                        @click="Data.funcId = ''"></i>
                                                    <el-checkbox @change="checkIds(item)"
                                                        :disabled="item.isDefault == 1"
                                                        :checked="Data.tempCheck.includes(item.id)"
                                                        v-for="(item, i) in Data.checkList"
                                                        :key="(item.id + time).toString()" :label="item.id">
                                                        {{ item.buttonName }}
                                                    </el-checkbox>
                                                </div>
                                            </el-scrollbar>
                                            <template #reference v-if="data.button.length">
                                                <el-button style="margin-left:30px;" type="text"
                                                    @click="lookFunction(data)">
                                                    功能
                                                    <el-icon>
                                                        <CirclePlus />
                                                    </el-icon>
                                                </el-button>
                                            </template>

                                        </el-popover>

                                    </template>
                                </el-tree>
                            </el-scrollbar>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button style="width: 80px;font-size: 14px;"
                    @click="tree2.setCheckedKeys([]); Data.assVisible = false; Data.roleName = '';">取消
                </el-button>
                <el-button style="width: 80px;font-size: 14px" type="primary" @click="submitAssForm('ruleForm')">确定
                </el-button>
            </div>
        </el-dialog>
        <el-dialog :show-close="true" :title="Data.disabled ? '查看详情' : '编辑权限'" :close-on-click-modal="false"
            v-model="Data.dtlVisible" top="40px" class="assignment-custom-dialog" width="680px">
            <div class="dialog-content">
                <div style="font-size:10px;padding-left: 17px;margin-bottom: 20px;transform: translate(-16px, -8px);">
                    注：工作台权限作用范用是控制工作台菜单是否能被角色看见，当设置为可见时则可见。
                </div>
                <el-form :model="Data.editForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
                    <el-form-item label="角色名称：" :disabled="Data.disabled">
                        <el-input v-model="Data.editForm.name" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述：" :disabled="Data.disabled">
                        <el-input type="textarea" v-model="Data.editForm.description" disabled maxlength="50"
                            show-word-limit :rows="4"></el-input>
                    </el-form-item>
                    <el-form-item label="角色权限：" prop="resource">
                        <div class="tree">
                            <el-tabs v-model="Data.checkIdx">
                                <el-tab-pane label="工作台" name="1"></el-tab-pane>
                                <el-tab-pane label="管理后台" name="0"></el-tab-pane>
                            </el-tabs>
                            <el-scrollbar style="height: 360px">
                                <el-input suffix-icon="el-icon-search" v-model="Data.filterText">
                                </el-input>
                                <el-tree :expand-on-click-node="false" @check-change="test" :disabled="Data.disabled"
                                    v-if="Data.dtlVisible" v-show="Data.checkIdx == 0" :data="Data.memberTreeList"
                                    :filter-node-method="filterNode" :show-checkbox="Data.showCheck" default-expand-all
                                    node-key="id" ref="tree" :check-strictly="true" highlight-current
                                    :default-checked-keys="Data.defaultTreeId"
                                    :props="Data.disabled ? Data.spProps : Data.defaultProps">
                                    <template class="custom-tree-node" #default="{ node, data }">
                                        <span>{{ node.label }}</span>
                                        <el-popover :hide-after="0" popper-style="transition:none;" placement="right"
                                            width="330" :visible="data.id == Data.funcId">
                                            <el-scrollbar style="height:145px">
                                                <div class="check-box" style="padding-top: 15px">
                                                    <i class="el-icon-close"
                                                        style="position: absolute;right: 4px;top:0;cursor:pointer;"
                                                        @click="Data.funcId = ''"></i>
                                                    <el-checkbox @change="checkIds(item)"
                                                        :disabled="item.isDefault == 1 || Data.disabled"
                                                        :checked="Data.tempCheck.includes(item.id) || !Data.showCheck"
                                                        v-for="(item, i) in Data.checkList"
                                                        :key="(item.id + time).toString()" :label="item.id">
                                                        {{ item.buttonName }}
                                                    </el-checkbox>
                                                </div>
                                            </el-scrollbar>
                                            <template #reference v-if="data.button.length">
                                                <el-button style="margin-left:30px;" type="text"
                                                    @click="lookFunction(data)">
                                                    功能
                                                    <el-icon>
                                                        <CirclePlus />
                                                    </el-icon>
                                                </el-button>
                                            </template>
                                        </el-popover>
                                    </template>
                                </el-tree>
                                <el-tree :disabled="Data.disabled" :expand-on-click-node="false" @check-change="test"
                                    v-if="Data.dtlVisible" v-show="Data.checkIdx == 1" :data="Data.menuTreeList"
                                    :filter-node-method="filterNode" :show-checkbox="Data.showCheck" default-expand-all
                                    node-key="id" :check-strictly="true" :default-checked-keys="Data.defaultExpanded"
                                    ref="tree2" highlight-current
                                    :props="Data.disabled ? Data.spProps : Data.defaultProps">
                                    <template class="custom-tree-node" #default="{ node, data }">
                                        <span>{{ node.label }}</span>
                                        <el-popover :hide-after="0" popper-style="transition:none;" placement="right"
                                            width="330" :visible="data.id == Data.funcId">
                                            <el-scrollbar style="height:145px">
                                                <div class="check-box" style="padding-top: 15px">
                                                    <i class="el-icon-close"
                                                        style="position: absolute;right: 4px;top:0;cursor:pointer;"
                                                        @click="Data.funcId = ''"></i>
                                                    <el-checkbox @change="checkIds(item)"
                                                        :disabled="item.isDefault == 1 || Data.disabled"
                                                        :checked="Data.tempCheck.includes(item.id) || !Data.showCheck"
                                                        v-for="(item, i) in Data.checkList"
                                                        :key="(item.id + time).toString()" :label="item.id">
                                                        {{ item.buttonName }}
                                                    </el-checkbox>
                                                </div>
                                            </el-scrollbar>
                                            <template #reference v-if="data.button.length">
                                                <el-button style="margin-left:30px;" type="text"
                                                    @click="lookFunction(data)">
                                                    功能
                                                    <el-icon>
                                                        <CirclePlus />
                                                    </el-icon>
                                                </el-button>
                                            </template>
                                        </el-popover>
                                    </template>
                                </el-tree>
                            </el-scrollbar>

                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer" v-if="!Data.disabled">
                <el-button style="width: 80px;font-size: 14px;"
                    @click="tree2.setCheckedKeys([]); Data.dtlVisible = false; Data.roleName = '';">取消
                </el-button>
                <el-button style="width: 80px;font-size: 14px" type="primary" @click="submitAssForm('ruleForm')">保存
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>


<style scoped lang="scss">
:deep() {
    .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .check-box {
        .el-checkbox {
            width: 80%;
            margin: 0 20px 10px 20px;
        }
    }

    .el-tabs__item {
        font-size: 18px;
    }

    .el-tabs__item {
        margin-bottom: 10px;
    }

    .el-tabs__active-bar {
        height: 3px;
    }
}

.custom-tree-node {
    .func {
        margin-left: 30px;
        color: rgba(78, 112, 247, 100) !important;
        font-size: 14px;
    }
}

.role-list {
    display: flex;
    margin-bottom: 30px;
    padding: 0 20px;

    .item {
        font-size: 16px;
        font-weight: bold;
        margin-right: 20px;
        cursor: pointer;

        &.active {
            color: var(--el-color-primary);
        }
    }
}

.dialog-title {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333333;
}

.head-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 2;
    font-size: 14px;
    color: var(--el-color-primary);
    text-align: center;
    line-height: 28px;
    cursor: pointer;
}

.set-container {
    position: relative;
    padding: 0 20px 50px;
    background-color: #fff;

    .table {
        margin: 20px 0 50px 0;
    }

    .pagination {
        float: right;
    }
}

.dialog-footer {
    text-align: center;
}

.tree {
    width: 540px;
    padding: 10px;
    border-radius: 3px;
    border: 1px solid rgba(220, 223, 230, 100);
}
</style>

<style>
.aeo-confirm-dialog .el-message-box__title {
    font-size: 16px;
    color: rgb(16, 16, 16);
    font-weight: bold;
}

.aeo-confirm-dialog .el-button--small {
    width: 80px;
    font-size: 14px;
}

.assignment-custom-dialog .el-dialog__body {
    padding-top: 0;
}
</style>
