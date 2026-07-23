<template>
  <div class="org-management">

    <!-- 组织树表格 -->
    <el-card class="table-card animate-item" shadow="never">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="组织名称">
            <el-input v-model="searchForm.name" placeholder="输入组织名称" clearable :prefix-icon="Search" style="width: 200px" @keyup.enter="handleSearch" />
          </el-form-item>
          <el-form-item label="套餐类型">
            <el-select v-model="searchForm.packageType" placeholder="请选择类型" clearable style="width: 160px">
              <el-option v-for="item in mealTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="search-actions">
          <el-button type="primary" :icon="Plus" @click="handleAdd(null)">新增组织</el-button>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="orgTreeData"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600' }"
        border
        stripe
        default-expand-all
        :indent="24"
        empty-text=" "
      >
        <el-table-column prop="name" label="组织名称" min-width="280" fixed>
          <template #default="{ row }">
            <div class="org-name-cell">
              <el-icon class="org-icon" :style="{ color: getPackageColor(row.packageName) }">
                <OfficeBuilding />
              </el-icon>
              <span class="org-name">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="packageName" label="套餐名称" width="140" align="center">
          <template #default="{ row }">
            <el-tag :color="getPackageColor(row.packageName)" effect="dark" style="border: none; color: #fff;" size="small" round>
              {{ row.packageName }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="packageType" label="套餐类型" width="110" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="getPackageTypeTagType(row.packageType)" effect="plain">
              {{ getPackageTypeLabel(row.packageType) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="areaName" label="归属地区" width="120" align="center">
          <template #default="{ row }">
            <span class="area-text">{{ row.areaName || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="leader" label="负责人" width="100" align="center">
          <template #default="{ row }">
            <span class="leader-text">{{ row.leader || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="contactPhone" label="联系电话" width="130" align="center">
          <template #default="{ row }">
            <span class="phone-text">{{ row.contactPhone || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="email" label="邮箱" min-width="160">
          <template #default="{ row }">
            <span class="email-text">{{ row.email || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="members" label="成员数" width="80" align="center">
          <template #default="{ row }">
            <span class="count-text">{{ row.members?.length || 0 }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Plus" @click="handleAdd(row)">新增子集</el-button>
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑组织抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="isEdit ? '编辑组织' : '新增组织'"
      size="500px"
      direction="rtl"
      :before-close="handleDrawerClose"
      class="org-drawer"
    >
      <el-form ref="formRef" :model="formData" label-width="110px" label-position="right">
        <el-form-item label="上级节点" prop="parentId">
          <el-tree-select
            v-model="formData.parentId"
            :data="parentTreeData"
            :props="{ label: 'name', value: 'id', children: 'children' }"
            placeholder="请选择上级节点（不选则为顶级）"
            clearable
            check-strictly
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="组织名称" prop="name" :rules="[{ required: true, message: '请输入组织名称', trigger: 'blur' }]">
          <el-input v-model="formData.name" placeholder="请输入组织名称" maxlength="100" show-word-limit />
        </el-form-item>

        <el-form-item label="归属地区" prop="areaCode">
          <el-cascader
            v-model="formData.areaCode"
            :options="areaOptions"
            :props="{ label: 'areaName', value: 'areaCode', children: 'children' }"
            placeholder="请选择归属地区"
            clearable
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="套餐类型" prop="packageType" :rules="[{ required: true, message: '请选择套餐类型', trigger: 'change' }]">
          <el-select v-model="formData.packageType" placeholder="请选择套餐类型" style="width: 100%" @change="handlePackageTypeChange">
            <el-option v-for="item in mealTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="套餐名称" prop="packageName" :rules="[{ required: true, message: '请选择套餐名称', trigger: 'change' }]">
          <el-select :model-value="formData.packageName" placeholder="请选择套餐名称" style="width: 100%" :disabled="!formData.packageType" @update:model-value="handlePackageNameUpdate">
            <el-option v-for="item in packageLabelOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>

        <!-- 根据套餐类型显示不同的关联字段 -->
        <template v-if="formData.packageType === 2 || formData.packageType === 3 || formData.packageType === 4">
          <el-form-item label="上级地市交通" prop="parentCityOrgId">
            <el-select v-model="formData.parentCityOrgId" placeholder="请选择上级地市交通组织" clearable style="width: 100%">
              <el-option v-for="item in cityOrgOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </template>

        <template v-if="formData.packageType === 3 || formData.packageType === 4">
          <el-form-item label="上级事务中心" prop="parentAffairOrgId">
            <el-select v-model="formData.parentAffairOrgId" placeholder="请选择上级事务中心组织" clearable style="width: 100%">
              <el-option v-for="item in affairOrgOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </template>

        <template v-if="formData.packageType === 4">
          <el-form-item label="上级公司企业" prop="parentCompanyOrgId">
            <el-select v-model="formData.parentCompanyOrgId" placeholder="请选择上级公司企业组织" clearable style="width: 100%">
              <el-option v-for="item in companyOrgOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </template>

        <el-form-item label="负责人" prop="leader">
          <el-input v-model="formData.leader" placeholder="请输入负责人" />
        </el-form-item>

        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="formData.contactPhone" placeholder="请输入联系电话" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="备注" prop="description">
          <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入备注" maxlength="200" show-word-limit />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
            {{ isEdit ? '保存修改' : '确认创建' }}
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import {
  Refresh, Search, RefreshLeft, Plus, Delete, Edit,
  OfficeBuilding
} from '@element-plus/icons-vue'
import type { OrgTreeNode } from '../types/orgTree'
import { orgTreeData as rawOrgTreeData } from '../mock/orgTreeData'
import { mealTypeOptions, mealNameOptions } from '../mock/mealData'
import { areaData } from '../mock/areaData'

// ── 状态 ──
const loading = ref(false)
const submitLoading = ref(false)
const orgList = ref<OrgTreeNode[]>([])
const drawerVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const searchForm = reactive({
  name: '',
  packageType: null as number | null
})

const formData = reactive({
  id: 0,
  parentId: 0,
  packageType: null as number | null,
  packageName: '',
  areaCode: [] as string[],
  name: '',
  leader: '',
  contactPhone: '',
  email: '',
  description: '',
  parentCityOrgId: null as number | null,
  parentAffairOrgId: null as number | null,
  parentCompanyOrgId: null as number | null
})

// 地区选项
const areaOptions = computed(() => areaData)

// 套餐名称选项
const packageLabelOptions = computed(() => {
  if (!formData.packageType) return []
  return mealNameOptions[formData.packageType] || []
})

// 获取所有节点的扁平列表
function flattenTree(nodes: OrgTreeNode[]): OrgTreeNode[] {
  const result: OrgTreeNode[] = []
  function traverse(items: OrgTreeNode[]) {
    for (const item of items) {
      result.push(item)
      if (item.children) {
        traverse(item.children)
      }
    }
  }
  traverse(nodes)
  return result
}

// 地市交通组织选项
const cityOrgOptions = computed(() => {
  const allNodes = flattenTree(rawOrgTreeData)
  return allNodes.filter(n => n.packageName === '市交通' || n.packageName === '交通')
})

// 事务中心组织选项
const affairOrgOptions = computed(() => {
  const allNodes = flattenTree(rawOrgTreeData)
  return allNodes.filter(n => n.packageName === '事务中心' || n.packageName === '省事务中心' || n.packageName === '市事务中心')
})

// 公司企业组织选项
const companyOrgOptions = computed(() => {
  const allNodes = flattenTree(rawOrgTreeData)
  return allNodes.filter(n => n.packageName === '公司' || n.packageName === '省交通公司')
})

// 上级节点树数据
const parentTreeData = computed(() => {
  return [{ id: 0, name: '（顶级组织）', children: rawOrgTreeData }]
})

// 组织树数据（带搜索过滤）
const orgTreeData = computed(() => {
  let data = rawOrgTreeData
  if (searchForm.name || searchForm.packageType !== null) {
    const flatData = flattenTree(data)
    const filtered = flatData.filter(item => {
      const nameMatch = !searchForm.name || item.name.includes(searchForm.name)
      const typeMatch = searchForm.packageType === null || getTypeFromPackageName(item.packageName) === searchForm.packageType
      return nameMatch && typeMatch
    })
    data = buildTree(filtered)
  }
  return data
})

// 构建树结构
function buildTree(data: OrgTreeNode[]): OrgTreeNode[] {
  const map = new Map<number, OrgTreeNode>()
  const roots: OrgTreeNode[] = []

  data.forEach(item => {
    map.set(item.id, { ...item, children: [] })
  })

  data.forEach(item => {
    const node = map.get(item.id)!
    // 找到父节点
    const parent = findParent(item, data)
    if (parent && map.has(parent.id)) {
      map.get(parent.id)!.children!.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}

// 找到父节点
function findParent(node: OrgTreeNode, allNodes: OrgTreeNode[]): OrgTreeNode | null {
  // 根据层级关系找到父节点
  const nodeIndex = allNodes.findIndex(n => n.id === node.id)
  for (let i = nodeIndex - 1; i >= 0; i--) {
    if (allNodes[i].id < node.id) {
      return allNodes[i]
    }
  }
  return null
}

// 根据套餐名称获取类型
function getTypeFromPackageName(packageName: string): number {
  for (const [type, names] of Object.entries(mealNameOptions)) {
    if (names.includes(packageName)) {
      return Number(type)
    }
  }
  return 0
}

// ── 方法 ──
function fetchData() {
  loading.value = true
  try {
    orgList.value = flattenTree(rawOrgTreeData)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  fetchData()
}

function handleReset() {
  searchForm.name = ''
  searchForm.packageType = null
  fetchData()
}

function handleRefresh() {
  searchForm.name = ''
  searchForm.packageType = null
  fetchData()
}

function handleAdd(parentRow: OrgTreeNode | null) {
  isEdit.value = false
  formData.id = 0
  formData.parentId = parentRow?.id || 0
  formData.packageType = null
  formData.packageName = ''
  formData.areaCode = []
  formData.name = ''
  formData.leader = ''
  formData.contactPhone = ''
  formData.email = ''
  formData.description = ''
  formData.parentCityOrgId = null
  formData.parentAffairOrgId = null
  formData.parentCompanyOrgId = null
  drawerVisible.value = true
}

function handleEdit(row: OrgTreeNode) {
  isEdit.value = true
  formData.id = row.id
  formData.parentId = 0
  const packageName = row.packageName
  let packageType = null
  for (const [type, names] of Object.entries(mealNameOptions)) {
    if (names.includes(packageName)) {
      packageType = Number(type)
      break
    }
  }
  formData.packageType = packageType
  formData.packageName = packageName
  formData.areaCode = []
  formData.name = row.name
  formData.leader = ''
  formData.contactPhone = ''
  formData.email = ''
  formData.description = row.description
  formData.parentCityOrgId = null
  formData.parentAffairOrgId = null
  formData.parentCompanyOrgId = null
  drawerVisible.value = true
}

function handleDelete(row: OrgTreeNode) {
  ElMessageBox.confirm(
    `确定要删除组织 "${row.name}" 吗？`,
    '确认删除',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    ElMessage.success('删除成功')
    fetchData()
  }).catch(() => {})
}

function handlePackageTypeChange() {
  formData.packageName = ''
  formData.parentCityOrgId = null
  formData.parentAffairOrgId = null
  formData.parentCompanyOrgId = null
}

function handlePackageNameUpdate(value: string) {
  formData.packageName = value
  formData.parentCityOrgId = null
  formData.parentAffairOrgId = null
  formData.parentCompanyOrgId = null
}

function handleDrawerClose(done: () => void) {
  formRef.value?.resetFields()
  done()
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

function getPackageColor(packageName: string): string {
  const colors: Record<string, string> = {
    '省交通本级': '#409EFF',
    '交通': '#67C23A',
    '市交通': '#E6A23C',
    '县交通': '#F56C6C',
    '省事务中心': '#9B59B6',
    '事务中心': '#1ABC9C',
    '市事务中心': '#3498DB',
    '县事务中心': '#2ECC71',
    '省交通公司': '#E74C3C',
    '公司': '#F39C12',
    '监控中心': '#8E44AD',
    '高速公路': '#16A085',
    '普通公路': '#27AE60'
  }
  return colors[packageName] || '#909399'
}

function getNodeTypeLabel(nodeType: string): string {
  const labels: Record<string, string> = {
    root: '根节点',
    dept: '部门',
    branch: '分支',
    station: '站点',
    company: '企业'
  }
  return labels[nodeType] || '未知'
}

function getNodeTypeTagType(nodeType: string): '' | 'success' | 'warning' | 'info' | 'danger' {
  const types: Record<string, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    root: '',
    dept: 'success',
    branch: 'warning',
    station: 'info',
    company: 'danger'
  }
  return types[nodeType] || 'info'
}

function getPackageTypeLabel(packageType?: number): string {
  const labels: Record<number, string> = {
    1: '顶节点',
    2: '交通节点',
    3: '事务中心',
    4: '公司企业'
  }
  return packageType ? labels[packageType] || '未知' : '未知'
}

function getPackageTypeTagType(packageType?: number): '' | 'success' | 'warning' | 'info' | 'danger' {
  const types: Record<number, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    1: '',
    2: 'success',
    3: 'warning',
    4: 'danger'
  }
  return packageType ? types[packageType] || 'info' : 'info'
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.org-management {
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

    :deep(.el-table) {
      flex: 1;
      --el-table-row-hover-bg-color: #f5f7fa;
      border-radius: 8px;
      overflow: hidden;

      .el-table__row .cell {
        padding: 0 12px;
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

    .org-name-cell {
      display: flex;
      align-items: center;
      gap: 8px;

      .org-icon {
        font-size: 16px;
        flex-shrink: 0;
      }

      .org-name {
        font-weight: 500;
        color: #303133;
      }
    }

    .desc-text {
      font-size: 13px;
      color: #909399;
    }

    .count-text {
      font-size: 13px;
      color: #606266;
    }
  }

  :deep(.org-drawer) {
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
      margin-top: auto;
    }
  }
}

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
