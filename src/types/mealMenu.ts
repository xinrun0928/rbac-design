/** 套餐菜单绑定 */
export interface MealMenuBinding {
  id: number
  mealId: number
  menuId: number
  subsysId: number
  createTime: string
}

/** 套餐菜单绑定表单 */
export interface MealMenuBindingForm {
  mealId: number
  menuIds: number[]
  subsysId: number
}
