/** 统计卡片 */
export interface StatCard {
  title: string
  value: number | string
  suffix?: string
  icon: string
  color: string
  trend?: number
  trendLabel?: string
}

/** 登录趋势 */
export interface LoginTrend {
  date: string
  count: number
}

/** 最近登录记录 */
export interface RecentLogin {
  username: string
  dept: string
  ip: string
  location: string
  browser: string
  loginTime: string
  status: 'success' | 'fail'
}

/** 系统公告 */
export interface Notice {
  id: number
  title: string
  type: 'notice' | 'update' | 'alert'
  time: string
}

/** 待办事项 */
export interface TodoItem {
  id: number
  title: string
  type: 'approval' | 'task' | 'alert'
  time: string
}

// ─── 统计卡片 ───────────────────────────────────────
export const statCards: StatCard[] = [
  { title: '总用户数', value: 1286, icon: 'User', color: '#409EFF', trend: 12, trendLabel: '较上月' },
  { title: '今日登录', value: 328, icon: 'UserFilled', color: '#67C23A', trend: 8.5, trendLabel: '较昨日' },
  { title: '在线用户', value: 42, icon: 'Monitor', color: '#E6A23C', trend: -3, trendLabel: '较峰值' },
  { title: '角色数量', value: 15, icon: 'UserFilled', color: '#F56C6C' },
  { title: '菜单数量', value: 86, icon: 'Menu', color: '#909399', trend: 5, trendLabel: '本月新增' },
  { title: '今日告警', value: 3, icon: 'Bell', color: '#F56C6C', trend: -2, trendLabel: '较昨日' },
]

// ─── 登录趋势 ───────────────────────────────────────
export const loginTrendData: LoginTrend[] = [
  { date: '07-18', count: 245 },
  { date: '07-19', count: 312 },
  { date: '07-20', count: 198 },
  { date: '07-21', count: 267 },
  { date: '07-22', count: 356 },
  { date: '07-23', count: 423 },
  { date: '07-24', count: 328 },
]

// ─── 最近登录 ───────────────────────────────────────
export const recentLogins: RecentLogin[] = [
  { username: 'admin', dept: '应急指挥中心', ip: '192.168.1.100', location: '广东省广州市', browser: 'Chrome 120.0', loginTime: '2026-07-24 09:32:15', status: 'success' },
  { username: 'zhangsan', dept: '信息科', ip: '192.168.1.101', location: '广东省深圳市', browser: 'Firefox 121.0', loginTime: '2026-07-24 09:28:42', status: 'success' },
  { username: 'lisi', dept: '办公室', ip: '10.0.0.55', location: '北京市朝阳区', browser: 'Edge 120.0', loginTime: '2026-07-24 09:15:33', status: 'success' },
  { username: 'wangwu', dept: '救援协调处', ip: '172.16.0.88', location: '上海市浦东新区', browser: 'Chrome 119.0', loginTime: '2026-07-24 09:02:18', status: 'fail' },
  { username: 'zhaoliu', dept: '监测预警处', ip: '192.168.2.200', location: '广东省佛山市', browser: 'Safari 17.2', loginTime: '2026-07-24 08:56:07', status: 'success' },
  { username: 'sunqi', dept: '应急保障处', ip: '10.10.1.33', location: '广东省东莞市', browser: 'Chrome 120.0', loginTime: '2026-07-24 08:45:22', status: 'success' },
  { username: 'zhouba', dept: '政策法规处', ip: '192.168.1.150', location: '浙江省杭州市', browser: 'Edge 119.0', loginTime: '2026-07-24 08:38:51', status: 'success' },
  { username: 'wujiu', dept: '宣传教育处', ip: '10.0.0.77', location: '江苏省南京市', browser: 'Chrome 120.0', loginTime: '2026-07-24 08:30:14', status: 'success' },
  { username: 'zhengshi', dept: '应急指挥中心', ip: '172.16.0.66', location: '广东省广州市', browser: 'Chrome 118.0', loginTime: '2026-07-24 08:22:38', status: 'fail' },
  { username: 'liuyi', dept: '信息科', ip: '192.168.2.180', location: '广东省深圳市', browser: 'Firefox 120.0', loginTime: '2026-07-24 08:15:05', status: 'success' },
]

// ─── 系统公告 ───────────────────────────────────────
export const notices: Notice[] = [
  { id: 1, title: '系统将于本周六凌晨进行升级维护', type: 'notice', time: '2026-07-24 10:00' },
  { id: 2, title: '新增应急事件自动分级功能', type: 'update', time: '2026-07-23 16:30' },
  { id: 3, title: '部分区域网络延迟较高，请注意', type: 'alert', time: '2026-07-23 09:15' },
  { id: 4, title: 'V2.1.0版本已发布，请及时更新', type: 'update', time: '2026-07-22 14:00' },
  { id: 5, title: '关于应急预案管理规范的通知', type: 'notice', time: '2026-07-21 11:20' },
]

// ─── 待办事项 ───────────────────────────────────────
export const todoItems: TodoItem[] = [
  { id: 1, title: '审批应急预案：台风应急预案V3.0', type: 'approval', time: '2026-07-24 08:30' },
  { id: 2, title: '完成Q3季度安全巡检报告', type: 'task', time: '2026-07-24 09:00' },
  { id: 3, title: '处理告警：数据库连接池接近上限', type: 'alert', time: '2026-07-24 09:15' },
  { id: 4, title: '审批人员变更：李四岗位调整', type: 'approval', time: '2026-07-23 17:00' },
  { id: 5, title: '更新应急通讯录数据', type: 'task', time: '2026-07-23 15:30' },
]
