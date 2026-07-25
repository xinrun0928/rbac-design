<template>
  <div class="duty-layout" :class="{ collapsed: isCollapsed }">
    <!-- 左侧导航栏 -->
    <aside class="duty-sidebar">
      <div class="sidebar-header">
        <el-icon :size="22" color="#409EFF"><DataBoard /></el-icon>
        <span v-show="!isCollapsed" class="sidebar-title">值守管理子系统</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapsed"
        :collapse-transition="false"
        class="sidebar-menu"
        router
      >
        <template v-for="item in dutyMenus" :key="item.path">
          <!-- 分组菜单 -->
          <template v-if="item.isGroup && item.children">
            <div class="menu-group-title" v-show="!isCollapsed">{{ item.groupTitle }}</div>
            <el-menu-item
              v-for="child in item.children"
              :key="child.path"
              :index="child.path"
            >
              <el-icon><component :is="child.icon" /></el-icon>
              <template #title>{{ child.title }}</template>
            </el-menu-item>
          </template>
          <!-- 子菜单 -->
          <el-sub-menu v-else-if="item.children" :index="item.path">
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
          <!-- 普通菜单项 -->
          <el-menu-item v-else :index="item.path">
            <el-icon><component :is="item.icon" /></el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </aside>

    <!-- 右侧内容区 -->
    <div class="duty-main">
      <!-- 顶部栏 -->
      <header class="duty-header">
        <div class="header-left">
          <div class="collapse-btn" @click="toggleCollapse">
            <el-icon :size="18">
              <Fold v-if="!isCollapsed" />
              <Expand v-else />
            </el-icon>
          </div>
          <Breadcrumb
            home-path="/duty/dashboard"
            home-title="首页"
            home-name="DutyDashboard"
            :menus="dutyMenus"
          />
        </div>
        <div class="header-right">
          <FullscreenToggle />
          <NotificationBell />
          <UserDropdown />
        </div>
      </header>

      <!-- 历史会话标签页 -->
      <TagsView
        home-path="/duty/dashboard"
        home-title="首页"
        storage-key="duty-tags-view"
      />

      <!-- 页面内容 -->
      <main class="duty-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  DataBoard,
  Fold,
  Expand
} from '@element-plus/icons-vue'
import { dutyMenus } from '@/config/menu'
import TagsView from '@/components/TagsView.vue'
import FullscreenToggle from '@/components/FullscreenToggle.vue'
import NotificationBell from '@/components/NotificationBell.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import UserDropdown from '@/components/UserDropdown.vue'

const route = useRoute()

// 侧边栏收缩状态
const isCollapsed = ref(false)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const activeMenu = computed(() => route.path)
</script>

<style lang="scss" scoped>
.duty-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;

  .duty-sidebar {
    width: 220px;
    background: #1a1f2e;
    transition: width 0.3s ease;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    &.collapsed {
      width: 64px;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .sidebar-title {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
      white-space: nowrap;
    }

    .sidebar-menu {
      border-right: none;
      flex: 1;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 0;
        height: 0;
      }
    }

    .menu-group-title {
      padding: 16px 16px 8px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.4);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }

  .duty-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #f0f2f5;
  }

  .duty-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;
    height: 56px;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    z-index: 10;

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .collapse-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.2s;

        &:hover {
          background: #f5f7fa;
        }
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
  }

  .duty-content {
    flex: 1;
    overflow: auto;
    padding: 16px;
  }
}

// 菜单样式覆盖
:deep(.sidebar-menu) {
  background: transparent;

  .el-menu-item {
    color: #bfcbd9;
    height: 50px;
    line-height: 50px;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    &.is-active {
      background: #263445;
      color: #409EFF;
    }
  }

  .el-sub-menu {
    .el-sub-menu__title {
      color: #bfcbd9;
      height: 50px;
      line-height: 50px;

      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }
    }
  }
}
</style>
