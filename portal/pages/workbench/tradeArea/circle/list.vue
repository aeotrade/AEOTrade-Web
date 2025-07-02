<template>
  <div class="circles-page">
    <template v-for="module in circleList" :key="module.moduleName">
      <section v-if="module.list.length !== 0" class="section-block">
        <h2 class="section-title">{{ module.moduleName }}</h2>
        <div class="circle-list">
          <CircleCard @click="handleCircleClick(circle)" v-for="circle in module.list" :key="circle.id"
            :name="circle.name" :icon="circle.defaultImage || defaultCircleIcon" />
        </div>
      </section>
    </template>

    <!-- 推荐圈子 -->
    <template v-if="recommendedCircles.length !== 0">
      <section class="section-block">
        <h2 class="section-title">推荐圈子</h2>
        <div class="recommended-circle-list">
          <RecommendedCircleCard @click="handleCircleClick(circle)" v-for="circle in recommendedCircles" :key="circle.id"
            :name="circle.name" :description="circle.description" :company="circle.creatorOrgName" :members="circle.memberCount"
            :icon="circle.defaultImage || defaultCircleIcon" />
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import CircleCard from './_components/CircleCard.vue';
import RecommendedCircleCard from './_components/RecommendedCircleCard.vue';
import { getMyCircleList, getJoinedCircleList, getRecommendCircleList } from '@/api/api'
import { defaultCircleIcon } from '../data'

const circleList = reactive([
  {
    moduleName: '我创建的圈子',
    list: []
  },
  {
    moduleName: '我加入的圈子',
    list: []
  },
])

// 推荐圈子数据
const recommendedCircles = ref([]);

const router = useRouter()
const handleCircleClick = (circle) => {
  router.push({ path: 'detail', query: { id: circle.circleId } })
}

onMounted(async() => {
  await nextTick(() => {})
  const did = cookies.getItem('did')
  getMyCircleList({did}).then((res) => {
    circleList[0].list = res.result
  })
  getJoinedCircleList({did}).then(res => {
    circleList[1].list = res.result
  })
  getRecommendCircleList().then(res => {
    recommendedCircles.value = res.result
  })
})
</script>

<style scoped>
.circles-page {
  padding: 30px;
  margin: 0 auto;
}

.section-block {
  margin-bottom: 40px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #101010;
  margin-bottom: 20px;
}

.circle-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.recommended-circle-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
</style>