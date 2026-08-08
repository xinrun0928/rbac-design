<template>
  <div class="form-designer">
    <el-card class="designer-card" shadow="never">
      <!-- 顶部工具栏 -->
      <div class="designer-header">
        <div class="header-left">
          <el-button :icon="ArrowLeft" @click="handleBack">返回</el-button>
          <span class="form-title">{{ formName }}</span>
        </div>
        <div class="header-right">
          <el-button :icon="View" @click="handlePreview">预览</el-button>
          <el-button type="primary" :icon="DocumentChecked" @click="handleSave">保存</el-button>
        </div>
      </div>

      <!-- 设计器主体 -->
      <div class="designer-body">
        <!-- 左侧组件面板 -->
        <div class="component-panel">
          <div class="panel-title">基础组件</div>
          <div class="component-list">
            <div
              v-for="comp in basicComponents"
              :key="comp.type"
              class="component-item"
              draggable="true"
              @dragstart="handleDragStart($event, comp)"
            >
              <el-icon><component :is="comp.icon" /></el-icon>
              <span>{{ comp.label }}</span>
            </div>
          </div>
          <div class="panel-title">高级组件</div>
          <div class="component-list">
            <div
              v-for="comp in advancedComponents"
              :key="comp.type"
              class="component-item"
              draggable="true"
              @dragstart="handleDragStart($event, comp)"
            >
              <el-icon><component :is="comp.icon" /></el-icon>
              <span>{{ comp.label }}</span>
            </div>
          </div>
        </div>

        <!-- 中间画布区域 -->
        <div
          class="canvas-area"
          @dragover.prevent
          @drop="handleDrop"
        >
          <div class="canvas-header">
            <span>表单画布</span>
          </div>
          <div class="canvas-content">
            <div v-if="formFields.length === 0" class="empty-tip">
              <el-icon :size="48"><Plus /></el-icon>
              <p>拖拽组件到此处</p>
            </div>
            <div
              v-for="(field, index) in formFields"
              :key="field.id"
              class="field-item"
              :class="{ active: selectedField?.id === field.id }"
              @click="selectField(field)"
            >
              <div class="field-label">{{ field.label }}</div>
              <div class="field-widget">
                <component :is="getWidgetComponent(field)" v-bind="field.props" disabled />
              </div>
              <div class="field-actions">
                <el-icon @click.stop="moveField(index, -1)"><Top /></el-icon>
                <el-icon @click.stop="moveField(index, 1)"><Bottom /></el-icon>
                <el-icon class="delete-icon" @click.stop="removeField(index)"><Delete /></el-icon>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧属性面板 -->
        <div class="property-panel">
          <div class="panel-title">属性配置</div>
          <div v-if="selectedField" class="property-form">
            <el-form label-width="80px" label-position="left">
              <el-form-item label="字段标识">
                <el-input v-model="selectedField.field" :disabled="true" />
              </el-form-item>
              <el-form-item label="字段名称">
                <el-input v-model="selectedField.label" />
              </el-form-item>
              <el-form-item label="占位提示">
                <el-input v-model="selectedField.placeholder" />
              </el-form-item>
              <el-form-item label="是否必填">
                <el-switch v-model="selectedField.required" />
              </el-form-item>
              <el-form-item label="校验规则">
                <el-select v-model="selectedField.validation" placeholder="请选择" clearable>
                  <el-option label="手机号" value="phone" />
                  <el-option label="邮箱" value="email" />
                  <el-option label="身份证" value="idcard" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div v-else class="empty-property">
            <el-icon :size="48"><InfoFilled /></el-icon>
            <p>请选择左侧字段进行配置</p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft, View, DocumentChecked, Plus, Delete,
  Top, Bottom, InfoFilled, EditPen, Calendar,
  Select, SwitchButton, Timer, Upload
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const formId = ref<number>(0)
const formName = ref<string>('')

interface FormField {
  id: string
  type: string
  field: string
  label: string
  placeholder: string
  required: boolean
  validation?: string
  props: Record<string, any>
}

const selectedField = ref<FormField | null>(null)
const formFields = ref<FormField[]>([])

const basicComponents = [
  { type: 'input', label: '单行输入', icon: EditPen },
  { type: 'textarea', label: '多行输入', icon: EditPen },
  { type: 'number', label: '数字输入', icon: EditPen },
  { type: 'select', label: '下拉选择', icon: Select },
  { type: 'radio', label: '单选按钮', icon: Select },
  { type: 'checkbox', label: '复选框', icon: Select },
  { type: 'date', label: '日期选择', icon: Calendar },
  { type: 'time', label: '时间选择', icon: Timer },
]

const advancedComponents = [
  { type: 'switch', label: '开关', icon: SwitchButton },
  { type: 'file', label: '文件上传', icon: Upload },
]

let fieldIdCounter = 0

onMounted(() => {
  formId.value = Number(route.query.formId) || 0
  formName.value = (route.query.formName as string) || '未命名表单'
})

function handleDragStart(event: DragEvent, comp: { type: string; label: string }) {
  event.dataTransfer?.setData('componentType', comp.type)
  event.dataTransfer?.setData('componentLabel', comp.label)
}

function handleDrop(event: DragEvent) {
  const type = event.dataTransfer?.getData('componentType')
  const label = event.dataTransfer?.getData('componentLabel')
  if (!type || !label) return

  fieldIdCounter++
  const newField: FormField = {
    id: `field_${fieldIdCounter}`,
    type,
    field: `field_${fieldIdCounter}`,
    label,
    placeholder: `请输入${label}`,
    required: false,
    props: { style: { width: '100%' } }
  }
  formFields.value.push(newField)
  selectedField.value = newField
}

function selectField(field: FormField) {
  selectedField.value = field
}

function moveField(index: number, direction: number) {
  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= formFields.value.length) return
  const temp = formFields.value[index]
  formFields.value[index] = formFields.value[newIndex]
  formFields.value[newIndex] = temp
}

function removeField(index: number) {
  const field = formFields.value[index]
  if (selectedField.value?.id === field.id) {
    selectedField.value = null
  }
  formFields.value.splice(index, 1)
}

function getWidgetComponent(field: FormField) {
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
    file: 'el-upload',
  }
  return map[field.type] || 'el-input'
}

function handleBack() {
  router.push('/dispatch/basic/form')
}

function handlePreview() {
  ElMessage.info('预览功能开发中')
}

function handleSave() {
  ElMessage.success('保存成功')
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
    padding: 16px 20px;
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

    .header-right {
      display: flex;
      gap: 12px;
    }
  }

  .designer-body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .component-panel {
    width: 200px;
    background: #fff;
    border-right: 1px solid #ebeef5;
    overflow-y: auto;
    padding: 16px;

    .panel-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #ebeef5;
    }

    .component-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }

    .component-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: #f5f7fa;
      border-radius: 6px;
      cursor: grab;
      transition: all 0.2s;

      &:hover {
        background: #ecf5ff;
        color: #409EFF;
      }

      &:active {
        cursor: grabbing;
      }
    }
  }

  .canvas-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .canvas-header {
      padding: 12px 20px;
      background: #fafafa;
      border-bottom: 1px solid #ebeef5;
      font-size: 14px;
      color: #606266;
    }

    .canvas-content {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      background: #f0f2f5;
    }

    .empty-tip {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
      color: #909399;
      background: #fff;
      border-radius: 8px;
      border: 2px dashed #dcdfe6;

      p {
        margin-top: 12px;
        font-size: 14px;
      }
    }

    .field-item {
      display: flex;
      align-items: center;
      padding: 16px;
      margin-bottom: 12px;
      background: #fff;
      border-radius: 8px;
      border: 1px solid #ebeef5;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        border-color: #409EFF;
      }

      &.active {
        border-color: #409EFF;
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
      }

      .field-label {
        width: 120px;
        font-size: 14px;
        color: #303133;
        flex-shrink: 0;
      }

      .field-widget {
        flex: 1;
      }

      .field-actions {
        display: flex;
        gap: 8px;
        margin-left: 16px;
        color: #909399;

        .el-icon {
          cursor: pointer;
          font-size: 16px;

          &:hover {
            color: #409EFF;
          }
        }

        .delete-icon:hover {
          color: #F56C6C;
        }
      }
    }
  }

  .property-panel {
    width: 280px;
    background: #fff;
    border-left: 1px solid #ebeef5;
    overflow-y: auto;
    padding: 16px;

    .panel-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #ebeef5;
    }

    .property-form {
      :deep(.el-form-item) {
        margin-bottom: 16px;
      }
    }

    .empty-property {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: #909399;

      p {
        margin-top: 12px;
        font-size: 14px;
      }
    }
  }
}
</style>
