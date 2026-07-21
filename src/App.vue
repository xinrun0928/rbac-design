<template>
  <div class="app-container">
    <!-- 顶部导航 -->
    <header class="app-header">
      <div class="logo">
        <el-icon :size="22" color="#409EFF"><DataBoard /></el-icon>
        <span class="logo-text">RBAC 后台管理</span>
      </div>
      <div class="nav-wrapper">
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
          <el-menu-item index="/attachment">
            <el-icon><Paperclip /></el-icon>
            <span>附件管理</span>
          </el-menu-item>
          <el-menu-item index="/app">
            <el-icon><Cellphone /></el-icon>
            <span>App管理</span>
          </el-menu-item>
          <el-menu-item index="/area">
            <el-icon><Location /></el-icon>
            <span>区域管理</span>
          </el-menu-item>
          <el-menu-item index="/dict">
            <el-icon><Collection /></el-icon>
            <span>字典管理</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="header-right">
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
              <el-dropdown-item divided :icon="SwitchButton">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
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
import { DataBoard, Box, OfficeBuilding, Share, Document, Notebook, ChatDotRound, Connection, User, Monitor, Menu, Briefcase, Cellphone, Paperclip, Location, Collection, ArrowDown, Setting, SwitchButton } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const activeMenu = computed(() => {
  if (route.path.startsWith('/logs/')) {
    return route.path
  }
  if (route.path.startsWith('/dict/')) {
    return '/dict'
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
  margin-right: 24px;
  flex-shrink: 0;
}

.logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  white-space: nowrap;
}

.nav-wrapper {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  min-width: 0;

  &::-webkit-scrollbar {
    height: 0;
    display: none;
  }
}

.app-nav {
  border-bottom: none !important;
  height: 56px;
  white-space: nowrap;
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

.header-right {
  flex-shrink: 0;
  margin-left: 24px;
  padding-left: 24px;
  border-left: 1px solid #EBEEF5;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background-color 0.2s;

  &:hover {
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
}

.app-main {
  flex: 1;
}
</style>
