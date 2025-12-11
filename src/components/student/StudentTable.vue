<template>
  <div class="table-container">
    <el-table
      :data="students"
      v-loading="loading"
      border
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
      :row-class-name="tableRowClassName"
      highlight-current-row
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" width="80" sortable />
      <el-table-column prop="name" label="姓名" width="120" sortable>
        <template #default="{ row }">
          <el-tag size="small">{{ row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="studentId" label="学号" width="150" sortable />
      <el-table-column prop="class" label="班级" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag type="success" size="small">{{ row.class }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="150">
        <template #default="{ row }">
          <el-tooltip :content="row.phone" placement="top">
            <span>{{ formatPhone(row.phone) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="200" show-overflow-tooltip>
        <template #default="{ row }">
          <el-link :href="`mailto:${row.email}`" :underline="false" type="primary">
            {{ row.email }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right" align="center">
        <template #default="{ row }">
          <el-button-group>
            <el-button 
              size="small" 
              type="primary" 
              @click="handleEdit(row)"
              :icon="Edit"
            >
              编辑
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(row)"
              :icon="Delete"
            >
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
  
  <!-- 分页 -->
  <el-pagination
    :current-page="page"
    :page-size="pageSize"
    :page-sizes="[10, 20, 50, 100]"
    :total="total"
    layout="total, sizes, prev, pager, next, jumper"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    class="pagination"
  />
</template>

<script setup>
import { watch } from 'vue'
import { Edit, Delete } from '@element-plus/icons-vue'

const props = defineProps({
  students: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  total: {
    type: Number,
    default: 0
  },
  page: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['edit', 'delete', 'selection-change', 'size-change', 'current-change'])

// 监听学生数据变化
watch(() => props.students, (newVal) => {
  // 开发环境下打印日志便于调试
  if (process.env.NODE_ENV === 'development') {
    console.log('StudentTable 收到的学生数据:', newVal)
    console.log('数据条数:', newVal.length)
  }
}, { immediate: true, deep: true })

// 处理选中变化
const handleSelectionChange = (selection) => {
  emit('selection-change', selection)
}

// 处理编辑
const handleEdit = (row) => {
  emit('edit', row)
}

// 处理删除
const handleDelete = (row) => {
  emit('delete', row)
}

// 处理分页大小变化
const handleSizeChange = (val) => {
  emit('size-change', val)
}

// 处理当前页变化
const handleCurrentChange = (val) => {
  emit('current-change', val)
}

// 格式化手机号
const formatPhone = (phone) => {
  if (!phone) return ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 表格行样式
const tableRowClassName = ({ row, rowIndex }) => {
  if (rowIndex % 2 === 0) {
    return 'even-row'
  }
  return 'odd-row'
}
</script>

<style scoped>
.table-container {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 6px;
}

:deep(.el-table__row.even-row) {
  background-color: #fafafa;
}

:deep(.el-table__row.odd-row) {
  background-color: #ffffff;
}

:deep(.el-table__row:hover) {
  background-color: #f0f9eb !important;
}

:deep(.el-table__row.current-row) {
  background-color: #f0f9eb;
}
</style>