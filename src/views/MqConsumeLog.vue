<template>
  <div class="mq-log-management">
    <!-- 页面头部 -->
    <div class="page-header animate-item">
      <div class="header-left">
        <h1><span class="title-bar"></span>MQ消息消费日志</h1>
        <span class="page-desc">查看MQ消息消费记录，监控消息处理状态</span>
      </div>
      <div class="header-right">
        <el-button :icon="Refresh" @click="handleRefresh" :loading="loading">刷新</el-button>
      </div>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card animate-item" shadow="never">
      <div class="search-bar">
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="队列名称">
            <el-select v-model="searchForm.queueName" placeholder="请选择队列" clearable style="width: 240px">
              <el-option v-for="item in queueNameOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="路由键">
            <el-input v-model="searchForm.routingKey" placeholder="输入路由键" clearable style="width: 200px" @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 120px">
              <el-option v-for="item in mqStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              style="width: 260px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button :icon="RefreshLeft" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card animate-item" shadow="never">
      <el-table
        v-loading="loading"
        :data="filteredData"
        border
        stripe
        highlight-current-row
        row-key="id"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600' }"
      >
        <el-table-column label="序号" width="60" align="center" type="index">
          <template #default="{ $index }">
            <span class="index-text">{{ $index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="queueName" label="队列名称" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="queue-text">{{ row.queueName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="routingKey" label="路由键" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="routing-key-text">{{ row.routingKey }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="exchange" label="交换机" min-width="180" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="exchange-text">{{ row.exchange }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="msgId" label="消息ID" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="msgid-text">{{ row.msgId }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="operation" label="操作类型" width="120" align="center">
          <template #default="{ row }">
            <span class="operation-text">{{ row.operation }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag
              :type="getStatusTagType(row.status)"
              effect="light"
              size="small"
            >
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="businessResult" label="业务结果" width="100" align="center">
          <template #default="{ row }">
            <span :class="['result-text', row.businessResult === 'SUCCESS' ? 'success' : 'fail']">
              {{ row.businessResult || '-' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="processTime" label="处理耗时" width="100" align="center">
          <template #default="{ row }">
            <span class="time-cost-text">{{ row.processTime ? row.processTime + 'ms' : '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="deliveryTag" label="投递标签" width="90" align="center">
          <template #default="{ row }">
            <span class="tag-text">{{ row.deliveryTag }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" width="170" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="View" @click="handleViewDetail(row)">详情</el-button>
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
      v-model="detailDrawerVisible"
      title="消息详情"
      size="60%"
      direction="rtl"
      class="detail-drawer"
    >
      <template v-if="currentLog">
        <el-descriptions :column="2" border class="detail-descriptions">
          <el-descriptions-item label="消息ID" :span="2">
            <span class="msgid-text">{{ currentLog.msgId }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="队列名称">{{ currentLog.queueName }}</el-descriptions-item>
          <el-descriptions-item label="路由键">{{ currentLog.routingKey }}</el-descriptions-item>
          <el-descriptions-item label="交换机" :span="2">{{ currentLog.exchange }}</el-descriptions-item>
          <el-descriptions-item label="操作类型">{{ currentLog.operation }}</el-descriptions-item>
          <el-descriptions-item label="投递标签">{{ currentLog.deliveryTag }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTagType(currentLog.status)" effect="light" size="small">
              {{ getStatusLabel(currentLog.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="业务结果">
            <span :class="['result-text', currentLog.businessResult === 'SUCCESS' ? 'success' : 'fail']">
              {{ currentLog.businessResult || '-' }}
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="处理耗时">{{ currentLog.processTime ? currentLog.processTime + 'ms' : '-' }}</el-descriptions-item>
          <el-descriptions-item label="内容类型">{{ currentLog.contentType }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentLog.createTime }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ currentLog.updateTime }}</el-descriptions-item>
        </el-descriptions>

        <div class="payload-section">
          <div class="section-header">
            <span class="section-title">报文内容</span>
            <el-button type="primary" size="small" :icon="CopyDocument" @click="handleCopyPayload">复制</el-button>
          </div>
          <el-input
            v-model="currentLog.payload"
            type="textarea"
            :rows="15"
            readonly
            class="payload-textarea"
          />
        </div>

        <div v-if="currentLog.errorMessage" class="error-section">
          <div class="section-header error">
            <span class="section-title">错误信息</span>
          </div>
          <el-input
            v-model="currentLog.errorMessage"
            type="textarea"
            :rows="5"
            readonly
            class="error-textarea"
          />
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Refresh, Search, RefreshLeft, View, CopyDocument
} from '@element-plus/icons-vue'
import { mqConsumeLogData, mqStatusOptions, queueNameOptions } from '../mock/mqConsumeLogData'
import type { MqConsumeLog, MqConsumeLogSearchForm } from '../types/mqConsumeLog'

// ── 状态 ──
const loading = ref(false)
const tableData = ref<MqConsumeLog[]>(mqConsumeLogData)
const detailDrawerVisible = ref(false)
const currentLog = ref<MqConsumeLog | null>(null)
const dateRange = ref<string[] | null>(null)

const searchForm = reactive<MqConsumeLogSearchForm>({
  queueName: '',
  routingKey: '',
  status: '',
  startTime: '',
  endTime: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// ── 计算属性 ──
const filteredData = computed(() => {
  let data = tableData.value.filter(item => item.deleted === 0)

  if (searchForm.queueName) {
    data = data.filter(item => item.queueName === searchForm.queueName)
  }
  if (searchForm.routingKey) {
    data = data.filter(item => item.routingKey.includes(searchForm.routingKey))
  }
  if (searchForm.status !== '') {
    data = data.filter(item => item.status === searchForm.status)
  }
  if (dateRange.value && dateRange.value.length === 2) {
    const [start, end] = dateRange.value
    data = data.filter(item => {
      const itemDate = item.createTime.split(' ')[0]
      return itemDate >= start && itemDate <= end
    })
  }

  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

// ── 方法 ──
function handleSearch() {
  pagination.page = 1
}

function handleReset() {
  searchForm.queueName = ''
  searchForm.routingKey = ''
  searchForm.status = ''
  dateRange.value = null
  pagination.page = 1
}

function handleRefresh() {
  loading.value = true
  setTimeout(() => {
    tableData.value = [...mqConsumeLogData]
    loading.value = false
  }, 500)
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
}

function handlePageChange(page: number) {
  pagination.page = page
}

function handleViewDetail(row: MqConsumeLog) {
  currentLog.value = row
  detailDrawerVisible.value = true
}

function getStatusLabel(status: number): string {
  const option = mqStatusOptions.find(o => o.value === status)
  return option?.label || '未知'
}

function getStatusTagType(status: number): '' | 'success' | 'warning' | 'info' | 'danger' {
  const types: Record<number, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    0: 'warning',
    1: 'success',
    2: 'danger'
  }
  return types[status] || 'info'
}

async function handleCopyPayload() {
  if (!currentLog.value) return
  try {
    await navigator.clipboard.writeText(currentLog.value.payload)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.warning('复制失败，请手动复制')
  }
}
</script>

<style lang="scss" scoped>
.mq-log-management {
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
    &:nth-child(3) { animation-delay: 0.2s; }
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    padding: 24px 28px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

    .header-left h1 {
      font-size: 22px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 8px 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .title-bar {
      display: inline-block;
      width: 4px;
      height: 22px;
      background: linear-gradient(180deg, #409eff 0%, #66b1ff 100%);
      border-radius: 2px;
    }

    .page-desc {
      font-size: 13px;
      color: #909399;
      padding-left: 14px;
    }
  }

  .search-card {
    margin-bottom: 16px;
    border-radius: 12px;
    border: none;

    :deep(.el-card__body) {
      padding: 20px 24px 12px;
    }

    .search-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }

    .search-form {
      flex: 1;
      .el-form-item { margin-bottom: 8px; margin-right: 12px; }
    }
  }

  .table-card {
    border-radius: 12px;
    border: none;

    :deep(.el-card__body) {
      padding: 20px;
    }

    .index-text { color: #909399; font-size: 13px; }
    .queue-text { font-family: 'Monaco', 'Menlo', 'Consolas', monospace; font-size: 12px; color: #409EFF; background: #ECF5FF; padding: 2px 6px; border-radius: 4px; }
    .routing-key-text { font-family: 'Monaco', 'Menlo', 'Consolas', monospace; font-size: 12px; color: #67C23A; background: #F0F9EB; padding: 2px 6px; border-radius: 4px; }
    .exchange-text { font-size: 12px; color: #606266; }
    .msgid-text { font-family: 'Monaco', 'Menlo', 'Consolas', monospace; font-size: 12px; color: #909399; }
    .operation-text { font-weight: 500; color: #303133; }
    .result-text {
      font-weight: 500;
      &.success { color: #67C23A; }
      &.fail { color: #F56C6C; }
    }
    .time-cost-text { font-weight: 600; color: #E6A23C; }
    .tag-text { color: #909399; }
    .time-text { font-size: 13px; color: #909399; }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid #EBEEF5;
  }

  :deep(.detail-drawer) {
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

  .payload-section, .error-section {
    margin-top: 20px;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding: 10px 16px;
      background: #F5F7FA;
      border-radius: 6px;

      &.error {
        background: #FEF0F0;
      }

      .section-title {
        font-weight: 600;
        font-size: 14px;
        color: #303133;
      }
    }

    .payload-textarea, .error-textarea {
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
