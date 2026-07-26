/** 事件管理 - 我的待办 */
export interface EventTodo {
  /** 待办ID */
  id: number
  /** 事项名称 */
  todoName: string
  /** 待办类型 */
  todoType: string
  /** 关联事件 */
  relatedEvent: string
  /** 下发时间 */
  dispatchTime: string
  /** 状态: 0-待处理, 1-已处理 */
  status: number
}
