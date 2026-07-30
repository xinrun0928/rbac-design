<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <div class="stat-cards animate-item">
      <div
        v-for="(card, index) in statCards"
        :key="card.title"
        class="stat-card"
        :style="{ animationDelay: `${index * 0.06}s` }"
      >
        <div class="stat-icon" :style="{ background: card.color + '15', color: card.color }">
          <el-icon :size="24"><component :is="getIcon(card.icon)" /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">
            <span class="stat-number">{{ card.value }}</span>
            <span v-if="card.suffix" class="stat-suffix">{{ card.suffix }}</span>
          </div>
          <div class="stat-title">{{ card.title }}</div>
          <div v-if="card.trend !== undefined" class="stat-trend">
            <span :class="['trend-value', card.trend >= 0 ? 'up' : 'down']">
              {{ card.trend >= 0 ? '+' : '' }}{{ card.trend }}{{ card.trendLabel ? '%' : '' }}
            </span>
            <span v-if="card.trendLabel" class="trend-label">{{ card.trendLabel }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 登录趋势 & 系统公告 -->
    <div class="middle-row animate-item">
      <el-card shadow="never" class="info-card chart-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="18"><DataLine /></el-icon>
            <span>近7日登录趋势</span>
          </div>
        </template>
        <div ref="loginChartRef" class="chart-container" />
      </el-card>

      <el-card shadow="never" class="info-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="18"><Bell /></el-icon>
            <span>系统公告</span>
          </div>
        </template>
        <div class="notice-list">
          <div v-for="item in notices" :key="item.id" class="notice-item">
            <el-tag
              :type="getNoticeTagType(item.type)"
              size="small"
              effect="plain"
              class="notice-tag"
            >
              {{ getNoticeLabel(item.type) }}
            </el-tag>
            <span class="notice-title">{{ item.title }}</span>
            <span class="notice-time">{{ item.time }}</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 最近登录 & 待办事项 -->
    <div class="bottom-row animate-item">
      <el-card shadow="never" class="info-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="18"><User /></el-icon>
            <span>最近登录</span>
          </div>
        </template>
        <el-table
          :data="recentLogins"
          size="small"
          :header-cell-style="{ background: '#F5F7FA', color: '#606266', fontWeight: '600', textAlign: 'center' }"
          stripe
          max-height="320"
        >
          <el-table-column prop="username" label="用户" width="90" align="center">
            <template #default="{ row }">
              <span class="username-text">{{ row.username }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="dept" label="部门" width="120" show-overflow-tooltip />
          <el-table-column prop="ip" label="IP地址" width="130">
            <template #default="{ row }">
              <span class="mono-text">{{ row.ip }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="location" label="登录地点" width="120" show-overflow-tooltip />
          <el-table-column prop="browser" label="浏览器" width="110" />
          <el-table-column prop="loginTime" label="登录时间" width="150" />
          <el-table-column prop="status" label="状态" width="80" align="center">
            <template #default="{ row }">
              <el-tag :type="row.status === 'success' ? 'success' : 'danger'" size="small" effect="plain">
                {{ row.status === 'success' ? '成功' : '失败' }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <el-card shadow="never" class="info-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="18"><Document /></el-icon>
            <span>待办事项</span>
          </div>
        </template>
        <div class="todo-list">
          <div v-for="item in todoItems" :key="item.id" class="todo-item">
            <div class="todo-icon">
              <el-icon :size="16" :color="getTodoColor(item.type)">
                <component :is="getTodoIcon(item.type)" />
              </el-icon>
            </div>
            <div class="todo-content">
              <div class="todo-title">{{ item.title }}</div>
              <div class="todo-time">{{ item.time }}</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import {
  User, UserFilled, Monitor, Menu, Bell,
  DataLine, Document, Check, Clock, Warning
} from '@element-plus/icons-vue'
import type { Component } from 'vue'
import { statCards, loginTrendData, recentLogins, notices, todoItems } from '@/mock/admin/dashboardData'

const loginChartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

const iconMap: Record<string, Component> = {
  User, UserFilled, Monitor, Menu, Bell
}

function getIcon(name: string): Component {
  return iconMap[name] || User
}

function initChart() {
  if (!loginChartRef.value) return
  chartInstance = echarts.init(loginChartRef.value)

  chartInstance.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255,255,255,0.95)',
      borderColor: '#ebeef5',
      textStyle: { color: '#303133' }
    },
    grid: {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50
    },
    xAxis: {
      type: 'category',
      data: loginTrendData.map(d => d.date),
      axisLine: { lineStyle: { color: '#dcdfe6' } },
      axisLabel: { color: '#909399', fontSize: 12 }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#909399', fontSize: 12 },
      splitLine: { lineStyle: { color: '#f0f2f5', type: 'dashed' } }
    },
    series: [{
      type: 'line',
      data: loginTrendData.map(d => d.count),
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { color: '#409EFF', width: 3 },
      itemStyle: { color: '#409EFF', borderWidth: 2, borderColor: '#fff' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(64,158,255,0.25)' },
          { offset: 1, color: 'rgba(64,158,255,0.02)' }
        ])
      }
    }]
  })
}

function handleResize() {
  chartInstance?.resize()
}

function getNoticeTagType(type: string): '' | 'success' | 'warning' | 'info' | 'danger' {
  const map: Record<string, '' | 'success' | 'warning' | 'info' | 'danger'> = {
    notice: 'info',
    update: 'success',
    alert: 'warning'
  }
  return map[type] || 'info'
}

function getNoticeLabel(type: string): string {
  const map: Record<string, string> = { notice: '通知', update: '更新', alert: '告警' }
  return map[type] || '通知'
}

function getTodoColor(type: string): string {
  const map: Record<string, string> = { approval: '#E6A23C', task: '#409EFF', alert: '#F56C6C' }
  return map[type] || '#909399'
}

function getTodoIcon(type: string): Component {
  const map: Record<string, Component> = { approval: Check, task: Clock, alert: Warning }
  return map[type] || Clock
}

onMounted(() => {
  nextTick(() => initChart())
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance?.dispose()
})
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 20px;
  background: linear-gradient(160deg, #f5f7fa 0%, #e8ecf1 100%);
  height: 100%;
  overflow-y: auto;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;

  .animate-item {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;
    &:nth-child(1) { animation-delay: 0.05s; }
    &:nth-child(2) { animation-delay: 0.15s; }
    &:nth-child(3) { animation-delay: 0.25s; }
  }

  // ── 统计卡片 ──
  .stat-cards {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
    margin-bottom: 16px;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 20px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    transition: transform 0.2s, box-shadow 0.2s;
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-info {
      flex: 1;
      min-width: 0;

      .stat-number {
        font-size: 24px;
        font-weight: 700;
        color: #303133;
        line-height: 1.2;
      }

      .stat-suffix {
        font-size: 13px;
        color: #909399;
        margin-left: 2px;
      }

      .stat-title {
        font-size: 13px;
        color: #909399;
        margin-top: 4px;
      }

      .stat-trend {
        margin-top: 4px;
        font-size: 12px;

        .trend-value {
          &.up { color: #67C23A; }
          &.down { color: #F56C6C; }
        }

        .trend-label {
          color: #C0C4CC;
          margin-left: 4px;
        }
      }
    }
  }

  // ── 通用卡片 ──
  .info-card {
    border-radius: 12px;
    border: none;

    :deep(.el-card__header) {
      padding: 12px 20px;
      background: #fafbfc;
      border-bottom: 1px solid #ebeef5;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 15px;
      color: #303133;
    }
  }

  // ── 中间行 ──
  .middle-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;

    .chart-card {
      :deep(.el-card__body) {
        padding: 16px;
      }
    }
  }

  .chart-container {
    width: 100%;
    height: 280px;
  }

  // ── 公告列表 ──
  .notice-list {
    .notice-item {
      display: flex;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #f5f7fa;

      &:last-child { border-bottom: none; }

      .notice-tag {
        margin-right: 10px;
        flex-shrink: 0;
      }

      .notice-title {
        flex: 1;
        font-size: 13px;
        color: #303133;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .notice-time {
        font-size: 12px;
        color: #C0C4CC;
        margin-left: 12px;
        flex-shrink: 0;
      }
    }
  }

  // ── 底部行 ──
  .bottom-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .username-text {
    font-weight: 500;
    color: #409EFF;
  }

  .mono-text {
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    font-size: 12px;
    color: #606266;
  }

  // ── 待办事项 ──
  .todo-list {
    .todo-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #f5f7fa;

      &:last-child { border-bottom: none; }

      .todo-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background: #f5f7fa;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .todo-content {
        flex: 1;
        min-width: 0;

        .todo-title {
          font-size: 13px;
          color: #303133;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .todo-time {
          font-size: 12px;
          color: #C0C4CC;
          margin-top: 4px;
        }
      }
    }
  }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
