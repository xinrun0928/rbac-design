/** 重点路段配置 */
export interface RoadConfig {
  id: number
  name: string
  direction: string
  congestionLevel: string
  congestionTime: string
  congestionPoint: string
  stakeNumber: string
  company: string
}

/** 路段信息 */
export interface RoadInfo {
  id: number
  name: string
  route: string
  area: string
  manager: string
  type: string
  updateTime: string
  status: string
}

/** 收费站信息 */
export interface TollInfo {
  id: number
  name: string
  route: string
  roadSection: string
  stakeNumber: string
  area: string
  manager: string
  updateTime: string
  status: string
}

/** 服务区信息 */
export interface ServiceInfo {
  id: number
  name: string
  route: string
  roadSection: string
  stakeNumber: string
  area: string
  manager: string
  status: string
}

/** 桥梁信息 */
export interface BridgeInfo {
  id: number
  name: string
  route: string
  roadSection: string
  area: string
  manager: string
  type: string
  status: string
}

/** 隧道信息 */
export interface TunnelInfo {
  id: number
  name: string
  route: string
  roadSection: string
  area: string
  manager: string
  type: string
  status: string
}
