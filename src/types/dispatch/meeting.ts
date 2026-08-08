/** 会议 */
export interface Meeting {
  id: number
  topic: string
  type: string
  initiator: string
  department: string
  startTime: string
  status: '进行中' | '已结束'
  participants: string
  /** 主持人 */
  host: string
  /** 参会人员 */
  attendeeList: string
  /** 结束时间 */
  endTime: string
  /** 会议时长 */
  duration: string
  /** 会议编号 */
  meetingNo: string
  /** 会议平台 */
  platform: string
  /** 会议地址 */
  meetingUrl: string
  /** 入会密码 */
  meetingPassword: string
  /** 是否录制 */
  isRecording: string
  /** 录制文件地址 */
  recordingUrl: string
  /** 屏幕共享 */
  screenShare: string
  /** 禁言控制 */
  muteControl: string
  /** 会议纪要摘要 */
  meetingSummary: string
  /** 决策结论 */
  decision: string
  /** 调度指令 */
  dispatchCommand: string
  /** 关联事件 */
  relatedEvent: string
  /** 关联预案 */
  relatedPlan: string
  /** 参会人数 */
  attendeeCount: number
  /** 在线人数峰值 */
  onlinePeak: number
  /** 异常记录 */
  exceptionRecord: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
  /** 会议纪要内容 */
  minutesContent: string
}

/** 重点车辆轨迹 */
export interface VehicleTrack {
  id: number
  plateNumber: string
  longitude: number
  latitude: number
  driveTime: string
  driveStatus: string
  speed: number
  recordInfo: string
}
