/** 重点保障任务 */
export interface GuaranteeTask {
  id: number
  taskName: string
  description: string
  responsibleUnit: string
  area: string
  roadSection: string
  taskType: '疏导' | '救援' | '巡查' | '保障'
  status: '未开始' | '进行中' | '已完成'
  startTime: string
  endTime: string
  isKeyTask: boolean
  relatedEvent: string
  relatedTaskId: number | null
  contactPerson: string
  monitorPointId: number | null
  patrolInterval: number
  gridConfig: string
  facilityIds: number[]
  detectionRuleId: number | null
  updateTime: string
}

/** 重点路段及交通设施 */
export interface RoadFacility {
  id: number
  taskId: number
  taskName: string
  facilityName: string
  facilityType: '重点路段' | '交通设施'
}

/** 监控点 */
export interface MonitorPoint {
  id: number
  taskId: number
  taskName: string
  pointName: string
  roadSection: string
}

/** 保障轮巡规则 */
export interface PatrolRule {
  id: number
  taskId: number
  intervalMinutes: number
  timeRangeStart: string
  timeRangeEnd: string
  patrolMethod: '按时间间隔轮巡' | '按事件触发轮巡' | '手动轮巡'
  gridConfig: string
}

/** 事件检测规则 */
export interface EventDetectionRule {
  id: number
  taskId: number
  aiCapability: string
  boundMonitorCount: number
  eventTypes: string[]
  alarmMethods: {
    platformPopup: boolean
    smsNotification: boolean
    phoneNotification: boolean
    appPush: boolean
  }
}

/** 事件列表 */
export interface GuaranteeEvent {
  id: number
  taskId: number
  eventName: string
  reportType: '首报' | '续报'
  reportTime: string
  eventLocation: string
  eventDescription: string
  hasMedia: boolean
}

/** 详情数据 */
export interface GuaranteeDetail {
  task: GuaranteeTask
  roadFacilities: RoadFacility[]
  monitorPoints: MonitorPoint[]
  patrolRule: PatrolRule | null
  detectionRule: EventDetectionRule | null
  events: GuaranteeEvent[]
}
