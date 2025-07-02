import router from './router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import store from './store';
const whiteList = ['/login',''] ;
import tokenBox from '@/utils/auth.js';
import Layout from "@/layout/index";
import {getClientDomain} from "@/utils";
NProgress.configure({ 'showSpinner': false });


router.beforeEach(async(to, from, next) => {
  let info=store.state.user.info;

  if (to.fullPath==='/dashboard/index'){
    sessionStorage.removeItem('openPlatformModuleActiveIndex');
  }
  let memberId=tokenBox.getItem('memberId');


  if (whiteList.indexOf(to.path) !== -1) {
    next();
  }else {

    if(!memberId||memberId=='null'){

      if(window.__POWERED_BY_QIANKUN__){
        if(GetQueryValue('type')){
          window.location.href=getClientDomain('protocol')+'/singleWindow_login';
        }else {
          window.location.href=getClientDomain('protocol')+'/login';
        }
      }else {
        next('/login');
      }

    }else {
      if(!info){
        let params={
          memberId: tokenBox.getItem('memberId'),
          staffId:tokenBox.getItem('staffId'),
          type: 2
        }
        info = await store.dispatch('user/getInfo', params)
        store.state.user.info=info
        store.commit('user/set_memberId',info.bind.memberid);
        store.commit('user/SET_NAME',info.bind.membername);
        store.commit('user/set_staffId',info.bind.staffid);
        store.commit('user/set_uscc',info.bind.uscc);

      }else {

      }
      if(!store.state.user.addRoutesStatus){

        store.commit("app/ADD_MODULES", [
          {
            component: 'Layout',
            icon: '应用管理icon',
            typeId:  0,
            title: '应用管理'
          },
          {
            component: 'Layout',
            icon: '连接器管理icon',
            typeId:  1,
            title: '连接器管理'
          },
          {
            component: 'Layout',
            icon: '开发者文档icon',
            typeId:  2,
            title: '开发者文档'
          },
        ])


        store.state.user.addRoutesStatus = true;
        store.state.permission.addRoutes = router.options.routes
        next({ ...to, replace: true });
      }

      next();

    }
  }

});

// // 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  return asyncRouterMap.filter(route => {
    if(route.component){
      if (route.component === 'Layout') {

        route.component = Layout
      } else {
        route.component = loadView(route.component);
      }
    }
    if(route.hidden){
      route.meta.activeMenu = route.name
    }
    route.meta.webSys = route.webSys || ''
    route.meta.menuId = route.id || ''
    if (route.children != null && route.children && route.children.length) {
      if(typeof route.path =='string'&& route.path.substr(0, 1)!='/'){
        route.path='/'+route.path
      }
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
}
const loadView = (view) => { // 路由懒加载
  if(typeof view =='object' || typeof view =='function'){
    return view
  }
  if(view.substr(0, 1)=='/'){

    return () => Promise.resolve(require(`@/views${view}`).default)
  }
  return () => Promise.resolve(require(`@/views/${view}`).default)
}


router.afterEach(() => {

});
function  GetQueryValue(queryName) {
  var query = decodeURI(window.location.search.substring(1));
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == queryName) { return pair[1]; }
  }
  return null;
}
