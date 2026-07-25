<template>
  <div class="config-management">

    <!-- 数据表格 -->
    <el-card class="table-card animate-item" shadow="never">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="参数名称">
            <el-input v-model="searchForm.configName" placeholder="输入参数名称" clearable :prefix-icon="Search" style="width: 200px" @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item label="参数键名">
            <el-input v-model="searchForm.configKey" placeholder="输入参数键名" clearable style="width: 220px" @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item label="系统内置">
            <el-select v-model="searchForm.configType" placeholder="请选择" clearable style="width: 120px">
              <el-option label="是" value="Y" />
              <el-option label="否" value="N" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="search-actions">
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增参数</el-button>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="filteredData"
        border
        stripe
        highlight-current-row
        row-key="configId"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600' }"
        class="data-table"
      >
        <el-table-column label="序号" width="60" align="center" type="index">
          <template #default="{ $index }">
            <span class="index-text">{{ $index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="configName" label="参数名称" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="name-text">{{ row.configName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="configKey" label="参数键名" min-width="240">
          <template #default="{ row }">
            <span class="key-text">{{ row.configKey }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="configValue" label="参数键值" min-width="140">
          <template #default="{ row }">
            <span class="value-text">{{ row.configValue || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="configType" label="系统内置" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.configType === 'Y' ? 'success' : 'info'" effect="plain" size="small">
              {{ row.configType === 'Y' ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createBy" label="创建者" width="100" align="center">
          <template #default="{ row }">
            <span class="user-text">{{ row.createBy || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" width="170" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="remark" label="备注" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="remark-text">{{ row.remark || '-' }}</span>
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
      :title="isEdit ? '编辑参数' : '新增参数'"
      size="500px"
      direction="rtl"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="right">
        <el-form-item label="参数名称" prop="configName">
          <el-input v-model="formData.configName" placeholder="请输入参数名称" maxlength="100" />
        </el-form-item>

        <el-form-item label="参数键名" prop="configKey">
          <el-input v-model="formData.configKey" placeholder="如：sys.index.skinName" maxlength="100" :disabled="isEdit" />
        </el-form-item>

        <el-form-item label="参数键值" prop="configValue">
          <el-input v-model="formData.configValue" placeholder="请输入参数键值" maxlength="500" />
        </el-form-item>

        <el-form-item label="系统内置" prop="configType">
          <el-radio-group v-model="formData.configType">
            <el-radio value="Y">是</el-radio>
            <el-radio value="N">否</el-radio>
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
import type { FormInstance, FormRules } from 'element-plus'
import {
  Refresh, Search, RefreshLeft, Plus, Delete, Edit
} from '@element-plus/icons-vue'
import { configData } from '@/mock/configData'
import type { Config, ConfigSearchForm } from '@/types/config'

// ── 状态 ──
const loading = ref(false)
const tableData = ref<Config[]>(configData)
const drawerVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const searchForm = reactive<ConfigSearchForm>({
  configName: '',
  configKey: '',
  configType: ''
})

const formData = reactive({
  configId: 0,
  configName: '',
  configKey: '',
  configValue: '',
  configType: 'N',
  remark: ''
})

const formRules: FormRules = {
  configName: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
  configKey: [{ required: true, message: '请输入参数键名', trigger: 'blur' }],
  configValue: [{ required: true, message: '请输入参数键值', trigger: 'blur' }]
}

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// ── 计算属性 ──
const filteredData = computed(() => {
  let data = tableData.value.filter(item => {
    if (searchForm.configName && !item.configName.includes(searchForm.configName)) return false
    if (searchForm.configKey && !item.configKey.includes(searchForm.configKey)) return false
    if (searchForm.configType && item.configType !== searchForm.configType) return false
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
  searchForm.configName = ''
  searchForm.configKey = ''
  searchForm.configType = ''
  pagination.page = 1
}

function handleRefresh() {
  loading.value = true
  setTimeout(() => {
    tableData.value = [...configData]
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

function handleAdd() {
  isEdit.value = false
  formData.configId = 0
  formData.configName = ''
  formData.configKey = ''
  formData.configValue = ''
  formData.configType = 'N'
  formData.remark = ''
  drawerVisible.value = true
}

function handleEdit(row: Config) {
  isEdit.value = true
  formData.configId = row.configId
  formData.configName = row.configName
  formData.configKey = row.configKey
  formData.configValue = row.configValue
  formData.configType = row.configType
  formData.remark = row.remark || ''
  drawerVisible.value = true
}

function handleSubmit() {
  if (!formRef.value) return
  formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
      drawerVisible.value = false
      handleRefresh()
    }
  })
}

function handleDelete(row: Config) {
  ElMessageBox.confirm(
    `确定要删除参数 "${row.configName}" 吗？`,
    '确认删除',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    ElMessage.success('删除成功')
    handleRefresh()
  }).catch(() => {})
}

function resetForm() {
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
.config-management {
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
    .name-text { font-weight: 500; color: #303133; }

    .key-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 12px;
      color: #409EFF;
      background: #ECF5FF;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .value-text { font-weight: 500; color: #606266; }
    .user-text { font-size: 13px; color: #303133; }
    .time-text { font-size: 13px; color: #909399; }
    .remark-text { font-size: 13px; color: #606266; }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    flex-shrink: 0;
  }

  :deep(.el-drawer) {
    .el-drawer__header {
      margin-bottom: 0;
      padding: 20px 24px;
      border-bottom: 1px solid #EBEEF5;
      .el-drawer__title { font-weight: 600; font-size: 16px; }
    }
    .el-drawer__body { padding: 24px; overflow-y: auto; }
  }

  .drawer-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 20px;
    border-top: 1px solid #EBEEF5;
    margin-top: 20px;
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
