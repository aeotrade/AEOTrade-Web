<!-- src/components/RecommendedCircleCard.vue -->
<template>
  <div class="recommended-circle-card">
    <div class="card-header">
      <div class="circle-icon">
        <img v-if="icon" :src="icon" alt="circle-icon" />
      </div>
      <div class="circle-name">{{ name }}</div>
    </div>
    <div class="card-description">
      {{ description }}
    </div>
    <div class="card-footer">
      <div class="company-info">
        <el-icon :size="16" color="#909399">
          <OfficeBuilding />
        </el-icon>
        <span>{{ company }}</span>
      </div>
      <div class="member-count">
        <el-icon :size="16" color="#909399">
          <User />
        </el-icon>
        <span>{{ members }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { OfficeBuilding, User } from '@element-plus/icons-vue';

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  members: {
    type: Number,
    required: true,
  },
  icon: {
    type: String,
    default: () => '', // 默认图标
  },
});
</script>

<style scoped>
.recommended-circle-card {
  width: 380px;
  border: 1px solid #e9e9e9;
  border-radius: 8px;
  background-color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  cursor: pointer;
  box-sizing: border-box;
}

.recommended-circle-card:hover {
  border-color: var(--el-color-primary);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.circle-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #e6f0ff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.circle-name {
  font-size: 16px;
  font-weight: bold;
  color: #101010;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-description {
  font-size: 14px;
  color: #a3a3a3;
  line-height: 1.5;
  margin-bottom: 20px;
  height: 63px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #6c6c6c;
  border-top: 1px solid #ebeef5;
  padding-top: 15px;
  margin-top: auto;
}

.company-info,
.member-count {
  display: flex;
  align-items: center;
}

.company-info span,
.member-count span {
  margin-left: 6px;
}
</style>