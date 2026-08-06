/** 任务分配及跟踪 */
export interface EventTask {
  /** 任务ID */
  id: number
  /** 任务名称 */
  taskName: string
  /** 关联事故名称 */
  eventName: string
  /** 关联事故ID */
  eventId: number
  /** 任务类型: 接报-事故接报, 处置-事故处置, 救援-救援协调, 信息-信息报送, 其他-其他任务 */
  taskType: string
  /** 优先级: 紧急, 高, 中, 低 */
  priority: string
  /** 任务状态: 待分配, 进行中, 已完成, 已逾期, 已取消 */
  status: string
  /** 负责人 */
  assignee: string
  /** 负责部门 */
  department: string
  /** 计划开始时间 */
  planStartTime: string
  /** 计划结束时间 */
  planEndTime: string
  /** 实际开始时间 */
  actualStartTime: string
  /** 实际结束时间 */
  actualEndTime: string
  /** 进度百分比 */
  progress: number
  /** 任务描述 */
  description: string
  /** 创建时间 */
  createTime: string
  /** 备注 */
  remark?: string
}
