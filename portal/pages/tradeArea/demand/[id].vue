<template>
  <div>
    <Header></Header>
    <div class="demand-detail-page">
      <template v-if="demandForm.status == 3">
        <el-card class="detail-card" :body-style="{ padding: '20px' }">
          <h1 class="demand-title">{{ demandForm.name }}</h1>

          <div class="company-info">
            <img style="width: 25px;height: 25px;"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEkAAABECAIAAABCj49VAAAC/0lEQVRoBe2az2sTQRTH+4+tGCzioUpFT2sbgz1UUysqrUIpxB+oFZSiSEBQPJT0IoIoiAeFKLRUMAgiUqy/QAmCQpLDZDbZH0iZuPtmZrObbFN3dvvKHN6bht39zPu+NzszO0TT+zeUXjS6I9maTap+CxZd17g1m5QQ1RuySSOwE+O28c24s2SevWblL2y1nbps3bhnrlRakcUvRYTr6C/fflaNPUcdTR9we7kaEY9DkZz+2O4/bA8cTNOdM1etaKGTcLiO/tgKt83tYDs4ZcfPNr9oQbatpNyB47Z7qf2TirGN5iM+EAsRlMAIssm65dJLcvrLN6hJjFvXtzbUZNehYfqUZMh1oCb/LQgw30KExOR0+oo3Ve4ecyoforx2cRKUnNg0OTbjzd2a7uw64izcNX//6Wlc3MlAwuE6YmPLnffiBl9Qnrxou48eanAokhMbG5wDXDZmTF20Pn01QsEIkWj4DhXZNN3JZJ1iyaw3QiTKs4ieEmzDOScz7rMmPDxtB69cRRreV4JtZNJe/2KcvOSTgZruzN20qr/8JcqziJ4qbCy7npVbo3mufrIMPDRt1+o++hRpeF8tNkJorU6LJTOTFSW69s5nAuRZRE85NhbAz9+N2eucRF+9SQsbIXS10oJzQzlNbCtveba1FMUN2cT6AX1FawkhFOMG4yTaGLc41t2oSVGH0EdNoiZ7WSm7v4Hrbt/zAMw3mF+ijfmG+ebmUi8G5pu3+i7jGgfWE6wlWEt6KSHub7CWbHMtaTTo0uN2sWQWSyY8WNp7bHPLPnIbn/X2WIdzPpcq3OL28OYXLXav56+9TSFYOWQ7vJacKHD3gPtqcdkPHnXOsWQe2BPC9n7diAsg4L7Zc53PdiCJbIew/aiqyDaz0Pm2TeaBPSFshNDlp+19E15OBwzn//nXxJz9caNzrANJZDucjVXtWn3zFEKF5s4iAz43hddVwZZjBXuC4pbab+jhACTU7hq3hPLAx0Y2OBrJsTFuyYkVfFKMGxyN5Nhpjttfjw6K5xMZ47MAAAAASUVORK5CYII=">
            <span class="company-name">{{ demandForm.memberOrg }}</span>
            <img style="width: 18px;height: 18px;"
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAsCAIAAACYDW0sAAACo0lEQVRYCe2X/WsTMRjH94+d74g/qcOJcJtvFWWuq4pMcFTniqhI68oq+DJbpgW1IAXZ8GUgc1XHuGG1Y4pYYRURUXH7aZDL5S4IXgi53F3uLu3YD7b0h9wlTz7P832SJ7kOsE6/jnXigjY4jPI/funvP+pv3sL5Bfj1ux7GxD0mgtRaDabvoF3HLUXF7H/LAZwcMadeQ/fsgjfBYK0GMwW09yTPY9l2e8cRfGE0rAe+YK0Gc0XUPRDMc3uws9e6dAO9mBVpwIO/NPRbD1FsUIbn9qArYaXz6NW8hwc8+MxV023f5JvdfZY72Ty4P9V6sKLiNhi4SmZbameR8lve8ZRpLx+tBj3HrMni2nYI1xukYm/e76im1Ik1AU9OG/a8Jy76bsXWg68VkD1p4ZFB43M3JMH9KXOshMZKKDniiOnYeZLa6qJ3aqkHkuA9CVLz/iwDeixu7MFL30hqO+MBtV0SrKh4+DqR9OUcCe5ZhZT+ZNYhA42SbciDFRWXn5NFlLuHsuPEj/sTotRSdlNgRcWflxwXnYVPOp1a3GgWHBt0HHCHQx/bzYIVFWfyROR0HomjZHtbAFZU/HQGPpkJ2D8stX0e/9Odv/pUNLg95l3oOfXCPw6NkgLHZpoHAwDqDb1vOLgmhAQXH5Pdz1KB+wZCu7PjERatpxP7Tllz7zwutjbCI2LKnpw2th6UlD2ZNX/+dlQbOm0wGADwoa73DkWW/W7ZW16WLYrYHre6CjKFsLJ3JayK5itvNLA9ujxlbPK51tAEn82Y4b9agyOmblYX4dFzvufu7RIppXS8uBEBDABYXgGXb/Kyd8atqB/Hou0k8PfBhLGhm6z201dM7qwUGLJd0SKmlrNV2DNg5YrR5KXmkhGz9tJtyYiledTw/wP/Bd4mAhewUaDlAAAAAElFTkSuQmCC">
          </div>

          <div class="meta-info">
            <div class="meta-item">
              <el-icon :size="16" color="#909399">
                <Clock />
              </el-icon>
              <span>发布时间:</span>
              <span class="publish-date">{{ demandForm.createdAt.replace('T', ' ') }}</span>
            </div>
            <div class="meta-item">
              <img style="width: 16px;height: 16px;"
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAsCAIAAAB+JKZoAAAFaklEQVRYCc1X6VM6ORD9/f/fMjCgUhSL9+A93FIiooX3BV6Iigco4OiUCsgxobZqs7Y9mUPwy24+ddL9Xl7SOf/0ej36X5der/fn1zqazaaqqtVq9eHhoVKpqKrabDZ/N6KBdXQ6nUKhEIlEXC4XMSuiKIbD4cvLy06n07+mAXTU6/XV1VWr7o2SRFFcWVl5f3/vR01fOhqNRjqdFkXR2NmPLU6nc21trdFo2Kv5WUelUhkeHjb2J4ri3NxcJBJJJpOZTCaZTEYikfn5eVO5Q0NDj4+PNlJ+0FEsFo2JCIVC9um/uroKh8OcdFEUb25urKTY6Tg9PeW4ZFlWFMWKi2t/fX0NBoMcw8nJCRfGqpY6isUiphgeHr6/vzelsG8slUoejwdTXV9fGyHmOl5eXtxuN4AlSepz2Rs7oJTW63VJkoDN5XI9Pz9zkSY6ms2mz+cD2MLCAof5XRXnyOfz1et1zGOiY3l5GUT4/f5Wq4UBlNJms2k/PR8fH8aDtd1uj42NAXMsFsO0vA5FUQRBYNFDQ0OqquJoSunl5aXD4RAEIZVKcS5W3djYEATB4XCcn59zAW9vbyMjI4xcEAS85HkdeL+Zru1AIABjWllZ4XpaW1sD7/T0NOellJ6fn0OALMsQoNPRaDQgyOfzaZoGcWDs7+9DDCEES0mlUti1vb0NKDA0TcPZgfzqdORyOSAyzirj6na7oVAIwgghLEHr6+u4cXFx0eqey+fzEHl8fMxodTqWlpZYhMvl6na7MAjO6Ha7kUgEuAghU1NTuBoKhWzgmqbBGQ2b8VtHu912Op2MbnFxkevbWMXbCouIRqOmCcUMsiwziNPpbLfblNJvHU9PT0C3t7eHYdiuVqszMzN//VPwWcewbrebuQKBgM3FdnBwwOIJIaVSSafj6uoKfDYXEgwFgq2M+fl5PABs397eAqpQKOh04EVaLpcxDNt4YwOXqbG0tISB2MZzz5bqd152dnaADp8wGE8pVVU1GAxKX2V0dBRQfr//q1myv5lVVQXU1taWbj5wzp6enrjurarX19fAaLXVjdharQao3d1dnY6LiwvwmV7NQFcoFLJfZXV1FVCJROKrOZvP5yHeaOD1cXp6qtNxf38PjLlczghmLZlMBsLsjXQ6bUVydnYG2GKxqNOhKAr4ksmkFcXMzAyE2RtTU1NWJPgGqNVqOh2apsF54PV6rSiOjo7suwevzSEE7xtRFNnx/71fKKWxWAxYjE8mUPb8/PzwVXZ3dwGyubn51fzARgkQbLy8vAAkHA4zl04HvoHwRYpZOPsX+wUn5eLiwkRHp9Pxer1MrCAIxkcQJ4JSOqgOVVUdDgfrwuPxwJ2smw9KaTabhUkLhULGjrmWQXVEo1HgPzo6AjZeh6ZpsIgIIWxzQ7TRwCf0jx8LnHev1wuTodsv0Afe3IIg3N7egsvUyGazsiwfHh6aeqGxVCpBRggh2WwWXOY6KKX4UnW5XOyowbBB7bu7OzgUCCHw/AEePi/M0Wq1xsfHIZGCIOzv7wNmUOPg4AD+AIQQv9//+fnJkZjroJS+vb1x3/xAIFCtVjm8fbVWq83OzsJ4CCFut9t0G1rqoJQqioLXLKMLh8M2rwKQpSgK3hoM6/V6rc43Ox2U0kajgT8sMLLx8fHNzc1yuYx/e61Wq1wub21tTUxMQCQYkiRxf0kQbblOcQSlNJFIAJ3R8Hg8kiRxn3ouLB6Pc5xc9Yf5gOhisch9DrierKqTk5M2r13g71cHA+Tz+WAwiHegVfdut1uW5f5faIPpAPmlUmlnZyeVSsXjcVmW5+bmZFmOx+OpVGp7e5t9BSC4H+OXOvqhHijmXx29/0H5G08e9dBygH9sAAAAAElFTkSuQmCC">
              <span>预算金额: </span>
              <span class="budget-amount"> ¥{{ demandForm.price }}</span>
            </div>
          </div>
        </el-card>
        <el-card class="detail-card" :body-style="{ padding: '20px' }">
          <div class="demand-content-wrapper">
            <h2 class="section-title">需求详情</h2>
            <div class="rich-text-content" v-html="demandForm.detail"></div>
          </div>
        </el-card>
      </template>
      <template v-else>
        <el-card v-if="isLoading === false" class="detail-card" :body-style="{ padding: '20px' }">
          <div class="empty">
            <img style="width: 350px;height: 350px;" src="@/assets/img/workbench/tradeArea/demand_banned.png"
              alt="需求已下架" />
            <span>需求已下架</span>
          </div>
        </el-card>
      </template>
    </div>
  </div>
</template>

<script setup>
import { Clock } from '@element-plus/icons-vue';
import Header from '../_components/header.vue'
import { getDemandDetail } from '@/api/api'

const route = useRoute()

const demandForm = reactive({
  name: '',
  price: '',
  detail: '',
  createdAt: '',
  memberOrg: '',
  status: ''
})

const isLoading = ref(true)
onMounted(async () => {
  await nextTick(() => {})
  getDemandDetail({ id: route.params.id }).then(res => {
    isLoading.value = false
    demandForm.name = res.result.name
    demandForm.price = res.result.price
    demandForm.detail = res.result.detail
    demandForm.createdAt = res.result.createdAt
    demandForm.memberOrg = res.result.memberOrg
    demandForm.status = res.result.status
  })
})
</script>

<style scoped>
.demand-detail-page {
  padding: 20px 30px;
  background-color: #f7f8f9;
  min-height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.detail-card {
  width: 900px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: none;
  box-shadow: none;
  background-color: #fff;
}

.demand-title {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-top: 0;
  margin-bottom: 20px;
}

.company-info {
  display: inline-flex;
  padding: 5px 10px;
  background-color: #f7f7f7;
  border-radius: 8px;
  align-items: center;
  margin-bottom: 35px;
  color: #606266;
  font-size: 14px;
}

.company-name {
  margin-left: 5px;
  margin-right: 5px;
}

.verified-icon {
  vertical-align: middle;
}

.meta-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-size: 14px;
  color: #606266;
}

.meta-item {
  display: flex;
  align-items: center;
}

.meta-item span {
  margin-left: 5px;
}

.publish-date {
  font-size: 16px;
  color: #000;
}

.budget-amount {
  font-size: 28px;
  transform: translateY(-3px);
  color: #ff6600;
  font-weight: bold;
}

.el-divider {
  margin: 20px 0;
}

.demand-content-wrapper {}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin-top: 0;
  margin-bottom: 15px;
}

.rich-text-content {
  font-size: 14px;
  line-height: 1.8;
  color: #303133;
}

.rich-text-content p {
  margin-bottom: 1em;
}

.rich-text-content h3 {
  font-size: 16px;
  font-weight: bold;
  margin-top: 1.5em;
  margin-bottom: 0.8em;
  color: #303133;
}

.rich-text-content ul,
.rich-text-content ol {
  margin-left: 20px;
  margin-bottom: 1em;
  padding-left: 0;
}

.rich-text-content li {
  margin-bottom: 0.5em;
  list-style-type: disc;
}

.rich-text-content ol li {
  list-style-type: decimal;
}

.rich-text-content ul li::marker {
  color: #6690F3;
}

.empty {
  min-height: calc(100dvh - 150px);
  padding-bottom: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #101010;
  font-size: 18px;
  font-weight: bold;
}
</style>