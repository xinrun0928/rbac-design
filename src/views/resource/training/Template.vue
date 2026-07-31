<template>
  <div class="exam-template-management">
    <!-- 列表视图 -->
    <el-card v-if="!drawerVisible" class="table-card animate-item" shadow="never">
      <!-- 顶部筛选卡片 -->
      <div class="stats-row">
        <div
          v-for="item in statsCards"
          :key="item.key"
          class="stats-card"
          :class="{ active: currentCategory === item.key }"
          @click="handleCategoryChange(item.key)"
        >
          <div class="stats-icon" :style="{ background: item.bgColor, color: item.color }">
            <el-icon :size="26"><component :is="item.icon" /></el-icon>
          </div>
          <div class="stats-info">
            <div class="stats-value" :style="{ color: item.color }">{{ item.value }}</div>
            <div class="stats-label">{{ item.label }}</div>
          </div>
        </div>
      </div>

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
            v-model="searchForm.templateName"
            placeholder="搜索考核模板名称"
            clearable
            :prefix-icon="Search"
            style="width: 180px; margin-right: 12px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
          <el-button type="primary" :icon="Plus" @click="handleCreate">新建模板</el-button>
          <el-button type="success" :icon="Download" @click="handleExport">导出</el-button>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="filteredData"
        border
        stripe
        highlight-current-row
        row-key="templateId"
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="templateName" label="考核模板名称" min-width="180" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="template-name-text">{{ row.templateName }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="templateCode" label="考核模板编号" width="170" align="center">
          <template #default="{ row }">
            <span class="code-text">{{ row.templateCode }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="equipmentType" label="关联装备类型" min-width="180" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="equipment-type-text">{{ row.equipmentType }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="duration" label="考核时长（分钟）" width="130" align="center">
          <template #default="{ row }">
            <span class="duration-text">{{ row.duration }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="passScore" label="及格分数" width="90" align="center">
          <template #default="{ row }">
            <span class="score-text">{{ row.passScore }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="totalScore" label="总分" width="80" align="center">
          <template #default="{ row }">
            <span class="score-text">{{ row.totalScore }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="questionTypes" label="题型分布" min-width="260" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="question-types-text">{{ buildQuestionTypesDesc(row.questionTypes) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="questionCount" label="题目总数" width="90" align="center">
          <template #default="{ row }">
            <el-tag type="primary" effect="plain" round size="small">{{ row.questionCount }} 道</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="启用状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'" effect="light" round>
              {{ row.status === 1 ? '已启用' : '未启用' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="remark" label="备注" min-width="220" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="remark-text">{{ row.remark || '-' }}</span>
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
      :title="formTitle"
      size="60%"
      direction="rtl"
      class="template-drawer"
      destroy-on-close
      @close="handleClose"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" @submit.prevent>
          <!-- 基础信息卡片 -->
          <el-card class="form-card" shadow="never">
            <template #header>
              <div class="card-header">
                <el-icon class="card-header-icon"><InfoFilled /></el-icon>
                <span>基础信息</span>
              </div>
            </template>

            <el-form-item label="模板标题" prop="templateName">
              <el-input
                v-model="formData.templateName"
                placeholder="请输入模板标题"
                maxlength="50"
                show-word-limit
                class="form-input"
              />
            </el-form-item>

            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="formData.remark"
                type="textarea"
                :rows="3"
                placeholder="请输入备注"
                maxlength="200"
                show-word-limit
                class="form-input"
              />
            </el-form-item>

            <el-form-item label="适用类型" prop="applyType">
              <el-radio-group v-model="formData.applyType">
                <el-radio :value="1">按种类选择</el-radio>
                <el-radio :value="2">按现有库存装备</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item v-if="formData.applyType === 1" label="选择装备种类" prop="selectedCategories">
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

            <el-form-item v-else label="现有库存装备" prop="selectedEquipment">
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

            <el-form-item label="考核时长" prop="duration">
              <div class="duration-row">
                <el-input-number v-model="formData.duration" :min="1" :max="600" class="duration-input" />
                <span class="form-tip-inline">分钟</span>
              </div>
            </el-form-item>

            <el-form-item label="启用状态" prop="status">
              <el-radio-group v-model="formData.status">
                <el-radio :value="1">启用</el-radio>
                <el-radio :value="0">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-card>

          <!-- 考核题目卡片 -->
          <el-card class="form-card questions-card" shadow="never">
            <template #header>
              <div class="card-header card-header-between">
                <div class="card-header">
                  <el-icon class="card-header-icon"><Collection /></el-icon>
                  <span>考核题目</span>
                </div>
                <el-button type="primary" plain :icon="Plus" size="small" @click="addQuestion">添加题目</el-button>
              </div>
            </template>

            <div v-for="(question, qIndex) in formData.questions" :key="qIndex" class="question-block">
              <div class="question-title">
                <span class="question-label">题目{{ qIndex + 1 }}</span>
                <el-button
                  type="danger"
                  link
                  :icon="Delete"
                  :disabled="formData.questions.length <= 1"
                  @click="removeQuestion(qIndex)"
                >
                  删除题目
                </el-button>
              </div>

              <el-input
                v-model="question.content"
                type="textarea"
                :rows="2"
                placeholder="请输入题目内容"
                maxlength="200"
                show-word-limit
                class="question-content"
              />

              <div class="options-list">
                <div v-for="(option, oIndex) in question.options" :key="oIndex" class="option-row">
                  <span class="option-letter">{{ getOptionLetter(oIndex) }}</span>
                  <el-input v-model="option.content" placeholder="请输入选项内容" class="option-input" />
                  <el-select
                    v-model="option.bankValue"
                    class="option-from-bank"
                    placeholder="从题库"
                    clearable
                    @change="onBankChange(option, $event)"
                  >
                    <el-option v-for="bank in questionBankOptions" :key="bank" :label="bank" :value="bank" />
                  </el-select>
                  <el-button
                    :type="option.isCorrect ? 'success' : 'default'"
                    :plain="!option.isCorrect"
                    class="correct-btn"
                    @click="toggleCorrect(option)"
                  >
                    <el-icon v-if="option.isCorrect" style="margin-right: 2px"><Check /></el-icon>
                    正确
                  </el-button>
                  <el-button
                    link
                    :icon="ArrowUp"
                    :disabled="oIndex === 0"
                    class="icon-btn"
                    @click="moveOption(question, oIndex, -1)"
                  />
                  <el-button
                    link
                    :icon="ArrowDown"
                    :disabled="oIndex === question.options.length - 1"
                    class="icon-btn"
                    @click="moveOption(question, oIndex, 1)"
                  />
                  <el-button
                    link
                    type="danger"
                    :icon="Delete"
                    :disabled="question.options.length <= 2"
                    class="icon-btn"
                    @click="removeOption(question, oIndex)"
                  />
                </div>
              </div>

              <div class="option-actions">
                <el-button type="primary" plain :icon="Plus" size="small" @click="addOption(question)">添加选项</el-button>
              </div>
            </div>

            <el-button type="primary" plain :icon="Plus" class="add-question-btn" @click="addQuestion">添加题目</el-button>
          </el-card>
      </el-form>

      <template #footer>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存模板</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Search, Plus, Download, Edit, Delete, Reading, Box, Tools, Operation, More,
  ArrowUp, ArrowDown, InfoFilled, Collection, Check
} from '@element-plus/icons-vue'
import { examTemplateData } from '@/mock/resource/templateData'
import { materialCategoryData } from '@/mock/resource/categoryData'
import { equipmentSetData } from '@/mock/resource/setData'
import type { MaterialCategory } from '@/types/resource/category'
import type {
  ExamTemplate, ExamTemplateForm, ExamTemplateSearchForm, QuestionTypeItem,
  ExamQuestionItem, QuestionOptionItem
} from '@/types/resource/template'

const loading = ref(false)
const tableData = ref<ExamTemplate[]>(examTemplateData)
const currentCategory = ref('all')
const currentStatus = ref<'all' | 'enabled' | 'disabled'>('all')

const searchForm = reactive<ExamTemplateSearchForm>({
  templateName: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// ── 装备类型 → 物资分类 ──
function getTemplateCategory(equipmentType: string): string {
  const first = equipmentType.split(' / ')[0]
  if (first.includes('基本生活')) return '基本生活保障物资'
  if (first.includes('应急装备')) return '应急装备及配套物资'
  if (first.includes('工程')) return '工程材料与机械加工'
  return '其他'
}

// ── 顶部筛选统计卡片（按物资分类） ──
const statsCards = computed(() => [
  { key: 'all', label: '全部', value: tableData.value.length, icon: Reading, color: '#409EFF', bgColor: '#ecf5ff' },
  { key: '基本生活保障物资', label: '基本生活保障物资', value: tableData.value.filter(d => getTemplateCategory(d.equipmentType) === '基本生活保障物资').length, icon: Box, color: '#67C23A', bgColor: '#f0f9eb' },
  { key: '应急装备及配套物资', label: '应急装备及配套物资', value: tableData.value.filter(d => getTemplateCategory(d.equipmentType) === '应急装备及配套物资').length, icon: Tools, color: '#E6A23C', bgColor: '#fdf6ec' },
  { key: '工程材料与机械加工', label: '工程材料与机械加工', value: tableData.value.filter(d => getTemplateCategory(d.equipmentType) === '工程材料与机械加工').length, icon: Operation, color: '#F56C6C', bgColor: '#fef0f0' },
  { key: '其他', label: '其他', value: tableData.value.filter(d => getTemplateCategory(d.equipmentType) === '其他').length, icon: More, color: '#909399', bgColor: '#f4f4f5' }
])

const statusTabs = [
  { label: '全部', value: 'all' },
  { label: '已启用', value: 'enabled' },
  { label: '未启用', value: 'disabled' }
]

const filteredData = computed(() => {
  let data = tableData.value
  if (currentCategory.value !== 'all') {
    data = data.filter(item => getTemplateCategory(item.equipmentType) === currentCategory.value)
  }
  if (currentStatus.value === 'enabled') {
    data = data.filter(item => item.status === 1)
  } else if (currentStatus.value === 'disabled') {
    data = data.filter(item => item.status === 0)
  }
  if (searchForm.templateName) {
    data = data.filter(item => item.templateName.includes(searchForm.templateName))
  }
  pagination.total = data.length
  const start = (pagination.page - 1) * pagination.pageSize
  return data.slice(start, start + pagination.pageSize)
})

function handleSearch() {
  pagination.page = 1
}

function handleCategoryChange(key: string) {
  currentCategory.value = key
  pagination.page = 1
}

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

// ── 题型分布文案 ──
function buildQuestionTypesDesc(items: QuestionTypeItem[]): string {
  return items.map(item => `${item.type} ${item.count} 道（每题 ${item.score} 分）`).join(' + ')
}

// ── 新增/编辑抽屉 ──
const drawerVisible = ref(false)
const formTitle = ref('新建考核模板')
const formRef = ref<FormInstance>()
const editingId = ref('')

const questionBankOptions = [
  '无人机起飞前应检查螺旋桨是否安装牢固',
  '除颤仪使用时应保持电极片紧贴患者皮肤',
  '对讲机在应急场景下应优先使用加密信道',
  '灭火器使用前需检查压力表指针是否处于绿区',
  '发电机启动前应确认燃油箱液位是否充足',
  '救生衣穿着后应检查裆带是否系牢'
]

const createEmptyOption = (): QuestionOptionItem => ({
  content: '',
  isCorrect: false,
  bankValue: ''
})

const createEmptyQuestion = (): ExamQuestionItem => ({
  content: '',
  options: [createEmptyOption(), createEmptyOption(), createEmptyOption(), createEmptyOption()]
})

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

const formData = reactive<ExamTemplateForm>({
  templateName: '',
  applyType: 1,
  duration: 30,
  status: 1,
  remark: '',
  questions: [createEmptyQuestion()],
  selectedCategories: [],
  selectedEquipment: []
})

const formRules: FormRules = {
  templateName: [{ required: true, message: '请输入模板标题', trigger: 'blur' }],
  duration: [{ required: true, message: '请输入考核时长', trigger: 'blur' }],
  status: [{ required: true, message: '请选择启用状态', trigger: 'change' }],
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
  questions: [
    {
      validator: (_rule, value: ExamQuestionItem[], callback) => {
        if (!value.length) {
          callback(new Error('请至少添加一道考核题目'))
          return
        }
        if (value.some(q => !q.content.trim() || q.options.length < 2 || q.options.some(o => !o.content.trim()))) {
          callback(new Error('请完整填写题目内容与选项'))
          return
        }
        if (value.some(q => !q.options.some(o => o.isCorrect))) {
          callback(new Error('每道题目至少需要标记一个正确答案'))
          return
        }
        callback()
      },
      trigger: 'change'
    }
  ]
}

function resetForm() {
  formData.templateName = ''
  formData.applyType = 1
  formData.duration = 30
  formData.status = 1
  formData.remark = ''
  formData.questions = [createEmptyQuestion()]
  formData.selectedCategories = []
  formData.selectedEquipment = []
}

function handleCreate() {
  editingId.value = ''
  formTitle.value = '新建考核模板'
  resetForm()
  drawerVisible.value = true
}

function handleEdit(row: ExamTemplate) {
  editingId.value = row.templateId
  formTitle.value = '修改考核模板'
  formData.templateName = row.templateName
  formData.applyType = row.equipmentType === '按现有库存装备' ? 2 : 1
  formData.duration = row.duration
  formData.status = row.status
  formData.remark = row.remark
  formData.questions = [createEmptyQuestion()]
  formData.selectedCategories = []
  formData.selectedEquipment = []
  drawerVisible.value = true
}

function handleClose() {
  drawerVisible.value = false
  nextTick(() => formRef.value?.clearValidate())
}

// ── 题目 / 选项操作 ──
function addQuestion() {
  formData.questions.push(createEmptyQuestion())
}

function removeQuestion(index: number) {
  formData.questions.splice(index, 1)
}

function addOption(question: ExamQuestionItem) {
  question.options.push(createEmptyOption())
}

function removeOption(question: ExamQuestionItem, index: number) {
  question.options.splice(index, 1)
}

function moveOption(question: ExamQuestionItem, index: number, dir: -1 | 1) {
  const target = index + dir
  if (target < 0 || target >= question.options.length) return
  const arr = question.options
  ;[arr[index], arr[target]] = [arr[target], arr[index]]
}

function toggleCorrect(option: QuestionOptionItem) {
  option.isCorrect = !option.isCorrect
}

function getOptionLetter(index: number): string {
  return String.fromCharCode(65 + index)
}

function onBankChange(option: QuestionOptionItem, val: unknown) {
  if (typeof val === 'string' && val) {
    option.content = val
  }
}

// ── 提交 ──
function formatNow(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function buildEquipmentType(): string {
  if (formData.applyType === 1) {
    return (formData.selectedCategories ?? []).map(categoryFullName).join('、')
  }
  return (formData.selectedEquipment ?? []).join('、')
}

function buildListQuestionTypes(count: number): QuestionTypeItem[] {
  if (count <= 0) return []
  return [{ type: '选择题', count, score: Number((100 / count).toFixed(1)) }]
}

function handleSubmit() {
  formRef.value?.validate(valid => {
    if (!valid) {
      ElMessage.warning('请完善表单必填项')
      return
    }
    const questions = formData.questions.map(q => ({
      content: q.content,
      options: q.options.map(o => ({ content: o.content, isCorrect: o.isCorrect }))
    }))
    const questionCount = questions.length
    const questionTypes = buildListQuestionTypes(questionCount)
    const equipmentType = buildEquipmentType()

    if (editingId.value) {
      const target = tableData.value.find(item => item.templateId === editingId.value)
      if (target) {
        target.templateName = formData.templateName
        target.equipmentType = equipmentType
        target.duration = formData.duration
        target.passScore = 80
        target.totalScore = 100
        target.questionTypes = questionTypes
        target.questionCount = questionCount
        target.status = formData.status
        target.remark = formData.remark
        target.updateTime = formatNow()
      }
      ElMessage.success('修改成功')
    } else {
      const id = `TPL${String(tableData.value.length + 1).padStart(3, '0')}`
      tableData.value.unshift({
        templateId: id,
        templateName: formData.templateName,
        templateCode: `KAOHE-202510-${String(tableData.value.length + 1).padStart(3, '0')}`,
        equipmentType,
        duration: formData.duration,
        passScore: 80,
        totalScore: 100,
        questionTypes,
        questionCount,
        status: formData.status,
        remark: formData.remark,
        createBy: '当前用户',
        createTime: new Date().toISOString().slice(0, 10),
        updateTime: formatNow()
      })
      ElMessage.success('新建成功')
    }
    drawerVisible.value = false
  })
}

// ── 删除 ──
function handleDelete(row: ExamTemplate) {
  ElMessageBox.confirm(
    `是否确认删除考核模板 "${row.templateName}"？`,
    '删除确认',
    { confirmButtonText: '确认', cancelButtonText: '取消', type: 'warning' }
  ).then(() => {
    tableData.value = tableData.value.filter(item => item.templateId !== row.templateId)
    ElMessage.success(`已删除考核模板 ${row.templateName}`)
  }).catch(() => {})
}

// ── 导出 ──
function csvCell(value: unknown): string {
  const str = value == null ? '' : String(value)
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

function handleExport() {
  if (!tableData.value.length) {
    ElMessage.warning('暂无数据可导出')
    return
  }
  const header = '考核模板名称,考核模板编号,关联装备类型,考核时长,及格分数,总分,题型分布,题目总数,启用状态,备注'
  const body = tableData.value.map(row =>
    [row.templateName, row.templateCode, row.equipmentType, `${row.duration}分钟`, row.passScore, row.totalScore, buildQuestionTypesDesc(row.questionTypes), row.questionCount, row.status === 1 ? '已启用' : '未启用', row.remark]
      .map(csvCell).join(',')
  ).join('\n')
  const blob = new Blob(['\ufeff' + `${header}\n${body}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `装备操作考核模板_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('导出成功')
}
</script>

<style lang="scss" scoped>
.exam-template-management {
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

    // ── 顶部筛选卡片 ──
    .stats-row {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-bottom: 16px;
      padding: 16px 0;
      background: #f8f9fb;
      border-radius: 10px;
      flex-shrink: 0;
    }

    .stats-card {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 220px;
      padding: 14px 18px;
      background: #fff;
      border: 2px solid transparent;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      &.active {
        border-color: #409eff;
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
      }

      .stats-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .stats-info {
        .stats-value {
          font-size: 26px;
          font-weight: 700;
          line-height: 1.2;
        }

        .stats-label {
          font-size: 13px;
          color: #909399;
          margin-top: 4px;
        }
      }
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

    .template-name-text {
      font-weight: 500;
      color: #303133;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .code-text {
      font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
      font-size: 12px;
      color: #409EFF;
      background: #ecf5ff;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .equipment-type-text {
      font-size: 13px;
      color: #606266;
    }

    .duration-text,
    .score-text {
      font-size: 13px;
      color: #606266;
      font-weight: 500;
    }

    .question-types-text {
      font-size: 13px;
      color: #606266;
      line-height: 1.5;
    }

    .remark-text {
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

  // ── 新增/编辑抽屉 ──
  .template-drawer {
    :deep(.el-drawer__body) {
      background: #f5f7fa;
      padding: 16px 20px;
    }

    .form-card {
      border-radius: 12px;
      border: 1px solid #ebeef5;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      margin-bottom: 16px;

        :deep(.el-card__body) {
          padding: 20px 24px;
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 8px;

          .card-header-icon {
            color: #409eff;
            font-size: 18px;
          }

          span {
            font-size: 15px;
            font-weight: 600;
            color: #303133;
          }
        }

        .card-header-between {
          justify-content: space-between;
        }
      }

      .form-input {
        width: 100%;
      }

      .duration-row {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;

        .duration-input {
          width: 200px;
        }

        .form-tip-inline {
          font-size: 13px;
          color: #909399;
          flex-shrink: 0;
        }
      }

      // ── 考核题目 ──
      .question-block {
        background: #f8f9fb;
        border: 1px solid #ebeef5;
        border-radius: 10px;
        padding: 16px;
        margin-bottom: 16px;

        .question-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;

          .question-label {
            font-size: 13px;
            font-weight: 600;
            color: #409eff;
            background: #ecf5ff;
            padding: 3px 10px;
            border-radius: 6px;
          }
        }

        .question-content {
          margin-bottom: 14px;
        }

        .option-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 10px;

          .option-letter {
            width: 28px;
            height: 28px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #ecf5ff;
            color: #409eff;
            font-weight: 600;
            border-radius: 6px;
            font-size: 13px;
          }

          .option-input {
            flex: 1;
          }

          .option-from-bank {
            width: 150px;
            flex-shrink: 0;
          }

          .correct-btn {
            flex-shrink: 0;
          }

          .icon-btn {
            flex-shrink: 0;
            padding: 8px 6px;
          }
        }

        .option-actions {
          display: flex;
          justify-content: center;
        }
      }

      .add-question-btn {
        width: 100%;
        border-style: dashed;
        height: 44px;
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
