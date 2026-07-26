<template>
  <div class="road-statistics-page">
    <!-- 装饰元素 -->
    <div class="decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-icon">
        <el-icon :size="40"><DataLine /></el-icon>
      </div>
      <h2>重点路段统计</h2>
      <p class="subtitle">实时监控与数据分析平台</p>
    </div>

    <!-- 统计概览 -->
    <div class="stats-overview">
      <div class="stat-item">
        <div class="stat-value">128</div>
        <div class="stat-label">监控路段</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-value">23</div>
        <div class="stat-label">拥堵路段</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-value">1.2M</div>
        <div class="stat-label">今日车流量</div>
      </div>
      <div class="stat-divider"></div>
      <div class="stat-item">
        <div class="stat-value">89%</div>
        <div class="stat-label">畅通率</div>
      </div>
    </div>

    <!-- 入口卡片区域 -->
    <div class="entry-section">
      <div class="section-title">
        <span class="title-line"></span>
        <span class="title-text">功能入口</span>
        <span class="title-line"></span>
      </div>
      <div class="entry-grid">
        <div
          v-for="entry in entries"
          :key="entry.key"
          class="entry-card"
          @click="openPage(entry.path)"
        >
          <div class="card-glow" :style="{ background: entry.color }"></div>
          <div class="entry-icon" :style="{ background: `linear-gradient(135deg, ${entry.color}, ${entry.color}dd)` }">
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

    <!-- 底部信息 -->
    <div class="footer-info">
      <div class="footer-left">
        <el-icon><InfoFilled /></el-icon>
        <span>数据更新时间：{{ lastUpdate }}</span>
      </div>
      <div class="footer-right">
        <span>© 2026 应急指挥调度平台</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { DataLine, ArrowRight, InfoFilled, TrendCharts, DataAnalysis, Timer, Histogram, PieChart } from '@element-plus/icons-vue'

const lastUpdate = ref('')

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

// 更新时间
let timer: ReturnType<typeof setInterval>
const updateTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  lastUpdate.value = `${hours}:${minutes}:${seconds}`
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
.road-statistics-page {
  background: linear-gradient(135deg, #0c1426 0%, #1a2742 50%, #0d1b2a 100%);
  border-radius: 0;
  padding: 0;
  margin: -16px;
  min-height: calc(100vh - 112px);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

// 装饰元素
.decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;

  .circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.1;
  }

  .circle-1 {
    width: 400px;
    height: 400px;
    background: #409eff;
    top: -100px;
    right: -100px;
  }

  .circle-2 {
    width: 300px;
    height: 300px;
    background: #67c23a;
    bottom: -50px;
    left: -50px;
  }

  .circle-3 {
    width: 200px;
    height: 200px;
    background: #e6a23c;
    top: 50%;
    right: 10%;
  }
}

// 页面标题
.page-header {
  padding: 48px 40px 32px;
  text-align: center;
  position: relative;
  z-index: 1;

  .header-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    background: rgba(64, 158, 255, 0.2);
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #409eff;
    border: 2px solid rgba(64, 158, 255, 0.3);
  }

  h2 {
    margin: 0 0 12px 0;
    font-size: 32px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 6px;
    text-shadow: 0 2px 12px rgba(64, 158, 255, 0.4);
  }

  .subtitle {
    margin: 0;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 2px;
  }
}

// 统计概览
.stats-overview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 24px 40px;
  margin: 0 40px 32px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  z-index: 1;

  .stat-item {
    text-align: center;

    .stat-value {
      font-size: 36px;
      font-weight: 700;
      color: #409eff;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .stat-divider {
    width: 1px;
    height: 48px;
    background: rgba(255, 255, 255, 0.1);
  }
}

// 入口区域
.entry-section {
  flex: 1;
  padding: 0 40px;
  position: relative;
  z-index: 1;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 28px;

  .title-line {
    flex: 1;
    max-width: 120px;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(64, 158, 255, 0.5), transparent);
  }

  .title-text {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.7);
    letter-spacing: 4px;
  }
}

.entry-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 24px;
}

.entry-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px 28px;
  cursor: pointer;
  transition: all 0.4s ease;
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  overflow: hidden;

  .card-glow {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    opacity: 0;
    transition: opacity 0.4s ease;
    filter: blur(60px);
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-6px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(64, 158, 255, 0.5);

    .card-glow {
      opacity: 0.15;
    }
  }

  .entry-icon {
    width: 72px;
    height: 72px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    flex-shrink: 0;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    position: relative;
    z-index: 1;
  }

  .entry-info {
    flex: 1;
    position: relative;
    z-index: 1;

    h3 {
      font-size: 17px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: rgba(255, 255, 255, 0.95);
    }

    p {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.45);
      margin: 0;
      line-height: 1.5;
    }
  }

  .entry-arrow {
    color: rgba(255, 255, 255, 0.2);
    transition: all 0.3s;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.05);
    position: relative;
    z-index: 1;
  }

  &:hover .entry-arrow {
    color: #fff;
    background: #409eff;
    transform: translateX(4px);
  }
}

// 底部信息
.footer-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  margin-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
  z-index: 1;

  .footer-left {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.4);
  }

  .footer-right {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.3);
  }
}
</style>
