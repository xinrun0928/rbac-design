<template>
  <div class="basic-management-page">
    <div class="content-wrapper">
      <!-- 左侧角色列表 -->
      <div class="role-panel animate-item">
        <div class="role-header">
          <span>系统角色：</span>
          <el-button type="primary" size="small" @click="handleAddRole">+ 添加</el-button>
        </div>
        <div class="role-list">
          <div
            v-for="role in roles"
            :key="role.name"
            class="role-item"
            :class="{ active: selectedRole === role.name }"
            @click="selectedRole = role.name"
          >
            {{ role.name }}
          </div>
        </div>
      </div>

      <!-- 右侧用户列表 -->
      <div class="user-panel">
        <el-card class="table-card animate-item" shadow="never">
          <div class="user-header">
            <h3 class="role-title">{{ selectedRole }}</h3>
            <el-button type="primary" @click="handleAddUser">+ 添加人员</el-button>
          </div>

          <!-- 分类标签 - stats-card 风格 -->
          <div class="stats-row">
            <div
              v-for="tab in categoryTabs"
              :key="tab.key"
              class="stats-card"
              :class="{ active: activeCategory === tab.key }"
              @click="activeCategory = tab.key"
            >
              <div class="stats-icon" :style="{ background: tab.bgColor, color: tab.color }">
                <el-icon :size="22"><component :is="tab.icon" /></el-icon>
              </div>
              <div class="stats-info">
                <div class="stats-value" :style="{ color: tab.color }">{{ tab.count }}</div>
                <div class="stats-label">{{ tab.label }}</div>
              </div>
            </div>
          </div>

          <!-- 账号状态筛选 -->
          <div class="search-bar">
            <div class="search-bar-filter">
              <span class="filter-label">账号状态：</span>
              <el-link
                v-for="status in accountStatuses"
                :key="status"
                class="filter-link"
                :underline="false"
                :type="activeAccountStatus === status ? 'primary' : 'info'"
                @click="activeAccountStatus = status"
              >{{ status }}</el-link>
            </div>
            <div class="record-count">共{{ filteredData.length }}条记录</div>
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
            <el-table-column prop="name" label="用户姓名" width="120" align="center">
              <template #default="{ row }">
                <span class="course-name-text">{{ row.name }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="department" label="所属部门" width="150" align="center">
              <template #default="{ row }">
                <span class="code-text">{{ row.department }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="gender" label="性别" width="80" align="center" />

            <el-table-column prop="phone" label="手机号码" width="140" align="center" />

            <el-table-column prop="accountStatus" label="账号状态" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="row.accountStatus === '启用' ? 'success' : 'info'" size="small">{{ row.accountStatus }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="addTime" label="添加时间" width="140" align="center">
              <template #default="{ row }">
                <span class="time-text">{{ row.addTime }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="operator" label="操作人" width="180" align="center">
              <template #default="{ row }">
                <span class="creator-name">{{ row.operator }}</span>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { MoreFilled, User, UserFilled, OfficeBuilding, CircleCheck, CircleClose, Document } from '@element-plus/icons-vue'
import { mockRoles, mockBasicUsers } from '@/mock/dss/basicData'
import type { BasicUser, RoleItem } from '@/types/dss'

const loading = ref(false)
const allData = ref<BasicUser[]>(mockBasicUsers)
const roles = ref<RoleItem[]>(mockRoles)
const selectedRole = ref('超级管理员')
const activeCategory = ref('全部')
const activeAccountStatus = ref('全部')

const categoryTabs = [
  { key: '全部', label: '全部', count: allData.value.length, icon: Document, color: '#409EFF', bgColor: '#ecf5ff' },
  { key: '启用', label: '已启用', count: allData.value.filter(u => u.accountStatus === '启用').length, icon: CircleCheck, color: '#67C23A', bgColor: '#f0f9eb' },
  { key: '停用', label: '已停用', count: allData.value.filter(u => u.accountStatus === '停用').length, icon: CircleClose, color: '#F56C6C', bgColor: '#fef0f0' }
]

const accountStatuses = ['全部', '启用', '停用']

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const filteredData = computed(() => {
  let data = allData.value

  if (activeAccountStatus.value !== '全部') {
    data = data.filter(item => item.accountStatus === activeAccountStatus.value)
  }

  pagination.total = data.length
  return data
})

const tableData = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  return filteredData.value.slice(start, start + pagination.pageSize)
})

function handleAddRole() {
  ElMessage.info('添加角色')
}

function handleAddUser() {
  ElMessage.info('添加人员')
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
.basic-management-page {
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
}

.content-wrapper {
  display: flex;
  flex: 1;
  gap: 16px;
  overflow: hidden;
}

.role-panel {
  width: 180px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.role-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 14px;
  color: #606266;
}

.role-list {
  flex: 1;
}

.role-item {
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 8px;
  font-size: 14px;
  color: #606266;

  &:hover {
    background: #f0f2f5;
  }

  &.active {
    background: #ecf5ff;
    color: #409EFF;
    font-weight: 500;
  }
}

.user-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

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

    .user-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .role-title {
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      margin: 0;
    }

    .stats-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      padding: 16px;
      background: #f8f9fb;
      border-radius: 10px;
      flex-shrink: 0;
    }

    .stats-card {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
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
        width: 44px;
        height: 44px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .stats-info {
        .stats-value {
          font-size: 22px;
          font-weight: 700;
          line-height: 1.2;
        }

        .stats-label {
          font-size: 12px;
          color: #909399;
          margin-top: 2px;
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

    .record-count {
      font-size: 14px;
      color: #909399;
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

    .creator-name {
      font-size: 13px;
      color: #303133;
      font-weight: 500;
    }

    .data-table {
      flex: 1;
    }
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  flex-shrink: 0;
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
