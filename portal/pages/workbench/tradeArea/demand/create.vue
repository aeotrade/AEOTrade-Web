<template>
  <div>
    <el-breadcrumb separator="/" class="bread">
      <el-breadcrumb-item :to="{ path: 'list' }">
        <span style="color:#666;font-weight: normal">需求管理</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <span style="font-size: 14px; color: #101010">{{ id ? '编辑需求' : '发布需求' }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div class="demand-form-page">
      <el-card class="form-card" shadow="never">
        <el-form :disabled="!isEditMode" style="width: 60%;" :model="demandForm" :rules="rules" ref="demandFormRef"
          label-width="100px" label-position="left">
          <el-form-item label="需求名称:" prop="name">
            <el-input v-model="demandForm.name" placeholder="请输入需求名称" clearable></el-input>
          </el-form-item>

          <el-form-item label="需求详情:" prop="detail">
            <ClientOnly>
              <div style="border: 1px solid #ccc;width: 100%;">
                <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="{}"
                  :mode="'default'" />
                <Editor style="height: 500px; overflow-y: hidden;" v-model="demandForm.detail"
                  :defaultConfig="{ ...editorConfig }" :mode="'default'" @onCreated="(editor) => editorRef = editor" />
              </div>
            </ClientOnly>
          </el-form-item>

          <el-form-item label="截止日期:" prop="deadline">
            <el-date-picker v-model="demandForm.deadline" type="date" placeholder="请选择截止日期" style="width: 100%;"
              value-format="YYYY-MM-DD"></el-date-picker>
          </el-form-item>

          <el-form-item label="预算金额:" prop="price">
            <el-input-number style="width: 300px" :precision="2" v-model="demandForm.price" :min="0"
              :max="9999999999.99" placeholder="请输入预算金额" />
          </el-form-item>
        </el-form>

        <div class="form-actions">
          <template v-if="id">
            <el-button v-if="isEditMode == false"
              @click="() => { isEditMode = true; editorRef.enable(); }">编辑</el-button>
            <el-button :loading="saveLoading" v-else type="primary" @click="handleSave">保存</el-button>
            <el-button v-if="demandForm.status !== 3" type="primary" @click="handlePublish">发布到圈子</el-button>
            <el-button v-else type="primary" @click="handleUnPublish">撤销发布</el-button>
          </template>
          <template v-else>
            <el-button @click="handleCancel">取消</el-button>
            <el-button :loading="saveLoading" type="primary" @click="handleSave">保存</el-button>
          </template>
        </div>
      </el-card>
    </div>

    <ClientOnly>
      <el-dialog v-model="dialogVisible" title="发布到圈子" width="500">
        <div style="color: #666666;margin-bottom: 15px;">请选择需发布的圈子</div>
        <el-select v-model="selectedCircle" multiple placeholder="请选择需发布的圈子">
          <el-option v-for="item in circleList" :key="item.circleId" :label="item.name" :value="item.circleId"></el-option>
        </el-select>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" :loading="publishLoading" @click="handleConfirmPublish">
              确认
            </el-button>
          </div>
        </template>
      </el-dialog>
    </ClientOnly>
  </div>
</template>

<script setup>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'
import { editorConfig } from '../wangEditorConfig'
import { postPublish, postUnPublish, postSaveDemand, postUpdateDemand, getMyOrJoinedCircleList, getDemandDetail } from '@/api/api'

const route = useRoute();
const router = useRouter();

const editorRef = shallowRef();
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const id = computed(() => route.query.id);
const isEditMode = ref(id.value === undefined);
const demandFormRef = ref(null);
const dialogVisible = ref(false);
const selectedCircle = ref(null);
const circleList = ref([]);

const { user } = useUser()
// 表单数据
const demandForm = reactive({
  id: null, // 用于编辑模式
  name: '',
  detail: '',
  deadline: '',
  price: null,
  status: '',
  memberOrg: user.value?.bind?.membername || ''
});

// 表单校验规则
const rules = reactive({
  name: [
    { required: true, message: '请输入需求名称', trigger: 'blur' },
    { min: 1, max: 60, message: '长度不超过 60 个字符', trigger: 'blur' },
  ],
  detail: [
    { required: true, message: '请输入需求详情', trigger: 'blur' },
  ],
  deadline: [
    { required: true, message: '请选择截止日期', trigger: 'change' },
  ],
  price: [
    { required: true, message: '请输入预算金额', trigger: 'blur' },
  ],
});

const getDetail = async () => {
  const res = await getDemandDetail({
    id: route.query.id
  })
  demandForm.id = res.result.id
  demandForm.name = res.result.name
  demandForm.detail = res.result.detail
  demandForm.deadline = res.result.deadline
  demandForm.price = res.result.price
  demandForm.status = res.result.status
}

// 加载数据
onMounted(async () => {
  if (route.query.id) {
    await nextTick()
    editorRef.value && editorRef.value.disable()
    getDetail()
  }

  // 获取我拥有的圈子列表
  const did = cookies.getItem('did')
  getMyOrJoinedCircleList({ did }).then(res => {
    circleList.value = res.result
  })
});

const saveLoading = ref(false)
// 处理保存
const handleSave = () => {
  demandFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        saveLoading.value = true
        if (id.value) {
          await postUpdateDemand({
            ...demandForm,
            memberDID: cookies.getItem('did')
          })
          getDetail()
        } else {
          const res = await postSaveDemand({
            ...demandForm,
            memberDID: cookies.getItem('did')
          })
          demandForm.id = res.result
          router.replace({ path: 'create', query: { id: res.result }})
        }
        saveLoading.value = false
        isEditMode.value = false
        editorRef.value && editorRef.value.disable()
        ElMessage.success('保存成功！');
      } catch (error) {
        saveLoading.value = false
        ElMessage.error('保存失败，请重试！');
      }
    } else {
      ElMessage.warning('请检查表单填写，有必填项未填写或格式不正确！');
      return false;
    }
  });
};

// 处理发布到圈子
const handlePublish = () => {
  demandFormRef.value.validate(async (valid) => {
    if (valid) {
      dialogVisible.value = true
    } else {
      ElMessage.warning('请检查表单填写，有必填项未填写或格式不正确！');
      return false;
    }
  });
};

const publishLoading = ref(false)
// 处理确认发布
const handleConfirmPublish = async () => {
  if(!selectedCircle.value || selectedCircle.value.length == 0){
    ElMessage.warning('请选择发布的圈子');
    return false;
  }
  try{
    publishLoading.value = true
    await postPublish({
      id: id.value,
      circleIds: selectedCircle.value,
      memberDID: cookies.getItem('did')
    })
    publishLoading.value = false
    dialogVisible.value = false
    ElMessage.success('发布成功！');
    getDetail()
  }catch(e){
    publishLoading.value = false
  }
};

// 取消发布
const handleUnPublish = async () => {
  ElMessageBox.confirm('撤销后圈子用户无法将查看该需求，确认撤销？', '撤销发布', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await postUnPublish({
      id: id.value,
      memberDID: cookies.getItem('did')
    })
    getDetail()
  }).catch(() => {

  });
}

// 处理取消
const handleCancel = () => {
  router.back();
};
</script>

<style scoped>
.bread {
  background-color: #fff;
  padding-left: 30px;
  margin-bottom: 0 !important;
  height: 40px;
  line-height: 40px;
  color: rgba(16, 16, 16, 1);
  box-sizing: border-box;
  font-size: 14px;
  font-family: SourceHanSansSC-regular;
}

.demand-form-page {
  padding: 20px 30px;
  background-color: #f7f8f9;
  min-height: calc(100vh - 50px);
}

.form-card {
  border-radius: 8px;
  border: 0;
  box-shadow: none;
  padding: 20px;
}

.form-card .el-card__body {
  padding: 20px;
}

.el-form-item {
  margin-bottom: 22px;
}

.rich-text-toolbar-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 32px;
  background-color: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-bottom: none;
  border-radius: 4px 4px 0 0;
  display: flex;
  align-items: center;
  padding: 0 10px;
  box-sizing: border-box;
  z-index: 1;
}

.rich-text-toolbar-placeholder .el-button {
  margin-right: 5px;
  padding: 4px 8px;
  min-height: unset;
}

.form-actions {
  margin-top: 30px;
  text-align: right;
  margin-right: calc(40% - 10px);
}

.form-actions .el-button {
  margin: 0 10px;
  min-width: 100px;
}

.w-e-full-screen-container {
  z-index: 999;
}
</style>