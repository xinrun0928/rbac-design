<template>
  <div class="page-container">
    <div class="page-header">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        台风接入
      </el-button>
      <div class="header-right">
        <span class="sync-info">同步网关视频 2026年4月24日 09点20分</span>
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
      <el-table-column prop="name" label="台风名称" min-width="150" align="center" show-overflow-tooltip />
      <el-table-column prop="windSpeed" label="风速（m/s）" width="130" align="center" />
      <el-table-column label="台风经纬度" width="130" align="center">
        <template #default="{ row }">
          {{ row.longitude }}
        </template>
      </el-table-column>
      <el-table-column prop="impactCount" label="预计影响隐患点清单" width="160" align="center">
        <template #default="{ row }">
          <span class="link-text">{{ row.impactCount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="centerWindForce" label="台风中心风力" width="130" align="center" />
      <el-table-column prop="updateTime" label="更新时间" width="160" align="center" />
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag type="danger" effect="plain" size="small">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="toggleVisible(row)">
            {{ row.visible ? '隐藏' : '显示' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { typhoonData } from '@/mock/dispatch/weatherData'
import type { TyphoonData } from '@/types/dispatch/weather'

const tableData = ref<TyphoonData[]>([...typhoonData])

const handleAdd = () => {
  ElMessage.info('台风接入功能开发中...')
}

const handleExport = () => {
  ElMessage.success('导出成功')
}

const toggleVisible = (row: TyphoonData) => {
  row.visible = !row.visible
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

.link-text {
  color: #409EFF;
  cursor: pointer;
  font-weight: 500;
}

.data-table {
  width: 100%;
}
</style>
