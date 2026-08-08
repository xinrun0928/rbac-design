<template>
  <div class="page-container">
    <div class="page-header">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        数据接口
      </el-button>
      <div class="header-right">
        <span class="sync-info">同步网关视频 2026年4月24日 09点20分</span>
        <el-button type="primary" @click="handleImport">导入</el-button>
        <el-button type="primary" @click="handleExport">导出</el-button>
      </div>
    </div>

    <el-table
      :data="tableData"
      border
      stripe
      :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
      class="data-table"
    >
      <el-table-column prop="name" label="接口名称" min-width="140" align="center" show-overflow-tooltip />
      <el-table-column prop="type" label="接口类型" width="120" align="center" />
      <el-table-column prop="url" label="访问地址" width="140" align="center" />
      <el-table-column prop="version" label="当前版本" width="100" align="center" />
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag type="success" effect="plain" size="small">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="160" align="center" />
      <el-table-column prop="description" label="描述" min-width="140" align="center" show-overflow-tooltip />
      <el-table-column label="操作" width="80" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleRemove(row)">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { interfaceData } from '@/mock/dispatch/weatherData'
import type { WeatherInterface } from '@/types/dispatch/weather'

const tableData = ref<WeatherInterface[]>([...interfaceData])

const handleAdd = () => {
  ElMessage.info('添加数据接口功能开发中...')
}

const handleImport = () => {
  ElMessage.info('导入功能开发中...')
}

const handleExport = () => {
  ElMessage.success('导出成功')
}

const handleRemove = (row: WeatherInterface) => {
  ElMessageBox.confirm(`确定要移除接口"${row.name}"吗？`, '移除确认', {
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
}
</style>
