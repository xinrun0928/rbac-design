<template>
  <div class="feedback-list-page">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 顶部统计卡片 -->
      <StatsCards v-model="activeCategory" :items="statsCards" @change="handleStatsChange" />

      <!-- 搜索栏 -->
      <div class="search-bar">
        <div class="search-bar-info">共 {{ filteredData.length }} 条记录</div>
        <div class="search-bar-actions">
          <el-dropdown @command="handleCommand">
            <el-button type="primary">
              操作 <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="generate">生成报告</el-dropdown-item>
                <el-dropdown-item command="analyze">分析反馈数据</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
        <el-table-column prop="id" label="反馈 ID" width="140" align="center">
          <template #default="{ row }">
            <el-link type="primary" :underline="false">
              <span class="code-text">{{ row.id }}</span>
            </el-link>
          </template>
        </el-table-column>

        <el-table-column prop="userName" label="用户姓名" width="100" align="center">
          <template #default="{ row }">
            <span class="course-name-text">{{ row.userName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="phone" label="联系电话" width="130" align="center" />

        <el-table-column prop="relatedKnowledge" label="关联知识内容" min-width="280" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="equipment-info-text">{{ row.relatedKnowledge }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="feedbackType" label="反馈类型" width="120" align="center" />

        <el-table-column prop="content" label="反馈内容" min-width="300" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="resource-types-text">{{ row.content }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="handleStatus" label="处理状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.handleStatus === '待处理' ? 'warning' : 'success'" size="small">{{ row.handleStatus }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="handleMethod" label="处理方式" width="120" align="center" />

        <el-table-column prop="handlePlan" label="处理方案及说明" min-width="220" show-overflow-tooltip />

        <el-table-column prop="handler" label="处理人" width="180" align="center" />

        <el-table-column prop="handleTime" label="处理时间" width="120" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.handleTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="60" align="center" fixed="right">
          <template #default>
            <el-button type="primary" link :icon="MoreFilled" />
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
import { ElMessage } from 'element-plus'
import { MoreFilled, ArrowDown, Document, Warning, InfoFilled, CircleClose, Tools, Bell, ChatDotRound } from '@element-plus/icons-vue'
import { mockFeedbackList } from '@/mock/dss/feedbackData'
import type { FeedbackItem } from '@/types/dss'
import StatsCards from '@/components/StatsCards.vue'

const loading = ref(false)
const allData = ref<FeedbackItem[]>(mockFeedbackList)
const activeCategory = ref('全部')

const statsCards = [
  { key: '全部', label: '全部', value: 6, icon: Document, color: '#409EFF', bgColor: '#ecf5ff' },
  { key: '版本过期', label: '版本过期', value: 2, icon: Warning, color: '#E6A23C', bgColor: '#fdf6ec' },
  { key: '内容错误', label: '内容错误', value: 4, icon: CircleClose, color: '#F56C6C', bgColor: '#fef0f0' },
  { key: '信息缺失', label: '信息缺失', value: 2, icon: InfoFilled, color: '#909399', bgColor: '#f4f4f5' },
  { key: '系统故障', label: '系统故障', value: 4, icon: Tools, color: '#F56C6C', bgColor: '#fef0f0' },
  { key: '优化建议', label: '优化建议', value: 4, icon: Bell, color: '#67C23A', bgColor: '#f0f9eb' },
  { key: '其他', label: '其他', value: 4, icon: ChatDotRound, color: '#909399', bgColor: '#f4f4f5' }
]

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const filteredData = computed(() => {
  let data = allData.value

  if (activeCategory.value !== '全部') {
    data = data.filter(item => item.feedbackType === activeCategory.value)
  }

  pagination.total = data.length
  return data
})

const tableData = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  return filteredData.value.slice(start, start + pagination.pageSize)
})

function handleCommand(command: string) {
  if (command === 'generate') {
    ElMessage.success('报告生成中...')
  } else if (command === 'analyze') {
    ElMessage.success('正在分析反馈数据...')
  }
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
}

function handlePageChange(page: number) {
  pagination.page = page
}

function handleStatsChange() {
  pagination.page = 1
}
</script>

<style lang="scss" scoped>
.feedback-list-page {
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

    .search-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #ebeef5;
    }

    .search-bar-info {
      font-size: 14px;
      color: #909399;
    }

    .search-bar-actions {
      display: flex;
      align-items: center;
      flex-shrink: 0;
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

    .equipment-info-text {
      font-size: 13px;
      color: #606266;
      line-height: 1.5;
    }

    .resource-types-text {
      font-size: 13px;
      color: #606266;
      line-height: 1.5;
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
