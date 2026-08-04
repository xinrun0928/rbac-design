import type { FocusEvent, ReceiveEvent, EventDetail } from '@/types/event/receive'

/** 重点关注事件 */
export const mockFocusEvents: FocusEvent[] = [
  { id: 1, roadName: '阳化高速往广州方向K717+100山体滑坡', statusTag: '终', happenTime: '2025年6月17日 10:20', deaths: 3, injuries: 0, specialVehicles: 1, interruptStatus: '中断', read: true },
  { id: 2, roadName: '广肇高速 K261+18', statusTag: '续1', happenTime: '2025年3月30日 10:20', deaths: 3, injuries: 0, specialVehicles: 1, interruptStatus: '中断', read: false },
  { id: 3, roadName: '广肇高速 K266+15', statusTag: '续2', happenTime: '2025年3月30日 10:20', deaths: 3, injuries: 0, specialVehicles: 1, interruptStatus: '中断', read: true },
  { id: 4, roadName: '广肇高速 K236+15', statusTag: '续1', happenTime: '2025年3月30日 10:20', deaths: 3, injuries: 0, specialVehicles: 1, interruptStatus: '中断', read: false },
]

/** 事件列表 */
export const mockReceiveEvents: ReceiveEvent[] = [
  { id: 1, timeSlot: '16:00-20:00', eventName: 'G4高速多车追尾事故', updateTime: '19:35', eventStatus: '续报1', hasAlarm: true, roadSegment: 'G4京港澳高速天河段K223+500', trafficStatus: '阻塞', deaths: 0, injuries: 3, specialVehicles: 1 },
  { id: 2, timeSlot: '', eventName: '南山隧道车辆起火', updateTime: '19:10', eventStatus: '终报', hasAlarm: true, roadSegment: 'S3广深沿江高速深圳段K18+200', trafficStatus: '未涉及', deaths: 1, injuries: 2, specialVehicles: 0 },
  { id: 3, timeSlot: '', eventName: '清远山区滑坡', updateTime: '18:10', eventStatus: '首报', hasAlarm: false, roadSegment: 'G78汕昆高速清远段K456+700', trafficStatus: '中断', deaths: 0, injuries: 1, specialVehicles: 2 },
  { id: 4, timeSlot: '', eventName: '佛山桥梁拥堵事件', updateTime: '16:05', eventStatus: '首报', hasAlarm: true, roadSegment: 'G15沈海高速佛山段K102+300', trafficStatus: '未涉及', deaths: 0, injuries: 0, specialVehicles: 1 },
  { id: 5, timeSlot: '12:00-16:00', eventName: '中山服务区人员聚集', updateTime: '18:30', eventStatus: '首报', hasAlarm: false, roadSegment: 'G94珠三角环线中山段K67+800', trafficStatus: '阻塞', deaths: 0, injuries: 0, specialVehicles: 0 },
  { id: 6, timeSlot: '', eventName: '港口道路货车滞留', updateTime: '19:40', eventStatus: '续报1', hasAlarm: true, roadSegment: '港口快速路 K12+600', trafficStatus: '未涉及', deaths: 0, injuries: 0, specialVehicles: 1 },
  { id: 7, timeSlot: '', eventName: '台风导致沿海封路', updateTime: '16:15', eventStatus: '终报', hasAlarm: false, roadSegment: '沿海高速 K305+100', trafficStatus: '中断', deaths: 0, injuries: 0, specialVehicles: 1 },
  { id: 8, timeSlot: '08:00-12:00', eventName: '广州高速大雾封闭', updateTime: '15:25', eventStatus: '终报', hasAlarm: true, roadSegment: 'G80广昆高速广州段K88+900', trafficStatus: '中断', deaths: 0, injuries: 1, specialVehicles: 0 },
  { id: 9, timeSlot: '', eventName: '惠州危化品泄漏', updateTime: '16:50', eventStatus: '终报', hasAlarm: false, roadSegment: 'G25长深高速惠州段K166+400', trafficStatus: '未涉及', deaths: 1, injuries: 4, specialVehicles: 0 },
  { id: 10, timeSlot: '', eventName: '高速长时间拥堵', updateTime: '17:35', eventStatus: '终报', hasAlarm: false, roadSegment: '广深高速 K59+300', trafficStatus: '阻塞', deaths: 0, injuries: 0, specialVehicles: 1 },
]

/** 事件详情 */
export const mockEventDetail: EventDetail = {
  id: 1,
  sourceUnit: '集团监控中心',
  reportTime: '2026年3月27日 17时18分',
  reportType: '续报',
  reportTitle: '07时43分接广肇监控报告事故信息',
  accidentName: 'G15沈海高速佛开段货车侧翻交通事故',
  eventSource: '高速公路路网监测系统、现场巡查人员上报',
  happenTime: '2026-08-03 08:35',
  description: 'G15沈海高速佛开段往开平方向发生一辆重型半挂货车侧翻事故，车辆横停于第二、第三车道，散落货物占用部分路面，现场无危险化学品泄漏。事故造成道路通行能力下降，后方车辆出现缓行。',
  expectedRecoveryTime: '2026-08-03 11:30',
  reportStatus: '已报送',
  isSupplementary: '否',
  vehicleInfo: '粤A·8X123重型半挂牵引车，牵引粤A·X456挂车，装载普通日用品，无危险化学品',
  sceneInfo: '事故处置中',
  eventNature: '道路交通事故',
  accidentCause: '初步判断为车辆雨天行驶速度过快，驾驶员采取避让措施时操作不当导致车辆侧翻，具体原因以交警部门调查结果为准。',
  injuries: '1人',
  injuriesDetail: '驾驶员轻微擦伤，已送往属地医院检查，暂无生命危险。',
  deaths: '0人',
  deathsDetail: '无人员死亡',
  stakeRange: 'K3145+200—K3145+800',
  accidentLocation: 'G15沈海高速佛开段',
  stakeNumber: 'K3145+500',
  rescueInfo: '交警、路政、消防、医疗及清障救援力量已到达现场开展处置。',
  rescueTime: '2026-08-03 08:52',
  rescueProcess: '08:52首批救援力量到场；09:05完成伤员转运；09:20开始清理散落货物；09:45吊车开始扶正事故车辆；预计11:30完成路面清理并恢复正常通行。'
}
