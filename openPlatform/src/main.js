import Vue from 'vue';
import 'normalize.css/normalize.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/zh-CN';
import '@/styles/index.scss';
import App from './App';
import store from './store';
import router from './router';
import '@/icons';
import '@/permission';
import '@/assets/iconfont/iconfont.css';
import infiniteScroll from 'vue-infinite-scroll';
import Hmbtn from './components/BtnHmtx/index.js';
import api from '@/api/index';
import tokenBox from '@/utils/auth.js';
import pagination from "@/components/pagination/index";
import card from "@/components/card/index";
import formCreate from '@form-create/element-ui'
import FcDesigner from '@form-create/designer'
import commitTitle from '@/components/searchTitle'
Vue.component('commentitle',commitTitle)
Vue.component('pagination',pagination)
Vue.component('card',card)
Vue.use(infiniteScroll)
Vue.use(Hmbtn);
Vue.use(formCreate)
Vue.use(FcDesigner)
// 引入 ECharts 主模块
let echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
require('echarts/lib/chart/line');
require('echarts/lib/component/legend');
require('echarts/lib/component/dataZoom');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
Vue.prototype.$echarts = echarts

Vue.use(ElementUI, { locale });
Vue.config.productionTip = false;
Vue.prototype.$tokenBox = tokenBox;
Vue.prototype.$portalHost =window.location.origin;
Vue.prototype.$api = api;
Vue.prototype.$vue = Vue;
Vue.prototype.$baseUrl = process.env.VUE_APP_BASE_API;
let instance = null;

function render(props = {}) {
  const { container } = props;
  try{
    store.state.app.themeConfig = {...props.themeConfig};
  }catch (e) {}
  instance = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app');
}
if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
export async function bootstrap() {}
export async function mount(props) {render(props);}

export async function unmount() {
  instance.$destroy();
  instance = null;
}
