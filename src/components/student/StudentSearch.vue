<template>
  <el-card class="search-card" shadow="never">
    <div class="search-header">
      <h3 class="search-title">
        <el-icon><Search /></el-icon>
        高级搜索
      </h3>
      <el-button 
        link 
        type="primary" 
        @click="toggleExpand"
        class="expand-btn"
      >
        {{ isExpanded ? '收起' : '展开' }}
        <el-icon :class="{ 'rotated': isExpanded }">
          <ArrowDown />
        </el-icon>
      </el-button>
    </div>
    
    <el-form 
      :model="searchForm" 
      label-width="80px" 
      :inline="!isMobile"
      class="search-form"
      :class="{ 'expanded': isExpanded }"
    >
      <el-row :gutter="20">
        <el-col :span="isMobile ? 24 : 8">
          <el-form-item label="姓名">
            <el-input 
              v-model="searchForm.name" 
              placeholder="请输入姓名" 
              clearable
              :prefix-icon="User"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="isMobile ? 24 : 8">
          <el-form-item label="学号">
            <el-input 
              v-model="searchForm.studentId" 
              placeholder="请输入学号" 
              clearable
              :prefix-icon="Document"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="isMobile ? 24 : 8">
          <el-form-item label="班级">
            <el-input 
              v-model="searchForm.class" 
              placeholder="请输入班级" 
              clearable
              :prefix-icon="OfficeBuilding"
            />
          </el-form-item>
        </el-col>
        
        <transition name="fade">
          <el-col 
            v-show="isExpanded" 
            :span="isMobile ? 24 : 8"
            class="advanced-search-item"
          >
            <el-form-item label="手机号">
              <el-input 
                v-model="searchForm.phone" 
                placeholder="请输入手机号" 
                clearable
                :prefix-icon="Phone"
              />
            </el-form-item>
          </el-col>
        </transition>
        
        <transition name="fade">
          <el-col 
            v-show="isExpanded" 
            :span="isMobile ? 24 : 8"
            class="advanced-search-item"
          >
            <el-form-item label="邮箱">
              <el-input 
                v-model="searchForm.email" 
                placeholder="请输入邮箱" 
                clearable
                :prefix-icon="Message"
              />
            </el-form-item>
          </el-col>
        </transition>
      </el-row>
      
      <div class="search-actions">
        <el-button 
          type="primary" 
          @click="handleSearch"
          :icon="Search"
          :loading="loading"
        >
          搜索
        </el-button>
        <el-button @click="handleReset" :icon="Refresh">重置</el-button>
        <el-button 
          link 
          type="primary" 
          @click="saveSearchTemplate"
          v-if="isExpanded"
        >
          保存为模板
        </el-button>
      </div>
    </el-form>
  </el-card>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'

// 图标引入
import {
  Search,
  Refresh,
  ArrowDown,
  User,
  Document,
  OfficeBuilding,
  Phone,
  Message
} from '@element-plus/icons-vue'

const emit = defineEmits(['search'])

// 响应式数据
const searchForm = reactive({
  name: '',
  studentId: '',
  class: '',
  phone: '',
  email: ''
})

const isExpanded = ref(false)
const isMobile = ref(window.innerWidth < 768)
const loading = ref(false)

// 切换展开/收起
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// 处理搜索
const handleSearch = () => {
  // 检查是否至少填写了一个搜索条件
  const hasSearchCondition = Object.values(searchForm).some(val => val.trim() !== '')
  
  if (hasSearchCondition) {
    ElMessage.success('正在搜索...')
    loading.value = true
    
    // 模拟搜索延迟
    setTimeout(() => {
      emit('search', { ...searchForm })
      loading.value = false
    }, 500)
  } else {
    ElMessage.info('请输入至少一个搜索条件')
  }
}

// 处理重置
const handleReset = () => {
  searchForm.name = ''
  searchForm.studentId = ''
  searchForm.class = ''
  searchForm.phone = ''
  searchForm.email = ''
  ElMessage.info('已重置搜索条件')
  emit('search', { ...searchForm })
}

// 保存搜索模板（模拟功能）
const saveSearchTemplate = () => {
  const hasConditions = Object.values(searchForm).some(val => val.trim() !== '')
  if (hasConditions) {
    ElMessage.success('搜索模板已保存')
  } else {
    ElMessage.warning('请先输入搜索条件再保存模板')
  }
}

// 监听窗口大小变化
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth < 768
})
</script>

<style scoped>
.search-card {
  margin-bottom: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-title {
  margin: 0;
  font-size: 16px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.expand-btn {
  font-size: 13px;
}

.expand-btn .el-icon {
  transition: transform 0.3s ease;
}

.expand-btn .el-icon.rotated {
  transform: rotate(180deg);
}

.search-form {
  transition: all 0.3s ease;
}

.search-form.expanded {
  margin-bottom: 10px;
}

.advanced-search-item {
  transition: all 0.3s ease;
}

.search-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .search-header {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
  
  .search-actions {
    flex-wrap: wrap;
  }
}
</style>