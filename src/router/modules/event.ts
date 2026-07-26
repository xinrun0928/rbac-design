import type { RouteRecordRaw } from 'vue-router'

/**
 * 应急事件管理子系统路由 (EMERGENCY_EVENT)
 * 路径前缀: /event
 * 包含: 事故上报、信息接收、预警处置、任务跟踪等
 */
const eventRoutes: RouteRecordRaw = {
  path: '/event',
  component: () => import('@/views/event/EventLayout.vue'),
  meta: { title: '应急事件管理', subsystem: 'EMERGENCY_EVENT' },
  redirect: '/event/report',
  children: [
    {
      path: 'report',
      name: 'EventReport',
      component: () => import('@/views/event/report/EventReport.vue'),
      meta: { title: '事故上报' }
    },
    {
      path: 'receive',
      name: 'EventReceive',
      component: () => import('@/views/event/receive/EventReceive.vue'),
      meta: { title: '事故信息接收' }
    },
    {
      path: 'warning',
      name: 'EventWarning',
      component: () => import('@/views/event/warning/EventWarning.vue'),
      meta: { title: '预警处置' }
    },
    {
      path: 'warning/rule',
      name: 'EventWarningRule',
      component: () => import('@/views/event/warning/WarningRule.vue'),
      meta: { title: '事故预警规则' }
    },
    {
      path: 'receive/rule',
      name: 'EventReceiveRule',
      component: () => import('@/views/event/receive/ReceiveRule.vue'),
      meta: { title: '事故接报规则' }
    },
    {
      path: 'task',
      name: 'EventTask',
      component: () => import('@/views/event/task/EventTask.vue'),
      meta: { title: '任务分配及跟踪' }
    },
    {
      path: 'todo',
      name: 'EventTodo',
      component: () => import('@/views/event/todo/EventTodo.vue'),
      meta: { title: '我的待办' }
    },
    {
      path: 'document',
      name: 'EventDocument',
      component: () => import('@/views/event/document/EventDocument.vue'),
      meta: { title: '文档库' }
    },
    {
      path: 'archive',
      name: 'EventArchive',
      component: () => import('@/views/event/archive/EventArchive.vue'),
      meta: { title: '归档事故库' }
    },
    {
      path: 'dict',
      name: 'EventDict',
      component: () => import('@/views/event/dict/EventDict.vue'),
      meta: { title: '字典管理' }
    },
    {
      path: 'log',
      name: 'EventLog',
      component: () => import('@/views/event/log/EventLog.vue'),
      meta: { title: '系统日志' }
    },
  ]
}

export default eventRoutes
