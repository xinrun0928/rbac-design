<template>
  <div class="schedule-gantt">
    <div class="gantt-scroll" ref="ganttScrollRef">
      <div class="gantt-inner" :style="{ width: totalGanttWidth + 'px' }">
        <!-- 时间轴 -->
        <div class="gantt-axis">
          <div class="axis-corner">模块 / 日期</div>
          <div class="axis-months">
            <div
              v-for="seg in axisSegments"
              :key="seg.label + seg.start"
              class="axis-month"
              :style="{ left: segmentLeft(seg) + 'px', width: segmentWidth(seg) + 'px' }"
            >
              {{ seg.label }}
            </div>
          </div>
        </div>

        <!-- 今日参考线 -->
        <div class="gantt-today-line" :style="{ left: todayLineLeft + 'px' }">
          <span class="today-dot"></span>
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

    <!-- 右下角悬浮操作按钮 -->
    <div class="gantt-controls">
      <el-tooltip content="定位到今天" placement="left">
        <el-button
          :icon="Position"
          circle
          type="primary"
          plain
          @click="scrollToToday"
        />
      </el-tooltip>
      <el-tooltip :content="fullscreen ? '退出全屏' : '全屏查看'" placement="left">
        <el-button
          :icon="fullscreen ? Aim : FullScreen"
          circle
          type="primary"
          plain
          @click="emit('toggle-fullscreen')"
        />
      </el-tooltip>
    </div>

    <!-- 右下角缩放条 -->
    <div class="gantt-zoombar">
      <span class="zoom-value">{{ Math.round(zoom * 100) }}%</span>
      <el-slider v-model="zoom" :min="0.5" :max="5" :step="0.1" class="zoom-slider" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { Position, FullScreen, Aim } from '@element-plus/icons-vue'
import type { ScheduleModule } from '@/types/schedule'
import { mockScheduleItems, mockScheduleTeams } from '@/mock/schedule/scheduleData'
import { teamColor, DAY_MS, parseDate } from './scheduleUtils'

const props = defineProps<{
  modules: ScheduleModule[]
  groupBy: 'system' | 'team'
  systemNames: string[]
  timeUnit: 'day' | 'week' | 'month' | 'year'
  fullscreen: boolean
}>()

const zoom = defineModel<number>('zoom', { default: 1 })

const emit = defineEmits<{
  (e: 'open-drawer', mod: ScheduleModule): void
  (e: 'toggle-fullscreen'): void
}>()

const ganttScrollRef = ref<HTMLElement | null>(null)

// 今日参考线位置：按当前时刻（含时分秒）在当天内比例定位 + 左侧标签列宽度 220
const todayLineLeft = computed(() =>
  220 + ((Date.now() - rangeStart.value) / DAY_MS) * dayWidth.value
)

// 定位到今日并居中
function scrollToToday() {
  const el = ganttScrollRef.value
  if (!el) return
  const todayX = todayLineLeft.value
  const target = todayX - el.clientWidth / 2
  const maxScroll = el.scrollWidth - el.clientWidth
  el.scrollTo({ left: Math.max(0, Math.min(target, maxScroll)), behavior: 'smooth' })
}

// 切换时间轴单位后自动回到今日
watch(
  () => props.timeUnit,
  async () => {
    await nextTick()
    scrollToToday()
  }
)


// 时间轴刻度单位对应的每像素天数宽度（天>周>月>年，比例逐渐变小）
const UNIT_DAY_WIDTH: Record<string, number> = {
  day: 40,
  week: 8,
  month: 4,
  year: 1.5
}

const dayWidth = computed(() => UNIT_DAY_WIDTH[props.timeUnit] * zoom.value)

// 按时间轴单位对齐范围起止，保证每个单位完整展示
function unitRangeStart(): number {
  const min = Math.min(...mockScheduleItems.map(it => parseDate(it.startDate)))
  const d = new Date(min)
  switch (props.timeUnit) {
    case 'year':
      return Date.UTC(d.getUTCFullYear(), 0, 1)
    case 'week': {
      const dow = d.getUTCDay()
      const offsetToMonday = dow === 0 ? 6 : dow - 1
      const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - offsetToMonday))
      return Date.UTC(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate())
    }
    case 'day':
      return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    default:
      return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)
  }
}

function unitRangeEnd(): number {
  const max = Math.max(...mockScheduleItems.map(it => parseDate(it.endDate)))
  const d = new Date(max)
  switch (props.timeUnit) {
    case 'year':
      return Date.UTC(d.getUTCFullYear() + 1, 0, 0)
    case 'week': {
      const dow = d.getUTCDay()
      const offsetToSunday = dow === 0 ? 0 : 7 - dow
      const sunday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + offsetToSunday))
      return Date.UTC(sunday.getUTCFullYear(), sunday.getUTCMonth(), sunday.getUTCDate())
    }
    case 'day':
      return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    default:
      return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)
  }
}

const rangeStart = computed(unitRangeStart)
const rangeEnd = computed(unitRangeEnd)

const totalDays = computed(() => Math.round((rangeEnd.value - rangeStart.value) / DAY_MS) + 1)

const totalGanttWidth = computed(() => 220 + totalDays.value * dayWidth.value)

interface AxisSegment {
  label: string
  start: number
  days: number
}

function buildMonths(): AxisSegment[] {
  const list: AxisSegment[] = []
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
}

function buildYears(): AxisSegment[] {
  const list: AxisSegment[] = []
  let cursor = new Date(rangeStart.value)
  while (cursor.getTime() <= rangeEnd.value) {
    const year = cursor.getUTCFullYear()
    const start = Date.UTC(year, 0, 1)
    const end = Date.UTC(year + 1, 0, 0)
    list.push({
      label: `${year}年`,
      start,
      days: Math.round((end - start) / DAY_MS) + 1
    })
    cursor = new Date(Date.UTC(year + 1, 0, 1))
  }
  return list
}

function buildWeeks(): AxisSegment[] {
  const list: AxisSegment[] = []
  const firstDay = new Date(rangeStart.value)
  const dow = firstDay.getUTCDay()
  const offsetToMonday = dow === 0 ? 6 : dow - 1
  const weekStart = new Date(rangeStart.value)
  weekStart.setUTCDate(firstDay.getUTCDate() - offsetToMonday)
  let cursor = new Date(Date.UTC(weekStart.getUTCFullYear(), weekStart.getUTCMonth(), weekStart.getUTCDate()))
  while (cursor.getTime() <= rangeEnd.value) {
    const label = `${String(cursor.getUTCMonth() + 1).padStart(2, '0')}-${String(cursor.getUTCDate()).padStart(2, '0')}`
    list.push({ label: `周 ${label}`, start: cursor.getTime(), days: 7 })
    cursor = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), cursor.getUTCDate() + 7))
  }
  return list
}

function buildDays(): AxisSegment[] {
  const list: AxisSegment[] = []
  const cursor = new Date(rangeStart.value)
  while (cursor.getTime() <= rangeEnd.value) {
    const label = `${String(cursor.getUTCMonth() + 1).padStart(2, '0')}-${String(cursor.getUTCDate()).padStart(2, '0')}`
    list.push({ label, start: cursor.getTime(), days: 1 })
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return list
}

const axisSegments = computed<AxisSegment[]>(() => {
  switch (props.timeUnit) {
    case 'day': return buildDays()
    case 'week': return buildWeeks()
    case 'year': return buildYears()
    default: return buildMonths()
  }
})

function segmentLeft(m: { start: number }) {
  return ((m.start - rangeStart.value) / DAY_MS) * dayWidth.value
}

function segmentWidth(m: { days: number }) {
  return m.days * dayWidth.value
}

function barLeft(startDate: string) {
  return ((parseDate(startDate) - rangeStart.value) / DAY_MS) * dayWidth.value
}

function barWidth(startDate: string, endDate: string) {
  const days = (parseDate(endDate) - parseDate(startDate)) / DAY_MS + 1
  return Math.max(days, 1) * dayWidth.value
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
  position: relative;
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

/* 今日参考线 */
.gantt-today-line {
  position: absolute;
  top: 40px;
  bottom: 0;
  width: 2px;
  background: #F56C6C;
  z-index: 4;
  pointer-events: none;

  .today-dot {
    position: absolute;
    top: -1px;
    left: -4px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #F56C6C;
  }
}

/* 右下角悬浮操作按钮 */
.gantt-controls {
  position: absolute;
  right: 16px;
  bottom: 16px;
  z-index: 8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: transparent;
  opacity: 0.6;

  :deep(.el-button) {
    margin-left: 0;
  }
}

/* 右下角缩放条（位于操作按钮左侧） */
.gantt-zoombar {
  position: absolute;
  right: 76px;
  bottom: 16px;
  z-index: 9;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: transparent;
  opacity: 0.6;

  .zoom-value {
    font-size: 12px;
    color: #606266;
    min-width: 42px;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  .zoom-slider {
    width: 110px;
    margin: 0;
  }
}
</style>
