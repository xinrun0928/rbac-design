<template>
  <div class="page-container">
    <div class="page-header">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        风力接入
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
      <el-table-column prop="area" label="所属区域" min-width="120" align="center" />
      <el-table-column prop="windSpeed" label="风速（m/s）" width="120" align="center" />
      <el-table-column prop="windLevel" label="风力等级" width="100" align="center">
        <template #default="{ row }">
          <span class="link-text">{{ row.windLevel }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="windRange" label="风力范围" width="100" align="center" />
      <el-table-column prop="impactCount" label="预计影响隐患点清单" width="160" align="center">
        <template #default="{ row }">
          <span class="link-text">{{ row.impactCount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="160" align="center" />
      <el-table-column type="index" label="序号" width="60" align="center" />
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { windData } from '@/mock/dispatch/weatherData'
import type { WindData } from '@/types/dispatch/weather'

const tableData = ref<WindData[]>([...windData])

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
  ElMessage.info('风力接入功能开发中...')
}

const handleExport = () => {
  ElMessage.success('导出成功')
}

const toggleVisible = (row: WindData) => {
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

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style>
