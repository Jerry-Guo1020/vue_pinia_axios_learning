<template>
  <el-container class="home-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="sidebar">
      <div class="logo" :class="{ 'collapsed': isCollapse }">
        <transition name="logo" mode="out-in">
          <div v-if="!isCollapse" class="logo-full">
            <div class="logo-placeholder">
              <el-icon :size="24" color="white"><User /></el-icon>
            </div>
            <h2>学员管理系统</h2>
          </div>
          <div v-else class="logo-mini">
            <div class="logo-placeholder">
              <el-icon :size="24" color="white"><User /></el-icon>
            </div>
          </div>
        </transition>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
      >
        <el-menu-item index="/home/student">
          <el-icon><User /></el-icon>
          <template #title>学员管理</template>
        </el-menu-item>
        
        <!-- 可以在这里添加更多菜单项 -->
        <el-menu-item index="/home/dashboard">
          <el-icon><Odometer /></el-icon>
          <template #title>仪表盘</template>
        </el-menu-item>
        
        <el-menu-item index="/home/settings">
          <el-icon><Setting /></el-icon>
          <template #title>系统设置</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主体区域 -->
    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="header">
        <div class="header-left">
          <el-button 
            :icon="isCollapse ? Expand : Fold" 
            @click="toggleCollapse" 
            class="collapse-btn"
            circle
            plain
          />
          
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ breadcrumbTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-right">
          <el-dropdown @command="handleUserCommand">
            <div class="user-avatar">
              <el-avatar :size="32" icon="UserFilled" />
              <span class="username">{{ username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>个人中心
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区域 -->
      <el-main class="main-content">
        <router-view />
      </el-main>
      
      <!-- 底部 -->
      <el-footer class="footer">
        <div class="footer-content">
          <p>© 2023 学员管理系统 - Vue 3 + Element Plus 高级管理系统</p>
          <div class="footer-links">
            <el-link type="info" :underline="false">帮助文档</el-link>
            <el-link type="info" :underline="false">技术支持</el-link>
            <el-link type="info" :underline="false">隐私政策</el-link>
          </div>
        </div>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../store/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  User,
  Odometer,
  Setting,
  Expand,
  Fold,
  ArrowDown,
  SwitchButton,
  UserFilled
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 侧边栏折叠状态
const isCollapse = ref(false)

// 切换侧边栏折叠状态
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 获取当前激活的菜单项
const activeMenu = computed(() => {
  return route.path
})

// 面包屑标题
const breadcrumbTitle = computed(() => {
  const routeMap = {
    '/home/student': '学员管理',
    '/home/dashboard': '仪表盘',
    '/home/settings': '系统设置'
  }
  return routeMap[route.path] || '未知页面'
})

// 获取用户名
const username = computed(() => {
  return userStore.username || '用户'
})

// 用户下拉菜单处理
const handleUserCommand = (command) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人中心功能待开发')
      break
    case 'settings':
      ElMessage.info('系统设置功能待开发')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '确认退出',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    userStore.logout()
    ElMessage.success('已退出登录')
  }).catch(() => {
    // 用户取消退出
  })
}
</script>

<style scoped>
.home-container {
  height: 100vh;
}

.sidebar {
  background-color: #304156;
  transition: width 0.3s ease;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  position: relative;
  z-index: 1001;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  background-color: #253345;
  overflow: hidden;
  transition: all 0.3s ease;
}

.logo.collapsed {
  justify-content: center;
}

.logo-full {
  display: flex;
  align-items: center;
  gap: 12px;
  white-space: nowrap;
}

.logo-mini {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-placeholder {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #409eff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-full h2 {
  margin: 0;
  color: white;
  font-size: 18px;
  font-weight: 600;
  transition: opacity 0.3s ease;
}

.logo-enter-active,
.logo-leave-active {
  transition: all 0.3s ease;
}

.logo-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.logo-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.sidebar-menu {
  border-right: none;
  height: calc(100% - 60px);
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 220px;
}

.header {
  background-color: #fff;
  color: #333;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.12);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
  padding-left: 20px;
}

.collapse-btn {
  border: none;
  background-color: transparent;
}

.breadcrumb {
  margin: 0;
}

.header-right {
  padding-right: 20px;
}

.user-avatar {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-avatar:hover {
  background-color: #f5f7fa;
}

.username {
  font-size: 14px;
  color: #606266;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
  height: calc(100vh - 120px);
}

.footer {
  background-color: #fff;
  color: #666;
  font-size: 14px;
  padding: 0;
  box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.1);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.footer-links {
  display: flex;
  gap: 20px;
}

:deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
}

:deep(.el-menu-item.is-active) {
  background-color: #ecf5ff !important;
}
</style>