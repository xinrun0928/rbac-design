export interface Config {
  configId: number
  configName: string
  configKey: string
  configValue: string
  configType: string
  createBy: string
  createTime: string
  updateBy: string
  updateTime: string
  remark: string | null
}

export interface ConfigSearchForm {
  configName: string
  configKey: string
  configType: string
}
