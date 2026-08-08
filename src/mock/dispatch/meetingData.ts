import type { Meeting, VehicleTrack } from '@/types/dispatch/meeting'

/** 会议列表数据 */
export const meetingData: Meeting[] = [
  {
    id: 1, topic: 'G4高速事故紧急会商', type: '应急指挥', initiator: '陈志远', department: '广州市交通运输局',
    startTime: '2026-04-01 08:50', status: '进行中', participants: '广州交警、广深高速公司',
    host: '陈志远', attendeeList: '陈志远、黄俊杰、郑凯文', endTime: '2026-04-01 09:20:00',
    duration: '00:30:00', meetingNo: 'MEET20260401001', platform: '应急指挥平台',
    meetingUrl: 'https://meeting.example.com/123', meetingPassword: '123456',
    isRecording: '是', recordingUrl: 'http://example.com/video1.mp4',
    screenShare: '支持', muteControl: '支持',
    meetingSummary: '明确各单位职责分工', decision: '30分钟内恢复通行',
    dispatchCommand: '封闭事故路段并分流', relatedEvent: 'G4高速连环追尾事故',
    relatedPlan: '交通事故应急预案', attendeeCount: 12, onlinePeak: 10,
    exceptionRecord: '无', createTime: '2026-04-01 08:45:00', updateTime: '2026-04-01 09:20:00',
    minutesContent: `G4高速事故紧急会商会议纪要

一、会议基本信息
会议主题：G4高速事故紧急会商
会议类型：应急指挥
会议编号：MEET20260401001
会议时间：2026年04月01日 08:50—09:20（30分钟）
会议地点：应急指挥平台（线上会议）
主持人：陈志远
发起单位：广州市交通运输局

二、参会情况
参会人员：陈志远、黄俊杰、郑凯文等共12人
参会单位：广州交警、广深高速公司
在线人数峰值：10人

三、会议背景
本次会议针对"G4高速连环追尾事故"开展紧急会商，旨在快速研判事故态势，明确各单位职责，制定应急处置措施，尽快恢复道路通行能力。

四、会议主要内容
事故情况通报
G4高速发生多车连环追尾事故，已造成交通严重拥堵
部分路段通行中断，存在次生事故风险

应急处置研判
广州交警汇报现场交通管控情况
高速公司反馈道路设施及清障资源情况
初步判断事故影响范围及预计恢复时间

职责分工明确
交警部门：负责现场交通管制、事故勘查与车辆分流
高速公司：负责清障救援、设施恢复及信息发布
指挥中心：统一调度资源，协调各方联动

技术与平台支撑
利用应急指挥平台进行实时调度与视频会商
启用屏幕共享进行事故现场信息同步

五、决策结论
明确要求：30分钟内恢复事故路段基本通行能力
启动交通事故应急预案，按既定流程执行

六、调度指令
立即封闭事故核心路段
启动周边道路分流机制
加快清障作业，优先恢复主干车道
实时发布交通引导信息

七、会议纪要要点
各单位职责清晰，分工明确
应急响应机制快速启动
多部门协同处置效率较高

八、其他事项
会议全程录制（录制地址：http://example.com/video1.mp4）
会议过程无异常情况

九、会议结论总结
本次会商反应迅速、组织有序，通过多方协同和统一调度，有效推动事故处置进程，为快速恢复交通提供了保障。后续需对本次事件进行复盘，总结经验，优化应急响应机制。`
  },
  {
    id: 2, topic: '强降雨防御部署会议', type: '预警会商', initiator: '林浩然', department: '深圳市交通运输局',
    startTime: '2026-04-02 07:30', status: '已结束', participants: '气象局、交通局',
    host: '林浩然', attendeeList: '林浩然、张伟、李明', endTime: '2026-04-02 08:30:00',
    duration: '01:00:00', meetingNo: 'MEET20260402001', platform: '应急指挥平台',
    meetingUrl: 'https://meeting.example.com/124', meetingPassword: '234567',
    isRecording: '是', recordingUrl: 'http://example.com/video2.mp4',
    screenShare: '支持', muteControl: '支持',
    meetingSummary: '部署强降雨防御措施', decision: '启动二级响应',
    dispatchCommand: '加强巡查排险', relatedEvent: '强降雨天气预警',
    relatedPlan: '防汛应急预案', attendeeCount: 15, onlinePeak: 12,
    exceptionRecord: '无', createTime: '2026-04-02 07:00:00', updateTime: '2026-04-02 08:30:00',
    minutesContent: '会议纪要内容...'
  },
  {
    id: 3, topic: '山体滑坡风险研判会议', type: '风险研判', initiator: '黄俊杰', department: '清远交通局',
    startTime: '2026-04-02 14:30', status: '已结束', participants: '应急局、专家组',
    host: '黄俊杰', attendeeList: '黄俊杰、赵磊、周杰', endTime: '2026-04-02 15:30:00',
    duration: '01:00:00', meetingNo: 'MEET20260402002', platform: '应急指挥平台',
    meetingUrl: 'https://meeting.example.com/125', meetingPassword: '345678',
    isRecording: '是', recordingUrl: 'http://example.com/video3.mp4',
    screenShare: '支持', muteControl: '支持',
    meetingSummary: '研判滑坡风险等级', decision: '发布黄色预警',
    dispatchCommand: '转移危险区域人员', relatedEvent: '清远山区滑坡风险',
    relatedPlan: '地质灾害应急预案', attendeeCount: 10, onlinePeak: 8,
    exceptionRecord: '无', createTime: '2026-04-02 14:00:00', updateTime: '2026-04-02 15:30:00',
    minutesContent: '会议纪要内容...'
  },
  {
    id: 4, topic: '危化品事故处置会议', type: '应急指挥', initiator: '梁嘉豪', department: '广东省交通运输厅',
    startTime: '2026-04-03 22:40', status: '已结束', participants: '消防、环保部门',
    host: '梁嘉豪', attendeeList: '梁嘉豪、许文博、郑凯文', endTime: '2026-04-03 23:40:00',
    duration: '01:00:00', meetingNo: 'MEET20260403001', platform: '应急指挥平台',
    meetingUrl: 'https://meeting.example.com/126', meetingPassword: '456789',
    isRecording: '是', recordingUrl: 'http://example.com/video4.mp4',
    screenShare: '支持', muteControl: '支持',
    meetingSummary: '部署危化品事故处置方案', decision: '启动一级响应',
    dispatchCommand: '疏散周边居民', relatedEvent: '危化品运输车泄漏事故',
    relatedPlan: '危化品事故应急预案', attendeeCount: 20, onlinePeak: 18,
    exceptionRecord: '无', createTime: '2026-04-03 22:30:00', updateTime: '2026-04-03 23:40:00',
    minutesContent: '会议纪要内容...'
  },
  {
    id: 5, topic: '隧道积水调度会议', type: '调度会商', initiator: '许文博', department: '深圳交通局',
    startTime: '2026-04-05 18:00', status: '已结束', participants: '运维单位、交警',
    host: '许文博', attendeeList: '许文博、周子轩、罗景天', endTime: '2026-04-05 19:00:00',
    duration: '01:00:00', meetingNo: 'MEET20260405001', platform: '应急指挥平台',
    meetingUrl: 'https://meeting.example.com/127', meetingPassword: '567890',
    isRecording: '是', recordingUrl: 'http://example.com/video5.mp4',
    screenShare: '支持', muteControl: '支持',
    meetingSummary: '调度隧道排水作业', decision: '封闭隧道进行排水',
    dispatchCommand: '调派排水设备', relatedEvent: '南山隧道积水事件',
    relatedPlan: '隧道事故应急预案', attendeeCount: 8, onlinePeak: 6,
    exceptionRecord: '无', createTime: '2026-04-05 17:50:00', updateTime: '2026-04-05 19:00:00',
    minutesContent: '会议纪要内容...'
  },
  {
    id: 6, topic: '高速拥堵疏导会议', type: '调度会商', initiator: '郑凯文', department: '惠州交通局',
    startTime: '2026-04-06 10:35', status: '已结束', participants: '路政、交警',
    host: '郑凯文', attendeeList: '郑凯文、邓泽宇、何宇航', endTime: '2026-04-06 11:35:00',
    duration: '01:00:00', meetingNo: 'MEET20260406001', platform: '应急指挥平台',
    meetingUrl: 'https://meeting.example.com/128', meetingPassword: '678901',
    isRecording: '是', recordingUrl: 'http://example.com/video6.mp4',
    screenShare: '支持', muteControl: '支持',
    meetingSummary: '部署拥堵疏导方案', decision: '启用备用路线',
    dispatchCommand: '增派路政人员', relatedEvent: 'G25高速拥堵事件',
    relatedPlan: '交通疏导应急预案', attendeeCount: 10, onlinePeak: 8,
    exceptionRecord: '无', createTime: '2026-04-06 10:30:00', updateTime: '2026-04-06 11:35:00',
    minutesContent: '会议纪要内容...'
  },
  {
    id: 7, topic: '边坡坍塌预警会议', type: '风险研判', initiator: '周子轩', department: '韶关交通局',
    startTime: '2026-04-07 07:10', status: '已结束', participants: '地质专家组',
    host: '周子轩', attendeeList: '周子轩、黄俊杰、赵磊', endTime: '2026-04-07 08:10:00',
    duration: '01:00:00', meetingNo: 'MEET20260407001', platform: '应急指挥平台',
    meetingUrl: 'https://meeting.example.com/129', meetingPassword: '789012',
    isRecording: '是', recordingUrl: 'http://example.com/video7.mp4',
    screenShare: '支持', muteControl: '支持',
    meetingSummary: '研判边坡坍塌风险', decision: '发布橙色预警',
    dispatchCommand: '设置警示标志', relatedEvent: '韶关边坡坍塌风险',
    relatedPlan: '地质灾害应急预案', attendeeCount: 8, onlinePeak: 6,
    exceptionRecord: '无', createTime: '2026-04-07 07:00:00', updateTime: '2026-04-07 08:10:00',
    minutesContent: '会议纪要内容...'
  },
  {
    id: 8, topic: '服务区停电应急会议', type: '应急处置', initiator: '罗景天', department: '中山交通局',
    startTime: '2026-04-08 19:45', status: '已结束', participants: '电力公司',
    host: '罗景天', attendeeList: '罗景天、梁嘉豪、许文博', endTime: '2026-04-08 20:45:00',
    duration: '01:00:00', meetingNo: 'MEET20260408001', platform: '应急指挥平台',
    meetingUrl: 'https://meeting.example.com/130', meetingPassword: '890123',
    isRecording: '是', recordingUrl: 'http://example.com/video8.mp4',
    screenShare: '支持', muteControl: '支持',
    meetingSummary: '协调服务区供电恢复', decision: '调派应急发电车',
    dispatchCommand: '优先恢复关键区域供电', relatedEvent: '中山服务区停电事件',
    relatedPlan: '电力故障应急预案', attendeeCount: 6, onlinePeak: 5,
    exceptionRecord: '无', createTime: '2026-04-08 19:40:00', updateTime: '2026-04-08 20:45:00',
    minutesContent: '会议纪要内容...'
  },
  {
    id: 9, topic: '大雾交通管制会议', type: '预警会商', initiator: '邓泽宇', department: '珠海交通局',
    startTime: '2026-04-09 05:25', status: '已结束', participants: '气象局、交警',
    host: '邓泽宇', attendeeList: '邓泽宇、郑凯文、何宇航', endTime: '2026-04-09 06:25:00',
    duration: '01:00:00', meetingNo: 'MEET20260409001', platform: '应急指挥平台',
    meetingUrl: 'https://meeting.example.com/131', meetingPassword: '901234',
    isRecording: '是', recordingUrl: 'http://example.com/video9.mp4',
    screenShare: '支持', muteControl: '支持',
    meetingSummary: '部署大雾天气交通管制', decision: '封闭高速公路',
    dispatchCommand: '设置雾区引导设施', relatedEvent: '珠海大雾天气预警',
    relatedPlan: '恶劣天气应急预案', attendeeCount: 12, onlinePeak: 10,
    exceptionRecord: '无', createTime: '2026-04-09 05:20:00', updateTime: '2026-04-09 06:25:00',
    minutesContent: '会议纪要内容...'
  },
  {
    id: 10, topic: '客运站滞留处置会议', type: '应急指挥', initiator: '何宇航', department: '广州急救中心',
    startTime: '2026-04-10 22:00', status: '已结束', participants: '公安、客运站',
    host: '何宇航', attendeeList: '何宇航、邓泽宇、罗景天', endTime: '2026-04-10 23:00:00',
    duration: '01:00:00', meetingNo: 'MEET20260410001', platform: '应急指挥平台',
    meetingUrl: 'https://meeting.example.com/132', meetingPassword: '012345',
    isRecording: '是', recordingUrl: 'http://example.com/video10.mp4',
    screenShare: '支持', muteControl: '支持',
    meetingSummary: '处置客运站旅客滞留', decision: '增开应急班车',
    dispatchCommand: '协调运力支援', relatedEvent: '广州客运站旅客滞留事件',
    relatedPlan: '客运站应急预案', attendeeCount: 15, onlinePeak: 12,
    exceptionRecord: '无', createTime: '2026-04-10 21:50:00', updateTime: '2026-04-10 23:00:00',
    minutesContent: '会议纪要内容...'
  }
]

/** 重点车辆轨迹数据 */
export const vehicleTrackData: VehicleTrack[] = [
  { id: 1, plateNumber: '粤A12345', longitude: 113.350, latitude: 23.140, driveTime: '2026-04-01 08:30', driveStatus: '停车', speed: 60, recordInfo: '正常行驶' },
  { id: 2, plateNumber: '粤B23456', longitude: 113.895, latitude: 22.560, driveTime: '2026-04-01 08:32', driveStatus: '停车', speed: 45, recordInfo: '车流较大' },
  { id: 3, plateNumber: '粤C34567', longitude: 112.985, latitude: 24.580, driveTime: '2026-04-01 08:35', driveStatus: '停车', speed: 0, recordInfo: '临时停车' },
  { id: 4, plateNumber: '粤D45678', longitude: 113.110, latitude: 23.050, driveTime: '2026-04-01 08:38', driveStatus: '停车', speed: 70, recordInfo: '正常行驶' },
  { id: 5, plateNumber: '粤E56789', longitude: 113.380, latitude: 22.520, driveTime: '2026-04-01 08:40', driveStatus: '停车', speed: 50, recordInfo: '路况良好' },
  { id: 6, plateNumber: '粤F67890', longitude: 114.420, latitude: 23.120, driveTime: '2026-04-01 08:45', driveStatus: '停车', speed: 65, recordInfo: '正常行驶' },
  { id: 7, plateNumber: '粤G78901', longitude: 113.590, latitude: 24.800, driveTime: '2026-04-01 08:48', driveStatus: '停车', speed: 30, recordInfo: '前方拥堵' },
  { id: 8, plateNumber: '粤H89012', longitude: 113.570, latitude: 22.270, driveTime: '2026-04-01 08:50', driveStatus: '停车', speed: 55, recordInfo: '正常行驶' },
  { id: 9, plateNumber: '粤J90123', longitude: 113.650, latitude: 22.150, driveTime: '2026-04-01 08:55', driveStatus: '停车', speed: 62, recordInfo: '正常行驶' },
  { id: 10, plateNumber: '粤K01234', longitude: 113.365, latitude: 23.124, driveTime: '2026-04-01 09:00', driveStatus: '停车', speed: 58, recordInfo: '正常行驶' }
]
