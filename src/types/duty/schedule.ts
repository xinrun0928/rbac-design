/** 排班规则 */
export interface ScheduleRule {
  id: number
  ruleName: string
  sortOrder: number
  createTime: string
}

export interface ScheduleRuleForm {
  id?: number
  ruleName: string
  sortOrder: number
}
