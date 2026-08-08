<template>
  <div class="video-management">
    <el-card class="table-card animate-item" shadow="never">
      <div class="search-bar">
        <span class="search-bar-title">监控视频</span>
        <div class="search-bar-actions">
          <el-button type="primary" @click="handleAdd">配置网关</el-button>
          <span class="sync-info">同步网关视频 2026年4月24日 09点20分</span>
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
        <el-table-column prop="deviceName" label="设备名称" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="deviceType" label="设备类型" width="120" align="center" />
        <el-table-column prop="department" label="所属单位" min-width="130" align="center" show-overflow-tooltip />
        <el-table-column label="设备状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.deviceStatus === '在线' ? 'success' : row.deviceStatus === '故障' ? 'danger' : 'info'" effect="plain" size="small">
              {{ row.deviceStatus }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="longitude" label="经度" width="120" align="center" />
        <el-table-column prop="latitude" label="纬度" width="120" align="center" />
        <el-table-column prop="installLocation" label="安装位置" min-width="140" align="center" show-overflow-tooltip />
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleStartMeeting(row)">发起会议</el-button>
            <el-button type="primary" link size="small" @click="handleJoinMeeting(row)">加入会议</el-button>
            <el-button type="primary" link size="small" @click="handleDetail(row)">详情</el-button>
            <el-button type="danger" link size="small" @click="handleRemove(row)">移除</el-button>
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
import { monitorVideoData } from '@/mock/dispatch/networkData'
import type { MonitorVideo } from '@/types/dispatch/network'

const tableData = ref<MonitorVideo[]>([...monitorVideoData])

const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const paginatedData = computed(() => {
  pagination.total = tableData.value.length
  const start = (pagination.page - 1) * pagination.pageSize
  return tableData.value.slice(start, start + pagination.pageSize)
})

const handleSizeChange = (size: number) => { pagination.pageSize = size; pagination.page = 1 }
const handlePageChange = (page: number) => { pagination.page = page }
const handleRefresh = () => { ElMessage.success('刷新成功') }
const handleAdd = () => { ElMessage.info('配置网关功能开发中...') }

const handleStartMeeting = (row: MonitorVideo) => { ElMessage.info(`发起会议：${row.deviceName}`) }
const handleJoinMeeting = (row: MonitorVideo) => { ElMessage.info(`加入会议：${row.deviceName}`) }
const handleDetail = (row: MonitorVideo) => { ElMessage.info(`查看详情：${row.deviceName}`) }

const handleRemove = (row: MonitorVideo) => {
  ElMessageBox.confirm(`确定要移除设备"${row.deviceName}"吗？`, '移除确认', {
    type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消'
  }).then(() => {
    tableData.value = tableData.value.filter(item => item.id !== row.id)
    ElMessage.success('移除成功')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.video-management {
  padding: 0;
  background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;

  .animate-item { animation: fadeInUp 0.5s ease forwards; opacity: 0; }

  .table-card {
    border-radius: 12px;
    border: none;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.el-card__body) { padding: 20px; display: flex; flex-direction: column; flex: 1; overflow: hidden; }

    .search-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #ebeef5;
    }

    .search-bar-title { font-size: 16px; font-weight: 600; color: #303133; }

    .search-bar-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }

    .sync-info { font-size: 13px; color: #909399; }

    .data-table { flex: 1; }
  }

  .pagination-wrapper { display: flex; justify-content: flex-end; margin-top: 16px; flex-shrink: 0; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
