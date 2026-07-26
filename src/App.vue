<template>
  <!-- 登录页面 -->
  <div v-if="isLoginPage" class="login-wrapper">
    <router-view />
  </div>

  <!-- 其他页面 -->
  <div v-else-if="appReady" class="app-container">
    <!-- 页面内容 -->
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { User, ArrowDown, Setting, SwitchButton, Share, Grid } from '@element-plus/icons-vue'
import TopNavBar from '@/components/TopNavBar.vue'
import { adminMenus } from '@/config/menu'

const router = useRouter()
const route = useRoute()

// 延迟渲染，避免刷新时顶部导航短暂闪烁
const appReady = ref(false)
onMounted(() => {
  appReady.value = true
})

// 判断是否是登录相关页面或需要隐藏顶部导航的页面
const isLoginPage = computed(() => {
  // 登录相关页面
  const authPages = ['/login', '/forgot-password', '/org-select', '/subsystem-select']
  if (authPages.includes(route.path)) return true

  // 各子系统页面（有自己的布局，不需要顶部导航）
  const subsystemPrefixes = ['/admin', '/duty', '/plan', '/event', '/dispatch', '/resource', '/dss', '/fusion', '/display']
  return subsystemPrefixes.some(prefix => route.path.startsWith(prefix))
})

function handleLogout() {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    localStorage.removeItem('currentOrg')
    localStorage.removeItem('currentSubsystem')
    ElMessage.success('已退出登录')
    router.push('/login')
  }).catch(() => {
    // 取消操作
  })
}

function handleSwitchOrg() {
  router.push('/org-select')
}

function handleSwitchSubsystem() {
  router.push('/subsystem-select')
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'PingFang SC', 'Microsoft YaHei', -apple-system, BlinkMacSystemFont, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #F5F7FA;
}

/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #C0C4CC;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #909399;
}

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: #C0C4CC transparent;
}
</style>

<style scoped>
.login-wrapper {
  height: 100vh;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.user-info:hover {
  background: #F5F7FA;
}

.user-avatar {
  background: linear-gradient(135deg, #409EFF 0%, #66B1FF 100%);
  color: #fff;
  font-size: 16px;
}

.user-name {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.app-main {
  flex: 1;
}
</style>
