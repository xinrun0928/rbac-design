<template>
  <div class="dept-management">

    <div class="main-content animate-item">
      <!-- 左侧：组织架构树 -->
      <div class="tree-panel" :class="{ collapsed: treeCollapsed }">
        <template v-if="!treeCollapsed">
          <div class="tree-header">
            <span class="tree-title">组织架构</span>
            <el-button
              :icon="DArrowLeft"
              link
              @click="treeCollapsed = true"
              class="collapse-btn"
            />
          </div>
          <div class="tree-body">
            <el-input
              v-model="treeFilter"
              placeholder="搜索组织名称"
              clearable
              :prefix-icon="Search"
              class="tree-search"
            />
            <el-tree
              ref="treeRef"
              :data="orgTreeData"
              :props="{ label: 'name', children: 'children' }"
              node-key="id"
              highlight-current
              default-expand-all
              :expand-on-click-node="false"
              :filter-node-method="filterTreeNode"
              @node-click="handleNodeClick"
              class="org-tree"
            >
              <template #default="{ data }">
                <div class="tree-node">
                  <el-icon class="node-icon" :style="{ color: getNodeTypeColor(data.nodeType) }">
                    <component :is="getNodeTypeIcon(data.nodeType)" />
                  </el-icon>
                  <span class="node-label">{{ data.name }}</span>
                </div>
              </template>
            </el-tree>
          </div>
        </template>
        <div v-else class="collapsed-body">
          <div class="collapsed-list">
            <div v-for="(item, index) in flatTreeData" :key="index" class="collapsed-item">
              <el-tooltip :content="item.name" placement="right">
                <div class="collapsed-icon-wrapper">
                  <el-tag :type="getLevelTagType(item.level)" size="small" class="level-badge" effect="dark">{{ item.level }}</el-tag>
                  <div class="collapsed-icon" :style="{ background: getNodeTypeColor(item.nodeType) }">
                    <span class="collapsed-char">{{ item.name.charAt(0) }}</span>
                  </div>
                </div>
              </el-tooltip>
            </div>
          </div>
        </div>
        <div v-if="treeCollapsed" class="collapsed-expand-bar">
          <el-tooltip content="展开" placement="right">
            <el-button :icon="DArrowRight" link @click="treeCollapsed = false" class="expand-btn" />
          </el-tooltip>
        </div>
      </div>

      <!-- 右侧：部门列表 -->
      <div class="list-panel">
        <!-- 部门树表格 -->
        <el-card class="table-card" shadow="never">
          <div class="search-bar">
            <span class="search-bar-title">部门管理<span v-if="currentNode" class="current-hint">（当前：{{ currentNode.name }}）</span></span>
            <div class="search-bar-actions">
              <el-input
                v-model="searchForm.deptName"
                placeholder="搜索部门名称"
                clearable
                :prefix-icon="Search"
                style="width: 180px; margin-right: 12px"
                @keyup.enter="handleSearch"
                @clear="handleSearch"
              />
              <el-button type="primary" :icon="Plus" @click="handleAdd(null)" :disabled="!currentNode">新增部门</el-button>
            </div>
          </div>
          <div class="table-wrapper">
          <el-table
            v-loading="loading"
            :data="deptTreeData"
            row-key="deptId"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            border
            stripe
            default-expand-all
            :indent="24"
            :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
            empty-text=" "
          >
            <el-table-column prop="deptName" label="部门名称" min-width="220" fixed>
              <template #default="{ row }">
                <div class="dept-name-cell">
                  <el-icon class="dept-icon" color="#409EFF">
                    <OfficeBuilding />
                  </el-icon>
                  <span class="dept-name">{{ row.deptName }}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="deptCode" label="部门编号" min-width="140" align="center" show-overflow-tooltip>
              <template #default="{ row }">
                <span class="code-text">{{ row.deptCode }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="leader" label="负责人" width="100" align="center">
              <template #default="{ row }">
                <span class="leader-text">{{ row.leader || '-' }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="phone" label="联系电话" width="140" align="center">
              <template #default="{ row }">
                <span class="phone-text">{{ row.phone || '-' }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="email" label="邮箱" min-width="180">
              <template #default="{ row }">
                <span class="email-text">{{ row.email || '-' }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="fax" label="传真" width="140" align="center">
              <template #default="{ row }">
                <span class="fax-text">{{ row.fax || '-' }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="displayOrder" label="排序" width="70" align="center">
              <template #default="{ row }">
                <span class="displayOrder-text">{{ row.displayOrder }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="status" label="状态" width="80" align="center">
              <template #default="{ row }">
                <el-tag
                  :type="row.status === 1101 ? 'success' : 'info'"
                  effect="plain"
                  size="small"
                >
                  {{ row.status === 1101 ? '正常' : '停用' }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="230" align="center" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link :icon="Plus" @click.stop="handleAdd(row)">子部门</el-button>
                <el-button type="primary" link :icon="Edit" @click.stop="handleEdit(row)">编辑</el-button>
                <el-button type="danger" link :icon="Delete" @click.stop="handleDelete(row)">删除</el-button>
              </template>
            </el-table-column>

            <template #empty>
              <div class="empty-state">
                <el-icon :size="64" color="#DCDFE6"><OfficeBuilding /></el-icon>
                <p class="empty-title">暂无部门数据</p>
                <p class="empty-desc">
                  <template v-if="currentNode">
                    点击上方
                    <el-button type="primary" link @click="handleAdd(null)">"新增部门"</el-button>
                    按钮为 {{ currentNode.name }} 添加部门
                  </template>
                  <template v-else>
                    请先在左侧选择一个组织
                  </template>
                </p>
              </div>
            </template>
          </el-table>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 新增/编辑部门抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="isEdit ? '编辑部门' : '新增部门'"
      size="480px"
      direction="rtl"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="90px"
        label-position="right"
        class="dept-form"
      >
        <el-form-item label="上级部门" prop="parentId">
          <el-tree-select
            v-model="formData.parentId"
            :data="parentDeptOptions"
            :props="{ label: 'deptName', value: 'deptId', children: 'children' }"
            check-strictly
            :render-after-expand="false"
            placeholder="请选择上级部门（不选则为顶级）"
            clearable
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model="formData.deptName"
            placeholder="请输入部门名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="部门编号" prop="deptCode">
          <el-input
            v-model="formData.deptCode"
            placeholder="请输入部门编号"
            maxlength="30"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="负责人" prop="leader">
          <el-input
            v-model="formData.leader"
            placeholder="请输入负责人姓名"
            maxlength="20"
          />
        </el-form-item>

        <el-form-item label="联系电话" prop="phone">
          <el-input
            v-model="formData.phone"
            placeholder="请输入联系电话"
            maxlength="20"
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱地址"
          />
        </el-form-item>

        <el-form-item label="传真" prop="fax">
          <el-input
            v-model="formData.fax"
            placeholder="请输入传真号码"
            maxlength="20"
          />
        </el-form-item>

        <el-form-item label="排序" prop="displayOrder">
          <el-input-number
            v-model="formData.displayOrder"
            :min="0"
            :max="9999"
            style="width: 180px"
          />
          <span class="form-tip-inline">数值越小越靠前</span>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">停用</el-radio>
          </el-radio-group>
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
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type ElTree from 'element-plus/es/components/tree'
import {
  Refresh, Search, RefreshLeft, Plus, Delete, Edit,
  OfficeBuilding, Location, DArrowLeft, DArrowRight
} from '@element-plus/icons-vue'
import { orgTreeData } from '@/mock/admin/orgTreeData'
import { deptData as mockDeptData, buildDeptTree, flattenDeptData } from '@/mock/admin/deptData'
import type { OrgTreeNode } from '@/types/admin/orgTree'
import type { DeptItem } from '@/mock/admin/deptData'

// 部门表单接口
interface DeptForm {
  deptId: number
  parentId: number
  deptName: string
  deptCode: string
  leader: string
  phone: string
  email: string
  fax: string
  displayOrder: number
  status: number
}

// ── 状态 ──
const loading = ref(false)
const submitLoading = ref(false)
const deptDataList = ref<DeptItem[]>([])
const treeRef = ref<InstanceType<typeof ElTree>>()
const treeCollapsed = ref(false)
const treeFilter = ref('')
const currentNode = ref<OrgTreeNode | null>(null)
const drawerVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const searchForm = reactive({
  deptName: '',
  status: '' as string | number
})

const formData = reactive<DeptForm>({
  deptId: 0,
  parentId: 0,
  deptName: '',
  deptCode: '',
  leader: '',
  phone: '',
  email: '',
  fax: '',
  displayOrder: 0,
  status: 1101
})

// ── 表单验证规则 ──
const formRules: FormRules = {
  deptName: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  deptCode: [{ required: true, message: '请输入部门编号', trigger: 'blur' }],
  displayOrder: [{ required: true, message: '请输入排序值', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
}

// ── 计算属性：部门树形数据 ──
const deptTreeData = computed(() => {
  let data = mockDeptData
  // 如果有搜索条件，过滤数据
  if (searchForm.deptName || searchForm.status !== '') {
    const flatData = flattenDeptData(data)
    const filtered = flatData.filter(item => {
      const nameMatch = !searchForm.deptName || item.deptName.includes(searchForm.deptName)
      const statusMatch = searchForm.status === '' || searchForm.status === undefined || item.status === searchForm.status
      return nameMatch && statusMatch
    })
    data = buildDeptTree(filtered)
  }
  return data
})

// 父级部门选项
const parentDeptOptions = computed(() => {
  return [{ deptId: 0, deptName: '顶级部门', children: mockDeptData }]
})

interface FlatTreeNode {
  name: string
  nodeType: string
  level: number
}

const flatTreeData = computed(() => {
  function flatten(nodes: OrgTreeNode[], level: number): FlatTreeNode[] {
    const result: FlatTreeNode[] = []
    for (const node of nodes) {
      result.push({ name: node.name, nodeType: node.nodeType, level })
      if (node.children && node.children.length > 0) {
        result.push(...flatten(node.children, level + 1))
      }
    }
    return result
  }
  return flatten(orgTreeData, 1)
})

function getLevelTagType(level: number): 'info' | 'success' | 'warning' | 'danger' | '' {
  const types: Record<number, any> = {
    1: 'danger',
    2: 'warning',
    3: '',
    4: 'success',
    5: 'info'
  }
  return types[level] || 'info'
}

// ── 方法 ──

function fetchDeptData() {
  loading.value = true
  try {
    deptDataList.value = flattenDeptData(mockDeptData)
  } finally {
    loading.value = false
  }
}

function handleNodeClick(data: OrgTreeNode) {
  currentNode.value = data
}

function filterTreeNode(value: string, data: OrgTreeNode): boolean {
  if (!value) return true
  return data.name.includes(value)
}

watch(treeFilter, (val) => {
  treeRef.value?.filter(val)
})

function handleSearch() {
  // 搜索通过 computed 属性自动处理
}

function handleReset() {
  searchForm.deptName = ''
  searchForm.status = ''
}

function handleRefresh() {
  fetchDeptData()
}

function getNodeTypeIcon(nodeType: string) {
  const icons: Record<string, any> = {
    root: OfficeBuilding,
    dept: OfficeBuilding,
    branch: OfficeBuilding,
    station: OfficeBuilding,
    company: OfficeBuilding
  }
  return icons[nodeType] || OfficeBuilding
}

function getNodeTypeColor(nodeType: string): string {
  const colors: Record<string, string> = {
    root: '#409EFF',
    dept: '#67C23A',
    branch: '#E6A23C',
    station: '#9B59B6',
    company: '#F56C6C'
  }
  return colors[nodeType] || '#909399'
}

function handleAdd(parentRow: DeptItem | null) {
  isEdit.value = false
  formData.deptId = 0
  formData.parentId = parentRow ? parentRow.deptId : 0
  formData.deptName = ''
  formData.deptCode = ''
  formData.leader = ''
  formData.phone = ''
  formData.email = ''
  formData.fax = ''
  formData.displayOrder = 0
  formData.status = 1101
  drawerVisible.value = true
}

function handleEdit(row: DeptItem) {
  isEdit.value = true
  formData.deptId = row.deptId
  formData.parentId = row.parentId
  formData.deptName = row.deptName
  formData.deptCode = row.deptCode
  formData.leader = row.leader
  formData.phone = row.phone
  formData.email = row.email
  formData.fax = row.fax
  formData.displayOrder = row.displayOrder
  formData.status = row.status
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

function handleDelete(row: DeptItem) {
  ElMessageBox.confirm(
    `确定要删除部门 "${row.deptName}" 吗？删除后其子部门也将被删除。`,
    '确认删除',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    ElMessage.success('删除成功')
    fetchDeptData()
  }).catch(() => {})
}

function resetForm() {
  formRef.value?.resetFields()
}

// ── 初始化 ──
onMounted(() => {
  fetchDeptData()
  // 默认选中广东省交通运输厅
  if (orgTreeData.length > 0) {
    currentNode.value = orgTreeData[0]
    nextTick(() => {
      treeRef.value?.setCurrentKey(1)
    })
  }
})
</script>

<style lang="scss" scoped>
.dept-management {
  padding: 0;
  background: linear-gradient(160deg, #F5F7FA 0%, #E8ECF1 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;

  .animate-item {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;
    &:nth-child(1) { animation-delay: 0.05s; }
    &:nth-child(2) { animation-delay: 0.15s; }
  }

  // 头部

  // 主内容区：左树右表
  .main-content {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    flex: 1;
    overflow: hidden;
  }

  // 左侧树面板
  .tree-panel {
    width: 280px;
    flex-shrink: 0;
    align-self: stretch;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.04);
    transition: width 0.3s ease;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    &.collapsed {
      width: 72px;
      align-items: center;

      .tree-header {
        padding: 16px 8px;
        justify-content: center;
      }

      .collapsed-body {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 12px 4px;
        gap: 8px;
        flex: 1;
        overflow: hidden;

        .collapsed-list {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;

          &::-webkit-scrollbar {
            width: 0;
            height: 0;
          }
        }

        .collapsed-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .collapsed-icon-wrapper {
          position: relative;
        }

        .level-badge {
          position: absolute;
          top: -7px;
          right: -7px;
          z-index: 1;
          font-size: 9px;
          padding: 0 4px;
          height: 16px;
          line-height: 16px;
          min-width: 16px;
          text-align: center;
          border: none;
        }

        .collapsed-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: opacity 0.2s;

          &:hover { opacity: 0.85; }

          .collapsed-char {
            font-size: 14px;
            font-weight: 600;
            color: #fff;
            line-height: 1;
          }
        }

      }
    }

    .collapsed-expand-bar {
      flex-shrink: 0;
      display: flex;
      justify-content: center;
      padding: 8px 0 12px;
      width: 100%;

      .expand-btn {
        color: #909399;
        font-size: 18px;
      }
    }

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

    .tree-search {
      margin-bottom: 12px;
    }

    .tree-body {
      padding: 12px;
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .org-tree {
      flex: 1;
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
        font-size: 14px;
      }
    }
  }

  // 右侧列表区
  .list-panel {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
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

    .current-hint {
      font-weight: 400;
      font-size: 13px;
      color: #409EFF;
    }
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

    .table-wrapper {
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      // 隐藏滚动条
      &::-webkit-scrollbar {
        width: 0;
        height: 0;
      }
    }

    :deep(.el-table) {
      border-radius: 8px;
      flex: 1;

      .el-table__body-wrapper {
        overflow-y: auto;

        // 隐藏滚动条
        &::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
      }


      .el-table__row .cell {
        display: flex;
        align-items: center;
      }

      .el-table__row .el-table__cell:not(:first-child) .cell {
        justify-content: center;
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

    .dept-name-cell {
      display: flex;
      align-items: center;
      gap: 8px;

      .dept-icon {
        font-size: 16px;
        flex-shrink: 0;
      }

      .dept-name {
        font-weight: 500;
        color: #303133;
      }
    }

    .code-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 12px;
      color: #606266;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block;
    }

    .leader-text { font-weight: 500; color: #303133; }
    .phone-text { font-family: 'Monaco', 'Menlo', 'Consolas', monospace; font-size: 13px; color: #606266; }
    .email-text { font-size: 13px; color: #606266; }
    .fax-text { font-family: 'Monaco', 'Menlo', 'Consolas', monospace; font-size: 13px; color: #606266; }
    .displayOrder-text { font-weight: 600; color: #606266; }

    .empty-state {
      padding: 48px 0;
      .empty-title { font-size: 16px; color: #606266; margin: 16px 0 8px; }
      .empty-desc { font-size: 13px; color: #909399; }
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

  // 表单
  .dept-form {
    .el-form-item {
      margin-bottom: 20px;
    }

    .form-tip-inline {
      font-size: 12px;
      color: #909399;
      margin-left: 12px;
    }
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
