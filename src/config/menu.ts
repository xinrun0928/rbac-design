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
  Promotion,
  Setting,
  DataLine,
  Coin,
  List,
  HomeFilled,
  Calendar,
  Clock,
  Switch,
  Warning,
  Reading,
  Search,
  Check,
  Files,
  Edit,
  Bell
} from '@element-plus/icons-vue'
import type { Component } from 'vue'

export interface MenuItem {
  path: string
  title: string
  icon?: Component
  children?: MenuItem[]
  isGroup?: boolean
  groupTitle?: string
}

// 超级管理员 - 首页
export const adminDashboardMenu: MenuItem[] = [
  { path: '/admin/dashboard', title: '首页', icon: HomeFilled },
]

// 超级管理员 - 系统管理菜单
export const adminSystemMenu: MenuItem[] = [
  {
    path: '/admin/system-group',
    title: '系统管理',
    icon: Setting,
    isGroup: true,
    groupTitle: '系统管理',
    children: [
      { path: '/admin/menu', title: '菜单管理', icon: MenuIcon },
      { path: '/admin/config', title: '配置管理', icon: Tools },
      { path: '/admin/dict', title: '字典管理', icon: Collection },
      { path: '/admin/attachment', title: '附件管理', icon: Paperclip },
      { path: '/admin/msg/template', title: '短信模版', icon: ChatDotSquare },
    ]
  },
]

// 超级管理员 - 组织架构菜单
export const adminOrgMenu: MenuItem[] = [
  {
    path: '/admin/org-group',
    title: '组织架构',
    icon: Share,
    isGroup: true,
    groupTitle: '组织架构',
    children: [
      { path: '/admin/organization', title: '组织管理', icon: Share },
      { path: '/admin/dept', title: '部门管理', icon: OfficeBuilding },
      { path: '/admin/post', title: '岗位管理', icon: Briefcase },
      { path: '/admin/role', title: '角色管理', icon: UserFilled },
      { path: '/admin/member', title: '成员管理', icon: User },
    ]
  },
]

// 超级管理员 - 套餐管理菜单（包含子系统管理）
export const adminMealMenu: MenuItem[] = [
  {
    path: '/admin/meal-group',
    title: '套餐管理',
    icon: Box,
    isGroup: true,
    groupTitle: '套餐管理',
    children: [
      { path: '/admin/subsystem', title: '子系统管理', icon: Monitor },
      { path: '/admin/meal', title: '套餐列表', icon: Box },
    ]
  },
]

// 超级管理员 - 应用管理菜单
export const adminAppMenu: MenuItem[] = [
  {
    path: '/admin/app-group',
    title: '应用管理',
    icon: Cellphone,
    isGroup: true,
    groupTitle: '应用管理',
    children: [
      { path: '/admin/app', title: 'App管理', icon: Cellphone },
    ]
  },
]

// 超级管理员 - 系统监控菜单
export const adminMonitorMenu: MenuItem[] = [
  {
    path: '/admin/monitor-group',
    title: '系统监控',
    icon: DataLine,
    isGroup: true,
    groupTitle: '系统监控',
    children: [
      { path: '/admin/monitor/online', title: '在线用户', icon: User },
      { path: '/admin/monitor/server', title: '服务监控', icon: Monitor },
      { path: '/admin/monitor/cache', title: '缓存监控', icon: Coin },
      { path: '/admin/monitor/cache/list', title: '缓存列表', icon: List },
    ]
  },
]

// 超级管理员 - 日志管理菜单
export const adminLogMenu: MenuItem[] = [
  {
    path: '/admin/logs-group',
    title: '日志管理',
    icon: Document,
    isGroup: true,
    groupTitle: '日志管理',
    children: [
      { path: '/admin/logs/access', title: '访问日志', icon: Notebook },
      { path: '/admin/logs/http', title: '接口日志', icon: Connection },
      { path: '/admin/logs/login', title: '登录日志', icon: User },
      { path: '/admin/logs/message', title: '短信日志', icon: ChatDotRound },
      { path: '/admin/mq/log', title: 'MQ消费日志', icon: Promotion },
    ]
  }
]

// 超级管理员 - 所有菜单
export const adminMenus: MenuItem[] = [
  ...adminDashboardMenu,
  ...adminSystemMenu,
  ...adminOrgMenu,
  ...adminMealMenu,
  ...adminAppMenu,
  ...adminMonitorMenu,
  ...adminLogMenu,
]

// 应急值守管理菜单
export const dutyMenus: MenuItem[] = [
  { path: '/duty/dashboard', title: '工作台', icon: HomeFilled },
  { path: '/duty/statistics', title: '我的统计', icon: DataLine },
  {
    path: '/duty/duty-record-group',
    title: '值班记录',
    icon: Document,
    isGroup: true,
    groupTitle: '值班记录',
    children: [
      { path: '/duty/duty-record/list', title: '值班记录', icon: Document },
      { path: '/duty/duty-record/feedback', title: '值班反馈', icon: ChatDotSquare },
    ]
  },
  {
    path: '/duty/daily-report-group',
    title: '值班日报',
    icon: Notebook,
    isGroup: true,
    groupTitle: '值班日报',
    children: [
      { path: '/duty/daily-report/fill', title: '日报填报', icon: Edit },
      { path: '/duty/daily-report/audit', title: '日报审核', icon: Check },
      { path: '/duty/daily-report/template', title: '日报模板', icon: Files },
    ]
  },
  { path: '/duty/check', title: '值班查岗', icon: Search },
  { path: '/duty/notice', title: '公告管理', icon: Bell },
  {
    path: '/duty/schedule-group',
    title: '排班管理',
    icon: Calendar,
    isGroup: true,
    groupTitle: '排班管理',
    children: [
      { path: '/duty/schedule/table', title: '值班表', icon: List },
      { path: '/duty/schedule/rule', title: '排班规则', icon: Setting },
    ]
  },
  {
    path: '/duty/regulation-group',
    title: '工作制度及要求',
    icon: Reading,
    isGroup: true,
    groupTitle: '工作制度及要求',
    children: [
      { path: '/duty/regulation/query', title: '综合查询', icon: Search },
      { path: '/duty/regulation/maintain', title: '内容维护', icon: Tools },
    ]
  },
  {
    path: '/duty/base-info-group',
    title: '基础信息',
    icon: Setting,
    isGroup: true,
    groupTitle: '基础信息',
    children: [
      { path: '/duty/base-info/post', title: '岗位管理', icon: Briefcase },
      { path: '/duty/base-info/personnel', title: '值班人员管理', icon: User },
      { path: '/duty/base-info/holiday', title: '节假日维护', icon: Calendar },
    ]
  },
]

/**
 * 根据当前路径查找所属分组标题
 * @param path 当前路由路径
 * @param menus 菜单列表
 * @returns 分组标题，未找到返回空字符串
 */
export function findGroupTitle(path: string, menus: MenuItem[]): string {
  for (const item of menus) {
    if (item.isGroup && item.children) {
      if (item.children.some(child => path.startsWith(child.path))) {
        return item.groupTitle || item.title
      }
    }
  }
  return ''
}

// 企业视角菜单（预留）
export const enterpriseMenus: MenuItem[] = [
  // 后续添加企业视角菜单
]
