//  全局注册element 图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/locale/zh-cn.mjs'
export default defineNuxtPlugin(async (NuxtApp) => {
    // nuxtApp包含的属性可看文档 https://nuxt.com/docs/guide/going-further/internals

    // 全局组件引入
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        NuxtApp.vueApp.component(key, component)
    }
})


