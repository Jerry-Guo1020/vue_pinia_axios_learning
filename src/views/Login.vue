<template>
    <div class="login-container">
        <div class="login-box">
            <el-card class="login-card">
                <div class="login-header">
                    <div class="logo">
                        <h1 class="system-name">学员管理系统</h1>
                    </div>
                    <p class="welcome-text">欢迎使用学员管理系统</p>
                </div>
                <el-form :model="loginForm" :rules="rules" ref="loginFormRef" class="login-form">
                    <el-form-item prop="username">
                        <el-input placeholder="请输入账号" v-model="loginForm.username" prefix-icon="User" size="large"
                            clearable>
                            <template #prepend>
                                <span class="input-label">账号</span>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item prop="password">
                        <el-input placeholder="请输入密码" type="password" v-model="loginForm.password" prefix-icon="Lock"
                            size="large" show-password>
                            <template #prepend>
                                <span class="input-label">密码</span>
                            </template>
                        </el-input>
                    </el-form-item>

                    <el-form-item>
                        <div class="remember-forgot">
                            <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
                            <el-link type="primary" :underline="false">忘记密码？</el-link>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="handleLogin" size="large" class="login-btn" :loading="loading"
                            round>
                            登录
                        </el-button>
                    </el-form-item>

                    <div class="register-section">
                        <span>还没有账号？</span>
                        <el-link type="primary" :underline="false">立即注册</el-link>
                    </div>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus';
import { useUserStore } from "../store/user"
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const loginFormRef = ref()
const loading = ref(false)

const loginForm = reactive({
    username: '',
    password: '',
    rememberMe: false
})

onMounted(() => {
    const userStore = useUserStore()
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
        loading.value = true

        const userStore = useUserStore()
        const result = await userStore.login(
            loginForm.username,
            loginForm.password,
            loginForm.rememberMe
        )

        if (result.success) {
            ElMessage.success(result.message)
            router.push('/home/student')
        } else {
            ElMessage.error(result.message)
        }
    } catch (e) {
        console.error("登录失败:", e)
        ElMessage.error("登录失败，请稍后重试")
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
}

.login-box {
    width: 100%;
    max-width: 450px;
}

.login-header {
    text-align: center;
    margin-bottom: 30px;
    color: black;
}


.system-name {
    margin: 0;
    font-size: 28px;
    font-weight: 600;
}

.welcome-text {
    font-size: 16px;
    opacity: 0.9;
    margin: 0;
}

.login-card {
    border-radius: 12px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    border: none;
    padding: 30px;
}

.login-form :deep(.el-form-item) {
    margin-bottom: 25px;
}

.input-label {
    display: inline-block;
    width: 40px;
    text-align: center;
    color: #909399;
}

.remember-forgot {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.login-btn {
    width: 100%;
    margin-top: 10px;
    height: 45px;
    font-size: 16px;
}

.register-section {
    text-align: center;
    margin-top: 20px;
    color: #606266;
}

.register-section .el-link {
    margin-left: 5px;
}

:deep(.el-input-group__prepend) {
    background-color: #f5f7fa;
    border-right: none;
}

:deep(.el-input__wrapper) {
    border-radius: 0 4px 4px 0;
}
</style>