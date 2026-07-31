/** 题型分布明细 */
export interface QuestionTypeItem {
  /** 题型（选择题/判断题/简答题等） */
  type: string
  /** 题量 */
  count: number
  /** 每题分值 */
  score: number
}

/** 考核题目选项 */
export interface QuestionOptionItem {
  /** 选项内容 */
  content: string
  /** 是否为正确答案 */
  isCorrect: boolean
  /** 从题库选中的临时值（仅表单使用） */
  bankValue?: string
}

/** 考核题目 */
export interface ExamQuestionItem {
  /** 题目内容 */
  content: string
  /** 题目选项 */
  options: QuestionOptionItem[]
}

/** 装备操作考核模板 */
export interface ExamTemplate {
  /** 模板ID */
  templateId: string
  /** 考核模板名称 */
  templateName: string
  /** 考核模板编号 */
  templateCode: string
  /** 关联装备类型 */
  equipmentType: string
  /** 考核时长（分钟） */
  duration: number
  /** 及格分数 */
  passScore: number
  /** 总分 */
  totalScore: number
  /** 题型分布 */
  questionTypes: QuestionTypeItem[]
  /** 题目总数 */
  questionCount: number
  /** 启用状态: 1-已启用 0-未启用 */
  status: number
  /** 备注 */
  remark: string
  /** 创建人 */
  createBy: string
  /** 创建时间 */
  createTime: string
  /** 最近修改时间 */
  updateTime: string
}

/** 装备操作考核模板搜索表单 */
export interface ExamTemplateSearchForm {
  /** 考核模板名称 */
  templateName: string
}

/** 装备操作考核模板新增/编辑表单 */
export interface ExamTemplateForm {
  /** 考核模板名称 */
  templateName: string
  /** 适用类型: 1-按种类选择 2-按现有库存装备 */
  applyType: number
  /** 考核时长（分钟） */
  duration: number
  /** 启用状态: 1-启用 0-停用 */
  status: number
  /** 备注 */
  remark: string
  /** 考核题目 */
  questions: ExamQuestionItem[]
  /** 按种类选择时选中的装备种类ID（applyType=1 时使用） */
  selectedCategories?: string[]
  /** 按现有库存装备时选中的装备名称（applyType=2 时使用） */
  selectedEquipment?: string[]
}
