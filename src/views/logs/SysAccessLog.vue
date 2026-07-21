<template>
  <div class="access-log-management">
    <!-- 页面头部 -->
    <div class="page-header animate-item">
      <div class="header-left">
        <h1><span class="title-bar"></span>系统访问日志</h1>
        <span class="page-desc">查看系统访问操作记录，监控操作状态</span>
      </div>
      <div class="header-right">
        <el-button :icon="Document" @click="sqlDialogVisible = true">建表SQL</el-button>
        <el-button :icon="Refresh" @click="handleRefresh" :loading="loading">刷新</el-button>
      </div>
    </div>

    <!-- 顶部搜索栏 -->
    <el-card class="search-card animate-item" shadow="never">
      <div class="search-header">
        <span class="search-title">
          <el-icon><Search /></el-icon>
          筛选条件
        </span>
        <el-button type="primary" link @click="searchCollapsed = !searchCollapsed">
          {{ searchCollapsed ? '展开' : '收起' }}
          <el-icon class="collapse-icon" :class="{ 'is-collapsed': searchCollapsed }">
            <ArrowDown />
          </el-icon>
        </el-button>
      </div>
      <el-collapse-transition>
        <div v-show="!searchCollapsed">
          <el-form :model="searchForm" inline class="search-form">
            <el-form-item label="日志名称">
              <el-input
                v-model="searchForm.name"
                placeholder="请输入日志名称"
                clearable
                :prefix-icon="Search"
                style="width: 180px"
                @keyup.enter="handleSearch"
              />
            </el-form-item>
            <el-form-item label="请求地址">
              <el-input
                v-model="searchForm.req_url"
                placeholder="请输入请求地址"
                clearable
                style="width: 220px"
                @keyup.enter="handleSearch"
              />
            </el-form-item>
            <el-form-item label="IP地址">
              <el-input
                v-model="searchForm.ip"
                placeholder="请输入IP地址"
                clearable
                style="width: 150px"
                @keyup.enter="handleSearch"
              />
            </el-form-item>
            <el-form-item label="操作结果">
              <el-select
                v-model="searchForm.result"
                placeholder="请选择"
                clearable
                style="width: 120px"
              >
                <el-option label="SUCCESS" value="SUCCESS" />
                <el-option label="FAIL" value="FAIL" />
              </el-select>
            </el-form-item>
            <el-form-item label="访问时间">
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
            <el-form-item>
              <el-button type="primary" :icon="Search" @click="handleSearch" :loading="loading">搜索</el-button>
              <el-button :icon="RefreshRight" @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-collapse-transition>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card animate-item" shadow="never">
      <div class="toolbar">
        <span class="total-count">共 {{ pagination.total }} 条记录</span>
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

        <el-table-column prop="name" label="日志名称" min-width="140">
          <template #default="{ row }">
            <span class="name-text">{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="req_url" label="请求地址" min-width="240">
          <template #default="{ row }">
            <el-tooltip :content="'点击复制'" placement="top" :show-after="300">
              <span class="url-text" @click="handleCopyText(row.req_url)">{{ row.req_url }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="op_method" label="方法" width="80" align="center">
          <template #default="{ row }">
            <el-tag
              :type="getMethodType(row.op_method)"
              effect="dark"
              style="border: none; color: #fff"
              round
              size="small"
            >
              {{ row.op_method }}
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

        <el-table-column prop="rep_time" label="耗时(ms)" width="90" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.rep_time }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="ip" label="IP地址" width="130">
          <template #default="{ row }">
            <span class="ip-text">{{ row.ip }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="browser" label="浏览器" width="100">
          <template #default="{ row }">
            <span class="browser-text">{{ row.browser }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="os" label="操作系统" width="100">
          <template #default="{ row }">
            <span class="browser-text">{{ row.os }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="create_time" label="访问时间" width="170" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.create_time }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100" align="center" fixed="right">
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
                <span class="detail-value">{{ detailData.rep_time }} ms</span>
              </div>
              <div class="detail-item full-width">
                <span class="detail-label">请求地址</span>
                <span class="detail-value mono">{{ detailData.req_url }}</span>
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
                <span class="detail-value">{{ detailData.create_time }}</span>
              </div>
            </div>
          </el-collapse-item>

          <!-- 报文信息 -->
          <el-collapse-item title="报文信息" name="request">
            <div class="detail-grid">
              <div class="detail-item full-width">
                <div class="label-row">
                  <span class="detail-label">请求参数 (req_params)</span>
                  <el-button v-if="detailData.req_params" type="primary" link size="small" @click="handleCopyText(detailData.req_params)">
                    <el-icon><CopyDocument /></el-icon> 复制
                  </el-button>
                </div>
                <pre class="json-block">{{ formatJson(detailData.req_params || '-') }}</pre>
              </div>
              <div class="detail-item full-width">
                <div class="label-row">
                  <span class="detail-label">响应数据 (rep_data)</span>
                  <el-button v-if="detailData.rep_data" type="primary" link size="small" @click="handleCopyText(detailData.rep_data)">
                    <el-icon><CopyDocument /></el-icon> 复制
                  </el-button>
                </div>
                <pre class="json-block">{{ formatJson(detailData.rep_data || '-') }}</pre>
              </div>
            </div>
          </el-collapse-item>

          <!-- 其他信息 -->
          <el-collapse-item title="其他信息" name="other">
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">类名</span>
                <span class="detail-value mono text-small">{{ detailData.class_name }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">状态码</span>
                <span class="detail-value">{{ detailData.status }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">用户ID</span>
                <span class="detail-value mono">{{ detailData.user_id || '-' }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">用户名</span>
                <span class="detail-value">{{ detailData.user_name || '-' }}</span>
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
  Notebook, CopyDocument, ArrowDown, Document
} from '@element-plus/icons-vue'
import type { SysAccessLog } from '../../types/logs'
import { getAccessLogs, getAccessLogDetail } from '../../utils/logMockApi'

// ── 搜索表单类型 ──
interface SearchForm {
  name: string
  req_url: string
  ip: string
  result: string
  create_time: string[] | null
}

// ── 状态 ──
const loading = ref(false)
const searchCollapsed = ref(false)
const sqlDialogVisible = ref(false)

const accessLogSql = `CREATE TABLE "public"."sys_access_log" (
  "id" int8 NOT NULL DEFAULT nextval('sys_access_log_id_seq'::regclass),
  "name" varchar(40) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "req_url" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "op_method" varchar(20) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "ip" varchar(40) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "location" varchar(100) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "req_params" text COLLATE "pg_catalog"."default",
  "rep_data" text COLLATE "pg_catalog"."default",
  "rep_time" varchar(20) COLLATE "pg_catalog"."default",
  "class_name" varchar(255) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "result" varchar(20) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "user_id" int8,
  "user_name" varchar(100) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "org_id" int8 DEFAULT 0,
  "org_name" varchar(100) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "browser" varchar(512) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "os" varchar(512) COLLATE "pg_catalog"."default" DEFAULT NULL::character varying,
  "op_type" int2 DEFAULT 0,
  "func_type" int2 DEFAULT 0,
  "module_type" int2 DEFAULT 0,
  "display_order" int4 DEFAULT 0,
  "status" int2 NOT NULL DEFAULT 1101,
  "remark" text COLLATE "pg_catalog"."default",
  "sign_result" varchar(1024) COLLATE "pg_catalog"."default",
  "creater" varchar(64) COLLATE "pg_catalog"."default",
  "updater" varchar(64) COLLATE "pg_catalog"."default",
  "create_time" timestamp(6) DEFAULT '1970-01-02 00:00:00'::timestamp without time zone,
  "update_time" timestamp(6) DEFAULT '1970-01-02 00:00:00'::timestamp without time zone,
  "deleted" int2 DEFAULT 0,
  "signature" varchar(512) COLLATE "pg_catalog"."default",
  "signature_version" int2 DEFAULT 1,
  CONSTRAINT "sys_access_log_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "public"."sys_access_log" OWNER TO "postgres";

COMMENT ON COLUMN "public"."sys_access_log"."id" IS '唯一ID';
COMMENT ON COLUMN "public"."sys_access_log"."name" IS '日志名称';
COMMENT ON COLUMN "public"."sys_access_log"."req_url" IS '请求地址';
COMMENT ON COLUMN "public"."sys_access_log"."op_method" IS '调用方法';
COMMENT ON COLUMN "public"."sys_access_log"."ip" IS '访问ip';
COMMENT ON COLUMN "public"."sys_access_log"."location" IS '地址';
COMMENT ON COLUMN "public"."sys_access_log"."req_params" IS '请求参数';
COMMENT ON COLUMN "public"."sys_access_log"."rep_data" IS '响应数据';
COMMENT ON COLUMN "public"."sys_access_log"."rep_time" IS '响应时间';
COMMENT ON COLUMN "public"."sys_access_log"."class_name" IS '访问类名';
COMMENT ON COLUMN "public"."sys_access_log"."result" IS '日志结果';
COMMENT ON COLUMN "public"."sys_access_log"."user_id" IS '访问人ID';
COMMENT ON COLUMN "public"."sys_access_log"."user_name" IS '用户名';
COMMENT ON COLUMN "public"."sys_access_log"."org_id" IS '组织ID';
COMMENT ON COLUMN "public"."sys_access_log"."org_name" IS '组织名称';
COMMENT ON COLUMN "public"."sys_access_log"."browser" IS '请求终端';
COMMENT ON COLUMN "public"."sys_access_log"."os" IS '终端系统';
COMMENT ON COLUMN "public"."sys_access_log"."op_type" IS '日志类型';
COMMENT ON COLUMN "public"."sys_access_log"."func_type" IS '功能类型';
COMMENT ON COLUMN "public"."sys_access_log"."module_type" IS '模块分类';
COMMENT ON COLUMN "public"."sys_access_log"."display_order" IS '排序字段';
COMMENT ON COLUMN "public"."sys_access_log"."status" IS '状态（1101正常 1102停用）';
COMMENT ON COLUMN "public"."sys_access_log"."remark" IS '备注信息';
COMMENT ON COLUMN "public"."sys_access_log"."sign_result" IS '签名结果（由定时任务触发生成）';
COMMENT ON COLUMN "public"."sys_access_log"."creater" IS '创建者';
COMMENT ON COLUMN "public"."sys_access_log"."updater" IS '更新者';
COMMENT ON COLUMN "public"."sys_access_log"."create_time" IS '创建时间';
COMMENT ON COLUMN "public"."sys_access_log"."update_time" IS '更新时间';
COMMENT ON COLUMN "public"."sys_access_log"."deleted" IS '逻辑删除标志（0正常 1删除）';
COMMENT ON COLUMN "public"."sys_access_log"."signature" IS '数据签名';
COMMENT ON COLUMN "public"."sys_access_log"."signature_version" IS '数据签名版本号';

COMMENT ON TABLE "public"."sys_access_log" IS '系统访问日志表';`
const tableData = ref<SysAccessLog[]>([])
const detailDialogVisible = ref(false)
const detailData = ref<SysAccessLog | null>(null)
const activeCollapse = ref(['basic', 'request', 'other'])

const searchForm = reactive<SearchForm>({
  name: '',
  req_url: '',
  ip: '',
  result: '',
  create_time: null
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
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
    if (searchForm.req_url) searchParams.req_url = searchForm.req_url
    if (searchForm.ip) searchParams.ip = searchForm.ip
    if (searchForm.result) searchParams.result = searchForm.result
    if (searchForm.create_time && searchForm.create_time.length === 2) {
      searchParams.create_time = searchForm.create_time
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
  searchForm.req_url = ''
  searchForm.ip = ''
  searchForm.result = ''
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
  padding: 24px;
  background: linear-gradient(160deg, #F5F7FA 0%, #E8ECF1 100%);
  min-height: 100vh;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;

  // 入场动画
  .animate-item {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;

    &:nth-child(1) { animation-delay: 0.05s; }
    &:nth-child(2) { animation-delay: 0.12s; }
    &:nth-child(3) { animation-delay: 0.19s; }
  }

  // 页面头部
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    padding: 24px 28px;
    background: #FFFFFF;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

    .header-left {
      h1 {
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
        background: linear-gradient(180deg, #409EFF 0%, #66B1FF 100%);
        border-radius: 2px;
      }

      .page-desc {
        font-size: 13px;
        color: #909399;
        padding-left: 14px;
      }
    }
  }

  // 搜索栏
  .search-card {
    margin-bottom: 16px;
    border-radius: 12px;
    border: none;

    :deep(.el-card__body) {
      padding: 16px 24px 8px;
    }

    .search-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .search-title {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        font-weight: 600;
        color: #303133;
      }
    }

    .collapse-icon {
      transition: transform 0.3s ease;
      margin-left: 2px;

      &.is-collapsed {
        transform: rotate(-90deg);
      }
    }

    .search-form {
      .el-form-item {
        margin-bottom: 12px;
      }
    }
  }

  // 表格卡片
  .table-card {
    border-radius: 12px;
    border: none;

    :deep(.el-card__body) {
      padding: 20px;
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
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid #EBEEF5;
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
