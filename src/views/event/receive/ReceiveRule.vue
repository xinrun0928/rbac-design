<template>
  <div class="receive-rule-page">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <span class="search-bar-title">事故接报规则</span>
        <div class="search-bar-actions">
          <el-input
            v-model="keyword"
            placeholder="搜索指标名称"
            clearable
            :prefix-icon="Search"
            style="width: 180px; margin-right: 12px"
            @input="handleSearch"
            @clear="handleSearch"
          />
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增规则</el-button>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="filteredData"
        border
        stripe
        highlight-current-row
        row-key="id"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="indicator" label="指标" min-width="140" align="center">
          <template #default="{ row }">
            <span class="indicator-text">{{ row.indicator }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="comparisonText" label="对比方式" width="120" align="center" />

        <el-table-column label="数值" width="160" align="center">
          <template #default="{ row }">
            <div class="threshold-cell">
              <span class="threshold-value">{{ row.threshold }}</span>
              <span class="threshold-unit">{{ row.unit }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="通知模板" min-width="320" show-overflow-tooltip align="left">
          <template #default="{ row }">
            <span class="template-text">{{ row.smsTemplate || '未配置' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="enabled" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.enabled ? 'success' : 'info'" size="small">
              {{ row.enabled ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip align="left" />

        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" :icon="Edit" @click="handleEdit(row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="isAdd ? '新增接报规则' : '编辑接报规则'"
      size="560px"
      direction="rtl"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="指标名称" prop="indicator">
          <el-input v-model="formData.indicator" placeholder="请输入指标名称" :disabled="!isAdd" />
        </el-form-item>
        <el-form-item label="对比方式" prop="comparisonText">
          <el-select v-model="formData.comparisonText" style="width: 100%">
            <el-option label="超过" value="超过" />
            <el-option label="大于等于" value="大于等于" />
            <el-option label="等于" value="等于" />
          </el-select>
        </el-form-item>
        <el-form-item label="阈值" prop="threshold">
          <div class="threshold-input">
            <el-input-number
              v-model="formData.threshold"
              :min="0"
              :precision="formData.unit === '分钟' ? 0 : 1"
              controls-position="right"
              style="width: 140px"
            />
            <el-select v-model="formData.unit" style="width: 100px">
              <el-option label="小时" value="小时" />
              <el-option label="分钟" value="分钟" />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
          />
        </el-form-item>

        <!-- 短信模板配置 -->
        <el-divider content-position="left">短信模板</el-divider>

        <el-form-item label="系统变量">
          <div class="variable-tags">
            <el-tag
              v-for="v in smsVariables"
              :key="v.key"
              class="variable-tag"
              effect="plain"
              @click="insertVariable(v.key)"
            >
              {{ v.label }}
            </el-tag>
          </div>
        </el-form-item>

        <el-form-item label="模板内容" prop="smsTemplate">
          <el-input
            v-model="formData.smsTemplate"
            type="textarea"
            :rows="4"
            placeholder="请输入短信模板内容，点击上方变量标签插入"
            class="template-textarea"
          />
        </el-form-item>

        <el-form-item label="模板预览">
          <div class="template-preview">{{ previewTemplate }}</div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Edit, Plus } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { mockReceiveRuleData } from '@/mock/event/receiveRuleData'
import type { ReceiveRule, SmsVariable } from '@/types/event/receiveRule'

const loading = ref(false)
const keyword = ref('')
const drawerVisible = ref(false)
const isAdd = ref(false)
const formRef = ref<FormInstance>()

const tableData = ref<ReceiveRule[]>(mockReceiveRuleData)

// 系统内置变量
const smsVariables: SmsVariable[] = [
  { key: '$通知人', label: '$通知人', description: '接收通知的人员姓名' },
  { key: '$告警时间', label: '$告警时间', description: '告警触发的时间' },
  { key: '$事故名称', label: '$事故名称', description: '事故的名称' },
  { key: '$时间', label: '$时间', description: '规则配置的时间阈值' },
  { key: '$内容', label: '$内容', description: '告警的详细内容' },
  { key: '$级别', label: '$级别', description: '事故当前级别' },
]

const formData = reactive({
  id: 0,
  indicator: '',
  comparisonText: '超过',
  threshold: 0,
  unit: '小时',
  enabled: true,
  remark: '',
  smsTemplate: ''
})

const formRules: FormRules = {
  indicator: [{ required: true, message: '请输入指标名称', trigger: 'blur' }],
  comparisonText: [{ required: true, message: '请选择对比方式', trigger: 'change' }],
  threshold: [{ required: true, message: '请输入阈值', trigger: 'blur' }],
  smsTemplate: [{ required: true, message: '请输入短信模板内容', trigger: 'blur' }]
}

const filteredData = computed(() => {
  if (!keyword.value) return tableData.value
  return tableData.value.filter(item =>
    item.indicator.includes(keyword.value)
  )
})

// 模板预览：用示例值替换变量
const previewTemplate = computed(() => {
  let text = formData.smsTemplate
  if (!text) return '请先编辑短信模板内容'

  const previewValues: Record<string, string> = {
    '$通知人': '张明',
    '$告警时间': '2026-07-25 14:30:00',
    '$事故名称': 'G15沈海高速货车追尾事故',
    '$时间': `${formData.threshold}${formData.unit}`,
    '$内容': '两辆货车追尾，车头严重变形，有人员被困',
    '$级别': 'II级',
  }

  for (const [key, value] of Object.entries(previewValues)) {
    text = text.split(key).join(value)
  }
  return text
})

function handleSearch() {
  keyword.value = keyword.value
}

function resetForm() {
  formData.id = 0
  formData.indicator = ''
  formData.comparisonText = '超过'
  formData.threshold = 0
  formData.unit = '小时'
  formData.enabled = true
  formData.remark = ''
  formData.smsTemplate = ''
}

function handleAdd() {
  isAdd.value = true
  resetForm()
  drawerVisible.value = true
}

function handleEdit(row: ReceiveRule) {
  isAdd.value = false
  formData.id = row.id
  formData.indicator = row.indicator
  formData.comparisonText = row.comparisonText
  formData.threshold = row.threshold
  formData.unit = row.unit
  formData.enabled = row.enabled
  formData.remark = row.remark || ''
  formData.smsTemplate = row.smsTemplate || ''
  drawerVisible.value = true
}

function handleSubmit() {
  formRef.value?.validate(valid => {
    if (valid) {
      if (isAdd.value) {
        const newId = Math.max(...tableData.value.map(item => item.id)) + 1
        tableData.value.push({
          id: newId,
          indicator: formData.indicator,
          indicatorCode: formData.indicator.toUpperCase().replace(/\s/g, '_'),
          comparison: 'gt',
          comparisonText: formData.comparisonText,
          threshold: formData.threshold,
          unit: formData.unit,
          notifyCount: 0,
          enabled: formData.enabled,
          remark: formData.remark,
          smsTemplate: formData.smsTemplate,
          notifications: []
        })
        ElMessage.success('新增成功')
      } else {
        const index = tableData.value.findIndex(item => item.id === formData.id)
        if (index !== -1) {
          tableData.value[index] = {
            ...tableData.value[index],
            indicator: formData.indicator,
            comparisonText: formData.comparisonText,
            threshold: formData.threshold,
            unit: formData.unit,
            enabled: formData.enabled,
            remark: formData.remark,
            smsTemplate: formData.smsTemplate
          }
        }
        ElMessage.success('保存成功')
      }
      drawerVisible.value = false
    }
  })
}

function insertVariable(key: string) {
  formData.smsTemplate += key
}
</script>

<style lang="scss" scoped>
.receive-rule-page {
  padding: 0;
  background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;

  .animate-item {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;
  }

  .table-card {
    border-radius: 12px;
    border: none;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.el-card__body) {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }

    .search-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #ebeef5;
    }

    .search-bar-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .search-bar-actions {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .data-table { flex: 1; }

    .indicator-text {
      font-weight: 500;
      color: #303133;
    }

    .threshold-cell {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;

      .threshold-value {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        font-variant-numeric: tabular-nums;
      }

      .threshold-unit {
        font-size: 13px;
        color: #909399;
      }
    }

    .template-text {
      font-size: 13px;
      color: #606266;
      line-height: 1.5;
    }
  }
}

.threshold-input {
  display: flex;
  align-items: center;
  gap: 10px;
}

.variable-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  .variable-tag {
    cursor: pointer;
    transition: all 0.2s;
    background: #ecf5ff;
    border-color: #b3d8ff;
    color: #409eff;

    &:hover {
      background: #409eff;
      border-color: #409eff;
      color: #fff;
    }
  }
}

.template-textarea {
  :deep(textarea) {
    font-family: 'PingFang SC', 'Microsoft YaHei', monospace;
    font-size: 14px;
    line-height: 1.6;
  }
}

.template-preview {
  padding: 12px 16px;
  background: #fafafa;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  font-size: 14px;
  color: #303133;
  line-height: 1.6;
  word-break: break-all;
  width: 100%;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
