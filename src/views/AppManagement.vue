<template>
  <div class="app-management">
    <!-- 页面头部 -->
    <div class="page-header animate-item">
      <div class="header-left">
        <h1><span class="title-bar"></span>App管理</h1>
        <span class="page-desc">管理系统应用信息，维护App版本与发布</span>
      </div>
      <div class="header-right">
        <el-button :icon="Refresh" @click="handleRefresh" :loading="loading">刷新</el-button>
      </div>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card animate-item" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="App名称">
          <el-input v-model="searchForm.appName" placeholder="输入App名称" clearable :prefix-icon="Search" style="width: 200px" @keyup.enter="handleSearch" />
        </el-form-item>
        <el-form-item label="平台">
          <el-select v-model="searchForm.platform" placeholder="请选择平台" clearable style="width: 140px">
            <el-option v-for="item in platformOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 120px">
            <el-option label="启用" :value="1101" />
            <el-option label="停用" :value="1001" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="RefreshLeft" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 工具栏 -->
    <div class="toolbar animate-item">
      <div class="toolbar-left">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增App</el-button>
        <el-button type="danger" :icon="Delete" :disabled="!selectedIds.length" @click="handleBatchDelete">批量删除</el-button>
      </div>
      <div class="toolbar-right">
        <span class="total-count">共 {{ filteredData.length }} 条数据</span>
      </div>
    </div>

    <!-- 数据表格 -->
    <el-card class="table-card animate-item" shadow="never">
      <el-table
        v-loading="loading"
        :data="filteredData"
        border
        stripe
        highlight-current-row
        row-key="appId"
        @selection-change="handleSelectionChange"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600' }"
      >
        <el-table-column type="selection" width="50" align="center" />

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
            <el-radio :value="1101">
              <el-icon color="#67C23A"><SuccessFilled /></el-icon> 启用
            </el-radio>
            <el-radio :value="1001">
              <el-icon color="#909399"><CircleCloseFilled /></el-icon> 停用
            </el-radio>
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
  Refresh, Search, RefreshLeft, Plus, Delete, Edit, Document,
  SuccessFilled, CircleCloseFilled
} from '@element-plus/icons-vue'
import { appInfoData } from '../mock/appData'
import type { AppInfo } from '../types/appInfo'
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
  return tableData.value.filter(item => {
    if (searchForm.appName && !item.appName.includes(searchForm.appName)) return false
    if (searchForm.platform !== '' && item.platform !== searchForm.platform) return false
    if (searchForm.status !== '' && item.status !== searchForm.status) return false
    return true
  })
})

// ── 方法 ──
function handleSearch() {
  // 搜索通过 computed 属性自动处理
}

function handleReset() {
  searchForm.appName = ''
  searchForm.platform = ''
  searchForm.status = ''
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
  router.push({ path: '/app/log', query: { appId: row.appId, appName: row.appName } })
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
      padding: 20px 24px 8px;
    }

    .el-form-item {
      margin-bottom: 12px;
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

    :deep(.el-card__body) {
      padding: 20px;
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
