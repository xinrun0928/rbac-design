<template>
  <div class="workflow-management">
    <el-card class="table-card animate-item" shadow="never">
      <div class="search-bar">
        <span class="search-bar-title">工作流程管理</span>
        <div class="search-bar-actions">
          <el-input
            v-model="searchName"
            placeholder="搜索流程名称"
            clearable
            :prefix-icon="Search"
            style="width: 180px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
          <el-button type="primary" :icon="Plus" @click="handleCreate">新建流程</el-button>
        </div>
      </div>

      <el-table
        :data="paginatedData"
        border
        stripe
        highlight-current-row
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="name" label="流程名称" min-width="150" align="center" show-overflow-tooltip />
        <el-table-column prop="code" label="流程编号" width="120" align="center" />
        <el-table-column prop="scenario" label="业务场景" width="120" align="center" />
        <el-table-column prop="type" label="流程类型" width="100" align="center" />
        <el-table-column prop="version" label="版本号" width="80" align="center" />
        <el-table-column prop="versionDesc" label="版本说明" min-width="150" show-overflow-tooltip />
        <el-table-column label="是否最新" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.isLatest ? 'success' : 'info'" size="small">
              {{ row.isLatest ? '是' : '否' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.publishStatus === 'published' ? 'success' : 'warning'" size="small">
              {{ row.publishStatus === 'published' ? '已发布' : '未发布' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="使用状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.useStatus === 'enabled' ? 'success' : 'info'" size="small">
              {{ row.useStatus === 'enabled' ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="160" align="center" />
        <el-table-column label="操作" width="250" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Connection" @click="handleDesign(row)">流程设计</el-button>
            <el-button v-if="row.allowEdit" type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button v-if="row.allowDelete" type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
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

    <!-- 新建/编辑抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="isEdit ? '编辑流程' : '新建流程'"
      size="500px"
      direction="rtl"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110px" label-position="right">
        <el-form-item label="流程名称" prop="name">
          <el-input v-model="formData.name" placeholder="必填" maxlength="50" show-word-limit />
        </el-form-item>

        <el-form-item label="业务场景" prop="scenario">
          <el-input v-model="formData.scenario" placeholder="如隐患排查/事故管理" />
        </el-form-item>

        <el-form-item label="流程类型" prop="type">
          <el-input v-model="formData.type" placeholder="审批/处置/巡检/上报" />
        </el-form-item>

        <el-form-item label="版本号" prop="version">
          <el-input v-model="formData.version" placeholder="如v1.0" />
        </el-form-item>

        <el-form-item label="版本说明" prop="versionDesc">
          <el-input v-model="formData.versionDesc" placeholder="更新说明" />
        </el-form-item>

        <el-form-item label="是否最新版本" prop="isLatest">
          <el-radio-group v-model="formData.isLatest">
            <el-radio :value="true">是</el-radio>
            <el-radio :value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="发布状态" prop="publishStatus">
          <el-radio-group v-model="formData.publishStatus">
            <el-radio value="published">已发布</el-radio>
            <el-radio value="unpublished">未发布</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="使用状态" prop="useStatus">
          <el-radio-group v-model="formData.useStatus">
            <el-radio value="enabled">启用</el-radio>
            <el-radio value="disabled">停用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否允许编辑" prop="allowEdit">
          <el-radio-group v-model="formData.allowEdit">
            <el-radio :value="true">是</el-radio>
            <el-radio :value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否允许删除" prop="allowDelete">
          <el-radio-group v-model="formData.allowDelete">
            <el-radio :value="true">是</el-radio>
            <el-radio :value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">{{ isEdit ? '保存修改' : '确认创建' }}</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Plus, Connection, Search, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { mockWorkflowList } from '@/mock/workflow/workflowData'
import type { WorkflowItem } from '@/types/workflow'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchName = ref('')
const drawerVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const filteredData = computed(() => {
  let data = mockWorkflowList
  if (searchName.value) {
    data = data.filter(item => item.name.includes(searchName.value))
  }
  pagination.total = data.length
  return data
})

const paginatedData = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  return filteredData.value.slice(start, start + pagination.pageSize)
})

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.page = 1
}
const handlePageChange = (page: number) => {
  pagination.page = page
}

const formData = reactive({
  id: 0,
  name: '',
  scenario: '',
  type: '',
  version: '',
  versionDesc: '',
  isLatest: true,
  publishStatus: 'unpublished' as 'published' | 'unpublished',
  useStatus: 'enabled' as 'enabled' | 'disabled',
  allowEdit: true,
  allowDelete: true
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入流程名称', trigger: 'blur' }],
  scenario: [{ required: true, message: '请输入业务场景', trigger: 'blur' }],
  type: [{ required: true, message: '请输入流程类型', trigger: 'blur' }],
  version: [{ required: true, message: '请输入版本号', trigger: 'blur' }]
}

const handleSearch = () => {
  pagination.page = 1
}

const handleCreate = () => {
  isEdit.value = false
  formData.id = 0
  formData.name = ''
  formData.scenario = ''
  formData.type = ''
  formData.version = ''
  formData.versionDesc = ''
  formData.isLatest = true
  formData.publishStatus = 'unpublished'
  formData.useStatus = 'enabled'
  formData.allowEdit = true
  formData.allowDelete = true
  drawerVisible.value = true
}

const handleDesign = (row: WorkflowItem) => {
  const route = router.resolve({
    path: '/dispatch/basic/workflow-designer',
    query: { id: row.id, name: row.name }
  })
  window.open(route.href, '_blank')
}

const handleEdit = (row: WorkflowItem) => {
  isEdit.value = true
  formData.id = row.id
  formData.name = row.name
  formData.scenario = row.scenario
  formData.type = row.type
  formData.version = row.version
  formData.versionDesc = row.versionDesc
  formData.isLatest = row.isLatest
  formData.publishStatus = row.publishStatus
  formData.useStatus = row.useStatus
  formData.allowEdit = row.allowEdit
  formData.allowDelete = row.allowDelete
  drawerVisible.value = true
}

const handleDelete = (row: WorkflowItem) => {
  ElMessageBox.confirm(`确定要删除流程"${row.name}"吗？`, '删除确认', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        ElMessage.success('修改成功')
      } else {
        ElMessage.success('新增成功')
      }
      drawerVisible.value = false
    }
  })
}

const resetForm = () => {
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
.workflow-management {
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

    .search-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #ebeef5;
    }

    .search-bar-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .search-bar-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

    .data-table { flex: 1; }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    flex-shrink: 0;
  }

  .drawer-footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;
    border-top: 1px solid #EBEEF5;
    margin-top: 20px;
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
