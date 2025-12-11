<template>
  <el-dialog
    :model-value="visible"
    :title="isEdit ? '编辑学员' : '新增学员'"
    width="600px"
    @close="handleClose"
    :before-close="handleBeforeClose"
    class="student-dialog"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="formRules"
      label-width="100px"
      class="student-form"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input 
              v-model="form.name" 
              placeholder="请输入姓名" 
              clearable
              :prefix-icon="User"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="学号" prop="studentId">
            <el-input 
              v-model="form.studentId" 
              placeholder="请输入学号" 
              clearable
              :prefix-icon="Document"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="班级" prop="class">
            <el-select 
              v-model="form.class" 
              placeholder="请选择班级" 
              clearable
              filterable
              allow-create
              default-first-option
              :prefix-icon="OfficeBuilding"
            >
              <el-option
                v-for="item in classOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input 
              v-model="form.phone" 
              placeholder="请输入手机号" 
              clearable
              :prefix-icon="Phone"
            />
          </el-form-item>
        </el-col>
        
        <el-col :span="24">
          <el-form-item label="邮箱" prop="email">
            <el-input 
              v-model="form.email" 
              placeholder="请输入邮箱" 
              clearable
              :prefix-icon="Message"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" :icon="Close">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading" :icon="Check">
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 图标引入
import {
  User,
  Document,
  OfficeBuilding,
  Phone,
  Message,
  Close,
  Check
} from '@element-plus/icons-vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  formData: {
    type: Object,
    default: () => ({})
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'submit'])

const formRef = ref()
const submitLoading = ref(false)

// 表单数据
const form = ref({
  name: '',
  studentId: '',
  class: '',
  phone: '',
  email: ''
})

// 班级选项
const classOptions = ref([
  { value: '计算机科学与技术1班', label: '计算机科学与技术1班' },
  { value: '软件工程2班', label: '软件工程2班' },
  { value: '网络工程3班', label: '网络工程3班' },
  { value: '信息安全1班', label: '信息安全1班' },
  { value: '数据科学与大数据技术2班', label: '数据科学与大数据技术2班' }
])

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度应在2到10个字符之间', trigger: 'blur' }
  ],
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { pattern: /^[0-9]{7,12}$/, message: '学号应为7-12位数字', trigger: 'blur' }
  ],
  class: [
    { required: true, message: '请选择班级', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

// 监听传入的表单数据变化
watch(() => props.formData, (newVal) => {
  if (props.isEdit) {
    form.value = { ...newVal }
  } else {
    form.value = {
      name: '',
      studentId: '',
      class: '',
      phone: '',
      email: ''
    }
  }
}, { immediate: true, deep: true })

// 关闭前确认
const handleBeforeClose = (done) => {
  if (submitLoading.value) {
    ElMessage.warning('正在提交数据，请稍候...')
    return
  }
  
  ElMessageBox.confirm(
    '确定要关闭表单吗？未保存的数据将会丢失',
    '确认关闭',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    done()
  }).catch(() => {
    // 用户取消关闭
  })
}

// 关闭对话框
const handleClose = () => {
  // 重置表单
  formRef.value?.resetFields()
  emit('update:visible', false)
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    submitLoading.value = true
    
    // 模拟提交延迟
    setTimeout(() => {
      emit('submit', { ...form.value })
      submitLoading.value = false
    }, 800)
  } catch (error) {
    console.error('表单验证失败:', error)
    ElMessage.error('请填写正确的表单信息')
    submitLoading.value = false
  }
}
</script>

<style scoped>
.student-dialog {
  border-radius: 8px;
}

.student-form {
  padding: 20px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 10px 0;
}

:deep(.el-dialog__header) {
  border-bottom: 1px solid #eee;
  margin-right: 0 !important;
}

:deep(.el-dialog__footer) {
  border-top: 1px solid #eee;
  padding: 15px 20px;
}
</style>