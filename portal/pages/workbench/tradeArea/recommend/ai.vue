<template>
  <div class="supply-demand-match-page">
    <div class="page-header">
      <h1 class="page-title">供需匹配助手</h1>
      <p class="page-subtitle">基于您发布的需求和产品，AI进行智能分析并精准推送匹配</p>
    </div>

    <div class="feature-cards">
      <el-card class="feature-card" shadow="never">
        <div class="title-wrapper">
          <div class="card-icon-wrapper" style="background-color: #5098fc;">
            <el-icon :size="24" color="#fff">
              <Search />
            </el-icon>
          </div>
          <h3 class="card-title">智能检索产品</h3>
        </div>
        <p class="card-description">基于发布的需求，寻找匹配的产品</p>
      </el-card>

      <el-card class="feature-card" shadow="never">
        <div class="title-wrapper">
          <div class="card-icon-wrapper" style="background-color: #af71e8;">
            <el-icon :size="24" color="#fff">
              <Aim />
            </el-icon>
          </div>
          <h3 class="card-title">智能匹配需求</h3>
        </div>
        <p class="card-description">基于发布的产品，寻找潜在的商机</p>
      </el-card>

      <el-card class="feature-card" shadow="never">
        <div class="title-wrapper">
          <div class="card-icon-wrapper" style="background-color: #88ddda;">
            <el-icon :size="24" color="#fff">
              <Clock />
            </el-icon>
          </div>
          <h3 class="card-title">7x24 持续追踪</h3>
        </div>
        <p class="card-description">实时追踪市场动态，精准推送匹配</p>
      </el-card>
    </div>

    <template v-if="noData === false">
      <el-card class="match-progress-card" shadow="never">
        <div class="progress-details">
          <div class="loading">
            <img src="@/assets/img/workbench/tradeArea/loading.gif" alt="ai处理中">
          </div>
          <h2 class="progress-title">AI智能引擎正在自动分析匹配</h2>
          <ul class="progress-list">
            <li v-if="loading">
              <img style="width: 40px;" src="@/assets/img/workbench/tradeArea/loading-hor.gif" alt="ai处理中">
            </li>
            <!-- 使用 v-for 渲染列表项，并动态绑定动画延迟 -->
            <li v-for="(item, index) in progressItems" :key="index" :style="{ 'animation-delay': (index * 0.8) + 's' }"
              class="progress-item-animated">
              <el-icon :size="16" :color="item.iconColor">
                <component :is="item.icon" />
              </el-icon>
              <span>
                {{ item.prefix }}
                <span v-if="item.num1 !== undefined" class="highlight-num">{{ item.animatedNum1 }}</span>
                {{ item.middle }}
                <span v-if="item.num2 !== undefined" class="highlight-num">{{ item.animatedNum2 }}</span>
                {{ item.suffix }}
              </span>
            </li>
          </ul>
        </div>
      </el-card>

      <div class="match-results-actions">
        <el-card v-if="matchResult.publishDemand > 0" class="result-action-card" shadow="never" :class="{ 'slide-in-bottom': showResultCards }">
          <div class="action-item">
            <img style="width: 24px;" src="@/assets/img/workbench/tradeArea/recommend_product_icon.png" alt="产品">
            <span class="action-text">已根据您发布的需求筛选出 <span class="highlight-num">{{matchResult.matchProduct}}</span> 个匹配的产品。</span>
            <el-button type="primary" plain @click="viewProductMatchResults">查看匹配结果</el-button>
          </div>
        </el-card>

        <el-card v-if="matchResult.publishProduct > 0" class="result-action-card" shadow="never" :class="{ 'slide-in-bottom': showResultCards }"
          :style="{ 'animation-delay': showResultCards ? '0.2s' : '0s' }">
          <div class="action-item">
            <img style="width: 24px;" src="@/assets/img/workbench/tradeArea/recommend_demand_icon.png" alt="需求">
            <span class="action-text">已根据您发布的产品筛选出 <span class="highlight-num">{{matchResult.matchDemand}}</span> 个匹配的需求。</span>
            <el-button type="primary" plain @click="viewDemandMatchResults">查看匹配结果</el-button>
          </div>
        </el-card>
      </div>
    </template>
    <template v-else>
      <el-card class="match-progress-card" shadow="never">
        <div style="display: flex;flex-direction: column;padding-top: 30px;padding-bottom: 70px;">
          <img src="@/assets/img/workbench/tradeArea/search.gif" style="width: 230px;margin: 0 auto;" />
          <div style="font-size: 24px;font-weight: bold;margin: 30px auto 70px;">让 AI 帮您寻找精准商机与合作伙伴</div>
          <div style="display: flex;justify-content: center;align-items: center;column-gap: 60px">
            <el-button type="primary" @click="jump('/workbench/tradeArea/demand/create')">发布需求</el-button>
            <el-button type="primary" @click="jump('/workbench/tradeArea/product/create')">发布产品</el-button>
          </div>
        </div>
      </el-card>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, markRaw } from 'vue';
import { Search, Aim, Clock, CircleCheck, Document } from '@element-plus/icons-vue';
import { getAiMatch } from '@/api/api';

// 进度列表数据
const progressItems = ref([]);

// 控制结果卡片动画的显示
const showResultCards = ref(false);

// 数字滚动动画函数
const animateNumber = (obj, prop, targetValue, duration) => {
  let startValue = 0;
  const startTime = performance.now();

  const update = (currentTime) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / duration, 1);

    const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
    obj[prop] = currentValue.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      obj[prop] = targetValue.toLocaleString();
    }
  };

  requestAnimationFrame(update);
};

const loading = ref(false)
const noData = ref(false)
const matchResult = reactive({
  matchProduct: 0,
  matchDemand: 0,
  publishProduct: 0,
  publishDemand: 0
})
const getData = async () => {
  loading.value = true
  const memberDid = cookies.getItem('did')
  const { result } = await getAiMatch({ memberDID: memberDid })
  matchResult.publishProduct = result.product.count
  matchResult.publishDemand = result.requirement.count
  matchResult.matchProduct = result.requirement.match
  matchResult.matchDemand = result.product.match
  loading.value = false

  if(result.product.count == 0 && result.requirement.count == 0){
    noData.value = true
    return
  }
  let progress = []
  if(result.product.count > 0 && result.requirement.count > 0){
    progress = [
      {
        icon: markRaw(CircleCheck),
        iconColor: '#389E0D',
        prefix: '已收集到 ',
        num1: result.requirement.count,
        animatedNum1: 0, // 用于动画的数字
        middle: ' 个需求，已收集到 ',
        num2: result.product.count,
        animatedNum2: 0, // 用于动画的数字
        suffix: ' 个产品'
      },
      {
        icon: markRaw(CircleCheck),
        iconColor: '#389E0D',
        prefix: '查找到您已加入 ',
        num1: result.product.circle || result.requirement.circle,
        animatedNum1: 0,
        middle: ' 个圈子',
        num2: undefined, // 没有第二个数字
        animatedNum2: undefined,
        suffix: ''
      },
      {
        icon: markRaw(CircleCheck),
        iconColor: '#389E0D',
        prefix: '已检索到 ',
        num1: result.product.supplier,
        animatedNum1: 0,
        middle: ' 家供应商，已检索到 ',
        num2: result.requirement.supplier,
        animatedNum2: 0,
        suffix: ' 家需求方'
      },
      {
        icon: markRaw(CircleCheck),
        iconColor: '#389E0D',
        prefix: '已检索到 ',
        num1: result.requirement.product,
        animatedNum1: 0,
        middle: ' 个产品，已检索到 ',
        num2: result.product.requirement,
        animatedNum2: 0,
        suffix: ' 个需求'
      }
    ]
  }else if(result.product.count > 0){
    progress = [
      {
        icon: markRaw(CircleCheck),
        iconColor: '#389E0D',
        prefix: '已收集到 ',
        num1: result.product.count,
        animatedNum1: 0, // 用于动画的数字
        middle: ' 个产品',
        num2: undefined,
        animatedNum2: 0, // 用于动画的数字
        suffix: ''
      },
      {
        icon: markRaw(CircleCheck),
        iconColor: '#389E0D',
        prefix: '查找到您已加入 ',
        num1: result.product.circle || result.requirement.circle,
        animatedNum1: 0,
        middle: ' 个圈子',
        num2: undefined, // 没有第二个数字
        animatedNum2: undefined,
        suffix: ''
      },
      {
        icon: markRaw(CircleCheck),
        iconColor: '#389E0D',
        prefix: '已检索到 ',
        num1: result.requirement.supplier,
        animatedNum1: 0,
        middle: ' 家需求方',
        num2: undefined,
        animatedNum2: 0,
        suffix: ''
      },
      {
        icon: markRaw(CircleCheck),
        iconColor: '#389E0D',
        prefix: '已检索到 ',
        num1: result.product.requirement,
        animatedNum1: 0,
        middle: ' 个需求',
        num2: undefined,
        animatedNum2: 0,
        suffix: ''
      }
    ]
  }else if(result.requirement.count > 0){
    progress = [
      {
        icon: markRaw(CircleCheck),
        iconColor: '#389E0D',
        prefix: '已收集到 ',
        num1: result.requirement.count,
        animatedNum1: 0, // 用于动画的数字
        middle: ' 个需求',
        num2: undefined,
        animatedNum2: 0, // 用于动画的数字
        suffix: ''
      },
      {
        icon: markRaw(CircleCheck),
        iconColor: '#389E0D',
        prefix: '查找到您已加入 ',
        num1: result.product.circle || result.requirement.circle,
        animatedNum1: 0,
        middle: ' 个圈子',
        num2: undefined, // 没有第二个数字
        animatedNum2: undefined,
        suffix: ''
      },
      {
        icon: markRaw(CircleCheck),
        iconColor: '#389E0D',
        prefix: '已检索到 ',
        num1: result.product.supplier,
        animatedNum1: 0,
        middle: ' 家供应商',
        num2: undefined,
        animatedNum2: 0,
        suffix: ''
      },
      {
        icon: markRaw(CircleCheck),
        iconColor: '#389E0D',
        prefix: '已检索到 ',
        num1: result.requirement.product,
        animatedNum1: 0,
        middle: ' 个产品',
        num2: undefined,
        animatedNum2: 0,
        suffix: ''
      }
    ]
  }

  progressItems.value = progress

  const liAnimationDuration = 800; // li 标签动画持续时间
  const liAnimationDelayStep = 800; // li 标签动画延迟步长

  // 计算所有 li 标签动画完成的总时间
  const totalLiAnimationTime = (progressItems.value.length - 1) * liAnimationDelayStep + liAnimationDuration;

  progressItems.value.forEach((item, index) => {
    // 延迟启动数字动画，与 li 标签的动画同步
    setTimeout(() => {
      if (item.num1 !== undefined) {
        animateNumber(item, 'animatedNum1', item.num1, liAnimationDuration);
      }
      if (item.num2 !== undefined) {
        animateNumber(item, 'animatedNum2', item.num2, liAnimationDuration);
      }
    }, index * liAnimationDelayStep);
  });

  // 在所有 li 动画完成后，显示结果卡片并触发其动画
  setTimeout(() => {
    showResultCards.value = true;
  }, totalLiAnimationTime + 200); // 额外增加200ms的延迟，确保li动画完全结束
}

onMounted(async () => {
  await nextTick(() => {})
  getData()
});

const router = useRouter();
const viewProductMatchResults = () => {
  router.push({ path: 'demand' })
};

const viewDemandMatchResults = () => {
  router.push({ path: 'product' })
};

const jump = (url) => {
  router.push(url)
}
</script>

<style scoped>
.supply-demand-match-page {
  padding: 40px 20px;
  background-color: #f7f8f9;
  min-height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 32px;
  font-weight: bold;
  color: #101010;
  margin-bottom: 10px;
}

.page-subtitle {
  font-size: 20px;
  color: #404040;
  line-height: 1.5;
}

.feature-cards {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  width: 100%;
  max-width: 900px;
  justify-content: center;
}

.feature-card {
  flex: 1;
  max-width: 280px;
  text-align: center;
  border-radius: 8px;
  border: 1px solid #d0e4fd;
}

.title-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.card-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #e6f0ff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
}

.card-title {
  font-size: 18px;
  font-weight: bold;
  color: #404040;
}

.card-description {
  font-size: 14px;
  color: #5a5a5a;
  line-height: 1.5;
  text-align: left;
}

.match-progress-card {
  width: 100%;
  max-width: 900px;
  margin-bottom: 30px;
  border-radius: 8px;
  border: 1px solid #d0e4fd;
}

:deep(.match-progress-card) {
  .el-card__body {
    display: flex;
    justify-content: center;
  }
}

.progress-details {
  position: relative;
  min-height: 120px;
}

.loading {
  position: absolute;
  left: 0;
  top: 0;
  transform: translateX(-130%);
}

.loading img {
  width: 80px;
  height: 80px;
}

.progress-title {
  font-size: 24px;
  font-weight: bold;
  color: #101010;
  margin-top: 0;
  margin-bottom: 20px;
}

.progress-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.progress-list li {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 16px;
  color: #606266;
}

.progress-list li .el-icon {
  margin-right: 8px;
  flex-shrink: 0;
}

.highlight-num {
  color: var(--el-color-primary);
  font-weight: bold;
}

.match-results-actions {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.result-action-card {
  border-radius: 8px;
  border: 1px solid #d0e4fd;
  opacity: 0;
  transform: translateY(50px);
}

.action-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.action-text {
  flex-grow: 1;
  font-size: 16px;
  color: #606266;
}

.action-item .el-icon {
  flex-shrink: 0;
}

@keyframes slideInUpFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.progress-item-animated {
  opacity: 0;
  transform: translateY(20px);
  animation: slideInUpFadeIn 0.8s ease-out forwards;
}

@keyframes slideInBottomFadeIn {
  from {
    opacity: 0;
    transform: translateY(50px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in-bottom {
  animation: slideInBottomFadeIn 0.6s ease-out forwards;
}
</style>