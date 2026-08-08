<template>
  <div class="page-container">
    <div class="page-header">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        天气预警接入
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
      <el-table-column prop="area" label="所属区域" min-width="120" align="center" />
      <el-table-column prop="warningType" label="预警类型" width="120" align="center" />
      <el-table-column label="预警等级" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="getWarningLevelType(row.warningLevel)" effect="plain" size="small">
            {{ row.warningLevel }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="publishTime" label="发布时间" width="160" align="center" />
      <el-table-column prop="updateTime" label="更新时间" width="160" align="center" />
      <el-table-column prop="impactCount" label="预计影响隐患点清单" width="160" align="center">
        <template #default="{ row }">
          <span class="link-text">{{ row.impactCount }}</span>
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
import { weatherData } from '@/mock/dispatch/weatherData'
import type { WeatherData } from '@/types/dispatch/weather'

const tableData = ref<WeatherData[]>([...weatherData])

const getWarningLevelType = (level: string) => {
  const map: Record<string, string> = {
    '红色': 'danger',
    '橙色': 'warning',
    '黄色': '',
    '蓝色': 'info'
  }
  return map[level] || 'info'
}

const handleAdd = () => {
  ElMessage.info('天气预警接入功能开发中...')
}

const handleExport = () => {
  ElMessage.success('导出成功')
}

const toggleVisible = (row: WeatherData) => {
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
