<template>
  <div class="fusion-layout" :class="{ collapsed: isCollapsed }">
    <!-- 左侧导航栏 -->
    <AppSidebar
      title="数据融合"
      :icon="Connection"
      :menus="fusionMenus"
      :collapsed="isCollapsed"
    />

    <!-- 右侧内容区 -->
    <div class="fusion-main">
      <!-- 顶部栏 -->
      <header class="fusion-header">
        <div class="header-left">
          <div class="collapse-btn" @click="toggleCollapse">
            <el-icon :size="18">
              <Fold v-if="!isCollapsed" />
              <Expand v-else />
            </el-icon>
          </div>
          <Breadcrumb :menus="fusionMenus" />
        </div>
        <div class="header-right">
          <FullscreenToggle />
          <NotificationBell />
          <UserDropdown />
        </div>
      </header>

      <!-- 历史会话标签页 -->
      <TagsView :menus="fusionMenus" storage-key="fusion-tags-view" />

      <!-- 页面内容 -->
      <main class="fusion-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Connection,
  Fold,
  Expand
} from '@element-plus/icons-vue'
import { fusionMenus } from '@/config/menu'
import AppSidebar from '@/components/AppSidebar.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import TagsView from '@/components/TagsView.vue'
import FullscreenToggle from '@/components/FullscreenToggle.vue'
import NotificationBell from '@/components/NotificationBell.vue'
import UserDropdown from '@/components/UserDropdown.vue'

const isCollapsed = ref(false)

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style lang="scss" scoped>
.fusion-layout {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.fusion-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.fusion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;

  &:hover {
    background: #f5f7fa;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.fusion-content {
  flex: 1;
  overflow: auto;
  background: #f5f7fa;
}
</style>
