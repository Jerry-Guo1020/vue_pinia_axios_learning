import { defineStore } from "pinia";
import { getUsers } from "../api/user"
import router from "../router"

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
        ) {
            try {

                // 我要加入这个列表是因为：json-server其实json输出，
                const users = await getUsers()
                if (!users || users.length === 0) {
                    return false
                }

                console.log(users)

                for (let i = 0; i < users.length; i++) {
                    const element = users[i];
                    // console.log(element);
                    console.log(element.username)
                    if (username != element.username || password != element.password) {
                        return false;
                    } else {
                        console.log("ok");
                        return true;
                    }

                }



                const fakeToken = 'token' + Date.now()

                this.username = username;
                this.remenberMe = remenberMe
                this.token = fakeToken

                if (remenberMe) {
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