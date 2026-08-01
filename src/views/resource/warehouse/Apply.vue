<template>
  <div class="inventory-query-page">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 顶部统计卡片 -->
      <StatsCards v-model="currentCategory" :items="statsCards" @change="handleCategoryChange" />

      <!-- 归还状态筛选 -->
      <div class="search-bar">
        <div class="search-bar-left">
          <div class="search-bar-filter">
            <span class="filter-label">归还状态：</span>
            <el-link
              v-for="tab in statusTabs"
              :key="tab.value"
              class="filter-link"
              :underline="false"
              :type="currentReturnStatus === tab.value ? 'primary' : 'info'"
              @click="handleReturnStatusChange(tab.value)"
            >{{ tab.label }}</el-link>
          </div>
          <span class="record-count">共{{ filteredAllData.length }}条记录</span>
        </div>
        <div class="content-header-right">
          <el-input
            v-model="searchKeyword"
            placeholder="输入关键字快速搜索"
            clearable
            :prefix-icon="Search"
            style="width: 200px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
        </div>
      </div>

      <!-- 内容头 -->
      <div class="content-header">
        <div class="content-header-left">
          <span class="page-title">调用申请</span>
        </div>
        <div class="content-header-right">
          <el-button type="primary" :icon="Plus" @click="openApplyDrawer">调用申请</el-button>
        </div>
      </div>

      <!-- 表格 -->
      <el-table
        class="data-table"
        :data="tableData"
        border
        stripe
        height="100%"
        v-loading="loading"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
      >
        <el-table-column prop="applyResult" label="申请结果" width="100" align="center">
          <template #default="{ row }">
            <el-link v-if="row.applyResult === '通过'" type="success" :underline="false">{{ row.applyResult }}</el-link>
            <el-link v-else-if="row.applyResult === '不通过'" type="danger" :underline="false">{{ row.applyResult }}</el-link>
            <el-link v-else type="primary" :underline="false">{{ row.applyResult }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="returnStatus" label="归还状态" width="120" align="center">
          <template #default="{ row }">
            <span v-if="row.returnStatus === '待归还'" class="return-pending">
              待归还({{ row.returnCurrent }}/{{ row.returnTotal }})
            </span>
            <span v-else-if="row.returnStatus === '已归还'" class="return-done">已归还</span>
            <span v-else-if="row.returnStatus === '无需归还'" class="return-none">无需归还</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="materialName" label="物资名称" min-width="140" align="center" show-overflow-tooltip />
        <el-table-column prop="consumeType" label="消耗类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.consumeType === '消耗类'" type="primary" effect="light" round>{{ row.consumeType }}</el-tag>
            <el-tag v-else effect="light" round>{{ row.consumeType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="spec" label="型号规格" min-width="160" align="center" show-overflow-tooltip />
        <el-table-column prop="applyCode" label="所属申请单编号" min-width="150" align="center">
          <template #default="{ row }">
            <el-link type="primary" :underline="false">{{ row.applyCode }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="applyCount" label="申请数量" width="90" align="center" />
        <el-table-column prop="category" label="种类" min-width="180" align="center" show-overflow-tooltip />
        <el-table-column label="申请人/联系电话" min-width="170" align="center">
          <template #default="{ row }">
            <div>{{ row.applicant }}</div>
            <div class="sub-text">{{ row.phone }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="applyDept" label="申请单位" width="100" align="center" />
        <el-table-column prop="applyTime" label="申请时间" width="150" align="center" />
        <el-table-column prop="auditor" label="审核人" width="80" align="center" />
        <el-table-column prop="outTime" label="出库时间" width="150" align="center" />
        <el-table-column prop="returnTime" label="归还时间" width="150" align="center" />
        <el-table-column label="操作" width="70" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="List" @click="handleViewDetail(row)" />
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

    <!-- 详情抽屉 -->
    <el-drawer
      v-model="detailVisible"
      title="调用申请详情"
      size="60%"
      direction="rtl"
      destroy-on-close
    >
      <div v-if="currentDetail" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="申请结果">
            <el-link v-if="currentDetail.applyResult === '通过'" type="success" :underline="false">{{ currentDetail.applyResult }}</el-link>
            <el-link v-else-if="currentDetail.applyResult === '不通过'" type="danger" :underline="false">{{ currentDetail.applyResult }}</el-link>
            <el-link v-else type="primary" :underline="false">{{ currentDetail.applyResult }}</el-link>
          </el-descriptions-item>
          <el-descriptions-item label="归还状态">
            <span v-if="currentDetail.returnStatus === '待归还'" class="return-pending">
              待归还({{ currentDetail.returnCurrent }}/{{ currentDetail.returnTotal }})
            </span>
            <span v-else-if="currentDetail.returnStatus === '已归还'" class="return-done">已归还</span>
            <span v-else-if="currentDetail.returnStatus === '无需归还'" class="return-none">无需归还</span>
            <span v-else>-</span>
          </el-descriptions-item>
          <el-descriptions-item label="物资名称">{{ currentDetail.materialName }}</el-descriptions-item>
          <el-descriptions-item label="消耗类型">
            <el-tag v-if="currentDetail.consumeType === '消耗类'" type="primary" effect="light" round>{{ currentDetail.consumeType }}</el-tag>
            <el-tag v-else effect="light" round>{{ currentDetail.consumeType }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="型号规格" :span="2">{{ currentDetail.spec }}</el-descriptions-item>
          <el-descriptions-item label="所属申请单编号">
            <el-link type="primary" :underline="false">{{ currentDetail.applyCode }}</el-link>
          </el-descriptions-item>
          <el-descriptions-item label="申请数量">{{ currentDetail.applyCount }}</el-descriptions-item>
          <el-descriptions-item label="种类" :span="2">{{ currentDetail.category }}</el-descriptions-item>
          <el-descriptions-item label="申请人">{{ currentDetail.applicant }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{ currentDetail.phone }}</el-descriptions-item>
          <el-descriptions-item label="申请单位">{{ currentDetail.applyDept }}</el-descriptions-item>
          <el-descriptions-item label="申请时间">{{ currentDetail.applyTime }}</el-descriptions-item>
          <el-descriptions-item label="审核人">{{ currentDetail.auditor }}</el-descriptions-item>
          <el-descriptions-item label="出库时间">{{ currentDetail.outTime }}</el-descriptions-item>
          <el-descriptions-item label="归还时间" :span="2">{{ currentDetail.returnTime }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-drawer>

    <!-- 申请调用抽屉 - 2步向导 -->
    <el-drawer
      v-model="applyVisible"
      title="申请调用"
      size="70%"
      direction="rtl"
      destroy-on-close
    >
      <!-- 步骤条 -->
      <el-steps :active="applyStep" finish-status="success" align-center class="apply-steps">
        <el-step title="选择物资/装备" />
        <el-step title="调用详情" />
      </el-steps>

      <!-- 第一步：选择物资/装备 -->
      <div v-if="applyStep === 0" class="apply-step-content">
        <div class="apply-step-layout">
          <!-- 左侧：常用物资套组 -->
          <div class="apply-left">
            <div class="section-title">常用物资套组</div>
            <div class="kit-list">
              <div
                v-for="kit in materialKits"
                :key="kit.name"
                class="kit-item"
                :class="{ active: selectedKit === kit.name }"
                @click="handleSelectKit(kit)"
              >
                <div class="kit-icon">
                  <el-icon :size="20"><Box /></el-icon>
                </div>
                <span class="kit-name">{{ kit.name }}</span>
              </div>
            </div>
            <el-button class="reset-btn" @click="handleResetKit">重置</el-button>
          </div>

          <!-- 右侧：装备/物资清单 -->
          <div class="apply-right">
            <div class="section-title">装备/物资清单</div>
            <el-table
              :data="applyForm.materials"
              border
              stripe
              :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
            >
              <el-table-column prop="name" label="设备物资名称" min-width="140" align="center" />
              <el-table-column prop="category" label="类别" min-width="160" align="center" />
              <el-table-column prop="unit" label="单位" width="80" align="center" />
              <el-table-column prop="quantity" label="数量" width="80" align="center" />
              <el-table-column label="操作" width="70" align="center">
                <template #default="{ $index }">
                  <el-button type="danger" link :icon="Delete" @click="handleRemoveMaterial($index)" />
                </template>
              </el-table-column>
            </el-table>
            <div class="add-material-row">
              <el-link type="primary" :underline="false" :icon="Plus" @click="handleAddMaterial">添加</el-link>
            </div>
            <div class="stock-hint">
              <el-text type="danger" size="small">注：当前剩余库存：无人机装备套组-无人机×2台；户外工作基础套组-发电机×1台、帐篷×2个；灯具、电源套组-场地灯×3个、电源×2台</el-text>
            </div>
            <el-checkbox v-model="applyForm.acceptPartial" class="accept-partial-checkbox">
              申请的物资/设备不足时，接受按实际库存情况调配
            </el-checkbox>
          </div>
        </div>
      </div>

      <!-- 第二步：调用详情 -->
      <div v-if="applyStep === 1" class="apply-step-content">
        <el-form ref="applyFormRef" :model="applyForm" :rules="applyRules" label-width="130px" class="apply-form">
          <el-form-item label="使用地点" prop="location">
            <div class="location-input-row">
              <el-input v-model="applyForm.location" placeholder="请输入使用地点" class="form-input" />
              <el-button type="primary" plain @click="handleGetLocation">在地图中获取位置</el-button>
            </div>
          </el-form-item>
          <el-form-item label="申请事由" prop="reason">
            <el-input v-model="applyForm.reason" type="textarea" :rows="4" placeholder="请描述申请事由" class="form-input" />
          </el-form-item>
          <el-form-item label="紧急调用申请" prop="urgent">
            <el-radio-group v-model="applyForm.urgent">
              <el-radio :value="true">是</el-radio>
              <el-radio :value="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="运输方式" prop="transport">
            <el-input v-model="applyForm.transport" placeholder="请输入运输方式" class="form-input" />
          </el-form-item>
          <el-form-item label="预计归还时间" prop="returnTime">
            <el-date-picker
              v-model="applyForm.returnTime"
              type="datetime"
              placeholder="请选择预计归还时间"
              value-format="YYYY-MM-DD HH:mm"
              class="form-input"
            />
          </el-form-item>
          <el-form-item label="相关附件">
            <el-link type="primary" :underline="false" :icon="Paperclip">添加</el-link>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="apply-drawer-footer">
          <el-button @click="applyVisible = false">取消</el-button>
          <el-button v-if="applyStep > 0" @click="applyStep--">上一步</el-button>
          <el-button v-if="applyStep < 1" type="primary" @click="applyStep++">下一步</el-button>
          <el-button v-if="applyStep === 1" type="primary" @click="handleApplySubmit">确认</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Search, Plus, Reading, Box, Tools, Operation,
  List, Delete, Paperclip
} from '@element-plus/icons-vue'
import { applyRecordData } from '@/mock/resource/warehouseData'
import type { ApplyRecord, ApplyMaterialItem } from '@/types/resource/warehouse'
import StatsCards from '@/components/StatsCards.vue'

const loading = ref(false)

// ── 筛选 ──
const currentCategory = ref('all')
const currentReturnStatus = ref<'all' | 'pending' | 'done' | 'none'>('all')
const searchKeyword = ref('')

const statusTabs = [
  { label: '全部', value: 'all' },
  { label: '待归还', value: 'pending' },
  { label: '已归还', value: 'done' },
  { label: '无需归还', value: 'none' }
]

// ── 分页 ──
const pagination = reactive({ page: 1, pageSize: 20, total: 0 })

// ── 统计卡片 ──
const statsCards = computed(() => {
  const data = applyRecordData
  const passCount = data.filter(d => d.applyResult === '通过').length
  const rejectCount = data.filter(d => d.applyResult === '不通过').length
  const pendingCount = data.filter(d => d.applyResult === '待审核').length
  return [
    { key: 'all', label: '全部', value: data.length, icon: Reading, color: '#409EFF', bgColor: '#ecf5ff' },
    { key: 'pass', label: '通过', value: passCount, icon: Box, color: '#67C23A', bgColor: '#f0f9eb' },
    { key: 'reject', label: '不通过', value: rejectCount, icon: Tools, color: '#F56C6C', bgColor: '#fef0f0' },
    { key: 'pending', label: '待审核', value: pendingCount, icon: Operation, color: '#E6A23C', bgColor: '#fdf6ec' }
  ]
})

// ── 过滤数据 ──
const filteredAllData = computed(() => {
  let data = [...applyRecordData]
  if (currentCategory.value !== 'all') {
    const map: Record<string, string> = { pass: '通过', reject: '不通过', pending: '待审核' }
    data = data.filter(item => item.applyResult === map[currentCategory.value])
  }
  if (currentReturnStatus.value !== 'all') {
    const map: Record<string, string> = { pending: '待归还', done: '已归还', none: '无需归还' }
    data = data.filter(item => item.returnStatus === map[currentReturnStatus.value])
  }
  if (searchKeyword.value) {
    data = data.filter(item =>
      item.materialName.includes(searchKeyword.value) ||
      item.applyCode.includes(searchKeyword.value) ||
      item.applicant.includes(searchKeyword.value) ||
      item.applyDept.includes(searchKeyword.value)
    )
  }
  return data
})

const tableData = computed(() => {
  const data = filteredAllData.value
  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

function handleCategoryChange(key: string) {
  currentCategory.value = key
  pagination.page = 1
}

function handleReturnStatusChange(value: string) {
  currentReturnStatus.value = value as 'all' | 'pending' | 'done' | 'none'
  pagination.page = 1
}

function handleSearch() { pagination.page = 1 }
function handleSizeChange(size: number) { pagination.pageSize = size; pagination.page = 1 }
function handlePageChange(page: number) { pagination.page = page }

// ── 详情 ──
const detailVisible = ref(false)
const currentDetail = ref<ApplyRecord | null>(null)

function handleViewDetail(row: ApplyRecord) {
  currentDetail.value = row
  detailVisible.value = true
}

// ── 申请调用 ──
const applyVisible = ref(false)
const applyStep = ref(0)
const applyFormRef = ref<FormInstance>()

const materialKits = [
  {
    name: '无人机装备套组',
    materials: [
      { name: '大疆mavic3pro', category: '应急处装备及配套物资/搜救设备', unit: '台', quantity: 1 },
      { name: '内存卡', category: '应急处装备及配套物资/其他', unit: '张', quantity: 2 }
    ]
  },
  {
    name: '户外工作基础套组',
    materials: [
      { name: '户外电源', category: '应急处装备及配套物资/发电设备', unit: '台', quantity: 1 },
      { name: '6平米充气帐篷', category: '基本上生活保障物资/帐篷', unit: '个', quantity: 2 }
    ]
  },
  {
    name: '灯具、电源套组',
    materials: [
      { name: '户外场地灯', category: '应急处装备及配套物资/照明设备', unit: '个', quantity: 3 },
      { name: '户外电源', category: '应急处装备及配套物资/发电设备', unit: '台', quantity: 2 }
    ]
  }
]

const selectedKit = ref('')

const applyForm = reactive<{
  materials: ApplyMaterialItem[]
  location: string
  reason: string
  urgent: boolean
  transport: string
  returnTime: string
  attachments: string[]
  acceptPartial: boolean
}>({
  materials: [],
  location: '',
  reason: '',
  urgent: false,
  transport: '',
  returnTime: '',
  attachments: [],
  acceptPartial: false
})

const applyRules: FormRules = {
  location: [{ required: true, message: '请输入使用地点', trigger: 'blur' }],
  reason: [{ required: true, message: '请输入申请事由', trigger: 'blur' }]
}

function openApplyDrawer() {
  applyStep.value = 0
  applyForm.materials = []
  applyForm.location = ''
  applyForm.reason = ''
  applyForm.urgent = false
  applyForm.transport = ''
  applyForm.returnTime = ''
  applyForm.attachments = []
  applyForm.acceptPartial = false
  selectedKit.value = ''
  applyVisible.value = true
}

function handleSelectKit(kit: typeof materialKits[number]) {
  selectedKit.value = kit.name
  applyForm.materials = kit.materials.map(m => ({ ...m }))
}

function handleResetKit() {
  selectedKit.value = ''
  applyForm.materials = []
}

function handleRemoveMaterial(index: number) {
  applyForm.materials.splice(index, 1)
}

function handleAddMaterial() {
  applyForm.materials.push({ name: '', category: '', unit: '', quantity: 1 })
}

function handleGetLocation() {
  ElMessage.info('正在获取地图位置...')
}

function handleApplySubmit() {
  applyFormRef.value?.validate(valid => {
    if (valid) {
      ElMessage.success('调用申请提交成功')
      applyVisible.value = false
    }
  })
}
</script>

<style lang="scss" scoped>
.inventory-query-page {
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
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #ebeef5;
    }

    .search-bar-left {
      display: flex;
      align-items: center;
      gap: 20px;
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
        &.el-link--primary { font-weight: 600; }
      }
    }

    .record-count {
      font-size: 14px;
      color: #909399;
    }

    .content-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;

      .content-header-left {
        .page-title {
          font-size: 16px;
          font-weight: 600;
          color: #303133;
        }
      }

      .content-header-right {
        display: flex;
        align-items: center;
      }
    }

    .data-table {
      flex: 1;
    }

    .sub-text {
      font-size: 12px;
      color: #909399;
    }

    .return-pending {
      color: #F56C6C;
      font-size: 13px;
      font-weight: 500;
    }

    .return-done {
      color: #67C23A;
      font-size: 13px;
      font-weight: 500;
    }

    .return-none {
      color: #909399;
      font-size: 13px;
      font-weight: 500;
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

// ── 详情抽屉 ──
.detail-content {
  padding: 0 20px;
}

// ── 申请调用抽屉 ──
.apply-steps {
  margin-bottom: 24px;
  padding: 0 20px;
}

.apply-step-content {
  padding: 0 20px;
  flex: 1;
  overflow: auto;
}

.apply-step-layout {
  display: flex;
  gap: 20px;
  min-height: 400px;
}

.apply-left {
  width: 220px;
  flex-shrink: 0;

  .section-title {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 12px;
    padding-left: 10px;
    border-left: 3px solid #409eff;
  }

  .kit-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 12px;
  }

  .kit-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: #409eff;
      background: #ecf5ff;
    }

    &.active {
      border-color: #409eff;
      background: #ecf5ff;
      color: #409eff;
    }

    .kit-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: #f0f2f5;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #909399;
    }

    &.active .kit-icon {
      background: #409eff;
      color: #fff;
    }

    .kit-name {
      font-size: 13px;
      font-weight: 500;
    }
  }

  .reset-btn {
    width: 100%;
  }
}

.apply-right {
  flex: 1;
  min-width: 0;

  .section-title {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 12px;
    padding-left: 10px;
    border-left: 3px solid #409eff;
  }

  .add-material-row {
    margin-top: 12px;
    margin-bottom: 8px;
  }

  .stock-hint {
    margin-bottom: 12px;
  }

  .accept-partial-checkbox {
    margin-top: 8px;
  }
}

.apply-form {
  max-width: 600px;

  .location-input-row {
    display: flex;
    gap: 12px;
    width: 100%;

    .form-input {
      flex: 1;
    }
  }
}

.apply-drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
