import type { MenuItem } from '@/config/menu'

export type MenuStatus = NonNullable<MenuItem['status']>

export interface MenuProgress {
  total: number
  done: number
  doing: number
  todo: number
  percent: number
}

/**
 * 递归收集叶子菜单（没有 children 的菜单项）
 * @param menus 菜单列表
 * @returns 叶子菜单列表
 */
export function getLeafMenus(menus: MenuItem[]): MenuItem[] {
  const result: MenuItem[] = []

  const collect = (list: MenuItem[]) => {
    list.forEach(item => {
      if (item.children?.length) {
        collect(item.children)
        return
      }
      result.push(item)
    })
  }

  collect(menus)
  return result
}

/**
 * 获取菜单完成状态，未配置时默认按 todo 处理
 * @param item 菜单项
 * @returns 完成状态
 */
export function getMenuStatus(item: MenuItem): MenuStatus {
  return item.status || 'todo'
}

/**
 * 计算菜单完成度
 * @param menus 菜单列表
 * @returns 完成度统计数据
 */
export function calcMenuProgress(menus: MenuItem[]): MenuProgress {
  const leaves = getLeafMenus(menus)
  const total = leaves.length
  const done = leaves.filter(item => getMenuStatus(item) === 'done').length
  const doing = leaves.filter(item => getMenuStatus(item) === 'doing').length
  const todo = leaves.filter(item => getMenuStatus(item) === 'todo').length
  const percent = total ? Math.round((done / total) * 100) : 0
  return { total, done, doing, todo, percent }
}

/**
 * 状态文案
 * @param status 完成状态
 * @returns 展示文案
 */
export function statusText(status: MenuStatus): string {
  const statusMap: Record<MenuStatus, string> = {
    done: '✓',
    doing: '开发中',
    todo: '未开始'
  }
  return statusMap[status]
}
