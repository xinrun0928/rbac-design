<template>
  <div class="form-template-management">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <span class="search-bar-title">填报表单管理</span>
        <div class="search-bar-actions">
          <el-input
            v-model="searchForm.formName"
            placeholder="搜索表单名称"
            clearable
            :prefix-icon="Search"
            style="width: 180px; margin-right: 12px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
          <el-select
            v-model="searchForm.formType"
            placeholder="表单类型"
            clearable
            style="width: 180px; margin-right: 12px"
            @change="handleSearch"
          >
            <el-option
              v-for="item in FORM_TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button type="primary" :icon="Plus" @click="handleAdd">增加</el-button>
          <el-button type="success" :icon="Download" @click="handleExport">导出</el-button>
        </div>
      </div>

      <!-- 数据表格 -->
      <el-table
        v-loading="loading"
        :data="filteredData"
        border
        stripe
        highlight-current-row
        row-key="formId"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="formName" label="表单名称" min-width="160" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="name-text">{{ row.formName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="businessScene" label="业务场景" width="120" align="center">
          <template #default="{ row }">
            <span>{{ row.businessScene }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="version" label="版本号" width="80" align="center">
          <template #default="{ row }">
            <span class="version-text">{{ row.version }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="formType" label="表单类型" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="getFormTypeTag(row.formType)" effect="plain" size="small">
              {{ row.formType }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="terminal" label="适配终端" width="110" align="center">
          <template #default="{ row }">
            <span>{{ row.terminal }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="publishStatus" label="发布状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.publishStatus === 'published' ? 'success' : 'info'" effect="plain" size="small">
              {{ row.publishStatus === 'published' ? '已发布' : '未发布' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="useStatus" label="使用状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.useStatus ? 'success' : 'info'" effect="plain" size="small">
              {{ row.useStatus ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">修改</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

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

    <!-- 新增/编辑抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="isEdit ? '修改表单' : '新增表单'"
      size="500px"
      direction="rtl"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110px" label-position="right">
        <el-form-item label="表单名称" prop="formName">
          <el-input v-model="formData.formName" placeholder="必填" maxlength="50" show-word-limit />
        </el-form-item>

        <el-form-item label="业务场景" prop="businessScene">
          <el-select v-model="formData.businessScene" placeholder="如隐患排查/事故管理" style="width: 100%">
            <el-option
              v-for="item in BUSINESS_SCENE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="表单类型" prop="formType">
          <el-select v-model="formData.formType" placeholder="填报/检查/巡检/报告" style="width: 100%">
            <el-option
              v-for="item in FORM_TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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

        <el-form-item label="适配终端" prop="terminal">
          <el-select v-model="formData.terminal" placeholder="PC/移动端/平板" style="width: 100%">
            <el-option
              v-for="item in TERMINAL_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="发布状态" prop="publishStatus">
          <el-select v-model="formData.publishStatus" placeholder="未发布/已发布" style="width: 100%">
            <el-option label="已发布" value="published" />
            <el-option label="未发布" value="unpublished" />
          </el-select>
        </el-form-item>

        <el-form-item label="使用状态" prop="useStatus">
          <el-radio-group v-model="formData.useStatus">
            <el-radio :value="true">启用</el-radio>
            <el-radio :value="false">停用</el-radio>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Search, Plus, Delete, Edit, Download
} from '@element-plus/icons-vue'
import { formTemplateData } from '@/mock/dispatch/formTemplateData'
import {
  FORM_TYPE_OPTIONS,
  TERMINAL_OPTIONS,
  BUSINESS_SCENE_OPTIONS
} from '@/types/dispatch/formTemplate'
import type { FormTemplate, FormTemplateForm } from '@/types/dispatch/formTemplate'

// ── 状态 ──
const loading = ref(false)
const tableData = ref<FormTemplate[]>([...formTemplateData])
const drawerVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const searchForm = reactive({
  formName: '',
  formType: ''
})

const formData = reactive<FormTemplateForm>({
  formId: 0,
  formName: '',
  businessScene: '',
  version: '',
  versionDesc: '',
  formType: '',
  terminal: '',
  publishStatus: 'unpublished',
  useStatus: true,
  isLatest: true,
  allowEdit: true,
  allowDelete: true,
  description: ''
})

const formRules: FormRules = {
  formName: [{ required: true, message: '请输入表单名称', trigger: 'blur' }],
  businessScene: [{ required: true, message: '请选择业务场景', trigger: 'change' }],
  formType: [{ required: true, message: '请选择表单类型', trigger: 'change' }],
  version: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
  terminal: [{ required: true, message: '请选择适配终端', trigger: 'change' }],
  publishStatus: [{ required: true, message: '请选择发布状态', trigger: 'change' }]
}

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// ── 计算属性 ──
const filteredData = computed(() => {
  let data = tableData.value

  if (searchForm.formName) {
    data = data.filter(item => item.formName.includes(searchForm.formName))
  }
  if (searchForm.formType) {
    data = data.filter(item => item.formType === searchForm.formType)
  }

  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

// ── 方法 ──
function getFormTypeTag(type: string) {
  const map: Record<string, string> = {
    '填报表单': '',
    '报告表单': 'success',
    '记录表单': 'info',
    '检查表单': 'warning',
    '分析表单': 'danger',
    '巡检表单': ''
  }
  return map[type] || 'info'
}

function handleSearch() {
  pagination.page = 1
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
}

function handlePageChange(page: number) {
  pagination.page = page
}

function handleAdd() {
  isEdit.value = false
  formData.formId = 0
  formData.formName = ''
  formData.businessScene = ''
  formData.version = ''
  formData.versionDesc = ''
  formData.formType = ''
  formData.terminal = ''
  formData.publishStatus = 'unpublished'
  formData.useStatus = true
  formData.isLatest = true
  formData.allowEdit = true
  formData.allowDelete = true
  formData.description = ''
  drawerVisible.value = true
}

function handleEdit(row: FormTemplate) {
  isEdit.value = true
  formData.formId = row.formId
  formData.formName = row.formName
  formData.businessScene = row.businessScene
  formData.version = row.version
  formData.versionDesc = row.versionDesc || ''
  formData.formType = row.formType
  formData.terminal = row.terminal
  formData.publishStatus = row.publishStatus
  formData.useStatus = row.useStatus
  formData.isLatest = row.isLatest
  formData.allowEdit = row.allowEdit
  formData.allowDelete = row.allowDelete
  formData.description = row.description || ''
  drawerVisible.value = true
}

function handleSubmit() {
  if (!formRef.value) return
  formRef.value.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        const index = tableData.value.findIndex(item => item.formId === formData.formId)
        if (index !== -1) {
          tableData.value[index] = {
            ...tableData.value[index],
            formName: formData.formName,
            businessScene: formData.businessScene,
            version: formData.version,
            versionDesc: formData.versionDesc,
            formType: formData.formType,
            terminal: formData.terminal,
            publishStatus: formData.publishStatus,
            useStatus: formData.useStatus,
            isLatest: formData.isLatest,
            allowEdit: formData.allowEdit,
            allowDelete: formData.allowDelete,
            description: formData.description,
            updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19)
          }
        }
        ElMessage.success('修改成功')
      } else {
        const maxId = Math.max(...tableData.value.map(item => item.formId), 0)
        const newForm: FormTemplate = {
          formId: maxId + 1,
          formName: formData.formName,
          businessScene: formData.businessScene,
          version: formData.version,
          versionDesc: formData.versionDesc,
          formType: formData.formType,
          terminal: formData.terminal,
          publishStatus: formData.publishStatus,
          useStatus: formData.useStatus,
          isLatest: formData.isLatest,
          allowEdit: formData.allowEdit,
          allowDelete: formData.allowDelete,
          description: formData.description,
          createTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
          updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19)
        }
        tableData.value.unshift(newForm)
        ElMessage.success('新增成功')
      }
      drawerVisible.value = false
    }
  })
}

function handleDelete(row: FormTemplate) {
  ElMessageBox.confirm(
    `确定要删除表单 "${row.formName}" 吗？`,
    '确认删除',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    tableData.value = tableData.value.filter(item => item.formId !== row.formId)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

function handleExport() {
  ElMessage.success('导出成功')
}

function resetForm() {
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
.form-template-management {
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
      flex-shrink: 0;
    }

    .name-text { font-weight: 500; color: #303133; }
    .version-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 12px;
      color: #409EFF;
      background: #ECF5FF;
      padding: 2px 8px;
      border-radius: 4px;
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
