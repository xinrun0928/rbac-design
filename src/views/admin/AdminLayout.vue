<template>
  <div class="admin-layout" :class="{ collapsed: isCollapsed }">
    <!-- 左侧导航栏 -->
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <el-icon :size="22" color="#409EFF"><DataBoard /></el-icon>
        <span v-show="!isCollapsed" class="sidebar-title">RBAC 后台管理</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapsed"
        :collapse-transition="false"
        class="sidebar-menu"
        router
      >
        <el-menu-item index="/admin/subsystem">
          <el-icon><Monitor /></el-icon>
          <template #title>子系统管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/meal">
          <el-icon><Box /></el-icon>
          <template #title>套餐管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/menu">
          <el-icon><Menu /></el-icon>
          <template #title>菜单管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/organization">
          <el-icon><Share /></el-icon>
          <template #title>组织管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/member">
          <el-icon><User /></el-icon>
          <template #title>成员管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/role">
          <el-icon><UserFilled /></el-icon>
          <template #title>角色管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/dept">
          <el-icon><OfficeBuilding /></el-icon>
          <template #title>部门管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/post">
          <el-icon><Briefcase /></el-icon>
          <template #title>岗位管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/dict">
          <el-icon><Collection /></el-icon>
          <template #title>字典管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/config">
          <el-icon><Tools /></el-icon>
          <template #title>配置管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/attachment">
          <el-icon><Paperclip /></el-icon>
          <template #title>附件管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/msg/template">
          <el-icon><ChatDotSquare /></el-icon>
          <template #title>短信模版</template>
        </el-menu-item>
        <el-menu-item index="/admin/app">
          <el-icon><Cellphone /></el-icon>
          <template #title>App管理</template>
        </el-menu-item>

        <el-sub-menu index="logs">
          <template #title>
            <el-icon><Document /></el-icon>
            <span>日志管理</span>
          </template>
          <el-menu-item index="/admin/logs/access">
            <el-icon><Notebook /></el-icon>
            <template #title>访问日志</template>
          </el-menu-item>
          <el-menu-item index="/admin/logs/message">
            <el-icon><ChatDotRound /></el-icon>
            <template #title>短信日志</template>
          </el-menu-item>
          <el-menu-item index="/admin/logs/http">
            <el-icon><Connection /></el-icon>
            <template #title>接口日志</template>
          </el-menu-item>
          <el-menu-item index="/admin/logs/login">
            <el-icon><User /></el-icon>
            <template #title>登录日志</template>
          </el-menu-item>
          <el-menu-item index="/admin/mq/log">
            <el-icon><Promotion /></el-icon>
            <template #title>MQ消费日志</template>
          </el-menu-item>
        </el-sub-menu>
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
  Monitor,
  Box,
  Menu,
  Share,
  User,
  UserFilled,
  OfficeBuilding,
  Briefcase,
  Collection,
  Tools,
  Paperclip,
  ChatDotSquare,
  Cellphone,
  Document,
  Notebook,
  ChatDotRound,
  Connection,
  Promotion,
  ArrowDown,
  Setting,
  SwitchButton,
  Grid,
  Switch,
  Fold,
  Expand
} from '@element-plus/icons-vue'

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
}
</style>
