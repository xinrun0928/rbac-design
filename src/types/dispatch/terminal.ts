/** 应急布控球平台 */
export interface ControlBall {
  id: number
  /** 平台名称 */
  platformName: string
  /** 主要负责单位 */
  responsibleUnit: string
  /** 平台作用描述 */
  description: string
  /** 主要使用单位 */
  mainUnit: string
  /** 接入状态：已接入/未接入 */
  accessStatus: '已接入' | '未接入'
  /** 接入时间 */
  accessTime: string
  /** 平台状态：正常/异常 */
  platformStatus: '正常' | '异常'
}

/** 应急指挥车 */
export interface CommandVehicle {
  id: number
  /** 应急车名称 */
  vehicleName: string
  /** 主要负责单位 */
  responsibleUnit: string
  /** 车辆说明描述 */
  description: string
  /** 主要使用单位 */
  mainUnit: string
  /** 接入状态：已接入/未接入 */
  accessStatus: '已接入' | '未接入'
  /** 接入时间 */
  accessTime: string
  /** 车辆状态：正常/异常 */
  vehicleStatus: '正常' | '异常'
}

/** 应急单兵设备 */
export interface PersonalDevice {
  id: number
  /** 单兵设备名称 */
  deviceName: string
  /** 设备编号 */
  deviceCode: string
  /** 设备类型 */
  deviceType: string
  /** 设备状态：在线/故障 */
  deviceStatus: '在线' | '故障'
  /** 所属人员 */
  owner: string
  /** 所属单位 */
  department: string
  /** 更新时间 */
  updateTime: string
}

/** 终端调度统计 */
export interface TerminalStatistics {
  /** 终端类型 */
  type: string
  /** 今日调度次数 */
  todayCount: number
  /** 近7天调度次数 */
  weekCount: number
  /** 近30天调度次数 */
  monthCount: number
  /** 今日调度时长 */
  todayDuration: string
  /** 近7天调度时长 */
  weekDuration: string
  /** 近30天调度时长 */
  monthDuration: string
  /** 平均每次时长(分钟) */
  avgDuration: number
  /** 较上周期(次数) */
  countChange: string
  /** 较上周期(时长) */
  durationChange: string
}

/** 终端调度趋势数据 */
export interface TerminalTrend {
  date: string
  controlBall: number
  commandVehicle: number
  personalDevice: number
}
