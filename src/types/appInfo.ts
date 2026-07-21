export interface AppInfo {
  appId: number
  appCode: string
  appName: string
  platform: number
  bundleId: string
  minVersionCode: string
  status: number
  latestApkUrl: string
  remark: string
  creater: string
  createTime: string
  updater: string
  updateTime: string
}

export interface AppPublishLog {
  publishId: number
  appId: number
  platform: number
  versionCode: string
  versionName: string
  wgtVersion: string
  updateType: number
  downloadUrl: string
  releaseNotes: string
  isForce: number
  fileSize: number
  fileMd5: string
  publisher: string
  publishReason: string
  publishStatus: number
  publishTime: string
  creater: string
  createTime: string
  updater: string
  updateTime: string
}
