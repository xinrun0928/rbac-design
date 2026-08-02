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

/** 航点 */
export interface DroneWaypoint {
  name: string
  description: string
}

/** 无人机飞行详情（抽屉展示） */
export interface DroneFlightDetail {
  /** 型号名称 */
  modelName: string
  /** 设备编号 */
  code: string
  /** 无人机编号 */
  droneCode: string
  /** 生产厂家 */
  manufacturer: string
  /** 所属部门/队伍 */
  department: string
  /** 保管责任人 */
  custodian: string
  /** 使用状态 */
  usageStatus: string
  /** 当前区域 */
  area: string
  /** 任务航线 */
  route: string
  /** 起飞时间 */
  takeoffTime: string
  /** 已飞行时间 */
  flightDuration: string
  /** 镜头朝向 */
  lensDirection: string
  /** 异常状态 */
  abnormalStatus: string
  /** 经度 */
  lng: number
  /** 纬度 */
  lat: number
  /** 飞行高度 */
  height: number
  /** 飞行速度 */
  speed: number
  /** 电量 */
  battery: number
  /** 信号 */
  signal: number
  /** 航点列表 */
  waypoints: DroneWaypoint[]
  /** 资产状态 */
  assetStatus: string
  /** 最近保养 */
  lastMaintenance: string
  /** 下次保养 */
  nextMaintenance: string
  /** 电池循环 */
  batteryCycles: number
  /** 载荷设备 */
  payload: string
  /** 电子围栏 */
  geoFence: string
  /** 实时视频 */
  realtimeVideo: string
  /** 照片回传 */
  photoReturn: string
  /** 飞行日志 */
  flightLog: string
  /** 存储策略 */
  storagePolicy: string
  /** 上报状态 */
  reportStatus: string
}
