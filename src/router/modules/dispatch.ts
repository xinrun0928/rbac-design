import type { RouteRecordRaw } from 'vue-router'

/**
 * 应急指挥智能调度子系统路由 (EMERGENCY_DISPATCH)
 * 路径前缀: /dispatch
 * 包含: 资源调度、任务下达、指令分发
 */
const dispatchRoutes: RouteRecordRaw = {
  path: '/dispatch',
  meta: { title: '应急指挥调度', subsystem: 'EMERGENCY_DISPATCH' },
  children: [
    // TODO: 后续添加调度相关页面
  ]
}

export default dispatchRoutes
