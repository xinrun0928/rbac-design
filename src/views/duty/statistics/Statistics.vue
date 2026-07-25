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
        <div class="call-stats-list">
          <div v-for="item in callStatsData" :key="item.label" class="call-stats-item">
            <span class="call-stats-label">{{ item.label }}</span>
            <span class="call-stats-value">{{ item.value }} <small>{{ item.unit }}</small></span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 电话记录 -->
    <div class="stats-row animate-item">
      <el-card class="stats-card call-record-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span class="card-title">电话记录</span>
            <div class="card-meta">
              <span class="meta-unit">单位：次</span>
              <span class="meta-time">2026/01/20 - 2026/01/30</span>
            </div>
          </div>
        </template>
        <div class="call-record-list">
          <div v-for="item in callRecordData" :key="item.label" class="call-record-item">
            <div class="record-icon" :style="{ background: item.color }">
              <el-icon :size="18"><component :is="item.icon" /></el-icon>
            </div>
            <div class="record-info">
              <div class="record-value">{{ item.value }}</div>
              <div class="record-label">{{ item.label }}</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 底部：趋势图表 -->
    <el-card class="chart-card animate-item" shadow="never">
      <template #header>
        <div class="card-header">
          <span class="card-title">电话记录趋势</span>
        </div>
      </template>
      <div ref="chartRef" class="chart-container"></div>
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
  { label: '总时长', value: '217小时', icon: Timer, color: 'linear-gradient(135deg, #52C41A 0%, #73D13D 100%)' },
  { label: '人数/次', value: 2, icon: DataLine, color: 'linear-gradient(135deg, #2F54EB 0%, #597EF7 100%)' }
])

// ── 电话接听统计 ──
const callStatsData = reactive([
  { label: '咨询电话数', value: 8, unit: '次' },
  { label: '领导交办事项数', value: 1, unit: '项' },
  { label: '咨询次数', value: 8, unit: '次' },
  { label: '投诉电话数', value: 4, unit: '次' },
  { label: '视频调看次数', value: 8, unit: '次' }
])

// ── 电话记录分类 ──
const callRecordData = reactive([
  { label: '咨询', value: 8, icon: ChatDotRound, color: '#409EFF' },
  { label: '投诉', value: 4, icon: Bell, color: '#F56C6C' },
  { label: '其他', value: 2, icon: VideoCamera, color: '#67C23A' }
])

// ── 图表 ──
const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

const chartData = {
  dates: ['01-20', '01-21', '01-22', '01-23', '01-24', '01-25', '01-26', '01-27', '01-28', '01-29', '01-30'],
  values: [4, 5, 3, 6, 4, 5, 3, 4, 6, 5, 4]
}

function initChart() {
  if (!chartRef.value) return
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderColor: '#eee',
      textStyle: { color: '#303133' }
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
      data: chartData.dates,
      axisLine: { lineStyle: { color: '#DCDFE6' } },
      axisLabel: { color: '#606266' }
    },
    yAxis: {
      type: 'value',
      name: '会议次数',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { type: 'dashed', color: '#E8ECF1' } },
      axisLabel: { color: '#606266' }
    },
    series: [
      {
        name: '会议次数',
        type: 'line',
        data: chartData.values,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: { color: '#409EFF' },
        lineStyle: { width: 3, color: '#409EFF' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64,158,255,0.3)' },
            { offset: 1, color: 'rgba(64,158,255,0.05)' }
          ])
        }
      }
    ]
  })
}

function handleResize() {
  chartInstance?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
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
    &:nth-child(4) { animation-delay: 0.28s; }
    &:nth-child(5) { animation-delay: 0.35s; }
  }

  // ── 指标卡片网格 ──
  .metric-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
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

    &.brief-card {
      flex: 16;
    }

    &.call-stats-card {
      flex: 8;
    }

    &.call-record-card {
      flex: 1;
    }

    :deep(.el-card__header) {
      padding: 16px 20px;
      border-bottom: 1px solid #F2F3F5;
    }

    :deep(.el-card__body) {
      padding: 20px;
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

  // ── 电话接听统计 ──
  .call-stats-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .call-stats-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: #F8F9FB;
    border-radius: 8px;

    &:hover {
      background: #F0F2F5;
    }
  }

  .call-stats-label {
    font-size: 14px;
    color: #606266;
  }

  .call-stats-value {
    font-size: 20px;
    font-weight: 600;
    color: #303133;

    small {
      font-size: 12px;
      font-weight: 400;
      color: #909399;
      margin-left: 4px;
    }
  }

  // ── 电话记录 ──
  .call-record-list {
    display: flex;
    gap: 24px;
    justify-content: center;
  }

  .call-record-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 20px 24px;
    background: #F8F9FB;
    border-radius: 12px;
    min-width: 100px;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-2px);
    }
  }

  .record-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }

  .record-info {
    text-align: center;

    .record-value {
      font-size: 24px;
      font-weight: 700;
      color: #303133;
    }

    .record-label {
      font-size: 13px;
      color: #909399;
      margin-top: 4px;
    }
  }

  // ── 图表 ──
  .chart-card {
    margin: 0 24px 24px;
    border-radius: 12px;
    border: none;

    :deep(.el-card__header) {
      padding: 16px 20px;
      border-bottom: 1px solid #F2F3F5;
    }

    :deep(.el-card__body) {
      padding: 20px;
    }
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
