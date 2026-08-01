<template>
  <div class="equipment-training-use">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 顶部统计卡片 -->
      <StatsCards v-model="currentCategory" :items="statsCards" :card-width="220" @change="handleCategoryChange" />

      <!-- 搜索栏 -->
      <div class="search-bar">
        <div class="search-bar-filter">
          <span class="filter-label">启用状态：</span>
          <el-link
            v-for="tab in statusTabs"
            :key="tab.value"
            class="filter-link"
            :underline="false"
            :type="currentStatus === tab.value ? 'primary' : 'info'"
            @click="handleStatusChange(tab.value)"
          >{{ tab.label }}</el-link>
        </div>
        <div class="search-bar-actions">
          <el-input
            v-model="searchForm.courseName"
            placeholder="搜索课程包名称"
            clearable
            :prefix-icon="Search"
            style="width: 180px; margin-right: 12px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
          <el-button type="primary" :icon="Plus" @click="handleCreate">新建教程</el-button>
          <el-button type="success" :icon="Download" @click="handleExport">导出</el-button>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="pagedData"
        border
        stripe
        highlight-current-row
        row-key="courseId"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="courseName" label="课程包/培训名称" min-width="220" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="course-name-text">{{ row.courseName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="courseCode" label="课程包编号" width="160" align="center">
          <template #default="{ row }">
            <span class="code-text">{{ row.courseCode }}</span>
          </template>
        </el-table-column>

        <el-table-column label="适用装备分类/型号" min-width="280" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="equipment-info-text">{{ row.equipmentCategory }} - {{ row.equipmentModel }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="resourceTypes" label="包含资源类型" min-width="280" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="resource-types-text">{{ row.resourceTypes }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="attachmentCount" label="配套资源附件数" width="130" align="center">
          <template #default="{ row }">
            <span class="attachment-count">{{ row.attachmentCount }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="启用状态" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" effect="light" round>
              {{ row.status === 1 ? '已启用' : '未启用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="createBy" label="创建人" width="100" align="center">
          <template #default="{ row }">
            <span class="creator-name">{{ row.createBy }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" width="120" align="center">
          <template #default="{ row }">
            <span class="creator-time">{{ row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="updateTime" label="资源更新时间" width="170" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.updateTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="160" align="center" fixed="right">
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
      :title="drawerTitle"
      size="60%"
      direction="rtl"
      destroy-on-close
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
        <el-form-item label="课程包名称" prop="courseName">
          <el-input v-model="formData.courseName" placeholder="请输入课程包名称" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="课程包编号" prop="courseCode">
          <el-input v-model="formData.courseCode" placeholder="系统自动生成" disabled />
        </el-form-item>
        <el-form-item label="适用类型" prop="applyType">
          <el-radio-group v-model="formData.applyType">
            <el-radio :value="1">按种类选择</el-radio>
            <el-radio :value="2">按现有库存装备</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData.applyType === 1" prop="selectedCategories" label=" ">
          <el-tree-select
            v-model="formData.selectedCategories"
            :data="categoryTreeData"
            :props="{ label: 'categoryName', value: 'categoryId', children: 'children' }"
            node-key="categoryId"
            multiple
            show-checkbox
            check-strictly
            :render-after-expand="false"
            placeholder="请选择装备种类（支持多选）"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item v-else prop="selectedEquipment" label=" ">
          <el-select
            v-model="formData.selectedEquipment"
            multiple
            filterable
            placeholder="请选择现有库存装备（支持多选）"
            style="width: 100%"
          >
            <el-option v-for="name in equipmentOptions" :key="name" :label="name" :value="name" />
          </el-select>
        </el-form-item>
        <el-form-item label="资源类型" prop="resourceTypeList">
          <el-checkbox-group v-model="formData.resourceTypeList">
            <el-checkbox
              v-for="rt in resourceTypeOptions"
              :key="rt"
              :label="rt"
              :value="rt"
            />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="配套资源附件" prop="attachments">
          <div class="attachment-upload">
            <el-upload
              v-model:file-list="formData.attachments"
              :auto-upload="false"
              multiple
              :show-file-list="false"
            >
              <el-button type="primary" plain :icon="Upload">上传附件</el-button>
              <template #tip>
                <div class="upload-tip">支持多文件上传，可删除已上传的附件</div>
              </template>
            </el-upload>
            <el-table
              v-if="formData.attachments.length"
              :data="formData.attachments"
              border
              size="small"
              class="attachment-table"
              :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
            >
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column prop="name" label="设备物资名称" min-width="200" align="center">
                <template #default="{ row }">
                  <span class="attachment-name" :title="row.name">{{ row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="类别" width="100" align="center">
                <template #default="{ row }">
                  <el-tag type="primary" effect="plain" size="small">{{ getFileExt(row.name) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="大小" width="100" align="center">
                <template #default="{ row }">
                  <span class="attachment-size">{{ formatFileSize(row.size) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80" align="center">
                <template #default="{ $index }">
                  <el-button type="danger" link :icon="Delete" @click="removeAttachment($index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div v-else class="attachment-empty">尚未上传附件</div>
            <div class="attachment-count-text">
              附件数量：<b class="attachment-count-num">{{ formData.attachments.length }}</b>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="启用状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">已启用</el-radio>
            <el-radio :value="0">未启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea" :rows="3" placeholder="请输入备注" maxlength="200" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="drawerVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Search, Plus, Download, Edit, Delete, Reading, Box, Tools, Operation, More, Upload } from '@element-plus/icons-vue'
import { equipmentTrainingData } from '@/mock/resource/trainingData'
import { materialCategoryData } from '@/mock/resource/categoryData'
import { equipmentSetData } from '@/mock/resource/setData'
import type { EquipmentTraining, EquipmentTrainingForm, EquipmentTrainingSearchForm, TrainingCategory, TrainingResourceType } from '@/types/resource/training'
import type { MaterialCategory } from '@/types/resource/category'
import StatsCards from '@/components/StatsCards.vue'

const loading = ref(false)
const tableData = ref<EquipmentTraining[]>([...equipmentTrainingData])
const currentCategory = ref('all')
const currentStatus = ref<'all' | 'enabled' | 'disabled'>('all')

const searchForm = reactive<EquipmentTrainingSearchForm>({
  courseName: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// ── 顶部统计卡片（按物资分类） ──
const statsCards = computed(() => [
  { key: 'all', label: '全部', value: tableData.value.length, icon: Reading, color: '#409EFF', bgColor: '#ecf5ff' },
  { key: '基本生活保障物资', label: '基本生活保障物资', value: tableData.value.filter(d => d.category === '基本生活保障物资').length, icon: Box, color: '#67C23A', bgColor: '#f0f9eb' },
  { key: '应急装备及配套物资', label: '应急装备及配套物资', value: tableData.value.filter(d => d.category === '应急装备及配套物资').length, icon: Tools, color: '#E6A23C', bgColor: '#fdf6ec' },
  { key: '工程材料与机械加工', label: '工程材料与机械加工', value: tableData.value.filter(d => d.category === '工程材料与机械加工').length, icon: Operation, color: '#F56C6C', bgColor: '#fef0f0' },
  { key: '其他', label: '其他', value: tableData.value.filter(d => d.category === '其他').length, icon: More, color: '#909399', bgColor: '#f4f4f5' }
])

// ── 筛选后数据 ──
const filteredData = computed(() => {
  let data = tableData.value
  if (currentCategory.value !== 'all') {
    data = data.filter(item => item.category === currentCategory.value)
  }
  if (currentStatus.value === 'enabled') {
    data = data.filter(item => item.status === 1)
  } else if (currentStatus.value === 'disabled') {
    data = data.filter(item => item.status === 0)
  }
  if (searchForm.courseName) {
    data = data.filter(item => item.courseName.includes(searchForm.courseName))
  }
  return data
})

const pagedData = computed(() => {
  pagination.total = filteredData.value.length
  const start = (pagination.page - 1) * pagination.pageSize
  return filteredData.value.slice(start, start + pagination.pageSize)
})

function handleSearch() {
  pagination.page = 1
}

function handleCategoryChange(key: string) {
  currentCategory.value = key
  pagination.page = 1
}

const statusTabs = [
  { label: '全部', value: 'all' },
  { label: '已启用', value: 'enabled' },
  { label: '未启用', value: 'disabled' }
]

function handleStatusChange(value: string) {
  currentStatus.value = value as 'all' | 'enabled' | 'disabled'
  pagination.page = 1
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
}

function handlePageChange(page: number) {
  pagination.page = page
}

// ── 选项 ──
const resourceTypeOptions: TrainingResourceType[] = ['操作手册', '演示视频', '安全注意事项', '事故案例', '维保要点', '干扰处理案例', '维护视频', '故障排查指南']

// ── 适用类型选择 ──
const categoryTreeData = materialCategoryData

const equipmentOptions = computed(() => {
  const names = new Set<string>()
  equipmentSetData.forEach(set => set.equipmentItems.forEach(item => names.add(item.equipmentName)))
  return Array.from(names)
})

function findCategoryPath(nodes: MaterialCategory[], id: string, trail: string[] = []): string[] | null {
  for (const node of nodes) {
    const next = [...trail, node.categoryName]
    if (node.categoryId === id) return next
    if (node.children) {
      const found = findCategoryPath(node.children, id, next)
      if (found) return found
    }
  }
  return null
}

function categoryFullName(id: string): string {
  return findCategoryPath(categoryTreeData, id)?.join('/') ?? id
}

// ── 附件 ──
function getFileExt(name: string): string {
  const idx = name.lastIndexOf('.')
  return idx >= 0 ? name.slice(idx + 1).toUpperCase() : '文件'
}

function formatFileSize(size: number): string {
  if (!size) return '-'
  if (size < 1024) return `${size}B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)}MB`
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)}GB`
}

function removeAttachment(index: number) {
  formData.attachments.splice(index, 1)
}

// ── 新增/编辑抽屉 ──
const drawerVisible = ref(false)
const drawerTitle = ref('新建教程')
const formRef = ref<FormInstance>()
const editingId = ref('')

const createEmptyForm = (): EquipmentTrainingForm => ({
  courseName: '',
  courseCode: '',
  applyType: 1,
  equipmentCategory: '',
  resourceTypeList: [],
  attachments: [],
  attachmentCount: 0,
  status: 1,
  remark: '',
  selectedCategories: [],
  selectedEquipment: []
})

const formData = reactive<EquipmentTrainingForm>(createEmptyForm())

const formRules: FormRules = {
  courseName: [{ required: true, message: '请输入课程包名称', trigger: 'blur' }],
  selectedCategories: [
    {
      validator: (_rule, _value, callback) => {
        if (formData.applyType === 1 && !formData.selectedCategories?.length) {
          callback(new Error('请至少选择一种装备种类'))
          return
        }
        callback()
      },
      trigger: 'change'
    }
  ],
  selectedEquipment: [
    {
      validator: (_rule, _value, callback) => {
        if (formData.applyType === 2 && !formData.selectedEquipment?.length) {
          callback(new Error('请至少选择一件现有库存装备'))
          return
        }
        callback()
      },
      trigger: 'change'
    }
  ],
  resourceTypeList: [
    {
      validator: (_rule, value: TrainingResourceType[], callback) => {
        if (!value || value.length === 0) {
          callback(new Error('请至少选择一种资源类型'))
          return
        }
        callback()
      },
      trigger: 'change'
    }
  ],
  status: [{ required: true, message: '请选择启用状态', trigger: 'change' }]
}

function generateCourseCode(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `PEIX-${d.getFullYear()}${pad(d.getMonth() + 1)}-${String(tableData.value.length + 1).padStart(3, '0')}`
}

function resetForm() {
  Object.assign(formData, createEmptyForm())
}

function handleCreate() {
  editingId.value = ''
  drawerTitle.value = '新建教程'
  resetForm()
  formData.courseCode = generateCourseCode()
  drawerVisible.value = true
}

function handleEdit(row: EquipmentTraining) {
  editingId.value = row.courseId
  drawerTitle.value = '修改教程'
  formData.courseName = row.courseName
  formData.courseCode = row.courseCode
  formData.applyType = 1
  formData.equipmentCategory = row.equipmentCategory
  formData.resourceTypeList = [...row.resourceTypeList]
  formData.attachments = []
  formData.attachmentCount = row.attachmentCount
  formData.status = row.status
  formData.remark = row.remark
  formData.selectedCategories = []
  formData.selectedEquipment = []
  drawerVisible.value = true
}

function buildEquipmentCategory(): string {
  if (formData.applyType === 1) {
    return (formData.selectedCategories ?? []).map(categoryFullName).join('、')
  }
  return (formData.selectedEquipment ?? []).join('、')
}

function deriveCategory(equipmentCategory: string): TrainingCategory {
  const first = equipmentCategory.split('/')[0].trim()
  if (first === '基本生活保障物资') return '基本生活保障物资'
  if (first === '工程材料与机械加工') return '工程材料与机械加工'
  if (first === '其他') return '其他'
  return '应急装备及配套物资'
}

function deriveEquipmentModel(equipmentCategory: string): string {
  const parts = equipmentCategory.split('、')[0].split('/')
  return parts[parts.length - 1].trim()
}

function handleSubmit() {
  formRef.value?.validate(valid => {
    if (!valid) return
    const equipmentCategory = buildEquipmentCategory()
    const attachmentCount = formData.attachments.length
    if (editingId.value) {
      const target = tableData.value.find(item => item.courseId === editingId.value)
      if (target) {
        target.courseName = formData.courseName
        target.courseCode = formData.courseCode
        target.category = deriveCategory(equipmentCategory)
        target.equipmentCategory = equipmentCategory
        target.equipmentModel = deriveEquipmentModel(equipmentCategory)
        target.resourceTypeList = [...formData.resourceTypeList]
        target.resourceTypes = formData.resourceTypeList.join('、')
        target.attachmentCount = attachmentCount
        target.status = formData.status
        target.remark = formData.remark
        target.updateTime = formatNow()
      }
      ElMessage.success('修改成功')
    } else {
      const id = `TRN${String(tableData.value.length + 1).padStart(4, '0')}`
      tableData.value.unshift({
        courseId: id,
        courseName: formData.courseName,
        courseCode: formData.courseCode,
        category: deriveCategory(equipmentCategory),
        equipmentCategory,
        equipmentModel: deriveEquipmentModel(equipmentCategory),
        resourceTypeList: [...formData.resourceTypeList],
        resourceTypes: formData.resourceTypeList.join('、'),
        attachmentCount,
        status: formData.status,
        createBy: '当前用户',
        createTime: new Date().toISOString().slice(0, 10),
        updateTime: formatNow(),
        remark: formData.remark
      })
      ElMessage.success('新建成功')
    }
    drawerVisible.value = false
  })
}

function formatNow(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// ── 删除 ──
function handleDelete(row: EquipmentTraining) {
  ElMessageBox.confirm(
    `是否确认删除教程 "${row.courseName}"？`,
    '删除确认',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    tableData.value = tableData.value.filter(item => item.courseId !== row.courseId)
    ElMessage.success(`已删除教程 ${row.courseName}`)
  }).catch(() => {})
}

// ── 导出 ──
function csvCell(value: unknown): string {
  const str = value == null ? '' : String(value)
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

function handleExport() {
  if (!filteredData.value.length) {
    ElMessage.warning('暂无数据可导出')
    return
  }
  const header = '课程包/培训名称,课程包编号,物资分类,适用装备分类,适用装备型号,包含资源类型,配套资源附件数,启用状态,创建人,创建时间,资源更新时间,备注'
  const body = filteredData.value.map(row =>
    [row.courseName, row.courseCode, row.category, row.equipmentCategory, row.equipmentModel, row.resourceTypes, row.attachmentCount, row.status === 1 ? '已启用' : '未启用', row.createBy, row.createTime, row.updateTime, row.remark]
      .map(csvCell).join(',')
  ).join('\n')
  const blob = new Blob(['\ufeff' + `${header}\n${body}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `装备使用教程_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('导出成功')
}
</script>

<style lang="scss" scoped>
.equipment-training-use {
  padding: 16px;
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

    // ── 搜索栏 ──
    .search-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #ebeef5;
    }

    .search-bar-filter {
      display: flex;
      align-items: center;
      gap: 12px;

      .filter-label {
        font-size: 14px;
        color: #606266;
        font-weight: 600;
      }

      .filter-link {
        font-size: 14px;

        &.el-link--primary {
          font-weight: 600;
        }
      }
    }

    .search-bar-actions {
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .course-name-text {
      font-weight: 500;
      color: #303133;
    }

    .code-text {
      font-family: Consolas, Monaco, monospace;
      font-size: 13px;
      color: #606266;
    }

    .equipment-info-text {
      font-size: 13px;
      color: #606266;
      line-height: 1.5;
    }

    .resource-types-text {
      font-size: 13px;
      color: #606266;
      line-height: 1.5;
    }

    .attachment-count {
      font-weight: 600;
      color: #409eff;
    }

    .creator-name {
      font-size: 13px;
      color: #303133;
      font-weight: 500;
    }

    .creator-time {
      font-size: 13px;
      color: #909399;
    }

    .time-text {
      font-size: 13px;
      color: #909399;
    }

    .data-table {
      flex: 1;
    }
  }

  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    flex-shrink: 0;
  }
}

:deep(.el-checkbox) {
  margin-right: 16px;
}

// 附件上传
.attachment-upload {
  width: 100%;

  .upload-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 8px;
  }

  .attachment-table {
    margin-top: 12px;
    border-radius: 6px;
  }

  .attachment-empty {
    font-size: 13px;
    color: #909399;
    border: 1px dashed #dcdfe6;
    border-radius: 6px;
    padding: 16px;
    text-align: center;
    margin-top: 12px;
  }

  .attachment-size {
    font-size: 13px;
    color: #606266;
  }

  .attachment-name {
    display: block;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .attachment-count-text {
    font-size: 13px;
    color: #606266;
    margin-top: 12px;

    .attachment-count-num {
      color: #409eff;
      font-size: 15px;
    }
  }
}

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
