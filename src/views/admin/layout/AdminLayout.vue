<template>
  <div class="admin-layout" :class="{ collapsed: isCollapsed }">
    <!-- 左侧导航栏 -->
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <el-icon :size="22" color="#409EFF"><DataBoard /></el-icon>
        <span v-show="!isCollapsed" class="sidebar-title">应急指挥调度平台</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapsed"
        :collapse-transition="false"
        class="sidebar-menu"
        router
      >
        <template v-for="item in adminMenus" :key="item.path">
          <!-- 有子菜单 -->
          <el-sub-menu v-if="item.children" :index="item.path">
            <template #title>
              <el-icon><component :is="item.icon" /></el-icon>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item
              v-for="child in item.children"
              :key="child.path"
              :index="child.path"
            >
              <el-icon><component :is="child.icon" /></el-icon>
              <template #title>{{ child.title }}</template>
            </el-menu-item>
          </el-sub-menu>
          <!-- 无子菜单 -->
          <el-menu-item v-else :index="item.path">
            <el-icon><component :is="item.icon" /></el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>

      <!-- 收缩按钮 -->
      <div class="collapse-btn" @click="toggleCollapse">
        <el-icon :size="18">
          <Fold v-if="!isCollapsed" />
          <Expand v-else />
        </el-icon>
      </div>
    </aside>

    <!-- 右侧内容区 -->
    <div class="admin-main">
      <!-- 顶部栏 -->
      <header class="admin-header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentRoute.meta?.title">
              {{ currentRoute.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
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
                <el-dropdown-item divided :icon="Switch" @click="handleSwitchOrg">切换组织</el-dropdown-item>
                <el-dropdown-item :icon="Grid" @click="handleSwitchSubsystem">切换子系统</el-dropdown-item>
                <el-dropdown-item divided :icon="SwitchButton" @click="handleLogout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <!-- 页面内容 -->
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  DataBoard,
  User,
  ArrowDown,
  Setting,
  SwitchButton,
  Grid,
  Switch,
  Fold,
  Expand
} from '@element-plus/icons-vue'
import { adminMenus } from '@/config/menu'

const router = useRouter()
const route = useRoute()

// 侧边栏收缩状态
const isCollapsed = ref(false)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const activeMenu = computed(() => {
  return route.path
})

const currentRoute = computed(() => {
  return route
})

const handleSwitchOrg = () => {
  router.push('/org-select')
}

const handleSwitchSubsystem = () => {
  router.push('/subsystem-select')
}

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    localStorage.removeItem('currentOrg')
    localStorage.removeItem('currentSubsystem')
    ElMessage.success('已退出登录')
    router.push('/login')
  }).catch(() => {})
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.admin-sidebar {
  width: 220px;
  height: 100vh;
  background: #001529;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.3s ease;
  overflow: hidden;
}

.admin-layout.collapsed .admin-sidebar {
  width: 64px;
}

.sidebar-header {
  height: 56px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  white-space: nowrap;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.sidebar-menu {
  flex: 1;
  border-right: none;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar-menu::-webkit-scrollbar {
  width: 4px;
}

.sidebar-menu::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 100%;
}

.collapse-btn {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #001529;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.65);
  transition: all 0.3s;
}

.collapse-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
  overflow: hidden;
}

.admin-header {
  height: 56px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
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
  background: #f5f7fa;
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

.admin-content {
  flex: 1;
  padding: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  > router-view {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}
</style>
