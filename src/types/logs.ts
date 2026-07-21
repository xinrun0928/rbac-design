/** 系统访问日志 */
export interface SysAccessLog {
  id: string
  name: string
  req_url: string
  op_method: string
  ip: string
  location: string | null
  req_params: string | null
  rep_data: string | null
  rep_time: string
  class_name: string
  result: string
  user_id: string | null
  user_name: string | null
  org_id: number
  org_name: string | null
  browser: string
  os: string
  op_type: number
  func_type: number
  module_type: number
  status: number
  remark: string | null
  sign_result: string | null
  creater: string | null
  updater: string | null
  create_time: string
  update_time: string
  deleted: number
  signature: string | null
  signature_version: string
}

/** 系统短信消息日志 */
export interface SysMessageLog {
  message_id: string
  template_id: string
  phone: string
  content: string
  req_headers: string
  reply_text: string
  status: number
  display_order: number
  creater: string
  updater: string
  remark: string
  signature: string
  signature_version: string
  create_time: string
}

/** 系统接口请求日志 */
export interface SysHttpLog {
  id: string
  user_id: number | null
  org_id: number
  req_method: string
  req_url: string
  req_header: string | null
  req_params: string
  rep_state: string
  rep_data: string
  rep_time: string
  deleted: number
  signature: string | null
  signature_version: string
  create_time: string
}

/** 系统登录日志 */
export interface SysLoginLog {
  log_id: string
  user_name: string | null
  puser_id: string | null
  org_id: string | null
  operation_type: number
  client_id: string
  grant_type: string
  ip: string
  location: string | null
  browser: string
  os: string
  signature: string | null
  signature_version: string
  create_time: string
}

/** 通用搜索表单 */
export interface LogSearchForm {
  [key: string]: string | number | '' | null
}

/** 分页参数 */
export interface LogPagination {
  page: number
  pageSize: number
  total: number
}

/** 操作类型映射 */
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

/** 状态映射 */
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
