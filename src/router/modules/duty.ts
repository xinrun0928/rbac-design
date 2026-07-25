import type { RouteRecordRaw } from 'vue-router'

/**
 * 应急值守管理子系统路由 (EMERGENCY_WATCH)
 * 路径前缀: /duty
 * 包含: 值班、排班、交接班等
 */
const dutyRoutes: RouteRecordRaw = {
  path: '/duty',
  component: () => import('@/views/duty/DutyLayout.vue'),
  meta: { title: '值守管理', subsystem: 'EMERGENCY_WATCH' },
  redirect: '/duty/dashboard',
  children: [
    {
      path: 'dashboard',
      name: 'DutyDashboard',
      component: () => import('@/views/duty/dashboard/DutyDashboard.vue'),
      meta: { title: '工作台' }
    },
    {
      path: 'statistics',
      name: 'DutyStatistics',
      component: () => import('@/views/duty/statistics/Statistics.vue'),
      meta: { title: '我的统计' }
    },
    {
      path: 'duty-record/list',
      name: 'DutyRecordList',
      component: () => import('@/views/duty/duty-record/DutyRecordList.vue'),
      meta: { title: '值班记录' }
    },
    {
      path: 'duty-record/feedback',
      name: 'DutyFeedback',
      component: () => import('@/views/duty/duty-record/DutyFeedback.vue'),
      meta: { title: '值班反馈' }
    },
    {
      path: 'daily-report/fill',
      name: 'DailyReportFill',
      component: () => import('@/views/duty/daily-report/DailyReportFill.vue'),
      meta: { title: '日报填报' }
    },
    {
      path: 'daily-report/audit',
      name: 'DailyReportAudit',
      component: () => import('@/views/duty/daily-report/DailyReportAudit.vue'),
      meta: { title: '日报审核' }
    },
    {
      path: 'daily-report/template',
      name: 'DailyReportTemplate',
      component: () => import('@/views/duty/daily-report/DailyReportTemplate.vue'),
      meta: { title: '日报模板' }
    },
    {
      path: 'check',
      name: 'DutyCheck',
      component: () => import('@/views/duty/check/CheckManagement.vue'),
      meta: { title: '值班查岗' }
    },
    {
      path: 'notice',
      name: 'DutyNotice',
      component: () => import('@/views/duty/notice/NoticeManagement.vue'),
      meta: { title: '公告管理' }
    },
    {
      path: 'schedule/table',
      name: 'ScheduleTable',
      component: () => import('@/views/duty/schedule/ScheduleTable.vue'),
      meta: { title: '值班表' }
    },
    {
      path: 'schedule/rule',
      name: 'ScheduleRule',
      component: () => import('@/views/duty/schedule/ScheduleRule.vue'),
      meta: { title: '排班规则' }
    },
    {
      path: 'regulation/query',
      name: 'RegulationQuery',
      component: () => import('@/views/duty/regulation/RegulationQuery.vue'),
      meta: { title: '综合查询' }
    },
    {
      path: 'regulation/maintain',
      name: 'RegulationMaintain',
      component: () => import('@/views/duty/regulation/RegulationMaintain.vue'),
      meta: { title: '内容维护' }
    },
    {
      path: 'base-info/post',
      name: 'PostManagement',
      component: () => import('@/views/duty/base-info/PostManagement.vue'),
      meta: { title: '岗位管理' }
    },
    {
      path: 'base-info/personnel',
      name: 'PersonnelManagement',
      component: () => import('@/views/duty/base-info/PersonnelManagement.vue'),
      meta: { title: '值班人员管理' }
    },
    {
      path: 'base-info/holiday',
      name: 'HolidayManagement',
      component: () => import('@/views/duty/base-info/HolidayManagement.vue'),
      meta: { title: '节假日维护' }
    },
  ]
}

export default dutyRoutes
