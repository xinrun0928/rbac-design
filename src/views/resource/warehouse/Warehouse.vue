<template>
  <div class="inventory-query-page">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 顶部统计卡片 -->
      <div class="stats-row">
        <div class="stats-card active">
          <div class="stats-icon" style="background: #ecf5ff; color: #409eff">
            <el-icon :size="26"><OfficeBuilding /></el-icon>
          </div>
          <div class="stats-info">
            <div class="stats-value" style="color: #409eff">{{ filteredData.length }}</div>
            <div class="stats-label">全部</div>
          </div>
        </div>
      </div>

      <!-- 库存预警筛选 -->
      <div class="search-bar">
        <div class="search-bar-filter">
          <span class="filter-label">库存预警：</span>
          <el-link
            v-for="tab in warningTabs"
            :key="tab.value"
            class="filter-link"
            :underline="false"
            :type="currentWarning === tab.value ? 'primary' : 'info'"
            @click="handleWarningChange(tab.value)"
          >{{ tab.label }}</el-link>
        </div>
      </div>

      <!-- 记录数 -->
      <div class="content-header">
        <div class="content-header-left">
          <span class="record-count">共{{ filteredData.length }}条记录</span>
        </div>
      </div>

      <!-- 表格 -->
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
          <el-table-column prop="name" label="仓库名称" min-width="200" align="center">
            <template #default="{ row }">
              <el-link type="primary" :underline="false">{{ row.name }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="warningStatus" label="库存预警状态" width="150" align="center">
            <template #default="{ row }">
              <span v-if="row.warningStatus === '无预警'" style="color: #909399">{{ row.warningStatus }}</span>
              <span v-else style="color: #F56C6C; font-weight: 500">{{ row.warningStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="具体地址" min-width="220" align="center" show-overflow-tooltip />
          <el-table-column prop="department" label="主体责任单位" width="160" align="center">
            <template #default="{ row }">
              <el-link type="primary" :underline="false">{{ row.department }}</el-link>
            </template>
          </el-table-column>
          <el-table-column prop="manager" label="仓库负责人" width="120" align="center" />
          <el-table-column prop="phone" label="联系电话" width="140" align="center" />
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
import { OfficeBuilding } from '@element-plus/icons-vue'
import { warehouseRecordData } from '@/mock/resource/warehouseData'
import type { WarehouseRecord, StockWarningStatus } from '@/types/resource/warehouse'

const loading = ref(false)

const currentWarning = ref<'all' | 'none' | 'has'>('all')

const warningTabs = [
  { label: '全部', value: 'all' },
  { label: '无预警', value: 'none' },
  { label: '存在预警', value: 'has' }
]

const pagination = reactive({ page: 1, pageSize: 20, total: 0 })

const filteredData = computed(() => {
  let data = [...warehouseRecordData]
  if (currentWarning.value === 'none') {
    data = data.filter(item => item.warningStatus === '无预警')
  } else if (currentWarning.value === 'has') {
    data = data.filter(item => item.warningStatus !== '无预警')
  }
  return data
})

const tableData = computed(() => {
  pagination.total = filteredData.value.length
  const start = (pagination.page - 1) * pagination.pageSize
  return filteredData.value.slice(start, start + pagination.pageSize)
})

function handleWarningChange(value: string) {
  currentWarning.value = value as 'all' | 'none' | 'has'
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
      justify-content: space-between;
      margin-bottom: 16px;

      .record-count {
        font-size: 14px;
        color: #909399;
      }
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
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
