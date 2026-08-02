import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 导入各子系统路由模块
import adminRoutes from './modules/admin'
import dutyRoutes from './modules/duty'
import planRoutes from './modules/plan'
import eventRoutes from './modules/event'
import dispatchRoutes, { dispatchStandaloneRoutes } from './modules/dispatch'
import resourceRoutes from './modules/resource'
import dssRoutes from './modules/dss'
import fusionRoutes from './modules/fusion'
import displayRoutes from './modules/display'
import inspectionRoutes from './modules/inspection'

// 公共路由（不需要权限验证）
const publicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue')
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/ForgotPasswordView.vue')
  },
  {
    path: '/org-select',
    name: 'OrgSelect',
    component: () => import('@/views/auth/OrganizationSelectView.vue')
  },
  {
    path: '/subsystem-select',
    name: 'SubsystemSelect',
    component: () => import('@/views/auth/SubsystemSelectView.vue')
  },
  {
    path: '/schedule-v4',
    name: 'ScheduleV4',
    component: () => import('@/views/schedule/ScheduleView.vue')
  },
  {
    path: '/deploy-architecture',
    name: 'DeployArchitecture',
    component: () => import('@/views/specs/DeployView.vue')
  },
  {
    path: '/specs',
    name: 'Specs',
    component: () => import('@/views/specs/SpecLayout.vue'),
    redirect: '/specs/api-design',
    children: [
      {
        path: ':key',
        name: 'SpecDetail',
        component: () => import('@/views/specs/SpecPage.vue')
      }
    ]
  },
  {
    path: '/redirect/:path(.*)',
    name: 'Redirect',
    component: () => import('@/views/redirect/index.vue')
  },
]

// 业务路由（各子系统）
const businessRoutes: RouteRecordRaw[] = [
  adminRoutes,      // 后台管理子系统
  dutyRoutes,       // 应急值守管理子系统
  planRoutes,       // 应急预案管理子系统
  eventRoutes,      // 应急事件管理子系统
  dispatchRoutes,   // 应急指挥智能调度子系统
  ...dispatchStandaloneRoutes, // 指挥调度独立页面
  resourceRoutes,   // 厅级应急物资管理子系统
  dssRoutes,        // 辅助决策子系统
  fusionRoutes,     // 数据融合子系统
  displayRoutes,    // 综合展示子系统
  inspectionRoutes, // 汛期巡查子系统
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...publicRoutes, ...businessRoutes]
})

export default router
