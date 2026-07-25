<template>
  <div class="cache-list-management">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="缓存名称">
            <el-input v-model="searchForm.cacheName" placeholder="输入缓存名称" clearable :prefix-icon="Search" style="width: 180px" @keyup.enter="handleSearch" />
          </el-form-item>
        </el-form>
      </div>

      <el-table
        v-loading="loading"
        :data="filteredData"
        border
        stripe
        highlight-current-row
        row-key="cacheName"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600' }"
        class="data-table"
      >
        <el-table-column label="序号" width="60" align="center" type="index">
          <template #default="{ $index }">
            <span class="index-text">{{ $index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="cacheName" label="缓存名称" min-width="260" align="center">
          <template #default="{ row }">
            <el-button type="primary" link class="cache-name-link" @click="handleCacheNameClick(row.cacheName)">
              {{ row.cacheName }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column prop="keyCount" label="键数量" width="120" align="center">
          <template #default="{ row }">
            <el-tag type="info" effect="plain" size="small">{{ row.keyCount }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
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
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { cacheNameListData } from '@/mock/admin/monitorData'
import type { CacheNameInfo } from '@/types/admin/monitor'

const router = useRouter()
const loading = ref(false)
const tableData = ref<CacheNameInfo[]>(cacheNameListData)

const searchForm = reactive({
  cacheName: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const filteredData = computed(() => {
  let data = tableData.value

  if (searchForm.cacheName) {
    data = data.filter(item => item.cacheName.includes(searchForm.cacheName))
  }

  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

function handleSearch() {
  pagination.page = 1
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
}

function handlePageChange(page: number) {
  pagination.page = page
}

function handleCacheNameClick(cacheName: string) {
  router.push({ path: '/admin/monitor/cache/data', query: { cacheName } })
}

function handleDelete(row: CacheNameInfo) {
  ElMessageBox.confirm(
    `确认要删除缓存 "${row.cacheName}" 下的所有键吗？此操作不可恢复。`,
    '删除确认',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    tableData.value = tableData.value.filter(item => item.cacheName !== row.cacheName)
    ElMessage.success(`已删除缓存 ${row.cacheName}`)
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.cache-list-management {
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
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #ebeef5;
    }

    .search-form {
      .el-form-item { margin-bottom: 0; margin-right: 12px; }
    }

    .index-text { color: #909399; font-size: 13px; }

    .cache-name-link {
      font-weight: 500;
      font-size: 14px;
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
