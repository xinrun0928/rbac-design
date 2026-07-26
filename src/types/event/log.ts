/** 事件管理 - 系统日志 */
export interface EventLog {
  id: number
  /** 操作人 */
  operator: string
  /** 操作时间 */
  operationTime: string
  /** 操作类型 */
  operationType: string
  /** 事件名称 */
  eventName: string
  /** 操作结果 */
  result: string
  /** 所属单位 */
  department: string
  /** 描述 */
  description: string
}
