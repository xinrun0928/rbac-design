<template>
  <div class="page-container">
    <div class="page-header">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        服务区接入
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
      <el-table-column prop="name" label="服务区名称" min-width="140" align="center" />
      <el-table-column prop="route" label="所属路线" width="140" align="center" />
      <el-table-column prop="roadSection" label="所属路段" width="120" align="center" />
      <el-table-column prop="stakeNumber" label="桩号" width="100" align="center" />
      <el-table-column prop="area" label="所属区域" width="100" align="center" />
      <el-table-column prop="manager" label="管理单位" width="120" align="center" />
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag type="success" effect="plain" size="small">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
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
import { serviceInfoData } from '@/mock/dispatch/roadData'
import type { ServiceInfo } from '@/types/dispatch/roadData'

const tableData = ref<ServiceInfo[]>([...serviceInfoData])

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
  ElMessage.info('服务区接入功能开发中...')
}

const handleExport = () => {
  ElMessage.success('导出成功')
}

const handleRemove = (row: ServiceInfo) => {
  ElMessageBox.confirm(`确定要移除服务区"${row.name}"吗？`, '移除确认', {
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
