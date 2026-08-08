import type { RiskPoint, VideoMonitor, ShortVideo, VideoSlice, RiskStatistics, TopicConfigData } from '@/types/dispatch/topic'

// 航道风险点位数据
export const channelRiskPoints: RiskPoint[] = [
  { id: 1, pointName: '珠江K120淤积点', riskType: '淤积', riskLevel: '高风险', longitude: 113.62123, latitude: 22.75431, managementUnit: '广州航道局', updateTime: '2024-06-19 10:20', status: '处置中', description: '该处存在淤积，影响通航安全' },
  { id: 2, pointName: '珠江K135碰撞风险点', riskType: '碰撞风险', riskLevel: '中风险', longitude: 113.55218, latitude: 22.68642, managementUnit: '南沙航道管理处', updateTime: '2024-06-18 16:35', status: '正常' },
  { id: 3, pointName: '虎门水道K5浅滩点', riskType: '浅滩', riskLevel: '中风险', longitude: 113.74011, latitude: 22.81642, managementUnit: '东莞航道事务中心', updateTime: '2024-06-18 08:15', status: '处置中' },
  { id: 4, pointName: '蕉门水道桥梁桥墩安全点', riskType: '桥梁安全', riskLevel: '低风险', longitude: 113.62455, latitude: 22.89921, managementUnit: '广州航道局', updateTime: '2024-06-17 14:22', status: '正常' },
  { id: 5, pointName: '洪奇沥水道障碍物点', riskType: '障碍物', riskLevel: '中风险', longitude: 113.48212, latitude: 22.65881, managementUnit: '佛山航道所', updateTime: '2024-06-16 11:40', status: '处置中' },
  { id: 6, pointName: '南沙港航道交汇点', riskType: '交汇风险', riskLevel: '高风险', longitude: 113.58234, latitude: 22.79123, managementUnit: '广州航道局', updateTime: '2024-06-15 09:30', status: '处置中', description: '多航道交汇，船舶密度大' },
  { id: 7, pointName: '莲花山水道弯道', riskType: '弯道风险', riskLevel: '低风险', longitude: 113.52345, latitude: 22.71234, managementUnit: '番禺航道所', updateTime: '2024-06-14 15:20', status: '正常' },
  { id: 8, pointName: '黄埔水道桥区', riskType: '桥区安全', riskLevel: '中风险', longitude: 113.45678, latitude: 23.09876, managementUnit: '黄埔航道所', updateTime: '2024-06-13 10:45', status: '处理中' },
]

// 海峡办风险点位数据
export const straitRiskPoints: RiskPoint[] = [
  { id: 1, pointName: '厦金航道交汇处风险点', riskType: '碰撞风险', riskLevel: '高风险', longitude: 118.14862, latitude: 24.436813, managementUnit: '厦门海事局', updateTime: '2024-06-20 10:20', status: '正常', description: '船舶交汇密集，存在碰撞风险' },
  { id: 2, pointName: '东山湾浅滩风险点', riskType: '浅滩风险', riskLevel: '中风险', longitude: 117.485213, latitude: 23.723615, managementUnit: '漳州海事局', updateTime: '2024-06-20 09:15', status: '处理中' },
  { id: 3, pointName: '湄洲湾峡口航道风险点', riskType: '航道碍航', riskLevel: '中风险', longitude: 119.134752, latitude: 25.238751, managementUnit: '莆田海事局', updateTime: '2024-06-19 16:30', status: '正常' },
  { id: 4, pointName: '平潭东侧锚地风险点', riskType: '锚泊风险', riskLevel: '低风险', longitude: 119.856241, latitude: 25.521362, managementUnit: '平潭海事处', updateTime: '2024-06-19 14:10', status: '正常' },
  { id: 5, pointName: '泉州围头湾口风险点', riskType: '碰撞风险', riskLevel: '中风险', longitude: 118.607853, latitude: 24.857412, managementUnit: '泉州海事局', updateTime: '2024-06-19 11:05', status: '处理中' },
  { id: 6, pointName: '小金门航道风险点', riskType: '航道风险', riskLevel: '高风险', longitude: 118.25678, latitude: 24.45678, managementUnit: '厦门海事局', updateTime: '2024-06-18 14:30', status: '处置中', description: '航道狭窄，船舶往来频繁' },
  { id: 7, pointName: '大嶝岛北侧风险点', riskType: '礁石风险', riskLevel: '低风险', longitude: 118.31234, latitude: 24.56789, managementUnit: '厦门海事局', updateTime: '2024-06-17 16:45', status: '正常' },
  { id: 8, pointName: '崇武海域风险点', riskType: '渔区风险', riskLevel: '中风险', longitude: 118.92345, latitude: 24.81234, managementUnit: '泉州海事局', updateTime: '2024-06-16 09:20', status: '处理中' },
]

// 航道视频监控
export const channelVideoMonitors: VideoMonitor[] = [
  { id: 1, videoCode: 'CAM-001', videoName: '珠江K120在线摄像头', relatedPoint: '珠江K120淤积点', status: '在线' },
  { id: 2, videoCode: 'CAM-002', videoName: '珠江K120上游摄像头', relatedPoint: '珠江K120淤积点', status: '在线' },
  { id: 3, videoCode: 'CAM-003', videoName: '珠江K120下游摄像头', relatedPoint: '珠江K120淤积点', status: '在线' },
  { id: 4, videoCode: 'CAM-004', videoName: '南沙大桥摄像头', relatedPoint: '珠江K135碰撞风险点', status: '离线' },
  { id: 5, videoCode: 'CAM-005', videoName: '虎门水道K5摄像头', relatedPoint: '虎门水道K5浅滩点', status: '在线' },
]

// 海峡办视频监控
export const straitVideoMonitors: VideoMonitor[] = [
  { id: 1, videoCode: 'XM-001', videoName: '厦金航道交汇处1号', relatedPoint: '厦金航道交汇处风险点', status: '在线' },
  { id: 2, videoCode: 'XM-002', videoName: '厦金航道交汇处2号', relatedPoint: '厦金航道交汇处风险点', status: '在线' },
  { id: 3, videoCode: 'XM-003', videoName: '厦金航道交汇处3号', relatedPoint: '厦金航道交汇处风险点', status: '在线' },
  { id: 4, videoCode: 'XM-004', videoName: '厦金航道交汇处4号', relatedPoint: '厦金航道交汇处风险点', status: '离线' },
  { id: 5, videoCode: 'XM-005', videoName: '小金门航道监控', relatedPoint: '小金门航道风险点', status: '在线' },
  { id: 6, videoCode: 'XM-006', videoName: '大嶝岛北侧监控', relatedPoint: '大嶝岛北侧风险点', status: '在线' },
]

// 短视频数据
export const shortVideoData: ShortVideo[] = [
  { id: 1, title: '航道巡查记录', coverUrl: '/images/video-cover-1.jpg', videoUrl: '/videos/video-1.mp4', duration: '0:15' },
  { id: 2, title: '风险点监测', coverUrl: '/images/video-cover-2.jpg', videoUrl: '/videos/video-2.mp4', duration: '0:32' },
  { id: 3, title: '应急演练', coverUrl: '/images/video-cover-3.jpg', videoUrl: '/videos/video-3.mp4', duration: '1:05' },
]

// 切片数据
export const sliceData: VideoSlice[] = [
  { id: 1, title: 'G4高速发生交通事故', coverUrl: '/images/slice-1.jpg', videoUrl: '/videos/slice-1.mp4', duration: '0:45' },
  { id: 2, title: '强降雨预警', coverUrl: '/images/slice-2.jpg', videoUrl: '/videos/slice-2.mp4', duration: '0:28' },
  { id: 3, title: '山体滑坡风险', coverUrl: '/images/slice-3.jpg', videoUrl: '/videos/slice-3.mp4', duration: '0:52' },
]

// 航道统计
export const channelStatistics: RiskStatistics = {
  total: 28,
  highRisk: 5,
  mediumRisk: 12,
  lowRisk: 6,
  normal: 5
}

// 海峡办统计
export const straitStatistics: RiskStatistics = {
  total: 28,
  highRisk: 6,
  mediumRisk: 12,
  lowRisk: 5,
  normal: 5
}

// 专题配置数据
export const topicConfigData: TopicConfigData = {
  monitors: [
    { id: 1, pointName: 'G4高速发生交通事故，请绕行', pointLongitude: '113.62123', pointLatitude: '22.75431', monitorUrl: '/images/monitor-1.jpg' },
    { id: 2, pointName: '强降雨预警，请做好防范', pointLongitude: '113.55218', pointLatitude: '22.68642', monitorUrl: '/images/monitor-2.jpg' },
    { id: 3, pointName: '山体滑坡风险，请立即巡查', pointLongitude: '113.74011', pointLatitude: '22.81642', monitorUrl: '/images/monitor-3.jpg' },
    { id: 4, pointName: '危化品泄漏，请启动预案', pointLongitude: '113.62455', pointLatitude: '22.89921', monitorUrl: '/images/monitor-4.jpg' },
  ],
  shortVideos: [
    { id: 1, title: '道路监控1', coverUrl: '/images/video-1.jpg', videoUrl: '/videos/video-1.mp4', duration: '0:15' },
    { id: 2, title: '道路监控2', coverUrl: '/images/video-2.jpg', videoUrl: '/videos/video-2.mp4', duration: '0:20' },
  ],
  slices: [
    { id: 1, title: '交通事件1', coverUrl: '/images/slice-1.jpg', videoUrl: '/videos/slice-1.mp4', duration: '0:30' },
    { id: 2, title: '交通事件2', coverUrl: '/images/slice-2.jpg', videoUrl: '/videos/slice-2.mp4', duration: '0:25' },
  ],
  riskPoints: [
    { id: 1, pointName: 'G4高速发生交通事故，请绕行', riskType: '交通事故', riskLevel: '高风险', longitude: 113.62123, latitude: 22.75431, managementUnit: '广州交通局', updateTime: '2024-06-20 10:20', status: '处置中' },
    { id: 2, pointName: '强降雨预警，请做好防范', riskType: '气象预警', riskLevel: '中风险', longitude: 113.55218, latitude: 22.68642, managementUnit: '气象局', updateTime: '2024-06-20 09:15', status: '处理中' },
    { id: 3, pointName: '山体滑坡风险，请立即巡查', riskType: '地质灾害', riskLevel: '高风险', longitude: 113.74011, latitude: 22.81642, managementUnit: '地质局', updateTime: '2024-06-19 16:30', status: '处置中' },
  ]
}
