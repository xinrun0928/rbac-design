/** 节假日信息 */
export interface Holiday {
  id: number
  /** 节日名称 */
  holidayName: string
  /** 开始日期 */
  startDate: string
  /** 结束日期 */
  endDate: string
  /** 备注 */
  remark: string
  /** 创建时间 */
  createTime: string
  /** 删除标记 0=未删除 1=已删除 */
  deleted: number
}

/** 节假日表单 */
export interface HolidayForm {
  id?: number
  holidayName: string
  dateRange: string[]
  remark: string
}

/** 节假日搜索条件 */
export interface HolidaySearchForm {
  /** 开始日期 */
  startDate: string
  /** 结束日期 */
  endDate: string
}
