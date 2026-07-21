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
      path: '/orgtree',
      name: 'OrgTree',
      component: () => import('../views/OrgTreeView.vue')
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
    }
  ]
})

export default router
