import {
  cookies,
  useMemberCenter,
  useRoutesMeta,
  useUser,
  useAuthor,
  usePersonalRoutes,
} from "~/composables";
import {
  getAppId,
  getMemberMenu,
  getFirmStaffInfoApi,
} from "~/api/api";

import theme from '@/assets/themeconfig'
// 提取异步路由里面的配置信息，放到对象里面保存到store
function generateAsyncRouteMeta(menuArray) {
  let currentObj = {};
  menuArray.forEach((menu) => {
    if (menu.name) {
      currentObj[menu.name] = {
        title: menu.title,
        webSys: menu.webSys,
        menuId: menu.id,
      };
    }
    if (menu.children && menu.children.length) {
      Object.assign(currentObj, generateAsyncRouteMeta(menu.children));
    }
  });
  return currentObj;
}

//判断会员中心是否有权限
function memberPermission(arr) {
  let res = [];
  arr.forEach((item) => {
    res.push(item.name);
    if (item.children && item.children.length) {
      res.push(...memberPermission(item.children));
    }
  });
  return res;
}
export default defineNuxtRouteMiddleware(async (to, from) => {
  let token = cookies.getItem("token");
  const whiteList = commonStates().value.routerWhiteList;
  const Config = useAppConfig()
  if (to.path === "/") {
    return navigateTo(`/workbench`);
  }
  if (!token) {
      if (!token && !whiteList.includes(to.path)&& !to.path.includes("/blockChain") && !to.path.startsWith("/tradeArea/demand/") ) {
        return navigateTo(`/login?path=${to.fullPath}`);
      }
  }
  let kindId = cookies.getItem('kindId');
  if(!kindId && to.path === '/login'){
    cookies.setItem('token','');
  }
  if (to.path.indexOf("memberCenter") !== -1) {
    let { id, menu } = useMemberCenter();
    if (!menu.value.length) {
      let res = await getAppId({ id: 101 })

        id.value = res.result[0].id;
        let params = {
          id: cookies.getItem("staffId"),
          workbenchId: id,
          memberId: cookies.getItem("memberId"),
          type: 1,
        };
        let resMenu = await getMemberMenu(params)
          const { user } = useUser();
          let kindId = user.value.bind.kindid;
          let arr = resMenu.result.filter((item) => {
            if (item.hidden) {
              return false;
            }
            if (kindId == 99) {
              return (
                item.path != "/firmSetting" &&
                item.path != "/authenticationCenter" &&
                item.path != "/memberPackage"
              );
            } else {
              return (
                item.path != "/staffSetting" && item.path != "/memberPackage"
              );
            }
          });
          if (kindId == 99) {
            let { menuPersonal } = usePersonalRoutes();
            menu.value = [...menuPersonal.value];
          }
          menu.value.push(...arr);
          let { meta } = useRoutesMeta();
          meta.value = generateAsyncRouteMeta(menu.value);
          let whiteMenus = memberPermission(menu.value);
          if (whiteMenus.includes(to.name) || to.path.indexOf("connect") != -1 || to.path.indexOf("connectNew") != -1 || to.path.indexOf("/memberCenter/memberPackage/package") != -1) {

          } else {
            return navigateTo("/noAuthority", {replace: true});
          }
    }
  }

});
