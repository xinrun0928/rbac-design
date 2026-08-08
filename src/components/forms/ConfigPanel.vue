<template>
  <div class="config-panel">
    <!-- 标签页切换 -->
    <div class="panel-tabs">
      <span
        class="tab-item"
        :class="{ active: activeTab === 'component' }"
        @click="$emit('update:activeTab', 'component')"
      >组件属性</span>
      <span
        class="tab-item"
        :class="{ active: activeTab === 'form' }"
        @click="$emit('update:activeTab', 'form')"
      >表单属性</span>
    </div>

    <!-- 组件属性 -->
    <div v-if="activeTab === 'component'" class="config-content">
      <div v-if="field" class="field-config">
        <el-form label-width="90px" label-position="left" size="default">
          <el-form-item label="组件类型">
            <el-select v-model="field.type" style="width: 100%" disabled>
              <el-option :label="field.typeName" :value="field.type" />
            </el-select>
          </el-form-item>
          <el-form-item label="字段名">
            <el-input v-model="field.field" placeholder="请输入字段标识" />
          </el-form-item>
          <el-form-item label="标题">
            <el-input v-model="field.label" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="占位提示">
            <el-input v-model="field.placeholder" placeholder="请输入占位提示" />
          </el-form-item>
          <el-form-item label="表单栅格">
            <el-slider v-model="field.span" :min="6" :max="24" :step="6" show-stops />
          </el-form-item>
          <el-form-item label="标签宽度">
            <el-input v-model="field.labelWidth" placeholder="请输入标签宽度" />
          </el-form-item>
          <el-form-item label="组件宽度">
            <el-input v-model="field.componentWidth" placeholder="100%" />
          </el-form-item>
          <el-form-item label="默认值">
            <el-input v-model="field.defaultValue" placeholder="请输入默认值" />
          </el-form-item>
          <el-form-item label="前缀">
            <el-input v-model="field.prefix" placeholder="请输入前缀" />
          </el-form-item>
          <el-form-item label="后缀">
            <el-input v-model="field.suffix" placeholder="请输入后缀" />
          </el-form-item>
          <el-form-item label="前图标">
            <div class="icon-input">
              <el-input v-model="field.prefixIcon" placeholder="请输入前图标名称" />
              <el-button @click="openIconPicker('prefix')">选择</el-button>
            </div>
          </el-form-item>
          <el-form-item label="后图标">
            <div class="icon-input">
              <el-input v-model="field.suffixIcon" placeholder="请输入后图标名称" />
              <el-button @click="openIconPicker('suffix')">选择</el-button>
            </div>
          </el-form-item>
          <el-form-item label="最多输入">
            <div class="input-with-unit">
              <el-input v-model="field.maxLength" placeholder="请输入字符长度" />
              <span class="unit">个字符</span>
            </div>
          </el-form-item>
          <el-form-item label="输入统计">
            <el-switch v-model="field.showWordLimit" />
          </el-form-item>
          <el-form-item label="能否清空">
            <el-switch v-model="field.clearable" />
          </el-form-item>
          <el-form-item label="是否只读">
            <el-switch v-model="field.readonly" />
          </el-form-item>
          <el-form-item label="是否禁用">
            <el-switch v-model="field.disabled" />
          </el-form-item>
          <el-form-item label="是否必填">
            <el-switch v-model="field.required" />
          </el-form-item>

          <!-- 数字输入框特有属性 -->
          <template v-if="field.type === 'number'">
            <el-form-item label="最小值">
              <el-input-number v-model="field.min" :controls="false" />
            </el-form-item>
            <el-form-item label="最大值">
              <el-input-number v-model="field.max" :controls="false" />
            </el-form-item>
            <el-form-item label="步长">
              <el-input-number v-model="field.step" :min="1" :controls="false" />
            </el-form-item>
          </template>

          <!-- 选择类组件特有属性 -->
          <template v-if="['select', 'radio', 'checkbox'].includes(field.type)">
            <el-form-item label="选项配置">
              <div class="options-config">
                <div v-for="(opt, idx) in field.options" :key="idx" class="option-row">
                  <el-input v-model="opt.label" placeholder="标签" size="small" />
                  <el-input v-model="opt.value" placeholder="值" size="small" />
                  <el-icon class="delete-option" @click="removeOption(idx)"><Delete /></el-icon>
                </div>
                <el-button type="primary" link :icon="Plus" @click="addOption">添加选项</el-button>
              </div>
            </el-form-item>
          </template>

          <!-- 日期选择器特有属性 -->
          <template v-if="field.type === 'date'">
            <el-form-item label="日期类型">
              <el-select v-model="field.dateType" style="width: 100%">
                <el-option label="日期" value="date" />
                <el-option label="日期时间" value="datetime" />
                <el-option label="周" value="week" />
                <el-option label="月" value="month" />
                <el-option label="年" value="year" />
              </el-select>
            </el-form-item>
            <el-form-item label="格式化">
              <el-input v-model="field.format" placeholder="如: yyyy-MM-dd" />
            </el-form-item>
          </template>

          <!-- 文件上传特有属性 -->
          <template v-if="field.type === 'file'">
            <el-form-item label="上传类型">
              <el-select v-model="field.fileType" style="width: 100%">
                <el-option label="任意文件" value="all" />
                <el-option label="图片" value="image" />
                <el-option label="视频" value="video" />
                <el-option label="音频" value="audio" />
              </el-select>
            </el-form-item>
            <el-form-item label="文件数量">
              <el-input-number v-model="field.limit" :min="1" :max="10" />
            </el-form-item>
            <el-form-item label="文件大小(MB)">
              <el-input-number v-model="field.sizeLimit" :min="1" :max="100" />
            </el-form-item>
          </template>
        </el-form>

        <!-- 正则校验分组 -->
        <div class="validation-group">
          <div class="group-title">正则校验</div>
          <div class="group-content">
            <div class="rules-list">
              <div v-for="(rule, idx) in field.validationRules" :key="idx" class="rule-item">
                <div class="rule-row">
                  <el-input v-model="rule.pattern" placeholder="请输入正则" />
                  <el-icon class="delete-rule" @click="removeValidationRule(idx)"><CircleClose /></el-icon>
                </div>
                <el-input v-model="rule.message" placeholder="请输入错误提示" />
              </div>
            </div>
            <el-button type="primary" link :icon="Plus" @click="addValidationRule">添加规则</el-button>
          </div>
        </div>
      </div>
      <div v-else class="empty-property">
        <el-icon :size="48"><InfoFilled /></el-icon>
        <p>请选择组件进行配置</p>
      </div>
    </div>

    <!-- 表单属性 -->
    <div v-if="activeTab === 'form'" class="config-content">
      <el-form label-width="90px" label-position="left" size="default">
        <el-form-item label="表单名">
          <el-input v-model="formConfig.formName" placeholder="请输入表单名" />
        </el-form-item>
        <el-form-item label="表单模型">
          <el-input v-model="formConfig.modelName" placeholder="formData" />
        </el-form-item>
        <el-form-item label="校验模型">
          <el-input v-model="formConfig.rulesName" placeholder="rules" />
        </el-form-item>
        <el-form-item label="表单尺寸">
          <div class="button-group">
            <span
              class="button-item"
              :class="{ active: formConfig.size === 'default' }"
              @click="formConfig.size = 'default'"
            >中等</span>
            <span
              class="button-item"
              :class="{ active: formConfig.size === 'small' }"
              @click="formConfig.size = 'small'"
            >较小</span>
            <span
              class="button-item"
              :class="{ active: formConfig.size === 'mini' }"
              @click="formConfig.size = 'mini'"
            >迷你</span>
          </div>
        </el-form-item>
        <el-form-item label="标签对齐">
          <div class="button-group">
            <span
              class="button-item"
              :class="{ active: formConfig.labelPosition === 'left' }"
              @click="formConfig.labelPosition = 'left'"
            >左对齐</span>
            <span
              class="button-item"
              :class="{ active: formConfig.labelPosition === 'right' }"
              @click="formConfig.labelPosition = 'right'"
            >右对齐</span>
            <span
              class="button-item"
              :class="{ active: formConfig.labelPosition === 'top' }"
              @click="formConfig.labelPosition = 'top'"
            >顶部对齐</span>
          </div>
        </el-form-item>
        <el-form-item label="标签宽度">
          <div class="number-input">
            <span class="number-btn" @click="formConfig.labelWidth = Math.max(60, formConfig.labelWidth - 10)">-</span>
            <span class="number-value">{{ formConfig.labelWidth }}</span>
            <span class="number-btn" @click="formConfig.labelWidth = Math.min(200, formConfig.labelWidth + 10)">+</span>
          </div>
        </el-form-item>
        <el-form-item label="栅格间隔">
          <div class="number-input">
            <span class="number-btn" @click="formConfig.gutter = Math.max(0, formConfig.gutter - 5)">-</span>
            <span class="number-value">{{ formConfig.gutter }}</span>
            <span class="number-btn" @click="formConfig.gutter = Math.min(50, formConfig.gutter + 5)">+</span>
          </div>
        </el-form-item>
        <el-form-item label="禁用表单">
          <el-switch v-model="formConfig.disabled" />
        </el-form-item>
        <el-form-item label="表单按钮">
          <el-switch v-model="formConfig.showButtons" />
        </el-form-item>
        <el-form-item label="显示未选中">
          <el-switch v-model="formConfig.showUnselected" />
        </el-form-item>
        <el-form-item label="组件边框">
          <el-switch v-model="formConfig.componentBorder" />
        </el-form-item>
      </el-form>
    </div>

    <!-- 图标选择器 -->
    <IconPicker
      ref="iconPickerRef"
      v-model="currentIconValue"
      @confirm="handleIconConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Delete, Plus, InfoFilled, CircleClose } from '@element-plus/icons-vue'
import IconPicker from '@/components/IconPicker.vue'

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

interface FormConfig {
  formName: string
  modelName: string
  rulesName: string
  labelWidth: number
  gutter: number
  labelPosition: 'left' | 'right' | 'top'
  size: 'default' | 'small' | 'mini'
  inline: boolean
  disabled: boolean
  showButtons: boolean
  showUnselected: boolean
  componentBorder: boolean
}

const props = defineProps<{
  field: FormField | null
  activeTab: 'component' | 'form'
  formConfig: FormConfig
}>()

const emit = defineEmits<{
  (e: 'update:field', value: FormField): void
  (e: 'update:formConfig', value: FormConfig): void
  (e: 'update:activeTab', value: 'component' | 'form'): void
}>()

// 图标选择器
const iconPickerRef = ref()
const currentIconValue = ref('')
const currentIconType = ref<'prefix' | 'suffix'>('prefix')

function openIconPicker(type: 'prefix' | 'suffix') {
  currentIconType.value = type
  currentIconValue.value = type === 'prefix' 
    ? props.field?.prefixIcon || '' 
    : props.field?.suffixIcon || ''
  iconPickerRef.value?.open()
}

function handleIconConfirm(iconName: string) {
  if (props.field) {
    if (currentIconType.value === 'prefix') {
      props.field.prefixIcon = iconName
    } else {
      props.field.suffixIcon = iconName
    }
  }
}

// 选项配置
function addOption() {
  if (props.field && props.field.options) {
    props.field.options.push({ label: '选项', value: `option_${Date.now()}` })
  }
}

function removeOption(index: number) {
  if (props.field && props.field.options) {
    props.field.options.splice(index, 1)
  }
}

// 正则校验规则
function addValidationRule() {
  if (props.field) {
    if (!props.field.validationRules) {
      props.field.validationRules = []
    }
    props.field.validationRules.push({ pattern: '', message: '' })
  }
}

function removeValidationRule(index: number) {
  if (props.field?.validationRules) {
    props.field.validationRules.splice(index, 1)
  }
}
</script>

<style lang="scss" scoped>
.config-panel {
  width: 320px;
  background: #fff;
  border-left: 1px solid #ebeef5;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .panel-tabs {
    display: flex;
    border-bottom: 1px solid #ebeef5;
    flex-shrink: 0;

    .tab-item {
      flex: 1;
      padding: 12px 16px;
      text-align: center;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
      color: #606266;
      border-right: 1px solid #ebeef5;

      &:last-child {
        border-right: none;
      }

      &:hover {
        color: #409EFF;
        background: #f5f7fa;
      }

      &.active {
        color: #409EFF;
        font-weight: 500;
        background: #ecf5ff;
        border-bottom: 2px solid #409EFF;
        margin-bottom: -1px;
      }
    }
  }

  .config-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
  }

  .field-config {
    :deep(.el-form-item) {
      margin-bottom: 18px;
    }
  }

  .icon-input {
    display: flex;
    gap: 8px;
    width: 100%;

    .el-input {
      flex: 1;
    }
  }

  .input-with-unit {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;

    .el-input {
      flex: 1;
    }

    .unit {
      color: #909399;
      font-size: 13px;
      white-space: nowrap;
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

  .validation-group {
    margin-top: 16px;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    overflow: hidden;

    .group-title {
      padding: 12px 16px;
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      background: #f5f7fa;
      border-bottom: 1px solid #ebeef5;
    }

    .group-content {
      padding: 16px;

      .rules-list {
        .rule-item {
          margin-bottom: 12px;
          padding: 12px;
          background: #fafafa;
          border-radius: 4px;
          border: 1px solid #ebeef5;

          .rule-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;

            .el-input {
              flex: 1;
            }

            .delete-rule {
              cursor: pointer;
              color: #909399;
              font-size: 16px;

              &:hover {
                color: #F56C6C;
              }
            }
          }
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

  .button-group {
    display: flex;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;

    .button-item {
      flex: 1;
      padding: 8px 12px;
      text-align: center;
      font-size: 13px;
      color: #606266;
      cursor: pointer;
      border-right: 1px solid #dcdfe6;
      transition: all 0.3s;

      &:last-child {
        border-right: none;
      }

      &:hover {
        color: #409EFF;
      }

      &.active {
        background: #409EFF;
        color: #fff;
      }
    }
  }

  .number-input {
    display: flex;
    align-items: center;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;

    .number-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f7fa;
      color: #606266;
      cursor: pointer;
      font-size: 16px;
      user-select: none;
      transition: all 0.3s;

      &:hover {
        color: #409EFF;
        background: #ecf5ff;
      }
    }

    .number-value {
      width: 60px;
      text-align: center;
      font-size: 14px;
      color: #303133;
      border-left: 1px solid #dcdfe6;
      border-right: 1px solid #dcdfe6;
      height: 32px;
      line-height: 32px;
    }
  }
}
</style>
