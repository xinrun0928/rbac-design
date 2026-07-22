import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/subsystem'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('../views/ForgotPasswordView.vue')
    },
    {
      path: '/org-select',
      name: 'OrgSelect',
      component: () => import('../views/OrganizationSelectView.vue')
    },
    {
      path: '/subsystem-select',
      name: 'SubsystemSelect',
      component: () => import('../views/SubsystemSelectView.vue')
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
      path: '/dict',
      name: 'DictTypeManage',
      component: () => import('../views/DictTypeManagement.vue')
    },
    {
      path: '/config',
      name: 'ConfigManage',
      component: () => import('../views/ConfigManagement.vue')
    },
    {
      path: '/msg/template',
      name: 'MessageTemplateManage',
      component: () => import('../views/MessageTemplateManagement.vue')
    },
    {
      path: '/dict/data',
      name: 'DictDataManage',
      component: () => import('../views/DictDataManagement.vue')
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
