/** 事故信息接收 - 重点关注事件 */
export interface FocusEvent {
  id: number
  /** 路段名称 */
  roadName: string
  /** 事件状态标签 */
  statusTag: string
  /** 发生时间 */
  happenTime: string
  /** 死亡人数 */
  deaths: number
  /** 受伤人数 */
  injuries: number
  /** 两客一危一重数量 */
  specialVehicles: number
  /** 中断状态 */
  interruptStatus: string
  /** 是否已读 */
  read: boolean
}

/** 事故信息接收 - 事件列表项 */
export interface ReceiveEvent {
  id: number
  /** 发生/发现时段 */
  timeSlot: string
  /** 事件名称 */
  eventName: string
  /** 更新时间 */
  updateTime: string
  /** 事件状态: 首报, 续报1, 续报2, 终报 */
  eventStatus: string
  /** 是否有告警 */
  hasAlarm: boolean
  /** 涉及路段 */
  roadSegment: string
  /** 中断/阻塞状态: 中断, 阻塞, 未涉及 */
  trafficStatus: string
  /** 死亡人数 */
  deaths: number
  /** 受伤人数 */
  injuries: number
  /** 两客一危一重 */
  specialVehicles: number
}

/** 事故信息接收 - 事件详情 */
export interface EventDetail {
  id: number
  /** 来源单位 */
  sourceUnit: string
  /** 报送时间 */
  reportTime: string
  /** 报告类型 */
  reportType: string
  /** 报告标题 */
  reportTitle: string
  /** 事故名称 */
  accidentName: string
  /** 事件来源 */
  eventSource: string
  /** 发生/发现时间 */
  happenTime: string
  /** 事件描述 */
  description: string
  /** 预计恢复时间 */
  expectedRecoveryTime: string
  /** 报送状态 */
  reportStatus: string
  /** 是否补报 */
  isSupplementary: string
  /** 事故车辆信息 */
  vehicleInfo: string
  /** 现场情况 */
  sceneInfo: string
  /** 事件性质 */
  eventNature: string
  /** 事故原因 */
  accidentCause: string
  /** 受伤人数 */
  injuries: string
  /** 受伤补充说明 */
  injuriesDetail: string
  /** 死亡人数 */
  deaths: string
  /** 死亡补充说明 */
  deathsDetail: string
  /** 事件起讫桩号 */
  stakeRange: string
  /** 事故地点 */
  accidentLocation: string
  /** 桩号 */
  stakeNumber: string
  /** 事故救援信息 */
  rescueInfo: string
  /** 救援时间 */
  rescueTime: string
  /** 救援过程 */
  rescueProcess: string
}
