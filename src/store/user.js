import { defineStore } from "pinia";
import { getUsers } from "../api/user"
import router from "../router"

export const useUserStore = defineStore("user", {
    state: () => ({
        rememberMe: false,
        token: "",
        username: "",
        password: "",
    }),

    getters: {
        isLogined: (state) => !!state.token
    },

    actions: {
        async login(username, password, rememberMe) {
            try {
                // 获取用户列表
                const users = await getUsers()
                if (!users || users.length === 0) {
                    return { success: false, message: '用户数据为空' }
                }

                // 查找匹配的用户
                const user = users.find(u => u.username === username && u.password === password);
                
                if (!user) {
                    return { success: false, message: '用户名或密码错误' }
                }

                // 生成token
                const fakeToken = 'token_' + username + '_' + Date.now()

                // 更新状态
                this.username = username;
                this.rememberMe = rememberMe;
                this.token = fakeToken;

                if (rememberMe) {
                    this.password = password;
                } else {
                    this.password = "";
                }

                // 将 token 保存到localStorage
                localStorage.setItem("token", fakeToken);
                
                return { success: true, message: '登录成功' };
            } catch (err) {
                console.error("login failed", err);
                return { success: false, message: '登录过程中发生错误' }
            }
        },
        
        logout() {
            this.$reset()
            localStorage.removeItem("user")
            localStorage.removeItem("token")
            router.push('/')
        },
        
        // 检查登录状态
        checkLoginStatus() {
            const token = localStorage.getItem('token');
            if (token) {
                this.token = token;
                return true;
            }
            return false;
        }
    },

    persist: {
        key: "user",
        storage: localStorage
    }

})