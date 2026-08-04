<template>
  <div class="no-permission-page">
    <!-- 背景装饰 -->
    <div class="bg-circle circle-1"></div>
    <div class="bg-circle circle-2"></div>
    <div class="bg-grid"></div>

    <div class="no-permission-card animate-item">
      <!-- 403区域 -->
      <div class="decor-403">
        <div class="num">4</div>
        <div class="icon-wrap">
          <el-icon class="lock-icon"><Lock /></el-icon>
        </div>
        <div class="num">3</div>
      </div>

      <h1 class="title">暂无访问权限</h1>

      <p class="subtitle">您没有权限访问该页面，如有需要请联系管理员开通权限</p>

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
import { House, Back, Lock, CopyDocument } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const currentPath = computed(() => route.fullPath)
const countdown = ref(10)

let timer: ReturnType<typeof setInterval> | undefined

function handleGoHome() {
  router.replace('/org-select')
}

function handleGoBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.replace('/org-select')
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
  document.title = '403 - 无权限'
  startTimer()
  window.addEventListener('keydown', keyListener)
})

onUnmounted(() => {
  clearInterval(timer)
  window.removeEventListener('keydown', keyListener)
})
</script>

<style scoped lang="scss">
.no-permission-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #fdf6ec, #fdf5e6);
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(230, 162, 60, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(230, 162, 60, 0.06) 1px, transparent 1px);
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
  background: #fbe9d0;
  top: -100px;
  left: -100px;
}

.circle-2 {
  width: 260px;
  height: 260px;
  background: #f5d8c9;
  right: -80px;
  bottom: -80px;
}

.no-permission-card {
  position: relative;
  z-index: 2;
  width: 560px;
  padding: 50px 40px;
  text-align: center;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid #f5e3c5;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.6s ease;
}

.decor-403 {
  display: flex;
  justify-content: center;
  align-items: center;

  .num {
    font-size: 100px;
    font-weight: 900;
    line-height: 1;
    background: linear-gradient(135deg, #e6a23c, #f3c978);
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
    background: linear-gradient(135deg, #fdf6ec, #fbe9d0);
  }

  .lock-icon {
    font-size: 55px;
    color: #e6a23c;
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
    color: #e6a23c;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.copy-icon {
  cursor: pointer;
  color: #909399;

  &:hover {
    color: #e6a23c;
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
    color: #e6a23c;
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
