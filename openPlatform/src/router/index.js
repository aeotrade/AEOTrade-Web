import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);
import Layout from '@/layout/index';


export const constantRoutes = [
  {
    'path': '/',
    redirect: '/connector',
    meta: {}
  },
  {
    'path': '/config',
    redirect: '/config/basic',
    component: () => import('@/views/config/index'),
    children: [
      {
        path: 'basic',
        component: () => import('@/views/config/menus/basic'),
        name: 'basic',
        meta: {title: '基础信息',actRoute:'/config/basic'}
      },
      {
        path: 'account',
        component: () => import('@/views/config/menus/account.vue'),
        name: 'account',
        meta: {title: '账号配置',actRoute:'/config/account'}
      },
      {
        path: 'event',
        component: () => import('@/views/config/menus/event/index.vue'),
        name: 'event',
        meta: {title: '触发事件',actRoute:'/config/event'}
      },
      {
        path: 'eventDetails',
        component: () => import('@/views/config/menus/event/eventDetails.vue'),
        name: 'eventDetails',
        meta: {title: '触发事件',actRoute:'/config/event'}
      },
      {
        path: 'movement',
        component: () => import('@/views/config/menus/movement/index.vue'),
        name: 'movement',
        meta: {title: '执行动作',actRoute:'/config/movement'}
      },
      {
        path: 'movementDetails',
        component: () => import('@/views/config/menus/movement/movementDetails.vue'),
        name: 'movement',
        meta: {title: '执行动作',actRoute:'/config/movement'}
      },
      {
        path: 'version',
        component: () => import('@/views/config/menus/version.vue'),
        name: 'version',
        meta: {title: '版本发布',actRoute:'/config/version'}
      }
    ]
  },
  {
    path: '/appManage',
    component: Layout,
    type: 'skyDrive',
    redirect: '/appManage/index',
    meta: {typeId: 0 },
    children: [
      {
        path: 'index',
        component: () => import('@/views/appManage/index'),
        name: 'appManageIndex',
        meta: {title: '应用管理', requireAuth: true, type: 'skyDrive', affix: true, icon: 'upDate',typeId: 0, hidden: 0}
      },
      {
        path: 'edit',
        component: () => import('@/views/appManage/edit'),
        name: 'appManageEdit',
        meta: {title: '应用编辑', requireAuth: true, type: 'skyDrive', affix: true, icon: 'upDate',typeId: 0, hidden: 1}
      },
      {
        path: 'create',
        component: () => import('@/views/appManage/creatApp'),
        name: 'appManageCreate',
        meta: {title: '应用发布', requireAuth: true, type: 'skyDrive', affix: true, icon: 'upDate',typeId: 0, hidden: 1}
      }
    ]
  },
  {
    path: '/connector',
    component: Layout,
    type: 'skyDrive',
    redirect: '/connector/index',
    name: 'docSearch',
    meta: {typeId: 1, title: '二级标题'},
    children: [
      {
        path: 'index',
        component: () => import('@/views/connector/index'),
        name: 'dashboardIndex22',
        meta: {title: '实时概况2', requireAuth: true, type: 'skyDrive', affix: true, icon: 'upDate',typeId: 1, hidden: 0}
      }
    ]
  }

];


const createRouter = () => new Router({
base: window.__POWERED_BY_QIANKUN__ ? '/microapp/openPlatform/' : '',
'mode': 'history',
'scrollBehavior': () => ({'y': 0}),
'routes': constantRoutes
});

const router = createRouter();

export function resetRouter() {
const newRouter = createRouter();

router.matcher = newRouter.matcher; // reset router
}

export default router;
