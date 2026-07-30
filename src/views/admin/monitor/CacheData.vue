<template>
  <div class="cache-data-management">
    <!-- 顶部面包屑返回 -->
    <div class="page-header animate-item">
      <el-page-header @back="handleBack">
        <template #content>
          <span class="page-title">缓存数据 - {{ cacheName }}</span>
        </template>
      </el-page-header>
    </div>

    <el-card class="table-card animate-item" shadow="never">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="键名">
            <el-input v-model="searchForm.key" placeholder="输入键名" clearable :prefix-icon="Search" style="width: 180px" @keyup.enter="handleSearch" />
          </el-form-item>
        </el-form>
      </div>

      <el-table
        v-loading="loading"
        :data="filteredData"
        border
        stripe
        highlight-current-row
        row-key="key"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column label="序号" width="60" align="center" type="index">
          <template #default="{ $index }">
            <span class="index-text">{{ $index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="key" label="缓存键名" min-width="300" show-overflow-tooltip>
          <template #default="{ row }">
            <el-button type="primary" link class="key-link" @click="handleKeyClick(row)">
              <span class="key-text">{{ row.key }}</span>
            </el-button>
          </template>
        </el-table-column>

        <el-table-column prop="dataType" label="数据类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :type="row.dataType === 'map' ? 'warning' : 'info'"
              size="small"
              effect="plain"
            >
              {{ row.dataType }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="ttl" label="过期时间" width="140" align="center">
          <template #default="{ row }">
            <span :class="['ttl-text', row.ttl === -1 ? 'never' : '']">
              {{ formatTtl(row.ttl) }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="remark" label="备注" min-width="180" show-overflow-tooltip />

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

    <!-- 缓存详情抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="`缓存详情 - ${currentEntry?.key || ''}`"
      size="50%"
      direction="rtl"
      class="cache-detail-drawer"
    >
      <template v-if="currentEntry">
        <el-descriptions :column="1" border class="detail-descriptions">
          <el-descriptions-item label="缓存名称">{{ currentEntry.cacheName }}</el-descriptions-item>
          <el-descriptions-item label="缓存键名">
            <span class="key-text mono">{{ currentEntry.key }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="数据类型">
            <el-tag :type="currentEntry.dataType === 'map' ? 'warning' : 'info'" size="small" effect="plain">
              {{ currentEntry.dataType }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="过期时间">
            <span :class="['ttl-text', currentEntry.ttl === -1 ? 'never' : '']">
              {{ formatTtl(currentEntry.ttl) }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="备注">{{ currentEntry.remark }}</el-descriptions-item>
        </el-descriptions>

        <div class="value-section">
          <div class="section-header">
            <span class="section-title">缓存内容</span>
          </div>
          <!-- Map 类型 -->
          <template v-if="currentEntry.dataType === 'map'">
            <el-table
              :data="parsedMapData"
              border
              stripe
              size="small"
              :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
            >
              <el-table-column prop="field" label="字段" width="180" />
              <el-table-column prop="value" label="值" min-width="200" show-overflow-tooltip />
            </el-table>
          </template>
          <!-- String 类型 -->
          <template v-else>
            <el-input
              :model-value="currentEntry.value"
              type="textarea"
              :rows="12"
              readonly
              class="value-textarea"
            />
          </template>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Delete } from '@element-plus/icons-vue'
import { cacheListData } from '@/mock/admin/monitorData'
import type { CacheEntry, CacheMapDetail } from '@/types/admin/monitor'
import { formatTtl } from '@/utils/format'

const router = useRouter()
const route = useRoute()
const cacheName = computed(() => (route.query.cacheName as string) || '')

const loading = ref(false)
const allData = ref<CacheEntry[]>(cacheListData)
const drawerVisible = ref(false)
const currentEntry = ref<CacheEntry | null>(null)

const searchForm = reactive({
  key: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const filteredData = computed(() => {
  let data = allData.value.filter(item => item.cacheName === cacheName.value)

  if (searchForm.key) {
    data = data.filter(item => item.key.includes(searchForm.key))
  }

  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

const parsedMapData = computed(() => {
  if (!currentEntry.value || currentEntry.value.dataType !== 'map') return []
  try {
    const obj: CacheMapDetail = JSON.parse(currentEntry.value.value)
    return Object.entries(obj).map(([field, val]) => ({ field, value: val }))
  } catch {
    return [{ field: '(解析失败)', value: currentEntry.value.value }]
  }
})

function handleBack() {
  router.push('/admin/monitor/cache/list')
}

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

function handleKeyClick(row: CacheEntry) {
  currentEntry.value = row
  drawerVisible.value = true
}

function handleDelete(row: CacheEntry) {
  ElMessageBox.confirm(
    `确认要删除缓存键 "${row.key}" 吗？`,
    '删除确认',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    allData.value = allData.value.filter(item => item.key !== row.key)
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.cache-data-management {
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
    &:nth-child(1) { animation-delay: 0.05s; }
    &:nth-child(2) { animation-delay: 0.12s; }
  }

  .page-header {
    padding: 16px 20px;
    background: #fff;
    border-bottom: 1px solid #ebeef5;
    flex-shrink: 0;

    .page-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }

  .table-card {
    border-radius: 0;
    border: none;
    border-top: none;
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
    .key-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 12px;
    }
    .key-link .key-text { color: #409EFF; }

    .ttl-text {
      font-size: 13px;
      color: #606266;

      &.never {
        color: #67C23A;
        font-weight: 500;
      }
    }

    .data-table { flex: 1; }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    flex-shrink: 0;
  }

  :deep(.cache-detail-drawer) {
    .el-drawer__header {
      margin-bottom: 0;
      padding: 20px 24px;
      border-bottom: 1px solid #EBEEF5;

      .el-drawer__title {
        font-weight: 600;
        font-size: 16px;
      }
    }

    .el-drawer__body {
      padding: 24px;
      overflow-y: auto;
    }
  }

  .detail-descriptions {
    margin-bottom: 24px;
  }

  .mono {
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
  }

  .ttl-text {
    font-size: 13px;
    color: #606266;

    &.never {
      color: #67C23A;
      font-weight: 500;
    }
  }

  .value-section {
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding: 10px 16px;
      background: #F5F7FA;
      border-radius: 6px;

      .section-title {
        font-weight: 600;
        font-size: 14px;
        color: #303133;
      }
    }

    .value-textarea {
      :deep(textarea) {
        font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
        font-size: 12px;
        line-height: 1.6;
      }
    }
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
