<template>
  <div class="fault-device-page">
    <el-card class="table-card" shadow="never">
      <!-- 顶部统计卡片 -->
      <StatsCards v-model="currentStatus" :items="statsCards" @change="handleStatusChange" />

      <!-- 记录数 -->
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
          <el-table-column prop="repairStatus" label="修复状态" width="100" align="center">
            <template #default="{ row }">
              <span v-if="row.repairStatus === '待处理'" style="color: #F56C6C; font-weight: 500;">{{ row.repairStatus }}</span>
              <span v-else style="color: #909399;">{{ row.repairStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="deviceName" label="设备名称" min-width="140" align="center" show-overflow-tooltip />
          <el-table-column prop="deviceCode" label="设备编码" min-width="170" align="center" show-overflow-tooltip />
          <el-table-column prop="category" label="种类" min-width="180" align="center" show-overflow-tooltip />
          <el-table-column prop="spec" label="规格型号" min-width="200" align="center" show-overflow-tooltip />
          <el-table-column label="相关附件" width="100" align="center">
            <template #default="{ row }">
              <el-icon v-if="row.attachment" style="color: #409EFF; cursor: pointer;"><Paperclip /></el-icon>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="faultDesc" label="故障描述" min-width="180" align="center" show-overflow-tooltip />
          <el-table-column label="报障人" min-width="160" align="center">
            <template #default="{ row }">
              {{ row.reporter }}（{{ row.phone }}）
            </template>
          </el-table-column>
          <el-table-column prop="reportDate" label="报障日期" width="120" align="center" />
          <el-table-column prop="repairDate" label="修复日期" width="120" align="center" />
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
import { Search, Warning, CircleCheck, Clock, Document, Delete, Paperclip } from '@element-plus/icons-vue'
import { faultDeviceRecordData } from '@/mock/resource/warehouseData'
import StatsCards from '@/components/StatsCards.vue'
import type { RepairStatus } from '@/types/resource/warehouse'

const loading = ref(false)

// ── 筛选 ──
const currentStatus = ref<'all' | RepairStatus>('all')
const searchKeyword = ref('')

// ── 统计卡片 ──
const statsCards = computed(() => {
  const data = faultDeviceRecordData
  const pendingCount = data.filter(d => d.repairStatus === '待处理').length
  const repairedCount = data.filter(d => d.repairStatus === '已修复').length
  const scrappedCount = data.filter(d => d.repairStatus === '已报废').length
  const retiredCount = data.filter(d => d.repairStatus === '已退役').length
  return [
    { key: 'all', label: '全部', value: data.length, icon: Warning, color: '#409EFF', bgColor: '#ecf5ff' },
    { key: '待处理', label: '待处理', value: pendingCount, icon: Clock, color: '#F56C6C', bgColor: '#fef0f0' },
    { key: '已修复', label: '已修复', value: repairedCount, icon: CircleCheck, color: '#909399', bgColor: '#f4f4f5' },
    { key: '已报废', label: '已报废', value: scrappedCount, icon: Delete, color: '#909399', bgColor: '#f4f4f5' },
    { key: '已退役', label: '已退役', value: retiredCount, icon: Document, color: '#909399', bgColor: '#f4f4f5' }
  ]
})

// ── 过滤数据 ──
const filteredData = computed(() => {
  let data = [...faultDeviceRecordData]

  if (currentStatus.value !== 'all') {
    data = data.filter(item => item.repairStatus === currentStatus.value)
  }

  if (searchKeyword.value) {
    data = data.filter(item =>
      item.deviceName.includes(searchKeyword.value) ||
      item.deviceCode.includes(searchKeyword.value) ||
      item.category.includes(searchKeyword.value) ||
      item.faultDesc.includes(searchKeyword.value) ||
      item.reporter.includes(searchKeyword.value)
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
  currentStatus.value = key as 'all' | RepairStatus
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
.fault-device-page {
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
