import { createWebHashHistory, createRouter } from 'vue-router'

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
            component: () => import('../views/Home.vue') 

        },

    ]
})
export default router