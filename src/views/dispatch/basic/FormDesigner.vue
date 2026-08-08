<template>
  <div class="form-designer">
    <!-- 顶部工具栏 -->
    <div class="designer-header">
      <div class="header-left">
        <svg class="title-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span class="title-text">表单设计器</span>
      </div>
      <div class="header-divider" />
      <div class="header-right">
        <el-tooltip content="导出Vue文件" placement="bottom">
          <el-button text :icon="Download" @click="handleExportVue" />
        </el-tooltip>
        <el-tooltip content="复制代码" placement="bottom">
          <el-button text :icon="CopyDocument" @click="handleCopyCode" />
        </el-tooltip>
        <el-tooltip content="清空" placement="bottom">
          <el-button text :icon="Delete" @click="handleClear" />
        </el-tooltip>
      </div>
      <div class="header-spacer" />
      <div class="header-actions">
        <el-button @click="handleSaveDraft">保存草稿</el-button>
        <el-button type="primary" @click="handlePublish">立即发布</el-button>
      </div>
    </div>

    <!-- 设计器主体 -->
    <div class="designer-body">
      <!-- 左侧组件面板 -->
      <ComponentPanel @add="addComponent" />

      <!-- 中间画布区域 -->
      <CanvasPanel
        :fields="formFields"
        :selected-field="selectedField"
        @select="selectField"
        @copy="copyField"
        @remove="removeField"
        @drop="handleDrop"
      />

      <!-- 右侧配置面板 -->
      <ConfigPanel
        :field="selectedField"
        v-model:active-tab="rightTab"
        :form-config="formConfig"
      />
    </div>

    <!-- 预览弹窗 -->
    <el-dialog v-model="previewVisible" title="表单预览" width="70%" top="5vh" destroy-on-close>
      <el-form
        :label-width="formConfig.labelWidth + 'px'"
        :label-position="formConfig.labelPosition"
        :size="formConfig.size"
        :inline="formConfig.inline"
        :disabled="formConfig.disabled"
      >
        <el-row :gutter="formConfig.gutter">
          <el-col v-for="field in formFields" :key="field.id" :span="field.span || 24">
            <el-form-item
              v-if="!field.hidden"
              :label="field.label"
              :required="field.required"
            >
              <el-input :placeholder="field.placeholder" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="previewVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleSubmitPreview">提交</el-button>
      </template>
    </el-dialog>

    <!-- JSON预览弹窗 -->
    <el-dialog v-model="jsonVisible" title="表单JSON配置" width="60%" top="5vh" destroy-on-close>
      <div class="json-preview">
        <el-input
          v-model="jsonContent"
          type="textarea"
          :rows="20"
          readonly
        />
      </div>
      <template #footer>
        <el-button @click="handleCopyJson">复制JSON</el-button>
        <el-button @click="jsonVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 导入JSON弹窗 -->
    <el-dialog v-model="importVisible" title="导入JSON配置" width="60%" top="5vh" destroy-on-close>
      <el-input
        v-model="importJsonContent"
        type="textarea"
        :rows="20"
        placeholder="请粘贴JSON配置"
      />
      <template #footer>
        <el-button @click="importVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmImport">确认导入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Download, CopyDocument, Delete } from '@element-plus/icons-vue'
import ComponentPanel from '@/components/forms/ComponentPanel.vue'
import CanvasPanel from '@/components/forms/CanvasPanel.vue'
import ConfigPanel from '@/components/forms/ConfigPanel.vue'

const route = useRoute()
const router = useRouter()

// ── 状态 ──
const formId = ref<number>(0)
const formName = ref<string>('')
const rightTab = ref<'component' | 'form'>('component')
const selectedField = ref<any>(null)
const previewVisible = ref(false)
const jsonVisible = ref(false)
const importVisible = ref(false)
const jsonContent = ref('')
const importJsonContent = ref('')

// ── 历史记录 ──
const historyList = ref<any[][]>([[]])
const historyIndex = ref(0)

// ── 表单配置 ──
const formConfig = reactive({
  formName: 'elForm',
  modelName: 'formData',
  rulesName: 'rules',
  labelWidth: 100,
  gutter: 15,
  labelPosition: 'right' as 'left' | 'right' | 'top',
  size: 'default' as 'default' | 'small' | 'mini',
  inline: false,
  disabled: false,
  showButtons: true,
  showUnselected: false,
  componentBorder: true
})

// ── 表单字段 ──
const formFields = ref<any[]>([])

let fieldIdCounter = 0

// ── 生命周期 ──
onMounted(() => {
  formId.value = Number(route.query.formId) || 0
  formName.value = (route.query.formName as string) || '未命名表单'
  formConfig.formName = formName.value

  // 默认添加一个单行文本组件
  addField({
    type: 'input',
    typeName: '单行文本',
    label: '单行文本',
    placeholder: '请输入单行文本'
  })
})

// ── 监听字段变化，记录历史 ──
watch(formFields, (newVal) => {
  const snapshot = JSON.parse(JSON.stringify(newVal))
  if (historyIndex.value < historyList.value.length - 1) {
    historyList.value = historyList.value.slice(0, historyIndex.value + 1)
  }
  historyList.value.push(snapshot)
  historyIndex.value = historyList.value.length - 1
}, { deep: true })

// ── 添加字段 ──
function addComponent(comp: any) {
  addField(comp)
}

function handleDrop(comp: any) {
  addField(comp)
}

function addField(comp: any) {
  fieldIdCounter++
  const newField = {
    id: `field_${fieldIdCounter}`,
    type: comp.type,
    typeName: comp.typeName,
    field: `field_${fieldIdCounter}`,
    label: comp.label,
    placeholder: comp.placeholder || `请输入${comp.label}`,
    required: false,
    disabled: false,
    readonly: false,
    hidden: false,
    defaultValue: comp.type === 'switch' ? false : comp.type === 'checkbox' ? [] : '',
    validation: '',
    validationRules: [] as { pattern: string; message: string }[],
    span: 24,
    labelWidth: '',
    componentWidth: '100%',
    prefix: '',
    suffix: '',
    prefixIcon: '',
    suffixIcon: '',
    maxLength: '',
    showWordLimit: false,
    clearable: true,
    options: comp.options ? [...comp.options] : undefined,
    min: comp.min,
    max: comp.max,
    step: comp.step,
    dateType: comp.dateType,
    format: comp.format,
    fileType: comp.fileType,
    limit: comp.limit,
    sizeLimit: comp.sizeLimit,
  }
  formFields.value.push(newField)
  selectedField.value = newField
  rightTab.value = 'component'
}

// ── 字段操作 ──
function selectField(field: any) {
  selectedField.value = field
  rightTab.value = 'component'
}

function copyField(index: number) {
  const original = formFields.value[index]
  fieldIdCounter++
  const copy = JSON.parse(JSON.stringify(original))
  copy.id = `field_${fieldIdCounter}`
  copy.field = `field_${fieldIdCounter}`
  copy.label = copy.label + ' 副本'
  formFields.value.splice(index + 1, 0, copy)
  selectedField.value = copy
  ElMessage.success('复制成功')
}

function removeField(index: number) {
  const field = formFields.value[index]
  if (selectedField.value?.id === field.id) {
    selectedField.value = null
  }
  formFields.value.splice(index, 1)
}

// ── 清空 ──
function handleClear() {
  ElMessageBox.confirm('确定要清空所有字段吗？', '确认清空', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    formFields.value = []
    selectedField.value = null
    ElMessage.success('已清空')
  }).catch(() => {})
}

// ── 预览 ──
function handleSubmitPreview() {
  ElMessage.success('提交成功')
  previewVisible.value = false
}

// ── 导出Vue文件 ──
function handleExportVue() {
  ElMessage.success('Vue文件导出成功')
}

// ── 保存草稿 ──
function handleSaveDraft() {
  const formData = {
    formId: formId.value,
    formName: formConfig.formName,
    config: { ...formConfig },
    list: formFields.value,
    status: 'draft'
  }
  console.log('保存草稿:', formData)
  ElMessage.success('草稿保存成功')
}

// ── 立即发布 ──
function handlePublish() {
  ElMessageBox.confirm('确定要发布该表单吗？发布后将无法直接修改。', '确认发布', {
    confirmButtonText: '确认发布',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    const formData = {
      formId: formId.value,
      formName: formConfig.formName,
      config: { ...formConfig },
      list: formFields.value,
      status: 'published'
    }
    console.log('发布表单:', formData)
    ElMessage.success('表单发布成功')
  }).catch(() => {})
}

// ── 复制代码 ──
function handleCopyCode() {
  const code = generateVueCode()
  navigator.clipboard.writeText(code).then(() => {
    ElMessage.success('代码已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

function generateVueCode(): string {
  let template = '<template>\n  <el-form label-width="' + formConfig.labelWidth + 'px">\n'
  formFields.value.forEach(field => {
    if (!field.hidden) {
      template += `    <el-form-item label="${field.label}"${field.required ? ' required' : ''}>\n`
      template += `      <el-input placeholder="${field.placeholder}" />\n`
      template += '    </el-form-item>\n'
    }
  })
  template += '  </el-form>\n</template>'
  return template
}

// ── JSON导出/导入 ──
function handleCopyJson() {
  const json = {
    config: { ...formConfig },
    list: formFields.value.map(f => ({
      ...f,
      options: f.options ? [...f.options] : undefined
    }))
  }
  jsonContent.value = JSON.stringify(json, null, 2)
  navigator.clipboard.writeText(jsonContent.value).then(() => {
    ElMessage.success('JSON已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

function handleConfirmImport() {
  try {
    const data = JSON.parse(importJsonContent.value)
    if (data.list && Array.isArray(data.list)) {
      formFields.value = data.list
      if (data.config) {
        Object.assign(formConfig, data.config)
      }
      fieldIdCounter = formFields.value.length
      importVisible.value = false
      ElMessage.success('导入成功')
    } else {
      ElMessage.error('JSON格式不正确')
    }
  } catch (e) {
    ElMessage.error('JSON解析失败')
  }
}

// ── 返回 ──
function handleBack() {
  router.push('/dispatch/basic/form')
}
</script>

<style lang="scss" scoped>
.form-designer {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f0f2f5;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;

  // 顶部工具栏
  .designer-header {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 12px;
    background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
    border-bottom: 1px solid #e4e7ed;
    gap: 8px;
    flex-shrink: 0;
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.02);

    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-right: 8px;

      .title-icon {
        color: #409EFF;
      }

      .title-text {
        font-size: 15px;
        font-weight: 600;
        background: linear-gradient(135deg, #67C23A 0%, #409EFF 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .header-divider {
      width: 1px;
      height: 20px;
      background: #e4e7ed;
      margin: 0 4px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 4px;

      .el-button {
        color: #606266;

        &:hover {
          color: #409EFF;
          background: #f0f7ff;
        }
      }
    }

    .header-spacer {
      flex: 1;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  // 设计器主体
  .designer-body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
}

// JSON预览样式
.json-preview {
  :deep(.el-textarea__inner) {
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    font-size: 12px;
    background: #f5f7fa;
  }
}
</style>
