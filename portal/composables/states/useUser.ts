import {useState} from "nuxt/app";


// 用户信息
export const useUser = () => {
    const user = useState("user", () => null)
    return {
        user
    }
}
export const useErrors = () =>{
    const errorMsg= useState("error",() => null)
    return {
        errorMsg
    }
}
// 工作台菜单
export const useWorkbenchMenu = () => {
    const workbenchMenu = useState('workbenchMenu', () => [])
    return {
        workbenchMenu
    }
}
// 工作台列表
export const useWorkbench = () => {
    const workbench = useState('workbench', () => [])
    return {
        workbench
    }
}
// 会员中心菜单和ID
export const useMemberCenter = () => {
    const id = useState('id', () => null);
    const menu = useState('menu', () => []);
    return {
        id,
        menu
    }
}
// 会员中心个人菜单
export const usePersonalRoutes = () => {
    const menuPersonal = useState('menuPersonal', () => [
        {
            path: '/staffSetting',
            type: 'memberCenter',
            redirect: '/staffSetting/index',
            meta: {title: '个人信息', icon: '个人信息'},
            children: [
                {
                    path: 'index',
                    name: 'memberCenter-staffSetting',
                    meta: {title: '个人信息', requireAuth: true, type: 'memberCenter', affix: true, icon: 'sy-user'}
                }, {
                    path: 'loginInfo',
                    name: 'memberCenter-staffSetting-loginInfo',
                    meta: {title: '登录设置', requireAuth: true, type: 'memberCenter', affix: true, icon: 'sy-set'}
                }
                , {
                    path: 'certificate',
                    name: 'memberCenter-staffSetting-certificate',
                    meta: {title: '证书管理', requireAuth: true, type: 'memberCenter', affix: true, icon: 'node'}
                }
            ]
        }],);
    return {
        menuPersonal
    }
}
// 路由配置信息
export const  useRoutesMeta = () => {
    const meta = useState('meta', () => null);
    return {
        meta
    }
}


// 获取用户注册信息
export const useAuthor = () => {
    const author = useState('Author', () => '')
    return {
        author
    }
}
export const useMsgCenter = () => {
    const msgCenter = useState('msgCenter', () => false)
    return {
        msgCenter
    }
}
export const useHasMsg = () => {
    const useHasMsg = useState('useHasMsg', () => 0)
    return {
        useHasMsg
    }
}
