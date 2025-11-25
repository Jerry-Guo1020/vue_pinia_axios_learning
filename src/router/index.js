import { createWebHashHistory, createRouter } from 'vue-router'
import { useUserStore } from '../store/user'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { 
            path: '/', 
            name: 'Login',
            component: () => import('../views/Login.vue') 
        },
        { 
            path: '/home', 
            name: 'Home',
            component: () => import('../views/Home.vue'),
            children: [
                {
                    path: 'student',
                    name: 'StudentManagement',
                    component: () => import('../views/Home/StudentManagement.vue')
                }
            ]
        },

    ]
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    
    // 如果访问的是登录页面，直接放行
    if (to.path === '/') {
        next()
        return
    }
    
    // 检查是否有token，如果没有则跳转到登录页
    if (!userStore.isLogined) {
        next('/')
    } else {
        next()
    }
})

export default router