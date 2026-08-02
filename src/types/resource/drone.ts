/** 无人机设备状态 */
export type DroneDeviceStatus = '库存备用' | '任务中' | '正在维修' | '已报废'

/** 无人机设备信息 */
export interface DroneDevice {
  id: string
  /** 设备编号 */
  code: string
  /** 序列号 */
  serialNumber: string
  /** 型号名称 */
  modelName: string
  /** 生产厂家 */
  manufacturer: string
  /** 购买日期 */
  purchaseDate: string
  /** 配发部门/队伍 */
  department: string
  /** 保管责任人 */
  custodian: string
  /** 状态 */
  status: DroneDeviceStatus
  /** 保养提醒日期 */
  maintenanceReminder: string
  /** 备注 */
  remark: string
}

/** 新增/编辑表单 */
export interface DroneDeviceForm {
  code: string
  serialNumber: string
  modelName: string
  manufacturer: string
  purchaseDate: string
  department: string
  custodian: string
  status: DroneDeviceStatus
  maintenanceReminder: string
  remark: string
}

/** 搜索表单 */
export interface DroneDeviceSearchForm {
  keyword: string
}

/** 飞行状态 */
export type FlightStatus = '正在使用' | '未使用' | '异常报警'

/** 无人机实时遥测数据 */
export interface DroneTelemetry {
  /** 设备编号 */
  code: string
  /** 型号名称 */
  modelName: string
  /** 所在区域 */
  area: string
  /** 电量百分比 */
  battery: number
  /** 飞行高度(m) */
  height: number
  /** 飞行速度(m/s) */
  speed: number
  /** 信号强度(%) */
  signal: number
  /** 镜头朝向 */
  lensDirection: string
  /** 飞行状态 */
  flightStatus: FlightStatus
  /** GPS坐标(模拟) */
  lat: number
  lng: number
  /** 报警信息(可选) */
  alarmInfo?: string
}
