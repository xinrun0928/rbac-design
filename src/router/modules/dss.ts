import type { RouteRecordRaw } from 'vue-router'

/**
 * 辅助决策子系统路由 (ASSIST_DECISION)
 * 路径前缀: /dss
 * 包含: 态势分析、辅助决策、预案推荐
 */
const dssRoutes: RouteRecordRaw = {
  path: '/dss',
  meta: { title: '辅助决策', subsystem: 'ASSIST_DECISION' },
  children: [
    // TODO: 后续添加决策相关页面
  ]
}

export default dssRoutes
