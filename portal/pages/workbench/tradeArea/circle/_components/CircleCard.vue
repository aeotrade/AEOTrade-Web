<template>
  <div class="circle-card">
    <div class="circle-icon">
      <img v-if="icon" :src="icon" alt="circle-icon" />
    </div>
    <div class="circle-name">
      <el-tooltip v-if="name.length > 10" :content="name" placement="top">
        <span>{{ truncatedName }}</span>
      </el-tooltip>
      <span v-else>{{ name }}</span>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: () => '',
  },
});

const truncatedName = computed(() => {
  return props.name.length > 10 ? props.name.slice(0, 10) + '...' : props.name;
});
</script>

<style scoped>
.circle-card {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border: 1px solid #e9e9e9;
  border-radius: 8px;
  background-color: #fff;
  transition: all 0.3s ease;
  cursor: pointer;
  width: 300px;
  box-sizing: border-box;
}

.circle-card:hover {
  border-color: var(--el-color-primary);
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
  color: #101010;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
}
</style>