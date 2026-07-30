<template>
  <div class="role-management">

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
          <div class="node-info">
            <el-icon><Location /></el-icon>
            <span>当前组织：<strong>{{ currentNode.name }}</strong></span>
            <el-tag size="small" :type="getNodeTypeTagType(currentNode.nodeType)" effect="plain">
              {{ getNodeTypeLabel(currentNode.nodeType) }}
            </el-tag>
          </div>
          <div class="node-tags">
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
          <el-button type="primary" :icon="Plus" @click="handleAddRole" class="add-btn">新增角色</el-button>
        </div>

        <!-- 角色列表 -->
        <el-card class="table-card" shadow="never">
          <div class="table-wrapper">
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
            <el-table-column label="序号" width="60" align="center" type="index">
              <template #default="{ $index }">
                <span class="index-text">{{ $index + 1 }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="roleCode" label="角色编码" width="140">
              <template #default="{ row }">
                <span class="code-text">{{ row.roleCode }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="roleName" label="角色名称" min-width="140">
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

            <el-table-column prop="description" label="角色描述" min-width="150">
              <template #default="{ row }">
                <span class="desc-text">{{ row.description || '-' }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="dataScope" label="数据范围" width="150" align="center">
              <template #default="{ row }">
                <el-tag
                  :color="getDataScopeColor(row.dataScope)"
                  effect="dark"
                  style="border: none; color: #fff;"
                  size="small"
                >
                  {{ getDataScopeLabel(row.dataScope) }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="roleLevel" label="角色级别" width="100" align="center">
              <template #default="{ row }">
                <span class="level-text">{{ row.roleLevel }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="menuCount" label="菜单权限" width="100" align="center">
              <template #default="{ row }">
                <el-tag size="small" effect="plain">{{ row.menuCount }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="status" label="状态" width="80" align="center">
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

            <el-table-column label="操作" width="160" align="center" fixed="right">
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
          </div>
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
        <el-form-item label="角色编码" prop="roleCode" :rules="[{ required: true, message: '请输入角色编码', trigger: 'blur' }, { pattern: /^[A-Z_]+$/, message: '只能包含大写字母和下划线', trigger: 'blur' }]">
          <el-input v-model="roleFormData.roleCode" placeholder="如：SYSTEM_ADMIN" maxlength="50" show-word-limit :disabled="isRoleEdit" />
        </el-form-item>

        <el-form-item label="角色名称" prop="roleName" :rules="[{ required: true, message: '请输入角色名称', trigger: 'blur' }]">
          <el-input v-model="roleFormData.roleName" placeholder="请输入角色名称" maxlength="30" show-word-limit />
        </el-form-item>

        <el-form-item label="数据范围" prop="dataScope">
          <el-select v-model="roleFormData.dataScope" placeholder="请选择数据范围" style="width: 100%">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <div class="scope-option">
                <span>{{ item.label }}</span>
                <el-tag size="small" :color="item.color" effect="dark" style="border: none; color: #fff;">{{ item.value }}</el-tag>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="角色级别" prop="roleLevel">
          <el-input-number v-model="roleFormData.roleLevel" :min="1" :max="9999" style="width: 100%" />
          <div class="form-tip">数字越小权限越高</div>
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
      size="50%"
      direction="rtl"
      class="menu-drawer"
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
              :key="sub.subsystemId"
              class="bind-subsystem-item"
              :class="{ active: bindSelectedSubsystem === sub.subsystemId }"
              @click="loadBindMenuTree(sub.subsystemId)"
            >
              <div class="subsystem-icon" :style="{ background: getSubsystemIconStyle(sub.subsystemId).bg }">
                <el-icon :color="getSubsystemIconStyle(sub.subsystemId).color">
                  <component :is="getSubsystemIconStyle(sub.subsystemId).icon" />
                </el-icon>
              </div>
              <span class="subsystem-name">{{ sub.subsystemShortName }}</span>
              <span class="subsystem-count">（{{ subsystemMenuCount[sub.subsystemId] || 0 }}）</span>
            </div>
          </div>
        </div>

        <!-- 右侧菜单树 -->
        <div class="bind-right">
          <div class="bind-right-header">
            <span>菜单列表</span>
            <el-checkbox v-model="bindCheckAll" :indeterminate="bindIndeterminate" @change="handleBindCheckAll" :disabled="currentRole?.isSystem">
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
              :check-strictly="true"
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
import { orgTreeData } from '@/mock/admin/orgTreeData'
import { mockMenuData } from '@/mock/admin/menuData'
import { mockSubsystemData } from '@/mock/admin/subsystemData'
import type { OrgTreeNode } from '@/types/admin/orgTree'
import type { Menu } from '@/types/admin/menu'
import { buildMenuTree } from '@/utils/menuMockApi'

// 角色接口
interface RoleItem {
  roleId: number
  roleCode: string
  roleName: string
  description: string
  dataScope: string
  roleLevel: number
  orgId: number
  orgName: string
  isSystem: boolean
  menuCount: number
  memberCount: number
  status: number
  menuIds: number[]
}

// 数据范围选项
const dataScopeOptions = [
  { value: 'SELF', label: '仅本人', color: '#67C23A' },
  { value: 'ORG', label: '本机构', color: '#409EFF' },
  { value: 'ORG_AND_CHILDREN', label: '本机构及下级机构', color: '#F56C6C' }
]

// ── 状态 ──
const loading = ref(false)
const treeRef = ref<InstanceType<typeof ElTree>>()
const bindTreeRef = ref<InstanceType<typeof ElTree>>()
const treeCollapsed = ref(false)
const treeFilter = ref('')
const currentNode = ref<OrgTreeNode | null>(null)
const roleDrawerVisible = ref(false)
const isRoleEdit = ref(false)
const roleFormRef = ref<FormInstance>()
const menuDrawerVisible = ref(false)
const currentRole = ref<RoleItem | null>(null)

const allRoles = ref<RoleItem[]>([])
const checkedMenuIds = ref<number[]>([])

// 菜单绑定相关状态
const bindSelectedSubsystem = ref<number>(1)
const bindMenuTree = ref<Menu[]>([])
const bindCheckedKeys = ref<number[]>([])
const bindCheckAll = ref(false)
const bindIndeterminate = ref(false)
const subsystemMenuCount = ref<Record<number, number>>({})

// 子系统列表（排除隐藏的）
const subsystems = mockSubsystemData.filter(sub => !sub.isHidden && true)

// 根据当前选中节点筛选角色
const roleList = computed(() => {
  if (!currentNode.value) return []
  return allRoles.value.filter(r => r.orgId === currentNode.value!.id)
})

const roleFormData = reactive({
  roleId: 0,
  roleCode: '',
  roleName: '',
  description: '',
  dataScope: 'SELF',
  roleLevel: 100,
  status: 1101
})

// ── 树节点筛选 ──
watch(treeFilter, (val) => {
  treeRef.value?.filter(val)
})

// ── 方法 ──
function fetchRoleData() {
  loading.value = true
  try {
    // 为每个组织生成角色数据
    const roles: RoleItem[] = []
    let roleIdCounter = 1

    function processNode(node: OrgTreeNode) {
      // 1. 系统管理员 - 本机构及下级机构
      roles.push({
        roleId: roleIdCounter++,
        roleCode: 'SYSTEM_ADMIN',
        roleName: '系统管理员',
        description: '拥有所有菜单权限，不可修改菜单配置',
        dataScope: 'ORG_AND_CHILDREN',
        roleLevel: 1,
        orgId: node.id,
        orgName: node.name,
        isSystem: true,
        menuCount: mockMenuData.length,
        memberCount: Math.floor(Math.random() * 3) + 1,
        status: 1101,
        menuIds: mockMenuData.map(m => m.menuId)
      })

      // 2. 机构管理员 - 本机构及下级机构
      roles.push({
        roleId: roleIdCounter++,
        roleCode: 'ORG_ADMIN',
        roleName: '机构管理员',
        description: '管理本机构及下级机构的数据和用户',
        dataScope: 'ORG_AND_CHILDREN',
        roleLevel: 5,
        orgId: node.id,
        orgName: node.name,
        isSystem: false,
        menuCount: Math.floor(Math.random() * 15) + 10,
        memberCount: Math.floor(Math.random() * 3) + 1,
        status: 1101,
        menuIds: [1, 2, 3, 4, 5, 10, 11, 12]
      })

      // 3. 运维工程师 - 本机构
      roles.push({
        roleId: roleIdCounter++,
        roleCode: 'OPS_ENGINEER',
        roleName: '运维工程师',
        description: '负责系统运维和技术支持',
        dataScope: 'ORG',
        roleLevel: 15,
        orgId: node.id,
        orgName: node.name,
        isSystem: false,
        menuCount: Math.floor(Math.random() * 10) + 8,
        memberCount: Math.floor(Math.random() * 3) + 1,
        status: 1101,
        menuIds: [1, 2, 3, 10, 11, 12]
      })

      // 4. 值班人员 - 本机构
      roles.push({
        roleId: roleIdCounter++,
        roleCode: 'ON_DUTY',
        roleName: '值班人员',
        description: '负责日常值守和信息报送',
        dataScope: 'ORG',
        roleLevel: 30,
        orgId: node.id,
        orgName: node.name,
        isSystem: false,
        menuCount: Math.floor(Math.random() * 5) + 3,
        memberCount: Math.floor(Math.random() * 8) + 3,
        status: 1101,
        menuIds: [1, 2, 10]
      })

      // 5. 调度员 - 本机构
      roles.push({
        roleId: roleIdCounter++,
        roleCode: 'DISPATCHER',
        roleName: '调度员',
        description: '负责交通调度和应急指挥',
        dataScope: 'ORG',
        roleLevel: 40,
        orgId: node.id,
        orgName: node.name,
        isSystem: false,
        menuCount: Math.floor(Math.random() * 8) + 4,
        memberCount: Math.floor(Math.random() * 4) + 2,
        status: 1101,
        menuIds: [1, 2, 3, 4, 10]
      })

      // 6. 普通用户 - 仅本人
      roles.push({
        roleId: roleIdCounter++,
        roleCode: 'NORMAL_USER',
        roleName: '普通用户',
        description: '基本操作权限，仅可查看本人数据',
        dataScope: 'SELF',
        roleLevel: 100,
        orgId: node.id,
        orgName: node.name,
        isSystem: false,
        menuCount: Math.floor(Math.random() * 3) + 2,
        memberCount: Math.floor(Math.random() * 10) + 5,
        status: 1101,
        menuIds: [1, 2]
      })

      // 7. 只读用户 - 仅本人
      roles.push({
        roleId: roleIdCounter++,
        roleCode: 'READONLY_USER',
        roleName: '只读用户',
        description: '仅可查看数据，无操作权限',
        dataScope: 'SELF',
        roleLevel: 200,
        orgId: node.id,
        orgName: node.name,
        isSystem: false,
        menuCount: 2,
        memberCount: Math.floor(Math.random() * 15) + 5,
        status: 1101,
        menuIds: [1, 2]
      })

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

function getDataScopeColor(dataScope: string): string {
  const option = dataScopeOptions.find(o => o.value === dataScope)
  return option?.color || '#909399'
}

function getDataScopeLabel(dataScope: string): string {
  const option = dataScopeOptions.find(o => o.value === dataScope)
  return option?.label || '未知'
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
  roleFormData.roleCode = ''
  roleFormData.roleName = ''
  roleFormData.description = ''
  roleFormData.dataScope = 'SELF'
  roleFormData.roleLevel = 100
  roleFormData.status = 1101
  roleDrawerVisible.value = true
}

function handleEditRole(row: RoleItem) {
  isRoleEdit.value = true
  roleFormData.roleId = row.roleId
  roleFormData.roleCode = row.roleCode
  roleFormData.roleName = row.roleName
  roleFormData.description = row.description
  roleFormData.dataScope = row.dataScope
  roleFormData.roleLevel = row.roleLevel
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
  // 计算每个子系统的菜单数量
  calculateSubsystemMenuCount()
  // 默认选中第一个子系统
  if (subsystems.length > 0) {
    loadBindMenuTree(subsystems[0].subsystemId)
  }
}

function calculateSubsystemMenuCount() {
  const counts: Record<number, number> = {}
  for (const sub of subsystems) {
    counts[sub.subsystemId] = mockMenuData.filter(m => m.subsystemId === sub.subsystemId && true).length
  }
  subsystemMenuCount.value = counts
}

function loadBindMenuTree(subsystemId: number) {
  bindSelectedSubsystem.value = subsystemId
  // 获取该子系统的菜单并构建树
  const subMenus = mockMenuData.filter(m => m.subsystemId === subsystemId && true)
  bindMenuTree.value = buildMenuTree(subMenus)

  // 设置已选中的菜单
  if (currentRole.value) {
    const roleSubMenus = currentRole.value.menuIds.filter(id => {
      const menu = mockMenuData.find(m => m.menuId === id)
      return menu && menu.subsystemId === subsystemId
    })
    bindCheckedKeys.value = roleSubMenus
  } else {
    bindCheckedKeys.value = []
  }

  // 重置全选状态
  bindCheckAll.value = false
  bindIndeterminate.value = false
}

function handleBindCheckAll(val: boolean | string | number) {
  if (!bindTreeRef.value) return
  const checked = val === true
  if (checked) {
    // 获取所有节点的key
    const allKeys = getAllTreeKeys(bindMenuTree.value)
    bindTreeRef.value.setCheckedKeys(allKeys)
    bindCheckedKeys.value = allKeys
  } else {
    bindTreeRef.value.setCheckedKeys([])
    bindCheckedKeys.value = []
  }
  bindIndeterminate.value = false
}

function getAllTreeKeys(data: Menu[]): number[] {
  const keys: number[] = []
  function traverse(items: Menu[]) {
    for (const item of items) {
      keys.push(item.menuId)
      if (item.children && item.children.length > 0) {
        traverse(item.children)
      }
    }
  }
  traverse(data)
  return keys
}

function updateCheckAllStatus() {
  if (!bindTreeRef.value) return
  const checkedKeys = bindTreeRef.value.getCheckedKeys()
  const allKeys = getAllTreeKeys(bindMenuTree.value)

  bindCheckAll.value = checkedKeys.length === allKeys.length
  bindIndeterminate.value = checkedKeys.length > 0 && checkedKeys.length < allKeys.length
}

function handleSubmitMenu() {
  if (!bindTreeRef.value || !currentRole.value) return
  const checkedKeys = bindTreeRef.value.getCheckedKeys()

  // 合并其他子系统已选中的菜单
  const otherSubMenus = currentRole.value.menuIds.filter(id => {
    const menu = mockMenuData.find(m => m.menuId === id)
    return menu && menu.subsystemId !== bindSelectedSubsystem.value
  })

  const allMenuIds = [...new Set([...otherSubMenus, ...checkedKeys])]

  ElMessage.success('菜单配置保存成功')
  menuDrawerVisible.value = false
  fetchRoleData()
}

// 子系统图标配置
const subsystemIconMap: Record<number, { icon: string; color: string; bg: string }> = {
  1: { icon: 'Bell', color: '#E6A23C', bg: 'linear-gradient(135deg, #FDF6EC 0%, #FAECD8 100%)' },
  2: { icon: 'Document', color: '#409EFF', bg: 'linear-gradient(135deg, #ECF5FF 0%, #D9ECFF 100%)' },
  3: { icon: 'Warning', color: '#F56C6C', bg: 'linear-gradient(135deg, #FEF0F0 0%, #FDE2E2 100%)' },
  4: { icon: 'DataLine', color: '#67C23A', bg: 'linear-gradient(135deg, #F0F9EB 0%, #E1F3D8 100%)' },
  5: { icon: 'Box', color: '#9B59B6', bg: 'linear-gradient(135deg, #F5EEF8 0%, #E8DAEF 100%)' },
  6: { icon: 'TrendCharts', color: '#1ABC9C', bg: 'linear-gradient(135deg, #E8F8F5 0%, #D1F2EB 100%)' },
  7: { icon: 'Connection', color: '#3498DB', bg: 'linear-gradient(135deg, #EBF5FB 0%, #D6EAF8 100%)' },
  8: { icon: 'Monitor', color: '#E74C3C', bg: 'linear-gradient(135deg, #FDEDEC 0%, #FADBD8 100%)' },
  99: { icon: 'Setting', color: '#909399', bg: 'linear-gradient(135deg, #F4F4F5 0%, #E9E9EB 100%)' }
}

function getSubsystemIconStyle(subsystemId: number) {
  return subsystemIconMap[subsystemId] || subsystemIconMap[99]
}

// 菜单类型样式
function getMenuTypeClass(menuType: number): string {
  const classes: Record<number, string> = {
    0: 'type-directory',
    1: 'type-menu',
    2: 'type-permission',
    99: 'type-navigation'
  }
  return classes[menuType] || ''
}

function handleRoleDrawerClose(done: () => void) {
  roleFormRef.value?.resetFields()
  done()
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

  // 主内容区：左树右表
  .main-content {
    display: flex;
    gap: 16px;
    flex: 1;
    overflow: hidden;
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
    display: flex;
    flex-direction: column;

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
      flex: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .tree-search {
      margin-bottom: 12px;
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
  }

  .current-node-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 12px 16px;
    background: #ECF5FF;
    border-radius: 8px;
    margin-bottom: 16px;
    font-size: 13px;
    color: #409EFF;

    .node-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .node-tags {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-left: 16px;
      border-left: 1px solid #B3D8FF;
      color: #D46B08;
      background: #FFF7E6;
      border-radius: 6px;
      padding: 4px 12px;
    }

    .tags-label {
      font-weight: 500;
    }

    .no-package {
      color: #C0C4CC;
    }

    .add-btn {
      margin-left: auto;
    }

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

    .package-tags-right {
      margin-left: auto;
    }
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
      overflow: auto;
    }

    :deep(.el-table) {
      border-radius: 8px;
    }

    .index-text { color: #909399; font-size: 13px; }
    .code-text { font-family: 'Monaco','Menlo','Consolas', monospace; color: #409EFF; font-size: 12px; }
    .name-text { font-weight: 500; color: #303133; }
    .desc-text { font-size: 13px; color: #909399; }
    .level-text { font-weight: 600; color: #E6A23C; }

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
      padding: 16px 24px;
      margin-bottom: 0;
      border-bottom: 1px solid #EBEEF5;

      .el-drawer__title {
        font-weight: 600;
        font-size: 16px;
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

    .scope-option {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 4px 0;
    }

    :deep(.el-select-dropdown__item) {
      width: 100%;
    }

    .form-tip {
      font-size: 12px;
      color: #909399;
      margin-top: 4px;
    }
  }

  // 菜单配置抽屉样式
  :deep(.menu-drawer) {
    .el-drawer__header {
      padding: 16px 24px;
      margin-bottom: 0;
      border-bottom: 1px solid #EBEEF5;

      .el-drawer__title {
        font-weight: 600;
        font-size: 16px;
      }
    }

    .el-drawer__body {
      padding: 0;
      display: flex;
      flex-direction: column;
    }

    .bind-container {
      flex: 1;
      display: flex;
      overflow: hidden;
    }

    .bind-left {
      width: 200px;
      border-right: 1px solid #EBEEF5;
      display: flex;
      flex-direction: column;

      .bind-left-header {
        padding: 12px 16px;
        font-weight: 600;
        font-size: 14px;
        border-bottom: 1px solid #EBEEF5;
        background: #F5F7FA;
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
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: #F5F7FA;
        }

        &.active {
          background: #ECF5FF;
          color: #409EFF;
        }

        .subsystem-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .subsystem-name {
          flex: 1;
          font-size: 13px;
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
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #EBEEF5;
        background: #F5F7FA;

        span {
          font-weight: 600;
          font-size: 14px;
        }
      }

      .bind-menu-tree {
        flex: 1;
        overflow-y: auto;
        padding: 12px;

        .bind-tree-node {
          display: flex;
          align-items: center;
          gap: 8px;

          .node-label {
            font-size: 13px;
          }

          .menu-type-tag {
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 4px;
            color: #fff;

            &.type-directory {
              background: #409EFF;
            }

            &.type-menu {
              background: #67C23A;
            }

            &.type-permission {
              background: #F56C6C;
            }

            &.type-navigation {
              background: #E6A23C;
            }
          }
        }
      }
    }

    .drawer-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid #EBEEF5;
    }
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
