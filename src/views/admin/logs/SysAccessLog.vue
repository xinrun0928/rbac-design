<template>
  <div class="access-log-management">

    <!-- 数据表格 -->
    <el-card class="table-card animate-item" shadow="never">
      <!-- 顶部搜索栏 -->
      <div class="search-bar">
        <span class="search-bar-title">访问日志</span>
        <div class="search-bar-actions">
          <el-input
            v-model="searchForm.name"
            placeholder="搜索日志名称"
            clearable
            :prefix-icon="Search"
            style="width: 180px; margin-right: 12px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
          <el-input
            v-model="searchForm.reqUrl"
            placeholder="搜索请求地址"
            clearable
            :prefix-icon="Search"
            style="width: 180px; margin-right: 12px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
          <el-date-picker
            v-model="searchForm.createTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 260px"
          />
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        highlight-current-row
        row-key="id"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        empty-text=" "
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="name" label="日志名称" min-width="140" align="center">
          <template #default="{ row }">
            <span class="name-text">{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="reqUrl" label="请求地址" min-width="240" show-overflow-tooltip>
          <template #default="{ row }">
            <el-tooltip :content="'点击复制'" placement="top" :show-after="300">
              <span class="url-text" @click="handleCopyText(row.reqUrl)">{{ row.reqUrl }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="opMethod" label="方法" width="80" align="center">
          <template #default="{ row }">
            <el-tag
              :type="getMethodType(row.opMethod)"
              effect="dark"
              style="border: none; color: #fff"
              round
              size="small"
            >
              {{ row.opMethod }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="result" label="结果" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :type="row.result === 'SUCCESS' ? 'success' : 'danger'"
              effect="dark"
              style="border: none; color: #fff"
              round
            >
              {{ row.result }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="repTime" label="耗时(ms)" width="90" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.repTime }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="ip" label="IP地址" width="130" align="center">
          <template #default="{ row }">
            <span class="ip-text">{{ row.ip }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="browser" label="浏览器" width="100" align="center">
          <template #default="{ row }">
            <span class="browser-text">{{ row.browser }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="os" label="操作系统" width="100" align="center">
          <template #default="{ row }">
            <span class="browser-text">{{ row.os }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="访问时间" width="170" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="90" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="View" @click="handleViewDetail(row)">
              详情
            </el-button>
          </template>
        </el-table-column>

        <!-- 空状态插槽 -->
        <template #empty>
          <div class="empty-state">
            <el-icon :size="64" color="#DCDFE6"><Notebook /></el-icon>
            <p class="empty-title">暂无访问日志</p>
            <p class="empty-desc">系统尚未记录任何访问操作</p>
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
      title="访问日志详情"
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
                <span class="detail-label">日志名称</span>
                <span class="detail-value">{{ detailData.name }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">操作结果</span>
                <span class="detail-value">
                  <el-tag
                    :type="detailData.result === 'SUCCESS' ? 'success' : 'danger'"
                    effect="dark"
                    style="border: none; color: #fff"
                    round
                    size="small"
                  >
                    {{ detailData.result }}
                  </el-tag>
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">响应耗时</span>
                <span class="detail-value">{{ detailData.repTime }} ms</span>
              </div>
              <div class="detail-item full-width">
                <span class="detail-label">请求地址</span>
                <span class="detail-value mono">{{ detailData.reqUrl }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">IP地址</span>
                <span class="detail-value mono">{{ detailData.ip }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">浏览器</span>
                <span class="detail-value">{{ detailData.browser }} / {{ detailData.os }}</span>
              </div>
              <div class="detail-item full-width">
                <span class="detail-label">访问时间</span>
                <span class="detail-value">{{ detailData.createTime }}</span>
              </div>
            </div>
          </el-collapse-item>

          <!-- 报文信息 -->
          <el-collapse-item title="报文信息" name="request">
            <div class="detail-grid">
              <div class="detail-item full-width">
                <div class="label-row">
                  <span class="detail-label">请求参数 (reqParams)</span>
                  <el-button v-if="detailData.reqParams" type="primary" link size="small" @click="handleCopyText(detailData.reqParams)">
                    <el-icon><CopyDocument /></el-icon> 复制
                  </el-button>
                </div>
                <pre class="json-block">{{ formatJson(detailData.reqParams || '-') }}</pre>
              </div>
              <div class="detail-item full-width">
                <div class="label-row">
                  <span class="detail-label">响应数据 (repData)</span>
                  <el-button v-if="detailData.repData" type="primary" link size="small" @click="handleCopyText(detailData.repData)">
                    <el-icon><CopyDocument /></el-icon> 复制
                  </el-button>
                </div>
                <pre class="json-block">{{ formatJson(detailData.repData || '-') }}</pre>
              </div>
            </div>
          </el-collapse-item>

          <!-- 其他信息 -->
          <el-collapse-item title="其他信息" name="other">
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">类名</span>
                <span class="detail-value mono text-small">{{ detailData.className }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">状态码</span>
                <span class="detail-value">{{ detailData.status }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">用户ID</span>
                <span class="detail-value mono">{{ detailData.userId || '-' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">用户名</span>
                <span class="detail-value">{{ detailData.userName || '-' }}</span>
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
          <span class="sql-title">sys_access_log - 系统访问日志表</span>
          <el-button type="primary" :icon="CopyDocument" @click="handleCopySql">复制SQL</el-button>
        </div>
        <pre class="sql-block">{{ accessLogSql }}</pre>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Search, Refresh, RefreshRight, View,
  Notebook, CopyDocument, Document
} from '@element-plus/icons-vue'
import type { SysAccessLog } from '@/types/admin/logs'
import { getAccessLogs, getAccessLogDetail } from '@/utils/logMockApi'

// ── 搜索表单类型 ──
interface SearchForm {
  name: string
  reqUrl: string
  createTime: string[] | null
}

// ── 状态 ──
const loading = ref(false)
const sqlDialogVisible = ref(false)

const accessLogSql = `CREATE TABLE "public"."sys_access_log" (
  "id" int8 NOT NULL DEFAULT nextval('sys_access_log_id_seq'::regclass),
  "name" varchar(40) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "reqUrl" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "opMethod" varchar(20) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "ip" varchar(40) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "location" varchar(100) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "reqParams" text COLLATE "pg_catalog"."default",
  "repData" text COLLATE "pg_catalog"."default",
  "repTime" varchar(20) COLLATE "pg_catalog"."default",
  "className" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "result" varchar(20) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "userId" int8,
  "userName" varchar(100) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "orgId" int8 DEFAULT 0,
  "orgName" varchar(100) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "browser" varchar(512) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "os" varchar(512) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "opType" int2 DEFAULT 0,
  "funcType" int2 DEFAULT 0,
  "moduleType" int2 DEFAULT 0,
  "displayOrder" int4 DEFAULT 0,
  "status" int2 NOT NULL DEFAULT 1101,
  "remark" text COLLATE "pg_catalog"."default",
  "signResult" varchar(1024) COLLATE "pg_catalog"."default",
  "createTime" timestamp(6) DEFAULT '1970-01-02 00:00:00'::timestamp without time zone,
  "updateTime" timestamp(6) DEFAULT '1970-01-02 00:00:00'::timestamp without time zone,
  CONSTRAINT "sys_access_log_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "public"."sys_access_log" OWNER TO "postgres";

COMMENT ON COLUMN "public"."sys_access_log"."id" IS '唯一ID';
COMMENT ON COLUMN "public"."sys_access_log"."name" IS '日志名称';
COMMENT ON COLUMN "public"."sys_access_log"."reqUrl" IS '请求地址';
COMMENT ON COLUMN "public"."sys_access_log"."opMethod" IS '调用方法';
COMMENT ON COLUMN "public"."sys_access_log"."ip" IS '访问ip';
COMMENT ON COLUMN "public"."sys_access_log"."location" IS '地址';
COMMENT ON COLUMN "public"."sys_access_log"."reqParams" IS '请求参数';
COMMENT ON COLUMN "public"."sys_access_log"."repData" IS '响应数据';
COMMENT ON COLUMN "public"."sys_access_log"."repTime" IS '响应时间';
COMMENT ON COLUMN "public"."sys_access_log"."className" IS '访问类名';
COMMENT ON COLUMN "public"."sys_access_log"."result" IS '日志结果';
COMMENT ON COLUMN "public"."sys_access_log"."userId" IS '访问人ID';
COMMENT ON COLUMN "public"."sys_access_log"."userName" IS '用户名';
COMMENT ON COLUMN "public"."sys_access_log"."orgId" IS '组织ID';
COMMENT ON COLUMN "public"."sys_access_log"."orgName" IS '组织名称';
COMMENT ON COLUMN "public"."sys_access_log"."browser" IS '请求终端';
COMMENT ON COLUMN "public"."sys_access_log"."os" IS '终端系统';
COMMENT ON COLUMN "public"."sys_access_log"."opType" IS '日志类型';
COMMENT ON COLUMN "public"."sys_access_log"."funcType" IS '功能类型';
COMMENT ON COLUMN "public"."sys_access_log"."moduleType" IS '模块分类';
COMMENT ON COLUMN "public"."sys_access_log"."displayOrder" IS '排序字段';
COMMENT ON COLUMN "public"."sys_access_log"."status" IS '状态（1101正常 1102停用）';
COMMENT ON COLUMN "public"."sys_access_log"."remark" IS '备注信息';
COMMENT ON COLUMN "public"."sys_access_log"."signResult" IS '签名结果（由定时任务触发生成）';
COMMENT ON COLUMN "public"."sys_access_log"."createTime" IS '创建时间';
COMMENT ON COLUMN "public"."sys_access_log"."updateTime" IS '更新时间';

COMMENT ON TABLE "public"."sys_access_log" IS '系统访问日志表';`
const tableData = ref<SysAccessLog[]>([])
const detailDialogVisible = ref(false)
const detailData = ref<SysAccessLog | null>(null)
const activeCollapse = ref(['basic', 'request', 'other'])

const searchForm = reactive<SearchForm>({
  name: '',
  reqUrl: '',
  createTime: null
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// ── 方法类型样式 ──
function getMethodType(method: string): string {
  if (method === 'GET') return 'success'
  if (method === 'POST') return ''
  if (method === 'PUT') return 'warning'
  if (method === 'DELETE') return 'danger'
  return 'info'
}

// ── 复制SQL ──
async function handleCopySql() {
  try {
    await navigator.clipboard.writeText(accessLogSql)
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
    if (searchForm.name) searchParams.name = searchForm.name
    if (searchForm.reqUrl) searchParams.reqUrl = searchForm.reqUrl
    if (searchForm.createTime && searchForm.createTime.length === 2) {
      searchParams.createTime = searchForm.createTime
    }

    const res = await getAccessLogs({
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
  searchForm.name = ''
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

async function handleViewDetail(row: SysAccessLog) {
  try {
    const detail = await getAccessLogDetail(row.id)
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
.access-log-management {
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

    .name-text {
      font-size: 13px;
      color: #303133;
      font-weight: 500;
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

  // SQL弹窗
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

      &.text-small {
        font-size: 12px;
      }
    }

    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
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
