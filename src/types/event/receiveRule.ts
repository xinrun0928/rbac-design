/** 事故接报规则 - 通知配置项 */
export interface ReceiveRuleNotification {
  /** 通知对象ID */
  id: number
  /** 通知对象名称 */
  name: string
  /** 通知方式: sms-短信, app-应用推送, wechat-微信, phone-电话 */
  method: string
}

/** 事故接报规则 */
export interface ReceiveRule {
  /** 规则ID */
  id: number
  /** 指标名称 */
  indicator: string
  /** 指标编码 */
  indicatorCode: string
  /** 对比方式: gt-超过, gte-大于等于, eq-等于 */
  comparison: string
  /** 对比方式显示文本 */
  comparisonText: string
  /** 阈值 */
  threshold: number
  /** 阈值单位 */
  unit: string
  /** 通知人数 */
  notifyCount: number
  /** 通知配置列表 */
  notifications: ReceiveRuleNotification[]
  /** 短信模板内容 */
  smsTemplate: string
  /** 是否启用 */
  enabled: boolean
  /** 备注 */
  remark?: string
}

/** 系统内置变量 */
export interface SmsVariable {
  /** 变量标识 */
  key: string
  /** 变量显示名称 */
  label: string
  /** 变量说明 */
  description: string
}
