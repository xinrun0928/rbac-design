/** 维保周期枚举 */
export type MaintenanceCycle = '每日' | '每周' | '每月' | '每年'

/** 维保计划分类 */
export type MaintenanceCategory = '基本生活保障物资' | '应急装备及配套物资' | '工程材料与机械加工' | '其他'

/** 维保对象类型: 1-按种类选择 2-按现有库存装备 */
export type TargetType = 1 | 2

/** 维保模板类型: 1-选择已有模板 2-直接上传 */
export type TemplateType = 1 | 2

/** 提前提醒天数 */
export type ReminderDays = 1 | 2 | 3

/** 装备维保计划 */
export interface MaintenancePlan {
  /** 计划ID */
  planId: string
  /** 计划名称 */
  planName: string
  /** 维保对象类型: 1-按种类选择 2-按现有库存装备 */
  targetType: TargetType
  /** 维保对象（装备名称/类别） */
  targetName: string
  /** 维保对象类别（用于分类筛选） */
  category: MaintenanceCategory
  /** 维保模板类型: 1-选择已有模板 2-直接上传 */
  templateType: TemplateType
  /** 维保模板ID或名称 */
  templateId: string
  /** 维保作业内容 */
  maintenanceContent: string
  /** 维保周期 */
  cycle: MaintenanceCycle
  /** 提前提醒天数 */
  reminderDays: ReminderDays
  /** 短信提醒: true-开启 false-关闭 */
  smsReminder: boolean
  /** 执行人 */
  executor: string
  /** 启用状态: 1-已启用 0-未启用 */
  status: number
  /** 计划创建人 */
  creator: string
  /** 最近修改人 */
  updater: string
  /** 最近修改时间 */
  updateTime: string
  /** 备注 */
  remark: string
}

/** 装备维保计划搜索表单 */
export interface MaintenancePlanSearchForm {
  /** 计划名称 */
  planName: string
}

/** 装备维保计划新增/编辑表单 */
export interface MaintenancePlanForm {
  /** 计划名称 */
  planName: string
  /** 维保对象类型: 1-按种类选择 2-按现有库存装备 */
  targetType: TargetType
  /** 维保对象（装备名称） */
  targetName: string
  /** 维保对象类别 */
  category: MaintenanceCategory
  /** 维保模板类型: 1-选择已有模板 2-直接上传 */
  templateType: TemplateType
  /** 维保模板ID或名称 */
  templateId: string
  /** 维保作业内容 */
  maintenanceContent: string
  /** 维保周期 */
  cycle: MaintenanceCycle
  /** 提前提醒天数 */
  reminderDays: ReminderDays
  /** 短信提醒 */
  smsReminder: boolean
  /** 执行人 */
  executor: string
  /** 启用状态: 1-启用 0-停用 */
  status: number
  /** 备注 */
  remark: string
}
