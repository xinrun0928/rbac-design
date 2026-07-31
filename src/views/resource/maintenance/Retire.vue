<template>
  <div class="retire-page">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 顶部统计卡片 -->
      <div class="stats-row">
        <div
          v-for="item in statsCards"
          :key="item.key"
          class="stats-card"
          :class="{ active: currentFilter === item.key }"
          @click="handleFilterChange(item.key)"
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

      <!-- 类型筛选 -->
      <div class="search-bar">
        <div class="search-bar-filter">
          <span class="filter-label">类型：</span>
          <el-link
            v-for="tab in typeTabs"
            :key="tab.value"
            class="filter-link"
            :underline="false"
            :type="currentType === tab.value ? 'primary' : 'info'"
            @click="handleTypeChange(tab.value)"
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
          <el-table-column prop="type" label="类型" width="100" align="center" />
          <el-table-column prop="auditStatus" label="审核状态" width="120" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.auditStatus === '待审核'" type="primary" effect="light" round>{{ row.auditStatus }}</el-tag>
              <span v-else-if="row.auditStatus === '已通过'" style="color: #67C23A">{{ row.auditStatus }}</span>
              <span v-else-if="row.auditStatus === '未通过'" style="color: #F56C6C">{{ row.auditStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="cost" label="处置费用(元)" width="130" align="center" />
          <el-table-column prop="deviceName" label="设备名称" min-width="140" align="center">
            <template #default="{ row }">
              <el-link type="primary" :underline="false">{{ row.deviceName }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="deviceCode" label="设备编码" min-width="160" align="center" />
          <el-table-column prop="category" label="种类" min-width="200" align="center" show-overflow-tooltip />
          <el-table-column prop="spec" label="规格型号" min-width="200" align="center" show-overflow-tooltip />
          <el-table-column label="相关附件" width="100" align="center">
            <template #default="{ row }">
              <el-icon v-if="row.attachment" class="attachment-icon"><Paperclip /></el-icon>
            </template>
          </el-table-column>
          <el-table-column prop="desc" label="描述" min-width="180" align="center" show-overflow-tooltip />
          <el-table-column label="申请人" min-width="180" align="center">
            <template #default="{ row }">
              <span>{{ row.applicant }}（{{ row.phone }}）</span>
            </template>
          </el-table-column>
          <el-table-column prop="applyDate" label="申请日期" width="130" align="center" />
          <el-table-column prop="auditDate" label="审核日期" width="130" align="center" />
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
import { Document, Clock, CircleCheck, CircleClose, Paperclip } from '@element-plus/icons-vue'
import { retireAuditRecordData } from '@/mock/resource/warehouseData'
import type { RetireType, AuditStatus } from '@/types/resource/warehouse'

const loading = ref(false)

const currentFilter = ref<'all' | '待审核' | '已通过' | '不通过'>('all')
const currentType = ref<'all' | '退役' | '报废'>('all')

const typeTabs = [
  { label: '全部', value: 'all' },
  { label: '设备退役', value: '退役' },
  { label: '设备报废', value: '报废' }
]

const pagination = reactive({ page: 1, pageSize: 20, total: 0 })

const statsCards = computed(() => {
  const data = retireAuditRecordData
  const pending = data.filter(d => d.auditStatus === '待审核').length
  const passed = data.filter(d => d.auditStatus === '已通过').length
  const failed = data.filter(d => d.auditStatus === '未通过').length
  return [
    { key: 'all', label: '全部', value: data.length, icon: Document, color: '#409EFF', bgColor: '#ecf5ff' },
    { key: '待审核', label: '待审核', value: pending, icon: Clock, color: '#409EFF', bgColor: '#ecf5ff' },
    { key: '已通过', label: '已通过', value: passed, icon: CircleCheck, color: '#67C23A', bgColor: '#f0f9eb' },
    { key: '不通过', label: '不通过', value: failed, icon: CircleClose, color: '#F56C6C', bgColor: '#fef0f0' }
  ]
})

const filteredData = computed(() => {
  let data = [...retireAuditRecordData]

  if (currentFilter.value === '待审核') {
    data = data.filter(item => item.auditStatus === '待审核')
  } else if (currentFilter.value === '已通过') {
    data = data.filter(item => item.auditStatus === '已通过')
  } else if (currentFilter.value === '不通过') {
    data = data.filter(item => item.auditStatus === '未通过')
  }

  if (currentType.value !== 'all') {
    data = data.filter(item => item.type === currentType.value)
  }

  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

const total = computed(() => pagination.total)

function handleFilterChange(value: string) {
  currentFilter.value = value as 'all' | '待审核' | '已通过' | '不通过'
  pagination.page = 1
}

function handleTypeChange(value: string) {
  currentType.value = value as 'all' | '退役' | '报废'
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
.retire-page {
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

    .attachment-icon {
      color: #909399;
      cursor: pointer;
      &:hover {
        color: #409eff;
      }
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
