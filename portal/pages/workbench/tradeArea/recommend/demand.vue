<template>
  <div class="demand-release-page">

    <el-breadcrumb separator="/" class="bread">
      <el-breadcrumb-item :to="{ path: 'ai' }">
        <span style="color:#666;font-weight: normal">供需匹配</span>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <span style="font-size: 14px; color: #101010">匹配结果</span>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <div class="content-card">
      <el-card class="search-card" shadow="never">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="需求名称:">
            <el-input v-model="searchForm.demandName" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item label="产品名称:">
            <el-input v-model="searchForm.productName" placeholder="请输入" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleReset">重置</el-button>
            <el-button type="primary" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="table-card" shadow="never">
        <el-table :data="tableData" style="width: 100%" stripe>
          <el-table-column prop="demandTxId" label="需求编号"></el-table-column>
          <el-table-column prop="demandName" label="需求名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column width="80" label="匹配产品图片">
            <template #default="{ row }">
              <el-image style="width: 50px; height: 50px" :src="row.supplyImage || defaultProductIcon" fit="cover" />
            </template>
          </el-table-column>
          <el-table-column prop="supplyName" label="匹配产品名称" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="matchScore" label="AI 匹配度分析">
            <template #default="{row}">
              {{ row.matchScore }}%
            </template>
          </el-table-column>
          <el-table-column prop="matchReason" label="匹配原因"></el-table-column>
          <el-table-column prop="supplyOrgName" label="供应商"></el-table-column>
          <el-table-column prop="supplyCircleName" label="圈子"></el-table-column>
          <el-table-column prop="createdAt" label="匹配时间">
            <template #default="{row}">
              {{ row.createdAt.replace('T', " ") }}
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
import { getAiMatchProduct } from '@/api/api'
import { defaultProductIcon } from '../data'

// 搜索表单数据
const searchForm = ref({
  demandName: '',
  productName: ''
});

// 分页相关数据
const currentPage = ref(1);
const pageSize = ref(10);
const totalDemands = ref(0);

const tableData = ref([]);

// 处理查询
const handleSearch = async () => {
  const res = await getAiMatchProduct({
    memberDID: cookies.getItem('did'),
    demandName: searchForm.value.demandName,
    supplyName: searchForm.value.productName,
    pageNo: currentPage.value,
    pageSize: pageSize.value
  })
  tableData.value = res.result.records
  totalDemands.value = res.result.total - 0
};

// 初始化数据
onMounted(async () => {
  await nextTick(() => { })
  handleSearch()
});

// 处理重置
const handleReset = () => {
  searchForm.value.demandName = '';
  currentPage.value = 1;
  handleSearch()
};

// 处理查看详情
const handleViewDetails = (row) => {
  window.open('/tradeArea/product/' + row.supplyId, '_blank');
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