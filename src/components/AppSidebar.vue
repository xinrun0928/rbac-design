<template>
  <aside class="app-sidebar" :class="{ collapsed }">
    <div
      class="sidebar-header"
      title="切换子系统"
      @click="goToSubsystemSelect"
    >
      <el-icon :size="22" color="#409EFF"><component :is="icon" /></el-icon>
      <span v-show="!collapsed" class="sidebar-title">{{ title }}</span>
    </div>

    <div v-show="!collapsed" class="sidebar-progress">
      <div class="progress-header">
        <span>页面完成度</span>
        <span>{{ finishPercent }}%</span>
      </div>
      <el-progress
        :percentage="finishPercent"
        :stroke-width="6"
        :show-text="false"
      />
      <div class="progress-desc">
        已完成 {{ finishCount }} / {{ totalCount }} 个页面
      </div>
    </div>

    <el-menu
      :default-active="activeMenu"
      :collapse="collapsed"
      :collapse-transition="false"
      class="sidebar-menu"
      router
    >
      <template v-for="item in menus" :key="item.path">
        <!-- 分组菜单 -->
        <template v-if="item.isGroup && item.children">
          <div class="menu-group-title" v-show="!collapsed">{{ item.groupTitle }}</div>
          <el-menu-item
            v-for="child in item.children"
            :key="child.path"
            :index="child.path"
          >
            <el-icon><component :is="child.icon" /></el-icon>
            <template #title>
              <div class="menu-title">
                <span>{{ child.title }}</span>
                <span class="status-tag" :class="getMenuStatus(child)">
                  {{ statusText(getMenuStatus(child)) }}
                </span>
              </div>
            </template>
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
            <template #title>
              <div class="menu-title">
                <span>{{ child.title }}</span>
                <span class="status-tag" :class="getMenuStatus(child)">
                  {{ statusText(getMenuStatus(child)) }}
                </span>
              </div>
            </template>
          </el-menu-item>
        </el-sub-menu>
        <!-- 普通菜单项 -->
        <el-menu-item v-else :index="item.path">
          <el-icon><component :is="item.icon" /></el-icon>
          <template #title>
            <div class="menu-title">
              <span>{{ item.title }}</span>
              <span class="status-tag" :class="getMenuStatus(item)">
                {{ statusText(getMenuStatus(item)) }}
              </span>
            </div>
          </template>
        </el-menu-item>
      </template>
    </el-menu>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Component } from 'vue'
import type { MenuItem } from '@/config/menu'

type MenuStatus = NonNullable<MenuItem['status']>

const props = defineProps<{
  title: string
  icon: Component
  menus: MenuItem[]
  collapsed: boolean
}>()

const route = useRoute()
const router = useRouter()
const activeMenu = computed(() => route.path)

// 点击顶部子系统名称，跳转到选择子系统页面
function goToSubsystemSelect() {
  router.push('/subsystem-select')
}

const pageList = computed(() => {
  const result: MenuItem[] = []

  const collectLeafMenus = (menus: MenuItem[]) => {
    menus.forEach(item => {
      if (item.children?.length) {
        collectLeafMenus(item.children)
        return
      }

      result.push(item)
    })
  }

  collectLeafMenus(props.menus)
  return result
})

const totalCount = computed(() => pageList.value.length)
const finishCount = computed(() => pageList.value.filter(item => getMenuStatus(item) === 'done').length)
const finishPercent = computed(() => {
  if (!totalCount.value) return 0
  return Math.round((finishCount.value / totalCount.value) * 100)
})

function getMenuStatus(item: MenuItem): MenuStatus {
  return item.status || 'todo'
}

function statusText(status: MenuStatus): string {
  const statusMap: Record<MenuStatus, string> = {
    done: '✓',
    doing: '开发中',
    todo: '未开始'
  }

  return statusMap[status]
}
</script>

<style lang="scss" scoped>
$app-sidebar-bg: #1a1f2e;
$app-sidebar-hover: #263445;
$app-primary: #409EFF;

.app-sidebar {
  width: 220px;
  height: 100vh;
  background: $app-sidebar-bg;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.3s ease;
  overflow: hidden;

  &.collapsed {
    width: 64px;

    .sidebar-header {
      padding: 0;
      justify-content: center;
    }

    .sidebar-menu {
      :deep(.el-menu-item),
      :deep(.el-sub-menu__title) {
        justify-content: center;
        padding: 0 !important;
        margin: 4px 0;
      }

      :deep(.el-menu-item .el-icon),
      :deep(.el-sub-menu__title .el-icon) {
        margin-right: 0;
      }

      // 折叠状态下 Element Plus 会用 tooltip trigger 包裹图标，
      // 其默认 padding: 0 20px 会把图标挤出居中位置，需重置并居中
      :deep(.el-menu-tooltip__trigger) {
        padding: 0 !important;
        justify-content: center;
      }
    }

    .status-tag {
      display: none;
    }
  }
}

.sidebar-header {
  height: 56px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.sidebar-progress {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
}

.progress-desc {
  margin-top: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

:deep(.el-progress-bar__outer) {
  background: rgba(255, 255, 255, 0.12);
}

:deep(.el-progress-bar__inner) {
  background: linear-gradient(90deg, #409EFF, #67C23A);
}

.sidebar-menu {
  flex: 1;
  border-right: none;
  overflow-y: auto;
  overflow-x: hidden;
  background: $app-sidebar-bg !important;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  &:not(.el-menu--collapse) {
    width: 100%;
  }

  // 菜单项样式
  :deep(.el-menu-item),
  :deep(.el-sub-menu__title) {
    margin: 4px 8px;
    border-radius: 8px;
    background: $app-sidebar-bg !important;
    color: #bfcbd9 !important;
    height: 46px !important;
    line-height: 46px !important;
    transition: all 0.2s;
  }

  :deep(.el-menu-item:hover),
  :deep(.el-sub-menu__title:hover) {
    background: $app-sidebar-hover !important;
    color: #fff !important;
  }

  :deep(.el-menu-item.is-active) {
    background: rgba(64, 158, 255, 0.15) !important;
    color: $app-primary !important;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 8px;
      bottom: 8px;
      width: 3px;
      border-radius: 3px;
      background: $app-primary !important;
    }
  }

  :deep(.el-menu-item .el-icon),
  :deep(.el-sub-menu__title .el-icon) {
    margin-right: 10px;
    color: inherit !important;
  }

  :deep(.el-sub-menu.is-opened > .el-sub-menu__title) {
    color: #fff !important;
  }

  :deep(.el-sub-menu .el-menu-item) {
    margin-left: 20px;
    background: $app-sidebar-bg !important;
    color: #bfcbd9 !important;
    min-width: 0 !important;
    height: 42px !important;
    line-height: 42px !important;
  }

  :deep(.el-sub-menu .el-menu-item:hover) {
    background: $app-sidebar-hover !important;
  }

  :deep(.el-sub-menu .el-menu-item.is-active) {
    background: rgba(64, 158, 255, 0.15) !important;
    color: $app-primary !important;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 8px;
      bottom: 8px;
      width: 3px;
      border-radius: 3px;
      background: $app-primary !important;
    }
  }
}

.menu-title {
  flex: 1;
  min-width: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  span:first-child {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.status-tag {
  flex-shrink: 0;
  width: 44px;
  padding: 0 4px;
  height: 18px;
  line-height: 18px;
  border-radius: 10px;
  font-size: 10px;
  text-align: center;
  white-space: nowrap;

  &.done {
    width: 18px;
    padding: 0;
    border-radius: 50%;
    color: #67C23A;
    background: rgba(103, 194, 58, 0.15);
  }

  &.doing {
    color: #E6A23C;
    background: rgba(230, 162, 60, 0.15);
  }

  &.todo {
    color: #909399;
    background: rgba(144, 147, 153, 0.15);
  }
}

.menu-group-title {
  padding: 14px 20px 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.5px;
}
</style>
