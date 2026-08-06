<template>
  <div class="event-task-page">
    <el-card class="table-card animate-item" shadow="never">
      <div class="search-bar">
        <span class="search-bar-title">任务分配及跟踪</span>
        <div class="search-bar-actions">
          <el-input
            v-model="keyword"
            placeholder="搜索任务/事故名称"
            clearable
            :prefix-icon="Search"
            style="width: 200px; margin-right: 12px"
            @input="handleSearch"
            @clear="handleSearch"
          />
          <el-select v-model="filterStatus" placeholder="任务状态" clearable style="width: 130px; margin-right: 12px" @change="handleSearch">
            <el-option label="待分配" value="待分配" />
            <el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" />
            <el-option label="已逾期" value="已逾期" />
            <el-option label="已取消" value="已取消" />
          </el-select>
          <el-select v-model="filterPriority" placeholder="优先级" clearable style="width: 120px; margin-right: 12px" @change="handleSearch">
            <el-option label="紧急" value="紧急" />
            <el-option label="高" value="高" />
            <el-option label="中" value="中" />
            <el-option label="低" value="低" />
          </el-select>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新建任务</el-button>
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

        <el-table-column prop="taskName" label="任务名称" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="task-name-text">{{ row.taskName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="eventName" label="关联事故" min-width="180" show-overflow-tooltip />

        <el-table-column prop="taskType" label="任务类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag effect="light" size="small" :type="getTaskTypeTag(row.taskType)">
              {{ row.taskType }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="priority" label="优先级" width="90" align="center">
          <template #default="{ row }">
            <span class="priority-tag" :class="getPriorityClass(row.priority)">{{ row.priority }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" size="small">{{ row.status }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="assignee" label="负责人" width="90" align="center">
          <template #default="{ row }">
            <span v-if="row.assignee">{{ row.assignee }}</span>
            <span v-else class="unassigned-text">未分配</span>
          </template>
        </el-table-column>

        <el-table-column label="进度" width="140" align="center">
          <template #default="{ row }">
            <el-progress :percentage="row.progress" :stroke-width="10" :color="getProgressColor(row.progress)" />
          </template>
        </el-table-column>

        <el-table-column prop="planEndTime" label="计划结束时间" width="170" align="center">
          <template #default="{ row }">
            <span :class="{ 'overdue-text': isOverdue(row) }">{{ row.planEndTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" :icon="View" @click="handleView(row)">详情</el-button>
            <el-button type="warning" link size="small" :icon="Edit" @click="handleEdit(row)" :disabled="row.status === '已完成' || row.status === '已取消'">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

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

    <!-- 详情/编辑抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="isEdit ? '编辑任务' : '任务详情'"
      size="600px"
      direction="rtl"
      destroy-on-close
    >
      <el-form v-if="isEdit" ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="formData.taskName" placeholder="请输入任务名称" maxlength="100" />
        </el-form-item>
        <el-form-item label="任务类型" prop="taskType">
          <el-select v-model="formData.taskType" style="width: 100%">
            <el-option label="接报" value="接报" />
            <el-option label="处置" value="处置" />
            <el-option label="救援" value="救援" />
            <el-option label="信息" value="信息" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="formData.priority" style="width: 100%">
            <el-option label="紧急" value="紧急" />
            <el-option label="高" value="高" />
            <el-option label="中" value="中" />
            <el-option label="低" value="低" />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="assignee">
          <el-input v-model="formData.assignee" placeholder="请输入负责人" maxlength="50" />
        </el-form-item>
        <el-form-item label="负责部门" prop="department">
          <el-input v-model="formData.department" placeholder="请输入负责部门" maxlength="50" />
        </el-form-item>
        <el-form-item label="任务状态" prop="status">
          <el-select v-model="formData.status" style="width: 100%">
            <el-option label="待分配" value="待分配" />
            <el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" />
            <el-option label="已取消" value="已取消" />
          </el-select>
        </el-form-item>
        <el-form-item label="计划开始" prop="planStartTime">
          <el-date-picker v-model="formData.planStartTime" type="datetime" placeholder="选择计划开始时间" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
        </el-form-item>
        <el-form-item label="计划结束" prop="planEndTime">
          <el-date-picker v-model="formData.planEndTime" type="datetime" placeholder="选择计划结束时间" value-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
        </el-form-item>
        <el-form-item label="进度">
          <el-slider v-model="formData.progress" :step="10" show-input />
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入任务描述" maxlength="500" show-word-limit />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" :rows="2" placeholder="请输入备注" maxlength="500" show-word-limit />
        </el-form-item>
      </el-form>

      <div class="detail-content" v-else-if="detailRow">
        <el-descriptions :column="2" border label-width="100px">
          <el-descriptions-item label="任务名称" :span="2">{{ detailRow.taskName }}</el-descriptions-item>
          <el-descriptions-item label="关联事故" :span="2">{{ detailRow.eventName }}</el-descriptions-item>
          <el-descriptions-item label="任务类型">
            <el-tag effect="light" size="small" :type="getTaskTypeTag(detailRow.taskType)">{{ detailRow.taskType }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="优先级">
            <span class="priority-tag" :class="getPriorityClass(detailRow.priority)">{{ detailRow.priority }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="任务状态">
            <el-tag :type="getStatusTag(detailRow.status)" size="small">{{ detailRow.status }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="负责人">{{ detailRow.assignee || '未分配' }}</el-descriptions-item>
          <el-descriptions-item label="负责部门" :span="2">{{ detailRow.department || '未分配' }}</el-descriptions-item>
          <el-descriptions-item label="计划开始">{{ detailRow.planStartTime }}</el-descriptions-item>
          <el-descriptions-item label="计划结束">{{ detailRow.planEndTime }}</el-descriptions-item>
          <el-descriptions-item label="实际开始">{{ detailRow.actualStartTime || '—' }}</el-descriptions-item>
          <el-descriptions-item label="实际结束">{{ detailRow.actualEndTime || '—' }}</el-descriptions-item>
          <el-descriptions-item label="进度" :span="2">
            <el-progress :percentage="detailRow.progress" :stroke-width="12" :color="getProgressColor(detailRow.progress)" style="width: 300px" />
          </el-descriptions-item>
          <el-descriptions-item label="任务描述" :span="2">{{ detailRow.description }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ detailRow.remark || '—' }}</el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer v-if="isEdit">
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Search, Plus, View, Edit } from '@element-plus/icons-vue'
import { mockEventTaskData } from '@/mock/event/taskData'
import type { EventTask } from '@/types/event/task'

const loading = ref(false)
const keyword = ref('')
const filterStatus = ref('')
const filterPriority = ref('')
const drawerVisible = ref(false)
const isEdit = ref(false)
const detailRow = ref<EventTask | null>(null)
const formRef = ref<FormInstance>()

const allData = ref<EventTask[]>([...mockEventTaskData])

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const formData = reactive({
  id: 0,
  taskName: '',
  taskType: '其他',
  priority: '中',
  assignee: '',
  department: '',
  status: '待分配',
  planStartTime: '',
  planEndTime: '',
  progress: 0,
  description: '',
  remark: ''
})

const formRules: FormRules = {
  taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  taskType: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
  priority: [{ required: true, message: '请选择优先级', trigger: 'change' }],
  status: [{ required: true, message: '请选择任务状态', trigger: 'change' }],
  planStartTime: [{ required: true, message: '请选择计划开始时间', trigger: 'change' }],
  planEndTime: [{ required: true, message: '请选择计划结束时间', trigger: 'change' }]
}

const filteredData = computed(() => {
  let data = allData.value

  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    data = data.filter(item =>
      item.taskName.toLowerCase().includes(kw) ||
      item.eventName.toLowerCase().includes(kw)
    )
  }

  if (filterStatus.value) {
    data = data.filter(item => item.status === filterStatus.value)
  }

  if (filterPriority.value) {
    data = data.filter(item => item.priority === filterPriority.value)
  }

  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

function getTaskTypeTag(type: string) {
  const map: Record<string, string> = {
    '接报': '',
    '处置': 'warning',
    '救援': 'danger',
    '信息': 'success',
    '其他': 'info'
  }
  return map[type] || ''
}

function getStatusTag(status: string) {
  const map: Record<string, string> = {
    '待分配': 'info',
    '进行中': '',
    '已完成': 'success',
    '已逾期': 'danger',
    '已取消': 'info'
  }
  return map[status] || ''
}

function getPriorityClass(priority: string) {
  const map: Record<string, string> = {
    '紧急': 'priority-urgent',
    '高': 'priority-high',
    '中': 'priority-medium',
    '低': 'priority-low'
  }
  return map[priority] || ''
}

function getProgressColor(progress: number) {
  if (progress >= 100) return '#67c23a'
  if (progress >= 60) return '#409eff'
  if (progress >= 30) return '#e6a23c'
  return '#f56c6c'
}

function isOverdue(row: EventTask) {
  if (row.status === '已完成' || row.status === '已取消') return false
  if (row.status === '已逾期') return true
  if (!row.planEndTime) return false
  return new Date(row.planEndTime) < new Date()
}

function handleSearch() {
  pagination.page = 1
}

function handleSizeChange() {
  pagination.page = 1
}

function handlePageChange() {}

function handleAdd() {
  isEdit.value = true
  detailRow.value = null
  formData.id = 0
  formData.taskName = ''
  formData.taskType = '其他'
  formData.priority = '中'
  formData.assignee = ''
  formData.department = ''
  formData.status = '待分配'
  formData.planStartTime = ''
  formData.planEndTime = ''
  formData.progress = 0
  formData.description = ''
  formData.remark = ''
  drawerVisible.value = true
}

function handleView(row: EventTask) {
  isEdit.value = false
  detailRow.value = row
  drawerVisible.value = true
}

function handleEdit(row: EventTask) {
  isEdit.value = true
  detailRow.value = row
  formData.id = row.id
  formData.taskName = row.taskName
  formData.taskType = row.taskType
  formData.priority = row.priority
  formData.assignee = row.assignee
  formData.department = row.department
  formData.status = row.status
  formData.planStartTime = row.planStartTime
  formData.planEndTime = row.planEndTime
  formData.progress = row.progress
  formData.description = row.description
  formData.remark = row.remark || ''
  drawerVisible.value = true
}

function handleSubmit() {
  formRef.value?.validate(valid => {
    if (valid) {
      const index = allData.value.findIndex(item => item.id === formData.id)
      if (index !== -1) {
        allData.value[index] = {
          ...allData.value[index],
          taskName: formData.taskName,
          taskType: formData.taskType,
          priority: formData.priority,
          assignee: formData.assignee,
          department: formData.department,
          status: formData.status,
          planStartTime: formData.planStartTime,
          planEndTime: formData.planEndTime,
          progress: formData.progress,
          description: formData.description,
          remark: formData.remark
        }
      }
      ElMessage.success('保存成功')
      drawerVisible.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
.event-task-page {
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

    .task-name-text {
      font-weight: 500;
      color: #303133;
    }

    .unassigned-text {
      color: #c0c4cc;
      font-style: italic;
    }

    .overdue-text {
      color: #f56c6c;
      font-weight: 500;
    }

    .priority-tag {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;

      &.priority-urgent {
        background: #fef0f0;
        color: #f56c6c;
        border: 1px solid #fbc4c4;
      }
      &.priority-high {
        background: #fdf6ec;
        color: #e6a23c;
        border: 1px solid #f5dab1;
      }
      &.priority-medium {
        background: #ecf5ff;
        color: #409eff;
        border: 1px solid #b3d8ff;
      }
      &.priority-low {
        background: #f0f9eb;
        color: #67c23a;
        border: 1px solid #c2e7b0;
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    flex-shrink: 0;
  }

  .detail-content {
    padding: 0 20px 20px;

    .priority-tag {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;

      &.priority-urgent { background: #fef0f0; color: #f56c6c; border: 1px solid #fbc4c4; }
      &.priority-high { background: #fdf6ec; color: #e6a23c; border: 1px solid #f5dab1; }
      &.priority-medium { background: #ecf5ff; color: #409eff; border: 1px solid #b3d8ff; }
      &.priority-low { background: #f0f9eb; color: #67c23a; border: 1px solid #c2e7b0; }
    }
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
