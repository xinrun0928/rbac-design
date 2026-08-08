/** 台风数据 */
export interface TyphoonData {
  id: number
  name: string
  windSpeed: number
  longitude: number
  latitude: number
  impactCount: number
  centerWindForce: string
  updateTime: string
  status: '发展中' | '已消散' | '已登陆'
  visible: boolean
}

/** 降雨量数据 */
export interface RainfallData {
  id: number
  area: string
  rainfall: number
  level: string
  collectTime: string
  updateTime: string
  impactCount: number
  visible: boolean
}

/** 天气预警数据 */
export interface WeatherData {
  id: number
  area: string
  warningType: string
  warningLevel: string
  publishTime: string
  updateTime: string
  impactCount: number
  visible: boolean
}

/** 风力数据 */
export interface WindData {
  id: number
  area: string
  windSpeed: number
  windLevel: string
  windRange: string
  impactCount: number
  updateTime: string
  visible: boolean
}

/** 数据接口设置 */
export interface WeatherInterface {
  id: number
  name: string
  type: string
  url: string
  version: string
  status: '启用' | '停用'
  updateTime: string
  description: string
}
