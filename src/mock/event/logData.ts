import type { EventLog } from '@/types/event/log'

/** 事件管理 - 系统日志 Mock 数据 */
export const mockEventLogData: EventLog[] = [
  {
    id: 1,
    operator: '张伟',
    operationTime: '2026-07-25 14:30:00',
    operationType: '上报',
    eventName: 'G15沈海高速货车追尾事故',
    result: '成功',
    department: '广州市交通运输局',
    description: '上报一起货车追尾事故，已通知相关部门'
  },
  {
    id: 2,
    operator: '李娜',
    operationTime: '2026-07-25 13:15:00',
    operationType: '编辑',
    eventName: 'G15沈海高速货车追尾事故',
    result: '成功',
    department: '广州市交通运输局',
    description: '更新事故处理进展，伤亡人数由2人修改为3人'
  },
  {
    id: 3,
    operator: '王强',
    operationTime: '2026-07-25 11:20:00',
    operationType: '审批',
    eventName: 'S81广州环城高速路面塌方',
    result: '成功',
    department: '广东省交通运输厅',
    description: '审批通过路面塌方应急处置方案'
  },
  {
    id: 4,
    operator: '赵敏',
    operationTime: '2026-07-25 10:05:00',
    operationType: '删除',
    eventName: '测试事故数据',
    result: '成功',
    department: '广州市交通运输局',
    description: '删除测试数据，恢复正常业务记录'
  },
  {
    id: 5,
    operator: '陈刚',
    operationTime: '2026-07-24 16:40:00',
    operationType: '新增',
    eventName: '京港澳高速韶关段山体滑坡',
    result: '成功',
    department: '韶关市交通运输局',
    description: '接报山体滑坡事件，已启动IV级应急响应'
  },
  {
    id: 6,
    operator: '刘洋',
    operationTime: '2026-07-24 15:20:00',
    operationType: '导出',
    eventName: '2026年7月事故统计报表',
    result: '成功',
    department: '广东省交通运输厅',
    description: '导出7月份事故统计报表，共32条记录'
  },
  {
    id: 7,
    operator: '孙丽',
    operationTime: '2026-07-24 14:00:00',
    operationType: '上报',
    eventName: '广深高速虎门大桥拥堵事件',
    result: '失败',
    department: '东莞市交通运输局',
    description: '上报失败，网络连接超时，请稍后重试'
  },
  {
    id: 8,
    operator: '周明',
    operationTime: '2026-07-24 11:30:00',
    operationType: '编辑',
    eventName: '京港澳高速韶关段山体滑坡',
    result: '成功',
    department: '韶关市交通运输局',
    description: '更新滑坡影响范围，新增封闭路段信息'
  },
  {
    id: 9,
    operator: '吴磊',
    operationTime: '2026-07-24 09:15:00',
    operationType: '审批',
    eventName: 'G4W广澳高速中山段交通事故',
    result: '驳回',
    department: '广东省交通运输厅',
    description: '驳回处置方案，要求补充现场照片及详细评估'
  },
  {
    id: 10,
    operator: '张伟',
    operationTime: '2026-07-23 17:45:00',
    operationType: '新增',
    eventName: 'S304省道清远段路基塌陷',
    result: '成功',
    department: '清远市交通运输局',
    description: '接报路基塌陷，已设置警示标志并封闭半幅车道'
  },
  {
    id: 11,
    operator: '李娜',
    operationTime: '2026-07-23 16:00:00',
    operationType: '删除',
    eventName: '重复上报数据',
    result: '成功',
    department: '广州市交通运输局',
    description: '删除重复上报的事故记录'
  },
  {
    id: 12,
    operator: '王强',
    operationTime: '2026-07-23 14:30:00',
    operationType: '上报',
    eventName: 'G94珠三角环线高速暴雨积水',
    result: '成功',
    department: '佛山市交通运输局',
    description: '上报暴雨导致路面积水，已启动排水作业'
  },
  {
    id: 13,
    operator: '赵敏',
    operationTime: '2026-07-22 16:20:00',
    operationType: '编辑',
    eventName: 'G15沈海高速货车追尾事故',
    result: '成功',
    department: '广州市交通运输局',
    description: '更新事故处理进度，现场清理已完成'
  },
  {
    id: 14,
    operator: '陈刚',
    operationTime: '2026-07-22 14:10:00',
    operationType: '审批',
    eventName: 'S304省道清远段路基塌陷',
    result: '成功',
    department: '广东省交通运输厅',
    description: '审批通过路基塌陷修复方案'
  },
  {
    id: 15,
    operator: '刘洋',
    operationTime: '2026-07-22 11:00:00',
    operationType: '新增',
    eventName: 'G4W广澳高速中山段大雾天气',
    result: '成功',
    department: '中山市交通运输局',
    description: '接报大雾天气影响能见度，已发布预警信息'
  },
  {
    id: 16,
    operator: '孙丽',
    operationTime: '2026-07-21 17:30:00',
    operationType: '导出',
    eventName: '2026年第二季度事故统计报表',
    result: '成功',
    department: '广东省交通运输厅',
    description: '导出第二季度事故统计报表，共128条记录'
  },
  {
    id: 17,
    operator: '周明',
    operationTime: '2026-07-21 15:45:00',
    operationType: '删除',
    eventName: '过期预警信息',
    result: '成功',
    department: '韶关市交通运输局',
    description: '清理过期的气象预警信息'
  },
  {
    id: 18,
    operator: '吴磊',
    operationTime: '2026-07-21 10:20:00',
    operationType: '上报',
    eventName: 'G94珠三角环线高速桥梁检测',
    result: '成功',
    department: '佛山市交通运输局',
    description: '上报桥梁定期检测结果，未发现异常'
  },
  {
    id: 19,
    operator: '张伟',
    operationTime: '2026-07-20 16:00:00',
    operationType: '编辑',
    eventName: 'S81广州环城高速路面塌方',
    result: '成功',
    department: '广州市交通运输局',
    description: '更新塌方修复进度，已完成80%'
  },
  {
    id: 20,
    operator: '李娜',
    operationTime: '2026-07-20 14:30:00',
    operationType: '审批',
    eventName: 'G94珠三角环线高速桥梁检测',
    result: '成功',
    department: '广东省交通运输厅',
    description: '审批通过桥梁检测报告'
  },
  {
    id: 21,
    operator: '王强',
    operationTime: '2026-07-20 11:15:00',
    operationType: '新增',
    eventName: 'G15沈海高速惠州段积水',
    result: '成功',
    department: '惠州市交通运输局',
    description: '接报路面积水，已启动应急排水'
  },
  {
    id: 22,
    operator: '赵敏',
    operationTime: '2026-07-19 17:00:00',
    operationType: '导出',
    eventName: '2026年7月上旬事故统计',
    result: '成功',
    department: '广东省交通运输厅',
    description: '导出7月上旬事故统计数据'
  },
  {
    id: 23,
    operator: '陈刚',
    operationTime: '2026-07-19 14:20:00',
    operationType: '编辑',
    eventName: 'G4W广澳高速中山段大雾天气',
    result: '成功',
    department: '中山市交通运输局',
    description: '更新天气状况，大雾已消散，恢复正常通行'
  },
  {
    id: 24,
    operator: '刘洋',
    operationTime: '2026-07-19 10:45:00',
    operationType: '删除',
    eventName: '误报事故记录',
    result: '成功',
    department: '东莞市交通运输局',
    description: '删除因系统误判产生的虚假事故记录'
  },
  {
    id: 25,
    operator: '孙丽',
    operationTime: '2026-07-18 16:30:00',
    operationType: '上报',
    eventName: 'G45大广高速韶关段边坡滑塌',
    result: '成功',
    department: '韶关市交通运输局',
    description: '上报边坡滑塌事件，已封闭受影响车道'
  },
  {
    id: 26,
    operator: '周明',
    operationTime: '2026-07-18 14:00:00',
    operationType: '审批',
    eventName: 'G45大广高速韶关段边坡滑塌',
    result: '驳回',
    department: '广东省交通运输厅',
    description: '驳回处置方案，要求补充地质勘探报告'
  },
  {
    id: 27,
    operator: '吴磊',
    operationTime: '2026-07-18 11:30:00',
    operationType: '新增',
    eventName: 'S303省道梅州段山体落石',
    result: '成功',
    department: '梅州市交通运输局',
    description: '接报山体落石，已设置警示标志'
  },
  {
    id: 28,
    operator: '张伟',
    operationTime: '2026-07-17 17:15:00',
    operationType: '编辑',
    eventName: 'G15沈海高速惠州段积水',
    result: '成功',
    department: '惠州市交通运输局',
    description: '更新排水作业进度，积水已清除'
  },
  {
    id: 29,
    operator: '李娜',
    operationTime: '2026-07-17 15:00:00',
    operationType: '导出',
    eventName: '2026年6月事故统计报表',
    result: '成功',
    department: '广东省交通运输厅',
    description: '导出6月份事故统计报表，共96条记录'
  },
  {
    id: 30,
    operator: '王强',
    operationTime: '2026-07-17 10:30:00',
    operationType: '上报',
    eventName: 'G94珠三角环线高速交通事故',
    result: '失败',
    department: '佛山市交通运输局',
    description: '上报失败，服务器繁忙，请稍后重试'
  }
]
