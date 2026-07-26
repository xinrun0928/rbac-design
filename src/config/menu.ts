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
  Bell,
  EditPen,
  DataAnalysis,
  Folder,
  Star,
  Location,
  PieChart,
  VideoCamera,
  Headset,
  Camera,
  Van,
  Guide,
  InfoFilled,
  Sunny,
  Link,
  Grid,
  VideoPlay,
  MapLocation,
  Position,
  Microphone
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
  {
    path: '/duty/check-group',
    title: '值班查岗',
    icon: Search,
    isGroup: true,
    groupTitle: '值班查岗',
    children: [
      { path: '/duty/check', title: '值班查岗', icon: Search },
    ]
  },
  {
    path: '/duty/notice-group',
    title: '公告管理',
    icon: Bell,
    isGroup: true,
    groupTitle: '公告管理',
    children: [
      { path: '/duty/notice', title: '公告管理', icon: Bell },
    ]
  },
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

// 应急事件管理菜单
export const eventMenus: MenuItem[] = [
  { path: '/event/report', title: '事故上报', icon: EditPen },
  { path: '/event/receive', title: '事故信息接收', icon: ChatDotRound },
  { path: '/event/warning', title: '预警处置', icon: Warning },
  { path: '/event/warning/rule', title: '事故预警规则', icon: Document },
  { path: '/event/receive/rule', title: '事故接报规则', icon: List },
  { path: '/event/task', title: '任务分配及跟踪', icon: DataAnalysis },
  { path: '/event/todo', title: '我的待办', icon: Clock },
  { path: '/event/document', title: '文档库', icon: Folder },
  { path: '/event/archive', title: '归档事故库', icon: Box },
  { path: '/event/dict', title: '字典管理', icon: Collection },
  { path: '/event/log', title: '系统日志', icon: Notebook },
]

// 指挥调度子系统菜单
export const dispatchMenus: MenuItem[] = [
  { path: '/dispatch/guarantee', title: '重点保障工作', icon: Star },
  { path: '/dispatch/vehicle/track', title: '重点车辆行驶轨迹', icon: Location },
  {
    path: '/dispatch/topic-group',
    title: '专题管理',
    icon: PieChart,
    isGroup: true,
    groupTitle: '专题管理',
    children: [
      { path: '/dispatch/topic/channel', title: '航道专题视图', icon: MapLocation },
      { path: '/dispatch/topic/strait', title: '海峡办专题视图', icon: Position },
      { path: '/dispatch/topic/config', title: '专题配置', icon: Setting },
    ]
  },
  {
    path: '/dispatch/road-group',
    title: '重点路段统计',
    icon: DataLine,
    isGroup: true,
    groupTitle: '重点路段统计',
    children: [
      { path: '/dispatch/road/statistics', title: '重点路段统计', icon: DataLine },
    ]
  },
  {
    path: '/dispatch/meeting-group',
    title: '会议管理',
    icon: ChatDotRound,
    isGroup: true,
    groupTitle: '会议管理',
    children: [
      { path: '/dispatch/meeting', title: '会议列表', icon: ChatDotRound },
    ]
  },
  {
    path: '/dispatch/network-group',
    title: '网络设备管理',
    icon: Connection,
    isGroup: true,
    groupTitle: '网络设备管理',
    children: [
      { path: '/dispatch/network/monitor', title: '监控设备管理', icon: Monitor },
      { path: '/dispatch/network/video', title: '监控视频', icon: VideoCamera },
      { path: '/dispatch/network/meeting-device', title: '会议设备管理', icon: ChatDotRound },
      { path: '/dispatch/network/meeting-video', title: '会议视频', icon: VideoPlay },
      { path: '/dispatch/network/voice-device', title: '语音设备管理', icon: Microphone },
      { path: '/dispatch/network/voice', title: '语音', icon: Headset },
    ]
  },
  {
    path: '/dispatch/terminal-group',
    title: '终端设备管理',
    icon: Monitor,
    isGroup: true,
    groupTitle: '终端设备管理',
    children: [
      { path: '/dispatch/terminal/control-ball', title: '应急布控球', icon: Camera },
      { path: '/dispatch/terminal/command-vehicle', title: '应急指挥车', icon: Van },
      { path: '/dispatch/terminal/personal', title: '应急单兵设备', icon: Cellphone },
      { path: '/dispatch/terminal/statistics', title: '终端调度统计', icon: DataLine },
    ]
  },
  {
    path: '/dispatch/flow-group',
    title: '大客流大货流',
    icon: User,
    isGroup: true,
    groupTitle: '大客流大货流',
    children: [
      { path: '/dispatch/flow/road', title: '路段', icon: Guide },
      { path: '/dispatch/flow/service-area', title: '服务区', icon: OfficeBuilding },
      { path: '/dispatch/flow/toll-station', title: '收费站', icon: OfficeBuilding },
    ]
  },
  {
    path: '/dispatch/data-group',
    title: '数据接口',
    icon: Link,
    isGroup: true,
    groupTitle: '数据接口',
    children: [
      { path: '/dispatch/data/road-config', title: '重点路段配置', icon: Setting },
      { path: '/dispatch/data/road-info', title: '路段信息', icon: InfoFilled },
      { path: '/dispatch/data/toll-info', title: '收费站信息', icon: InfoFilled },
      { path: '/dispatch/data/service-info', title: '服务区信息', icon: InfoFilled },
      { path: '/dispatch/data/bridge-info', title: '桥梁信息', icon: InfoFilled },
      { path: '/dispatch/data/tunnel-info', title: '隧道信息', icon: InfoFilled },
    ]
  },
  {
    path: '/dispatch/weather-group',
    title: '气象数据接入',
    icon: Sunny,
    isGroup: true,
    groupTitle: '气象数据接入',
    children: [
      { path: '/dispatch/weather/typhoon', title: '台风', icon: Sunny },
      { path: '/dispatch/weather/rainfall', title: '降雨量', icon: Sunny },
      { path: '/dispatch/weather/weather', title: '天气', icon: Sunny },
      { path: '/dispatch/weather/wind', title: '风力', icon: Sunny },
      { path: '/dispatch/weather/interface', title: '数据接口设置', icon: Connection },
    ]
  },
  {
    path: '/dispatch/basic-group',
    title: '基础能力',
    icon: Setting,
    isGroup: true,
    groupTitle: '基础能力',
    children: [
      { path: '/dispatch/basic/workflow', title: '工作流程管理', icon: List },
      { path: '/dispatch/basic/form', title: '填报表单管理', icon: Edit },
      { path: '/dispatch/basic/scene', title: '业务场景管理', icon: Files },
    ]
  },
  {
    path: '/dispatch/org-group',
    title: '机构管理',
    icon: OfficeBuilding,
    isGroup: true,
    groupTitle: '机构管理',
    children: [
      { path: '/dispatch/org/admin', title: '机构管理（超管）', icon: OfficeBuilding },
      { path: '/dispatch/org/unit', title: '机构管理（单位）', icon: OfficeBuilding },
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
