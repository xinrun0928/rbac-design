import {
  Monitor,
  Box,
  Menu as MenuIcon,
  Share,
  User,
  UserFilled,
  OfficeBuilding,
  Briefcase,
  Collection,
  Tools,
  Paperclip,
  ChatDotSquare,
  Cellphone,
  Document,
  Notebook,
  ChatDotRound,
  Connection,
  Promotion
} from '@element-plus/icons-vue'
import type { Component } from 'vue'

export interface MenuItem {
  path: string
  title: string
  icon?: Component
  children?: MenuItem[]
}

// 超级管理员 - 系统管理菜单
export const adminSystemMenu: MenuItem[] = [
  { path: '/admin/subsystem', title: '子系统管理', icon: Monitor },
  { path: '/admin/meal', title: '套餐管理', icon: Box },
  { path: '/admin/menu', title: '菜单管理', icon: MenuIcon },
]

// 超级管理员 - 组织管理菜单
export const adminOrgMenu: MenuItem[] = [
  { path: '/admin/organization', title: '组织管理', icon: Share },
  { path: '/admin/member', title: '成员管理', icon: User },
  { path: '/admin/role', title: '角色管理', icon: UserFilled },
  { path: '/admin/dept', title: '部门管理', icon: OfficeBuilding },
  { path: '/admin/post', title: '岗位管理', icon: Briefcase },
]

// 超级管理员 - 配置管理菜单
export const adminConfigMenu: MenuItem[] = [
  { path: '/admin/dict', title: '字典管理', icon: Collection },
  { path: '/admin/config', title: '配置管理', icon: Tools },
  { path: '/admin/attachment', title: '附件管理', icon: Paperclip },
  { path: '/admin/msg/template', title: '短信模版', icon: ChatDotSquare },
  { path: '/admin/app', title: 'App管理', icon: Cellphone },
]

// 超级管理员 - 日志管理菜单
export const adminLogMenu: MenuItem[] = [
  {
    path: '/admin/logs',
    title: '日志管理',
    icon: Document,
    children: [
      { path: '/admin/logs/access', title: '访问日志', icon: Notebook },
      { path: '/admin/logs/message', title: '短信日志', icon: ChatDotRound },
      { path: '/admin/logs/http', title: '接口日志', icon: Connection },
      { path: '/admin/logs/login', title: '登录日志', icon: User },
      { path: '/admin/mq/log', title: 'MQ消费日志', icon: Promotion },
    ]
  }
]

// 超级管理员 - 所有菜单
export const adminMenus: MenuItem[] = [
  ...adminSystemMenu,
  ...adminOrgMenu,
  ...adminConfigMenu,
  ...adminLogMenu,
]

// 企业视角菜单（预留）
export const enterpriseMenus: MenuItem[] = [
  // 后续添加企业视角菜单
]
