<template>
  <div class="drone-device-page">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 顶部统计卡片 -->
      <StatsCards v-model="currentStatus" :items="statsCards" @change="handleStatusChange" />

      <!-- 搜索栏 -->
      <div class="search-bar">
        <div class="content-title">
          <span class="title-text">设备管理</span>
        </div>
        <div class="search-bar-actions">
          <el-input
            v-model="searchKeyword"
            placeholder="输入关键字快速搜索"
            clearable
            :prefix-icon="Search"
            style="width: 200px; margin-right: 12px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
          <el-button type="primary" :icon="Plus" @click="handleAdd">添加无人机</el-button>
        </div>
      </div>

      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="filteredData"
        border
        stripe
        highlight-current-row
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="code" label="编号" width="140" align="center">
          <template #default="{ row }">
            <el-link type="primary" :underline="false" @click="handleDetail(row)">{{ row.code }}</el-link>
          </template>
        </el-table-column>

        <el-table-column prop="serialNumber" label="序列号" min-width="200" align="center" show-overflow-tooltip />

        <el-table-column prop="modelName" label="型号名称" min-width="200" align="center" show-overflow-tooltip />

        <el-table-column prop="manufacturer" label="生产厂家" width="120" align="center" />

        <el-table-column prop="purchaseDate" label="购买日期" width="120" align="center" />

        <el-table-column prop="department" label="配发部门/队伍" min-width="180" align="center" show-overflow-tooltip />

        <el-table-column prop="custodian" label="保管责任人" width="110" align="center" />

        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :type="statusTagType(row.status)"
              effect="light"
              round
            >{{ row.status }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="maintenanceReminder" label="保养提醒" width="120" align="center">
          <template #default="{ row }">
            <span v-if="!row.maintenanceReminder">-</span>
            <span v-else :class="{ 'reminder-expired': isReminderExpired(row.maintenanceReminder) }">
              {{ row.maintenanceReminder }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="220" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" :icon="View" @click="handleDetail(row)">详情</el-button>
            <el-button type="warning" link size="small" :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link size="small" :icon="Delete" @click="handleDelete(row)">删除</el-button>
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

    <!-- 设备详情抽屉 -->
    <el-drawer
      v-model="detailVisible"
      :title="detailTitle"
      size="65%"
      direction="rtl"
      destroy-on-close
    >
      <template v-if="currentDetail">
        <div class="detail-section">
          <div class="section-title">基础信息</div>
          <div class="detail-info">
            <div class="detail-info-row">
              <span class="detail-meta">编号：<b>{{ currentDetail.code }}</b></span>
              <span class="detail-meta">序列号：{{ currentDetail.serialNumber }}</span>
              <span class="detail-meta">状态：
                <el-tag :type="statusTagType(currentDetail.status)" effect="light" round size="small">
                  {{ currentDetail.status }}
                </el-tag>
              </span>
            </div>
            <div class="detail-info-row">
              <span class="detail-meta">型号名称：{{ currentDetail.modelName }}</span>
              <span class="detail-meta">生产厂家：{{ currentDetail.manufacturer }}</span>
            </div>
            <div class="detail-info-row">
              <span class="detail-meta">购买日期：{{ currentDetail.purchaseDate }}</span>
              <span class="detail-meta">配发部门或队伍：{{ currentDetail.department }}</span>
            </div>
            <div class="detail-info-row">
              <span class="detail-meta">保管责任人：{{ currentDetail.custodian }}</span>
              <span class="detail-meta">下次保养时间：{{ currentDetail.maintenanceReminder || '-' }}</span>
            </div>
            <div class="detail-info-row">
              <span class="detail-meta">状态字典：库存备用、任务中、正在维修、已报废</span>
            </div>
            <div class="detail-info-row">
              <span class="detail-meta">资产管理说明：每架无人机登记在册，按重要资产管理</span>
            </div>
          </div>
        </div>

        <!-- 维护保养历史 -->
        <el-divider />
        <div class="detail-section detail-section-flex">
          <div class="section-title">维护保养历史</div>
          <el-table
            :data="pagedMaintenanceRecords"
            border
            stripe
            height="100%"
            :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
          >
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column prop="date" label="维护时间" width="120" align="center" />
            <el-table-column prop="type" label="维护类型" width="100" align="center" />
            <el-table-column prop="part" label="维修部件" min-width="120" align="center" show-overflow-tooltip />
            <el-table-column prop="replacement" label="更换零件" width="100" align="center" />
            <el-table-column prop="operator" label="责任人" width="100" align="center" />
            <el-table-column prop="nextMaintenance" label="下次保养" width="120" align="center" />
            <el-table-column prop="reminderStatus" label="提醒状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag v-if="row.reminderStatus === '正常'" type="success" effect="light" round>{{ row.reminderStatus }}</el-tag>
                <el-tag v-else-if="row.reminderStatus === '已过期'" type="danger" effect="light" round>{{ row.reminderStatus }}</el-tag>
                <el-tag v-else type="info" effect="light" round>{{ row.reminderStatus }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination-wrapper">
            <el-pagination
              v-model:current-page="maintenancePagination.page"
              v-model:page-size="maintenancePagination.pageSize"
              :total="maintenanceRecords.length"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              background
              @size-change="handleMaintenanceSizeChange"
              @current-change="handleMaintenancePageChange"
            />
          </div>
        </div>
      </template>
    </el-drawer>

    <!-- 新增/编辑抽屉 -->
    <el-drawer
      v-model="formVisible"
      :title="formTitle"
      size="550px"
      direction="rtl"
      destroy-on-close
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110px">
        <el-form-item label="设备编号" prop="code">
          <el-input v-model="formData.code" placeholder="请输入" class="form-input" />
        </el-form-item>

        <el-form-item label="序列号" prop="serialNumber">
          <el-input v-model="formData.serialNumber" placeholder="请输入" class="form-input" />
        </el-form-item>

        <el-form-item label="型号名称" prop="modelName">
          <el-select v-model="formData.modelName" placeholder="请选择" class="form-input" filterable>
            <el-option label="DJI Matrice 350 RTK" value="DJI Matrice 350 RTK" />
            <el-option label="DJI Matrice 30T" value="DJI Matrice 30T" />
            <el-option label="DJI Matrice 3E" value="DJI Matrice 3E" />
            <el-option label="DJI Mavic 3E" value="DJI Mavic 3E" />
            <el-option label="DJI Mavic 3T" value="DJI Mavic 3T" />
            <el-option label="DJI Mini 4 Pro" value="DJI Mini 4 Pro" />
            <el-option label="DJI Mini 3 Pro" value="DJI Mini 3 Pro" />
            <el-option label="纵横 CW-15" value="纵横 CW-15" />
            <el-option label="纵横 CW-25" value="纵横 CW-25" />
            <el-option label="纵横 CW-25H" value="纵横 CW-25H" />
            <el-option label="道通 EVO Max 4T" value="道通 EVO Max 4T" />
            <el-option label="道通 EVO Lite+" value="道通 EVO Lite+" />
          </el-select>
        </el-form-item>

        <el-form-item label="生产厂家" prop="manufacturer">
          <el-select v-model="formData.manufacturer" placeholder="请选择" class="form-input" filterable>
            <el-option label="大疆创新" value="大疆创新" />
            <el-option label="纵横股份" value="纵横股份" />
            <el-option label="道通智能" value="道通智能" />
          </el-select>
        </el-form-item>

        <el-form-item label="购买日期" prop="purchaseDate">
          <el-date-picker
            v-model="formData.purchaseDate"
            type="date"
            placeholder="请选择日期"
            value-format="YYYY-MM-DD"
            class="form-input"
          />
        </el-form-item>

        <el-form-item label="配发部门" prop="department">
          <el-input v-model="formData.department" placeholder="请输入" class="form-input" />
        </el-form-item>

        <el-form-item label="保管责任人" prop="custodian">
          <el-input v-model="formData.custodian" placeholder="请输入" class="form-input" />
        </el-form-item>

        <el-form-item label="设备状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio value="库存备用">库存备用</el-radio>
            <el-radio value="任务中">任务中</el-radio>
            <el-radio value="正在维修">正在维修</el-radio>
            <el-radio value="已报废">已报废</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="保养提醒">
          <el-date-picker
            v-model="formData.maintenanceReminder"
            type="date"
            placeholder="请选择日期"
            value-format="YYYY-MM-DD"
            class="form-input"
          />
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
            class="form-input"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Search, Plus, Reading, Box, Tools, Warning, View, Edit, Delete } from '@element-plus/icons-vue'
import { droneDeviceData } from '@/mock/resource/droneData'
import type { DroneDevice, DroneDeviceStatus } from '@/types/resource/drone'
import StatsCards from '@/components/StatsCards.vue'

const loading = ref(false)
const tableData = ref<DroneDevice[]>([...droneDeviceData])

// ── 状态筛选 ──
const currentStatus = ref('all')
const currentStatusFilter = ref<'all' | DroneDeviceStatus>('all')
const searchKeyword = ref('')

// ── 分页 ──
const pagination = reactive({ page: 1, pageSize: 20, total: 0 })

// ── 统计卡片 ──
const statsCards = computed(() => {
  const all = tableData.value
  return [
    { key: 'all', label: '全部', value: all.length, icon: Reading, color: '#409EFF', bgColor: '#ecf5ff' },
    {
      key: '库存备用',
      label: '库存备用',
      value: all.filter(d => d.status === '库存备用').length,
      icon: Box,
      color: '#67C23A',
      bgColor: '#f0f9eb',
    },
    {
      key: '任务中',
      label: '任务中',
      value: all.filter(d => d.status === '任务中').length,
      icon: Tools,
      color: '#409EFF',
      bgColor: '#ecf5ff',
    },
    {
      key: '正在维修',
      label: '正在维修',
      value: all.filter(d => d.status === '正在维修').length,
      icon: Warning,
      color: '#E6A23C',
      bgColor: '#fdf6ec',
    },
    {
      key: '已报废',
      label: '已报废',
      value: all.filter(d => d.status === '已报废').length,
      icon: Reading,
      color: '#F56C6C',
      bgColor: '#fef0f0',
    },
  ]
})

// ── 过滤+分页 ──
const filteredData = computed(() => {
  let data = tableData.value

  if (currentStatusFilter.value !== 'all') {
    data = data.filter(item => item.status === currentStatusFilter.value)
  }

  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase()
    data = data.filter(item =>
      item.code.toLowerCase().includes(kw) ||
      item.serialNumber.toLowerCase().includes(kw) ||
      item.modelName.toLowerCase().includes(kw) ||
      item.department.toLowerCase().includes(kw) ||
      item.custodian.toLowerCase().includes(kw)
    )
  }

  pagination.total = data.length

  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

// ── 状态样式 ──
function statusTagType(status: string): '' | 'success' | 'warning' | 'info' | 'danger' {
  const map: Record<string, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    '库存备用': 'success',
    '任务中': '',
    '正在维修': 'warning',
    '已报废': 'danger',
  }
  return map[status] ?? 'info'
}

function isReminderExpired(dateStr: string): boolean {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

// ── 筛选事件 ──
function handleStatusChange(key: string) {
  currentStatus.value = key
  currentStatusFilter.value = key as 'all' | DroneDeviceStatus
  pagination.page = 1
}

function handleSearch() {
  pagination.page = 1
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
}

function handlePageChange(page: number) {
  pagination.page = page
}

watch(searchKeyword, () => {
  pagination.page = 1
})

// ── 详情抽屉 ──
const detailVisible = ref(false)
const currentDetail = ref<DroneDevice | null>(null)

const detailTitle = computed(() => {
  if (!currentDetail.value) return '无人机详情'
  return `${currentDetail.value.modelName} + ${currentDetail.value.serialNumber}`
})

const maintenanceRecords = computed(() => {
  if (!currentDetail.value) return []
  const d = currentDetail.value
  const records = []

  if (d.status !== '已报废') {
    records.push({
      date: d.purchaseDate,
      type: '入库检查',
      part: '整机',
      replacement: '无',
      operator: d.custodian,
      nextMaintenance: d.maintenanceReminder || '-',
      reminderStatus: d.maintenanceReminder ? (isReminderExpired(d.maintenanceReminder) ? '已过期' : '正常') : '-',
    })
  }

  if (d.status === '正在维修') {
    records.push({
      date: '2026-05-10',
      type: '维修',
      part: '故障部件',
      replacement: '待确认',
      operator: d.custodian,
      nextMaintenance: '-',
      reminderStatus: '已过期',
    })
  }

  if (d.maintenanceReminder) {
    records.push({
      date: d.maintenanceReminder,
      type: '保养',
      part: '电池仓',
      replacement: '无',
      operator: d.custodian,
      nextMaintenance: d.maintenanceReminder,
      reminderStatus: isReminderExpired(d.maintenanceReminder) ? '已过期' : '正常',
    })
  }

  return records
})

// ── 保养记录分页 ──
const maintenancePagination = reactive({ page: 1, pageSize: 10 })

const pagedMaintenanceRecords = computed(() => {
  const start = (maintenancePagination.page - 1) * maintenancePagination.pageSize
  return maintenanceRecords.value.slice(start, start + maintenancePagination.pageSize)
})

function handleMaintenanceSizeChange(size: number) {
  maintenancePagination.pageSize = size
  maintenancePagination.page = 1
}

function handleMaintenancePageChange(page: number) {
  maintenancePagination.page = page
}

function handleDetail(row: DroneDevice) {
  currentDetail.value = row
  detailVisible.value = true
}

// ── 新增/编辑抽屉 ──
const formVisible = ref(false)
const formTitle = ref('新增无人机')
const formRef = ref<FormInstance>()
const editingId = ref('')

const formData = reactive({
  code: '',
  serialNumber: '',
  modelName: '',
  manufacturer: '',
  purchaseDate: '',
  department: '',
  custodian: '',
  status: '库存备用' as DroneDeviceStatus,
  maintenanceReminder: '',
  remark: '',
})

const formRules: FormRules = {
  code: [{ required: true, message: '请输入设备编号', trigger: 'blur' }],
  serialNumber: [{ required: true, message: '请输入序列号', trigger: 'blur' }],
  modelName: [{ required: true, message: '请选择型号名称', trigger: 'change' }],
  manufacturer: [{ required: true, message: '请选择生产厂家', trigger: 'change' }],
  purchaseDate: [{ required: true, message: '请选择购买日期', trigger: 'change' }],
  department: [{ required: true, message: '请输入配发部门', trigger: 'blur' }],
  custodian: [{ required: true, message: '请输入保管责任人', trigger: 'blur' }],
  status: [{ required: true, message: '请选择设备状态', trigger: 'change' }],
}

function resetForm() {
  formData.code = ''
  formData.serialNumber = ''
  formData.modelName = ''
  formData.manufacturer = ''
  formData.purchaseDate = ''
  formData.department = ''
  formData.custodian = ''
  formData.status = '库存备用'
  formData.maintenanceReminder = ''
  formData.remark = ''
}

function handleAdd() {
  editingId.value = ''
  formTitle.value = '新增无人机'
  resetForm()
  formVisible.value = true
}

function handleEdit(row: DroneDevice) {
  editingId.value = row.id
  formTitle.value = '编辑无人机'
  formData.code = row.code
  formData.serialNumber = row.serialNumber
  formData.modelName = row.modelName
  formData.manufacturer = row.manufacturer
  formData.purchaseDate = row.purchaseDate
  formData.department = row.department
  formData.custodian = row.custodian
  formData.status = row.status
  formData.maintenanceReminder = row.maintenanceReminder
  formData.remark = row.remark
  formVisible.value = true
}

function handleSubmit() {
  formRef.value?.validate(valid => {
    if (!valid) return

    if (editingId.value) {
      const target = tableData.value.find(item => item.id === editingId.value)
      if (target) {
        target.code = formData.code
        target.serialNumber = formData.serialNumber
        target.modelName = formData.modelName
        target.manufacturer = formData.manufacturer
        target.purchaseDate = formData.purchaseDate
        target.department = formData.department
        target.custodian = formData.custodian
        target.status = formData.status
        target.maintenanceReminder = formData.maintenanceReminder
        target.remark = formData.remark
      }
      ElMessage.success('修改成功')
    } else {
      const newId = String(tableData.value.length + 1)
      tableData.value.unshift({
        id: newId,
        code: formData.code,
        serialNumber: formData.serialNumber,
        modelName: formData.modelName,
        manufacturer: formData.manufacturer,
        purchaseDate: formData.purchaseDate,
        department: formData.department,
        custodian: formData.custodian,
        status: formData.status,
        maintenanceReminder: formData.maintenanceReminder,
        remark: formData.remark,
      })
      ElMessage.success('新增成功')
    }
    formVisible.value = false
  })
}

// ── 删除 ──
function handleDelete(row: DroneDevice) {
  ElMessageBox.confirm(
    `是否确认删除无人机设备 "${row.code} ${row.modelName}"？`,
    '删除确认',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    tableData.value = tableData.value.filter(item => item.id !== row.id)
    ElMessage.success(`已删除设备 ${row.code}`)
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
:deep(.el-drawer__footer) {
  border-top: 1px solid #ebeef5;
}

.drone-device-page {
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

    .search-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #ebeef5;
    }

    .content-title {
      display: flex;
      align-items: center;

      .title-text {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }
    }

    .search-bar-actions {
      display: flex;
      align-items: center;
      flex-shrink: 0;
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
}

.detail-info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
}

.detail-meta {
  font-size: 14px;
  color: #606266;

  b {
    color: #303133;
  }
}

.detail-section {
  .section-title {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 12px;
    padding-left: 10px;
    border-left: 3px solid #409eff;
  }
}

.detail-section-flex {
  display: flex;
  flex-direction: column;
  height: 100%;

  .el-table {
    flex: 1;
    overflow: hidden;
  }
}

:deep(.el-drawer__body) {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.reminder-expired {
  color: #F56C6C;
  font-weight: 600;
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
