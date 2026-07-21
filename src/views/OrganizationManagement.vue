<template>
  <div class="org-management">
    <!-- 页面头部 -->
    <div class="page-header animate-item">
      <div class="header-left">
        <h1><span class="title-bar"></span>组织架构管理</h1>
        <span class="page-desc">管理组织机构信息，维护组织树结构与套餐关联</span>
      </div>
      <div class="header-right">
        <el-button :icon="Refresh" @click="handleRefresh" :loading="loading">刷新</el-button>
      </div>
    </div>

    <div class="main-content animate-item">
      <!-- 左侧：组织树 -->
      <div class="tree-panel" :class="{ collapsed: treeCollapsed }">
        <div class="tree-header">
          <span v-if="!treeCollapsed" class="tree-title">组织结构</span>
          <el-button
            :icon="treeCollapsed ? DArrowRight : DArrowLeft"
            link
            @click="treeCollapsed = !treeCollapsed"
            class="collapse-btn"
          />
        </div>
        <div v-if="!treeCollapsed" class="tree-body">
          <el-input
            v-model="treeFilter"
            placeholder="搜索组织名称"
            clearable
            :prefix-icon="Search"
            class="tree-search"
          />
          <el-tree
            ref="treeRef"
            :data="treeData"
            :props="{ label: 'orgName', children: 'children' }"
            node-key="orgId"
            highlight-current
            default-expand-all
            :expand-on-click-node="false"
            :filter-node-method="filterTreeNode"
            @node-click="handleNodeClick"
            class="org-tree"
          >
            <template #default="{ data }">
              <div class="tree-node">
                <el-icon class="node-icon"><OfficeBuilding /></el-icon>
                <span class="node-label">{{ data.orgName }}</span>
                <el-tag
                  v-for="t in data.packageTypes"
                  :key="t"
                  :color="getTypeTagColor(t)"
                  effect="dark"
                  style="border: none; color: #fff; margin-left: 4px; font-size: 10px; height: 18px; padding: 0 5px;"
                  size="small"
                  round
                >
                  {{ getTypeName(t) }}
                </el-tag>
              </div>
            </template>
          </el-tree>
        </div>
      </div>

      <!-- 右侧：列表区域 -->
      <div class="list-panel">
        <!-- 当前选中提示 -->
        <div v-if="currentNode" class="current-node-bar">
          <el-icon><Location /></el-icon>
          <span>当前选中：<strong>{{ currentNode.orgName }}</strong></span>
          <el-button type="primary" link @click="handleClearNode">查看全部</el-button>
        </div>

        <!-- 搜索栏 -->
        <el-card class="search-card" shadow="never">
          <el-form :model="searchForm" inline>
            <el-form-item label="组织名称">
              <el-input
                v-model="searchForm.orgName"
                placeholder="输入组织名称"
                clearable
                :prefix-icon="Search"
                style="width: 200px"
                @keyup.enter="handleSearch"
              />
            </el-form-item>
            <el-form-item label="组织编号">
              <el-input
                v-model="searchForm.orgCode"
                placeholder="输入组织编号"
                clearable
                style="width: 180px"
                @keyup.enter="handleSearch"
              />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="searchForm.status" placeholder="全部" clearable style="width: 120px">
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
        <div class="toolbar">
          <div class="toolbar-left">
            <el-button type="primary" :icon="Plus" @click="handleAdd">新增组织</el-button>
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
        <el-card class="table-card" shadow="never">
          <el-table
            v-loading="loading"
            :data="tableData"
            border
            stripe
            highlight-current-row
            row-key="orgId"
            @selection-change="handleSelectionChange"
            :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600' }"
            empty-text=" "
          >
            <el-table-column type="selection" width="50" align="center" />

            <el-table-column prop="orgId" label="组织ID" width="80" align="center">
              <template #default="{ row }">
                <span class="id-text">{{ row.orgId }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="orgCode" label="组织编号" width="200">
              <template #default="{ row }">
                <div class="code-cell">
                  <span class="code-text">{{ row.orgCode }}</span>
                  <el-tooltip content="复制编号" placement="top">
                    <el-button type="primary" link size="small" @click="handleCopy(row.orgCode)">
                      <el-icon><CopyDocument /></el-icon>
                    </el-button>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="orgName" label="组织名称" min-width="180">
              <template #default="{ row }">
                <span class="name-text">{{ row.orgName }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="packageTypes" label="关联套餐类型" min-width="200">
              <template #default="{ row }">
                <template v-if="row.packageTypes && row.packageTypes.length">
                  <el-tag
                    v-for="t in row.packageTypes"
                    :key="t"
                    :color="getTypeTagColor(t)"
                    effect="dark"
                    style="border: none; color: #fff; margin-right: 4px; margin-bottom: 2px"
                    size="small"
                    round
                  >
                    {{ getTypeName(t) }}
                  </el-tag>
                </template>
                <span v-else class="empty-tag">未关联</span>
              </template>
            </el-table-column>

            <el-table-column prop="contactPerson" label="联系人" width="100" align="center" />

            <el-table-column prop="contactPhone" label="联系电话" width="140" align="center" />

            <el-table-column prop="displayOrder" label="排序" width="70" align="center" />

            <el-table-column prop="status" label="状态" width="90" align="center">
              <template #default="{ row }">
                <el-tag
                  :type="row.status === 1101 ? 'success' : 'info'"
                  effect="light"
                  round
                >
                  {{ row.status === 1101 ? '正常' : '停用' }}
                </el-tag>
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

            <template #empty>
              <div class="empty-state">
                <el-icon :size="64" color="#DCDFE6"><OfficeBuilding /></el-icon>
                <p class="empty-title">暂无组织数据</p>
                <p class="empty-desc">
                  点击上方
                  <el-button type="primary" link @click="handleAdd">"新增组织"</el-button>
                  按钮创建第一个组织
                </p>
              </div>
            </template>
          </el-table>

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
      </div>
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑组织' : '新增组织'"
      width="680px"
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
        class="org-form"
      >
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="组织名称" prop="orgName">
              <el-input v-model="formData.orgName" placeholder="请输入组织名称" maxlength="100" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="组织编号" prop="orgCode">
              <el-input v-model="formData.orgCode" placeholder="如：ORG_CS_TRANSPORT" maxlength="50" show-word-limit />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="上级组织" prop="parentId">
              <el-tree-select
                v-model="formData.parentId"
                :data="treeDataForSelect"
                :props="{ label: 'orgName', value: 'orgId', children: 'children' }"
                placeholder="请选择上级组织（不选则为顶级）"
                clearable
                check-strictly
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="displayOrder">
              <el-input-number v-model="formData.displayOrder" :min="0" :max="9999" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="联系人" prop="contactPerson">
              <el-input v-model="formData.contactPerson" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="formData.contactPhone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="联系邮箱" prop="contactEmail">
              <el-input v-model="formData.contactEmail" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="区域编码" prop="areaCode">
              <el-input v-model="formData.areaCode" placeholder="如：430100" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="关联套餐" prop="packageTypes">
          <el-select
            v-model="formData.packageTypes"
            multiple
            placeholder="请选择关联的套餐类型（可多选）"
            style="width: 100%"
          >
            <el-option
              v-for="item in packageTypeOptions"
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

        <el-form-item label="组织介绍" prop="introduce">
          <el-input
            v-model="formData.introduce"
            type="textarea"
            :rows="3"
            placeholder="请输入组织介绍"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1101">
              <el-icon color="#67C23A"><SuccessFilled /></el-icon> 正常
            </el-radio>
            <el-radio :value="1001">
              <el-icon color="#909399"><CircleCloseFilled /></el-icon> 停用
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type ElTree from 'element-plus/es/components/tree'
import {
  Refresh, Search, RefreshLeft, Plus, Delete, Edit,
  CopyDocument, SuccessFilled, CircleCloseFilled,
  OfficeBuilding, Location, DArrowLeft, DArrowRight
} from '@element-plus/icons-vue'
import type { Organization, OrgSearchForm, OrgForm, OrgTreeNode } from '../types/organization'
import { buildOrgTree } from '../mock/organizationData'
import { mealTypeOptions as packageTypeOptions } from '../mock/mealData'
import {
  getOrgList,
  getOrgTree,
  addOrganization,
  updateOrganization,
  deleteOrganization,
  batchDeleteOrganizations
} from '../utils/orgMockApi'

// ── 状态 ──
const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref<Organization[]>([])
const selectedIds = ref<number[]>([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const treeRef = ref<InstanceType<typeof ElTree>>()
const treeCollapsed = ref(false)
const treeFilter = ref('')

const treeData = ref<OrgTreeNode[]>([])
const currentNode = ref<OrgTreeNode | null>(null)

const searchForm = reactive<OrgSearchForm>({
  orgName: '',
  orgCode: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const formData = reactive<OrgForm>({
  orgName: '',
  orgCode: '',
  parentId: 0,
  orgType: '0',
  orgLevel: '',
  areaCode: '',
  contactPerson: '',
  contactPhone: '',
  contactEmail: '',
  introduce: '',
  displayOrder: 0,
  status: 1101,
  packageTypes: []
})

// ── 树节点筛选 ──
watch(treeFilter, (val) => {
  treeRef.value?.filter(val)
})

// 为 el-tree-select 添加"顶级"选项
const treeDataForSelect = computed<OrgTreeNode[]>(() => {
  return [
    { orgId: 0, orgName: '（顶级组织）', orgCode: '', parentId: -1, packageTypes: [], children: [] },
    ...treeData.value
  ]
})

// ── 表单验证规则 ──
const formRules: FormRules = {
  orgName: [
    { required: true, message: '请输入组织名称', trigger: 'blur' },
    { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
  ],
  orgCode: [
    { required: true, message: '请输入组织编号', trigger: 'blur' },
    { pattern: /^[A-Za-z_]+$/, message: '只能包含英文字母和下划线', trigger: 'blur' }
  ],
  packageTypes: [
    { type: 'array', required: true, message: '请至少选择一个关联套餐类型', trigger: 'change' }
  ]
}

// ── 方法 ──
async function fetchTree() {
  const all = await getOrgTree()
  treeData.value = buildOrgTree(all)
}

async function fetchData() {
  loading.value = true
  try {
    const res = await getOrgList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      parentId: currentNode.value?.orgId,
      search: searchForm
    })
    tableData.value = res.list
    pagination.total = res.total
  } catch {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  fetchData()
}

function handleReset() {
  searchForm.orgName = ''
  searchForm.orgCode = ''
  searchForm.status = ''
  pagination.page = 1
  fetchData()
}

function handleRefresh() {
  fetchTree()
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

function handleNodeClick(data: OrgTreeNode) {
  currentNode.value = data
  pagination.page = 1
  fetchData()
}

function handleClearNode() {
  currentNode.value = null
  treeRef.value?.setCurrentKey(undefined)
  pagination.page = 1
  fetchData()
}

function filterTreeNode(value: string, data: OrgTreeNode): boolean {
  if (!value) return true
  return data.orgName.includes(value)
}

function handleSelectionChange(rows: Organization[]) {
  selectedIds.value = rows.map(r => r.orgId)
}

function clearSelection() {
  selectedIds.value = []
}

function handleAdd() {
  isEdit.value = false
  formData.orgName = ''
  formData.orgCode = ''
  formData.parentId = currentNode.value?.orgId || 0
  formData.orgType = '0'
  formData.orgLevel = ''
  formData.areaCode = ''
  formData.contactPerson = ''
  formData.contactPhone = ''
  formData.contactEmail = ''
  formData.introduce = ''
  formData.displayOrder = pagination.total + 1
  formData.status = 1101
  formData.packageTypes = []
  dialogVisible.value = true
}

function handleEdit(row: Organization) {
  isEdit.value = true
  formData.orgId = row.orgId
  formData.orgName = row.orgName
  formData.orgCode = row.orgCode
  formData.parentId = row.parentId
  formData.orgType = row.orgType
  formData.orgLevel = row.orgLevel
  formData.areaCode = row.areaCode
  formData.contactPerson = row.contactPerson
  formData.contactPhone = row.contactPhone
  formData.contactEmail = row.contactEmail
  formData.introduce = row.introduce
  formData.displayOrder = row.displayOrder
  formData.status = row.status
  formData.packageTypes = [...row.packageTypes]
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
    if (isEdit.value && formData.orgId) {
      await updateOrganization(formData.orgId, { ...formData } as Partial<Organization>)
      ElMessage.success('编辑成功')
    } else {
      await addOrganization({ ...formData } as Partial<Organization>)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    fetchTree()
    fetchData()
  } catch {
    ElMessage.error('操作失败')
  } finally {
    submitLoading.value = false
  }
}

function resetForm() {
  formRef.value?.resetFields()
}

async function handleDelete(row: Organization) {
  try {
    await ElMessageBox.confirm(
      `您即将删除组织 "${row.orgName}"（${row.orgCode}），删除后将无法恢复，确定要继续吗？`,
      '确认删除',
      { confirmButtonText: '确认删除', cancelButtonText: '取消', type: 'warning' }
    )
    loading.value = true
    await deleteOrganization(row.orgId)
    ElMessage.success('删除成功')
    fetchTree()
    fetchData()
  } catch (err) {
    if (err !== 'cancel') ElMessage.error('删除失败')
  } finally {
    loading.value = false
  }
}

async function handleBatchDelete() {
  if (!selectedIds.value.length) return
  try {
    await ElMessageBox.confirm(
      `您已选择 ${selectedIds.value.length} 条数据，删除后将无法恢复，确定要继续吗？`,
      '批量删除确认',
      { confirmButtonText: '确认删除', cancelButtonText: '取消', type: 'warning' }
    )
    loading.value = true
    await batchDeleteOrganizations(selectedIds.value)
    ElMessage.success(`成功删除 ${selectedIds.value.length} 条数据`)
    selectedIds.value = []
    fetchTree()
    fetchData()
  } catch (err) {
    if (err !== 'cancel') ElMessage.error('批量删除失败')
  } finally {
    loading.value = false
  }
}

async function handleCopy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.warning('复制失败')
  }
}

function getTypeTagColor(type: number): string {
  const colors: Record<number, string> = { 1: '#409EFF', 2: '#67C23A', 3: '#E6A23C', 4: '#9B59B6' }
  return colors[type] || '#909399'
}

function getTypeName(type: number): string {
  const names: Record<number, string> = { 1: '顶节点', 2: '交通节点', 3: '事务中心节点', 4: '公司企业节点' }
  return names[type] || '未知'
}

function getRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const min = 60_000; const hr = 60 * min; const day = 24 * hr; const wk = 7 * day
  if (diff < min) return '刚刚'
  if (diff < hr) return `${Math.floor(diff / min)}分钟前`
  if (diff < day) return `${Math.floor(diff / hr)}小时前`
  if (diff < wk) return `${Math.floor(diff / day)}天前`
  return dateStr.split(' ')[0]
}

// ── 初始化 ──
onMounted(() => {
  fetchTree()
  fetchData()
})
</script>

<style lang="scss" scoped>
.org-management {
  padding: 24px;
  background: linear-gradient(160deg, #F5F7FA 0%, #E8ECF1 100%);
  min-height: 100vh;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;

  .animate-item {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;
    &:nth-child(1) { animation-delay: 0.05s; }
    &:nth-child(2) { animation-delay: 0.15s; }
  }

  // 头部
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    padding: 24px 28px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);

    .header-left h1 {
      font-size: 22px;
      font-weight: 600;
      color: #303133;
      margin: 0 0 8px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .title-bar {
      width: 4px; height: 22px;
      background: linear-gradient(180deg, #409EFF, #66B1FF);
      border-radius: 2px;
      display: inline-block;
    }
    .page-desc { font-size: 13px; color: #909399; padding-left: 14px; }
  }

  // 主内容区：左树右表
  .main-content {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }

  // 左侧树面板
  .tree-panel {
    width: 280px;
    flex-shrink: 0;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    transition: width 0.3s ease;
    overflow: hidden;

    &.collapsed { width: 48px; }

    .tree-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 16px 12px;
      border-bottom: 1px solid #EBEEF5;
    }

    .tree-title {
      font-size: 15px;
      font-weight: 600;
      color: #303133;
    }

    .tree-body {
      padding: 12px;
    }

    .tree-search {
      margin-bottom: 12px;
    }

    .org-tree {
      max-height: calc(100vh - 320px);
      overflow-y: auto;

      :deep(.el-tree-node__content) {
        height: 36px;
        border-radius: 6px;
        margin-bottom: 2px;
      }

      :deep(.el-tree-node.is-current > .el-tree-node__content) {
        background: #ECF5FF;
        color: #409EFF;
      }
    }

    .tree-node {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;

      .node-icon {
        color: #409EFF;
        font-size: 14px;
      }
    }
  }

  // 右侧列表区
  .list-panel {
    flex: 1;
    min-width: 0;
  }

  .current-node-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: #ECF5FF;
    border-radius: 8px;
    margin-bottom: 16px;
    font-size: 13px;
    color: #409EFF;

    strong { color: #303133; }
  }

  .search-card {
    margin-bottom: 16px;
    border-radius: 12px;
    border: none;
    :deep(.el-card__body) { padding: 20px 24px 8px; }
    .el-form-item { margin-bottom: 12px; }
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 0 4px;

    .toolbar-left { display: flex; align-items: center; gap: 12px; }
    .selected-count {
      font-size: 13px; color: #606266; margin-left: 8px;
      strong { color: #409EFF; }
    }
    .total-count {
      font-size: 13px; color: #909399;
      padding: 6px 14px; background: #F0F2F5; border-radius: 6px;
    }
  }

  .table-card {
    border-radius: 12px;
    border: none;
    :deep(.el-card__body) { padding: 20px; }
    :deep(.el-table) {
      border-radius: 8px;
      overflow: hidden;
    }

    .id-text { color: #909399; font-size: 13px; }
    .code-cell { display: flex; align-items: center; gap: 6px; }
    .code-text {
      font-family: 'Monaco','Menlo','Consolas', monospace;
      color: #409EFF; font-size: 12px;
      background: #ECF5FF; padding: 3px 8px; border-radius: 4px;
    }
    .name-text { font-weight: 500; color: #303133; }
    .time-text { font-size: 13px; color: #909399; }
    .empty-tag { color: #C0C4CC; font-size: 13px; }

    .empty-state {
      padding: 48px 0;
      .empty-title { font-size: 16px; color: #606266; margin: 16px 0 8px; }
      .empty-desc { font-size: 13px; color: #909399; }
    }
  }

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
      background: linear-gradient(135deg, #409EFF, #66B1FF);
      padding: 20px 24px; margin: 0;
      .el-dialog__title { color: #fff; font-weight: 600; font-size: 16px; }
      .el-dialog__headerbtn .el-dialog__close { color: rgba(255,255,255,0.8); &:hover { color: #fff; } }
    }
    .el-dialog__body { padding: 28px 24px 12px; }
    .el-dialog__footer { padding: 16px 24px; border-top: 1px solid #EBEEF5; }
  }

  .type-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .type-option-label { font-weight: 500; }
    .type-option-desc { font-size: 12px; color: #909399; }
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
