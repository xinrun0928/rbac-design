<template>
  <div class="post-management">

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

        <!-- 数据表格 -->
        <el-card class="table-card" shadow="never">
          <!-- 搜索栏 -->
          <div class="search-bar">
            <el-form :model="postSearchForm" inline class="search-form">
              <el-form-item label="岗位名称">
                <el-input
                  v-model="postSearchForm.name"
                  placeholder="输入岗位名称"
                  clearable
                  :prefix-icon="Search"
                  style="width: 180px"
                  @keyup.enter="handlePostSearch"
                />
              </el-form-item>
              <el-form-item label="岗位编号">
                <el-input
                  v-model="postSearchForm.code"
                  placeholder="输入岗位编号"
                  clearable
                  style="width: 160px"
                  @keyup.enter="handlePostSearch"
                />
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="postSearchForm.status" placeholder="全部" clearable style="width: 120px">
                  <el-option label="启用" :value="1" />
                  <el-option label="禁用" :value="0" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search" @click="handlePostSearch">搜索</el-button>
                <el-button :icon="RefreshLeft" @click="handlePostReset">重置</el-button>
              </el-form-item>
            </el-form>
            <div class="search-actions">
              <el-button type="primary" :icon="Plus" @click="handleAddPost" :disabled="!currentNode">新增岗位</el-button>
            </div>
          </div>
          <el-table
            v-loading="loading"
            :data="filteredPostData"
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

            <el-table-column prop="code" label="岗位编号" min-width="120" align="center">
              <template #default="{ row }">
                <span class="code-text">{{ row.code }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="name" label="岗位名称" min-width="150">
              <template #default="{ row }">
                <span class="name-text">{{ row.name }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="sort" label="排序" width="80" align="center">
              <template #default="{ row }">
                <span class="sort-text">{{ row.sort }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="status" label="状态" width="80" align="center">
              <template #default="{ row }">
                <el-tag :type="row.status === 1 ? 'success' : 'danger'" effect="light" size="small">
                  {{ row.status === 1 ? '启用' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="remark" label="备注" min-width="150" show-overflow-tooltip>
              <template #default="{ row }">
                <span class="remark-text">{{ row.remark || '-' }}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="160" align="center" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link :icon="Edit" @click="handleEditPost(row)">编辑</el-button>
                <el-button type="danger" link :icon="Delete" @click="handleDeletePost(row)">删除</el-button>
              </template>
            </el-table-column>

            <template #empty>
              <div class="empty-state">
                <el-icon :size="64" color="#DCDFE6"><User /></el-icon>
                <p class="empty-title">暂无岗位数据</p>
                <p class="empty-desc">
                  <template v-if="currentNode">
                    点击上方
                    <el-button type="primary" link @click="handleAddPost">"新增岗位"</el-button>
                    按钮为 {{ currentNode.name }} 添加岗位
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

    <!-- 新增/编辑岗位抽屉 -->
    <el-drawer
      v-model="postDrawerVisible"
      :title="isPostEdit ? '编辑岗位' : '新增岗位'"
      size="420px"
      direction="rtl"
      :before-close="handlePostDrawerClose"
      class="post-drawer"
    >
      <el-form
        ref="postFormRef"
        :model="postFormData"
        label-width="80px"
        label-position="right"
        class="post-form"
      >
        <el-form-item label="岗位编号" prop="code" :rules="[{ required: true, message: '请输入岗位编号', trigger: 'blur' }]">
          <el-input v-model="postFormData.code" placeholder="请输入岗位编号" maxlength="20" show-word-limit />
        </el-form-item>

        <el-form-item label="岗位名称" prop="name" :rules="[{ required: true, message: '请输入岗位名称', trigger: 'blur' }]">
          <el-input v-model="postFormData.name" placeholder="请输入岗位名称" maxlength="30" show-word-limit />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="postFormData.sort" :min="0" :max="999" controls-position="right" style="width: 100%" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="postFormData.status">
            <el-radio :value="1">启用</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="postFormData.remark"
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
          <el-button @click="postDrawerVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitPost">确认</el-button>
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
  OfficeBuilding, Location, DArrowLeft, DArrowRight, User
} from '@element-plus/icons-vue'
import { orgTreeData } from '../mock/orgTreeData'
import type { OrgTreeNode } from '../types/orgTree'

// 岗位接口
interface PostItem {
  id: number
  code: string     // 岗位编号
  name: string     // 岗位名称
  sort: number     // 排序
  status: number   // 状态：1-启用，0-禁用
  remark: string   // 备注
  orgId: number    // 所属组织ID
  orgName: string  // 所属组织名称
}

// ── 状态 ──
const loading = ref(false)
const postData = ref<PostItem[]>([])
const treeRef = ref<InstanceType<typeof ElTree>>()
const treeCollapsed = ref(false)
const treeFilter = ref('')
const currentNode = ref<OrgTreeNode | null>(null)
const postDrawerVisible = ref(false)
const isPostEdit = ref(false)
const postFormRef = ref<FormInstance>()

const postSearchForm = reactive({
  name: '',
  code: '',
  status: '' as string | number
})

const postFormData = reactive({
  id: 0,
  code: '',
  name: '',
  sort: 0,
  status: 1,
  remark: ''
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 20
})

// ── 树节点筛选 ──
watch(treeFilter, (val) => {
  treeRef.value?.filter(val)
})

// ── 计算属性 ──
const allFilteredData = computed(() => {
  return postData.value.filter(p => {
    // 按当前选中组织过滤
    if (currentNode.value && p.orgId !== currentNode.value.id) return false
    // 按搜索条件过滤
    if (postSearchForm.name && !p.name.includes(postSearchForm.name)) return false
    if (postSearchForm.code && !p.code.includes(postSearchForm.code)) return false
    if (postSearchForm.status !== '' && p.status !== postSearchForm.status) return false
    return true
  })
})

const filteredPostData = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  return allFilteredData.value.slice(start, start + pagination.pageSize)
})

const showPagination = computed(() => allFilteredData.value.length > pagination.pageSize)

function handlePageChange(page: number) {
  pagination.page = page
}

// ── 方法 ──
function fetchPostData() {
  loading.value = true
  try {
    // 从 orgTreeData 中提取所有成员，每个成员映射为一个岗位
    const posts: PostItem[] = []
    let postId = 1

    function extractPosts(nodes: OrgTreeNode[]) {
      for (const node of nodes) {
        for (const member of node.members) {
          // 以成员的职务作为岗位名称，生成唯一编号
          posts.push({
            id: postId++,
            code: `POS-${String(postId).padStart(4, '0')}`,
            name: member.position,
            sort: postId,
            status: 1,
            remark: '',
            orgId: node.id,
            orgName: node.name
          })
        }
        if (node.children) {
          extractPosts(node.children)
        }
      }
    }
    extractPosts(orgTreeData)
    postData.value = posts
  } finally {
    loading.value = false
  }
}

function handleNodeClick(data: OrgTreeNode) {
  currentNode.value = data
  pagination.page = 1
}

function handlePostSearch() {
  // 搜索通过 computed 属性自动处理
}

function handlePostReset() {
  postSearchForm.name = ''
  postSearchForm.code = ''
  postSearchForm.status = ''
}

function handleRefresh() {
  fetchPostData()
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

function handleAddPost() {
  isPostEdit.value = false
  postFormData.id = 0
  postFormData.code = ''
  postFormData.name = ''
  postFormData.sort = 0
  postFormData.status = 1
  postFormData.remark = ''
  postDrawerVisible.value = true
}

function handleEditPost(row: PostItem) {
  isPostEdit.value = true
  postFormData.id = row.id
  postFormData.code = row.code
  postFormData.name = row.name
  postFormData.sort = row.sort
  postFormData.status = row.status
  postFormData.remark = row.remark
  postDrawerVisible.value = true
}

function handleSubmitPost() {
  if (!postFormRef.value) return
  postFormRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success(isPostEdit.value ? '编辑成功' : '新增成功')
      postDrawerVisible.value = false
    }
  })
}

function handleDeletePost(row: PostItem) {
  ElMessageBox.confirm(
    `确定要删除岗位 "${row.name}" 吗？`,
    '确认删除',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    ElMessage.success('删除成功')
    fetchPostData()
  }).catch(() => {})
}

function handlePostDrawerClose(done: () => void) {
  postFormRef.value?.resetFields()
  done()
}

// ── 初始化 ──
onMounted(() => {
  fetchPostData()
  // 默认选中广东省交通运输厅
  if (orgTreeData.length > 0) {
    currentNode.value = orgTreeData[0]
  }
})
</script>

<style lang="scss" scoped>
.post-management {
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
      border-radius: 8px;
      overflow: hidden;
    }

    .index-text { color: #909399; font-size: 13px; }
    .code-text { font-family: 'Monaco','Menlo','Consolas', monospace; font-size: 13px; color: #606266; }
    .name-text { font-weight: 500; color: #303133; }
    .sort-text { font-size: 13px; color: #606266; }
    .remark-text { font-size: 13px; color: #606266; }

    .empty-state {
      padding: 48px 0;
      .empty-title { font-size: 16px; color: #606266; margin: 16px 0 8px; }
      .empty-desc { font-size: 13px; color: #909399; }
    }

    .pagination-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
      flex-shrink: 0;
    }
  }

  // 岗位抽屉样式
  :deep(.post-drawer) {
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
