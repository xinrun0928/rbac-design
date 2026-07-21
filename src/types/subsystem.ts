/** 子系统数据类型 */
export interface Subsystem {
  subsysId: number
  subsysCode: string
  subsysName: string
  subsysShortName: string
  pathPrefix: string
  tablePrefix: string
  displayOrder: number
  isHidden: boolean
  status: number
  remark: string
  creater: string
  createTime: string
  updater: string
  updateTime: string
  deleted: number
  signature: string
  signatureVersion: number
}

/** 子系统表单类型 */
export interface SubsystemForm {
  subsysId?: number
  subsysCode: string
  subsysName: string
  subsysShortName: string
  pathPrefix: string
  tablePrefix: string
  displayOrder: number
  isHidden: boolean
  status: number
  remark: string
}

/** 搜索表单类型 */
export interface SubsystemSearchForm {
  subsysCode: string
  subsysName: string
  status: string | number
}
