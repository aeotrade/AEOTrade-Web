<script setup>
import { getMainManagerApi, getNodeInfoApi } from "@/api/api";
const { user } = useUser();
const data = reactive({
    dialogVisible: false,
    dialogVisible2: false,
    time: null,
    input: null,
    nodeInfo: {},
    loginMessage: user.value.bind,
    certificate: {},
    currentPage: 1,
    pageSize: 10,
    adminId: null,
    dialogVisiblePrivateKey: false,
    chain: 'aeotradechain',
    did: null
})

function isAdmin() {
    getMainManagerApi({ memberId: data.loginMessage.memberid }).then((res) => {
        data.adminId = res.result.id;
        getInfo();
    });
}

function download(content, fileName, type) {
    let txtFile = new Blob([content])
    let link = document.createElement('a');
    link.href = window.URL.createObjectURL(txtFile);
    link.download = fileName + '.' + type;
    link.click();
    window.URL.revokeObjectURL(link.href);
}

function getInfo() {
    let params = {
        memberId: data.loginMessage.memberid,
        staffId: data.loginMessage.staffid,
        pageNo: data.currentPage,
        pageSize: data.pageSize,
        isAdmin: data.loginMessage.staffid == data.adminId ? 1 : 0,
    }
    getNodeInfoApi(params).then(res => {
        data.nodeInfo = { ...res.result };
        data.did = res.result.chainCertCaTenant.did;
    })
}

function showCertificate(content) {
    data.certificate = content;
    data.dialogVisible2 = true;
}

function handleSizeChange(val) {
    data.currentPage = 1;
    data.pageSize = val;
    getInfo();
}

function handleCurrentChange(val) {
    data.currentPage = val;
    getInfo();
}
onMounted(async function () {
    await nextTick()
    isAdmin()
})

</script>

<template>
    <div class="container" style="width: 980px;min-height: 717px">
        <div class="wrapper" style="min-height: 117px">
            <div class="title">
                组织DID
            </div>
            <div style="margin-top: 30px;color: #919191;">{{ data.did || '---' }}</div>
        </div>
        <div class="wrapper" style="padding-bottom: 200px;min-height: 717px;margin-top: 20px">
            <div style="display: flex;align-items: center;justify-content: space-between">
                <div>
                    <p class="title">链上信息管理</p>
                </div>
                <div>
                    <div>
                        <el-select placeholder="请选择" v-model="data.chain" value="aeotradechain" style="width: 200px">
                            <el-option label="aeotradechain" value="aeotradechain">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div
                style="display: flex;align-items: center;justify-content: space-between;border-bottom:1px solid #D3D3D3;margin-bottom: 20px;padding-bottom: 20px">
                <div>
                    <p style="margin-top: 50px">节点类型：普通节点</p>
                </div>
                <div v-if="data.loginMessage.staffid == data.adminId">
                    <div style="margin-top: 50px">
                        <el-button @click="data.dialogVisible = true;" type="primary" size="small">
                            查看组织证书
                        </el-button>
                        <el-button @click="data.dialogVisiblePrivateKey = true;" type="primary" size="small">
                            下载私钥
                        </el-button>
                    </div>
                </div>
            </div>
            <div style="color: rgba(16, 16, 16, 100);font-size: 14px;margin-bottom: 15px">当前组织用户</div>
            <el-table :data="data.nodeInfo.chainCertUserMemberVOS" style="width: 100%">
                <el-table-column prop="did" align="center" label="用户DID">
                    <template #default="scope">
                        <span>{{ scope.row.did || '---' }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="userType" align="center" label="用户类型">
                </el-table-column>
                <el-table-column prop="creatTime" align="center" label="开通时间">
                </el-table-column>
                <el-table-column prop="address" align="center" label="证书">
                    <template #default="scope">
                        <el-button @click="showCertificate(scope.row.stringStringMap)" type="text" size="small">
                            查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 20px;float:right">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="data.currentPage" :page-sizes="[5, 10, 20]" :page-size="data.pageSize"
                    layout="total, sizes, prev, pager, next, jumper" :total="Number(data.nodeInfo.total)">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="组织证书" v-model="data.dialogVisible" width="506">
            <div class="dialog-container">
                <div class="keys" style="margin-right: 0px;">
                    <div class="keys-title">CA私钥</div>
                    <el-scrollbar
                        style="height: 100px;border:2px solid rgba(223, 223, 223, 100);box-shadow: 0px 2px 6px 0px rgba(var(--el-color-primary-rgb), .15);">
                        <div class="keys-info">
                            {{ data.nodeInfo.privateKey }}
                        </div>
                    </el-scrollbar>
                    <el-button @click="download(data.nodeInfo.privateKey, 'CA私钥', 'key')" type="primary" size="small"
                        style="margin-top:8px">下载
                    </el-button>
                </div>
                <div class="keys" style="margin-right: 0px;">
                    <div class="keys-title">CA证书</div>
                    <el-scrollbar
                        style="height: 100px;border:2px solid rgba(223, 223, 223, 100);box-shadow: 0px 2px 6px 0px rgba(var(--el-color-primary-rgb), .15);">
                        <div class="keys-info">
                            {{ data.nodeInfo.cert }}
                        </div>
                    </el-scrollbar>
                    <el-button @click="download(data.nodeInfo.privateKey, 'CA证书', 'crt')" type="primary" size="small"
                        style="margin-top:8px">下载
                    </el-button>
                </div>

            </div>
        </el-dialog>
        <el-dialog title="组织私钥" v-model="data.dialogVisiblePrivateKey" width="506">
            <div class="dialog-container">
                <div class="keys" style="margin-right: 0px;">
                    <div class="keys-title">私钥</div>
                    <el-scrollbar
                        style="height: 100px;border:2px solid rgba(223, 223, 223, 100);box-shadow: 0px 2px 6px 0px rgba(var(--el-color-primary-rgb), .15);">
                        <div class="keys-info">
                            {{ data.nodeInfo.privateKey }}
                        </div>
                    </el-scrollbar>
                    <el-button @click="download(data.nodeInfo.privateKey, 'CA私钥', 'key')" type="primary" size="small"
                        style="margin-top:8px">下载
                    </el-button>
                </div>

            </div>
        </el-dialog>
        <el-dialog title="用户证书" v-model="data.dialogVisible2" width="1000px">
            <div class="dialog-container">
                <div class="keys">
                    <div class="keys-title">签名证书</div>
                    <el-scrollbar
                        style="height: 100px;border:2px solid rgba(223, 223, 223, 100);box-shadow: 0px 2px 6px 0px rgba(var(--el-color-primary-rgb), .15);">
                        <div class="keys-info">
                            {{ data.certificate.signcert }}
                        </div>
                    </el-scrollbar>
                    <el-button @click="download(data.certificate.signcert, '签名证书', 'crt')" type="primary" size="small"
                        style="margin-top:8px">下载
                    </el-button>
                </div>
                <div class="keys">
                    <div class="keys-title">tls证书</div>
                    <el-scrollbar
                        style="height: 100px;border:2px solid rgba(223, 223, 223, 100);box-shadow: 0px 2px 6px 0px rgba(var(--el-color-primary-rgb), .15);">
                        <div class="keys-info">
                            {{ data.certificate.tlscert }}
                        </div>
                    </el-scrollbar>
                    <el-button @click="download(data.certificate.tlscert, 'tls证书', 'crt')" type="primary" size="small"
                        style="margin-top:8px">下载
                    </el-button>
                </div>
                <div class="keys">
                    <div class="keys-title">签名私钥</div>
                    <el-scrollbar
                        style="height: 100px;border:2px solid rgba(223, 223, 223, 100);box-shadow: 0px 2px 6px 0px rgba(var(--el-color-primary-rgb), .15);">
                        <div class="keys-info">
                            {{ data.certificate.signprivatekey }}
                        </div>
                    </el-scrollbar>
                    <el-button @click="download(data.certificate.signprivatekey, '签名私钥', 'key')" type="primary"
                        size="small" style="margin-top:8px">下载
                    </el-button>
                </div>
                <div class="keys">
                    <div class="keys-title">tls私钥</div>
                    <el-scrollbar
                        style="height: 100px;border:2px solid rgba(223, 223, 223, 100);box-shadow: 0px 2px 6px 0px rgba(var(--el-color-primary-rgb), .15);">
                        <div class="keys-info">
                            {{ data.certificate.tlsprivatekey }}
                        </div>
                    </el-scrollbar>
                    <el-button @click="download(data.certificate.tlsprivatekey, 'tls私钥', 'key')" type="primary"
                        size="small" style="margin-top:8px">下载
                    </el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<style scoped lang="scss">
.keys {
    margin-bottom: 30px;
    width: 440px;
    margin-right: 16px;

    .keys-title {
        color: rgba(16, 16, 16, 100);
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .keys-info {
        font-size: 12px;
        white-space: pre-line;
        padding: 0;
        color: rgb(155, 155, 155);
    }
}

:deep() {
    .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .el-input__inner {
        border-radius: 3px;
    }

    .el-dialog__header {
        padding: 15px;
    }

}

.container {
    .wrapper {
        min-height: 100%;
        background-color: #fff;
        padding: 25px 20px 35px 20px;

        .title {
            color: rgba(16, 16, 16, 1);
            font-size: 18px;
        }
    }
}

.list {
    margin: 30px 0;
    display: flex;

    .list-item {
        width: 300px;
        margin-right: 18px;
        color: rgba(16, 16, 16, 100);

        .list-title {
            font-size: 14px;
            margin-bottom: 20px;
        }

        .list-info {
            font-size: 16px;
            font-weight: bold;
            padding: 25px 30px;
            background-color: rgba(var(--el-color-primary-rgb), .04);
            border: 1px solid rgba(var(--el-color-primary-rgb), .15);

            span:hover {
                text-decoration: underline;
            }
        }
    }
}

.dialog-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 10px 18px 10px 18px;
}
</style>
