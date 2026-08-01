<template>
  <div class="fault-warning-page">
    <el-card class="table-card" shadow="never">
      <!-- 顶部统计卡片 -->
      <StatsCards v-model="currentStatus" :items="statsCards" @change="handleStatusChange" />

      <!-- 装备类型筛选 -->
      <div class="search-bar">
        <div class="search-bar-filter">
          <span class="filter-label">应急物资/装备类型：</span>
          <el-link
            v-for="tab in categoryTabs"
            :key="tab.value"
            class="filter-link"
            :underline="false"
            :type="currentCategory === tab.value ? 'primary' : 'info'"
            @click="handleCategoryChange(tab.value)"
          >{{ tab.label }}</el-link>
        </div>
      </div>

      <!-- 预警状态筛选 -->
      <div class="search-bar">
        <div class="search-bar-filter">
          <span class="filter-label">预警状态：</span>
          <el-link
            v-for="tab in warningStatusTabs"
            :key="tab.value"
            class="filter-link"
            :underline="false"
            :type="currentWarningStatus === tab.value ? 'primary' : 'info'"
            @click="handleWarningStatusChange(tab.value)"
          >{{ tab.label }}</el-link>
        </div>
      </div>

      <!-- 记录数 + 操作按钮 -->
      <div class="content-header">
        <div class="content-header-left">
          <span class="record-count">共{{ filteredData.length }}条记录</span>
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

      <!-- 数据表格 -->
      <div class="data-table">
        <el-table
          v-loading="loading"
          :data="tableData"
          border
          stripe
          height="100%"
          :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        >
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="materialName" label="库存摘要" min-width="140" align="center">
            <template #default="{ row }">
              <el-link type="primary" :underline="false">{{ row.materialName }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="category" label="类型" min-width="180" align="center" show-overflow-tooltip />
          <el-table-column prop="warningType" label="预警类型" width="110" align="center" />
          <el-table-column prop="faultCount" label="累计故障次数" width="120" align="center" />
          <el-table-column prop="deviceCode" label="设备/物资编号" min-width="170" align="center">
            <template #default="{ row }">
              <el-link type="primary" :underline="false">{{ row.deviceCode }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="useLife" label="使用年限" min-width="200" align="center" show-overflow-tooltip />
          <el-table-column prop="expireDuration" label="过期时长" width="100" align="center" />
          <el-table-column prop="handleStatus" label="预警状态" width="110" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.handleStatus === '待处理'" type="primary" effect="light" round>{{ row.handleStatus }}</el-tag>
              <span v-else-if="row.handleStatus === '报废出库'" style="color: #F56C6C">{{ row.handleStatus }}</span>
              <span v-else-if="row.handleStatus === '维保续期'" style="color: #67C23A">{{ row.handleStatus }}</span>
              <span v-else>{{ row.handleStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="warningDate" label="预警日期" width="120" align="center" />
          <el-table-column prop="handleDate" label="处理日期" width="120" align="center" />
          <el-table-column prop="handler" label="处理人" width="90" align="center" />
          <el-table-column prop="handleRemark" label="处理备注" min-width="140" align="center" show-overflow-tooltip />
          <el-table-column label="附件" min-width="160" align="center">
            <template #default="{ row }">
              <template v-if="row.attachments && row.attachments.length">
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
        </el-table>
      </div>

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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Search, Warning, CircleCheck, Clock } from '@element-plus/icons-vue'
import { faultWarningRecordData } from '@/mock/resource/warehouseData'
import type { FaultHandleStatus } from '@/types/resource/warehouse'
import StatsCards from '@/components/StatsCards.vue'

const loading = ref(false)

// ── 筛选 ──
const currentStatus = ref<'all' | 'pending' | 'done'>('all')
const currentCategory = ref('all')
const currentWarningStatus = ref<'all' | FaultHandleStatus>('all')
const searchKeyword = ref('')

const categoryTabs = [
  { label: '全部', value: 'all' },
  { label: '应急处置装备', value: '应急处置装备' },
  { label: '工程机械装备', value: '工程机械装备' },
  { label: '后勤保障装备', value: '后勤保障装备' },
  { label: '应急物资', value: '应急物资' }
]

const warningStatusTabs = [
  { label: '全部', value: 'all' as const },
  { label: '待处理', value: '待处理' as const },
  { label: '报废出库', value: '报废出库' as const },
  { label: '维保续期', value: '维保续期' as const }
]

// ── 统计卡片 ──
const statsCards = computed(() => {
  const data = faultWarningRecordData
  const pendingCount = data.filter(d => d.handleStatus === '待处理').length
  const doneCount = data.filter(d => d.handleStatus !== '待处理').length
  return [
    { key: 'all', label: '全部', value: data.length, icon: Warning, color: '#409EFF', bgColor: '#ecf5ff' },
    { key: 'pending', label: '待处理', value: pendingCount, icon: Clock, color: '#E6A23C', bgColor: '#fdf6ec' },
    { key: 'done', label: '已处理', value: doneCount, icon: CircleCheck, color: '#67C23A', bgColor: '#f0f9eb' }
  ]
})

// ── 过滤数据 ──
const filteredData = computed(() => {
  let data = [...faultWarningRecordData]

  if (currentStatus.value === 'pending') {
    data = data.filter(item => item.handleStatus === '待处理')
  } else if (currentStatus.value === 'done') {
    data = data.filter(item => item.handleStatus !== '待处理')
  }

  if (currentCategory.value !== 'all') {
    data = data.filter(item => item.category.startsWith(currentCategory.value))
  }

  if (currentWarningStatus.value !== 'all') {
    data = data.filter(item => item.handleStatus === currentWarningStatus.value)
  }

  if (searchKeyword.value) {
    data = data.filter(item =>
      item.materialName.includes(searchKeyword.value) ||
      item.deviceCode.includes(searchKeyword.value) ||
      item.category.includes(searchKeyword.value)
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

function handleStatusChange(key: string) {
  currentStatus.value = key as 'all' | 'pending' | 'done'
  pagination.page = 1
}

function handleCategoryChange(value: string) {
  currentCategory.value = value
  pagination.page = 1
}

function handleWarningStatusChange(value: string) {
  currentWarningStatus.value = value as 'all' | FaultHandleStatus
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
</script>

<style lang="scss" scoped>
.fault-warning-page {
  padding: 16px;
  background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;

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
      margin-bottom: 12px;

      .search-bar-filter {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px;

        .filter-label {
          font-size: 14px;
          color: #606266;
          font-weight: 500;
          margin-right: 4px;
        }

        .filter-link {
          font-size: 14px;
          margin: 0 8px;
        }
      }
    }

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .content-header-left {
        .record-count {
          font-size: 14px;
          color: #606266;
        }
      }

      .content-header-right {
        display: flex;
        align-items: center;
        gap: 12px;
      }
    }

    .data-table {
      flex: 1;
      overflow: auto;
      border-radius: 8px;

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
}
</style>
