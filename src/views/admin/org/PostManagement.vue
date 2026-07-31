<template>
  <div class="post-management">

    <div class="main-content animate-item">
      <OrgTreePanel ref="orgTreeRef" :selected-id="currentNode?.id" @node-click="handleNodeClick" />

      <!-- 右侧：列表区域 -->
      <div class="list-panel">
        <!-- 数据表格 -->
        <el-card class="table-card" shadow="never">
          <div class="search-bar">
            <span class="search-bar-title">岗位管理<span v-if="currentNode" class="current-hint">（当前：{{ currentNode.name }}）</span></span>
            <div class="search-bar-actions">
              <el-input
                v-model="postSearchForm.name"
                placeholder="搜索岗位名称"
                clearable
                :prefix-icon="Search"
                style="width: 180px; margin-right: 12px"
                @keyup.enter="handlePostSearch"
                @clear="handlePostSearch"
              />
              <el-input
                v-model="postSearchForm.code"
                placeholder="搜索岗位编号"
                clearable
                :prefix-icon="Search"
                style="width: 180px; margin-right: 12px"
                @keyup.enter="handlePostSearch"
                @clear="handlePostSearch"
              />
              <el-button type="primary" :icon="Plus" @click="handleAddPost" :disabled="!currentNode">新增岗位</el-button>
            </div>
          </div>
          <div class="table-wrapper">
          <el-table
            v-loading="loading"
            :data="filteredPostData"
            height="100%"
            border
            stripe
            highlight-current-row
            row-key="id"
            :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
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

            <el-table-column prop="name" label="岗位名称" min-width="150" align="center">
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

            <el-table-column prop="remark" label="备注" min-width="150" align="center" show-overflow-tooltip>
              <template #default="{ row }">
                <span class="remark-text">{{ row.remark || '-' }}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="250" align="center" fixed="right">
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
          </div>

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
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'
import {
  Refresh, Search, RefreshLeft, Plus, Delete, Edit, User
} from '@element-plus/icons-vue'
import OrgTreePanel from '@/components/OrgTreePanel.vue'
import { orgTreeData } from '@/mock/admin/orgTreeData'
import type { OrgTreeNode } from '@/types/admin/orgTree'

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
const orgTreeRef = ref<InstanceType<typeof OrgTreePanel>>()
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
  pageSize: 20,
  total: 0
})

// ── 计算属性 ──
const allFilteredData = computed(() => {
  const data = postData.value.filter(p => {
    // 按当前选中组织过滤
    if (currentNode.value && p.orgId !== currentNode.value.id) return false
    // 按搜索条件过滤
    if (postSearchForm.name && !p.name.includes(postSearchForm.name)) return false
    if (postSearchForm.code && !p.code.includes(postSearchForm.code)) return false
    return true
  })
  pagination.total = data.length
  return data
})

const filteredPostData = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  return allFilteredData.value.slice(start, start + pagination.pageSize)
})

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
}

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
  pagination.page = 1
}

function handlePostReset() {
  postSearchForm.name = ''
  postSearchForm.code = ''
  postSearchForm.status = ''
}

function handleRefresh() {
  fetchPostData()
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
    nextTick(() => {
      orgTreeRef.value?.setCurrentKey(1)
    })
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
    flex: 1;
    overflow: hidden;
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
    height: 100%;
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
    }

    :deep(.el-table) {
      border-radius: 8px;
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
