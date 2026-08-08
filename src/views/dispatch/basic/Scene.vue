<template>
  <div class="scene-management">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <span class="search-bar-title">业务场景管理</span>
        <div class="search-bar-actions">
          <el-input
            v-model="searchForm.sceneName"
            placeholder="搜索场景名称"
            clearable
            :prefix-icon="Search"
            style="width: 180px; margin-right: 12px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
          <el-select
            v-model="searchForm.sceneType"
            placeholder="场景类型"
            clearable
            style="width: 180px; margin-right: 12px"
            @change="handleSearch"
          >
            <el-option
              v-for="item in SCENE_TYPE_OPTIONS"
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
        row-key="sceneId"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="sceneName" label="场景名称" min-width="180" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="name-text">{{ row.sceneName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="sceneCode" label="场景编码" min-width="180" align="center">
          <template #default="{ row }">
            <span class="code-text">{{ row.sceneCode }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="sceneType" label="场景类型" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getSceneTypeTag(row.sceneType)" effect="plain" size="small">
              {{ row.sceneType }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="applicableBusiness" label="适用业务" width="120" align="center">
          <template #default="{ row }">
            <span>{{ row.applicableBusiness }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="applicableScope" label="适用范围" width="120" align="center">
          <template #default="{ row }">
            <span>{{ row.applicableScope }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="enabled" label="是否启用" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.enabled ? 'success' : 'info'" effect="plain" size="small">
              {{ row.enabled ? '启用' : '停用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="sceneDescription" label="场景描述" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="desc-text">{{ row.sceneDescription || '-' }}</span>
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
      :title="isEdit ? '修改场景' : '新增场景'"
      size="500px"
      direction="rtl"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="right">
        <el-form-item label="场景名称" prop="sceneName">
          <el-input v-model="formData.sceneName" placeholder="必填，不超过50字，需唯一" maxlength="50" show-word-limit />
        </el-form-item>

        <el-form-item label="场景编码" prop="sceneCode">
          <el-input v-model="formData.sceneCode" placeholder="必填，唯一编码（格式：SCENE_XXX_001）" :disabled="isEdit" />
        </el-form-item>

        <el-form-item label="场景类型" prop="sceneType">
          <el-select v-model="formData.sceneType" placeholder="必选（应急响应/事件处置/日常管理等）" style="width: 100%">
            <el-option
              v-for="item in SCENE_TYPE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="适用业务" prop="applicableBusiness">
          <el-select v-model="formData.applicableBusiness" placeholder="必选（交通事件/灾害事件/设备异常等）" style="width: 100%">
            <el-option
              v-for="item in BUSINESS_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="适用范围" prop="applicableScope">
          <AreaCascader
            v-model="scopeAreaCodes"
            placeholder="请选择适用范围"
            value-field="name"
            @change="handleScopeChange"
          />
        </el-form-item>

        <el-form-item label="关联流程" prop="workflowId">
          <el-select v-model="formData.workflowId" placeholder="可选，下拉选择（已有流程模板）" clearable style="width: 100%">
            <el-option
              v-for="item in workflowOptions"
              :key="item.workflowId"
              :label="item.workflowName"
              :value="item.workflowId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="关联表单" prop="formId">
          <el-select v-model="formData.formId" placeholder="可选，下拉选择（已有表单模板）" clearable style="width: 100%">
            <el-option
              v-for="item in formOptions"
              :key="item.formId"
              :label="item.formName"
              :value="item.formId"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="是否启用" prop="enabled">
          <el-switch v-model="formData.enabled" active-text="是" inactive-text="否" />
        </el-form-item>

        <el-form-item label="场景描述" prop="sceneDescription">
          <el-input v-model="formData.sceneDescription" type="textarea" :rows="3" placeholder="非必填，不超过200字" maxlength="200" show-word-limit />
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
import { businessSceneData, workflowOptions, formOptions } from '@/mock/dispatch/businessSceneData'
import {
  SCENE_TYPE_OPTIONS,
  BUSINESS_OPTIONS
} from '@/types/dispatch/businessScene'
import type { BusinessScene, BusinessSceneForm } from '@/types/dispatch/businessScene'
import AreaCascader from '@/components/AreaCascader.vue'

// ── 状态 ──
const loading = ref(false)
const tableData = ref<BusinessScene[]>([...businessSceneData])
const drawerVisible = ref(false)
const isEdit = ref(false)
const formRef = ref<FormInstance>()

const searchForm = reactive({
  sceneName: '',
  sceneType: ''
})

const formData = reactive<BusinessSceneForm>({
  sceneId: 0,
  sceneName: '',
  sceneCode: '',
  sceneType: '',
  applicableBusiness: '',
  applicableScope: '',
  workflowId: null,
  formId: null,
  enabled: true,
  sceneDescription: ''
})

const formRules: FormRules = {
  sceneName: [{ required: true, message: '请输入场景名称', trigger: 'blur' }],
  sceneCode: [{ required: true, message: '请输入场景编码', trigger: 'blur' }],
  sceneType: [{ required: true, message: '请选择场景类型', trigger: 'change' }],
  applicableBusiness: [{ required: true, message: '请选择适用业务', trigger: 'change' }],
  applicableScope: [{ required: true, message: '请选择适用范围', trigger: 'change' }]
}

// 适用范围地区选择
const scopeAreaCodes = ref<string[]>([])

function handleScopeChange(value: string[] | number[]) {
  // 取最后一个选中的值作为适用范围
  const lastValue = value.length > 0 ? value[value.length - 1] : ''
  formData.applicableScope = String(lastValue)
}

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// ── 计算属性 ──
const filteredData = computed(() => {
  let data = tableData.value

  if (searchForm.sceneName) {
    data = data.filter(item => item.sceneName.includes(searchForm.sceneName))
  }
  if (searchForm.sceneType) {
    data = data.filter(item => item.sceneType === searchForm.sceneType)
  }

  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

// ── 方法 ──
function getSceneTypeTag(type: string) {
  const map: Record<string, string> = {
    '应急响应': 'danger',
    '事故处置': 'warning',
    '灾害应对': '',
    '监测预警': 'info',
    '交通抢险': 'warning',
    '专项保障': 'success'
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
  formData.sceneId = 0
  formData.sceneName = ''
  formData.sceneCode = ''
  formData.sceneType = ''
  formData.applicableBusiness = ''
  formData.applicableScope = ''
  formData.workflowId = null
  formData.formId = null
  formData.enabled = true
  formData.sceneDescription = ''
  scopeAreaCodes.value = []
  drawerVisible.value = true
}

function handleEdit(row: BusinessScene) {
  isEdit.value = true
  formData.sceneId = row.sceneId
  formData.sceneName = row.sceneName
  formData.sceneCode = row.sceneCode
  formData.sceneType = row.sceneType
  formData.applicableBusiness = row.applicableBusiness
  formData.applicableScope = row.applicableScope
  formData.workflowId = row.workflowId || null
  formData.formId = row.formId || null
  formData.enabled = row.enabled
  formData.sceneDescription = row.sceneDescription || ''
  // 将已有的适用范围转换为数组
  scopeAreaCodes.value = row.applicableScope ? [row.applicableScope] : []
  drawerVisible.value = true
}

function handleSubmit() {
  if (!formRef.value) return
  formRef.value.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        const index = tableData.value.findIndex(item => item.sceneId === formData.sceneId)
        if (index !== -1) {
          tableData.value[index] = {
            ...tableData.value[index],
            sceneName: formData.sceneName,
            sceneCode: formData.sceneCode,
            sceneType: formData.sceneType,
            applicableBusiness: formData.applicableBusiness,
            applicableScope: formData.applicableScope,
            workflowId: formData.workflowId,
            formId: formData.formId,
            enabled: formData.enabled,
            sceneDescription: formData.sceneDescription,
            updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19)
          }
        }
        ElMessage.success('修改成功')
      } else {
        const maxId = Math.max(...tableData.value.map(item => item.sceneId), 0)
        const newScene: BusinessScene = {
          sceneId: maxId + 1,
          sceneName: formData.sceneName,
          sceneCode: formData.sceneCode,
          sceneType: formData.sceneType,
          applicableBusiness: formData.applicableBusiness,
          applicableScope: formData.applicableScope,
          workflowId: formData.workflowId,
          formId: formData.formId,
          enabled: formData.enabled,
          sceneDescription: formData.sceneDescription,
          createTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
          updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19)
        }
        tableData.value.unshift(newScene)
        ElMessage.success('新增成功')
      }
      drawerVisible.value = false
    }
  })
}

function handleDelete(row: BusinessScene) {
  ElMessageBox.confirm(
    `确定要删除场景 "${row.sceneName}" 吗？`,
    '确认删除',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    tableData.value = tableData.value.filter(item => item.sceneId !== row.sceneId)
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
.scene-management {
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
    .code-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 12px;
      color: #409EFF;
      background: #ECF5FF;
      padding: 2px 8px;
      border-radius: 4px;
    }
    .desc-text { font-size: 13px; color: #606266; }

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
