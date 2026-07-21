<template>
  <div class="meal-management">
    <!-- 页面头部 -->
    <div class="page-header animate-item">
      <div class="header-left">
        <h1><span class="title-bar"></span>套餐管理</h1>
        <span class="page-desc">管理系统套餐配置，定义不同类型套餐的基本信息</span>
      </div>
      <div class="header-right">
        <el-button :icon="Refresh" @click="handleRefresh" :loading="loading">刷新</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-cards animate-item">
      <el-card v-for="stat in statsData" :key="stat.label" shadow="hover">
        <div class="stat-item">
          <div class="stat-icon" :style="{ background: stat.bg }">
            <el-icon :size="24" :color="stat.color"><component :is="stat.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card animate-item" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item label="套餐名称">
          <el-input
            v-model="searchForm.name"
            placeholder="输入套餐名称，如：省交通本级"
            clearable
            :prefix-icon="Search"
            style="width: 240px"
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="节点类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable style="width: 180px">
            <el-option
              v-for="item in mealTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 140px">
            <el-option label="正常" :value="1101" />
            <el-option label="停用" :value="1001" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch" :loading="loading">搜索</el-button>
          <el-button :icon="RefreshLeft" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 工具栏 -->
    <div class="toolbar animate-item">
      <div class="toolbar-left">
        <el-button type="primary" :icon="Plus" @click="handleAdd">新增套餐</el-button>
        <el-button type="danger" :icon="Delete" :disabled="!selectedIds.length" @click="handleBatchDelete">
          批量删除
        </el-button>
        <transition name="fade">
          <span v-if="selectedIds.length" class="selected-count">
            已选择 <strong>{{ selectedIds.length }}</strong> 项
            <el-button type="primary" link @click="clearSelection">取消选择</el-button>
          </span>
        </transition>
      </div>
      <div class="toolbar-right">
        <span class="total-count">共 {{ pagination.total }} 条数据</span>
      </div>
    </div>

    <!-- 数据表格 -->
    <el-card class="table-card animate-item" shadow="never">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        highlight-current-row
        row-key="id"
        @selection-change="handleSelectionChange"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600' }"
        empty-text=" "
      >
        <el-table-column type="selection" width="50" align="center" />

        <el-table-column prop="id" label="ID" width="70" align="center">
          <template #default="{ row }">
            <span class="id-text">{{ row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="code" label="套餐代码" width="200">
          <template #default="{ row }">
            <div class="code-cell">
              <span class="code-text">{{ row.code }}</span>
              <el-tooltip content="复制代码" placement="top">
                <el-button type="primary" link size="small" @click="handleCopy(row.code)">
                  <el-icon><CopyDocument /></el-icon>
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="套餐名称" min-width="140">
          <template #default="{ row }">
            <span class="name-text">{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="type" label="节点类型" width="150" align="center">
          <template #default="{ row }">
            <el-tag
              :color="getTypeTagColor(row.type)"
              effect="dark"
              style="border: none; color: #fff"
              round
            >
              {{ row.typeName }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="sort" label="排序" width="80" align="center">
          <template #default="{ row }">
            <span class="sort-text">{{ row.sort }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="120" align="center">
          <template #default="{ row }">
            <el-switch
              :model-value="row.status"
              :active-value="1101"
              :inactive-value="1001"
              active-text="正常"
              inactive-text="停用"
              inline-prompt
              style="--el-switch-on-color: #67C23A; --el-switch-off-color: #909399"
              @change="(val: number) => handleStatusChange(row, val)"
            />
          </template>
        </el-table-column>

        <el-table-column prop="creator" label="创建人" width="110" align="center">
          <template #default="{ row }">
            <div class="creator-cell">
              <el-avatar :size="24" :style="{ background: getAvatarColor(row.creator) }">
                {{ row.creator.charAt(0) }}
              </el-avatar>
              <span>{{ row.creator }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" width="170" align="center">
          <template #default="{ row }">
            <el-tooltip :content="row.createTime" placement="top">
              <span class="time-text">{{ getRelativeTime(row.createTime) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>

        <!-- 空状态插槽 -->
        <template #empty>
          <div class="empty-state">
            <el-icon :size="64" color="#DCDFE6"><Box /></el-icon>
            <p class="empty-title">暂无套餐数据</p>
            <p class="empty-desc">
              点击上方
              <el-button type="primary" link @click="handleAdd">"新增套餐"</el-button>
              按钮创建第一个套餐
            </p>
          </div>
        </template>
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

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑套餐' : '新增套餐'"
      width="580px"
      destroy-on-close
      :close-on-click-modal="false"
      @closed="resetForm"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        label-position="right"
        class="meal-form"
      >
        <el-form-item label="套餐代码" prop="code">
          <el-input
            v-model="formData.code"
            placeholder="请输入代码，如：PKG_PROV_TRANSPORT"
            :disabled="isEdit"
            maxlength="50"
            show-word-limit
          >
            <template #append v-if="!isEdit">
              <el-tooltip content="代码将自动转为大写" placement="top">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="节点类型" prop="type">
          <el-select v-model="formData.type" placeholder="请选择节点类型" style="width: 100%">
            <el-option
              v-for="item in mealTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <div class="type-option">
                <span class="type-option-label">{{ item.label }}</span>
                <span class="type-option-desc">{{ item.description }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="套餐名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入套餐名称，如：省交通本级"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" :max="9999" style="width: 200px" />
          <span class="form-tip-inline">数值越小越靠前</span>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1101">
              <el-icon color="#67C23A"><SuccessFilled /></el-icon>
              正常
            </el-radio>
            <el-radio :value="1001">
              <el-icon color="#909399"><CircleCloseFilled /></el-icon>
              停用
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          {{ isEdit ? '保存修改' : '确认创建' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'  // eslint-disable-line
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Refresh, Search, RefreshLeft, Plus, Delete, Edit,
  CopyDocument, QuestionFilled,
  SuccessFilled, CircleCloseFilled, Box,
  DataBoard, OfficeBuilding
} from '@element-plus/icons-vue'
import type { Meal, SearchForm, MealForm } from '../types/meal'
import { mealTypeOptions } from '../mock/mealData'
import {
  getMeals,
  addMeal,
  updateMeal,
  deleteMeal,
  batchDeleteMeals,
  toggleMealStatus
} from '../utils/mockApi'

// ── 状态 ──
const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref<Meal[]>([])
const selectedIds = ref<number[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const searchForm = reactive<SearchForm>({
  name: '',
  type: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const formData = reactive<MealForm>({
  code: '',
  name: '',
  type: '',
  sort: 0,
  status: 1101
})

// ── 计算属性 ──
const statsData = computed(() => {
  const total = pagination.total
  const normalCount = tableData.value.filter(p => p.status === 1101).length
  const disabledCount = tableData.value.filter(p => p.status === 1001).length
  const typeCount = new Set(tableData.value.map(p => p.type)).size

  return [
    { label: '套餐总数', value: total, icon: DataBoard, color: '#409EFF', bg: 'linear-gradient(135deg, #ECF5FF 0%, #D9ECFF 100%)' },
    { label: '正常状态', value: normalCount, icon: SuccessFilled, color: '#67C23A', bg: 'linear-gradient(135deg, #F0F9EB 0%, #E1F3D8 100%)' },
    { label: '已停用', value: disabledCount, icon: CircleCloseFilled, color: '#909399', bg: 'linear-gradient(135deg, #F4F4F5 0%, #E9E9EB 100%)' },
    { label: '类型分布', value: typeCount, icon: OfficeBuilding, color: '#E6A23C', bg: 'linear-gradient(135deg, #FDF6EC 0%, #FAECD8 100%)' }
  ]
})

// ── 表单验证规则 ──
const formRules: FormRules = {
  code: [
    { required: true, message: '请输入套餐代码', trigger: 'blur' },
    { pattern: /^[A-Za-z_]+$/, message: '只能包含英文字母和下划线', trigger: 'blur' },
    { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择节点类型', trigger: 'change' }
  ],
  name: [
    { required: true, message: '请输入套餐名称', trigger: 'blur' }
  ],
  sort: [
    { required: true, message: '请输入排序值', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// ── 方法 ──
async function fetchData() {
  loading.value = true
  try {
    const res = await getMeals({
      page: pagination.page,
      pageSize: pagination.pageSize,
      search: searchForm
    })
    tableData.value = res.list
    pagination.total = res.total
  } catch (err) {
    ElMessage.error('获取数据失败，请重试')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  fetchData()
}

function handleReset() {
  searchForm.name = ''
  searchForm.type = ''
  searchForm.status = ''
  pagination.page = 1
  fetchData()
}

function handleRefresh() {
  fetchData()
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
  fetchData()
}

function handlePageChange(page: number) {
  pagination.page = page
  fetchData()
}

function handleSelectionChange(rows: Meal[]) {
  selectedIds.value = rows.map(r => r.id)
}

function clearSelection() {
  selectedIds.value = []
}

function handleAdd() {
  isEdit.value = false
  formData.code = ''
  formData.name = ''
  formData.type = ''
  formData.sort = pagination.total + 1
  formData.status = 1101
  dialogVisible.value = true
}

function handleEdit(row: Meal) {
  isEdit.value = true
  formData.id = row.id
  formData.code = row.code
  formData.name = row.name
  formData.type = row.type
  formData.sort = row.sort
  formData.status = row.status
  dialogVisible.value = true
}

async function handleSubmit() {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch {
    return
  }

  submitLoading.value = true
  try {
    if (isEdit.value && formData.id) {
      await updateMeal(formData.id, {
        code: formData.code,
        name: formData.name,
        type: formData.type as number,
        sort: formData.sort,
        status: formData.status
      })
      ElMessage.success('编辑成功，数据已更新')
    } else {
      await addMeal({
        code: formData.code,
        name: formData.name,
        type: formData.type as number,
        sort: formData.sort,
        status: formData.status
      })
      ElMessage.success('新增成功，套餐已创建')
    }
    dialogVisible.value = false
    fetchData()
  } catch (err) {
    ElMessage.error('操作失败，请重试')
  } finally {
    submitLoading.value = false
  }
}

function resetForm() {
  formRef.value?.resetFields()
}

async function handleDelete(row: Meal) {
  try {
    await ElMessageBox.confirm(
      `您即将删除以下套餐：\n\n套餐名称：${row.name}\n套餐代码：${row.code}\n\n删除后将无法恢复，确定要继续吗？`,
      '确认删除',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: false
      }
    )

    loading.value = true
    await deleteMeal(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败，请重试')
    }
  } finally {
    loading.value = false
  }
}

async function handleBatchDelete() {
  if (!selectedIds.value.length) return

  try {
    await ElMessageBox.confirm(
      `您已选择 ${selectedIds.value.length} 条套餐数据，删除后将无法恢复，确定要继续吗？`,
      '批量删除确认',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    loading.value = true
    await batchDeleteMeals(selectedIds.value)
    ElMessage.success(`成功删除 ${selectedIds.value.length} 条数据`)
    selectedIds.value = []
    fetchData()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('批量删除失败，请重试')
    }
  } finally {
    loading.value = false
  }
}

async function handleStatusChange(row: Meal, newStatus: number) {
  const from = newStatus === 1101 ? '停用' : '正常'
  const to = newStatus === 1101 ? '正常' : '停用'

  try {
    await ElMessageBox.confirm(
      `您将把套餐 "${row.name}" 的状态从 "${from}" 切换为 "${to}"，确定要继续吗？`,
      '切换状态确认',
      {
        confirmButtonText: '确认切换',
        cancelButtonText: '取消',
        type: 'info'
      }
    )

    await toggleMealStatus(row.id, newStatus)
    row.status = newStatus
    row.statusName = to
    ElMessage.success(`状态已切换为 "${to}"`)
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('状态切换失败，请重试')
    }
    fetchData()
  }
}

async function handleCopy(code: string) {
  try {
    await navigator.clipboard.writeText(code)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.warning('复制失败，请手动复制')
  }
}

function getTypeTagColor(type: number): string {
  const colors: Record<number, string> = {
    1: '#409EFF',
    2: '#67C23A',
    3: '#E6A23C',
    4: '#9B59B6'
  }
  return colors[type] || '#909399'
}

function getAvatarColor(name: string): string {
  const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#9B59B6', '#00BCD4']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

function getRelativeTime(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day

  if (diff < minute) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / minute)}分钟前`
  if (diff < day) return `${Math.floor(diff / hour)}小时前`
  if (diff < week) return `${Math.floor(diff / day)}天前`

  return dateStr.split(' ')[0]
}

// ── 初始化 ──
onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.meal-management {
  padding: 24px;
  background: linear-gradient(160deg, #F5F7FA 0%, #E8ECF1 100%);
  min-height: 100vh;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;

  // 入场动画
  .animate-item {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;

    &:nth-child(1) { animation-delay: 0.05s; }
    &:nth-child(2) { animation-delay: 0.12s; }
    &:nth-child(3) { animation-delay: 0.19s; }
    &:nth-child(4) { animation-delay: 0.26s; }
    &:nth-child(5) { animation-delay: 0.33s; }
  }

  // 页面头部
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    padding: 24px 28px;
    background: #FFFFFF;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);

    .header-left {
      h1 {
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
        background: linear-gradient(180deg, #409EFF 0%, #66B1FF 100%);
        border-radius: 2px;
      }

      .page-desc {
        font-size: 13px;
        color: #909399;
        padding-left: 14px;
      }
    }
  }

  // 统计卡片
  .stats-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 20px;

    .el-card {
      border: none;
      border-radius: 12px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
      }

      :deep(.el-card__body) {
        padding: 20px;
      }
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-info {
      .stat-value {
        font-size: 28px;
        font-weight: 700;
        color: #303133;
        line-height: 1.2;
      }

      .stat-label {
        font-size: 13px;
        color: #909399;
        margin-top: 4px;
      }
    }
  }

  // 搜索栏
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

  // 工具栏
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

    .selected-count {
      font-size: 13px;
      color: #606266;
      margin-left: 8px;

      strong {
        color: #409EFF;
      }
    }

    .total-count {
      font-size: 13px;
      color: #909399;
      padding: 6px 14px;
      background: #F0F2F5;
      border-radius: 6px;
    }
  }

  // 表格卡片
  .table-card {
    border-radius: 12px;
    border: none;

    :deep(.el-card__body) {
      padding: 20px;
    }

    :deep(.el-table) {
      border-radius: 8px;
      overflow: hidden;

      .el-table__row {
        transition: background-color 0.2s ease;
      }
    }

    .id-text {
      color: #909399;
      font-size: 13px;
    }

    .code-cell {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .code-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      color: #409EFF;
      font-size: 12px;
      background: #ECF5FF;
      padding: 3px 8px;
      border-radius: 4px;
    }

    .name-text {
      font-weight: 500;
      color: #303133;
    }

    .sort-text {
      font-weight: 600;
      color: #606266;
    }

    .creator-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: center;

      span {
        font-size: 13px;
        color: #606266;
      }
    }

    .time-text {
      font-size: 13px;
      color: #909399;
    }

    // 空状态
    .empty-state {
      padding: 48px 0;

      .empty-title {
        font-size: 16px;
        color: #606266;
        margin: 16px 0 8px;
      }

      .empty-desc {
        font-size: 13px;
        color: #909399;
      }
    }
  }

  // 分页
  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid #EBEEF5;
  }

  // 对话框
  :deep(.el-dialog) {
    border-radius: 12px;
    overflow: hidden;

    .el-dialog__header {
      background: linear-gradient(135deg, #409EFF 0%, #66B1FF 100%);
      padding: 20px 24px;
      margin: 0;

      .el-dialog__title {
        color: #FFFFFF;
        font-weight: 600;
        font-size: 16px;
      }

      .el-dialog__headerbtn .el-dialog__close {
        color: rgba(255, 255, 255, 0.8);

        &:hover {
          color: #FFFFFF;
        }
      }
    }

    .el-dialog__body {
      padding: 28px 24px 12px;
    }

    .el-dialog__footer {
      padding: 16px 24px;
      border-top: 1px solid #EBEEF5;
    }
  }

  // 表单
  .meal-form {
    .form-tip {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #909399;
      margin-top: 4px;
    }

    .form-tip-inline {
      font-size: 12px;
      color: #909399;
      margin-left: 12px;
    }
  }

  .type-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .type-option-label {
      font-weight: 500;
    }

    .type-option-desc {
      font-size: 12px;
      color: #909399;
    }
  }
}
</style>

<style>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
