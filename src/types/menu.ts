/** 菜单数据类型 */
export interface Menu {
  menuId: number
  parentId: number
  menuName: string
  menuCode: string
  menuType: number
  contentType: number
  subsysId: number
  icon: string
  path: string
  component: string
  displayOrder: number
  status: number
  remark: string
  ext: string
  hidden: number
  creater: string
  createTime: string
  updater: string
  updateTime: string
  deleted: number
  signature: string
  signatureVersion: number
  // 前端辅助字段
  children?: Menu[]
}

/** 菜单表单类型 */
export interface MenuForm {
  menuId?: number
  parentId: number
  menuName: string
  menuCode: string
  menuType: number
  contentType: number
  subsysId: number
  icon: string
  path: string
  component: string
  displayOrder: number
  status: number
  remark: string
  ext: string
  hidden: number
}

/** 搜索表单类型 */
export interface MenuSearchForm {
  menuName: string
  menuCode: string
  status: string | number
}

/** 菜单类型常量 */
export const MENU_TYPE_MAP: Record<number, { label: string; color: string }> = {
  0: { label: '目录', color: '#409EFF' },
  1: { label: '菜单', color: '#67C23A' },
  2: { label: '按钮', color: '#E6A23C' },
  99: { label: '导航', color: '#9B59B6' }
}

/** 内容类型常量 */
export const CONTENT_TYPE_MAP: Record<number, { label: string; color: string }> = {
  1: { label: '菜单页面', color: '#409EFF' },
  2: { label: '大屏', color: '#67C23A' },
  3: { label: '嵌入页面', color: '#E6A23C' },
  4: { label: '外部链接', color: '#909399' }
}
