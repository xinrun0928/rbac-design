import { mockOrganizationData } from '../mock/organizationData'
import type { Organization, OrgSearchForm } from '../types/organization'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

function formatNow(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

/** 查询组织列表（支持分页 + 按父级筛选） */
export async function getOrgList(params: {
  page: number
  pageSize: number
  parentId?: number
  search?: OrgSearchForm
}): Promise<{ list: Organization[]; total: number }> {
  await delay(300 + Math.random() * 400)

  let data = mockOrganizationData.filter(d => d.deleted === 0)

  // 按父级筛选
  if (params.parentId !== undefined && params.parentId !== -1) {
    data = data.filter(d => d.parentId === params.parentId)
  }

  // 搜索过滤
  if (params.search?.orgName) {
    const kw = params.search.orgName.trim().toLowerCase()
    data = data.filter(d => d.orgName.toLowerCase().includes(kw))
  }
  if (params.search?.orgCode) {
    const kw = params.search.orgCode.trim().toLowerCase()
    data = data.filter(d => d.orgCode.toLowerCase().includes(kw))
  }
  if (params.search?.status !== undefined && params.search.status !== '') {
    data = data.filter(d => d.status === params.search!.status)
  }

  const total = data.length
  const start = (params.page - 1) * params.pageSize
  const list = data.slice(start, start + params.pageSize)

  return { list, total }
}

/** 获取全部组织（用于树结构） */
export async function getOrgTree(): Promise<Organization[]> {
  await delay(200 + Math.random() * 200)
  return mockOrganizationData.filter(d => d.deleted === 0)
}

/** 新增组织 */
export async function addOrganization(data: Partial<Organization>): Promise<Organization> {
  await delay(400 + Math.random() * 300)

  const maxId = mockOrganizationData.reduce((m, d) => Math.max(m, d.orgId), 0)
  const parent = data.parentId ? mockOrganizationData.find(d => d.orgId === data.parentId) : null
  const ancestors = parent ? `${parent.ancestors},${parent.orgId}` : '0'
  const level = parent ? parent.level + 1 : 0

  const newItem: Organization = {
    orgId: maxId + 1,
    orgName: data.orgName || '',
    orgCode: data.orgCode || '',
    parentId: data.parentId || 0,
    ancestors,
    level,
    areaCode: data.areaCode || '',
    orgType: data.orgType || '0',
    orgLevel: data.orgLevel || '',
    introduce: data.introduce || '',
    contactPerson: data.contactPerson || '',
    contactPhone: data.contactPhone || '',
    contactFax: '',
    contactEmail: data.contactEmail || '',
    externalOrgId: '',
    displayOrder: data.displayOrder || 0,
    status: data.status || 1101,
    creater: '当前用户',
    createTime: formatNow(),
    updater: '当前用户',
    updateTime: formatNow(),
    deleted: 0,
    signature: '',
    signatureVersion: 0,
    areaLevel: null,
    areaCodes: '',
    areaNames: '',
    packageTypes: data.packageTypes || []
  }

  mockOrganizationData.push(newItem)
  return newItem
}

/** 编辑组织 */
export async function updateOrganization(orgId: number, data: Partial<Organization>): Promise<Organization> {
  await delay(400 + Math.random() * 300)

  const index = mockOrganizationData.findIndex(d => d.orgId === orgId)
  if (index === -1) throw new Error('组织不存在')

  const updated = {
    ...mockOrganizationData[index],
    ...data,
    updater: '当前用户',
    updateTime: formatNow()
  }

  mockOrganizationData[index] = updated
  return updated
}

/** 删除组织（逻辑删除） */
export async function deleteOrganization(orgId: number): Promise<void> {
  await delay(400 + Math.random() * 300)

  const index = mockOrganizationData.findIndex(d => d.orgId === orgId)
  if (index === -1) throw new Error('组织不存在')

  mockOrganizationData[index].deleted = 1
}

/** 批量删除 */
export async function batchDeleteOrganizations(orgIds: number[]): Promise<void> {
  await delay(600 + Math.random() * 400)

  orgIds.forEach(orgId => {
    const index = mockOrganizationData.findIndex(d => d.orgId === orgId)
    if (index !== -1) {
      mockOrganizationData[index].deleted = 1
    }
  })
}
