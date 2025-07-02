<script setup>
import { deptListApi, deptSaveApi, deptEditApi, deptDetailApi, deptDeleteApi } from '@/api/api'

const ruleForm = ref(null)
const show = ref(false)
const { user } = useUser();
const data = reactive({
    isEdit: false,
    loginMessage: user.value.bind,
    departmentList: [],
    dataForm: {
        deptName: '',
        parentId: '',
        memberId: 0
    },
    rules: {
        deptName: [
            { required: true, message: '请输入部门名称', trigger: 'blur' }
        ],
        status: [
            { required: true, message: '请选择是否启用', trigger: 'change' }
        ]
    },
})
onMounted(async () => {
    await nextTick()
    data.dataForm.memberId = data.loginMessage.memberid;
    getList()

})

function getList() {
    deptListApi({ memberId: data.loginMessage.memberid }).then(res => {
        data.departmentList = res.result
        data.departmentList[0].disabled = true;
    })
}

function submitData() {
    ruleForm.value.validate((valid) => {
        if (valid) {
            let params = Object.assign({}, data.dataForm)
            if (params.parentId === '') params.parentId = 0;
            if (params.id === '') params.id = undefined;
            if (params.id) {
                deptEditApi(params).then(res => {
                    show.value = false;
                    clearForm()
                    getList()
                })
            } else {
                deptSaveApi(params).then(res => {
                    show.value = false;
                    clearForm()
                    getList()
                })
            }
        }
    });
}
function clearForm() {
    ruleForm.value.resetFields()
    data.dataForm.deptName = '';
    data.dataForm.parentId = '';
    data.dataForm.id = '';

}
function edit(id) {
    deptDetailApi({ id }).then(res => {
        show.value = true;
        let { id, deptName, parentId } = res.result
        data.dataForm.deptName = deptName;
        data.dataForm.parentId = parentId;
        data.dataForm.id = id;
    })

}

function del(id) {
    ElMessageBox.confirm(
        '是否删除',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(() => {
            deptDeleteApi({ id }).then(() => {
                getList()
                ElMessage({
                    type: 'success',
                    message: '删除成功',
                })
            })

        })
}
</script>

<template>
    <div class="sm-container" style="min-height: 717px;width:980px;">
        <div class="clearfixHeader">
            <div style="font-size: 18px;color: rgb(16, 16, 16)">部门管理</div>
            <div class="btn" @click="show = true">添加部门 ></div>
        </div>
        <div>
            <el-table :data="data.departmentList" style="width: 100%; margin-bottom: 20px;height: 585px;" row-key="id"
                default-expand-all>
                <el-table-column prop="deptName" label="部门名称" />
                <el-table-column align="center" prop="deptCount" label="成员数" />
                <el-table-column align="center" label="操作">
                    <template #default="scope">
                        <div v-if="scope.row.parentId != '0'">
                            <el-button type="primary" size="small" text @click="edit(scope.row.id)">编辑</el-button>
                            <el-button type="primary" size="small" text @click="del(scope.row.id)">删除</el-button>
                        </div>

                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog @close="clearForm" v-model="show" :close-on-click-modal="false" title="添加部门" top="15vh"
            width="480px">
            <el-form :model="data.dataForm" :rules="data.rules" ref="ruleForm" label-width="100px"
                class="demo-ruleForm">
                <el-form-item label="部门名称：" prop="deptName">
                    <el-input v-model.trim="data.dataForm.deptName"></el-input>
                </el-form-item>
                <el-form-item label="上级部门：">
                    <el-tree-select node-key="id" style="width: 100%;" :props="{ children: 'children', label: 'deptName' }"
                        v-model="data.dataForm.parentId" :data="data.departmentList" :render-after-expand="false"
                        default-expand-all check-strictly check-on-click-node />
                </el-form-item>
            </el-form>
            <div style="text-align: center;">
                <el-button style="width: 80px;font-size: 14px" @click="show = false">取消</el-button>
                <el-button style="width: 80px;font-size: 14px" type="primary" @click="submitData">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>


<style scoped lang="scss">
::v-deep() {
    thead .el-table__cell:first-child {
        padding-left: 20px;
    }
}

.sm-container {
    background-color: #fff;
    padding: 0 20px 20px 20px;
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
</style>
