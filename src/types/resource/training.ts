/** 装备使用教程 - 资源类型 */
export type TrainingResourceType = '操作手册' | '演示视频' | '安全注意事项' | '事故案例' | '维保要点' | '干扰处理案例' | '维护视频' | '故障排查指南'

/** 装备使用教程 - 物资分类 */
export type TrainingCategory = '基本生活保障物资' | '应急装备及配套物资' | '工程材料与机械加工' | '其他'

/** 装备使用教程 - 上传附件 */
export interface TrainingAttachment {
  /** 附件ID（唯一） */
  uid: number
  /** 附件名称 */
  name: string
  /** 附件大小（字节） */
  size: number
  /** 上传状态 */
  status?: 'ready' | 'uploading' | 'success' | 'fail'
  /** 附件URL */
  url?: string
}

/** 装备使用教程 */
export interface EquipmentTraining {
  /** 课程包ID */
  courseId: string
  /** 课程包/培训名称 */
  courseName: string
  /** 课程包编号 */
  courseCode: string
  /** 物资分类 */
  category: TrainingCategory
  /** 适用装备分类 */
  equipmentCategory: string
  /** 适用装备型号 */
  equipmentModel: string
  /** 包含资源类型（拼接展示） */
  resourceTypes: string
  /** 资源类型列表 */
  resourceTypeList: TrainingResourceType[]
  /** 配套资源附件数 */
  attachmentCount: number
  /** 启用状态: 1-已启用 0-未启用 */
  status: number
  /** 创建人 */
  createBy: string
  /** 创建时间 */
  createTime: string
  /** 资源更新时间 */
  updateTime: string
  /** 备注 */
  remark: string
}

/** 装备使用教程搜索表单 */
export interface EquipmentTrainingSearchForm {
  /** 课程包名称 */
  courseName: string
}

/** 装备使用教程新增/编辑表单 */
export interface EquipmentTrainingForm {
  /** 课程包ID（编辑时存在） */
  courseId?: string
  /** 课程包/培训名称 */
  courseName: string
  /** 课程包编号（系统自动生成，只读） */
  courseCode: string
  /** 适用类型: 1-按种类选择 2-按现有库存装备 */
  applyType: number
  /** 适用装备分类/型号（由适用类型选择生成） */
  equipmentCategory: string
  /** 资源类型列表 */
  resourceTypeList: TrainingResourceType[]
  /** 上传的配套资源附件列表 */
  attachments: TrainingAttachment[]
  /** 配套资源附件数（由附件列表数量自动生成） */
  attachmentCount: number
  /** 启用状态: 1-已启用 0-未启用 */
  status: number
  /** 备注 */
  remark: string
  /** 按种类选择时选中的装备种类ID（applyType=1 时使用） */
  selectedCategories?: string[]
  /** 按现有库存装备时选中的装备名称（applyType=2 时使用） */
  selectedEquipment?: string[]
}

/** 装备操作考核任务状态 */
export type AssessmentStatus = 'completed' | 'in_progress' | 'not_started'

/** 装备操作考核记录 */
export interface EquipmentAssessmentRecord {
  /** 考核任务ID */
  taskId: string
  /** 考核任务名称 */
  taskName: string
  /** 关联考核模板ID */
  templateId: string
  /** 关联考核模板名称 */
  templateName: string
  /** 考核对象列表 */
  assessors: string[]
  /** 考核开始日期 */
  startDate: string
  /** 考核结束日期 */
  endDate: string
  /** 考核进度（0-100） */
  progress: number
  /** 任务状态 */
  status: AssessmentStatus
  /** 创建人 */
  createBy: string
  /** 创建时间 */
  createTime: string
  /** 备注 */
  remark: string
}

/** 装备操作考核记录搜索表单 */
export interface EquipmentAssessmentSearchForm {
  /** 考核任务名称/模板名称关键字 */
  keyword: string
}

/** 装备操作考核记录新增/编辑表单 */
export interface EquipmentAssessmentForm {
  /** 考核任务ID（编辑时存在） */
  taskId?: string
  /** 考核任务名称 */
  taskName: string
  /** 关联考核模板ID */
  templateId: string
  /** 考核对象列表 */
  assessors: string[]
  /** 考核开始日期 */
  startDate: string
  /** 考核结束日期 */
  endDate: string
  /** 备注 */
  remark: string
}
