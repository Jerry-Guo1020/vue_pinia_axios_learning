<template>
  <el-container class="home-container">
    <!-- 侧边栏 -->
    <el-aside width="200px" class="sidebar">
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
      >
        <el-menu-item index="/home/student">
          <el-icon><User /></el-icon>
          <span>学员管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主体区域 -->
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="header-content">
          <h2>学员管理系统</h2>
          <div class="user-info">
            <span>欢迎, {{ username }}</span>
            <el-button type="danger" size="small" @click="handleLogout">退出登录</el-button>
          </div>
        </div>
      </el-header>

      <!-- 内容区域 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { User } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 获取当前激活的菜单项
const activeMenu = computed(() => {
  return router.currentRoute.value.path
})

// 获取用户名
const username = computed(() => {
  return userStore.username || '用户'
})

// 退出登录
const handleLogout = () => {
  userStore.logout()
}
</script>

<style scoped>
.home-container {
  height: 100vh;
}

.sidebar {
  background-color: #545c64;
  color: white;
  height: 100%;
}

.sidebar-menu {
  border-right: none;
  height: 100%;
}

.header {
  background-color: #fff;
  color: #333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.main-content {
  background-color: #f5f5f5;
  padding: 20px;
}
</style>