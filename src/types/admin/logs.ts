/** 系统访问日志数据类型 */
export interface SysAccessLog {
  /** 日志ID */
  id: string
  /** 操作名称 */
  name: string
  /** 请求URL */
  req_url: string
  /** 请求方法 */
  op_method: string
  /** 请求IP */
  ip: string
  /** 操作地点 */
  location: string | null
  /** 请求参数 */
  req_params: string | null
  /** 响应数据 */
  rep_data: string | null
  /** 响应时间（毫秒） */
  rep_time: string
  /** 类名 */
  class_name: string
  /** 操作结果 */
  result: string
  /** 用户ID */
  user_id: string | null
  /** 用户名 */
  user_name: string | null
  /** 组织ID */
  org_id: number
  /** 组织名称 */
  org_name: string | null
  /** 浏览器 */
  browser: string
  /** 操作系统 */
  os: string
  /** 操作类型: 0-其他, 1-查询, 2-新增, 3-修改, 4-删除, 5-导出, 6-导入 */
  op_type: number
  /** 功能类型: 1-登录认证, 2-数据操作, 3-流程操作 */
  func_type: number
  /** 模块分类: 1-认证模块, 11101-组织管理, 11105-巡检任务, 11106-巡检定位 */
  module_type: number
  /** 状态: 1101-正常, 1102-停用 */
  status: number
  /** 备注 */
  remark: string | null
  /** 签名结果 */
  sign_result: string | null
  /** 创建人 */
  creater: string | null
  /** 更新人 */
  updater: string | null
  /** 创建时间 */
  create_time: string
  /** 更新时间 */
  update_time: string
  /** 删除标记: 0-未删除, 1-已删除 */
  deleted: number
  /** 签名 */
  signature: string | null
  /** 签名版本 */
  signature_version: string
}

/** 系统短信消息日志数据类型 */
export interface SysMessageLog {
  /** 消息ID */
  message_id: string
  /** 模板ID */
  template_id: string
  /** 手机号码 */
  phone: string
  /** 消息内容 */
  content: string
  /** 请求头 */
  req_headers: string
  /** 回复内容 */
  reply_text: string
  /** 状态: 1-成功, 0-失败 */
  status: number
  /** 显示排序 */
  display_order: number
  /** 创建人 */
  creater: string
  /** 更新人 */
  updater: string
  /** 备注 */
  remark: string
  /** 签名 */
  signature: string
  /** 签名版本 */
  signature_version: string
  /** 创建时间 */
  create_time: string
}

/** 系统接口请求日志数据类型 */
export interface SysHttpLog {
  /** 日志ID */
  id: string
  /** 用户ID */
  user_id: number | null
  /** 组织ID */
  org_id: number
  /** 请求方法 */
  req_method: string
  /** 请求URL */
  req_url: string
  /** 请求头 */
  req_header: string | null
  /** 请求参数 */
  req_params: string
  /** 响应状态 */
  rep_state: string
  /** 响应数据 */
  rep_data: string
  /** 响应时间（毫秒） */
  rep_time: string
  /** 删除标记: 0-未删除, 1-已删除 */
  deleted: number
  /** 签名 */
  signature: string | null
  /** 签名版本 */
  signature_version: string
  /** 创建时间 */
  create_time: string
}

/** 系统登录日志数据类型 */
export interface SysLoginLog {
  /** 日志ID */
  log_id: string
  /** 用户名 */
  user_name: string | null
  /** 父用户ID */
  puser_id: string | null
  /** 组织ID */
  org_id: string | null
  /** 操作类型: 1-登录, 2-登出 */
  operation_type: number
  /** 客户端ID */
  client_id: string
  /** 授权类型 */
  grant_type: string
  /** 请求IP */
  ip: string
  /** 操作地点 */
  location: string | null
  /** 浏览器 */
  browser: string
  /** 操作系统 */
  os: string
  /** 签名 */
  signature: string | null
  /** 签名版本 */
  signature_version: string
  /** 创建时间 */
  create_time: string
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
