import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/meal'
    },
    {
      path: '/meal',
      name: 'Meal',
      component: () => import('../views/MealManagement.vue')
    },
    {
      path: '/menu',
      name: 'Menu',
      component: () => import('../views/MenuManagement.vue')
    },
    {
      path: '/role',
      name: 'Role',
      component: () => import('../views/RoleManagement.vue')
    },
    {
      path: '/post',
      name: 'Post',
      component: () => import('../views/PostManagement.vue')
    },
    {
      path: '/subsystem',
      name: 'Subsystem',
      component: () => import('../views/SubsystemManagement.vue')
    },
    {
      path: '/member',
      name: 'Member',
      component: () => import('../views/MemberManagement.vue')
    },
    {
      path: '/organization',
      name: 'OrgManage',
      component: () => import('../views/OrgTreeView.vue')
    },
    {
      path: '/dept',
      name: 'Dept',
      component: () => import('../views/DeptManagement.vue')
    },
    {
      path: '/logs/access',
      name: 'SysAccessLog',
      component: () => import('../views/logs/SysAccessLog.vue')
    },
    {
      path: '/logs/message',
      name: 'SysMessageLog',
      component: () => import('../views/logs/SysMessageLog.vue')
    },
    {
      path: '/logs/http',
      name: 'SysHttpLog',
      component: () => import('../views/logs/SysHttpLog.vue')
    },
    {
      path: '/logs/login',
      name: 'SysLoginLog',
      component: () => import('../views/logs/SysLoginLog.vue')
    },
    {
      path: '/attachment',
      name: 'AttachmentManage',
      component: () => import('../views/AttachmentManagement.vue')
    },
    {
      path: '/app',
      name: 'AppManage',
      component: () => import('../views/AppManagement.vue')
    },
    {
      path: '/area',
      name: 'AreaManage',
      component: () => import('../views/AreaManagement.vue')
    },
    {
      path: '/app/log',
      name: 'AppPublishLog',
      component: () => import('../views/AppPublishLog.vue')
    },
    {
      path: '/mq/log',
      name: 'MqConsumeLog',
      component: () => import('../views/MqConsumeLog.vue')
    }
  ]
})

export default router
