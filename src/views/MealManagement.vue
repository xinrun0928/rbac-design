<template>
  <div class="meal-management">
    <!-- 页面头部 -->
    <div class="page-header animate-item">
      <div class="header-left">
        <h1><span class="title-bar"></span>套餐管理</h1>
        <span class="page-desc">管理系统套餐配置，定义不同类型套餐的基本信息</span>
        <el-alert
          title="套餐只初始化创建人员的管理员角色，其他角色需要手动配置"
          type="warning"
          :closable="false"
          show-icon
          class="meal-tip"
        />
      </div>
      <div class="header-right">
        <el-button :icon="Refresh" @click="handleRefresh" :loading="loading">刷新</el-button>
      </div>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card animate-item" shadow="never">
      <div class="search-bar">
        <el-form :model="searchForm" inline class="search-form">
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
        <div class="search-actions">
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增套餐</el-button>
        </div>
      </div>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card animate-item" shadow="never">
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        highlight-current-row
        row-key="id"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600' }"
        empty-text=" "
      >
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

        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Link" @click="handleBind(row)">绑定</el-button>
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

    <!-- 新增弹窗 -->
    <el-dialog
      v-model="addDialogVisible"
      title="新增套餐"
      width="580px"
      destroy-on-close
      :close-on-click-modal="false"
      @closed="resetForm"
    >
      <el-form
        ref="addFormRef"
        :model="addFormData"
        :rules="formRules"
        label-width="100px"
        label-position="right"
        class="meal-form"
      >
        <el-form-item label="套餐代码" prop="code">
          <el-input
            v-model="addFormData.code"
            placeholder="请输入代码，如：PKG_PROV_TRANSPORT"
            maxlength="50"
            show-word-limit
          >
            <template #append>
              <el-tooltip content="代码将自动转为大写" placement="top">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="节点类型" prop="type">
          <el-select v-model="addFormData.type" placeholder="请选择节点类型" style="width: 100%">
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
            v-model="addFormData.name"
            placeholder="请输入套餐名称，如：省交通本级"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="addFormData.sort" :min="0" :max="9999" style="width: 200px" />
          <span class="form-tip-inline">数值越小越靠前</span>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="addFormData.status">
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
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleAddSubmit">
          确认创建
        </el-button>
      </template>
    </el-dialog>

    <!-- 编辑抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      title="编辑套餐"
      size="500px"
      direction="rtl"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form
        ref="editFormRef"
        :model="editFormData"
        :rules="formRules"
        label-width="100px"
        label-position="right"
        class="meal-form"
      >
        <el-form-item label="套餐代码" prop="code">
          <el-input
            v-model="editFormData.code"
            placeholder="请输入代码，如：PKG_PROV_TRANSPORT"
            disabled
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="节点类型" prop="type">
          <el-select v-model="editFormData.type" placeholder="请选择节点类型" style="width: 100%">
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
            v-model="editFormData.name"
            placeholder="请输入套餐名称，如：省交通本级"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="editFormData.sort" :min="0" :max="9999" style="width: 200px" />
          <span class="form-tip-inline">数值越小越靠前</span>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editFormData.status">
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
        <div class="drawer-footer">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleEditSubmit">
            保存修改
          </el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 绑定菜单抽屉 -->
    <el-drawer
      v-model="bindDrawerVisible"
      :title="`绑定菜单 - ${currentMeal?.name || ''}`"
      size="50%"
      direction="rtl"
      destroy-on-close
    >
      <div class="bind-container">
        <!-- 左侧子系统列表 -->
        <div class="bind-left">
          <div class="bind-left-header">
            <span>子系统</span>
          </div>
          <div class="bind-subsystem-list">
            <div
              v-for="sub in subsystems"
              :key="sub.subsysId"
              class="bind-subsystem-item"
              :class="{ active: bindSelectedSubsystem === sub.subsysId }"
              @click="loadBindMenuTree(sub.subsysId)"
            >
              <div class="subsystem-icon" :style="{ background: getSubsystemIconStyle(sub.subsysId).bg }">
                <el-icon :color="getSubsystemIconStyle(sub.subsysId).color">
                  <component :is="getSubsystemIconStyle(sub.subsysId).icon" />
                </el-icon>
              </div>
              <span class="subsystem-name">{{ sub.subsysShortName }}</span>
              <span class="subsystem-count">（{{ subsystemMenuCount[sub.subsysId] || 0 }}）</span>
            </div>
          </div>
        </div>

        <!-- 右侧菜单树 -->
        <div class="bind-right">
          <div class="bind-right-header">
            <span>菜单列表</span>
            <el-checkbox v-model="bindCheckAll" :indeterminate="bindIndeterminate" @change="handleBindCheckAll">
              全选
            </el-checkbox>
          </div>
          <div class="bind-menu-tree">
            <el-tree
              ref="bindTreeRef"
              :data="bindMenuTree"
              show-checkbox
              node-key="menuId"
              :default-checked-keys="bindCheckedKeys"
              :props="{ label: 'menuName', children: 'children' }"
              default-expand-all
              :indent="24"
              :highlight-current="true"
              @check-change="updateCheckAllStatus"
            >
              <template #default="{ node, data }">
                <span class="bind-tree-node">
                  <span class="node-label">{{ node.label }}</span>
                  <span class="menu-type-tag" :class="getMenuTypeClass(data.menuType)">
                    {{ getMenuTypeLabel(data.menuType) }}
                  </span>
                </span>
              </template>
            </el-tree>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="bindDrawerVisible = false">取消</el-button>
          <el-button type="primary" :loading="bindLoading" @click="handleBindSave">
            保存绑定
          </el-button>
        </div>
      </template>
    </el-drawer>
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
  Link,
  Bell, Document, Warning, Connection,
  DataAnalysis, Share, Monitor, Setting
} from '@element-plus/icons-vue'
import type { Meal, SearchForm, MealForm } from '../types/meal'
import { mealTypeOptions } from '../mock/mealData'
import { mockSubsystemData } from '../mock/subsystemData'
import type { Menu } from '../types/menu'
import {
  getMeals,
  addMeal,
  updateMeal,
  deleteMeal,
  batchDeleteMeals,
  toggleMealStatus
} from '../utils/mockApi'
import { getMenuTreeBySubsystem } from '../utils/menuMockApi'
import { getMealMenuIds, saveMealMenuBinding } from '../utils/mealMenuMockApi'

// ── 状态 ──
const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref<Meal[]>([])
const selectedIds = ref<number[]>([])
const addDialogVisible = ref(false)
const drawerVisible = ref(false)
const addFormRef = ref<FormInstance>()
const editFormRef = ref<FormInstance>()

// 绑定菜单状态
const bindDrawerVisible = ref(false)
const bindLoading = ref(false)
const currentMeal = ref<Meal | null>(null)
const bindSelectedSubsystem = ref<number>(1)
const bindMenuTree = ref<Menu[]>([])
const bindCheckedKeys = ref<number[]>([])
const bindCheckAll = ref(false)
const bindIndeterminate = ref(false)
const bindTreeRef = ref<any>(null)
const subsystems = mockSubsystemData.filter(sub => !sub.isHidden && sub.deleted === 0)
const subsystemMenuCount = ref<Record<number, number>>({})

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

const addFormData = reactive<MealForm>({
  code: '',
  name: '',
  type: '',
  sort: 0,
  status: 1101
})

const editFormData = reactive<MealForm>({
  code: '',
  name: '',
  type: '',
  sort: 0,
  status: 1101
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
  addFormData.code = ''
  addFormData.name = ''
  addFormData.type = ''
  addFormData.sort = pagination.total + 1
  addFormData.status = 1101
  addDialogVisible.value = true
}

function handleEdit(row: Meal) {
  editFormData.id = row.id
  editFormData.code = row.code
  editFormData.name = row.name
  editFormData.type = row.type
  editFormData.sort = row.sort
  editFormData.status = row.status
  drawerVisible.value = true
}

async function handleAddSubmit() {
  if (!addFormRef.value) return

  try {
    await addFormRef.value.validate()
  } catch {
    return
  }

  submitLoading.value = true
  try {
    await addMeal({
      code: addFormData.code,
      name: addFormData.name,
      type: addFormData.type as number,
      sort: addFormData.sort,
      status: addFormData.status
    })
    ElMessage.success('新增成功，套餐已创建')
    addDialogVisible.value = false
    fetchData()
  } catch (err) {
    ElMessage.error('操作失败，请重试')
  } finally {
    submitLoading.value = false
  }
}

async function handleEditSubmit() {
  if (!editFormRef.value) return

  try {
    await editFormRef.value.validate()
  } catch {
    return
  }

  submitLoading.value = true
  try {
    if (editFormData.id) {
      await updateMeal(editFormData.id, {
        code: editFormData.code,
        name: editFormData.name,
        type: editFormData.type as number,
        sort: editFormData.sort,
        status: editFormData.status
      })
      ElMessage.success('编辑成功，数据已更新')
      drawerVisible.value = false
      fetchData()
    }
  } catch (err) {
    ElMessage.error('操作失败，请重试')
  } finally {
    submitLoading.value = false
  }
}

function resetForm() {
  addFormRef.value?.resetFields()
  editFormRef.value?.resetFields()
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

// ── 绑定菜单相关方法 ──
async function handleBind(row: Meal) {
  currentMeal.value = row
  bindSelectedSubsystem.value = 1
  bindDrawerVisible.value = true
  await loadSubsystemMenuCounts()
  await loadBindMenuTree(1)
}

async function loadSubsystemMenuCounts() {
  const counts: Record<number, number> = {}
  for (const sub of subsystems) {
    const tree = await getMenuTreeBySubsystem(sub.subsysId)
    counts[sub.subsysId] = getAllMenuIds(tree).length
  }
  subsystemMenuCount.value = counts
}

async function loadBindMenuTree(subsysId: number) {
  bindSelectedSubsystem.value = subsysId
  bindLoading.value = true
  try {
    const tree = await getMenuTreeBySubsystem(subsysId)
    bindMenuTree.value = tree

    // 加载已绑定的菜单
    if (currentMeal.value) {
      const checkedIds = await getMealMenuIds(currentMeal.value.id)
      // 过滤出当前子系统的菜单ID
      const currentSubsysMenuIds = getAllMenuIds(tree)
      bindCheckedKeys.value = checkedIds.filter(id => currentSubsysMenuIds.includes(id))
      updateCheckAllStatus()
    }
  } catch (err) {
    ElMessage.error('加载菜单失败')
  } finally {
    bindLoading.value = false
  }
}

function getAllMenuIds(tree: Menu[]): number[] {
  const ids: number[] = []
  function traverse(items: Menu[]) {
    items.forEach(item => {
      ids.push(item.menuId)
      if (item.children && item.children.length > 0) {
        traverse(item.children)
      }
    })
  }
  traverse(tree)
  return ids
}

function handleBindCheckAll(val: boolean) {
  if (val) {
    const allIds = getAllMenuIds(bindMenuTree.value)
    bindTreeRef.value?.setCheckedKeys(allIds)
  } else {
    bindTreeRef.value?.setCheckedKeys([])
  }
  bindIndeterminate.value = false
}

function updateCheckAllStatus() {
  const allIds = getAllMenuIds(bindMenuTree.value)
  const checkedIds = bindTreeRef.value?.getCheckedKeys() || []
  bindCheckAll.value = checkedIds.length === allIds.length
  bindIndeterminate.value = checkedIds.length > 0 && checkedIds.length < allIds.length
}

async function handleBindSave() {
  if (!currentMeal.value) return

  bindLoading.value = true
  try {
    const checkedKeys = bindTreeRef.value?.getCheckedKeys() || []
    const halfCheckedKeys = bindTreeRef.value?.getHalfCheckedKeys() || []
    const allSelectedIds = [...checkedKeys, ...halfCheckedKeys]

    await saveMealMenuBinding(currentMeal.value.id, allSelectedIds, bindSelectedSubsystem.value)
    ElMessage.success('绑定保存成功')
    bindDrawerVisible.value = false
  } catch (err) {
    ElMessage.error('保存失败，请重试')
  } finally {
    bindLoading.value = false
  }
}

// 子系统图标配置
const subsystemIconMap: Record<number, { icon: string; color: string; bg: string }> = {
  1: { icon: 'Bell', color: '#E6A23C', bg: 'linear-gradient(135deg, #FDF6EC 0%, #FAECD8 100%)' },
  2: { icon: 'Document', color: '#409EFF', bg: 'linear-gradient(135deg, #ECF5FF 0%, #D9ECFF 100%)' },
  3: { icon: 'Warning', color: '#F56C6C', bg: 'linear-gradient(135deg, #FEF0F0 0%, #FDE2E2 100%)' },
  4: { icon: 'Connection', color: '#9B59B6', bg: 'linear-gradient(135deg, #F4ECF7 0%, #E8DAEF 100%)' },
  5: { icon: 'Box', color: '#67C23A', bg: 'linear-gradient(135deg, #F0F9EB 0%, #E1F3D8 100%)' },
  6: { icon: 'DataAnalysis', color: '#00BCD4', bg: 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)' },
  7: { icon: 'Share', color: '#FF9800', bg: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)' },
  8: { icon: 'Monitor', color: '#3F51B5', bg: 'linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%)' },
  99: { icon: 'Setting', color: '#606266', bg: 'linear-gradient(135deg, #F5F7FA 0%, #E9ECEF 100%)' }
}

function getSubsystemIconStyle(subsysId: number) {
  return subsystemIconMap[subsysId] || subsystemIconMap[99]
}

function getMenuTypeLabel(menuType: number): string {
  const typeMap: Record<number, string> = {
    0: '目录',
    1: '菜单',
    2: '权限',
    99: '导航'
  }
  return typeMap[menuType] || '未知'
}

function getMenuTypeTagType(menuType: number): '' | 'success' | 'warning' | 'info' | 'danger' {
  const typeMap: Record<number, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    0: '',        // 目录 - 蓝色
    1: 'success', // 菜单 - 绿色
    2: 'danger',  // 权限 - 红色
    99: 'warning' // 导航 - 橙色
  }
  return typeMap[menuType] || 'info'
}

function getMenuTypeClass(menuType: number): string {
  const classMap: Record<number, string> = {
    0: 'type-directory',
    1: 'type-menu',
    2: 'type-permission',
    99: 'type-navigation'
  }
  return classMap[menuType] || ''
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

  // 提示信息
  .meal-tip {
    margin-top: 10px;
    border-radius: 6px;
    background: linear-gradient(135deg, #FFF7E6 0%, #FFE7BA 100%);
    border: 1px solid #FFD591;

    :deep(.el-alert__title) {
      font-weight: 500;
      color: #D46B08;
      font-size: 13px;
    }

    :deep(.el-alert__icon) {
      color: #FA8C16;
    }

    :deep(.el-alert__description) {
      margin: 0;
      color: #AD6800;
      font-size: 12px;
    }
  }

  // 搜索栏
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
      padding: 20px 24px;
      margin: 0;

      .el-dialog__title {
        font-weight: 600;
        font-size: 16px;
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

  // 抽屉
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
    }
  }

  .drawer-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid #EBEEF5;
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

  // 绑定菜单容器
  .bind-container {
    display: flex;
    height: calc(100vh - 180px);
    border: 1px solid #EBEEF5;
    border-radius: 8px;
    overflow: hidden;

    .bind-left {
      width: 180px;
      border-right: 1px solid #EBEEF5;
      display: flex;
      flex-direction: column;

      .bind-left-header {
        padding: 12px 16px;
        background: #F5F7FA;
        font-weight: 600;
        font-size: 14px;
        color: #303133;
        border-bottom: 1px solid #EBEEF5;
      }

      .bind-subsystem-list {
        flex: 1;
        overflow-y: auto;
        padding: 8px;
      }

      .bind-subsystem-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-bottom: 4px;

        &:hover {
          background: #F5F7FA;
        }

        &.active {
          background: linear-gradient(135deg, #ECF5FF 0%, #D9ECFF 100%);

          .subsystem-name {
            color: #409EFF;
            font-weight: 500;
          }

          .subsystem-count {
            color: #409EFF;
          }
        }

        .subsystem-icon {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;

          .el-icon {
            font-size: 16px;
          }
        }

        .subsystem-name {
          font-size: 13px;
          color: #606266;
        }

        .subsystem-count {
          font-size: 12px;
          color: #909399;
        }
      }
    }

    .bind-right {
      flex: 1;
      display: flex;
      flex-direction: column;

      .bind-right-header {
        padding: 12px 16px;
        background: #F5F7FA;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 600;
        font-size: 14px;
        color: #303133;
        border-bottom: 1px solid #EBEEF5;
      }

      .bind-menu-tree {
        flex: 1;
        overflow-y: auto;
        padding: 12px;

        :deep(.el-tree) {
          --el-tree-node-content-height: 36px;

          .bind-tree-node {
            display: flex;
            align-items: center;
            gap: 8px;
            flex: 1;
            overflow: hidden;

            .node-label {
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-size: 13px;
              color: #303133;
            }

            .menu-type-tag {
              flex-shrink: 0;
              font-size: 11px;
              height: 20px;
              padding: 0 8px;
              border-radius: 10px;
              font-weight: 500;

              &.type-directory {
                background: #409EFF;
                color: #FFFFFF;
                border: none;
              }

              &.type-menu {
                background: #67C23A;
                color: #FFFFFF;
                border: none;
              }

              &.type-permission {
                background: #F56C6C;
                color: #FFFFFF;
                border: none;
              }

              &.type-navigation {
                background: #E6A23C;
                color: #FFFFFF;
                border: none;
              }
            }
          }
        }
      }
    }
  }

  // 抽屉样式
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
      padding: 20px;
    }
  }

  .drawer-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid #EBEEF5;
    margin: 0 -20px -20px;
    background: #FFFFFF;
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
