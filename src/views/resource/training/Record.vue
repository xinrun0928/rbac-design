<template>
  <div class="equipment-assessment-record">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 顶部筛选卡片 -->
      <div class="stats-row">
        <div
          v-for="item in statsCards"
          :key="item.key"
          class="stats-card"
          :class="{ active: currentStatus === item.key }"
          @click="handleStatusChange(item.key)"
        >
          <div class="stats-icon" :style="{ background: item.bgColor, color: item.color }">
            <el-icon :size="26"><component :is="item.icon" /></el-icon>
          </div>
          <div class="stats-info">
            <div class="stats-value" :style="{ color: item.color }">{{ item.value }}</div>
            <div class="stats-label">{{ item.label }}</div>
          </div>
        </div>
      </div>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <h3 class="page-title">装备操作考核记录</h3>
        <div class="search-bar-actions">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索任务名称/模板名称"
            clearable
            :prefix-icon="Search"
            style="width: 180px; margin-right: 12px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
          <el-button type="primary" :icon="Plus" @click="handleCreate">新建考核任务</el-button>
          <el-button type="success" :icon="Download" @click="handleExport">导出</el-button>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="filteredData"
        border
        stripe
        highlight-current-row
        row-key="taskId"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="taskName" label="考核任务名称" min-width="180" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <el-link type="primary" :underline="false" class="task-name-link" @click="handleViewDetail(row)">
              {{ row.taskName }}
            </el-link>
          </template>
        </el-table-column>

        <el-table-column prop="templateName" label="关联考核模板" min-width="180" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="template-name-text">{{ row.templateName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="assessorTarget" label="考核对象" min-width="180" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="assessors-text">{{ assessorTypeLabel(row.assessorType) }}：{{ row.assessorTarget }}</span>
          </template>
        </el-table-column>

        <el-table-column label="考核时间" width="200" align="center">
          <template #default="{ row }">
            <span class="date-text">{{ row.startDate }} ~ {{ row.endDate }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="responsibleTarget" label="考核负责人/部门" min-width="160" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="responsible-text">{{ responsibleTypeLabel(row.responsibleType) }}：{{ row.responsibleTarget }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="progress" label="考核进度（%）" width="160" align="center">
          <template #default="{ row }">
            <div class="progress-cell">
              <el-progress
                :percentage="row.progress"
                :color="row.progress === 100 ? '#67C23A' : ''"
                :show-text="true"
                :stroke-width="10"
                :format="progressFormat"
                class="progress-bar"
              />
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="任务状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.status)" effect="light" round>
              {{ statusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="230" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="View" @click="handleViewDetail(row)">详情</el-button>
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">修改</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="drawerTitle"
      size="40%"
      direction="rtl"
      destroy-on-close
      @close="handleClose"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px" @submit.prevent>
        <el-form-item label="考核任务名称" prop="taskName">
          <el-input v-model="formData.taskName" placeholder="请输入考核任务名称" maxlength="50" show-word-limit class="form-input" />
        </el-form-item>

        <el-form-item label="关联考核模板" prop="templateId">
          <el-select v-model="formData.templateId" placeholder="请选择关联考核模板" class="form-input">
            <el-option
              v-for="tpl in templateOptions"
              :key="tpl.templateId"
              :label="tpl.templateName"
              :value="tpl.templateId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="考核对象类型" prop="assessorType">
          <el-radio-group v-model="formData.assessorType" @change="handleAssessorTypeChange">
            <el-radio v-for="item in assessorTypeOptions" :key="item.value" :value="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item prop="assessorTarget" class="no-label-form-item">
          <el-select v-model="formData.assessorTarget" :placeholder="assessorTargetPlaceholder" class="form-input">
            <el-option v-for="name in currentAssessorOptions" :key="name" :label="name" :value="name" />
          </el-select>
        </el-form-item>

        <el-form-item label="考核时间" prop="startDate" class="time-range-item">
          <div class="time-range-row">
            <el-date-picker
              v-model="formData.startDate"
              type="date"
              placeholder="开始日期"
              value-format="YYYY-MM-DD"
              class="date-picker"
            />
            <span class="time-separator">~</span>
            <el-date-picker
              v-model="formData.endDate"
              type="date"
              placeholder="结束日期"
              value-format="YYYY-MM-DD"
              class="date-picker"
            />
          </div>
        </el-form-item>

        <el-form-item label="考核负责人/部门" prop="responsibleType">
          <el-radio-group v-model="formData.responsibleType" @change="handleResponsibleTypeChange">
            <el-radio v-for="item in responsibleTypeOptions" :key="item.value" :value="item.value">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item prop="responsibleTarget" class="no-label-form-item">
          <el-select v-model="formData.responsibleTarget" :placeholder="responsibleTargetPlaceholder" class="form-input">
            <el-option v-for="name in currentResponsibleOptions" :key="name" :label="name" :value="name" />
          </el-select>
        </el-form-item>

        <el-form-item label="说明" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入说明"
            maxlength="200"
            show-word-limit
            class="form-input"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-drawer>

    <AssessmentDetailDrawer
      v-model="detailVisible"
      :record="currentDetailRecord"
      @edit="handleDetailEdit"
      @revoke="handleDetailRevoke"
      @remind="handleDetailRemind"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Search, Plus, Download, Edit, Delete, View, Reading, Check, Timer, CircleClose
} from '@element-plus/icons-vue'
import type { Component } from 'vue'
import {
  equipmentAssessmentData,
  assessorTypeOptions,
  assessorDeptOptions,
  assessorPersonOptions,
  assessorPostOptions,
  responsibleTypeOptions,
  responsibleDeptOptions,
  responsiblePersonOptions
} from '@/mock/resource/trainingData'
import { examTemplateData } from '@/mock/resource/templateData'
import AssessmentDetailDrawer from './AssessmentDetailDrawer.vue'
import type {
  EquipmentAssessmentRecord,
  EquipmentAssessmentSearchForm,
  EquipmentAssessmentForm,
  AssessmentStatus,
  AssessorType,
  ResponsibleType
} from '@/types/resource/training'

const loading = ref(false)
const tableData = ref<EquipmentAssessmentRecord[]>([...equipmentAssessmentData])
const currentStatus = ref<AssessmentStatus | 'all'>('all')

const searchForm = reactive<EquipmentAssessmentSearchForm>({
  keyword: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

interface StatsCard {
  key: AssessmentStatus | 'all'
  label: string
  value: number
  icon: Component
  color: string
  bgColor: string
}

// ── 顶部筛选统计卡片（按任务状态） ──
const statsCards = computed<StatsCard[]>(() => [
  { key: 'all', label: '全部', value: tableData.value.length, icon: Reading, color: '#409EFF', bgColor: '#ecf5ff' },
  { key: 'completed', label: '已完成', value: tableData.value.filter(d => d.status === 'completed').length, icon: Check, color: '#67C23A', bgColor: '#f0f9eb' },
  { key: 'in_progress', label: '进行中', value: tableData.value.filter(d => d.status === 'in_progress').length, icon: Timer, color: '#E6A23C', bgColor: '#fdf6ec' },
  { key: 'not_started', label: '未开始', value: tableData.value.filter(d => d.status === 'not_started').length, icon: CircleClose, color: '#909399', bgColor: '#f4f4f5' }
])

const filteredData = computed(() => {
  let data = tableData.value
  if (currentStatus.value !== 'all') {
    data = data.filter(item => item.status === currentStatus.value)
  }
  if (searchForm.keyword) {
    const kw = searchForm.keyword.trim()
    data = data.filter(item =>
      item.taskName.includes(kw) ||
      item.templateName.includes(kw) ||
      item.assessorTarget.includes(kw)
    )
  }
  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

function handleSearch() {
  pagination.page = 1
}

function handleStatusChange(value: AssessmentStatus | 'all') {
  currentStatus.value = value
  pagination.page = 1
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
}

function handlePageChange(page: number) {
  pagination.page = page
}

// ── 状态显示 ──
function statusText(status: AssessmentStatus): string {
  const map: Record<AssessmentStatus, string> = {
    completed: '已完成',
    in_progress: '进行中',
    not_started: '未开始'
  }
  return map[status]
}

function statusTagType(status: AssessmentStatus): string {
  const map: Record<AssessmentStatus, string> = {
    completed: 'success',
    in_progress: 'warning',
    not_started: 'info'
  }
  return map[status]
}

// ── 选项数据 ──
const templateOptions = examTemplateData

function assessorTypeLabel(type: AssessorType): string {
  const map: Record<AssessorType, string> = {
    dept: '部门',
    person: '个人',
    post: '岗位'
  }
  return map[type]
}

const currentAssessorOptions = computed(() => {
  const map: Record<AssessorType, string[]> = {
    dept: assessorDeptOptions,
    person: assessorPersonOptions,
    post: assessorPostOptions
  }
  return map[formData.assessorType]
})

const assessorTargetPlaceholder = computed(() => {
  const map: Record<AssessorType, string> = {
    dept: '请选择部门',
    person: '请选择个人',
    post: '请选择岗位'
  }
  return map[formData.assessorType]
})

function handleAssessorTypeChange() {
  formData.assessorTarget = ''
}

function progressFormat(percentage: number): string {
  return `${percentage}%`
}

function responsibleTypeLabel(type: ResponsibleType): string {
  const map: Record<ResponsibleType, string> = {
    dept: '部门',
    person: '个人'
  }
  return map[type]
}

const currentResponsibleOptions = computed(() => {
  const map: Record<ResponsibleType, string[]> = {
    dept: responsibleDeptOptions,
    person: responsiblePersonOptions
  }
  return map[formData.responsibleType]
})

const responsibleTargetPlaceholder = computed(() => {
  const map: Record<ResponsibleType, string> = {
    dept: '请选择部门',
    person: '请选择个人'
  }
  return map[formData.responsibleType]
})

function handleResponsibleTypeChange() {
  formData.responsibleTarget = ''
}

// ── 新增/编辑抽屉 ──
const drawerVisible = ref(false)
const drawerTitle = ref('新建考核任务')
const formRef = ref<FormInstance>()
const editingId = ref('')

const createEmptyForm = (): EquipmentAssessmentForm => ({
  taskName: '',
  templateId: '',
  assessorType: 'dept',
  assessorTarget: '',
  startDate: '',
  endDate: '',
  responsibleType: 'dept',
  responsibleTarget: '',
  description: ''
})

const formData = reactive<EquipmentAssessmentForm>(createEmptyForm())

const formRules: FormRules = {
  taskName: [{ required: true, message: '请输入考核任务名称', trigger: 'blur' }],
  templateId: [{ required: true, message: '请选择关联考核模板', trigger: 'change' }],
  assessorType: [{ required: true, message: '请选择考核对象类型', trigger: 'change' }],
  assessorTarget: [{ required: true, message: '请选择考核对象', trigger: 'change' }],
  startDate: [{ required: true, message: '请选择考核开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择考核结束日期', trigger: 'change' }],
  responsibleType: [{ required: true, message: '请选择考核负责人/部门类型', trigger: 'change' }],
  responsibleTarget: [{ required: true, message: '请选择考核负责人/部门', trigger: 'change' }]
}

function resetForm() {
  Object.assign(formData, createEmptyForm())
}

function handleCreate() {
  editingId.value = ''
  drawerTitle.value = '新建考核任务'
  resetForm()
  drawerVisible.value = true
}

function handleEdit(row: EquipmentAssessmentRecord) {
  editingId.value = row.taskId
  drawerTitle.value = '修改考核任务'
  formData.taskName = row.taskName
  formData.templateId = row.templateId
  formData.assessorType = row.assessorType
  formData.assessorTarget = row.assessorTarget
  formData.startDate = row.startDate
  formData.endDate = row.endDate
  formData.responsibleType = row.responsibleType
  formData.responsibleTarget = row.responsibleTarget
  formData.description = row.description
  drawerVisible.value = true
}

function handleClose() {
  drawerVisible.value = false
  nextTick(() => formRef.value?.clearValidate())
}

function handleSubmit() {
  formRef.value?.validate(valid => {
    if (!valid) return
    const template = templateOptions.find(t => t.templateId === formData.templateId)
    const templateName = template?.templateName ?? ''
    if (editingId.value) {
      const target = tableData.value.find(item => item.taskId === editingId.value)
      if (target) {
        target.taskName = formData.taskName
        target.templateId = formData.templateId
        target.templateName = templateName
        target.assessorType = formData.assessorType
        target.assessorTarget = formData.assessorTarget
        target.startDate = formData.startDate
        target.endDate = formData.endDate
        target.responsibleType = formData.responsibleType
        target.responsibleTarget = formData.responsibleTarget
        target.description = formData.description
      }
      ElMessage.success('修改成功')
    } else {
      const id = `AST${String(tableData.value.length + 1).padStart(4, '0')}`
      tableData.value.unshift({
        taskId: id,
        taskName: formData.taskName,
        templateId: formData.templateId,
        templateName,
        assessorType: formData.assessorType,
        assessorTarget: formData.assessorTarget,
        startDate: formData.startDate,
        endDate: formData.endDate,
        responsibleType: formData.responsibleType,
        responsibleTarget: formData.responsibleTarget,
        progress: 0,
        status: 'not_started',
        createBy: '当前用户',
        createTime: new Date().toISOString().slice(0, 10) + ' 09:00:00',
        description: formData.description
      })
      ElMessage.success('新建成功')
    }
    drawerVisible.value = false
  })
}

// ── 删除 ──
function handleDelete(row: EquipmentAssessmentRecord) {
  ElMessageBox.confirm(
    `是否确认删除考核任务 "${row.taskName}"？`,
    '删除确认',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    tableData.value = tableData.value.filter(item => item.taskId !== row.taskId)
    ElMessage.success(`已删除考核任务 ${row.taskName}`)
  }).catch(() => {})
}

// ── 详情抽屉 ──
const detailVisible = ref(false)
const currentDetailRecord = ref<EquipmentAssessmentRecord | null>(null)

function handleViewDetail(row: EquipmentAssessmentRecord) {
  currentDetailRecord.value = row
  detailVisible.value = true
}

function handleDetailEdit(row: EquipmentAssessmentRecord) {
  detailVisible.value = false
  handleEdit(row)
}

function handleDetailRevoke(row: EquipmentAssessmentRecord) {
  ElMessageBox.confirm(
    `是否确认撤销考核任务 "${row.taskName}"？`,
    '撤销确认',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    const target = tableData.value.find(item => item.taskId === row.taskId)
    if (target) {
      target.status = 'not_started'
      target.progress = 0
    }
    detailVisible.value = false
    ElMessage.success(`已撤销考核任务 ${row.taskName}`)
  }).catch(() => {})
}

function handleDetailRemind(row: EquipmentAssessmentRecord) {
  ElMessage.success(`已向考核任务 "${row.taskName}" 的相关人员发送催办通知`)
}

// ── 导出 ──
function csvCell(value: unknown): string {
  const str = value == null ? '' : String(value)
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

function handleExport() {
  if (!filteredData.value.length) {
    ElMessage.warning('暂无数据可导出')
    return
  }
  const header = '考核任务名称,关联考核模板,考核对象类型,考核对象,考核开始日期,考核结束日期,考核负责人/部门类型,考核负责人/部门,考核进度,任务状态,创建人,创建时间,说明'
  const body = filteredData.value.map(row =>
    [row.taskName, row.templateName, assessorTypeLabel(row.assessorType), row.assessorTarget, row.startDate, row.endDate, responsibleTypeLabel(row.responsibleType), row.responsibleTarget, row.progress, statusText(row.status), row.createBy, row.createTime, row.description]
      .map(csvCell).join(',')
  ).join('\n')
  const blob = new Blob(['\ufeff' + `${header}\n${body}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `装备操作考核记录_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('导出成功')
}
</script>

<style lang="scss" scoped>
.equipment-assessment-record {
  padding: 16px;
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

    // ── 顶部筛选卡片 ──
    .stats-row {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-bottom: 16px;
      padding: 16px 0;
      background: #f8f9fb;
      border-radius: 10px;
      flex-shrink: 0;
    }

    .stats-card {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 200px;
      padding: 14px 18px;
      background: #fff;
      border: 2px solid transparent;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      &.active {
        border-color: #409eff;
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
      }

      .stats-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .stats-info {
        .stats-value {
          font-size: 26px;
          font-weight: 700;
          line-height: 1.2;
        }

        .stats-label {
          font-size: 13px;
          color: #909399;
          margin-top: 4px;
        }
      }
    }

    // ── 搜索栏 ──
    .search-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #ebeef5;

      .page-title {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
        color: #303133;
      }
    }

    .search-bar-actions {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .task-name-link {
      font-weight: 500;
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
      vertical-align: middle;
    }

    .template-name-text {
      font-size: 13px;
      color: #409eff;
    }

    .assessors-text {
      font-size: 13px;
      color: #606266;
    }

    .date-text {
      font-size: 13px;
      color: #606266;
    }

    .responsible-text {
      font-size: 13px;
      color: #606266;
    }

    .progress-cell {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;

      .progress-bar {
        width: 120px;
      }
    }

    .data-table {
      flex: 1;
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    flex-shrink: 0;
  }

  .form-input {
    width: 100%;
  }

  .no-label-form-item {
    :deep(.el-form-item__content) {
      margin-left: 140px;
    }
  }

  .time-range-item {
    :deep(.el-form-item__content) {
      width: calc(100% - 140px);
    }
  }

  .time-range-row {
    display: flex;
    align-items: center;
    width: 100%;

    .date-picker {
      flex: 1;
    }

    .time-separator {
      padding: 0 8px;
      color: #909399;
      flex-shrink: 0;
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
