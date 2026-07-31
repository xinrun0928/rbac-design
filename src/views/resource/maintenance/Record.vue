<template>
  <div class="maintenance-record-page">
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
        <div class="search-bar-filter">
          <span class="filter-label">维保状态：</span>
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
          <span class="record-count">共{{ pagination.total }}条记录</span>
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

        <el-table-column prop="status" label="维保状态" width="200" align="center">
          <template #default="{ row }">
            <span v-if="row.status === '待维保'" class="status-pending">
              待维保<span v-if="row.overdueDays">（已逾期{{ row.overdueDays }}天）</span>
            </span>
            <span v-else class="status-done">已完成</span>
          </template>
        </el-table-column>

        <el-table-column prop="taskName" label="维保任务名称" min-width="200" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <el-link type="primary" :underline="false" class="task-name-link">{{ row.taskName }}</el-link>
          </template>
        </el-table-column>

        <el-table-column prop="executor" label="执行人" width="200" align="center">
          <template #default="{ row }">
            <span class="executor-text">{{ row.executor }}（{{ row.phone }}）</span>
          </template>
        </el-table-column>

        <el-table-column prop="cost" label="此次维保总费用（元）" width="170" align="center">
          <template #default="{ row }">
            <span class="cost-text">{{ row.cost != null ? row.cost.toFixed(2) : '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="expectDate" label="预计完成日期" width="140" align="center">
          <template #default="{ row }">
            <span class="date-text">{{ row.expectDate }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="actualDate" label="实际完成日期" width="140" align="center">
          <template #default="{ row }">
            <span class="date-text">{{ row.actualDate || '-' }}</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Reading, Clock, Select } from '@element-plus/icons-vue'
import type { Component } from 'vue'
import { maintenanceTaskRecordData } from '@/mock/resource/warehouseData'
import type { MaintenanceTaskRecord, MaintenanceTaskStatus } from '@/types/resource/warehouse'

const loading = ref(false)
const allData = ref<MaintenanceTaskRecord[]>([...maintenanceTaskRecordData])
const currentStatus = ref<MaintenanceTaskStatus | 'all'>('all')

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

interface StatsCard {
  key: MaintenanceTaskStatus | 'all'
  label: string
  value: number
  icon: Component
  color: string
  bgColor: string
}

const statsCards = computed<StatsCard[]>(() => [
  { key: 'all', label: '全部', value: allData.value.length, icon: Reading, color: '#409EFF', bgColor: '#ecf5ff' },
  { key: '待维保', label: '待维保', value: allData.value.filter(d => d.status === '待维保').length, icon: Clock, color: '#F56C6C', bgColor: '#fef0f0' },
  { key: '已完成', label: '已完成', value: allData.value.filter(d => d.status === '已完成').length, icon: Select, color: '#909399', bgColor: '#f4f4f5' }
])

const statusTabs: { label: string; value: MaintenanceTaskStatus | 'all' }[] = [
  { label: '全部', value: 'all' },
  { label: '待维保', value: '待维保' },
  { label: '已维保', value: '已完成' }
]

const filteredData = computed(() => {
  let data = allData.value
  if (currentStatus.value !== 'all') {
    data = data.filter(item => item.status === currentStatus.value)
  }
  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

function handleStatusChange(value: MaintenanceTaskStatus | 'all') {
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
</script>

<style lang="scss" scoped>
.maintenance-record-page {
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

      .record-count {
        font-size: 14px;
        color: #606266;
      }
    }

    .status-pending {
      color: #F56C6C;
      font-weight: 500;
    }

    .status-done {
      color: #909399;
      font-weight: 500;
    }

    .task-name-link {
      font-weight: 500;
    }

    .executor-text {
      font-size: 13px;
      color: #606266;
    }

    .cost-text {
      font-size: 13px;
      color: #303133;
      font-weight: 500;
    }

    .date-text {
      font-size: 13px;
      color: #606266;
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
