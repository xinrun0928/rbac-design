/** 预警处置 - 告警记录 */
export interface WarningRecord {
  id: number
  /** 告警名称（含时间、事件名、触发描述） */
  alarmName: string
  /** 发生时间 */
  occurTime: string
  /** 告警触发事件名称 */
  eventName: string
  /** 触发指标（多个用顿号分隔） */
  triggerIndicators: string
  /** 预警等级: 红色, 橙色, 黄色, 提醒 */
  warningLevel: string
  /** 通知对象类型 */
  notifyTarget: string
  /** 是否已处置 */
  disposed: boolean
}

/** 预警处置 - 筛选Tab */
export interface WarningTab {
  key: string
  label: string
  count?: number
}
