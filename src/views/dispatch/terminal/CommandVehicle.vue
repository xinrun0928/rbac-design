<template>
  <div class="command-vehicle-management">
    <el-card class="table-card animate-item" shadow="never">
      <div class="search-bar">
        <span class="search-bar-title">应急指挥车接入</span>
        <div class="search-bar-actions">
          <DataAccessButton text="应急指挥车接入" @click="handleAdd" />
          <span class="sync-time">同步时间 2026年4月24日 09点20分</span>
          <el-button :icon="Refresh" circle @click="handleRefresh" />
          <ExportButton />
        </div>
      </div>

      <el-table
        :data="paginatedData"
        border
        stripe
        highlight-current-row
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column prop="vehicleName" label="应急车名称" min-width="140" align="center" show-overflow-tooltip />
        <el-table-column prop="responsibleUnit" label="主要负责单位" min-width="140" align="center" show-overflow-tooltip />
        <el-table-column prop="description" label="车辆说明描述" min-width="140" align="center" show-overflow-tooltip />
        <el-table-column prop="mainUnit" label="主要使用单位" min-width="120" align="center" show-overflow-tooltip />
        <el-table-column label="接入状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.accessStatus === '已接入' ? 'success' : 'danger'" effect="plain" size="small">
              {{ row.accessStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="accessTime" label="接入时间" width="160" align="center" />
        <el-table-column label="车辆状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.vehicleStatus === '正常' ? 'success' : 'danger'" effect="plain" size="small">
              {{ row.vehicleStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleViewVideo(row)">视频</el-button>
            <el-button type="primary" link size="small" @click="handleViewDevices(row)">设备</el-button>
            <el-button type="primary" link size="small" @click="handleEdit(row)">修改</el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

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
import { Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import ExportButton from '@/components/ExportButton.vue'
import DataAccessButton from '@/components/DataAccessButton.vue'
import { commandVehicleData } from '@/mock/dispatch/terminalData'
import type { CommandVehicle } from '@/types/dispatch/terminal'

const tableData = ref<CommandVehicle[]>([...commandVehicleData])

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const paginatedData = computed(() => {
  pagination.total = tableData.value.length
  const start = (pagination.page - 1) * pagination.pageSize
  return tableData.value.slice(start, start + pagination.pageSize)
})

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
}

const handlePageChange = (page: number) => {
  pagination.page = page
}

const handleAdd = () => {
  ElMessage.info('应急指挥车接入功能开发中...')
}

const handleRefresh = () => {
  ElMessage.success('刷新成功')
}

const handleViewVideo = (row: CommandVehicle) => {
  ElMessage.info(`查看视频：${row.vehicleName}`)
}

const handleViewDevices = (row: CommandVehicle) => {
  ElMessage.info(`查看设备：${row.vehicleName}`)
}

const handleEdit = (row: CommandVehicle) => {
  ElMessage.info(`修改指挥车：${row.vehicleName}`)
}

const handleDelete = (row: CommandVehicle) => {
  ElMessageBox.confirm(`确定要删除指挥车"${row.vehicleName}"吗？`, '删除确认', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    tableData.value = tableData.value.filter(item => item.id !== row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.command-vehicle-management {
  padding: 0;
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
      gap: 16px;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #ebeef5;
    }

    .search-bar-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .search-bar-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

    .sync-time {
      font-size: 13px;
      color: #909399;
    }

    .data-table { flex: 1; }
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
