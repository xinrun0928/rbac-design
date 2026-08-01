/**
 * 模块级排期共享工具函数
 */
import { mockScheduleTeams } from '@/mock/schedule/scheduleData'
import type { ScheduleModule } from '@/types/schedule'

export interface ModuleTeamSegment {
  team: string
  ratio: number
  color: string
}

/** 团队颜色映射 */
export const teamColorMap: Record<string, string> = {
  'A组': '#409EFF',
  'B组': '#67C23A',
  'C组': '#E6A23C',
  'D组': '#F56C6C',
  'E组': '#909399'
}

/** 团队颜色 */
export function teamColor(team: string): string {
  return teamColorMap[team] || '#409EFF'
}

/** 按团队人天占比生成模块色条分段 */
export function moduleTeamSegments(mod: ScheduleModule): ModuleTeamSegment[] {
  if (!mod.teams.length) return [{ team: 'A组', ratio: 1, color: teamColor('A组') }]

  const teamDays = new Map(mod.teams.map(team => [team, 0]))
  for (const item of mod.items) {
    const teams = item.team.split('+').filter(Boolean)
    if (!teams.length) continue
    const share = item.personDays / teams.length
    for (const team of teams) teamDays.set(team, (teamDays.get(team) ?? 0) + share)
  }

  const total = Array.from(teamDays.values()).reduce((sum, days) => sum + days, 0)
  const fallbackRatio = 1 / mod.teams.length
  return mod.teams.map(team => ({
    team,
    ratio: total > 0 ? (teamDays.get(team) ?? 0) / total : fallbackRatio,
    color: teamColor(team)
  }))
}

/** 团队成员姓名（如：李圳飞 / 谢绍标） */
export function teamMembers(team: string): string {
  const t = mockScheduleTeams.find(x => x.name === team)
  return t && t.frontend ? `${t.frontend} / ${t.backend}` : ''
}

/** 团队 tooltip 文本 */
export function teamTooltipText(teams: string[]): string {
  return teams.map(t => t + (teamMembers(t) ? `（${teamMembers(t)}）` : '')).join('、')
}

/** 日期排序方法 */
export function sortByDate(a: { startDate?: string; endDate?: string }, b: { startDate?: string; endDate?: string }): number {
  const aDate = a.startDate || a.endDate || ''
  const bDate = b.startDate || b.endDate || ''
  return aDate.localeCompare(bDate)
}

export const DAY_MS = 86400000

/** 解析日期字符串为 UTC 时间戳 */
export function parseDate(s: string): number {
  const [y, m, d] = s.split('-').map(Number)
  return Date.UTC(y, m - 1, d)
}

export const today = (() => {
  const d = new Date()
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())
})()

/** 模块状态 */
export function getStatus(mod: ScheduleModule): string {
  const s = parseDate(mod.startDate)
  const e = parseDate(mod.endDate)
  if (today < s) return '未开始'
  if (today > e) return '已完成'
  return '进行中'
}

/** 状态 tag 类型 */
export function statusType(status: string): 'info' | 'warning' | 'success' {
  if (status === '未开始') return 'info'
  if (status === '已完成') return 'success'
  return 'warning'
}
