<template>
  <div class="schedule-table">
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      stripe
      highlight-current-row
      :span-method="spanMethod"
      :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
      class="data-table"
    >
      <el-table-column type="expand" width="48">
        <template #default="{ row }">
          <div class="expand-items">
            <div class="expand-head">
              <span class="expand-title">{{ row.moduleName }}</span>
              <span class="expand-sub">系统：{{ row.systemName }} · 子系统：{{ row.subsystemName }}</span>
            </div>
            <el-table
              :data="row.items"
              border
              size="small"
              :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
            >
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column prop="itemName" label="功能计数项名称" min-width="260" show-overflow-tooltip />
              <el-table-column prop="complexity" label="复杂系数" width="110" align="center" />
              <el-table-column prop="personDays" label="预估人天" width="90" align="center" sortable />
              <el-table-column label="研发团队" width="320" align="center">
                <template #default="{ row: it }">
                  <div class="team-cell">
                    <template v-for="t in it.team.split('+')" :key="t">
                      <span class="team-item">
                        <el-tag size="small" :color="teamColor(t) + '22'" class="team-tag">{{ t }}</el-tag>
                        <span v-if="teamMembers(t)" class="team-members">{{ teamMembers(t) }}</span>
                      </span>
                    </template>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="开始日期" width="120" align="center" sortable :sort-method="sortByDate">
                <template #default="{ row: it }">
                  <span class="time-text">{{ it.startDate }}</span>
                </template>
              </el-table-column>
              <el-table-column label="结束日期" width="120" align="center" sortable :sort-method="sortByDate">
                <template #default="{ row: it }">
                  <span class="time-text">{{ it.endDate }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>

      <el-table-column type="index" label="序号" width="60" align="center" />

      <el-table-column prop="systemName" label="系统名称" width="190" show-overflow-tooltip />

      <el-table-column prop="subsystemName" label="子系统" width="160" show-overflow-tooltip />

      <el-table-column prop="moduleName" label="模块名称" min-width="220" show-overflow-tooltip>
        <template #default="{ row }">
          <span
            class="module-name-link"
            role="button"
            tabindex="0"
            :title="row.moduleName"
            @click="emit('open-drawer', row)"
            @keydown.enter.stop.prevent="emit('open-drawer', row)"
            @keydown.space.stop.prevent="emit('open-drawer', row)"
          >{{ row.moduleName }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="itemCount" label="功能项数" width="90" align="center" sortable />

      <el-table-column prop="personDays" label="预估人天" width="90" align="center" sortable />

      <el-table-column label="研发团队" width="320" align="center">
        <template #default="{ row }">
          <el-tooltip
            :content="teamTooltipText(row.teams)"
            placement="top"
            :show-after="200"
          >
            <div class="team-cell">
              <template v-for="t in row.teams" :key="t">
                <span class="team-item">
                  <el-tag size="small" :color="teamColor(t) + '22'" class="team-tag">{{ t }}</el-tag>
                  <span v-if="teamMembers(t)" class="team-members">{{ teamMembers(t) }}</span>
                </span>
              </template>
            </div>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="开始日期" width="120" align="center" sortable :sort-method="sortByDate">
        <template #default="{ row }">
          <span class="time-text">{{ row.startDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="结束日期" width="120" align="center" sortable :sort-method="sortByDate">
        <template #default="{ row }">
          <span class="time-text">{{ row.endDate }}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="statusType(getStatus(row))" size="small">{{ getStatus(row) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="90" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="emit('open-drawer', row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="modules.length"
        :page-sizes="[10, 20, 50, 100, 200]"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { ScheduleModule } from '@/types/schedule'
import { teamColor, teamMembers, teamTooltipText, sortByDate, getStatus, statusType } from './scheduleUtils'

const props = defineProps<{
  modules: ScheduleModule[]
}>()

const emit = defineEmits<{
  (e: 'open-drawer', mod: ScheduleModule): void
}>()

const loading = ref(false)

// ---------- 分页 ----------
const pagination = reactive({
  page: 1,
  pageSize: 20
})

watch(
  () => props.modules,
  () => {
    pagination.page = 1
  }
)

const tableData = computed(() => {
  const start = (pagination.page - 1) * pagination.pageSize
  return props.modules.slice(start, start + pagination.pageSize)
})

interface MergeSpan {
  rowspan: number
  colspan: number
}

function buildMergeMap(rows: ScheduleModule[]): Record<string, MergeSpan>[] {
  const map: Record<string, MergeSpan>[] = []
  for (const key of ['systemName', 'subsystemName'] as const) {
    const spans: Record<string, MergeSpan> = {}
    for (let i = 0; i < rows.length; i++) {
      const value = rows[i][key]
      if (value === undefined) continue
      const spanKey = key === 'subsystemName' ? `${rows[i].systemName}|${value}` : value
      const prevSpanKey = i > 0 ? (key === 'subsystemName' ? `${rows[i - 1].systemName}|${rows[i - 1].subsystemName}` : rows[i - 1][key]) : undefined
      if (spanKey === prevSpanKey) {
        spans[i] = { rowspan: 0, colspan: 0 }
      } else {
        let count = 1
        for (let j = i + 1; j < rows.length; j++) {
          const nextKey = key === 'subsystemName' ? `${rows[j].systemName}|${rows[j].subsystemName}` : rows[j][key]
          if (nextKey === spanKey) count++
          else break
        }
        spans[i] = { rowspan: count, colspan: 1 }
      }
    }
    map.push(spans)
  }
  return map
}

const mergeMaps = computed(() => buildMergeMap(tableData.value))

function spanMethod({ rowIndex, columnIndex }: { rowIndex: number; columnIndex: number }) {
  const sysSpan = mergeMaps.value[0][rowIndex]
  const subSpan = mergeMaps.value[1][rowIndex]
  if (columnIndex === 2) return sysSpan
  if (columnIndex === 3) return subSpan
  return { rowspan: 1, colspan: 1 }
}

function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
}

function handlePageChange(page: number) {
  pagination.page = page
}
</script>

<style lang="scss" scoped>
.schedule-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.data-table {
  flex: 1;
}

.module-name-text {
  font-weight: 500;
  color: #303133;
}

.module-name-link {
  font-weight: 500;
  color: #409eff;
  cursor: pointer;
  transition: color .15s;
}

.module-name-link:hover,
.module-name-link:focus-visible {
  color: #66b1ff;
  text-decoration: underline;
  outline: none;
}

.team-tag {
  margin-right: 4px;

  &:last-child {
    margin-right: 0;
  }
}

.team-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.team-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.team-members {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
}

.time-text {
  font-size: 13px;
  color: #606266;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  flex-shrink: 0;
}

/* 展开明细 */
.expand-items {
  padding: 4px 24px 12px 40px;

  .expand-head {
    margin-bottom: 10px;

    .expand-title {
      font-size: 14px;
      font-weight: 600;
      color: #303133;
      margin-right: 12px;
    }

    .expand-sub {
      font-size: 12px;
      color: #909399;
    }
  }
}
</style>
