import Cookies from 'js-cookie';

const state = {
  'sidebar': {
    'opened': true,
    'withoutAnimation': false
  },
  'device': 'desktop',
  'btnDisable':false,
  'collectList': [],
  'modules': [],
  sidebarHidden:false,
  themeConfig: {}
};

const mutations = {
  'ADD_MODULES': (state, value) => {
    state.modules = value
  },
  'TOGGLE_SIDEBAR': state => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1);
    } else {
      Cookies.set('sidebarStatus', 0);
    }
  },
  CLOSE_BTN(state){
    state.btnDisable=true;
  },
  'OPEN_BTN':state=>{
    state.btnDisable=false;
  },
  'CLOSE_SIDEBAR': (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0);
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  'TOGGLE_DEVICE': (state, device) => {
    state.device = device;
  },
  'UPDATE_COLLECT_LIST': (state, list) => {
    state.collectList = list
  }
};

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR');
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation);
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device);
  }
};

export default {
  'namespaced': true,
  state,
  mutations,
  actions
};
