<template>
  <div class="dict-data-management">

    <!-- 数据表格 -->
    <el-card class="table-card animate-item" shadow="never">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <span class="search-bar-title">{{ dictTypeName }} - 字典数据</span>
        <div class="search-bar-actions">
          <el-input
            v-model="searchForm.dictLabel"
            placeholder="搜索字典标签"
            clearable
            :prefix-icon="Search"
            style="width: 180px; margin-right: 12px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增字典项</el-button>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="filteredData"
        border
        stripe
        highlight-current-row
        row-key="dictId"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column label="序号" width="60" align="center" type="index">
          <template #default="{ $index }">
            <span class="index-text">{{ $index + 1 }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="dictLabel" label="字典标签" min-width="140" align="center">
          <template #default="{ row }">
            <span class="label-text">{{ row.dictLabel }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="dictValue" label="字典值" width="100" align="center">
          <template #default="{ row }">
            <span class="value-text">{{ row.dictValue }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="dictCode" label="字典编码" min-width="200" align="center">
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

        <el-table-column prop="remark" label="备注" min-width="150" align="center" show-overflow-tooltip>
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
          <el-input-number v-model="formData.displayOrder" :min="0" :max="9999" style="width: 180px" />
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
  Search, Plus, Delete, Edit, ArrowLeft
} from '@element-plus/icons-vue'
import { dictDataList } from '@/mock/admin/dictData'
import type { DictData, DictDataSearchForm } from '@/types/admin/dictData'

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

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const searchForm = reactive<DictDataSearchForm>({
  dictLabel: ''
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
  let data = tableData.value.filter(item => {
    if (searchForm.dictLabel && !item.dictLabel.includes(searchForm.dictLabel)) return false
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
    tableData.value = dictDataList.filter(d => d.dictType === dictType.value && true)
    loading.value = false
  }, 300)
}

function goBack() {
  router.push('/admin/dict')
}

function handleSearch() {
  // 搜索通过 computed 属性自动处理
}

function handleReset() {
  searchForm.dictLabel = ''
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
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #ebeef5;
  }

  .search-bar-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }

  .search-bar-actions {
    display: flex;
    align-items: center;
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
