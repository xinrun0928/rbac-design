<template>
  <div class="event-screen-page">
    <!-- 顶部栏 -->
    <div class="top-bar">
      <div class="back-btn" @click="goBack">
        <el-icon :size="18"><ArrowLeft /></el-icon>
        <span>返回</span>
      </div>
      <div class="page-title">应急事件监控大屏</div>
      <div class="top-right">
        <div class="live-tag">
          <span class="live-dot"></span>
          实时监控中
        </div>
        <div class="top-time">
          <div class="time-value">{{ currentTime }}</div>
          <div class="date-value">{{ currentDate }}</div>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左侧面板 -->
      <aside class="left-panel">
        <!-- 今日事件概览 -->
        <div class="panel overview-panel">
          <div class="panel-header">
            <h3>今日事件概览</h3>
            <span class="refresh-tag">● 自动刷新</span>
          </div>
          <div class="overview-grid">
            <div class="overview-item">
              <div class="item-icon total"><el-icon :size="20"><DataLine /></el-icon></div>
              <div class="item-info">
                <div class="item-value">{{ eventStats.total }}<small>起</small></div>
                <div class="item-label">事件总数</div>
              </div>
            </div>
            <div class="overview-item">
              <div class="item-icon active"><el-icon :size="20"><Warning /></el-icon></div>
              <div class="item-info">
                <div class="item-value">{{ eventStats.active }}<small>起</small></div>
                <div class="item-label">处理中</div>
              </div>
            </div>
            <div class="overview-item">
              <div class="item-icon deaths"><el-icon :size="20"><CircleClose /></el-icon></div>
              <div class="item-info">
                <div class="item-value">{{ eventStats.deaths }}<small>人</small></div>
                <div class="item-label">死亡人数</div>
              </div>
            </div>
            <div class="overview-item">
              <div class="item-icon injuries"><el-icon :size="20"><WarningFilled /></el-icon></div>
              <div class="item-info">
                <div class="item-value">{{ eventStats.injuries }}<small>人</small></div>
                <div class="item-label">受伤人数</div>
              </div>
            </div>
            <div class="overview-item">
              <div class="item-icon special"><el-icon :size="20"><Van /></el-icon></div>
              <div class="item-info">
                <div class="item-value">{{ eventStats.specialVehicles }}<small>辆</small></div>
                <div class="item-label">两客一危一重</div>
              </div>
            </div>
            <div class="overview-item">
              <div class="item-icon interrupt"><el-icon :size="20"><VideoPause /></el-icon></div>
              <div class="item-info">
                <div class="item-value">{{ eventStats.interrupt }}<small>段</small></div>
                <div class="item-label">道路中断</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 事件类型分布 -->
        <div class="panel">
          <div class="panel-header">
            <h3>事件类型分布</h3>
          </div>
          <div class="chart-container">
            <div ref="eventTypeChartRef" class="chart-dom"></div>
          </div>
        </div>

        <!-- 事件等级分布 -->
        <div class="panel">
          <div class="panel-header">
            <h3>事件等级分布</h3>
          </div>
          <div class="chart-container">
            <div ref="eventLevelChartRef" class="chart-dom"></div>
          </div>
        </div>
      </aside>

      <!-- 中间区域 - 地图 -->
      <main class="center-panel">
        <div class="panel map-panel">
          <div class="panel-header">
            <h3>事件分布地图</h3>
            <div class="map-legend">
              <span class="legend-item"><span class="legend-color" style="background:#E74C3C"></span>重大</span>
              <span class="legend-item"><span class="legend-color" style="background:#F39C12"></span>较大</span>
              <span class="legend-item"><span class="legend-color" style="background:#F1C40F"></span>一般</span>
              <span class="legend-item"><span class="legend-color" style="background:#2ECC71"></span>轻微</span>
            </div>
          </div>
          <div class="map-container">
            <div ref="mapChartRef" class="map-chart"></div>
          </div>
        </div>

        <!-- 近七天事件趋势 -->
        <div class="panel trend-panel">
          <div class="panel-header">
            <h3>近七天事件趋势</h3>
          </div>
          <div class="chart-container">
            <div ref="trendChartRef" class="chart-dom"></div>
          </div>
        </div>
      </main>

      <!-- 右侧面板 -->
      <aside class="right-panel">
        <!-- 实时事件列表 -->
        <div class="panel events-panel">
          <div class="panel-header">
            <h3>实时事件列表</h3>
            <span class="count-tag">{{ realtimeEvents.length }}条</span>
          </div>
          <div class="scroll-table-wrapper">
            <div class="scroll-table-header">
              <span class="col type-col">类型</span>
              <span class="col name-col">事件名称</span>
              <span class="col status-col">状态</span>
              <span class="col time-col">时间</span>
            </div>
            <div class="scroll-table-body" ref="eventScrollRef"
              @mouseenter="onEventMouseEnter"
              @mouseleave="onEventMouseLeave"
              @wheel.prevent="onEventWheel">
              <div class="scroll-table-content" :style="{ transform: `translateY(${eventScrollOffset}px)` }">
                <div v-for="(item, index) in [...realtimeEvents, ...realtimeEvents]" :key="`${item.id}-${index}`"
                  class="scroll-table-row" :class="{ 'has-alarm': item.hasAlarm }">
                  <span class="col type-col">
                    <span :class="['type-badge', item.typeClass]">{{ item.type }}</span>
                  </span>
                  <span class="col name-col" :title="item.name">{{ item.name }}</span>
                  <span class="col status-col">
                    <span :class="['status-badge', item.statusClass]">{{ item.status }}</span>
                  </span>
                  <span class="col time-col">{{ item.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 重点关注事件 -->
        <div class="panel focus-panel">
          <div class="panel-header">
            <h3>重点关注事件</h3>
          </div>
          <div class="focus-list">
            <div v-for="event in focusEvents" :key="event.id" class="focus-item">
              <div class="focus-header">
                <span class="focus-road">{{ event.roadName }}</span>
                <el-tag size="small" :type="event.statusTag === '终' ? 'success' : 'warning'">
                  {{ event.statusTag }}
                </el-tag>
              </div>
              <div class="focus-stats">
                <span>死亡 <b class="death-count">{{ event.deaths }}</b></span>
                <span>受伤 {{ event.injuries }}</span>
                <span class="interrupt-status">{{ event.interruptStatus }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 告警统计 -->
        <div class="panel alarm-panel">
          <div class="panel-header">
            <h3>告警统计</h3>
          </div>
          <div class="alarm-stats">
            <div class="alarm-item">
              <div class="alarm-ring">
                <svg viewBox="0 0 36 36">
                  <path class="alarm-ring-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="3"></path>
                  <path class="alarm-ring-fill"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="#E74C3C" stroke-width="3"
                    :stroke-dasharray="`${alarmStats.active * 10}, 100`"></path>
                </svg>
                <span class="alarm-value">{{ alarmStats.active }}</span>
              </div>
              <span class="alarm-label">待处理告警</span>
            </div>
            <div class="alarm-item">
              <div class="alarm-ring">
                <svg viewBox="0 0 36 36">
                  <path class="alarm-ring-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="3"></path>
                  <path class="alarm-ring-fill"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="#F39C12" stroke-width="3"
                    :stroke-dasharray="`${alarmStats.processing * 10}, 100`"></path>
                </svg>
                <span class="alarm-value">{{ alarmStats.processing }}</span>
              </div>
              <span class="alarm-label">处理中</span>
            </div>
            <div class="alarm-item">
              <div class="alarm-ring">
                <svg viewBox="0 0 36 36">
                  <path class="alarm-ring-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="3"></path>
                  <path class="alarm-ring-fill"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="#2ECC71" stroke-width="3"
                    :stroke-dasharray="`${alarmStats.resolved * 10}, 100`"></path>
                </svg>
                <span class="alarm-value">{{ alarmStats.resolved }}</span>
              </div>
              <span class="alarm-label">已处理</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { ArrowLeft, DataLine, Warning, Van, CircleClose, VideoPause, WarningFilled } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { mockFocusEvents } from '@/mock/event/receiveData'

const currentTime = ref('')
const currentDate = ref('')

// 事件统计数据
const eventStats = ref({
  total: 156,
  active: 23,
  deaths: 5,
  injuries: 18,
  specialVehicles: 12,
  interrupt: 8
})

// 告警统计
const alarmStats = ref({
  active: 15,
  processing: 8,
  resolved: 133
})

// 重点关注事件
const focusEvents = ref(mockFocusEvents.slice(0, 4))

// 实时事件数据
const realtimeEvents = ref([
  { id: 1, type: '事故', typeClass: 'accident', name: 'G4高速多车追尾事故', status: '处理中', statusClass: 'processing', time: '19:35', hasAlarm: true },
  { id: 2, type: '火灾', typeClass: 'fire', name: '南山隧道车辆起火', status: '已处理', statusClass: 'resolved', time: '19:10', hasAlarm: true },
  { id: 3, type: '滑坡', typeClass: 'disaster', name: '清远山区滑坡', status: '处理中', statusClass: 'processing', time: '18:10', hasAlarm: false },
  { id: 4, type: '拥堵', typeClass: 'congestion', name: '佛山桥梁拥堵事件', status: '处理中', statusClass: 'processing', time: '16:05', hasAlarm: true },
  { id: 5, type: '事故', typeClass: 'accident', name: '中山服务区人员聚集', status: '已处理', statusClass: 'resolved', time: '18:30', hasAlarm: false },
  { id: 6, type: '滞留', typeClass: '滞留', name: '港口道路货车滞留', status: '处理中', statusClass: 'processing', time: '19:40', hasAlarm: true },
  { id: 7, type: '封路', typeClass: '封路', name: '台风导致沿海封路', status: '已处理', statusClass: 'resolved', time: '16:15', hasAlarm: false },
  { id: 8, type: '事故', typeClass: 'accident', name: '广州高速大雾封闭', status: '已处理', statusClass: 'resolved', time: '15:25', hasAlarm: true },
  { id: 9, type: '泄漏', typeClass: '泄漏', name: '惠州危化品泄漏', status: '已处理', statusClass: 'resolved', time: '16:50', hasAlarm: false },
  { id: 10, type: '拥堵', typeClass: 'congestion', name: '高速长时间拥堵', status: '已处理', statusClass: 'resolved', time: '17:35', hasAlarm: false }
])

// 图表引用
const eventTypeChartRef = ref<HTMLElement>()
const eventLevelChartRef = ref<HTMLElement>()
const mapChartRef = ref<HTMLElement>()
const trendChartRef = ref<HTMLElement>()

let eventTypeChart: echarts.ECharts | null = null
let eventLevelChart: echarts.ECharts | null = null
let mapChart: echarts.ECharts | null = null
let trendChart: echarts.ECharts | null = null

// 滚动相关
const eventScrollRef = ref<HTMLElement>()
const eventScrollOffset = ref(0)
const rowHeight = 40
let eventScrollTimer: ReturnType<typeof setInterval> | null = null
let isEventScrollPaused = false

const startEventScroll = () => {
  if (eventScrollTimer) return
  eventScrollTimer = setInterval(() => {
    if (isEventScrollPaused) return
    const totalRows = realtimeEvents.value.length
    const maxOffset = -(totalRows * rowHeight)
    eventScrollOffset.value -= 1
    if (eventScrollOffset.value <= maxOffset) {
      eventScrollOffset.value = 0
    }
  }, 50)
}

const stopEventScroll = () => {
  if (eventScrollTimer) {
    clearInterval(eventScrollTimer)
    eventScrollTimer = null
  }
}

const onEventMouseEnter = () => { isEventScrollPaused = true }
const onEventMouseLeave = () => { isEventScrollPaused = false }

const onEventWheel = (e: WheelEvent) => {
  const totalRows = realtimeEvents.value.length
  const maxOffset = 0
  const minOffset = -(totalRows * rowHeight)
  eventScrollOffset.value = Math.max(minOffset, Math.min(maxOffset, eventScrollOffset.value - e.deltaY))
}

const goBack = () => window.close()

// 时间更新
let timer: ReturnType<typeof setInterval>
const updateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  currentDate.value = `${year}年${month}月${day}日 ${weekDays[now.getDay()]}`
  currentTime.value = `${hours}:${minutes}:${seconds}`
}

// 初始化事件类型分布图表
const initEventTypeChart = () => {
  if (!eventTypeChartRef.value) return
  const { width, height } = eventTypeChartRef.value.getBoundingClientRect()
  if (width === 0 || height === 0) return
  eventTypeChart = echarts.init(eventTypeChartRef.value)
  const option = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}起 ({d}%)' },
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: '42%',
        style: {
          text: '156',
          textAlign: 'center',
          fill: '#FFFFFF',
          fontSize: 22,
          fontWeight: 'bold',
          fontFamily: 'DIN Pro, monospace'
        }
      },
      {
        type: 'text',
        left: 'center',
        top: '58%',
        style: {
          text: '总数',
          textAlign: 'center',
          fill: '#8892A8',
          fontSize: 11
        }
      }
    ],
    series: [{
      type: 'pie',
      radius: ['45%', '72%'],
      center: ['50%', '50%'],
      label: { show: false },
      labelLine: { show: false },
      data: [
        { value: 68, name: '交通事故', itemStyle: { color: '#E74C3C' } },
        { value: 35, name: '道路施工', itemStyle: { color: '#F39C12' } },
        { value: 28, name: '突发事件', itemStyle: { color: '#00D4FF' } },
        { value: 18, name: '交通管制', itemStyle: { color: '#9B59B6' } },
        { value: 7, name: '其他', itemStyle: { color: '#2ECC71' } }
      ]
    }]
  }
  eventTypeChart.setOption(option)
}

// 初始化事件等级分布图表
const initEventLevelChart = () => {
  if (!eventLevelChartRef.value) return
  const { width, height } = eventLevelChartRef.value.getBoundingClientRect()
  if (width === 0 || height === 0) return
  eventLevelChart = echarts.init(eventLevelChartRef.value)
  const option = {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['重大', '较大', '一般', '轻微'],
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: '#8892A8', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: '#8892A8', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
    },
    series: [{
      type: 'bar',
      barWidth: '50%',
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: (params: any) => {
          const colors = ['#E74C3C', '#F39C12', '#F1C40F', '#2ECC71']
          return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: colors[params.dataIndex] },
            { offset: 1, color: colors[params.dataIndex] + '33' }
          ])
        }
      },
      data: [12, 28, 68, 48]
    }]
  }
  eventLevelChart.setOption(option)
}

// 初始化地图图表
const initMapChart = () => {
  if (!mapChartRef.value) return
  const { width, height } = mapChartRef.value.getBoundingClientRect()
  if (width === 0 || height === 0) return
  mapChart = echarts.init(mapChartRef.value)

  // 模拟道路数据
  const roads = [
    { coords: [[10, 50], [90, 50]], name: 'G4 京港澳高速' },
    { coords: [[20, 30], [80, 30]], name: 'S81 环城高速' },
    { coords: [[30, 70], [70, 70]], name: 'G15 沈海高速' },
    { coords: [[50, 10], [50, 90]], name: '华南快速' },
    { coords: [[15, 20], [85, 80]], name: '广园快速路' },
    { coords: [[25, 45], [75, 45]], name: '中山大道' },
    { coords: [[35, 25], [65, 75]], name: '黄埔大道' },
    { coords: [[20, 60], [80, 40]], name: '天河路' }
  ]

  // 模拟事件数据点
  const eventPoints = [
    { value: [45, 48], symbolSize: 18, itemStyle: { color: '#E74C3C' }, name: 'G4高速多车追尾' },
    { value: [52, 52], symbolSize: 15, itemStyle: { color: '#E74C3C' }, name: '南山隧道车辆起火' },
    { value: [35, 42], symbolSize: 12, itemStyle: { color: '#F39C12' }, name: '清远山区滑坡' },
    { value: [62, 38], symbolSize: 10, itemStyle: { color: '#F39C12' }, name: '佛山桥梁拥堵' },
    { value: [40, 55], symbolSize: 8, itemStyle: { color: '#F1C40F' }, name: '中山服务区人员聚集' },
    { value: [55, 60], symbolSize: 8, itemStyle: { color: '#F1C40F' }, name: '港口道路货车滞留' },
    { value: [28, 35], symbolSize: 6, itemStyle: { color: '#2ECC71' }, name: '台风导致沿海封路' },
    { value: [72, 45], symbolSize: 6, itemStyle: { color: '#2ECC71' }, name: '广州高速大雾封闭' }
  ]

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        if (params.seriesType === 'scatter') {
          return `${params.name || '事件'}`
        }
        return params.name || ''
      }
    },
    xAxis: {
      type: 'value',
      min: 0,
      max: 100,
      show: false
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      show: false
    },
    grid: {
      left: '5%',
      right: '5%',
      top: '5%',
      bottom: '5%'
    },
    series: [
      // 道路线条
      ...roads.map((road, index) => ({
        type: 'lines' as const,
        coordinateSystem: 'cartesian2d',
        polyline: true,
        data: [{ coords: road.coords }],
        lineStyle: {
          color: '#00D4FF',
          width: 1.5,
          opacity: 0.4,
          curveness: 0.2
        },
        effect: {
          show: true,
          period: 4 + index * 0.5,
          trailLength: 0.3,
          symbol: 'arrow',
          symbolSize: 5,
          color: '#00D4FF'
        },
        zlevel: 1
      })),
      // 事件点
      {
        type: 'scatter',
        coordinateSystem: 'cartesian2d',
        data: eventPoints,
        zlevel: 2
      }
    ],
    animation: true,
    animationDuration: 2000,
    animationEasing: 'cubicOut' as const
  }
  mapChart.setOption(option)
}

// 初始化趋势图表
const initTrendChart = () => {
  if (!trendChartRef.value) return
  const { width, height } = trendChartRef.value.getBoundingClientRect()
  if (width === 0 || height === 0) return
  trendChart = echarts.init(trendChartRef.value)
  const option = {
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['事故', '施工', '其他'],
      textStyle: { color: '#8892A8', fontSize: 10 },
      top: 5,
      right: 10
    },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '25%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['7/28', '7/29', '7/30', '7/31', '8/1', '8/2', '8/3'],
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisLabel: { color: '#8892A8', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: '#8892A8', fontSize: 10 },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } }
    },
    series: [
      {
        name: '事故',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#E74C3C', width: 2 },
        itemStyle: { color: '#E74C3C' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(231,76,60,0.3)' },
            { offset: 1, color: 'rgba(231,76,60,0.05)' }
          ])
        },
        data: [18, 15, 22, 19, 25, 21, 23]
      },
      {
        name: '施工',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#F39C12', width: 2 },
        itemStyle: { color: '#F39C12' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(243,156,18,0.3)' },
            { offset: 1, color: 'rgba(243,156,18,0.05)' }
          ])
        },
        data: [8, 10, 7, 12, 9, 11, 8]
      },
      {
        name: '其他',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { color: '#00D4FF', width: 2 },
        itemStyle: { color: '#00D4FF' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0,212,255,0.3)' },
            { offset: 1, color: 'rgba(0,212,255,0.05)' }
          ])
        },
        data: [5, 6, 4, 8, 5, 7, 6]
      }
    ]
  }
  trendChart.setOption(option)
}

const handleResize = () => {
  eventTypeChart?.resize()
  eventLevelChart?.resize()
  mapChart?.resize()
  trendChart?.resize()
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  nextTick(() => {
    setTimeout(() => {
      initEventTypeChart()
      initEventLevelChart()
      initMapChart()
      initTrendChart()
    }, 100)
    startEventScroll()
  })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  stopEventScroll()
  window.removeEventListener('resize', handleResize)
  eventTypeChart?.dispose()
  eventLevelChart?.dispose()
  mapChart?.dispose()
  trendChart?.dispose()
})
</script>

<style lang="scss" scoped>
.event-screen-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #0B0E1A;
  color: #fff;
  z-index: 9999;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 5px;
}

// 顶部栏
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  height: 44px;
  background: rgba(0, 40, 80, 0.5);
  border-radius: 6px;
  border: 1px solid rgba(0, 212, 255, 0.2);
  flex-shrink: 0;

  .back-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.3s;

    &:hover {
      background: rgba(0, 212, 255, 0.3);
    }
  }

  .page-title {
    font-size: 18px;
    font-weight: 600;
    background: linear-gradient(180deg, #FFFFFF 0%, #00D4FF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .top-right {
    display: flex;
    align-items: center;
    gap: 20px;

    .live-tag {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #2ECC71;

      .live-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #2ECC71;
        animation: blink 1.5s infinite;
      }
    }

    .top-time {
      text-align: right;

      .time-value {
        font-size: 18px;
        font-weight: 600;
        color: #00D4FF;
        font-family: 'DIN Pro', monospace;
      }

      .date-value {
        font-size: 10px;
        color: #8892A8;
      }
    }
  }
}

// 主内容区
.main-content {
  flex: 1;
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  gap: 5px;
  min-height: 0;
  overflow: hidden;
}

// 面板通用
.panel {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  overflow: hidden;

  .panel-header {
    padding: 8px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;

    h3 {
      margin: 0;
      font-size: 12px;
      font-weight: 600;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 5px;

      &::before {
        content: '';
        width: 3px;
        height: 10px;
        background: #00D4FF;
        border-radius: 2px;
      }
    }

    .refresh-tag {
      font-size: 10px;
      color: #2ECC71;
    }

    .count-tag {
      font-size: 10px;
      color: #8892A8;
      padding: 2px 6px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 3px;
    }
  }
}

// 左侧面板
.left-panel {
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow: hidden;

  .panel {
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;

    &:nth-child(1) { flex: 35; }
    &:nth-child(2) { flex: 30; }
    &:nth-child(3) { flex: 35; }
  }
}

// 今日事件概览
.overview-panel {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.08) 0%, rgba(0, 100, 200, 0.08) 100%);
  border-color: rgba(0, 212, 255, 0.25);
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 5px;
  padding: 6px;
  flex: 1;
  min-height: 0;
}

.overview-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  transition: all 0.3s;
  min-height: 0;

  &:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  .item-icon {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &.total { background: rgba(0, 212, 255, 0.15); color: #00D4FF; }
    &.active { background: rgba(243, 156, 18, 0.15); color: #F39C12; }
    &.deaths { background: rgba(231, 76, 60, 0.15); color: #E74C3C; }
    &.injuries { background: rgba(245, 108, 108, 0.15); color: #F56C6C; }
    &.special { background: rgba(155, 89, 182, 0.15); color: #9B59B6; }
    &.interrupt { background: rgba(46, 204, 113, 0.15); color: #2ECC71; }
  }

  .item-info {
    min-width: 0;

    .item-value {
      font-size: 20px;
      font-weight: 700;
      color: #FFFFFF;
      font-family: 'DIN Pro', monospace;
      line-height: 1.2;

      small {
        font-size: 11px;
        font-weight: 400;
        color: #8892A8;
        margin-left: 2px;
      }
    }

    .item-label {
      font-size: 11px;
      color: #8892A8;
      margin-top: 2px;
    }
  }
}

// 图表容器
.chart-container {
  flex: 1;
  padding: 8px;
  min-height: 0;

  .chart-dom {
    width: 100%;
    height: 100%;
    min-height: 120px;
  }
}

// 中间面板
.center-panel {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
  overflow: hidden;

  .map-panel {
    flex: 4;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;

    .map-legend {
      display: flex;
      gap: 8px;

      .legend-item {
        display: flex;
        align-items: center;
        gap: 3px;
        font-size: 10px;
        color: #8892A8;

        .legend-color {
          width: 7px;
          height: 7px;
          border-radius: 2px;
        }
      }
    }

    .map-container {
      flex: 1;
      padding: 8px;
      position: relative;
      min-height: 0;
    }

    .map-chart {
      width: 100%;
      height: 100%;
      min-height: 200px;
      border-radius: 6px;
    }
  }

  .trend-panel {
    flex: 3;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }
}

// 右侧面板
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow: hidden;

  .panel {
    flex: 20;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;

    &:nth-child(2) { flex: 25; }
    &:nth-child(3) { flex: 20; }
  }
}

// 滚动表格
.scroll-table-wrapper {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.scroll-table-header {
  display: flex;
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;

  .col {
    font-size: 10px;
    color: #8892A8;
    font-weight: 500;
  }
}

.scroll-table-body {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.scroll-table-content {
  transition: transform 0.1s linear;
}

.scroll-table-row {
  display: flex;
  padding: 8px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  transition: background 0.2s;

  &:hover {
    background: rgba(0, 212, 255, 0.08);
  }

  &.has-alarm {
    background: rgba(231, 76, 60, 0.08);
  }

  .col {
    font-size: 11px;
    color: #FFFFFF;
    display: flex;
    align-items: center;
  }

  .type-col {
    width: 50px;
    flex-shrink: 0;
  }

  .name-col {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .status-col {
    width: 60px;
    flex-shrink: 0;
    justify-content: center;
  }

  .time-col {
    width: 45px;
    flex-shrink: 0;
    justify-content: flex-end;
    color: #8892A8;
  }
}

.type-badge {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;

  &.accident { background: rgba(231, 76, 60, 0.2); color: #E74C3C; }
  &.fire { background: rgba(243, 156, 18, 0.2); color: #F39C12; }
  &.disaster { background: rgba(155, 89, 182, 0.2); color: #9B59B6; }
  &.congestion { background: rgba(0, 212, 255, 0.2); color: #00D4FF; }
  &.滞留 { background: rgba(46, 204, 113, 0.2); color: #2ECC71; }
  &.封路 { background: rgba(245, 108, 108, 0.2); color: #F56C6C; }
  &.泄漏 { background: rgba(230, 162, 60, 0.2); color: #E6A23C; }
}

.status-badge {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;

  &.processing { background: rgba(243, 156, 18, 0.2); color: #F39C12; }
  &.resolved { background: rgba(46, 204, 113, 0.2); color: #2ECC71; }
}

// 重点关注事件
.focus-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.focus-item {
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  margin-bottom: 8px;
  border-left: 3px solid #E74C3C;

  &:last-child {
    margin-bottom: 0;
  }

  .focus-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .focus-road {
      font-size: 12px;
      font-weight: 500;
      color: #FFFFFF;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .focus-stats {
    display: flex;
    gap: 12px;
    font-size: 11px;
    color: #8892A8;

    b {
      color: #E74C3C;
    }

    .interrupt-status {
      color: #F39C12;
    }
  }
}

// 告警统计
.alarm-stats {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 15px;
}

.alarm-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  .alarm-ring {
    width: 70px;
    height: 70px;
    position: relative;

    svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .alarm-value {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 18px;
      font-weight: 700;
      color: #FFFFFF;
      font-family: 'DIN Pro', monospace;
    }
  }

  .alarm-label {
    font-size: 11px;
    color: #8892A8;
  }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
</style>