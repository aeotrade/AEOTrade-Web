import Cookies from 'js-cookie';
import store from '@/store'



let tokenBox={
  getItem:(TokenKey)=>{
    if (TokenKey=='info'){
      return JSON.stringify(store.state.user.info)
    }
    if(!Cookies.get(TokenKey)){
      return null;
    }
    return Cookies.get(TokenKey);
  },
  setItem:(TokenKey,token)=>{
    return Cookies.set(TokenKey, token);
  },
  removeItem:(TokenKey)=>{
    return Cookies.remove(TokenKey);
  }
};

export default tokenBox;
