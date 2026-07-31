<template>
  <div class="inventory-query-page">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 顶部标题栏 -->
      <div class="content-header">
        <div class="content-header-left">
          <h3 class="page-title">安全库存预警</h3>
        </div>
        <div class="content-header-right">
          <el-button type="primary" :icon="Plus" @click="settingsVisible = true">预警设置</el-button>
        </div>
      </div>

      <!-- 顶部统计卡片 -->
      <div class="stats-row">
        <div
          v-for="item in statsCards"
          :key="item.key"
          class="stats-card"
          :class="{ active: currentStatusFilter === item.key }"
          @click="handleStatusFilterChange(item.key)"
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

      <!-- 物资类型筛选 -->
      <div class="search-bar">
        <div class="search-bar-filter">
          <span class="filter-label">应急物资/装备类型：</span>
          <el-link
            v-for="tab in materialTypeTabs"
            :key="tab.value"
            class="filter-link"
            :underline="false"
            :type="currentMaterialType === tab.value ? 'primary' : 'info'"
            @click="handleMaterialTypeChange(tab.value)"
          >{{ tab.label }}</el-link>
        </div>
        <div class="search-bar-filter" style="margin-top: 8px;">
          <span class="filter-label">是否有附件：</span>
          <el-link
            v-for="tab in attachmentTabs"
            :key="tab.value"
            class="filter-link"
            :underline="false"
            :type="currentAttachmentFilter === tab.value ? 'primary' : 'info'"
            @click="handleAttachmentFilterChange(tab.value)"
          >{{ tab.label }}</el-link>
        </div>
      </div>

      <!-- 记录数 + 搜索 -->
      <div class="content-header" style="margin-top: 12px;">
        <div class="content-header-left">
          <span class="record-count">共{{ pagination.total }}条记录</span>
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
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="materialName" label="库存摘要" min-width="160" align="center">
          <template #default="{ row }">
            <el-link type="primary" :underline="false">{{ row.materialName }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="类型" min-width="180" align="center" show-overflow-tooltip />
        <el-table-column prop="stockQuantity" label="库存数量" width="100" align="center" />
        <el-table-column prop="idealQuantity" label="理想数量" width="100" align="center" />
        <el-table-column prop="supplyStatus" label="预警状态" width="100" align="center">
          <template #default="{ row }">
            <span v-if="row.supplyStatus === '待补充'" style="color: #F56C6C">{{ row.supplyStatus }}</span>
            <span v-else style="color: #67C23A">{{ row.supplyStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="warningDate" label="预警日期" width="120" align="center" />
        <el-table-column prop="clearDate" label="消警日期" width="120" align="center" />
        <el-table-column prop="handler" label="处理人" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.handleStatus === '待处理'" type="primary" effect="light" round>待处理</el-tag>
            <span v-else>{{ row.handler }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="handleRemark" label="处理备注" min-width="180" align="center" show-overflow-tooltip />
        <el-table-column label="附件" width="120" align="center">
          <template #default="{ row }">
            <template v-if="row.attachments && row.attachments.length > 0">
              <el-link
                v-for="(file, idx) in row.attachments"
                :key="idx"
                type="primary"
                :underline="false"
                class="attachment-link"
              >{{ file }}</el-link>
            </template>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="View" @click="handleView(row)" />
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)" />
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

    <!-- 预警设置抽屉 -->
    <el-drawer
      v-model="settingsVisible"
      title="预警设置"
      size="500px"
      direction="rtl"
      destroy-on-close
    >
      <div class="settings-content">
        <!-- 顶部 Tabs -->
        <el-tabs v-model="settingsActiveTab" @tab-change="handleSettingsTabChange">
          <el-tab-pane label="应急装备及配套物资" name="emergency" />
          <el-tab-pane label="基本生活保障物资" name="daily" />
          <el-tab-pane label="工程材料与机械加工" name="engineering" />
          <el-tab-pane label="其他" name="other" />
        </el-tabs>

        <div class="settings-body">
          <!-- 左侧子分类列表 -->
          <div class="settings-sidebar">
            <div
              v-for="item in currentSubCategories"
              :key="item.key"
              class="settings-sidebar-item"
              :class="{ active: activeSubCategory === item.key }"
              @click="activeSubCategory = item.key"
            >{{ item.label }}</div>
          </div>

          <!-- 右侧设置表格 -->
          <div class="settings-table">
            <el-table
              :data="currentSettingsData"
              border
              :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
            >
              <el-table-column prop="category" label="种别" min-width="120" align="center" />
              <el-table-column label="预警数量" align="center">
                <template #default="{ row }">
                  <div class="threshold-input">
                    <span class="threshold-symbol">≤</span>
                    <el-input-number
                      v-model="row.threshold"
                      :min="0"
                      :max="9999"
                      size="small"
                      controls-position="right"
                      style="width: 100px"
                    />
                    <span class="threshold-unit">{{ row.unit }}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="settingsVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveSettings">保存</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Plus, View, Edit, WarningFilled, CircleCheck, Tickets } from '@element-plus/icons-vue'
import { safetyWarningRecordData } from '@/mock/resource/warehouseData'
import type { SafetyWarningRecord, WarningSupplyStatus } from '@/types/resource/warehouse'

const loading = ref(false)
const searchKeyword = ref('')
const settingsVisible = ref(false)

// ── 筛选状态 ──
const currentStatusFilter = ref('all')
const currentMaterialType = ref('all')
const currentAttachmentFilter = ref('all')

// ── 统计卡片 ──
const statsCards = computed(() => {
  const data = safetyWarningRecordData
  const pendingCount = data.filter(d => d.handleStatus === '待处理').length
  const handledCount = data.filter(d => d.handleStatus === '已处理').length
  return [
    { key: 'all', label: '全部', value: data.length, icon: Tickets, color: '#409EFF', bgColor: '#ecf5ff' },
    { key: 'pending', label: '待处理', value: pendingCount, icon: WarningFilled, color: '#F56C6C', bgColor: '#fef0f0' },
    { key: 'handled', label: '已处理', value: handledCount, icon: CircleCheck, color: '#67C23A', bgColor: '#f0f9eb' }
  ]
})

// ── 筛选选项 ──
const materialTypeTabs = [
  { label: '全部', value: 'all' },
  { label: '应急处置装备', value: '应急处置装备' },
  { label: '工程机械装备', value: '工程机械装备' },
  { label: '后勤保障装备', value: '后勤保障装备' },
  { label: '应急物资', value: '应急物资' }
]

const attachmentTabs = [
  { label: '全部', value: 'all' },
  { label: '有附件', value: 'has' },
  { label: '无附件', value: 'none' }
]

// ── 过滤逻辑 ──
const filteredData = computed(() => {
  let data = [...safetyWarningRecordData]

  if (currentStatusFilter.value === 'pending') {
    data = data.filter(d => d.handleStatus === '待处理')
  } else if (currentStatusFilter.value === 'handled') {
    data = data.filter(d => d.handleStatus === '已处理')
  }

  if (currentMaterialType.value !== 'all') {
    data = data.filter(d => d.category.includes(currentMaterialType.value))
  }

  if (currentAttachmentFilter.value === 'has') {
    data = data.filter(d => d.attachments && d.attachments.length > 0)
  } else if (currentAttachmentFilter.value === 'none') {
    data = data.filter(d => !d.attachments || d.attachments.length === 0)
  }

  if (searchKeyword.value) {
    data = data.filter(d =>
      d.materialName.includes(searchKeyword.value) ||
      d.category.includes(searchKeyword.value) ||
      d.handler.includes(searchKeyword.value)
    )
  }

  return data
})

// ── 分页 ──
const pagination = reactive({ page: 1, pageSize: 20, total: 0 })

const tableData = computed(() => {
  pagination.total = filteredData.value.length
  const start = (pagination.page - 1) * pagination.pageSize
  return filteredData.value.slice(start, start + pagination.pageSize)
})

function handleStatusFilterChange(key: string) {
  currentStatusFilter.value = key
  pagination.page = 1
}

function handleMaterialTypeChange(value: string) {
  currentMaterialType.value = value
  pagination.page = 1
}

function handleAttachmentFilterChange(value: string) {
  currentAttachmentFilter.value = value
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

function handleView(row: SafetyWarningRecord) {
  ElMessage.info(`查看：${row.materialName}`)
}

function handleEdit(row: SafetyWarningRecord) {
  ElMessage.info(`编辑：${row.materialName}`)
}

// ── 预警设置 ──
const settingsActiveTab = ref('emergency')
const activeSubCategory = ref('sub1')

interface SubCategory {
  key: string
  label: string
}

interface SettingsItem {
  category: string
  unit: string
  threshold: number
}

const subCategoryMap: Record<string, SubCategory[]> = {
  emergency: [
    { key: 'sub1', label: '发电设备' },
    { key: 'sub2', label: '搜救设备' },
    { key: 'sub3', label: '照明设备' },
    { key: 'sub4', label: '其他' }
  ],
  daily: [
    { key: 'sub1', label: '帐篷' },
    { key: 'sub2', label: '被褥' },
    { key: 'sub3', label: '食品' },
    { key: 'sub4', label: '其他' }
  ],
  engineering: [
    { key: 'sub1', label: '起重装备' },
    { key: 'sub2', label: '挖掘装备' },
    { key: 'sub3', label: '其他' }
  ],
  other: [
    { key: 'sub1', label: '其他物资' }
  ]
}

const settingsDataMap: Record<string, Record<string, SettingsItem[]>> = {
  emergency: {
    sub1: [
      { category: '户外电源', unit: '台', threshold: 2 },
      { category: '移动发电机', unit: '台', threshold: 1 },
      { category: '车载逆变器', unit: '台', threshold: 3 }
    ],
    sub2: [
      { category: '大疆mavic3pro', unit: '台', threshold: 2 },
      { category: '热成像仪', unit: '台', threshold: 1 },
      { category: '探照灯', unit: '个', threshold: 3 }
    ],
    sub3: [
      { category: '户外场地灯', unit: '个', threshold: 5 },
      { category: '强光手电', unit: '个', threshold: 10 }
    ],
    sub4: [
      { category: '内存卡', unit: '张', threshold: 5 },
      { category: '读卡器', unit: '个', threshold: 2 }
    ]
  },
  daily: {
    sub1: [
      { category: '6平米充气帐篷', unit: '个', threshold: 3 },
      { category: '3平米帐篷', unit: '个', threshold: 5 }
    ],
    sub2: [
      { category: '冬季棉被', unit: '床', threshold: 10 },
      { category: '夏季薄被', unit: '床', threshold: 10 }
    ],
    sub3: [
      { category: '矿泉水', unit: '箱', threshold: 20 },
      { category: '压缩饼干', unit: '箱', threshold: 10 }
    ],
    sub4: [
      { category: '急救包', unit: '个', threshold: 5 }
    ]
  },
  engineering: {
    sub1: [
      { category: '汽车起重机', unit: '台', threshold: 1 },
      { category: '塔吊', unit: '台', threshold: 1 }
    ],
    sub2: [
      { category: '挖掘机', unit: '台', threshold: 1 },
      { category: '装载机', unit: '台', threshold: 1 }
    ],
    sub3: [
      { category: '水泥', unit: '吨', threshold: 50 },
      { category: '钢筋', unit: '吨', threshold: 30 }
    ]
  },
  other: {
    sub1: [
      { category: '警示锥', unit: '个', threshold: 20 },
      { category: '警示带', unit: '卷', threshold: 10 }
    ]
  }
}

const currentSubCategories = computed(() => subCategoryMap[settingsActiveTab.value] || [])

const currentSettingsData = computed(() => {
  const tabData = settingsDataMap[settingsActiveTab.value]
  if (!tabData) return []
  return tabData[activeSubCategory.value] || []
})

watch(settingsActiveTab, () => {
  activeSubCategory.value = currentSubCategories.value[0]?.key || 'sub1'
})

function handleSettingsTabChange() {
  activeSubCategory.value = currentSubCategories.value[0]?.key || 'sub1'
}

function handleSaveSettings() {
  ElMessage.success('预警设置保存成功')
  settingsVisible.value = false
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

    .page-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }

    .stats-row {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-bottom: 16px;
      padding: 16px 0;

      .stats-card {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 24px;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid transparent;
        min-width: 160px;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        &.active {
          border-color: var(--el-color-primary);
          background: var(--el-color-primary-light-9);
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
            font-size: 22px;
            font-weight: 700;
            line-height: 1.2;
          }

          .stats-label {
            font-size: 13px;
            color: #909399;
            margin-top: 2px;
          }
        }
      }
    }

    .search-bar {
      display: flex;
      flex-direction: column;
      gap: 0;
      margin-bottom: 0;

      .search-bar-filter {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px;

        .filter-label {
          font-size: 14px;
          color: #606266;
          font-weight: 500;
          white-space: nowrap;
        }

        .filter-link {
          font-size: 14px;
          padding: 2px 8px;
          border-radius: 4px;
          transition: all 0.2s;

          &:hover {
            background: #f0f7ff;
          }
        }
      }
    }

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .content-header-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .content-header-right {
        display: flex;
        align-items: center;
      }

      .record-count {
        font-size: 14px;
        color: #909399;
      }
    }

    .data-table {
      flex: 1;
      margin-bottom: 0;

      .attachment-link {
        display: block;
        font-size: 13px;
        line-height: 1.6;
      }
    }

    .pagination-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
      flex-shrink: 0;
    }
  }

  // 预警设置抽屉样式
  .settings-content {
    display: flex;
    flex-direction: column;
    height: 100%;

    :deep(.el-tabs__header) {
      margin-bottom: 16px;
    }

    .settings-body {
      display: flex;
      gap: 16px;
      flex: 1;
      min-height: 0;

      .settings-sidebar {
        width: 160px;
        flex-shrink: 0;
        border: 1px solid #e4e7ed;
        border-radius: 8px;
        overflow: hidden;

        .settings-sidebar-item {
          padding: 14px 16px;
          font-size: 14px;
          color: #606266;
          cursor: pointer;
          transition: all 0.2s;
          border-bottom: 1px solid #e4e7ed;

          &:last-child {
            border-bottom: none;
          }

          &:hover {
            background: #f5f7fa;
            color: #409EFF;
          }

          &.active {
            background: #ecf5ff;
            color: #409EFF;
            font-weight: 600;
          }
        }
      }

      .settings-table {
        flex: 1;
        min-width: 0;

        .threshold-input {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;

          .threshold-symbol {
            color: #909399;
            font-size: 14px;
          }

          .threshold-unit {
            color: #909399;
            font-size: 13px;
          }
        }
      }
    }
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
