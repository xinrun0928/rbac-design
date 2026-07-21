<template>
  <div class="attachment-management">
    <!-- 页面头部 -->
    <div class="page-header animate-item">
      <div class="header-left">
        <h1><span class="title-bar"></span>附件管理</h1>
        <span class="page-desc">管理系统附件，查看文件上传记录</span>
      </div>
      <div class="header-right">
        <el-button :icon="Refresh" @click="handleRefresh" :loading="loading">刷新</el-button>
      </div>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card animate-item" shadow="never">
      <div class="search-bar">
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="文件名称">
            <el-input v-model="searchForm.fileName" placeholder="输入文件名称" clearable :prefix-icon="Search" style="width: 200px" @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item label="文件类型">
            <el-select v-model="searchForm.fileExt" placeholder="请选择类型" clearable style="width: 120px">
              <el-option v-for="item in fileExtOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="存储类型">
            <el-select v-model="searchForm.storageType" placeholder="请选择存储" clearable style="width: 140px">
              <el-option v-for="item in storageTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button :icon="RefreshLeft" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card animate-item" shadow="never">
      <el-table
        v-loading="loading"
        :data="filteredData"
        border
        stripe
        highlight-current-row
        row-key="attachmentId"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600' }"
      >
        <el-table-column label="序号" width="60" align="center" type="index">
          <template #default="{ $index }">
            <span class="index-text">{{ $index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="fileName" label="文件名称" min-width="220" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="file-name-cell">
              <el-icon class="file-icon" :style="{ color: getFileIconColor(row.fileExt) }">
                <component :is="getFileIcon(row.fileExt)" />
              </el-icon>
              <span class="file-name">{{ row.fileName }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="fileExt" label="类型" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="getFileExtTagType(row.fileExt)" effect="plain" size="small">
              {{ row.fileExt.replace('.', '').toUpperCase() }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="fileSize" label="文件大小" width="100" align="center">
          <template #default="{ row }">
            <span class="size-text">{{ formatFileSize(row.fileSize) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="storageType" label="存储类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag effect="plain" size="small">
              {{ getStorageLabel(row.storageType) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="storagePath" label="存储路径" min-width="260" show-overflow-tooltip>
          <template #default="{ row }">
            <div class="storage-path-cell" @click="handleCopyPath(row.storagePath)">
              <span class="path-text">{{ row.storagePath }}</span>
              <el-icon class="copy-icon"><CopyDocument /></el-icon>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="mimeType" label="MIME类型" width="140" align="center">
          <template #default="{ row }">
            <span class="mime-text">{{ row.mimeType }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="creater" label="上传人" width="100" align="center">
          <template #default="{ row }">
            <span class="user-text">{{ row.creater || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="上传时间" width="170" align="center">
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
      title="附件详情"
      size="500px"
      direction="rtl"
      class="detail-drawer"
    >
      <template v-if="currentAttachment">
        <el-descriptions :column="1" border class="detail-descriptions">
          <el-descriptions-item label="附件ID">{{ currentAttachment.attachmentId }}</el-descriptions-item>
          <el-descriptions-item label="文件名称">{{ currentAttachment.fileName }}</el-descriptions-item>
          <el-descriptions-item label="文件类型">
            <el-tag :type="getFileExtTagType(currentAttachment.fileExt)" effect="plain" size="small">
              {{ currentAttachment.fileExt.replace('.', '').toUpperCase() }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="文件大小">{{ formatFileSize(currentAttachment.fileSize) }}</el-descriptions-item>
          <el-descriptions-item label="MIME类型">{{ currentAttachment.mimeType }}</el-descriptions-item>
          <el-descriptions-item label="存储类型">{{ getStorageLabel(currentAttachment.storageType) }}</el-descriptions-item>
          <el-descriptions-item label="存储路径">
            <span class="path-text">{{ currentAttachment.storagePath }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="文件MD5">
            <span class="md5-text">{{ currentAttachment.fileMd5 }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="上传人">{{ currentAttachment.creater || '-' }}</el-descriptions-item>
          <el-descriptions-item label="上传时间">{{ currentAttachment.createTime }}</el-descriptions-item>
          <el-descriptions-item label="子系统ID">{{ currentAttachment.subsysId }}</el-descriptions-item>
          <el-descriptions-item label="用户ID">{{ currentAttachment.userId || '-' }}</el-descriptions-item>
          <el-descriptions-item label="组织ID">{{ currentAttachment.orgId || '-' }}</el-descriptions-item>
        </el-descriptions>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Refresh, Search, RefreshLeft, View, Delete, CopyDocument,
  Document, Picture, VideoPlay, Headset, Folder
} from '@element-plus/icons-vue'
import { attachmentData, storageTypeOptions, fileExtOptions } from '../mock/attachmentData'
import type { Attachment, AttachmentSearchForm } from '../types/attachment'

// ── 状态 ──
const loading = ref(false)
const tableData = ref<Attachment[]>(attachmentData)
const detailDrawerVisible = ref(false)
const currentAttachment = ref<Attachment | null>(null)

const searchForm = reactive<AttachmentSearchForm>({
  fileName: '',
  fileExt: '',
  storageType: '',
  subsysId: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// ── 计算属性 ──
const filteredData = computed(() => {
  let data = tableData.value.filter(item => item.deleted === 0)

  if (searchForm.fileName) {
    data = data.filter(item => item.fileName.toLowerCase().includes(searchForm.fileName.toLowerCase()))
  }
  if (searchForm.fileExt) {
    data = data.filter(item => item.fileExt === searchForm.fileExt)
  }
  if (searchForm.storageType) {
    data = data.filter(item => item.storageType === searchForm.storageType)
  }

  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

// ── 方法 ──
function handleSearch() {
  pagination.page = 1
}

function handleReset() {
  searchForm.fileName = ''
  searchForm.fileExt = ''
  searchForm.storageType = ''
  pagination.page = 1
}

function handleRefresh() {
  loading.value = true
  setTimeout(() => {
    tableData.value = [...attachmentData]
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

function handleViewDetail(row: Attachment) {
  currentAttachment.value = row
  detailDrawerVisible.value = true
}

function handleDelete(row: Attachment) {
  ElMessageBox.confirm(
    `确定要删除附件 "${row.fileName}" 吗？`,
    '确认删除',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {})
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function getFileIcon(ext: string) {
  const icons: Record<string, any> = {
    '.jpg': Picture,
    '.jpeg': Picture,
    '.png': Picture,
    '.gif': Picture,
    '.pdf': Document,
    '.doc': Document,
    '.docx': Document,
    '.xls': Document,
    '.xlsx': Document,
    '.mp4': VideoPlay,
    '.mp3': Headset
  }
  return icons[ext] || Folder
}

function getFileIconColor(ext: string): string {
  const colors: Record<string, string> = {
    '.jpg': '#67C23A',
    '.jpeg': '#67C23A',
    '.png': '#409EFF',
    '.gif': '#E6A23C',
    '.pdf': '#F56C6C',
    '.doc': '#409EFF',
    '.docx': '#409EFF',
    '.xls': '#67C23A',
    '.xlsx': '#67C23A',
    '.mp4': '#9B59B6',
    '.mp3': '#E6A23C'
  }
  return colors[ext] || '#909399'
}

function getFileExtTagType(ext: string): '' | 'success' | 'warning' | 'info' | 'danger' {
  const types: Record<string, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    '.jpg': 'success',
    '.jpeg': 'success',
    '.png': '',
    '.gif': 'warning',
    '.pdf': 'danger',
    '.doc': '',
    '.docx': '',
    '.xls': 'success',
    '.xlsx': 'success'
  }
  return types[ext] || 'info'
}

function getStorageLabel(type: string): string {
  const option = storageTypeOptions.find(o => o.value === type)
  return option?.label || type
}

function handleCopyPath(path: string) {
  const textArea = document.createElement('textarea')
  textArea.value = path
  textArea.style.position = 'fixed'
  textArea.style.left = '-9999px'
  textArea.style.top = '-9999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  try {
    document.execCommand('copy')
    ElMessage.success('存储路径已复制到剪贴板')
  } catch {
    ElMessage.warning('复制失败，请手动复制')
  }
  document.body.removeChild(textArea)
}
</script>

<style lang="scss" scoped>
.attachment-management {
  padding: 24px;
  background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
  min-height: 100vh;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;

  .animate-item {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;
    &:nth-child(1) { animation-delay: 0.05s; }
    &:nth-child(2) { animation-delay: 0.12s; }
    &:nth-child(3) { animation-delay: 0.2s; }
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    padding: 24px 28px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

    .header-left h1 {
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
      background: linear-gradient(180deg, #409eff 0%, #66b1ff 100%);
      border-radius: 2px;
    }

    .page-desc {
      font-size: 13px;
      color: #909399;
      padding-left: 14px;
    }
  }

  .search-card {
    margin-bottom: 16px;
    border-radius: 12px;
    border: none;

    :deep(.el-card__body) {
      padding: 20px 24px 12px;
    }

    .search-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }

    .search-form {
      flex: 1;
      .el-form-item { margin-bottom: 8px; margin-right: 12px; }
    }
  }

  .table-card {
    border-radius: 12px;
    border: none;

    :deep(.el-card__body) {
      padding: 20px;
    }

    .index-text { color: #909399; font-size: 13px; }

    .file-name-cell {
      display: flex;
      align-items: center;
      gap: 8px;

      .file-icon { font-size: 18px; }
      .file-name { font-weight: 500; color: #303133; }
    }

    .size-text { font-size: 13px; color: #606266; }
    .mime-text { font-size: 12px; color: #909399; }

    .storage-path-cell {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: background-color 0.2s;

      &:hover {
        background: #F5F7FA;

        .copy-icon {
          opacity: 1;
        }
      }

      .path-text {
        font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
        font-size: 12px;
        color: #606266;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .copy-icon {
        font-size: 14px;
        color: #409EFF;
        opacity: 0;
        transition: opacity 0.2s;
        flex-shrink: 0;
      }
    }
    .user-text { font-size: 13px; color: #303133; }
    .time-text { font-size: 13px; color: #909399; }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid #EBEEF5;
  }

  :deep(.detail-drawer) {
    .el-drawer__header {
      margin-bottom: 0;
      padding: 20px 24px;
      border-bottom: 1px solid #EBEEF5;

      .el-drawer__title {
        font-weight: 600;
        font-size: 16px;
      }
    }

    .el-drawer__body {
      padding: 24px;
      overflow-y: auto;
    }
  }

  .detail-descriptions {
    .path-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 12px;
      color: #606266;
      word-break: break-all;
    }

    .md5-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 11px;
      color: #909399;
    }
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
