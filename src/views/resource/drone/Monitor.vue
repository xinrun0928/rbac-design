<template>
  <div class="flight-monitor-page">
    <el-card class="table-card animate-item" shadow="never">
      <!-- 顶部统计卡片 -->
      <StatsCards :items="statsCards" :clickable="false" />

      <!-- 操作栏 -->
      <div class="search-bar">
        <h3 class="page-title">无人机飞行监控</h3>
        <div class="search-bar-actions">
          <el-button :icon="Microphone" @click="handleVoiceToggle">声音提示</el-button>
          <el-button type="primary" :icon="Refresh" @click="handleRefresh">刷新数据</el-button>
        </div>
      </div>

      <!-- 主内容区：地图 + 无人机列表 -->
      <div class="main-content">
        <!-- 左侧：地图区域 -->
        <div class="map-section">
          <div class="map-header">
            <span class="map-title">无人机实时定位地图</span>
            <div class="map-legend">
              <span class="legend-item">本地地图底图 / 在线无人机 / 镜头朝向</span>
            </div>
          </div>
          <div class="map-container">
            <div class="map-placeholder">
              <!-- 模拟地图背景 -->
              <div class="map-bg"></div>

              <!-- 无人机标记点 -->
              <div
                v-for="drone in onlineDrones"
                :key="drone.code"
                class="drone-marker"
                :class="{ 'marker-warning': drone.battery < 30, 'marker-alarm': drone.flightStatus === '异常报警' }"
                :style="getMarkerStyle(drone)"
                @click="handleSelectDrone(drone)"
              >
                <div class="marker-dot">
                  <span class="marker-code">{{ drone.code.slice(-3) }}</span>
                </div>
                <div class="marker-label">
                  <div class="label-title">{{ drone.code }}</div>
                  <div class="label-info">高 {{ drone.height }}m / 速 {{ drone.speed }}m/s</div>
                  <div class="label-info">电量 {{ drone.battery }}% / 信号 {{ drone.signal }}%</div>
                  <div class="label-info">镜头 {{ drone.lensDirection }}</div>
                </div>
              </div>

              <!-- 地图信息提示 -->
              <div class="map-tip">
                <el-icon><InfoFilled /></el-icon>
                <span>模拟地图展示，实际部署时接入高德/百度地图API</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：无人机列表 -->
        <div class="drone-list-section">
          <div class="list-header">
            <span class="list-title">无人机列表</span>
            <el-tag
              :type="activeFlightStatus === '正在使用' ? 'primary' : activeFlightStatus === '异常报警' ? 'danger' : 'info'"
              effect="light"
              round
            >{{ activeFlightStatus }} {{ filteredDrones.length }}</el-tag>
          </div>

          <!-- 状态筛选标签页 -->
          <div class="status-tabs">
            <el-radio-group v-model="activeFlightStatus" size="default" class="status-radio-group">
              <el-radio-button value="正在使用">正在使用</el-radio-button>
              <el-radio-button value="未使用">未使用</el-radio-button>
              <el-radio-button value="异常报警">异常报警</el-radio-button>
            </el-radio-group>
          </div>

          <!-- 无人机卡片列表 -->
          <div class="drone-cards">
            <div
              v-for="drone in filteredDrones"
              :key="drone.code"
              class="drone-card"
              :class="{ 'card-selected': selectedDrone?.code === drone.code, 'card-alarm': drone.flightStatus === '异常报警' }"
              @click="handleSelectDrone(drone)"
            >
              <div class="card-header">
                <span class="card-code">{{ drone.code }}</span>
                <el-tag
                  :type="drone.flightStatus === '正在使用' ? 'success' : drone.flightStatus === '异常报警' ? 'danger' : 'info'"
                  effect="light"
                  round
                  size="small"
                >{{ drone.flightStatus }}</el-tag>
              </div>
              <div class="card-body">
                <div class="card-model">{{ drone.modelName }} / {{ drone.area }}</div>
                <div class="card-telemetry">
                  <span>电量 <b :class="{ 'text-danger': drone.battery < 30 }">{{ drone.battery }}%</b>；</span>
                  <span>高度 {{ drone.height }}m；</span>
                  <span>速度 {{ drone.speed }}m/s；</span>
                  <span>信号 <b :class="{ 'text-danger': drone.signal < 30 }">{{ drone.signal }}%</b>；</span>
                  <span>镜头 {{ drone.lensDirection }}</span>
                </div>
                <div v-if="drone.alarmInfo" class="card-alarm-info">
                  <el-icon><WarningFilled /></el-icon>
                  {{ drone.alarmInfo }}
                </div>
              </div>
            </div>

            <div v-if="filteredDrones.length === 0" class="empty-tip">
              <el-empty description="暂无数据" :image-size="80" />
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 无人机详情抽屉 -->
    <DroneDetailDrawer
      v-model:visible="drawerVisible"
      :detail="selectedFlightDetail"
      @control="handleOpenControl"
    />

    <!-- 无人机控制对话框 -->
    <DroneControlDialog
      v-model:visible="controlVisible"
      :detail="selectedFlightDetail"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Microphone, Refresh, InfoFilled, WarningFilled, Location, Timer, Odometer, Bell, CircleCheck } from '@element-plus/icons-vue'
import { droneTelemetryData, droneFlightDetailMap } from '@/mock/resource/droneData'
import type { DroneTelemetry, DroneFlightDetail, FlightStatus } from '@/types/resource/drone'
import StatsCards from '@/components/StatsCards.vue'
import DroneDetailDrawer from './DroneDetailDrawer.vue'
import DroneControlDialog from '@/components/DroneControlDialog.vue'

// ── 状态 ──
const voiceEnabled = ref(true)
const activeFlightStatus = ref<FlightStatus>('正在使用')
const selectedDrone = ref<DroneTelemetry | null>(null)
const selectedFlightDetail = ref<DroneFlightDetail | null>(null)
const drawerVisible = ref(false)
const controlVisible = ref(false)
const drones = ref<DroneTelemetry[]>([...droneTelemetryData])

// ── 计算属性 ──
const onlineDrones = computed(() => drones.value.filter(d => d.flightStatus === '正在使用'))
const flyingCount = computed(() => onlineDrones.value.length)
const alarmDrones = computed(() => drones.value.filter(d => d.flightStatus === '异常报警'))

const avgHeight = computed(() => {
  const flying = onlineDrones.value
  if (flying.length === 0) return 0
  return Math.round(flying.reduce((sum, d) => sum + d.height, 0) / flying.length)
})

const avgSpeed = computed(() => {
  const flying = onlineDrones.value
  if (flying.length === 0) return 0
  return Math.round(flying.reduce((sum, d) => sum + d.speed, 0) / flying.length)
})

const filteredDrones = computed(() => {
  return drones.value.filter(d => d.flightStatus === activeFlightStatus.value)
})

// ── 统计卡片 ──
const statsCards = computed(() => [
  {
    key: 'online',
    label: '在线无人机',
    value: flyingCount.value,
    icon: Location,
    color: '#409EFF',
    bgColor: '#ecf5ff',
  },
  {
    key: 'height',
    label: '平均高度',
    value: `${avgHeight.value}m`,
    icon: Odometer,
    color: '#67C23A',
    bgColor: '#f0f9eb',
  },
  {
    key: 'speed',
    label: '平均速度',
    value: `${avgSpeed.value}m/s`,
    icon: Timer,
    color: '#E6A23C',
    bgColor: '#fdf6ec',
  },
  {
    key: 'alarm',
    label: '异常报警',
    value: alarmDrones.value.length,
    icon: Bell,
    color: '#F56C6C',
    bgColor: '#fef0f0',
  },
  {
    key: 'fence',
    label: '电子围栏',
    value: 1,
    icon: CircleCheck,
    color: '#909399',
    bgColor: '#f4f4f5',
  },
])

// ── 方法 ──
function handleVoiceToggle() {
  ElMessage.success('已触发声音提示：异常报警已提醒')
}

function handleRefresh() {
  drones.value = drones.value.map(d => ({
    ...d,
    battery: Math.max(5, d.battery + Math.floor(Math.random() * 10 - 5)),
    height: d.flightStatus === '正在使用' ? Math.max(50, d.height + Math.floor(Math.random() * 20 - 10)) : d.height,
    speed: d.flightStatus === '正在使用' ? Math.max(5, d.speed + Math.floor(Math.random() * 6 - 3)) : d.speed,
    signal: Math.max(5, Math.min(100, d.signal + Math.floor(Math.random() * 10 - 5))),
  }))
  ElMessage.success('飞行监测数据已刷新')
}

function handleSelectDrone(drone: DroneTelemetry) {
  selectedDrone.value = drone
  selectedFlightDetail.value = droneFlightDetailMap[drone.code] || null
  drawerVisible.value = true
}

function handleOpenControl() {
  controlVisible.value = true
}

function getMarkerStyle(drone: DroneTelemetry) {
  // 根据GPS坐标模拟地图位置（简化映射）
  const baseX = 15
  const baseY = 20
  const x = baseX + (drone.lng - 113.24) * 800
  const y = baseY + (23.18 - drone.lat) * 800
  return {
    left: `${Math.max(5, Math.min(85, x))}%`,
    top: `${Math.max(5, Math.min(85, y))}%`,
  }
}
</script>

<style lang="scss" scoped>
.flight-monitor-page {
  padding: 16px;
  background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;

  .animate-item {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;
  }

  .table-card {
    border-radius: 12px;
    border: none;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    :deep(.el-card__body) {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow-y: auto;
    }
  }
}

// ── 搜索栏 ──
.search-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;

  .page-title {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #303133;
  }
}

.search-bar-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 10px;
}

// ── 主内容区 ──
.main-content {
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
}

// ── 地图区域 ──
.map-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.map-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.map-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  padding-left: 10px;
  border-left: 3px solid #409eff;
}

.map-legend {
  font-size: 12px;
  color: #909399;
}

.map-container {
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ebeef5;
}

.map-placeholder {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
  overflow: hidden;
}

.map-bg {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, #1a3a2a 0%, #2d5a3d 30%, #1a4a3a 60%, #0d2b1f 100%);
  background-size: cover;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px),
      repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.03) 40px, rgba(255,255,255,0.03) 41px);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 30% 40%, rgba(64,158,255,0.1) 0%, transparent 50%),
      radial-gradient(circle at 70% 60%, rgba(103,194,58,0.08) 0%, transparent 40%);
  }
}

// ── 无人机标记 ──
.drone-marker {
  position: absolute;
  z-index: 10;
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;

  &:hover {
    z-index: 20;
    transform: translate(-50%, -50%) scale(1.1);

    .marker-label {
      opacity: 1;
      visibility: visible;
    }
  }
}

.marker-dot {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409EFF, #79bbff);
  border: 2px solid #fff;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #fff;
  }
}

.marker-code {
  font-size: 11px;
  font-weight: 700;
  color: #fff;
}

.marker-label {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  pointer-events: none;

  .label-title {
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .label-info {
    font-size: 12px;
    color: #ccc;
    line-height: 1.6;
  }
}

.marker-warning .marker-dot {
  background: linear-gradient(135deg, #E6A23C, #f0c78a);
  box-shadow: 0 2px 12px rgba(230, 162, 60, 0.4);
}

.marker-alarm .marker-dot {
  background: linear-gradient(135deg, #F56C6C, #f89898);
  box-shadow: 0 2px 12px rgba(245, 108, 108, 0.4);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 2px 12px rgba(245, 108, 108, 0.4); }
  50% { box-shadow: 0 2px 20px rgba(245, 108, 108, 0.7); }
}

.map-tip {
  position: absolute;
  bottom: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
}

// ── 无人机列表 ──
.drone-list-section {
  width: 340px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  background: #fafafa;
}

.list-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.status-tabs {
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
}

.status-radio-group {
  display: flex;
  width: 100%;

  :deep(.el-radio-button) {
    flex: 1;

    .el-radio-button__inner {
      width: 100%;
      text-align: center;
    }
  }
}

.drone-cards {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.drone-card {
  padding: 14px 16px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    border-color: #409eff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
  }

  &.card-selected {
    border-color: #409eff;
    background: #f0f7ff;
  }

  &.card-alarm {
    border-color: #F56C6C;
    background: #fff5f5;
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-code {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.card-body {
  font-size: 13px;
  color: #606266;
  line-height: 1.8;
}

.card-model {
  color: #909399;
  margin-bottom: 4px;
}

.card-telemetry {
  span {
    white-space: nowrap;
  }

  b {
    font-weight: 600;
  }
}

.text-danger {
  color: #F56C6C !important;
  font-weight: 600 !important;
}

.card-alarm-info {
  margin-top: 8px;
  padding: 6px 10px;
  background: #fef0f0;
  border-radius: 4px;
  color: #F56C6C;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.empty-tip {
  padding: 40px 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
