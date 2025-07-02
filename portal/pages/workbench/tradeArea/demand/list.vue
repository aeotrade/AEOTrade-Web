<template>
  <div class="demand-release-page">

    <el-breadcrumb separator="/" class="bread">
      <el-breadcrumb-item>
        <span style="font-size: 14px; color: #101010">需求发布</span>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div class="content-card">
      <el-card class="search-card" shadow="never">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="需求名称:">
            <el-input v-model.trim="searchForm.demandName" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="table-card" shadow="never">
        <div class="table-header">
          <el-button type="primary" @click="handleCreateDemand">创建需求</el-button>
        </div>

        <el-table :data="allDemands" style="width: 100%" stripe>
          <el-table-column prop="number" label="需求编号" width="180"></el-table-column>
          <el-table-column prop="name" label="需求名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="deadline" label="截止时间" width="150"></el-table-column>
          <el-table-column prop="createdAt" label="创建时间" width="180">
            <template #default="scope">
              {{ scope.row.createdAt?.replace('T', ' ') }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              {{ statusMap[scope.row.status] }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="{ row }">
              <el-button link type="primary" @click="handleViewDetails(row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
            :small="false" :disabled="false" :background="true" layout="total, sizes, prev, pager, next, jumper"
            :total="totalDemands" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { getDemandList } from '@/api/api'
import { statusMap } from '../data'

// 搜索表单数据
const searchForm = ref({
  demandName: '',
});

// 需求数据
const allDemands = ref([]);

// 分页相关数据
const currentPage = ref(1);
const pageSize = ref(10);
const totalDemands = ref(0);

// 处理重置
const handleReset = () => {
  searchForm.value.demandName = '';
  currentPage.value = 1;
  handleSearch()
};

// 处理查询
const handleSearch = async () => {
  const res = await getDemandList({
    memberDID: cookies.getItem('did'),
    value: searchForm.value.demandName,
    pageNo: currentPage.value,
    pageSize: pageSize.value
  })
  allDemands.value = res.result.records
  totalDemands.value = res.result.total
};

onMounted(async() => {
  await nextTick(() => { })
  handleSearch()
})

const router = useRouter();
// 处理创建需求
const handleCreateDemand = () => {
  router.push({ path: 'create' });
};

// 处理查看详情
const handleViewDetails = (row) => {
  router.push({ path: 'create', query: { id: row.id } });
};

// 处理每页显示数量变化
const handleSizeChange = (val) => {
  pageSize.value = val;
  currentPage.value = 1;
  handleSearch()
};

// 处理当前页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val;
  handleSearch()
};
</script>

<style scoped>
.demand-release-page {
  background-color: #f7f8f9;
  min-height: calc(100vh - 50px);
}

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

.content-card {
  padding: 20px 30px;
}

.search-card {
  margin-bottom: 20px;
  border-radius: 8px;
  border: 0;
  box-shadow: none !important;
}

.search-form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.search-form .el-form-item {
  margin-bottom: 0;
  margin-right: 20px;
}

.table-card {
  border-radius: 8px;
  border: 0;
  box-shadow: none !important;
}

.table-header {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>