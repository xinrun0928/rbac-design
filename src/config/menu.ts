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
  Microphone,
  CircleClose,
  Cpu,
  DataBoard,
  Key
} from '@element-plus/icons-vue'
import type { Component } from 'vue'

export interface MenuItem {
  path: string
  title: string
  icon?: Component
  children?: MenuItem[]
  isGroup?: boolean
  groupTitle?: string
  status?: 'done' | 'doing' | 'todo'
}

// 超级管理员 - 首页
export const adminDashboardMenu: MenuItem[] = [
  { path: '/admin/dashboard', title: '首页', icon: HomeFilled, status: 'done' },
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
      { path: '/admin/menu', title: '菜单管理', icon: MenuIcon, status: 'done' },
      { path: '/admin/config', title: '配置管理', icon: Tools, status: 'done' },
      { path: '/admin/dict', title: '字典管理', icon: Collection, status: 'done' },
      { path: '/admin/attachment', title: '附件管理', icon: Paperclip, status: 'done' },
      { path: '/admin/msg/template', title: '短信模版', icon: ChatDotSquare, status: 'done' },
      { path: '/admin/area', title: '区域管理', icon: Location, status: 'done' },
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
      { path: '/admin/organization', title: '组织管理', icon: Share, status: 'done' },
      { path: '/admin/dept', title: '部门管理', icon: OfficeBuilding, status: 'done' },
      { path: '/admin/post', title: '岗位管理', icon: Briefcase, status: 'done' },
      { path: '/admin/role', title: '角色管理', icon: UserFilled, status: 'done' },
      { path: '/admin/member', title: '成员管理', icon: User, status: 'done' },
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
      { path: '/admin/subsystem', title: '子系统管理', icon: Monitor, status: 'done' },
      { path: '/admin/meal', title: '套餐列表', icon: Box, status: 'done' },
    ]
  },
  {
    path: '/admin/client-group',
    title: '客户端管理',
    icon: Key,
    isGroup: true,
    groupTitle: '客户端管理',
    children: [
      { path: '/admin/client', title: '客户端管理', icon: Key, status: 'done' },
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
      { path: '/admin/app', title: 'App管理', icon: Cellphone, status: 'done' },
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
      { path: '/admin/monitor/online', title: '在线用户', icon: User, status: 'done' },
      { path: '/admin/monitor/server', title: '服务监控', icon: Monitor, status: 'done' },
      { path: '/admin/monitor/cache', title: '缓存监控', icon: Coin, status: 'done' },
      { path: '/admin/monitor/cache/list', title: '缓存列表', icon: List, status: 'done' },
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
      { path: '/admin/logs/access', title: '访问日志', icon: Notebook, status: 'done' },
      { path: '/admin/logs/http', title: '接口日志', icon: Connection, status: 'done' },
      { path: '/admin/logs/login', title: '登录日志', icon: User, status: 'done' },
      { path: '/admin/logs/message', title: '短信日志', icon: ChatDotRound, status: 'done' },
      { path: '/admin/mq/log', title: 'MQ消费日志', icon: Promotion, status: 'done' },
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
  { path: '/duty/dashboard', title: '工作台', icon: HomeFilled, status: 'todo' },
  { path: '/duty/statistics', title: '我的统计', icon: DataLine, status: 'done' },
  {
    path: '/duty/duty-record-group',
    title: '值班记录',
    icon: Document,
    isGroup: true,
    groupTitle: '值班记录',
    children: [
      { path: '/duty/duty-record/list', title: '值班记录', icon: Document, status: 'todo' },
      { path: '/duty/duty-record/feedback', title: '值班反馈', icon: ChatDotSquare, status: 'todo' },
    ]
  },
  {
    path: '/duty/daily-report-group',
    title: '值班日报',
    icon: Notebook,
    isGroup: true,
    groupTitle: '值班日报',
    children: [
      { path: '/duty/daily-report/fill', title: '日报填报', icon: Edit, status: 'todo' },
      { path: '/duty/daily-report/audit', title: '日报审核', icon: Check, status: 'todo' },
      { path: '/duty/daily-report/template', title: '日报模板', icon: Files, status: 'todo' },
    ]
  },
  {
    path: '/duty/check-group',
    title: '值班查岗',
    icon: Search,
    isGroup: true,
    groupTitle: '值班查岗',
    children: [
      { path: '/duty/check', title: '值班查岗', icon: Search, status: 'todo' },
    ]
  },
  {
    path: '/duty/notice-group',
    title: '公告管理',
    icon: Bell,
    isGroup: true,
    groupTitle: '公告管理',
    children: [
      { path: '/duty/notice', title: '公告管理', icon: Bell, status: 'todo' },
    ]
  },
  {
    path: '/duty/schedule-group',
    title: '排班管理',
    icon: Calendar,
    isGroup: true,
    groupTitle: '排班管理',
    children: [
      { path: '/duty/schedule/table', title: '值班表', icon: List, status: 'todo' },
      { path: '/duty/schedule/rule', title: '排班规则', icon: Setting, status: 'done' },
    ]
  },
  {
    path: '/duty/regulation-group',
    title: '工作制度及要求',
    icon: Reading,
    isGroup: true,
    groupTitle: '工作制度及要求',
    children: [
      { path: '/duty/regulation/query', title: '综合查询', icon: Search, status: 'done' },
      { path: '/duty/regulation/maintain', title: '内容维护', icon: Tools, status: 'todo' },
    ]
  },
  {
    path: '/duty/base-info-group',
    title: '基础信息',
    icon: Setting,
    isGroup: true,
    groupTitle: '基础信息',
    children: [
      { path: '/duty/base-info/post', title: '岗位管理', icon: Briefcase, status: 'done' },
      { path: '/duty/base-info/personnel', title: '值班人员管理', icon: User, status: 'todo' },
      { path: '/duty/base-info/holiday', title: '节假日维护', icon: Calendar, status: 'done' },
    ]
  },
]

// 应急事件管理菜单
export const eventMenus: MenuItem[] = [
  { path: '/event/report', title: '事故上报', icon: EditPen, status: 'done' },
  { path: '/event/receive', title: '事故信息接收', icon: ChatDotRound, status: 'done' },
  { path: '/event/warning', title: '预警处置', icon: Warning, status: 'done' },
  { path: '/event/warning/rule', title: '事故预警规则', icon: Document, status: 'todo' },
  { path: '/event/receive/rule', title: '事故接报规则', icon: List, status: 'done' },
  { path: '/event/task', title: '任务分配及跟踪', icon: DataAnalysis, status: 'todo' },
  { path: '/event/todo', title: '我的待办', icon: Clock, status: 'doing' },
  { path: '/event/document', title: '文档库', icon: Folder, status: 'done' },
  { path: '/event/archive', title: '归档事故库', icon: Box, status: 'todo' },
  { path: '/event/dict', title: '字典管理', icon: Collection, status: 'done' },
  { path: '/event/log', title: '系统日志', icon: Notebook, status: 'done' },
]

// 指挥调度子系统菜单
export const dispatchMenus: MenuItem[] = [
  { path: '/dispatch/guarantee', title: '重点保障工作', icon: Star, status: 'todo' },
  { path: '/dispatch/vehicle/track', title: '重点车辆行驶轨迹', icon: Location, status: 'todo' },
  {
    path: '/dispatch/topic-group',
    title: '专题管理',
    icon: PieChart,
    isGroup: true,
    groupTitle: '专题管理',
    children: [
      { path: '/dispatch/topic/channel', title: '航道专题视图', icon: MapLocation, status: 'todo' },
      { path: '/dispatch/topic/strait', title: '海峡办专题视图', icon: Position, status: 'todo' },
      { path: '/dispatch/topic/config', title: '专题配置', icon: Setting, status: 'todo' },
    ]
  },
  {
    path: '/dispatch/road-group',
    title: '重点路段统计',
    icon: DataLine,
    isGroup: true,
    groupTitle: '重点路段统计',
    children: [
      { path: '/dispatch/road/statistics', title: '重点路段统计', icon: DataLine, status: 'doing' },
    ]
  },
  {
    path: '/dispatch/meeting-group',
    title: '会议管理',
    icon: ChatDotRound,
    isGroup: true,
    groupTitle: '会议管理',
    children: [
      { path: '/dispatch/meeting', title: '会议列表', icon: ChatDotRound, status: 'todo' },
    ]
  },
  {
    path: '/dispatch/network-group',
    title: '网络设备管理',
    icon: Connection,
    isGroup: true,
    groupTitle: '网络设备管理',
    children: [
      { path: '/dispatch/network/monitor', title: '监控设备管理', icon: Monitor, status: 'todo' },
      { path: '/dispatch/network/video', title: '监控视频', icon: VideoCamera, status: 'todo' },
      { path: '/dispatch/network/meeting-device', title: '会议设备管理', icon: ChatDotRound, status: 'todo' },
      { path: '/dispatch/network/meeting-video', title: '会议视频', icon: VideoPlay, status: 'todo' },
      { path: '/dispatch/network/voice-device', title: '语音设备管理', icon: Microphone, status: 'todo' },
      { path: '/dispatch/network/voice', title: '语音', icon: Headset, status: 'todo' },
    ]
  },
  {
    path: '/dispatch/terminal-group',
    title: '终端设备管理',
    icon: Monitor,
    isGroup: true,
    groupTitle: '终端设备管理',
    children: [
      { path: '/dispatch/terminal/control-ball', title: '应急布控球', icon: Camera, status: 'done' },
      { path: '/dispatch/terminal/command-vehicle', title: '应急指挥车', icon: Van, status: 'done' },
      { path: '/dispatch/terminal/personal', title: '应急单兵设备', icon: Cellphone, status: 'done' },
      { path: '/dispatch/terminal/statistics', title: '终端调度统计', icon: DataLine, status: 'done' },
    ]
  },
  {
    path: '/dispatch/flow-group',
    title: '大客流大货流',
    icon: User,
    isGroup: true,
    groupTitle: '大客流大货流',
    children: [
      { path: '/dispatch/flow/road', title: '路段', icon: Guide, status: 'done' },
      { path: '/dispatch/flow/service-area', title: '服务区', icon: OfficeBuilding, status: 'done' },
      { path: '/dispatch/flow/toll-station', title: '收费站', icon: OfficeBuilding, status: 'done' },
    ]
  },
  {
    path: '/dispatch/data-group',
    title: '数据接口',
    icon: Link,
    isGroup: true,
    groupTitle: '数据接口',
    children: [
      { path: '/dispatch/data/road-config', title: '重点路段配置', icon: Setting, status: 'done' },
      { path: '/dispatch/data/road-info', title: '路段信息', icon: DataLine, status: 'done' },
      { path: '/dispatch/data/toll-info', title: '收费站信息', icon: OfficeBuilding, status: 'done' },
      { path: '/dispatch/data/service-info', title: '服务区信息', icon: Location, status: 'done' },
      { path: '/dispatch/data/bridge-info', title: '桥梁信息', icon: Link, status: 'done' },
      { path: '/dispatch/data/tunnel-info', title: '隧道信息', icon: VideoCamera, status: 'done' },
    ]
  },
  {
    path: '/dispatch/weather-group',
    title: '气象数据接入',
    icon: Sunny,
    isGroup: true,
    groupTitle: '气象数据接入',
    children: [
      { path: '/dispatch/weather/typhoon', title: '台风', icon: Warning, status: 'done' },
      { path: '/dispatch/weather/rainfall', title: '降雨量', icon: DataLine, status: 'done' },
      { path: '/dispatch/weather/weather', title: '天气', icon: Sunny, status: 'done' },
      { path: '/dispatch/weather/wind', title: '风力', icon: Connection, status: 'done' },
      { path: '/dispatch/weather/interface', title: '数据接口设置', icon: Setting, status: 'done' },
    ]
  },
  {
    path: '/dispatch/basic-group',
    title: '基础能力',
    icon: Setting,
    isGroup: true,
    groupTitle: '基础能力',
    children: [
      { path: '/dispatch/basic/workflow', title: '工作流程管理', icon: List, status: 'done' },
      { path: '/dispatch/basic/form', title: '填报表单管理', icon: Edit, status: 'done' },
      { path: '/dispatch/basic/scene', title: '业务场景管理', icon: Files, status: 'done' },
    ]
  },
  {
    path: '/dispatch/org-group',
    title: '机构管理',
    icon: OfficeBuilding,
    isGroup: true,
    groupTitle: '机构管理',
    children: [
      { path: '/dispatch/org/admin', title: '机构管理（超管）', icon: OfficeBuilding, status: 'todo' },
      { path: '/dispatch/org/unit', title: '机构管理（单位）', icon: OfficeBuilding, status: 'todo' },
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

// 预案管理菜单
export const planMenus: MenuItem[] = [
  {
    path: '/plan/library-group',
    title: '应急预案库',
    icon: Folder,
    isGroup: true,
    groupTitle: '应急预案库',
    children: [
      { path: '/plan/library/category', title: '分类层级管理', icon: Folder, status: 'todo' },
      { path: '/plan/library/audit', title: '预案审核', icon: Check, status: 'todo' },
      { path: '/plan/library/template', title: '模板管理', icon: Files, status: 'todo' },
      { path: '/plan/library/scenario', title: '场景管理', icon: MapLocation, status: 'todo' },
    ]
  },
  {
    path: '/plan/generate-group',
    title: '应急预案生成',
    icon: Document,
    isGroup: true,
    groupTitle: '应急预案生成',
    children: [
      { path: '/plan/generate/module', title: '预案模块生成与调整', icon: Edit, status: 'todo' },
      { path: '/plan/generate/sample', title: '情景样本库', icon: Collection, status: 'todo' },
      { path: '/plan/generate/storage', title: '规范存储与管理', icon: Box, status: 'todo' },
      { path: '/plan/generate/indicator', title: '评估指标提示词', icon: DataLine, status: 'todo' },
      { path: '/plan/generate/chapter', title: '内容章节提示词', icon: Document, status: 'todo' },
    ]
  },
  {
    path: '/plan/drill-group',
    title: '应急模拟演练',
    icon: Monitor,
    isGroup: true,
    groupTitle: '应急模拟演练',
    children: [
      { path: '/plan/drill/design', title: '演练设计管理', icon: Edit, status: 'todo' },
      { path: '/plan/drill/control', title: '演练过程控制', icon: Promotion, status: 'todo' },
      { path: '/plan/drill/task', title: '演练响应任务', icon: List, status: 'todo' },
      { path: '/plan/drill/group', title: '小组管理', icon: User, status: 'todo' },
    ]
  },
  {
    path: '/plan/model-group',
    title: '模型微调',
    icon: Setting,
    isGroup: true,
    groupTitle: '模型微调',
    children: [
      { path: '/plan/model/tune', title: '模型微调', icon: Setting, status: 'todo' },
    ]
  },
  {
    path: '/plan/response-group',
    title: '应急响应启动',
    icon: VideoPlay,
    isGroup: true,
    groupTitle: '应急响应启动',
    children: [
      { path: '/plan/response/start', title: '应急响应启动', icon: VideoPlay, status: 'todo' },
    ]
  },
  {
    path: '/plan/dimension-group',
    title: '维度定义',
    icon: Grid,
    isGroup: true,
    groupTitle: '维度定义',
    children: [
      { path: '/plan/dimension', title: '维度定义', icon: Grid, status: 'todo' },
    ]
  },
  {
    path: '/plan/interface-group',
    title: '规范接口接入',
    icon: Connection,
    isGroup: true,
    groupTitle: '规范接口接入',
    children: [
      { path: '/plan/interface', title: '规范接口接入', icon: Connection, status: 'todo' },
    ]
  },
  {
    path: '/plan/log-group',
    title: '操作日志',
    icon: Notebook,
    isGroup: true,
    groupTitle: '操作日志',
    children: [
      { path: '/plan/log', title: '操作日志', icon: Notebook, status: 'todo' },
    ]
  },
]

// 物资管理菜单
export const materialMenus: MenuItem[] = [
  { path: '/resource/home', title: '首页', icon: HomeFilled, status: 'todo' },
  {
    path: '/resource/warehouse-group',
    title: '设备物资仓库管理',
    icon: Box,
    isGroup: true,
    groupTitle: '设备物资仓库管理',
    children: [
      { path: '/resource/warehouse/query', title: '库存查询', icon: Search, status: 'done' },
      { path: '/resource/warehouse/apply', title: '调用申请', icon: Document, status: 'doing' },
      { path: '/resource/warehouse/check', title: '库存盘点', icon: Check, status: 'doing' },
      { path: '/resource/warehouse/audit', title: '调用审核', icon: EditPen, status: 'doing' },
      { path: '/resource/warehouse/warehouse', title: '仓库查询', icon: OfficeBuilding, status: 'doing' },
      { path: '/resource/warehouse/warning', title: '安全库存预警', icon: Warning, status: 'doing' },
      { path: '/resource/warehouse/fault-warning', title: '故障/报废预警', icon: Warning, status: 'doing' },
    ]
  },
  {
    path: '/resource/drone-group',
    title: '无人机飞控管理',
    icon: Promotion,
    isGroup: true,
    groupTitle: '无人机飞控管理',
    children: [
      { path: '/resource/drone/device', title: '设备管理', icon: Cpu, status: 'done' },
      { path: '/resource/drone/monitor', title: '飞行监控', icon: Monitor, status: 'done' },
    ]
  },
  {
    path: '/resource/maintenance-group',
    title: '装备维保管理',
    icon: Tools,
    isGroup: true,
    groupTitle: '装备维保管理',
    children: [
      { path: '/resource/maintenance/plan', title: '装备维保计划', icon: Document, status: 'doing' },
      { path: '/resource/maintenance/record', title: '维保记录', icon: Notebook, status: 'doing' },
      { path: '/resource/maintenance/fault', title: '故障设备', icon: Warning, status: 'doing' },
      { path: '/resource/maintenance/retire', title: '退役/报废审核', icon: CircleClose, status: 'doing' },
    ]
  },
  {
    path: '/resource/training-group',
    title: '装备培训与考核',
    icon: Reading,
    isGroup: true,
    groupTitle: '装备培训与考核',
    children: [
      { path: '/resource/training/use', title: '装备使用教程', icon: Reading, status: 'done' },
      { path: '/resource/training/template', title: '装备操作考核模板', icon: Files, status: 'done' },
      { path: '/resource/training/record', title: '装备操作考核记录', icon: Notebook, status: 'done' },
      { path: '/resource/training/task', title: '装备操作考核任务', icon: EditPen, status: 'doing' },
    ]
  },
  {
    path: '/resource/basic-group',
    title: '基础管理',
    icon: Setting,
    isGroup: true,
    groupTitle: '基础管理',
    children: [
      { path: '/resource/basic/category', title: '物资装备种类管理', icon: Collection, status: 'done' },
      { path: '/resource/basic/set', title: '装备套组管理', icon: Box, status: 'done' },
    ]
  },
]

// 辅助决策菜单
export const decisionMenus: MenuItem[] = [
  { path: '/decision/home', title: '首页', icon: HomeFilled, status: 'todo' },
  {
    path: '/decision/knowledge-group',
    title: '知识管理',
    icon: Document,
    isGroup: true,
    groupTitle: '知识管理',
    children: [
      { path: '/decision/knowledge/input', title: '知识录入', icon: Edit, status: 'done' },
      { path: '/decision/knowledge/audit', title: '审核审批', icon: Check, status: 'doing' },
      { path: '/decision/knowledge/category', title: '知识分类', icon: Folder, status: 'doing' },
      { path: '/decision/knowledge/maintain', title: '知识维护与更新', icon: Tools, status: 'doing' },
      { path: '/decision/knowledge/record', title: '维护更新记录', icon: Notebook, status: 'doing' },
      { path: '/decision/knowledge/expire', title: '过期知识处理', icon: Clock, status: 'doing' },
    ]
  },
  {
    path: '/decision/tool-group',
    title: '辅助决策工具',
    icon: DataAnalysis,
    isGroup: true,
    groupTitle: '辅助决策工具',
    children: [
      { path: '/decision/tool/policy', title: '政策法规查询', icon: Search, status: 'todo' },
      { path: '/decision/tool/ai', title: '交通智慧大模型', icon: Cpu, status: 'todo' },
    ]
  },
  {
    path: '/decision/feedback-group',
    title: '用户反馈管理',
    icon: ChatDotRound,
    isGroup: true,
    groupTitle: '用户反馈管理',
    children: [
      { path: '/decision/feedback/list', title: '用户反馈', icon: ChatDotSquare, status: 'doing' },
    ]
  },
  {
    path: '/decision/basic-group',
    title: '基础管理',
    icon: Setting,
    isGroup: true,
    groupTitle: '基础管理',
    children: [
      { path: '/decision/basic/management', title: '基础管理', icon: Setting, status: 'doing' },
    ]
  },
]

// 数据融合菜单
export const fusionMenus: MenuItem[] = [
  {
    path: '/fusion/map-group',
    title: '地图引擎封装服务',
    icon: MapLocation,
    isGroup: true,
    groupTitle: '地图引擎封装服务',
    children: [
      { path: '/fusion/map', title: '地图引擎封装服务', icon: MapLocation, status: 'todo' },
    ]
  },
  {
    path: '/fusion/hd-map-group',
    title: '高精地图引擎服务',
    icon: Position,
    isGroup: true,
    groupTitle: '高精地图引擎服务',
    children: [
      { path: '/fusion/hd-map', title: '高精地图引擎服务', icon: Position, status: 'todo' },
    ]
  },
  {
    path: '/fusion/portal-group',
    title: '个人门户',
    icon: User,
    isGroup: true,
    groupTitle: '个人门户',
    children: [
      { path: '/fusion/portal', title: '个人门户', icon: User, status: 'todo' },
    ]
  },
  {
    path: '/fusion/simulation-group',
    title: '交通仿真引擎服务',
    icon: Cpu,
    isGroup: true,
    groupTitle: '交通仿真引擎服务',
    children: [
      { path: '/fusion/simulation', title: '交通仿真引擎服务', icon: Cpu, status: 'todo' },
    ]
  },
  {
    path: '/fusion/service-group',
    title: '融合服务',
    icon: Connection,
    isGroup: true,
    groupTitle: '融合服务',
    children: [
      { path: '/fusion/service', title: '融合服务', icon: Connection, status: 'todo' },
    ]
  },
  {
    path: '/fusion/video-conference-group',
    title: '视频会议应用',
    icon: VideoCamera,
    isGroup: true,
    groupTitle: '视频会议应用',
    children: [
      { path: '/fusion/video-conference', title: '视频会议应用', icon: VideoCamera, status: 'todo' },
    ]
  },
  {
    path: '/fusion/video-capability-group',
    title: '视频能力应用',
    icon: VideoPlay,
    isGroup: true,
    groupTitle: '视频能力应用',
    children: [
      { path: '/fusion/video-capability', title: '视频能力应用', icon: VideoPlay, status: 'todo' },
    ]
  },
  {
    path: '/fusion/dashboard-group',
    title: '数据看板',
    icon: DataBoard,
    isGroup: true,
    groupTitle: '数据看板',
    children: [
      { path: '/fusion/dashboard', title: '数据看板', icon: DataBoard, status: 'todo' },
    ]
  },
  {
    path: '/fusion/external-group',
    title: '外部系统接口对接',
    icon: Link,
    isGroup: true,
    groupTitle: '外部系统接口对接',
    children: [
      { path: '/fusion/external', title: '外部系统接口对接', icon: Link, status: 'todo' },
    ]
  },
  {
    path: '/fusion/integration-group',
    title: '子系统集成',
    icon: Grid,
    isGroup: true,
    groupTitle: '子系统集成',
    children: [
      { path: '/fusion/integration', title: '子系统集成', icon: Grid, status: 'todo' },
    ]
  },
]

// 企业视角菜单（预留）
export const enterpriseMenus: MenuItem[] = [
  // 后续添加企业视角菜单
]
