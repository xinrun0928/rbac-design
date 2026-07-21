<template>
  <div class="app-container">
    <!-- 顶部导航 -->
    <header class="app-header">
      <div class="logo">
        <el-icon :size="22" color="#409EFF"><DataBoard /></el-icon>
        <span class="logo-text">RBAC 后台管理</span>
      </div>
      <el-menu
        mode="horizontal"
        :default-active="activeMenu"
        :ellipsis="false"
        class="app-nav"
        @select="handleMenuSelect"
      >
        <el-menu-item index="/meal">
          <el-icon><Box /></el-icon>
          <span>套餐管理</span>
        </el-menu-item>
        <el-menu-item index="/menu">
          <el-icon><Menu /></el-icon>
          <span>菜单管理</span>
        </el-menu-item>
        <el-menu-item index="/role">
          <el-icon><UserFilled /></el-icon>
          <span>角色管理</span>
        </el-menu-item>
        <el-menu-item index="/post">
          <el-icon><Briefcase /></el-icon>
          <span>岗位管理</span>
        </el-menu-item>
        <el-menu-item index="/dept">
          <el-icon><OfficeBuilding /></el-icon>
          <span>部门管理</span>
        </el-menu-item>
        <el-menu-item index="/subsystem">
          <el-icon><Monitor /></el-icon>
          <span>子系统管理</span>
        </el-menu-item>
        <el-menu-item index="/member">
          <el-icon><User /></el-icon>
          <span>成员管理</span>
        </el-menu-item>
        <el-menu-item index="/organization">
          <el-icon><Share /></el-icon>
          <span>组织管理</span>
        </el-menu-item>
        <el-sub-menu index="logs">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>日志管理</span>
          </template>
          <el-menu-item index="/logs/access">
            <el-icon><Notebook /></el-icon>
            <span>访问日志</span>
          </el-menu-item>
          <el-menu-item index="/logs/message">
            <el-icon><ChatDotRound /></el-icon>
            <span>短信日志</span>
          </el-menu-item>
          <el-menu-item index="/logs/http">
            <el-icon><Connection /></el-icon>
            <span>接口日志</span>
          </el-menu-item>
          <el-menu-item index="/logs/login">
            <el-icon><User /></el-icon>
            <span>登录日志</span>
          </el-menu-item>
          <el-menu-item index="/mq/log">
            <el-icon><Promotion /></el-icon>
            <span>MQ消费日志</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item index="/app">
          <el-icon><Cellphone /></el-icon>
          <span>App管理</span>
        </el-menu-item>
      </el-menu>
    </header>

    <!-- 页面内容 -->
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { DataBoard, Box, OfficeBuilding, Share, Document, Notebook, ChatDotRound, Connection, User, Monitor, Menu, Briefcase, Cellphone } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const activeMenu = computed(() => {
  // 对于日志子页面，返回完整路径以高亮对应菜单项
  if (route.path.startsWith('/logs/')) {
    return route.path
  }
  return route.path
})

function handleMenuSelect(index: string) {
  router.push(index)
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
</style>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 24px;
  background: #FFFFFF;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 32px;
  flex-shrink: 0;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  white-space: nowrap;
}

.app-nav {
  border-bottom: none !important;
  height: 56px;
}

.app-nav .el-menu-item {
  height: 56px;
  line-height: 56px;
  font-size: 14px;
  border-bottom: 2px solid transparent;
}

.app-nav .el-menu-item.is-active {
  border-bottom-color: #409EFF;
}

.app-nav :deep(.el-sub-menu) {
  border-bottom: 2px solid transparent;
}

.app-nav :deep(.el-sub-menu.is-active) {
  border-bottom-color: #409EFF;
}

.app-nav :deep(.el-sub-menu__title) {
  height: 56px;
  line-height: 56px;
  font-size: 14px;
  border-bottom: 2px solid transparent;
}

.app-nav :deep(.el-menu--popup) {
  min-width: 140px;
}

.app-main {
  flex: 1;
}
</style>
