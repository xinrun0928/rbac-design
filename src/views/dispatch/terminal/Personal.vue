<template>
  <div class="personal-device-management">
    <el-card class="table-card animate-item" shadow="never">
      <div class="search-bar">
        <span class="search-bar-title">应急单兵设备接入</span>
        <div class="search-bar-actions">
          <DataAccessButton text="应急单兵设备接入" @click="handleAdd" />
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
        <el-table-column prop="deviceName" label="单兵设备名称" min-width="130" align="center" show-overflow-tooltip />
        <el-table-column prop="deviceCode" label="设备编号" width="100" align="center" />
        <el-table-column prop="deviceType" label="设备类型" width="100" align="center" />
        <el-table-column label="设备状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.deviceStatus === '在线' ? 'success' : 'danger'" effect="plain" size="small">
              {{ row.deviceStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="owner" label="所属人员" width="100" align="center" />
        <el-table-column prop="department" label="所属单位" min-width="120" align="center" show-overflow-tooltip />
        <el-table-column prop="updateTime" label="更新时间" width="160" align="center" />
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleViewVideo(row)">视频</el-button>
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
import { personalDeviceData } from '@/mock/dispatch/terminalData'
import type { PersonalDevice } from '@/types/dispatch/terminal'

const tableData = ref<PersonalDevice[]>([...personalDeviceData])

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
  ElMessage.info('应急单兵设备接入功能开发中...')
}

const handleRefresh = () => {
  ElMessage.success('刷新成功')
}

const handleViewVideo = (row: PersonalDevice) => {
  ElMessage.info(`查看视频：${row.deviceName}`)
}

const handleEdit = (row: PersonalDevice) => {
  ElMessage.info(`修改设备：${row.deviceName}`)
}

const handleDelete = (row: PersonalDevice) => {
  ElMessageBox.confirm(`确定要删除设备"${row.deviceName}"吗？`, '删除确认', {
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
.personal-device-management {
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
