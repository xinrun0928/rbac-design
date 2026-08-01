<template>
  <el-drawer
    v-model="visible"
    title="考核任务详情"
    size="70%"
    direction="rtl"
    destroy-on-close
    class="assessment-detail-drawer"
    @close="handleClose"
  >
    <div v-if="record" class="detail-wrapper">
      <h2 class="detail-title">{{ record.taskName }}</h2>

      <div class="detail-info">
        <div class="info-row">
          <span class="info-label">关联考核模板：</span>
          <el-link type="primary" :underline="false">{{ record.templateName }}</el-link>
        </div>
        <div class="info-row">
          <span class="info-label">任务状态：</span>
          <span class="status-text" :class="statusClass">{{ statusLabel }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">考核进度：</span>
          <span class="progress-text">{{ record.progress }}%</span>
        </div>
        <div class="info-row full-width">
          <span class="info-label">考核对象：</span>
          <span>{{ assessorLabel }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">考核开始日期：</span>
          <span>{{ record.startDate }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">考核结束日期：</span>
          <span>{{ record.endDate }}</span>
        </div>
        <div class="info-row full-width">
          <span class="info-label">备注：</span>
          <span>{{ record.description || '-' }}</span>
        </div>
      </div>

      <el-tabs v-model="activeTab" class="detail-tabs">
        <el-tab-pane label="设备/物资清单" name="equipment">
          <div class="section-title">考核对象及考核情况</div>
          <div class="table-toolbar">
            <span class="data-count">共{{ filteredTargetList.length }}条数据</span>
            <div class="toolbar-right">
              <el-link type="primary" :underline="false" class="import-link" @click="handleImport">
                导入维保结果
              </el-link>
              <el-input
                v-model="searchKeyword"
                placeholder="输入关键字快速搜索"
                clearable
                :prefix-icon="Search"
                style="width: 220px"
                @keyup.enter="handleSearch"
                @clear="handleSearch"
              />
            </div>
          </div>

          <el-table
            :data="filteredTargetList"
            border
            stripe
            :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
            class="target-table"
          >
            <el-table-column prop="name" label="考核对象" min-width="100" align="center">
              <template #default="{ row }">
                <el-link type="primary" :underline="false">{{ row.name }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="联系电话" min-width="130" align="center" />
            <el-table-column prop="dept" label="所属部门" min-width="120" align="center" />
            <el-table-column prop="status" label="考核状态" min-width="100" align="center">
              <template #default="{ row }">
                <span :class="row.status === 'completed' ? 'text-success' : 'text-warning'">
                  {{ row.status === 'completed' ? '已完成' : '未完成' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="score" label="考核分数" min-width="100" align="center">
              <template #default="{ row }">
                <span>{{ row.score ?? '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="isQualified" label="是否合格" min-width="100" align="center">
              <template #default="{ row }">
                <span v-if="row.isQualified === undefined">-</span>
                <el-tag v-else :type="row.isQualified ? 'success' : 'danger'" effect="light" round>
                  {{ row.isQualified ? '合格' : '不合格' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="completeTime" label="完成时间" min-width="120" align="center">
              <template #default="{ row }">
                <span>{{ row.completeTime || '-' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="140" align="center" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleViewTarget(row)">查看</el-button>
                <el-button v-if="row.status === 'not_completed'" type="warning" link @click="handleRemindTarget(row)">
                  催办
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>

    <template #footer>
      <div class="detail-footer">
        <el-button :icon="Bell" @click="handleRemindAll">一键催办</el-button>
        <div class="footer-right">
          <el-button type="danger" :icon="CircleClose" @click="handleRevoke">撤销考核</el-button>
          <el-button type="primary" :icon="Edit" @click="handleEdit">修改</el-button>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, Bell, Edit, CircleClose } from '@element-plus/icons-vue'
import type { EquipmentAssessmentRecord, AssessmentTargetDetail, AssessmentStatus, AssessorType } from '@/types/resource/training'
import { assessmentTargetDetails } from '@/mock/resource/trainingData'

const props = defineProps<{
  modelValue: boolean
  record: EquipmentAssessmentRecord | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'edit': [record: EquipmentAssessmentRecord]
  'revoke': [record: EquipmentAssessmentRecord]
  'remind': [record: EquipmentAssessmentRecord]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})

const activeTab = ref('equipment')
const searchKeyword = ref('')

function assessorTypeLabel(type: AssessorType): string {
  const map: Record<AssessorType, string> = {
    dept: '部门',
    person: '个人',
    post: '岗位'
  }
  return map[type]
}

function statusLabel(status: AssessmentStatus): string {
  const map: Record<AssessmentStatus, string> = {
    completed: '已完成',
    in_progress: '进行中',
    not_started: '未开始'
  }
  return map[status]
}

const statusClass = computed(() => {
  if (!props.record) return ''
  const map: Record<AssessmentStatus, string> = {
    completed: 'text-success',
    in_progress: 'text-primary',
    not_started: 'text-info'
  }
  return map[props.record.status]
})

const statusLabelComputed = computed(() => {
  if (!props.record) return ''
  return statusLabel(props.record.status)
})

const assessorLabel = computed(() => {
  if (!props.record) return ''
  return `${assessorTypeLabel(props.record.assessorType)}：${props.record.assessorTarget}`
})

const targetList = computed<AssessmentTargetDetail[]>(() => {
  if (!props.record) return []
  return assessmentTargetDetails[props.record.taskId] || []
})

const filteredTargetList = computed(() => {
  if (!searchKeyword.value) return targetList.value
  const kw = searchKeyword.value.trim()
  return targetList.value.filter(
    item =>
      item.name.includes(kw) ||
      item.phone.includes(kw) ||
      item.dept.includes(kw)
  )
})

function handleSearch() {
  // 搜索通过 computed 自动响应
}

function handleImport() {
  ElMessage.info('导入维保结果')
}

function handleViewTarget(row: AssessmentTargetDetail) {
  ElMessage.info(`查看 ${row.name} 的考核详情`)
}

function handleRemindTarget(row: AssessmentTargetDetail) {
  ElMessage.success(`已催办 ${row.name}`)
}

function handleRemindAll() {
  if (!props.record) return
  emit('remind', props.record)
}

function handleRevoke() {
  if (!props.record) return
  emit('revoke', props.record)
}

function handleEdit() {
  if (!props.record) return
  emit('edit', props.record)
}

function handleClose() {
  searchKeyword.value = ''
  activeTab.value = 'equipment'
}
</script>

<style lang="scss" scoped>
.assessment-detail-drawer {
  :deep(.el-drawer__body) {
    padding: 0;
    background: #f5f7fa;
  }

  :deep(.el-drawer__footer) {
    padding: 0;
    border-top: 1px solid #ebeef5;
  }
}

.detail-wrapper {
  padding: 20px;
  background: #fff;
  min-height: calc(100% - 60px);
}

.detail-title {
  margin: 0 0 20px 0;
  font-size: 22px;
  font-weight: 700;
  color: #303133;
}

.detail-info {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 40px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;

  .info-row {
    display: flex;
    align-items: center;
    min-width: 240px;

    &.full-width {
      width: 100%;
      min-width: auto;
    }

    .info-label {
      color: #606266;
      font-size: 14px;
      flex-shrink: 0;
    }

    .status-text {
      font-weight: 500;
    }

    .progress-text {
      font-weight: 500;
      color: #303133;
    }
  }
}

.detail-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 16px;
  }

  :deep(.el-tabs__item) {
    font-size: 15px;
  }

  :deep(.el-tabs__item.is-active) {
    color: #409eff;
  }

  :deep(.el-tabs__active-bar) {
    background-color: #409eff;
  }
}

.section-title {
  font-size: 16px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 16px;
}

.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  .data-count {
    color: #909399;
    font-size: 14px;
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 16px;

    .import-link {
      font-size: 14px;
    }
  }
}

.target-table {
  width: 100%;
}

.detail-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #fff;

  .footer-right {
    display: flex;
    align-items: center;
  }
}

.text-success {
  color: #67c23a;
}

.text-warning {
  color: #e6a23c;
}

.text-primary {
  color: #409eff;
}

.text-info {
  color: #909399;
}
</style>
