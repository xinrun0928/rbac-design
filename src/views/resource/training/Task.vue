<template>
  <div class="inventory-query-page">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 顶部标题栏 -->
      <div class="content-header">
        <div class="content-header-left">
          <h3 class="page-title">装备操作考核任务</h3>
        </div>
      </div>

      <!-- 顶部统计卡片 -->
      <StatsCards v-model="currentStatus" :items="statsCards" @change="handleStatusChange" />

      <!-- 是否合格筛选 -->
      <div class="search-bar">
        <div class="search-bar-filter">
          <span class="filter-label">是否合格：</span>
          <el-link
            v-for="tab in qualifiedTabs"
            :key="tab.value"
            class="filter-link"
            :underline="false"
            :type="currentQualified === tab.value ? 'primary' : 'info'"
            @click="handleQualifiedChange(tab.value)"
          >{{ tab.label }}</el-link>
        </div>
      </div>

      <!-- 记录数 -->
      <div class="content-header" style="margin-top: 12px;">
        <div class="content-header-left">
          <span class="record-count">共{{ pagination.total }}条记录</span>
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
        <el-table-column prop="taskName" label="考核任务名称" min-width="220" align="center">
          <template #default="{ row }">
            <el-link type="primary" :underline="false">{{ row.taskName }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="taskStatus" label="任务状态" width="120" align="center">
          <template #default="{ row }">
            <span style="color: #909399">{{ row.taskStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="startDate" label="考核开始日期" width="140" align="center" />
        <el-table-column prop="endDate" label="考核结束日期" width="140" align="center" />
        <el-table-column prop="score" label="考核分数" width="120" align="center" />
        <el-table-column prop="qualified" label="是否合格" width="120" align="center">
          <template #default="{ row }">
            <span style="color: #909399">{{ row.qualified }}</span>
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
import { Reading, CircleCheck, WarningFilled, Document } from '@element-plus/icons-vue'
import { examTaskRecordData } from '@/mock/resource/warehouseData'
import type { ExamTaskRecord } from '@/types/resource/warehouse'
import StatsCards from '@/components/StatsCards.vue'

const loading = ref(false)

// ── 筛选 ──
const currentStatus = ref('all')
const currentQualified = ref<'all' | '合格' | '不合格'>('all')

const qualifiedTabs = [
  { label: '全部', value: 'all' },
  { label: '合格', value: '合格' },
  { label: '不合格', value: '不合格' }
]

// ── 分页 ──
const pagination = reactive({ page: 1, pageSize: 20, total: 0 })

// ── 统计卡片 ──
const statsCards = computed(() => {
  const data = examTaskRecordData
  return [
    { key: 'all', label: '全部', value: data.length, icon: Reading, color: '#409EFF', bgColor: '#ecf5ff' },
    { key: '进行中', label: '待完成', value: data.filter(d => d.taskStatus === '进行中').length, icon: WarningFilled, color: '#E6A23C', bgColor: '#fdf6ec' },
    { key: '已完成', label: '已完成', value: data.filter(d => d.taskStatus === '已完成').length, icon: CircleCheck, color: '#67C23A', bgColor: '#f0f9eb' },
    { key: '未开始', label: '未开始', value: data.filter(d => d.taskStatus === '未开始').length, icon: Document, color: '#909399', bgColor: '#f4f4f5' }
  ]
})

// ── 过滤 ──
const filteredData = computed(() => {
  let data = [...examTaskRecordData]
  if (currentStatus.value !== 'all') {
    data = data.filter(item => item.taskStatus === currentStatus.value)
  }
  if (currentQualified.value !== 'all') {
    data = data.filter(item => item.qualified === currentQualified.value)
  }
  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

const tableData = computed(() => filteredData.value)

function handleStatusChange(key: string) {
  currentStatus.value = key
  pagination.page = 1
}

function handleQualifiedChange(value: string) {
  currentQualified.value = value as 'all' | '合格' | '不合格'
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
    }

    .pagination-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
      flex-shrink: 0;
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
