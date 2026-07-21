export interface DictData {
  dictId: number
  dictType: string
  dictLabel: string
  dictValue: string
  dictCode: string
  displayOrder: number
  dictClass: string | null
  isDefault: number
  status: number
  remark: string | null
  creater: string | null
  updater: string | null
  createTime: string
  updateTime: string
  deleted: number
  signature: string | null
  signatureVersion: number
}

export interface DictType {
  dictType: string
  dictTypeName: string
  count: number
  remark: string
  status: number
  createTime: string
}

export interface DictDataSearchForm {
  dictLabel: string
  dictCode: string
  status: number | ''
}
