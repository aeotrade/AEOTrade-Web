import formCreate from '@form-create/element-ui';
import ElementPlus from 'element-plus'
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(ElementPlus)
    nuxtApp.vueApp.use(formCreate)
})


