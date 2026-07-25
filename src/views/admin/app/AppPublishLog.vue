<template>
  <div class="app-publish-log">
    <!-- 数据表格 -->
    <el-card class="table-card animate-item" shadow="never">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <div class="search-content">
          <el-form :model="searchForm" inline>
            <el-form-item label="版本号">
              <el-input v-model="searchForm.versionCode" placeholder="输入版本号" clearable :prefix-icon="Search" style="width: 160px" />
            </el-form-item>
            <el-form-item label="更新类型">
              <el-select v-model="searchForm.updateType" placeholder="请选择" clearable style="width: 140px">
                <el-option label="WGT热更" :value="1" />
                <el-option label="APK整包" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="发布状态">
              <el-select v-model="searchForm.publishStatus" placeholder="请选择" clearable style="width: 120px">
                <el-option label="待发布" :value="1" />
                <el-option label="已发布" :value="2" />
                <el-option label="已撤销" :value="3" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
              <el-button :icon="RefreshLeft" @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增发布</el-button>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="filteredData"
        border
        stripe
        highlight-current-row
        row-key="publishId"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600' }"
        class="data-table"
      >
        <el-table-column label="序号" width="60" align="center" type="index">
          <template #default="{ $index }">
            <span class="index-text">{{ $index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="versionCode" label="版本号" width="120" align="center">
          <template #default="{ row }">
            <el-tag type="primary" effect="plain" size="small">v{{ row.versionCode }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="updateType" label="更新类型" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.updateType === 1 ? 'warning' : 'success'" effect="plain" size="small">
              {{ row.updateType === 1 ? 'WGT热更' : 'APK整包' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="isForce" label="强制更新" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.isForce === 1 ? 'danger' : 'info'" effect="plain" size="small">
              {{ row.isForce === 1 ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="fileSize" label="包大小" width="100" align="center">
          <template #default="{ row }">
            <span class="size-text">{{ formatFileSize(row.fileSize) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="releaseNotes" label="更新日志" min-width="200">
          <template #default="{ row }">
            <el-tooltip :content="row.releaseNotes" placement="top" :show-after="300">
              <span class="notes-text">{{ row.releaseNotes || '-' }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column prop="publishStatus" label="发布状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getPublishStatusType(row.publishStatus)" effect="light" size="small" round>
              {{ getPublishStatusLabel(row.publishStatus) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="publisher" label="发布人" width="90" align="center">
          <template #default="{ row }">
            <span class="publisher-text">{{ row.publisher }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="publishTime" label="发布时间" width="170" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.publishTime || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="warning" link :icon="Upload" @click="handlePublish(row)" v-if="row.publishStatus === 1">发布</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="isEdit ? '编辑发布记录' : '新增发布记录'"
      size="550px"
      direction="rtl"
      :before-close="handleDrawerClose"
      class="publish-drawer"
    >
      <el-form ref="formRef" :model="formData" label-width="100px" label-position="right">
        <el-form-item label="版本号" prop="versionCode" :rules="[{ required: true, message: '请输入版本号', trigger: 'blur' }]">
          <el-input v-model="formData.versionCode" placeholder="如：2.1.0" />
        </el-form-item>

        <el-form-item label="版本名" prop="versionName" :rules="[{ required: true, message: '请输入版本名', trigger: 'blur' }]">
          <el-input v-model="formData.versionName" placeholder="如：2.1.0" />
        </el-form-item>

        <el-form-item label="更新类型" prop="updateType" :rules="[{ required: true, message: '请选择更新类型', trigger: 'change' }]">
          <el-radio-group v-model="formData.updateType">
            <el-radio :value="1">WGT热更</el-radio>
            <el-radio :value="2">APK整包</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="formData.updateType === 1" label="WGT版本" prop="wgtVersion">
          <el-input v-model="formData.wgtVersion" placeholder="WGT资源版本号" />
        </el-form-item>

        <el-form-item label="下载地址" prop="downloadUrl">
          <el-input v-model="formData.downloadUrl" placeholder="下载地址" />
        </el-form-item>

        <el-form-item label="是否强制" prop="isForce">
          <el-radio-group v-model="formData.isForce">
            <el-radio :value="0">否</el-radio>
            <el-radio :value="1">是</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="包大小(字节)" prop="fileSize">
          <el-input-number v-model="formData.fileSize" :min="0" style="width: 100%" />
        </el-form-item>

        <el-form-item label="文件MD5" prop="fileMd5">
          <el-input v-model="formData.fileMd5" placeholder="文件MD5校验值" />
        </el-form-item>

        <el-form-item label="发布人" prop="publisher">
          <el-input v-model="formData.publisher" placeholder="请输入发布人" />
        </el-form-item>

        <el-form-item label="发布原因" prop="publishReason">
          <el-input v-model="formData.publishReason" placeholder="内部备注" />
        </el-form-item>

        <el-form-item label="更新日志" prop="releaseNotes">
          <el-input v-model="formData.releaseNotes" type="textarea" :rows="4" placeholder="对外更新日志（展示给用户）" maxlength="500" show-word-limit />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">{{ isEdit ? '保存修改' : '确认创建' }}</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import {
  Refresh, Search, RefreshLeft, Plus, Delete, Edit, Back, Upload
} from '@element-plus/icons-vue'
import { appPublishLogData } from '@/mock/appData'
import type { AppPublishLog } from '@/types/admin/appInfo'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const appName = ref((route.query.appName as string) || 'App')
const appId = ref(Number(route.query.appId) || 0)

// ── 状态 ──
const loading = ref(false)
const tableData = ref<AppPublishLog[]>([])
const drawerVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const searchForm = reactive({
  versionCode: '',
  updateType: '' as number | '',
  publishStatus: '' as number | ''
})

const formData = reactive({
  publishId: 0,
  versionCode: '',
  versionName: '',
  updateType: 2,
  wgtVersion: '',
  downloadUrl: '',
  releaseNotes: '',
  isForce: 0,
  fileSize: 0,
  fileMd5: '',
  publisher: '',
  publishReason: ''
})

// ── 计算属性 ──
const filteredData = computed(() => {
  return tableData.value.filter(item => {
    if (searchForm.versionCode && !item.versionCode.includes(searchForm.versionCode)) return false
    if (searchForm.updateType !== '' && item.updateType !== searchForm.updateType) return false
    if (searchForm.publishStatus !== '' && item.publishStatus !== searchForm.publishStatus) return false
    return true
  })
})

// ── 方法 ──
function fetchData() {
  loading.value = true
  setTimeout(() => {
    tableData.value = appPublishLogData.filter(item => item.appId === appId.value)
    loading.value = false
  }, 300)
}

function goBack() {
  router.push('/admin/app')
}

function handleSearch() {
  // 搜索通过 computed 属性自动处理
}

function handleReset() {
  searchForm.versionCode = ''
  searchForm.updateType = ''
  searchForm.publishStatus = ''
}

function handleRefresh() {
  fetchData()
}

function handleAdd() {
  isEdit.value = false
  formData.publishId = 0
  formData.versionCode = ''
  formData.versionName = ''
  formData.updateType = 2
  formData.wgtVersion = ''
  formData.downloadUrl = ''
  formData.releaseNotes = ''
  formData.isForce = 0
  formData.fileSize = 0
  formData.fileMd5 = ''
  formData.publisher = ''
  formData.publishReason = ''
  drawerVisible.value = true
}

function handleEdit(row: AppPublishLog) {
  isEdit.value = true
  formData.publishId = row.publishId
  formData.versionCode = row.versionCode
  formData.versionName = row.versionName
  formData.updateType = row.updateType
  formData.wgtVersion = row.wgtVersion
  formData.downloadUrl = row.downloadUrl
  formData.releaseNotes = row.releaseNotes
  formData.isForce = row.isForce
  formData.fileSize = row.fileSize
  formData.fileMd5 = row.fileMd5
  formData.publisher = row.publisher
  formData.publishReason = row.publishReason
  drawerVisible.value = true
}

function handleSubmit() {
  if (!formRef.value) return
  formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
      drawerVisible.value = false
    }
  })
}

function handlePublish(row: AppPublishLog) {
  ElMessageBox.confirm(
    `确定要发布版本 v${row.versionCode} 吗？`,
    '确认发布',
    { confirmButtonText: '确认发布', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    row.publishStatus = 2
    row.publishTime = new Date().toLocaleString()
    ElMessage.success('发布成功')
  }).catch(() => {})
}

function handleDelete(row: AppPublishLog) {
  ElMessageBox.confirm(
    `确定要删除版本 v${row.versionCode} 的发布记录吗？`,
    '确认删除',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    tableData.value = tableData.value.filter(item => item.publishId !== row.publishId)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

function handleDrawerClose(done: () => void) {
  formRef.value?.resetFields()
  done()
}

function getPublishStatusLabel(status: number): string {
  const labels: Record<number, string> = { 1: '待发布', 2: '已发布', 3: '已撤销' }
  return labels[status] || '未知'
}

function getPublishStatusType(status: number): '' | 'success' | 'warning' | 'info' | 'danger' {
  const types: Record<number, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    1: 'warning', 2: 'success', 3: 'info'
  }
  return types[status] || 'info'
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '-'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.app-publish-log {
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
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #ebeef5;

    .search-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .el-form {
        flex: 1;
      }

      .el-form-item {
        margin-bottom: 0;
      }
    }
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 0 4px;

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .total-count {
      font-size: 13px;
      color: #909399;
      padding: 6px 14px;
      background: #f0f2f5;
      border-radius: 6px;
    }
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

    .id-text { color: #909399; font-size: 13px; }
    .size-text { font-size: 13px; color: #606266; }
    .notes-text {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 200px;
      font-size: 13px;
      color: #606266;
    }
    .publisher-text { font-size: 13px; color: #606266; }
    .time-text { font-size: 13px; color: #909399; }
  }

  :deep(.publish-drawer) {
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

    .drawer-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid #EBEEF5;
    }
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
