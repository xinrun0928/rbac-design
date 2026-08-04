<template>
  <div class="event-todo-page">
    <el-card class="table-card" shadow="never">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <span class="search-bar-title">我的待办</span>
        <div class="search-bar-actions">
          <el-input
            v-model="searchForm.todoName"
            placeholder="输入事项名称"
            clearable
            :prefix-icon="Search"
            style="width: 220px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
        </div>
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

        <el-table-column prop="todoName" label="事项名称" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="name-text">{{ row.todoName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="todoType" label="待办类型" width="110" align="center">
          <template #default="{ row }">
            <el-tag effect="light" size="small" :type="getTodoTypeTag(row.todoType)">
              {{ row.todoType }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="relatedEvent" label="关联事件" min-width="220" show-overflow-tooltip />

        <el-table-column prop="dispatchTime" label="下发时间" width="170" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.dispatchTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Position" @click="handleDispose(row)">处置</el-button>
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
import { Search, Position } from '@element-plus/icons-vue'
import { mockEventTodoData } from '@/mock/event/todoData'
import type { EventTodo } from '@/types/event/todo'

// ── 搜索 ──
const searchForm = reactive({
  todoName: ''
})

// ── 状态 ──
const loading = ref(false)

// ── 分页 ──
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// ── 表格数据 ──
const tableData = ref<EventTodo[]>([...mockEventTodoData])

// ── 过滤 + 分页 ──
const filteredData = computed(() => {
  let data = tableData.value

  if (searchForm.todoName) {
    const keyword = searchForm.todoName.toLowerCase()
    data = data.filter(item =>
      item.todoName.toLowerCase().includes(keyword)
    )
  }

  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

// ── 待办类型标签颜色 ──
function getTodoTypeTag(type: string) {
  const map: Record<string, string> = {
    '告警': 'danger',
    '指令': 'warning',
    '任务': 'success',
  }
  return map[type] || 'info'
}

// ── 方法 ──
function handleSearch() {
  pagination.page = 1
}

function handleDispose(row: EventTodo) {
  ElMessage.info('功能开发中...')
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
.event-todo-page {
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
      flex-shrink: 0;
    }

    .index-text { color: #909399; font-size: 13px; }
    .name-text { font-weight: 500; color: #303133; }
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
