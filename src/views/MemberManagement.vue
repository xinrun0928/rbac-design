<template>
  <div class="org-management">

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

      <!-- 右侧：列表区域 -->
      <div class="list-panel">
        <!-- 当前选中提示 -->
        <div v-if="currentNode" class="current-node-bar">
          <el-icon><Location /></el-icon>
          <span>当前选中：<strong>{{ currentNode.name }}</strong></span>
        </div>

        <!-- 搜索栏 -->
        <el-card class="search-card" shadow="never">
          <div class="search-content">
            <el-form :model="memberSearchForm" inline>
              <el-form-item label="成员姓名">
                <el-input
                  v-model="memberSearchForm.name"
                  placeholder="输入成员姓名"
                  clearable
                  :prefix-icon="Search"
                  style="width: 180px"
                  @keyup.enter="handleMemberSearch"
                />
              </el-form-item>
              <el-form-item label="手机号">
                <el-input
                  v-model="memberSearchForm.phone"
                  placeholder="输入手机号"
                  clearable
                  style="width: 160px"
                  @keyup.enter="handleMemberSearch"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search" @click="handleMemberSearch">搜索</el-button>
                <el-button :icon="RefreshLeft" @click="handleMemberReset">重置</el-button>
              </el-form-item>
            </el-form>
            <el-button type="primary" :icon="Plus" @click="handleAddMember" :disabled="!currentNode">新增成员</el-button>
          </div>
        </el-card>

        <!-- 工具栏 -->
        <div class="toolbar">
          <div class="toolbar-right">
            <span class="total-count">共 {{ filteredMemberData.length }} 条数据</span>
          </div>
        </div>

        <!-- 数据表格 -->
        <el-card class="table-card" shadow="never">
          <el-table
            v-loading="loading"
            :data="filteredMemberData"
            border
            stripe
            highlight-current-row
            row-key="id"
            :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600' }"
            empty-text=" "
          >

            <el-table-column label="序号" width="60" align="center" type="index">
              <template #default="{ $index }">
                <span class="index-text">{{ $index + 1 }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="phone" label="账号(手机号)" width="140" align="center">
              <template #default="{ row }">
                <span class="phone-text">{{ row.phone }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="name" label="成员姓名" width="120" align="center">
              <template #default="{ row }">
                <div class="member-name-cell">
                  <el-avatar :size="32" :style="{ background: getAvatarColor(row.name) }">
                    {{ row.name.charAt(0) }}
                  </el-avatar>
                  <span class="name-text">{{ row.name }}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="roles" label="角色" width="150">
              <template #default="{ row }">
                <div class="tag-cell">
                  <el-tag
                    v-for="(role, index) in row.roles"
                    :key="index"
                    size="small"
                    :type="index === 0 ? '' : 'info'"
                    effect="plain"
                    style="margin-right: 4px; margin-bottom: 2px;"
                  >
                    {{ role }}
                  </el-tag>
                  <span v-if="!row.roles || row.roles.length === 0" class="empty-text">-</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="departments" label="部门" width="150">
              <template #default="{ row }">
                <div class="tag-cell">
                  <el-tag
                    v-for="(dept, index) in row.departments"
                    :key="index"
                    size="small"
                    type="success"
                    effect="plain"
                    style="margin-right: 4px; margin-bottom: 2px;"
                  >
                    {{ dept }}
                  </el-tag>
                  <span v-if="!row.departments || row.departments.length === 0" class="empty-text">-</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="position" label="职务" width="150">
              <template #default="{ row }">
                <div class="tag-cell">
                  <el-tag
                    v-for="(pos, index) in row.position"
                    :key="index"
                    size="small"
                    type="warning"
                    effect="plain"
                    style="margin-right: 4px; margin-bottom: 2px;"
                  >
                    {{ pos }}
                  </el-tag>
                  <span v-if="!row.position || row.position.length === 0" class="empty-text">-</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="contactPhone" label="联系电话" width="140" align="center">
              <template #default="{ row }">
                <span class="phone-text">{{ row.contactPhone || '-' }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="email" label="邮箱" min-width="180">
              <template #default="{ row }">
                <span class="email-text">{{ row.email }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="responsibility" label="备注" min-width="120">
              <template #default="{ row }">
                <span class="remark-text">{{ row.responsibility || '-' }}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="160" align="center" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link :icon="Edit" @click="handleEditMember(row)">编辑</el-button>
                <el-button type="warning" link :icon="Key" @click="handleChangePassword(row)">修改密码</el-button>
                <el-button type="info" link :icon="RefreshRight" @click="handleResetPassword(row)">重置密码</el-button>
                <el-button type="danger" link :icon="Delete" @click="handleDeleteMember(row)">删除</el-button>
              </template>
            </el-table-column>

            <template #empty>
              <div class="empty-state">
                <el-icon :size="64" color="#DCDFE6"><User /></el-icon>
                <p class="empty-title">暂无成员数据</p>
                <p class="empty-desc">
                  <template v-if="currentNode">
                    点击上方
                    <el-button type="primary" link @click="handleAddMember">"新增成员"</el-button>
                    按钮为 {{ currentNode.name }} 添加成员
                  </template>
                  <template v-else>
                    请先在左侧选择一个组织
                  </template>
                </p>
              </div>
            </template>
          </el-table>

          <!-- 分页 -->
          <div v-if="showPagination" class="pagination-wrapper">
            <el-pagination
              v-model:current-page="pagination.page"
              :page-size="pagination.pageSize"
              :total="allFilteredData.length"
              layout="total, prev, pager, next"
              background
              @current-change="handlePageChange"
            />
          </div>
        </el-card>
      </div>
    </div>

    <!-- 新增/编辑成员抽屉 -->
    <el-drawer
      v-model="memberDrawerVisible"
      :title="isMemberEdit ? '编辑成员' : '新增成员'"
      size="420px"
      direction="rtl"
      :before-close="handleMemberDrawerClose"
      class="member-drawer"
    >
      <el-form
        ref="memberFormRef"
        :model="memberFormData"
        label-width="80px"
        label-position="right"
        class="member-form"
      >
        <el-form-item label="姓名" prop="name" :rules="[{ required: true, message: '请输入姓名', trigger: 'blur' }]">
          <el-input v-model="memberFormData.name" placeholder="请输入成员姓名" maxlength="20" show-word-limit />
        </el-form-item>

        <el-form-item label="账号" prop="phone" :rules="[{ required: true, message: '请输入手机号作为账号', trigger: 'blur' }, { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }]">
          <el-input v-model="memberFormData.phone" placeholder="请输入11位手机号作为账号" maxlength="11" />
        </el-form-item>

        <el-form-item v-if="!isMemberEdit" label="密码" prop="password" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, max: 20, message: '密码长度为6-20位', trigger: 'blur' }]">
          <el-input v-model="memberFormData.password" type="password" placeholder="请输入密码" show-password maxlength="20" />
        </el-form-item>

        <el-form-item label="角色" prop="roles" :rules="[{ required: true, message: '请选择角色', trigger: 'change' }]">
          <el-select v-model="memberFormData.roles" multiple placeholder="请选择角色（可多选）" style="width: 100%">
            <el-option v-for="item in roleOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item label="部门" prop="departments">
          <el-select v-model="memberFormData.departments" multiple placeholder="请选择部门（可多选）" style="width: 100%">
            <el-option v-for="item in departmentOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item label="职务" prop="position" :rules="[{ required: true, message: '请选择职务', trigger: 'change' }]">
          <el-select v-model="memberFormData.position" multiple placeholder="请选择职务（可多选）" style="width: 100%">
            <el-option v-for="item in positionOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>

        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="memberFormData.contactPhone" placeholder="请输入联系电话（座机等）" maxlength="20" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email" :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' }, { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }]">
          <el-input v-model="memberFormData.email" placeholder="请输入邮箱地址" />
        </el-form-item>

        <el-form-item label="备注" prop="responsibility">
          <el-input
            v-model="memberFormData.responsibility"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="memberDrawerVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitMember">确认</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import type ElTree from 'element-plus/es/components/tree'
import {
  Refresh, Search, RefreshLeft, Plus, Delete, Edit,
  SuccessFilled, CircleCloseFilled, Key, RefreshRight,
  OfficeBuilding, Location, DArrowLeft, DArrowRight, User, Male, Female
} from '@element-plus/icons-vue'
import { orgTreeData } from '../mock/orgTreeData'
import type { OrgTreeNode } from '../types/orgTree'

// 组织成员接口
interface MemberItem {
  id: number
  name: string
  roles: string[]  // 角色
  departments: string[]  // 部门
  position: string[]  // 职务（支持多个）
  phone: string  // 手机号码（11位，作为账号）
  contactPhone: string  // 联系电话（座机等）
  email: string
  responsibility: string
  orgId: number
  orgName: string
}

// ── 状态 ──
const loading = ref(false)
const memberData = ref<MemberItem[]>([])
const treeRef = ref<InstanceType<typeof ElTree>>()
const treeCollapsed = ref(false)
const treeFilter = ref('')
const currentNode = ref<OrgTreeNode | null>(null)
const memberDrawerVisible = ref(false)
const isMemberEdit = ref(false)
const memberFormRef = ref<FormInstance>()

const memberSearchForm = reactive({
  name: '',
  phone: ''
})

const memberFormData = reactive({
  id: 0,
  name: '',
  roles: [] as string[],
  departments: [] as string[],
  position: [] as string[],
  phone: '',
  contactPhone: '',
  email: '',
  responsibility: '',
  password: ''
})

// 角色选项
const roleOptions = [
  '系统管理员', '运维工程师', '值守主管', '技术支持', '数据分析师',
  '普通用户', '事件处理员', '调度员', '预案管理员', '物资管理员',
  '决策顾问', '调度主管', '融合协调员', '展示管理员', '测试工程师'
]

// 部门选项
const departmentOptions = [
  '厅总值班室', '科技处', '路政处', '基建处', '综合处',
  '广州市交通局', '深圳市交通局', '茂名市交通局', '佛山市交通局',
  '广州市公路事务中心', '深圳市公路事务中心', '佛山市公路事务中心'
]

// 职务选项
const positionOptions = [
  '厅长', '副厅长', '处长', '副处长', '科员', '主任', '副主任',
  '值班室主任', '值班员', '站长', '副站长', '养护工',
  '局长', '副局长', '办公室主任', '技术员'
]

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 8
})

// ── 树节点筛选 ──
watch(treeFilter, (val) => {
  treeRef.value?.filter(val)
})

// ── 计算属性 ──
const allFilteredData = computed(() => {
  return memberData.value.filter(m => {
    // 按当前选中组织过滤
    if (currentNode.value && m.orgId !== currentNode.value.id) return false
    // 按搜索条件过滤
    if (memberSearchForm.name && !m.name.includes(memberSearchForm.name)) return false
    if (memberSearchForm.phone && !m.phone.includes(memberSearchForm.phone)) return false
    return true
  })
})

const filteredMemberData = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  return allFilteredData.value.slice(start, start + pagination.pageSize)
})

const showPagination = computed(() => allFilteredData.value.length > pagination.pageSize)

function handlePageChange(page: number) {
  pagination.page = page
}

// ── 方法 ──
function fetchMemberData() {
  loading.value = true
  try {
    // 从 orgTreeData 中提取所有成员
    const members: MemberItem[] = []
    const roleList = ['系统管理员', '运维工程师', '值守主管', '普通用户', '调度员']
    const deptList = ['厅总值班室', '科技处', '路政处', '基建处', '综合处']

    function extractMembers(nodes: OrgTreeNode[], parentName: string = '') {
      for (const node of nodes) {
        for (const member of node.members) {
          // 随机生成角色、部门、职务
          const randomRoles = roleList.sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 2) + 1)
          const randomDepts = [node.name]
          const randomPositions = [member.position]

          members.push({
            ...member,
            roles: randomRoles,
            departments: randomDepts,
            position: randomPositions,
            orgId: node.id,
            orgName: node.name
          })
        }
        if (node.children) {
          extractMembers(node.children, node.name)
        }
      }
    }
    extractMembers(orgTreeData)
    memberData.value = members
  } finally {
    loading.value = false
  }
}

function handleNodeClick(data: OrgTreeNode) {
  currentNode.value = data
}

function handleMemberSearch() {
  // 搜索通过 computed 属性自动处理
}

function handleMemberReset() {
  memberSearchForm.name = ''
  memberSearchForm.phone = ''
}

function handleRefresh() {
  fetchMemberData()
}

function filterTreeNode(value: string, data: OrgTreeNode): boolean {
  if (!value) return true
  return data.name.includes(value)
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

function getAvatarColor(name: string): string {
  const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#9B59B6', '#1ABC9C']
  const index = name.charCodeAt(0) % colors.length
  return colors[index]
}

function getOrgNameById(orgId: number): string {
  function findNode(nodes: OrgTreeNode[]): string | null {
    for (const node of nodes) {
      if (node.id === orgId) return node.name
      if (node.children) {
        const found = findNode(node.children)
        if (found) return found
      }
    }
    return null
  }
  return findNode(orgTreeData) || '未知'
}

function handleAddMember() {
  isMemberEdit.value = false
  memberFormData.id = 0
  memberFormData.name = ''
  memberFormData.roles = []
  memberFormData.departments = []
  memberFormData.position = []
  memberFormData.phone = ''
  memberFormData.contactPhone = ''
  memberFormData.email = ''
  memberFormData.responsibility = ''
  memberFormData.password = ''
  memberDrawerVisible.value = true
}

function handleEditMember(row: MemberItem) {
  isMemberEdit.value = true
  memberFormData.id = row.id
  memberFormData.name = row.name
  memberFormData.roles = [...row.roles]
  memberFormData.departments = [...row.departments]
  memberFormData.position = [...row.position]
  memberFormData.phone = row.phone
  memberFormData.contactPhone = row.contactPhone
  memberFormData.email = row.email
  memberFormData.responsibility = row.responsibility
  memberFormData.password = ''
  memberDrawerVisible.value = true
}

function handleSubmitMember() {
  if (!memberFormRef.value) return
  memberFormRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success(isMemberEdit.value ? '编辑成功' : '新增成功')
      memberDrawerVisible.value = false
    }
  })
}

// 修改密码
function handleChangePassword(row: MemberItem) {
  ElMessageBox.prompt('请输入新密码', '修改密码 - ' + row.name, {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputType: 'password',
    inputPlaceholder: '请输入新密码',
    inputValidator: (value) => {
      if (!value) return '密码不能为空'
      if (value.length < 6) return '密码长度不能少于6位'
      if (value.length > 20) return '密码长度不能超过20位'
      return true
    },
    inputErrorMessage: '密码长度为6-20位'
  }).then(({ value }) => {
    ElMessage.success('密码修改成功')
  }).catch(() => {})
}

// 重置密码
function handleResetPassword(row: MemberItem) {
  ElMessageBox.confirm(
    `确定要重置 "${row.name}" 的密码吗？重置后默认密码为 123456`,
    '重置密码确认',
    {
      confirmButtonText: '确认重置',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('密码已重置为 123456')
  }).catch(() => {})
}

function handleDeleteMember(row: MemberItem) {
  ElMessageBox.confirm(
    `确定要删除成员 "${row.name}" 吗？`,
    '确认删除',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    ElMessage.success('删除成功')
    fetchMemberData()
  }).catch(() => {})
}

function handleMemberDrawerClose(done: () => void) {
  memberFormRef.value?.resetFields()
  done()
}

// ── 初始化 ──
onMounted(() => {
  fetchMemberData()
  // 默认选中广东省交通运输厅
  if (orgTreeData.length > 0) {
    currentNode.value = orgTreeData[0]
  }
})
</script>

<style lang="scss" scoped>
.org-management {
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
    margin-bottom: 16px;
    font-size: 13px;
    color: #409EFF;

    strong { color: #303133; }
  }

  .search-card {
    margin-bottom: 16px;
    border-radius: 12px;
    border: none;

    :deep(.el-card__body) {
      padding: 16px 20px;
    }

    .search-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .el-form {
        flex: 1;
      }

      .el-form-item {
        margin-bottom: 0;
      }
    }
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

    .index-text { color: #909399; font-size: 13px; }
    .name-text { font-weight: 500; color: #303133; }
    .position-text { font-size: 13px; color: #606266; }
    .phone-text { font-family: 'Monaco','Menlo','Consolas', monospace; font-size: 13px; }
    .email-text { font-size: 13px; color: #606266; }
    .remark-text { font-size: 13px; color: #909399; }

    .member-name-cell {
      display: flex;
      align-items: center;
      gap: 8px;

      .el-avatar {
        font-size: 14px;
        color: #fff;
        flex-shrink: 0;
      }
    }

    .tag-cell {
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
    }

    .empty-text {
      color: #C0C4CC;
      font-size: 13px;
    }

    .empty-state {
      padding: 48px 0;
      .empty-title { font-size: 16px; color: #606266; margin: 16px 0 8px; }
      .empty-desc { font-size: 13px; color: #909399; }
    }

    .pagination-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid #EBEEF5;
    }
  }

  // 成员抽屉样式
  :deep(.member-drawer) {
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
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
