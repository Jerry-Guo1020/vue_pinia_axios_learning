<template>
  <el-table
    :data="students"
    v-loading="loading"
    border
    stripe
    style="width: 100%"
  >
    <el-table-column prop="id" label="ID" width="80" />
    <el-table-column prop="name" label="姓名" width="120" />
    <el-table-column prop="studentId" label="学号" width="150" />
    <el-table-column prop="class" label="班级" show-overflow-tooltip />
    <el-table-column prop="phone" label="手机号" width="150" />
    <el-table-column prop="email" label="邮箱" width="200" />
    <el-table-column label="操作" width="150" fixed="right">
      <template #default="{ row }">
        <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
        <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  
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

const emit = defineEmits(['edit', 'delete', 'size-change', 'current-change'])

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
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>