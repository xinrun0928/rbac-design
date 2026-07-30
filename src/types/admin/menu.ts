/** 菜单数据类型 */
export interface Menu {
  /** 菜单ID */
  menuId: number
  /** 父菜单ID */
  parentId: number
  /** 菜单名称 */
  menuName: string
  /** 菜单编码 */
  menuCode: string
  /** 菜单类型: 0-目录, 1-菜单, 2-按钮, 99-导航 */
  menuType: number
  /** 内容类型: 1-菜单页面, 2-大屏, 3-嵌入页面, 4-外部链接 */
  contentType: number
  /** 所属子系统ID */
  subsysId: number
  /** 图标名称 */
  icon: string
  /** 路由路径 */
  path: string
  /** 组件路径 */
  component: string
  /** 显示排序 */
  displayOrder: number
  /** 状态: 1101-正常, 1001-停用 */
  status: number
  /** 备注 */
  remark?: string
  /** 扩展信息（JSON） */
  ext: string
  /** 是否隐藏: 0-显示, 1-隐藏 */
  hidden: number
  /** 创建时间 */
  createTime: string
  /** 子菜单列表（前端辅助字段） */
  children?: Menu[]
}

/** 菜单表单类型 */
export interface MenuForm {
  /** 菜单ID（编辑时必填） */
  menuId?: number
  /** 父菜单ID */
  parentId: number
  /** 菜单名称 */
  menuName: string
  /** 菜单编码 */
  menuCode: string
  /** 菜单类型: 0-目录, 1-菜单, 2-按钮, 99-导航 */
  menuType: number
  /** 内容类型: 1-菜单页面, 2-大屏, 3-嵌入页面, 4-外部链接 */
  contentType: number
  /** 所属子系统ID */
  subsysId: number
  /** 图标名称 */
  icon: string
  /** 路由路径 */
  path: string
  /** 组件路径 */
  component: string
  /** 显示排序 */
  displayOrder: number
  /** 状态: 1101-正常, 1001-停用 */
  status: number
  /** 备注 */
  remark: string
  /** 扩展信息（JSON） */
  ext: string
  /** 是否隐藏: 0-显示, 1-隐藏 */
  hidden: number
}

/** 菜单搜索表单类型 */
export interface MenuSearchForm {
  /** 菜单名称 */
  menuName: string
  /** 菜单编码 */
  menuCode: string
  /** 状态筛选 */
  status: string | number
}

/** 菜单类型常量映射 */
export const MENU_TYPE_MAP: Record<number, { label: string; color: string }> = {
  99: { label: '导航', color: '#9B59B6' },
  0: { label: '目录', color: '#409EFF' },
  1: { label: '菜单', color: '#67C23A' },
  2: { label: '按钮', color: '#E6A23C' }
}

/** 菜单类型下拉选项（按指定顺序） */
export const MENU_TYPE_OPTIONS = [
  { value: 99, label: '导航', color: '#9B59B6' },
  { value: 0, label: '目录', color: '#409EFF' },
  { value: 1, label: '菜单', color: '#67C23A' },
  { value: 2, label: '按钮', color: '#E6A23C' }
]

/** 内容类型常量映射 */
export const CONTENT_TYPE_MAP: Record<number, { label: string; color: string }> = {
  1: { label: '菜单页面', color: '#409EFF' },
  2: { label: '大屏', color: '#67C23A' },
  3: { label: '嵌入页面', color: '#E6A23C' },
  4: { label: '外部链接', color: '#909399' }
}
