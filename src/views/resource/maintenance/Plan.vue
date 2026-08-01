<template>
  <div class="maintenance-plan-page">
    <!-- 列表视图 -->
    <el-card v-if="!drawerVisible" class="table-card animate-item" shadow="never">
      <!-- 顶部筛选卡片 -->
      <StatsCards v-model="currentCategory" :items="statsCards" @change="handleCategoryChange" />

      <!-- 搜索栏 -->
      <div class="search-bar">
        <div class="search-bar-filter">
          <span class="filter-label">启用状态：</span>
          <el-link
            v-for="tab in statusTabs"
            :key="tab.value"
            class="filter-link"
            :underline="false"
            :type="currentStatus === tab.value ? 'primary' : 'info'"
            @click="handleStatusChange(tab.value)"
          >{{ tab.label }}</el-link>
        </div>
        <div class="search-bar-actions">
          <el-input
            v-model="searchForm.planName"
            placeholder="搜索计划名称"
            clearable
            :prefix-icon="Search"
            style="width: 180px; margin-right: 12px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
          <el-button type="primary" :icon="Plus" @click="handleCreate">新建计划</el-button>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="filteredData"
        border
        stripe
        highlight-current-row
        row-key="planId"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="planName" label="计划名称" min-width="150" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="plan-name-text">{{ row.planName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="targetName" label="维保对象" min-width="150" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="target-text">{{ row.targetName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="maintenanceContent" label="维保作业内容" min-width="300" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="content-text">{{ row.maintenanceContent }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="cycle" label="维保周期" width="120" align="center">
          <template #default="{ row }">
            <span class="cycle-text">{{ row.cycle }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="启用状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" effect="light" round>
              {{ row.status === 1 ? '已启用' : '未启用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="creator" label="计划创建人" width="100" align="center" />

        <el-table-column prop="updater" label="最近修改人" width="100" align="center" />

        <el-table-column prop="updateTime" label="最近修改时间" width="130" align="center" />

        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="{ row }">
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
      :title="formTitle"
      size="60%"
      direction="rtl"
      destroy-on-close
      @close="handleClose"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110px" @submit.prevent>
        <el-form-item label="维保计划名称" prop="planName">
          <el-input
            v-model="formData.planName"
            placeholder="请输入"
            maxlength="50"
            show-word-limit
            class="form-input"
          />
        </el-form-item>

        <el-form-item label="维保对象类型" prop="targetType">
          <div class="form-row-full">
            <el-radio-group v-model="formData.targetType" class="form-radio-group">
              <el-radio :value="1">按种类选择</el-radio>
              <el-radio :value="2">按现有库存装备</el-radio>
            </el-radio-group>
            <el-select v-model="formData.category" placeholder="请选择" class="form-input">
              <el-option label="基本生活保障物资" value="基本生活保障物资" />
              <el-option label="应急装备及配套物资" value="应急装备及配套物资" />
              <el-option label="工程材料与机械加工" value="工程材料与机械加工" />
              <el-option label="其他" value="其他" />
            </el-select>
          </div>
        </el-form-item>

        <el-form-item label="选择维保模板" prop="templateType">
          <div class="form-row-full">
            <el-radio-group v-model="formData.templateType" class="form-radio-group">
              <el-radio :value="1">选择已有模板</el-radio>
              <el-radio :value="2">直接上传</el-radio>
            </el-radio-group>
            <el-select v-model="formData.templateId" placeholder="请选择" class="form-input">
              <el-option label="设备日常巡检模板" value="tpl001" />
              <el-option label="设备季度保养模板" value="tpl002" />
              <el-option label="设备年度大修模板" value="tpl003" />
            </el-select>
          </div>
        </el-form-item>

        <el-form-item label="作业内容" prop="maintenanceContent">
          <div class="form-textarea-wrapper">
            <el-input
              v-model="formData.maintenanceContent"
              type="textarea"
              :rows="4"
              placeholder="请输入维护作业内容"
              maxlength="500"
              show-word-limit
              class="form-input"
            />
            <el-link type="primary" :underline="false" class="recommend-link">预防性维护方案推荐>></el-link>
          </div>
        </el-form-item>

        <el-form-item label="维保周期" prop="cycle">
          <div class="form-row-inline">
            <el-select v-model="formData.cycle" placeholder="请选择" style="width: 150px">
              <el-option label="每日" value="每日" />
              <el-option label="每周" value="每周" />
              <el-option label="每月" value="每月" />
              <el-option label="每年" value="每年" />
            </el-select>
            <span class="form-label-inline">设置提前提醒天数</span>
            <el-select v-model="formData.reminderDays" placeholder="请选择" style="width: 100px">
              <el-option label="1天" :value="1" />
              <el-option label="2天" :value="2" />
              <el-option label="3天" :value="3" />
            </el-select>
          </div>
        </el-form-item>

        <el-form-item label=" " prop="smsReminder">
          <el-checkbox v-model="formData.smsReminder">短信提醒</el-checkbox>
        </el-form-item>

        <el-form-item label="执行人" prop="executor">
          <el-select v-model="formData.executor" placeholder="请选择" class="form-input">
            <el-option label="张三" value="张三" />
            <el-option label="李四" value="李四" />
            <el-option label="王五" value="王五" />
            <el-option label="赵六" value="赵六" />
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="描述检查对象，让大模型更好的理解它"
            maxlength="200"
            show-word-limit
            class="form-input"
          />
        </el-form-item>

        <el-form-item label="启用状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">不启用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Search, Plus, Edit, Delete, Reading, Box, Tools, Operation, MoreFilled
} from '@element-plus/icons-vue'
import { maintenancePlanData } from '@/mock/resource/maintenanceData'
import StatsCards from '@/components/StatsCards.vue'
import type {
  MaintenancePlan, MaintenancePlanForm, MaintenancePlanSearchForm,
  MaintenanceCategory, TargetType, TemplateType, ReminderDays
} from '@/types/resource/maintenance'

const loading = ref(false)
const tableData = ref<MaintenancePlan[]>(maintenancePlanData)
const currentCategory = ref<string>('all')
const currentStatus = ref<'all' | 'enabled' | 'disabled'>('all')

const searchForm = reactive<MaintenancePlanSearchForm>({
  planName: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// ── 顶部筛选统计卡片（按物资分类） ──
const statsCards = computed(() => [
  { key: 'all', label: '全部', value: tableData.value.length, icon: Reading, color: '#409EFF', bgColor: '#ecf5ff' },
  { key: '基本生活保障物资', label: '基本生活保障物资', value: tableData.value.filter(d => d.category === '基本生活保障物资').length, icon: Box, color: '#67C23A', bgColor: '#f0f9eb' },
  { key: '应急装备及配套物资', label: '应急装备及配套物资', value: tableData.value.filter(d => d.category === '应急装备及配套物资').length, icon: Tools, color: '#E6A23C', bgColor: '#fdf6ec' },
  { key: '工程材料与机械加工', label: '工程材料与机械加工', value: tableData.value.filter(d => d.category === '工程材料与机械加工').length, icon: Operation, color: '#F56C6C', bgColor: '#fef0f0' },
  { key: '其他', label: '其他', value: tableData.value.filter(d => d.category === '其他').length, icon: MoreFilled, color: '#909399', bgColor: '#f4f4f5' }
])

const statusTabs = [
  { label: '全部', value: 'all' },
  { label: '已启用', value: 'enabled' },
  { label: '未启用', value: 'disabled' }
]

const filteredData = computed(() => {
  let data = tableData.value
  if (currentCategory.value !== 'all') {
    data = data.filter(item => item.category === currentCategory.value)
  }
  if (currentStatus.value === 'enabled') {
    data = data.filter(item => item.status === 1)
  } else if (currentStatus.value === 'disabled') {
    data = data.filter(item => item.status === 0)
  }
  if (searchForm.planName) {
    data = data.filter(item => item.planName.includes(searchForm.planName))
  }
  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

function handleSearch() {
  pagination.page = 1
}

function handleCategoryChange(key: string) {
  currentCategory.value = key
  pagination.page = 1
}

function handleStatusChange(value: string) {
  currentStatus.value = value as 'all' | 'enabled' | 'disabled'
  pagination.page = 1
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
}

function handlePageChange(page: number) {
  pagination.page = page
}

// ── 新增/编辑抽屉 ──
const drawerVisible = ref(false)
const formTitle = ref('新建维保计划')
const formRef = ref<FormInstance>()
const editingId = ref('')

const formData = reactive<MaintenancePlanForm>({
  planName: '',
  targetType: 1,
  targetName: '',
  category: '应急装备及配套物资',
  templateType: 1,
  templateId: '',
  maintenanceContent: '',
  cycle: '每月',
  reminderDays: 1,
  smsReminder: false,
  executor: '',
  status: 1,
  remark: ''
})

const formRules: FormRules = {
  planName: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
  targetType: [{ required: true, message: '请选择维保对象类型', trigger: 'change' }],
  category: [{ required: true, message: '请选择对象类别', trigger: 'change' }],
  templateType: [{ required: true, message: '请选择维保模板', trigger: 'change' }],
  maintenanceContent: [{ required: true, message: '请输入作业内容', trigger: 'blur' }],
  cycle: [{ required: true, message: '请选择维保周期', trigger: 'change' }],
  executor: [{ required: true, message: '请选择执行人', trigger: 'change' }],
  status: [{ required: true, message: '请选择启用状态', trigger: 'change' }]
}

function resetForm() {
  formData.planName = ''
  formData.targetType = 1
  formData.targetName = ''
  formData.category = '应急装备及配套物资'
  formData.templateType = 1
  formData.templateId = ''
  formData.maintenanceContent = ''
  formData.cycle = '每月'
  formData.reminderDays = 1
  formData.smsReminder = false
  formData.executor = ''
  formData.status = 1
  formData.remark = ''
}

function handleCreate() {
  editingId.value = ''
  formTitle.value = '新建维保计划'
  resetForm()
  drawerVisible.value = true
}

function handleEdit(row: MaintenancePlan) {
  editingId.value = row.planId
  formTitle.value = '修改维保计划'
  formData.planName = row.planName
  formData.targetType = row.targetType
  formData.targetName = row.targetName
  formData.category = row.category
  formData.templateType = row.templateType
  formData.templateId = row.templateId
  formData.maintenanceContent = row.maintenanceContent
  formData.cycle = row.cycle
  formData.reminderDays = row.reminderDays
  formData.smsReminder = row.smsReminder
  formData.executor = row.executor
  formData.status = row.status
  formData.remark = row.remark
  drawerVisible.value = true
}

function handleClose() {
  drawerVisible.value = false
  formRef.value?.clearValidate()
}

function handleSubmit() {
  formRef.value?.validate(valid => {
    if (!valid) {
      ElMessage.warning('请完善表单必填项')
      return
    }

    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    const updateTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

    if (editingId.value) {
      const target = tableData.value.find(item => item.planId === editingId.value)
      if (target) {
        target.planName = formData.planName
        target.targetType = formData.targetType
        target.targetName = formData.targetName
        target.category = formData.category
        target.templateType = formData.templateType
        target.templateId = formData.templateId
        target.maintenanceContent = formData.maintenanceContent
        target.cycle = formData.cycle
        target.reminderDays = formData.reminderDays
        target.smsReminder = formData.smsReminder
        target.executor = formData.executor
        target.status = formData.status
        target.remark = formData.remark
        target.updater = '当前用户'
        target.updateTime = updateTime
      }
      ElMessage.success('修改成功')
    } else {
      const id = `MP${String(tableData.value.length + 1).padStart(3, '0')}`
      tableData.value.unshift({
        planId: id,
        planName: formData.planName,
        targetType: formData.targetType,
        targetName: formData.targetName,
        category: formData.category,
        templateType: formData.templateType,
        templateId: formData.templateId,
        maintenanceContent: formData.maintenanceContent,
        cycle: formData.cycle,
        reminderDays: formData.reminderDays,
        smsReminder: formData.smsReminder,
        executor: formData.executor,
        status: formData.status,
        creator: '当前用户',
        updater: '当前用户',
        updateTime: updateTime,
        remark: formData.remark
      })
      ElMessage.success('新建成功')
    }
    drawerVisible.value = false
  })
}

function handleDelete(row: MaintenancePlan) {
  ElMessageBox.confirm(
    `是否确认删除维保计划 "${row.planName}"？`,
    '删除确认',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    tableData.value = tableData.value.filter(item => item.planId !== row.planId)
    ElMessage.success(`已删除维保计划 ${row.planName}`)
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
:deep(.el-drawer__footer) {
  border-top: 1px solid #ebeef5;
}

.maintenance-plan-page {
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

    // ── 搜索栏 ──
    .search-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #ebeef5;
    }

    .search-bar-filter {
      display: flex;
      align-items: center;
      gap: 12px;

      .filter-label {
        font-size: 14px;
        color: #606266;
        font-weight: 600;
      }

      .filter-link {
        font-size: 14px;

        &.el-link--primary {
          font-weight: 600;
        }
      }
    }

    .search-bar-actions {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .plan-name-text {
      font-weight: 500;
      color: #303133;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .target-text {
      font-size: 13px;
      color: #409EFF;
    }

    .content-text {
      font-size: 13px;
      color: #606266;
      line-height: 1.5;
    }

    .cycle-text {
      font-size: 13px;
      color: #606266;
      font-weight: 500;
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

  .form-row-full {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-radio-group {
    margin-bottom: 0;
  }

  .form-textarea-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .recommend-link {
    font-size: 13px;
    align-self: flex-start;
  }

  .form-row-inline {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .form-label-inline {
    font-size: 14px;
    color: #606266;
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
