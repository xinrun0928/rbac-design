<template>
  <div class="audit-page">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 顶部统计卡片 -->
      <div class="stats-row">
        <div
          v-for="item in statsCards"
          :key="item.key"
          class="stats-card"
          :class="{ active: currentResult === item.key }"
          @click="handleResultChange(item.key)"
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

      <!-- 审核结果筛选 -->
      <div class="search-bar">
        <div class="search-bar-filter">
          <span class="filter-label">审核结果：</span>
          <el-link
            v-for="tab in resultTabs"
            :key="tab.value"
            class="filter-link"
            :underline="false"
            :type="currentResult === tab.value ? 'primary' : 'info'"
            @click="handleResultChange(tab.value)"
          >{{ tab.label }}</el-link>
        </div>
      </div>

      <!-- 审核事项筛选 -->
      <div class="search-bar">
        <div class="search-bar-filter">
          <span class="filter-label">审核事项：</span>
          <el-link
            v-for="tab in itemTabs"
            :key="tab.value"
            class="filter-link"
            :underline="false"
            :type="currentItem === tab.value ? 'primary' : 'info'"
            @click="handleItemChange(tab.value)"
          >{{ tab.label }}</el-link>
        </div>
      </div>

      <!-- 记录数 -->
      <div class="content-header">
        <div class="record-count">共{{ total }}条记录</div>
      </div>

      <!-- 表格 -->
      <div class="table-wrapper">
        <el-table
          v-loading="loading"
          :data="filteredData"
          border
          stripe
          height="100%"
          :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        >
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="auditItem" label="审核事项" min-width="120" align="center">
            <template #default="{ row }">
              <el-link type="primary" :underline="false">{{ row.auditItem }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="isUrgent" label="是否为紧急调用申请" min-width="160" align="center">
            <template #default="{ row }">
              <span>{{ row.isUrgent ? '是' : '否' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="applyCode" label="申请单编号" min-width="150" align="center" />
          <el-table-column prop="status" label="审核状态" width="120" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.status === '待审核'" type="primary" effect="light" round>{{ row.status }}</el-tag>
              <span v-else-if="row.status === '已通过'" style="color: #67C23A">{{ row.status }}</span>
              <span v-else-if="row.status === '未通过'" style="color: #F56C6C">{{ row.status }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="handler" label="经办人" width="100" align="center" />
          <el-table-column prop="applyTime" label="申请时间" width="160" align="center" />
          <el-table-column prop="auditor" label="审核人" width="100" align="center" />
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
import { Document, Clock, CircleCheck } from '@element-plus/icons-vue'
import { auditRecordData } from '@/mock/resource/warehouseData'
import type { AuditRecord, AuditStatus, AuditItem } from '@/types/resource/warehouse'

const loading = ref(false)

const currentResult = ref<'all' | AuditStatus | '已审核'>('all')
const currentItem = ref<'all' | AuditItem>('all')

const resultTabs = [
  { label: '全部', value: 'all' },
  { label: '待审核', value: '待审核' },
  { label: '已通过', value: '已通过' },
  { label: '未通过', value: '未通过' }
]

const itemTabs = [
  { label: '全部', value: 'all' },
  { label: '调用审核', value: '调用审核' },
  { label: '出库审核', value: '出库审核' },
  { label: '盘点审核', value: '盘点审核' },
  { label: '入库审核', value: '入库审核' }
]

const pagination = reactive({ page: 1, pageSize: 20, total: 0 })

const statsCards = computed(() => {
  const data = auditRecordData
  const pending = data.filter(d => d.status === '待审核').length
  const audited = data.filter(d => d.status !== '待审核').length
  return [
    { key: 'all', label: '全部', value: data.length, icon: Document, color: '#409EFF', bgColor: '#ecf5ff' },
    { key: '待审核', label: '待审核', value: pending, icon: Clock, color: '#E6A23C', bgColor: '#fdf6ec' },
    { key: '已审核', label: '已审核', value: audited, icon: CircleCheck, color: '#67C23A', bgColor: '#f0f9eb' }
  ]
})

const filteredData = computed(() => {
  let data = [...auditRecordData]
  if (currentResult.value !== 'all') {
    if (currentResult.value === '已审核') {
      data = data.filter(item => item.status !== '待审核')
    } else {
      data = data.filter(item => item.status === currentResult.value)
    }
  }
  if (currentItem.value !== 'all') {
    data = data.filter(item => item.auditItem === currentItem.value)
  }
  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

const total = computed(() => pagination.total)

function handleResultChange(value: string) {
  currentResult.value = value as 'all' | AuditStatus | '已审核'
  pagination.page = 1
}

function handleItemChange(value: string) {
  currentItem.value = value as 'all' | AuditItem
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
.audit-page {
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

    .search-bar {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 12px;
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
        &.el-link--primary { font-weight: 600; }
      }
    }

    .content-header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;

      .record-count {
        font-size: 14px;
        color: #909399;
      }
    }

    .table-wrapper {
      flex: 1;
      overflow: auto;
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
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
