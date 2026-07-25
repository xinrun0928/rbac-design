<template>
  <div class="http-log-management">
    <!-- 数据表格 -->
    <el-card class="table-card animate-item" shadow="never">
      <!-- 顶部搜索栏 -->
      <div class="search-bar">
        <el-form :model="searchForm" inline>
          <el-form-item label="请求方式">
            <el-select
              v-model="searchForm.req_method"
              placeholder="请选择"
              clearable
              style="width: 180px"
            >
              <el-option label="POST_JSON" value="POST_JSON" />
              <el-option label="POST_FORM" value="POST_FORM" />
              <el-option label="GET" value="GET" />
              <el-option label="POST" value="POST" />
              <el-option label="PUT" value="PUT" />
              <el-option label="DELETE" value="DELETE" />
            </el-select>
          </el-form-item>
          <el-form-item label="响应状态">
            <el-select
              v-model="searchForm.rep_state"
              placeholder="请选择"
              clearable
              style="width: 180px"
            >
              <el-option label="SUCCESS" value="SUCCESS" />
              <el-option label="FAIL" value="FAIL" />
            </el-select>
          </el-form-item>
          <el-form-item label="请求地址">
            <el-input
              v-model="searchForm.req_url"
              placeholder="请输入请求地址"
              clearable
              :prefix-icon="Search"
              style="width: 180px"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="调用时间">
            <el-date-picker
              v-model="searchForm.create_time"
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
        row-key="id"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600' }"
        empty-text=" "
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="id" label="日志ID" min-width="180">
          <template #default="{ row }">
            <span class="id-text">{{ row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="req_method" label="请求方式" width="120" align="center">
          <template #default="{ row }">
            <el-tag
              :type="getMethodType(row.req_method)"
              effect="dark"
              style="border: none; color: #fff"
              round
            >
              {{ row.req_method }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="req_url" label="请求地址" min-width="300">
          <template #default="{ row }">
            <el-tooltip :content="'点击复制'" placement="top" :show-after="300">
              <span class="url-text" @click="handleCopyUrl(row.req_url)">{{ row.req_url }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="rep_state" label="响应状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :type="getStateType(row.rep_state)"
              effect="dark"
              style="border: none; color: #fff"
              round
            >
              {{ row.rep_state }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="rep_time" label="耗时(ms)" width="90" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.rep_time }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="create_time" label="调用时间" width="180" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.create_time }}</span>
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
            <el-icon :size="64" color="#DCDFE6"><Connection /></el-icon>
            <p class="empty-title">暂无接口请求记录</p>
            <p class="empty-desc">系统尚未记录任何接口调用</p>
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
      title="接口请求详情"
      direction="rtl"
      size="580px"
      destroy-on-close
    >
      <div v-if="detailData" class="detail-content">
        <el-collapse v-model="activeCollapse">
          <!-- 基础信息 -->
          <el-collapse-item title="基础信息" name="basic">
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">日志ID</span>
                <span class="detail-value mono">{{ detailData.id }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">请求方式</span>
                <span class="detail-value">
                  <el-tag
                    :type="getMethodType(detailData.req_method)"
                    effect="dark"
                    style="border: none; color: #fff"
                    round
                    size="small"
                  >
                    {{ detailData.req_method }}
                  </el-tag>
                </span>
              </div>
              <div class="detail-item full-width">
                <span class="detail-label">请求地址</span>
                <span class="detail-value mono">{{ detailData.req_url }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">响应状态</span>
                <span class="detail-value">
                  <el-tag
                    :type="getStateType(detailData.rep_state)"
                    effect="dark"
                    style="border: none; color: #fff"
                    round
                    size="small"
                  >
                    {{ detailData.rep_state }}
                  </el-tag>
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">耗时</span>
                <span class="detail-value">{{ detailData.rep_time }} ms</span>
              </div>
              <div class="detail-item full-width">
                <span class="detail-label">调用时间</span>
                <span class="detail-value">{{ detailData.create_time }}</span>
              </div>
            </div>
          </el-collapse-item>

          <!-- 报文信息 -->
          <el-collapse-item title="报文信息" name="request">
            <div class="detail-grid">
              <div class="detail-item full-width">
                <div class="label-row">
                  <span class="detail-label">请求头 (req_header)</span>
                  <el-button type="primary" link size="small" @click="handleCopyJson(detailData.req_header || '-')">
                    <el-icon><CopyDocument /></el-icon> 复制
                  </el-button>
                </div>
                <pre class="json-block">{{ formatJson(detailData.req_header || '-') }}</pre>
              </div>
              <div class="detail-item full-width">
                <div class="label-row">
                  <span class="detail-label">请求参数 (req_params)</span>
                  <el-button type="primary" link size="small" @click="handleCopyJson(detailData.req_params)">
                    <el-icon><CopyDocument /></el-icon> 复制
                  </el-button>
                </div>
                <pre class="json-block">{{ formatJson(detailData.req_params) }}</pre>
              </div>
              <div class="detail-item full-width">
                <div class="label-row">
                  <span class="detail-label">响应数据 (rep_data)</span>
                  <el-button type="primary" link size="small" @click="handleCopyJson(detailData.rep_data)">
                    <el-icon><CopyDocument /></el-icon> 复制
                  </el-button>
                </div>
                <pre class="json-block">{{ formatJson(detailData.rep_data) }}</pre>
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
          <span class="sql-title">sys_http_log - 系统接口请求日志</span>
          <el-button type="primary" :icon="CopyDocument" @click="handleCopySql">复制SQL</el-button>
        </div>
        <pre class="sql-block">{{ httpLogSql }}</pre>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Search, Refresh, RefreshRight, View,
  Connection, CopyDocument, Document
} from '@element-plus/icons-vue'
import type { SysHttpLog } from '@/types/admin/logs'
import { getHttpLogs, getHttpLogDetail } from '@/utils/logMockApi'

// ── 搜索表单类型 ──
interface SearchForm {
  req_method: string
  rep_state: string
  req_url: string
  create_time: string[] | null
}

// ── 状态 ──
const loading = ref(false)
const tableData = ref<SysHttpLog[]>([])
const detailDialogVisible = ref(false)
const detailData = ref<SysHttpLog | null>(null)
const activeCollapse = ref(['basic', 'request'])
const sqlDialogVisible = ref(false)

const httpLogSql = `CREATE TABLE "public"."sys_http_log" (
  "id" int8 NOT NULL DEFAULT nextval('sys_http_log_id_seq'::regclass),
  "req_method" varchar(50) COLLATE "pg_catalog"."default",
  "req_url" text COLLATE "pg_catalog"."default",
  "req_header" text COLLATE "pg_catalog"."default",
  "req_params" text COLLATE "pg_catalog"."default",
  "rep_data" text COLLATE "pg_catalog"."default",
  "rep_state" varchar(50) COLLATE "pg_catalog"."default",
  "rep_time" varchar(30) COLLATE "pg_catalog"."default",
  "user_id" int8,
  "org_id" int8 DEFAULT 0,
  "create_time" timestamp(6) DEFAULT '1970-01-02 00:00:00'::timestamp without time zone,
  "deleted" int2 DEFAULT 0,
  "signature" varchar(512) COLLATE "pg_catalog"."default",
  "signature_version" int2 DEFAULT 1,
  CONSTRAINT "sys_http_log_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "public"."sys_http_log" OWNER TO "postgres";

COMMENT ON COLUMN "public"."sys_http_log"."id" IS '日志ID';
COMMENT ON COLUMN "public"."sys_http_log"."req_method" IS '请求方式';
COMMENT ON COLUMN "public"."sys_http_log"."req_url" IS '请求链接';
COMMENT ON COLUMN "public"."sys_http_log"."req_header" IS '请求头信息';
COMMENT ON COLUMN "public"."sys_http_log"."req_params" IS '请求参数';
COMMENT ON COLUMN "public"."sys_http_log"."rep_data" IS '响应数据';
COMMENT ON COLUMN "public"."sys_http_log"."rep_state" IS '响应状态';
COMMENT ON COLUMN "public"."sys_http_log"."rep_time" IS '响应时间（毫秒/耗时）';
COMMENT ON COLUMN "public"."sys_http_log"."user_id" IS '用户ID';
COMMENT ON COLUMN "public"."sys_http_log"."org_id" IS '组织ID';
COMMENT ON COLUMN "public"."sys_http_log"."create_time" IS '创建时间';
COMMENT ON COLUMN "public"."sys_http_log"."deleted" IS '逻辑删除标志（0正常 1删除）';
COMMENT ON COLUMN "public"."sys_http_log"."signature" IS '数据签名';
COMMENT ON COLUMN "public"."sys_http_log"."signature_version" IS '数据签名版本号';

COMMENT ON TABLE "public"."sys_http_log" IS '系统接口请求日志';`

const searchForm = reactive<SearchForm>({
  req_method: '',
  rep_state: '',
  req_url: '',
  create_time: null
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// ── 复制SQL ──
async function handleCopySql() {
  try {
    await navigator.clipboard.writeText(httpLogSql)
    ElMessage.success('SQL已复制到剪贴板')
  } catch {
    ElMessage.warning('复制失败，请手动复制')
  }
}

// ── 请求方式类型 ──
function getMethodType(method: string): string {
  if (method.includes('GET')) return 'success'
  if (method.includes('POST')) return ''
  if (method.includes('PUT')) return 'warning'
  if (method.includes('DELETE')) return 'danger'
  return 'info'
}

// ── 响应状态类型 ──
function getStateType(state: string): string {
  if (state === 'SUCCESS') return 'success'
  if (state === 'FAIL') return 'danger'
  return 'info'
}

// ── JSON 格式化 ──
function formatJson(str: string): string {
  if (!str || str === '-') return '-'
  try {
    const obj = JSON.parse(str)
    return JSON.stringify(obj, null, 2)
  } catch {
    return str
  }
}

// ── 数据获取 ──
async function fetchData() {
  loading.value = true
  try {
    const searchParams: Record<string, any> = {}
    if (searchForm.req_method) searchParams.req_method = searchForm.req_method
    if (searchForm.rep_state) searchParams.rep_state = searchForm.rep_state
    if (searchForm.req_url) searchParams.req_url = searchForm.req_url
    if (searchForm.create_time && searchForm.create_time.length === 2) {
      searchParams.create_time = searchForm.create_time
    }

    const res = await getHttpLogs({
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
  searchForm.req_method = ''
  searchForm.rep_state = ''
  searchForm.req_url = ''
  searchForm.create_time = null
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

// ── 复制URL ──
async function handleCopyUrl(url: string) {
  try {
    await navigator.clipboard.writeText(url)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.warning('复制失败，请手动复制')
  }
}

// ── 复制JSON ──
async function handleCopyJson(content: string) {
  try {
    await navigator.clipboard.writeText(content)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.warning('复制失败，请手动复制')
  }
}

async function handleViewDetail(row: SysHttpLog) {
  try {
    const detail = await getHttpLogDetail(row.id)
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
.http-log-management {
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

    .url-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 12px;
      color: #409EFF;
      cursor: pointer;

      &:hover {
        color: #66B1FF;
      }
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

    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .detail-value {
      font-size: 14px;
      color: #303133;
      word-break: break-all;

      &.mono {
        font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      }
    }

    .json-block {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 12px;
      line-height: 1.6;
      color: #303133;
      background: #F5F7FA;
      border: 1px solid #EBEEF5;
      border-radius: 6px;
      padding: 12px 16px;
      margin: 0;
      overflow-x: auto;
      white-space: pre;
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
