import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: '登录 - Java开发平台 '
    },
    component: () => import('@/views/login.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@/views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        { path: 'home', title: { i18n: 'home' }, name: 'home_index', component: () => import('@/views/home/home.vue') }

    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
// export const appRouter = [
//     {
//         path: '/form',
//         icon: 'ios-gear',
//         name: 'sys',
//         title: '系统管理',
//         component: Main,
//         children: [
//             { path: 'user-manage', title: '用户管理', name: 'user-manage', icon: 'android-person', component: () => import('@/views/sys/user-manage/userManage') },
//             { path: 'role-manage', title: '角色管理', name: 'role-manage', icon: 'android-contacts', component: () => import('@/views/sys/role-manage/roleManage.vue') },
//             { path: 'menu-manage', title: '菜单管理', name: 'menu-manage', icon: 'navicon-round', component: () => import('@/views/sys/menu-manage/menuManage.vue') },
//             { path: 'log-manage', title: '日志管理', name: 'log-manage', icon: 'android-list', component: () => import('@/views/sys/log-manage/logManage.vue') }
//         ]
//     }
// ];

export const appRouter = [];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403
];
