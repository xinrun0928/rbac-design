/** 用户反馈类型定义 */

/** 反馈类型枚举 */
export type FeedbackType = '版本过期' | '内容错误' | '信息缺失' | '系统故障' | '优化建议' | '其他'

/** 反馈处理状态 */
export type FeedbackHandleStatus = '已处理' | '待处理'

/** 用户反馈记录 */
export interface FeedbackItem {
  /** 反馈ID */
  id: string
  /** 用户姓名 */
  userName: string
  /** 联系电话 */
  phone: string
  /** 关联知识内容 */
  relatedKnowledge: string
  /** 反馈类型 */
  feedbackType: FeedbackType
  /** 反馈内容 */
  content: string
  /** 处理状态 */
  handleStatus: FeedbackHandleStatus
  /** 处理方式 */
  handleMethod: string
  /** 处理方案及说明 */
  handlePlan: string
  /** 处理人 */
  handler: string
  /** 处理时间 */
  handleTime: string
}
