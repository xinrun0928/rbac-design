/** 应用信息数据类型 */
export interface AppInfo {
  /** 应用ID */
  appId: number
  /** 应用编码 */
  appCode: string
  /** 应用名称 */
  appName: string
  /** 平台: 1-iOS, 2-Android, 3-两端 */
  platform: number
  /** Bundle ID（iOS）/ 包名（Android） */
  bundleId: string
  /** 最低版本号 */
  minVersionCode: string
  /** 状态: 1-正常, 0-停用 */
  status: number
  /** 最新APK下载地址 */
  latestApkUrl: string
  /** 备注 */
  remark: string
  /** 创建人 */
  creater: string
  /** 创建时间 */
  createTime: string
  /** 更新人 */
  updater: string
  /** 更新时间 */
  updateTime: string
}

/** 应用发布日志数据类型 */
export interface AppPublishLog {
  /** 发布ID */
  publishId: number
  /** 应用ID */
  appId: number
  /** 平台: 1-iOS, 2-Android, 3-两端 */
  platform: number
  /** 版本号 */
  versionCode: string
  /** 版本名称 */
  versionName: string
  /** WGT版本（热更新） */
  wgtVersion: string
  /** 更新类型: 1-整包更新, 2-热更新 */
  updateType: number
  /** 下载地址 */
  downloadUrl: string
  /** 发布说明 */
  releaseNotes: string
  /** 是否强制更新: 0-否, 1-是 */
  isForce: number
  /** 文件大小（字节） */
  fileSize: number
  /** 文件MD5校验值 */
  fileMd5: string
  /** 发布人 */
  publisher: string
  /** 发布原因 */
  publishReason: string
  /** 发布状态: 0-待发布, 1-已发布, 2-已撤回 */
  publishStatus: number
  /** 发布时间 */
  publishTime: string
  /** 创建人 */
  creater: string
  /** 创建时间 */
  createTime: string
  /** 更新人 */
  updater: string
  /** 更新时间 */
  updateTime: string
}
