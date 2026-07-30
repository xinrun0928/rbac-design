<template>
  <div class="holiday-management-page">

    <!-- 数据表格 -->
    <el-card class="table-card animate-item" shadow="never">
      <!-- 操作栏 -->
      <div class="action-bar">
        <div class="date-picker-wrap">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            @change="handleDateChange"
          />
        </div>
        <div class="btn-group">
          <el-button type="primary" :icon="Plus" @click="handleAdd">添加</el-button>
          <el-button type="success" :icon="Upload" @click="importDialogVisible = true">导入</el-button>
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
        <el-table-column label="序号" width="70" align="center" type="index">
          <template #default="{ $index }">
            <span class="index-text">{{ (pagination.page - 1) * pagination.pageSize + $index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="holidayName" label="节日名称" width="100" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="holiday-name-text">{{ row.holidayName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="startDate" label="开始日期" width="130" align="center">
          <template #default="{ row }">
            <span>{{ row.startDate }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="endDate" label="结束日期" width="130" align="center">
          <template #default="{ row }">
            <span>{{ row.endDate }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="remark-text">{{ row.remark }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="240" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="success" link :icon="Calendar" @click="handleViewDates(row)">查看日期</el-button>
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
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

    <!-- 日期详情抽屉 -->
    <el-drawer
      v-model="dateDrawerVisible"
      :title="`${currentHoliday?.holidayName} - 日期详情`"
      size="50%"
      direction="rtl"
    >
      <div class="date-detail-content">
        <div class="date-detail-header">
          <el-descriptions :column="2" border size="small">
            <el-descriptions-item label="节假日">{{ currentHoliday?.holidayName }}</el-descriptions-item>
            <el-descriptions-item label="备注">{{ currentHoliday?.remark || '-' }}</el-descriptions-item>
            <el-descriptions-item label="开始日期">{{ currentHoliday?.startDate }}</el-descriptions-item>
            <el-descriptions-item label="结束日期">{{ currentHoliday?.endDate }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <el-table
          :data="dateListPageData"
          border
          stripe
          :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
          class="date-detail-table"
        >
          <el-table-column label="序号" width="70" align="center" type="index">
            <template #default="{ $index }">
              <span class="index-text">{{ (dateListPagination.page - 1) * dateListPagination.pageSize + $index + 1 }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="dateStr" label="日期" align="center" min-width="130">
            <template #default="{ row }">
              <span>{{ row.dateStr }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="weekday" label="星期" align="center" width="100">
            <template #default="{ row }">
              <el-tag effect="light" size="small" :type="getWeekdayTagType(row.weekday)">
                {{ getWeekdayText(row.weekday) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="lunar" label="农历" align="center" min-width="120">
            <template #default="{ row }">
              <span class="lunar-text">{{ row.lunar }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="date-detail-pagination">
          <el-pagination
            v-model:current-page="dateListPagination.page"
            v-model:page-size="dateListPagination.pageSize"
            :total="dateList.length"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            background
          />
        </div>
      </div>
    </el-drawer>

    <!-- 添加/编辑抽屉 -->
    <el-drawer
      v-model="formDrawerVisible"
      :title="isEdit ? '编辑节假日' : '添加节假日'"
      size="40%"
      direction="rtl"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="80px"
        class="holiday-form"
      >
        <el-form-item label="名称" prop="holidayName">
          <el-input v-model="formData.holidayName" placeholder="请输入节假日名称" maxlength="20" />
        </el-form-item>
        <el-form-item label="时间段" prop="dateRange">
          <el-date-picker
            v-model="formData.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入备注信息"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <!-- 日期明细预览 -->
      <template v-if="formDateList.length">
        <el-divider content-position="left">日期明细</el-divider>
        <div class="form-date-preview">
          <el-table
            :data="formDatePageData"
            border
            size="small"
            :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
            class="preview-table"
          >
            <el-table-column label="序号" width="60" align="center" type="index">
              <template #default="{ $index }">
                <span class="index-text">{{ (formDatePagination.page - 1) * formDatePagination.pageSize + $index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="dateStr" label="日期" align="center" min-width="120" />
            <el-table-column prop="weekday" label="星期" align="center" width="80">
              <template #default="{ row }">
                <el-tag effect="light" size="small" :type="getWeekdayTagType(row.weekday)">
                  {{ getWeekdayText(row.weekday) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="lunar" label="农历" align="center" min-width="100">
              <template #default="{ row }">
                <span class="lunar-text">{{ row.lunar }}</span>
              </template>
            </el-table-column>
          </el-table>
          <div class="preview-pagination">
            <el-pagination
              v-model:current-page="formDatePagination.page"
              v-model:page-size="formDatePagination.pageSize"
              :total="formDateList.length"
              :page-sizes="[10, 20, 50]"
              layout="total, sizes, prev, pager, next"
              small
              background
            />
          </div>
        </div>
      </template>
      <template #footer>
        <el-button @click="formDrawerVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-drawer>

    <!-- 导入弹窗 - 四步向导 -->
    <el-dialog
      v-model="importDialogVisible"
      title="批量导入节假日"
      width="700px"
      destroy-on-close
      :close-on-click-modal="false"
      @closed="resetImportWizard"
    >
      <!-- 步骤条 -->
      <el-steps :active="importStep" finish-status="success" align-center class="import-steps">
        <el-step title="上传文件" />
        <el-step title="数据预览" />
        <el-step title="导入数据" />
        <el-step title="导入完成" />
      </el-steps>

      <!-- 第一步：上传文件 -->
      <div v-if="importStep === 0" class="import-step-content">
        <el-upload
          ref="uploadRef"
          class="upload-area"
          drag
          action="#"
          :auto-upload="false"
          accept=".xlsx,.xls,.csv"
          :limit="1"
          :on-change="handleFileChange"
          :on-exceed="handleExceed"
        >
          <el-icon class="el-icon--upload"><Upload /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              支持 .xlsx、.xls、.csv 格式文件，单次最多导入500条
            </div>
          </template>
        </el-upload>
        <div class="template-download">
          <el-button type="primary" link :icon="Download" @click="handleDownloadTemplate">
            下载导入模板
          </el-button>
        </div>
      </div>

      <!-- 第二步：数据预览 -->
      <div v-if="importStep === 1" class="import-step-content">
        <div class="preview-summary">
          <el-tag type="success" effect="plain">正常：{{ importValidCount }} 条</el-tag>
          <el-tag type="danger" effect="plain">异常：{{ importInvalidCount }} 条</el-tag>
          <el-tag type="info" effect="plain">总计：{{ importPreviewData.length }} 条</el-tag>
        </div>
        <!-- 异常明细 -->
        <div v-if="importInvalidCount > 0" class="error-section">
          <div class="error-title">
            <el-icon color="#F56C6C"><WarningFilled /></el-icon>
            <span>异常明细</span>
          </div>
          <el-table
            :data="importErrorData"
            border
            size="small"
            max-height="200"
            :header-cell-style="{ background: '#FEF0F0', color: '#F56C6C', fontWeight: '600', textAlign: 'center' }"
            class="error-table"
          >
            <el-table-column prop="rowIndex" label="行号" width="70" align="center" />
            <el-table-column prop="holidayName" label="节日名称" min-width="120" align="center" />
            <el-table-column prop="startDate" label="开始日期" width="120" align="center" />
            <el-table-column prop="endDate" label="结束日期" width="120" align="center" />
            <el-table-column prop="errors" label="异常原因" min-width="200" align="left" show-overflow-tooltip>
              <template #default="{ row }">
                <span class="error-text">{{ row.errors.join('；') }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 正常数据预览 -->
        <div v-if="importValidCount > 0" class="valid-section">
          <div class="valid-title">
            <el-icon color="#67C23A"><CircleCheckFilled /></el-icon>
            <span>正常数据预览（前10条）</span>
          </div>
          <el-table
            :data="importValidData.slice(0, 10)"
            border
            size="small"
            max-height="200"
            :header-cell-style="{ background: '#F0F9EB', color: '#67C23A', fontWeight: '600', textAlign: 'center' }"
            class="valid-table"
          >
            <el-table-column prop="holidayName" label="节日名称" min-width="120" align="center" />
            <el-table-column prop="startDate" label="开始日期" width="120" align="center" />
            <el-table-column prop="endDate" label="结束日期" width="120" align="center" />
            <el-table-column prop="remark" label="备注" min-width="150" align="center" show-overflow-tooltip />
          </el-table>
        </div>
      </div>

      <!-- 第三步：导入数据 -->
      <div v-if="importStep === 2" class="import-step-content import-progress">
        <el-progress
          type="dashboard"
          :percentage="importProgress"
          :width="120"
          :stroke-width="8"
          :color="progressColors"
        />
        <div class="progress-text">正在导入数据，请稍候...</div>
      </div>

      <!-- 第四步：导入完成 -->
      <div v-if="importStep === 3" class="import-step-content import-complete">
        <el-result
          icon="success"
          title="导入完成"
          :sub-title="`成功导入 ${importSuccessCount} 条节假日数据`"
        >
          <template #extra>
            <el-button type="primary" @click="importDialogVisible = false">完成</el-button>
          </template>
        </el-result>
      </div>

      <!-- 底部操作栏 -->
      <template #footer>
        <div class="import-footer">
          <el-button v-if="importStep === 1" @click="importStep = 0">上一步</el-button>
          <el-button
            v-if="importStep === 0"
            type="primary"
            :disabled="!importFile"
            @click="handleImportPreview"
          >
            下一步
          </el-button>
          <el-button
            v-if="importStep === 1"
            type="primary"
            :disabled="importValidCount === 0"
            @click="handleImportExecute"
          >
            开始导入
          </el-button>
          <el-button v-if="importStep === 0" @click="importDialogVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import {
  Plus, Delete, Edit, Upload, Calendar, Download, WarningFilled, CircleCheckFilled
} from '@element-plus/icons-vue'
import { holidayData } from '@/mock/duty/holidayData'
import type { Holiday, HolidayForm, HolidaySearchForm } from '@/types/duty/holiday'
import { formatLunarDate } from '@/utils/lunar'

/** 日期详情行 */
interface DateDetail {
  dateStr: string
  weekday: number
  lunar: string
}

// ── 状态 ──
const loading = ref(false)
const tableData = ref<Holiday[]>(holidayData)
const formDrawerVisible = ref(false)
const dateDrawerVisible = ref(false)
const importDialogVisible = ref(false)
const isEdit = ref(false)
const dateRange = ref<string[] | null>(null)
const formRef = ref<FormInstance>()
const currentHoliday = ref<Holiday | null>(null)
const dateList = ref<DateDetail[]>([])

const searchForm = reactive<HolidaySearchForm>({
  startDate: '',
  endDate: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const formDatePagination = reactive({
  page: 1,
  pageSize: 10
})

const dateListPagination = reactive({
  page: 1,
  pageSize: 10
})

// ── 导入向导状态 ──
const importStep = ref(0)
const importFile = ref<File | null>(null)
const importPreviewData = ref<any[]>([])
const importProgress = ref(0)
const importSuccessCount = ref(0)
const uploadRef = ref<any>(null)

const progressColors = [
  { color: '#409EFF', percentage: 50 },
  { color: '#67C23A', percentage: 100 }
]

/** 导入数据预览项 */
interface ImportPreviewItem {
  rowIndex: number
  holidayName: string
  startDate: string
  endDate: string
  remark: string
  isValid: boolean
  errors: string[]
}

/** 正常数据 */
const importValidData = computed(() => importPreviewData.value.filter(item => item.isValid))
/** 异常数据 */
const importInvalidData = computed(() => importPreviewData.value.filter(item => !item.isValid))
/** 正常条数 */
const importValidCount = computed(() => importValidData.value.length)
/** 异常条数 */
const importInvalidCount = computed(() => importInvalidData.value.length)

const formData = reactive<HolidayForm>({
  holidayName: '',
  dateRange: [],
  remark: ''
})

const formRules = {
  holidayName: [{ required: true, message: '请输入节假日名称', trigger: 'blur' }],
  dateRange: [{ required: true, message: '请选择时间段', trigger: 'change' }]
}

// ── 计算属性 ──
const filteredData = computed(() => {
  let data = tableData.value.filter(item => true)

  if (searchForm.startDate && searchForm.endDate) {
    const start = new Date(searchForm.startDate)
    const end = new Date(searchForm.endDate)
    data = data.filter(item => {
      const itemStart = new Date(item.startDate)
      return itemStart >= start && itemStart <= end
    })
  }

  pagination.total = data.length
  const startIdx = (pagination.page - 1) * pagination.pageSize
  return data.slice(startIdx, startIdx + pagination.pageSize)
})

/** 表单日期预览 */
const formDateList = computed(() => {
  if (!formData.dateRange || formData.dateRange.length < 2) return []
  const result: DateDetail[] = []
  const start = new Date(formData.dateRange[0])
  const end = new Date(formData.dateRange[1])
  const current = new Date(start)
  while (current <= end) {
    const y = current.getFullYear()
    const m = String(current.getMonth() + 1).padStart(2, '0')
    const d = String(current.getDate()).padStart(2, '0')
    const dateStr = `${y}-${m}-${d}`
    const weekday = current.getDay() === 0 ? 7 : current.getDay()
    result.push({ dateStr, weekday, lunar: formatLunarDate(current) })
    current.setDate(current.getDate() + 1)
  }
  return result
})

/** 表单日期预览分页数据 */
const formDatePageData = computed(() => {
  const start = (formDatePagination.page - 1) * formDatePagination.pageSize
  return formDateList.value.slice(start, start + formDatePagination.pageSize)
})

/** 日期详情分页数据 */
const dateListPageData = computed(() => {
  const start = (dateListPagination.page - 1) * dateListPagination.pageSize
  return dateList.value.slice(start, start + dateListPagination.pageSize)
})

// ── 方法 ──
function getWeekdayText(weekday: number): string {
  const map: Record<number, string> = {
    1: '周一', 2: '周二', 3: '周三', 4: '周四',
    5: '周五', 6: '周六', 7: '周日'
  }
  return map[weekday] || ''
}

function getWeekdayTagType(weekday: number): '' | 'success' | 'warning' | 'info' | 'danger' {
  if (weekday <= 5) return ''
  return 'success'
}

/** 生成日期范围内的所有日期 */
function generateDateRange(startStr: string, endStr: string): DateDetail[] {
  const result: DateDetail[] = []
  const start = new Date(startStr)
  const end = new Date(endStr)
  const current = new Date(start)
  while (current <= end) {
    const y = current.getFullYear()
    const m = String(current.getMonth() + 1).padStart(2, '0')
    const d = String(current.getDate()).padStart(2, '0')
    const dateStr = `${y}-${m}-${d}`
    const weekday = current.getDay() === 0 ? 7 : current.getDay()
    result.push({ dateStr, weekday, lunar: formatLunarDate(current) })
    current.setDate(current.getDate() + 1)
  }
  return result
}

// ── 导入向导方法 ──

/** 文件变化 */
function handleFileChange(file: any) {
  importFile.value = file.raw
}

/** 超出限制 */
function handleExceed() {
  ElMessage.warning('只能上传一个文件，请先移除已选文件')
}

/** 下载模板 */
function handleDownloadTemplate() {
  const header = '节日名称,开始日期,结束日期,备注'
  const example = '元旦,2026-01-01,2026-01-03,法定节假日，共3天'
  const csvContent = `${header}\n${example}`
  const blob = new Blob(['﻿' + csvContent], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = '节假日导入模板.csv'
  link.click()
  URL.revokeObjectURL(url)
}

/** 解析CSV文件 */
function parseCSV(text: string): any[] {
  const lines = text.split('\n').filter(line => line.trim())
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map(h => h.trim())
  const data = []
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    const row: any = {}
    headers.forEach((h, idx) => {
      row[h] = values[idx] || ''
    })
    data.push(row)
  }
  return data
}

/** 校验单条数据 */
function validateImportRow(row: any, index: number): ImportPreviewItem {
  const errors: string[] = []
  const holidayName = row['节日名称'] || ''
  const startDate = row['开始日期'] || ''
  const endDate = row['结束日期'] || ''
  const remark = row['备注'] || ''

  if (!holidayName) errors.push('节日名称不能为空')
  if (!startDate) errors.push('开始日期不能为空')
  if (!endDate) errors.push('结束日期不能为空')
  if (startDate && !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) errors.push('开始日期格式应为YYYY-MM-DD')
  if (endDate && !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) errors.push('结束日期格式应为YYYY-MM-DD')
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) errors.push('开始日期不能晚于结束日期')

  return {
    rowIndex: index + 2, // +2 因为跳过表头，且从1开始
    holidayName,
    startDate,
    endDate,
    remark,
    isValid: errors.length === 0,
    errors
  }
}

/** 数据预览 */
function handleImportPreview() {
  if (!importFile.value) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const text = e.target?.result as string
    const rows = parseCSV(text)

    if (rows.length === 0) {
      ElMessage.warning('文件中无有效数据')
      return
    }

    if (rows.length > 500) {
      ElMessage.warning('单次最多导入500条数据')
      return
    }

    importPreviewData.value = rows.map((row, idx) => validateImportRow(row, idx))
    importStep.value = 1
  }
  reader.readAsText(importFile.value)
}

/** 执行导入 */
function handleImportExecute() {
  importStep.value = 2
  importProgress.value = 0

  const validData = importValidData.value
  const total = validData.length
  let processed = 0

  const timer = setInterval(() => {
    processed++
    importProgress.value = Math.round((processed / total) * 100)

    if (processed >= total) {
      clearInterval(timer)
      // 添加到表格数据
      const newId = Math.max(...tableData.value.map(item => item.id), 0)
      validData.forEach((item, idx) => {
        tableData.value.push({
          id: newId + idx + 1,
          holidayName: item.holidayName,
          startDate: item.startDate,
          endDate: item.endDate,
          remark: item.remark,
          createTime: new Date().toISOString().replace('T', ' ').slice(0, 19)
        })
      })
      importSuccessCount.value = total
      importStep.value = 3
    }
  }, 50)
}

/** 重置导入向导 */
function resetImportWizard() {
  importStep.value = 0
  importFile.value = null
  importPreviewData.value = []
  importProgress.value = 0
  importSuccessCount.value = 0
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
}

function handleViewDates(row: Holiday) {
  currentHoliday.value = row
  dateList.value = generateDateRange(row.startDate, row.endDate)
  dateListPagination.page = 1
  dateDrawerVisible.value = true
}

function handleDateChange(val: string[] | null) {
  if (val) {
    searchForm.startDate = val[0]
    searchForm.endDate = val[1]
  } else {
    searchForm.startDate = ''
    searchForm.endDate = ''
  }
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
}

function handlePageChange(page: number) {
  pagination.page = page
}

function handleAdd() {
  isEdit.value = false
  resetForm()
  formDrawerVisible.value = true
}

function handleEdit(row: Holiday) {
  isEdit.value = true
  formData.id = row.id
  formData.holidayName = row.holidayName
  formData.dateRange = [row.startDate, row.endDate]
  formData.remark = row.remark
  formDrawerVisible.value = true
}

function handleDelete(row: Holiday) {
  ElMessageBox.confirm(
    `确定要删除节假日 "${row.holidayName}" 吗？`,
    '确认删除',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    const idx = tableData.value.findIndex(item => item.id === row.id)
    if (idx !== -1) {
    }
    ElMessage.success('删除成功')
  }).catch(() => {})
}

function resetForm() {
  formData.id = undefined
  formData.holidayName = ''
  formData.dateRange = []
  formData.remark = ''
}

async function handleSubmit() {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (!valid) return

    const startDate = formData.dateRange[0]
    const endDate = formData.dateRange[1]

    if (isEdit.value && formData.id) {
      const idx = tableData.value.findIndex(item => item.id === formData.id)
      if (idx !== -1) {
        tableData.value[idx] = {
          ...tableData.value[idx],
          holidayName: formData.holidayName,
          startDate,
          endDate,
          remark: formData.remark
        }
      }
      ElMessage.success('编辑成功')
    } else {
      const newId = Math.max(...tableData.value.map(item => item.id)) + 1
      tableData.value.push({
        id: newId,
        holidayName: formData.holidayName,
        startDate,
        endDate,
        remark: formData.remark,
        createTime: new Date().toISOString().replace('T', ' ').slice(0, 19)
      })
      ElMessage.success('添加成功')
    }

    formDrawerVisible.value = false
    resetForm()
  })
}
</script>

<style lang="scss" scoped>
.holiday-management-page {
  padding: 0;
  background: linear-gradient(160deg, #F5F7FA 0%, #E8ECF1 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;

  .animate-item {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;
    &:nth-child(1) { animation-delay: 0.05s; }
    &:nth-child(2) { animation-delay: 0.12s; }
    &:nth-child(3) { animation-delay: 0.2s; }
  }

  .action-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .date-picker-wrap {
      width: 220px;
      flex-shrink: 0;
      margin-right: 8px;
    }

    .btn-group {
      display: flex;
      gap: 0;
    }
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

    .data-table {
      flex: 1;
    }

    .index-text { color: #909399; font-size: 13px; }

    .holiday-name-text {
      font-weight: 500;
      color: #303133;
    }

    .lunar-text {
      color: #E6A23C;
      font-size: 13px;
    }

    .remark-text {
      color: #909399;
      font-size: 13px;
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    flex-shrink: 0;
  }

  .date-detail-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .date-detail-header {
    margin-bottom: 16px;
    flex-shrink: 0;
  }

  .date-detail-table {
    flex: 1;
    overflow: hidden;

    .index-text { color: #909399; font-size: 13px; }
  }

  .date-detail-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    flex-shrink: 0;
  }

  .holiday-form {
    padding: 0 20px;
  }

  .form-date-preview {
    width: 100%;
    height: 100%;

    .preview-table {
      height: 100%;

      .index-text { color: #909399; font-size: 13px; }
    }

    .preview-pagination {
      display: flex;
      justify-content: flex-end;
      margin-top: 12px;
    }
  }

  // 导入向导样式
  .import-steps {
    margin-bottom: 24px;
  }

  .import-step-content {
    min-height: 280px;
    display: flex;
    flex-direction: column;
  }

  .upload-area {
    width: 100%;
  }

  .template-download {
    text-align: center;
    margin-top: 12px;
  }

  .preview-summary {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }

  .error-section, .valid-section {
    margin-bottom: 16px;

    .error-title, .valid-title {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
    }
  }

  .error-text {
    color: #F56C6C;
    font-size: 12px;
  }

  .import-progress {
    justify-content: center;
    align-items: center;

    .progress-text {
      margin-top: 16px;
      color: #909399;
      font-size: 14px;
    }
  }

  .import-complete {
    justify-content: center;
    align-items: center;
  }

  .import-footer {
    display: flex;
    justify-content: center;
    gap: 12px;
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
