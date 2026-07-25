<template>
  <div class="notification-bell">
    <el-tooltip content="系统公告" placement="bottom">
      <div class="header-icon bell-icon" @click="drawerVisible = true">
        <el-badge :value="unreadCount" :hidden="unreadCount === 0" :max="99" class="bell-badge">
          <el-icon :size="18"><Bell /></el-icon>
        </el-badge>
      </div>
    </el-tooltip>

    <el-drawer
      v-model="drawerVisible"
      size="420px"
      direction="rtl"
      class="notice-drawer"
    >
      <template #header>
        <div class="drawer-header">
          <span class="drawer-title">系统公告</span>
          <div class="drawer-actions">
            <el-button type="primary" link size="small" @click="handleMarkAllRead">全部已读</el-button>
          </div>
        </div>
      </template>
      <div class="notice-list">
        <div
          v-for="item in noticeList"
          :key="item.id"
          :class="['notice-row', { unread: !item.read }]"
          @click="handleReadNotice(item)"
        >
          <span :class="['notice-tag', item.type]">{{ getNoticeLabel(item.type) }}</span>
          <span class="notice-title">{{ item.title }}</span>
          <span class="notice-time">{{ item.time.slice(5) }}</span>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { Bell } from '@element-plus/icons-vue'
import { notices as mockNotices } from '@/mock/admin/dashboardData'

interface NoticeItem {
  id: number
  title: string
  type: 'notice' | 'update' | 'alert'
  time: string
  read: boolean
}

const drawerVisible = ref(false)
const noticeList = reactive<NoticeItem[]>(
  mockNotices.map(n => ({ ...n, read: false }))
)

const unreadCount = computed(() => noticeList.filter(n => !n.read).length)

function handleReadNotice(item: NoticeItem) {
  item.read = true
}

function handleMarkAllRead() {
  noticeList.forEach(n => { n.read = true })
}

function getNoticeLabel(type: string): string {
  const map: Record<string, string> = { notice: '通知', update: '更新', alert: '告警' }
  return map[type] || '通知'
}
</script>

<style scoped>
.notification-bell {
  display: inline-flex;
}

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

.bell-icon {
  margin-right: 12px;
  position: relative;
}

.bell-badge :deep(.el-badge__content) {
  top: 2px;
  right: 10px;
  height: 18px;
  line-height: 18px;
  padding: 0 5px;
  font-size: 11px;
}

/* ── Drawer Header ── */
.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.drawer-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.drawer-actions {
  display: flex;
  align-items: center;
}

/* ── Notice Rows ── */
.notice-list {
  display: flex;
  flex-direction: column;
}

.notice-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 8px;
  border-bottom: 1px solid #f5f7fa;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f9fafc;
  }

  &.unread {
    background: #f0f7ff;

    &:hover {
      background: #e6f0fa;
    }
  }
}

.notice-tag {
  flex-shrink: 0;
  height: 20px;
  line-height: 20px;
  padding: 0 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;

  &.notice {
    background: #ecf5ff;
    color: #409EFF;
  }

  &.update {
    background: #f0f9eb;
    color: #67C23A;
  }

  &.alert {
    background: #fdf6ec;
    color: #E6A23C;
  }
}

.notice-title {
  flex: 1;
  font-size: 13px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.notice-time {
  flex-shrink: 0;
  font-size: 12px;
  color: #C0C4CC;
}
</style>
