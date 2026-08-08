import type { ControlBall, CommandVehicle, PersonalDevice, TerminalStatistics, TerminalTrend } from '@/types/dispatch/terminal'

/** 应急布控球平台数据 */
export const controlBallData: ControlBall[] = [
  {
    id: 1,
    platformName: '广州布控球平台',
    responsibleUnit: '广州市交通运输局',
    description: '用于道路视频布控与监控',
    mainUnit: '广州交警、交通局',
    accessStatus: '未接入',
    accessTime: '2026-04-01 09:00',
    platformStatus: '正常'
  },
  {
    id: 2,
    platformName: '深圳布控球平台',
    responsibleUnit: '深圳市交通运输局',
    description: '城市交通视频采集',
    mainUnit: '深圳交警',
    accessStatus: '已接入',
    accessTime: '2026-04-01 09:10',
    platformStatus: '异常'
  },
  {
    id: 3,
    platformName: '清远布控球平台',
    responsibleUnit: '清远市交通运输局',
    description: '山区风险视频监控',
    mainUnit: '清远应急局',
    accessStatus: '未接入',
    accessTime: '2026-04-01 09:20',
    platformStatus: '正常'
  },
  {
    id: 4,
    platformName: '佛山布控球平台',
    responsibleUnit: '佛山交通局',
    description: '重点区域视频布控',
    mainUnit: '佛山交警',
    accessStatus: '已接入',
    accessTime: '-',
    platformStatus: '异常'
  },
  {
    id: 5,
    platformName: '中山布控球平台',
    responsibleUnit: '中山交通局',
    description: '服务区视频监控',
    mainUnit: '中山交通局',
    accessStatus: '未接入',
    accessTime: '2026-04-01 09:30',
    platformStatus: '正常'
  },
  {
    id: 6,
    platformName: '惠州布控球平台',
    responsibleUnit: '惠州交通局',
    description: '高速视频监控',
    mainUnit: '惠州交警',
    accessStatus: '已接入',
    accessTime: '2026-04-01 09:40',
    platformStatus: '异常'
  },
  {
    id: 7,
    platformName: '韶关布控球平台',
    responsibleUnit: '韶关交通局',
    description: '边坡监控视频接入',
    mainUnit: '韶关应急局',
    accessStatus: '未接入',
    accessTime: '2026-04-01 09:50',
    platformStatus: '正常'
  },
  {
    id: 8,
    platformName: '珠海布控球平台',
    responsibleUnit: '珠海交通局',
    description: '客运站视频监控',
    mainUnit: '珠海交警',
    accessStatus: '已接入',
    accessTime: '2026-04-01 10:00',
    platformStatus: '异常'
  },
  {
    id: 9,
    platformName: '港口布控球平台',
    responsibleUnit: '港口管理单位',
    description: '港口区域视频监控',
    mainUnit: '港口调度中心',
    accessStatus: '未接入',
    accessTime: '2026-04-01 10:10',
    platformStatus: '正常'
  },
  {
    id: 10,
    platformName: '高速布控球平台',
    responsibleUnit: '广深高速公司',
    description: '高速路网视频布控',
    mainUnit: '高速运维中心',
    accessStatus: '已接入',
    accessTime: '2026-04-01 10:20',
    platformStatus: '异常'
  }
]

/** 应急指挥车数据 */
export const commandVehicleData: CommandVehicle[] = [
  {
    id: 1,
    vehicleName: '广州应急指挥车1号',
    responsibleUnit: '广州市交通运输局',
    description: '用于高速事故现场指挥',
    mainUnit: '广州交警',
    accessStatus: '未接入',
    accessTime: '2026-04-01 09:00',
    vehicleStatus: '正常'
  },
  {
    id: 2,
    vehicleName: '深圳应急指挥车2号',
    responsibleUnit: '深圳市交通运输局',
    description: '城市交通应急调度',
    mainUnit: '深圳交警',
    accessStatus: '已接入',
    accessTime: '2026-04-01 09:10',
    vehicleStatus: '异常'
  },
  {
    id: 3,
    vehicleName: '清远应急指挥车3号',
    responsibleUnit: '清远交通局',
    description: '山区应急处置',
    mainUnit: '清远应急局',
    accessStatus: '未接入',
    accessTime: '2026-04-01 09:20',
    vehicleStatus: '正常'
  },
  {
    id: 4,
    vehicleName: '佛山应急指挥车4号',
    responsibleUnit: '佛山交通局',
    description: '桥梁监控与指挥',
    mainUnit: '佛山交警',
    accessStatus: '已接入',
    accessTime: '-',
    vehicleStatus: '异常'
  },
  {
    id: 5,
    vehicleName: '中山应急指挥车5号',
    responsibleUnit: '中山交通局',
    description: '服务区应急保障',
    mainUnit: '中山交通局',
    accessStatus: '未接入',
    accessTime: '2026-04-01 09:30',
    vehicleStatus: '正常'
  },
  {
    id: 6,
    vehicleName: '惠州应急指挥车6号',
    responsibleUnit: '惠州交通局',
    description: '高速事故处理',
    mainUnit: '惠州交警',
    accessStatus: '已接入',
    accessTime: '2026-04-01 09:40',
    vehicleStatus: '异常'
  },
  {
    id: 7,
    vehicleName: '韶关应急指挥车7号',
    responsibleUnit: '韶关交通局',
    description: '边坡风险处置',
    mainUnit: '韶关应急局',
    accessStatus: '未接入',
    accessTime: '2026-04-01 09:50',
    vehicleStatus: '正常'
  },
  {
    id: 8,
    vehicleName: '珠海应急指挥车8号',
    responsibleUnit: '珠海交通局',
    description: '客运站应急调度',
    mainUnit: '珠海交警',
    accessStatus: '已接入',
    accessTime: '2026-04-01 10:00',
    vehicleStatus: '异常'
  },
  {
    id: 9,
    vehicleName: '港口应急指挥车9号',
    responsibleUnit: '港口管理单位',
    description: '港口应急调度',
    mainUnit: '港口调度中心',
    accessStatus: '未接入',
    accessTime: '2026-04-01 10:10',
    vehicleStatus: '正常'
  },
  {
    id: 10,
    vehicleName: '高速应急指挥车10号',
    responsibleUnit: '广深高速公司',
    description: '路网应急指挥',
    mainUnit: '高速运维中心',
    accessStatus: '已接入',
    accessTime: '2026-04-01 10:20',
    vehicleStatus: '异常'
  }
]

/** 应急单兵设备数据 */
export const personalDeviceData: PersonalDevice[] = [
  {
    id: 1,
    deviceName: '执法记录仪A1',
    deviceCode: 'SB001',
    deviceType: '视频设备',
    deviceStatus: '在线',
    owner: '陈志远',
    department: '广州交通局',
    updateTime: '2026-04-01 08:50'
  },
  {
    id: 2,
    deviceName: '对讲终端B2',
    deviceCode: 'SB002',
    deviceType: '语音设备',
    deviceStatus: '故障',
    owner: '林浩然',
    department: '深圳交通局',
    updateTime: '2026-04-01 08:55'
  },
  {
    id: 3,
    deviceName: '定位终端C3',
    deviceCode: 'SB003',
    deviceType: '定位设备',
    deviceStatus: '在线',
    owner: '黄俊杰',
    department: '清远交通局',
    updateTime: '2026-04-01 09:00'
  },
  {
    id: 4,
    deviceName: '执法记录仪D4',
    deviceCode: 'SB004',
    deviceType: '视频设备',
    deviceStatus: '在线',
    owner: '郑凯文',
    department: '佛山交通局',
    updateTime: '2026-04-01 09:05'
  },
  {
    id: 5,
    deviceName: '广播终端E5',
    deviceCode: 'SB005',
    deviceType: '语音设备',
    deviceStatus: '故障',
    owner: '梁嘉豪',
    department: '中山交通局',
    updateTime: '2026-04-01 09:10'
  },
  {
    id: 6,
    deviceName: '执法记录仪F6',
    deviceCode: 'SB006',
    deviceType: '视频设备',
    deviceStatus: '在线',
    owner: '许文博',
    department: '惠州交通局',
    updateTime: '2026-04-01 09:15'
  },
  {
    id: 7,
    deviceName: '定位设备G7',
    deviceCode: 'SB007',
    deviceType: '定位设备',
    deviceStatus: '在线',
    owner: '周子轩',
    department: '韶关交通局',
    updateTime: '2026-04-01 09:20'
  },
  {
    id: 8,
    deviceName: '对讲终端H8',
    deviceCode: 'SB008',
    deviceType: '语音设备',
    deviceStatus: '故障',
    owner: '罗景天',
    department: '珠海交通局',
    updateTime: '2026-04-01 09:25'
  },
  {
    id: 9,
    deviceName: '视频终端I9',
    deviceCode: 'SB009',
    deviceType: '视频设备',
    deviceStatus: '在线',
    owner: '邓泽宇',
    department: '港口管理单位',
    updateTime: '2026-04-01 09:30'
  },
  {
    id: 10,
    deviceName: '通信终端J10',
    deviceCode: 'SB010',
    deviceType: '通信设备',
    deviceStatus: '在线',
    owner: '何宇航',
    department: '广深高速公司',
    updateTime: '2026-04-01 09:35'
  }
]

/** 终端调度统计汇总数据 */
export const terminalStatisticsData: TerminalStatistics[] = [
  {
    type: '布控球',
    todayCount: 15,
    weekCount: 128,
    monthCount: 512,
    todayDuration: '22h30m',
    weekDuration: '256h30m',
    monthDuration: '1024h15m',
    avgDuration: 120.23,
    countChange: '15.38%',
    durationChange: '12.43%'
  },
  {
    type: '应急指挥车',
    todayCount: 8,
    weekCount: 64,
    monthCount: 256,
    todayDuration: '18h15m',
    weekDuration: '192h15m',
    monthDuration: '768h30m',
    avgDuration: 180.23,
    countChange: '8.57%',
    durationChange: '5.21%'
  },
  {
    type: '应急单兵设备',
    todayCount: 42,
    weekCount: 356,
    monthCount: 1428,
    todayDuration: '72h45m',
    weekDuration: '489h45m',
    monthDuration: '1958h20m',
    avgDuration: 82.43,
    countChange: '22.34%',
    durationChange: '18.66%'
  }
]

/** 终端调度次数趋势 */
export const terminalCountTrendData: TerminalTrend[] = [
  { date: '06-14', controlBall: 20, commandVehicle: 10, personalDevice: 50 },
  { date: '06-15', controlBall: 22, commandVehicle: 12, personalDevice: 55 },
  { date: '06-16', controlBall: 18, commandVehicle: 8, personalDevice: 48 },
  { date: '06-17', controlBall: 25, commandVehicle: 15, personalDevice: 60 },
  { date: '06-18', controlBall: 35, commandVehicle: 18, personalDevice: 80 },
  { date: '06-19', controlBall: 28, commandVehicle: 14, personalDevice: 65 },
  { date: '06-20', controlBall: 26, commandVehicle: 16, personalDevice: 62 }
]

/** 终端调度时长趋势 */
export const terminalDurationTrendData: TerminalTrend[] = [
  { date: '06-14', controlBall: 15, commandVehicle: 25, personalDevice: 50 },
  { date: '06-15', controlBall: 20, commandVehicle: 30, personalDevice: 60 },
  { date: '06-16', controlBall: 12, commandVehicle: 20, personalDevice: 45 },
  { date: '06-17', controlBall: 25, commandVehicle: 35, personalDevice: 70 },
  { date: '06-18', controlBall: 40, commandVehicle: 45, personalDevice: 90 },
  { date: '06-19', controlBall: 30, commandVehicle: 38, personalDevice: 75 },
  { date: '06-20', controlBall: 28, commandVehicle: 35, personalDevice: 72 }
]
