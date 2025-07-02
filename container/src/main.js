import Vue from 'vue';
import App from './App.vue';
import fetch from 'isomorphic-fetch';
import tokenBox from '@/utils/auth.js';
import api from '@/api';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
Vue.config.productionTip = false
import { registerMicroApps, setDefaultMountApp, start ,initGlobalState ,addGlobalUncaughtErrorHandler  } from './es2.0';
let app = null;
Vue.prototype.$tokenBox = tokenBox;
let microHost=window.location.origin+'/workbench';
Vue.prototype.$microHost =microHost;
Vue.prototype.$portalHost =window.location.origin;
Vue.prototype.$api = api;

const actions = initGlobalState({
  change: false, // 初始化state
  workbenchListShow:false,
  appName:'',
  appNameEn: '',
  startUpdate:false,
  updateInfo:null
})
// 在项目中任何需要监听的地方进行监听，在这里监听是为了方便
actions.onGlobalStateChange((state,prev)=>{
})
Vue.prototype.$actions = actions

function render({ appContent, loading }) {
  if (!app) {
    app = new Vue({
      el: '#container',
      data() {
        return {
          content: appContent,
          loading
        };
      },
      render(h) {
        return h(App, {
          props: {
            content: this.content,
            loading: this.loading
          }
        });
      }
    });
  } else{
    app.content = appContent;
    app.loading = loading;
  }
}

function genActiveRule(routerPrefix) {
  return location => location.pathname.startsWith(routerPrefix);
}

render({ loading: true });
const request = url =>
  fetch(url, {
    referrerPolicy: 'origin-when-cross-origin'
  });

function getEntry(port,name) {
  if(process.env.NODE_ENV === 'development'){
    return `//${process.env.VUE_APP_BASE_SERVER_IP}:${port}`;
  }else {
    return `${name}`;
  }
}

// 获取子应用的主题相关配置
import themeConfig from './themeConfig.json'
const Config = themeConfig[process.env['VUE_APP_BASE_THEME_CONFIG']]

let config=[
  { name: 'openPlatform', entry:getEntry(7015,'/microapp/openPlatform')  , render, activeRule: genActiveRule('/microapp/openPlatform'),title:'慧贸贸开放平台', ...Config['openPlatform'] },
]

Vue.prototype.$configs = config
async function appAuthority() {
   initApp()
}
function initApp(){
  registerMicroApps(
      config,
      {
        beforeLoad: [async (app) => {
          actions.setGlobalState({appName:app.title, appNameEn: app.name})
        }],
        beforeMount: [app => {
          // tokenBox
        }],
        afterUnmount: [app => {

        }]
      },
      {
        fetch: request
      }
  );
  setDefaultMountApp('/openPlatform');
  start({ prefetch: false, fetch: request });
  addGlobalUncaughtErrorHandler((event) => {
  });
}
appAuthority()








