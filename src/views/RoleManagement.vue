<template>
  <div class="role-management">
    <!-- 页面头部 -->
    <div class="page-header animate-item">
      <div class="header-left">
        <h1><span class="title-bar"></span>角色管理</h1>
        <span class="page-desc">管理系统角色，配置角色菜单权限</span>
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
      </div>

      <!-- 右侧：角色列表区域 -->
      <div class="list-panel">
        <!-- 当前选中提示 -->
        <div v-if="currentNode" class="current-node-bar">
          <el-icon><Location /></el-icon>
          <span>当前组织：<strong>{{ currentNode.name }}</strong></span>
          <el-tag size="small" :type="getNodeTypeTagType(currentNode.nodeType)" effect="plain">
            {{ getNodeTypeLabel(currentNode.nodeType) }}
          </el-tag>
        </div>

        <!-- 组织套餐标签 -->
        <div v-if="currentNode" class="package-tags-bar">
          <span class="tags-label">关联套餐：</span>
          <el-tag
            v-if="currentNode.packageName"
            :color="getPackageColor(currentNode.packageName)"
            effect="dark"
            style="border: none; color: #fff;"
            size="small"
          >
            {{ currentNode.packageName }}
          </el-tag>
          <span v-else class="no-package">未关联套餐</span>
        </div>

        <!-- 工具栏 -->
        <div class="toolbar">
          <div class="toolbar-left">
            <el-button type="primary" :icon="Plus" @click="handleAddRole" :disabled="!currentNode">新增角色</el-button>
          </div>
          <div class="toolbar-right">
            <span class="total-count">共 {{ roleList.length }} 个角色</span>
          </div>
        </div>

        <!-- 角色列表 -->
        <el-card class="table-card" shadow="never">
          <el-table
            v-loading="loading"
            :data="roleList"
            border
            stripe
            highlight-current-row
            row-key="roleId"
            :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600' }"
            empty-text=" "
          >
            <el-table-column prop="roleId" label="ID" width="70" align="center">
              <template #default="{ row }">
                <span class="id-text">{{ row.roleId }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="roleName" label="角色名称" min-width="150">
              <template #default="{ row }">
                <div class="role-name-cell">
                  <el-icon :style="{ color: row.isSystem ? '#E6A23C' : '#67C23A' }">
                    <component :is="row.isSystem ? 'Lock' : 'User'" />
                  </el-icon>
                  <span class="name-text">{{ row.roleName }}</span>
                  <el-tag v-if="row.isSystem" size="small" type="warning" effect="plain">系统</el-tag>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="description" label="角色描述" min-width="200">
              <template #default="{ row }">
                <span class="desc-text">{{ row.description || '-' }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="menuCount" label="菜单权限" width="120" align="center">
              <template #default="{ row }">
                <el-tag size="small" effect="plain">{{ row.menuCount }} 个菜单</el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="memberCount" label="关联成员" width="100" align="center">
              <template #default="{ row }">
                <span class="count-text">{{ row.memberCount }} 人</span>
              </template>
            </el-table-column>

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

            <el-table-column label="操作" width="180" align="center" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link :icon="Edit" @click="handleEditRole(row)">编辑</el-button>
                <el-button type="primary" link :icon="Setting" @click="handleConfigMenu(row)">配置菜单</el-button>
                <el-button
                  type="danger"
                  link
                  :icon="Delete"
                  :disabled="row.isSystem"
                  @click="handleDeleteRole(row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>

            <template #empty>
              <div class="empty-state">
                <el-icon :size="64" color="#DCDFE6"><User /></el-icon>
                <p class="empty-title">暂无角色数据</p>
                <p class="empty-desc">
                  <template v-if="currentNode">
                    点击上方
                    <el-button type="primary" link @click="handleAddRole">"新增角色"</el-button>
                    按钮为 {{ currentNode.name }} 创建角色
                  </template>
                  <template v-else>
                    请先在左侧选择一个组织
                  </template>
                </p>
              </div>
            </template>
          </el-table>
        </el-card>
      </div>
    </div>

    <!-- 新增/编辑角色抽屉 -->
    <el-drawer
      v-model="roleDrawerVisible"
      :title="isRoleEdit ? '编辑角色' : '新增角色'"
      size="420px"
      direction="rtl"
      :before-close="handleRoleDrawerClose"
      class="role-drawer"
    >
      <el-form
        ref="roleFormRef"
        :model="roleFormData"
        label-width="90px"
        label-position="right"
        class="role-form"
      >
        <el-form-item label="角色名称" prop="roleName" :rules="[{ required: true, message: '请输入角色名称', trigger: 'blur' }]">
          <el-input v-model="roleFormData.roleName" placeholder="请输入角色名称" maxlength="30" show-word-limit />
        </el-form-item>

        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="roleFormData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="roleFormData.status">
            <el-radio :value="1101">
              <el-icon color="#67C23A"><SuccessFilled /></el-icon> 正常
            </el-radio>
            <el-radio :value="1102">
              <el-icon color="#909399"><CircleCloseFilled /></el-icon> 停用
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="roleDrawerVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitRole">确认</el-button>
        </div>
      </template>
    </el-drawer>

    <!-- 配置菜单抽屉 -->
    <el-drawer
      v-model="menuDrawerVisible"
      :title="`配置菜单 - ${currentRole?.roleName || ''}`"
      size="500px"
      direction="rtl"
      class="menu-drawer"
    >
      <div class="menu-config-content">
        <!-- 组织套餐信息 -->
        <div class="package-info">
          <span class="info-label">组织套餐：</span>
          <el-tag
            v-if="currentNode?.packageName"
            :color="getPackageColor(currentNode.packageName)"
            effect="dark"
            style="border: none; color: #fff;"
            size="small"
          >
            {{ currentNode.packageName }}
          </el-tag>
          <span v-else class="no-package">未关联套餐</span>
        </div>

        <!-- 菜单树 -->
        <div class="menu-tree-container">
          <div class="tree-header">
            <span class="tree-title">菜单权限</span>
            <el-checkbox v-model="menuExpandAll" @change="handleExpandAll">全部展开</el-checkbox>
          </div>
          <el-tree
            ref="menuTreeRef"
            :data="menuTreeData"
            :props="{ label: 'menuName', children: 'children' }"
            node-key="menuId"
            show-checkbox
            default-expand-all
            :default-checked-keys="checkedMenuIds"
            :check-strictly="true"
            class="menu-tree"
          >
            <template #default="{ data }">
              <div class="menu-tree-node">
                <el-icon :style="{ color: getMenuTypeColor(data.menuType) }">
                  <component :is="getMenuTypeIcon(data.menuType)" />
                </el-icon>
                <span class="menu-name">{{ data.menuName }}</span>
                <el-tag
                  size="small"
                  :type="getMenuTypeTagType(data.menuType)"
                  effect="plain"
                  style="margin-left: 8px; font-size: 10px;"
                >
                  {{ getMenuTypeLabel(data.menuType) }}
                </el-tag>
              </div>
            </template>
          </el-tree>
        </div>
      </div>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="menuDrawerVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitMenu" :disabled="currentRole?.isSystem">保存配置</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type ElTree from 'element-plus/es/components/tree'
import {
  Refresh, Search, Plus, Delete, Edit, Setting,
  SuccessFilled, CircleCloseFilled,
  OfficeBuilding, Location, DArrowLeft, DArrowRight, User, Lock
} from '@element-plus/icons-vue'
import { orgTreeData } from '../mock/orgTreeData'
import { mockMenuData } from '../mock/menuData'
import type { OrgTreeNode } from '../types/orgTree'
import type { Menu } from '../types/menu'
import { buildMenuTree } from '../utils/menuMockApi'

// 角色接口
interface RoleItem {
  roleId: number
  roleName: string
  description: string
  orgId: number
  orgName: string
  isSystem: boolean
  menuCount: number
  memberCount: number
  status: number
  menuIds: number[]
}

// ── 状态 ──
const loading = ref(false)
const treeRef = ref<InstanceType<typeof ElTree>>()
const menuTreeRef = ref<InstanceType<typeof ElTree>>()
const treeCollapsed = ref(false)
const treeFilter = ref('')
const currentNode = ref<OrgTreeNode | null>(null)
const roleDrawerVisible = ref(false)
const isRoleEdit = ref(false)
const roleFormRef = ref<FormInstance>()
const menuDrawerVisible = ref(false)
const currentRole = ref<RoleItem | null>(null)
const menuExpandAll = ref(true)

const allRoles = ref<RoleItem[]>([])
const checkedMenuIds = ref<number[]>([])

// 根据当前选中节点筛选角色
const roleList = computed(() => {
  if (!currentNode.value) return []
  return allRoles.value.filter(r => r.orgId === currentNode.value!.id)
})

const roleFormData = reactive({
  roleId: 0,
  roleName: '',
  description: '',
  status: 1101
})

// ── 树节点筛选 ──
watch(treeFilter, (val) => {
  treeRef.value?.filter(val)
})

// ── 菜单树数据 ──
const menuTreeData = computed(() => {
  return buildMenuTree(mockMenuData)
})

// ── 方法 ──
function fetchRoleData() {
  loading.value = true
  try {
    // 为每个组织生成角色数据
    const roles: RoleItem[] = []
    let roleIdCounter = 1

    function processNode(node: OrgTreeNode) {
      // 每个组织都有系统管理员角色
      roles.push({
        roleId: roleIdCounter++,
        roleName: '系统管理员',
        description: '拥有所有菜单权限，不可修改菜单配置',
        orgId: node.id,
        orgName: node.name,
        isSystem: true,
        menuCount: mockMenuData.length,
        memberCount: Math.floor(Math.random() * 5) + 1,
        status: 1101,
        menuIds: mockMenuData.map(m => m.menuId)
      })

      // 根据套餐添加其他角色
      if (node.packageName) {
        roles.push({
          roleId: roleIdCounter++,
          roleName: '运维工程师',
          description: '负责系统运维和技术支持',
          orgId: node.id,
          orgName: node.name,
          isSystem: false,
          menuCount: Math.floor(Math.random() * 10) + 5,
          memberCount: Math.floor(Math.random() * 3) + 1,
          status: 1101,
          menuIds: [1, 2, 3, 10, 11]
        })
        roles.push({
          roleId: roleIdCounter++,
          roleName: '普通用户',
          description: '基本操作权限',
          orgId: node.id,
          orgName: node.name,
          isSystem: false,
          menuCount: Math.floor(Math.random() * 5) + 2,
          memberCount: Math.floor(Math.random() * 10) + 3,
          status: 1101,
          menuIds: [1, 2]
        })
      }

      if (node.children) {
        node.children.forEach(processNode)
      }
    }

    orgTreeData.forEach(processNode)
    allRoles.value = roles
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

function handleRefresh() {
  fetchRoleData()
}

function getNodeTypeIcon(nodeType: string) {
  return OfficeBuilding
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

function getMenuTypeColor(menuType: number): string {
  const colors: Record<number, string> = {
    0: '#409EFF',
    1: '#67C23A',
    2: '#F56C6C',
    99: '#E6A23C'
  }
  return colors[menuType] || '#909399'
}

function getMenuTypeIcon(menuType: number) {
  return OfficeBuilding
}

function getMenuTypeLabel(menuType: number): string {
  const labels: Record<number, string> = {
    0: '目录',
    1: '菜单',
    2: '权限',
    99: '导航'
  }
  return labels[menuType] || '未知'
}

function getMenuTypeTagType(menuType: number): '' | 'success' | 'warning' | 'info' | 'danger' {
  const types: Record<number, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    0: '',
    1: 'success',
    2: 'danger',
    99: 'warning'
  }
  return types[menuType] || 'info'
}

function handleAddRole() {
  isRoleEdit.value = false
  roleFormData.roleId = 0
  roleFormData.roleName = ''
  roleFormData.description = ''
  roleFormData.status = 1101
  roleDrawerVisible.value = true
}

function handleEditRole(row: RoleItem) {
  isRoleEdit.value = true
  roleFormData.roleId = row.roleId
  roleFormData.roleName = row.roleName
  roleFormData.description = row.description
  roleFormData.status = row.status
  roleDrawerVisible.value = true
}

function handleSubmitRole() {
  if (!roleFormRef.value) return
  roleFormRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success(isRoleEdit.value ? '编辑成功' : '新增成功')
      roleDrawerVisible.value = false
      fetchRoleData()
    }
  })
}

function handleDeleteRole(row: RoleItem) {
  if (row.isSystem) {
    ElMessage.warning('系统管理员角色不可删除')
    return
  }
  ElMessageBox.confirm(
    `确定要删除角色 "${row.roleName}" 吗？`,
    '确认删除',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    ElMessage.success('删除成功')
    fetchRoleData()
  }).catch(() => {})
}

function handleConfigMenu(row: RoleItem) {
  currentRole.value = row
  checkedMenuIds.value = row.menuIds
  menuDrawerVisible.value = true
}

function handleExpandAll(val: boolean) {
  if (menuTreeRef.value) {
    const nodes = menuTreeRef.value.store.root.childNodes
    nodes.forEach((node: any) => {
      node.expanded = val
    })
  }
}

function handleSubmitMenu() {
  if (!menuTreeRef.value) return
  const checkedKeys = menuTreeRef.value.getCheckedKeys()
  const halfCheckedKeys = menuTreeRef.value.getHalfCheckedKeys()
  const allKeys = [...checkedKeys, ...halfCheckedKeys]

  ElMessage.success('菜单配置保存成功')
  menuDrawerVisible.value = false
  fetchRoleData()
}

function handleRoleDrawerClose() {
  roleFormRef.value?.resetFields()
}

// ── 初始化 ──
onMounted(() => {
  fetchRoleData()
  // 默认选中广东省交通运输厅
  if (orgTreeData.length > 0) {
    currentNode.value = orgTreeData[0]
  }
})
</script>

<style lang="scss" scoped>
.role-management {
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
    margin-bottom: 12px;
    font-size: 13px;
    color: #409EFF;

    strong { color: #303133; }
  }

  .package-tags-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: #FFF7E6;
    border-radius: 8px;
    margin-bottom: 16px;
    font-size: 13px;
    color: #D46B08;

    .tags-label {
      font-weight: 500;
    }

    .no-package {
      color: #C0C4CC;
    }
  }

  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 0 4px;

    .toolbar-left { display: flex; align-items: center; gap: 12px; }
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
    .name-text { font-weight: 500; color: #303133; }
    .desc-text { font-size: 13px; color: #909399; }
    .count-text { font-size: 13px; color: #606266; }

    .role-name-cell {
      display: flex;
      align-items: center;
      gap: 8px;

      .el-icon {
        font-size: 16px;
      }
    }

    .empty-state {
      padding: 48px 0;
      .empty-title { font-size: 16px; color: #606266; margin: 16px 0 8px; }
      .empty-desc { font-size: 13px; color: #909399; }
    }
  }

  // 角色抽屉样式
  :deep(.role-drawer) {
    .el-drawer__header {
      background: linear-gradient(135deg, #67C23A, #85CE61);
      padding: 20px 24px;
      margin-bottom: 0;

      .el-drawer__title {
        color: #fff;
        font-weight: 600;
        font-size: 16px;
      }

      .el-drawer__close-btn {
        color: rgba(255,255,255,0.8);

        &:hover {
          color: #fff;
        }
      }
    }

    .el-drawer__body {
      padding: 24px;
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

  // 菜单配置抽屉样式
  :deep(.menu-drawer) {
    .el-drawer__header {
      background: linear-gradient(135deg, #E6A23C, #EBB563);
      padding: 20px 24px;
      margin-bottom: 0;

      .el-drawer__title {
        color: #fff;
        font-weight: 600;
        font-size: 16px;
      }

      .el-drawer__close-btn {
        color: rgba(255,255,255,0.8);

        &:hover {
          color: #fff;
        }
      }
    }

    .el-drawer__body {
      padding: 24px;
    }

    .menu-config-content {
      .package-info {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: #FFF7E6;
        border-radius: 8px;
        margin-bottom: 16px;
        font-size: 13px;
        color: #D46B08;

        .info-label {
          font-weight: 500;
        }

        .no-package {
          color: #C0C4CC;
        }
      }

      .menu-tree-container {
        .tree-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;

          .tree-title {
            font-size: 14px;
            font-weight: 600;
            color: #303133;
          }
        }

        .menu-tree {
          max-height: calc(100vh - 380px);
          overflow-y: auto;
          border: 1px solid #EBEEF5;
          border-radius: 8px;
          padding: 12px;

          .menu-tree-node {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;

            .el-icon {
              font-size: 14px;
            }

            .menu-name {
              flex: 1;
            }
          }
        }
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
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
