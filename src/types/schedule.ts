/**
 * 模块级排期相关类型定义
 * 数据来源：模块级排期v4.xlsx（难度系数与人天表）
 */

/** 复杂系数 */
export type ComplexityLevel = '简单(1)' | '中等(2)' | '复杂(3)'

/** 排期状态（按当前日期动态判定） */
export type ScheduleStatus = '未开始' | '进行中' | '已完成'

/** 单个功能项排期记录 */
export interface ScheduleItem {
  /** 序号 */
  id: number
  /** 系统名称 */
  systemName: string
  /** 子系统模块 */
  subsystemName: string
  /** 模块名称（无模块层时取子系统名） */
  moduleName: string
  /** 功能计数项名称 */
  itemName: string
  /** 复杂系数 */
  complexity: ComplexityLevel
  /** 预估人天 */
  personDays: number
  /** 预计开始时间 */
  startDate: string
  /** 预计结束时间 */
  endDate: string
  /** 研发团队（可能含协作，如 B组+C组） */
  team: string
}

/** 模块里程碑 */
export interface ScheduleMilestone {
  /** 里程碑日期 */
  date: string
  /** 里程碑标题 */
  title: string
}

/** 模块级汇总数据 */
export interface ScheduleModule {
  /** 唯一标识（系统/子系统/模块） */
  key: string
  /** 系统名称 */
  systemName: string
  /** 子系统模块 */
  subsystemName: string
  /** 模块名称 */
  moduleName: string
  /** 功能项数量 */
  itemCount: number
  /** 预估人天合计 */
  personDays: number
  /** 预计开始时间 */
  startDate: string
  /** 预计结束时间 */
  endDate: string
  /** 参与团队（去重后） */
  teams: string[]
  /** 团队展示文本 */
  teamText: string
  /** 功能项明细 */
  items: ScheduleItem[]
  /** 完成进度（0-100） */
  progress?: number
  /** 模块里程碑 */
  milestones?: ScheduleMilestone[]
}

/** 研发团队信息 */
export interface ScheduleTeam {
  /** 组号 */
  name: string
  /** 前端 */
  frontend: string
  /** 后端 */
  backend: string
}
