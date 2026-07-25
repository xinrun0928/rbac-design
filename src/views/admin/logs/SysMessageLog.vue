<template>
  <div class="message-log-management">
    <!-- 数据表格 -->
    <el-card class="table-card animate-item" shadow="never">
      <!-- 顶部搜索栏 -->
      <div class="search-bar">
        <el-form :model="searchForm" inline>
          <el-form-item label="模板ID">
            <el-input
              v-model="searchForm.template_id"
              placeholder="请输入模板ID"
              clearable
              :prefix-icon="Search"
              style="width: 180px"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input
              v-model="searchForm.phone"
              placeholder="请输入手机号码"
              clearable
              :prefix-icon="Search"
              style="width: 180px"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="内容">
            <el-input
              v-model="searchForm.content"
              placeholder="请输入内容关键词"
              clearable
              :prefix-icon="Search"
              style="width: 180px"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="发送时间">
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
        row-key="message_id"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600' }"
        empty-text=" "
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="message_id" label="消息ID" min-width="180">
          <template #default="{ row }">
            <span class="id-text">{{ row.message_id }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="template_id" label="模板ID" width="120">
          <template #default="{ row }">
            <span class="template-text">{{ row.template_id }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="phone" label="手机号" width="140" align="center">
          <template #default="{ row }">
            <span class="phone-text">{{ row.phone }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="content" label="内容" min-width="200">
          <template #default="{ row }">
            <el-tooltip
              :content="row.content"
              placement="top"
              :show-after="300"
              :disabled="row.content.length <= 20"
            >
              <span class="content-text">
                {{ truncateContent(row.content) }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="发送状态" min-width="120" align="center">
          <template #default="{ row }">
            <el-tag
              :type="parseSendStatus(row.reply_text).success ? 'success' : 'danger'"
              effect="dark"
              style="border: none; color: #fff"
              round
            >
              {{ parseSendStatus(row.reply_text).message }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="create_time" label="发送时间" width="180" align="center">
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
            <el-icon :size="64" color="#DCDFE6"><ChatDotRound /></el-icon>
            <p class="empty-title">暂无短信消息记录</p>
            <p class="empty-desc">系统尚未发送任何短信消息</p>
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
      title="短信消息详情"
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
                <span class="detail-label">消息ID</span>
                <span class="detail-value mono">{{ detailData.message_id }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">模板ID</span>
                <span class="detail-value mono">{{ detailData.template_id }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">发送状态</span>
                <span class="detail-value">
                  <el-tag
                    :type="parseSendStatus(detailData.reply_text).success ? 'success' : 'danger'"
                    effect="dark"
                    style="border: none; color: #fff"
                    round
                    size="small"
                  >
                    {{ parseSendStatus(detailData.reply_text).message }}
                  </el-tag>
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">创建时间</span>
                <span class="detail-value">{{ detailData.create_time }}</span>
              </div>
            </div>
          </el-collapse-item>

          <!-- 消息内容 -->
          <el-collapse-item title="消息内容" name="content">
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">手机号</span>
                <span class="detail-value mono">{{ detailData.phone }}</span>
              </div>
              <div class="detail-item full-width">
                <span class="detail-label">消息内容</span>
                <span class="detail-value content-full">{{ detailData.content }}</span>
              </div>
            </div>
          </el-collapse-item>

          <!-- 报文及回复 -->
          <el-collapse-item title="报文及回复" name="request">
            <div class="detail-grid">
              <div class="detail-item full-width">
                <div class="label-row">
                  <span class="detail-label">请求头 (req_headers)</span>
                  <el-button type="primary" link size="small" @click="handleCopyJson(detailData.req_headers)">
                    <el-icon><CopyDocument /></el-icon> 复制
                  </el-button>
                </div>
                <pre class="json-block">{{ formatJson(detailData.req_headers) }}</pre>
              </div>
              <div class="detail-item full-width">
                <div class="label-row">
                  <span class="detail-label">第三方回复 (reply_text)</span>
                  <el-button type="primary" link size="small" @click="handleCopyJson(detailData.reply_text)">
                    <el-icon><CopyDocument /></el-icon> 复制
                  </el-button>
                </div>
                <pre class="json-block">{{ formatJson(detailData.reply_text) }}</pre>
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
          <span class="sql-title">sys_message_log - 系统短信消息记录表</span>
          <el-button type="primary" :icon="CopyDocument" @click="handleCopySql">复制SQL</el-button>
        </div>
        <pre class="sql-block">{{ messageLogSql }}</pre>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Search, Refresh, RefreshRight, View,
  ChatDotRound, CopyDocument, Document
} from '@element-plus/icons-vue'
import type { SysMessageLog } from '@/types/admin/logs'
import { getMessageLogs, getMessageLogDetail } from '@/utils/logMockApi'

// ── 搜索表单类型 ──
interface SearchForm {
  template_id: string
  phone: string
  content: string
  create_time: string[] | null
}

// ── 状态 ──
const loading = ref(false)
const tableData = ref<SysMessageLog[]>([])
const detailDialogVisible = ref(false)
const detailData = ref<SysMessageLog | null>(null)
const activeCollapse = ref(['basic', 'content', 'request'])
const sqlDialogVisible = ref(false)

const messageLogSql = `CREATE TABLE "public"."sys_message_log" (
  "message_id" int8 NOT NULL DEFAULT nextval('sys_message_log_message_id_seq'::regclass),
  "template_id" varchar(20) COLLATE "pg_catalog"."default" NOT NULL,
  "phone" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "content" text COLLATE "pg_catalog"."default" NOT NULL,
  "req_headers" text COLLATE "pg_catalog"."default",
  "reply_text" text COLLATE "pg_catalog"."default",
  "display_order" int4 DEFAULT 0,
  "status" int2 NOT NULL DEFAULT 1101,
  "remark" varchar(500) COLLATE "pg_catalog"."default",
  "creater" varchar(64) COLLATE "pg_catalog"."default",
  "updater" varchar(64) COLLATE "pg_catalog"."default",
  "create_time" timestamp(6) DEFAULT '1970-01-02 00:00:00'::timestamp without time zone,
  "update_time" timestamp(6) DEFAULT '1970-01-02 00:00:00'::timestamp without time zone,
  "deleted" int2 DEFAULT 0,
  "signature" varchar(512) COLLATE "pg_catalog"."default",
  "signature_version" int2 DEFAULT 1,
  CONSTRAINT "sys_message_log_pkey" PRIMARY KEY ("message_id")
);

ALTER TABLE "public"."sys_message_log" OWNER TO "postgres";

COMMENT ON COLUMN "public"."sys_message_log"."message_id" IS '消息ID';
COMMENT ON COLUMN "public"."sys_message_log"."template_id" IS '模版ID';
COMMENT ON COLUMN "public"."sys_message_log"."phone" IS '手机号码';
COMMENT ON COLUMN "public"."sys_message_log"."content" IS '消息内容';
COMMENT ON COLUMN "public"."sys_message_log"."req_headers" IS '请求头';
COMMENT ON COLUMN "public"."sys_message_log"."reply_text" IS '消息回复';
COMMENT ON COLUMN "public"."sys_message_log"."display_order" IS '排序字段';
COMMENT ON COLUMN "public"."sys_message_log"."status" IS '状态（1101正常 1102停用）';
COMMENT ON COLUMN "public"."sys_message_log"."remark" IS '备注信息';
COMMENT ON COLUMN "public"."sys_message_log"."creater" IS '创建者';
COMMENT ON COLUMN "public"."sys_message_log"."updater" IS '更新者';
COMMENT ON COLUMN "public"."sys_message_log"."create_time" IS '创建时间';
COMMENT ON COLUMN "public"."sys_message_log"."update_time" IS '更新时间';
COMMENT ON COLUMN "public"."sys_message_log"."deleted" IS '逻辑删除标志（0正常 1删除）';
COMMENT ON COLUMN "public"."sys_message_log"."signature" IS '数据签名';
COMMENT ON COLUMN "public"."sys_message_log"."signature_version" IS '数据签名版本号';

COMMENT ON TABLE "public"."sys_message_log" IS '系统短信消息记录表';`

const searchForm = reactive<SearchForm>({
  template_id: '',
  phone: '',
  content: '',
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
    await navigator.clipboard.writeText(messageLogSql)
    ElMessage.success('SQL已复制到剪贴板')
  } catch {
    ElMessage.warning('复制失败，请手动复制')
  }
}

// ── 内容截断 ──
function truncateContent(content: string): string {
  if (!content) return '-'
  if (content.length <= 20) return content
  return content.slice(0, 20) + '...'
}

// ── 解析发送状态 ──
function parseSendStatus(replyText: string): { success: boolean; message: string } {
  if (!replyText) return { success: false, message: '未知' }
  try {
    const reply = JSON.parse(replyText)
    if (reply.data && reply.data.success === true) {
      return { success: true, message: '发送成功' }
    } else if (reply.data && reply.data.success === false) {
      const msg = reply.data.msg || '发送失败'
      if (reply.data.respdata && reply.data.respdata.records && reply.data.respdata.records.length > 0) {
        const record = reply.data.respdata.records[0]
        return { success: false, message: record.codeDesc || msg }
      }
      return { success: false, message: msg }
    }
    return { success: false, message: '未知状态' }
  } catch {
    return { success: false, message: '解析失败' }
  }
}

// ── JSON 格式化 ──
function formatJson(str: string): string {
  if (!str) return '-'
  try {
    const obj = JSON.parse(str)
    return JSON.stringify(obj, null, 2)
  } catch {
    return str
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

// ── 数据获取 ──
async function fetchData() {
  loading.value = true
  try {
    const searchParams: Record<string, any> = {}
    if (searchForm.template_id) searchParams.template_id = searchForm.template_id
    if (searchForm.phone) searchParams.phone = searchForm.phone
    if (searchForm.content) searchParams.content = searchForm.content
    if (searchForm.create_time && searchForm.create_time.length === 2) {
      searchParams.create_time = searchForm.create_time
    }

    const res = await getMessageLogs({
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
  searchForm.template_id = ''
  searchForm.phone = ''
  searchForm.content = ''
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

async function handleViewDetail(row: SysMessageLog) {
  try {
    const detail = await getMessageLogDetail(row.message_id)
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
.message-log-management {
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
      font-size: 13px;
      color: #606266;
      background: #F0F2F5;
      padding: 3px 8px;
      border-radius: 4px;
    }

    .template-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 12px;
      color: #409EFF;
      background: #ECF5FF;
      padding: 3px 8px;
      border-radius: 4px;
    }

    .phone-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 13px;
      color: #606266;
    }

    .content-text {
      font-size: 13px;
      color: #606266;
      cursor: pointer;

      &:hover {
        color: #409EFF;
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

      &.content-full {
        line-height: 1.6;
        background: #F5F7FA;
        padding: 10px 14px;
        border-radius: 6px;
        white-space: pre-wrap;
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
