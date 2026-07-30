<template>
  <div class="http-log-management">
    <!-- 数据表格 -->
    <el-card class="table-card animate-item" shadow="never">
      <!-- 顶部搜索栏 -->
      <div class="search-bar">
        <el-form :model="searchForm" inline>
          <el-form-item label="请求方式">
            <el-select
              v-model="searchForm.reqMethod"
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
              v-model="searchForm.repState"
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
              v-model="searchForm.reqUrl"
              placeholder="请输入请求地址"
              clearable
              :prefix-icon="Search"
              style="width: 180px"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="调用时间">
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

        <el-table-column prop="reqMethod" label="请求方式" width="120" align="center">
          <template #default="{ row }">
            <el-tag
              :type="getMethodType(row.reqMethod)"
              effect="dark"
              style="border: none; color: #fff"
              round
            >
              {{ row.reqMethod }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="reqUrl" label="请求地址" min-width="300">
          <template #default="{ row }">
            <el-tooltip :content="'点击复制'" placement="top" :show-after="300">
              <span class="url-text" @click="handleCopyUrl(row.reqUrl)">{{ row.reqUrl }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="repState" label="响应状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :type="getStateType(row.repState)"
              effect="dark"
              style="border: none; color: #fff"
              round
            >
              {{ row.repState }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="repTime" label="耗时(ms)" width="90" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.repTime }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="调用时间" width="180" align="center">
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
                    :type="getMethodType(detailData.reqMethod)"
                    effect="dark"
                    style="border: none; color: #fff"
                    round
                    size="small"
                  >
                    {{ detailData.reqMethod }}
                  </el-tag>
                </span>
              </div>
              <div class="detail-item full-width">
                <span class="detail-label">请求地址</span>
                <span class="detail-value mono">{{ detailData.reqUrl }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">响应状态</span>
                <span class="detail-value">
                  <el-tag
                    :type="getStateType(detailData.repState)"
                    effect="dark"
                    style="border: none; color: #fff"
                    round
                    size="small"
                  >
                    {{ detailData.repState }}
                  </el-tag>
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">耗时</span>
                <span class="detail-value">{{ detailData.repTime }} ms</span>
              </div>
              <div class="detail-item full-width">
                <span class="detail-label">调用时间</span>
                <span class="detail-value">{{ detailData.createTime }}</span>
              </div>
            </div>
          </el-collapse-item>

          <!-- 报文信息 -->
          <el-collapse-item title="报文信息" name="request">
            <div class="detail-grid">
              <div class="detail-item full-width">
                <div class="label-row">
                  <span class="detail-label">请求头 (reqHeader)</span>
                  <el-button type="primary" link size="small" @click="handleCopyJson(detailData.reqHeader || '-')">
                    <el-icon><CopyDocument /></el-icon> 复制
                  </el-button>
                </div>
                <pre class="json-block">{{ formatJson(detailData.reqHeader || '-') }}</pre>
              </div>
              <div class="detail-item full-width">
                <div class="label-row">
                  <span class="detail-label">请求参数 (reqParams)</span>
                  <el-button type="primary" link size="small" @click="handleCopyJson(detailData.reqParams)">
                    <el-icon><CopyDocument /></el-icon> 复制
                  </el-button>
                </div>
                <pre class="json-block">{{ formatJson(detailData.reqParams) }}</pre>
              </div>
              <div class="detail-item full-width">
                <div class="label-row">
                  <span class="detail-label">响应数据 (repData)</span>
                  <el-button type="primary" link size="small" @click="handleCopyJson(detailData.repData)">
                    <el-icon><CopyDocument /></el-icon> 复制
                  </el-button>
                </div>
                <pre class="json-block">{{ formatJson(detailData.repData) }}</pre>
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
  reqMethod: string
  repState: string
  reqUrl: string
  createTime: string[] | null
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
  "reqMethod" varchar(50) COLLATE "pg_catalog"."default",
  "reqUrl" text COLLATE "pg_catalog"."default",
  "reqHeader" text COLLATE "pg_catalog"."default",
  "reqParams" text COLLATE "pg_catalog"."default",
  "repData" text COLLATE "pg_catalog"."default",
  "repState" varchar(50) COLLATE "pg_catalog"."default",
  "repTime" varchar(30) COLLATE "pg_catalog"."default",
  "userId" int8,
  "orgId" int8 DEFAULT 0,
  "createTime" timestamp(6) DEFAULT '1970-01-02 00:00:00'::timestamp without time zone,

  CONSTRAINT "sys_http_log_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "public"."sys_http_log" OWNER TO "postgres";

COMMENT ON COLUMN "public"."sys_http_log"."id" IS '日志ID';
COMMENT ON COLUMN "public"."sys_http_log"."reqMethod" IS '请求方式';
COMMENT ON COLUMN "public"."sys_http_log"."reqUrl" IS '请求链接';
COMMENT ON COLUMN "public"."sys_http_log"."reqHeader" IS '请求头信息';
COMMENT ON COLUMN "public"."sys_http_log"."reqParams" IS '请求参数';
COMMENT ON COLUMN "public"."sys_http_log"."repData" IS '响应数据';
COMMENT ON COLUMN "public"."sys_http_log"."repState" IS '响应状态';
COMMENT ON COLUMN "public"."sys_http_log"."repTime" IS '响应时间（毫秒/耗时）';
COMMENT ON COLUMN "public"."sys_http_log"."userId" IS '用户ID';
COMMENT ON COLUMN "public"."sys_http_log"."orgId" IS '组织ID';
COMMENT ON COLUMN "public"."sys_http_log"."createTime" IS '创建时间';


COMMENT ON TABLE "public"."sys_http_log" IS '系统接口请求日志';`

const searchForm = reactive<SearchForm>({
  reqMethod: '',
  repState: '',
  reqUrl: '',
  createTime: null
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
    if (searchForm.reqMethod) searchParams.reqMethod = searchForm.reqMethod
    if (searchForm.repState) searchParams.repState = searchForm.repState
    if (searchForm.reqUrl) searchParams.reqUrl = searchForm.reqUrl
    if (searchForm.createTime && searchForm.createTime.length === 2) {
      searchParams.createTime = searchForm.createTime
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
  searchForm.reqMethod = ''
  searchForm.repState = ''
  searchForm.reqUrl = ''
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
