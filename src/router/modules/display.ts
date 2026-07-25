import type { RouteRecordRaw } from 'vue-router'

/**
 * 综合展示子系统路由 (COMPREHENSIVE_DISPLAY)
 * 路径前缀: /display
 * 包含: 大屏展示、数据可视化
 */
const displayRoutes: RouteRecordRaw = {
  path: '/display',
  meta: { title: '综合展示', subsystem: 'COMPREHENSIVE_DISPLAY' },
  children: [
    // TODO: 后续添加展示相关页面
  ]
}

export default displayRoutes
