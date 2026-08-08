<template>
  <div class="screen-page">
    <!-- ========== 顶部 Header ========== -->
    <div class="top-bar">
      <div class="back-btn" @click="goBack">
        <el-icon :size="18"><ArrowLeft /></el-icon>
        <span>返回</span>
      </div>
      <div class="page-title">
        <span class="title-cn">交通态势分析</span>
        <span class="title-en">Traffic Situation Analysis</span>
      </div>
      <div class="top-time">
        <div class="time-value">{{ currentTime }}</div>
        <div class="date-value">{{ currentDate }}</div>
      </div>
    </div>

    <!-- ========== 主体：4×3 网格布局 ========== -->
    <!--
      行1: [左上：实时交通指标] [中上：地图(跨2行)         ] [右上：今日车流量趋势]
      行2: [左中：数据来源]    [...                       ] [右中：近七天趋势]
      行3: [左下：车流量TOP10] [中下：道路占有率分布      ] [右下：事件列表]
      行4: [左下2：车流量分布] [中下2：事件时空分布(近7天)] (列表跨行)
    -->
    <div class="body-grid">
      <!-- ========== 左列 ========== -->
      <!-- 1-1 左上：实时交通指标 -->
      <section class="panel cell-r1c1">
        <div class="panel-header">
          <h3>实时交通指标</h3>
          <span class="live-tag">LIVE</span>
        </div>
        <div class="metrics-body">
          <div class="metric">
            <div class="metric-label">车流量</div>
            <div class="metric-value">{{ metrics.flow }}</div>
            <div class="metric-unit">辆/小时</div>
          </div>
          <div class="metric">
            <div class="metric-label">道路占有率</div>
            <div class="metric-value">{{ metrics.occupancy }}<span class="pct">%</span></div>
            <div class="metric-sub">较昨日 ↑ 2.3%</div>
          </div>
          <div class="metric">
            <div class="metric-label">拥堵路段</div>
            <div class="metric-value warn">{{ metrics.congestionRoads }}</div>
            <div class="metric-unit">段</div>
          </div>
          <div class="update-time">更新时间：{{ currentTime }}</div>
        </div>
      </section>

      <!-- 2-1 左中：数据来源（独立卡片） -->
      <section class="panel cell-r2c1">
        <div class="panel-header">
          <h3>数据来源</h3>
        </div>
        <div class="data-source-list">
          <div class="src-item">
            <el-icon :size="14" color="#2ECC71"><VideoCamera /></el-icon>
            <span>雷达监测</span>
            <span class="src-status online">在线</span>
          </div>
          <div class="src-item">
            <el-icon :size="14" color="#2ECC71"><VideoPlay /></el-icon>
            <span>视频监控</span>
            <span class="src-status online">在线</span>
          </div>
          <div class="src-item">
            <el-icon :size="14" color="#F1C40F"><Cellphone /></el-icon>
            <span>移动终端</span>
            <span class="src-status normal">正常</span>
          </div>
          <div class="src-item">
            <el-icon :size="14" color="#2ECC71"><Location /></el-icon>
            <span>导航软件</span>
            <span class="src-status online">在线</span>
          </div>
        </div>
      </section>

      <!-- 3-1 左下：TOP10 排行榜 -->
      <section class="panel cell-r3c1">
        <div class="panel-header">
          <h3>车流量 TOP10</h3>
          <span class="header-sub">本日累计</span>
        </div>
        <div class="rank-list">
          <div v-for="(item, idx) in top10Roads" :key="item.name" class="rank-row">
            <span :class="['rank-no', `rank-no-${idx + 1}`]">{{ idx + 1 }}</span>
            <span class="rank-name" :title="item.name">{{ item.name }}</span>
            <div class="rank-bar">
              <div class="rank-bar-fill" :style="{ width: item.pct + '%' }"></div>
            </div>
            <span class="rank-value">{{ item.flow }}</span>
          </div>
        </div>
      </section>

      <!-- 4-1 左下2：车流量分布环形图 -->
      <section class="panel cell-r4c1">
        <div class="panel-header">
          <h3>车流量分布占比</h3>
        </div>
        <div ref="flowDistChartRef" class="ring-chart"></div>
      </section>

      <!-- ========== 中列 ========== -->
      <!-- 1-2 中上：地图（跨3行） -->
      <section class="panel cell-r1c2 map-cell">
        <div class="panel-header">
          <h3>区域地图 - 车流量热力图</h3>
          <div class="map-controls">
            <button v-for="m in mapModes" :key="m.key" :class="['mode-btn', { active: currentMapMode === m.key }]" @click="currentMapMode = m.key">
              {{ m.label }}
            </button>
          </div>
        </div>
        <div ref="map3DRef" class="map3d"></div>
        <div class="map-timeline">
          <div class="timeline-label">时间：{{ playHour }}:00</div>
          <div class="timeline-track">
            <div class="timeline-progress" :style="{ left: (playHour / 24 * 100) + '%' }"></div>
            <input v-model.number="playHour" type="range" min="0" max="24" step="1" class="timeline-range" />
          </div>
          <div class="timeline-axis">
            <span v-for="h in 25" :key="h">{{ h - 1 }}</span>
          </div>
          <div class="map-legend">
            <span class="legend-item"><span class="dot" style="background:#E74C3C"></span>极高</span>
            <span class="legend-item"><span class="dot" style="background:#F39C12"></span>高</span>
            <span class="legend-item"><span class="dot" style="background:#F1C40F"></span>中</span>
            <span class="legend-item"><span class="dot" style="background:#2ECC71"></span>低</span>
          </div>
        </div>
      </section>

      <!-- 中下：道路占有率分布 + 事件时空分布 左右并排 -->
      <section class="cell-r3c2">
        <div class="map-bottom-row">
          <div class="panel sub-panel">
            <div class="panel-header">
              <h3>道路占有率分布</h3>
            </div>
            <div ref="occupyDistChartRef" class="ring-chart"></div>
          </div>
          <div class="panel sub-panel">
            <div class="panel-header">
              <h3>事件时空分布（近7天）</h3>
              <span class="header-sub">事故 18 · 拥堵 32 · 施工 6</span>
            </div>
            <div ref="eventMapRef" class="event-map"></div>
          </div>
        </div>
      </section>

      <!-- ========== 右列 ========== -->
      <!-- 1-3 右上：今日车流量趋势 -->
      <section class="panel cell-r1c3">
        <div class="panel-header">
          <h3>今日车流量趋势</h3>
          <span class="header-sub">单位：辆/小时</span>
        </div>
        <div ref="todayChartRef" class="line-chart"></div>
        <div class="chart-stat">
          <div class="stat-block">
            <div class="stat-num">3,856</div>
            <div class="stat-label">峰值（08:00）</div>
          </div>
          <div class="stat-block">
            <div class="stat-num">3,102</div>
            <div class="stat-label">谷值（03:00）</div>
          </div>
        </div>
      </section>

      <!-- 2-3 右中：近七天车流量趋势 -->
      <section class="panel cell-r2c3">
        <div class="panel-header">
          <h3>近七天车流量趋势</h3>
          <span class="header-sub">2026-05-14 ~ 2026-05-20</span>
        </div>
        <div ref="weekChartRef" class="line-chart"></div>
        <div class="chart-stat">
          <div class="stat-block">
            <div class="stat-num">28,560</div>
            <div class="stat-label">本周日均</div>
          </div>
          <div class="stat-block good">
            <div class="stat-num">↑ 6.8%</div>
            <div class="stat-label">较上周</div>
          </div>
        </div>
      </section>

      <!-- 3-3 右下：事件列表 -->
      <section class="panel cell-r3c3">
        <div class="panel-header">
          <h3>事件列表（今日）</h3>
          <span class="header-sub">{{ todayEvents.length }} 起</span>
        </div>
        <div class="event-table">
          <div class="evt-head">
            <span>类型</span>
            <span>路段名称</span>
            <span>状态</span>
          </div>
          <div class="evt-rows">
            <div v-for="(evt, idx) in todayEvents" :key="idx" class="evt-row">
              <span :class="['evt-type', `evt-type-${evt.typeKey}`]">
                <el-icon :size="12"><component :is="evt.icon" /></el-icon>
                {{ evt.type }}
              </span>
              <span class="evt-name">{{ evt.road }}</span>
              <span :class="['evt-status', `evt-status-${evt.statusKey}`]">{{ evt.status }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- ========== 底部 Footer ========== -->
    <div class="footer-bar">
      <span class="footer-item">数据来源：路面监控摄像头、车流量传感器、导航软件、移动终端</span>
      <span class="footer-item">最后更新：{{ currentTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch, shallowRef } from 'vue'
import { ArrowLeft, VideoCamera, VideoPlay, Cellphone, Location, Warning, Tools, Promotion } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

/* ========== 时间 ========== */
const currentTime = ref('')
const currentDate = ref('')
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
  currentDate.value = `${year}-${month}-${day} ${weekDays[now.getDay()]}`
  currentTime.value = `${hours}:${minutes}:${seconds}`
}

/* ========== 返回 ========== */
const goBack = () => window.close()

/* ========== 实时交通指标 ========== */
const metrics = ref({
  flow: 2856,
  occupancy: 58.2,
  congestionRoads: 18
})

/* ========== TOP10 路段 ========== */
const top10Roads = ref([
  { name: 'G4 京港澳高速', flow: 4268, pct: 100 },
  { name: 'G15 沈海高速', flow: 3856, pct: 90 },
  { name: 'S3 广深沿江高速', flow: 3624, pct: 85 },
  { name: 'S81 广州环城高速', flow: 3480, pct: 82 },
  { name: 'G94 珠三角环线', flow: 3126, pct: 73 },
  { name: 'G25 长深高速', flow: 2890, pct: 68 },
  { name: 'G4 京港澳高速 (北段)', flow: 2640, pct: 62 },
  { name: 'S15 广佛高速', flow: 2456, pct: 58 },
  { name: 'G1508 广州绕城高速', flow: 2290, pct: 54 },
  { name: 'S8 广佛肇高速', flow: 2080, pct: 49 }
])

/* ========== 地图模式 ========== */
const mapModes = [
  { key: '3d', label: '3D' },
  { key: '2d', label: '2D' },
  { key: 'events', label: '事件' }
]
const currentMapMode = ref('3d')

/* ========== 时间轴播放 ========== */
const playHour = ref(9)

/* ========== 今日事件列表 ========== */
const todayEvents = [
  { type: '事故', typeKey: 'accident', icon: Warning, road: 'G4 京港澳高速 K1286', status: '处理中', statusKey: 'processing' },
  { type: '拥堵', typeKey: 'congestion', icon: Promotion, road: 'S3 广深沿江高速 K45', status: '处理中', statusKey: 'processing' },
  { type: '施工', typeKey: 'construction', icon: Tools, road: 'G15 沈海高速 K326', status: '进行中', statusKey: 'ongoing' },
  { type: '事故', typeKey: 'accident', icon: Warning, road: 'S81 广州环城高速 K18', status: '已结束', statusKey: 'done' },
  { type: '拥堵', typeKey: 'congestion', icon: Promotion, road: 'G25 长深高速 K89', status: '处理中', statusKey: 'processing' },
  { type: '事故', typeKey: 'accident', icon: Warning, road: 'G94 珠三角环线 K156', status: '已结束', statusKey: 'done' },
  { type: '拥堵', typeKey: 'congestion', icon: Promotion, road: 'S15 广佛高速 K22', status: '处理中', statusKey: 'processing' },
  { type: '施工', typeKey: 'construction', icon: Tools, road: 'G1508 广州绕城 K78', status: '进行中', statusKey: 'ongoing' }
]

/* ========== ECharts 实例（shallowRef 防止深度响应） ========== */
const flowDistChart = shallowRef<echarts.ECharts | null>(null)
const occupyDistChart = shallowRef<echarts.ECharts | null>(null)
const map3D = shallowRef<echarts.ECharts | null>(null)
const eventMap = shallowRef<echarts.ECharts | null>(null)
const todayChart = shallowRef<echarts.ECharts | null>(null)
const weekChart = shallowRef<echarts.ECharts | null>(null)

const flowDistChartRef = ref<HTMLElement>()
const occupyDistChartRef = ref<HTMLElement>()
const map3DRef = ref<HTMLElement>()
const eventMapRef = ref<HTMLElement>()
const todayChartRef = ref<HTMLElement>()
const weekChartRef = ref<HTMLElement>()

/* ========== 车流量分布环形图 ========== */
const initFlowDistChart = () => {
  if (!flowDistChartRef.value) return
  const { width, height } = flowDistChartRef.value.getBoundingClientRect()
  if (width === 0 || height === 0) return
  flowDistChart.value = echarts.init(flowDistChartRef.value)

  const data = [
    { name: '0-500', value: 12.6, color: '#2ECC71' },
    { name: '500-1000', value: 22.8, color: '#F1C40F' },
    { name: '1000-2000', value: 28.7, color: '#00D4FF' },
    { name: '2000-3000', value: 21.3, color: '#F39C12' },
    { name: '>3000', value: 14.6, color: '#E74C3C' }
  ]

  flowDistChart.value.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', formatter: '{b}: {c}%', textStyle: { color: '#fff', fontSize: 11 } },
    legend: {
      orient: 'vertical',
      right: 4,
      top: 'middle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { color: '#8892A8', fontSize: 10 },
      formatter: (name: string) => {
        const item = data.find(d => d.name === name)
        return `${name}  ${item?.value}%`
      }
    },
    series: [
      {
        name: '车流量分布',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['38%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderColor: '#0B0E1A',
          borderWidth: 2
        },
        label: { show: false },
        labelLine: { show: false },
        data: data.map(d => ({ name: d.name, value: d.value, itemStyle: { color: d.color } }))
      }
    ]
  })
}

/* ========== 道路占有率环形图 ========== */
const initOccupyDistChart = () => {
  if (!occupyDistChartRef.value) return
  const { width, height } = occupyDistChartRef.value.getBoundingClientRect()
  if (width === 0 || height === 0) return
  occupyDistChart.value = echarts.init(occupyDistChartRef.value)

  const data = [
    { name: '0-20%', value: 8.2, color: '#2ECC71' },
    { name: '20-40%', value: 19.7, color: '#9FE6B8' },
    { name: '40-60%', value: 32.6, color: '#00D4FF' },
    { name: '60-80%', value: 26.8, color: '#F39C12' },
    { name: '>80%', value: 12.7, color: '#E74C3C' }
  ]

  occupyDistChart.value.setOption({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', formatter: '{b}: {c}%', textStyle: { color: '#fff', fontSize: 11 } },
    legend: {
      orient: 'vertical',
      right: 4,
      top: 'middle',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { color: '#8892A8', fontSize: 10 },
      formatter: (name: string) => {
        const item = data.find(d => d.name === name)
        return `${name}  ${item?.value}%`
      }
    },
    series: [
      {
        name: '道路占有率',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['38%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderColor: '#0B0E1A',
          borderWidth: 2
        },
        label: { show: false },
        labelLine: { show: false },
        data: data.map(d => ({ name: d.name, value: d.value, itemStyle: { color: d.color } }))
      }
    ]
  })
}

/* ========== 3D 地图（地图热力） ========== */
const initMap3D = () => {
  if (!map3DRef.value) return
  const { width, height } = map3DRef.value.getBoundingClientRect()
  if (width === 0 || height === 0) return
  map3D.value = echarts.init(map3DRef.value)

  // 珠三角 8 个城市坐标（模拟平面）
  const cities = [
    { name: '广州', value: [50, 50], level: 5 },
    { name: '佛山', value: [25, 55], level: 4 },
    { name: '深圳', value: [85, 60], level: 5 },
    { name: '东莞', value: [70, 50], level: 4 },
    { name: '惠州', value: [85, 30], level: 3 },
    { name: '中山', value: [38, 75], level: 3 },
    { name: '珠海', value: [40, 88], level: 2 },
    { name: '江门', value: [20, 75], level: 2 }
  ]

  // 道路线
  const roads = [
    { coords: [[25, 55], [50, 50]], name: 'G15 沈海高速' },
    { coords: [[50, 50], [85, 60]], name: 'S3 广深沿江' },
    { coords: [[25, 55], [85, 30]], name: 'G4 京港澳高速' },
    { coords: [[50, 50], [85, 30]], name: 'G94 珠三角环线' },
    { coords: [[38, 75], [70, 50]], name: 'S15 广佛高速' },
    { coords: [[40, 88], [85, 60]], name: 'G94 西部沿海' },
    { coords: [[20, 75], [38, 75]], name: 'G2518 深岑高速' },
    { coords: [[50, 50], [70, 50]], name: 'G15 广深高速' },
    { coords: [[38, 75], [50, 50]], name: 'S39 番莞高速' },
    { coords: [[20, 75], [25, 55]], name: 'S49 新台高速' }
  ]

  // 车流量散点（热力）
  const flowPoints = [
    { value: [50, 50], size: 24, level: 5 },  // 广州中心 - 极高
    { value: [55, 48], size: 18, level: 4 },
    { value: [60, 55], size: 16, level: 4 },
    { value: [70, 50], size: 20, level: 4 },  // 东莞 - 高
    { value: [25, 55], size: 14, level: 3 },  // 佛山 - 中
    { value: [38, 75], size: 12, level: 3 },  // 中山 - 中
    { value: [85, 60], size: 22, level: 5 },  // 深圳 - 极高
    { value: [80, 55], size: 16, level: 4 },
    { value: [90, 65], size: 14, level: 3 },
    { value: [85, 30], size: 10, level: 2 },  // 惠州 - 低
    { value: [40, 88], size: 8, level: 2 },   // 珠海 - 低
    { value: [20, 75], size: 8, level: 2 },   // 江门 - 低
    { value: [48, 45], size: 14, level: 4 },
    { value: [52, 60], size: 12, level: 3 },
    { value: [75, 45], size: 14, level: 4 }
  ]

  // 当前时间点的热度颜色映射
  const getColor = (level: number) => {
    if (level >= 5) return '#E74C3C'
    if (level >= 4) return '#F39C12'
    if (level >= 3) return '#F1C40F'
    return '#2ECC71'
  }

  // 当前播放时间点影响热度
  const timeFactor = playHour.value >= 7 && playHour.value <= 10 ? 1
    : playHour.value >= 17 && playHour.value <= 20 ? 1.2
    : playHour.value >= 0 && playHour.value <= 6 ? 0.5 : 0.8

  const renderMap = () => {
    map3D.value?.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0, 30, 60, 0.95)',
        borderColor: '#00D4FF',
        borderWidth: 1,
        textStyle: { color: '#fff', fontSize: 12 }
      },
      xAxis: { type: 'value', min: 0, max: 100, show: false },
      yAxis: { type: 'value', min: 0, max: 100, show: false, inverse: false },
      grid: { left: 0, right: 0, top: 0, bottom: 30, containLabel: false },
      series: [
        // 热力图（基于当前 playHour 调整半径）
        {
          type: 'heatmap',
          coordinateSystem: 'cartesian2d',
          z: 1,
          data: flowPoints.map(p => {
            const v = Math.round(p.level * timeFactor * 20)
            return [p.value[0], p.value[1], Math.min(v, 100)]
          }),
          pointSize: 28,
          blurSize: 36,
          minOpacity: 0.3,
          maxOpacity: 0.9,
          itemStyle: {
            color: (params: any) => {
              const v = params.data[2]
              if (v >= 80) return '#E74C3C'
              if (v >= 60) return '#F39C12'
              if (v >= 40) return '#F1C40F'
              return '#2ECC71'
            }
          }
        },
        // 道路线
        {
          type: 'lines',
          coordinateSystem: 'cartesian2d',
          z: 2,
          silent: true,
          lineStyle: {
            color: '#00D4FF',
            width: 2,
            opacity: 0.6
          },
          data: roads.map(r => ({ coords: r.coords, name: r.name })),
          label: {
            show: true,
            position: 'middle',
            formatter: (params: any) => params.data.name,
            color: '#7BB8FF',
            fontSize: 9,
            opacity: 0.6
          }
        },
        // 城市标记
        {
          type: 'effectScatter',
          z: 3,
          coordinateSystem: 'cartesian2d',
          rippleEffect: { brushType: 'stroke', scale: 3, period: 4 },
          symbol: 'circle',
          symbolSize: (val: any) => 4 + val[2] * 1.2,
          itemStyle: {
            color: (params: any) => getColor(params.value[2]),
            shadowBlur: 12,
            shadowColor: (params: any) => getColor(params.value[2])
          },
          label: {
            show: true,
            position: 'right',
            distance: 6,
            color: '#fff',
            fontSize: 11,
            fontWeight: 600,
            formatter: (p: any) => p.name
          },
          data: cities.map(c => ({ name: c.name, value: [c.value[0], c.value[1], c.level] }))
        }
      ]
    })
  }

  renderMap()

  // 监听时间轴变化
  watch(playHour, () => {
    renderMap()
  })
}

/* ========== 事件时空分布小地图 ========== */
const initEventMap = () => {
  if (!eventMapRef.value) return
  const { width, height } = eventMapRef.value.getBoundingClientRect()
  if (width === 0 || height === 0) return
  eventMap.value = echarts.init(eventMapRef.value)

  // 按 7 天 × 24 小时分布事件点
  const points: { value: [number, number, number]; type: string }[] = []
  const days = 7
  const types = ['accident', 'congestion', 'construction']

  for (let i = 0; i < 60; i++) {
    const day = Math.floor(Math.random() * days)
    const hour = Math.floor(Math.random() * 24)
    const x = (day / (days - 1)) * 100
    const y = (hour / 23) * 100
    const type = types[Math.floor(Math.random() * types.length)]
    points.push({ value: [x, y, day], type })
  }

  eventMap.value.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (p: any) => {
        const typeMap: Record<string, string> = {
          accident: '事故',
          congestion: '拥堵',
          construction: '施工'
        }
        return `类型: ${typeMap[p.data.type] || '未知'}`
      },
      textStyle: { color: '#fff', fontSize: 11 }
    },
    grid: { left: 30, right: 16, top: 16, bottom: 28 },
    xAxis: {
      type: 'value',
      min: 0,
      max: 100,
      splitNumber: 7,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#8892A8', fontSize: 9, formatter: (v: number) => {
        const d = Math.round((v / 100) * 6) + 14
        return `05-${d}`
      } },
      splitLine: { show: true, lineStyle: { color: 'rgba(255,255,255,0.04)' } }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      splitNumber: 6,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#8892A8', fontSize: 9, formatter: (v: number) => Math.round((v / 100) * 23) + '时' },
      splitLine: { show: true, lineStyle: { color: 'rgba(255,255,255,0.04)' } }
    },
    series: [
      {
        type: 'scatter',
        symbolSize: (val: any) => (val[2] < 2 ? 10 : 8),
        itemStyle: {
          color: (params: any) => {
            const t = params.data.type
            if (t === 'accident') return '#E74C3C'
            if (t === 'congestion') return '#F39C12'
            return '#9B59B6'
          },
          shadowBlur: 8,
          shadowColor: (params: any) => {
            const t = params.data.type
            if (t === 'accident') return 'rgba(231, 76, 60, 0.5)'
            if (t === 'congestion') return 'rgba(243, 156, 18, 0.5)'
            return 'rgba(155, 89, 182, 0.5)'
          },
          opacity: 0.8
        },
        data: points.map(p => ({ value: p.value, type: p.type }))
      }
    ]
  })
}

/* ========== 今日车流量趋势图 ========== */
const initTodayChart = () => {
  if (!todayChartRef.value) return
  const { width, height } = todayChartRef.value.getBoundingClientRect()
  if (width === 0 || height === 0) return
  todayChart.value = echarts.init(todayChartRef.value)

  const hours = Array.from({ length: 25 }, (_, i) => i)
  const data = [0, 280, 540, 860, 1240, 1860, 2480, 3120, 3856, 3680, 3420, 3160, 2900, 2640, 2380, 2120, 1860, 2200, 2680, 2980, 3120, 2640, 1820, 980, 420]

  // 找到峰值点
  const peakIdx = data.indexOf(Math.max(...data))
  const peakData = data.map((v, i) => i === peakIdx ? v : null)

  todayChart.value.setOption({
    backgroundColor: 'transparent',
    grid: { left: 38, right: 16, top: 16, bottom: 26 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 30, 60, 0.95)',
      borderColor: '#00D4FF',
      borderWidth: 1,
      textStyle: { color: '#fff', fontSize: 11 },
      formatter: (p: any) => {
        if (!p || !p.length) return ''
        const point = p[0]
        return `${String(point.name).padStart(2, '0')}:00<br/>车流量：<b style="color:#00D4FF">${point.value}</b> 辆`
      }
    },
    xAxis: {
      type: 'category',
      data: hours,
      boundaryGap: false,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisTick: { show: false },
      axisLabel: {
        color: '#8892A8',
        fontSize: 9,
        interval: 3,
        formatter: (v: string) => v.padStart(2, '0') + ':00'
      }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } },
      axisLabel: {
        color: '#8892A8',
        fontSize: 9,
        formatter: (v: number) => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v
      }
    },
    series: [
      {
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: true,
        lineStyle: { color: '#00D4FF', width: 2, shadowColor: 'rgba(0,212,255,0.6)', shadowBlur: 8 },
        itemStyle: { color: '#00D4FF', borderColor: '#fff', borderWidth: 1 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 212, 255, 0.45)' },
            { offset: 1, color: 'rgba(0, 212, 255, 0.02)' }
          ])
        },
        emphasis: {
          focus: 'series',
          scale: 1.6,
          itemStyle: { color: '#fff', borderColor: '#00D4FF', borderWidth: 2, shadowBlur: 12, shadowColor: '#00D4FF' }
        },
        data,
        markPoint: {
          symbol: 'pin',
          symbolSize: 50,
          data: [{ name: '峰值', value: data[peakIdx], xAxis: peakIdx, yAxis: data[peakIdx], itemStyle: { color: '#E74C3C' } }],
          label: { color: '#fff', fontSize: 10, fontWeight: 600, formatter: (p: any) => p.value }
        },
        markLine: {
          symbol: 'none',
          silent: true,
          lineStyle: { color: 'rgba(231, 76, 60, 0.4)', type: 'dashed', width: 1 },
          data: [{ yAxis: data[peakIdx] }]
        }
      }
    ]
  })
}

/* ========== 近七天车流量趋势图 ========== */
const initWeekChart = () => {
  if (!weekChartRef.value) return
  const { width, height } = weekChartRef.value.getBoundingClientRect()
  if (width === 0 || height === 0) return
  weekChart.value = echarts.init(weekChartRef.value)

  const dates = ['05-14', '05-15', '05-16', '05-17', '05-18', '05-19', '05-20']
  const today = [0, 280, 540, 860, 1240, 1860, 2480, 3120, 3856, 3680, 3420, 3160, 2900, 2640, 2380, 2120, 1860, 2200, 2680, 2980, 3120, 2640, 1820, 980, 420]
  const yesterday = [0, 240, 480, 780, 1180, 1760, 2380, 2980, 3650, 3520, 3260, 3020, 2780, 2540, 2280, 2040, 1820, 2080, 2520, 2820, 2960, 2540, 1740, 920, 380]
  const avg = today.map((v, i) => Math.round((v + yesterday[i]) / 2))

  // 7天总览：取每天峰值
  const dayPeak = today.filter((_, i) => true)
  const weekTotal = [24860, 26120, 25340, 27960, 29820, 28560, 31280]

  weekChart.value.setOption({
    backgroundColor: 'transparent',
    grid: { left: 38, right: 16, top: 28, bottom: 24 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 30, 60, 0.95)',
      borderColor: '#00D4FF',
      borderWidth: 1,
      textStyle: { color: '#fff', fontSize: 11 },
      axisPointer: { type: 'cross', lineStyle: { color: 'rgba(0,212,255,0.4)' } },
      formatter: (p: any) => {
        if (!p || !p.length) return ''
        const date = p[0].name
        const lines = [`<b style="color:#00D4FF">${date}</b>`]
        p.forEach((it: any) => {
          lines.push(`${it.marker}${it.seriesName}：${it.value}`)
        })
        return lines.join('<br/>')
      }
    },
    legend: {
      data: ['今日', '昨日', '日均'],
      top: 0,
      right: 0,
      textStyle: { color: '#8892A8', fontSize: 10 },
      itemWidth: 14,
      itemHeight: 6,
      itemGap: 8
    },
    xAxis: {
      type: 'category',
      data: dates,
      boundaryGap: false,
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      axisTick: { show: false },
      axisLabel: { color: '#8892A8', fontSize: 9 }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.04)' } },
      axisLabel: {
        color: '#8892A8',
        fontSize: 9,
        formatter: (v: number) => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v
      }
    },
    series: [
      {
        name: '今日',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: { color: '#00D4FF', width: 2, shadowColor: 'rgba(0,212,255,0.5)', shadowBlur: 6 },
        itemStyle: { color: '#00D4FF', borderColor: '#fff', borderWidth: 1 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(0, 212, 255, 0.35)' },
            { offset: 1, color: 'rgba(0, 212, 255, 0.02)' }
          ])
        },
        emphasis: { focus: 'series', scale: 1.5 },
        data: today
      },
      {
        name: '昨日',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: { color: '#F39C12', width: 2 },
        itemStyle: { color: '#F39C12', borderColor: '#fff', borderWidth: 1 },
        emphasis: { focus: 'series', scale: 1.5 },
        data: yesterday
      },
      {
        name: '日均',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: { color: '#9B59B6', width: 2, type: 'dashed' },
        itemStyle: { color: '#9B59B6' },
        emphasis: { focus: 'series', scale: 1.5 },
        data: avg
      }
    ]
  })
}

/* ========== 生命周期 ========== */
onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)

  nextTick(() => {
    setTimeout(() => {
      initFlowDistChart()
      initOccupyDistChart()
      initMap3D()
      initEventMap()
      initTodayChart()
      initWeekChart()
    }, 200)
  })

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  window.removeEventListener('resize', handleResize)
  ;[flowDistChart, occupyDistChart, map3D, eventMap, todayChart, weekChart].forEach(c => c.value?.dispose())
})

const handleResize = () => {
  flowDistChart.value?.resize()
  occupyDistChart.value?.resize()
  map3D.value?.resize()
  eventMap.value?.resize()
  todayChart.value?.resize()
  weekChart.value?.resize()
}
</script>

<style lang="scss" scoped>
/* ============================================
 * 配色 token
 * ============================================ */
$bg: #0B0E1A;
$panel-bg: rgba(255, 255, 255, 0.04);
$panel-border: rgba(255, 255, 255, 0.08);
$primary: #00D4FF;
$success: #2ECC71;
$warn: #F39C12;
$danger: #E74C3C;
$info: #9B59B6;
$text: #FFFFFF;
$text-sub: #8892A8;

.screen-page {
  position: fixed;
  inset: 0;
  background: $bg;
  background-image:
    radial-gradient(ellipse at 20% 0%, rgba(0, 212, 255, 0.08) 0%, transparent 40%),
    radial-gradient(ellipse at 80% 100%, rgba(155, 89, 182, 0.06) 0%, transparent 40%);
  color: #fff;
  display: grid;
  grid-template-rows: 56px 1fr 28px;
  z-index: 9999;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* ========== 顶部 ========== */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  background: linear-gradient(90deg, rgba(0, 60, 120, 0.4) 0%, rgba(0, 30, 80, 0.4) 50%, rgba(60, 0, 120, 0.4) 100%);
  border-bottom: 1px solid rgba(0, 212, 255, 0.25);

  .back-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.3s;

    &:hover {
      background: rgba(0, 212, 255, 0.25);
    }
  }

  .page-title {
    display: flex;
    align-items: baseline;
    gap: 10px;

    .title-cn {
      font-size: 22px;
      font-weight: 700;
      background: linear-gradient(180deg, #FFFFFF 0%, #00D4FF 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 2px;
    }

    .title-en {
      font-size: 11px;
      color: $text-sub;
      letter-spacing: 1px;
    }
  }

  .top-time {
    text-align: right;

    .time-value {
      font-size: 18px;
      font-weight: 600;
      color: $primary;
      font-family: 'DIN Pro', monospace;
      letter-spacing: 1px;
    }

    .date-value {
      font-size: 11px;
      color: $text-sub;
    }
  }
}

/* ============================================
 * 主体 4×3 网格
 *
 *   col1(320px)   col2(1fr)    col3(360px)
 * r1: 实时指标     3D地图      今日趋势
 * r2: TOP10       (map)       近七天
 * r3: 流量分布     事件时空    事件列表
 * r4: 占有率分布   (map)       (list)
 * ============================================ */
.body-grid {
  display: grid;
  grid-template-columns: 320px 1fr 360px;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  gap: 10px;
  padding: 10px;
  overflow: hidden;
  min-height: 0;

  .cell-r1c1 { grid-area: 1 / 1 / 2 / 2; }
  .cell-r2c1 { grid-area: 2 / 1 / 3 / 2; }
  .cell-r3c1 { grid-area: 3 / 1 / 4 / 2; }
  .cell-r4c1 { grid-area: 4 / 1 / 5 / 2; }

  .cell-r1c2 { grid-area: 1 / 2 / 3 / 3; }
  .cell-r3c2 { grid-area: 3 / 2 / 5 / 3; }

  .cell-r1c3 { grid-area: 1 / 3 / 2 / 4; }
  .cell-r2c3 { grid-area: 2 / 3 / 3 / 4; }
  .cell-r3c3 { grid-area: 3 / 3 / 5 / 4; }
}

/* ========== 面板通用 ========== */
.panel {
  background: $panel-bg;
  border: 1px solid $panel-border;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;

  .panel-header {
    padding: 8px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;

    h3 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 6px;

      &::before {
        content: '';
        width: 3px;
        height: 12px;
        background: $primary;
        border-radius: 2px;
        box-shadow: 0 0 6px rgba(0, 212, 255, 0.6);
      }
    }

    .header-sub {
      font-size: 11px;
      color: $text-sub;
    }

    .live-tag {
      font-size: 10px;
      color: $success;
      padding: 1px 6px;
      background: rgba(46, 204, 113, 0.15);
      border-radius: 3px;
      letter-spacing: 1px;
      animation: liveBlink 1.5s infinite;
    }
  }
}

@keyframes liveBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* ========== 左上：实时交通指标 ========== */
.metrics-body {
  flex: 1;
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: auto;
  min-height: 0;
}

.metric {
  background: linear-gradient(90deg, rgba(0, 212, 255, 0.06) 0%, transparent 100%);
  padding: 8px 10px;
  border-radius: 4px;
  border-left: 2px solid $primary;

  .metric-label {
    font-size: 11px;
    color: $text-sub;
  }

  .metric-value {
    font-size: 24px;
    font-weight: 700;
    font-family: 'DIN Pro', monospace;
    color: $primary;
    line-height: 1.2;
    margin-top: 2px;

    .pct {
      font-size: 14px;
      margin-left: 2px;
      color: $primary;
    }

    &.warn {
      color: $warn;
    }
  }

  .metric-unit {
    font-size: 10px;
    color: $text-sub;
    margin-top: 1px;
  }

  .metric-sub {
    font-size: 10px;
    color: $success;
    margin-top: 1px;
  }
}

.divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  margin: 4px 0;
}

.data-source-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  overflow: auto;
  min-height: 0;
}

.src-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: $text;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;

  .src-status {
    margin-left: auto;
    font-size: 10px;
    padding: 1px 6px;
    border-radius: 3px;

    &.online {
      color: $success;
      background: rgba(46, 204, 113, 0.15);
    }

    &.normal {
      color: $warn;
      background: rgba(241, 196, 15, 0.15);
    }
  }
}

.update-time {
  font-size: 10px;
  color: $text-sub;
  text-align: right;
  margin-top: auto;
  padding-top: 4px;
}

/* ========== 左中：TOP10 排行 ========== */
.rank-list {
  flex: 1;
  overflow: auto;
  padding: 6px 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 0;
}

.rank-row {
  display: grid;
  grid-template-columns: 22px 1fr 60px 40px;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  height: 24px;
}

.rank-no {
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  background: $text-sub;

  &.rank-no-1 { background: $danger; }
  &.rank-no-2 { background: lighten($danger, 8%); }
  &.rank-no-3 { background: lighten($danger, 16%); }
}

.rank-name {
  color: #d6dde6;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-bar {
  position: relative;
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  overflow: hidden;

  .rank-bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.6s ease;
    background: linear-gradient(90deg, $primary, lighten($primary, 10%));
    box-shadow: 0 0 6px rgba(0, 212, 255, 0.5);
  }
}

.rank-value {
  font-family: 'DIN Pro', monospace;
  font-weight: 600;
  font-size: 11px;
  text-align: right;
  color: $primary;
}

/* ========== 环形图（左侧两个） ========== */
.ring-chart {
  flex: 1;
  min-height: 0;
}

/* ========== 中上：地图 ========== */
.map-cell {
  display: flex;
  flex-direction: column;

  .map-controls {
    display: flex;
    gap: 4px;

    .mode-btn {
      padding: 3px 10px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      color: $text-sub;
      font-size: 11px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: rgba(0, 212, 255, 0.15);
      }

      &.active {
        background: $primary;
        color: $bg;
        border-color: $primary;
        font-weight: 600;
      }
    }
  }

  .map3d {
    flex: 1;
    min-height: 0;
  }

  .map-timeline {
    flex-shrink: 0;
    padding: 6px 12px 8px;
    background: rgba(0, 0, 0, 0.25);
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .timeline-label {
    font-size: 11px;
    color: $text-sub;
    margin-bottom: 4px;
  }

  .timeline-track {
    position: relative;
    height: 8px;
    margin-bottom: 4px;

    .timeline-progress {
      position: absolute;
      top: 3px;
      width: 2px;
      height: 14px;
      background: $primary;
      box-shadow: 0 0 6px rgba(0, 212, 255, 0.8);
      pointer-events: none;
      transform: translateX(-1px);
    }

    .timeline-range {
      width: 100%;
      height: 6px;
      -webkit-appearance: none;
      appearance: none;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      outline: none;
      cursor: pointer;

      &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 12px;
        height: 12px;
        background: $primary;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 0 6px rgba(0, 212, 255, 0.6);
      }

      &::-moz-range-thumb {
        width: 12px;
        height: 12px;
        background: $primary;
        border-radius: 50%;
        border: none;
        cursor: pointer;
      }
    }
  }

  .timeline-axis {
    display: flex;
    justify-content: space-between;
    font-size: 9px;
    color: $text-sub;
    margin-top: 2px;
    padding: 0 2px;
  }

  .map-legend {
    display: flex;
    justify-content: center;
    gap: 12px;
    padding-top: 4px;

    .legend-item {
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: 10px;
      color: $text-sub;

      .dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
      }
    }
  }
}

/* ========== 中下：道路占有率分布 + 事件时空分布 左右布局 ========== */
.cell-r3c2 {
  background: transparent;
  border: none;
  padding: 0;
  display: block;
}

.map-bottom-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  height: 100%;
  min-height: 0;
}

.sub-panel {
  height: 100%;
  min-height: 0;
}

/* ========== 中下：事件时空分布 ========== */
.event-map {
  flex: 1;
  min-height: 0;
}

/* ========== 折线图（右上 / 右中） ========== */
.line-chart {
  flex: 1;
  min-height: 0;
}

.chart-stat {
  display: flex;
  justify-content: space-around;
  padding: 6px 12px 8px;
  flex-shrink: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.stat-block {
  text-align: center;

  .stat-num {
    font-size: 16px;
    font-weight: 700;
    font-family: 'DIN Pro', monospace;
    color: $primary;
    line-height: 1.2;
  }

  .stat-label {
    font-size: 10px;
    color: $text-sub;
    margin-top: 1px;
  }

  &.good .stat-num {
    color: $success;
  }
}

/* ========== 右下：事件列表 ========== */
.event-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.evt-head {
  display: grid;
  grid-template-columns: 60px 1fr 70px;
  padding: 8px 12px;
  background: rgba(0, 212, 255, 0.08);
  border-bottom: 1px solid rgba(0, 212, 255, 0.15);
  font-size: 11px;
  color: $primary;
  font-weight: 600;
  text-align: center;
  flex-shrink: 0;
}

.evt-rows {
  flex: 1;
  overflow: auto;
  min-height: 0;
}

.evt-row {
  display: grid;
  grid-template-columns: 60px 1fr 70px;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 11px;
  align-items: center;
  text-align: center;

  &:hover {
    background: rgba(0, 212, 255, 0.04);
  }
}

.evt-type {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  justify-content: center;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;

  &.evt-type-accident {
    color: $danger;
    background: rgba(231, 76, 60, 0.15);
  }

  &.evt-type-congestion {
    color: $warn;
    background: rgba(243, 156, 18, 0.15);
  }

  &.evt-type-construction {
    color: $info;
    background: rgba(155, 89, 182, 0.15);
  }
}

.evt-name {
  color: #d6dde6;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-left: 4px;
}

.evt-status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;

  &.evt-status-processing {
    color: $danger;
    background: rgba(231, 76, 60, 0.15);
    border: 1px solid rgba(231, 76, 60, 0.3);
  }

  &.evt-status-ongoing {
    color: $warn;
    background: rgba(243, 156, 18, 0.15);
    border: 1px solid rgba(243, 156, 18, 0.3);
  }

  &.evt-status-done {
    color: $text-sub;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}

/* ========== 底部 ========== */
.footer-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: rgba(0, 0, 0, 0.4);
  border-top: 1px solid rgba(0, 212, 255, 0.15);
  font-size: 11px;
  color: $text-sub;
  letter-spacing: 0.5px;
}

/* ========== 滚动条 ========== */
.rank-list::-webkit-scrollbar,
.metrics-body::-webkit-scrollbar,
.evt-rows::-webkit-scrollbar {
  width: 4px;
}
.rank-list::-webkit-scrollbar-thumb,
.metrics-body::-webkit-scrollbar-thumb,
.evt-rows::-webkit-scrollbar-thumb {
  background: rgba(0, 212, 255, 0.3);
  border-radius: 2px;
}
.rank-list::-webkit-scrollbar-track,
.metrics-body::-webkit-scrollbar-track,
.evt-rows::-webkit-scrollbar-track {
  background: transparent;
}
</style>