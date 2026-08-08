<template>
  <el-button type="success" @click="handleExport">
    <el-icon><Upload /></el-icon>
    {{ text }}
  </el-button>
</template>

<script setup lang="ts">
import { Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { exportData } from '@/mock/dispatch/exportData'

interface Props {
  text?: string
  data?: any
}

const props = withDefaults(defineProps<Props>(), {
  text: '导出',
  data: null
})

const emit = defineEmits<{
  exported: [data: any]
}>()

const handleExport = () => {
  const exportPayload = props.data || exportData
  ElMessage.success('导出成功')
  emit('exported', exportPayload)
}
</script>
