<template>
  <div
    class="canvas-area"
    @dragover.prevent
    @drop="handleDrop"
  >
    <div class="canvas-content">
      <div v-if="fields.length === 0" class="empty-tip">
        <el-icon :size="48"><Plus /></el-icon>
        <p>从左侧拖拽组件到此处</p>
        <p class="sub-tip">或点击组件直接添加</p>
      </div>
      <transition-group name="field-list" tag="div">
        <div
          v-for="(field, index) in fields"
          :key="field.id"
          class="field-item"
          :class="{ active: selectedField?.id === field.id }"
          @click="$emit('select', field)"
        >
          <div class="field-drag-handle">
            <el-icon><Rank /></el-icon>
          </div>
          <div class="field-wrapper">
            <div class="field-label">
              <span v-if="field.required" class="required-mark">*</span>
              {{ field.label }}
            </div>
            <div class="field-widget">
              <!-- 单行文本 -->
              <el-input
                v-if="field.type === 'input'"
                v-model="field.defaultValue"
                :placeholder="field.placeholder"
                :clearable="field.clearable"
                :disabled="field.disabled"
                :readonly="field.readonly"
                :show-word-limit="field.showWordLimit"
                :maxlength="field.maxLength || undefined"
              >
                <template v-if="field.prefixIcon" #prefix>
                  <el-icon><component :is="field.prefixIcon" /></el-icon>
                </template>
                <template v-if="field.suffixIcon" #suffix>
                  <el-icon><component :is="field.suffixIcon" /></el-icon>
                </template>
                <template v-if="field.prefix" #prepend>{{ field.prefix }}</template>
                <template v-if="field.suffix" #append>{{ field.suffix }}</template>
              </el-input>

              <!-- 多行文本 -->
              <el-input
                v-else-if="field.type === 'textarea'"
                v-model="field.defaultValue"
                type="textarea"
                :placeholder="field.placeholder"
                :rows="3"
                :disabled="field.disabled"
                :readonly="field.readonly"
              />

              <!-- 密码 -->
              <el-input
                v-else-if="field.type === 'password'"
                v-model="field.defaultValue"
                type="password"
                show-password
                :placeholder="field.placeholder"
                :clearable="field.clearable"
                :disabled="field.disabled"
              />

              <!-- 计数器 -->
              <el-input-number
                v-else-if="field.type === 'number'"
                v-model="field.defaultValue"
                :min="field.min"
                :max="field.max"
                :step="field.step"
                :disabled="field.disabled"
              />

              <!-- 下拉选择 -->
              <el-select
                v-else-if="field.type === 'select'"
                v-model="field.defaultValue"
                :placeholder="field.placeholder"
                :clearable="field.clearable"
                :disabled="field.disabled"
                style="width: 100%"
              >
                <el-option
                  v-for="opt in field.options"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>

              <!-- 级联选择 -->
              <el-cascader
                v-else-if="field.type === 'cascader'"
                v-model="field.defaultValue"
                :placeholder="field.placeholder"
                :clearable="field.clearable"
                :disabled="field.disabled"
                style="width: 100%"
              />

              <!-- 单选框组 -->
              <el-radio-group
                v-else-if="field.type === 'radio'"
                v-model="field.defaultValue"
                :disabled="field.disabled"
              >
                <el-radio
                  v-for="opt in (field.options && field.options.length ? field.options : defaultRadioOptions)"
                  :key="opt.value"
                  :value="opt.value"
                >{{ opt.label }}</el-radio>
              </el-radio-group>

              <!-- 多选框组 -->
              <el-checkbox-group
                v-else-if="field.type === 'checkbox'"
                v-model="field.defaultValue"
                :disabled="field.disabled"
              >
                <el-checkbox
                  v-for="opt in (field.options && field.options.length ? field.options : defaultCheckboxOptions)"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-checkbox-group>

              <!-- 开关 -->
              <el-switch
                v-else-if="field.type === 'switch'"
                v-model="field.defaultValue"
                :disabled="field.disabled"
              />

              <!-- 滑块 -->
              <el-slider
                v-else-if="field.type === 'slider'"
                v-model="field.defaultValue"
                :disabled="field.disabled"
              />

              <!-- 时间选择 -->
              <el-time-picker
                v-else-if="field.type === 'time'"
                v-model="field.defaultValue"
                :placeholder="field.placeholder"
                :clearable="field.clearable"
                :disabled="field.disabled"
                style="width: 100%"
              />

              <!-- 时间范围 -->
              <el-time-picker
                v-else-if="field.type === 'time-range'"
                v-model="field.defaultValue"
                is-range
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :clearable="field.clearable"
                :disabled="field.disabled"
                style="width: 100%"
              />

              <!-- 日期选择 -->
              <el-date-picker
                v-else-if="field.type === 'date'"
                v-model="field.defaultValue"
                :type="field.dateType || 'date'"
                :placeholder="field.placeholder"
                :format="field.format || 'yyyy-MM-dd'"
                :value-format="field.format || 'yyyy-MM-dd'"
                :clearable="field.clearable"
                :disabled="field.disabled"
                style="width: 100%"
              />

              <!-- 日期范围 -->
              <el-date-picker
                v-else-if="field.type === 'date-range'"
                v-model="field.defaultValue"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :clearable="field.clearable"
                :disabled="field.disabled"
                style="width: 100%"
              />

              <!-- 评分 -->
              <el-rate
                v-else-if="field.type === 'rate'"
                v-model="field.defaultValue"
                :disabled="field.disabled"
                allow-half
              />

              <!-- 颜色选择 -->
              <el-color-picker
                v-else-if="field.type === 'color'"
                v-model="field.defaultValue"
                :disabled="field.disabled"
              />

              <!-- 文件上传 -->
              <el-upload
                v-else-if="field.type === 'file'"
                action="#"
                :auto-upload="false"
                :disabled="field.disabled"
              >
                <el-button type="primary" :disabled="field.disabled">点击上传</el-button>
              </el-upload>

              <!-- 行容器 -->
              <div
                v-else-if="field.type === 'row'"
                class="row-container"
              >
                <span class="row-placeholder">行容器</span>
              </div>

              <!-- 按钮 -->
              <el-button
                v-else-if="field.type === 'button'"
                type="primary"
                :disabled="field.disabled"
              >{{ field.label }}</el-button>
            </div>
          </div>
          <div class="field-actions">
            <el-tooltip content="复制" placement="top">
              <el-icon class="copy-btn" @click.stop="$emit('copy', index)"><CopyDocument /></el-icon>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-icon class="delete-btn" @click.stop="$emit('remove', index)"><Delete /></el-icon>
            </el-tooltip>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Rank, CopyDocument, Delete } from '@element-plus/icons-vue'

interface FieldOption {
  label: string
  value: string
}

interface FormField {
  id: string
  type: string
  typeName: string
  field: string
  label: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  hidden?: boolean
  defaultValue?: any
  validation?: string
  validationRules?: { pattern: string; message: string }[]
  span?: number
  labelWidth?: string
  componentWidth?: string
  prefix?: string
  suffix?: string
  prefixIcon?: string
  suffixIcon?: string
  maxLength?: string
  showWordLimit?: boolean
  clearable?: boolean
  options?: FieldOption[]
  min?: number
  max?: number
  step?: number
  dateType?: string
  format?: string
  fileType?: string
  limit?: number
  sizeLimit?: number
}

const props = defineProps<{
  fields: FormField[]
  selectedField?: FormField | null
}>()

const defaultRadioOptions = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' }
]

const defaultCheckboxOptions = [
  { label: '选项一', value: '1' },
  { label: '选项二', value: '2' }
]

const emit = defineEmits<{
  (e: 'select', field: FormField): void
  (e: 'copy', index: number): void
  (e: 'remove', index: number): void
  (e: 'add', comp: any): void
  (e: 'drop', comp: any): void
}>()

function handleDrop(event: DragEvent) {
  const data = event.dataTransfer?.getData('componentData')
  if (!data) return
  const comp = JSON.parse(data)
  emit('drop', comp)
}
</script>

<style lang="scss" scoped>
.canvas-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f0f2f5;

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

    .field-drag-handle {
      margin-right: 12px;
      color: #c0c4cc;
      cursor: move;

      &:hover {
        color: #409EFF;
      }
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
        font-size: 14px;
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

        .row-container {
          padding: 20px;
          border: 1px dashed #dcdfe6;
          border-radius: 4px;
          text-align: center;
          color: #909399;
          background: #fafafa;
        }
      }
    }

    .field-actions {
      display: flex;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.2s;

      .el-icon {
        font-size: 16px;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;

          &.copy-btn {
            color: #409EFF;

            &:hover {
              background: #ecf5ff;
            }
          }

          &.delete-btn {
            color: #F56C6C;

            &:hover {
              background: #fef0f0;
            }
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
</style>
