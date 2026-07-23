<template>
  <div class="area-management">
    <!-- 页面头部 -->
    <div class="page-header animate-item">
      <div class="header-left">
        <h1><span class="title-bar"></span>区域管理</h1>
        <span class="page-desc">管理系统行政区划信息，维护省市区层级结构</span>
      </div>
      <div class="header-right">
        <el-button :icon="Refresh" @click="handleRefresh" :loading="loading">刷新</el-button>
      </div>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card animate-item" shadow="never">
      <div class="search-bar">
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="区域名称">
            <el-input v-model="searchForm.name" placeholder="输入区域名称" clearable :prefix-icon="Search" style="width: 200px" @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item label="区域编码">
            <el-input v-model="searchForm.code" placeholder="输入区域编码" clearable style="width: 160px" @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item label="区域层级">
            <el-select v-model="searchForm.level" placeholder="请选择层级" clearable style="width: 140px">
              <el-option v-for="item in areaLevelOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
            <el-button :icon="RefreshLeft" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="search-actions">
          <el-button type="primary" :icon="Plus" @click="handleAdd(null)">新增区域</el-button>
        </div>
      </div>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card animate-item" shadow="never">
      <el-table
        v-loading="loading"
        :data="filteredData"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        border
        stripe
        default-expand-all
        :indent="24"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600' }"
      >
        <el-table-column prop="name" label="区域名称" min-width="200">
          <template #default="{ row }">
            <div class="area-name-cell">
              <el-icon class="area-icon" :style="{ color: getLevelColor(row.level) }">
                <Location />
              </el-icon>
              <span class="area-name">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="code" label="区域编码" width="140" align="center">
          <template #default="{ row }">
            <span class="code-text">{{ row.code }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="level" label="区域层级" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getLevelTagType(row.level)" effect="plain" size="small">
              {{ getLevelLabel(row.level) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="parentCode" label="父级编码" width="120" align="center">
          <template #default="{ row }">
            <span class="parent-code-text">{{ row.parentCode || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="displayOrder" label="排序" width="80" align="center">
          <template #default="{ row }">
            <span class="order-text">{{ row.displayOrder }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="160" align="center" fixed="right">
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
          <el-input-number v-model="formData.displayOrder" :min="0" :max="9999" style="width: 200px" />
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
  Refresh, Search, RefreshLeft, Plus, Delete, Edit, Location
} from '@element-plus/icons-vue'
import { areaData, areaLevelOptions } from '../mock/areaData'
import type { Area, AreaSearchForm } from '../types/area'

// ── 状态 ──
const loading = ref(false)
const tableData = ref<Area[]>(areaData)
const drawerVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const searchForm = reactive<AreaSearchForm>({
  name: '',
  code: '',
  level: ''
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
function filterTree(data: Area[], name: string, code: string, level: string): Area[] {
  return data.filter(item => {
    const nameMatch = !name || item.name.includes(name)
    const codeMatch = !code || item.code.includes(code)
    const levelMatch = !level || item.level === level

    if (item.children && item.children.length > 0) {
      item.children = filterTree(item.children, name, code, level)
      return nameMatch && codeMatch && levelMatch || (item.children && item.children.length > 0)
    }

    return nameMatch && codeMatch && levelMatch
  })
}

const filteredData = computed(() => {
  return filterTree(JSON.parse(JSON.stringify(tableData.value)), searchForm.name, searchForm.code, searchForm.level)
})

const parentAreaOptions = computed(() => {
  return [{ code: '', name: '顶级区域', children: tableData.value }]
})

// ── 方法 ──
function handleSearch() {
  // 搜索通过 computed 属性自动处理
}

function handleReset() {
  searchForm.name = ''
  searchForm.code = ''
  searchForm.level = ''
}

function handleRefresh() {
  loading.value = true
  setTimeout(() => {
    tableData.value = JSON.parse(JSON.stringify(areaData))
    loading.value = false
  }, 500)
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

function getLevelLabel(level: string): string {
  const option = areaLevelOptions.find(o => o.value === level)
  return option?.label || level
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

function getLevelTagType(level: string): '' | 'success' | 'warning' | 'info' | 'danger' {
  const types: Record<string, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    province: '',
    city: 'success',
    district: 'warning',
    street: 'info'
  }
  return types[level] || 'info'
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

    :deep(.el-table) {
      border-radius: 8px;
      overflow: hidden;

      .el-table__row .cell {
        display: flex;
        align-items: center;
      }

      .el-table__indent {
        padding-left: 24px !important;
        display: inline-block !important;
      }

      .el-table__expand-icon {
        width: 24px;
        height: 24px;
        margin-right: 4px;
        vertical-align: middle;

        .el-icon {
          font-size: 14px;
          transition: transform 0.2s ease;
        }

        &.expanded .el-icon {
          transform: rotate(90deg);
        }
      }

      .el-table__cell.is-leaf .el-table__expand-icon {
        visibility: hidden;
      }
    }

    .area-name-cell {
      display: flex;
      align-items: center;
      gap: 8px;

      .area-icon { font-size: 16px; }
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

    .parent-code-text { font-size: 12px; color: #909399; }
    .order-text { font-weight: 600; color: #606266; }
  }

  :deep(.el-drawer) {
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
