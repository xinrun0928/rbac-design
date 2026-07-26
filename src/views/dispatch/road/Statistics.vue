<template>
  <div class="road-statistics-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>重点路段统计</h2>
    </div>

    <!-- 入口卡片区域 -->
    <div class="entry-grid">
      <div
        v-for="entry in entries"
        :key="entry.key"
        class="entry-card"
        @click="openPage(entry.path)"
      >
        <div class="entry-icon" :style="{ background: entry.color }">
          <el-icon :size="36"><component :is="entry.icon" /></el-icon>
        </div>
        <div class="entry-info">
          <h3>{{ entry.title }}</h3>
          <p>{{ entry.description }}</p>
        </div>
        <div class="entry-arrow">
          <el-icon :size="24"><ArrowRight /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowRight, DataLine, TrendCharts, DataAnalysis, Timer, Histogram, PieChart } from '@element-plus/icons-vue'

// 入口配置
const entries = [
  {
    key: 'overview',
    title: '总览',
    description: '重点路段整体数据概览',
    path: '/dispatch/road/screen/overview',
    icon: DataLine,
    color: '#00b4d8'
  },
  {
    key: 'congestion',
    title: '重点路段拥堵分析',
    description: '分析各路段拥堵情况',
    path: '/dispatch/road/screen/congestion',
    icon: TrendCharts,
    color: '#e6a23c'
  },
  {
    key: 'traffic',
    title: '重点路段车流量分析',
    description: '分析各路段车流量数据',
    path: '/dispatch/road/screen/traffic',
    icon: DataAnalysis,
    color: '#67c23a'
  },
  {
    key: 'frequency',
    title: '重点路段拥堵发生次数统计',
    description: '统计拥堵发生频次',
    path: '/dispatch/road/screen/frequency',
    icon: Histogram,
    color: '#f56c6c'
  },
  {
    key: 'duration',
    title: '重点路段拥堵时长分析',
    description: '分析拥堵持续时长',
    path: '/dispatch/road/screen/duration',
    icon: Timer,
    color: '#909399'
  },
  {
    key: 'traffic2',
    title: '重点路段车流量分析',
    description: '车流量趋势分析',
    path: '/dispatch/road/screen/traffic-analysis',
    icon: PieChart,
    color: '#9b59b6'
  }
]

// 打开新页面
const openPage = (path: string) => {
  window.open(path, '_blank')
}
</script>

<style lang="scss" scoped>
.road-statistics-page {
  background: linear-gradient(135deg, #0c1426 0%, #1a2742 50%, #0d1b2a 100%);
  border-radius: 0;
  padding: 0;
  margin: -16px;
  min-height: calc(100vh - 112px);
  display: flex;
  flex-direction: column;
}

.page-header {
  padding: 40px 40px 32px;
  text-align: center;

  h2 {
    margin: 0;
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 4px;
    text-shadow: 0 2px 12px rgba(64, 158, 255, 0.3);
  }
}

.entry-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 24px;
  padding: 0 40px 40px;
}

.entry-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(64, 158, 255, 0.3);
  border-radius: 12px;
  padding: 32px 28px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 20px;

  &:hover {
    transform: translateY(-4px);
    background: rgba(64, 158, 255, 0.15);
    border-color: #409eff;
    box-shadow: 0 8px 24px rgba(64, 158, 255, 0.2);
  }

  .entry-icon {
    width: 72px;
    height: 72px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;
    opacity: 0.9;
  }

  .entry-info {
    flex: 1;

    h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: rgba(255, 255, 255, 0.95);
    }

    p {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
      margin: 0;
      line-height: 1.5;
    }
  }

  .entry-arrow {
    color: rgba(255, 255, 255, 0.3);
    transition: all 0.3s;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05);
  }

  &:hover .entry-arrow {
    color: #fff;
    background: #409eff;
    transform: translateX(4px);
  }
}
</style>
