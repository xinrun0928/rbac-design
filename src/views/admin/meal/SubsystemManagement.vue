<template>
  <div class="subsystem-management">

    <!-- 数据表格 -->
    <el-card class="table-card animate-item" shadow="never">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <el-form :model="searchForm" inline class="search-form">
          <el-form-item label="子系统编码">
            <el-input
              v-model="searchForm.subsystemCode"
              placeholder="输入编码，如：EMERGENCY"
              clearable
              :prefix-icon="Search"
              style="width: 180px"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="子系统名称">
            <el-input
              v-model="searchForm.subsystemName"
              placeholder="输入子系统名称"
              clearable
              :prefix-icon="Search"
              style="width: 180px"
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 180px">
              <el-option label="正常" :value="1101" />
              <el-option label="停用" :value="1102" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="search-actions">
          <el-button type="primary" :icon="Plus" @click="handleAdd">新增子系统</el-button>
        </div>
      </div>
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        highlight-current-row
        row-key="subsystemId"
        @selection-change="handleSelectionChange"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600' }"
        empty-text=" "
      >
        <el-table-column prop="subsystemId" label="ID" width="70" align="center">
          <template #default="{ row }">
            <span class="id-text">{{ row.subsystemId }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="subsystemCode" label="子系统编码" width="200">
          <template #default="{ row }">
            <div class="code-cell">
              <span class="code-text">{{ row.subsystemCode }}</span>
              <el-tooltip content="复制编码" placement="top">
                <el-button type="primary" link size="small" @click="handleCopy(row.subsystemCode)">
                  <el-icon><CopyDocument /></el-icon>
                </el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="subsystemName" label="子系统名称" min-width="180">
          <template #default="{ row }">
            <span class="name-text">{{ row.subsystemName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="subsystemShortName" label="简称" width="100" align="center">
          <template #default="{ row }">
            <span class="short-name-text">{{ row.subsystemShortName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="icon" label="图标" width="80" align="center">
          <template #default="{ row }">
            <div v-if="row.icon" class="icon-preview" :style="{ background: row.color || '#409EFF' }">
              <el-icon :size="16" color="#fff"><component :is="row.icon" /></el-icon>
            </div>
            <span v-else class="empty-text">-</span>
          </template>
        </el-table-column>

        <el-table-column prop="color" label="颜色" width="100" align="center">
          <template #default="{ row }">
            <div v-if="row.color" class="color-preview">
              <div class="color-block" :style="{ background: row.color }"></div>
              <span class="color-text">{{ row.color.substring(0, 15) }}...</span>
            </div>
            <span v-else class="empty-text">-</span>
          </template>
        </el-table-column>

        <el-table-column prop="pathPrefix" label="路径前缀" width="120" align="center">
          <template #default="{ row }">
            <span class="prefix-text">{{ row.pathPrefix || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="tablePrefix" label="表前缀" min-width="180">
          <template #default="{ row }">
            <div v-if="row.tablePrefix" class="table-prefix-cell">
              <el-tag
                v-for="(prefix, index) in row.tablePrefix.split(',')"
                :key="index"
                :color="getTablePrefixColor(index)"
                effect="dark"
                style="border: none; color: #fff; margin-right: 4px; margin-bottom: 2px;"
                size="small"
              >
                {{ prefix }}
              </el-tag>
            </div>
            <span v-else class="empty-text">-</span>
          </template>
        </el-table-column>

        <el-table-column prop="displayOrder" label="显示顺序" width="100" align="center">
          <template #default="{ row }">
            <span class="sort-text">{{ row.displayOrder }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="isHidden" label="可见性" width="100" align="center">
          <template #default="{ row }">
            <el-tag
              :type="row.isHidden ? 'info' : 'success'"
              effect="plain"
              round
            >
              {{ row.isHidden ? '隐藏' : '显示' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="120" align="center">
          <template #default="{ row }">
            <el-switch
              :model-value="row.status"
              :active-value="1101"
              :inactive-value="1102"
              active-text="正常"
              inactive-text="停用"
              inline-prompt
              style="--el-switch-on-color: #67C23A; --el-switch-off-color: #909399"
              @change="(val: number) => handleStatusChange(row, val)"
            />
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" width="170" align="center">
          <template #default="{ row }">
            <el-tooltip :content="row.createTime" placement="top">
              <span class="time-text">{{ row.createTime }}</span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link :icon="Edit" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link :icon="Delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>

        <!-- 空状态插槽 -->
        <template #empty>
          <div class="empty-state">
            <el-icon :size="64" color="#DCDFE6"><Box /></el-icon>
            <p class="empty-title">暂无子系统数据</p>
            <p class="empty-desc">
              点击上方
              <el-button type="primary" link @click="handleAdd">"新增子系统"</el-button>
              按钮创建第一个子系统
            </p>
          </div>
        </template>
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

    <!-- 新增抽屉 -->
    <el-drawer
      v-model="addDialogVisible"
      title="新增子系统"
      size="500px"
      direction="rtl"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form
        ref="addFormRef"
        :model="addFormData"
        :rules="formRules"
        label-width="110px"
        label-position="right"
        class="subsystem-form"
      >
        <el-form-item label="子系统编码" prop="subsystemCode">
          <el-input
            v-model="addFormData.subsystemCode"
            placeholder="请输入编码，如：EMERGENCY_WATCH"
            maxlength="50"
            show-word-limit
          >
            <template #append>
              <el-tooltip content="编码将自动转为大写" placement="top">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="子系统名称" prop="subsystemName">
          <el-input
            v-model="addFormData.subsystemName"
            placeholder="请输入子系统名称"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="子系统简称" prop="subsystemShortName">
          <el-input
            v-model="addFormData.subsystemShortName"
            placeholder="请输入简称，如：值守"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="图标" prop="icon">
          <el-select v-model="addFormData.icon" placeholder="请选择图标" clearable style="width: 100%">
            <el-option v-for="item in iconOptions" :key="item.value" :label="item.label" :value="item.value">
              <div style="display: flex; align-items: center; gap: 8px;">
                <el-icon><component :is="item.value" /></el-icon>
                <span>{{ item.label }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="颜色" prop="color">
          <el-select v-model="addFormData.color" placeholder="请选择颜色" clearable style="width: 100%">
            <el-option v-for="item in colorOptions" :key="item.value" :label="item.label" :value="item.value">
              <div style="display: flex; align-items: center; gap: 8px;">
                <div :style="{ width: '20px', height: '20px', borderRadius: '4px', background: item.value }"></div>
                <span>{{ item.label }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="路径前缀" prop="pathPrefix">
          <el-input v-model="addFormData.pathPrefix" placeholder="如：/duty" maxlength="50" />
          <div class="form-tip">URL路径前缀，以/开头</div>
        </el-form-item>

        <el-form-item label="表前缀" prop="tablePrefix">
          <el-input v-model="addFormData.tablePrefix" placeholder="如：duty_" maxlength="50" />
          <div class="form-tip">数据库表名前缀，如duty_、plan_、event_等</div>
        </el-form-item>

        <el-form-item label="显示顺序" prop="displayOrder">
          <el-input-number v-model="addFormData.displayOrder" :min="0" :max="9999" style="width: 180px" />
          <span class="form-tip-inline">数值越小越靠前</span>
        </el-form-item>

        <el-form-item label="是否隐藏" prop="isHidden">
          <el-switch
            v-model="addFormData.isHidden"
            active-text="隐藏"
            inactive-text="显示"
            inline-prompt
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="addFormData.status">
            <el-radio :value="1101">正常</el-radio>
            <el-radio :value="1102">停用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="addFormData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleAddSubmit">
          确认创建
        </el-button>
      </template>
    </el-drawer>

    <!-- 编辑抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      title="编辑子系统"
      size="500px"
      direction="rtl"
      destroy-on-close
      @closed="resetForm"
    >
      <el-form
        ref="editFormRef"
        :model="editFormData"
        :rules="formRules"
        label-width="110px"
        label-position="right"
        class="subsystem-form"
      >
        <el-form-item label="子系统编码" prop="subsystemCode">
          <el-input
            v-model="editFormData.subsystemCode"
            placeholder="请输入编码"
            disabled
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="子系统名称" prop="subsystemName">
          <el-input
            v-model="editFormData.subsystemName"
            placeholder="请输入子系统名称"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="子系统简称" prop="subsystemShortName">
          <el-input
            v-model="editFormData.subsystemShortName"
            placeholder="请输入简称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="图标" prop="icon">
          <el-select v-model="editFormData.icon" placeholder="请选择图标" clearable style="width: 100%">
            <el-option v-for="item in iconOptions" :key="item.value" :label="item.label" :value="item.value">
              <div style="display: flex; align-items: center; gap: 8px;">
                <el-icon><component :is="item.value" /></el-icon>
                <span>{{ item.label }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="颜色" prop="color">
          <el-select v-model="editFormData.color" placeholder="请选择颜色" clearable style="width: 100%">
            <el-option v-for="item in colorOptions" :key="item.value" :label="item.label" :value="item.value">
              <div style="display: flex; align-items: center; gap: 8px;">
                <div :style="{ width: '20px', height: '20px', borderRadius: '4px', background: item.value }"></div>
                <span>{{ item.label }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="路径前缀" prop="pathPrefix">
          <el-input
            v-model="editFormData.pathPrefix"
            placeholder="如：/duty"
            maxlength="50"
          />
          <div class="form-tip">URL路径前缀，以/开头</div>
        </el-form-item>

        <el-form-item label="表前缀" prop="tablePrefix">
          <el-input
            v-model="editFormData.tablePrefix"
            placeholder="如：duty_"
            maxlength="50"
          />
          <div class="form-tip">数据库表名前缀，如duty_、plan_、event_等</div>
        </el-form-item>

        <el-form-item label="显示顺序" prop="displayOrder">
          <el-input-number v-model="editFormData.displayOrder" :min="0" :max="9999" style="width: 180px" />
          <span class="form-tip-inline">数值越小越靠前</span>
        </el-form-item>

        <el-form-item label="是否隐藏" prop="isHidden">
          <el-switch
            v-model="editFormData.isHidden"
            active-text="隐藏"
            inactive-text="显示"
            inline-prompt
          />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="editFormData.status">
            <el-radio :value="1101">正常</el-radio>
            <el-radio :value="1102">停用</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="editFormData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="drawer-footer">
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" :loading="submitLoading" @click="handleEditSubmit">
            保存修改
          </el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Refresh, Search, RefreshLeft, Plus, Delete, Edit,
  CopyDocument, QuestionFilled,
  SuccessFilled, CircleCloseFilled, Box,
  DataBoard, CircleCheck, CircleClose, Monitor
} from '@element-plus/icons-vue'
import type { Subsystem, SubsystemForm, SubsystemSearchForm } from '@/types/admin/subsystem'
import {
  getSubsystems,
  addSubsystem,
  updateSubsystem,
  deleteSubsystem,
  batchDeleteSubsystems,
  toggleSubsystemStatus
} from '@/utils/subsystemMockApi'

// ── 状态 ──
const loading = ref(false)
const submitLoading = ref(false)
const tableData = ref<Subsystem[]>([])
const selectedIds = ref<number[]>([])
const addDialogVisible = ref(false)
const drawerVisible = ref(false)
const addFormRef = ref<FormInstance>()
const editFormRef = ref<FormInstance>()

const searchForm = reactive<SubsystemSearchForm>({
  subsystemCode: '',
  subsystemName: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const addFormData = reactive<SubsystemForm>({
  subsystemCode: '',
  subsystemName: '',
  subsystemShortName: '',
  pathPrefix: '',
  tablePrefix: '',
  displayOrder: 0,
  isHidden: false,
  status: 1101,
  remark: '',
  icon: '',
  color: ''
})

const editFormData = reactive<SubsystemForm>({
  subsystemCode: '',
  subsystemName: '',
  subsystemShortName: '',
  pathPrefix: '',
  tablePrefix: '',
  displayOrder: 0,
  isHidden: false,
  status: 1101,
  remark: '',
  icon: '',
  color: ''
})

// 图标选项
const iconOptions = [
  { label: 'Monitor', value: 'Monitor' },
  { label: 'Document', value: 'Document' },
  { label: 'Warning', value: 'Warning' },
  { label: 'Connection', value: 'Connection' },
  { label: 'Box', value: 'Box' },
  { label: 'DataAnalysis', value: 'DataAnalysis' },
  { label: 'Upload', value: 'Upload' },
  { label: 'Setting', value: 'Setting' },
  { label: 'Odometer', value: 'Odometer' }
]

// 颜色选项
const colorOptions = [
  { label: '紫蓝渐变', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { label: '粉紫渐变', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { label: '蓝青渐变', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { label: '绿色渐变', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { label: '粉黄渐变', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { label: '紫粉渐变', value: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
  { label: '橙粉渐变', value: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
  { label: '蓝青渐变2', value: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)' },
  { label: '深蓝渐变', value: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)' }
]

// ── 表单验证规则 ──
const formRules: FormRules = {
  subsystemCode: [
    { required: true, message: '请输入子系统编码', trigger: 'blur' },
    { pattern: /^[A-Za-z_]+$/, message: '只能包含英文字母和下划线', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  subsystemName: [
    { required: true, message: '请输入子系统名称', trigger: 'blur' }
  ],
  subsystemShortName: [
    { required: true, message: '请输入子系统简称', trigger: 'blur' }
  ],
  displayOrder: [
    { required: true, message: '请输入显示顺序', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// ── 方法 ──
async function fetchData() {
  loading.value = true
  try {
    const res = await getSubsystems({
      page: pagination.page,
      pageSize: pagination.pageSize,
      search: searchForm
    })
    tableData.value = res.list
    pagination.total = res.total
  } catch (err) {
    ElMessage.error('获取数据失败，请重试')
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  fetchData()
}

function handleReset() {
  searchForm.subsystemCode = ''
  searchForm.subsystemName = ''
  searchForm.status = ''
  pagination.page = 1
  fetchData()
}

// 表前缀颜色
const tablePrefixColors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#9B59B6', '#1ABC9C', '#3498DB', '#E74C3C']

function getTablePrefixColor(index: number): string {
  return tablePrefixColors[index % tablePrefixColors.length]
}

function handleRefresh() {
  fetchData()
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
  fetchData()
}

function handlePageChange(page: number) {
  pagination.page = page
  fetchData()
}

function handleSelectionChange(rows: Subsystem[]) {
  selectedIds.value = rows.map(r => r.subsystemId)
}

function clearSelection() {
  selectedIds.value = []
}

function handleAdd() {
  addFormData.subsystemCode = ''
  addFormData.subsystemName = ''
  addFormData.subsystemShortName = ''
  addFormData.displayOrder = pagination.total + 1
  addFormData.isHidden = false
  addFormData.status = 1101
  addFormData.remark = ''
  addDialogVisible.value = true
}

function handleEdit(row: Subsystem) {
  editFormData.subsystemId = row.subsystemId
  editFormData.subsystemCode = row.subsystemCode
  editFormData.subsystemName = row.subsystemName
  editFormData.subsystemShortName = row.subsystemShortName
  editFormData.pathPrefix = row.pathPrefix
  editFormData.tablePrefix = row.tablePrefix
  editFormData.displayOrder = row.displayOrder
  editFormData.isHidden = row.isHidden
  editFormData.status = row.status
  editFormData.remark = row.remark ?? ''
  editFormData.icon = row.icon || ''
  editFormData.color = row.color || ''
  drawerVisible.value = true
}

async function handleAddSubmit() {
  if (!addFormRef.value) return

  try {
    await addFormRef.value.validate()
  } catch {
    return
  }

  submitLoading.value = true
  try {
    await addSubsystem({
      subsystemCode: addFormData.subsystemCode,
      subsystemName: addFormData.subsystemName,
      subsystemShortName: addFormData.subsystemShortName,
      pathPrefix: addFormData.pathPrefix,
      tablePrefix: addFormData.tablePrefix,
      displayOrder: addFormData.displayOrder,
      isHidden: addFormData.isHidden,
      status: addFormData.status,
      remark: addFormData.remark,
      icon: addFormData.icon,
      color: addFormData.color
    })
    ElMessage.success('新增成功，子系统已创建')
    addDialogVisible.value = false
    fetchData()
  } catch (err) {
    ElMessage.error('操作失败，请重试')
  } finally {
    submitLoading.value = false
  }
}

async function handleEditSubmit() {
  if (!editFormRef.value) return

  try {
    await editFormRef.value.validate()
  } catch {
    return
  }

  submitLoading.value = true
  try {
    if (editFormData.subsystemId) {
      await updateSubsystem(editFormData.subsystemId, {
        subsystemCode: editFormData.subsystemCode,
        subsystemName: editFormData.subsystemName,
        subsystemShortName: editFormData.subsystemShortName,
        pathPrefix: editFormData.pathPrefix,
        tablePrefix: editFormData.tablePrefix,
        displayOrder: editFormData.displayOrder,
        isHidden: editFormData.isHidden,
        status: editFormData.status,
        remark: editFormData.remark,
        icon: editFormData.icon,
        color: editFormData.color
      })
      ElMessage.success('编辑成功，数据已更新')
      drawerVisible.value = false
      fetchData()
    }
  } catch (err) {
    ElMessage.error('操作失败，请重试')
  } finally {
    submitLoading.value = false
  }
}

function resetForm() {
  addFormRef.value?.resetFields()
  editFormRef.value?.resetFields()
}

async function handleDelete(row: Subsystem) {
  try {
    await ElMessageBox.confirm(
      `您即将删除以下子系统：\n\n子系统名称：${row.subsystemName}\n子系统编码：${row.subsystemCode}\n\n删除后将无法恢复，确定要继续吗？`,
      '确认删除',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: false
      }
    )

    loading.value = true
    await deleteSubsystem(row.subsystemId)
    ElMessage.success('删除成功')
    fetchData()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败，请重试')
    }
  } finally {
    loading.value = false
  }
}

async function handleBatchDelete() {
  if (!selectedIds.value.length) return

  try {
    await ElMessageBox.confirm(
      `您已选择 ${selectedIds.value.length} 条子系统数据，删除后将无法恢复，确定要继续吗？`,
      '批量删除确认',
      {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    loading.value = true
    await batchDeleteSubsystems(selectedIds.value)
    ElMessage.success(`成功删除 ${selectedIds.value.length} 条数据`)
    selectedIds.value = []
    fetchData()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('批量删除失败，请重试')
    }
  } finally {
    loading.value = false
  }
}

async function handleStatusChange(row: Subsystem, newStatus: number) {
  const from = newStatus === 1101 ? '停用' : '正常'
  const to = newStatus === 1101 ? '正常' : '停用'

  try {
    await ElMessageBox.confirm(
      `您将把子系统 "${row.subsystemName}" 的状态从 "${from}" 切换为 "${to}"，确定要继续吗？`,
      '切换状态确认',
      {
        confirmButtonText: '确认切换',
        cancelButtonText: '取消',
        type: 'info'
      }
    )

    await toggleSubsystemStatus(row.subsystemId, newStatus)
    row.status = newStatus
    ElMessage.success(`状态已切换为 "${to}"`)
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('状态切换失败，请重试')
    }
    fetchData()
  }
}

async function handleCopy(code: string) {
  try {
    await navigator.clipboard.writeText(code)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.warning('复制失败，请手动复制')
  }
}

function getAvatarColor(name: string): string {
  const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#9B59B6', '#00BCD4']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

// ── 初始化 ──
onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.subsystem-management {
  padding: 0;
  background: linear-gradient(160deg, #F5F7FA 0%, #E8ECF1 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;

  // 入场动画
  .animate-item {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;

    &:nth-child(1) { animation-delay: 0.05s; }
    &:nth-child(2) { animation-delay: 0.12s; }
    &:nth-child(3) { animation-delay: 0.19s; }
    &:nth-child(4) { animation-delay: 0.26s; }
    &:nth-child(5) { animation-delay: 0.33s; }
  }

  // 页面头部

  // 搜索栏
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

  // 表格卡片
  .table-card {
    border-radius: 12px;
    border: none;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.el-card__body) {
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    :deep(.el-table) {
      border-radius: 8px;
      overflow: hidden;
      flex: 1;

      .el-table__row {
        transition: background-color 0.2s ease;
      }
    }

    .id-text {
      color: #909399;
      font-size: 13px;
    }

    .code-cell {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .code-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      color: #409EFF;
      font-size: 12px;
      background: #ECF5FF;
      padding: 3px 8px;
      border-radius: 4px;
    }

    .icon-preview {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .color-preview {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .color-block {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      flex-shrink: 0;
    }

    .color-text {
      font-size: 11px;
      color: #909399;
    }

    .name-text {
      font-weight: 500;
      color: #303133;
    }

    .short-name-text {
      color: #606266;
      font-size: 13px;
    }

    .prefix-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      color: #409EFF;
      font-size: 12px;
      background: #ECF5FF;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .table-prefix-cell {
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
    }

    .empty-text {
      color: #C0C4CC;
      font-size: 13px;
    }

    .sort-text {
      font-weight: 600;
      color: #606266;
    }

    .creator-cell {
      display: flex;
      align-items: center;
      gap: 8px;
      justify-content: center;

      span {
        font-size: 13px;
        color: #606266;
      }
    }

    .time-text {
      font-size: 13px;
      color: #909399;
    }

    // 空状态
    .empty-state {
      padding: 48px 0;

      .empty-title {
        font-size: 16px;
        color: #606266;
        margin: 16px 0 8px;
      }

      .empty-desc {
        font-size: 13px;
        color: #909399;
      }
    }
  }

  // 分页
  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    flex-shrink: 0;
  }

  // 对话框
  :deep(.el-dialog) {
    border-radius: 12px;
    overflow: hidden;

    .el-dialog__header {
      padding: 20px 24px;
      margin: 0;

      .el-dialog__title {
        font-weight: 600;
        font-size: 16px;
      }
    }

    .el-dialog__body {
      padding: 28px 24px 12px;
    }

    .el-dialog__footer {
      padding: 16px 24px;
      border-top: 1px solid #EBEEF5;
    }
  }

  // 抽屉
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
    }
  }

  .drawer-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid #EBEEF5;
  }

  // 表单
  .subsystem-form {
    .form-tip-inline {
      font-size: 12px;
      color: #909399;
      margin-left: 12px;
    }

    .form-tip {
      font-size: 12px;
      color: #909399;
      margin-top: 4px;
    }
  }
}
</style>

<style>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
