<template>
  <div class="guarantee-detail" v-if="detail">
    <!-- 上半部分 -->
    <div class="detail-top">
      <!-- 基本信息 -->
      <div class="section basic-info">
        <div class="section-title">基本信息</div>
        <el-form label-width="100px" label-position="right" class="info-form">
          <el-form-item label="保障任务名称">
            <span class="form-value">{{ detail.task.taskName }}</span>
          </el-form-item>
          <el-form-item label="责任单位">
            <span class="form-value">{{ detail.task.responsibleUnit }}</span>
          </el-form-item>
          <el-form-item label="所属区域">
            <span class="form-value">{{ detail.task.area }}</span>
          </el-form-item>
          <el-form-item label="所属路段">
            <span class="form-value">{{ detail.task.roadSection }}</span>
          </el-form-item>
          <el-form-item label="任务类型">
            <span class="form-value">{{ detail.task.taskType }}</span>
          </el-form-item>
          <el-form-item label="任务状态">
            <el-tag :type="detail.task.status === '已完成' ? 'success' : detail.task.status === '进行中' ? '' : 'info'" size="small">
              {{ detail.task.status }}
            </el-tag>
          </el-form-item>
          <el-form-item label="是否重点">
            <span class="form-value">{{ detail.task.isKeyTask ? '是' : '否' }}</span>
          </el-form-item>
          <el-form-item label="任务描述">
            <span class="form-value desc-text">{{ detail.task.description }}</span>
          </el-form-item>
        </el-form>
      </div>

      <!-- 时间信息 -->
      <div class="section time-info">
        <div class="section-title">时间信息</div>
        <el-form label-width="100px" label-position="right" class="info-form">
          <el-form-item label="开始时间">
            <span class="form-value">{{ detail.task.startTime }}</span>
          </el-form-item>
          <el-form-item label="结束时间">
            <span class="form-value">{{ detail.task.endTime }}</span>
          </el-form-item>
        </el-form>
      </div>

      <!-- 关联信息 -->
      <div class="section related-info">
        <div class="section-title">关联信息</div>
        <el-form label-width="120px" label-position="right" class="info-form">
          <el-form-item label="关联事件">
            <span class="form-value">{{ detail.task.relatedEvent || '无' }}</span>
          </el-form-item>
          <el-form-item label="单位联系负责人">
            <span class="form-value">{{ detail.task.contactPerson }}</span>
          </el-form-item>
        </el-form>
      </div>

      <!-- 重点路段及交通设施清单 -->
      <div class="section road-facility">
        <div class="section-header">
          <div class="section-title">重点路段及交通设施清单</div>
          <div class="section-actions">
            <el-button type="primary" plain size="small">+ 关联路段</el-button>
            <el-button type="primary" plain size="small">+ 关联设施</el-button>
          </div>
        </div>
        <el-table :data="detail.roadFacilities" border size="small" class="mini-table">
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="taskName" label="关联任务" min-width="120" show-overflow-tooltip />
          <el-table-column prop="facilityName" label="重点路段名称 / 交通设施名称" min-width="200" show-overflow-tooltip />
          <el-table-column prop="facilityType" label="类型" width="100" align="center" />
          <el-table-column label="操作" width="100" align="center">
            <template #default="{ row }">
              <el-button type="primary" link size="small">✏️</el-button>
              <el-button type="danger" link size="small">🗑️</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <span>共 {{ detail.roadFacilities.length }} 条</span>
        </div>
      </div>
    </div>

    <!-- 下半部分 -->
    <div class="detail-bottom">
      <!-- 监控点清单 -->
      <div class="section monitor-list">
        <div class="section-header">
          <div class="section-title">监控点清单</div>
          <el-button type="primary" plain size="small">+ 关联监控点</el-button>
        </div>
        <el-table :data="detail.monitorPoints" border size="small" class="mini-table">
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="taskName" label="关联任务" min-width="120" show-overflow-tooltip />
          <el-table-column prop="pointName" label="监控点名称" min-width="180" show-overflow-tooltip />
          <el-table-column prop="roadSection" label="所属路段" width="120" />
          <el-table-column label="操作" width="100" align="center">
            <template #default="{ row }">
              <el-button type="primary" link size="small">✏️</el-button>
              <el-button type="danger" link size="small">🗑️</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-footer">
          <span>共 {{ detail.monitorPoints.length }} 条</span>
        </div>
      </div>

      <!-- 保障轮巡规则信息 -->
      <div class="section patrol-rule">
        <div class="section-header">
          <div class="section-title">保障轮巡规则信息</div>
          <el-badge :value="1" class="video-badge">
            <el-button type="primary" link size="small">查看视频</el-button>
          </el-badge>
        </div>
        <div v-if="detail.patrolRule" class="rule-content">
          <div class="rule-row">
            <span class="rule-label">轮巡时间间隔：</span>
            <el-input-number v-model="detail.patrolRule.intervalMinutes" :min="1" :max="1440" size="small" style="width: 100px;" />
            <span class="rule-unit">分钟</span>
          </div>
          <div class="rule-row">
            <span class="rule-label">轮巡时间段：</span>
            <el-time-picker v-model="detail.patrolRule.timeRangeStart" format="HH:mm" value-format="HH:mm" size="small" style="width: 100px;" />
            <span class="rule-separator">~</span>
            <el-time-picker v-model="detail.patrolRule.timeRangeEnd" format="HH:mm" value-format="HH:mm" size="small" style="width: 100px;" />
          </div>
          <div class="rule-row">
            <span class="rule-label">轮巡方式：</span>
            <el-select v-model="detail.patrolRule.patrolMethod" size="small" style="width: 160px;">
              <el-option label="按时间间隔轮巡" value="按时间间隔轮巡" />
              <el-option label="按事件触发轮巡" value="按事件触发轮巡" />
              <el-option label="手动轮巡" value="手动轮巡" />
            </el-select>
          </div>
          <div class="rule-row">
            <span class="rule-label">宫格配置：</span>
            <el-select v-model="detail.patrolRule.gridConfig" size="small" style="width: 160px;">
              <el-option label="3x3（九宫格）" value="3x3（九宫格）" />
              <el-option label="2x2（四宫格）" value="2x2（四宫格）" />
              <el-option label="4x4（十六宫格）" value="4x4（十六宫格）" />
            </el-select>
          </div>
          <div class="grid-preview">
            <div class="grid-label">宫格预览：</div>
            <div class="grid-box">
              <div v-for="i in 9" :key="i" class="grid-cell">{{ i }}</div>
            </div>
          </div>
        </div>
        <el-empty v-else description="暂未配置轮巡规则" :image-size="60" />
      </div>

      <!-- 事件检测规则信息 -->
      <div class="section detection-rule">
        <div class="section-title">事件检测规则信息</div>
        <div v-if="detail.detectionRule" class="rule-content">
          <div class="rule-row">
            <span class="rule-label">AI监测能力：</span>
            <el-select v-model="detail.detectionRule.aiCapability" size="small" style="width: 200px;">
              <el-option label="接入第三方AI监测平台" value="接入第三方AI监测平台" />
              <el-option label="本地AI检测" value="本地AI检测" />
              <el-option label="不启用AI检测" value="不启用AI检测" />
            </el-select>
          </div>
          <div class="rule-row">
            <span class="rule-label">关联监控点：</span>
            <span class="rule-value">{{ detail.detectionRule.boundMonitorCount }} 个监控点已绑定</span>
            <el-button type="primary" link size="small">查看</el-button>
          </div>
          <div class="rule-row">
            <span class="rule-label">检测事件类型：</span>
            <div class="tag-list">
              <el-tag v-for="type in detail.detectionRule.eventTypes" :key="type" size="small" closable @close="removeEventType(type)">{{ type }}</el-tag>
              <el-button type="primary" link size="small">+3</el-button>
            </div>
          </div>
          <div class="rule-row">
            <span class="rule-label">预警方式：</span>
            <div class="alarm-methods">
              <el-checkbox v-model="detail.detectionRule.alarmMethods.platformPopup">平台弹窗</el-checkbox>
              <el-checkbox v-model="detail.detectionRule.alarmMethods.smsNotification">短信通知</el-checkbox>
              <el-checkbox v-model="detail.detectionRule.alarmMethods.phoneNotification">电话通知</el-checkbox>
              <el-checkbox v-model="detail.detectionRule.alarmMethods.appPush">APP推送</el-checkbox>
            </div>
          </div>
        </div>
        <el-empty v-else description="暂未配置检测规则" :image-size="60" />
      </div>
    </div>

    <!-- 事件列表 -->
    <div class="detail-events">
      <div class="section-header">
        <div class="section-title">事件列表</div>
        <el-button type="primary" link size="small">绑定事件</el-button>
      </div>
      <div class="event-list">
        <div v-for="event in detail.events" :key="event.id" class="event-item">
          <div class="event-header">
            <span class="event-name">{{ event.eventName }}</span>
            <el-tag :type="event.reportType === '首报' ? 'danger' : 'warning'" size="small">{{ event.reportType }}</el-tag>
            <el-icon v-if="event.hasMedia" class="media-icon"><VideoCamera /></el-icon>
          </div>
          <div class="event-info">
            <span class="event-time">接报时间：{{ event.reportTime }}</span>
            <span class="event-location">事故地点：{{ event.eventLocation }}</span>
          </div>
          <div class="event-desc">
            <span class="desc-label">事故现场信息：</span>
            <span class="desc-content">{{ event.eventDescription }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { VideoCamera } from '@element-plus/icons-vue'
import { getGuaranteeDetail } from '@/mock/dispatch/guaranteeData'
import type { GuaranteeDetail } from '@/types/dispatch/guarantee'

const props = defineProps<{
  taskId: number
}>()

const detail = computed<GuaranteeDetail | null>(() => {
  return getGuaranteeDetail(props.taskId)
})

const removeEventType = (type: string) => {
  if (detail.value?.detectionRule) {
    detail.value.detectionRule.eventTypes = detail.value.detectionRule.eventTypes.filter(t => t !== type)
  }
}
</script>

<style lang="scss" scoped>
.guarantee-detail {
  padding: 0;
}

.section {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;

  .section-title {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
}

.section-actions {
  display: flex;
  gap: 8px;
}

.detail-top {
  display: grid;
  grid-template-columns: 1fr 1fr 1.5fr;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e4e7ed;
}

.detail-bottom {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 2px solid #e4e7ed;
}

.detail-events {
  padding-top: 20px;
}

// 基本信息
.basic-info {
  .info-form {
    :deep(.el-form-item) {
      margin-bottom: 12px;
    }

    .form-value {
      color: #606266;
      font-size: 14px;
    }

    .desc-text {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}

// 地图
.task-location {
  .map-container {
    border: 1px solid #dcdfe6;
    border-radius: 8px;
    overflow: hidden;
  }

  .map-placeholder {
    height: 280px;
    background: linear-gradient(135deg, #e8f4e8 0%, #d4e8d4 50%, #c4dcc4 100%);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .map-controls {
      position: absolute;
      left: 12px;
      top: 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .map-toggle {
      position: absolute;
      right: 12px;
      top: 12px;
    }

    .map-pin {
      font-size: 48px;
    }
  }

  .map-coords {
    padding: 8px 12px;
    background: #f5f7fa;
    font-size: 13px;
    color: #606266;
    text-align: center;
  }
}

// 表格
.mini-table {
  font-size: 13px;

  :deep(.el-table__header th) {
    background: #f5f7fa;
    font-weight: 600;
  }
}

.table-footer {
  margin-top: 8px;
  font-size: 13px;
  color: #909399;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

// 轮巡规则
.patrol-rule {
  .rule-content {
    .rule-row {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      gap: 8px;
    }

    .rule-label {
      color: #606266;
      font-size: 14px;
      white-space: nowrap;
    }

    .rule-unit {
      color: #606266;
      font-size: 14px;
    }

    .rule-separator {
      color: #909399;
      margin: 0 4px;
    }

    .grid-preview {
      display: flex;
      align-items: flex-start;
      margin-top: 16px;
    }

    .grid-label {
      color: #606266;
      font-size: 14px;
      white-space: nowrap;
      margin-right: 12px;
    }

    .grid-box {
      display: grid;
      grid-template-columns: repeat(3, 36px);
      gap: 4px;
    }

    .grid-cell {
      width: 36px;
      height: 36px;
      border: 1px solid #409eff;
      color: #409eff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 500;
    }
  }
}

// 检测规则
.detection-rule {
  .rule-content {
    .rule-row {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      gap: 8px;
      flex-wrap: wrap;
    }

    .rule-label {
      color: #606266;
      font-size: 14px;
      white-space: nowrap;
    }

    .rule-value {
      color: #606266;
      font-size: 14px;
    }

    .tag-list {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      align-items: center;
    }

    .alarm-methods {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
  }
}

// 视频徽章
.video-badge {
  :deep(.el-badge__content) {
    top: 4px;
    right: 14px;
  }
}

// 事件列表
.event-list {
  max-height: 400px;
  overflow-y: auto;
}

.event-item {
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  margin-bottom: 12px;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }

  &:last-child {
    margin-bottom: 0;
  }

  .event-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .event-name {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }

  .media-icon {
    color: #409eff;
    font-size: 16px;
    margin-left: 4px;
  }

  .event-info {
    display: flex;
    gap: 24px;
    margin-bottom: 8px;
    font-size: 13px;
    color: #606266;
  }

  .event-time,
  .event-location {
    flex: 1;
  }

  .event-desc {
    font-size: 13px;
    color: #606266;

    .desc-label {
      color: #909399;
    }

    .desc-content {
      color: #303133;
    }
  }
}
</style>
