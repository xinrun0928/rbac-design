import type { RouteRecordRaw } from 'vue-router'

/**
 * 汛期巡查子系统路由
 */
const inspectionRoutes: RouteRecordRaw = {
  path: '/inspection',
  name: 'Inspection',
  component: () => import('@/views/inspection/index.vue'),
  meta: {
    title: '汛期巡查子系统',
    requiresAuth: true
  }
}

export default inspectionRoutes
