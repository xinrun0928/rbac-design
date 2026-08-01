<template>
  <div class="schedule-gantt">
    <div
      class="gantt-scroll"
      ref="ganttScrollRef"
      :class="{ 'is-dragging': isDragging }"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="stopDragging"
      @pointercancel="stopDragging"
      @wheel="handleWheel"
    >
      <div class="gantt-inner" :style="{ width: totalGanttWidth + 'px' }">
        <!-- 时间轴 -->
        <div class="gantt-axis">
          <div class="axis-corner">子系统 / 模块名称</div>
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
          <div class="gantt-group">
            <div class="gantt-group-label" :title="group.title">{{ group.title }}</div>
            <div class="gantt-group-track"></div>
          </div>
          <div v-for="mod in group.modules" :key="mod.key" class="gantt-row">
            <div
              class="gantt-label"
              :title="`${mod.subsystemName} / ${mod.moduleName}`"
            >
              <span class="gantt-label-subsystem">{{ mod.subsystemName }}</span>
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

    <!-- 右下角时间轴控制 -->
    <div class="gantt-controls">
      <el-tooltip content="定位到今天" placement="top">
        <el-button
          :icon="Position"
          circle
          type="primary"
          plain
          @click="scrollToToday"
        />
      </el-tooltip>
      <span class="control-divider"></span>
      <span class="zoom-label">缩放</span>
      <el-slider v-model="zoom" :min="0.5" :max="5" :step="0.1" class="zoom-slider" />
      <span class="zoom-value">{{ Math.round(zoom * 100) }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { Position } from '@element-plus/icons-vue'
import type { ScheduleModule } from '@/types/schedule'
import { mockScheduleItems, mockScheduleTeams } from '@/mock/schedule/scheduleData'
import { teamColor, DAY_MS, parseDate } from './scheduleUtils'

const props = defineProps<{
  modules: ScheduleModule[]
  groupBy: 'system' | 'team'
  systemNames: string[]
  timeUnit: 'day' | 'week' | 'month' | 'year'
}>()

const zoom = defineModel<number>('zoom', { default: 1 })

const emit = defineEmits<{
  (e: 'open-drawer', mod: ScheduleModule): void
}>()

const ganttScrollRef = ref<HTMLElement | null>(null)
const ganttViewportWidth = ref(0)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartScrollLeft = ref(0)
let resizeObserver: ResizeObserver | null = null

function updateViewportWidth() {
  ganttViewportWidth.value = ganttScrollRef.value?.clientWidth ?? 0
}

onMounted(() => {
  updateViewportWidth()
  if (typeof ResizeObserver !== 'undefined' && ganttScrollRef.value) {
    resizeObserver = new ResizeObserver(updateViewportWidth)
    resizeObserver.observe(ganttScrollRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

function handlePointerDown(event: PointerEvent) {
  if (event.pointerType === 'touch' || event.button !== 0) return
  const target = event.target as HTMLElement
  if (target.closest('.gantt-controls, .gantt-bar')) return

  const el = ganttScrollRef.value
  if (!el || el.scrollWidth <= el.clientWidth) return

  isDragging.value = true
  dragStartX.value = event.clientX
  dragStartScrollLeft.value = el.scrollLeft
  el.setPointerCapture(event.pointerId)
  event.preventDefault()
}

function handlePointerMove(event: PointerEvent) {
  if (!isDragging.value) return
  const el = ganttScrollRef.value
  if (!el) return
  el.scrollLeft = dragStartScrollLeft.value - (event.clientX - dragStartX.value)
}

function stopDragging(event: PointerEvent) {
  if (!isDragging.value) return
  const el = ganttScrollRef.value
  isDragging.value = false
  if (el?.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId)
}

function handleWheel(event: WheelEvent) {
  const el = ganttScrollRef.value
  if (!el || (!event.shiftKey && Math.abs(event.deltaX) <= Math.abs(event.deltaY))) return

  const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
  el.scrollLeft += delta
  event.preventDefault()
}

// 今日参考线位置：按当前时刻（含时分秒）在当天内比例定位 + 左侧标签列宽度 220
const todayLineLeft = computed(() =>
  LABEL_WIDTH + ((Date.now() - rangeStart.value) / DAY_MS) * dayWidth.value
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
    updateViewportWidth()
    await nextTick()
    scrollToToday()
  }
)


// 时间轴刻度单位对应的每像素天数宽度（天>周>月>年，比例逐渐变小）
const LABEL_WIDTH = 220
const UNIT_DAY_WIDTH: Record<string, number> = {
  day: 40,
  week: 8,
  month: 4,
  year: 1.5
}

const baseDayWidth = computed(() => UNIT_DAY_WIDTH[props.timeUnit] * zoom.value)
const fitDayWidth = computed(() => {
  const availableTimelineWidth = Math.max(ganttViewportWidth.value - LABEL_WIDTH, 0)
  return totalDays.value > 0 ? availableTimelineWidth / totalDays.value : 0
})
const dayWidth = computed(() => Math.max(baseDayWidth.value, fitDayWidth.value))

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

const totalGanttWidth = computed(() => LABEL_WIDTH + totalDays.value * dayWidth.value)

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
  width: 100%;
  height: 100%;
  min-width: 0;
  overflow: auto;
  overscroll-behavior: contain;
  touch-action: pan-x pan-y;
  scrollbar-gutter: stable;
  cursor: grab;

  &.is-dragging {
    cursor: grabbing;
    user-select: none;
  }
}

.gantt-inner {
  position: relative;
  min-width: 100%;
  width: max-content;
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
    color: #303133;
    background: linear-gradient(180deg, #f5f7fa 0%, #eef1f6 100%);
    border-right: 1px solid #e4e7ed;
    box-shadow: 4px 0 8px -6px rgba(0, 0, 0, 0.08);
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
    font-weight: 500;
    color: #5b6473;
    background: linear-gradient(180deg, rgba(245, 247, 250, 0.95) 0%, rgba(238, 241, 246, 0.95) 100%);
    border-left: 1px solid #e4e7ed;
    letter-spacing: 0.2px;
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.02);
  }
}

.gantt-group {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  width: 100%;
  border-bottom: 1px solid #ebeef5;
  border-top: 1px solid #ebeef5;
  background: linear-gradient(90deg, #ecf5ff 0%, #f5f7fa 100%);

  .gantt-group-label {
    position: sticky;
    left: 0;
    z-index: 3;
    width: 220px;
    min-width: 220px;
    padding: 10px 16px;
    font-size: 13px;
    font-weight: 600;
    color: #409EFF;
    background: linear-gradient(90deg, rgba(64, 158, 255, 0.12) 0%, rgba(64, 158, 255, 0.04) 100%);
    border-right: 1px solid #ebeef5;
    box-shadow: 4px 0 8px -6px rgba(0, 0, 0, 0.08);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .gantt-group-track {
    height: 100%;
    min-height: 1px;
  }

  &:first-child {
    border-top: 1px solid #ebeef5;
  }
}

.gantt-row {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  width: 100%;
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
  height: 52px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
  padding: 0 16px;
  background: #fff;
  border-right: 1px solid #ebeef5;
  overflow: hidden;

  .gantt-label-subsystem,
  .gantt-label-text {
    display: block;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .gantt-label-subsystem {
    font-size: 11px;
    line-height: 15px;
    color: #909399;
  }

  .gantt-label-text {
    font-size: 13px;
    line-height: 17px;
    color: #303133;
  }
}

.gantt-track {
  position: relative;
  width: 100%;
  min-width: 0;
  height: 52px;
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

/* 右下角时间轴控制面板 */
.gantt-controls {
  position: absolute;
  right: 18px;
  bottom: 18px;
  z-index: 9;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 44px;
  padding: 6px 12px 6px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(6px);

  :deep(.el-button) {
    margin-left: 0;
    flex-shrink: 0;
  }

  .control-divider {
    width: 1px;
    height: 20px;
    background: #dcdfe6;
  }

  .zoom-label,
  .zoom-value {
    font-size: 12px;
    color: #606266;
    white-space: nowrap;
  }

  .zoom-value {
    min-width: 38px;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  .zoom-slider {
    width: 120px;
    margin: 0;
  }
}
</style>
