<template>
  <div class="student-management">
    <!-- 搜索组件 -->
    <StudentSearch @search="handleSearch" />
    
    <!-- 学员表格 -->
    <StudentTable 
      :students="students"
      :loading="loading"
      :total="total"
      :page="page"
      :page-size="pageSize"
      @edit="handleEdit"
      @delete="handleDelete"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    
    <!-- 学员表单对话框 -->
    <StudentFormDialog
      v-model:visible="dialogVisible"
      :form-data="currentStudent"
      :is-edit="isEdit"
      @submit="handleSubmit"
    />
    
    <!-- 新增按钮 -->
    <div class="add-button">
      <el-button type="primary" @click="handleAdd">新增学员</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getStudents, createStudent, updateStudent, deleteStudent } from '../../api/user'
import StudentSearch from '../../components/student/StudentSearch.vue'
import StudentTable from '../../components/student/StudentTable.vue'
import StudentFormDialog from '../../components/student/StudentFormDialog.vue'

// 学员数据
const students = ref([])
const loading = ref(false)
const total = ref(0)

// 分页参数
const page = ref(1)
const pageSize = ref(10)

// 搜索条件
const searchForm = reactive({
  name: '',
  studentId: '',
  class: ''
})

// 对话框相关
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentStudent = ref({})

// 获取学员列表
const fetchStudents = async () => {
  loading.value = true
  try {
    const params = {
      _page: page.value,
      _limit: pageSize.value,
      ...(searchForm.name && { name_like: searchForm.name }),
      ...(searchForm.studentId && { studentId_like: searchForm.studentId }),
      ...(searchForm.class && { class_like: searchForm.class })
    }
    
    const data = await getStudents(params)
    students.value = data
    
    // 获取总数
    const response = await fetch(`http://localhost:3000/students?${new URLSearchParams({
      ...(searchForm.name && { name_like: searchForm.name }),
      ...(searchForm.studentId && { studentId_like: searchForm.studentId }),
      ...(searchForm.class && { class_like: searchForm.class })
    })}`)
    const allData = await response.json()
    total.value = allData.length
  } catch (error) {
    ElMessage.error('获取学员列表失败')
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = (formData) => {
  Object.assign(searchForm, formData)
  page.value = 1
  fetchStudents()
}

// 处理新增
const handleAdd = () => {
  isEdit.value = false
  currentStudent.value = {}
  dialogVisible.value = true
}

// 处理编辑
const handleEdit = (row) => {
  isEdit.value = true
  currentStudent.value = { ...row }
  dialogVisible.value = true
}

// 处理删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除学员 ${row.name} 吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteStudent(row.id)
      ElMessage.success('删除成功')
      fetchStudents()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 处理提交表单
const handleSubmit = async (formData) => {
  try {
    if (isEdit.value) {
      await updateStudent(formData.id, formData)
      ElMessage.success('更新成功')
    } else {
      await createStudent(formData)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    fetchStudents()
  } catch (error) {
    ElMessage.error(isEdit.value ? '更新失败' : '新增失败')
  }
}

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val
  page.value = 1
  fetchStudents()
}

// 处理当前页变化
const handleCurrentChange = (val) => {
  page.value = val
  fetchStudents()
}

// 组件挂载时获取数据
onMounted(() => {
  fetchStudents()
})
</script>

<style scoped>
.student-management {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
}

.add-button {
  margin-bottom: 20px;
  text-align: right;
}
</style>