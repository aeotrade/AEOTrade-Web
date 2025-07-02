<template>
  <div>
    <el-breadcrumb separator="/" class="bread">
      <el-breadcrumb-item :to="{ path: '/workbench/tradeArea/circle/list' }">
        <span style="color:#666;font-weight: normal">圈子管理</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <span style="font-size: 14px; color: #101010">演示圈子</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="circle-detail-page">
      <el-card class="circle-info-card">
        <div class="card-content">
          <div class="circle-icon-wrapper">
            <img :src="circleInfo.defaultImage || defaultCircleIcon" alt="圈子图标" class="circle-icon-img" />
          </div>
          <div class="circle-details">
            <h1 class="circle-name">{{ circleInfo.name }}</h1>
            <p class="circle-description">{{ circleInfo.description }}</p>
            <div class="circle-meta">
              <div class="meta-item">
                <el-icon :size="16" color="#909399">
                  <OfficeBuilding />
                </el-icon>
                <span>圈主: {{ circleInfo.ownerOrgName }}</span>
              </div>
              <div class="meta-item">
                <el-icon :size="16" color="#909399">
                  <User />
                </el-icon>
                <span>成员: {{ circleInfo.memberCount }}+</span>
              </div>
            </div>
          </div>
          <div class="action-button">
            <el-button :loading="joinLoading" v-if="!isJoined" type="primary" @click="handleJoinCircle">
              加入圈子
            </el-button>
            <el-button :loading="quitLoading" v-else type="danger" plain @click="handleExitCircle">
              退出圈子
            </el-button>
          </div>
        </div>
      </el-card>

      <el-card class="member-management-card">
        <template #header>
          <div class="card-header-title">成员管理</div>
        </template>

        <el-table :data="allMembers" style="width: 100%" stripe>
          <el-table-column prop="icon" label="图标" width="80">
            <template #default>
              <div class="member-icon-placeholder">
                <img style="width: 100%; height: 100%" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAASeSURBVFhHzZlPiFVVHMe/59w3M+/NPx00S9IWhqC4MERaqI1B0mAa2qoYhRZC2cIgN+lGxI22MahFFISoJLSJgkwMAtEkqE2zEASpRQa50NTJeX/mvXtPv++5c5/v3nfenztcH+8LZ+67955zfp97/v1+54wyIixC9x4CN24F+PNvg3/uGjyYNShXlH2XHzJYOq6wcrnCmlUKG9ZqLFtiX6VWasBvf/Jx+bpBsWQwOAjkPMDTUpFWCPEAVmgCAz8Aaj4wPw8MFxSmtirsfUUKpFDXgBcuBrh41cdIHhgSMC1AaRQIcEVA58rArkkP07vkq7pQR8CZmwE+ueDDE578kLRSOq4m0Vq5Iq0r1/enPWxc1x60LeBX3we4dM3HxHj6Fusktuj9WWDnSx727W4N2RLw5Bc13PrLYGwkW7Ck/pszWPucwtF3cgtP4nICEo6zkwO7F+KE42x3QTa1LbuVLdcrOIq2aJO2k4oB/i4TgmPuSXerS7RJ22RoVAzwU5mtnBAucSBkmVyibTI0qg7IdY5LiWu2skIuxky84ZiZK7ZPpbKBVqZeLplckLRNBrJEqk+SfR9WxR2517kI0JfFa8mYwsG3PDG+8NIleVcsAR+flfXTI2hzZnqZVrbuPZTx+NGAvRezofuih+i0CM9Xge2bNZ5dofDMclhfu/KpeIqeP79aYdN6hVptoXCXIgNZyGTv2YLvnaiJT5UvbdEsUQuy297Y4WFqm8a7x2vWIySLVOQjJuUjDr7p4fx3AX6Z8cU1NtfbqgUpLuI1X+GzYzloRiUcU2k9xfgIpLtho5ZYkmfD4hIpsbMokYVMZNMMmRiVZCUy5aL1ViYJx6LDF3QUmcim6TEYMmUmYWG0Q729x8P+1z38O6skkkkHSSay6Tt3w/GVlTiuHhXD35wgO7ZonDuZw/o1yvrdbkUmsun7s4ENNrNUNPg//9rHmW/C2Xhofw6vbtUod9mSZCKbLs8/joSz1tiowpXfAnxwKlxrJmQNNc3u1ikykS3DznWrMCTdtTDGFzOrdX7Q2Jn3JLWYHiIT2fTEuLYbnH4Tmcim6Zq4qvebyEQ2zUiWW8N+E5nIprmp5r6130Qmsmnu+Bly00F3UlkKVWthPv4uyR6XAUQ8SZ5qmIfXUiXMa++lbPS7nchCJrLZaIahzQ9XAxTy7vlGV1qRyGVqG/exYSj14/VAxomRRTlehjHjqqe1zTdz0+D2HfH1A8ou0n/cNvbZ5Z8lwmmzx+aHvjap7SlEVwErQUYLGqcOZ+O0j5z28agkEbzDgyUD1jogw+wrv/rOVmQOTnu+YyAwUgj9basWYP5hCTqL0t3Mw/vRYWBOIhsef7CF7FmOozzfvfzi46OROiB14FhVYrkwHkuKuQL5wytTK7i6WGtDnqgME7cArvIce0UZs1+eCFuPirm6Q9OePY5wiRWyS3KyqxnIhde2KZEnKsM6XHAUbZOhUTHAF9Zpe1aSJizKSrRJ22RoVFOwwIMcnpUw5O6VaIs2XYdIzU9EPCPhKt6LlqSNVucyVGySJNXXx2+R+voAs1F9ewScVN8eoifVm39DAP8Df0aqy5ArXbwAAAAASUVORK5CYII=" />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="orgName" label="组织名称"></el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
            :small="false" :disabled="false" :background="true" layout="total, sizes, prev, pager, next, jumper"
            :total="totalMembers" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { OfficeBuilding, User, Document } from '@element-plus/icons-vue';
import { getCircleDetail, getCircleMemberList, postJoinCircle, postQuitCircle } from '@/api/api'
import { defaultCircleIcon } from '../data'

// 圈子信息
const circleInfo = ref({
  id: '',
  circleId: '',
  name: '',
  iconUrl: '',
  description: '',
  ownerOrgName: '',
  memberCount: 0,
});

// 用户是否已加入圈子
const isJoined = ref(false);

// 成员数据
const allMembers = ref([]);

// 分页相关数据
const currentPage = ref(1);
const pageSize = ref(10);
const totalMembers = ref(0);

// 处理每页显示数量变化
const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1;
  getMemberList();
};

// 处理当前页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val;
  getMemberList();
};

const route = useRoute()
const circleId = ref(route.query.id)

// 获取圈子详情
const handleGetCircleDetail = async () => {
  try {
    const res = await getCircleDetail({
      circleId: circleId.value,
      memberDid: cookies.getItem('did'),
    })
    circleInfo.value = res.result
    isJoined.value = !!res.result.isJoin
  } catch (error) {
    console.error('获取圈子详情失败:', error)
  }
}

// 获取成员列表
const getMemberList = async () => {
  try {
    const res = await getCircleMemberList({
      circleId: circleId.value,
      pageNo: currentPage.value,
      pageSize: pageSize.value,
    })
    allMembers.value = res.result.records
    totalMembers.value = res.result.total
  } catch (error) {
    console.error('获取成员列表失败:', error)
  }
}

onMounted(async() => {
  await nextTick(() => {})
  handleGetCircleDetail()
  getMemberList()
})

const { user } = useUser()
const joinLoading = ref(false)
// 处理加入圈子
const handleJoinCircle = () => {
  ElMessageBox.confirm('确定要加入该圈子吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info',
  })
    .then(async () => {
      joinLoading.value = true
      await postJoinCircle({
        circleId: circleInfo.value.circleId,
        memberDID: cookies.getItem('did'),
        orgName: user.value?.bind?.membername,
        socialCreditCode: user.value?.bind?.uscc,
      })
      joinLoading.value = false;
      handleGetCircleDetail();
      ElMessage({
        type: 'success',
        message: '已成功加入圈子！',
      });
    })
    .catch(() => {
      joinLoading.value = false;
    });
};

const quitLoading = ref(false)
// 处理退出圈子
const handleExitCircle = () => {
  ElMessageBox.confirm('确定要退出该圈子吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      quitLoading.value = true;
      await postQuitCircle({
        circleId: circleInfo.value.circleId,
        ownerDID: circleInfo.value.ownerDid,
        memberDID: cookies.getItem('did'),
      })
      quitLoading.value = false;
      handleGetCircleDetail();
      ElMessage({
        type: 'success',
        message: '已成功退出圈子！',
      });
    })
    .catch(() => {
      quitLoading.value = false;
    });
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

.circle-detail-page {
  padding: 20px 30px;
  background-color: #f7f8f9;
  min-height: calc(100vh - 50px);
}

.el-breadcrumb {
  margin-bottom: 20px;
  font-size: 14px;
}

.circle-info-card {
  margin-bottom: 20px;
  border-radius: 8px;
  border: 0;
  box-shadow: none;
}

.circle-info-card .el-card__body {
  padding: 20px;
}

.card-content {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.circle-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #e6f0ff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  overflow: hidden;
}

.circle-icon-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.circle-details {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.circle-name {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-top: 0;
  margin-bottom: 10px;
}

.circle-description {
  font-size: 14px;
  color: #5a5a5a;
  line-height: 1.6;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.circle-meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #6c6c6c;
}

.meta-item {
  display: flex;
  align-items: center;
}

.meta-item span {
  margin-left: 5px;
}

.action-button {
  flex-shrink: 0;
  margin-left: auto;
  align-self: center;
}

.member-management-card {
  border-radius: 8px;
  border: 0;
  box-shadow: none;
}

.member-management-card .el-card__header {
  padding: 18px 20px;
  border-bottom: 1px solid #ebeef5;
}

.card-header-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.member-icon-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  overflow: hidden;
  background-color: #e6f0ff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.member-icon-placeholder img{
  user-select: none;
  -webkit-user-drag: none;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>