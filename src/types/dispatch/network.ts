/** 监控设备 */
export interface MonitorDevice {
  id: number
  deviceName: string
  deviceType: string
  department: string
  deviceStatus: '在线' | '离线' | '故障'
  roadSection: string
  installLocation: string
  deviceCount: number
  onlineCount: number
  offlineCount: number
  faultCount: number
  isAccessed: '是' | '否'
  lastOnlineTime: string
  contactPerson: string
  contactPhone: string
  remark: string
}

/** 监控视频 */
export interface MonitorVideo {
  id: number
  deviceName: string
  deviceType: string
  department: string
  deviceStatus: '在线' | '离线' | '故障'
  longitude: number
  latitude: number
  installLocation: string
}

/** 会议设备 */
export interface MeetingDevice {
  id: number
  deviceName: string
  deviceType: string
  department: string
  deviceStatus: '在线' | '离线' | '故障'
  longitude: number
  latitude: number
  installLocation: string
}

/** 会议视频 */
export interface MeetingVideo {
  id: number
  deviceName: string
  deviceType: string
  department: string
  deviceStatus: '在线' | '离线' | '故障'
  longitude: number
  latitude: number
  installLocation: string
}

/** 语音设备 */
export interface VoiceDevice {
  id: number
  deviceName: string
  deviceType: string
  department: string
  deviceStatus: '在线' | '离线' | '故障'
  installLocation: string
  coverageRange: string
  deviceCount: number
  onlineCount: number
  offlineCount: number
  faultCount: number
  isAccessed: '是' | '否'
  lastOnlineTime: string
  contactPerson: string
  contactPhone: string
  supportFunction: string
  remark: string
}

/** 语音终端 */
export interface VoiceTerminal {
  id: number
  deviceName: string
  deviceType: string
  department: string
  deviceStatus: '在线' | '离线' | '故障'
  installLocation: string
  contactPhone: string
  remark: string
}
