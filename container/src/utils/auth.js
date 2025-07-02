import Cookies from 'js-cookie';
let tokenBox={
  getItem:(TokenKey)=>{
    if(!Cookies.get(TokenKey)){
      return null;
    }
    return Cookies.get(TokenKey);
  },
  setItem:(TokenKey,token)=>{
    return  Cookies.set(TokenKey, token);
  },
  removeItem:(TokenKey)=>{
    return Cookies.remove(TokenKey);
  }
};
export default tokenBox;
