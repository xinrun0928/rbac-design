/** 系统访问日志数据类型 */
export interface SysAccessLog {
  /** 日志ID */
  id: string
  /** 操作名称 */
  name: string
  /** 请求URL */
  reqUrl: string
  /** 请求方法 */
  opMethod: string
  /** 请求IP */
  ip: string
  /** 操作地点 */
  location?: string | null
  /** 请求参数 */
  reqParams?: string | null
  /** 响应数据 */
  repData?: string | null
  /** 响应时间（毫秒） */
  repTime: string
  /** 类名 */
  className: string
  /** 操作结果 */
  result: string
  /** 用户ID */
  userId?: string | null
  /** 用户名 */
  userName?: string | null
  /** 组织ID */
  orgId: number
  /** 组织名称 */
  orgName?: string | null
  /** 浏览器 */
  browser: string
  /** 操作系统 */
  os: string
  /** 操作类型: 0-其他, 1-查询, 2-新增, 3-修改, 4-删除, 5-导出, 6-导入 */
  opType: number
  /** 功能类型: 1-登录认证, 2-数据操作, 3-流程操作 */
  funcType: number
  /** 模块分类: 1-认证模块, 11101-组织管理, 11105-巡检任务, 11106-巡检定位 */
  moduleType: number
  /** 状态: 1101-正常, 1102-停用 */
  status: number
  /** 备注 */
  remark?: string | null
  /** 签名结果 */
  signResult?: string | null
  /** 创建时间 */
  createTime: string
}

/** 系统短信消息日志数据类型 */
export interface SysMessageLog {
  /** 消息ID */
  messageId: string
  /** 模板ID */
  templateId: string
  /** 手机号码 */
  phone: string
  /** 消息内容 */
  content: string
  /** 请求头 */
  reqHeaders?: string
  /** 回复内容 */
  replyText?: string
  /** 状态: 1-成功, 0-失败 */
  status: number
  /** 显示排序 */
  displayOrder: number
  /** 备注 */
  remark?: string
  /** 创建时间 */
  createTime: string
}

/** 系统接口请求日志数据类型 */
export interface SysHttpLog {
  /** 日志ID */
  id: string
  /** 用户ID */
  userId?: number | null
  /** 组织ID */
  orgId: number
  /** 请求方法 */
  reqMethod: string
  /** 请求URL */
  reqUrl: string
  /** 请求头 */
  reqHeader?: string | null
  /** 请求参数 */
  reqParams: string
  /** 响应状态 */
  repState: string
  /** 响应数据 */
  repData: string
  /** 响应时间（毫秒） */
  repTime: string
  /** 创建时间 */
  createTime: string
}

/** 系统登录日志数据类型 */
export interface SysLoginLog {
  /** 日志ID */
  logId: string
  /** 用户名 */
  userName?: string | null
  /** 父用户ID */
  puserId?: string | null
  /** 组织ID */
  orgId?: string | null
  /** 操作类型: 1-登录, 2-登出 */
  operationType: number
  /** 客户端ID */
  clientId: string
  /** 授权类型 */
  grantType: string
  /** 请求IP */
  ip: string
  /** 操作地点 */
  location?: string | null
  /** 浏览器 */
  browser: string
  /** 操作系统 */
  os: string
  /** 创建时间 */
  createTime: string
}

/** 通用搜索表单类型 */
export interface LogSearchForm {
  /** 动态键值对 */
  [key: string]: string | number | '' | null
}

/** 日志分页参数类型 */
export interface LogPagination {
  /** 当前页码 */
  page: number
  /** 每页条数 */
  pageSize: number
  /** 总记录数 */
  total: number
}

/** 操作类型映射（访问日志） */
export const OP_TYPE_MAP: Record<number, string> = {
  0: '其他',
  1: '查询',
  2: '新增',
  3: '修改',
  4: '删除',
  5: '导出',
  6: '导入'
}

/** 功能类型映射 */
export const FUNC_TYPE_MAP: Record<number, string> = {
  1: '登录认证',
  2: '数据操作',
  3: '流程操作'
}

/** 模块分类映射 */
export const MODULE_TYPE_MAP: Record<number, string> = {
  1: '认证模块',
  11101: '组织管理',
  11105: '巡检任务',
  11106: '巡检定位'
}

/** 状态映射（日志） */
export const STATUS_MAP: Record<number, { label: string; color: string }> = {
  1101: { label: '正常', color: '#67C23A' },
  1102: { label: '停用', color: '#F56C6C' }
}

/** 请求方式映射 */
export const REQ_METHOD_MAP: Record<string, { label: string; color: string }> = {
  'GET': { label: 'GET', color: '#67C23A' },
  'POST': { label: 'POST', color: '#409EFF' },
  'PUT': { label: 'PUT', color: '#E6A23C' },
  'DELETE': { label: 'DELETE', color: '#F56C6C' }
}

/** 响应状态码映射 */
export const REP_STATE_MAP: Record<number, { label: string; color: string }> = {
  200: { label: '200 OK', color: '#67C23A' },
  400: { label: '400 Bad Request', color: '#E6A23C' },
  404: { label: '404 Not Found', color: '#909399' },
  500: { label: '500 Server Error', color: '#F56C6C' }
}

/** 操作类型映射（登录日志） */
export const LOGIN_OPERATION_MAP: Record<number, { label: string; color: string }> = {
  1: { label: '登录', color: '#67C23A' },
  2: { label: '登出', color: '#909399' }
}
