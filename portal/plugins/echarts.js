import * as echarts from 'echarts'
// 世界地图挂载
import world from '@/assets/utils/worldMap.js'
echarts.registerMap('world', world)


export default defineNuxtPlugin((nuxtApp) => {
    return {
        provide:{
            eChart: echarts
        }
    }
    // nuxtApp.vueApp.use(echarts)
})
