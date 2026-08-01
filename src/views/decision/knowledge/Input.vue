<template>
  <div class="knowledge-input-page">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 顶部分类统计卡片 -->
      <StatsCards v-model="activeCategory" :items="statsCards" />

      <!-- 搜索栏 -->
      <div class="search-bar">
        <div class="search-bar-filter">
          <span class="filter-label">审核状态：</span>
          <el-link
            v-for="status in auditStatuses"
            :key="status"
            class="filter-link"
            :underline="false"
            :type="activeAuditStatus === status ? 'primary' : 'info'"
            @click="activeAuditStatus = status"
          >{{ status }}</el-link>
        </div>
        <div class="search-bar-actions">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索知识标题"
            clearable
            :prefix-icon="Search"
            style="width: 180px; margin-right: 12px"
            @keyup.enter="handleSearch"
            @clear="handleSearch"
          />
          <el-button type="primary" :icon="Plus" @click="handleCreate">新建知识内容</el-button>
          <el-button type="success" :icon="Download" @click="handleExport">导出</el-button>
        </div>
      </div>

      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        highlight-current-row
        :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
        class="data-table"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />

        <el-table-column prop="title" label="知识标题" min-width="280" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="course-name-text" @click="handleViewDetail(row)">{{ row.title }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="code" label="知识编号（法规标准编号）" min-width="200" align="center" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="code-text">{{ row.code }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="type" label="知识类型" width="120" align="center" show-overflow-tooltip />

        <el-table-column prop="attachmentCount" label="配套资源附件数" width="130" align="center" />

        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <span :class="['status-tag', `status-${row.status}`]">{{ row.status }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="auditResult" label="审核结果" width="100" align="center">
          <template #default="{ row }">
            <span :class="['audit-tag', `audit-${row.auditResult}`]">{{ row.auditResult }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" width="160" align="center">
          <template #default="{ row }">
            <span class="creator-time">{{ row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="最近修改人/修改时间" width="200" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ row.lastModifier }} / {{ row.lastModifyTime }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="version" label="当前版本号" width="100" align="center" />

        <el-table-column prop="versionReason" label="版本迭代原因" min-width="250" show-overflow-tooltip />

        <el-table-column label="操作" width="80" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleViewDetail(row)">详情</el-button>
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

    <!-- 知识详情抽屉 -->
    <el-drawer
      v-model="detailDrawerVisible"
      direction="rtl"
      size="70%"
      :show-close="true"
      :with-header="false"
      class="knowledge-detail-drawer"
    >
      <div class="detail-container" v-if="currentDetail">
        <!-- 抽屉头部 -->
        <div class="detail-header">
          <div class="header-title">
            <h2 class="detail-title">{{ currentDetail.title }}【{{ currentDetail.code }}】</h2>
            <el-dropdown @command="handleVersionChange" trigger="click" popper-class="version-popper">
              <span class="version-dropdown">
                <el-icon><Check /></el-icon> 当前版本：{{ currentVersion }}
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="v in versionList"
                    :key="v"
                    :command="v"
                    :class="{ 'is-active': currentVersion === v }"
                  >{{ v }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>

        <!-- 基本信息 -->
        <div class="detail-info">
          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">编　　号：</span>
              <span class="info-value">{{ currentDetail.code }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">类　　型：</span>
              <span class="info-value">{{ currentDetail.type }}（适用于广州）</span>
            </div>
            <div class="info-row">
              <span class="info-label">发布状态：</span>
              <span class="info-value">
                <el-tag :type="currentDetail.status === '已发布' ? 'success' : 'warning'" size="small">{{ currentDetail.status }}</el-tag>
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">审核结果：</span>
              <span class="info-value">
                <span :class="['audit-tag', `audit-${currentDetail.auditResult}`]">{{ currentDetail.auditResult }}</span>
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">关联预案：</span>
              <span class="info-value">-</span>
            </div>
            <div class="info-row">
              <span class="info-label">发布日期：</span>
              <span class="info-value">2026-04-20</span>
            </div>
            <div class="info-row">
              <span class="info-label">施行日期：</span>
              <span class="info-value">2026-04-20</span>
            </div>
            <div class="info-row">
              <span class="info-label">失效日期：</span>
              <span class="info-value">2026-04-20</span>
            </div>
          </div>

          <div class="info-row info-row-full">
            <span class="info-label">相关附件：</span>
            <span class="info-value">
              <el-link type="primary" :underline="false">广州市...通知.pdf</el-link>
            </span>
          </div>
          <div class="info-row info-row-full">
            <span class="info-label">备　　注：</span>
            <span class="info-value">-</span>
          </div>
        </div>

        <!-- 知识内容标签 -->
        <div class="detail-tabs">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="知识内容" name="content">
              <div class="knowledge-content">
                <!-- 版本说明 -->
                <div v-if="currentVersionContent" class="version-info">
                  <span class="version-info-item">
                    <el-icon><Clock /></el-icon> 版本 {{ currentVersionContent.version }}
                  </span>
                  <span class="version-info-item">
                    <el-icon><Calendar /></el-icon> {{ currentVersionContent.updateTime }} 发布
                  </span>
                  <span class="version-info-item version-info-reason">
                    <el-icon><EditPen /></el-icon> {{ currentVersionContent.reason }}
                  </span>
                </div>

                <div v-if="currentVersionContent" class="content-header">
                  <p v-for="(p, i) in currentVersionContent.header" :key="'h' + i">{{ p }}</p>
                  <p class="content-sign">{{ currentVersionContent.sign }}</p>
                  <p class="content-date">{{ currentVersionContent.date }}</p>
                </div>

                <div v-if="currentVersionContent" class="content-body">
                  <template v-for="(section, si) in currentVersionContent.body" :key="'s' + si">
                    <h3>{{ section.title }}</h3>
                    <p v-for="(para, pi) in section.paragraphs" :key="'p' + si + '-' + pi">{{ para }}</p>
                  </template>
                </div>

                <el-empty v-else description="暂无版本内容，仅展示当前版本" />
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <!-- 底部操作 -->
        <div class="detail-footer">
          <el-button type="warning" size="large" @click="handleWithdraw">撤回</el-button>
        </div>
      </div>
    </el-drawer>

    <!-- 新建知识抽屉 -->
    <el-drawer
      v-model="createDrawerVisible"
      direction="rtl"
      size="80%"
      :show-close="true"
      :with-header="false"
      class="create-knowledge-drawer"
    >
      <div class="create-container">
        <!-- 抽屉头部 -->
        <div class="create-header">
          <div class="header-left">
            <el-button @click="createDrawerVisible = false">返回</el-button>
            <h2 class="create-title">新建知识</h2>
          </div>
          <el-dropdown @command="handleCreateAction" trigger="click">
            <el-button type="primary">
              操作 <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="draft">保存草稿</el-dropdown-item>
                <el-dropdown-item command="submit">保存并提交审核</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <!-- 标签页 -->
        <div class="create-tabs">
          <el-tabs v-model="createActiveTab">
            <el-tab-pane label="知识内容编辑" name="contentEdit" />
          </el-tabs>
        </div>

        <!-- 表单内容 -->
        <div class="create-form-wrapper">
          <el-form
            ref="createFormRef"
            :model="createFormData"
            :rules="createFormRules"
            label-width="100px"
            class="create-form"
          >
            <!-- 基本信息 -->
            <div class="form-section">
              <div class="section-title">
                <span class="title-bar"></span>
                基本信息
              </div>

              <div class="form-grid">
                <el-form-item label="知识名称" prop="title" class="form-item-span-2">
                  <el-input v-model="createFormData.title" placeholder="请输入内容" />
                </el-form-item>

                <el-form-item label="编号" prop="code">
                  <el-input v-model="createFormData.code" placeholder="请输入内容" />
                </el-form-item>

                <el-form-item label="类型" prop="type">
                  <el-select v-model="createFormData.type" placeholder="请选择" style="width: 100%">
                    <el-option
                      v-for="item in knowledgeTypeOptions"
                      :key="item"
                      :label="item"
                      :value="item"
                    />
                  </el-select>
                </el-form-item>
              </div>

              <div class="form-grid">
                <el-form-item label="发布日期" prop="publishDate">
                  <el-date-picker
                    v-model="createFormData.publishDate"
                    type="date"
                    placeholder="请选择"
                    value-format="YYYY-MM-DD"
                    style="width: 100%"
                  />
                </el-form-item>

                <el-form-item label="实施日期">
                  <el-date-picker
                    v-model="createFormData.implementDate"
                    type="date"
                    placeholder="请选择"
                    value-format="YYYY-MM-DD"
                    style="width: 100%"
                  />
                </el-form-item>

                <el-form-item label="失效日期">
                  <el-date-picker
                    v-model="createFormData.expireDate"
                    type="date"
                    placeholder="请选择"
                    value-format="YYYY-MM-DD"
                    style="width: 100%"
                  />
                </el-form-item>

                <el-form-item label="关联设备物资">
                  <el-select v-model="createFormData.relatedEquipment" placeholder="请选择" style="width: 100%" clearable>
                    <el-option label="设备A" value="设备A" />
                    <el-option label="设备B" value="设备B" />
                  </el-select>
                </el-form-item>
              </div>

              <el-form-item label="相关附件">
                <el-button type="primary" link :icon="Paperclip">添加附件</el-button>
              </el-form-item>

              <el-form-item label="备注">
                <el-input v-model="createFormData.remark" type="textarea" :rows="2" placeholder="请输入内容" />
              </el-form-item>
            </div>

            <!-- 知识内容编辑 -->
            <div class="form-section">
              <div class="section-title">
                <span class="title-bar"></span>
                知识内容编辑
              </div>
              <RichTextEditor v-model="createFormData.content" :height="400" placeholder="请输入知识内容..." />
            </div>
          </el-form>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Plus, Document, Notebook, User, Collection, Box, Check, ArrowDown, Paperclip, Download, Clock, Calendar, EditPen } from '@element-plus/icons-vue'
import { mockKnowledgeList } from '@/mock/dss/knowledgeData'
import { mockKnowledgeVersions } from '@/mock/dss/knowledgeVersionData'
import StatsCards from '@/components/StatsCards.vue'
import RichTextEditor from '@/components/RichTextEditor.vue'
import type { KnowledgeItem, KnowledgeVersion } from '@/types/dss'

const loading = ref(false)
const allData = ref<KnowledgeItem[]>(mockKnowledgeList)
const activeCategory = ref('全部')
const activeAuditStatus = ref('全部')
const searchKeyword = ref('')

// 详情抽屉相关
const detailDrawerVisible = ref(false)
const currentDetail = ref<KnowledgeItem | null>(null)
const currentVersion = ref('')
const activeTab = ref('content')

/** 当前知识条目可用的历史版本 */
const versionList = computed(() => {
  if (!currentDetail.value) return []
  const versions = mockKnowledgeVersions[currentDetail.value.code]
  return versions ? versions.map(v => v.version) : [currentDetail.value.version]
})

/** 当前选中版本的正文内容 */
const currentVersionContent = computed<KnowledgeVersion | null>(() => {
  if (!currentDetail.value) return null
  const versions = mockKnowledgeVersions[currentDetail.value.code]
  if (!versions || !versions.length) return null
  return versions.find(v => v.version === currentVersion.value) ?? versions[0]
})

// 新建知识抽屉相关
const createDrawerVisible = ref(false)
const createFormRef = ref()
const createActiveTab = ref('contentEdit')
const createFormData = reactive({
  title: '',
  code: '',
  type: '地方性法规',
  publishDate: null as Date | null,
  implementDate: null as Date | null,
  expireDate: null as Date | null,
  relatedEquipment: '',
  attachments: [] as any[],
  remark: '',
  content: ''
})

const createFormRules = {
  title: [{ required: true, message: '请输入知识名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入编号', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  publishDate: [{ required: true, message: '请选择发布日期', trigger: 'change' }]
}

const knowledgeTypeOptions = ['法律', '行政法规', '国务院部门规章', '地方性法规', '地方政府规章', '司法解释']

function resetCreateForm() {
  createFormData.title = ''
  createFormData.code = ''
  createFormData.type = '地方性法规'
  createFormData.publishDate = null
  createFormData.implementDate = null
  createFormData.expireDate = null
  createFormData.relatedEquipment = ''
  createFormData.attachments = []
  createFormData.remark = ''
  createFormData.content = ''
}

function handleSaveDraft() {
  ElMessage.success('草稿保存成功')
  createDrawerVisible.value = false
}

function handleSubmitAudit() {
  ElMessage.success('已提交审核')
}

function handleCreateAction(command: string) {
  if (command === 'draft') {
    handleSaveDraft()
  } else if (command === 'submit') {
    handleSubmitAudit()
  }
}

const statsCards = [
  { key: '全部', label: '全部', value: 6, icon: Document, color: '#409EFF', bgColor: '#ecf5ff' },
  { key: '历史案例', label: '历史案例', value: 1, icon: Notebook, color: '#67C23A', bgColor: '#f0f9eb' },
  { key: '政策法规', label: '政策法规', value: 2, icon: Collection, color: '#E6A23C', bgColor: '#fdf6ec' },
  { key: '专家知识', label: '专家知识', value: 2, icon: User, color: '#F56C6C', bgColor: '#fef0f0' },
  { key: '标准规范', label: '标准规范', value: 1, icon: Box, color: '#909399', bgColor: '#f4f4f5' }
]

const auditStatuses = ['全部', '未审核', '已通过', '不通过']

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const filteredData = computed(() => {
  let data = allData.value

  if (activeCategory.value !== '全部') {
    data = data.filter(item => item.type === activeCategory.value)
  }

  if (activeAuditStatus.value !== '全部') {
    data = data.filter(item => item.auditResult === activeAuditStatus.value)
  }

  if (searchKeyword.value) {
    data = data.filter(item => item.title.includes(searchKeyword.value))
  }

  pagination.total = data.length
  return data
})

const tableData = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  return filteredData.value.slice(start, start + pagination.pageSize)
})

function handleSearch() {
  pagination.page = 1
}

function csvCell(value: unknown): string {
  const str = value == null ? '' : String(value)
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

function handleExport() {
  if (!filteredData.value.length) {
    ElMessage.warning('暂无数据可导出')
    return
  }
  const header = '知识标题,知识编号,知识类型,配套资源附件数,状态,审核结果,创建时间,最近修改人,最近修改时间,当前版本号,版本迭代原因'
  const body = filteredData.value.map(row =>
    [row.title, row.code, row.type, row.attachmentCount, row.status, row.auditResult, row.createTime, row.lastModifier, row.lastModifyTime, row.version, row.versionReason]
      .map(csvCell).join(',')
  ).join('\n')
  const blob = new Blob(['\ufeff' + `${header}\n${body}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `知识列表_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('导出成功')
}

function handleCreate() {
  resetCreateForm()
  createDrawerVisible.value = true
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
}

function handlePageChange(page: number) {
  pagination.page = page
}

function handleViewDetail(row: KnowledgeItem) {
  currentDetail.value = row
  const versions = mockKnowledgeVersions[row.code]
  currentVersion.value = versions && versions.length ? versions[0].version : row.version
  activeTab.value = 'content'
  detailDrawerVisible.value = true
}

function handleVersionChange(version: string) {
  currentVersion.value = version
  const target = currentVersionContent.value
  ElMessage.info(`已切换到版本 ${version}${target ? `（${target.updateTime} 发布）` : ''}`)
}

function handleWithdraw() {
  ElMessage.warning('撤回操作已触发')
}
</script>

<style lang="scss" scoped>
.knowledge-input-page {
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
      cursor: pointer;
      font-weight: 500;
      color: #409EFF;

      &:hover {
        color: #66b1ff;
      }
    }

    .code-text {
      font-family: Consolas, Monaco, monospace;
      font-size: 13px;
      color: #606266;
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

.status-tag {
  font-size: 13px;

  &.status-草稿 {
    color: #909399;
  }

  &.status-已提审 {
    color: #E6A23C;
  }

  &.status-已发布 {
    color: #67C23A;
  }

  &.status-已撤回 {
    color: #909399;
  }
}

.audit-tag {
  font-size: 13px;

  &.audit-待审核 {
    color: #E6A23C;
  }

  &.audit-已通过 {
    color: #67C23A;
  }

  &.audit-不通过 {
    color: #F56C6C;
  }

  &.audit-- {
    color: #C0C4CC;
  }
}

// ── 知识详情抽屉样式 ──
:deep(.knowledge-detail-drawer) {
  .el-drawer__body {
    padding: 0;
  }
}

.detail-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.detail-header {
  padding: 20px 24px;
  border-bottom: 1px solid #ebeef5;

  .header-title {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  .detail-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin: 0;
    line-height: 1.5;
    flex: 1;
  }

  .version-dropdown {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    background: #f5f7fa;
    border-radius: 6px;
    font-size: 13px;
    color: #606266;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s;

    &:hover {
      background: #ecf5ff;
      color: #409EFF;
    }
  }
}

:global(.version-popper) {
  .el-dropdown-menu__item {
    &.is-active {
      color: #409EFF;
      font-weight: 600;
      background: #ecf5ff;
    }
  }
}

.detail-info {
  padding: 16px 24px;
  background: #fafafa;
  border-bottom: 1px solid #ebeef5;

  .info-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    column-gap: 24px;
    row-gap: 12px;
    margin-bottom: 12px;
  }

  .info-row {
    display: flex;
    align-items: center;
    min-width: 0;

    &.info-row-full {
      margin-top: 12px;
    }
  }

  .info-label {
    width: 80px;
    font-size: 13px;
    color: #909399;
    text-align: justify;
    flex-shrink: 0;
  }

  .info-value {
    font-size: 13px;
    color: #303133;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.detail-tabs {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.el-tabs) {
    height: 100%;
    display: flex;
    flex-direction: column;

    .el-tabs__header {
      padding: 0 24px;
      margin: 0;
    }

    .el-tabs__content {
      flex: 1;
      overflow: auto;
      padding: 16px 24px;
    }

    .el-tab-pane {
      height: 100%;
    }
  }
}

.knowledge-content {
  font-size: 14px;
  line-height: 1.8;
  color: #303133;

  .version-info {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 24px;
    padding: 10px 16px;
    margin-bottom: 20px;
    background: #f5f7fa;
    border: 1px solid #e4e7ed;
    border-left: 3px solid #409EFF;
    border-radius: 6px;
    font-size: 13px;
    color: #606266;

    .version-info-item {
      display: flex;
      align-items: center;
      gap: 4px;

      .el-icon {
        color: #409EFF;
      }
    }

    .version-info-reason {
      flex: 1;
      min-width: 200px;
    }
  }

  .content-header {
    margin-bottom: 24px;

    p {
      margin: 8px 0;
    }
  }

  .content-sign {
    text-align: right;
    margin-top: 24px;
  }

  .content-date {
    text-align: right;
  }

  .content-body {
    h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 24px 0 12px;
    }

    p {
      margin: 12px 0;
      text-indent: 2em;
    }
  }
}

.detail-footer {
  padding: 16px 24px;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: flex-end;
  background: #fff;
}

// ── 新建知识抽屉样式 ──
:deep(.create-knowledge-drawer) {
  .el-drawer__body {
    padding: 0;
  }
}

.create-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.create-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #ebeef5;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .create-title {
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    margin: 0;
  }
}

.create-tabs {
  padding: 0 24px;

  :deep(.el-tabs) {
    .el-tabs__header {
      margin: 0;
    }

    .el-tabs__nav-wrap::after {
      height: 1px;
    }
  }
}

.create-form-wrapper {
  flex: 1;
  overflow: auto;
  padding: 20px 24px;
}

.create-form {
  .form-section {
    margin-bottom: 24px;

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 16px;
      padding-left: 12px;
      border-left: 3px solid #409EFF;

      .title-bar {
        display: none;
      }
    }
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0 20px;

    .form-item-span-2 {
      grid-column: span 2;
    }
  }

  :deep(.el-form-item) {
    margin-bottom: 20px;
  }

  :deep(.el-form-item__label) {
    font-size: 13px;
    color: #606266;
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
