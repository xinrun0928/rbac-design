<template>
  <div class="statistics-page">
    <!-- 简报 + 电话接听统计 -->
    <div class="stats-row animate-item">
      <!-- 左侧：简报 -->
      <el-card class="stats-card brief-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">简报</span>
            <div class="date-picker-wrap">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
              />
            </div>
          </div>
        </template>
        <div class="metric-grid">
          <div v-for="item in metricCards" :key="item.label" class="metric-card">
            <div class="metric-icon" :style="{ background: item.color }">
              <el-icon :size="20"><component :is="item.icon" /></el-icon>
            </div>
            <div class="metric-info">
              <div class="metric-value">{{ item.value }}</div>
              <div class="metric-label">{{ item.label }}</div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 右侧：电话接听统计 -->
      <el-card class="stats-card call-stats-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">电话接听统计</span>
          </div>
        </template>
        <div ref="pieChartRef" class="pie-chart-container"></div>
      </el-card>
    </div>

    <!-- 电话记录 -->
    <el-card class="chart-card animate-item" shadow="never">
      <template #header>
        <div class="card-header">
          <div class="chart-header-left">
            <span class="card-title">电话记录</span>
            <div class="chart-legend">
              <span
                v-for="item in callLegendData"
                :key="item.name"
                class="legend-item"
                :class="{ inactive: !item.visible }"
                @click="toggleCallLegend(item.name)"
              >
                <i class="legend-dot" :style="{ background: item.color }"></i>
                {{ item.name }}
              </span>
            </div>
          </div>
          <div class="chart-header-right">
            <div class="date-picker-wrap">
              <el-date-picker
                v-model="callDateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                size="small"
              />
            </div>
          </div>
        </div>
      </template>
      <div ref="callChartRef" class="chart-container"></div>
    </el-card>

    <!-- 会议次数 -->
    <el-card class="chart-card animate-item" shadow="never">
      <template #header>
        <div class="card-header">
          <div class="chart-header-left">
            <span class="card-title">会议次数</span>
            <div class="chart-legend">
              <span
                v-for="item in meetingLegendData"
                :key="item.name"
                class="legend-item"
                :class="{ inactive: !item.visible }"
                @click="toggleMeetingLegend(item.name)"
              >
                <i class="legend-dot" :style="{ background: item.color }"></i>
                {{ item.name }}
              </span>
            </div>
          </div>
          <div class="chart-header-right">
            <div class="date-picker-wrap">
              <el-date-picker
                v-model="meetingDateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                size="small"
              />
            </div>
          </div>
        </div>
      </template>
      <div ref="meetingChartRef" class="chart-container"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import {
  Document, Tickets, Timer, Phone, ChatLineRound, DataLine,
  ChatDotRound, Bell, VideoCamera
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'

// ── 状态 ──
const dateRange = ref<string[] | null>(null)
const callDateRange = ref<string[] | null>(null)
const meetingDateRange = ref<string[] | null>(null)

// ── 指标卡片 ──
const metricCards = reactive([
  { label: '值班日志数', value: 256, icon: Document, color: 'linear-gradient(135deg, #409EFF 0%, #66B1FF 100%)' },
  { label: '电话记录数', value: 14, icon: Phone, color: 'linear-gradient(135deg, #909399 0%, #B1B3B8 100%)' },
  { label: '咨询电话数', value: 8, icon: ChatDotRound, color: 'linear-gradient(135deg, #67C23A 0%, #85CE61 100%)' },
  { label: '投诉电话数', value: 4, icon: Bell, color: 'linear-gradient(135deg, #F56C6C 0%, #F89898 100%)' },
  { label: '文件收发数量', value: 5, icon: Tickets, color: 'linear-gradient(135deg, #E6A23C 0%, #EBB563 100%)' },
  { label: '信息报送次数', value: 46, icon: ChatLineRound, color: 'linear-gradient(135deg, #9B59B6 0%, #BB77D0 100%)' },
  { label: '领导交办事项数', value: 1, icon: DataLine, color: 'linear-gradient(135deg, #1ABC9C 0%, #48D1A8 100%)' },
  { label: '视频调看次数', value: 8, icon: VideoCamera, color: 'linear-gradient(135deg, #EB2F96 0%, #F759AB 100%)' },
  { label: '班次', value: 6, icon: Timer, color: 'linear-gradient(135deg, #FA8C16 0%, #FFA940 100%)' },
  { label: '总时长（小时）', value: 217, icon: Timer, color: 'linear-gradient(135deg, #52C41A 0%, #73D13D 100%)' },
  { label: '人数/次', value: 2, icon: DataLine, color: 'linear-gradient(135deg, #2F54EB 0%, #597EF7 100%)' }
])

// ── 饼图 ──
const pieChartRef = ref<HTMLElement>()
let pieChart: echarts.ECharts | null = null

const pieData = [
  { value: 8, name: '咨询电话数' },
  { value: 1, name: '领导交办事项数' },
  { value: 8, name: '咨询次数' },
  { value: 4, name: '投诉电话数' },
  { value: 8, name: '视频调看次数' }
]

function initPieChart() {
  if (!pieChartRef.value) return
  pieChart = echarts.init(pieChartRef.value)
  pieChart.setOption({
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#eee',
      textStyle: { color: '#303133' },
      formatter: '{b}: {c}'
    },
    legend: {
      orient: 'horizontal',
      bottom: '2%',
      left: 'center',
      textStyle: { color: '#606266', fontSize: 12 }
    },
    series: [
      {
        name: '电话接听统计',
        type: 'pie',
        radius: ['20%', '65%'],
        center: ['50%', '45%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        label: {
          fontSize: 11,
          formatter: '{b}\n{c}'
        },
        labelLine: {
          length: 10,
          length2: 8
        },
        data: pieData,
        color: ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#9B59B6']
      }
    ]
  })
}

// ── 电话记录图表 ──
const callChartRef = ref<HTMLElement>()
let callChart: echarts.ECharts | null = null

const callLegendData = reactive([
  { name: '咨询', color: '#409EFF', visible: true },
  { name: '投诉', color: '#F56C6C', visible: true },
  { name: '其他', color: '#67C23A', visible: true }
])

function toggleCallLegend(name: string) {
  const item = callLegendData.find(l => l.name === name)
  if (!item) return
  item.visible = !item.visible
  if (callChart) {
    callChart.dispatchAction({
      type: 'legendToggleSelect',
      name
    })
  }
}

const dates = ['01-20', '01-21', '01-22', '01-23', '01-24', '01-25', '01-26', '01-27', '01-28', '01-29', '01-30']

function initCallChart() {
  if (!callChartRef.value) return
  callChart = echarts.init(callChartRef.value)
  callChart.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#eee',
      textStyle: { color: '#303133' }
    },
    legend: {
      show: false,
      selected: { '咨询': true, '投诉': true, '其他': true }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: { lineStyle: { color: '#DCDFE6' } },
      axisLabel: { color: '#606266' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { type: 'dashed', color: '#E8ECF1' } },
      axisLabel: { color: '#606266' }
    },
    series: [
      {
        name: '咨询',
        type: 'line',
        stack: '总量',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: [3, 4, 2, 5, 3, 4, 2, 3, 5, 4, 3],
        itemStyle: { color: '#409EFF' },
        lineStyle: { width: 2 },
        areaStyle: { color: 'rgba(64,158,255,0.1)' }
      },
      {
        name: '投诉',
        type: 'line',
        stack: '总量',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: [1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 2],
        itemStyle: { color: '#F56C6C' },
        lineStyle: { width: 2 },
        areaStyle: { color: 'rgba(245,108,108,0.1)' }
      },
      {
        name: '其他',
        type: 'line',
        stack: '总量',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: [0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
        itemStyle: { color: '#67C23A' },
        lineStyle: { width: 2 },
        areaStyle: { color: 'rgba(103,194,58,0.1)' }
      }
    ]
  })
}

// ── 会议次数图表 ──
const meetingChartRef = ref<HTMLElement>()
let meetingChart: echarts.ECharts | null = null

const meetingLegendData = reactive([
  { name: '会议次数', color: '#E6A23C', visible: true }
])

function toggleMeetingLegend(name: string) {
  const item = meetingLegendData.find(l => l.name === name)
  if (!item) return
  item.visible = !item.visible
  if (meetingChart) {
    meetingChart.dispatchAction({
      type: 'legendToggleSelect',
      name
    })
  }
}

function initMeetingChart() {
  if (!meetingChartRef.value) return
  meetingChart = echarts.init(meetingChartRef.value)
  meetingChart.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#eee',
      textStyle: { color: '#303133' }
    },
    legend: {
      show: false,
      selected: { '会议次数': true }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
      axisLine: { lineStyle: { color: '#DCDFE6' } },
      axisLabel: { color: '#606266' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { type: 'dashed', color: '#E8ECF1' } },
      axisLabel: { color: '#606266' }
    },
    series: [
      {
        name: '会议次数',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: [4, 5, 3, 6, 4, 5, 3, 4, 6, 5, 4],
        itemStyle: { color: '#E6A23C' },
        lineStyle: { width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(230,162,60,0.3)' },
            { offset: 1, color: 'rgba(230,162,60,0.05)' }
          ])
        }
      }
    ]
  })
}

function handleResize() {
  pieChart?.resize()
  callChart?.resize()
  meetingChart?.resize()
}

onMounted(() => {
  initPieChart()
  initCallChart()
  initMeetingChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  pieChart?.dispose()
  callChart?.dispose()
  meetingChart?.dispose()
})
</script>

<style lang="scss" scoped>
.statistics-page {
  padding: 0;
  background: linear-gradient(160deg, #F5F7FA 0%, #E8ECF1 100%);
  min-height: 100%;
  display: flex;
  flex-direction: column;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;

  .animate-item {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;
    &:nth-child(1) { animation-delay: 0.05s; }
    &:nth-child(2) { animation-delay: 0.12s; }
    &:nth-child(3) { animation-delay: 0.2s; }
  }

  // ── 指标卡片网格 ──
  .metric-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 12px;
    height: 100%;
  }

  .metric-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    background: #F8F9FB;
    border-radius: 8px;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-2px);
      background: #F0F2F5;
    }
  }

  .metric-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;
  }

  .metric-info {
    flex: 1;
    min-width: 0;

    .metric-value {
      font-size: 20px;
      font-weight: 700;
      color: #303133;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .metric-label {
      font-size: 11px;
      color: #909399;
      margin-top: 4px;
    }
  }

  // ── 统计行 ──
  .stats-row {
    display: flex;
    align-items: stretch;
    gap: 16px;
    padding: 0;
    margin-bottom: 16px;
  }

  .stats-card {
    border-radius: 12px;
    border: none;
    display: flex;
    flex-direction: column;

    &.brief-card {
      flex: 16;
    }

    &.call-stats-card {
      flex: 8;
    }

    :deep(.el-card__header) {
      padding: 16px 20px;
      border-bottom: 1px solid #F2F3F5;
      flex-shrink: 0;
    }

    :deep(.el-card__body) {
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-title {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
  }

  .date-picker-wrap {
    :deep(.el-date-editor) {
      width: 220px;
    }
  }

  .card-meta {
    display: flex;
    gap: 16px;
    font-size: 12px;
    color: #909399;
  }

  // ── 饼图 ──
  .pie-chart-container {
    width: 100%;
    flex: 1;
    min-height: 300px;
  }

  // ── 图表 ──
  .chart-card {
    border-radius: 12px;
    border: none;
    margin-bottom: 16px;

    :deep(.el-card__header) {
      padding: 16px 20px;
      border-bottom: 1px solid #F2F3F5;
    }

    :deep(.el-card__body) {
      padding: 20px;
    }
  }

  .chart-header-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .chart-header-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .chart-legend {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #606266;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.8;
    }

    &.inactive {
      opacity: 0.4;
    }
  }

  .legend-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
  }

  .chart-container {
    width: 100%;
    height: 300px;
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
