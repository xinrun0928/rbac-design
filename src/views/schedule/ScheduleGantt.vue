<template>
  <div class="schedule-gantt">
    <div class="gantt-scroll">
      <div class="gantt-inner" :style="{ width: totalGanttWidth + 'px' }">
        <!-- 时间轴 -->
        <div class="gantt-axis">
          <div class="axis-corner">模块 / 日期</div>
          <div class="axis-months">
            <div
              v-for="m in months"
              :key="m.label"
              class="axis-month"
              :style="{ left: monthLeft(m) + 'px', width: monthWidth(m) + 'px' }"
            >
              {{ m.label }}
            </div>
          </div>
        </div>

        <!-- 分组行 -->
        <template v-for="group in groupedRows" :key="group.title">
          <div class="gantt-group">{{ group.title }}</div>
          <div v-for="mod in group.modules" :key="mod.key" class="gantt-row">
            <div class="gantt-label" :title="mod.moduleName">
              <span class="gantt-label-text">{{ mod.moduleName }}</span>
            </div>
            <div class="gantt-track">
              <el-tooltip placement="top" :show-after="200">
                <template #content>
                  <div class="gantt-tip">
                    <div class="tip-title">{{ mod.moduleName }}</div>
                    <div>{{ mod.systemName }} / {{ mod.subsystemName }}</div>
                    <div>功能项 {{ mod.itemCount }} 个 · 人天 {{ mod.personDays }}</div>
                    <div>团队：{{ mod.teamText }} · {{ mod.startDate }} ~ {{ mod.endDate }}</div>
                  </div>
                </template>
                <div
                  class="gantt-bar"
                  :style="barStyle(mod)"
                  @click="emit('open-drawer', mod)"
                >
                  <span class="bar-text">{{ mod.moduleName }}</span>
                </div>
              </el-tooltip>
            </div>
          </div>
        </template>

        <div v-if="groupedRows.length === 0" class="gantt-empty">暂无匹配的排期数据</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ScheduleModule } from '@/types/schedule'
import { mockScheduleItems, mockScheduleTeams } from '@/mock/schedule/scheduleData'
import { teamColor, DAY_MS, parseDate } from './scheduleUtils'

const props = defineProps<{
  modules: ScheduleModule[]
  groupBy: 'system' | 'team'
  systemNames: string[]
}>()

const emit = defineEmits<{
  (e: 'open-drawer', mod: ScheduleModule): void
}>()

const rangeStart = computed(() => {
  const min = Math.min(...mockScheduleItems.map(it => parseDate(it.startDate)))
  const d = new Date(min)
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)
})

const rangeEnd = computed(() => {
  const max = Math.max(...mockScheduleItems.map(it => parseDate(it.endDate)))
  const d = new Date(max)
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)
})

const totalDays = computed(() => Math.round((rangeEnd.value - rangeStart.value) / DAY_MS) + 1)

const dayWidth = 6

const totalGanttWidth = computed(() => 220 + totalDays.value * dayWidth)

const months = computed(() => {
  const list: { label: string; start: number; days: number }[] = []
  let cursor = new Date(rangeStart.value)
  while (cursor.getTime() <= rangeEnd.value) {
    const year = cursor.getUTCFullYear()
    const month = cursor.getUTCMonth()
    const start = Date.UTC(year, month, 1)
    const end = Date.UTC(year, month + 1, 0)
    list.push({
      label: `${year}-${String(month + 1).padStart(2, '0')}`,
      start,
      days: Math.round((end - start) / DAY_MS) + 1
    })
    cursor = new Date(Date.UTC(year, month + 1, 1))
  }
  return list
})

function monthLeft(m: { start: number }) {
  return ((m.start - rangeStart.value) / DAY_MS) * dayWidth
}

function monthWidth(m: { days: number }) {
  return m.days * dayWidth
}

function barLeft(startDate: string) {
  return ((parseDate(startDate) - rangeStart.value) / DAY_MS) * dayWidth
}

function barWidth(startDate: string, endDate: string) {
  const days = (parseDate(endDate) - parseDate(startDate)) / DAY_MS + 1
  return Math.max(days, 1) * dayWidth
}

function barStyle(mod: ScheduleModule) {
  return {
    left: barLeft(mod.startDate) + 'px',
    width: barWidth(mod.startDate, mod.endDate) + 'px',
    background: mod.teams.length > 1
      ? `linear-gradient(90deg, ${mod.teams.map(t => teamColor(t)).join(', ')})`
      : teamColor(mod.teams[0] || 'A组')
  }
}

const groupedRows = computed(() => {
  const result: { title: string; modules: ScheduleModule[] }[] = []
  if (props.groupBy === 'system') {
    for (const name of props.systemNames) {
      const modules = props.modules.filter(m => m.systemName === name)
      if (modules.length) result.push({ title: name, modules })
    }
  } else {
    for (const t of mockScheduleTeams) {
      const modules = props.modules.filter(m => m.teams.includes(t.name))
      if (modules.length) result.push({ title: `${t.name}${t.frontend ? `（${t.frontend} / ${t.backend}）` : ''}`, modules })
    }
  }
  return result
})
</script>

<style lang="scss" scoped>
.schedule-gantt {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.gantt-scroll {
  height: 100%;
  overflow: auto;
}

.gantt-inner {
  position: relative;
  min-width: 100%;
}

.gantt-axis {
  position: sticky;
  top: 0;
  z-index: 5;
  height: 40px;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;

  .axis-corner {
    position: sticky;
    left: 0;
    z-index: 6;
    float: left;
    width: 220px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 600;
    color: #606266;
    background: #f5f7fa;
    border-right: 1px solid #ebeef5;
  }

  .axis-months {
    position: absolute;
    left: 220px;
    right: 0;
    top: 0;
    bottom: 0;
  }

  .axis-month {
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #606266;
    border-left: 1px dashed #dcdfe6;
  }
}

.gantt-group {
  position: sticky;
  left: 0;
  z-index: 3;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #409EFF;
  background: rgba(64, 158, 255, 0.08);
  border-bottom: 1px solid #ebeef5;
  border-top: 1px solid #ebeef5;
}

.gantt-row {
  display: flex;
  border-bottom: 1px solid #f2f3f5;

  &:hover {
    background: #f5f7fa;
  }
}

.gantt-label {
  position: sticky;
  left: 0;
  z-index: 2;
  width: 220px;
  min-width: 220px;
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: #fff;
  border-right: 1px solid #ebeef5;
  overflow: hidden;

  .gantt-label-text {
    font-size: 13px;
    color: #303133;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.gantt-track {
  position: relative;
  flex: 1;
  height: 44px;
}

.gantt-bar {
  position: absolute;
  top: 10px;
  bottom: 10px;
  border-radius: 6px;
  cursor: pointer;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  transition: filter 0.2s;

  &:hover {
    filter: brightness(1.1);
  }

  .bar-text {
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.gantt-empty {
  padding: 60px 20px;
  text-align: center;
  color: #909399;
  font-size: 14px;
}

.gantt-tip {
  font-size: 12px;
  line-height: 1.8;

  .tip-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 2px;
  }
}
</style>
