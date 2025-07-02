import { resetRouter } from '@/router';
import api from '@/api'
import tokenBox from '@/utils/auth.js';
const state = {
  name: '',
  toname:'',
  'avatar': '',
  memberId:null,
  staffId:'',
  managerList:[],
  isAuthor:'',
  openAi:'',
  onlyStatus:'',
  hpkChecked:'',
  dataAnalysisLicenseCheckList:[],
  remitPerson:'慧泽商通',
  uscc:null,
  info:null,
  isDown:false,
  addRoutesStatus:false,
  wkId:null,
  connectorInfo:{}
};

const mutations = {
  'SET_TOKEN': (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  'SET_AVATAR': (state, avatar) => {
    state.avatar = avatar;
  },
  set_memberId(state,value){
    state.memberId = value;
  },
  set_toname(state,value){
    state.toname=value;
  },
  set_staffId(state,value){
    state.staffId=value;
  },
  set_uscc(state,value){
    state.uscc=value;
    localStorage.setItem('disk_uscc', value)
  }
};

const actions = {
  logout({ commit }) {
    commit('SET_TOKEN', '');
    resetRouter();
  },

  getInfo ({commit},params){
    return new Promise((resolve,reject) => {
      if(!params.memberId ||!params.staffId ){
        window.dispatchEvent(new Event('app:logout'))
        setTimeout(() => {
          let clientType = tokenBox.getItem('clientType')
          let keys = document.cookie.match(/[^ =;]+(?==)/g)
          if (keys) {
            for (var i = keys.length; i--;) {
              document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString() // 清除当前域名下的,例如：m.ratingdog.cn
              document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString() // 清除当前域名下的，例如 .m.ratingdog.cn
              document.cookie = keys[i] + '=0;path=/;domain=aeotrade.com;expires=' + new Date(0).toUTCString() // 清除一级域名下的或指定的，例如 .ratingdog.cn
            }
          }

        }, 150)
        // reject()
        return
      }

      api.app.getUserInfo(params).then((res)=>{
        resolve(res.result)
      }).catch(error=>{
        window.dispatchEvent(new Event('app:logout'))
        setTimeout(() => {
          this.delCookie()
          window.location.href = this.$portalHost;
        }, 150)
      })
    })
  }
};

export default {
  'namespaced': true,
  state,
  mutations,
  actions
};
