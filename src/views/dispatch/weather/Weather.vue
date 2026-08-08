<template>
  <div class="weather-management">
    <el-card class="table-card animate-item" shadow="never">
      <div class="search-bar">
        <span class="search-bar-title">天气预警数据接入</span>
        <div class="search-bar-actions">
          <DataAccessButton text="天气预警接入" @click="handleAdd" />
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
        <el-table-column type="index" label="序号" width="60" align="center" />
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
import { ElMessage } from 'element-plus'
import ExportButton from '@/components/ExportButton.vue'
import DataAccessButton from '@/components/DataAccessButton.vue'
import { weatherData } from '@/mock/dispatch/weatherData'
import type { WeatherData } from '@/types/dispatch/weather'

const tableData = ref<WeatherData[]>([...weatherData])

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

const toggleVisible = (row: WeatherData) => {
  row.visible = !row.visible
}
</script>

<style lang="scss" scoped>
.weather-management {
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
      gap: 0;
      flex-shrink: 0;
    }

    .link-text {
      color: #409EFF;
      cursor: pointer;
      font-weight: 500;
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
