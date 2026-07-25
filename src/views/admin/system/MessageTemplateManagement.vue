<template>
  <div class="msg-template-management">

    <!-- 数据表格 -->
    <el-card class="table-card animate-item" shadow="never">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="模板ID">
            <el-input v-model="searchForm.templateId" placeholder="输入模板ID" clearable :prefix-icon="Search" style="width: 160px" @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item label="消息ID">
            <el-input v-model="searchForm.msgId" placeholder="输入消息ID" clearable style="width: 220px" @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item label="审核状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 130px">
              <el-option label="已审核" :value="1" />
              <el-option label="未审核" :value="0" />
            </el-select>
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
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600' }"
        class="data-table"
      >
        <el-table-column label="序号" width="60" align="center" type="index">
          <template #default="{ $index }">
            <span class="index-text">{{ $index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="templateId" label="模板ID" width="110" align="center">
          <template #default="{ row }">
            <span class="template-id-text">{{ row.templateId }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="msgId" label="消息ID" min-width="240" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="msg-id-text">{{ row.msgId }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="template" label="短信模板" min-width="300" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="template-text">{{ row.template }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="审核状态" width="110" align="center">
          <template #default="{ row }">
            <el-tag
              :type="getApprovalStatusType(row)"
              effect="light"
              size="small"
            >
              {{ getApprovalStatus(row) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" width="170" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="View" @click="handleViewDetail(row)">详情</el-button>
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

    <!-- 详情抽屉 -->
    <el-drawer
      v-model="detailDrawerVisible"
      title="短信模版详情"
      size="60%"
      direction="rtl"
      class="detail-drawer"
    >
      <template v-if="currentTemplate">
        <el-descriptions :column="2" border class="detail-descriptions">
          <el-descriptions-item label="ID">{{ currentTemplate.id }}</el-descriptions-item>
          <el-descriptions-item label="模板ID">{{ currentTemplate.templateId }}</el-descriptions-item>
          <el-descriptions-item label="消息ID" :span="2">{{ currentTemplate.msgId }}</el-descriptions-item>
          <el-descriptions-item label="短信模板" :span="2">{{ currentTemplate.template }}</el-descriptions-item>
          <el-descriptions-item label="模板内容" :span="2">{{ currentTemplate.content }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentTemplate.createTime }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="currentTemplate.status === 1 ? 'success' : 'info'" effect="light" size="small">
              {{ currentTemplate.status === 1 ? '已审核' : '未审核' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 审核信息 -->
        <div class="json-section" v-if="currentTemplate.approvalJson">
          <div class="section-header">
            <span class="section-title">审核信息（approval_json）</span>
            <div class="header-right">
              <el-tag :type="getApprovalStatusType(currentTemplate)" size="small">
                {{ getApprovalStatus(currentTemplate) }}
              </el-tag>
              <el-button type="primary" size="small" :icon="CopyDocument" @click="handleCopyJson(currentTemplate.approvalJson)">复制</el-button>
            </div>
          </div>
          <div class="json-key-info" v-if="approvalInfo">
            <div class="json-item">
              <span class="json-label">状态描述：</span>
              <span class="json-value">{{ approvalInfo.data.respdata.records[0].statusDesc }}</span>
            </div>
            <div class="json-item" v-if="approvalInfo.data.respdata.records[0].desc">
              <span class="json-label">驳回原因：</span>
              <span class="json-value error">{{ approvalInfo.data.respdata.records[0].desc }}</span>
            </div>
          </div>
          <el-input
            :model-value="formatJson(currentTemplate.approvalJson)"
            type="textarea"
            :rows="10"
            readonly
            class="json-textarea"
          />
        </div>

        <!-- 扩展信息 -->
        <div class="json-section" v-if="currentTemplate.extJson">
          <div class="section-header">
            <span class="section-title">注册信息（ext_json）</span>
            <el-button type="primary" size="small" :icon="CopyDocument" @click="handleCopyJson(currentTemplate.extJson)">复制</el-button>
          </div>
          <div class="json-key-info" v-if="extInfo">
            <div class="json-item">
              <span class="json-label">返回消息：</span>
              <span class="json-value">{{ extInfo.data.msg }}</span>
            </div>
          </div>
          <el-input
            :model-value="formatJson(currentTemplate.extJson)"
            type="textarea"
            :rows="10"
            readonly
            class="json-textarea"
          />
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Refresh, Search, RefreshLeft, View, Delete, CopyDocument
} from '@element-plus/icons-vue'
import { messageTemplateData } from '@/mock/messageTemplateData'
import type { MessageTemplate, MessageTemplateSearchForm, ApprovalJsonInfo, ExtJsonInfo } from '@/types/admin/messageTemplate'

// ── 状态 ──
const loading = ref(false)
const tableData = ref<MessageTemplate[]>(messageTemplateData)
const detailDrawerVisible = ref(false)
const currentTemplate = ref<MessageTemplate | null>(null)

const searchForm = reactive<MessageTemplateSearchForm>({
  templateId: '',
  msgId: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// ── 计算属性 ──
const filteredData = computed(() => {
  let data = tableData.value.filter(item => item.deleted === 0)

  if (searchForm.templateId) {
    data = data.filter(item => item.templateId.includes(searchForm.templateId))
  }
  if (searchForm.msgId) {
    data = data.filter(item => item.msgId.includes(searchForm.msgId))
  }
  if (searchForm.status !== '') {
    data = data.filter(item => item.status === searchForm.status)
  }

  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

const approvalInfo = computed((): ApprovalJsonInfo | null => {
  if (!currentTemplate.value?.approvalJson) return null
  try {
    return JSON.parse(currentTemplate.value.approvalJson)
  } catch {
    return null
  }
})

const extInfo = computed((): ExtJsonInfo | null => {
  if (!currentTemplate.value?.extJson) return null
  try {
    return JSON.parse(currentTemplate.value.extJson)
  } catch {
    return null
  }
})

// ── 方法 ──
function handleSearch() {
  pagination.page = 1
}

function handleReset() {
  searchForm.templateId = ''
  searchForm.msgId = ''
  searchForm.status = ''
  pagination.page = 1
}

function handleRefresh() {
  loading.value = true
  setTimeout(() => {
    tableData.value = [...messageTemplateData]
    loading.value = false
  }, 500)
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
}

function handlePageChange(page: number) {
  pagination.page = page
}

function handleViewDetail(row: MessageTemplate) {
  currentTemplate.value = row
  detailDrawerVisible.value = true
}

function handleDelete(row: MessageTemplate) {
  ElMessageBox.confirm(
    `确定要删除模板 "${row.templateId}" 吗？`,
    '确认删除',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {})
}

function parseApprovalJson(json: string | null): ApprovalJsonInfo | null {
  if (!json) return null
  try {
    return JSON.parse(json)
  } catch {
    return null
  }
}

function getApprovalStatus(row: MessageTemplate): string {
  const info = parseApprovalJson(row.approvalJson)
  if (info?.data?.respdata?.records?.[0]) {
    return info.data.respdata.records[0].statusDesc || (row.status === 1 ? '已审核' : '未审核')
  }
  return row.status === 1 ? '已审核' : '未审核'
}

function getApprovalStatusType(row: MessageTemplate): '' | 'success' | 'warning' | 'info' | 'danger' {
  const info = parseApprovalJson(row.approvalJson)
  if (info?.data?.respdata?.records?.[0]) {
    const status = info.data.respdata.records[0].status
    if (status === '2') return 'success'  // 已审批
    if (status === '8') return 'danger'   // 已驳回
    return 'warning'  // 待审批
  }
  return row.status === 1 ? 'success' : 'info'
}

function formatJson(jsonStr: string | null): string {
  if (!jsonStr) return ''
  try {
    const obj = JSON.parse(jsonStr)
    return JSON.stringify(obj, null, 2)
  } catch {
    return jsonStr
  }
}

function handleCopyJson(jsonStr: string | null) {
  if (!jsonStr) return
  const textArea = document.createElement('textarea')
  textArea.value = formatJson(jsonStr)
  textArea.style.position = 'fixed'
  textArea.style.left = '-9999px'
  textArea.style.top = '-9999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  try {
    document.execCommand('copy')
    ElMessage.success('JSON已复制到剪贴板')
  } catch {
    ElMessage.warning('复制失败')
  }
  document.body.removeChild(textArea)
}
</script>

<style lang="scss" scoped>
.msg-template-management {
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
    &:nth-child(1) { animation-delay: 0.05s; }
    &:nth-child(2) { animation-delay: 0.12s; }
    &:nth-child(3) { animation-delay: 0.2s; }
  }


  .search-bar {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #ebeef5;
  }

  .search-form {
    flex: 1;
    .el-form-item { margin-bottom: 0; margin-right: 12px; }
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

    .data-table {
      flex: 1;
    }

    .index-text { color: #909399; font-size: 13px; }

    .template-id-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 12px;
      color: #409EFF;
      background: #ECF5FF;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .msg-id-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 11px;
      color: #909399;
    }

    .template-text {
      font-size: 13px;
      color: #303133;
      line-height: 1.5;
    }

    .time-text { font-size: 13px; color: #909399; }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    flex-shrink: 0;
  }

  :deep(.detail-drawer) {
    .el-drawer__header {
      margin-bottom: 0;
      padding: 20px 24px;
      border-bottom: 1px solid #EBEEF5;
      .el-drawer__title { font-weight: 600; font-size: 16px; }
    }
    .el-drawer__body { padding: 24px; overflow-y: auto; }
  }

  .json-section {
    margin-top: 24px;
    border: 1px solid #EBEEF5;
    border-radius: 8px;
    overflow: hidden;

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #F5F7FA;
      border-bottom: 1px solid #EBEEF5;

      .section-title {
        font-weight: 600;
        font-size: 14px;
        color: #303133;
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }

    .json-key-info {
      padding: 12px 16px;
      background: #FAFAFA;
      border-bottom: 1px solid #EBEEF5;

      .json-item {
        display: flex;
        margin-bottom: 6px;

        &:last-child { margin-bottom: 0; }

        .json-label {
          font-weight: 500;
          color: #606266;
          min-width: 80px;
        }

        .json-value {
          color: #303133;
          flex: 1;

          &.error {
            color: #F56C6C;
          }
        }
      }
    }

    .json-textarea {
      :deep(textarea) {
        font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
        font-size: 12px;
        line-height: 1.6;
        border: none;
        border-radius: 0;
      }
    }
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
