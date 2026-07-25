<template>
  <div class="notification-bell">
    <el-popover placement="bottom-end" :width="380" trigger="click" :show-arrow="false">
      <template #reference>
        <div class="bell-trigger" :class="{ 'has-notice': unreadCount > 0 }">
          <svg class="bell-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span v-if="unreadCount > 0" class="bell-dot" />
        </div>
      </template>

      <div class="notice-panel">
        <!-- Header -->
        <div class="panel-header">
          <div class="header-tabs">
            <span
              v-for="tab in tabs"
              :key="tab.key"
              :class="['tab-item', { active: activeTab === tab.key }]"
              @click="activeTab = tab.key"
            >
              {{ tab.label }}
              <span v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</span>
            </span>
          </div>
          <span class="mark-read" @click="handleMarkAllRead">全部已读</span>
        </div>

        <!-- List -->
        <div class="panel-body">
          <div
            v-for="item in filteredList"
            :key="item.id"
            :class="['msg-item', { unread: !item.read }]"
            @click="handleReadNotice(item)"
          >
            <div :class="['msg-icon', item.type]">
              <el-icon :size="14">
                <component :is="getMsgIcon(item.type)" />
              </el-icon>
            </div>
            <div class="msg-body">
              <div class="msg-title">{{ item.title }}</div>
              <div class="msg-time">{{ item.time }}</div>
            </div>
          </div>
          <div v-if="filteredList.length === 0" class="panel-empty">
            <el-icon :size="36" color="#dcdfe6"><Bell /></el-icon>
            <p>暂无新消息</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="panel-footer" @click="handleViewMore">
          查看更多
          <el-icon :size="12"><ArrowRight /></el-icon>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { Bell, ChatDotRound, WarningFilled, InfoFilled, ArrowRight } from '@element-plus/icons-vue'
import type { Component } from 'vue'
import { notices as mockNotices } from '@/mock/admin/dashboardData'

interface NoticeItem {
  id: number
  title: string
  type: 'notice' | 'update' | 'alert'
  time: string
  read: boolean
}

const activeTab = ref('notice')
const noticeList = reactive<NoticeItem[]>(
  mockNotices.map(n => ({ ...n, read: false }))
)

const unreadCount = computed(() => noticeList.filter(n => !n.read).length)

const tabs = computed(() => [
  { key: 'notice', label: '通知', count: noticeList.filter(n => !n.read && n.type !== 'alert').length },
  { key: 'message', label: '消息', count: noticeList.filter(n => !n.read && n.type === 'alert').length },
])

const filteredList = computed(() => {
  if (activeTab.value === 'notice') {
    return noticeList.filter(n => n.type !== 'alert')
  }
  return noticeList.filter(n => n.type === 'alert')
})

function getMsgIcon(type: string): Component {
  const map: Record<string, Component> = {
    notice: InfoFilled,
    update: ChatDotRound,
    alert: WarningFilled
  }
  return map[type] || InfoFilled
}

function handleReadNotice(item: NoticeItem) {
  item.read = true
}

function handleMarkAllRead() {
  filteredList.value.forEach(n => { n.read = true })
}

function handleViewMore() {
  // 跳转到公告列表页
}
</script>

<style scoped>
.notification-bell {
  display: inline-flex;
}

/* ── Bell Trigger ── */
.bell-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  cursor: pointer;
  border-radius: 8px;
  color: #64748b;
  transition: all 0.2s;
  position: relative;
}

.bell-trigger:hover {
  color: #409EFF;
  background: #f1f5f9;
}

.bell-trigger.has-notice .bell-svg {
  animation: ring 0.4s ease;
}

.bell-svg {
  width: 20px;
  height: 20px;
}

.bell-dot {
  position: absolute;
  top: 6px;
  right: 7px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  border: 2px solid #fff;
  animation: pulse-dot 2s infinite;
}

@keyframes ring {
  0%, 100% { transform: rotate(0); }
  20% { transform: rotate(12deg); }
  40% { transform: rotate(-10deg); }
  60% { transform: rotate(6deg); }
  80% { transform: rotate(-3deg); }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.15); }
}

/* ── Panel ── */
.notice-panel {
  margin: -12px;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 0;
}

.header-tabs {
  display: flex;
  gap: 20px;
}

.tab-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #94a3b8;
  cursor: pointer;
  padding-bottom: 12px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  user-select: none;

  &.active {
    color: #303133;
    font-weight: 600;
    border-bottom-color: #409EFF;
  }

  &:hover:not(.active) {
    color: #64748b;
  }
}

.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: #ef4444;
  color: #fff;
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
}

.mark-read {
  font-size: 12px;
  color: #94a3b8;
  cursor: pointer;
  transition: color 0.2s;
  white-space: nowrap;

  &:hover {
    color: #409EFF;
  }
}

/* ── Body ── */
.panel-body {
  max-height: 320px;
  overflow-y: auto;
  padding: 4px 0;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 2px;
  }
}

.msg-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #f8fafc;
  }

  &.unread {
    background: #f0f7ff;

    &:hover {
      background: #e8f2ff;
    }
  }
}

.msg-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  &.notice {
    background: #eff6ff;
    color: #3b82f6;
  }

  &.update {
    background: #f0fdf4;
    color: #22c55e;
  }

  &.alert {
    background: #fef3c7;
    color: #f59e0b;
  }
}

.msg-body {
  flex: 1;
  min-width: 0;
}

.msg-title {
  font-size: 13px;
  color: #334155;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.msg-time {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 2px;
}

.panel-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #94a3b8;

  p {
    margin-top: 8px;
    font-size: 13px;
  }
}

/* ── Footer ── */
.panel-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 16px;
  font-size: 13px;
  color: #409EFF;
  cursor: pointer;
  border-top: 1px solid #f1f5f9;
  transition: background 0.15s;

  &:hover {
    background: #f8fafc;
  }
}
</style>
