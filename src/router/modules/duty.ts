import type { RouteRecordRaw } from 'vue-router'

/**
 * 应急值守管理子系统路由 (EMERGENCY_WATCH)
 * 路径前缀: /duty
 * 包含: 值班、排班、交接班等
 */
const dutyRoutes: RouteRecordRaw = {
  path: '/duty',
  component: () => import('@/views/duty/layout/DutyLayout.vue'),
  meta: { title: '应急值守管理', subsystem: 'EMERGENCY_WATCH' },
  redirect: '/duty/dashboard',
  children: [
    {
      path: 'dashboard',
      name: 'DutyDashboard',
      component: () => import('@/views/duty/DutyDashboard.vue'),
      meta: { title: '工作台' }
    },
    {
      path: 'schedule',
      name: 'DutySchedule',
      component: () => import('@/views/duty/schedule/ScheduleManagement.vue'),
      meta: { title: '排班计划' }
    },
    {
      path: 'shift',
      name: 'DutyShift',
      component: () => import('@/views/duty/schedule/ShiftManagement.vue'),
      meta: { title: '班次管理' }
    },
    {
      path: 'handover',
      name: 'DutyHandover',
      component: () => import('@/views/duty/handover/HandoverManagement.vue'),
      meta: { title: '交接班记录' }
    },
    {
      path: 'handover/pending',
      name: 'DutyHandoverPending',
      component: () => import('@/views/duty/handover/PendingHandover.vue'),
      meta: { title: '待交接' }
    },
    {
      path: 'on-duty',
      name: 'DutyOnDuty',
      component: () => import('@/views/duty/onduty/OnDutyManagement.vue'),
      meta: { title: '值班记录' }
    },
    {
      path: 'on-duty/leader',
      name: 'DutyLeaderOnDuty',
      component: () => import('@/views/duty/onduty/LeaderOnDuty.vue'),
      meta: { title: '领导带班' }
    },
  ]
}

export default dutyRoutes
