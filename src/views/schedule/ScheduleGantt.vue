<template>
  <div class="schedule-gantt" :style="ganttCssVars">
    <div
      ref="ganttScrollRef"
      class="gantt-scroll"
      :class="{ 'is-dragging': isDragging }"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="stopDragging"
      @pointercancel="stopDragging"
      @wheel="handleWheel"
    >
      <div
        ref="ganttInnerRef"
        class="gantt-inner"
        :class="[`unit-${timeUnit}`, { 'is-double-axis': hasDoubleAxis }]"
        :style="{ width: totalGanttWidth + 'px' }"
        role="treegrid"
      >
        <div class="gantt-axis" :class="{ 'is-double': hasDoubleAxis }">
          <div class="axis-corner">子系统 / 模块名称</div>
          <div v-if="hasDoubleAxis" class="axis-month-row">
            <div
              v-for="seg in monthSegments"
              :key="`month-${seg.start}`"
              class="axis-cell axis-month"
              :style="segmentStyle(seg)"
            >
              {{ seg.label }}
            </div>
          </div>
          <div class="axis-unit-row">
            <div
              v-for="(seg, index) in axisSegments"
              :key="`${timeUnit}-${seg.start}`"
              class="axis-cell axis-unit"
              :class="{ 'axis-quarter-divider': isQuarterStart(seg) }"
              :style="segmentStyle(seg)"
            >
              <span v-if="index % labelStep === 0">{{ seg.label }}</span>
            </div>
          </div>
        </div>

        <div class="gantt-today-line" :style="{ left: todayLineLeft + 'px', top: axisHeight + 'px' }">
          <span class="today-dot"></span>
        </div>

        <template v-for="group in groupedRows" :key="group.title">
          <div class="gantt-group" role="row">
            <div class="gantt-group-label" :title="group.title">{{ group.title }}</div>
            <div class="gantt-group-track" :class="trackClasses"></div>
          </div>

          <template v-for="mod in group.modules" :key="mod.key">
            <div
              class="gantt-row"
              :class="{ 'contains-today': containsToday(mod) }"
              role="row"
              tabindex="0"
              @keydown="handleRowKeydown($event, mod)"
            >
              <div class="gantt-label" :title="`${mod.subsystemName} / ${mod.moduleName}`">
                <span class="label-copy">
                  <span class="gantt-label-subsystem">{{ mod.subsystemName }}</span>
                  <span
                    class="gantt-label-text gantt-label-link"
                    role="button"
                    tabindex="0"
                    :title="mod.moduleName"
                    @click.stop="emit('open-drawer', mod)"
                    @keydown.enter.stop.prevent="emit('open-drawer', mod)"
                    @keydown.space.stop.prevent="emit('open-drawer', mod)"
                  >{{ mod.moduleName }}</span>
                </span>
                <span v-if="containsToday(mod)" class="today-marker"></span>
              </div>

              <div class="gantt-track" :class="trackClasses">
                <el-tooltip placement="top" :show-after="200">
                  <template #content>
                    <div class="gantt-tip">
                      <div class="tip-title">{{ mod.moduleName }}</div>
                      <div>{{ mod.systemName }} / {{ mod.subsystemName }}</div>
                      <div>功能项 {{ mod.itemCount }} 个 · 人天 {{ mod.personDays }}</div>
                      <div>团队：{{ mod.teamText }} · {{ mod.startDate }} ~ {{ mod.endDate }}</div>
                      <div>完成率 {{ moduleProgress(mod) }}%</div>
                    </div>
                  </template>
                  <div
                    class="gantt-bar"
                    :class="{ 'is-short': barMetrics(mod).width < 50, 'is-multi-team': mod.teams.length > 1 }"
                    :style="barMetrics(mod).style"
                    @click.stop="emit('open-drawer', mod)"
                  >
                    <div class="bar-segments">
                      <span
                        v-for="segment in barMetrics(mod).segments"
                        :key="segment.team"
                        class="sub-bar"
                        :title="`${segment.team} ${Math.round(segment.ratio * 100)}%`"
                        :style="{ width: `${segment.ratio * 100}%`, background: segment.color }"
                      ></span>
                    </div>
                    <span class="progress-mask" :class="{ 'is-edge': moduleProgress(mod) === 0 }" :style="{ left: `${moduleProgress(mod)}%` }"></span>
                    <span v-if="mod.teams.length === 1" class="single-progress" :style="{ width: `${moduleProgress(mod)}%` }"></span>
                    <span class="bar-text">{{ mod.moduleName }}</span>
                    <el-tooltip
                      v-for="milestone in mod.milestones || []"
                      :key="`${milestone.date}-${milestone.title}`"
                      :content="`${milestone.title} · ${milestone.date}`"
                      placement="top"
                    >
                      <span class="milestone" :style="milestoneStyle(mod, milestone.date)"></span>
                    </el-tooltip>
                  </div>
                </el-tooltip>
              </div>
            </div>
          </template>
        </template>

        <div v-if="groupedRows.length === 0" class="gantt-empty">暂无匹配的排期数据</div>
      </div>
    </div>

    <div class="gantt-controls">
      <el-tooltip content="定位到今天" placement="top"><el-button :icon="Position" circle type="primary" plain @click="scrollToToday" /></el-tooltip>
      <el-tooltip content="适合窗口" placement="top"><el-button :icon="Aim" circle @click="scrollToFit" /></el-tooltip>
      <el-tooltip content="导出 PNG（全屏时效果更佳）" placement="top"><el-button :icon="Download" circle :loading="exporting" @click="exportPng" /></el-tooltip>
      <span class="control-divider"></span>
      <span class="zoom-label">缩放</span>
      <el-slider v-model="zoom" :min="0.5" :max="3" :step="0.1" :marks="zoomMarks" class="zoom-slider" />
      <span class="zoom-value">{{ Math.round(zoom * 100) }}%</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Aim, Download, Position } from '@element-plus/icons-vue'
import type { ScheduleModule } from '@/types/schedule'
import { mockScheduleItems, mockScheduleTeams } from '@/mock/schedule/scheduleData'
import { DAY_MS, moduleTeamSegments, parseDate, today } from './scheduleUtils'

const props = defineProps<{
  modules: ScheduleModule[]
  groupBy: 'system' | 'team'
  systemNames: string[]
  timeUnit: 'day' | 'week' | 'month' | 'year'
}>()
const zoom = defineModel<number>('zoom', { default: 1 })
const emit = defineEmits<{ (e: 'open-drawer', mod: ScheduleModule): void }>()

const LABEL_WIDTH = 220
const UNIT_DAY_WIDTH: Record<typeof props.timeUnit, number> = { day: 40, week: 8, month: 4, year: 1.5 }
const ganttScrollRef = ref<HTMLElement | null>(null)
const ganttInnerRef = ref<HTMLElement | null>(null)
const ganttViewportWidth = ref(0)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragStartScrollLeft = ref(0)
const rememberedScrollLeft = ref(0)
const exporting = ref(false)
let resizeObserver: ResizeObserver | null = null

interface AxisSegment { label: string; start: number; days: number; displayEveryN: number }

const FIXED_RANGE_START = Date.UTC(2025, 0, 1) // 2025-01-01
const FIXED_RANGE_END = Date.UTC(2027, 11, 31) // 2027-12-31

const scheduleRange = computed(() => {
  let start = FIXED_RANGE_START
  let end = FIXED_RANGE_END
  if (props.timeUnit === 'year') {
    start = Date.UTC(2025, 0, 1)
    end = Date.UTC(2027, 11, 31)
  } else if (props.timeUnit === 'week') {
    const startDate = new Date(start)
    const endDate = new Date(end)
    const startDow = startDate.getUTCDay()
    const endDow = endDate.getUTCDay()
    start = Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate() - (startDow === 0 ? 6 : startDow - 1))
    end = Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), endDate.getUTCDate() + (endDow === 0 ? 0 : 7 - endDow))
  } else if (props.timeUnit === 'month') {
    start = Date.UTC(2025, 0, 1)
    end = Date.UTC(2027, 11, 31)
  }
  return { start, end }
})

const rangeStart = computed(() => scheduleRange.value.start)
const rangeEnd = computed(() => scheduleRange.value.end)
const totalDays = computed(() => Math.round((rangeEnd.value - rangeStart.value) / DAY_MS) + 1)
const baseDayWidth = computed(() => UNIT_DAY_WIDTH[props.timeUnit] * zoom.value)
const fitDayWidth = computed(() => Math.max(ganttViewportWidth.value - LABEL_WIDTH, 0) / Math.max(totalDays.value, 1))
const dayWidth = computed(() => Math.max(baseDayWidth.value, fitDayWidth.value))
const totalGanttWidth = computed(() => LABEL_WIDTH + totalDays.value * dayWidth.value)
const hasDoubleAxis = computed(() => props.timeUnit === 'day' || props.timeUnit === 'week')
const axisHeight = computed(() => hasDoubleAxis.value ? 60 : 40)
const todayLineLeft = computed(() => LABEL_WIDTH + ((Date.now() - rangeStart.value) / DAY_MS) * dayWidth.value)
const ganttCssVars = computed(() => ({ '--label-width': `${LABEL_WIDTH}px`, '--day-width': `${dayWidth.value}px` }))
const zoomMarks = { 0.5: '50%', 1.5: '150%', 3: '300%' }
const trackClasses = computed(() => ({ 'has-weekends': props.timeUnit === 'day' }))

function updateViewportWidth() { ganttViewportWidth.value = ganttScrollRef.value?.clientWidth ?? 0 }
onMounted(async () => {
  updateViewportWidth()
  if (typeof ResizeObserver !== 'undefined' && ganttScrollRef.value) {
    resizeObserver = new ResizeObserver(updateViewportWidth)
    resizeObserver.observe(ganttScrollRef.value)
  }
  await nextTick()
  scrollToToday()
})
onBeforeUnmount(() => resizeObserver?.disconnect())

function handlePointerDown(event: PointerEvent) {
  if (event.pointerType === 'touch' || event.button !== 0) return
  const target = event.target as HTMLElement
  if (target.closest('.gantt-controls, .gantt-bar, .gantt-label-link, .label-copy')) return
  const el = ganttScrollRef.value
  if (!el || el.scrollWidth <= el.clientWidth) return
  isDragging.value = true
  dragStartX.value = event.clientX
  dragStartScrollLeft.value = el.scrollLeft
  el.setPointerCapture(event.pointerId)
  event.preventDefault()
}
function handlePointerMove(event: PointerEvent) {
  if (isDragging.value && ganttScrollRef.value) ganttScrollRef.value.scrollLeft = dragStartScrollLeft.value - (event.clientX - dragStartX.value)
}
function stopDragging(event: PointerEvent) {
  if (!isDragging.value) return
  isDragging.value = false
  if (ganttScrollRef.value?.hasPointerCapture(event.pointerId)) ganttScrollRef.value.releasePointerCapture(event.pointerId)
}
function handleWheel(event: WheelEvent) {
  const el = ganttScrollRef.value
  if (!el) return
  if (event.ctrlKey || event.metaKey) {
    zoom.value = Math.min(3, Math.max(0.5, Number((zoom.value - event.deltaY * 0.002).toFixed(1))))
    event.preventDefault()
    return
  }
  if (!event.shiftKey && Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return
  el.scrollLeft += Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
  event.preventDefault()
}

function scrollToToday() {
  const el = ganttScrollRef.value
  if (!el) return
  const maxScroll = el.scrollWidth - el.clientWidth
  el.scrollTo({ left: Math.max(0, Math.min(todayLineLeft.value - el.clientWidth / 2, maxScroll)), behavior: 'smooth' })
}
async function scrollToFit() {
  zoom.value = 1
  await nextTick()
  ganttScrollRef.value?.scrollTo({ left: 0, behavior: 'smooth' })
}
watch(() => props.timeUnit, async () => {
  await nextTick()
  updateViewportWidth()
  await nextTick()
  scrollToToday()
})
watch(() => props.groupBy, async (_value, _oldValue, onCleanup) => {
  const el = ganttScrollRef.value
  rememberedScrollLeft.value = el?.scrollLeft ?? rememberedScrollLeft.value
  let cancelled = false
  onCleanup(() => { cancelled = true })
  await nextTick()
  if (!cancelled && ganttScrollRef.value) ganttScrollRef.value.scrollLeft = rememberedScrollLeft.value
})

function segment(left: number, end: number, label: string, defaultDays: number): AxisSegment {
  const start = Math.max(left, rangeStart.value)
  const clippedEnd = Math.min(end, rangeEnd.value)
  return { label, start, days: Math.max(1, Math.round((clippedEnd - start) / DAY_MS) + 1), displayEveryN: defaultDays }
}
function buildMonths(): AxisSegment[] {
  const result: AxisSegment[] = []
  let cursor = new Date(rangeStart.value)
  cursor = new Date(Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), 1))
  while (cursor.getTime() <= rangeEnd.value) {
    const y = cursor.getUTCFullYear(), m = cursor.getUTCMonth()
    result.push(segment(Date.UTC(y, m, 1), Date.UTC(y, m + 1, 0), `${y}-${String(m + 1).padStart(2, '0')}`, 1))
    cursor = new Date(Date.UTC(y, m + 1, 1))
  }
  return result
}
function buildYears(): AxisSegment[] {
  const result: AxisSegment[] = []
  let year = new Date(rangeStart.value).getUTCFullYear()
  while (Date.UTC(year, 0, 1) <= rangeEnd.value) {
    result.push(segment(Date.UTC(year, 0, 1), Date.UTC(year + 1, 0, 0), `${year}年`, 1))
    year++
  }
  return result
}
function buildWeeks(): AxisSegment[] {
  const result: AxisSegment[] = []
  let cursor = rangeStart.value
  while (cursor <= rangeEnd.value) {
    const d = new Date(cursor)
    result.push(segment(cursor, cursor + 6 * DAY_MS, `周 ${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`, 1))
    cursor += 7 * DAY_MS
  }
  return result
}
function buildDays(): AxisSegment[] {
  const result: AxisSegment[] = []
  let cursor = rangeStart.value
  while (cursor <= rangeEnd.value) {
    const d = new Date(cursor)
    result.push({ label: `${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`, start: cursor, days: 1, displayEveryN: 1 })
    cursor += DAY_MS
  }
  return result
}
const monthSegments = computed(buildMonths)
const labelStep = computed(() => props.timeUnit === 'day'
  ? Math.max(1, Math.ceil(46 / Math.max(dayWidth.value, 1)))
  : props.timeUnit === 'week'
    ? Math.max(1, Math.ceil(72 / Math.max(dayWidth.value * 7, 1)))
    : 1)
const axisSegments = computed(() => props.timeUnit === 'day' ? buildDays() : props.timeUnit === 'week' ? buildWeeks() : props.timeUnit === 'year' ? buildYears() : buildMonths())
function segmentStyle(seg: AxisSegment) { return { left: `${((seg.start - rangeStart.value) / DAY_MS) * dayWidth.value}px`, width: `${seg.days * dayWidth.value}px` } }
function isQuarterStart(seg: AxisSegment) { return props.timeUnit === 'month' && new Date(seg.start).getUTCMonth() % 3 === 0 }

function barMetrics(mod: ScheduleModule) {
  const left = ((parseDate(mod.startDate) - rangeStart.value) / DAY_MS) * dayWidth.value
  const width = Math.max((parseDate(mod.endDate) - parseDate(mod.startDate)) / DAY_MS + 1, 1) * dayWidth.value
  const segments = moduleTeamSegments(mod)
  const dominant = segments.length
    ? segments.reduce((a, b) => (a.ratio >= b.ratio ? a : b))
    : { color: '#409EFF' }
  return {
    style: {
      left: `${left}px`,
      width: `${width}px`,
      '--team-color': dominant.color
    },
    width,
    segments
  }
}
function moduleProgress(mod: ScheduleModule) { return Math.min(100, Math.max(0, mod.progress ?? 0)) }
function milestoneStyle(mod: ScheduleModule, date: string) {
  const duration = Math.max(parseDate(mod.endDate) - parseDate(mod.startDate) + DAY_MS, DAY_MS)
  return { left: `${Math.min(100, Math.max(0, ((parseDate(date) - parseDate(mod.startDate)) / duration) * 100))}%` }
}
function containsToday(mod: ScheduleModule) { return today >= parseDate(mod.startDate) && today <= parseDate(mod.endDate) }
function handleRowKeydown(event: KeyboardEvent, mod: ScheduleModule) {
  if (event.key === 'Enter') { event.preventDefault(); emit('open-drawer', mod); return }
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  event.preventDefault()
  const rows = Array.from(ganttInnerRef.value?.querySelectorAll<HTMLElement>('.gantt-row') ?? [])
  const index = rows.indexOf(event.currentTarget as HTMLElement)
  rows[index + (event.key === 'ArrowDown' ? 1 : -1)]?.focus()
}
async function exportPng() {
  if (!ganttInnerRef.value || exporting.value) return
  exporting.value = true
  try {
    const { toPng } = await import('html-to-image')
    const dataUrl = await toPng(ganttInnerRef.value, { backgroundColor: '#ffffff', pixelRatio: 2, cacheBust: true })
    const link = document.createElement('a')
    const d = new Date()
    link.download = `schedule-gantt-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}.png`
    link.href = dataUrl
    link.click()
  } finally { exporting.value = false }
}

const groupedRows = computed(() => {
  const result: { title: string; modules: ScheduleModule[] }[] = []
  if (props.groupBy === 'system') {
    for (const name of props.systemNames) {
      const modules = props.modules.filter(m => m.systemName === name)
      if (modules.length) result.push({ title: name, modules })
    }
  } else {
    for (const team of mockScheduleTeams) {
      const modules = props.modules.filter(m => m.teams.includes(team.name))
      if (modules.length) result.push({ title: `${team.name}${team.frontend ? `（${team.frontend} / ${team.backend}）` : ''}`, modules })
    }
  }
  return result
})
</script>

<style lang="scss" scoped>
$border: #ebeef5;
$text: #303133;
$muted: #909399;
$primary: #409eff;
@mixin sticky-left($z: 2) {
  position: sticky;
  left: 0;
  width: var(--label-width);
  min-width: var(--label-width);
  z-index: $z;
}

.schedule-gantt { flex: 1; min-height: 0; overflow: hidden; position: relative; }
.gantt-scroll { width: 100%; height: 100%; min-width: 0; overflow: auto; overscroll-behavior: contain; touch-action: pan-x pan-y; scrollbar-gutter: stable; cursor: grab; &.is-dragging { cursor: grabbing; user-select: none; } }
.gantt-inner { position: relative; min-width: 100%; width: max-content; }
.gantt-axis { position: sticky; top: 0; z-index: 5; height: 40px; background: #f5f7fa; border-bottom: 1px solid $border; &.is-double { height: 60px; } }
.axis-corner { @include sticky-left(7); height: 100%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: $text; background: linear-gradient(180deg, #f5f7fa, #eef1f6); border-right: 1px solid #e4e7ed; box-shadow: 4px 0 8px -6px rgba(0, 0, 0, .08); }
.axis-month-row, .axis-unit-row { position: absolute; left: var(--label-width); right: 0; overflow: hidden; }
.axis-month-row { top: 0; height: 28px; background: #f8fafc; border-bottom: 1px solid $border; }
.axis-unit-row { top: 0; height: 40px; }
.is-double .axis-unit-row { top: 28px; height: 32px; }
.axis-cell { position: absolute; top: 0; bottom: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; white-space: nowrap; font-size: 12px; font-weight: 500; color: #5b6473; border-left: 1px solid #e4e7ed; }
.axis-month { background: rgba(64, 158, 255, .035); font-weight: 600; }
.axis-quarter-divider { border-left: 2px solid #b8c2cf; }
.gantt-group, .gantt-row { display: grid; grid-template-columns: var(--label-width) minmax(0, 1fr); width: 100%; min-width: 0; }
.gantt-group { border-block: 1px solid $border; background: linear-gradient(90deg, #ecf5ff, #f5f7fa); }
.gantt-group-label { @include sticky-left(4); padding: 10px 16px; font-size: 13px; font-weight: 600; color: $primary; background: linear-gradient(90deg, rgba(64, 158, 255, .12), rgba(64, 158, 255, .04)); border-right: 1px solid $border; box-shadow: 4px 0 8px -6px rgba(0, 0, 0, .08); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.gantt-row { border-bottom: 1px solid #f2f3f5; outline: none; &:hover, &:focus-visible { background: #f5f7fa; } &:focus-visible { box-shadow: inset 0 0 0 2px rgba(64, 158, 255, .45); } &:hover .gantt-track { background-color: rgba(64, 158, 255, .055); } &.contains-today .gantt-label { border-right: 4px solid #f56c6c; } }
.gantt-label { @include sticky-left(3); height: 52px; display: flex; align-items: center; gap: 8px; padding: 0 10px; background: #fff; border-right: 1px solid $border; overflow: hidden; }
.label-copy { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.gantt-label-subsystem, .gantt-label-text { display: block; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.gantt-label-subsystem { font-size: 11px; line-height: 15px; color: $muted; }
.gantt-label-text { font-size: 13px; line-height: 17px; color: $text; }
.gantt-label-link { cursor: pointer; color: $primary; transition: color .15s; &:hover, &:focus-visible { color: #66b1ff; text-decoration: underline; outline: none; } }
.today-marker { position: absolute; right: 0; width: 12px; height: 4px; border-radius: 4px 0 0 4px; background: #f56c6c; }
.gantt-track { position: relative; width: 100%; min-width: 0; height: 52px; transition: background-color .2s; &.has-weekends { background-image: repeating-linear-gradient(90deg, transparent 0, transparent calc(var(--day-width) * 5), rgba(0, 0, 0, .025) calc(var(--day-width) * 5), rgba(0, 0, 0, .025) calc(var(--day-width) * 7)); } }
.gantt-bar { position: absolute; top: 10px; bottom: 10px; border-radius: 6px; cursor: pointer; color: #fff; display: flex; align-items: center; padding: 0 8px; overflow: visible; box-shadow: 0 2px 6px rgba(0, 0, 0, .12); transition: filter .2s, transform .2s; &:hover { filter: brightness(1.08); transform: translateY(-1px); } &.is-short .bar-text { display: none; } }
.bar-segments { position: absolute; inset: 0; display: flex; overflow: hidden; border-radius: 6px; .sub-bar { height: 100%; } }
.progress-mask { position: absolute; top: 0; right: 0; bottom: 0; border-radius: 0 6px 6px 0; background: var(--team-color, #409EFF); opacity: .55; }
.progress-mask.is-edge { border-radius: 6px; }
.single-progress { position: absolute; left: 0; bottom: 0; height: 4px; z-index: 2; border-radius: 0 0 0 6px; background: rgba(255, 255, 255, .92); }
.bar-text { position: relative; z-index: 3; max-width: 100%; font-size: 12px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 1px 2px rgba(0, 0, 0, .28); }
.milestone { position: absolute; z-index: 4; top: -5px; width: 12px; height: 12px; margin-left: -6px; border: 2px solid #fff; background: #e6a23c; box-shadow: 0 1px 4px rgba(0, 0, 0, .28); transform: rotate(45deg); cursor: help; }
.gantt-empty { padding: 60px 20px; text-align: center; color: $muted; font-size: 14px; }
.gantt-tip { font-size: 12px; line-height: 1.8; .tip-title { font-size: 14px; font-weight: 600; margin-bottom: 2px; } }
.gantt-today-line { position: absolute; bottom: 0; width: 2px; background: #f56c6c; z-index: 4; pointer-events: none; .today-dot { position: absolute; top: -1px; left: -4px; width: 10px; height: 10px; border-radius: 50%; background: #f56c6c; } }
.gantt-controls { position: absolute; right: 18px; bottom: 18px; z-index: 9; display: flex; align-items: center; gap: 10px; height: 52px; padding: 6px 12px 10px 8px; border: 1px solid #dcdfe6; border-radius: 12px; background: rgba(255, 255, 255, .96); box-shadow: 0 4px 14px rgba(0, 0, 0, .1); backdrop-filter: blur(6px); :deep(.el-button) { margin-left: 0; flex-shrink: 0; } .control-divider { width: 1px; height: 20px; background: #dcdfe6; } .zoom-label, .zoom-value { font-size: 12px; color: #606266; white-space: nowrap; } .zoom-value { min-width: 38px; text-align: right; font-variant-numeric: tabular-nums; } .zoom-slider { width: 180px; margin: 0 4px; :deep(.el-slider__marks-text) { margin-top: 10px; font-size: 10px; color: $muted; } } }
</style>
