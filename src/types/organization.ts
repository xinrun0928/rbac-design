/** 组织机构数据接口 */
export interface Organization {
  orgId: number
  orgName: string
  orgCode: string
  parentId: number
  ancestors: string
  level: number
  areaCode: string
  orgType: string
  orgLevel: string
  introduce: string
  contactPerson: string
  contactPhone: string
  contactFax: string
  contactEmail: string
  externalOrgId: string
  displayOrder: number
  status: number
  creater: string
  createTime: string
  updater: string
  updateTime: string
  deleted: number
  signature: string
  signatureVersion: number
  areaLevel: number | null
  areaCodes: string
  areaNames: string
  // 关联的套餐类型（多选）
  packageTypes: number[]
}

/** 组织树节点 */
export interface OrgTreeNode {
  orgId: number
  orgName: string
  orgCode: string
  parentId: number
  packageTypes: number[]
  children?: OrgTreeNode[]
}

/** 搜索表单 */
export interface OrgSearchForm {
  orgName?: string
  orgCode?: string
  status?: number | ''
}

/** 组织表单（新增/编辑） */
export interface OrgForm {
  orgId?: number
  orgName: string
  orgCode: string
  parentId: number
  orgType: string
  orgLevel: string
  areaCode: string
  contactPerson: string
  contactPhone: string
  contactEmail: string
  introduce: string
  displayOrder: number
  status: number
  packageTypes: number[]
}

/** 状态映射 */
export const ORG_STATUS_MAP: Record<number, { label: string; color: string }> = {
  1101: { label: '正常', color: '#67C23A' },
  1001: { label: '停用', color: '#909399' }
}
