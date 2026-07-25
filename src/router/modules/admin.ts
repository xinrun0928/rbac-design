import type { RouteRecordRaw } from 'vue-router'

/**
 * 后台管理子系统路由 (SYSTEM)
 * 路径前缀: /admin
 * 包含: 系统管理、组织架构、套餐管理、应用管理、日志管理
 */
const adminRoutes: RouteRecordRaw = {
  path: '/admin',
  component: () => import('@/views/admin/layout/AdminLayout.vue'),
  redirect: '/admin/menu',
  meta: { title: '后台管理', subsystem: 'SYSTEM' },
  children: [
    // 系统管理
    {
      path: 'menu',
      name: 'AdminMenu',
      component: () => import('@/views/admin/system/MenuManagement.vue'),
      meta: { title: '菜单管理' }
    },
    {
      path: 'config',
      name: 'AdminConfig',
      component: () => import('@/views/admin/system/ConfigManagement.vue'),
      meta: { title: '配置管理' }
    },
    {
      path: 'dict',
      name: 'AdminDictType',
      component: () => import('@/views/admin/system/DictTypeManagement.vue'),
      meta: { title: '字典管理' }
    },
    {
      path: 'dict/data',
      name: 'AdminDictData',
      component: () => import('@/views/admin/system/DictDataManagement.vue'),
      meta: { title: '字典数据' }
    },
    {
      path: 'attachment',
      name: 'AdminAttachment',
      component: () => import('@/views/admin/system/AttachmentManagement.vue'),
      meta: { title: '附件管理' }
    },
    {
      path: 'msg/template',
      name: 'AdminMessageTemplate',
      component: () => import('@/views/admin/system/MessageTemplateManagement.vue'),
      meta: { title: '短信模版' }
    },
    {
      path: 'area',
      name: 'AdminArea',
      component: () => import('@/views/admin/system/AreaManagement.vue'),
      meta: { title: '区域管理' }
    },

    // 组织架构
    {
      path: 'organization',
      name: 'AdminOrg',
      component: () => import('@/views/admin/org/OrgTreeView.vue'),
      meta: { title: '组织管理' }
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
      path: 'role',
      name: 'AdminRole',
      component: () => import('@/views/admin/org/RoleManagement.vue'),
      meta: { title: '角色管理' }
    },
    {
      path: 'member',
      name: 'AdminMember',
      component: () => import('@/views/admin/org/MemberManagement.vue'),
      meta: { title: '成员管理' }
    },

    // 套餐管理
    {
      path: 'subsystem',
      name: 'AdminSubsystem',
      component: () => import('@/views/admin/meal/SubsystemManagement.vue'),
      meta: { title: '子系统管理' }
    },
    {
      path: 'meal',
      name: 'AdminMeal',
      component: () => import('@/views/admin/meal/MealManagement.vue'),
      meta: { title: '套餐列表' }
    },

    // 应用管理
    {
      path: 'app',
      name: 'AdminApp',
      component: () => import('@/views/admin/app/AppManagement.vue'),
      meta: { title: 'App管理' }
    },
    {
      path: 'app/log',
      name: 'AdminAppPublishLog',
      component: () => import('@/views/admin/app/AppPublishLog.vue'),
      meta: { title: 'App发布日志' }
    },

    // 日志管理
    {
      path: 'logs/access',
      name: 'AdminAccessLog',
      component: () => import('@/views/admin/logs/SysAccessLog.vue'),
      meta: { title: '访问日志' }
    },
    {
      path: 'logs/http',
      name: 'AdminHttpLog',
      component: () => import('@/views/admin/logs/SysHttpLog.vue'),
      meta: { title: '接口日志' }
    },
    {
      path: 'logs/login',
      name: 'AdminLoginLog',
      component: () => import('@/views/admin/logs/SysLoginLog.vue'),
      meta: { title: '登录日志' }
    },
    {
      path: 'logs/message',
      name: 'AdminMessageLog',
      component: () => import('@/views/admin/logs/SysMessageLog.vue'),
      meta: { title: '短信日志' }
    },
    {
      path: 'mq/log',
      name: 'AdminMqConsumeLog',
      component: () => import('@/views/admin/logs/MqConsumeLog.vue'),
      meta: { title: 'MQ消费日志' }
    },
  ]
}

export default adminRoutes
