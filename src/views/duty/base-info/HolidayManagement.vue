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

    <!-- 导入弹窗 -->
    <el-dialog
      v-model="importDialogVisible"
      title="导入节假日"
      width="500px"
      destroy-on-close
    >
      <div class="import-content">
        <el-upload
          class="upload-area"
          drag
          action="#"
          :auto-upload="false"
          accept=".xlsx,.xls,.csv"
        >
          <el-icon class="el-icon--upload"><Upload /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              支持 .xlsx、.xls、.csv 格式文件
            </div>
          </template>
        </el-upload>
      </div>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary">确认导入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import {
  Plus, Delete, Edit, Upload, Calendar
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
  let data = tableData.value.filter(item => item.deleted === 0)

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
      tableData.value[idx].deleted = 1
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
        createTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
        deleted: 0
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

  .import-content {
    .upload-area {
      width: 100%;
    }
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
