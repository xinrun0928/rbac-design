export interface Area {
  id: number
  code: string
  name: string
  level: string
  parentCode: string | null
  displayOrder: number
  deleted: number
  signature: string | null
  signatureVersion: number
  children?: Area[]
}

export interface AreaSearchForm {
  name: string
  code: string
  level: string
}
