//引入路由对象
import { createRouter, createWebHistory, createWebHashHistory, RouterView } from 'vue-router'

//vue2 mode history vue3 createWebHistory
//vue2 mode  hash  vue3  createWebHashHistory
//vue2 mode abstact vue3  createMemoryHistory

//路由数组的类型 RouteRecordRaw
// 定义一些路由
// 每个路由都需要映射到一个组件。
const routes = [
    {
        path: '/',
        redirect: () => ({ name: 'userInfo' }),
    },
    {
        path: '/index',
        name: 'index',
        meta: {
            title: '工作台',
            role: [0, 1],
            needLogin: true,
            menusFlag: true,
        },
        redirect: () => ({ name: 'userInfo' }),
        component: () => import('@/views/index/index.vue'),
        children: [
            {
                path: 'userInfo',
                name: 'userInfo',
                meta: {
                    title: '用户信息',
                    role: [0, 1],
                },
                component: () => import('@/views/index/user/userInfo.vue'),
            },
            {
                path: 'partner',
                name: 'partner',
                meta: {
                    title: '合伙人管理',
                    role: [0],
                },
                component: () => import('@/views/index/partner/partner.vue'),
            },
            {
                path: 'ditui',
                name: 'ditui',
                meta: {
                    title: '地推人员管理',
                    role: [1],
                },
                component: () => import('@/views/index/ditui/ditui.vue'),
            },
            {
                path: 'material',
                name: 'material',
                meta: {
                    title: '物料管理',
                    role: [0],
                },
                component: () => import('@/views/index/material/material.vue'),
            },
            {
                path: 'material2',
                name: 'material2',
                meta: {
                    title: '物料申请管理',
                    role: [1],
                },
                component: () => import('@/views/index/material/material2.vue'),
            },
            {
                path: 'resetPwd',
                name: 'resetPwd',
                meta: {
                    title: '重置密码',
                    role: [0, 1],
                },
                component: () => import('@/views/index/resetPwd/resetPwd.vue'),
            },
        ]
    },
    {
        path: '/data',
        name: 'data',
        meta: {
            title: '数据统计',
            role: [0, 1],
            needLogin: true,
            menusFlag: true,
        },
        component: () => import('@/views/index/index.vue'),
        children: [
            {
                path: 'dev_detail',
                name: 'dev_detail',
                meta: {
                    title: '推广详情',
                    role: [1],
                },
                component: () => import('@/views/index/data/dev_detail.vue'),
            },
            {
                path: 'dev_admin/:type',
                name: 'dev_admin_cft',
                meta: {
                    title: '财富通发展管理',
                    role: [0],
                }, 
                params: {
                    type: 'cft',
                },
                component: () => import('@/views/index/data/dev_admin.vue'),
            }, 
            {
                path: 'dev_admin/:type',
                name: 'dev_admin_red',
                meta: {
                    title: '红娘发展管理',
                    role: [0],
                }, 
                params: {
                    type: 'red',
                },
                component: () => import('@/views/index/data/dev_admin.vue'),
            }, 
        ]
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录',
            role: [1, 2, 3],
        },
        component: () => import('@/views/login/login.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('@/views/error/404.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

//导出router
export default router
