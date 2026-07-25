<template>
  <div class="regulation-query-page">
    <!-- 顶部搜索区 + 统计卡片 -->
    <div class="top-card animate-item">
      <!-- 搜索区 -->
      <div class="search-section">
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="强降雨公路防御响应工作制度"
            clearable
            :prefix-icon="Search"
            @keyup.enter="handleSearch"
          >
            <template #append>
              <el-button :icon="Search" @click="handleSearch">搜索</el-button>
            </template>
          </el-input>
        </div>
      </div>

      <!-- 统计卡片行 -->
      <div class="stats-row">
        <div v-for="item in statsCards" :key="item.label" class="stats-card">
          <div class="stats-icon" :style="{ background: item.color }">
            <el-icon :size="22"><component :is="item.icon" /></el-icon>
          </div>
          <div class="stats-info">
            <div class="stats-value">{{ item.value }}</div>
            <div class="stats-label">{{ item.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 最新发布 + 热门搜索 -->
    <div class="two-col-row animate-item">
      <!-- 最新发布 -->
      <el-card class="col-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">最新发布</span>
            <el-button type="primary" link @click="handleViewAll">
              查看全部 <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </template>
        <div class="latest-list">
          <div v-for="(item, index) in latestData" :key="item.id" class="latest-item">
            <span class="latest-rank" :class="{ top: index < 3 }">{{ index + 1 }}</span>
            <span class="latest-name">{{ item.name }}</span>
            <span class="latest-date">{{ item.date }}</span>
          </div>
        </div>
      </el-card>

      <!-- 热门搜索 -->
      <el-card class="col-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">热门搜索</span>
          </div>
        </template>
        <div class="hot-list">
          <div v-for="(item, index) in hotData" :key="item.id" class="hot-item">
            <span class="hot-rank" :class="{ top: index < 3 }">{{ index + 1 }}</span>
            <span class="hot-name">{{ item.name }}</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 数据表格区 -->
    <el-card class="table-card animate-item" shadow="never">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        highlight-current-row
        row-key="id"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column label="序号" width="70" align="center" type="index">
          <template #default="{ $index }">
            <span class="index-text">{{ $index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="文档名称" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="doc-name">{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="version" label="版本" width="100" align="center" />

        <el-table-column prop="type" label="制度类型" width="120" align="center">
          <template #default="{ row }">
            <el-tag effect="light" size="small" :type="row.type === '基本工作制度' ? '' : 'warning'">
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag effect="light" size="small" :type="row.status === '实施' ? 'success' : 'danger'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="dateRange" label="起止时间" width="220" align="center" />

        <el-table-column prop="createTime" label="创建日期" width="120" align="center" />

        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="View" @click="handleView(row)">查看</el-button>
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

    <!-- 详情抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      title="制度详情"
      size="50%"
      direction="rtl"
    >
      <template v-if="currentRow">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="文档名称" :span="2">{{ currentRow.name }}</el-descriptions-item>
          <el-descriptions-item label="版本">{{ currentRow.version }}</el-descriptions-item>
          <el-descriptions-item label="制度类型">
            <el-tag effect="light" size="small" :type="currentRow.type === '基本工作制度' ? '' : 'warning'">
              {{ currentRow.type }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag effect="light" size="small" :type="currentRow.status === '实施' ? 'success' : 'danger'">
              {{ currentRow.status }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="起止时间">{{ currentRow.dateRange }}</el-descriptions-item>
          <el-descriptions-item label="创建日期">{{ currentRow.createTime }}</el-descriptions-item>
        </el-descriptions>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Search, View, ArrowRight, Document, Tickets, Collection
} from '@element-plus/icons-vue'

// ── 状态 ──
const loading = ref(false)
const searchKeyword = ref('')
const activeTab = ref('latest')
const totalCount = ref(10)
const drawerVisible = ref(false)
const currentRow = ref<any>(null)

// ── Tab配置 ──
const tabs = [
  { key: 'latest', label: '最新发布' },
  { key: 'hot', label: '热门搜索' }
]

// ── 统计卡片 ──
const statsCards = reactive([
  { label: '基本工作制度', value: 243, icon: Document, color: 'linear-gradient(135deg, #409EFF 0%, #66B1FF 100%)', type: 'primary' },
  { label: '专项工作制度', value: 233, icon: Tickets, color: 'linear-gradient(135deg, #E6A23C 0%, #EBB563 100%)', type: 'warning' },
  { label: '总计', value: 10, icon: Collection, color: 'linear-gradient(135deg, #67C23A 0%, #85CE61 100%)', type: 'success' }
])

// ── 最新发布 ──
const latestData = reactive([
  { id: 1, name: '极端天气交通运输应急响应工作制度', date: '2024-06-04' },
  { id: 2, name: '强降雨公路防御响应工作制度', date: '2025-06-23' },
  { id: 3, name: '公路防汛防涝监测与应急处置管理制度', date: '2023-07-10' },
  { id: 4, name: '高速公路恶劣天气交通安全管控工作制度', date: '2023-07-10' },
  { id: 5, name: '潮汐车道运行监测与调度管理制度', date: '2024-06-04' }
])

// ── 热门搜索 ──
const hotData = reactive([
  { id: 1, name: '公路防汛防涝监测与应急处置管理制度' },
  { id: 2, name: '高速公路恶劣天气交通安全管控工作制度' },
  { id: 3, name: '潮汐车道运行监测与调度管理制度' },
  { id: 4, name: '城市主干道潮汐车道启停管理制度' },
  { id: 5, name: '重点路段交通运行监测工作制度' }
])

// ── 表格数据 ──
const tableData = ref([
  { id: 1, name: '强降雨公路防御响应工作制度', version: 'V2.0', type: '基本工作制度', status: '实施', dateRange: '2026-01-01 至 2027-12-31', createTime: '2026-01-15' },
  { id: 2, name: '公路突发事件应急预案管理办法', version: 'V1.5', type: '专项工作制度', status: '实施', dateRange: '2025-06-01 至 2026-05-31', createTime: '2026-01-12' },
  { id: 3, name: '公路养护安全作业规程', version: 'V1.0', type: '基本工作制度', status: '废止', dateRange: '2023-01-01 至 2024-12-31', createTime: '2025-12-20' }
])

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 3
})

// ── 方法 ──
function handleSearch() {
  pagination.page = 1
  ElMessage.info(`搜索：${searchKeyword.value}`)
}

function handleViewAll() {
  ElMessage.info('查看全部')
}

function handleView(row: any) {
  currentRow.value = row
  drawerVisible.value = true
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
}

function handlePageChange(page: number) {
  pagination.page = page
}
</script>

<style lang="scss" scoped>
.regulation-query-page {
  padding: 0;
  background: linear-gradient(160deg, #F5F7FA 0%, #E8ECF1 100%);
  min-height: 100%;
  display: flex;
  flex-direction: column;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;

  .animate-item {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;
    &:nth-child(1) { animation-delay: 0.05s; }
    &:nth-child(2) { animation-delay: 0.12s; }
    &:nth-child(3) { animation-delay: 0.2s; }
    &:nth-child(4) { animation-delay: 0.28s; }
  }

  // ── 顶部卡片（搜索+统计） ──
  .top-card {
    background: linear-gradient(135deg, #409EFF 0%, #66B1FF 100%);
    border-radius: 12px;
    padding: 30px;
    margin-bottom: 16px;
  }

  .search-section {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
  }

  .search-box {
    width: 100%;
    max-width: 600px;

    :deep(.el-input-group) {
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    :deep(.el-input__wrapper) {
      border-radius: 24px 0 0 24px;
      box-shadow: none;
      padding: 8px 16px;
      height: 48px;
    }

    :deep(.el-input__inner) {
      font-size: 15px;
    }

    :deep(.el-input-group__append) {
      background: #409EFF;
      color: #fff;
      border: none;
      border-radius: 0 24px 24px 0;
      padding: 0 28px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      font-weight: 500;
      transition: background 0.2s;
      margin: 0;
      box-shadow: none;

      &:hover {
        background: #337ECC;
      }

      .el-icon {
        margin-right: 4px;
      }
    }
  }

  // ── 统计卡片行 ──
  .stats-row {
    display: flex;
    gap: 16px;
  }

  .stats-card {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 12px;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-2px);
    }
  }

  .stats-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;
  }

  .stats-info {
    .stats-value {
      font-size: 26px;
      font-weight: 700;
      color: #303133;
      line-height: 1.2;
    }

    .stats-label {
      font-size: 13px;
      color: #909399;
      margin-top: 4px;
    }
  }

  // ── 两列布局 ──
  .two-col-row {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
  }

  .col-card {
    flex: 1;
    border-radius: 12px;
    border: none;

    :deep(.el-card__header) {
      padding: 16px 20px;
      border-bottom: 1px solid #F2F3F5;
    }

    :deep(.el-card__body) {
      padding: 16px 20px;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-title {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
  }

  // ── 最新发布列表 ──
  .latest-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .latest-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    background: #F8F9FB;
    border-radius: 8px;
    transition: background 0.2s;

    &:hover {
      background: #F0F2F5;
    }
  }

  .latest-rank {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    color: #909399;
    background: #E8ECF1;
    flex-shrink: 0;

    &.top {
      color: #fff;
      background: linear-gradient(135deg, #F56C6C 0%, #F89898 100%);
    }
  }

  .latest-name {
    flex: 1;
    font-size: 14px;
    color: #303133;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .latest-date {
    font-size: 12px;
    color: #909399;
    flex-shrink: 0;
  }

  // ── 热门搜索列表 ──
  .hot-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .hot-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    background: #F8F9FB;
    border-radius: 8px;
    transition: background 0.2s;

    &:hover {
      background: #F0F2F5;
    }
  }

  .hot-rank {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    color: #909399;
    background: #E8ECF1;
    flex-shrink: 0;

    &.top {
      color: #fff;
      background: linear-gradient(135deg, #F56C6C 0%, #F89898 100%);
    }
  }

  .hot-name {
    flex: 1;
    font-size: 14px;
    color: #303133;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  // ── 表格 ──
  .table-card {
    border-radius: 12px;
    border: none;

    :deep(.el-card__body) {
      padding: 20px;
    }
  }

  .data-table {
    .index-text {
      color: #909399;
      font-size: 13px;
    }

    .doc-name {
      color: #409EFF;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
