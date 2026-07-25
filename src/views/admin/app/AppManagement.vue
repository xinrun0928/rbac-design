<template>
  <div class="app-management">

    <!-- 数据表格 -->
    <el-card class="table-card animate-item" shadow="never">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="App名称">
            <el-input v-model="searchForm.appName" placeholder="输入App名称" clearable :prefix-icon="Search" style="width: 180px" @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item label="平台">
            <el-select v-model="searchForm.platform" placeholder="请选择平台" clearable style="width: 180px">
              <el-option v-for="item in platformOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 180px">
              <el-option label="启用" :value="1101" />
              <el-option label="停用" :value="1001" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="search-actions">
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增App</el-button>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="filteredData"
        border
        stripe
        highlight-current-row
        row-key="appId"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600' }"
        class="data-table"
      >
        <el-table-column label="序号" width="60" align="center" type="index">
          <template #default="{ $index }">
            <span class="index-text">{{ $index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="appName" label="App名称" min-width="150">
          <template #default="{ row }">
            <el-button type="primary" link class="name-link" @click="handleViewLog(row)">
              {{ row.appName }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column prop="appCode" label="App编码" width="160">
          <template #default="{ row }">
            <span class="code-text">{{ row.appCode }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="platform" label="平台" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getPlatformTagType(row.platform)" effect="plain" size="small">
              {{ getPlatformLabel(row.platform) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="bundleId" label="BundleId/包名" min-width="200">
          <template #default="{ row }">
            <span class="bundle-text">{{ row.bundleId || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="minVersionCode" label="最低版本" width="100" align="center">
          <template #default="{ row }">
            <span class="version-text">{{ row.minVersionCode }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1101 ? 'success' : 'info'" effect="light" size="small" round>
              {{ row.status === 1101 ? '启用' : '停用' }}
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
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
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

    <!-- 新增/编辑抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="isEdit ? '编辑App' : '新增App'"
      size="500px"
      direction="rtl"
      :before-close="handleDrawerClose"
      class="app-drawer"
    >
      <el-form ref="formRef" :model="formData" label-width="110px" label-position="right">
        <el-form-item label="App编码" prop="appCode" :rules="[{ required: true, message: '请输入App编码', trigger: 'blur' }]">
          <el-input v-model="formData.appCode" placeholder="如：__UNI__1818E59" :disabled="isEdit" />
        </el-form-item>

        <el-form-item label="App名称" prop="appName" :rules="[{ required: true, message: '请输入App名称', trigger: 'blur' }]">
          <el-input v-model="formData.appName" placeholder="请输入App名称" maxlength="100" show-word-limit />
        </el-form-item>

        <el-form-item label="平台" prop="platform" :rules="[{ required: true, message: '请选择平台', trigger: 'change' }]">
          <el-select v-model="formData.platform" placeholder="请选择平台" style="width: 100%">
            <el-option v-for="item in platformOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="BundleId" prop="bundleId">
          <el-input v-model="formData.bundleId" placeholder="iOS的BundleId / Android的包名" />
        </el-form-item>

        <el-form-item label="最低版本" prop="minVersionCode">
          <el-input v-model="formData.minVersionCode" placeholder="如：1.0.0" />
        </el-form-item>

        <el-form-item label="下载地址" prop="latestApkUrl">
          <el-input v-model="formData.latestApkUrl" placeholder="最新APK整包下载地址" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1101">启用</el-radio>
            <el-radio :value="1001">停用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注" maxlength="500" show-word-limit />
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
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import {
  Refresh, Search, RefreshLeft, Plus, Delete, Edit, Document
} from '@element-plus/icons-vue'
import { appInfoData } from '@/mock/admin/appData'
import type { AppInfo } from '@/types/admin/appInfo'
import { useRouter } from 'vue-router'

const router = useRouter()

// 平台选项
const platformOptions = [
  { value: 1, label: 'iOS' },
  { value: 2, label: 'Android' },
  { value: 3, label: 'Windows' },
  { value: 4, label: 'Mac' },
  { value: 5, label: 'Linux' }
]

// ── 状态 ──
const loading = ref(false)
const tableData = ref<AppInfo[]>(appInfoData)
const selectedIds = ref<number[]>([])
const drawerVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const searchForm = reactive({
  appName: '',
  platform: '' as number | '',
  status: '' as number | ''
})

const formData = reactive({
  appId: 0,
  appCode: '',
  appName: '',
  platform: 2,
  bundleId: '',
  minVersionCode: '1.0.0',
  latestApkUrl: '',
  status: 1101,
  remark: ''
})

// ── 计算属性 ──
const filteredData = computed(() => {
  let data = tableData.value.filter(item => {
    if (searchForm.appName && !item.appName.includes(searchForm.appName)) return false
    if (searchForm.platform !== '' && item.platform !== searchForm.platform) return false
    if (searchForm.status !== '' && item.status !== searchForm.status) return false
    return true
  })

  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

// ── 方法 ──
function handleSearch() {
  pagination.page = 1
}

function handleReset() {
  searchForm.appName = ''
  searchForm.platform = ''
  searchForm.status = ''
  pagination.page = 1
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
}

function handlePageChange(page: number) {
  pagination.page = page
}

function handleRefresh() {
  tableData.value = [...appInfoData]
  handleReset()
}

function handleSelectionChange(rows: AppInfo[]) {
  selectedIds.value = rows.map(r => r.appId)
}

function handleAdd() {
  isEdit.value = false
  formData.appId = 0
  formData.appCode = ''
  formData.appName = ''
  formData.platform = 2
  formData.bundleId = ''
  formData.minVersionCode = '1.0.0'
  formData.latestApkUrl = ''
  formData.status = 1101
  formData.remark = ''
  drawerVisible.value = true
}

function handleEdit(row: AppInfo) {
  isEdit.value = true
  formData.appId = row.appId
  formData.appCode = row.appCode
  formData.appName = row.appName
  formData.platform = row.platform
  formData.bundleId = row.bundleId
  formData.minVersionCode = row.minVersionCode
  formData.latestApkUrl = row.latestApkUrl
  formData.status = row.status
  formData.remark = row.remark
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

function handleDelete(row: AppInfo) {
  ElMessageBox.confirm(
    `确定要删除App "${row.appName}" 吗？`,
    '确认删除',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    tableData.value = tableData.value.filter(item => item.appId !== row.appId)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

function handleBatchDelete() {
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedIds.value.length} 条数据吗？`,
    '批量删除确认',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    tableData.value = tableData.value.filter(item => !selectedIds.value.includes(item.appId))
    selectedIds.value = []
    ElMessage.success('批量删除成功')
  }).catch(() => {})
}

function handleViewLog(row: AppInfo) {
  router.push({ path: '/admin/app/log', query: { appId: row.appId, appName: row.appName } })
}

function handleDrawerClose(done: () => void) {
  formRef.value?.resetFields()
  done()
}

function getPlatformLabel(platform: number): string {
  const labels: Record<number, string> = { 1: 'iOS', 2: 'Android', 3: 'Windows', 4: 'Mac', 5: 'Linux' }
  return labels[platform] || '未知'
}

function getPlatformTagType(platform: number): '' | 'success' | 'warning' | 'info' | 'danger' {
  const types: Record<number, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    1: '', 2: 'success', 3: 'info', 4: 'warning', 5: 'danger'
  }
  return types[platform] || 'info'
}
</script>

<style lang="scss" scoped>
.app-management {
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

  .search-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
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
    .name-link {
      font-weight: 500;
      color: #409EFF;
      &:hover {
        text-decoration: underline;
      }
    }
    .code-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      color: #409EFF;
      font-size: 12px;
      background: #ECF5FF;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .bundle-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 12px;
      color: #606266;
    }
    .version-text { color: #606266; }
    .time-text { font-size: 13px; color: #909399; }

    .pagination-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
      flex-shrink: 0;
    }
  }

  :deep(.app-drawer) {
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
