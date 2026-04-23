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
        redirect: () => ({name: 'userInfo'}),
    },
    {
        path: '/index',
        name: 'index',
        meta: {
            role: [0, 1],
            needLogin: true
        },
        redirect: () => ({name: 'userInfo'}),
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
        ]
    }, 
    {
        path: '/reg',
        name: 'reg',
        meta: {
            title: '注册',  
            role: [1, 2, 3], 
        },
        component: () => import('@/views/reg/reg.vue'),
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
