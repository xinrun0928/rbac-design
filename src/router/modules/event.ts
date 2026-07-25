import type { RouteRecordRaw } from 'vue-router'

/**
 * 应急事件管理子系统路由 (EMERGENCY_EVENT)
 * 路径前缀: /event
 * 包含: 事件接报、响应、处置、评估
 */
const eventRoutes: RouteRecordRaw = {
  path: '/event',
  meta: { title: '应急事件管理', subsystem: 'EMERGENCY_EVENT' },
  children: [
    // TODO: 后续添加事件相关页面
  ]
}

export default eventRoutes
