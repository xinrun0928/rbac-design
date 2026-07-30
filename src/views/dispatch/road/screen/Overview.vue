<template>
  <div class="dashboard-page">
    <!-- 左侧面板 -->
    <aside class="left-panel">
      <!-- 实时路况概览 -->
      <div class="panel overview-panel">
        <div class="panel-header">
          <h3>实时路况概览</h3>
          <span class="live-tag">LIVE</span>
        </div>
        <div class="overview-grid">
          <div class="overview-item">
            <div class="item-icon primary"><el-icon :size="20"><DataLine /></el-icon></div>
            <div class="item-info">
              <div class="item-value">56<small>段</small></div>
              <div class="item-label">重点路段总数</div>
            </div>
          </div>
          <div class="overview-item">
            <div class="item-icon warning"><el-icon :size="20"><TrendCharts /></el-icon></div>
            <div class="item-info">
              <div class="item-value">18<small>段</small></div>
              <div class="item-label">拥堵路段数</div>
            </div>
          </div>
          <div class="overview-item">
            <div class="item-icon success"><el-icon :size="20"><Van /></el-icon></div>
            <div class="item-info">
              <div class="item-value">48<small>km/h</small></div>
              <div class="item-label">平均车速</div>
            </div>
          </div>
          <div class="overview-item">
            <div class="item-icon primary"><el-icon :size="20"><Position /></el-icon></div>
            <div class="item-info">
              <div class="item-value">12.8<small>万辆</small></div>
              <div class="item-label">总车流量</div>
            </div>
          </div>
          <div class="overview-item">
            <div class="item-icon danger"><el-icon :size="20"><Warning /></el-icon></div>
            <div class="item-info">
              <div class="item-value">12<small>起</small></div>
              <div class="item-label">事故事件</div>
            </div>
          </div>
          <div class="overview-item">
            <div class="item-icon control"><el-icon :size="20"><OfficeBuilding /></el-icon></div>
            <div class="item-info">
              <div class="item-value">8<small>段</small></div>
              <div class="item-label">管控路段</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 拥堵程度分布 -->
      <div class="panel">
        <div class="panel-header">
          <h3>拥堵程度分布</h3>
        </div>
        <div class="distribution-content">
          <div class="chart-area">
            <div ref="congestionChartRef" class="chart-dom"></div>
          </div>
          <div class="legend-area">
            <div class="legend-item">
              <span class="legend-dot" style="background:#E74C3C"></span>
              <span class="legend-name">严重拥堵</span>
              <span class="legend-value">21.4%</span>
              <span class="legend-count">(12)</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background:#F39C12"></span>
              <span class="legend-name">拥堵</span>
              <span class="legend-value">28.6%</span>
              <span class="legend-count">(16)</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background:#F1C40F"></span>
              <span class="legend-name">缓行</span>
              <span class="legend-value">32.1%</span>
              <span class="legend-count">(18)</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot" style="background:#2ECC71"></span>
              <span class="legend-name">畅通</span>
              <span class="legend-value">17.9%</span>
              <span class="legend-count">(10)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据源接入状态 -->
      <div class="panel">
        <div class="panel-header">
          <h3>数据源接入状态</h3>
        </div>
        <div class="source-status-list">
          <div class="source-row">
            <span class="source-name">路面监控摄像头</span>
            <div class="source-bar">
              <div class="bar-fill" style="width:92.5%"></div>
            </div>
            <span class="source-info">1,256/1,358 在线</span>
            <span class="source-rate">92.5%</span>
          </div>
          <div class="source-row">
            <span class="source-name">车流量传感器</span>
            <div class="source-bar">
              <div class="bar-fill" style="width:92.9%"></div>
            </div>
            <span class="source-info">2,189/2,357 在线</span>
            <span class="source-rate">92.9%</span>
          </div>
          <div class="source-row">
            <span class="source-name">导航软件数据</span>
            <span class="status-dot online"></span>
            <span class="status-text">正常</span>
          </div>
          <div class="source-row">
            <span class="source-name">移动终端数据</span>
            <span class="status-dot online"></span>
            <span class="status-text">正常</span>
          </div>
          <div class="source-row">
            <span class="source-name">气象数据</span>
            <span class="status-dot online"></span>
            <span class="status-text">正常</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- 中间区域 -->
    <main class="center-panel">
      <!-- 路况热力图（地图） -->
      <div class="panel map-panel">
        <div class="panel-header">
          <h3>路况热力图</h3>
          <div class="map-legend">
            <span class="legend-item"><span class="legend-color" style="background:#2ECC71"></span>畅通</span>
            <span class="legend-item"><span class="legend-color" style="background:#F1C40F"></span>缓行</span>
            <span class="legend-item"><span class="legend-color" style="background:#F39C12"></span>拥堵</span>
            <span class="legend-item"><span class="legend-color" style="background:#E74C3C"></span>严重拥堵</span>
          </div>
        </div>
        <div class="map-container">
          <div ref="mapChartRef" class="map-chart"></div>
        </div>
      </div>

      <!-- 统计图表区域 -->
      <div class="charts-grid">
        <div class="panel chart-panel">
          <div class="panel-header">
            <h3>近七天拥堵发生次数统计（次）</h3>
          </div>
          <div class="chart-container">
            <div ref="congestionFreqChartRef" class="chart-dom"></div>
          </div>
        </div>
        <div class="panel chart-panel">
          <div class="panel-header">
            <h3>近七天拥堵时长统计（小时）</h3>
          </div>
          <div class="chart-container">
            <div ref="congestionDurationChartRef" class="chart-dom"></div>
          </div>
        </div>
        <div class="panel chart-panel">
          <div class="panel-header">
            <h3>今日车流量统计（辆/小时）</h3>
          </div>
          <div class="chart-container">
            <div ref="todayFlowChartRef" class="chart-dom"></div>
          </div>
        </div>
        <div class="panel chart-panel">
          <div class="panel-header">
            <h3>近七天车流量统计（辆/小时）</h3>
          </div>
          <div class="chart-container">
            <div ref="weeklyFlowChartRef" class="chart-dom"></div>
          </div>
        </div>
      </div>
    </main>

    <!-- 右侧面板 -->
    <aside class="right-panel">
      <!-- 拥堵分析TOP10 -->
      <div class="panel top10-panel">
        <div class="panel-header">
          <h3>拥堵分析 TOP10</h3>
          <div class="tab-group">
            <button v-for="tab in congestionTabs" :key="tab.key"
              :class="['tab-btn', { active: activeCongestionTab === tab.key }]"
              @click="activeCongestionTab = tab.key">
              {{ tab.label }}
            </button>
          </div>
        </div>
        <div class="scroll-table-wrapper">
          <div class="scroll-table-header">
            <span class="col rank-col">排名</span>
            <span class="col name-col">路段名称</span>
            <span class="col parent-col">所属道路</span>
            <span class="col index-col">拥堵指数</span>
            <span class="col length-col">拥堵长度</span>
            <span class="col duration-col">拥堵时长</span>
          </div>
          <div class="scroll-table-body" ref="scrollTableBodyRef"
            @mouseenter="onMouseEnter"
            @mouseleave="onMouseLeave"
            @wheel.prevent="onWheel">
            <div class="scroll-table-content" :style="{ transform: `translateY(${scrollOffset}px)` }">
              <div v-for="(item, index) in [...congestionTop10, ...congestionTop10]" :key="`${item.name}-${index}`"
                class="scroll-table-row">
                <span class="col rank-col">
                  <span :class="['rank-badge', `rank-${(index % 30) + 1}`]">{{ (index % 30) + 1 }}</span>
                </span>
                <span class="col name-col" :title="item.name">{{ item.name }}</span>
                <span class="col parent-col" :title="item.parent">{{ item.parent }}</span>
                <span class="col index-col" :style="{ color: getIndexColor(item.index) }">{{ item.index }}</span>
                <span class="col length-col">{{ item.length }}</span>
                <span class="col duration-col">{{ item.duration }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 车流量分析TOP10 -->
      <div class="panel top10-panel">
        <div class="panel-header">
          <h3>车流量分析 TOP10</h3>
        </div>
        <div class="scroll-table-wrapper">
          <div class="scroll-table-header">
            <span class="col rank-col">排名</span>
            <span class="col name-col">路段名称</span>
            <span class="col flow-col">车流量</span>
            <span class="col speed-col">平均车速</span>
          </div>
          <div class="scroll-table-body" ref="flowScrollTableBodyRef"
            @mouseenter="onFlowMouseEnter"
            @mouseleave="onFlowMouseLeave"
            @wheel.prevent="onFlowWheel">
            <div class="scroll-table-content" :style="{ transform: `translateY(${flowScrollOffset}px)` }">
              <div v-for="(item, index) in [...trafficFlowTop10, ...trafficFlowTop10]" :key="`${item.name}-${index}`"
                class="scroll-table-row">
                <span class="col rank-col">
                  <span :class="['rank-badge', `rank-${(index % 30) + 1}`]">{{ (index % 30) + 1 }}</span>
                </span>
                <span class="col name-col" :title="item.name">{{ item.name }}</span>
                <span class="col flow-col">{{ item.flow.toLocaleString() }}</span>
                <span class="col speed-col" :style="{ color: getSpeedColor(item.speed) }">{{ item.speed }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 事件概览 -->
      <div class="panel">
        <div class="panel-header">
          <h3>事件概览（今日）</h3>
        </div>
        <div class="event-grid">
          <div class="event-item">
            <div class="event-icon accident">🚗</div>
            <div class="event-info">
              <div class="event-value">8<small>起</small></div>
              <div class="event-label">交通事故</div>
            </div>
          </div>
          <div class="event-item">
            <div class="event-icon construction">🚧</div>
            <div class="event-info">
              <div class="event-value">3<small>段</small></div>
              <div class="event-label">道路施工</div>
            </div>
          </div>
          <div class="event-item">
            <div class="event-icon emergency">⚡</div>
            <div class="event-info">
              <div class="event-value">1<small>起</small></div>
              <div class="event-label">突发事件</div>
            </div>
          </div>
          <div class="event-item">
            <div class="event-icon control">⚠️</div>
            <div class="event-info">
              <div class="event-value">2<small>段</small></div>
              <div class="event-label">交通管制</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 实时事件列表 -->
      <div class="panel events-panel">
        <div class="panel-header">
          <h3>实时事件列表</h3>
          <span class="refresh-tag">● 自动刷新</span>
        </div>
        <div class="scroll-table-wrapper">
          <div class="scroll-table-header">
            <span class="col event-type-col">事件类型</span>
            <span class="col event-road-col">路段名称</span>
            <span class="col event-dir-col">影响方向</span>
            <span class="col event-time-col">发生时间</span>
            <span class="col event-status-col">状态</span>
          </div>
          <div class="scroll-table-body" ref="eventScrollTableBodyRef"
            @mouseenter="onEventMouseEnter"
            @mouseleave="onEventMouseLeave"
            @wheel.prevent="onEventWheel">
            <div class="scroll-table-content" :style="{ transform: `translateY(${eventScrollOffset}px)` }">
              <div v-for="(item, index) in [...realtimeEvents, ...realtimeEvents]" :key="`${item.id}-${index}`"
                class="scroll-table-row">
                <span class="col event-type-col">
                  <span :class="['event-type-badge', item.typeClass]">{{ item.type }}</span>
                </span>
                <span class="col event-road-col" :title="item.location">{{ item.location }}</span>
                <span class="col event-dir-col">{{ item.direction }}</span>
                <span class="col event-time-col">{{ item.time }}</span>
                <span class="col event-status-col">
                  <span :class="['status-badge', item.statusClass]">{{ item.status }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 避堵路线推荐 -->
      <div class="panel route-panel">
        <div class="panel-header">
          <h3>避堵路线推荐</h3>
        </div>
        <div class="route-content">
          <div class="route-form">
            <div class="form-item">
              <label>起点</label>
              <input v-model="routeStart" type="text" placeholder="请输入起点" class="form-input" />
            </div>
            <div class="form-item">
              <label>终点</label>
              <input v-model="routeEnd" type="text" placeholder="请输入终点" class="form-input" />
            </div>
            <div class="form-item">
              <label>出发时间</label>
              <select v-model="departTime" class="form-select">
                <option value="now">现在</option>
                <option value="1h">1小时后</option>
              </select>
            </div>
          </div>
          <div class="route-options">
            <div v-for="(route, index) in routeOptions" :key="index"
              :class="['route-option', { recommended: index === 0 }]">
              <div class="route-info">
                <div class="route-name">
                  <span v-if="index === 0" class="recommend-tag">推荐</span>
                  {{ route.name }}
                </div>
                <div class="route-progress-row">
                  <span class="route-time">{{ route.time }}</span>
                  <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: route.progress + '%', background: index === 0 ? '#2ECC71' : getProgressColor(route.congestion) }"></div>
                  </div>
                  <span class="route-distance">{{ route.distance }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- 顶部返回按钮 -->
    <div class="top-bar">
      <div class="back-btn" @click="goBack">
        <el-icon :size="18"><ArrowLeft /></el-icon>
        <span>返回</span>
      </div>
      <div class="page-title">总览</div>
      <div class="top-time">
        <div class="time-value">{{ currentTime }}</div>
        <div class="date-value">{{ currentDate }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { ArrowLeft, DataLine, TrendCharts, Timer, Van, Position, Warning, OfficeBuilding } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const currentTime = ref('')
const currentDate = ref('')
const activeCongestionTab = ref('index')
const congestionChartRef = ref<HTMLElement>()
const weeklyChartRef = ref<HTMLElement>()
const congestionFreqChartRef = ref<HTMLElement>()
const congestionDurationChartRef = ref<HTMLElement>()
const todayFlowChartRef = ref<HTMLElement>()
const weeklyFlowChartRef = ref<HTMLElement>()
const scrollTableBodyRef = ref<HTMLElement>()
const flowScrollTableBodyRef = ref<HTMLElement>()
const eventScrollTableBodyRef = ref<HTMLElement>()
const mapChartRef = ref<HTMLElement>()

// 拥堵表格滚动相关
const scrollOffset = ref(0)
const rowHeight = 32
let scrollTimer: ReturnType<typeof setInterval> | null = null
let isScrollPaused = false

const startScroll = () => {
  if (scrollTimer) return
  scrollTimer = setInterval(() => {
    if (isScrollPaused) return
    const totalRows = congestionTop10.value.length
    const maxOffset = -(totalRows * rowHeight)
    scrollOffset.value -= 1
    if (scrollOffset.value <= maxOffset) {
      scrollOffset.value = 0
    }
  }, 50)
}

const stopScroll = () => {
  if (scrollTimer) {
    clearInterval(scrollTimer)
    scrollTimer = null
  }
}

const onMouseEnter = () => { isScrollPaused = true }
const onMouseLeave = () => { isScrollPaused = false }

const onWheel = (e: WheelEvent) => {
  const totalRows = congestionTop10.value.length
  const maxOffset = 0
  const minOffset = -(totalRows * rowHeight)
  scrollOffset.value = Math.max(minOffset, Math.min(maxOffset, scrollOffset.value - e.deltaY))
}

// 车流量表格滚动相关
const flowScrollOffset = ref(0)
let flowScrollTimer: ReturnType<typeof setInterval> | null = null
let isFlowScrollPaused = false

const startFlowScroll = () => {
  if (flowScrollTimer) return
  flowScrollTimer = setInterval(() => {
    if (isFlowScrollPaused) return
    const totalRows = trafficFlowTop10.value.length
    const maxOffset = -(totalRows * rowHeight)
    flowScrollOffset.value -= 1
    if (flowScrollOffset.value <= maxOffset) {
      flowScrollOffset.value = 0
    }
  }, 50)
}

const stopFlowScroll = () => {
  if (flowScrollTimer) {
    clearInterval(flowScrollTimer)
    flowScrollTimer = null
  }
}

const onFlowMouseEnter = () => { isFlowScrollPaused = true }
const onFlowMouseLeave = () => { isFlowScrollPaused = false }

const onFlowWheel = (e: WheelEvent) => {
  const totalRows = trafficFlowTop10.value.length
  const maxOffset = 0
  const minOffset = -(totalRows * rowHeight)
  flowScrollOffset.value = Math.max(minOffset, Math.min(maxOffset, flowScrollOffset.value - e.deltaY))
}

// 实时事件列表滚动相关
const eventScrollOffset = ref(0)
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

let congestionChart: echarts.ECharts | null = null
let weeklyChart: echarts.ECharts | null = null
let mapChart: echarts.ECharts | null = null
let congestionFreqChart: echarts.ECharts | null = null
let congestionDurationChart: echarts.ECharts | null = null
let todayFlowChart: echarts.ECharts | null = null
let weeklyFlowChart: echarts.ECharts | null = null

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

// 拥堵TOP10 Tab
const congestionTabs = [
  { key: 'index', label: '按拥堵指数' },
  { key: 'duration', label: '按拥堵时长' },
  { key: 'length', label: '按拥堵长度' }
]

// 拥堵TOP10数据（30条）
const congestionTop10 = ref([
  { name: '广深高速K20+000-K35+000', parent: 'G4W广深高速', index: 9.6, length: 15.8, duration: 3.2 },
  { name: '华南快速干线(北行)', parent: 'S81广州环城高速', index: 9.1, length: 12.6, duration: 2.8 },
  { name: '广清高速K15+000-K28+000', parent: 'G107广清高速', index: 8.7, length: 13.2, duration: 2.6 },
  { name: '广深沿江高速K10+500-K22+000', parent: 'S3广深沿江高速', index: 8.2, length: 11.4, duration: 2.4 },
  { name: '莞佛高速K8+000-K18+000', parent: 'S6莞佛高速', index: 7.8, length: 9.6, duration: 2.2 },
  { name: '广佛肇高速K12+000-K20+000', parent: 'S8广佛肇高速', index: 7.6, length: 10.3, duration: 2.1 },
  { name: '沈海高速K45+000-K58+000', parent: 'G15沈海高速', index: 7.3, length: 8.6, duration: 1.9 },
  { name: '汕湛高速K30+000-K42+000', parent: 'S17汕湛高速', index: 7.1, length: 7.8, duration: 1.7 },
  { name: '乐广高速K62+000-K72+000', parent: 'G4京港澳高速', index: 6.8, length: 7.2, duration: 1.6 },
  { name: '南沙港快速(进城方向)', parent: 'S105南沙港快速', index: 6.5, length: 6.4, duration: 1.4 },
  { name: '内环路A线K5+000-K12+000', parent: '广州市内环路', index: 6.3, length: 7.0, duration: 1.3 },
  { name: '黄埔大道西K2+000-K8+000', parent: '广州市快速路', index: 6.1, length: 6.0, duration: 1.2 },
  { name: '广园快速路K8+000-K18+000', parent: '广州市快速路', index: 5.9, length: 10.0, duration: 1.1 },
  { name: '东风路K3+000-K10+000', parent: '广州市主干道', index: 5.7, length: 7.0, duration: 1.0 },
  { name: '广州大道中K5+000-K12+000', parent: '广州市主干道', index: 5.5, length: 7.0, duration: 0.9 },
  { name: '华南快速干线(南行)', parent: 'S81广州环城高速', index: 5.3, length: 8.5, duration: 0.9 },
  { name: '广佛高速K10+000-K18+000', parent: 'G15沈海高速', index: 5.1, length: 8.0, duration: 0.8 },
  { name: '南沙大桥K2+000-K8+000', parent: 'G9411莞佛高速', index: 4.9, length: 6.0, duration: 0.8 },
  { name: '广深高速K35+000-K48+000', parent: 'G4W广深高速', index: 4.7, length: 13.0, duration: 0.7 },
  { name: '环城高速东段K0+000-K15+000', parent: 'S81广州环城高速', index: 4.5, length: 15.0, duration: 0.7 },
  { name: '科韵路K2+000-K8+000', parent: '广州市快速路', index: 4.3, length: 6.0, duration: 0.6 },
  { name: '新光快速K3+000-K10+000', parent: '广州市快速路', index: 4.1, length: 7.0, duration: 0.6 },
  { name: '华南快速干线K15+000-K25+000', parent: 'S81广州环城高速', index: 3.9, length: 10.0, duration: 0.5 },
  { name: '广清高速K28+000-K38+000', parent: 'G107广清高速', index: 3.7, length: 10.0, duration: 0.5 },
  { name: '沈海高速K58+000-K68+000', parent: 'G15沈海高速', index: 3.5, length: 10.0, duration: 0.4 },
  { name: '广深沿江高速K22+000-K32+000', parent: 'S3广深沿江高速', index: 3.3, length: 10.0, duration: 0.4 },
  { name: '黄埔东路K5+000-K15+000', parent: '广州市主干道', index: 3.1, length: 10.0, duration: 0.4 },
  { name: '中山大道K3+000-K12+000', parent: '广州市主干道', index: 2.9, length: 9.0, duration: 0.3 },
  { name: '环城高速西段K0+000-K12+000', parent: 'S81广州环城高速', index: 2.7, length: 12.0, duration: 0.3 },
  { name: '广州大桥K1+000-K3+000', parent: '广州市桥梁', index: 2.5, length: 2.0, duration: 0.2 }
])

// 车流量TOP10数据（30条）
const trafficFlowTop10 = ref([
  { name: '华南快速干线(北行)', flow: 18562, speed: 32 },
  { name: '广深高速K20+000-K35+000', flow: 16845, speed: 45 },
  { name: '广清高速K15+000-K28+000', flow: 15623, speed: 28 },
  { name: '广深沿江高速K10+500-K22+000', flow: 14256, speed: 52 },
  { name: '莞佛高速K8+000-K18+000', flow: 13892, speed: 48 },
  { name: '广佛肇高速K12+000-K20+000', flow: 12568, speed: 65 },
  { name: '沈海高速K45+000-K58+000', flow: 11845, speed: 35 },
  { name: '汕湛高速K30+000-K42+000', flow: 10923, speed: 42 },
  { name: '乐广高速K62+000-K72+000', flow: 10256, speed: 55 },
  { name: '南沙港快速(进城方向)', flow: 9856, speed: 38 },
  { name: '内环路A线K5+000-K12+000', flow: 9523, speed: 40 },
  { name: '黄埔大道西K2+000-K8+000', flow: 9187, speed: 36 },
  { name: '广园快速路K8+000-K18+000', flow: 8845, speed: 48 },
  { name: '东风路K3+000-K10+000', flow: 8523, speed: 32 },
  { name: '广州大道中K5+000-K12+000', flow: 8234, speed: 35 },
  { name: '华南快速干线(南行)', flow: 7956, speed: 42 },
  { name: '广佛高速K10+000-K18+000', flow: 7623, speed: 45 },
  { name: '南沙大桥K2+000-K8+000', flow: 7345, speed: 58 },
  { name: '广深高速K35+000-K48+000', flow: 7023, speed: 50 },
  { name: '环城高速东段K0+000-K15+000', flow: 6756, speed: 48 },
  { name: '科韵路K2+000-K8+000', flow: 6423, speed: 35 },
  { name: '新光快速K3+000-K10+000', flow: 6156, speed: 40 },
  { name: '华南快速干线K15+000-K25+000', flow: 5892, speed: 45 },
  { name: '广清高速K28+000-K38+000', flow: 5623, speed: 52 },
  { name: '沈海高速K58+000-K68+000', flow: 5345, speed: 48 },
  { name: '广深沿江高速K22+000-K32+000', flow: 5089, speed: 55 },
  { name: '黄埔东路K5+000-K15+000', flow: 4823, speed: 38 },
  { name: '中山大道K3+000-K12+000', flow: 4567, speed: 32 },
  { name: '环城高速西段K0+000-K12+000', flow: 4289, speed: 45 },
  { name: '广州大桥K1+000-K3+000', flow: 4023, speed: 28 }
])

// 实时事件数据
const realtimeEvents = ref([
  { id: 1, type: '交通事故', typeClass: 'accident', location: '广深高速K28+500', direction: '双向', time: '15:20', status: '处理中', statusClass: 'processing' },
  { id: 2, type: '道路施工', typeClass: 'construction', location: '广清高速K20+300', direction: '西向东', time: '14:50', status: '进行中', statusClass: 'ongoing' },
  { id: 3, type: '交通管制', typeClass: 'control', location: '广佛肇高速K15+000', direction: '双向', time: '14:10', status: '管制中', statusClass: 'control' },
  { id: 4, type: '道路施工', typeClass: 'construction', location: '沈海高速K50+000', direction: '北向南', time: '13:55', status: '进行中', statusClass: 'ongoing' },
  { id: 5, type: '交通事故', typeClass: 'accident', location: '华南快速K12+200', direction: '南向北', time: '13:30', status: '已处理', statusClass: 'resolved' },
  { id: 6, type: '突发事件', typeClass: 'emergency', location: '内环路A线K8+500', direction: '顺时针', time: '13:15', status: '处理中', statusClass: 'processing' },
  { id: 7, type: '交通事故', typeClass: 'accident', location: '南沙大桥K5+100', direction: '东向西', time: '12:50', status: '已处理', statusClass: 'resolved' },
  { id: 8, type: '交通管制', typeClass: 'control', location: '黄埔大道K3+200', direction: '西向东', time: '12:30', status: '已解除', statusClass: 'resolved' },
  { id: 9, type: '道路施工', typeClass: 'construction', location: '广园快速K15+800', direction: '东向西', time: '12:10', status: '进行中', statusClass: 'ongoing' },
  { id: 10, type: '交通事故', typeClass: 'accident', location: '东风路K5+300', direction: '双向', time: '11:45', status: '已处理', statusClass: 'resolved' }
])

// 路线推荐
const routeStart = ref('天河区')
const routeEnd = ref('宝安区')
const departTime = ref('now')
const routeOptions = ref([
  { name: '路线1', time: '1h32m', distance: '65.2km', congestion: 'low', congestionText: '畅通', progress: 25 },
  { name: '路线2', time: '1h45m', distance: '72.8km', congestion: 'medium', congestionText: '部分缓行', progress: 55 },
  { name: '路线3', time: '1h50m', distance: '68.4km', congestion: 'low', congestionText: '畅通', progress: 30 },
  { name: '路线4', time: '2h05m', distance: '78.5km', congestion: 'medium', congestionText: '部分缓行', progress: 60 }
])

const getProgressColor = (level: string) => {
  const colors: Record<string, string> = { low: '#2ECC71', medium: '#F39C12', high: '#E74C3C' }
  return colors[level] || '#2ECC71'
}

const toggleRouteDetail = (index: number) => {
  // 可以展开详情的逻辑
}

// 辅助函数
const getIndexColor = (index: number) => {
  if (index >= 8) return '#E74C3C'
  if (index >= 6) return '#F39C12'
  return '#F1C40F'
}

const getSpeedColor = (speed: number) => {
  if (speed < 30) return '#E74C3C'
  if (speed < 50) return '#F39C12'
  return '#2ECC71'
}

// 格式化数字（千分位分隔符）
const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN')
}

// 初始化地图图表（散点图模拟）
const initMapChart = () => {
  if (!mapChartRef.value) return
  const { width, height } = mapChartRef.value.getBoundingClientRect()
  console.log('Map container size:', width, height)
  if (width === 0 || height === 0) return
  mapChart = echarts.init(mapChartRef.value)
  console.log('Map chart initialized')

  // 模拟道路数据
  const roads = [
    // 主要道路
    { coords: [[10, 50], [90, 50]], name: 'G4 京港澳高速' },
    { coords: [[20, 30], [80, 30]], name: 'S81 环城高速' },
    { coords: [[30, 70], [70, 70]], name: 'G15 沈海高速' },
    { coords: [[50, 10], [50, 90]], name: '华南快速' },
    { coords: [[15, 20], [85, 80]], name: '广园快速路' },
    // 次要道路
    { coords: [[25, 45], [75, 45]], name: '中山大道' },
    { coords: [[35, 25], [65, 75]], name: '黄埔大道' },
    { coords: [[20, 60], [80, 40]], name: '天河路' },
  ]

  // 模拟交通流量数据点
  const trafficPoints = [
    // 严重拥堵点
    { value: [45, 48], symbolSize: 15, itemStyle: { color: '#E74C3C' } },
    { value: [52, 52], symbolSize: 12, itemStyle: { color: '#E74C3C' } },
    { value: [48, 45], symbolSize: 10, itemStyle: { color: '#E74C3C' } },
    // 拥堵点
    { value: [35, 42], symbolSize: 12, itemStyle: { color: '#F39C12' } },
    { value: [62, 38], symbolSize: 10, itemStyle: { color: '#F39C12' } },
    { value: [40, 55], symbolSize: 8, itemStyle: { color: '#F39C12' } },
    { value: [55, 60], symbolSize: 9, itemStyle: { color: '#F39C12' } },
    // 缓行点
    { value: [28, 35], symbolSize: 8, itemStyle: { color: '#F1C40F' } },
    { value: [72, 45], symbolSize: 7, itemStyle: { color: '#F1C40F' } },
    { value: [45, 68], symbolSize: 6, itemStyle: { color: '#F1C40F' } },
    { value: [58, 32], symbolSize: 7, itemStyle: { color: '#F1C40F' } },
    { value: [38, 28], symbolSize: 6, itemStyle: { color: '#F1C40F' } },
    // 畅通点
    { value: [15, 25], symbolSize: 5, itemStyle: { color: '#2ECC71' } },
    { value: [82, 55], symbolSize: 5, itemStyle: { color: '#2ECC71' } },
    { value: [25, 72], symbolSize: 4, itemStyle: { color: '#2ECC71' } },
    { value: [75, 25], symbolSize: 4, itemStyle: { color: '#2ECC71' } },
    { value: [60, 78], symbolSize: 5, itemStyle: { color: '#2ECC71' } },
    { value: [30, 15], symbolSize: 4, itemStyle: { color: '#2ECC71' } },
  ]

  // 区域标记点
  const areaMarkers = [
    { value: [48, 35], name: '天河区' },
    { value: [35, 42], name: '越秀区' },
    { value: [52, 58], name: '海珠区' },
    { value: [28, 45], name: '荔湾区' },
    { value: [42, 22], name: '白云区' },
    { value: [58, 68], name: '番禺区' },
    { value: [65, 35], name: '黄埔区' },
    { value: [72, 78], name: '南沙区' },
  ]

  const option = {
    backgroundColor: '#0B0E1A',
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        if (params.seriesType === 'scatter') {
          return `${params.name || '交通点'}<br/>状态: ${getStatusFromColor(params.color)}`
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
          width: 2,
          opacity: 0.6,
          curveness: 0.2
        },
        effect: {
          show: true,
          period: 4 + index * 0.5,
          trailLength: 0.4,
          symbol: 'arrow',
          symbolSize: 6,
          color: '#00D4FF'
        },
        zlevel: 1
      })),
      // 交通流量点
      {
        type: 'scatter',
        coordinateSystem: 'cartesian2d',
        data: trafficPoints,
        zlevel: 2
      },
      // 区域标记
      {
        type: 'scatter',
        coordinateSystem: 'cartesian2d',
        data: areaMarkers.map(m => ({
          ...m,
          symbolSize: 0,
          label: {
            show: true,
            formatter: m.name,
            color: '#8892A8',
            fontSize: 10,
            textBorderColor: 'rgba(0,0,0,0.8)',
            textBorderWidth: 2
          }
        })),
        zlevel: 3
      }
    ],
    animation: true,
    animationDuration: 2000,
    animationEasing: 'cubicOut' as const
  }

  mapChart.setOption(option)
  console.log('Map option set')
}

// 获取状态颜色对应的文字
const getStatusFromColor = (color: string) => {
  const statusMap: Record<string, string> = {
    '#E74C3C': '严重拥堵',
    '#F39C12': '拥堵',
    '#F1C40F': '缓行',
    '#2ECC71': '畅通'
  }
  return statusMap[color] || '未知'
}

// 初始化拥堵分布图表
const initCongestionChart = () => {
  if (!congestionChartRef.value) return
  // 检查容器是否有尺寸
  const { width, height } = congestionChartRef.value.getBoundingClientRect()
  if (width === 0 || height === 0) return
  congestionChart = echarts.init(congestionChartRef.value)
  const option = {
    tooltip: { trigger: 'item', formatter: '{b}: {c}段 ({d}%)' },
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: '42%',
        style: {
          text: '56',
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
        { value: 12, name: '严重拥堵', itemStyle: { color: '#E74C3C' } },
        { value: 16, name: '拥堵', itemStyle: { color: '#F39C12' } },
        { value: 18, name: '缓行', itemStyle: { color: '#F1C40F' } },
        { value: 10, name: '畅通', itemStyle: { color: '#2ECC71' } }
      ]
    }]
  }
  congestionChart.setOption(option)
}

// 初始化近七天统计图表
const initWeeklyChart = () => {
  if (!weeklyChartRef.value) return
  const { width, height } = weeklyChartRef.value.getBoundingClientRect()
  if (width === 0 || height === 0) return
  weeklyChart = echarts.init(weeklyChartRef.value)
  const option = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['7/20', '7/21', '7/22', '7/23', '7/24', '7/25', '7/26'],
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
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#00D4FF' },
          { offset: 1, color: 'rgba(0,212,255,0.2)' }
        ])
      },
      data: [180, 160, 145, 121, 155, 172, 168]
    }]
  }
  weeklyChart.setOption(option)
}

// 初始化近七天拥堵发生次数统计
const initCongestionFreqChart = () => {
  if (!congestionFreqChartRef.value) return
  const { width, height } = congestionFreqChartRef.value.getBoundingClientRect()
  if (width === 0 || height === 0) return
  congestionFreqChart = echarts.init(congestionFreqChartRef.value)
  const option = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['7/20', '7/21', '7/22', '7/23', '7/24', '7/25', '7/26'],
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
      data: [23, 18, 25, 21, 28, 19, 22]
    }]
  }
  congestionFreqChart.setOption(option)
}

// 初始化近七天拥堵时长统计
const initCongestionDurationChart = () => {
  if (!congestionDurationChartRef.value) return
  const { width, height } = congestionDurationChartRef.value.getBoundingClientRect()
  if (width === 0 || height === 0) return
  congestionDurationChart = echarts.init(congestionDurationChartRef.value)
  const option = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['7/20', '7/21', '7/22', '7/23', '7/24', '7/25', '7/26'],
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
      data: [4.5, 3.2, 5.1, 4.8, 6.2, 3.8, 4.1]
    }]
  }
  congestionDurationChart.setOption(option)
}

// 初始化今日车流量统计
const initTodayFlowChart = () => {
  if (!todayFlowChartRef.value) return
  const { width, height } = todayFlowChartRef.value.getBoundingClientRect()
  if (width === 0 || height === 0) return
  todayFlowChart = echarts.init(todayFlowChartRef.value)
  const option = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
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
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      lineStyle: { color: '#2ECC71', width: 2 },
      itemStyle: { color: '#2ECC71' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(46,204,113,0.3)' },
          { offset: 1, color: 'rgba(46,204,113,0.05)' }
        ])
      },
      data: [1250, 2860, 2340, 1890, 2120, 2680, 3150, 2450]
    }]
  }
  todayFlowChart.setOption(option)
}

// 初始化近七天车流量统计
const initWeeklyFlowChart = () => {
  if (!weeklyFlowChartRef.value) return
  const { width, height } = weeklyFlowChartRef.value.getBoundingClientRect()
  if (width === 0 || height === 0) return
  weeklyFlowChart = echarts.init(weeklyFlowChartRef.value)
  const option = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['7/20', '7/21', '7/22', '7/23', '7/24', '7/25', '7/26'],
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
      data: [45200, 48600, 42300, 46800, 51200, 49500, 47800]
    }]
  }
  weeklyFlowChart.setOption(option)
}

const handleResize = () => {
  congestionChart?.resize()
  weeklyChart?.resize()
  mapChart?.resize()
  congestionFreqChart?.resize()
  congestionDurationChart?.resize()
  todayFlowChart?.resize()
  weeklyFlowChart?.resize()
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  nextTick(() => {
    // 延迟初始化图表，确保DOM已渲染且有正确尺寸
    setTimeout(() => {
      initMapChart()
      initCongestionChart()
      initWeeklyChart()
      initCongestionFreqChart()
      initCongestionDurationChart()
      initTodayFlowChart()
      initWeeklyFlowChart()
    }, 100)
    startScroll()
    startFlowScroll()
    startEventScroll()
  })
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  stopScroll()
  stopFlowScroll()
  stopEventScroll()
  window.removeEventListener('resize', handleResize)
  mapChart?.dispose()
  congestionChart?.dispose()
  weeklyChart?.dispose()
  congestionFreqChart?.dispose()
  congestionDurationChart?.dispose()
  todayFlowChart?.dispose()
  weeklyFlowChart?.dispose()
})
</script>

<style lang="scss" scoped>
.dashboard-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #0B0E1A;
  color: #fff;
  z-index: 9999;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  display: grid;
  grid-template-columns: 300px 1fr 450px;
  grid-template-rows: 44px 1fr;
  grid-template-areas:
    "top top top"
    "left center right";
  gap: 5px;
  padding: 5px;
}

// 顶部栏
.top-bar {
  grid-area: top;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  background: rgba(0,40,80,0.5);
  border-radius: 6px;
  border: 1px solid rgba(0,212,255,0.2);

  .back-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    background: rgba(255,255,255,0.1);
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.3s;

    &:hover {
      background: rgba(0,212,255,0.3);
    }
  }

  .page-title {
    font-size: 16px;
    font-weight: 600;
    background: linear-gradient(180deg, #FFFFFF 0%, #00D4FF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
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

// 面板通用
.panel {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  overflow: hidden;

  .panel-header {
    padding: 6px 10px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
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
  }
}

// 左侧面板
.left-panel {
  grid-area: left;
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow: hidden;
  min-height: 0;
  padding-right: 2px;

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

// 实时路况概览
.overview-panel {
  background: linear-gradient(135deg, rgba(0,212,255,0.08) 0%, rgba(0,100,200,0.08) 100%);
  border-color: rgba(0,212,255,0.25);

  .panel-header {
    padding: 6px 10px;

    h3 {
      font-size: 12px;
    }
  }

  .live-tag {
    font-size: 9px;
    color: #2ECC71;
    padding: 1px 5px;
    background: rgba(46,204,113,0.15);
    border-radius: 3px;
    animation: blink 1.5s infinite;
  }
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
  background: rgba(0,0,0,0.2);
  border-radius: 5px;
  transition: all 0.3s;
  min-height: 0;

  &:hover {
    background: rgba(0,0,0,0.3);
  }

  .item-icon {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &.primary { background: rgba(0,212,255,0.15); color: #00D4FF; }
    &.warning { background: rgba(243,156,18,0.15); color: #F39C12; }
    &.success { background: rgba(103,194,58,0.15); color: #67C23A; }
    &.info { background: rgba(155,89,182,0.15); color: #9B59B6; }
    &.danger { background: rgba(245,108,108,0.15); color: #F56C6C; }
    &.control { background: rgba(230,162,60,0.15); color: #E6A23C; }
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

// 中间面板
.center-panel {
  grid-area: center;
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
  min-height: 400px;
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
      position: relative;
      z-index: 1;
    }
  }

  .charts-grid {
    flex: 6;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 5px;
    min-height: 250px;
    overflow: hidden;
  }

  .chart-panel {
    display: flex;
    flex-direction: column;
    min-height: 120px;
    overflow: hidden;
  }
}

// 右侧面板
.right-panel {
  grid-area: right;
  display: flex;
  flex-direction: column;
  gap: 5px;
  overflow: hidden;
  min-height: 0;
  padding-left: 2px;

  .panel {
    flex: 20;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;

    &:nth-child(3) { flex: 15; }
    &:nth-child(5) { flex: 25; }
  }
}

// Tab按钮
.tab-group {
  display: flex;
  gap: 2px;
  background: rgba(0,0,0,0.3);
  padding: 2px;
  border-radius: 4px;

  .tab-btn {
    padding: 3px 6px;
    border: none;
    background: transparent;
    color: #8892A8;
    font-size: 10px;
    border-radius: 3px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover { color: #FFFFFF; }
    &.active { background: rgba(0,212,255,0.2); color: #00D4FF; }
  }
}


// 自定义滚动表格
.scroll-table-wrapper {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .refresh-tag {
    font-size: 9px;
    color: #2ECC71;
    animation: blink 1.5s infinite;
  }

  .scroll-table-header {
    display: flex;
    padding: 6px 8px;
    background: rgba(0,0,0,0.3);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    flex-shrink: 0;

    .col {
      font-size: 11px;
      color: #8892A8;
      font-weight: 500;
    }
  }

  .scroll-table-body {
    height: 224px;
    overflow: hidden;
    position: relative;

    .scroll-table-content {
      transition: transform 0.05s linear;
    }

    .scroll-table-row {
      display: flex;
      padding: 6px 8px;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      height: 32px;
      box-sizing: border-box;
      align-items: center;

      &:hover {
        background: rgba(0,212,255,0.05);
      }

      .col {
        font-size: 11px;
        color: #FFFFFF;
      }
    }
  }

  .rank-col { width: 36px; text-align: center; }
  .name-col { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .parent-col { width: 95px; color: #8892A8; font-size: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .index-col { width: 55px; text-align: center; font-weight: 600; font-family: 'DIN Pro', monospace; }
  .length-col { width: 60px; text-align: center; }
  .duration-col { width: 55px; text-align: center; }
  .flow-col { width: 65px; text-align: right; font-family: 'DIN Pro', monospace; }
  .speed-col { width: 55px; text-align: center; font-family: 'DIN Pro', monospace; }

  // 事件列表列
  .event-type-col { width: 65px; text-align: center; }
  .event-road-col { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .event-dir-col { width: 60px; text-align: center; color: #8892A8; }
  .event-time-col { width: 50px; text-align: center; font-family: 'DIN Pro', monospace; }
  .event-status-col { width: 60px; text-align: center; }

  .event-type-badge {
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 10px;
    display: inline-block;

    &.accident { background: rgba(245,108,108,0.2); color: #F56C6C; }
    &.construction { background: rgba(243,156,18,0.2); color: #F39C12; }
    &.emergency { background: rgba(0,212,255,0.2); color: #00D4FF; }
    &.control { background: rgba(230,162,60,0.2); color: #E6A23C; }
  }

  .status-badge {
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 10px;
    display: inline-block;

    &.processing { background: rgba(0,212,255,0.2); color: #00D4FF; }
    &.ongoing { background: rgba(243,156,18,0.2); color: #F39C12; }
    &.control { background: rgba(230,162,60,0.2); color: #E6A23C; }
    &.resolved { background: rgba(103,194,58,0.2); color: #67C23A; }
  }

  .rank-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 3px;
    font-size: 10px;
    font-weight: 600;
    background: rgba(255,255,255,0.1);
    color: #8892A8;

    &.rank-1 { background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; }
    &.rank-2 { background: linear-gradient(135deg, #C0C0C0, #A0A0A0); color: #000; }
    &.rank-3 { background: linear-gradient(135deg, #CD7F32, #B87333); color: #000; }
  }
}

// 图表容器
.chart-container {
  flex: 1;
  min-height: 100px;
  padding: 5px;
  display: flex;
  flex-direction: column;

  .chart-dom {
    width: 100%;
    height: 100%;
    min-height: 80px;
  }
}

// 拥堵分布
.distribution-content {
  display: flex;
  padding: 8px;
  gap: 8px;
  flex: 1;
  min-height: 0;

  .chart-area {
    flex: 0 0 50%;
    min-width: 0;

    .chart-dom {
      width: 100%;
      height: 100%;
    }
  }

  .legend-area {
    flex: 0 0 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;

      .legend-dot {
        width: 10px;
        height: 10px;
        border-radius: 2px;
        flex-shrink: 0;
      }

      .legend-name {
        color: #8892A8;
        width: 45px;
      }

      .legend-value {
        color: #FFFFFF;
        font-weight: 600;
        font-family: 'DIN Pro', monospace;
      }

      .legend-count {
        color: #8892A8;
        font-size: 10px;
      }
    }
  }
}

// 数据源接入状态
.source-status-list {
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-height: 0;

  .source-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    background: rgba(0,0,0,0.15);
    border-radius: 4px;
    font-size: 11px;

    .source-name {
      color: #8892A8;
      width: 90px;
      flex-shrink: 0;
    }

    .source-bar {
      flex: 1;
      height: 4px;
      background: rgba(255,255,255,0.08);
      border-radius: 2px;
      overflow: hidden;

      .bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #2ECC71, #27AE60);
        border-radius: 2px;
      }
    }

    .source-info {
      color: #8892A8;
      font-size: 10px;
      flex-shrink: 0;
    }

    .source-rate {
      color: #2ECC71;
      font-family: 'DIN Pro', monospace;
      font-weight: 600;
      width: 40px;
      text-align: right;
      flex-shrink: 0;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;

      &.online {
        background: #2ECC71;
        box-shadow: 0 0 6px #2ECC71;
      }
    }

    .status-text {
      color: #2ECC71;
      font-weight: 500;
    }
  }
}

// 事件概览
.event-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  padding: 6px;
  flex: 1;
}

.event-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  background: rgba(0,0,0,0.2);
  border-radius: 5px;
  min-height: 50px;

  .event-icon {
    width: 28px;
    height: 28px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;

    &.accident { background: rgba(245,108,108,0.15); }
    &.construction { background: rgba(243,156,18,0.15); }
    &.emergency { background: rgba(0,212,255,0.15); }
    &.control { background: rgba(230,162,60,0.15); }
  }

  .event-info {
    min-width: 0;

    .event-value {
      font-size: 16px;
      font-weight: 700;
      color: #FFFFFF;
      font-family: 'DIN Pro', monospace;
      line-height: 1.1;

      small {
        font-size: 9px;
        font-weight: 400;
        color: #8892A8;
        margin-left: 1px;
      }
    }

    .event-label {
      font-size: 9px;
      color: #8892A8;
      margin-top: 1px;
    }
  }
}

// 实时事件列表
.events-panel {
  display: flex;
  flex-direction: column;

  .refresh-tag {
    font-size: 9px;
    color: #2ECC71;
  }

  .event-list-wrapper {
    flex: 1;
    overflow: hidden;
  }

  .event-list {
    padding: 5px 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    animation: scrollEvents 20s linear infinite;

    &:hover { animation-play-state: paused; }
  }

  .event-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    background: rgba(0,0,0,0.2);
    border-radius: 4px;

    &:hover { background: rgba(0,0,0,0.3); }
  }

  .event-type-badge {
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 10px;
    flex-shrink: 0;

    &.accident { background: rgba(245,108,108,0.2); color: #F56C6C; }
    &.construction { background: rgba(243,156,18,0.2); color: #F39C12; }
    &.control { background: rgba(230,162,60,0.2); color: #E6A23C; }
  }

  .event-info {
    flex: 1;
    min-width: 0;

    .event-location {
      font-size: 11px;
      color: #FFFFFF;
      margin-bottom: 1px;
    }

    .event-meta {
      display: flex;
      gap: 8px;
      font-size: 9px;
      color: #8892A8;
    }
  }

  .event-status {
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 9px;
    flex-shrink: 0;

    &.processing { background: rgba(0,212,255,0.2); color: #00D4FF; }
    &.ongoing { background: rgba(243,156,18,0.2); color: #F39C12; }
    &.control { background: rgba(230,162,60,0.2); color: #E6A23C; }
    &.resolved { background: rgba(103,194,58,0.2); color: #67C23A; }
  }
}

// 避堵路线
.route-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .route-content {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  .route-form {
    display: flex;
    align-items: flex-end;
    gap: 8px;

    .form-item {
      flex: 1;

      label {
        display: block;
        font-size: 9px;
        color: #8892A8;
        margin-bottom: 2px;
      }

      .form-input, .form-select {
        width: 100%;
        padding: 5px 8px;
        background: rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 4px;
        color: #FFFFFF;
        font-size: 11px;
        outline: none;

        &:focus {
          border-color: rgba(0,212,255,0.5);
        }

        &::placeholder {
          color: #8892A8;
        }
      }

      .form-select {
        cursor: pointer;

        option {
          background: #0B0E1A;
          color: #FFFFFF;
        }
      }
    }
  }

  .route-options {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }

    .route-option {
      padding: 8px 10px;
      background: rgba(0,0,0,0.2);
      border-radius: 5px;
      border: 1px solid rgba(255,255,255,0.06);

      &.recommended {
        border-color: rgba(46,204,113,0.3);
        background: rgba(46,204,113,0.05);
      }

      .route-info {
        .route-name {
          font-size: 11px;
          color: #8892A8;
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 6px;

          .recommend-tag {
            padding: 1px 5px;
            background: #2ECC71;
            color: #FFF;
            font-size: 9px;
            border-radius: 3px;
          }
        }

        .route-progress-row {
          display: flex;
          align-items: center;
          gap: 8px;

          .route-time {
            font-size: 14px;
            font-weight: 600;
            color: #FFFFFF;
            font-family: 'DIN Pro', monospace;
            flex-shrink: 0;
            width: 50px;
          }

          .progress-bar {
            flex: 1;
            height: 6px;
            background: rgba(255,255,255,0.1);
            border-radius: 3px;
            overflow: hidden;

            .progress-fill {
              height: 100%;
              border-radius: 3px;
              transition: width 0.3s;
            }
          }

          .route-distance {
            font-size: 11px;
            color: #8892A8;
            flex-shrink: 0;
            width: 50px;
            text-align: right;
          }
        }
      }
    }
  }
}

// 滚动事件动画
@keyframes scrollEvents {
  0%, 15% { transform: translateY(0); }
  20%, 35% { transform: translateY(-40px); }
  40%, 55% { transform: translateY(-80px); }
  60%, 75% { transform: translateY(-120px); }
  80%, 95% { transform: translateY(-160px); }
  100% { transform: translateY(0); }
}

@keyframes pulse {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

// 滚动条样式
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
</style>
