<template>
  <el-tooltip :content="isFullscreen ? '退出全屏' : '全屏'" placement="bottom">
    <div class="header-icon" @click="toggleFullscreen">
      <el-icon :size="18"><FullScreen /></el-icon>
    </div>
  </el-tooltip>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { FullScreen } from '@element-plus/icons-vue'

const isFullscreen = ref(false)

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const onFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})
</script>

<style scoped>
.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  cursor: pointer;
  border-radius: 4px;
  color: #606266;
  transition: all 0.3s;
}

.header-icon:hover {
  color: #409EFF;
  background: #f5f7fa;
}
</style>
