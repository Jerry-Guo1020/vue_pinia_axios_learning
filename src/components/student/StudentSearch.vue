<template>
  <el-card class="search-card">
    <el-form :model="searchForm" label-width="80px" inline>
      <el-form-item label="姓名">
        <el-input v-model="searchForm.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="学号">
        <el-input v-model="searchForm.studentId" placeholder="请输入学号" />
      </el-form-item>
      <el-form-item label="班级">
        <el-input v-model="searchForm.class" placeholder="请输入班级" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['search'])

const searchForm = reactive({
  name: '',
  studentId: '',
  class: ''
})

const handleSearch = () => {
  emit('search', { ...searchForm })
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.studentId = ''
  searchForm.class = ''
  emit('search', { ...searchForm })
}
</script>

<style scoped>
.search-card {
  margin-bottom: 20px;
}

.el-form-item {
  margin-right: 20px;
}
</style>