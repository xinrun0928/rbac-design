<template>
  <div class="not-found-page">
    <!-- 背景装饰 -->
    <div class="bg-circle circle-1"></div>
    <div class="bg-circle circle-2"></div>
    <div class="bg-grid"></div>

    <div class="not-found-card animate-item">
      <!-- 404区域 -->
      <div class="decor-404">
        <div class="num">4</div>
        <div class="icon-wrap">
          <el-icon class="drone-icon"><Promotion /></el-icon>
        </div>
        <div class="num">4</div>
      </div>

      <h1 class="title">页面走丢了</h1>

      <p class="subtitle">您访问的页面不存在，可能已被删除或者地址输入错误</p>

      <!-- 当前路径 -->
      <div class="path-tip" v-if="currentPath">
        <span>当前路径：</span>
        <code>{{ currentPath }}</code>
        <el-icon class="copy-icon" @click="copyPath"><CopyDocument /></el-icon>
      </div>

      <!-- 操作 -->
      <div class="actions">
        <el-button type="primary" size="large" :icon="House" @click="handleGoHome">
          返回首页
        </el-button>
        <el-button size="large" :icon="Back" @click="handleGoBack">
          返回上一页
        </el-button>
      </div>

      <div class="tip"><span>{{ countdown }}</span> 秒后自动返回首页</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { House, Back, Promotion, CopyDocument } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const currentPath = computed(() => route.fullPath)
const countdown = ref(10)

let timer: ReturnType<typeof setInterval> | undefined

function handleGoHome() {
  router.replace('/login')
}

function handleGoBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.replace('/login')
  }
}

async function copyPath() {
  await navigator.clipboard.writeText(currentPath.value)
  ElMessage.success('路径已复制')
}

function startTimer() {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      handleGoHome()
    }
  }, 1000)
}

function keyListener(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    handleGoBack()
  }
}

onMounted(() => {
  document.title = '404 - 页面不存在'
  startTimer()
  window.addEventListener('keydown', keyListener)
})

onUnmounted(() => {
  clearInterval(timer)
  window.removeEventListener('keydown', keyListener)
})
</script>

<style scoped lang="scss">
.not-found-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa, #e8f1ff);
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(64, 158, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(64, 158, 255, 0.06) 1px, transparent 1px);
  background-size: 40px 40px;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(2px);
}

.circle-1 {
  width: 300px;
  height: 300px;
  background: #d9ecff;
  top: -100px;
  left: -100px;
}

.circle-2 {
  width: 260px;
  height: 260px;
  background: #e1f3d8;
  right: -80px;
  bottom: -80px;
}

.not-found-card {
  position: relative;
  z-index: 2;
  width: 560px;
  padding: 50px 40px;
  text-align: center;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid #ebeef5;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.6s ease;
}

.decor-404 {
  display: flex;
  justify-content: center;
  align-items: center;

  .num {
    font-size: 100px;
    font-weight: 900;
    line-height: 1;
    background: linear-gradient(135deg, #409eff, #79bbff);
    -webkit-background-clip: text;
    color: transparent;
    animation: float 3s infinite ease-in-out;
  }

  .icon-wrap {
    width: 110px;
    height: 110px;
    margin: 0 10px;
    border-radius: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #ecf5ff, #d9ecff);
  }

  .drone-icon {
    font-size: 55px;
    color: #409eff;
  }
}

.title {
  margin-top: 25px;
  font-size: 24px;
  color: #303133;
}

.subtitle {
  margin-top: 12px;
  color: #909399;
}

.path-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 25px auto 0;
  padding: 12px 15px;
  max-width: 90%;
  background: #f5f7fa;
  border-radius: 10px;
  font-size: 13px;

  code {
    flex: 1;
    color: #409eff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.copy-icon {
  cursor: pointer;
  color: #909399;

  &:hover {
    color: #409eff;
  }
}

.actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
}

.tip {
  margin-top: 20px;
  font-size: 13px;
  color: #a8abb2;

  span {
    color: #409eff;
    font-weight: bold;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes float {
  50% {
    transform: translateY(-8px);
  }
}
</style>
