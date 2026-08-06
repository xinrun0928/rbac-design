/** 事故预警规则 - 通知配置项 */
export interface WarningRuleNotification {
  /** 通知对象ID */
  id: number
  /** 通知对象名称 */
  name: string
  /** 通知方式: sms-短信, app-应用推送, wechat-微信, phone-电话 */
  method: string
}

/** 事故预警规则 */
export interface WarningRule {
  /** 规则ID */
  id: number
  /** 规则名称 */
  ruleName: string
  /** 规则编码 */
  ruleCode: string
  /** 预警类型: accident_type-事故类型, vehicle-车辆属性, location-位置信息, urgency-紧急程度, impact-影响范围, report_delay-报送延迟 */
  warningType: string
  /** 触发指标（多个用顿号分隔） */
  triggerIndicators: string
  /** 对比方式: gt-超过, gte-大于等于, eq-等于, includes-包含 */
  comparison: string
  /** 对比方式显示文本 */
  comparisonText: string
  /** 阈值 */
  threshold: string
  /** 预警等级: 红色, 橙色, 黄色, 蓝色 */
  warningLevel: string
  /** 通知人数 */
  notifyCount: number
  /** 通知配置列表 */
  notifications: WarningRuleNotification[]
  /** 短信模板内容 */
  smsTemplate: string
  /** 是否启用 */
  enabled: boolean
  /** 备注 */
  remark?: string
  /** 创建时间 */
  createTime: string
}
