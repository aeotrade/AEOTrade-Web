import api from '@/api'
const state = {
  'superVisionOption': null
};

const mutations = {
  'UPDATE_SUPERVISION_OPTION': (state, list) => {
    state.superVisionOption = list
  }
};

const actions = {
  async getSuperVisionOption({ commit }) {
    const res = await api('/atcl/query/type/trade/search', 'get')
    let data = []
    if(res.result){
      Object.keys(res.result).map(key => {
        data.push({'label': key + ' ' + res.result[key], 'value': key})
      })
    }
    commit('UPDATE_SUPERVISION_OPTION', data);
  }
};

export default {
  'namespaced': true,
  state,
  mutations,
  actions
};
