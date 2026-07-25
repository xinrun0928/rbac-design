/** 套餐菜单绑定数据类型 */
export interface MealMenuBinding {
  /** 绑定ID */
  id: number
  /** 套餐ID */
  mealId: number
  /** 菜单ID */
  menuId: number
  /** 子系统ID */
  subsysId: number
  /** 创建时间 */
  createTime: string
}

/** 套餐菜单绑定表单类型 */
export interface MealMenuBindingForm {
  /** 套餐ID */
  mealId: number
  /** 菜单ID列表 */
  menuIds: number[]
  /** 子系统ID */
  subsysId: number
}
