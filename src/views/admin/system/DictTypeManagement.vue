<template>
  <div class="dict-type-management">

    <!-- 数据表格 -->
    <el-card class="table-card animate-item" shadow="never">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="类型名称">
            <el-input v-model="searchForm.dictTypeName" placeholder="输入类型名称" clearable :prefix-icon="Search" style="width: 200px" @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item label="类型编码">
            <el-input v-model="searchForm.dictType" placeholder="输入类型编码" clearable style="width: 200px" @keyup.enter="handleSearch" />
          </el-form-item>
        </el-form>
        <div class="search-actions">
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增类型</el-button>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="filteredData"
        border
        stripe
        highlight-current-row
        row-key="dictType"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600' }"
        class="data-table"
      >
        <el-table-column label="序号" width="60" align="center" type="index">
          <template #default="{ $index }">
            <span class="index-text">{{ $index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="dictTypeName" label="类型名称" min-width="180">
          <template #default="{ row }">
            <el-button type="primary" link class="type-name-link" @click="handleViewData(row)">
              {{ row.dictTypeName }}
            </el-button>
          </template>
        </el-table-column>

        <el-table-column prop="dictType" label="类型编码" min-width="220">
          <template #default="{ row }">
            <span class="type-code-text">{{ row.dictType }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="count" label="字典项数量" width="110" align="center">
          <template #default="{ row }">
            <el-tag size="small" effect="plain">{{ row.count }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="90" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1101 ? 'success' : 'info'" effect="light" size="small">
              {{ row.status === 1101 ? '正常' : '停用' }}
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
      :title="isEdit ? '编辑字典类型' : '新增字典类型'"
      size="480px"
      direction="rtl"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90px" label-position="right">
        <el-form-item label="类型编码" prop="dictType">
          <el-input v-model="formData.dictType" placeholder="如：sys_normal_disable" maxlength="100" :disabled="isEdit" />
        </el-form-item>

        <el-form-item label="类型名称" prop="dictTypeName">
          <el-input v-model="formData.dictTypeName" placeholder="请输入类型名称" maxlength="100" />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注" maxlength="500" show-word-limit />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1101">正常</el-radio>
            <el-radio :value="1102">停用</el-radio>
          </el-radio-group>
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
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Refresh, Search, RefreshLeft, Plus, Delete, Edit
} from '@element-plus/icons-vue'
import { getDictTypes } from '@/mock/dictData'
import type { DictType } from '@/types/admin/dictData'

const router = useRouter()

// ── 状态 ──
const loading = ref(false)
const tableData = ref<DictType[]>([])
const drawerVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const searchForm = reactive({
  dictTypeName: '',
  dictType: ''
})

const formData = reactive({
  dictType: '',
  dictTypeName: '',
  remark: '',
  status: 1101
})

const formRules: FormRules = {
  dictType: [{ required: true, message: '请输入类型编码', trigger: 'blur' }],
  dictTypeName: [{ required: true, message: '请输入类型名称', trigger: 'blur' }]
}

// ── 计算属性 ──
const filteredData = computed(() => {
  let data = tableData.value.filter(item => {
    if (searchForm.dictTypeName && !item.dictTypeName.includes(searchForm.dictTypeName)) return false
    if (searchForm.dictType && !item.dictType.includes(searchForm.dictType)) return false
    return true
  })

  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

// ── 方法 ──
function fetchData() {
  loading.value = true
  setTimeout(() => {
    tableData.value = getDictTypes()
    loading.value = false
  }, 300)
}

function handleSearch() {
  // 搜索通过 computed 属性自动处理
}

function handleReset() {
  searchForm.dictTypeName = ''
  searchForm.dictType = ''
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
  fetchData()
}

function handleViewData(row: DictType) {
  router.push({ path: '/admin/dict/data', query: { dictType: row.dictType, dictTypeName: row.dictTypeName } })
}

function handleAdd() {
  isEdit.value = false
  formData.dictType = ''
  formData.dictTypeName = ''
  formData.remark = ''
  formData.status = 1101
  drawerVisible.value = true
}

function handleEdit(row: DictType) {
  isEdit.value = true
  formData.dictType = row.dictType
  formData.dictTypeName = row.dictTypeName
  formData.remark = row.remark
  formData.status = row.status
  drawerVisible.value = true
}

function handleSubmit() {
  if (!formRef.value) return
  formRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
      drawerVisible.value = false
      fetchData()
    }
  })
}

function handleDelete(row: DictType) {
  ElMessageBox.confirm(
    `确定要删除字典类型 "${row.dictTypeName}" 吗？该类型下的所有字典数据也将被删除。`,
    '确认删除',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    ElMessage.success('删除成功')
    fetchData()
  }).catch(() => {})
}

function resetForm() {
  formRef.value?.resetFields()
}

// ── 初始化 ──
fetchData()
</script>

<style lang="scss" scoped>
.dict-type-management {
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

    .pagination-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
      flex-shrink: 0;
    }

    .index-text { color: #909399; font-size: 13px; }

    .type-name-link {
      font-weight: 600;
      font-size: 14px;
      &:hover { text-decoration: underline; }
    }

    .type-code-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 12px;
      color: #409EFF;
      background: #ECF5FF;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .time-text { font-size: 13px; color: #909399; }
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
