/** 装备使用教程 - 资源类型 */
export type TrainingResourceType = '操作手册' | '演示视频' | '安全注意事项' | '事故案例' | '维保要点' | '干扰处理案例' | '维护视频' | '故障排查指南'

/** 装备使用教程 - 物资分类 */
export type TrainingCategory = '基本生活保障物资' | '应急装备及配套物资' | '工程材料与机械加工' | '其他'

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
  /** 课程包编号 */
  courseCode: string
  /** 物资分类 */
  category: TrainingCategory
  /** 适用装备分类 */
  equipmentCategory: string
  /** 适用装备型号 */
  equipmentModel: string
  /** 资源类型列表 */
  resourceTypeList: TrainingResourceType[]
  /** 配套资源附件数 */
  attachmentCount: number
  /** 启用状态: 1-已启用 0-未启用 */
  status: number
  /** 备注 */
  remark: string
}
