<template>
  <div class="weather-interface-management">
    <el-card class="table-card animate-item" shadow="never">
      <div class="search-bar">
        <span class="search-bar-title">气象数据接口设置</span>
        <div class="search-bar-actions">
          <DataAccessButton text="数据接口" @click="handleAdd" />
          <el-button type="primary" @click="handleImport">导入</el-button>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import ExportButton from '@/components/ExportButton.vue'
import DataAccessButton from '@/components/DataAccessButton.vue'
import { interfaceData } from '@/mock/dispatch/weatherData'
import type { WeatherInterface } from '@/types/dispatch/weather'

const tableData = ref<WeatherInterface[]>([...interfaceData])

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
  ElMessage.info('添加数据接口功能开发中...')
}

const handleImport = () => {
  ElMessage.info('导入功能开发中...')
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
.weather-interface-management {
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
