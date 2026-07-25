<template>
  <!-- 登录页面 -->
  <div v-if="isLoginPage" class="login-wrapper">
    <router-view />
  </div>

  <!-- 其他页面 -->
  <div v-else class="app-container">
    <!-- 顶部导航 -->
    <TopNavBar :menus="adminMenus">
      <template #right>
        <el-dropdown trigger="click">
          <div class="user-info">
            <el-avatar :size="32" class="user-avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
            <span class="user-name">管理员</span>
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :icon="User">个人中心</el-dropdown-item>
              <el-dropdown-item :icon="Setting">系统设置</el-dropdown-item>
              <el-dropdown-item divided :icon="Share" @click="handleSwitchOrg">切换组织</el-dropdown-item>
              <el-dropdown-item :icon="Grid" @click="handleSwitchSubsystem">切换子系统</el-dropdown-item>
              <el-dropdown-item divided :icon="SwitchButton" @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </TopNavBar>

    <!-- 页面内容 -->
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { User, ArrowDown, Setting, SwitchButton, Share, Grid } from '@element-plus/icons-vue'
import TopNavBar from '@/components/TopNavBar.vue'
import { adminMenus } from '@/config/menu'

const router = useRouter()
const route = useRoute()

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
  min-height: 100vh;
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
