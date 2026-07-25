import type { RouteRecordRaw } from 'vue-router'

/**
 * 应急预案管理子系统路由 (EMERGENCY_PLAN)
 * 路径前缀: /plan
 * 包含: 预案编制、演练、复盘
 */
const planRoutes: RouteRecordRaw = {
  path: '/plan',
  meta: { title: '应急预案管理', subsystem: 'EMERGENCY_PLAN' },
  children: [
    // TODO: 后续添加预案相关页面
  ]
}

export default planRoutes
