import { createWebHashHistory, createRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { ElMessage } from 'element-plus'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { 
            path: '/', 
            name: 'Login',
            component: () => import('../views/Login.vue'),
            meta: { title: '登录' }
        },
        { 
            path: '/home', 
            name: 'Home',
            component: () => import('../views/Home.vue'),
            redirect: '/home/student',  
            children: [
                {
                    path: 'student',
                    name: 'StudentManagement',
                    component: () => import('../views/Home/StudentManagement.vue'),
                    meta: { title: '学员管理' }
                },
                {
                    path: 'dashboard',
                    name: 'Dashboard',
                    component: () => import('../views/Home/StudentManagement.vue'), // 临时使用学员管理页面
                    meta: { title: '仪表盘' }
                },
                {
                    path: 'settings',
                    name: 'Settings',
                    component: () => import('../views/Home/StudentManagement.vue'), // 临时使用学员管理页面
                    meta: { title: '系统设置' }
                }
            ],
            meta: { title: '主页' }
        },

    ]
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
    // 设置页面标题
    document.title = to.meta.title ? `${to.meta.title} - 学员管理系统` : '学员管理系统'
    
    // 白名单路由，不需要登录即可访问
    const whiteList = ['/', '/login']
    
    // 如果访问的是白名单路由，直接放行
    if (whiteList.includes(to.path)) {
        next()
        return
    }
    
    // 检查是否有token
    const token = localStorage.getItem('token')
    if (!token) {
        ElMessage.warning('请先登录')
        next('/')
    } else {
        next()
    }
})

export default router