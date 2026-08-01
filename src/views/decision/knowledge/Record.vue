<template>
  <div class="knowledge-record-page">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 分类统计卡片 -->
      <div class="stats-row">
        <div
          v-for="tab in categoryTabs"
          :key="tab.key"
          class="stats-card"
          :class="{ active: activeCategory === tab.key }"
          @click="activeCategory = tab.key"
        >
          <div class="stats-icon" :style="{ background: tab.bgColor, color: tab.color }">
            <el-icon :size="26"><component :is="tab.icon" /></el-icon>
          </div>
          <div class="stats-info">
            <div class="stats-value" :style="{ color: tab.color }">{{ tab.count }}</div>
            <div class="stats-label">{{ tab.label }}</div>
          </div>
        </div>
      </div>

      <!-- 搜索栏 -->
      <div class="search-bar">
        <div class="search-bar-filter">
          <span class="filter-label">执行状态：</span>
          <el-link
            v-for="status in execStatuses"
            :key="status"
            class="filter-link"
            :underline="false"
            :type="activeExecStatus === status ? 'primary' : 'info'"
            @click="activeExecStatus = status"
          >{{ status }}</el-link>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        highlight-current-row
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="execStatus" label="执行状态" width="140" align="center">
          <template #default="{ row }">
            <el-tag :type="getExecStatusType(row.execStatus)" size="small">{{ row.execStatus }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="taskName" label="维护更新任务名称" min-width="300" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="course-name-text">{{ row.taskName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="relatedType" label="关联知识类型" width="130" align="center" />

        <el-table-column label="执行人" width="180" align="center">
          <template #default="{ row }">
            <span>{{ row.executor }}（<span class="code-text">{{ row.executorPhone }}</span>）</span>
          </template>
        </el-table-column>

        <el-table-column prop="progress" label="现存知识维护更新进度" width="180" align="center" />

        <el-table-column prop="needRevision" label="需修订知识" width="120" align="center" />

        <el-table-column prop="newCount" label="此次新增知识" width="120" align="center" />

        <el-table-column prop="removedCount" label="此次下架知识" width="120" align="center" />

        <el-table-column prop="expectDate" label="预计完成日期" width="140" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.expectDate }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="actualDate" label="实际完成日期" width="140" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.actualDate }}</span>
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
import { mockKnowledgeRecords } from '@/mock/dss/knowledgeData'
import type { KnowledgeRecord } from '@/types/dss'
import { Document, Collection, Tickets, Notebook, Box } from '@element-plus/icons-vue'

const loading = ref(false)
const allData = ref<KnowledgeRecord[]>(mockKnowledgeRecords)
const activeCategory = ref('全部')
const activeExecStatus = ref('全部')

const categoryTabs = [
  { key: '全部', label: '全部', count: 6, icon: Document, color: '#409EFF', bgColor: '#ecf5ff' },
  { key: '历史案例', label: '历史案例', count: 2, icon: Collection, color: '#67C23A', bgColor: '#f0f9eb' },
  { key: '政策法规', label: '政策法规', count: 1, icon: Tickets, color: '#E6A23C', bgColor: '#fdf6ec' },
  { key: '专家知识', label: '专家知识', count: 1, icon: Notebook, color: '#F56C6C', bgColor: '#fef0f0' },
  { key: '标准规范', label: '标准规范', count: 1, icon: Box, color: '#909399', bgColor: '#f4f4f5' }
]

const execStatuses = ['全部', '待执行', '执行中', '已完成']

const filteredData = computed(() => {
  let data = allData.value

  if (activeCategory.value !== '全部') {
    data = data.filter(item => item.relatedType === activeCategory.value)
  }

  if (activeExecStatus.value !== '全部') {
    data = data.filter(item => item.execStatus === activeExecStatus.value)
  }

  return data
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: computed(() => filteredData.value.length)
})

const tableData = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  return filteredData.value.slice(start, start + pagination.pageSize)
})

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
}

function handlePageChange(page: number) {
  pagination.page = page
}

function getExecStatusType(status: string) {
  const map: Record<string, string> = {
    '执行中': 'warning',
    '待执行': 'info',
    '已完成': 'success'
  }
  return map[status] || 'info'
}
</script>

<style lang="scss" scoped>
.knowledge-record-page {
  padding: 16px;
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

    .stats-row {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-bottom: 16px;
      padding: 16px 0;
      background: #f8f9fb;
      border-radius: 10px;
      flex-shrink: 0;
    }

    .stats-card {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 220px;
      padding: 14px 18px;
      background: #fff;
      border: 2px solid transparent;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      &.active {
        border-color: #409eff;
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
      }

      .stats-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .stats-info {
        .stats-value {
          font-size: 26px;
          font-weight: 700;
          line-height: 1.2;
        }

        .stats-label {
          font-size: 13px;
          color: #909399;
          margin-top: 4px;
        }
      }
    }

    .search-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #ebeef5;
    }

    .search-bar-filter {
      display: flex;
      align-items: center;
      gap: 12px;

      .filter-label {
        font-size: 14px;
        color: #606266;
        font-weight: 600;
      }

      .filter-link {
        font-size: 14px;

        &.el-link--primary {
          font-weight: 600;
        }
      }
    }

    .course-name-text {
      font-weight: 500;
      color: #303133;
    }

    .code-text {
      font-family: Consolas, Monaco, monospace;
      font-size: 13px;
      color: #606266;
    }

    .time-text {
      font-size: 13px;
      color: #909399;
    }

    .data-table {
      flex: 1;
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    flex-shrink: 0;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
