<template>
  <div class="login-log-management">
    <!-- 数据表格 -->
    <el-card class="table-card animate-item" shadow="never">
      <!-- 顶部搜索栏 -->
      <div class="search-bar">
        <el-form :model="searchForm" inline>
          <el-form-item label="用户名">
            <el-input
              v-model="searchForm.userName"
              placeholder="请输入用户名"
              clearable
              :prefix-icon="Search"
              style="width: 180px"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="客户端">
            <el-select
              v-model="searchForm.clientId"
              placeholder="请选择"
              clearable
              style="width: 180px"
            >
              <el-option label="flood-inspection" value="flood-inspection" />
            </el-select>
          </el-form-item>
          <el-form-item label="授权类型">
            <el-select
              v-model="searchForm.grantType"
              placeholder="请选择"
              clearable
              style="width: 180px"
            >
              <el-option label="password" value="password" />
              <el-option label="refresh_token" value="refresh_token" />
              <el-option label="mobile" value="mobile" />
            </el-select>
          </el-form-item>
          <el-form-item label="登录时间">
            <el-date-picker
              v-model="searchForm.createTime"
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
        :data="tableData"
        border
        stripe
        highlight-current-row
        row-key="logId"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600' }"
        empty-text=" "
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="puserId" label="用户ID" width="160">
          <template #default="{ row }">
            <span class="id-text">{{ row.puserId || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="orgId" label="组织ID" width="160">
          <template #default="{ row }">
            <span class="id-text">{{ row.orgId || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="userName" label="用户名" min-width="200">
          <template #default="{ row }">
            <el-tooltip v-if="row.userName" :content="'点击复制'" placement="top" :show-after="300">
              <span class="user-text copyable" @click="handleCopyText(row.userName)">{{ row.userName }}</span>
            </el-tooltip>
            <span v-else class="user-text">-</span>
          </template>
        </el-table-column>

        <el-table-column prop="clientId" label="客户端" width="150">
          <template #default="{ row }">
            <el-tag type="info" effect="plain" round>{{ row.clientId }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="grantType" label="授权类型" width="120" align="center">
          <template #default="{ row }">
            <el-tag
              :type="getGrantTypeType(row.grantType)"
              effect="dark"
              style="border: none; color: #fff"
              round
            >
              {{ row.grantType }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="operationType" label="操作类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :type="row.operationType === 1 ? 'success' : 'info'"
              effect="dark"
              style="border: none; color: #fff"
              round
            >
              {{ row.operationType === 1 ? '登录' : '登出' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="ip" label="IP地址" width="130">
          <template #default="{ row }">
            <span class="ip-text">{{ row.ip }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="browser" label="浏览器" width="120">
          <template #default="{ row }">
            <span class="browser-text">{{ row.browser }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="登录时间" width="180" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="View" @click="handleViewDetail(row)">
              详情
            </el-button>
          </template>
        </el-table-column>

        <!-- 空状态插槽 -->
        <template #empty>
          <div class="empty-state">
            <el-icon :size="64" color="#DCDFE6"><User /></el-icon>
            <p class="empty-title">暂无登录记录</p>
            <p class="empty-desc">系统尚未记录任何登录操作</p>
          </div>
        </template>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 详情抽屉 -->
    <el-drawer
      v-model="detailDialogVisible"
      title="登录详情"
      direction="rtl"
      size="520px"
      destroy-on-close
    >
      <div v-if="detailData" class="detail-content">
        <el-collapse v-model="activeCollapse">
          <!-- 基础信息 -->
          <el-collapse-item title="基础信息" name="basic">
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">记录ID</span>
                <span class="detail-value mono">{{ detailData.logId }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">用户名</span>
                <span class="detail-value">{{ detailData.userName || '-' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">用户ID</span>
                <span class="detail-value mono">{{ detailData.puserId || '-' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">组织ID</span>
                <span class="detail-value mono">{{ detailData.orgId || '-' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">操作类型</span>
                <span class="detail-value">
                  <el-tag
                    :type="detailData.operationType === 1 ? 'success' : 'info'"
                    effect="dark"
                    style="border: none; color: #fff"
                    round
                    size="small"
                  >
                    {{ detailData.operationType === 1 ? '登录' : '登出' }}
                  </el-tag>
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">客户端</span>
                <span class="detail-value">{{ detailData.clientId }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">授权类型</span>
                <span class="detail-value">
                  <el-tag
                    :type="getGrantTypeType(detailData.grantType)"
                    effect="dark"
                    style="border: none; color: #fff"
                    round
                    size="small"
                  >
                    {{ detailData.grantType }}
                  </el-tag>
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">登录时间</span>
                <span class="detail-value">{{ detailData.createTime }}</span>
              </div>
            </div>
          </el-collapse-item>

          <!-- 终端信息 -->
          <el-collapse-item title="终端信息" name="terminal">
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">IP地址</span>
                <span class="detail-value mono">{{ detailData.ip }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">地理位置</span>
                <span class="detail-value">{{ detailData.location || '-' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">浏览器</span>
                <span class="detail-value">{{ detailData.browser }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">操作系统</span>
                <span class="detail-value">{{ detailData.os }}</span>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-drawer>

    <!-- 建表SQL弹窗 -->
    <el-dialog
      v-model="sqlDialogVisible"
      title="建表SQL语句"
      width="800px"
      destroy-on-close
    >
      <div class="sql-content">
        <div class="sql-header">
          <span class="sql-title">sys_login_log - 系统登录日志表</span>
          <el-button type="primary" :icon="CopyDocument" @click="handleCopySql">复制SQL</el-button>
        </div>
        <pre class="sql-block">{{ loginLogSql }}</pre>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Search, Refresh, RefreshRight, View,
  CopyDocument, Document, User
} from '@element-plus/icons-vue'
import type { SysLoginLog } from '@/types/admin/logs'
import { getLoginLogs, getLoginLogDetail } from '@/utils/logMockApi'

// ── 搜索表单类型 ──
interface SearchForm {
  userName: string
  clientId: string
  grantType: string
  createTime: string[] | null
}

// ── 状态 ──
const loading = ref(false)
const tableData = ref<SysLoginLog[]>([])
const detailDialogVisible = ref(false)
const detailData = ref<SysLoginLog | null>(null)
const activeCollapse = ref(['basic', 'terminal'])
const sqlDialogVisible = ref(false)

const loginLogSql = `CREATE TABLE "public"."sys_login_log" (
  "logId" int8 NOT NULL,
  "puserId" int8,
  "userName" varchar(255) COLLATE "pg_catalog"."default",
  "orgId" int8,
  "clientId" varchar(255) COLLATE "pg_catalog"."default",
  "grantType" varchar(255) COLLATE "pg_catalog"."default",
  "ip" varchar(255) COLLATE "pg_catalog"."default",
  "location" varchar(255) COLLATE "pg_catalog"."default",
  "browser" varchar(255) COLLATE "pg_catalog"."default",
  "os" varchar(255) COLLATE "pg_catalog"."default",
  "operationType" int4,
  "createTime" timestamp(6),

  CONSTRAINT "sys_login_log_pkey" PRIMARY KEY ("logId")
);

ALTER TABLE "public"."sys_login_log" OWNER TO "postgres";

CREATE INDEX "idx_sys_login_log_createTime" ON "public"."sys_login_log" USING btree ("createTime" "pg_catalog"."timestamp_ops" ASC NULLS LAST);
CREATE INDEX "idx_sys_login_log_operationType" ON "public"."sys_login_log" USING btree ("operationType" "pg_catalog"."int4_ops" ASC NULLS LAST);
CREATE INDEX "idx_sys_login_log_orgId" ON "public"."sys_login_log" USING btree ("orgId" "pg_catalog"."int8_ops" ASC NULLS LAST);
CREATE INDEX "idx_sys_login_log_puserId" ON "public"."sys_login_log" USING btree ("puserId" "pg_catalog"."int8_ops" ASC NULLS LAST);

COMMENT ON COLUMN "public"."sys_login_log"."logId" IS '唯一ID';
COMMENT ON COLUMN "public"."sys_login_log"."puserId" IS '平台账户ID';
COMMENT ON COLUMN "public"."sys_login_log"."userName" IS '用户名称';
COMMENT ON COLUMN "public"."sys_login_log"."orgId" IS '组织ID';
COMMENT ON COLUMN "public"."sys_login_log"."clientId" IS '客户端ID';
COMMENT ON COLUMN "public"."sys_login_log"."grantType" IS '授权类型';
COMMENT ON COLUMN "public"."sys_login_log"."ip" IS '客户端IP地址';
COMMENT ON COLUMN "public"."sys_login_log"."location" IS 'IP地理位置';
COMMENT ON COLUMN "public"."sys_login_log"."browser" IS '浏览器信息';
COMMENT ON COLUMN "public"."sys_login_log"."os" IS '操作系统';
COMMENT ON COLUMN "public"."sys_login_log"."operationType" IS '操作类型（1-登录，2-登出）';
COMMENT ON COLUMN "public"."sys_login_log"."createTime" IS '创建时间';


COMMENT ON TABLE "public"."sys_login_log" IS '系统登录日志表';`

const searchForm = reactive<SearchForm>({
  userName: '',
  clientId: '',
  grantType: '',
  createTime: null
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// ── 授权类型样式 ──
function getGrantTypeType(type: string): string {
  if (type === 'password') return ''
  if (type === 'refresh_token') return 'success'
  if (type === 'mobile') return 'warning'
  return 'info'
}

// ── 复制SQL ──
async function handleCopySql() {
  try {
    await navigator.clipboard.writeText(loginLogSql)
    ElMessage.success('SQL已复制到剪贴板')
  } catch {
    ElMessage.warning('复制失败，请手动复制')
  }
}

// ── 复制文本 ──
async function handleCopyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.warning('复制失败，请手动复制')
  }
}

// ── 数据获取 ──
async function fetchData() {
  loading.value = true
  try {
    const searchParams: Record<string, any> = {}
    if (searchForm.userName) searchParams.userName = searchForm.userName
    if (searchForm.clientId) searchParams.clientId = searchForm.clientId
    if (searchForm.grantType) searchParams.grantType = searchForm.grantType
    if (searchForm.createTime && searchForm.createTime.length === 2) {
      searchParams.createTime = searchForm.createTime
    }

    const res = await getLoginLogs({
      page: pagination.page,
      pageSize: pagination.pageSize,
      search: searchParams
    })
    tableData.value = res.list
    pagination.total = res.total
  } catch {
    ElMessage.error('获取数据失败，请重试')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  fetchData()
}

function handleReset() {
  searchForm.userName = ''
  searchForm.clientId = ''
  searchForm.grantType = ''
  searchForm.createTime = null
  pagination.page = 1
  fetchData()
}

function handleRefresh() {
  fetchData()
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
  fetchData()
}

function handlePageChange(page: number) {
  pagination.page = page
  fetchData()
}

async function handleViewDetail(row: SysLoginLog) {
  try {
    const detail = await getLoginLogDetail(row.logId)
    if (detail) {
      detailData.value = detail
      detailDialogVisible.value = true
    } else {
      ElMessage.warning('未找到该条记录的详细信息')
    }
  } catch {
    ElMessage.error('获取详情失败，请重试')
  }
}

// ── 初始化 ──
onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.login-log-management {
  padding: 0;
  background: linear-gradient(160deg, #F5F7FA 0%, #E8ECF1 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;

  // 入场动画
  .animate-item {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;

    &:nth-child(1) { animation-delay: 0.05s; }
    &:nth-child(2) { animation-delay: 0.12s; }
    &:nth-child(3) { animation-delay: 0.19s; }
  }

  // 搜索栏
  .search-bar {
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #ebeef5;

    .el-form-item {
      margin-bottom: 0;
    }
  }

  // 表格卡片
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

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .total-count {
        font-size: 13px;
        color: #909399;
        padding: 6px 14px;
        background: #F0F2F5;
        border-radius: 6px;
      }
    }

    :deep(.el-table) {
      flex: 1;
      border-radius: 8px;
      overflow: hidden;

      .el-table__row {
        transition: background-color 0.2s ease;
      }
    }

    .id-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 12px;
      color: #606266;
      background: #F0F2F5;
      padding: 3px 8px;
      border-radius: 4px;
    }

    .user-text {
      font-size: 13px;
      color: #303133;
      word-break: break-all;

      &.copyable {
        cursor: pointer;

        &:hover {
          color: #409EFF;
        }
      }
    }

    .ip-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 13px;
      color: #606266;
    }

    .browser-text {
      font-size: 13px;
      color: #606266;
    }

    .time-text {
      font-size: 13px;
      color: #909399;
    }

    // 空状态
    .empty-state {
      padding: 48px 0;

      .empty-title {
        font-size: 16px;
        color: #606266;
        margin: 16px 0 8px;
      }

      .empty-desc {
        font-size: 13px;
        color: #909399;
      }
    }

    // 分页
    .pagination-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
      flex-shrink: 0;
    }
  }

  // 详情抽屉
  :deep(.el-drawer) {
    .el-drawer__header {
      margin-bottom: 0;
      padding: 20px 24px;
      border-bottom: 1px solid #EBEEF5;

      .el-drawer__title {
        color: #303133;
        font-weight: 600;
        font-size: 16px;
      }

      .el-drawer__close-btn {
        color: #909399;

        &:hover {
          color: #409EFF;
        }
      }
    }

    .el-drawer__body {
      padding: 20px 24px;
      overflow-y: auto;
    }
  }

  // 详情内容
  .detail-content {
    :deep(.el-collapse) {
      border: 1px solid #EBEEF5;
      border-radius: 8px;
      overflow: hidden;

      .el-collapse-item__header {
        background: #F5F7FA;
        font-weight: 600;
        color: #303133;
        padding: 0 20px;
        height: 44px;
        line-height: 44px;
      }

      .el-collapse-item__wrap {
        border-bottom: 1px solid #EBEEF5;
      }

      .el-collapse-item__content {
        padding: 16px 20px;
      }
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;

      &.full-width {
        grid-column: 1 / -1;
      }
    }

    .detail-label {
      font-size: 12px;
      color: #909399;
      font-weight: 500;
    }

    .detail-value {
      font-size: 14px;
      color: #303133;
      word-break: break-all;

      &.mono {
        font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      }
    }
  }

  // SQL弹窗
  .sql-content {
    .sql-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .sql-title {
        font-size: 14px;
        font-weight: 600;
        color: #303133;
      }
    }

    .sql-block {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 12px;
      line-height: 1.6;
      color: #303133;
      background: #F5F7FA;
      border: 1px solid #EBEEF5;
      border-radius: 6px;
      padding: 16px;
      margin: 0;
      overflow-x: auto;
      white-space: pre;
      max-height: 500px;
    }
  }

  // SQL弹窗样式
  :deep(.el-dialog) {
    .el-dialog__header {
      padding: 20px 24px;
      margin: 0;
      border-bottom: 1px solid #EBEEF5;

      .el-dialog__title {
        color: #303133;
        font-weight: 600;
        font-size: 16px;
      }

      .el-dialog__headerbtn .el-dialog__close {
        color: #909399;

        &:hover {
          color: #409EFF;
        }
      }
    }

    .el-dialog__body {
      padding: 20px 24px;
    }
  }
}
</style>

<style>
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
