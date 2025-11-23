import { defineStore } from "pinia";
import { loginApi } from "../api/user"

export const useUserStore = defineStore("user", {
    state: () => ({
        remenberMe: false,
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
            remenberMe
        ){
            try {
                const response = await loginApi(username, password);
                if (response.user.username !== username || response.user.password !== password) {
                    return false
                }

                this.username = username;
                this.remenberMe = remenberMe
                this.token = response.token

                if (remenberMe) {
                    this.password = password
                } else {
                    this.password = "";
                }

                // 将 token 保存到localStorage
                localStorage.setItem("token", response.token);
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
            router.push('/login')
        }
    },

    persist: {
        key: "user",
        storage: localStorage
    }

})