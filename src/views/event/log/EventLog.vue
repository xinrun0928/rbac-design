<template>
  <div class="event-log-page">
    <el-card class="table-card" shadow="never">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="操作时间">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              :shortcuts="dateShortcuts"
              style="width: 280px"
            />
          </el-form-item>
        </el-form>
      </div>

      <el-table
        v-loading="loading"
        :data="filteredData"
        border
        stripe
        highlight-current-row
        row-key="id"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column label="序号" width="60" align="center" type="index">
          <template #default="{ $index }">
            <span class="index-text">{{ (pagination.page - 1) * pagination.pageSize + $index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="operator" label="操作人" width="100" align="center" />

        <el-table-column prop="operationTime" label="操作时间" width="170" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.operationTime }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="operationType" label="操作类型" width="90" align="center">
          <template #default="{ row }">
            <el-tag effect="light" size="small" :type="getOperationTypeTag(row.operationType)">
              {{ row.operationType }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="eventName" label="事件名称" min-width="200" show-overflow-tooltip />

        <el-table-column prop="result" label="操作结果" width="90" align="center">
          <template #default="{ row }">
            <el-tag effect="light" size="small" :type="getResultTag(row.result)">
              {{ row.result }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="department" label="所属单位" width="150" align="center" show-overflow-tooltip />

        <el-table-column prop="description" label="描述" min-width="180" show-overflow-tooltip />

        <el-table-column label="操作" width="80" align="center" fixed="right">
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { mockEventLogData } from '@/mock/event/logData'
import type { EventLog } from '@/types/event/log'

// ── 搜索 ──
const searchForm = reactive({})
const dateRange = ref<string[] | null>(null)

const dateShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 7 * 24 * 3600 * 1000)
      return [start, end]
    }
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 30 * 24 * 3600 * 1000)
      return [start, end]
    }
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 90 * 24 * 3600 * 1000)
      return [start, end]
    }
  }
]

// ── 状态 ──
const loading = ref(false)

// ── 分页 ──
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// ── 表格数据 ──
const allData = ref<EventLog[]>([...mockEventLogData])

// ── 过滤 + 分页 ──
const filteredData = computed(() => {
  let data = allData.value

  if (dateRange.value && dateRange.value.length === 2) {
    const [start, end] = dateRange.value
    data = data.filter(item => {
      const itemDate = item.operationTime.split(' ')[0]
      return itemDate >= start && itemDate <= end
    })
  }

  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

// ── 操作类型标签颜色 ──
function getOperationTypeTag(type: string) {
  const map: Record<string, string> = {
    '新增': '',
    '编辑': 'warning',
    '删除': 'danger',
    '上报': 'success',
    '审批': '',
    '导出': 'info'
  }
  return map[type] || ''
}

// ── 操作结果标签颜色 ──
function getResultTag(result: string) {
  const map: Record<string, string> = {
    '成功': 'success',
    '失败': 'danger',
    '驳回': 'warning'
  }
  return map[result] || ''
}

// ── 方法 ──
function handleDelete(row: EventLog) {
  ElMessageBox.confirm('确定要删除该日志记录吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = allData.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      allData.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {})
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
.event-log-page {
  padding: 0;
  background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;

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
    .time-text { font-size: 13px; color: #909399; }

    .data-table { flex: 1; }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    flex-shrink: 0;
  }
}
</style>
