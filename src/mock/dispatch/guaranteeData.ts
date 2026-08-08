import type { GuaranteeTask, RoadFacility, MonitorPoint, PatrolRule, EventDetectionRule, GuaranteeEvent } from '@/types/dispatch/guarantee'

export const guaranteeTaskData: GuaranteeTask[] = [
  { id: 1, taskName: '亚运会重点路段保障', description: '高速事故现场交通疏导与救援保障', responsibleUnit: '广州交通局', area: '广州市', roadSection: '广园快速路', taskType: '保障', status: '已完成', startTime: '2026-04-01 08:00:00', endTime: '2026-04-01 18:00:00', isKeyTask: true, relatedEvent: '亚运会交通保障', relatedTaskId: null, contactPerson: '张伟', monitorPointId: 1, patrolInterval: 5, gridConfig: '九宫格', facilityIds: [1, 2], detectionRuleId: 1, updateTime: '2026-04-01 08:50' },
  { id: 2, taskName: '南山隧道应急保障任务', description: '隧道积水排险与交通引导', responsibleUnit: '深圳交通局', area: '深圳市', roadSection: '南山隧道', taskType: '救援', status: '已完成', startTime: '2026-04-01 09:00:00', endTime: '2026-04-01 17:00:00', isKeyTask: true, relatedEvent: '隧道积水事故', relatedTaskId: null, contactPerson: '李强', monitorPointId: 2, patrolInterval: 3, gridConfig: '九宫格', facilityIds: [1], detectionRuleId: 2, updateTime: '2026-04-01 08:55' },
  { id: 3, taskName: '清远滑坡处置保障任务', description: '山体滑坡风险监测与清理', responsibleUnit: '清远交通局', area: '清远市', roadSection: '清连高速', taskType: '巡查', status: '已完成', startTime: '2026-04-01 07:30:00', endTime: '2026-04-01 19:00:00', isKeyTask: false, relatedEvent: '山体滑坡风险', relatedTaskId: null, contactPerson: '王芳', monitorPointId: 3, patrolInterval: 10, gridConfig: '四宫格', facilityIds: [1, 3], detectionRuleId: 3, updateTime: '2026-04-01 09:00' },
  { id: 4, taskName: '佛山桥梁安全保障任务', description: '桥梁结构安全检查与限流', responsibleUnit: '佛山交通局', area: '佛山市', roadSection: '佛山大桥', taskType: '保障', status: '已完成', startTime: '2026-04-01 08:30:00', endTime: '2026-04-01 16:30:00', isKeyTask: false, relatedEvent: '', relatedTaskId: null, contactPerson: '刘洋', monitorPointId: null, patrolInterval: 15, gridConfig: '四宫格', facilityIds: [2], detectionRuleId: null, updateTime: '2026-04-01 09:05' },
  { id: 5, taskName: '中山服务区保障任务', description: '高峰客流疏导与秩序维护', responsibleUnit: '中山交通局', area: '中山市', roadSection: '中江高速', taskType: '疏导', status: '已完成', startTime: '2026-04-01 06:00:00', endTime: '2026-04-01 22:00:00', isKeyTask: false, relatedEvent: '', relatedTaskId: null, contactPerson: '陈静', monitorPointId: null, patrolInterval: 5, gridConfig: '十六宫格', facilityIds: [1, 2, 3], detectionRuleId: 4, updateTime: '2026-04-01 09:10' },
  { id: 6, taskName: '惠州边坡巡查保障任务', description: '边坡稳定性巡查与风险排查', responsibleUnit: '惠州交通局', area: '惠州市', roadSection: '惠盐高速', taskType: '巡查', status: '已完成', startTime: '2026-04-01 07:00:00', endTime: '2026-04-01 18:00:00', isKeyTask: false, relatedEvent: '', relatedTaskId: null, contactPerson: '赵明', monitorPointId: null, patrolInterval: 20, gridConfig: '四宫格', facilityIds: [1], detectionRuleId: null, updateTime: '2026-04-01 09:15' },
  { id: 7, taskName: '韶关落石防护任务', description: '落石区域封控与清理', responsibleUnit: '韶关交通局', area: '韶关市', roadSection: '京珠高速', taskType: '救援', status: '已完成', startTime: '2026-04-01 08:00:00', endTime: '2026-04-01 15:00:00', isKeyTask: false, relatedEvent: '落石事故', relatedTaskId: null, contactPerson: '周杰', monitorPointId: null, patrolInterval: 10, gridConfig: '九宫格', facilityIds: [1, 3], detectionRuleId: 2, updateTime: '2026-04-01 09:20' },
  { id: 8, taskName: '珠海客运站保障任务', description: '客流高峰秩序维护与引导', responsibleUnit: '珠海交通局', area: '珠海市', roadSection: '珠海大道', taskType: '疏导', status: '已完成', startTime: '2026-04-01 06:00:00', endTime: '2026-04-01 23:00:00', isKeyTask: false, relatedEvent: '', relatedTaskId: null, contactPerson: '吴磊', monitorPointId: null, patrolInterval: 5, gridConfig: '十六宫格', facilityIds: [1, 2], detectionRuleId: null, updateTime: '2026-04-01 09:25' },
  { id: 9, taskName: '港口通道保障任务', description: '港口货车通行调度保障', responsibleUnit: '港口管理单位', area: '深圳市', roadSection: '港口通道', taskType: '保障', status: '已完成', startTime: '2026-04-01 00:00:00', endTime: '2026-04-01 23:59:00', isKeyTask: true, relatedEvent: '', relatedTaskId: null, contactPerson: '郑涛', monitorPointId: 1, patrolInterval: 3, gridConfig: '九宫格', facilityIds: [1, 2, 3], detectionRuleId: 1, updateTime: '2026-04-01 09:30' },
  { id: 10, taskName: '高速匝道疏导保障任务', description: '匝道拥堵疏导与交通管制', responsibleUnit: '广州交通局', area: '广州市', roadSection: '广氮立交', taskType: '疏导', status: '已完成', startTime: '2026-04-01 07:00:00', endTime: '2026-04-01 19:00:00', isKeyTask: false, relatedEvent: '', relatedTaskId: null, contactPerson: '张伟', monitorPointId: 2, patrolInterval: 5, gridConfig: '九宫格', facilityIds: [1, 2], detectionRuleId: 4, updateTime: '2026-04-01 09:35' },
  { id: 11, taskName: '东莞收费站保障任务', description: '收费站通行秩序维护', responsibleUnit: '东莞交通局', area: '东莞市', roadSection: '莞深高速', taskType: '保障', status: '进行中', startTime: '2026-04-01 06:00:00', endTime: '2026-04-01 22:00:00', isKeyTask: false, relatedEvent: '', relatedTaskId: null, contactPerson: '李强', monitorPointId: null, patrolInterval: 10, gridConfig: '四宫格', facilityIds: [1], detectionRuleId: null, updateTime: '2026-04-01 09:40' },
  { id: 12, taskName: '湛江港口应急保障', description: '港口船舶调度与应急响应', responsibleUnit: '湛江交通局', area: '湛江市', roadSection: '湛江港', taskType: '救援', status: '进行中', startTime: '2026-04-01 00:00:00', endTime: '2026-04-01 23:59:00', isKeyTask: true, relatedEvent: '船舶事故', relatedTaskId: null, contactPerson: '王芳', monitorPointId: 3, patrolInterval: 2, gridConfig: '九宫格', facilityIds: [1, 2, 3], detectionRuleId: 2, updateTime: '2026-04-01 09:45' },
  { id: 13, taskName: '肇庆桥梁检修任务', description: '桥梁定期检修与安全评估', responsibleUnit: '肇庆交通局', area: '肇庆市', roadSection: '西江大桥', taskType: '巡查', status: '未开始', startTime: '2026-04-02 08:00:00', endTime: '2026-04-02 18:00:00', isKeyTask: false, relatedEvent: '', relatedTaskId: null, contactPerson: '刘洋', monitorPointId: null, patrolInterval: 30, gridConfig: '四宫格', facilityIds: [2], detectionRuleId: null, updateTime: '2026-04-01 09:50' },
  { id: 14, taskName: '江门隧道通风检测', description: '隧道通风系统检测与维护', responsibleUnit: '江门交通局', area: '江门市', roadSection: '江门隧道', taskType: '巡查', status: '未开始', startTime: '2026-04-02 09:00:00', endTime: '2026-04-02 17:00:00', isKeyTask: false, relatedEvent: '', relatedTaskId: null, contactPerson: '陈静', monitorPointId: null, patrolInterval: 60, gridConfig: '四宫格', facilityIds: [], detectionRuleId: null, updateTime: '2026-04-01 09:55' },
  { id: 15, taskName: '茂名高速养护保障', description: '高速公路日常养护与应急抢修', responsibleUnit: '茂名交通局', area: '茂名市', roadSection: '沈海高速', taskType: '保障', status: '未开始', startTime: '2026-04-03 07:00:00', endTime: '2026-04-03 19:00:00', isKeyTask: false, relatedEvent: '', relatedTaskId: null, contactPerson: '赵明', monitorPointId: null, patrolInterval: 15, gridConfig: '九宫格', facilityIds: [1, 3], detectionRuleId: null, updateTime: '2026-04-01 10:00' },
]

// 重点路段及交通设施数据
export const roadFacilityData: RoadFacility[] = [
  { id: 1, taskId: 1, taskName: '春运保障任务', facilityName: '广园快速路（黄村立交-科韵路段）', facilityType: '重点路段' },
  { id: 2, taskId: 1, taskName: '春运保障任务', facilityName: '广佛高速（谢边立交-横沙路段）', facilityType: '重点路段' },
  { id: 3, taskId: 1, taskName: '春运保障任务', facilityName: '天河大桥', facilityType: '交通设施' },
  { id: 4, taskId: 1, taskName: '春运保障任务', facilityName: '黄埔立交监测设施', facilityType: '交通设施' },
]

// 监控点数据
export const monitorPointData: MonitorPoint[] = [
  { id: 1, taskId: 1, taskName: '春运保障任务', pointName: '广园快速科韵路口监控点', roadSection: '广园快速路' },
  { id: 2, taskId: 1, taskName: '春运保障任务', pointName: '天河大桥南侧监控点', roadSection: '天河大桥' },
  { id: 3, taskId: 1, taskName: '春运保障任务', pointName: '黄埔立交东侧监控点', roadSection: '黄埔立交' },
  { id: 4, taskId: 1, taskName: '春运保障任务', pointName: '广佛高速谢边监控点', roadSection: '广佛高速' },
]

// 保障轮巡规则
export const patrolRuleData: PatrolRule = {
  id: 1,
  taskId: 1,
  intervalMinutes: 60,
  timeRangeStart: '00:00',
  timeRangeEnd: '23:59',
  patrolMethod: '按时间间隔轮巡',
  gridConfig: '3x3（九宫格）'
}

// 事件检测规则
export const eventDetectionRuleData: EventDetectionRule = {
  id: 1,
  taskId: 1,
  aiCapability: '接入第三方AI监测平台',
  boundMonitorCount: 4,
  eventTypes: ['车辆拥堵', '异常停车', '交通事故', '道路抛洒物'],
  alarmMethods: {
    platformPopup: true,
    smsNotification: true,
    phoneNotification: true,
    appPush: true
  }
}

// 事件列表数据
export const guaranteeEventData: GuaranteeEvent[] = [
  { id: 1, taskId: 1, eventName: '广肇高速K39+1500事故', reportType: '首报', reportTime: '2026年3月27日05时25分', eventLocation: '广肇高速往广州方向K39+500（莲塘站至白土站，属肇庆高要区）', eventDescription: '货车爆胎，占用右侧车道，已设置警示标志', hasMedia: true },
  { id: 2, taskId: 1, eventName: '西二高速K32+650事故', reportType: '续报', reportTime: '2026年3月14日18时47分', eventLocation: '深圳外环高速光明段，属光明区', eventDescription: '多车连环追尾，占用全部车道，交通中断', hasMedia: false },
  { id: 3, taskId: 1, eventName: '中江高速K439+250事故', reportType: '续报', reportTime: '2026年3月14日09时05分', eventLocation: '深圳外环高速沙井段，属宝安区', eventDescription: '小车撞护栏，占用应急车道', hasMedia: true },
  { id: 4, taskId: 1, eventName: '江罗高速K639+150事故', reportType: '首报', reportTime: '2026年3月13日14时32分', eventLocation: '深圳外环高速坪地段，属龙岗区', eventDescription: '货车侧翻，占用右侧车道，无人员伤亡', hasMedia: false },
  { id: 5, taskId: 1, eventName: '高恩高速K829+500事故', reportType: '续报', reportTime: '2026年3月13日08时15分', eventLocation: '深圳外环高速行仁收费站附近，属龙岗区', eventDescription: '两车追尾，占用中间车道，交通缓行', hasMedia: true },
  { id: 6, taskId: 1, eventName: '西二高速K139+50事故', reportType: '首报', reportTime: '2026年3月12日10时07分', eventLocation: '深圳外环高速东行低碳城出，属地深圳市龙岗区', eventDescription: '上述路段发生货车轮胎冒烟，占用匝道内右侧车道；因无监控镜头，事发时间暂未...', hasMedia: false },
]

// 获取任务详情数据
export const getGuaranteeDetail = (taskId: number) => {
  const task = guaranteeTaskData.find(t => t.id === taskId)
  if (!task) return null

  return {
    task,
    roadFacilities: roadFacilityData.filter(f => f.taskId === taskId || taskId === 1),
    monitorPoints: monitorPointData.filter(p => p.taskId === taskId || taskId === 1),
    patrolRule: taskId <= 2 ? patrolRuleData : null,
    detectionRule: taskId <= 2 ? eventDetectionRuleData : null,
    events: guaranteeEventData.filter(e => e.taskId === taskId || taskId === 1)
  }
}
