<template>
  <div class="road-statistics-dashboard">
    <!-- 顶部标题栏 -->
    <div class="dashboard-header">
      <div class="header-left">
        <div class="system-logo">
          <el-icon :size="24" color="#409EFF"><DataLine /></el-icon>
        </div>
        <h1>重点路段统计</h1>
      </div>
      <div class="header-tabs">
        <div
          v-for="tab in viewTabs"
          :key="tab.key"
          class="tab-item"
          :class="{ active: activeView === tab.key }"
          @click="activeView = tab.key"
        >
          {{ tab.label }}
        </div>
      </div>
      <div class="header-right">
        <span class="current-time">{{ currentTime }}</span>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="dashboard-content">
      <!-- 总览 -->
      <div v-if="activeView === 'overview'" class="view-container">
        <div class="overview-grid">
          <div class="stat-card">
            <div class="stat-value">128</div>
            <div class="stat-label">重点路段总数</div>
          </div>
          <div class="stat-card warning">
            <div class="stat-value">23</div>
            <div class="stat-label">当前拥堵路段</div>
          </div>
          <div class="stat-card danger">
            <div class="stat-value">5</div>
            <div class="stat-label">严重拥堵</div>
          </div>
          <div class="stat-card success">
            <div class="stat-value">89%</div>
            <div class="stat-label">路段畅通率</div>
          </div>
        </div>
        <div class="overview-charts">
          <div class="chart-card">
            <div class="chart-title">拥堵趋势</div>
            <div class="chart-placeholder">图表区域</div>
          </div>
          <div class="chart-card">
            <div class="chart-title">车流量分布</div>
            <div class="chart-placeholder">图表区域</div>
          </div>
        </div>
      </div>

      <!-- 重点路段拥堵分析 -->
      <div v-else-if="activeView === 'congestion'" class="view-container">
        <div class="view-header">
          <h2>重点路段拥堵分析</h2>
        </div>
        <div class="chart-area">
          <div class="chart-placeholder large">拥堵分析图表</div>
        </div>
      </div>

      <!-- 重点路段车流量分析 -->
      <div v-else-if="activeView === 'traffic'" class="view-container">
        <div class="view-header">
          <h2>重点路段车流量分析</h2>
        </div>
        <div class="chart-area">
          <div class="chart-placeholder large">车流量分析图表</div>
        </div>
      </div>

      <!-- 重点路段拥堵发生次数统计 -->
      <div v-else-if="activeView === 'frequency'" class="view-container">
        <div class="view-header">
          <h2>重点路段拥堵发生次数统计</h2>
        </div>
        <div class="chart-area">
          <div class="chart-placeholder large">拥堵次数统计图表</div>
        </div>
      </div>

      <!-- 重点路段拥堵时长分析 -->
      <div v-else-if="activeView === 'duration'" class="view-container">
        <div class="view-header">
          <h2>重点路段拥堵时长分析</h2>
        </div>
        <div class="chart-area">
          <div class="chart-placeholder large">拥堵时长分析图表</div>
        </div>
      </div>

      <!-- 重点路段车流量分析2 -->
      <div v-else-if="activeView === 'traffic2'" class="view-container">
        <div class="view-header">
          <h2>重点路段车流量分析</h2>
        </div>
        <div class="chart-area">
          <div class="chart-placeholder large">车流量分析图表</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { DataLine } from '@element-plus/icons-vue'

const activeView = ref('overview')
const currentTime = ref('')

// 视图标签配置
const viewTabs = [
  { key: 'overview', label: '总览' },
  { key: 'congestion', label: '重点路段拥堵分析' },
  { key: 'traffic', label: '重点路段车流量分析' },
  { key: 'frequency', label: '重点路段拥堵发生次数统计' },
  { key: 'duration', label: '重点路段拥堵时长分析' },
  { key: 'traffic2', label: '重点路段车流量分析' },
]

// 更新时间
let timer: ReturnType<typeof setInterval>
const updateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style lang="scss" scoped>
.road-statistics-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #0c1426 0%, #1a2742 50%, #0d1b2a 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
}

// 顶部标题栏
.dashboard-header {
  height: 60px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(64, 158, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .system-logo {
      width: 40px;
      height: 40px;
      background: rgba(64, 158, 255, 0.2);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    h1 {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
      background: linear-gradient(90deg, #409EFF, #67C23A);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .header-tabs {
    display: flex;
    gap: 8px;

    .tab-item {
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid transparent;

      &:hover {
        background: rgba(64, 158, 255, 0.2);
        border-color: rgba(64, 158, 255, 0.5);
      }

      &.active {
        background: rgba(64, 158, 255, 0.3);
        border-color: #409EFF;
        color: #409EFF;
      }
    }
  }

  .header-right {
    .current-time {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
    }
  }
}

// 内容区域
.dashboard-content {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

.view-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

// 总览视图
.overview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;

  &.warning {
    border-color: #E6A23C;
    background: rgba(230, 162, 60, 0.1);
  }

  &.danger {
    border-color: #F56C6C;
    background: rgba(245, 108, 108, 0.1);
  }

  &.success {
    border-color: #67C23A;
    background: rgba(103, 194, 58, 0.1);
  }

  .stat-value {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #409EFF;
  }

  .stat-label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
  }
}

.overview-charts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  flex: 1;
}

.chart-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;

  .chart-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
    color: rgba(255, 255, 255, 0.9);
  }

  .chart-placeholder {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px;
    min-height: 200px;
  }
}

// 其他视图
.view-header {
  margin-bottom: 20px;

  h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    color: rgba(255, 255, 255, 0.9);
  }
}

.chart-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chart-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  font-size: 16px;
  min-height: 400px;

  &.large {
    min-height: 500px;
  }
}
</style>
