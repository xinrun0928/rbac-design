<template>
  <div class="form-designer">
    <el-card class="designer-card" shadow="never">
      <!-- 顶部工具栏 -->
      <div class="designer-header">
        <div class="header-left">
          <el-button :icon="ArrowLeft" @click="handleBack">返回</el-button>
          <span class="form-title">{{ formName }}</span>
        </div>
        <div class="header-center">
          <el-button-group>
            <el-button :icon="RefreshLeft" :disabled="historyIndex <= 0" @click="handleUndo">撤销</el-button>
            <el-button :icon="RefreshRight" :disabled="historyIndex >= historyList.length - 1" @click="handleRedo">重做</el-button>
          </el-button-group>
        </div>
        <div class="header-right">
          <el-button :icon="View" @click="handlePreview">预览</el-button>
          <el-button :icon="Document" @click="handleExportJson">JSON</el-button>
          <el-button :icon="Upload" @click="handleImportJson">导入</el-button>
          <el-button :icon="Delete" type="danger" @click="handleClear">清空</el-button>
          <el-button type="primary" :icon="DocumentChecked" @click="handleSave">保存</el-button>
        </div>
      </div>

      <!-- 设计器主体 -->
      <div class="designer-body">
        <!-- 左侧组件面板 -->
        <div class="component-panel">
          <el-scrollbar height="100%">
            <div class="panel-section">
              <div class="section-title">基础组件</div>
              <div class="component-list">
                <div
                  v-for="comp in basicComponents"
                  :key="comp.type"
                  class="component-item"
                  draggable="true"
                  @dragstart="handleDragStart($event, comp)"
                  @click="addComponent(comp)"
                >
                  <el-icon><component :is="comp.icon" /></el-icon>
                  <span>{{ comp.label }}</span>
                </div>
              </div>
            </div>
            <div class="panel-section">
              <div class="section-title">选择组件</div>
              <div class="component-list">
                <div
                  v-for="comp in selectComponents"
                  :key="comp.type"
                  class="component-item"
                  draggable="true"
                  @dragstart="handleDragStart($event, comp)"
                  @click="addComponent(comp)"
                >
                  <el-icon><component :is="comp.icon" /></el-icon>
                  <span>{{ comp.label }}</span>
                </div>
              </div>
            </div>
            <div class="panel-section">
              <div class="section-title">高级组件</div>
              <div class="component-list">
                <div
                  v-for="comp in advancedComponents"
                  :key="comp.type"
                  class="component-item"
                  draggable="true"
                  @dragstart="handleDragStart($event, comp)"
                  @click="addComponent(comp)"
                >
                  <el-icon><component :is="comp.icon" /></el-icon>
                  <span>{{ comp.label }}</span>
                </div>
              </div>
            </div>
            <div class="panel-section">
              <div class="section-title">布局组件</div>
              <div class="component-list">
                <div
                  v-for="comp in layoutComponents"
                  :key="comp.type"
                  class="component-item"
                  draggable="true"
                  @dragstart="handleDragStart($event, comp)"
                  @click="addComponent(comp)"
                >
                  <el-icon><component :is="comp.icon" /></el-icon>
                  <span>{{ comp.label }}</span>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>

        <!-- 中间画布区域 -->
        <div
          class="canvas-area"
          @dragover.prevent
          @drop="handleDrop"
        >
          <div class="canvas-header">
            <span>表单画布</span>
            <span class="field-count">已添加 {{ formFields.length }} 个字段</span>
          </div>
          <div class="canvas-content">
            <div v-if="formFields.length === 0" class="empty-tip">
              <el-icon :size="48"><Plus /></el-icon>
              <p>从左侧拖拽组件到此处</p>
              <p class="sub-tip">或点击组件直接添加</p>
            </div>
            <transition-group name="field-list" tag="div">
              <div
                v-for="(field, index) in formFields"
                :key="field.id"
                class="field-item"
                :class="{ active: selectedField?.id === field.id }"
                @click="selectField(field)"
              >
                <div class="field-wrapper">
                  <div class="field-label">
                    <span v-if="field.required" class="required-mark">*</span>
                    {{ field.label }}
                  </div>
                  <div class="field-widget">
                    <component
                      :is="getWidgetComponent(field)"
                      v-bind="getFieldProps(field)"
                      :placeholder="field.placeholder"
                      disabled
                    />
                  </div>
                </div>
                <div class="field-actions">
                  <el-tooltip content="复制" placement="top">
                    <el-icon @click.stop="copyField(index)"><CopyDocument /></el-icon>
                  </el-tooltip>
                  <el-tooltip content="删除" placement="top">
                    <el-icon class="delete-icon" @click.stop="removeField(index)"><Delete /></el-icon>
                  </el-tooltip>
                </div>
                <div class="field-sort">
                  <el-icon :class="{ disabled: index === 0 }" @click.stop="moveField(index, -1)"><Top /></el-icon>
                  <el-icon :class="{ disabled: index === formFields.length - 1 }" @click.stop="moveField(index, 1)"><Bottom /></el-icon>
                </div>
              </div>
            </transition-group>
          </div>
        </div>

        <!-- 右侧配置面板 -->
        <div class="config-panel">
          <el-tabs v-model="configTab" type="border-card">
            <!-- 表单属性 -->
            <el-tab-pane label="表单属性" name="form">
              <el-form label-width="90px" label-position="left" size="small">
                <el-form-item label="表单名称">
                  <el-input v-model="formConfig.formName" placeholder="请输入表单名称" />
                </el-form-item>
                <el-form-item label="标签宽度">
                  <el-input-number v-model="formConfig.labelWidth" :min="60" :max="200" :step="10" />
                </el-form-item>
                <el-form-item label="标签位置">
                  <el-radio-group v-model="formConfig.labelPosition">
                    <el-radio value="left">左对齐</el-radio>
                    <el-radio value="right">右对齐</el-radio>
                    <el-radio value="top">顶部</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="组件大小">
                  <el-radio-group v-model="formConfig.size">
                    <el-radio value="large">大</el-radio>
                    <el-radio value="default">中</el-radio>
                    <el-radio value="small">小</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="行内模式">
                  <el-switch v-model="formConfig.inline" />
                </el-form-item>
                <el-form-item label="禁用表单">
                  <el-switch v-model="formConfig.disabled" />
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <!-- 字段属性 -->
            <el-tab-pane label="字段属性" name="field">
              <div v-if="selectedField" class="field-config">
                <el-form label-width="90px" label-position="left" size="small">
                  <el-form-item label="字段类型">
                    <el-input :model-value="selectedField.typeName" disabled />
                  </el-form-item>
                  <el-form-item label="字段标识">
                    <el-input v-model="selectedField.field" placeholder="请输入字段标识" />
                  </el-form-item>
                  <el-form-item label="字段名称">
                    <el-input v-model="selectedField.label" placeholder="请输入字段名称" />
                  </el-form-item>
                  <el-form-item label="占位提示">
                    <el-input v-model="selectedField.placeholder" placeholder="请输入占位提示" />
                  </el-form-item>
                  <el-form-item label="默认值">
                    <el-input v-model="selectedField.defaultValue" placeholder="请输入默认值" />
                  </el-form-item>
                  <el-form-item label="是否必填">
                    <el-switch v-model="selectedField.required" />
                  </el-form-item>
                  <el-form-item label="是否禁用">
                    <el-switch v-model="selectedField.disabled" />
                  </el-form-item>
                  <el-form-item label="是否只读">
                    <el-switch v-model="selectedField.readonly" />
                  </el-form-item>
                  <el-form-item label="是否隐藏">
                    <el-switch v-model="selectedField.hidden" />
                  </el-form-item>

                  <!-- 数字输入框特有属性 -->
                  <template v-if="selectedField.type === 'number'">
                    <el-form-item label="最小值">
                      <el-input-number v-model="selectedField.min" :controls="false" />
                    </el-form-item>
                    <el-form-item label="最大值">
                      <el-input-number v-model="selectedField.max" :controls="false" />
                    </el-form-item>
                    <el-form-item label="步长">
                      <el-input-number v-model="selectedField.step" :min="1" :controls="false" />
                    </el-form-item>
                  </template>

                  <!-- 选择类组件特有属性 -->
                  <template v-if="['select', 'radio', 'checkbox'].includes(selectedField.type)">
                    <el-form-item label="选项配置">
                      <div class="options-config">
                        <div v-for="(opt, idx) in selectedField.options" :key="idx" class="option-row">
                          <el-input v-model="opt.label" placeholder="标签" size="small" />
                          <el-input v-model="opt.value" placeholder="值" size="small" />
                          <el-icon class="delete-option" @click="removeOption(Number(idx))"><Delete /></el-icon>
                        </div>
                        <el-button type="primary" link :icon="Plus" @click="addOption">添加选项</el-button>
                      </div>
                    </el-form-item>
                  </template>

                  <!-- 日期选择器特有属性 -->
                  <template v-if="selectedField.type === 'date'">
                    <el-form-item label="日期类型">
                      <el-select v-model="selectedField.dateType" style="width: 100%">
                        <el-option label="日期" value="date" />
                        <el-option label="日期时间" value="datetime" />
                        <el-option label="周" value="week" />
                        <el-option label="月" value="month" />
                        <el-option label="年" value="year" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="格式化">
                      <el-input v-model="selectedField.format" placeholder="如: yyyy-MM-dd" />
                    </el-form-item>
                  </template>

                  <!-- 文件上传特有属性 -->
                  <template v-if="selectedField.type === 'file'">
                    <el-form-item label="上传类型">
                      <el-select v-model="selectedField.fileType" style="width: 100%">
                        <el-option label="任意文件" value="all" />
                        <el-option label="图片" value="image" />
                        <el-option label="视频" value="video" />
                        <el-option label="音频" value="audio" />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="文件数量">
                      <el-input-number v-model="selectedField.limit" :min="1" :max="10" />
                    </el-form-item>
                    <el-form-item label="文件大小(MB)">
                      <el-input-number v-model="selectedField.sizeLimit" :min="1" :max="100" />
                    </el-form-item>
                  </template>

                  <!-- 校验规则 -->
                  <el-form-item label="校验规则">
                    <el-select v-model="selectedField.validation" placeholder="请选择" clearable style="width: 100%">
                      <el-option label="手机号" value="phone" />
                      <el-option label="邮箱" value="email" />
                      <el-option label="身份证" value="idcard" />
                      <el-option label="网址" value="url" />
                      <el-option label="IP地址" value="ip" />
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
              <div v-else class="empty-property">
                <el-icon :size="48"><InfoFilled /></el-icon>
                <p>请选择字段进行配置</p>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-card>

    <!-- 预览弹窗 -->
    <el-dialog v-model="previewVisible" title="表单预览" width="70%" top="5vh" destroy-on-close>
      <el-form
        :label-width="formConfig.labelWidth + 'px'"
        :label-position="formConfig.labelPosition"
        :size="formConfig.size"
        :inline="formConfig.inline"
        :disabled="formConfig.disabled"
      >
        <el-row :gutter="20">
          <el-col v-for="field in formFields" :key="field.id" :span="field.span || 24">
            <el-form-item
              v-if="!field.hidden"
              :label="field.label"
              :required="field.required"
            >
              <component
                :is="getWidgetComponent(field)"
                v-bind="getFieldProps(field)"
                :placeholder="field.placeholder"
                v-model="previewFormData[field.field]"
              />
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
import {
  ArrowLeft, RefreshLeft, RefreshRight, View, Upload,
  Delete, Plus, InfoFilled, DocumentChecked, CopyDocument,
  Top, Bottom, EditPen, Calendar, Select, Timer,
  SwitchButton, UploadFilled, Document, Edit, Cellphone,
  Picture, VideoCamera, Headset, DataLine, Grid, Monitor,
  Star
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

// ── 状态 ──
const formId = ref<number>(0)
const formName = ref<string>('')
const configTab = ref('form')
const selectedField = ref<any>(null)
const previewVisible = ref(false)
const jsonVisible = ref(false)
const importVisible = ref(false)
const jsonContent = ref('')
const importJsonContent = ref('')
const previewFormData = ref<Record<string, any>>({})

// ── 历史记录 ──
const historyList = ref<any[][]>([[]])
const historyIndex = ref(0)

// ── 表单配置 ──
const formConfig = reactive({
  formName: '',
  labelWidth: 100,
  labelPosition: 'right' as 'left' | 'right' | 'top',
  size: 'default' as 'large' | 'default' | 'small',
  inline: false,
  disabled: false
})

// ── 表单字段 ──
const formFields = ref<any[]>([])

// ── 组件定义 ──
const basicComponents = [
  { type: 'input', typeName: '单行输入', label: '单行输入', icon: EditPen, placeholder: '请输入' },
  { type: 'textarea', typeName: '多行输入', label: '多行输入', icon: Edit, placeholder: '请输入' },
  { type: 'number', typeName: '数字输入', label: '数字输入', icon: DataLine, placeholder: '请输入' },
]

const selectComponents = [
  { type: 'select', typeName: '下拉选择', label: '下拉选择', icon: Select, placeholder: '请选择', options: [] },
  { type: 'radio', typeName: '单选按钮', label: '单选按钮', icon: Select, options: [] },
  { type: 'checkbox', typeName: '复选框', label: '复选框', icon: Select, options: [] },
]

const advancedComponents = [
  { type: 'date', typeName: '日期选择', label: '日期选择', icon: Calendar, placeholder: '请选择日期', dateType: 'date', format: 'yyyy-MM-dd' },
  { type: 'time', typeName: '时间选择', label: '时间选择', icon: Timer, placeholder: '请选择时间' },
  { type: 'switch', typeName: '开关', label: '开关', icon: SwitchButton },
  { type: 'rate', typeName: '评分', label: '评分', icon: Star },
  { type: 'color', typeName: '颜色选择', label: '颜色选择', icon: Picture },
  { type: 'slider', typeName: '滑块', label: '滑块', icon: DataLine },
  { type: 'file', typeName: '文件上传', label: '文件上传', icon: UploadFilled, fileType: 'all', limit: 3, sizeLimit: 10 },
]

const layoutComponents = [
  { type: 'divider', typeName: '分割线', label: '分割线', icon: Grid },
]

let fieldIdCounter = 0

// ── 生命周期 ──
onMounted(() => {
  formId.value = Number(route.query.formId) || 0
  formName.value = (route.query.formName as string) || '未命名表单'
  formConfig.formName = formName.value
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

// ── 拖拽相关 ──
function handleDragStart(event: DragEvent, comp: any) {
  event.dataTransfer?.setData('componentData', JSON.stringify(comp))
}

function handleDrop(event: DragEvent) {
  const data = event.dataTransfer?.getData('componentData')
  if (!data) return
  const comp = JSON.parse(data)
  addField(comp)
}

function addComponent(comp: any) {
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
    defaultValue: '',
    validation: '',
    span: 24,
    options: comp.options ? [] : undefined,
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
}

// ── 字段操作 ──
function selectField(field: any) {
  selectedField.value = field
  configTab.value = 'field'
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

function moveField(index: number, direction: number) {
  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= formFields.value.length) return
  const temp = formFields.value[index]
  formFields.value[index] = formFields.value[newIndex]
  formFields.value[newIndex] = temp
  // 触发响应式更新
  formFields.value = [...formFields.value]
}

// ── 选项配置 ──
function addOption() {
  if (selectedField.value && selectedField.value.options) {
    selectedField.value.options.push({ label: '选项', value: `option_${Date.now()}` })
  }
}

function removeOption(index: number) {
  if (selectedField.value && selectedField.value.options) {
    selectedField.value.options.splice(index, 1)
  }
}

// ── 撤销重做 ──
function handleUndo() {
  if (historyIndex.value > 0) {
    historyIndex.value--
    formFields.value = JSON.parse(JSON.stringify(historyList.value[historyIndex.value]))
    selectedField.value = null
  }
}

function handleRedo() {
  if (historyIndex.value < historyList.value.length - 1) {
    historyIndex.value++
    formFields.value = JSON.parse(JSON.stringify(historyList.value[historyIndex.value]))
    selectedField.value = null
  }
}

// ── 组件渲染 ──
function getWidgetComponent(field: any) {
  const map: Record<string, string> = {
    input: 'el-input',
    textarea: 'el-input',
    number: 'el-input-number',
    select: 'el-select',
    radio: 'el-radio-group',
    checkbox: 'el-checkbox-group',
    date: 'el-date-picker',
    time: 'el-time-picker',
    switch: 'el-switch',
    rate: 'el-rate',
    color: 'el-color-picker',
    slider: 'el-slider',
    file: 'el-upload',
    divider: 'el-divider',
  }
  return map[field.type] || 'el-input'
}

function getFieldProps(field: any) {
  const props: Record<string, any> = {
    style: { width: '100%' }
  }

  if (field.type === 'textarea') {
    props.rows = 3
  }

  if (field.type === 'number') {
    if (field.min !== undefined) props.min = field.min
    if (field.max !== undefined) props.max = field.max
    if (field.step !== undefined) props.step = field.step
  }

  if (field.type === 'date') {
    props.type = field.dateType || 'date'
    props.format = field.format || 'yyyy-MM-dd'
    props.valueFormat = field.format || 'yyyy-MM-dd'
  }

  if (field.type === 'select') {
    props.options = field.options || []
  }

  if (field.type === 'radio' || field.type === 'checkbox') {
    // 使用 options 渲染
  }

  if (field.type === 'rate') {
    props.allowHalf = true
  }

  if (field.type === 'file') {
    props.action = '#'
    props.disabled = true
    props.autoUpload = false
  }

  if (field.type === 'switch') {
    props.modelValue = false
  }

  return props
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
function handlePreview() {
  previewFormData.value = {}
  formFields.value.forEach(field => {
    if (field.defaultValue) {
      previewFormData.value[field.field] = field.defaultValue
    }
  })
  previewVisible.value = true
}

function handleSubmitPreview() {
  ElMessage.success('提交成功')
  console.log('表单数据:', previewFormData.value)
  previewVisible.value = false
}

// ── JSON导出/导入 ──
function handleExportJson() {
  const json = {
    config: { ...formConfig },
    list: formFields.value.map(f => ({
      ...f,
      options: f.options ? [...f.options] : undefined
    }))
  }
  jsonContent.value = JSON.stringify(json, null, 2)
  jsonVisible.value = true
}

function handleCopyJson() {
  navigator.clipboard.writeText(jsonContent.value).then(() => {
    ElMessage.success('JSON已复制到剪贴板')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}

function handleImportJson() {
  importJsonContent.value = ''
  importVisible.value = true
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

// ── 保存 ──
function handleSave() {
  const formData = {
    formId: formId.value,
    formName: formConfig.formName,
    config: { ...formConfig },
    list: formFields.value
  }
  console.log('保存表单:', formData)
  ElMessage.success('保存成功')
}

// ── 返回 ──
function handleBack() {
  router.push('/dispatch/basic/form')
}
</script>

<style lang="scss" scoped>
.form-designer {
  padding: 0;
  background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;

  .designer-card {
    border-radius: 12px;
    border: none;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.el-card__body) {
      padding: 0;
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }
  }

  .designer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    border-bottom: 1px solid #ebeef5;
    background: #fff;

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;

      .form-title {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }
    }

    .header-center {
      display: flex;
      gap: 12px;
    }

    .header-right {
      display: flex;
      gap: 8px;
    }
  }

  .designer-body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  // 左侧组件面板
  .component-panel {
    width: 220px;
    background: #fff;
    border-right: 1px solid #ebeef5;
    overflow: hidden;

    .panel-section {
      padding: 16px;

      .section-title {
        font-size: 13px;
        font-weight: 600;
        color: #909399;
        margin-bottom: 12px;
        text-transform: uppercase;
      }

      .component-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }

      .component-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        padding: 10px 8px;
        background: #f5f7fa;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 12px;

        .el-icon {
          font-size: 18px;
        }

        &:hover {
          background: #ecf5ff;
          color: #409EFF;
          transform: translateY(-2px);
        }
      }
    }
  }

  // 中间画布区域
  .canvas-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #f0f2f5;

    .canvas-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
      background: #fafafa;
      border-bottom: 1px solid #ebeef5;
      font-size: 13px;
      color: #606266;

      .field-count {
        color: #909399;
      }
    }

    .canvas-content {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
    }

    .empty-tip {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 400px;
      color: #909399;
      background: #fff;
      border-radius: 8px;
      border: 2px dashed #dcdfe6;

      p {
        margin: 8px 0 0;
        font-size: 14px;
      }

      .sub-tip {
        font-size: 12px;
        color: #c0c4cc;
      }
    }

    .field-item {
      position: relative;
      display: flex;
      align-items: center;
      padding: 12px 16px;
      margin-bottom: 8px;
      background: #fff;
      border-radius: 6px;
      border: 1px solid #e4e7ed;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        border-color: #409EFF;

        .field-actions {
          opacity: 1;
        }
      }

      &.active {
        border-color: #409EFF;
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
      }

      .field-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;

        .field-label {
          width: 100px;
          flex-shrink: 0;
          font-size: 13px;
          color: #606266;
          text-align: right;

          .required-mark {
            color: #F56C6C;
            margin-right: 4px;
          }
        }

        .field-widget {
          flex: 1;
          min-width: 0;
        }
      }

      .field-actions {
        position: absolute;
        right: 40px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        gap: 8px;
        opacity: 0;
        transition: opacity 0.2s;

        .el-icon {
          font-size: 16px;
          cursor: pointer;
          color: #909399;
          padding: 4px;
          border-radius: 4px;

          &:hover {
            color: #409EFF;
            background: #ecf5ff;
          }

          &.delete-icon:hover {
            color: #F56C6C;
            background: #fef0f0;
          }
        }
      }

      .field-sort {
        position: absolute;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        gap: 2px;

        .el-icon {
          font-size: 12px;
          cursor: pointer;
          color: #c0c4cc;
          padding: 2px;

          &:hover {
            color: #409EFF;
          }

          &.disabled {
            opacity: 0.3;
            cursor: not-allowed;
          }
        }
      }
    }

    .field-list-enter-active,
    .field-list-leave-active {
      transition: all 0.3s ease;
    }

    .field-list-enter-from,
    .field-list-leave-to {
      opacity: 0;
      transform: translateX(-30px);
    }
  }

  // 右侧配置面板
  .config-panel {
    width: 320px;
    background: #fff;
    border-left: 1px solid #ebeef5;
    overflow: hidden;

    :deep(.el-tabs) {
      height: 100%;
      border: none;
      box-shadow: none;

      .el-tabs__content {
        padding: 16px;
        height: calc(100% - 40px);
        overflow-y: auto;
      }

      .el-tab-pane {
        height: 100%;
      }
    }

    .field-config {
      :deep(.el-form-item) {
        margin-bottom: 16px;
      }
    }

    .options-config {
      width: 100%;

      .option-row {
        display: flex;
        gap: 8px;
        margin-bottom: 8px;
        align-items: center;

        .el-input {
          flex: 1;
        }

        .delete-option {
          cursor: pointer;
          color: #F56C6C;

          &:hover {
            color: #f78989;
          }
        }
      }
    }

    .empty-property {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
      color: #909399;

      p {
        margin-top: 12px;
        font-size: 14px;
      }
    }
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
