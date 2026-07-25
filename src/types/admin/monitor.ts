/** 在线用户 */
export interface OnlineUser {
  /** 会话编号 */
  sessionId: string
  /** 登录名称 */
  loginName: string
  /** 部门名称 */
  deptName: string
  /** 主机 */
  host: string
  /** 登录地点 */
  loginLocation: string
  /** 浏览器 */
  browser: string
  /** 操作系统 */
  os: string
  /** 登录时间 */
  loginTime: string
}

/** 在线用户搜索表单 */
export interface OnlineUserSearchForm {
  loginName: string
  host: string
  startTime: string
  endTime: string
}

/** CPU信息 */
export interface CpuInfo {
  /** 核心数 */
  coreNum: number
  /** 用户使用率 */
  userUsage: number
  /** 系统使用率 */
  sysUsage: number
  /** 当前空闲率 */
  idleRate: number
}

/** 内存信息 */
export interface MemoryInfo {
  /** 总内存 (GB) */
  total: number
  /** 已用内存 (GB) */
  used: number
  /** 剩余内存 (GB) */
  free: number
  /** 使用率 */
  usageRate: number
}

/** 服务器信息 */
export interface ServerInfo {
  /** 服务器名称 */
  name: string
  /** 操作系统 */
  os: string
  /** 服务器IP */
  ip: string
  /** 系统架构 */
  arch: string
}

/** JVM信息 */
export interface JvmInfo {
  /** Java名称 */
  name: string
  /** Java版本 */
  version: string
  /** 启动时间 */
  startTime: string
  /** 运行时长 */
  runTime: string
  /** 安装路径 */
  home: string
  /** 项目路径 */
  projectPath: string
  /** 运行参数 */
  runArgs: string
}

/** 磁盘状态 */
export interface DiskInfo {
  /** 盘符路径 */
  path: string
  /** 文件系统 */
  fsType: string
  /** 盘符类型 */
  type: string
  /** 总大小 (GB) */
  total: number
  /** 可用大小 (GB) */
  free: number
  /** 已用大小 (GB) */
  used: number
  /** 已用百分比 */
  usageRate: number
}

/** 服务监控数据 */
export interface ServerMonitorData {
  cpu: CpuInfo
  memory: MemoryInfo
  server: ServerInfo
  jvm: JvmInfo
  disks: DiskInfo[]
}

/** Redis基本信息 */
export interface RedisInfo {
  /** Redis版本 */
  version: string
  /** 运行模式 */
  mode: string
  /** 端口 */
  port: number
  /** 客户端数量 */
  clients: number
  /** 运行时间(天) */
  runDays: number
  /** 使用内存 */
  usedMemory: string
  /** 使用CPU */
  usedCpu: string
  /** 内存配置 */
  memoryConfig: string
  /** AOF是否开启 */
  aofEnabled: boolean
  /** RDB是否成功 */
  rdbSuccess: boolean
  /** KEY数量 */
  keyCount: number
  /** 网络入口 */
  netInput: string
  /** 网络出口 */
  netOutput: string
}

/** Redis命令统计 */
export interface RedisCommandStat {
  name: string
  value: number
}

/** Redis内存信息 */
export interface RedisMemoryInfo {
  /** 已用内存 */
  usedMemory: string
  /** 使用峰值 */
  usedMemoryPeak: string
  /** 内存碎片率 */
  memFragmentationRatio: number
  /** AOF缓冲区 */
  aofBuffer: string
  /** 输入缓冲区 */
  inputBuffer: string
  /** 输出缓冲区 */
  outputBuffer: string
}

/** 缓存监控数据 */
export interface CacheMonitorData {
  info: RedisInfo
  commandStats: RedisCommandStat[]
  memory: RedisMemoryInfo
}

/** 缓存键信息 */
export interface CacheEntry {
  /** 缓存名称 */
  cacheName: string
  /** 缓存键名 */
  key: string
  /** 缓存键值 */
  value: string
  /** 数据类型: string, map */
  dataType: string
  /** 备注 */
  remark: string
}

/** 缓存详情(Map类型) */
export interface CacheMapDetail {
  [field: string]: string
}
