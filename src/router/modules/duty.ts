import type { RouteRecordRaw } from 'vue-router'

/**
 * 应急值守管理子系统路由 (EMERGENCY_WATCH)
 * 路径前缀: /duty
 * 包含: 值班、排班、交接班等
 */
const dutyRoutes: RouteRecordRaw = {
  path: '/duty',
  meta: { title: '应急值守管理', subsystem: 'EMERGENCY_WATCH' },
  children: [
    // TODO: 后续添加值守相关页面
    // {
    //   path: 'schedule',
    //   name: 'DutySchedule',
    //   component: () => import('@/views/duty/ScheduleManagement.vue'),
    //   meta: { title: '排班管理' }
    // },
  ]
}

export default dutyRoutes
