<template>
  <div class="channel-topic">
    <!-- 三栏布局 -->
    <div class="main-layout">
      <!-- 左侧：风险点位列表 -->
      <div class="left-panel">
        <div class="panel-header">
          <span class="panel-title">风险点位列表</span>
          <el-tag type="danger" size="small">共 {{ filteredRiskPoints.length }} 个</el-tag>
        </div>

        <!-- 搜索框 -->
        <div class="search-section">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索风险点位名称"
            :prefix-icon="Search"
            clearable
            size="small"
          />
        </div>

        <!-- 筛选区域 -->
        <div class="filter-section">
          <el-select v-model="filterType" placeholder="风险类型" size="small" clearable style="width: 100%;">
            <el-option
              v-for="item in riskTypeOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
          <el-select v-model="filterStatus" placeholder="处置状态" size="small" clearable style="width: 100%;">
            <el-option
              v-for="item in statusOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>

        <!-- 风险点列表 -->
        <div class="risk-list">
          <div
            v-for="point in paginatedRiskPoints"
            :key="point.id"
            class="risk-card"
            :class="{ active: selectedPointId === point.id }"
            @click="handleSelectPoint(point)"
          >
            <div class="risk-card-header">
              <span class="risk-name">{{ point.pointName }}</span>
              <el-tag
                :type="getRiskLevelTagType(point.riskLevel)"
                size="small"
                effect="dark"
              >
                {{ point.riskLevel }}
              </el-tag>
            </div>
            <div class="risk-card-body">
              <div class="risk-info-row">
                <span class="label">风险类型：</span>
                <span class="value">{{ point.riskType }}</span>
              </div>
              <div class="risk-info-row">
                <span class="label">管理单位：</span>
                <span class="value">{{ point.managementUnit }}</span>
              </div>
              <div class="risk-info-row">
                <span class="label">更新时间：</span>
                <span class="value">{{ point.updateTime }}</span>
              </div>
            </div>
            <div class="risk-card-footer">
              <el-tag
                :type="getStatusTagType(point.status)"
                size="small"
                effect="plain"
              >
                {{ point.status }}
              </el-tag>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="riskPagination.page"
            v-model:page-size="riskPagination.pageSize"
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
        <div class="map-container">
          <!-- 地图工具栏 -->
          <div class="map-toolbar">
            <div class="toolbar-left">
              <el-button size="small" :type="mapTool === 'pointer' ? 'primary' : ''" @click="mapTool = 'pointer'">
                <el-icon><Pointer /></el-icon>
              </el-button>
              <el-button size="small" :type="mapTool === 'zoom-in' ? 'primary' : ''" @click="mapTool = 'zoom-in'">
                <el-icon><ZoomIn /></el-icon>
              </el-button>
              <el-button size="small" :type="mapTool === 'zoom-out' ? 'primary' : ''" @click="mapTool = 'zoom-out'">
                <el-icon><ZoomOut /></el-icon>
              </el-button>
              <el-button size="small" @click="handleResetView">
                <el-icon><Aim /></el-icon>
              </el-button>
              <el-divider direction="vertical" />
              <el-button size="small" @click="handleMeasureDistance">测距</el-button>
              <el-button size="small" @click="handleMeasureArea">测面</el-button>
            </div>
            <div class="toolbar-right">
              <el-button size="small" @click="handleToggleLayer">图层</el-button>
            </div>
          </div>

          <!-- 地图占位区域 -->
          <div class="map-placeholder">
            <div class="map-overlay-content">
              <el-icon :size="48" color="#409EFF"><Location /></el-icon>
              <p>地图加载区域</p>
              <p class="map-tip">展示航道风险点位分布</p>
            </div>

            <!-- 风险点标记（模拟） -->
            <div
              v-for="(point, index) in displayMapPoints"
              :key="point.id"
              class="map-marker"
              :class="getMarkerClass(point.riskLevel)"
              :style="getMarkerStyle(index)"
              @click="handleMapMarkerClick(point)"
            >
              <el-icon :size="16"><WarningFilled /></el-icon>
            </div>
          </div>

          <!-- 风险等级图例 -->
          <div class="map-legend">
            <div class="legend-title">风险等级</div>
            <div class="legend-items">
              <div class="legend-item">
                <span class="legend-dot high"></span>
                <span>高风险</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot medium"></span>
                <span>中风险</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot low"></span>
                <span>低风险</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot normal"></span>
                <span>正常</span>
              </div>
            </div>
          </div>

          <!-- 风险点位统计 -->
          <div class="map-statistics">
            <div class="stat-item">
              <span class="stat-value">{{ statistics.total }}</span>
              <span class="stat-label">总点位</span>
            </div>
            <div class="stat-item high">
              <span class="stat-value">{{ statistics.highRisk }}</span>
              <span class="stat-label">高风险</span>
            </div>
            <div class="stat-item medium">
              <span class="stat-value">{{ statistics.mediumRisk }}</span>
              <span class="stat-label">中风险</span>
            </div>
            <div class="stat-item low">
              <span class="stat-value">{{ statistics.lowRisk }}</span>
              <span class="stat-label">低风险</span>
            </div>
            <div class="stat-item normal">
              <span class="stat-value">{{ statistics.normal }}</span>
              <span class="stat-label">正常</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：监控视频区域 -->
      <div class="right-panel">
        <div class="panel-header">
          <span class="panel-title">监控视频</span>
        </div>

        <!-- Tab 切换 -->
        <el-tabs v-model="videoTab" type="border-card" class="video-tabs">
          <el-tab-pane label="监控" name="monitor">
            <div class="video-list">
              <div
                v-for="video in filteredVideos"
                :key="video.id"
                class="video-card"
                :class="{ active: selectedVideoId === video.id }"
                @click="handleSelectVideo(video)"
              >
                <div class="video-cover">
                  <div class="video-placeholder">
                    <el-icon :size="32" color="#909399"><VideoCamera /></el-icon>
                  </div>
                  <div class="video-status-badge" :class="video.status === '在线' ? 'online' : 'offline'">
                    {{ video.status }}
                  </div>
                </div>
                <div class="video-info">
                  <div class="video-name">{{ video.videoName }}</div>
                  <div class="video-code">{{ video.videoCode }}</div>
                  <div class="video-related">关联：{{ video.relatedPoint }}</div>
                </div>
              </div>
              <el-empty v-if="filteredVideos.length === 0" description="暂无监控视频" :image-size="80" />
            </div>
          </el-tab-pane>

          <el-tab-pane label="短视频" name="shortVideo">
            <div class="video-list">
              <div
                v-for="video in shortVideos"
                :key="video.id"
                class="video-card short"
                @click="handlePlayShortVideo(video)"
              >
                <div class="video-cover">
                  <div class="video-placeholder short-cover">
                    <el-icon :size="32" color="#909399"><CaretRight /></el-icon>
                  </div>
                  <div class="video-duration">{{ video.duration }}</div>
                </div>
                <div class="video-info">
                  <div class="video-name">{{ video.title }}</div>
                </div>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="切片" name="slice">
            <div class="video-list">
              <div
                v-for="slice in sliceVideos"
                :key="slice.id"
                class="video-card short"
                @click="handlePlaySlice(slice)"
              >
                <div class="video-cover">
                  <div class="video-placeholder short-cover">
                    <el-icon :size="32" color="#909399"><CaretRight /></el-icon>
                  </div>
                  <div class="video-duration">{{ slice.duration }}</div>
                </div>
                <div class="video-info">
                  <div class="video-name">{{ slice.title }}</div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>

        <!-- 操作按钮区域 -->
        <div class="video-actions">
          <el-button type="primary" size="small" @click="handleBatchModify">批量修改</el-button>
          <el-button size="small" @click="handleBindSettings">绑定设置</el-button>
        </div>

        <!-- 视频预览区域 -->
        <div class="video-preview" v-if="previewVideo">
          <div class="preview-header">
            <span class="preview-title">{{ previewVideo.videoName || previewVideo.title }}</span>
            <el-icon class="preview-close" @click="previewVideo = null"><Close /></el-icon>
          </div>
          <div class="preview-player">
            <div class="player-placeholder">
              <el-icon :size="48" color="#409EFF"><VideoCamera /></el-icon>
              <p>视频播放区域</p>
            </div>
          </div>
        </div>
        <div class="video-preview empty" v-else>
          <el-empty description="请选择视频进行预览" :image-size="60" />
        </div>
      </div>
    </div>

    <!-- 风险点详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="detailPoint?.pointName || '风险点详情'"
      width="500px"
      destroy-on-close
    >
      <div class="detail-content" v-if="detailPoint">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="风险等级">
            <el-tag :type="getRiskLevelTagType(detailPoint.riskLevel)" size="small" effect="dark">
              {{ detailPoint.riskLevel }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="处置状态">
            <el-tag :type="getStatusTagType(detailPoint.status)" size="small" effect="plain">
              {{ detailPoint.status }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="风险类型">{{ detailPoint.riskType }}</el-descriptions-item>
          <el-descriptions-item label="管理单位">{{ detailPoint.managementUnit }}</el-descriptions-item>
          <el-descriptions-item label="经度">{{ detailPoint.longitude }}</el-descriptions-item>
          <el-descriptions-item label="纬度">{{ detailPoint.latitude }}</el-descriptions-item>
          <el-descriptions-item label="更新时间" :span="2">{{ detailPoint.updateTime }}</el-descriptions-item>
          <el-descriptions-item label="描述" :span="2" v-if="detailPoint.description">
            {{ detailPoint.description }}
          </el-descriptions-item>
        </el-descriptions>

        <!-- 关联视频 -->
        <div class="detail-videos" v-if="detailPointVideos.length > 0">
          <h4>关联监控视频</h4>
          <div class="detail-video-list">
            <div
              v-for="video in detailPointVideos"
              :key="video.id"
              class="detail-video-item"
              @click="handleSelectVideo(video); detailDialogVisible = false"
            >
              <el-icon><VideoCamera /></el-icon>
              <span>{{ video.videoName }}</span>
              <el-tag
                :type="video.status === '在线' ? 'success' : 'info'"
                size="small"
                effect="plain"
              >
                {{ video.status }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { Search, Pointer, ZoomIn, ZoomOut, Aim, Location, WarningFilled, VideoCamera, CaretRight, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { channelRiskPoints, channelVideoMonitors, shortVideoData, sliceData, channelStatistics } from '@/mock/dispatch/topicData'
import type { RiskPoint, VideoMonitor, ShortVideo, VideoSlice } from '@/types/dispatch/topic'

// 风险点数据
const riskPoints = ref<RiskPoint[]>([...channelRiskPoints])
const statistics = reactive({ ...channelStatistics })

// 搜索和筛选
const searchKeyword = ref('')
const filterType = ref('')
const filterStatus = ref('')

const riskTypeOptions = computed(() => {
  const types = new Set(riskPoints.value.map(p => p.riskType))
  return Array.from(types)
})

const statusOptions = ['处置中', '处理中', '正常', '已完成']

const filteredRiskPoints = computed(() => {
  return riskPoints.value.filter(point => {
    const matchKeyword = !searchKeyword.value || point.pointName.includes(searchKeyword.value)
    const matchType = !filterType.value || point.riskType === filterType.value
    const matchStatus = !filterStatus.value || point.status === filterStatus.value
    return matchKeyword && matchType && matchStatus
  })
})

// 分页
const riskPagination = reactive({ page: 1, pageSize: 5 })

const paginatedRiskPoints = computed(() => {
  const start = (riskPagination.page - 1) * riskPagination.pageSize
  return filteredRiskPoints.value.slice(start, start + riskPagination.pageSize)
})

// 选中的风险点
const selectedPointId = ref<number | null>(null)

const handleSelectPoint = (point: RiskPoint) => {
  selectedPointId.value = selectedPointId.value === point.id ? null : point.id
}

// 地图相关
const mapTool = ref('pointer')

const displayMapPoints = computed(() => {
  return riskPoints.value.slice(0, 8)
})

const getMarkerStyle = (index: number) => {
  const positions = [
    { top: '20%', left: '25%' },
    { top: '35%', left: '55%' },
    { top: '50%', left: '35%' },
    { top: '15%', left: '70%' },
    { top: '60%', left: '60%' },
    { top: '40%', left: '15%' },
    { top: '70%', left: '40%' },
    { top: '25%', left: '80%' },
  ]
  return positions[index % positions.length]
}

const getMarkerClass = (level: string) => {
  const classMap: Record<string, string> = {
    '高风险': 'high',
    '中风险': 'medium',
    '低风险': 'low',
    '正常': 'normal',
  }
  return classMap[level] || 'normal'
}

const handleResetView = () => { ElMessage.info('重置地图视图') }
const handleMeasureDistance = () => { ElMessage.info('测距功能') }
const handleMeasureArea = () => { ElMessage.info('测面功能') }
const handleToggleLayer = () => { ElMessage.info('图层切换') }

// 地图标记点击
const detailDialogVisible = ref(false)
const detailPoint = ref<RiskPoint | null>(null)

const detailPointVideos = computed(() => {
  if (!detailPoint.value) return []
  return videoMonitors.value.filter(v => v.relatedPoint === detailPoint.value?.pointName)
})

const handleMapMarkerClick = (point: RiskPoint) => {
  detailPoint.value = point
  detailDialogVisible.value = true
}

// 视频监控
const videoMonitors = ref<VideoMonitor[]>([...channelVideoMonitors])
const shortVideos = ref<ShortVideo[]>([...shortVideoData])
const sliceVideos = ref<VideoSlice[]>([...sliceData])

const videoTab = ref('monitor')
const selectedVideoId = ref<number | null>(null)
const previewVideo = ref<any>(null)

const filteredVideos = computed(() => {
  if (!selectedPointId.value) return videoMonitors.value
  const point = riskPoints.value.find(p => p.id === selectedPointId.value)
  if (!point) return videoMonitors.value
  return videoMonitors.value.filter(v => v.relatedPoint === point.pointName)
})

const handleSelectVideo = (video: VideoMonitor) => {
  selectedVideoId.value = video.id
  previewVideo.value = video
}

const handlePlayShortVideo = (video: ShortVideo) => {
  previewVideo.value = video
  ElMessage.info(`播放短视频：${video.title}`)
}

const handlePlaySlice = (slice: VideoSlice) => {
  previewVideo.value = slice
  ElMessage.info(`播放切片：${slice.title}`)
}

const handleBatchModify = () => { ElMessage.info('批量修改功能开发中...') }
const handleBindSettings = () => { ElMessage.info('绑定设置功能开发中...') }

// 标签类型
const getRiskLevelTagType = (level: string) => {
  const typeMap: Record<string, string> = {
    '高风险': 'danger',
    '中风险': 'warning',
    '低风险': 'info',
    '正常': 'success',
  }
  return (typeMap[level] || 'info') as any
}

const getStatusTagType = (status: string) => {
  const typeMap: Record<string, string> = {
    '处置中': 'danger',
    '处理中': 'warning',
    '正常': 'success',
    '已完成': 'info',
  }
  return (typeMap[status] || 'info') as any
}
</script>

<style lang="scss" scoped>
.channel-topic {
  padding: 0;
  background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  animation: fadeInUp 0.5s ease forwards;
}

// 三栏布局
.main-layout {
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
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.search-section {
  padding: 12px 16px 0;
}

.filter-section {
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

// 风险点列表
.risk-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 16px;
}

.risk-card {
  padding: 12px;
  margin-bottom: 8px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #409eff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
  }

  &.active {
    border-color: #409eff;
    background: rgba(64, 158, 255, 0.05);
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
  }
}

.risk-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.risk-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.risk-card-body {
  margin-bottom: 8px;
}

.risk-info-row {
  display: flex;
  font-size: 12px;
  line-height: 22px;
  color: #606266;

  .label {
    color: #909399;
    flex-shrink: 0;
  }

  .value {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.risk-card-footer {
  display: flex;
  justify-content: flex-end;
}

// 分页
.pagination-wrapper {
  padding: 8px 16px 12px;
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}

// 中间地图区域
.center-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.map-container {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  position: relative;
}

.map-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid #ebeef5;
  background: #fafafa;
  flex-shrink: 0;

  .toolbar-left,
  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.map-placeholder {
  flex: 1;
  background: linear-gradient(135deg, #e8f4f8 0%, #d1ecf1 50%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.map-overlay-content {
  text-align: center;
  color: #606266;
  z-index: 1;

  p {
    margin: 8px 0 0;
    font-size: 14px;
  }

  .map-tip {
    font-size: 12px;
    color: #909399;
  }
}

// 地图标记
.map-marker {
  position: absolute;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  z-index: 2;

  &:hover {
    transform: scale(1.3);
    z-index: 3;
  }

  &.high {
    background: rgba(245, 108, 108, 0.9);
    color: #fff;
    box-shadow: 0 0 8px rgba(245, 108, 108, 0.5);
  }

  &.medium {
    background: rgba(230, 162, 60, 0.9);
    color: #fff;
    box-shadow: 0 0 8px rgba(230, 162, 60, 0.5);
  }

  &.low {
    background: rgba(144, 147, 153, 0.9);
    color: #fff;
    box-shadow: 0 0 8px rgba(144, 147, 153, 0.5);
  }

  &.normal {
    background: rgba(103, 194, 58, 0.9);
    color: #fff;
    box-shadow: 0 0 8px rgba(103, 194, 58, 0.5);
  }
}

// 图例
.map-legend {
  position: absolute;
  bottom: 60px;
  left: 16px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 4;

  .legend-title {
    font-size: 13px;
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
    flex-shrink: 0;

    &.high { background: #f56c6c; }
    &.medium { background: #e6a23c; }
    &.low { background: #909399; }
    &.normal { background: #67c23a; }
  }
}

// 统计信息
.map-statistics {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 10px 16px;
  border-top: 1px solid #ebeef5;
  background: #fafafa;
  flex-shrink: 0;

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .stat-value {
      font-size: 20px;
      font-weight: 700;
      color: #303133;
      line-height: 1.2;
    }

    .stat-label {
      font-size: 12px;
      color: #909399;
      margin-top: 2px;
    }

    &.high .stat-value { color: #f56c6c; }
    &.medium .stat-value { color: #e6a23c; }
    &.low .stat-value { color: #909399; }
    &.normal .stat-value { color: #67c23a; }
  }
}

// 右侧视频面板
.right-panel {
  width: 340px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.video-tabs {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  :deep(.el-tabs__content) {
    flex: 1;
    overflow: hidden;
    padding: 0;
  }

  :deep(.el-tab-pane) {
    height: 100%;
    overflow-y: auto;
  }
}

.video-list {
  padding: 8px;
}

.video-card {
  display: flex;
  gap: 10px;
  padding: 10px;
  margin-bottom: 8px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #409eff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
  }

  &.active {
    border-color: #409eff;
    background: rgba(64, 158, 255, 0.05);
  }
}

.video-cover {
  width: 100px;
  height: 68px;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;

  &.short-cover {
    background: linear-gradient(135deg, #e8ecf1 0%, #dcdfe6 100%);
  }
}

.video-status-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  color: #fff;

  &.online { background: rgba(103, 194, 58, 0.85); }
  &.offline { background: rgba(144, 147, 153, 0.85); }
}

.video-duration {
  position: absolute;
  bottom: 4px;
  right: 4px;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
}

.video-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.video-name {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 4px;
}

.video-code {
  font-size: 11px;
  color: #909399;
  margin-bottom: 2px;
}

.video-related {
  font-size: 11px;
  color: #909399;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-actions {
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  border-top: 1px solid #ebeef5;
  flex-shrink: 0;
}

// 视频预览
.video-preview {
  border-top: 1px solid #ebeef5;
  flex-shrink: 0;

  &.empty {
    padding: 20px;
    display: flex;
    justify-content: center;
  }
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: #fafafa;

  .preview-title {
    font-size: 13px;
    font-weight: 500;
    color: #303133;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .preview-close {
    cursor: pointer;
    color: #909399;
    flex-shrink: 0;

    &:hover { color: #409eff; }
  }
}

.preview-player {
  height: 180px;
  background: #000;
}

.player-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);

  p {
    margin: 8px 0 0;
    font-size: 13px;
  }
}

// 详情弹窗
.detail-content {
  .detail-videos {
    margin-top: 20px;

    h4 {
      margin: 0 0 12px;
      font-size: 14px;
      font-weight: 600;
      color: #303133;
    }
  }

  .detail-video-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .detail-video-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 13px;
    color: #606266;

    &:hover {
      border-color: #409eff;
      background: rgba(64, 158, 255, 0.05);
    }

    span {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
