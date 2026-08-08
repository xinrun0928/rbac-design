import type { MonitorDevice, MonitorVideo, MeetingDevice, MeetingVideo, VoiceDevice, VoiceTerminal } from '@/types/dispatch/network'

/** 监控设备数据 */
export const monitorDeviceData: MonitorDevice[] = [
  { id: 1, deviceName: 'G4高速K23监控', deviceType: '枪机摄像头', department: '广深高速公司', deviceStatus: '在线', roadSection: 'G4高速', installLocation: 'K23+500', deviceCount: 1, onlineCount: 1, offlineCount: 0, faultCount: 0, isAccessed: '是', lastOnlineTime: '2026-04-24 09:15', contactPerson: '张伟', contactPhone: '13800001234', remark: '' },
  { id: 2, deviceName: '天河收费站监控组', deviceType: '球机摄像头', department: '广州交通局', deviceStatus: '在线', roadSection: 'G4高速', installLocation: '收费站入口', deviceCount: 8, onlineCount: 8, offlineCount: 0, faultCount: 0, isAccessed: '是', lastOnlineTime: '2026-04-24 09:18', contactPerson: '李明', contactPhone: '13800002345', remark: '' },
  { id: 3, deviceName: '南山隧道监控组', deviceType: '枪机摄像头', department: '深圳交通局', deviceStatus: '在线', roadSection: 'S3高速', installLocation: '隧道入口', deviceCount: 12, onlineCount: 12, offlineCount: 0, faultCount: 0, isAccessed: '是', lastOnlineTime: '2026-04-24 09:20', contactPerson: '王强', contactPhone: '13800003456', remark: '' },
  { id: 4, deviceName: '清远滑坡监控组', deviceType: '热成像摄像头', department: '清远交通局', deviceStatus: '在线', roadSection: 'G78高速', installLocation: '山区路段', deviceCount: 5, onlineCount: 5, offlineCount: 0, faultCount: 0, isAccessed: '是', lastOnlineTime: '2026-04-24 09:10', contactPerson: '赵磊', contactPhone: '13800004567', remark: '' },
  { id: 5, deviceName: '服务区监控组', deviceType: '球机摄像头', department: '中山交通局', deviceStatus: '在线', roadSection: 'G94高速', installLocation: '服务区停车场', deviceCount: 10, onlineCount: 10, offlineCount: 0, faultCount: 0, isAccessed: '是', lastOnlineTime: '2026-04-24 09:22', contactPerson: '刘洋', contactPhone: '13800005678', remark: '' },
  { id: 6, deviceName: '桥梁监控系统', deviceType: '高清摄像头', department: '佛山交通局', deviceStatus: '在线', roadSection: 'G15高速', installLocation: '桥梁中段', deviceCount: 6, onlineCount: 6, offlineCount: 0, faultCount: 0, isAccessed: '是', lastOnlineTime: '2026-04-24 09:25', contactPerson: '陈静', contactPhone: '13800006789', remark: '' },
  { id: 7, deviceName: '收费广场监控组', deviceType: '枪机摄像头', department: '惠州交通局', deviceStatus: '在线', roadSection: 'G25高速', installLocation: '收费广场', deviceCount: 4, onlineCount: 4, offlineCount: 0, faultCount: 0, isAccessed: '是', lastOnlineTime: '2026-04-24 09:28', contactPerson: '杨帆', contactPhone: '13800007890', remark: '' },
  { id: 8, deviceName: '高边坡监控组', deviceType: '热成像摄像头', department: '韶关交通局', deviceStatus: '在线', roadSection: 'G4高速', installLocation: '边坡区域', deviceCount: 7, onlineCount: 7, offlineCount: 0, faultCount: 0, isAccessed: '是', lastOnlineTime: '2026-04-24 09:30', contactPerson: '周杰', contactPhone: '13800008901', remark: '' },
  { id: 9, deviceName: '客运站监控系统', deviceType: '球机摄像头', department: '珠海交通局', deviceStatus: '在线', roadSection: '城市道路', installLocation: '客运站入口', deviceCount: 9, onlineCount: 9, offlineCount: 0, faultCount: 0, isAccessed: '是', lastOnlineTime: '2026-04-24 09:32', contactPerson: '吴磊', contactPhone: '13800009012', remark: '' },
  { id: 10, deviceName: '港口通道监控组', deviceType: '枪机摄像头', department: '港口管理单位', deviceStatus: '在线', roadSection: '港口道路', installLocation: '港口入口', deviceCount: 11, onlineCount: 11, offlineCount: 0, faultCount: 0, isAccessed: '是', lastOnlineTime: '2026-04-24 09:35', contactPerson: '孙涛', contactPhone: '13800000123', remark: '' }
]

/** 监控视频数据 */
export const monitorVideoData: MonitorVideo[] = [
  { id: 1, deviceName: 'G4高速K23摄像头', deviceType: '枪机摄像头', department: '广深高速管理公司', deviceStatus: '在线', longitude: 113.365214, latitude: 23.124578, installLocation: 'G4高速K23+500' },
  { id: 2, deviceName: '天河收费站监控', deviceType: '球机摄像头', department: '广州交通局', deviceStatus: '在线', longitude: 113.321456, latitude: 23.135678, installLocation: '天河收费站入口' },
  { id: 3, deviceName: '南山隧道入口监控', deviceType: '枪机摄像头', department: '深圳交通局', deviceStatus: '在线', longitude: 113.923456, latitude: 22.543210, installLocation: '南山隧道入口' },
  { id: 4, deviceName: '清远山区监控点', deviceType: '热成像摄像头', department: '清远交通局', deviceStatus: '在线', longitude: 112.987654, latitude: 24.567890, installLocation: '山体滑坡监测点' },
  { id: 5, deviceName: '服务区停车场监控', deviceType: '球机摄像头', department: '中山交通局', deviceStatus: '在线', longitude: 113.456789, latitude: 22.678901, installLocation: '服务区停车场' },
  { id: 6, deviceName: '桥梁健康监控视频', deviceType: '高清摄像头', department: '佛山交通局', deviceStatus: '在线', longitude: 113.112233, latitude: 23.223344, installLocation: '大桥中段' },
  { id: 7, deviceName: '收费广场监控设备', deviceType: '枪机摄像头', department: '惠州交通局', deviceStatus: '在线', longitude: 114.123456, latitude: 23.345678, installLocation: '收费广场' },
  { id: 8, deviceName: '高边坡监控设备', deviceType: '热成像摄像头', department: '韶关交通局', deviceStatus: '在线', longitude: 113.567890, latitude: 24.123456, installLocation: '高边坡区域' },
  { id: 9, deviceName: '客运站入口监控', deviceType: '球机摄像头', department: '珠海交通局', deviceStatus: '在线', longitude: 113.576789, latitude: 22.271234, installLocation: '客运站入口' },
  { id: 10, deviceName: '港口通道监控设备', deviceType: '枪机摄像头', department: '港口管理单位', deviceStatus: '在线', longitude: 113.654321, latitude: 22.123456, installLocation: '港口通道' }
]

/** 会议设备数据 */
export const meetingDeviceData: MeetingDevice[] = [
  { id: 1, deviceName: 'G4高速K23摄像头', deviceType: '枪机摄像头', department: '广深高速管理公司', deviceStatus: '在线', longitude: 113.365214, latitude: 23.124578, installLocation: 'G4高速K23+500' },
  { id: 2, deviceName: '天河收费站监控', deviceType: '球机摄像头', department: '广州交通局', deviceStatus: '在线', longitude: 113.321456, latitude: 23.135678, installLocation: '天河收费站入口' },
  { id: 3, deviceName: '南山隧道入口监控', deviceType: '枪机摄像头', department: '深圳交通局', deviceStatus: '在线', longitude: 113.923456, latitude: 22.543210, installLocation: '南山隧道入口' },
  { id: 4, deviceName: '清远山区监控点', deviceType: '热成像摄像头', department: '清远交通局', deviceStatus: '在线', longitude: 112.987654, latitude: 24.567890, installLocation: '山体滑坡监测点' },
  { id: 5, deviceName: '服务区停车场监控', deviceType: '球机摄像头', department: '中山交通局', deviceStatus: '在线', longitude: 113.456789, latitude: 22.678901, installLocation: '服务区停车场' },
  { id: 6, deviceName: '桥梁健康监控视频', deviceType: '高清摄像头', department: '佛山交通局', deviceStatus: '在线', longitude: 113.112233, latitude: 23.223344, installLocation: '大桥中段' },
  { id: 7, deviceName: '收费广场监控设备', deviceType: '枪机摄像头', department: '惠州交通局', deviceStatus: '在线', longitude: 114.123456, latitude: 23.345678, installLocation: '收费广场' },
  { id: 8, deviceName: '高边坡监控设备', deviceType: '热成像摄像头', department: '韶关交通局', deviceStatus: '在线', longitude: 113.567890, latitude: 24.123456, installLocation: '高边坡区域' },
  { id: 9, deviceName: '客运站入口监控', deviceType: '球机摄像头', department: '珠海交通局', deviceStatus: '在线', longitude: 113.576789, latitude: 22.271234, installLocation: '客运站入口' },
  { id: 10, deviceName: '港口通道监控设备', deviceType: '枪机摄像头', department: '港口管理单位', deviceStatus: '在线', longitude: 113.654321, latitude: 22.123456, installLocation: '港口通道' }
]

/** 会议视频数据 */
export const meetingVideoData: MeetingVideo[] = [
  { id: 1, deviceName: 'G4高速K23摄像头', deviceType: '枪机摄像头', department: '广深高速管理公司', deviceStatus: '在线', longitude: 113.365214, latitude: 23.124578, installLocation: 'G4高速K23+500' },
  { id: 2, deviceName: '天河收费站监控', deviceType: '球机摄像头', department: '广州交通局', deviceStatus: '在线', longitude: 113.321456, latitude: 23.135678, installLocation: '天河收费站入口' },
  { id: 3, deviceName: '南山隧道入口监控', deviceType: '枪机摄像头', department: '深圳交通局', deviceStatus: '在线', longitude: 113.923456, latitude: 22.543210, installLocation: '南山隧道入口' },
  { id: 4, deviceName: '清远山区监控点', deviceType: '热成像摄像头', department: '清远交通局', deviceStatus: '在线', longitude: 112.987654, latitude: 24.567890, installLocation: '山体滑坡监测点' },
  { id: 5, deviceName: '服务区停车场监控', deviceType: '球机摄像头', department: '中山交通局', deviceStatus: '在线', longitude: 113.456789, latitude: 22.678901, installLocation: '服务区停车场' },
  { id: 6, deviceName: '桥梁健康监控视频', deviceType: '高清摄像头', department: '佛山交通局', deviceStatus: '在线', longitude: 113.112233, latitude: 23.223344, installLocation: '大桥中段' },
  { id: 7, deviceName: '收费广场监控设备', deviceType: '枪机摄像头', department: '惠州交通局', deviceStatus: '在线', longitude: 114.123456, latitude: 23.345678, installLocation: '收费广场' },
  { id: 8, deviceName: '高边坡监控设备', deviceType: '热成像摄像头', department: '韶关交通局', deviceStatus: '在线', longitude: 113.567890, latitude: 24.123456, installLocation: '高边坡区域' },
  { id: 9, deviceName: '客运站入口监控', deviceType: '球机摄像头', department: '珠海交通局', deviceStatus: '在线', longitude: 113.576789, latitude: 22.271234, installLocation: '客运站入口' },
  { id: 10, deviceName: '港口通道监控设备', deviceType: '枪机摄像头', department: '港口管理单位', deviceStatus: '在线', longitude: 113.654321, latitude: 22.123456, installLocation: '港口通道' }
]

/** 语音设备数据 */
export const voiceDeviceData: VoiceDevice[] = [
  { id: 1, deviceName: 'G4高速广播终端组', deviceType: '广播设备', department: '广深高速公司', deviceStatus: '在线', installLocation: 'G4高速K23+500', coverageRange: '高速路段', deviceCount: 6, onlineCount: 6, offlineCount: 0, faultCount: 0, isAccessed: '是', lastOnlineTime: '2026-04-24 09:15', contactPerson: '张伟', contactPhone: '13800001234', supportFunction: '广播', remark: '' },
  { id: 2, deviceName: '天河收费站对讲系统', deviceType: '对讲设备', department: '广州交通局', deviceStatus: '在线', installLocation: '收费站入口', coverageRange: '收费广场', deviceCount: 4, onlineCount: 4, offlineCount: 0, faultCount: 0, isAccessed: '是', lastOnlineTime: '2026-04-24 09:18', contactPerson: '李明', contactPhone: '13800002345', supportFunction: '对讲', remark: '' },
  { id: 3, deviceName: '南山隧道语音系统', deviceType: '广播设备', department: '深圳交通局', deviceStatus: '在线', installLocation: '隧道入口', coverageRange: '隧道全段', deviceCount: 5, onlineCount: 5, offlineCount: 0, faultCount: 0, isAccessed: '是', lastOnlineTime: '2026-04-24 09:20', contactPerson: '王强', contactPhone: '13800003456', supportFunction: '广播', remark: '' },
  { id: 4, deviceName: '清远山区预警广播', deviceType: '广播设备', department: '清远交通局', deviceStatus: '在线', installLocation: '山区路段', coverageRange: '滑坡区域', deviceCount: 3, onlineCount: 3, offlineCount: 0, faultCount: 0, isAccessed: '是', lastOnlineTime: '2026-04-24 09:10', contactPerson: '赵磊', contactPhone: '13800004567', supportFunction: '告警', remark: '' },
  { id: 5, deviceName: '服务区语音播报系统', deviceType: '广播设备', department: '中山交通局', deviceStatus: '在线', installLocation: '服务区大厅', coverageRange: '停车场', deviceCount: 7, onlineCount: 7, offlineCount: 0, faultCount: 0, isAccessed: '是', lastOnlineTime: '2026-04-24 09:22', contactPerson: '刘洋', contactPhone: '13800005678', supportFunction: '广播', remark: '' },
  { id: 6, deviceName: '桥梁语音警示系统', deviceType: '警示设备', department: '佛山交通局', deviceStatus: '在线', installLocation: '桥梁中段', coverageRange: '桥面区域', deviceCount: 2, onlineCount: 2, offlineCount: 0, faultCount: 0, isAccessed: '是', lastOnlineTime: '2026-04-24 09:25', contactPerson: '陈静', contactPhone: '13800006789', supportFunction: '告警', remark: '' },
  { id: 7, deviceName: '收费广场语音设备组', deviceType: '对讲设备', department: '惠州交通局', deviceStatus: '在线', installLocation: '收费广场', coverageRange: '出入口区域', deviceCount: 3, onlineCount: 3, offlineCount: 0, faultCount: 0, isAccessed: '是', lastOnlineTime: '2026-04-24 09:28', contactPerson: '杨帆', contactPhone: '13800007890', supportFunction: '对讲', remark: '' },
  { id: 8, deviceName: '高边坡广播设备组', deviceType: '广播设备', department: '韶关交通局', deviceStatus: '在线', installLocation: '边坡区域', coverageRange: '风险区域', deviceCount: 4, onlineCount: 4, offlineCount: 0, faultCount: 0, isAccessed: '是', lastOnlineTime: '2026-04-24 09:30', contactPerson: '周杰', contactPhone: '13800008901', supportFunction: '广播', remark: '' },
  { id: 9, deviceName: '客运站语音系统', deviceType: '广播设备', department: '珠海交通局', deviceStatus: '在线', installLocation: '客运站大厅', coverageRange: '候车区', deviceCount: 6, onlineCount: 6, offlineCount: 0, faultCount: 0, isAccessed: '是', lastOnlineTime: '2026-04-24 09:32', contactPerson: '吴磊', contactPhone: '13800009012', supportFunction: '广播', remark: '' },
  { id: 10, deviceName: '港口调度对讲系统', deviceType: '对讲设备', department: '港口管理单位', deviceStatus: '在线', installLocation: '港口通道', coverageRange: '作业区', deviceCount: 5, onlineCount: 5, offlineCount: 0, faultCount: 0, isAccessed: '是', lastOnlineTime: '2026-04-24 09:35', contactPerson: '孙涛', contactPhone: '13800000123', supportFunction: '对讲', remark: '' }
]

/** 语音终端数据 */
export const voiceTerminalData: VoiceTerminal[] = [
  { id: 1, deviceName: 'G4高速广播终端1号', deviceType: '广播设备', department: '广深高速公司', deviceStatus: '在线', installLocation: 'G4高速K23+500', contactPhone: '13800007893', remark: '正常运行' },
  { id: 2, deviceName: '天河收费站对讲终端', deviceType: '对讲设备', department: '广州交通局', deviceStatus: '在线', installLocation: '天河收费站', contactPhone: '13800001231', remark: '出入口使用' },
  { id: 3, deviceName: '南山隧道语音终端', deviceType: '广播设备', department: '深圳交通局', deviceStatus: '在线', installLocation: '南山隧道入口', contactPhone: '13800004562', remark: '网络异常' },
  { id: 4, deviceName: '清远应急广播设备', deviceType: '广播设备', department: '清远交通局', deviceStatus: '在线', installLocation: '山区监测点', contactPhone: '13800003346', remark: '风险提示' },
  { id: 5, deviceName: '服务区语音播报设备', deviceType: '广播设备', department: '中山交通局', deviceStatus: '在线', installLocation: '服务区大厅', contactPhone: '13800006679', remark: '日常播报' },
  { id: 6, deviceName: '桥梁语音警示设备', deviceType: '警示设备', department: '佛山交通局', deviceStatus: '在线', installLocation: '大桥中段', contactPhone: '13800002235', remark: '安全提示' },
  { id: 7, deviceName: '收费广场语音终端', deviceType: '对讲设备', department: '惠州交通局', deviceStatus: '在线', installLocation: '收费广场', contactPhone: '13800005568', remark: '设备损坏' },
  { id: 8, deviceName: '高边坡广播设备', deviceType: '广播设备', department: '韶关交通局', deviceStatus: '在线', installLocation: '高边坡区域', contactPhone: '13800007780', remark: '滑坡预警' },
  { id: 9, deviceName: '客运站语音系统', deviceType: '广播设备', department: '珠海交通局', deviceStatus: '在线', installLocation: '客运站大厅', contactPhone: '13800001124', remark: '旅客通知' },
  { id: 10, deviceName: '港口语音调度终端', deviceType: '对讲设备', department: '港口管理单位', deviceStatus: '在线', installLocation: '港口通道', contactPhone: '13800004457', remark: '调度使用' }
]
