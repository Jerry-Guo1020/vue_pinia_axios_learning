<template>
    <div class="login-container">

        <el-card class="login-card">
            <strong>
                <h1 class="login-title">用户登录👋</h1>
            </strong>
            <el-form :model="loginForm" :rules="rules" ref="loginFormRef">

                <el-form-item prop="username" label="账号">
                    <el-input placeholder="📪请输入账号" v-model="loginForm.username"></el-input>
                </el-form-item>

                <el-form-item prop="password" label="密码">
                    <el-input placeholder="🔒请输入密码" type="password" v-model="loginForm.password"></el-input>
                </el-form-item>

                <el-form-item class="flex">
                    <div class="fcheckbox-container">
                        <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox><br>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="handleLogin">登录</el-button>
                    <el-button>注册账号</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus';
import { useUserStore } from "../store/user"

import { useRouter } from 'vue-router'

const router = useRouter()
const loginFormRef = ref()

const loginForm = reactive({
    username: '',
    password: '',
    rememberMe: false
})

onMounted(() => {
    const userStore = useUserStore()
    // 修复拼写错误，从 rememberMe 加载状态
    loginForm.rememberMe = userStore.rememberMe
    if (userStore.rememberMe) {
        loginForm.username = userStore.username
        loginForm.password = userStore.password
    }
})

const rules = reactive({
    username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
});

const handleLogin = async () => {
    try {
        await loginFormRef.value.validate()
        const userStore = useUserStore()
        const res = await userStore.login(
            loginForm.username,
            loginForm.password,
            loginForm.rememberMe
        )
        if (res) {
            ElMessage.success("登录成功")
            router.push('/home/student')
        } else {
            ElMessage.error("用户名或密码错误")
        }
    } catch (e) {
        ElMessage.error("登录失败，请稍后重试")
    }
}
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    width: 100%;
    height: 96vh;
}

.login-card {
    width: 400px;
}

.login-title {
    text-align: center;
    margin-bottom: 30px;
    font-size: 24px;
    color: #303133;
    font-weight: 500;
}

/* 表单整体居中 */
.el-form {
    width: 85%;
    margin: 0 auto;
}

/* 标签文字居中 */
.el-form-item__label {
    justify-content: center;
}

/* 移除默认的左边距 */
.el-form-item__content {
    margin-left: 0 !important;
}

/* 按钮居中 */
:deep(.el-form-item:last-child .el-form-item__content) {
    display: flex;
    justify-content: center;
    gap: 20px;
    /* 按钮之间的间距 */
}

/* 可选：美化按钮样式 */
:deep(.el-button) {
    width: 120px;
    /* 统一按钮宽度 */
}

.backhome {
    width: 20%;
    box-shadow: 0 0px 0px rgba(0, 0, 0, 0.1);
}
</style>