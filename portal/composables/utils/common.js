import { v4 as uuidv4 } from "uuid";
import {
  apiGetClientCookie,
  apiGetUserInfo,
  apiGetWorkbenchLast,
  apiGetWorkbenchList,
  apiSetClientCookie
} from "~/api/api";
import theme from '@/assets/themeconfig'
//客户端存储缓存
export const saveCookie = async () => {
  setTimeout(() => {
      console.log(document.cookie);
      let res = {};
      document.cookie.split(";").forEach((item) => {
        res[item.split("=")[0].trim()] = item.split("=")[1];
      });
       apiSetClientCookie(res);
  }, 200);
};

// 登录
export const loginCommon = async (res, to) => {
  const colorMode = useColorMode();
  colorMode.preference = theme.themeModel;
  colorMode.value = theme.themeModel;
  const router = useRouter();
  if (res.result) {
    let expires_in = res.result.expires_in;
    let loginTime = Math.round(new Date() / 1000);
    localStorage.setItem("accessToken", res.result.access_token);
    cookies.setItem("token", res.result.jti);
    cookies.setItem("hashtime", loginTime + expires_in);
    cookies.setItem("staffId", res.result.bind.staffid);
    cookies.setItem("staffName", res.result.bind.staffname || '');
    cookies.setItem("UC", res.result.bind.uscc);
    const { user } = useUser();
    const params = {
      staffId: res.result?.bind?.staffid,
      memberId: res.result?.bind?.memberid,
      type: 1
    };
    if(res.result?.bind?.kindid < 88) params.type = 2;
    apiGetUserInfo(params).then(res => user.value = res.result);
    user.value = res.result;
    let clientType = cookies.getItem("clientType");
    let bindData = res.result.bind;
    let uuid
    if (res.result.bind.kindid == 88) {
      router.replace("/");
    } else if (!res.result.bind.stasfTel) {
      router.push("/registry");
    } else {
      if (!bindData.lastMemberId) {
        cookies.setItem("memberId", bindData.memberid);
        cookies.setItem("kindId", 99);
      } else {
        cookies.setItem("memberId", bindData.lastMemberId);
        cookies.setItem("memberName", bindData.membername);
        cookies.setItem("kindId", bindData.lastKindId);
        cookies.setItem("WORKBENCHN", bindData.workbenchName);
        cookies.setItem("DefaultWORKBENCHNID", bindData.lastWorkbenchId);
        cookies.setItem("WORKBENCHNID", bindData.lastWorkbenchId);
        cookies.setItem("channelColumnsId", bindData.channelColumnsId);

      }
      if (to) {
        if(to.startsWith('http')){
          location.href = to;
          return
        }
        router.replace(to);
      } else {
        cookies.removeItem("wbin");
        router.replace("/workbench");
      }
    }
  }
};

// 退出登录
export const loginOutCommon = () => {
  delCookie();
};
//删除cookies，服务端无效
export const delCookie = () => {
  const router = useRouter();
  let clientType = cookies.getItem("clientType");
  if (process.client) {
    sessionStorage.removeItem("isLogin");
    sessionStorage.removeItem("WORKBENCHINDEX");
    let keys = document.cookie.match(/[^ =;]+(?==)/g);
    if (keys) {
      for (let i = keys.length; i--; ) {
        if(keys[i] !== 'clientType' &&  keys[i] !== 'uuid'){
          document.cookie =
          keys[i] + "=0;path=/;expires=" + new Date(0).toUTCString(); // 清除当前域名下的,例如：m.ratingdog.cn
        document.cookie =
          keys[i] +
          "=0;path=/;domain=" +
          document.domain +
          ";expires=" +
          new Date(0).toUTCString(); // 清除当前域名下的，例如 .m.ratingdog.cn
        document.cookie =
          keys[i] +
          `=0;path=/;domain=${theme.cookieDomain};expires=` +
          new Date(0).toUTCString(); // 清除一级域名下的或指定的，例如 .ratingdog.cn
        }
      }
    }
  }
  cookies.removeItem("token");
  cookies.removeItem("memberId");
  cookies.removeItem("kindId");
  cookies.removeItem("WORKBENCHN");
  cookies.removeItem("DefaultWORKBENCHNID");
  cookies.removeItem("WORKBENCHNID");
  cookies.removeItem("channelColumnsId");
  cookies.removeItem("staffId");
  useIsLogin().value.isLogin = false;
  location.replace('/login')
};

// 跳转工作台

export const jumpToWorkbench = () => {
  const router = useRouter();
  const { user } = useUser();
  let loginMessage = user.value.bind;
  if (!loginMessage.stasfTel) {
    // 绑定手机号
    console.log((window.location.href = "/registry"));
    return false;
  }
  let userAgent = navigator.userAgent; //取得浏览器的userAgent字符串

  let isIE =
    userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器

  let isIE11 =
    userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1;

  if (isIE || isIE11) {
    alert(
      "您的浏览器版本过低，会导致部分功能缺失，请换个浏览器重试！",
      "提示",
      {
        confirmButtonText: "确定",
      }
    );
    return false;
  }
  if (loginMessage) {
    if (loginMessage.kindid === "88") {
      window.open(import.meta.env.MACRO_ADMIN);
      return false;
    }
  }
  router.push("/workbench");
};

import {Base64} from 'js-base64';
import {cookies, useMemberCenter} from "~/composables";
function generateLog(currentMenu, user) {
  let staffname = '', membername = '', pagename = '', belongsystem = '', pagemenuid = '';
  if(user.value){
    console.log('userrr', user.value)
    staffname = user.value.user.staffname
    membername = user.value.bind.membername
  }
  pagename = currentMenu?.meta.title
  belongsystem = currentMenu?.webSys
  pagemenuid = currentMenu?.id
  let str = `${staffname},${membername},${pagename},${belongsystem},${pagemenuid}`

  return Base64.encode(str)
}

// 接口请求日志信息
export const useApiLogInfo = () => {
  try{
    const route = useRoute()
    const {user} = useUser()
    if(route.path.includes('memberCenter')){
      const {menu} = useMemberCenter()
      let subMenu = menu.value.map(menu => menu.children).flat()
      let currentMenu = subMenu.filter(subMenu => subMenu.name === route.name)[0]
      if(currentMenu) return generateLog(currentMenu, user)
    }
    if(route.path.includes('workbench')){
      const {workbenchMenu} = useWorkbenchMenu()
      let currentMenu = workbenchMenu.value.filter(menu => menu.path?.includes(route.path))[0]
      if(currentMenu) return generateLog(currentMenu, user)
    }
  }catch (e) {
    console.log('e', e)
    return ''
  }
}



// 切换企业
export async function switchRoles(type, item) {
  let relaunchAppFlag = false;
  if (type === 'firm' && cookies.getItem('clientType') === 'client') {
    let nowParams = {
      staffId: cookies.getItem('staffId'),
      memberId: cookies.getItem('memberId'),
      type: 2
    }
    let newParams = {
      staffId: cookies.getItem('staffId'),
      memberId: item.id.toString(),
      type: 2
    };

    const [nowCompany, newCompany] = await Promise.all([apiGetUserInfo(nowParams), apiGetUserInfo(newParams)])
    if (nowCompany.result.user.isTest !== newCompany.result.user.isTest) {
      relaunchAppFlag = await this.$confirm('检测到新老版连接器切换，切换企业需要重启客户端，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(e => {
        relaunchAppFlag = false;
      });
      if (!relaunchAppFlag) return;
    }
  }

  cookies.removeItem('WORKBENCHNID');
  let params = {
    staffId: cookies.getItem('staffId'),
    memberId: '',
    type: ''
  };
  if (type == 'person') {
    window.dispatchEvent(new Event('app:logout'))
    params.type = 1;
    await insertLast({
      memberId: '',
      workBenchId: '1',
      staffId: cookies.getItem('staffId')
    });
  } else {
    params.memberId = item.id.toString();
    params.type = 2;
  }
  apiGetUserInfo(params).then(async res => {
    // 设置工作台id
    if(type === 'person'){
      cookies.setItem('WORKBENCHNID', '1')
    }
    if(type === 'firm'){
      let params={
        apply: 1,
        id: item.id.toString()
      }
      let res= await apiGetWorkbenchList(params)
      let list=res.result
      let currentWorkbench = list[0]

      cookies.setItem('WORKBENCHNID', currentWorkbench?.workbenchId)
      cookies.setItem('WORKBENCHN', currentWorkbench?.workbenchName)
      let data={
        memberId: item.id.toString(),
        workBenchId:currentWorkbench?.workbenchId,
        staffId:cookies.getItem('staffId')
      }
      apiGetWorkbenchLast(data)
    }

    cookies.setItem('kindId', res.result['bind'].kindid);
    sessionStorage.setItem("isLogin",null)
    nextTick(async function () {
      if (type == 'firm') {
        cookies.setItem('memberId', item.id);
        cookies.setItem('memberName', item.memberName);
        sessionStorage.setItem('WORKBENCHINDEX', 1);
      }
      cookies.removeItem('wbin');
      cookies.setItem('jump', 1);
      setTimeout(() => {
        window.location.href = '/workbench'
      }, 200);

    });

  });
}


//获取当前域名及协议
export async function getClientDomain(type) {
  if (process.client) {
    let hostname=window.location.hostname
    let protocol=window.location.protocol
    // 客户端获取域名和协议
    if(type==='protocol'){
      return protocol + "//" + hostname;
    }
    return hostname;
  }
};
