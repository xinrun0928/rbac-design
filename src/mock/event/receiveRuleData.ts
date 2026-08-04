import type { ReceiveRule } from '@/types/event/receiveRule'

export const mockReceiveRuleData: ReceiveRule[] = [
  {
    id: 1,
    indicator: '首次续报',
    indicatorCode: 'FIRST_FOLLOWUP',
    comparison: 'gt',
    comparisonText: '超过',
    threshold: 0.5,
    unit: '小时',
    notifyCount: 5,
    enabled: true,
    remark: '事故首报后超过0.5小时未收到续报时触发提醒',
    smsTemplate: '$通知人你好，$告警时间首报达到后间隔$时间没有进行续报，请即刻查看 $事故名称',
    notifications: [
      { id: 1, name: '张明', method: 'sms' },
      { id: 2, name: '李华', method: 'app' },
      { id: 3, name: '王芳', method: 'sms' },
      { id: 4, name: '赵强', method: 'wechat' },
      { id: 5, name: '刘洋', method: 'phone' },
    ]
  },
  {
    id: 2,
    indicator: '终报',
    indicatorCode: 'FINAL_REPORT',
    comparison: 'gt',
    comparisonText: '超过',
    threshold: 24,
    unit: '小时',
    notifyCount: 3,
    enabled: true,
    remark: '事故首报后超过24小时未收到终报时触发提醒',
    smsTemplate: '$通知人你好，$告警时间 $事故名称首报达到后间隔$时间没有进行终报，请即刻查看',
    notifications: [
      { id: 1, name: '张明', method: 'sms' },
      { id: 2, name: '李华', method: 'app' },
      { id: 3, name: '王芳', method: 'wechat' },
    ]
  },
  {
    id: 3,
    indicator: '二次续报',
    indicatorCode: 'SECOND_FOLLOWUP',
    comparison: 'gt',
    comparisonText: '超过',
    threshold: 2,
    unit: '小时',
    notifyCount: 2,
    enabled: true,
    remark: '首次续报后超过2小时未收到二次续报时触发提醒',
    smsTemplate: '$通知人你好，$告警时间 $事故名称首次续报达到后间隔$时间没有进行二次续报，请即刻查看',
    notifications: [
      { id: 1, name: '张明', method: 'sms' },
      { id: 2, name: '李华', method: 'app' },
    ]
  },
  {
    id: 4,
    indicator: '级别变更',
    indicatorCode: 'LEVEL_CHANGE',
    comparison: 'gt',
    comparisonText: '超过',
    threshold: 1,
    unit: '小时',
    notifyCount: 4,
    enabled: false,
    remark: '事故级别变更后超过1小时未更新处置措施时触发提醒',
    smsTemplate: '$通知人你好，$告警时间 $事故名称级别变更后超过$时间未更新处置措施，请即刻处理',
    notifications: [
      { id: 1, name: '张明', method: 'sms' },
      { id: 2, name: '李华', method: 'app' },
      { id: 3, name: '王芳', method: 'wechat' },
      { id: 4, name: '赵强', method: 'phone' },
    ]
  },
  {
    id: 5,
    indicator: '响应超时',
    indicatorCode: 'RESPONSE_TIMEOUT',
    comparison: 'gt',
    comparisonText: '超过',
    threshold: 15,
    unit: '分钟',
    notifyCount: 3,
    enabled: true,
    remark: '事故响应指令下发后超过15分钟未响应时触发提醒',
    smsTemplate: '$通知人你好，$告警时间 $事故名称响应指令已下发超过$时间未收到响应，请即刻处理',
    notifications: [
      { id: 1, name: '张明', method: 'sms' },
      { id: 2, name: '李华', method: 'app' },
      { id: 3, name: '王芳', method: 'wechat' },
    ]
  },
]
