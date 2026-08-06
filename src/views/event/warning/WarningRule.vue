<template>
  <div class="warning-rule-page">
    <el-card class="table-card animate-item" shadow="never">
      <div class="search-bar">
        <span class="search-bar-title">事故预警规则</span>
        <div class="search-bar-actions">
          <el-input
            v-model="keyword"
            placeholder="搜索规则名称"
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

        <el-table-column prop="ruleName" label="规则名称" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="rule-name-text">{{ row.ruleName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="warningType" label="预警类型" width="130" align="center">
          <template #default="{ row }">
            <el-tag effect="light" size="small" :type="getWarningTypeTag(row.warningType)">
              {{ getWarningTypeText(row.warningType) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="warningLevel" label="预警等级" width="100" align="center">
          <template #default="{ row }">
            <span class="level-tag" :class="getLevelClass(row.warningLevel)">{{ row.warningLevel }}</span>
          </template>
        </el-table-column>

        <el-table-column label="触发条件" min-width="220" show-overflow-tooltip align="left">
          <template #default="{ row }">
            <span class="condition-text">{{ row.triggerIndicators }} {{ row.comparisonText }} {{ row.threshold }}</span>
          </template>
        </el-table-column>

        <el-table-column label="通知模板" min-width="280" show-overflow-tooltip align="left">
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

        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link size="small" :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="isAdd ? '新增预警规则' : '编辑预警规则'"
      size="560px"
      direction="rtl"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="规则名称" prop="ruleName">
          <el-input v-model="formData.ruleName" placeholder="请输入规则名称" maxlength="100" />
        </el-form-item>
        <el-form-item label="预警类型" prop="warningType">
          <el-select v-model="formData.warningType" placeholder="请选择预警类型" style="width: 100%">
            <el-option label="事故类型" value="accident_type" />
            <el-option label="车辆属性" value="vehicle" />
            <el-option label="位置信息" value="location" />
            <el-option label="紧急程度" value="urgency" />
            <el-option label="影响范围" value="impact" />
            <el-option label="报送延迟" value="report_delay" />
          </el-select>
        </el-form-item>
        <el-form-item label="触发指标" prop="triggerIndicators">
          <el-input v-model="formData.triggerIndicators" placeholder="多个指标用顿号分隔" maxlength="200" />
        </el-form-item>
        <el-form-item label="对比方式" prop="comparisonText">
          <el-select v-model="formData.comparisonText" style="width: 100%">
            <el-option label="超过" value="超过" />
            <el-option label="大于等于" value="大于等于" />
            <el-option label="等于" value="等于" />
            <el-option label="包含" value="包含" />
          </el-select>
        </el-form-item>
        <el-form-item label="阈值" prop="threshold">
          <el-input v-model="formData.threshold" placeholder="请输入阈值" maxlength="100" />
        </el-form-item>
        <el-form-item label="预警等级" prop="warningLevel">
          <el-select v-model="formData.warningLevel" placeholder="请选择预警等级" style="width: 100%">
            <el-option label="红色" value="红色" />
            <el-option label="橙色" value="橙色" />
            <el-option label="黄色" value="黄色" />
            <el-option label="蓝色" value="蓝色" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" :rows="2" placeholder="请输入备注" maxlength="500" />
        </el-form-item>

        <el-divider content-position="left">短信模板</el-divider>

        <el-form-item label="系统变量">
          <div class="variable-tags">
            <el-tag v-for="v in smsVariables" :key="v.key" class="variable-tag" effect="plain" @click="insertVariable(v.key)">
              {{ v.label }}
            </el-tag>
          </div>
        </el-form-item>

        <el-form-item label="模板内容" prop="smsTemplate">
          <el-input v-model="formData.smsTemplate" type="textarea" :rows="4" placeholder="请输入短信模板内容，点击上方变量标签插入" class="template-textarea" />
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
import { Search, Edit, Plus, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { mockWarningRuleData } from '@/mock/event/warningRuleData'
import type { WarningRule } from '@/types/event/warningRule'

const loading = ref(false)
const keyword = ref('')
const drawerVisible = ref(false)
const isAdd = ref(false)
const formRef = ref<FormInstance>()

const tableData = ref<WarningRule[]>([...mockWarningRuleData])

const smsVariables = [
  { key: '$通知人', label: '$通知人' },
  { key: '$告警时间', label: '$告警时间' },
  { key: '$事故名称', label: '$事故名称' },
  { key: '$时间', label: '$时间' },
  { key: '$内容', label: '$内容' },
  { key: '$级别', label: '$级别' },
]

const formData = reactive({
  id: 0,
  ruleName: '',
  warningType: '',
  triggerIndicators: '',
  comparisonText: '超过',
  threshold: '',
  warningLevel: '黄色',
  enabled: true,
  remark: '',
  smsTemplate: ''
})

const formRules: FormRules = {
  ruleName: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
  warningType: [{ required: true, message: '请选择预警类型', trigger: 'change' }],
  triggerIndicators: [{ required: true, message: '请输入触发指标', trigger: 'blur' }],
  comparisonText: [{ required: true, message: '请选择对比方式', trigger: 'change' }],
  threshold: [{ required: true, message: '请输入阈值', trigger: 'blur' }],
  warningLevel: [{ required: true, message: '请选择预警等级', trigger: 'change' }],
  smsTemplate: [{ required: true, message: '请输入短信模板内容', trigger: 'blur' }]
}

const filteredData = computed(() => {
  if (!keyword.value) return tableData.value
  return tableData.value.filter(item => item.ruleName.includes(keyword.value))
})

const previewTemplate = computed(() => {
  let text = formData.smsTemplate
  if (!text) return '请先编辑短信模板内容'
  const previewValues: Record<string, string> = {
    '$通知人': '张明',
    '$告警时间': '2026-07-25 14:30:00',
    '$事故名称': 'G15沈海高速货车追尾事故',
    '$时间': formData.threshold,
    '$内容': '两辆货车追尾，车头严重变形',
    '$级别': 'II级',
  }
  for (const [key, value] of Object.entries(previewValues)) {
    text = text.split(key).join(value)
  }
  return text
})

function getWarningTypeText(type: string) {
  const map: Record<string, string> = {
    accident_type: '事故类型',
    vehicle: '车辆属性',
    location: '位置信息',
    urgency: '紧急程度',
    impact: '影响范围',
    report_delay: '报送延迟'
  }
  return map[type] || type
}

function getWarningTypeTag(type: string) {
  const map: Record<string, string> = {
    accident_type: '',
    vehicle: 'success',
    location: 'warning',
    urgency: 'danger',
    impact: 'info',
    report_delay: 'warning'
  }
  return map[type] || ''
}

function getLevelClass(level: string) {
  const map: Record<string, string> = {
    '红色': 'level-red',
    '橙色': 'level-orange',
    '黄色': 'level-yellow',
    '蓝色': 'level-blue'
  }
  return map[level] || ''
}

function handleSearch() {
  keyword.value = keyword.value
}

function resetForm() {
  formData.id = 0
  formData.ruleName = ''
  formData.warningType = ''
  formData.triggerIndicators = ''
  formData.comparisonText = '超过'
  formData.threshold = ''
  formData.warningLevel = '黄色'
  formData.enabled = true
  formData.remark = ''
  formData.smsTemplate = ''
}

function handleAdd() {
  isAdd.value = true
  resetForm()
  drawerVisible.value = true
}

function handleEdit(row: WarningRule) {
  isAdd.value = false
  formData.id = row.id
  formData.ruleName = row.ruleName
  formData.warningType = row.warningType
  formData.triggerIndicators = row.triggerIndicators
  formData.comparisonText = row.comparisonText
  formData.threshold = row.threshold
  formData.warningLevel = row.warningLevel
  formData.enabled = row.enabled
  formData.remark = row.remark || ''
  formData.smsTemplate = row.smsTemplate || ''
  drawerVisible.value = true
}

function handleDelete(row: WarningRule) {
  ElMessageBox.confirm(`确定要删除预警规则 "${row.ruleName}" 吗？`, '确认删除', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = tableData.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      tableData.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {})
}

function handleSubmit() {
  formRef.value?.validate(valid => {
    if (valid) {
      if (isAdd.value) {
        const newId = Math.max(...tableData.value.map(item => item.id)) + 1
        tableData.value.push({
          id: newId,
          ruleName: formData.ruleName,
          ruleCode: `WARN_${Date.now()}`,
          warningType: formData.warningType,
          triggerIndicators: formData.triggerIndicators,
          comparison: 'gt',
          comparisonText: formData.comparisonText,
          threshold: formData.threshold,
          warningLevel: formData.warningLevel,
          notifyCount: 0,
          enabled: formData.enabled,
          remark: formData.remark,
          smsTemplate: formData.smsTemplate,
          createTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
          notifications: []
        })
        ElMessage.success('新增成功')
      } else {
        const index = tableData.value.findIndex(item => item.id === formData.id)
        if (index !== -1) {
          tableData.value[index] = {
            ...tableData.value[index],
            ruleName: formData.ruleName,
            warningType: formData.warningType,
            triggerIndicators: formData.triggerIndicators,
            comparisonText: formData.comparisonText,
            threshold: formData.threshold,
            warningLevel: formData.warningLevel,
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
.warning-rule-page {
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

    .rule-name-text {
      font-weight: 500;
      color: #303133;
    }

    .condition-text {
      font-size: 13px;
      color: #606266;
    }

    .template-text {
      font-size: 13px;
      color: #909399;
      line-height: 1.5;
    }

    .level-tag {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;

      &.level-red {
        background: #fef0f0;
        color: #f56c6c;
        border: 1px solid #fbc4c4;
      }
      &.level-orange {
        background: #fdf6ec;
        color: #e6a23c;
        border: 1px solid #f5dab1;
      }
      &.level-yellow {
        background: #fdf6ec;
        color: #e6a23c;
        border: 1px solid #f5dab1;
      }
      &.level-blue {
        background: #ecf5ff;
        color: #409eff;
        border: 1px solid #b3d8ff;
      }
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
