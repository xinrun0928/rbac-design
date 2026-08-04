<template>
  <div class="event-receive-page">
    <!-- 左侧主区域 -->
    <div class="receive-main">
      <!-- 重点关注 -->
      <div class="focus-section">
        <div class="focus-header">
          <span class="focus-title">重点关注（{{ focusEvents.length }}）</span>
          <div class="focus-actions">
            <span class="auto-refresh">
              <el-icon class="refresh-icon"><Refresh /></el-icon>
              每(5)秒自动刷新<br />最后更新时间：2026年4月16日 14点01分
            </span>
            <span class="implement-desc">实现厅值班人员对事件的接报</span>
          </div>
          <el-button type="primary" size="small" :icon="Monitor" class="event-screen-btn" @click="goToScreen">事件大屏</el-button>
        </div>
        <div class="focus-cards">
          <div
            v-for="event in focusEvents"
            :key="event.id"
            class="focus-card"
            :class="{ unread: !event.read }"
            @click="handleFocusClick(event)"
          >
            <div class="card-header">
              <span class="road-name">{{ event.roadName }}</span>
              <div class="card-tags">
                <el-tag size="small" :type="event.statusTag === '终' ? 'success' : 'warning'">
                  {{ event.statusTag }}
                </el-tag>
                <el-icon v-if="!event.read" class="unread-dot"><View /></el-icon>
                <el-icon class="card-action"><Warning /></el-icon>
                <el-icon class="card-action"><Bell /></el-icon>
              </div>
            </div>
            <div class="card-time">{{ event.happenTime }}</div>
            <div class="card-stats">
              <span>死亡 <b class="death-count">{{ event.deaths }}</b></span>
              <span>受伤 {{ event.injuries }}</span>
              <span>两客一危一重 <b class="special-count">{{ event.specialVehicles }}</b></span>
              <span>{{ event.interruptStatus }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 筛选区域 -->
      <div class="filter-section">
        <div class="filter-row">
          <div class="filter-group">
            <span
              v-for="item in reportTypes"
              :key="item"
              class="filter-tag"
              :class="{ active: activeReportType === item }"
              @click="activeReportType = item"
            >{{ item }}</span>
          </div>
          <div class="filter-group">
            <span
              v-for="item in timeRanges"
              :key="item"
              class="filter-tag"
              :class="{ active: activeTimeRange === item }"
              @click="activeTimeRange = item"
            >{{ item }}</span>
          </div>
          <div class="filter-group">
            <span
              v-for="item in viewStatuses"
              :key="item"
              class="filter-tag"
              :class="{ active: activeViewStatus === item }"
              @click="activeViewStatus = item"
            >{{ item }}</span>
          </div>
        </div>
        <div class="filter-row">
          <div class="filter-group">
            <span
              v-for="item in trafficStatuses"
              :key="item"
              class="filter-tag"
              :class="{ active: activeTrafficStatus === item }"
              @click="activeTrafficStatus = item"
            >{{ item }}</span>
          </div>
          <div class="filter-group">
            <span
              v-for="item in closeStatuses"
              :key="item"
              class="filter-tag"
              :class="{ active: activeCloseStatus === item }"
              @click="activeCloseStatus = item"
            >{{ item }}</span>
          </div>
          <div class="filter-group">
            <span
              v-for="item in alarmStatuses"
              :key="item"
              class="filter-tag"
              :class="{ active: activeAlarmStatus === item }"
              @click="activeAlarmStatus = item"
            >{{ item }}</span>
          </div>
          <div class="filter-actions">
            <el-button type="primary" link>导出</el-button>
            <el-button type="primary" link :icon="Filter">高级搜索</el-button>
          </div>
        </div>
      </div>

      <!-- 事件表格 -->
      <div class="event-table-section">
        <el-table
          :data="filteredEvents"
          border
          stripe
          highlight-current-row
          row-key="id"
          :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
          class="event-table"
          @row-click="handleRowClick"
        >
          <el-table-column label="发生/发现时段" width="140" align="center">
            <template #default="{ row }">
              <span v-if="row.timeSlot" class="time-slot-text">{{ row.timeSlot }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="eventName" label="事件名称" min-width="200">
            <template #default="{ row }">
              <span class="event-name-text">{{ row.eventName }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="updateTime" label="更新时间" width="100" align="center">
            <template #default="{ row }">
              <span class="time-text">{{ row.updateTime }}</span>
            </template>
          </el-table-column>

          <el-table-column label="事件状态" width="130" align="center">
            <template #default="{ row }">
              <div class="status-tags">
                <el-tag size="small" :type="getStatusType(row.eventStatus)">{{ row.eventStatus }}</el-tag>
                <el-tag v-if="row.hasAlarm" size="small" type="danger">告警</el-tag>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="roadSegment" label="涉及路段" min-width="220" show-overflow-tooltip />

          <el-table-column label="中断/阻塞" width="110" align="center">
            <template #default="{ row }">
              <span :class="['traffic-status', getTrafficClass(row.trafficStatus)]">
                {{ row.trafficStatus }}
              </span>
            </template>
          </el-table-column>

          <el-table-column prop="deaths" label="死亡" width="80" align="center">
            <template #default="{ row }">
              <span :class="{ 'death-highlight': row.deaths > 0 }">{{ row.deaths }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="injuries" label="受伤" width="80" align="center">
            <template #default="{ row }">
              <span :class="{ 'injury-highlight': row.injuries > 0 }">{{ row.injuries }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="specialVehicles" label="两客一危一重" width="120" align="center">
            <template #default="{ row }">
              <span :class="{ 'special-highlight': row.specialVehicles > 0 }">{{ row.specialVehicles }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 右侧详情面板 -->
    <div class="detail-panel" v-if="selectedEvent">
      <div class="detail-header">
        <div class="detail-source">
          <span class="source-icon">📋</span>
          <span class="source-name">{{ eventDetail.sourceUnit }}</span>
          <span class="source-time">{{ eventDetail.reportTime }}</span>
        </div>
        <div class="detail-report-type">
          <el-tag type="danger" size="small">【{{ eventDetail.reportType }}】</el-tag>
          <span class="report-title">{{ eventDetail.reportTitle }}</span>
          <el-icon class="detail-action"><Edit /></el-icon>
          <el-icon class="detail-action"><Warning /></el-icon>
          <el-icon class="detail-action"><Bell /></el-icon>
        </div>
      </div>

      <div class="detail-content">
        <div class="detail-row">
          <span class="detail-label">事故名称</span>
          <span class="detail-value">{{ eventDetail.accidentName }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">事件来源</span>
          <span class="detail-value">{{ eventDetail.eventSource }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">发生/发现时间</span>
          <span class="detail-value">{{ eventDetail.happenTime }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">事件描述</span>
          <span class="detail-value desc-text">{{ eventDetail.description }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">预计恢复时间</span>
          <span class="detail-value">{{ eventDetail.expectedRecoveryTime }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">报送状态</span>
          <span class="detail-value">{{ eventDetail.reportStatus }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">是否补报</span>
          <span class="detail-value">{{ eventDetail.isSupplementary }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">事故车辆信息</span>
          <span class="detail-value">{{ eventDetail.vehicleInfo }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">现场情况</span>
          <span class="detail-value">{{ eventDetail.sceneInfo }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">事件性质</span>
          <span class="detail-value">{{ eventDetail.eventNature }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">事故原因</span>
          <span class="detail-value">{{ eventDetail.accidentCause }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">受伤</span>
          <span class="detail-value">{{ eventDetail.injuries }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">受伤补充说明</span>
          <span class="detail-value">{{ eventDetail.injuriesDetail }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">死亡</span>
          <span class="detail-value">{{ eventDetail.deaths }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">死亡补充说明</span>
          <span class="detail-value">{{ eventDetail.deathsDetail }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">事件起讫桩号</span>
          <span class="detail-value">{{ eventDetail.stakeRange }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">事故地点</span>
          <span class="detail-value">{{ eventDetail.accidentLocation }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">桩号</span>
          <span class="detail-value">{{ eventDetail.stakeNumber }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">事故救援信息</span>
          <span class="detail-value">{{ eventDetail.rescueInfo }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">救援时间</span>
          <span class="detail-value">{{ eventDetail.rescueTime }}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">救援过程</span>
          <span class="detail-value">{{ eventDetail.rescueProcess }}</span>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="detail-footer">
        <el-button type="primary" size="small">新消息+1</el-button>
        <el-badge :value="5" :max="99" class="alarm-badge">
          <el-button type="danger" size="small">事故提醒</el-button>
        </el-badge>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Refresh, Monitor, View, Warning, Bell, Filter, Edit } from '@element-plus/icons-vue'
import { mockFocusEvents, mockReceiveEvents, mockEventDetail } from '@/mock/event/receiveData'
import type { FocusEvent, ReceiveEvent } from '@/types/event/receive'

const focusEvents = ref<FocusEvent[]>(mockFocusEvents)
const events = ref<ReceiveEvent[]>(mockReceiveEvents)
const selectedEvent = ref<ReceiveEvent | null>(mockReceiveEvents[0])
const eventDetail = ref(mockEventDetail)

function goToScreen() {
  const base = window.location.href.split('#')[0]
  window.open(base + '#/event/receive/screen', '_blank')
}

// 筛选状态
const activeReportType = ref('全部')
const activeTimeRange = ref('24小时内')
const activeViewStatus = ref('全部')
const activeTrafficStatus = ref('全部')
const activeCloseStatus = ref('含关闭')
const activeAlarmStatus = ref('全部')

const reportTypes = ['全部', '仅首报', '未终报', '已终报']
const timeRanges = ['8小时内', '12小时内', '24小时内', '自定义时间']
const viewStatuses = ['全部', '未查看', '已查看']
const trafficStatuses = ['全部', '中断', '阻塞', '未涉及']
const closeStatuses = ['含关闭', '不含关闭']
const alarmStatuses = ['全部', '告警', '无告警']

// 简单筛选（演示用）
const filteredEvents = ref<ReceiveEvent[]>(events.value)

function getStatusType(status: string) {
  const map: Record<string, string> = {
    '首报': '',
    '续报1': 'warning',
    '续报2': 'warning',
    '终报': 'success',
  }
  return (map[status] || 'info') as any
}

function getTrafficClass(status: string) {
  const map: Record<string, string> = {
    '中断': 'status-interrupt',
    '阻塞': 'status-block',
    '未涉及': 'status-none',
  }
  return map[status] || ''
}

function handleFocusClick(event: FocusEvent) {
  event.read = true
  selectedEvent.value = events.value[0]
}

function handleRowClick(row: ReceiveEvent) {
  selectedEvent.value = row
}
</script>

<style lang="scss" scoped>
.event-receive-page {
  display: flex;
  gap: 16px;
  height: 100%;
  overflow: hidden;
  background: #f0f2f5;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.receive-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;
  min-width: 0;
}

// 重点关注区域
  .focus-section {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  margin: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

  .focus-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 12px;

    .focus-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }

    .focus-actions {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 16px;
      font-size: 12px;
      color: #909399;

      .auto-refresh {
        display: flex;
        align-items: center;
        gap: 4px;

        .refresh-icon {
          color: #409eff;
          cursor: pointer;
        }
      }
    }

    .event-screen-btn {
      flex-shrink: 0;
    }
  }

  .focus-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    overflow-x: auto;

    .focus-card {
      min-width: 240px;
    }
  }

  .focus-card {
    padding: 12px;
    border: 1px solid #ebeef5;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: #409eff;
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
    }

    &.unread {
      border-color: #f56c6c;
      background: #fef0f0;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;

      .road-name {
        font-size: 14px;
        font-weight: 500;
        color: #303133;
        line-height: 1.4;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .card-tags {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-left: 8px;
        flex-shrink: 0;

        .unread-dot {
          color: #f56c6c;
          font-size: 8px;
        }

        .card-action {
          color: #c0c4cc;
          cursor: pointer;
          font-size: 14px;

          &:hover {
            color: #409eff;
          }
        }
      }
    }

    .card-time {
      font-size: 12px;
      color: #909399;
      margin-bottom: 8px;
    }

    .card-stats {
      display: flex;
      gap: 12px;
      font-size: 12px;
      color: #606266;

      b {
        color: #f56c6c;
      }

      .special-count {
        color: #e6a23c;
      }
    }
  }
}

// 筛选区域
.filter-section {
  background: #fff;
  padding: 12px 16px;
  margin: 0;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

  .filter-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .filter-group {
    display: flex;
    align-items: center;
    gap: 4px;

    &::after {
      content: '';
      width: 1px;
      height: 16px;
      background: #e4e7ed;
      margin-left: 8px;
    }
  }

  .filter-tag {
    padding: 4px 12px;
    font-size: 13px;
    color: #606266;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      color: #409eff;
      border-color: #c6e2ff;
      background: #ecf5ff;
    }

    &.active {
      color: #fff;
      background: #409eff;
      border-color: #409eff;
    }
  }

  .filter-actions {
    margin-left: auto;
    display: flex;
    gap: 12px;
  }
}

// 事件表格
.event-table-section {
  flex: 1;
  background: #fff;
  margin: 0;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  overflow: auto;

  .event-table {
    width: 100%;
  }

  .time-slot-text {
    font-size: 13px;
    color: #606266;
  }

  .event-name-text {
    font-weight: 500;
    color: #303133;
  }

  .time-text {
    font-size: 13px;
    color: #909399;
  }

  .status-tags {
    display: flex;
    justify-content: center;
    gap: 4px;
  }

  .traffic-status {
    font-size: 13px;
    font-weight: 500;

    &.status-interrupt { color: #f56c6c; }
    &.status-block { color: #e6a23c; }
    &.status-none { color: #909399; }
  }

  .death-highlight { color: #f56c6c; font-weight: 600; }
  .injury-highlight { color: #f56c6c; }
  .special-highlight { color: #e6a23c; font-weight: 600; }
}

// 右侧详情面板
.detail-panel {
  width: 520px;
  background: #fff;
  margin: 0;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .detail-header {
    padding: 16px;
    border-bottom: 1px solid #ebeef5;

    .detail-source {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;

      .source-icon {
        font-size: 18px;
      }

      .source-name {
        font-size: 15px;
        font-weight: 600;
        color: #303133;
      }

      .source-time {
        font-size: 13px;
        color: #909399;
        margin-left: auto;
      }
    }

    .detail-report-type {
      display: flex;
      align-items: center;
      gap: 8px;

      .report-title {
        font-size: 14px;
        color: #409eff;
        flex: 1;
      }

      .detail-action {
        color: #c0c4cc;
        cursor: pointer;
        font-size: 16px;

        &:hover { color: #409eff; }
      }
    }
  }

  .detail-content {
    flex: 1;
    overflow-y: auto;
    padding: 16px;

    .detail-row {
      display: flex;
      padding: 10px 0;
      border-bottom: 1px solid #f5f7fa;

      &:last-child {
        border-bottom: none;
      }

      .detail-label {
        width: 120px;
        flex-shrink: 0;
        font-size: 13px;
        color: #909399;
      }

      .detail-value {
        flex: 1;
        font-size: 13px;
        color: #303133;
        line-height: 1.6;

        &.desc-text {
          max-height: 60px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }

  .detail-footer {
    padding: 12px 16px;
    border-top: 1px solid #ebeef5;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}
</style>
