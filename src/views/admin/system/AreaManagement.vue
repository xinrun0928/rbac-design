<template>
  <div class="area-management">

    <!-- 数据表格 -->
    <el-card class="table-card animate-item" shadow="never">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <span class="search-bar-title">区域管理</span>
        <div class="search-bar-actions">
          <el-input
            v-model="searchForm.code"
            placeholder="搜索区域编号"
            clearable
            :prefix-icon="Search"
            style="width: 180px; margin-right: 12px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
          <el-input
            v-model="searchForm.name"
            placeholder="搜索区域名称"
            clearable
            :prefix-icon="Search"
            style="width: 180px; margin-right: 12px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
          <el-button type="success" :icon="Download" @click="handleExport">导出</el-button>
          <el-button type="primary" :icon="Plus" @click="handleAdd(null)">新增区域</el-button>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="filteredData"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        border
        stripe
        default-expand-all
        :indent="24"
        class="data-table"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
      >
        <el-table-column prop="name" label="区域名称" min-width="300" fixed>
          <template #default="{ row }">
            <div class="area-name-cell">
              <el-icon class="area-icon" :style="{ color: getLevelColor(row.level) }">
                <Location />
              </el-icon>
              <span class="area-name">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="code" label="区域编码" width="160" align="center">
          <template #default="{ row }">
            <span class="code-text">{{ row.code }}</span>
          </template>
        </el-table-column>

        <el-table-column label="下级区域数量" width="140" align="center">
          <template #default="{ row }">
            <el-tag :type="getChildCountTagType(row)" effect="plain" size="small">
              {{ childCountOf(row) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="220" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Plus" @click="handleAdd(row)">子区域</el-button>
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="isEdit ? '编辑区域' : '新增区域'"
      size="480px"
      direction="rtl"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90px" label-position="right">
        <el-form-item label="上级区域" prop="parentCode">
          <el-tree-select
            v-model="formData.parentCode"
            :data="parentAreaOptions"
            :props="{ label: 'name', value: 'code', children: 'children' }"
            check-strictly
            :render-after-expand="false"
            placeholder="请选择上级区域（不选则为顶级）"
            clearable
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="区域编码" prop="code">
          <el-input v-model="formData.code" placeholder="请输入区域编码" maxlength="50" :disabled="isEdit" />
        </el-form-item>

        <el-form-item label="区域名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入区域名称" maxlength="200" show-word-limit />
        </el-form-item>

        <el-form-item label="区域层级" prop="level">
          <el-select v-model="formData.level" placeholder="请选择区域层级" style="width: 100%">
            <el-option v-for="item in areaLevelOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="排序" prop="displayOrder">
          <el-input-number v-model="formData.displayOrder" :min="0" :max="9999" style="width: 180px" />
          <span class="form-tip-inline">数值越小越靠前</span>
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
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Refresh, Search, RefreshLeft, Plus, Delete, Edit, Download, Location
} from '@element-plus/icons-vue'
import { areaData, areaLevelOptions } from '@/mock/admin/areaData'
import type { Area } from '@/types/admin/area'

// ── 状态 ──
const loading = ref(false)
const tableData = ref<Area[]>(areaData)
const drawerVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const searchForm = reactive({
  name: '',
  code: ''
})

const formData = reactive({
  id: 0,
  code: '',
  name: '',
  level: 'province',
  parentCode: '',
  displayOrder: 0
})

const formRules: FormRules = {
  code: [{ required: true, message: '请输入区域编码', trigger: 'blur' }],
  name: [{ required: true, message: '请输入区域名称', trigger: 'blur' }],
  level: [{ required: true, message: '请选择区域层级', trigger: 'change' }]
}

// ── 计算属性 ──
function filterTree(data: Area[], name: string, code: string): Area[] {
  return data.filter(item => {
    const nameMatch = !name || item.name.includes(name)
    const codeMatch = !code || item.code.includes(code)

    if (item.children && item.children.length > 0) {
      item.children = filterTree(item.children, name, code)
      return nameMatch && codeMatch || (item.children && item.children.length > 0)
    }

    return nameMatch && codeMatch
  })
}

const filteredData = computed(() => {
  return filterTree(JSON.parse(JSON.stringify(tableData.value)), searchForm.name, searchForm.code)
})

const parentAreaOptions = computed(() => {
  return [{ code: '', name: '顶级区域', children: tableData.value }]
})

// 下级区域数量
function childCountOf(row: Area): number {
  return row.children?.length || 0
}

function getChildCountTagType(row: Area): '' | 'success' | 'warning' | 'info' | 'danger' {
  const count = childCountOf(row)
  if (count === 0) return 'info'
  if (count < 5) return 'success'
  if (count < 10) return 'warning'
  return 'danger'
}

// ── 方法 ──
function handleSearch() {
  // 搜索通过 computed 属性自动处理
}

function handleReset() {
  searchForm.name = ''
  searchForm.code = ''
}

function handleRefresh() {
  loading.value = true
  setTimeout(() => {
    tableData.value = JSON.parse(JSON.stringify(areaData))
    loading.value = false
  }, 500)
}

// 扁平化树数据用于导出
function flattenTree(data: Area[], level = 1, rows: Array<{ code: string; name: string; childCount: number }> = []) {
  for (const item of data) {
    rows.push({ code: item.code, name: item.name, childCount: item.children?.length || 0 })
    if (item.children && item.children.length > 0) {
      flattenTree(item.children, level + 1, rows)
    }
  }
  return rows
}

// 导出区域
function handleExport() {
  const rows = flattenTree(tableData.value)
  const header = '区域编码,区域名称,下级区域数量'
  const body = rows.map(r => `${r.code},${r.name},${r.childCount}`).join('\n')
  const csvContent = `${header}\n${body}`
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `区域管理_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('导出成功')
}

function handleAdd(parentRow: Area | null) {
  isEdit.value = false
  formData.id = 0
  formData.code = ''
  formData.name = ''
  formData.level = parentRow ? (parentRow.level === 'province' ? 'city' : parentRow.level === 'city' ? 'district' : 'street') : 'province'
  formData.parentCode = parentRow ? parentRow.code : ''
  formData.displayOrder = 0
  drawerVisible.value = true
}

function handleEdit(row: Area) {
  isEdit.value = true
  formData.id = row.id
  formData.code = row.code
  formData.name = row.name
  formData.level = row.level
  formData.parentCode = row.parentCode || ''
  formData.displayOrder = row.displayOrder
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

function handleDelete(row: Area) {
  ElMessageBox.confirm(
    `确定要删除区域 "${row.name}" 吗？删除后其子区域也将被删除。`,
    '确认删除',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {})
}

function resetForm() {
  formRef.value?.resetFields()
}

function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    province: '#409EFF',
    city: '#67C23A',
    district: '#E6A23C',
    street: '#9B59B6'
  }
  return colors[level] || '#909399'
}
</script>

<style lang="scss" scoped>
.area-management {
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
    gap: 16px;
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

    :deep(.el-table__row .cell) {
      display: flex;
      align-items: center;
    }

    :deep(.el-table__row .el-table__cell:not(:first-child) .cell) {
      justify-content: center;
    }

    .data-table {
      flex: 1;
    }

    .area-name-cell {
      display: flex;
      align-items: center;

      .area-icon {
        font-size: 16px;
        flex-shrink: 0;
        margin-right: 6px;
      }
      .area-name { font-weight: 500; color: #303133; }
    }

    .code-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 12px;
      color: #409EFF;
      background: #ECF5FF;
      padding: 2px 6px;
      border-radius: 4px;
    }
  }

  .drawer-footer {
    display: flex;
    justify-content: flex-end;
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
