/** 风险点位 */
export interface RiskPoint {
  id: number
  pointName: string
  riskType: string
  riskLevel: '高风险' | '中风险' | '低风险' | '正常'
  longitude: number
  latitude: number
  managementUnit: string
  updateTime: string
  status: '处置中' | '处理中' | '正常' | '已完成'
  description?: string
}

/** 视频监控 */
export interface VideoMonitor {
  id: number
  videoCode: string
  videoName: string
  relatedPoint: string
  status: '在线' | '离线'
}

/** 短视频 */
export interface ShortVideo {
  id: number
  title: string
  coverUrl: string
  videoUrl: string
  duration: string
}

/** 切片 */
export interface VideoSlice {
  id: number
  title: string
  coverUrl: string
  videoUrl: string
  duration: string
}

/** 风险点位统计 */
export interface RiskStatistics {
  total: number
  highRisk: number
  mediumRisk: number
  lowRisk: number
  normal: number
}

/** 专题配置监控绑定 */
export interface TopicMonitorBind {
  id: number
  pointName: string
  pointLongitude: string
  pointLatitude: string
  monitorUrl: string
}

/** 专题配置数据 */
export interface TopicConfigData {
  monitors: TopicMonitorBind[]
  shortVideos: ShortVideo[]
  slices: VideoSlice[]
  riskPoints: RiskPoint[]
}
