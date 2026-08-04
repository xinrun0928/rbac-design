/** 事件管理 - 文档库 */
export interface EventDocument {
  /** 文档ID */
  id: number
  /** 文档标题 */
  title: string
  /** 文档类型: 专项预案, 处置方案, 应急预案, 通知, 报告 */
  docType: string
  /** 关联事件 */
  relatedEvent: string
  /** 创建人 */
  creator: string
  /** 创建时间 */
  createTime: string
  /** 文档内容 */
  content?: string
}
