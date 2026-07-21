import type { MealMenuBinding } from '../types/mealMenu'

/** 模拟网络延迟 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 模拟绑定数据存储
const mockMealMenuBindings: MealMenuBinding[] = [
  // 套餐1（省交通本级）绑定一些菜单
  { id: 1, mealId: 1, menuId: 3000001, subsysId: 1, createTime: '2026-07-21 10:00:00' },
  { id: 2, mealId: 1, menuId: 3000002, subsysId: 1, createTime: '2026-07-21 10:00:00' },
  { id: 3, mealId: 1, menuId: 4000001, subsysId: 2, createTime: '2026-07-21 10:00:00' },
  { id: 4, mealId: 1, menuId: 2061409863313002497, subsysId: 99, createTime: '2026-07-21 10:00:00' },
]

/** 获取套餐绑定的菜单ID列表 */
export async function getMealMenuIds(mealId: number): Promise<number[]> {
  await delay(200 + Math.random() * 200)
  return mockMealMenuBindings
    .filter(item => item.mealId === mealId)
    .map(item => item.menuId)
}

/** 保存套餐菜单绑定 */
export async function saveMealMenuBinding(mealId: number, menuIds: number[], subsysId: number): Promise<void> {
  await delay(300 + Math.random() * 300)

  // 删除该套餐原有的绑定
  const indicesToRemove: number[] = []
  mockMealMenuBindings.forEach((item, index) => {
    if (item.mealId === mealId) {
      indicesToRemove.unshift(index)
    }
  })
  indicesToRemove.forEach(index => mockMealMenuBindings.splice(index, 1))

  // 添加新的绑定
  const maxId = mockMealMenuBindings.reduce((max, item) => Math.max(max, item.id), 0)
  menuIds.forEach((menuId, index) => {
    mockMealMenuBindings.push({
      id: maxId + index + 1,
      mealId,
      menuId,
      subsysId,
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    })
  })
}

/** 获取套餐绑定的菜单数量 */
export async function getMealMenuCount(mealId: number): Promise<number> {
  await delay(100 + Math.random() * 100)
  return mockMealMenuBindings.filter(item => item.mealId === mealId).length
}
