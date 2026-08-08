<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="720px"
    :close-on-click-modal="false"
    append-to-body
    class="wf-io-dialog"
  >
    <!-- ========== 导出 ========== -->
    <template v-if="mode === 'export'">
      <p class="wf-io__hint">
        以下为当前画布的
        <el-tag size="small" effect="plain" type="info">{{ format.toUpperCase() }}</el-tag>
        描述，可复制后保存或在其他设计器中复用：
      </p>

      <!-- JSON -->
      <template v-if="format === 'json'">
        <el-input
          ref="textareaRef"
          v-model="jsonText"
          type="textarea"
          :rows="16"
          readonly
          resize="none"
          class="wf-io__textarea"
        />
      </template>

      <!-- BPMN -->
      <template v-else>
        <el-input
          ref="textareaRef"
          v-model="bpmnText"
          type="textarea"
          :rows="16"
          readonly
          resize="none"
          class="wf-io__textarea"
        />
      </template>
    </template>

    <!-- ========== 导入 ========== -->
    <template v-else>
      <p class="wf-io__hint">
        粘贴合法的
        <el-tag size="small" effect="plain" type="info">{{ format.toUpperCase() }}</el-tag>
        内容，将覆盖当前画布（不可撤销）：
      </p>

      <!-- JSON -->
      <template v-if="format === 'json'">
        <el-input
          v-model="jsonText"
          type="textarea"
          :rows="16"
          resize="none"
          placeholder='{ "nodes": [...], "edges": [...] }'
          class="wf-io__textarea"
        />
      </template>

      <!-- BPMN -->
      <template v-else>
        <el-input
          v-model="bpmnText"
          type="textarea"
          :rows="16"
          resize="none"
          placeholder='粘贴 bpmn:definitions XML…'
          class="wf-io__textarea"
        />
      </template>
    </template>

    <template #footer>
      <!-- 导出：复制 + 下载 -->
      <template v-if="mode === 'export'">
        <el-button @click="onDownload">
          <el-icon><Download /></el-icon>
          下载文件
        </el-button>
        <el-button type="primary" @click="onCopy">
          <el-icon><DocumentCopy /></el-icon>
          复制到剪贴板
        </el-button>
      </template>

      <!-- 导入：取消 + 导入 -->
      <template v-else>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :disabled="!canSubmit" @click="onImport">导入</el-button>
      </template>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { DocumentCopy, Download } from '@element-plus/icons-vue'
import { useWorkflowStore } from '@/composables/useWorkflowStore'

const store = useWorkflowStore()

const dialogVisible = defineModel<boolean>({ default: false })
const mode = defineModel<'export' | 'import'>('mode', { default: 'export' })
const format = defineModel<'json' | 'bpmn'>('format', { default: 'json' })

const jsonText = ref('')
const bpmnText = ref('')

/** 对话框标题 */
const dialogTitle = computed(() => {
  const action = mode.value === 'export' ? '导出' : '导入'
  return `${action}${format.value.toUpperCase()} - ${format.value === 'bpmn' ? 'BPMN 2.0 XML' : '工作流 JSON'}`
})

/** 导入按钮可用条件 */
const canSubmit = computed(() => {
  if (format.value === 'json') return !!jsonText.value.trim()
  return !!bpmnText.value.trim()
})

/** 打开对话框时初始化内容 */
watch(dialogVisible, (v) => {
  if (!v) return
  if (mode.value === 'export') {
    if (format.value === 'json') {
      jsonText.value = store.exportJson()
    } else {
      bpmnText.value = store.exportBpmn()
    }
  } else {
    jsonText.value = ''
    bpmnText.value = ''
  }
})

/** 切换 format 时刷新内容（确保用户切换后看到对应格式的数据） */
watch(format, (f) => {
  if (!dialogVisible.value) return
  if (mode.value === 'export') {
    if (f === 'json') jsonText.value = store.exportJson()
    else bpmnText.value = store.exportBpmn()
  }
})

async function onCopy() {
  const text = format.value === 'json' ? jsonText.value : bpmnText.value
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制到剪贴板')
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    ElMessage.success('已复制到剪贴板')
  }
}

function onDownload() {
  const text = format.value === 'json' ? jsonText.value : bpmnText.value
  const mime = format.value === 'json' ? 'application/json' : 'application/bpmn+xml'
  const ext = format.value === 'json' ? 'json' : 'bpmn'
  const filename = `workflow-${Date.now()}.${ext}`
  const blob = new Blob([text], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  ElMessage.success(`已下载 ${filename}`)
}

function onImport() {
  let ok = false
  if (format.value === 'json') {
    ok = store.importJson(jsonText.value)
    if (ok) ElMessage.success('JSON 导入成功')
    else ElMessage.error('JSON 格式不合法')
  } else {
    ok = store.importBpmn(bpmnText.value)
    if (ok) ElMessage.success('BPMN 导入成功')
    else ElMessage.error('BPMN XML 解析失败，请检查内容是否符合 BPMN 2.0 规范')
  }
  if (ok) dialogVisible.value = false
}
</script>

<style scoped lang="scss">
.wf-io__hint {
  font-size: 13px;
  color: #606266;
  margin: 0 0 12px;
  line-height: 1.6;
  display: flex;
  align-items: center;
  gap: 6px;
}

.wf-io__textarea {
  font-family: 'SFMono-Regular', Menlo, Consolas, monospace;
  font-size: 12px;
}

:deep(.wf-io__textarea textarea) {
  font-family: inherit;
}
</style>