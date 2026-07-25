import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
      path: '/admin',
      component: () => import('@/views/admin/layout/AdminLayout.vue'),
      redirect: '/admin/subsystem',
      children: [
        {
          path: 'subsystem',
          name: 'AdminSubsystem',
          component: () => import('@/views/admin/system/SubsystemManagement.vue'),
          meta: { title: '子系统管理' }
        },
        {
          path: 'meal',
          name: 'AdminMeal',
          component: () => import('@/views/admin/system/MealManagement.vue'),
          meta: { title: '套餐管理' }
        },
        {
          path: 'menu',
          name: 'AdminMenu',
          component: () => import('@/views/admin/system/MenuManagement.vue'),
          meta: { title: '菜单管理' }
        },
        {
          path: 'organization',
          name: 'AdminOrgManage',
          component: () => import('@/views/admin/org/OrgTreeView.vue'),
          meta: { title: '组织管理' }
        },
        {
          path: 'member',
          name: 'AdminMember',
          component: () => import('@/views/admin/org/MemberManagement.vue'),
          meta: { title: '成员管理' }
        },
        {
          path: 'role',
          name: 'AdminRole',
          component: () => import('@/views/admin/org/RoleManagement.vue'),
          meta: { title: '角色管理' }
        },
        {
          path: 'dept',
          name: 'AdminDept',
          component: () => import('@/views/admin/org/DeptManagement.vue'),
          meta: { title: '部门管理' }
        },
        {
          path: 'post',
          name: 'AdminPost',
          component: () => import('@/views/admin/org/PostManagement.vue'),
          meta: { title: '岗位管理' }
        },
        {
          path: 'dict',
          name: 'AdminDictTypeManage',
          component: () => import('@/views/admin/system/DictTypeManagement.vue'),
          meta: { title: '字典管理' }
        },
        {
          path: 'dict/data',
          name: 'AdminDictDataManage',
          component: () => import('@/views/admin/system/DictDataManagement.vue'),
          meta: { title: '字典数据' }
        },
        {
          path: 'config',
          name: 'AdminConfigManage',
          component: () => import('@/views/admin/system/ConfigManagement.vue'),
          meta: { title: '配置管理' }
        },
        {
          path: 'attachment',
          name: 'AdminAttachmentManage',
          component: () => import('@/views/admin/system/AttachmentManagement.vue'),
          meta: { title: '附件管理' }
        },
        {
          path: 'msg/template',
          name: 'AdminMessageTemplateManage',
          component: () => import('@/views/admin/system/MessageTemplateManagement.vue'),
          meta: { title: '短信模版' }
        },
        {
          path: 'app',
          name: 'AdminAppManage',
          component: () => import('@/views/admin/app/AppManagement.vue'),
          meta: { title: 'App管理' }
        },
        {
          path: 'app/log',
          name: 'AdminAppPublishLog',
          component: () => import('@/views/admin/app/AppPublishLog.vue'),
          meta: { title: 'App发布日志' }
        },
        {
          path: 'logs/access',
          name: 'AdminSysAccessLog',
          component: () => import('@/views/admin/logs/SysAccessLog.vue'),
          meta: { title: '访问日志' }
        },
        {
          path: 'logs/message',
          name: 'AdminSysMessageLog',
          component: () => import('@/views/admin/logs/SysMessageLog.vue'),
          meta: { title: '短信日志' }
        },
        {
          path: 'logs/http',
          name: 'AdminSysHttpLog',
          component: () => import('@/views/admin/logs/SysHttpLog.vue'),
          meta: { title: '接口日志' }
        },
        {
          path: 'logs/login',
          name: 'AdminSysLoginLog',
          component: () => import('@/views/admin/logs/SysLoginLog.vue'),
          meta: { title: '登录日志' }
        },
        {
          path: 'mq/log',
          name: 'AdminMqConsumeLog',
          component: () => import('@/views/admin/logs/MqConsumeLog.vue'),
          meta: { title: 'MQ消费日志' }
        }
      ]
    }
  ]
})

export default router
