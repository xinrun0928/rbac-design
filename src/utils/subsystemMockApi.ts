import { mockSubsystemData } from '../mock/subsystemData'
import type { Subsystem, SubsystemSearchForm } from '../types/subsystem'

/** 模拟网络延迟 */
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/** 格式化当前时间 */
function formatNow(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

/** 分页查询子系统 */
export async function getSubsystems(params: {
  page: number
  pageSize: number
  search?: SubsystemSearchForm
}): Promise<{ list: Subsystem[]; total: number }> {
  await delay(300 + Math.random() * 400)

  let data = mockSubsystemData.filter(item => item.deleted === 0)

  if (params.search?.subsysCode) {
    const keyword = params.search.subsysCode.trim().toLowerCase()
    data = data.filter(item => item.subsysCode.toLowerCase().includes(keyword))
  }

  if (params.search?.subsysName) {
    const keyword = params.search.subsysName.trim().toLowerCase()
    data = data.filter(item => item.subsysName.toLowerCase().includes(keyword))
  }

  if (params.search?.status !== undefined && params.search.status !== '') {
    data = data.filter(item => item.status === params.search!.status)
  }

  data.sort((a, b) => a.displayOrder - b.displayOrder)

  const start = (params.page - 1) * params.pageSize
  const end = start + params.pageSize

  return {
    list: data.slice(start, end),
    total: data.length
  }
}

/** 新增子系统 */
export async function addSubsystem(data: {
  subsysCode: string
  subsysName: string
  subsysShortName: string
  pathPrefix?: string
  tablePrefix?: string
  displayOrder: number
  isHidden: boolean
  status: number
  remark: string
  icon?: string
  color?: string
}): Promise<Subsystem> {
  await delay(400 + Math.random() * 300)

  const maxId = mockSubsystemData.reduce((max, p) => Math.max(max, p.subsysId), 0)

  const newSubsystem: Subsystem = {
    subsysId: maxId + 1,
    subsysCode: data.subsysCode.toUpperCase(),
    subsysName: data.subsysName,
    subsysShortName: data.subsysShortName,
    pathPrefix: data.pathPrefix || '',
    tablePrefix: data.tablePrefix || '',
    displayOrder: data.displayOrder,
    isHidden: data.isHidden,
    status: data.status,
    remark: data.remark,
    icon: data.icon || '',
    color: data.color || '',
    creater: '当前用户',
    createTime: formatNow(),
    updater: '',
    updateTime: formatNow(),
    deleted: 0,
    signature: '',
    signatureVersion: 0
  }

  mockSubsystemData.push(newSubsystem)
  return newSubsystem
}

/** 编辑子系统 */
export async function updateSubsystem(
  id: number,
  data: {
    subsysCode: string
    subsysName: string
    subsysShortName: string
    pathPrefix?: string
    tablePrefix?: string
    displayOrder: number
    isHidden: boolean
    status: number
    remark: string
    icon?: string
    color?: string
  }
): Promise<Subsystem> {
  await delay(400 + Math.random() * 300)

  const index = mockSubsystemData.findIndex(p => p.subsysId === id)
  if (index === -1) {
    throw new Error('子系统不存在')
  }

  const updated: Subsystem = {
    ...mockSubsystemData[index],
    subsysCode: data.subsysCode.toUpperCase(),
    subsysName: data.subsysName,
    subsysShortName: data.subsysShortName,
    pathPrefix: data.pathPrefix || mockSubsystemData[index].pathPrefix,
    tablePrefix: data.tablePrefix || mockSubsystemData[index].tablePrefix,
    displayOrder: data.displayOrder,
    isHidden: data.isHidden,
    status: data.status,
    remark: data.remark,
    icon: data.icon || mockSubsystemData[index].icon,
    color: data.color || mockSubsystemData[index].color,
    updater: '当前用户',
    updateTime: formatNow()
  }

  mockSubsystemData[index] = updated
  return updated
}

/** 删除子系统（逻辑删除） */
export async function deleteSubsystem(id: number): Promise<void> {
  await delay(400 + Math.random() * 300)

  const index = mockSubsystemData.findIndex(p => p.subsysId === id)
  if (index === -1) {
    throw new Error('子系统不存在')
  }

  mockSubsystemData[index].deleted = 1
}

/** 批量删除子系统 */
export async function batchDeleteSubsystems(ids: number[]): Promise<void> {
  await delay(600 + Math.random() * 400)

  ids.forEach(id => {
    const index = mockSubsystemData.findIndex(p => p.subsysId === id)
    if (index !== -1) {
      mockSubsystemData[index].deleted = 1
    }
  })
}

/** 切换子系统状态 */
export async function toggleSubsystemStatus(id: number, status: number): Promise<Subsystem> {
  await delay(300 + Math.random() * 200)

  const index = mockSubsystemData.findIndex(p => p.subsysId === id)
  if (index === -1) {
    throw new Error('子系统不存在')
  }

  mockSubsystemData[index].status = status
  mockSubsystemData[index].updater = '当前用户'
  mockSubsystemData[index].updateTime = formatNow()

  return mockSubsystemData[index]
}
