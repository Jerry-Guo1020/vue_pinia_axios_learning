<template>
  <div class="student-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-wrapper">
          <el-icon class="title-icon"><User /></el-icon>
          <div>
            <h2>学员管理</h2>
            <p>管理系统中的所有学员信息</p>
          </div>
        </div>
        <div class="header-actions">
          <el-statistic title="总学员数" :value="total" />
        </div>
      </div>
    </div>
    
    <!-- 搜索组件 -->
    <StudentSearch @search="handleSearch" />
    
    <!-- 操作栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-button type="primary" @click="handleAdd" :icon="Plus">
          新增学员
        </el-button>
        <el-button @click="refreshData" :icon="Refresh">
          刷新数据
        </el-button>
        <el-button type="danger" @click="handleBatchDelete" :icon="Delete" :disabled="selectedStudents.length === 0">
          批量删除
        </el-button>
      </div>
      
      <div class="toolbar-right">
        <el-button-group>
          <el-button :icon="Grid" @click="changeView('table')" :type="viewMode === 'table' ? 'primary' : ''">表格</el-button>
          <el-button :icon="Collection" @click="changeView('card')" :type="viewMode === 'card' ? 'primary' : ''">卡片</el-button>
        </el-button-group>
      </div>
    </div>
    
    <!-- 学员展示区域 -->
    <div class="content-area">
      <!-- 表格视图 -->
      <div v-show="viewMode === 'table'">
        <StudentTable 
          :students="students"
          :loading="loading"
          :total="total"
          :page="page"
          :page-size="pageSize"
          @edit="handleEdit"
          @delete="handleDelete"
          @selection-change="handleSelectionChange"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      
      <!-- 卡片视图 -->
      <div v-show="viewMode === 'card'" class="card-view">
        <el-row :gutter="20">
          <el-col 
            v-for="student in students" 
            :key="student.id" 
            :xs="24" 
            :sm="12" 
            :md="8" 
            :lg="6"
            class="card-col"
          >
            <el-card class="student-card" shadow="hover">
              <div class="card-header">
                <el-avatar :size="40" icon="UserFilled" />
                <div class="card-title">
                  <h4>{{ student.name }}</h4>
                  <p>{{ student.studentId }}</p>
                </div>
                <el-dropdown @command="handleCardCommand">
                  <el-icon class="more-icon"><More /></el-icon>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item :command="{action: 'edit', data: student}">
                        <el-icon><Edit /></el-icon>编辑
                      </el-dropdown-item>
                      <el-dropdown-item :command="{action: 'delete', data: student}" divided>
                        <el-icon><Delete /></el-icon>删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              
              <div class="card-content">
                <div class="info-item">
                  <el-icon><OfficeBuilding /></el-icon>
                  <span>{{ student.class }}</span>
                </div>
                <div class="info-item">
                  <el-icon><Phone /></el-icon>
                  <span>{{ student.phone }}</span>
                </div>
                <div class="info-item">
                  <el-icon><Message /></el-icon>
                  <span>{{ student.email }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        
        <!-- 分页 -->
        <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          class="card-pagination"
        />
      </div>
    </div>
    
    <!-- 学员表单对话框 -->
    <StudentFormDialog
      v-model:visible="dialogVisible"
      :form-data="currentStudent"
      :is-edit="isEdit"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getStudents, createStudent, updateStudent, deleteStudent } from '../../api/user'
import StudentSearch from '../../components/student/StudentSearch.vue'
import StudentTable from '../../components/student/StudentTable.vue'
import StudentFormDialog from '../../components/student/StudentFormDialog.vue'

// 图标引入
import {
  User,
  Plus,
  Refresh,
  Delete,
  Grid,
  Collection,
  More,
  Edit,
  OfficeBuilding,
  Phone,
  Message,
  UserFilled
} from '@element-plus/icons-vue'

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
  class: '',
  phone: '',
  email: ''
})

// 对话框相关
const dialogVisible = ref(false)
const isEdit = ref(false)
const currentStudent = ref({})

// 视图模式
const viewMode = ref('table')

// 选中的学员
const selectedStudents = ref([])

// 获取学员列表
const fetchStudents = async () => {
  loading.value = true
  try {
    // 使用封装的API函数替代直接fetch调用
    const params = {
      _page: page.value,
      _limit: pageSize.value
    }
    
    // 添加搜索条件
    if (searchForm.name) {
      params.name_like = searchForm.name
    }
    if (searchForm.studentId) {
      params.studentId_like = searchForm.studentId
    }
    if (searchForm.class) {
      params.class_like = searchForm.class
    }
    if (searchForm.phone) {
      params.phone_like = searchForm.phone
    }
    if (searchForm.email) {
      params.email_like = searchForm.email
    }
    
    const data = await getStudents(params)
    students.value = data
    
    // 获取总数用于分页
    const countParams = {
      _limit: 0 // 设置为0以获取所有数据用于计数
    }
    
    // 添加相同的搜索条件
    if (searchForm.name) {
      countParams.name_like = searchForm.name
    }
    if (searchForm.studentId) {
      countParams.studentId_like = searchForm.studentId
    }
    if (searchForm.class) {
      countParams.class_like = searchForm.class
    }
    if (searchForm.phone) {
      countParams.phone_like = searchForm.phone
    }
    if (searchForm.email) {
      countParams.email_like = searchForm.email
    }
    
    // 由于json-server不支持X-Total-Count头，我们需要获取所有数据来计算总数
    const allData = await getStudents(countParams)
    total.value = allData.length
    
    if (data.length === 0 && (searchForm.name || searchForm.studentId || searchForm.class || searchForm.phone || searchForm.email)) {
      ElMessage.warning('没有找到符合条件的学生')
    }
  } catch (error) {
    console.error('获取学员列表错误:', error)
    ElMessage.error('获取学员列表失败')
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = (formData) => {
  Object.assign(searchForm, formData)
  page.value = 1 // 重置到第一页
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

// 处理批量删除
const handleBatchDelete = () => {
  if (selectedStudents.value.length === 0) {
    ElMessage.warning('请先选择要删除的学员')
    return
  }
  
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedStudents.value.length} 名学员吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // 这里可以优化为并发删除
      const promises = selectedStudents.value.map(student => deleteStudent(student.id))
      await Promise.all(promises)
      ElMessage.success('批量删除成功')
      fetchStudents()
    } catch (error) {
      ElMessage.error('批量删除失败')
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

// 处理选中变化
const handleSelectionChange = (selection) => {
  selectedStudents.value = selection
}

// 刷新数据
const refreshData = () => {
  ElMessage.info('正在刷新数据...')
  fetchStudents()
}

// 改变视图模式
const changeView = (mode) => {
  viewMode.value = mode
}

// 处理卡片操作
const handleCardCommand = (command) => {
  const { action, data } = command
  if (action === 'edit') {
    handleEdit(data)
  } else if (action === 'delete') {
    handleDelete(data)
  }
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
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.page-header {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 15px;
}

.title-icon {
  font-size: 28px;
  color: #409eff;
}

.title-wrapper h2 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 24px;
}

.title-wrapper p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px 20px;
  background-color: #f5f7fa;
  border-radius: 6px;
}

.toolbar-left {
  display: flex;
  gap: 10px;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

.content-area {
  min-height: 400px;
}

.card-view {
  margin-top: 20px;
}

.card-col {
  margin-bottom: 20px;
}

.student-card {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.student-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  position: relative;
}

.card-title {
  flex: 1;
}

.card-title h4 {
  margin: 0 0 3px 0;
  font-size: 16px;
  color: #333;
}

.card-title p {
  margin: 0;
  font-size: 13px;
  color: #999;
}

.more-icon {
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  color: #999;
  font-size: 18px;
}

.more-icon:hover {
  color: #409eff;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
}

.card-pagination {
  margin-top: 20px;
  text-align: right;
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .toolbar-left,
  .toolbar-right {
    justify-content: center;
  }
  
  .header-content {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
}
</style>