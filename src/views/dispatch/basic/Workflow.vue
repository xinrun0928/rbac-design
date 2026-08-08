<template>
  <div class="page-container">
    <div class="page-header">
      <h2>工作流程管理</h2>
      <div class="header-actions">
        <el-input
          v-model="searchName"
          placeholder="搜索流程名称"
          clearable
          :prefix-icon="Search"
          style="width: 180px; margin-right: 12px"
          @keyup.enter="handleSearch"
          @clear="handleSearch"
        />
        <el-button type="primary" @click="handleCreate">
          <el-icon><Plus /></el-icon>
          新建流程
        </el-button>
      </div>
    </div>

    <el-table
      :data="filteredData"
      border
      stripe
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
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="handleDesign(row)">
            <el-icon><Connection /></el-icon>
            流程设计
          </el-button>
          <el-button
            v-if="row.allowEdit"
            type="primary"
            link
            size="small"
            @click="handleEdit(row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="row.allowDelete"
            type="danger"
            link
            size="small"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

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
import { Plus, Connection, Search } from '@element-plus/icons-vue'
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

const filteredData = computed(() => {
  if (!searchName.value) return mockWorkflowList
  return mockWorkflowList.filter(item => item.name.includes(searchName.value))
})

const handleSearch = () => {
  // 搜索由 computed 自动处理
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
.page-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }
}

.header-actions {
  display: flex;
  align-items: center;
}

.data-table {
  width: 100%;
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #EBEEF5;
  margin-top: 20px;
}
</style>
