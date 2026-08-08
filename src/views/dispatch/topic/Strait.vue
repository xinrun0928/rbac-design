<template>
  <div class="strait-topic">
    <!-- 顶部操作栏 -->
    <div class="top-bar">
      <div class="top-bar-left">
        <el-button type="primary" :icon="Refresh" circle @click="handlePatrol" title="轮巡巡查" />
        <span class="top-bar-title">海峡办专题视图</span>
      </div>
      <div class="top-bar-right">
        <el-select v-model="dataSource" placeholder="数据来源" size="small" style="width: 140px;">
          <el-option label="全部" value="all" />
          <el-option label="系统导入" value="system" />
          <el-option label="人工上报" value="manual" />
          <el-option label="自动采集" value="auto" />
        </el-select>
      </div>
    </div>

    <!-- 三栏布局主体 -->
    <div class="main-content">
      <!-- 左侧：风险点位列表 -->
      <div class="left-panel">
        <div class="panel-title">风险点位列表</div>

        <!-- 搜索框 -->
        <div class="filter-section">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索风险点名称"
            :prefix-icon="Search"
            size="small"
            clearable
          />
        </div>

        <!-- 类型筛选 -->
        <div class="filter-section">
          <el-select v-model="filterType" placeholder="风险类型" size="small" clearable style="width: 100%;">
            <el-option
              v-for="t in riskTypes"
              :key="t"
              :label="t"
              :value="t"
            />
          </el-select>
        </div>

        <!-- 状态筛选 -->
        <div class="filter-section">
          <el-select v-model="filterStatus" placeholder="状态" size="small" clearable style="width: 100%;">
            <el-option label="处置中" value="处置中" />
            <el-option label="处理中" value="处理中" />
            <el-option label="正常" value="正常" />
            <el-option label="已完成" value="已完成" />
          </el-select>
        </div>

        <!-- 养护单位筛选 -->
        <div class="filter-section">
          <el-select v-model="filterUnit" placeholder="养护单位" size="small" clearable style="width: 100%;">
            <el-option
              v-for="u in managementUnits"
              :key="u"
              :label="u"
              :value="u"
            />
          </el-select>
        </div>

        <!-- 风险点列表 -->
        <div class="risk-list">
          <div
            v-for="point in filteredRiskPoints"
            :key="point.id"
            class="risk-card"
            :class="{ 'risk-card--active': selectedPoint?.id === point.id, [`risk-card--${getRiskLevelClass(point.riskLevel)}`]: true }"
            @click="handlePointClick(point)"
          >
            <div class="risk-card-header">
              <span class="risk-card-name">{{ point.pointName }}</span>
              <el-tag
                :type="getRiskTagType(point.riskLevel)"
                size="small"
                effect="dark"
              >
                {{ point.riskLevel }}
              </el-tag>
            </div>
            <div class="risk-card-info">
              <span class="risk-card-type">{{ point.riskType }}</span>
              <el-tag
                :type="getStatusTagType(point.status)"
                size="small"
                effect="plain"
              >
                {{ point.status }}
              </el-tag>
            </div>
            <div class="risk-card-meta">
              <span>{{ point.managementUnit }}</span>
              <span>{{ point.updateTime }}</span>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="riskPage"
            v-model:page-size="riskPageSize"
            :total="filteredRiskPoints.length"
            :page-sizes="[5, 10, 20]"
            layout="total, sizes, prev, pager, next"
            small
            background
          />
        </div>
      </div>

      <!-- 中间：地图区域 -->
      <div class="center-panel">
        <!-- 地图切换控件 -->
        <div class="map-controls">
          <el-radio-group v-model="mapType" size="small">
            <el-radio-button value="map">地图</el-radio-button>
            <el-radio-button value="satellite">卫星</el-radio-button>
            <el-radio-button value="sea">海图</el-radio-button>
          </el-radio-group>
        </div>

        <!-- 地图占位区域 -->
        <div class="map-area">
          <div class="map-placeholder">
            <div class="map-placeholder-text">
              <el-icon :size="48" color="#909399"><Location /></el-icon>
              <p>{{ mapType === 'map' ? '地图' : mapType === 'satellite' ? '卫星' : '海图' }}加载中...</p>
              <p class="map-hint">风险点位将在地图上标注显示</p>
            </div>

            <!-- 风险点标记模拟 -->
            <div class="map-markers">
              <div
                v-for="point in filteredRiskPoints"
                :key="'marker-' + point.id"
                class="map-marker"
                :class="{ 'map-marker--active': selectedPoint?.id === point.id, [`map-marker--${getRiskLevelClass(point.riskLevel)}`]: true }"
                :style="getMarkerPosition(point)"
                :title="point.pointName"
                @click="handlePointClick(point)"
              >
                <div class="marker-dot" />
                <div class="marker-label">{{ point.pointName.slice(0, 4) }}</div>
              </div>
            </div>
          </div>

          <!-- 风险等级图例 -->
          <div class="map-legend">
            <div class="legend-title">风险等级图例</div>
            <div class="legend-items">
              <div class="legend-item">
                <span class="legend-dot legend-dot--high" />
                <span>高风险</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot legend-dot--medium" />
                <span>中风险</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot legend-dot--low" />
                <span>低风险</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot legend-dot--normal" />
                <span>正常</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 风险点位统计 -->
        <div class="statistics-bar">
          <div class="stat-item">
            <span class="stat-value">{{ statistics.total }}</span>
            <span class="stat-label">风险点总数</span>
          </div>
          <div class="stat-item stat-item--high">
            <span class="stat-value">{{ statistics.highRisk }}</span>
            <span class="stat-label">高风险</span>
          </div>
          <div class="stat-item stat-item--medium">
            <span class="stat-value">{{ statistics.mediumRisk }}</span>
            <span class="stat-label">中风险</span>
          </div>
          <div class="stat-item stat-item--low">
            <span class="stat-value">{{ statistics.lowRisk }}</span>
            <span class="stat-label">低风险</span>
          </div>
          <div class="stat-item stat-item--normal">
            <span class="stat-value">{{ statistics.normal }}</span>
            <span class="stat-label">正常</span>
          </div>
        </div>
      </div>

      <!-- 右侧：监控视频区域 -->
      <div class="right-panel">
        <div class="panel-title">监控视频</div>

        <!-- Tab 切换 -->
        <el-tabs v-model="videoTab" type="card" class="video-tabs">
          <el-tab-pane label="监控" name="monitor" />
          <el-tab-pane label="短视频" name="short" />
          <el-tab-pane label="切片" name="slice" />
        </el-tabs>

        <!-- 操作按钮 -->
        <div class="video-actions">
          <el-button size="small" type="primary" plain @click="handleBatchEdit">批量修改</el-button>
          <el-button size="small" plain @click="handleBindSetting">绑定设置</el-button>
        </div>

        <!-- 监控视频列表 -->
        <div v-if="videoTab === 'monitor'" class="video-list">
          <div
            v-for="video in filteredVideos"
            :key="video.id"
            class="video-card"
            :class="{ 'video-card--active': selectedVideo?.id === video.id }"
            @click="handleVideoClick(video)"
          >
            <div class="video-card-cover">
              <div class="video-cover-placeholder">
                <el-icon :size="32" color="#fff"><VideoCamera /></el-icon>
              </div>
              <span
                class="video-status-badge"
                :class="video.status === '在线' ? 'badge-online' : 'badge-offline'"
              >
                {{ video.status }}
              </span>
            </div>
            <div class="video-card-info">
              <div class="video-card-name">{{ video.videoName }}</div>
              <div class="video-card-meta">
                <span>{{ video.videoCode }}</span>
                <span>{{ video.relatedPoint }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 短视频列表 -->
        <div v-else-if="videoTab === 'short'" class="video-list">
          <div
            v-for="sv in shortVideos"
            :key="sv.id"
            class="video-card"
          >
            <div class="video-card-cover">
              <div class="video-cover-placeholder short-cover">
                <el-icon :size="32" color="#fff"><VideoPlay /></el-icon>
              </div>
              <span class="video-duration">{{ sv.duration }}</span>
            </div>
            <div class="video-card-info">
              <div class="video-card-name">{{ sv.title }}</div>
            </div>
          </div>
        </div>

        <!-- 切片列表 -->
        <div v-else class="video-list">
          <div
            v-for="sl in slices"
            :key="sl.id"
            class="video-card"
          >
            <div class="video-card-cover">
              <div class="video-cover-placeholder slice-cover">
                <el-icon :size="32" color="#fff"><Film /></el-icon>
              </div>
              <span class="video-duration">{{ sl.duration }}</span>
            </div>
            <div class="video-card-info">
              <div class="video-card-name">{{ sl.title }}</div>
            </div>
          </div>
        </div>

        <!-- 视频预览区域 -->
        <div v-if="selectedVideo && videoTab === 'monitor'" class="video-preview">
          <div class="preview-title">
            <span>{{ selectedVideo.videoName }}</span>
            <el-button type="danger" :icon="Close" circle size="small" @click="selectedVideo = null" />
          </div>
          <div class="preview-player">
            <div class="preview-placeholder">
              <el-icon :size="48" color="#409EFF"><VideoCamera /></el-icon>
              <p>视频播放中...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Search,
  Refresh,
  Location,
  VideoCamera,
  VideoPlay,
  Film,
  Close
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { straitRiskPoints, straitVideoMonitors, straitStatistics, shortVideoData, sliceData } from '@/mock/dispatch/topicData'
import type { RiskPoint, VideoMonitor, ShortVideo, VideoSlice, RiskStatistics } from '@/types/dispatch/topic'

// 数据源
const allRiskPoints = ref<RiskPoint[]>([...straitRiskPoints])
const allVideoMonitors = ref<VideoMonitor[]>([...straitVideoMonitors])
const statistics = ref<RiskStatistics>({ ...straitStatistics })
const shortVideos = ref<ShortVideo[]>([...shortVideoData])
const slices = ref<VideoSlice[]>([...sliceData])

// 顶部操作
const dataSource = ref('all')

// 左侧筛选
const searchKeyword = ref('')
const filterType = ref('')
const filterStatus = ref('')
const filterUnit = ref('')
const riskPage = ref(1)
const riskPageSize = ref(10)

// 中间地图
const mapType = ref<'map' | 'satellite' | 'sea'>('map')
const selectedPoint = ref<RiskPoint | null>(null)

// 右侧视频
const videoTab = ref('monitor')
const selectedVideo = ref<VideoMonitor | null>(null)

// 计算属性
const riskTypes = computed(() => {
  const types = new Set(allRiskPoints.value.map(p => p.riskType))
  return Array.from(types)
})

const managementUnits = computed(() => {
  const units = new Set(allRiskPoints.value.map(p => p.managementUnit))
  return Array.from(units)
})

const filteredRiskPoints = computed(() => {
  let result = allRiskPoints.value
  if (searchKeyword.value) {
    result = result.filter(p => p.pointName.includes(searchKeyword.value))
  }
  if (filterType.value) {
    result = result.filter(p => p.riskType === filterType.value)
  }
  if (filterStatus.value) {
    result = result.filter(p => p.status === filterStatus.value)
  }
  if (filterUnit.value) {
    result = result.filter(p => p.managementUnit === filterUnit.value)
  }
  return result
})

const filteredVideos = computed(() => {
  if (!selectedPoint.value) return allVideoMonitors.value
  return allVideoMonitors.value.filter(v => v.relatedPoint === selectedPoint.value!.pointName)
})

// 方法
const getRiskTagType = (level: RiskPoint['riskLevel']) => {
  const map: Record<string, string> = {
    '高风险': 'danger',
    '中风险': 'warning',
    '低风险': 'info',
    '正常': 'success'
  }
  return map[level] || 'info'
}

const getRiskLevelClass = (level: RiskPoint['riskLevel']) => {
  const map: Record<string, string> = {
    '高风险': 'high',
    '中风险': 'medium',
    '低风险': 'low',
    '正常': 'normal'
  }
  return map[level] || 'normal'
}

const getStatusTagType = (status: RiskPoint['status']) => {
  const map: Record<string, string> = {
    '处置中': 'danger',
    '处理中': 'warning',
    '正常': 'success',
    '已完成': 'info'
  }
  return map[status] || 'info'
}

const getMarkerPosition = (point: RiskPoint) => {
  // 将经纬度映射到模拟地图区域的位置
  const minLng = 117.4, maxLng = 119.9
  const minLat = 23.7, maxLat = 25.6
  const x = ((point.longitude - minLng) / (maxLng - minLng)) * 80 + 10
  const y = ((maxLat - point.latitude) / (maxLat - minLat)) * 80 + 10
  return { left: `${x}%`, top: `${y}%` }
}

const handlePointClick = (point: RiskPoint) => {
  selectedPoint.value = selectedPoint.value?.id === point.id ? null : point
  selectedVideo.value = null
  ElMessage.info(`已选中：${point.pointName}`)
}

const handleVideoClick = (video: VideoMonitor) => {
  selectedVideo.value = selectedVideo.value?.id === video.id ? null : video
}

const handlePatrol = () => {
  ElMessage.info('启动轮巡巡查...')
}

const handleBatchEdit = () => {
  ElMessage.info('批量修改功能开发中...')
}

const handleBindSetting = () => {
  ElMessage.info('绑定设置功能开发中...')
}
</script>

<style lang="scss" scoped>
.strait-topic {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  position: relative;
  overflow: hidden;
}

// 顶部操作栏
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
  flex-shrink: 0;

  .top-bar-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .top-bar-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }

  .top-bar-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

// 三栏主体
.main-content {
  flex: 1;
  display: flex;
  gap: 12px;
  padding: 12px;
  overflow: hidden;
  min-height: 0;
}

// 左侧面板
.left-panel {
  width: 320px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.panel-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #409EFF;
}

.filter-section {
  margin-bottom: 10px;
}

.risk-list {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  min-height: 0;
}

.risk-card {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fafafa;

  &:hover {
    border-color: #409EFF;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
  }

  &--active {
    border-color: #409EFF;
    background: #ecf5ff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
  }

  &--high { border-left: 3px solid #F56C6C; }
  &--medium { border-left: 3px solid #E6A23C; }
  &--low { border-left: 3px solid #909399; }
  &--normal { border-left: 3px solid #67C23A; }
}

.risk-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.risk-card-name {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.risk-card-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.risk-card-type {
  font-size: 12px;
  color: #909399;
}

.risk-card-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #C0C4CC;
}

// 中间面板
.center-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.map-controls {
  padding: 10px 16px;
  border-bottom: 1px solid #ebeef5;
  flex-shrink: 0;
}

.map-area {
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 0;
}

.map-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e8f4f8 0%, #d1ecf1 50%, #bee5eb 100%);
  position: relative;
}

.map-placeholder-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #909399;

  p {
    margin: 8px 0 0;
    font-size: 14px;
  }

  .map-hint {
    font-size: 12px;
    color: #C0C4CC;
  }
}

.map-markers {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.map-marker {
  position: absolute;
  transform: translate(-50%, -100%);
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1;

  &:hover, &--active {
    z-index: 10;
    transform: translate(-50%, -100%) scale(1.2);
  }
}

.marker-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin: 0 auto;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);

  .map-marker--high & { background: #F56C6C; }
  .map-marker--medium & { background: #E6A23C; }
  .map-marker--low & { background: #909399; }
  .map-marker--normal & { background: #67C23A; }
}

.marker-label {
  font-size: 10px;
  color: #303133;
  background: rgba(255, 255, 255, 0.9);
  padding: 1px 4px;
  border-radius: 3px;
  white-space: nowrap;
  margin-top: 2px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.map-legend {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 10px 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 5;
}

.legend-title {
  font-size: 12px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.legend-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #606266;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;

  &--high { background: #F56C6C; }
  &--medium { background: #E6A23C; }
  &--low { background: #909399; }
  &--normal { background: #67C23A; }
}

.statistics-bar {
  display: flex;
  justify-content: space-around;
  padding: 12px 16px;
  border-top: 1px solid #ebeef5;
  flex-shrink: 0;
  background: #fafafa;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #303133;
  line-height: 1.4;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.stat-item--high .stat-value { color: #F56C6C; }
.stat-item--medium .stat-value { color: #E6A23C; }
.stat-item--low .stat-value { color: #909399; }
.stat-item--normal .stat-value { color: #67C23A; }

// 右侧面板
.right-panel {
  width: 300px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.video-tabs {
  margin-bottom: 10px;
}

.video-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.video-list {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.video-card {
  display: flex;
  gap: 10px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #409EFF;
    box-shadow: 0 2px 6px rgba(64, 158, 255, 0.12);
  }

  &--active {
    border-color: #409EFF;
    background: #ecf5ff;
  }
}

.video-card-cover {
  width: 120px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}

.video-cover-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  &.short-cover { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
  &.slice-cover { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
}

.video-status-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 10px;
  color: #fff;

  &.badge-online { background: #67C23A; }
  &.badge-offline { background: #909399; }
}

.video-duration {
  position: absolute;
  bottom: 4px;
  right: 4px;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
}

.video-card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.video-card-name {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-card-meta {
  font-size: 11px;
  color: #909399;
  display: flex;
  flex-direction: column;
  gap: 2px;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.video-preview {
  margin-top: 10px;
  border-top: 1px solid #ebeef5;
  padding-top: 10px;
  flex-shrink: 0;
}

.preview-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 8px;
}

.preview-player {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
}

.preview-placeholder {
  width: 100%;
  height: 100%;
  background: #1a1a2e;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;

  p {
    margin: 8px 0 0;
    font-size: 12px;
    color: #909399;
  }
}

// 分页
.pagination-wrapper {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
}

// 滚动条美化
.risk-list::-webkit-scrollbar,
.video-list::-webkit-scrollbar {
  width: 6px;
}

.risk-list::-webkit-scrollbar-thumb,
.video-list::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}

.risk-list::-webkit-scrollbar-track,
.video-list::-webkit-scrollbar-track {
  background: transparent;
}
</style>
