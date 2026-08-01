/** 知识类型枚举 */
export type KnowledgeType = '历史案例' | '政策法规' | '专家知识' | '标准规范' | '应急资源'

/** 知识状态枚举 */
export type KnowledgeStatus = '草稿' | '已提审' | '已发布' | '已撤回'

/** 审核结果枚举 */
export type AuditResult = '待审核' | '已通过' | '不通过' | '-'

/** 知识维护记录 */
export interface KnowledgeItem {
  /** 知识标题 */
  title: string
  /** 知识编号 */
  code: string
  /** 知识类型 */
  type: KnowledgeType
  /** 配套资源附件数 */
  attachmentCount: number
  /** 状态 */
  status: KnowledgeStatus
  /** 审核结果 */
  auditResult: AuditResult
  /** 创建时间 */
  createTime: string
  /** 最近修改人/修改时间 */
  lastModifier: string
  /** 最近修改时间 */
  lastModifyTime: string
  /** 当前版本号 */
  version: string
  /** 版本迭代原因 */
  versionReason: string
}

/** 知识分类树节点 */
export interface KnowledgeCategory {
  /** 类别ID */
  id: number
  /** 类别名称 */
  name: string
  /** 状态 */
  status: '启用' | '停用'
  /** 最后修改时间 */
  lastModifyTime: string
  /** 最后操作人 */
  lastOperator: string
  /** 知识总数 */
  totalCount: number
  /** 子节点 */
  children?: KnowledgeCategory[]
}

/** 审核审批记录 */
export interface KnowledgeAuditRecord {
  /** 知识名称 */
  name: string
  /** 编号 */
  code: string
  /** 知识类型 */
  type: KnowledgeType
  /** 来源 */
  source: string
  /** 审核状态 */
  auditStatus: '待审核' | '已通过' | '未通过'
  /** 经办人 */
  handler: string
  /** 申请时间 */
  applyTime: string
  /** 审核人 */
  auditor: string
}

/** 知识维护与更新计划 */
export interface KnowledgeMaintainPlan {
  /** 计划名称 */
  name: string
  /** 关联知识类型 */
  relatedType: KnowledgeType
  /** 更新周期 */
  cycle: string
  /** 启用状态 */
  enabled: '已启用' | '未启用'
  /** 计划创建人 */
  creator: string
  /** 最近修改人 */
  lastModifier: string
  /** 最近修改时间 */
  lastModifyTime: string
}

/** 知识维护更新记录 */
export interface KnowledgeRecord {
  /** 执行状态 */
  execStatus: '执行中' | '待执行' | '已完成'
  /** 维护更新任务名称 */
  taskName: string
  /** 关联知识类型 */
  relatedType: KnowledgeType
  /** 执行人 */
  executor: string
  /** 执行人电话 */
  executorPhone: string
  /** 现存知识维护更新进度 */
  progress: string
  /** 需修订知识 */
  needRevision: number
  /** 此次新增知识 */
  newCount: number
  /** 此次下架知识 */
  removedCount: number
  /** 预计完成日期 */
  expectDate: string
  /** 实际完成日期 */
  actualDate: string
}

/** 过期知识处理记录 */
export interface ExpireKnowledge {
  /** 处理状态 */
  handleStatus: '待处理' | '已处理'
  /** 知识名称 */
  name: string
  /** 编号 */
  code: string
  /** 类型 */
  type: KnowledgeType
  /** 有效期 */
  validPeriod: string
  /** 来源 */
  source: string
  /** 申请人 */
  applicant: string
  /** 申请日期 */
  applyDate: string
  /** 相关附件 */
  attachments: string[]
  /** 处理人 */
  handler: string
  /** 处理结果 */
  handleResult: string
  /** 处理说明 */
  handleDesc: string
  /** 处理日期 */
  handleDate: string
}


