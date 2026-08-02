<template>
  <el-dialog
    :model-value="visible"
    :fullscreen="isFullscreen"
    width="95%"
    destroy-on-close
    class="control-dialog"
    @update:model-value="$emit('update:visible', $event)"
  >
    <template #header>
      <div class="dialog-header">
        <span class="dialog-title">无人机控制</span>
        <div class="header-actions">
          <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
            <el-icon class="header-action-btn" @click="toggleFullscreen">
              <FullScreen v-if="!isFullscreen" />
              <Aim v-else />
            </el-icon>
          </el-tooltip>
        </div>
      </div>
    </template>

    <template v-if="detail">
      <div class="control-body">
        <!-- 顶部状态栏 -->
        <div class="control-topbar">
          <div class="topbar-left">
            <span class="dji-logo">dji</span>
            <span class="flight-status-badge">起飞准备完毕 (Vision)</span>
            <span class="topbar-mode">Position</span>
            <span class="topbar-mode">HD</span>
          </div>
          <div class="topbar-right">
            <span class="battery-info">{{ detail.battery }}% / 4.29V</span>
            <el-button size="small" @click="handleConnect">连接设备</el-button>
            <el-button size="small" type="danger" plain @click="handleEnd">结束操控</el-button>
          </div>
        </div>

        <!-- 主区域 -->
        <div class="control-main">
          <!-- 左侧控制按钮 -->
          <div class="control-sidebar">
            <div class="ctrl-btn" title="上升" @click="handleCtrl('上升')">
              <el-icon :size="20"><Top /></el-icon>
            </div>
            <div class="ctrl-btn" title="旋转" @click="handleCtrl('旋转')">
              <el-icon :size="20"><RefreshRight /></el-icon>
            </div>
            <div class="ctrl-btn" title="定时" @click="handleCtrl('定时')">
              <el-icon :size="20"><Timer /></el-icon>
            </div>

            <!-- 罗盘 -->
            <div class="compass">
              <div class="compass-ring">
                <div class="compass-needle"></div>
              </div>
            </div>
          </div>

          <!-- 视频区 -->
          <div class="video-area">
            <!-- 操控信息覆盖层 -->
            <div class="video-overlay-top">
              <span>在线操控：{{ detail.code }} / 高度 {{ detail.height }}m / 镜头 {{ detail.lensDirection }}</span>
            </div>

            <!-- 模拟视频画面 -->
            <div class="video-feed">
              <div class="video-placeholder">
                <div class="video-grid"></div>
                <div class="video-crosshair">
                  <div class="crosshair-h"></div>
                  <div class="crosshair-v"></div>
                  <div class="crosshair-circle"></div>
                </div>
                <div class="video-distance">4.0 m</div>
              </div>
            </div>

            <!-- 底部参数 -->
            <div class="video-bottom-bar">
              <div class="bottom-param">
                <span class="param-label">拍摄间隔</span>
                <span class="param-value">2s</span>
              </div>
              <div class="bottom-param">
                <span class="param-label">视频时长</span>
                <span class="param-value">15s</span>
              </div>
              <div class="bottom-param">
                <span class="param-label">最大速度</span>
                <span class="param-value">3.6km/h</span>
              </div>
            </div>
          </div>

          <!-- 右侧操作按钮 -->
          <div class="control-actions">
            <!-- 变焦滑块 -->
            <div class="zoom-slider">
              <div class="zoom-track">
                <div class="zoom-marks">
                  <span v-for="i in 11" :key="i" class="zoom-mark"></span>
                </div>
                <span class="zoom-value">0</span>
              </div>
            </div>

            <!-- GO 按钮 -->
            <div class="go-btn" @click="handleGo">GO</div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <div class="action-btn" @click="handleAction('拍照')">拍照</div>
              <div class="action-btn" @click="handleAction('录像')">录像</div>
              <div class="action-btn action-btn--danger" @click="handleAction('返航')">返航</div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Top, RefreshRight, Timer, FullScreen, Aim } from '@element-plus/icons-vue'
import type { DroneFlightDetail } from '@/types/resource/drone'

defineProps<{
  visible: boolean
  detail: DroneFlightDetail | null
}>()

const emit = defineEmits<{
  'update:visible': [val: boolean]
}>()

const isFullscreen = ref(true)

function toggleFullscreen() {
  isFullscreen.value = !isFullscreen.value
}

function handleConnect() {
  ElMessage.success('设备连接中，请稍候...')
}

function handleEnd() {
  ElMessageBox.confirm('确定结束当前操控？无人机将自动返航。', '结束操控', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    ElMessage.success('操控已结束，无人机正在返航')
    emit('update:visible', false)
  }).catch(() => {})
}

function handleCtrl(type: string) {
  ElMessage.info(`已发送「${type}」指令`)
}

function handleGo() {
  ElMessage.success('已发送起飞指令')
}

function handleAction(type: string) {
  const msgs: Record<string, string> = {
    '拍照': '拍照成功，照片已保存',
    '录像': '录像已开始，再次点击结束',
    '返航': '已发送返航指令，无人机正在返回',
  }
  ElMessage.success(msgs[type] || `${type}指令已发送`)
}
</script>

<style lang="scss" scoped>
// ── 自定义 header ──
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.dialog-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-action-btn {
  font-size: 18px;
  color: #606266;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    color: #409eff;
    background: #f0f7ff;
  }
}

// ── 主体 ──
.control-body {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  background: #1a1e2e;
  color: #fff;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-dialog__body) {
  padding: 0;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  padding: 16px 20px;
  margin: 0;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-dialog__headerbtn) {
  display: none;
}

// ── 顶部状态栏 ──
.control-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: #12152a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dji-logo {
  font-size: 20px;
  font-weight: 800;
  font-style: italic;
  color: #fff;
  letter-spacing: -1px;
}

.flight-status-badge {
  padding: 4px 16px;
  background: #e6a23c;
  color: #000;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
}

.topbar-mode {
  font-size: 14px;
  color: #a0a6b8;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.battery-info {
  font-size: 14px;
  color: #67c23a;
  font-weight: 600;
}

// ── 主区域 ──
.control-main {
  display: flex;
  flex: 1;
  overflow: hidden;
}

// ── 左侧控制栏 ──
.control-sidebar {
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  gap: 16px;
}

.ctrl-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  transition: all 0.2s;

  &:hover {
    border-color: #409eff;
    background: rgba(64, 158, 255, 0.15);
  }

  &:active {
    transform: scale(0.92);
    border-color: #409eff;
    background: rgba(64, 158, 255, 0.3);
  }
}

.compass {
  margin-top: auto;
  margin-bottom: 20px;
}

.compass-ring {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.compass-needle {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 24px solid #e6a23c;
  transform: rotate(-30deg);
}

// ── 视频区 ──
.video-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  min-width: 0;
}

.video-overlay-top {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  padding: 6px 14px;
  background: rgba(0, 0, 0, 0.65);
  border-radius: 4px;
  font-size: 13px;
  color: #fff;
}

.video-feed {
  flex: 1;
  margin: 12px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a3a4a 0%, #2a4a5a 30%, #1a4a5a 60%, #0d2b3f 100%);
  position: relative;
}

.video-grid {
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255, 255, 255, 0.03) 60px, rgba(255, 255, 255, 0.03) 61px),
    repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(255, 255, 255, 0.03) 60px, rgba(255, 255, 255, 0.03) 61px);
}

.video-crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;

  .crosshair-h, .crosshair-v {
    position: absolute;
    background: rgba(245, 108, 108, 0.7);
  }

  .crosshair-h {
    width: 100%;
    height: 1px;
    top: 50%;
  }

  .crosshair-v {
    width: 1px;
    height: 100%;
    left: 50%;
  }

  .crosshair-circle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    border: 1px solid rgba(245, 108, 108, 0.7);
    border-radius: 50%;
  }
}

.video-distance {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 16px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
}

.video-bottom-bar {
  display: flex;
  justify-content: space-around;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.5);
}

.bottom-param {
  text-align: center;

  .param-label {
    display: block;
    font-size: 12px;
    color: #a0a6b8;
    margin-bottom: 4px;
  }

  .param-value {
    display: block;
    font-size: 20px;
    font-weight: 700;
    color: #fff;
  }
}

// ── 右侧操作区 ──
.control-actions {
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  gap: 16px;
}

.zoom-slider {
  flex: 1;
  display: flex;
  align-items: center;
}

.zoom-track {
  position: relative;
  height: 200px;
  width: 24px;
  display: flex;
  align-items: center;
}

.zoom-marks {
  position: absolute;
  right: 8px;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.zoom-mark {
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 1px;
}

.zoom-value {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  color: #fff;
  font-weight: 600;
}

.go-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: transparent;
  border: 3px solid #f56c6c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  color: #f56c6c;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(245, 108, 108, 0.15);
  }

  &:active {
    transform: scale(0.92);
    background: rgba(245, 108, 108, 0.3);
  }
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  width: 56px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  font-size: 12px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #409eff;
    background: rgba(64, 158, 255, 0.15);
  }

  &:active {
    transform: scale(0.92);
    background: rgba(64, 158, 255, 0.3);
  }

  &.action-btn--danger {
    border-color: #f56c6c;

    &:hover {
      border-color: #f56c6c;
      background: rgba(245, 108, 108, 0.15);
    }

    &:active {
      background: rgba(245, 108, 108, 0.3);
    }
  }
}
</style>
