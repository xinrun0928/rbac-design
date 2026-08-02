<template>
  <el-drawer
    :model-value="visible"
    :title="drawerTitle"
    size="80%"
    direction="rtl"
    destroy-on-close
    class="detail-drawer"
    @update:model-value="$emit('update:visible', $event)"
  >
    <template v-if="detail">
      <div class="drawer-body">
        <!-- 顶部遥测概要 -->
        <div class="telemetry-bar">
          <div class="telemetry-item">
            <span class="tele-label">当前定位</span>
            <span class="tele-value">{{ detail.lng.toFixed(4) }}, {{ detail.lat.toFixed(4) }}</span>
          </div>
          <div class="telemetry-item">
            <span class="tele-label">飞行高度</span>
            <span class="tele-value">{{ detail.height }}m</span>
          </div>
          <div class="telemetry-item">
            <span class="tele-label">飞行速度</span>
            <span class="tele-value">{{ detail.speed }}m/s</span>
          </div>
          <div class="telemetry-item">
            <span class="tele-label">电池/信号</span>
            <span class="tele-value">{{ detail.battery }}% / {{ detail.signal }}%</span>
          </div>
        </div>

        <!-- 左侧指令区 + 右侧信息区 -->
        <div class="drawer-content">
          <!-- 左侧：飞行指令 + 定点巡航 -->
          <div class="command-panel">
            <div class="panel-section">
              <div class="panel-title">飞行指令</div>
              <el-input v-model="coordInput" placeholder="输入坐标点" style="margin-bottom: 8px" />
              <div style="display: flex; gap: 8px; margin-bottom: 8px">
                <el-button size="small" @click="handleCmd('flyTo')">飞往坐标点</el-button>
                <el-button size="small" @click="handleCmd('hover')">目标点悬停</el-button>
              </div>
              <el-link type="primary" :underline="false" @click="handleCmd('other')">其他指令</el-link>
            </div>

            <div class="panel-section">
              <div class="panel-title">定点巡航</div>
              <div v-for="(wp, idx) in waypoints" :key="idx" class="waypoint-row">
                <el-input v-model="waypoints[idx].name" :placeholder="`输入航点${idx + 1}`" />
                <el-button type="danger" :icon="Delete" circle size="small" @click="removeWaypoint(idx)" />
              </div>
              <el-link type="primary" :underline="false" @click="addWaypoint" style="margin-bottom: 12px">添加航点坐标</el-link>
              <div style="display: flex; gap: 8px">
                <el-button type="primary" size="small" @click="handleCmd('startCruise')">开始巡航</el-button>
                <el-button size="small" @click="handleCmd('stopCruise')">结束巡航</el-button>
              </div>
            </div>
          </div>

          <!-- 右侧：信息卡片 -->
          <div class="info-area">
            <div class="info-grid">
              <!-- 无人机基础档案 -->
              <div class="info-card">
                <div class="card-title">无人机基础档案</div>
                <div class="info-rows">
                  <div class="info-row"><span class="row-label">无人机编号</span><span class="row-value">{{ detail.droneCode }}</span></div>
                  <div class="info-row"><span class="row-label">型号名称</span><span class="row-value">{{ detail.modelName }}</span></div>
                  <div class="info-row"><span class="row-label">生产厂家</span><span class="row-value">{{ detail.manufacturer }}</span></div>
                  <div class="info-row"><span class="row-label">所属部门/队伍</span><span class="row-value">{{ detail.department }}</span></div>
                  <div class="info-row"><span class="row-label">保管责任人</span><span class="row-value">{{ detail.custodian }}</span></div>
                  <div class="info-row"><span class="row-label">使用状态</span><span class="row-value">{{ detail.usageStatus }}</span></div>
                  <div class="info-row"><span class="row-label">当前区域</span><span class="row-value">{{ detail.area }}</span></div>
                  <div class="info-row"><span class="row-label">任务航线</span><span class="row-value">{{ detail.route }}</span></div>
                </div>
                <div class="flight-stats">
                  <div class="stat-box">
                    <span class="stat-label">起飞时间</span>
                    <span class="stat-value">{{ detail.takeoffTime }}</span>
                  </div>
                  <div class="stat-box">
                    <span class="stat-label">已飞行时间</span>
                    <span class="stat-value">{{ detail.flightDuration }}</span>
                  </div>
                  <div class="stat-box">
                    <span class="stat-label">镜头朝向</span>
                    <span class="stat-value">{{ detail.lensDirection }}</span>
                  </div>
                  <div class="stat-box">
                    <span class="stat-label">异常状态</span>
                    <span class="stat-value" :class="{ 'text-danger': detail.abnormalStatus !== '正常' }">{{ detail.abnormalStatus }}</span>
                  </div>
                </div>
              </div>

              <!-- 实时飞行状态 -->
              <div class="info-card">
                <div class="card-title">实时飞行状态</div>
                <div class="info-rows">
                  <div class="info-row"><span class="row-label">当前定位</span><span class="row-value">{{ detail.lng.toFixed(4) }}, {{ detail.lat.toFixed(4) }}</span></div>
                  <div class="info-row"><span class="row-label">飞行高度</span><span class="row-value">{{ detail.height }}m</span></div>
                  <div class="info-row"><span class="row-label">飞行速度</span><span class="row-value">{{ detail.speed }}m/s</span></div>
                  <div class="info-row"><span class="row-label">电池电量</span><span class="row-value">{{ detail.battery }}%</span></div>
                  <div class="info-row"><span class="row-label">信号强度</span><span class="row-value">{{ detail.signal }}%</span></div>
                  <div class="info-row"><span class="row-label">镜头朝向</span><span class="row-value">{{ detail.lensDirection }}</span></div>
                </div>
                <div class="waypoint-list">
                  <div v-for="(wp, idx) in detail.waypoints" :key="idx" class="waypoint-item">
                    <span class="wp-dot"></span>
                    <span class="wp-text">{{ wp.name }}：{{ wp.description }}</span>
                  </div>
                </div>
              </div>

              <!-- 维护与资产信息 -->
              <div class="info-card">
                <div class="card-title">维护与资产信息</div>
                <div class="info-rows">
                  <div class="info-row"><span class="row-label">资产状态</span><span class="row-value">{{ detail.assetStatus }}</span></div>
                  <div class="info-row"><span class="row-label">最近保养</span><span class="row-value">{{ detail.lastMaintenance }}</span></div>
                  <div class="info-row"><span class="row-label">下次保养</span><span class="row-value">{{ detail.nextMaintenance }}</span></div>
                  <div class="info-row"><span class="row-label">电池循环</span><span class="row-value">{{ detail.batteryCycles }} 次</span></div>
                  <div class="info-row"><span class="row-label">载荷设备</span><span class="row-value">{{ detail.payload }}</span></div>
                  <div class="info-row"><span class="row-label">电子围栏</span><span class="row-value">{{ detail.geoFence }}</span></div>
                </div>
              </div>

              <!-- 数据回传信息 -->
              <div class="info-card">
                <div class="card-title">数据回传信息</div>
                <div class="info-rows">
                  <div class="info-row"><span class="row-label">实时视频</span><span class="row-value">{{ detail.realtimeVideo }}</span></div>
                  <div class="info-row"><span class="row-label">照片回传</span><span class="row-value">{{ detail.photoReturn }}</span></div>
                  <div class="info-row"><span class="row-label">飞行日志</span><span class="row-value">{{ detail.flightLog }}</span></div>
                  <div class="info-row"><span class="row-label">存储策略</span><span class="row-value">{{ detail.storagePolicy }}</span></div>
                  <div class="info-row"><span class="row-label">上报状态</span><span class="row-value">{{ detail.reportStatus }}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <el-button type="primary" @click="$emit('control')">在线操控无人机</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import type { DroneFlightDetail } from '@/types/resource/drone'

const props = defineProps<{
  visible: boolean
  detail: DroneFlightDetail | null
}>()

const emit = defineEmits<{
  'update:visible': [val: boolean]
  'control': []
}>()

const coordInput = ref('')
const waypoints = ref([
  { name: '' },
  { name: '' },
  { name: '' },
  { name: '' },
])

const drawerTitle = computed(() => {
  if (!props.detail) return '无人机详情'
  return `${props.detail.modelName} + ${props.detail.code}`
})

function addWaypoint() {
  waypoints.value.push({ name: '' })
}

function removeWaypoint(idx: number) {
  waypoints.value.splice(idx, 1)
}

function handleCmd(type: string) {
  const msgs: Record<string, string> = {
    flyTo: '已发送飞往坐标点指令',
    hover: '已发送目标点悬停指令',
    other: '指令面板开发中...',
    startCruise: '已发送开始巡航指令',
    stopCruise: '已发送结束巡航指令',
  }
  ElMessage.success(msgs[type] || '操作成功')
}
</script>

<style lang="scss" scoped>
.drawer-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}

.telemetry-bar {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.telemetry-item {
  flex: 1;
  text-align: center;

  .tele-label {
    display: block;
    font-size: 12px;
    color: #909399;
    margin-bottom: 4px;
  }

  .tele-value {
    display: block;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }
}

.drawer-content {
  display: flex;
  gap: 16px;
  flex: 1;
}

.command-panel {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.panel-section {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 16px;
}

.panel-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  padding-left: 10px;
  border-left: 3px solid #409eff;
}

.waypoint-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.info-area {
  flex: 1;
  min-width: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-card {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 16px;
  background: #fafbfc;

  .card-title {
    font-size: 15px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 12px;
    padding-left: 10px;
    border-left: 3px solid #409eff;
  }
}

.info-rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  align-items: flex-start;
  font-size: 14px;
  line-height: 1.6;

  .row-label {
    width: 110px;
    flex-shrink: 0;
    color: #909399;
  }

  .row-value {
    flex: 1;
    color: #303133;
    word-break: break-all;
  }
}

.flight-stats {
  display: flex;
  gap: 12px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #ebeef5;
}

.stat-box {
  flex: 1;
  text-align: center;
  padding: 8px;
  background: #f5f7fa;
  border-radius: 6px;

  .stat-label {
    display: block;
    font-size: 12px;
    color: #909399;
    margin-bottom: 4px;
  }

  .stat-value {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #303133;
  }
}

.text-danger {
  color: #F56C6C !important;
}

.waypoint-list {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #ebeef5;
}

.waypoint-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #606266;
  line-height: 1.6;

  .wp-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #409eff;
    flex-shrink: 0;
    margin-top: 5px;
  }
}
</style>

<style lang="scss">
.detail-drawer.el-drawer {
  .el-drawer__body {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 0;
  }

  .el-drawer__footer {
    border-top: 1px solid #ebeef5;
  }
}
</style>
