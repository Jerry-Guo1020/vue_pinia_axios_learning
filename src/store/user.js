import { defineStore } from "pinia";
import { getUsers } from "../api/user"
import router from "../router"

export const useUserStore = defineStore("user", {
    state: () => ({
        rememberMe: false,  // 修复拼写错误
        token: "",
        username: "",
        password: "",
    }),

    getters: {
        isLogined: (state) => !!state.token
    },

    actions: {
        async login(
            username,
            password,
            rememberMe
        ) {
            try {
                // 获取用户列表
                const users = await getUsers()
                if (!users || users.length === 0) {
                    return false
                }

                // 验证用户名和密码
                const user = users.find(u => u.username === username && u.password === password)
                if (!user) {
                    return false
                }

                // 生成假的token
                const fakeToken = 'token' + Date.now()

                // 只有登录成功才保存用户信息
                this.username = username;
                this.rememberMe = rememberMe  // 修复拼写错误
                this.token = fakeToken

                if (rememberMe) {
                    this.password = password
                } else {
                    this.password = "";
                }

                // 将 token 保存到localStorage
                localStorage.setItem("token", fakeToken);
                return true;
            } catch (err) {
                console.error("login failed", err);
                return false
            }
        },
        logout() {
            this.$reset()
            localStorage.removeItem("user")
            localStorage.removeItem("token")
            router.push('/')
        }
    },

    persist: {
        key: "user",
        storage: localStorage
    }

})