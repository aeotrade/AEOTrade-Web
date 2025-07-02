import {constantRoutes } from '@/router';

function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role));
  }
  return true;
}

export function filterAsyncRoutes(routes, roles) {
  const res = [];

  routes.forEach(route => {
    const tmp = { ...route };

    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });

  return res;
}

const state = {
  'routes': [],
  'addRoutes': [],
  moduleRoutes:[
    {icon:'gaikuang',title:'概况',typeId:'0'},
    {icon:'record',title:'档案',typeId:'1'},
    {icon:'moduleDisk',title:'采集',typeId:'2'},
    {icon:'share',title:'分享',typeId:'3'},
    {icon:'physicalexam',title:'体检',typeId:'4'},
    {icon:'blockChain',title:'区块链',typeId:'5'}
  ]
};

const mutations = {
  'SET_ROUTES': (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  }
};

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes;

      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || [];
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);
      }
      commit('SET_ROUTES', accessedRoutes);
      resolve(accessedRoutes);
    });
  }
};

export default {
  'namespaced': true,
  state,
  mutations,
  actions
};
