<template>
  <div class="online-user-management">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="登录名称">
            <el-input v-model="searchForm.loginName" placeholder="输入登录名称" clearable :prefix-icon="Search" style="width: 180px" @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item label="主机地址">
            <el-input v-model="searchForm.host" placeholder="输入主机地址" clearable :prefix-icon="Search" style="width: 180px" @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item label="登录时间">
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
        </el-form>
      </div>

      <el-table
        v-loading="loading"
        :data="filteredData"
        border
        stripe
        highlight-current-row
        row-key="sessionId"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600' }"
        class="data-table"
      >
        <el-table-column label="序号" width="60" align="center" type="index">
          <template #default="{ $index }">
            <span class="index-text">{{ $index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="sessionId" label="会话编号" min-width="220" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="session-id-text">{{ row.sessionId }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="loginName" label="登录名称" width="130" align="center">
          <template #default="{ row }">
            <span class="login-name-text">{{ row.loginName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="deptName" label="部门名称" width="150" align="center" show-overflow-tooltip />

        <el-table-column prop="host" label="主机" width="140" align="center">
          <template #default="{ row }">
            <span class="host-text">{{ row.host }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="loginLocation" label="登录地点" width="150" align="center" show-overflow-tooltip />

        <el-table-column prop="browser" label="浏览器" width="130" align="center" />

        <el-table-column prop="os" label="操作系统" width="130" align="center" show-overflow-tooltip />

        <el-table-column prop="loginTime" label="登录时间" width="170" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.loginTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" link :icon="Delete" @click="handleForceLogout(row)">强退</el-button>
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
import { Search, Delete } from '@element-plus/icons-vue'
import { onlineUserData } from '@/mock/admin/monitorData'
import type { OnlineUser, OnlineUserSearchForm } from '@/types/admin/monitor'

const loading = ref(false)
const tableData = ref<OnlineUser[]>(onlineUserData)
const dateRange = ref<string[] | null>(null)

const searchForm = reactive<OnlineUserSearchForm>({
  loginName: '',
  host: '',
  startTime: '',
  endTime: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const filteredData = computed(() => {
  let data = tableData.value

  if (searchForm.loginName) {
    data = data.filter(item => item.loginName.includes(searchForm.loginName))
  }
  if (searchForm.host) {
    data = data.filter(item => item.host.includes(searchForm.host))
  }
  if (dateRange.value && dateRange.value.length === 2) {
    const [start, end] = dateRange.value
    data = data.filter(item => {
      const itemDate = item.loginTime.split(' ')[0]
      return itemDate >= start && itemDate <= end
    })
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

function handleForceLogout(row: OnlineUser) {
  ElMessageBox.confirm(
    `确认要强制退出用户 "${row.loginName}" 吗？`,
    '强退确认',
    { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    tableData.value = tableData.value.filter(item => item.sessionId !== row.sessionId)
    ElMessage.success(`已强制退出用户 ${row.loginName}`)
  }).catch(() => {})
}
</script>

<style lang="scss" scoped>
.online-user-management {
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
    .session-id-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 12px;
      color: #606266;
    }
    .login-name-text { font-weight: 500; color: #303133; }
    .host-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 12px;
      color: #409EFF;
      background: #ECF5FF;
      padding: 2px 6px;
      border-radius: 4px;
    }
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

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
