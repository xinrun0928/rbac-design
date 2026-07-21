<template>
  <div class="dict-data-management">
    <!-- 页面头部 -->
    <div class="page-header animate-item">
      <div class="header-left">
        <h1>
          <span class="title-bar"></span>
          <el-button link @click="goBack" class="back-btn">
            <el-icon><ArrowLeft /></el-icon>
          </el-button>
          {{ dictTypeName }}
        </h1>
        <span class="page-desc">字典类型编码：{{ dictType }}</span>
      </div>
      <div class="header-right">
        <el-button :icon="Refresh" @click="handleRefresh" :loading="loading">刷新</el-button>
      </div>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card animate-item" shadow="never">
      <div class="search-bar">
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="字典标签">
            <el-input v-model="searchForm.dictLabel" placeholder="输入字典标签" clearable :prefix-icon="Search" style="width: 180px" @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item label="字典编码">
            <el-input v-model="searchForm.dictCode" placeholder="输入字典编码" clearable style="width: 180px" @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 120px">
              <el-option label="正常" :value="1101" />
              <el-option label="停用" :value="1102" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button :icon="RefreshLeft" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="search-actions">
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增字典项</el-button>
        </div>
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
        row-key="dictId"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600' }"
      >
        <el-table-column label="序号" width="60" align="center" type="index">
          <template #default="{ $index }">
            <span class="index-text">{{ $index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="dictLabel" label="字典标签" min-width="140">
          <template #default="{ row }">
            <span class="label-text">{{ row.dictLabel }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="dictValue" label="字典值" width="100" align="center">
          <template #default="{ row }">
            <span class="value-text">{{ row.dictValue }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="dictCode" label="字典编码" min-width="200">
          <template #default="{ row }">
            <span class="code-text">{{ row.dictCode }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="displayOrder" label="排序" width="80" align="center">
          <template #default="{ row }">
            <span class="order-text">{{ row.displayOrder }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="isDefault" label="默认" width="70" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.isDefault === 1" type="success" effect="plain" size="small">是</el-tag>
            <span v-else class="no-text">否</span>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1101 ? 'success' : 'info'" effect="light" size="small">
              {{ row.status === 1101 ? '正常' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip>
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
    </el-card>

    <!-- 新增/编辑抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="isEdit ? '编辑字典项' : '新增字典项'"
      size="500px"
      direction="rtl"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90px" label-position="right">
        <el-form-item label="字典标签" prop="dictLabel">
          <el-input v-model="formData.dictLabel" placeholder="请输入字典标签" maxlength="100" />
        </el-form-item>

        <el-form-item label="字典值" prop="dictValue">
          <el-input v-model="formData.dictValue" placeholder="请输入字典值" maxlength="255" />
        </el-form-item>

        <el-form-item label="字典编码" prop="dictCode">
          <el-input v-model="formData.dictCode" placeholder="请输入字典编码（唯一）" maxlength="100" :disabled="isEdit" />
        </el-form-item>

        <el-form-item label="排序" prop="displayOrder">
          <el-input-number v-model="formData.displayOrder" :min="0" :max="9999" style="width: 200px" />
          <span class="form-tip-inline">数值越小越靠前</span>
        </el-form-item>

        <el-form-item label="样式" prop="dictClass">
          <el-input v-model="formData.dictClass" placeholder="CSS类名（用于自定义颜色）" maxlength="100" />
        </el-form-item>

        <el-form-item label="是否默认" prop="isDefault">
          <el-radio-group v-model="formData.isDefault">
            <el-radio :value="1">是</el-radio>
            <el-radio :value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1101">正常</el-radio>
            <el-radio :value="1102">停用</el-radio>
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
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Refresh, Search, RefreshLeft, Plus, Delete, Edit, ArrowLeft
} from '@element-plus/icons-vue'
import { dictDataList } from '../mock/dictData'
import type { DictData, DictDataSearchForm } from '../types/dictData'

const router = useRouter()
const route = useRoute()

// ── 路由参数 ──
const dictType = computed(() => route.query.dictType as string || '')
const dictTypeName = computed(() => route.query.dictTypeName as string || '')

// ── 状态 ──
const loading = ref(false)
const tableData = ref<DictData[]>([])
const drawerVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const searchForm = reactive<DictDataSearchForm>({
  dictLabel: '',
  dictCode: '',
  status: ''
})

const formData = reactive({
  dictId: 0,
  dictLabel: '',
  dictValue: '',
  dictCode: '',
  displayOrder: 0,
  dictClass: '',
  isDefault: 0,
  status: 1101,
  remark: ''
})

const formRules: FormRules = {
  dictLabel: [{ required: true, message: '请输入字典标签', trigger: 'blur' }],
  dictValue: [{ required: true, message: '请输入字典值', trigger: 'blur' }],
  dictCode: [{ required: true, message: '请输入字典编码', trigger: 'blur' }]
}

// ── 计算属性 ──
const filteredData = computed(() => {
  return tableData.value.filter(item => {
    if (searchForm.dictLabel && !item.dictLabel.includes(searchForm.dictLabel)) return false
    if (searchForm.dictCode && !item.dictCode.includes(searchForm.dictCode)) return false
    if (searchForm.status !== '' && item.status !== searchForm.status) return false
    return true
  })
})

// ── 方法 ──
function fetchData() {
  loading.value = true
  setTimeout(() => {
    tableData.value = dictDataList.filter(d => d.dictType === dictType.value && d.deleted === 0)
    loading.value = false
  }, 300)
}

function goBack() {
  router.push('/dict')
}

function handleSearch() {
  // 搜索通过 computed 属性自动处理
}

function handleReset() {
  searchForm.dictLabel = ''
  searchForm.dictCode = ''
  searchForm.status = ''
}

function handleRefresh() {
  fetchData()
}

function handleAdd() {
  isEdit.value = false
  formData.dictId = 0
  formData.dictLabel = ''
  formData.dictValue = ''
  formData.dictCode = ''
  formData.displayOrder = tableData.value.length + 1
  formData.dictClass = ''
  formData.isDefault = 0
  formData.status = 1101
  formData.remark = ''
  drawerVisible.value = true
}

function handleEdit(row: DictData) {
  isEdit.value = true
  formData.dictId = row.dictId
  formData.dictLabel = row.dictLabel
  formData.dictValue = row.dictValue
  formData.dictCode = row.dictCode
  formData.displayOrder = row.displayOrder
  formData.dictClass = row.dictClass || ''
  formData.isDefault = row.isDefault
  formData.status = row.status
  formData.remark = row.remark || ''
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

function handleDelete(row: DictData) {
  ElMessageBox.confirm(
    `确定要删除字典项 "${row.dictLabel}" 吗？`,
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
onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.dict-data-management {
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
      gap: 8px;
    }

    .title-bar {
      display: inline-block;
      width: 4px;
      height: 22px;
      background: linear-gradient(180deg, #409eff 0%, #66b1ff 100%);
      border-radius: 2px;
    }

    .back-btn {
      font-size: 18px;
      margin-right: 4px;
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

    .search-actions {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }
  }

  .table-card {
    border-radius: 12px;
    border: none;

    :deep(.el-card__body) {
      padding: 20px;
    }

    .index-text { color: #909399; font-size: 13px; }
    .label-text { font-weight: 500; color: #303133; }
    .value-text { font-weight: 600; color: #409EFF; }

    .code-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 12px;
      color: #606266;
      background: #F5F7FA;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .order-text { font-weight: 600; color: #606266; }
    .no-text { color: #909399; }
    .remark-text { font-size: 13px; color: #606266; }
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

  .form-tip-inline {
    font-size: 12px;
    color: #909399;
    margin-left: 12px;
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
