import type { RouteRecordRaw } from 'vue-router'

/**
 * 工作流编排设计器 - 路由
 *
 * 入口：登录页右上角「模块级排期v4」下方/侧边
 * 直接挂载为顶级全屏页面，无需登录守卫，
 * 但复用现有 App.vue 的子系统判断会自动隐藏顶部导航。
 */
const workflowRoutes: RouteRecordRaw = {
  path: '/workflow/designer',
  name: 'WorkflowDesigner',
  component: () => import('@/views/workflow/WorkflowDesigner.vue'),
  meta: {
    title: '工作流编排设计器'
  }
}

export default workflowRoutes
