<template>
  <el-drawer
    v-model="visible"
    title="保险续期"
    size="500px"
    direction="rtl"
    destroy-on-close
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="110px">
      <el-form-item label="保险有效期" prop="insurancePeriod">
        <el-date-picker
          v-model="form.insurancePeriod"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          class="form-input"
        />
      </el-form-item>

      <el-form-item label="报单编号" prop="policyCode">
        <el-input v-model="form.policyCode" placeholder="请输入" class="form-input" />
      </el-form-item>

      <el-form-item label="经办人" prop="handler">
        <el-input v-model="form.handler" placeholder="请输入" class="form-input" />
      </el-form-item>

      <el-form-item label="维保单附件" prop="attachment" required>
        <el-upload
          class="attachment-upload"
          action="#"
          :auto-upload="false"
          :file-list="form.fileList"
          :on-change="handleFileChange"
          :on-remove="handleFileRemove"
        >
          <el-link type="primary" :underline="false">点击上传</el-link>
        </el-upload>
      </el-form-item>

      <el-form-item label="备注">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="4"
          placeholder="请输入备注"
          class="form-input"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules, UploadFile } from 'element-plus'

interface InsuranceRenewalForm {
  insurancePeriod: string[]
  policyCode: string
  handler: string
  attachment: string
  fileList: UploadFile[]
  remark: string
}

const props = defineProps<{
  modelValue: boolean
  rowData?: any
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: InsuranceRenewalForm]
}>()

const visible = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  visible.value = val
  if (val && props.rowData) {
    initForm()
  }
})

watch(visible, (val) => {
  emit('update:modelValue', val)
})

const formRef = ref<FormInstance>()
const form = reactive<InsuranceRenewalForm>({
  insurancePeriod: [],
  policyCode: '',
  handler: '',
  attachment: '',
  fileList: [],
  remark: ''
})

const rules: FormRules = {
  insurancePeriod: [{ required: true, message: '请选择保险有效期', trigger: 'change' }],
  policyCode: [{ required: true, message: '请输入报单编号', trigger: 'blur' }],
  handler: [{ required: true, message: '请输入经办人', trigger: 'blur' }]
}

function initForm() {
  form.insurancePeriod = []
  form.policyCode = ''
  form.handler = ''
  form.attachment = ''
  form.fileList = []
  form.remark = ''
}

function handleFileChange(file: UploadFile) {
  form.fileList.push(file)
}

function handleFileRemove(file: UploadFile) {
  const idx = form.fileList.findIndex(f => f.uid === file.uid)
  if (idx !== -1) {
    form.fileList.splice(idx, 1)
  }
}

function handleClose() {
  visible.value = false
}

function handleSubmit() {
  formRef.value?.validate(valid => {
    if (valid) {
      ElMessage.success('保险续期成功')
      emit('submit', { ...form })
      visible.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
:deep(.el-drawer__footer) {
  border-top: 1px solid #ebeef5;
}

.form-input {
  width: 100%;
}

.attachment-upload {
  :deep(.el-upload) {
    text-align: left;
  }
}
</style>
