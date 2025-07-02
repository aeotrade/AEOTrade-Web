<script setup>
import { getHmmRolesApi, getTxListApi, getFirmMessageApi, getIntelligenceListApi, changeFirmMessageApi, getFirmStaffInfoApi, changeSysStutes, refreshDid } from '@/api/api'

const Config = useAppConfig()
const route = useRoute();
const router = useRouter();
const checkPhone = (rule, value, callback) => {
  const reg = /^1[3456789]\d{9}$/
  if (reg.test(value)) {
    callback()
  } else {
    callback('手机号码不正确！')
  }
};
let { author } = useAuthor();
const { user } = useUser();
const formRef = ref(null)
const caOrgId = ref('');
const did = ref('');
const firmStaffInfo = ref(null)
const data = reactive({
  actionUrl: import.meta.env.VITE_BASE_URL + '/img/oss/upload',
  loginMessage: user.value.bind,
  userMessage: user.value.user,
  show: false,
  firmMessage: {},
  firmMessageCopy: {},
  formRules: {
    memberName: [
      { required: true, message: '请输入组织名称', trigger: 'blur' },
    ],
    address: [
      { required: true, message: '请输入组织地址', trigger: 'blur' },
    ],
    uscCode: [
      { required: true, message: '请输入统一社会信用代码', trigger: 'blur' },
      { min: 18, max: 18, message: '统一社会信用代码长度为18位', trigger: 'blur' }
    ],
    staffName: [
      { required: true, message: '请输入组织联系人', trigger: 'blur' },
    ],
    stasfTel: [
      { required: true, message: '请输入手机号码', trigger: 'blur' },
      { validator: checkPhone, trigger: 'blur' }
    ],
    hmmRoleName: [
      { required: true, message: '请选择慧贸OS角色', trigger: 'blur' },
    ],
  },
  roleList: []
})
const authonDialog = ref(false)

//获取企业管理员，人数信息
function getFirmStaffInfo() {
  getFirmStaffInfoApi({ memberId: data.loginMessage.memberid }).then(res => {
    firmStaffInfo.value = res.result;
    if (firmStaffInfo.value && firmStaffInfo.value.sgsStatus == 0) {
      author.value = false
    } else {
      author.value = true
    }

  });
}

function getHmmRoles() {
  getHmmRolesApi().then((res) => {
    data.roleList = res.result;
  })
}
function handleSuccessUpload(res, file, fileList) {
  data.firmMessageCopy.logoImg = res.result.fileDownloadUri
  keep('img');
}
function getFirmMessage() {
  Promise.all([getFirmMessageApi({ id: data.loginMessage.memberid.toString() }), getIntelligenceListApi({ apply: 1, id: data.loginMessage.memberid.toString() })]).then(([res, res2]) => {
    data.firmMessage = { ...res.result, hmmRoleName: res2.result && res2.result[0] && res2.result[0].typeName || '' }
    data.firmMessageCopy = JSON.parse(JSON.stringify(data.firmMessage))
  })

}
function keep(img) {
  if (img) {
    let params = {
      ...data.firmMessageCopy,
    }
    changeFirmMessageApi(params).then((res) => {
      ElMessage.success("修改成功");
      getFirmMessage();
      data.loginMessage.memberimg = res.result.logoImg
    });
  } else {
    formRef.value.validate((vali) => {
      if (!vali) return
      let params = {
        ...data.firmMessageCopy,
      }
      changeFirmMessageApi(params).then((res) => {
        ElMessage.success("修改成功");
        getFirmMessage();
        data.loginMessage.membername = res.result.memberName
        data.loginMessage.stasfTel = res.result.stasfTel
        data.loginMessage.staffname = res.result.staffName
        data.loginMessage.uscc = res.result.uscCode
        cookies.setItem('UC', res.result.uscCode)
        data.show = false;
      });
    })
  }

}
function handleComfirmReauthon() {
  changeSysStutes({ memberId: data.loginMessage.memberid.toString() }).then(res => {
    authonDialog.value = false
    author.value = false
  })
}
// 获取链上身份节点信息
function getTxList() {
  getTxListApi(data.loginMessage.memberid).then(res => {
    caOrgId.value = res.result && res.result.caOrgId
    did.value = res.result && res.result.did
  })
}
const isCompanyAuth = computed(() => {
  return author.value
})
const refreshDidHandle = () => {
  refreshDid({ memberId: data.loginMessage.memberid, staffId: data.loginMessage.staffid }).then(res => {
    getTxList()
  })
}
onMounted(async () => {
  await nextTick(() => { })
  getTxList();
  getFirmMessage();
  getHmmRoles();
  getFirmStaffInfo()

});
</script>

<template>
  <div>
    <div class="info-banner" v-if="data.loginMessage.kindid != 99">
      <img class="bak" src="@/assets/img/memberCenter/head-back.png">
      <div style="display: flex;align-items: center;position: relative;z-index: 1;">
        <div class="icon-box">
          <img :src="data.loginMessage.memberimg" />
          <svg-icon icon-class="memberCenter_auth_logo" class="logo"></svg-icon>
        </div>
        <div class="company-info">
          <div class="company-name">{{ data.loginMessage.membername }}</div>
          <div class="identity-chain">
            组织DID：
            <span class="identity-id">{{ did || '---' }}</span>
            <span class="identity-id" v-if="!did" @click="refreshDidHandle"
              style=" display: flex; align-items: center;margin-left: 10px;cursor: pointer"> <el-icon size="12">
                <RefreshRight />
              </el-icon>刷新</span>
          </div>
          <div v-if="Config.realNameAuthStatus"
            :class="{ 'auth-status': true, 'auth-succ': isCompanyAuth, 'auth-fail': !isCompanyAuth }">
            <svg-icon icon-class="memberCenter_authed" class="logo"></svg-icon>
            <span>{{ isCompanyAuth ? '组织已实名认证' : '组织未实名认证' }}</span>
          </div>
        </div>
      </div>
      <div class="user-wrap">
        <div class="user-item">
          <div class="user-item-title">{{ data.loginMessage.adminName }}</div>
          <div>
            <svg-icon icon-class="memberCenter_manage"></svg-icon>
            主管理员
          </div>
        </div>
        <div class="line"></div>
        <div class="user-item">
          <div class="user-item-title">{{ firmStaffInfo && firmStaffInfo.staffSize }}人</div>
          <div>
            <svg-icon icon-class="memberCenter_user"></svg-icon>
            员工
          </div>
        </div>
      </div>
    </div>
    <div class="sm-container">

      <div class="clearfixHeader">
        <div style="display: flex;align-items: center">
          <div style="font-size: 14px;color: #101010;font-weight: bold">组织信息</div>
        </div>
        <div v-if="Config.companyManageEditInfoBtn" class="btn"
          @click="() => { data.show = true; data.firmMessageCopy = JSON.parse(JSON.stringify(data.firmMessage)) }">
          修改组织信息 >
        </div>
      </div>
      <div v-if="data.firmMessage">
        <el-row>
          <el-col :span="4" style="line-height: 55px">
            <div class="rowName">头像：</div>

          </el-col>
          <el-col :span="2">
            <div class=""><img :src="data.firmMessage.logoImg" alt="" class="headerImg"></div>
          </el-col>
          <el-col :span="2">
            <el-upload class="upload-demo" :on-success="handleSuccessUpload" :show-file-list="false"
              accept=".gif,.jpg,.jpeg,.png,.GIF,.JPG,.PNG" :action="data.actionUrl" :headers="{
                'Authorization': 'Bearer ' + cookies.getItem('token')
              }">
              <div class="change-btn">编辑头像</div>
            </el-upload>

          </el-col>
        </el-row>
        <div style="height: 30px"></div>
        <el-row>
          <el-col :span="4">
            <div class="rowName ">组织名称：</div>
          </el-col>
          <el-col :span="6">
            <div class="rowValue">
              <template v-if="data.firmMessage.memberName && data.firmMessage.memberName.length <= 15">
                {{ data.firmMessage.memberName }}
              </template>
              <template v-else>
                <el-popover placement="top" title="" width="248" trigger="hover" :content="data.firmMessage.memberName">
                  <template #reference>
                    <span>{{ data.firmMessage.memberName && data.firmMessage.memberName.slice(0, 17) + '...' }}</span>
                  </template>
                </el-popover>
              </template>
            </div>
          </el-col>
          <el-col :span="4" :push="1" style="padding-right: 40px">
            <div class="rowName">组织地址：</div>
          </el-col>
          <el-col :span="6">
            <div class="rowValue">
              <template
                v-if="!data.firmMessage.address || (data.firmMessage.address && data.firmMessage.address.length <= 15)">
                {{ data.firmMessage.address ? data.firmMessage.address : '暂无数据' }}
              </template>
              <template v-else>
                <el-popover placement="top" title="" width="248" trigger="hover" :content="data.firmMessage.address">
                  <template #reference>
                    <span>{{ data.firmMessage.address.slice(0, 17) + '...' }}</span>
                  </template>

                </el-popover>
              </template>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">
            <div class="rowName ">统一社会信用代码：</div>
          </el-col>
          <el-col :span="6">
            <div class="rowValue">{{ data.firmMessage.uscCode }}</div>
          </el-col>
          <el-col :span="4" :push="1" style="padding-right: 40px">
            <div class="rowName">组织联系人：</div>
          </el-col>
          <el-col :span="6">
            <div class="rowValue">
              <template
                v-if="!data.firmMessage.staffName || (data.firmMessage.staffName && data.firmMessage.staffName.length <= 15)">
                {{ data.firmMessage.staffName ? data.firmMessage.staffName : '暂无数据' }}
              </template>
              <template v-else>
                <el-popover placement="top" title="" width="248" trigger="hover" :content="data.firmMessage.staffName">
                  <template #reference>
                    <span>{{ data.firmMessage.staffName.slice(0, 17) }}</span>
                  </template>
                </el-popover>
              </template>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="4">
            <div class="rowName ">手机号码：</div>
          </el-col>
          <el-col :span="6">
            <div class="rowValue">{{ data.firmMessage.stasfTel ? data.firmMessage.stasfTel : '暂无数据' }}</div>
          </el-col>
          <el-col :span="4">
            <div class="rowName">慧贸OS角色：</div>
          </el-col>
          <el-col :span="6">
            <div class="rowValue">{{ data.firmMessage.hmmRoleName }}</div>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="4">
            <div class="rowName ">创建时间：</div>
          </el-col>
          <el-col :span="6">
            <div class="rowValue">{{ data.firmMessage.createdTime ? data.firmMessage.createdTime.split(' ')[0] : '暂无数据'
            }}
            </div>
          </el-col>
        </el-row>
      </div>

      <el-dialog class="authonDialog" v-model="data.show" :close-on-click-modal="false" title="修改组织信息" top="17vh"
        width="680px">
        <div style="color: #FBA800;font-size: 12px;" v-if="author">
          <el-icon>
            <WarningFilled />
          </el-icon>
          尊敬的用户，您已完成实名认证，如组织信息有变更，请
          <span style="text-decoration: underline;color: var(--el-color-primary);cursor: pointer;"
            @click="() => { data.show = false; authonDialog = true }">重新申请实名认证</span>
        </div>
        <el-form key="info" style="padding-top: 20px;" ref="formRef" :rules="data.formRules" class="custom-form"
          :model="data.firmMessageCopy" label-width="155px">
          <el-form-item label="组织名称：" prop="memberName">
            <el-input placeholder="请输入组织名称" v-model.trim="data.firmMessageCopy.memberName"
              :disabled="author"></el-input>
          </el-form-item>
          <el-form-item label="组织地址：" prop="address">
            <el-input placeholder="请输入组织地址" v-model.trim="data.firmMessageCopy.address" :disabled="author"></el-input>
          </el-form-item>
          <el-form-item label="统一社会信用代码：" prop="uscCode">
            <el-input placeholder="请输入统一社会信用代码" v-model.trim="data.firmMessageCopy.uscCode"
              :disabled="author"></el-input>
          </el-form-item>
          <el-form-item label="组织联系人：" prop="staffName">
            <el-input placeholder="请输入组织联系人" v-model.trim="data.firmMessageCopy.staffName"></el-input>
          </el-form-item>
          <el-form-item label="手机号码：" prop="stasfTel">
            <el-input placeholder="请输入手机号码" v-model.trim="data.firmMessageCopy.stasfTel"></el-input>
          </el-form-item>
          <el-form-item label="慧贸OS角色：" prop="hmmRoleName">
            <el-input placeholder="请选择慧贸OS角色" v-model.trim="data.firmMessageCopy.hmmRoleName" disabled></el-input>
          </el-form-item>
        </el-form>

        <div style="height: 30px"></div>
        <div style="text-align: center;">
          <el-button style="width: 80px;font-size: 14px" @click="data.show = false">取消</el-button>
          <el-button style="width: 80px;font-size: 14px" type="primary" @click="keep('')">保存</el-button>
        </div>
        <div style="height: 20px"></div>
      </el-dialog>
      <el-dialog align-center="true" v-model="authonDialog" :close-on-click-modal="false" title="提示" width="390px">
        <p style="margin-bottom: 10px;">1、点击确认后，您的组织将变为未认证状态。</p>
        <p style="margin-bottom: 10px;">2、未认证状态下您可修改组织信息。</p>
        <p style="margin-bottom: 30px;">3、组织信息修改完成后，您可重新进行实名认证。</p>
        <p style="color:#FF8488">
          *注意事项： 未认证状态下暂不支持启用新的合约
        </p>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="authonDialog = false">取消</el-button>
            <el-button type="primary" @click="handleComfirmReauthon">
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>

    </div>
  </div>

</template>


<style scoped lang="scss">
:deep() {
  .el-input__inner {
    height: 40px;
  }

  .authonDialog {
    .el-dialog__header {
      padding-bottom: 15px;
    }

    .el-dialog__body {
      padding-top: 0;
    }
  }
}

.info-banner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 150px;
  margin-bottom: 20px;
  padding: 0px 56px 8px 56px;

  .bak {
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .icon-box {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      object-fit: cover;
    }

    .logo {
      position: absolute;
      bottom: -13px;
      font-size: 30px;
    }
  }

  .company-info {
    margin-left: 33px;
    color: rgba(16, 16, 16, 1);

    .company-name {
      width: 518px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .identity-chain {
      font-size: 12px;
      display: flex;
      align-items: center;

      .identity-id {

        color: var(--el-color-primary);
      }
    }

    .auth-status {
      width: 170px;
      height: 25px;
      line-height: 25px;
      font-size: 12px;
      text-align: center;
      border-radius: 3px;
      margin-top: 15px;
    }

    .auth-succ {
      background: #0DBF39;
      color: #fff;

      svg {
        color: #fff;
      }
    }

    .auth-fail {
      background: #E9EAF0;
      color: #333333;

      svg {
        color: #BDBFCA;
      }
    }
  }

  .user-wrap {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: space-between;
    width: 240px;
    font-size: 12px;
    color: #666;
    text-align: center;

    .user-item-title {
      color: rgba(16, 16, 16, 1);
      font-size: 20px;
      margin-bottom: 6px;
    }

    .line {
      position: relative;
      bottom: -34px;
      width: 1px;
      height: 14px;
      background-color: #A2A7B0;
    }

    svg {
      font-size: 16px;
      margin-right: 6px;
    }
  }
}

.change-btn {
  width: 88px;
  height: 32px;
  margin-top: 14px;
  cursor: pointer;
  line-height: 32px;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 100);
  text-align: center;
  border: 1px solid rgba(220, 220, 220, 100);

  &:hover {
    border-color: var(--el-color-primary);
    color: var(--el-color-primary);
  }
}

.tips {
  display: flex;
  align-items: center;
  margin-left: 20px;
  width: 420px;
  padding: 13px 20px;
  background-color: rgba(249, 172, 20, 0.06);
  border: 1px solid rgba(249, 172, 20, 1);
  color: #F9AC14;
  font-size: 14px;

  i {
    margin-right: 5px;
    color: #FAAD15;
  }
}

.btnBox {
  display: flex;
  justify-content: center;
  margin-top: 50px;
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

.upImg {
  position: relative;
  height: 60px;
  width: 60px;

  input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  .circle {
    width: 24px;
    height: 25px;
    border-radius: 20px;
    background-color: #39ae5b;
    position: relative;
    top: -42px;
    left: 37px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .el-icon-upload {
    color: #fff;
  }
}

.sm-container {
  background-color: #fff;
  padding: 0 20px 50px;
  min-height: 547px;
}

.clearfixHeader {
  height: 80px;
  color: #424242;
  font-size: 18px;
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

.rowName {
  color: #757575;
}

.headerImg {
  width: 60px;
  height: 60px;
  border-radius: 94px;
}

.rowValue {
  width: 235px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: #f7f8fa;
  border: 1px solid #dce0e7;
  height: 32px;
  border-radius: 3px;
  line-height: 32px;
  padding: 0 10px;

  input {
    width: 100%;
    height: 40px;
    border: none;
    outline: none;
  }
}

.textAlien {
  text-align: center;
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
  padding: 0 30px 30px 30px;
  width: 1030px;
  line-height: 20px;
  background-color: #fff;
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 1);
  border: 1px solid rgba(255, 255, 255, 0);
}
</style>

<style scoped>
:deep(.el-row) {
  color: rgba(162, 167, 176, 1);
  margin-bottom: 20px;
}

:deep(.el-col-4 .rowName) {
  color: #101010;
  text-align: right;
}

:deep(.el-col) {
  height: 32px;
  line-height: 32px;
}
</style>
