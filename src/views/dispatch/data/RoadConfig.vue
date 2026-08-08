<template>
  <div class="page-container">
    <div class="page-header">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        重点路段接入
      </el-button>
      <div class="header-right">
        <span class="sync-info">同步网关视频 2026年4月24日 09点20分</span>
        <el-button type="success" @click="handleExport">导出</el-button>
      </div>
    </div>

    <el-table
      :data="paginatedData"
      border
      stripe
      :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
      class="data-table"
    >
      <el-table-column prop="name" label="路段简称" min-width="120" align="center" />
      <el-table-column prop="direction" label="易堵方向" width="100" align="center" />
      <el-table-column prop="congestionLevel" label="易堵程度" width="100" align="center" />
      <el-table-column prop="congestionTime" label="易堵时段" width="120" align="center" />
      <el-table-column prop="congestionPoint" label="易堵点名称" min-width="140" align="center" show-overflow-tooltip />
      <el-table-column prop="stakeNumber" label="易堵点桩号" width="120" align="center" />
      <el-table-column prop="company" label="经营单位" width="120" align="center" />
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column label="操作" width="80" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleRemove(row)">移除</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { roadConfigData } from '@/mock/dispatch/roadData'
import type { RoadConfig } from '@/types/dispatch/roadData'

const tableData = ref<RoadConfig[]>([...roadConfigData])

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

const handleSizeChange = () => { pagination.page = 1 }
const handlePageChange = () => {}

const handleAdd = () => {
  ElMessage.info('重点路段接入功能开发中...')
}

const handleExport = () => {
  ElMessage.success('导出成功')
}

const handleRemove = (row: RoadConfig) => {
  ElMessageBox.confirm(`确定要移除路段"${row.name}"吗？`, '移除确认', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    tableData.value = tableData.value.filter(item => item.id !== row.id)
    ElMessage.success('移除成功')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.page-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sync-info {
  font-size: 14px;
  color: #606266;
}

.data-table {
  width: 100%;
  flex: 1;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
