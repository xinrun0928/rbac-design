<template>
  <div class="screen-page">
    <!-- 顶部标题栏 -->
    <div class="screen-header">
      <div class="header-left">
        <div class="back-btn" @click="goBack">
          <el-icon :size="20"><ArrowLeft /></el-icon>
        </div>
        <h1>重点路段拥堵发生次数统计</h1>
      </div>
      <div class="header-right">
        <span class="current-time">{{ currentTime }}</span>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="screen-content">
      <div class="chart-area">
        <div class="chart-placeholder large">拥堵次数统计图表</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowLeft } from '@element-plus/icons-vue'

const currentTime = ref('')

const goBack = () => {
  window.close()
}

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
.screen-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0c1426 0%, #1a2742 50%, #0d1b2a 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  z-index: 9999;
}

.screen-header {
  height: 60px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(64, 158, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .back-btn {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: rgba(64, 158, 255, 0.3);
      }
    }

    h1 {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
    }
  }

  .header-right {
    .current-time {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.7);
    }
  }
}

.screen-content {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

.chart-area {
  height: 100%;
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
  min-height: 500px;
}
</style>
