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
        :style="{ borderColor: entry.color }"
        @click="openPage(entry.path)"
      >
        <div class="entry-icon" :style="{ background: entry.color }">
          <el-icon :size="32"><component :is="entry.icon" /></el-icon>
        </div>
        <div class="entry-info">
          <h3>{{ entry.title }}</h3>
          <p>{{ entry.description }}</p>
        </div>
        <div class="entry-arrow">
          <el-icon :size="20"><ArrowRight /></el-icon>
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
    color: '#409EFF'
  },
  {
    key: 'congestion',
    title: '重点路段拥堵分析',
    description: '分析各路段拥堵情况',
    path: '/dispatch/road/screen/congestion',
    icon: TrendCharts,
    color: '#E6A23C'
  },
  {
    key: 'traffic',
    title: '重点路段车流量分析',
    description: '分析各路段车流量数据',
    path: '/dispatch/road/screen/traffic',
    icon: DataAnalysis,
    color: '#67C23A'
  },
  {
    key: 'frequency',
    title: '重点路段拥堵发生次数统计',
    description: '统计拥堵发生频次',
    path: '/dispatch/road/screen/frequency',
    icon: Histogram,
    color: '#F56C6C'
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
    color: '#9B59B6'
  }
]

// 打开新页面
const openPage = (path: string) => {
  window.open(path, '_blank')
}
</script>

<style lang="scss" scoped>
.road-statistics-page {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}

.page-header {
  margin-bottom: 24px;

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
  }
}

.entry-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.entry-card {
  background: #f8f9fb;
  border-radius: 12px;
  padding: 28px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 20px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    background: #fff;
  }

  .entry-icon {
    width: 64px;
    height: 64px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;
  }

  .entry-info {
    flex: 1;

    h3 {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 6px 0;
      color: #303133;
    }

    p {
      font-size: 13px;
      color: #909399;
      margin: 0;
    }
  }

  .entry-arrow {
    color: #c0c4cc;
    transition: all 0.3s;
  }

  &:hover .entry-arrow {
    color: #409EFF;
    transform: translateX(4px);
  }
}
</style>
