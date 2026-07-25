import { mockMealData } from '@/mock/mealData'
import type { Meal, SearchForm } from '@/types/admin/meal'

/** 模拟网络延迟 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/** 获取套餐类型名称 */
function getTypeName(type: number): string {
  const map: Record<number, string> = {
    1: '顶节点',
    2: '交通节点',
    3: '事务中心节点',
    4: '公司企业节点'
  }
  return map[type] || ''
}

/** 获取状态名称 */
function getStatusName(status: number): string {
  return status === 1101 ? '正常' : '停用'
}

/** 格式化当前时间 */
function formatNow(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

/** 分页查询套餐 */
export async function getMeals(params: {
  page: number
  pageSize: number
  search?: SearchForm
}): Promise<{ list: Meal[]; total: number }> {
  await delay(300 + Math.random() * 400)

  let data = [...mockMealData]

  if (params.search?.name) {
    const keyword = params.search.name.trim().toLowerCase()
    data = data.filter(item => item.name.toLowerCase().includes(keyword))
  }

  if (params.search?.type !== undefined && params.search.type !== '') {
    data = data.filter(item => item.type === params.search!.type)
  }

  if (params.search?.status !== undefined && params.search.status !== '') {
    data = data.filter(item => item.status === params.search!.status)
  }

  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize

  return {
    list: data.slice(start, end),
    total: data.length
  }
}

/** 新增套餐 */
export async function addMeal(data: {
  code: string
  name: string
  type: number
  sort: number
  status: number
}): Promise<Meal> {
  await delay(400 + Math.random() * 300)

  const maxId = mockMealData.reduce((max, p) => Math.max(max, p.id), 0)

  const newMeal: Meal = {
    id: maxId + 1,
    code: data.code.toUpperCase(),
    name: data.name,
    type: data.type,
    typeName: getTypeName(data.type),
    sort: data.sort,
    status: data.status,
    statusName: getStatusName(data.status),
    creator: '当前用户',
    createTime: formatNow()
  }

  mockMealData.push(newMeal)
  return newMeal
}

/** 编辑套餐 */
export async function updateMeal(
  id: number,
  data: { code: string; name: string; type: number; sort: number; status: number }
): Promise<Meal> {
  await delay(400 + Math.random() * 300)

  const index = mockMealData.findIndex(p => p.id === id)
  if (index === -1) {
    throw new Error('套餐不存在')
  }

  const updated: Meal = {
    ...mockMealData[index],
    code: data.code.toUpperCase(),
    name: data.name,
    type: data.type,
    typeName: getTypeName(data.type),
    sort: data.sort,
    status: data.status,
    statusName: getStatusName(data.status)
  }

  mockMealData[index] = updated
  return updated
}

/** 删除套餐 */
export async function deleteMeal(id: number): Promise<void> {
  await delay(400 + Math.random() * 300)

  const index = mockMealData.findIndex(p => p.id === id)
  if (index === -1) {
    throw new Error('套餐不存在')
  }

  mockMealData.splice(index, 1)
}

/** 批量删除套餐 */
export async function batchDeleteMeals(ids: number[]): Promise<void> {
  await delay(600 + Math.random() * 400)

  ids.forEach(id => {
    const index = mockMealData.findIndex(p => p.id === id)
    if (index !== -1) {
      mockMealData.splice(index, 1)
    }
  })
}

/** 切换套餐状态 */
export async function toggleMealStatus(id: number, status: number): Promise<Meal> {
  await delay(300 + Math.random() * 200)

  const index = mockMealData.findIndex(p => p.id === id)
  if (index === -1) {
    throw new Error('套餐不存在')
  }

  mockMealData[index].status = status
  mockMealData[index].statusName = getStatusName(status)

  return mockMealData[index]
}
