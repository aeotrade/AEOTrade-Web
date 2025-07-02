<script setup>
    import {ElMessage} from 'element-plus'
    import {getCode, getHmmRolesApi, createOrgApi} from "@/api/api";

    const emit = defineEmits(['create', 'close', 'update:visible'])
    const props = defineProps({
        visible: Boolean,
        loginMessage: {}
    });

    const checkPhone = (rule, value, callback) => {
        const reg = /^1[3456789]\d{9}$/
        if (reg.test(value)) {
            callback()
        } else {
            callback('手机号码不正确！')
        }
    };
    const data = reactive({
        imageUrl: 'http://aeotrade-launch-advisor.oss-cn-zhangjiakou.aliyuncs.com/e71120c3-0102-4e4d-8120-8c413e869633.png',
        actionUrl: import.meta.env.VITE_BASE_URL + '/img/oss/upload',
        count: 60,
        form: {
            memberName: '',
            validateCode: '',
            stasfTel: '',
            uscCode: '',
            staffName: '',
            address: '',
            vipTypeId: ""
        },
        formRules: {
            memberName: [
                {required: true, message: '请输入组织名称', trigger: 'blur'},
            ],
            address: [
                {required: true, message: '请输入组织地址', trigger: 'blur'},
            ],
            uscCode: [
                {required: true, message: '请输入统一社会信用代码', trigger: 'blur'},
                {min: 18, max: 18, message: '统一社会信用代码长度为18位', trigger: 'blur'}
            ],
            staffName: [
                {required: true, message: '请输入企业联系人', trigger: 'blur'},
            ],
            stasfTel: [
                {required: true, message: '请输入手机号码', trigger: 'blur'},
                {validator: checkPhone, trigger: 'blur'}
            ],
            vipTypeId: [
                {required: true, message: '请选择组织角色', trigger: 'blur'},
            ],
            validateCode: [
                {required: true, message: '请输入验证码', trigger: 'blur'},
            ],
        },
        roleList: [],
        btnLoading: false,
        show: false
    });
    const form = ref(null)
    onMounted(() => {
        console.log(props.visible, 9999)
        data.form.stasfTel = props.loginMessage.stasfTel
        data.form.staffName = props.loginMessage.staffname
        getHmmRoles();
    });
    // watch(props.visible, (val) => {
    //     if (val) getHmmRoles()
    //     if (!val) {
    //         form.resetFields()
    //     }
    // });

    function getHmmRoles() {
        getHmmRolesApi().then((res) => {
            data.roleList = res.result;
        })
    }

    function handleAvatarSuccess(res, file) {
        data.imageUrl = res.result.fileDownloadUri
    }

    function createOrg() {
        console.log(parent)
        form.value.validate(vali => {
            if (vali) {
                if (data.btnLoading) return
                data.btnLoading = true
                if (!data.imageUrl) {
                    data.btnLoading = false
                    ElMessage({
                        message: '请选择头像！',
                        type: 'error'
                    });
                    return false;
                }
                if (!data.form.vipTypeId) {
                    data.btnLoading = false
                    ElMessage({
                        message: '请选择慧贸OS角色！',
                        type: 'error'
                    });
                    return false;
                }
                let params = {
                    id: props.loginMessage.staffid,
                    uscCode: data.form.uscCode,
                    memberName: data.form.memberName,
                    staffName: data.form.staffName,
                    stasfTel: data.form.stasfTel,
                    code: data.form.validateCode,
                    logoImg: data.imageUrl,
                    sgsStatus: 0,
                    address: data.form.address,
                    vipTypeId: data.form.vipTypeId
                };
                emit('create')
                createOrgApi(params).then((res) => {

                    ElMessage({
                        'message': '已成功创建组织!',
                        'type': 'success'
                    });
                    // 创建企业之后等2s刷新页面
                    setTimeout(() => {
                        location.reload()
                    }, 2000)
                    emit('update:visible', false)
                }).finally(() => {
                    data.btnLoading = false
                })
            }
        })
    }

    function code() {
        let {stasfTel} = data.form;
        if (!/^1[3456789]\d{9}$/.test(stasfTel)) {
            ElMessage({
                message: '请输入正确手机号！',
                type: 'error'
            });
            return false;
        }
        getCode({phone: data.form.stasfTel}).then((res) => {
            ElMessage({
                'message': '短信发送成功！',
                'type': 'success'
            });
            codeTimer();
        });
    }

    function close() {
        emit('update:visible', false)
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
</script>

<template>
    <el-dialog
            class="create-org"
            v-model="props.visible"
            :show-close="true"
            :before-close="close"
            :append-to-body="true"
            :close-on-click-modal="false"
            title="创建组织"
            width="680px">
        <div class="create-org-form" style="padding-bottom: 30px">
            <el-form ref="form" :model="data.form" :rules="data.formRules" label-width="120" label-position="right">
                <el-form-item label="头像：">
                    <div style="display: flex;align-items: center">
                        <img v-if="data.imageUrl" :src="data.imageUrl" class="avatar"
                             style="width: 50px;height: 50px;display: inline-block">
                        <el-upload
                                :action="data.actionUrl"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :headers="{
                                    'Authorization': 'Bearer ' + cookies.getItem('token')
                                }"
                        >
                            <el-button style="margin-left: 20px">编辑头像</el-button>
                        </el-upload>
                    </div>
                </el-form-item>

                <el-form-item label="组织名称：" prop="memberName">
                    <el-input v-model.trim="data.form.memberName" placeholder="请输入组织名称"></el-input>
                </el-form-item>

                <el-form-item label="组织地址：" prop="address">
                    <el-input placeholder="请输入组织地址" v-model.trim="data.form.address"></el-input>
                </el-form-item>

                <el-form-item label="社会信用代码：" prop="uscCode">
                    <el-input type="text" placeholder="请输入统一社会信用代码" v-model.trim="data.form.uscCode"></el-input>
                </el-form-item>

                <el-form-item label="组织联系人：" prop="staffName">
                    <el-input type="text" placeholder="请输入组织联系人" v-model.trim="data.form.staffName"></el-input>
                </el-form-item>

                <el-form-item label="组织角色：" prop="vipTypeId">
                    <el-select style="width: 100%" v-model="data.form.vipTypeId" placeholder="请选择组织角色">
                        <el-option
                                v-for="item in data.roleList"
                                :key="item.id"
                                :label="item.typeName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="手机号码：" prop="stasfTel">
                    <el-input type="text" placeholder="请输入手机号码" v-model.trim="data.form.stasfTel"></el-input>
                </el-form-item>

                <el-form-item label="验证码：" prop="validateCode">
                    <el-input type="text" class="valicode-input" placeholder="请输入验证码"
                              v-model.trim="data.form.validateCode">
                <template #append>
                  <span class="getCode" v-if="!data.show" @click="code">获取验证码</span>
                  <span class="getCode" v-else> {{data.count}}s</span>
                </template>
                    </el-input>
                </el-form-item>

            </el-form>

            <div style="height: 30px"></div>
            <div style="text-align: center">
                <el-button size="small" style="width: 80px;height:32px;" @click="close">取消</el-button>
                <el-button size="small" style="width: 80px;height:32px;" type="primary" @click="createOrg">创建
                </el-button>
            </div>
        </div>
        <div style="height: 10px"></div>
    </el-dialog>
</template>

<style lang="scss" scoped>
    :deep(){
        .el-input-group__append{
            box-shadow: none;
        }
    }

    .el-form .el-form-item {
        align-items: center;

         :deep(.el-form-item__label){
            width: 124px;
            text-align: right;
        }


        .valicode-input {
            :deep(.el-input-group__append){
                position: absolute;
                top: 0;
                right: 0;
                background-color: transparent;
                cursor: pointer;
                color: var(--el-color-primary);
                line-height: 40px;
                border: none;
                letter-spacing: normal;
            }
        }

        .el-select, .el-input {
            :deep(.el-input__inner){
                height: 40px;
                line-height: 40px;
            }
        }

    }
</style>

<style>
    .create-org {
        padding: 0;
    }

    .create-org div.el-dialog__header {
        padding: 20px;
    }

    .create-org div.el-dialog__body {
        padding: 0 20px;
    }
</style>
