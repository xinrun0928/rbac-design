/** 维保状态 */
export type MaintenanceStatus = '待维保' | '已维保'

/** 设备状态 */
export type DeviceStatus = '在库' | '在用' | '维修' | '报废'

/** 来源类型 */
export type SourceType = '库存盘点' | '采购' | '调拨'

/** 出库类型 */
export type OutType = '调出' | '报废' | '盘亏'

/** 入库类型 */
export type InType = '调入' | '采购' | '盘盈' | '归还'

/** 附件关联类型 */
export type AttachmentType = '全部' | '仅图片' | '仅文档'

/** 过期处理方式 */
export type ExpireAction = '自动延期' | '自动停用' | '通知管理员'

/** 品类汇总 - 装备/物资汇总项 */
export interface InventorySummary {
  /** ID */
  id: string
  /** 装备/物资名称 */
  name: string
  /** 类型（分类/子分类） */
  type: string
  /** 型号规格 */
  spec: string
  /** 库存数量（当前/总量） */
  stockQuantity: string
  /** 单位 */
  unit: string
  /** 维保状态 */
  maintenanceStatus: MaintenanceStatus
  /** 待维保数量 */
  pendingCount?: number
  /** 存放位置 */
  location: string
  /** 负责单位 */
  department: string
  /** 最近维保日期 */
  lastMaintenanceDate: string
  /** 下次维保日期 */
  nextMaintenanceDate: string
  /** 物资分类（用于顶部筛选） */
  category: string
}

/** 物资明细 - 单个设备/物资项 */
export interface InventoryDetail {
  /** ID */
  id: string
  /** 装备/物资名称 */
  name: string
  /** 装备/物资编号 */
  code: string
  /** 序列号 */
  serialNumber: string
  /** 种类 */
  category: string
  /** 型号规格 */
  spec: string
  /** 单位 */
  unit: string
  /** 装备/物资保险（保险期限） */
  insurance: string
  /** 保险是否即将过期 */
  insuranceExpiring?: boolean
  /** 保险是否已过期 */
  insuranceExpired?: boolean
  /** 维保状态 */
  maintenanceStatus: MaintenanceStatus
  /** 待维保数量 */
  pendingCount?: number
  /** 存放位置 */
  location: string
  /** 负责单位 */
  department: string
  /** 最近维保日期 */
  lastMaintenanceDate: string
  /** 下次维保日期 */
  nextMaintenanceDate: string
}

/** 设备详情 - 单个设备编号记录 */
export interface DeviceRecord {
  /** 装备/物资编号 */
  code: string
  /** 入库日期 */
  inDate: string
  /** 调用次数 */
  useCount: number
  /** 状态 */
  status: DeviceStatus
  /** 维保状态 */
  maintenanceStatus: MaintenanceStatus | '-'
  /** 相关附件 */
  attachments?: string[]
  /** 最近维保日期 */
  lastMaintenanceDate: string
  /** 下次维保日期 */
  nextMaintenanceDate: string
  /** 采购日期 */
  purchaseDate: string
  /** 生产/有效期 */
  validityPeriod: string
}

/** 出入库记录 */
export interface IoRecord {
  /** 日期 */
  date: string
  /** 时间 */
  time: string
  /** 类型（入库/采购 + 出库/报废） */
  type: string
  /** 操作类型颜色 */
  typeColor: 'success' | 'danger'
  /** 数量 */
  quantity: number
  /** 操作人 */
  operator: string
  /** 联系电话 */
  phone: string
  /** 备注 */
  remark: string
  /** 相关附件 */
  attachment?: string
  /** 装备/物资编号列表 */
  codes: string[]
  /** 是否可展开更多编号 */
  hasMore?: boolean
}

/** 设备入库表单 */
export interface DeviceInForm {
  /** 装备/物资名称 */
  name: string
  /** 序列号 */
  serialNumber: string
  /** 来源 */
  source: SourceType
  /** 型号规格 */
  spec: string
  /** 单位 */
  unit: string
  /** 装备/物资保险 */
  insurance: string
  /** 暂无保险 */
  noInsurance: boolean
  /** 存放位置 */
  location: string
  /** 相关附件 */
  attachments: string[]
}

/** 批量入库表单 */
export interface BatchInForm {
  /** 模板文件 */
  file?: File
}

/** 权限管理表单 */
export interface PermissionForm {
  /** 权限配置名称 */
  name: string
  /** 关联附件类型 */
  attachmentType: AttachmentType
  /** 授权对象类型 */
  targetObjectType: string
  /** 权限角色 */
  role: string
  /** 允许操作类型 */
  operations: string[]
  /** 装备范围明细 */
  scope: string
  /** 生效时间 */
  effectiveTime: string
  /** 失效时间 */
  expireTime: string
  /** 过期处理方式 */
  expireAction: ExpireAction
  /** 授权人 */
  grantor: string
  /** 授权时间 */
  grantTime: string
}

/** 入库表单 */
export interface StockInForm {
  /** 入库类型 */
  type: InType
  /** 装备/物资编号列表 */
  codes: string[]
  /** 备注 */
  remark: string
  /** 相关附件 */
  attachments: string[]
}

/** 出库表单 */
export interface StockOutForm {
  /** 出库类型 */
  type: OutType
  /** 装备/物资编号列表 */
  codes: string[]
  /** 备注 */
  remark: string
  /** 相关附件 */
  attachments: string[]
}

/** 维保记录状态 */
export type MaintenanceRecordStatus = '待维保' | '已完成'

/** 维保结果 */
export type MaintenanceResult = '正常' | '存在故障' | '-'

/** 维保记录 */
export interface MaintenanceRecord {
  /** 维保日期 */
  date: string
  /** 维保单编号 */
  code: string
  /** 状态 */
  status: MaintenanceRecordStatus
  /** 维保结果 */
  result: MaintenanceResult
  /** 维保人 */
  maintainer: string
  /** 相关附件 */
  attachments?: string[]
}

/** 保险续期记录状态 */
export type InsuranceStatus = '即将过期' | '已过期' | '有效'

/** 保险续期记录 */
export interface InsuranceRecord {
  /** 保险有效期 */
  period: string
  /** 续保登记日期 */
  registerDate: string
  /** 保单编号 */
  policyCode: string
  /** 状态 */
  status: InsuranceStatus
  /** 维保人 */
  maintainer: string
  /** 相关附件 */
  attachments?: string[]
  /** 备注 */
  remark: string
}

/** 物资明细详情 - 设备信息 */
export interface MaterialDetailInfo {
  /** 名称 */
  name: string
  /** 类型 */
  type: string
  /** 型号规格 */
  spec: string
  /** 维保状态 */
  maintenanceStatus: string
  /** 编号 */
  code: string
  /** 序列号 */
  serialNumber: string
  /** 存放位置 */
  location: string
  /** 保险期限 */
  insurance: string
  /** 保险是否即将过期 */
  insuranceExpiring?: boolean
  /** 保险链接文字 */
  insuranceLink?: string
  /** 相关附件 */
  attachments: { name: string; type: string }[]
  /** 累计使用时长 */
  usageHours: string
  /** 图片URL */
  imageUrl?: string
}

/** 出入库记录（物资明细版，无编号列表） */
export interface IoRecordSimple {
  /** 日期 */
  date: string
  /** 时间 */
  time: string
  /** 类型（入库/出库） */
  type: string
  /** 操作类型颜色 */
  typeColor: 'success' | 'danger'
  /** 操作人 */
  operator: string
  /** 联系电话 */
  phone: string
  /** 备注 */
  remark: string
  /** 相关附件 */
  attachment?: string
  /** 借出地点（出库时） */
  borrowLocation?: string
}

/** 简化入库表单（物资明细版） */
export interface StockInSimpleForm {
  /** 入库类型 */
  type: InType
  /** 备注 */
  remark: string
  /** 相关附件 */
  attachments: string[]
}

/** 简化出库表单（物资明细版） */
export interface StockOutSimpleForm {
  /** 出库类型 */
  type: OutType
  /** 备注 */
  remark: string
  /** 相关附件 */
  attachments: string[]
}

/** 保险续期表单 */
export interface InsuranceRenewalForm {
  /** 保险有效期 */
  insurancePeriod: string[]
  /** 报单编号 */
  policyCode: string
  /** 经办人 */
  handler: string
  /** 维保单附件 */
  attachment: string
  /** 文件列表 */
  fileList: any[]
  /** 备注 */
  remark: string
}

// ── 调用申请 ──

/** 申请结果 */
export type ApplyResult = '通过' | '不通过' | '待审核'

/** 归还状态 */
export type ReturnStatus = '待归还' | '已归还' | '无需归还' | '-'

/** 调用申请记录 */
export interface ApplyRecord {
  id: string
  applyResult: ApplyResult
  returnStatus: ReturnStatus
  returnTotal?: number
  returnCurrent?: number
  materialName: string
  consumeType: string
  spec: string
  applyCode: string
  applyCount: number
  category: string
  applicant: string
  phone: string
  applyDept: string
  applyTime: string
  auditor: string
  outTime: string
  returnTime: string
}

/** 调用申请表单 - 选择物资 */
export interface ApplyMaterialItem {
  name: string
  category: string
  unit: string
  quantity: number
}

/** 调用申请表单 */
export interface ApplyForm {
  materials: ApplyMaterialItem[]
  location: string
  reason: string
  urgent: boolean
  transport: string
  returnTime: string
  attachments: string[]
  acceptPartial: boolean
}

// ── 库存盘点 ──

/** 盘点结果类型 */
export type CheckResultType = '盘盈' | '盘亏' | '正常'

/** 盘点类型 */
export type CheckType = '库存装备盘点' | '库外装备盘点' | '自定义盘点'

/** 盘点记录 */
export interface CheckRecord {
  id: string
  title: string
  checkDate: string
  checkCode: string
  remark: string
  checkType: CheckType
  result: CheckResultType
  attachment: string
}

/** 库存装备盘点表单 */
export interface StockCheckForm {
  title: string
  attachment: string
  warehouse: string
  checkDate: string
  result: CheckResultType
  remark: string
}

/** 库外装备盘点表单 */
export interface OutCheckForm {
  title: string
  attachment: string
  address: string
  checkDate: string
  result: CheckResultType
  remark: string
}

/** 自定义盘点表单 */
export interface CustomCheckForm {
  title: string
  attachment: string
  checkDate: string
  result: CheckResultType
  remark: string
}

// ── 调用审核 ──

/** 审核状态 */
export type AuditStatus = '待审核' | '已通过' | '未通过'

/** 审核事项 */
export type AuditItem = '调用审核' | '归还审核' | '出库审核' | '盘点审核' | '入库审核'

/** 审核记录 */
export interface AuditRecord {
  id: string
  auditItem: AuditItem
  isUrgent: boolean
  applyCode: string
  status: AuditStatus
  handler: string
  applyTime: string
  auditor: string
}

// ── 仓库查询 ──

/** 库存预警状态 */
export type StockWarningStatus = '无预警' | '装备库存预警！'

/** 仓库记录 */
export interface WarehouseRecord {
  id: string
  name: string
  warningStatus: StockWarningStatus
  address: string
  department: string
  manager: string
  phone: string
}

// ── 安全库存预警 ──

/** 预警处理状态 */
export type WarningHandleStatus = '待处理' | '已处理'

/** 预警补充状态 */
export type WarningSupplyStatus = '待补充' | '已补充'

/** 安全库存预警记录 */
export interface SafetyWarningRecord {
  id: string
  materialName: string
  category: string
  stockQuantity: number
  idealQuantity: number
  supplyStatus: WarningSupplyStatus
  handleStatus?: WarningHandleStatus
  warningDate: string
  clearDate: string
  handler: string
  handleRemark: string
  attachments: string[]
}

/** 预警设置项 */
export interface WarningSettingItem {
  category: string
  subCategory: string
  spec: string
  unit: string
  threshold: number
}

// ── 故障/报废预警 ──

/** 预警类型 */
export type FaultWarningType = '故障预警' | '报废预警'

/** 预警状态 */
export type FaultHandleStatus = '待处理' | '报废出库' | '维保续期'

/** 故障报废预警记录 */
export interface FaultWarningRecord {
  id: string
  materialName: string
  category: string
  warningType: FaultWarningType
  faultCount: number
  deviceCode: string
  useLife: string
  expireDuration: string
  handleStatus: FaultHandleStatus
  warningDate: string
  handleDate: string
  handler: string
  handleRemark: string
  attachments: string[]
}

// ── 装备操作考核任务 ──

/** 任务状态 */
export type TaskStatus = '已完成' | '进行中' | '未开始'

/** 是否合格 */
export type QualifiedStatus = '合格' | '不合格'

/** 考核任务记录 */
export interface ExamTaskRecord {
  id: string
  taskName: string
  taskStatus: TaskStatus
  startDate: string
  endDate: string
  score: number
  qualified: QualifiedStatus
}

// ── 维保记录 ──

/** 维保状态 */
export type MaintenanceTaskStatus = '待维保' | '已完成'

/** 维保任务记录 */
export interface MaintenanceTaskRecord {
  id: string
  status: MaintenanceTaskStatus
  overdueDays?: number
  taskName: string
  executor: string
  phone: string
  cost: number | null
  expectDate: string
  actualDate: string
}

// ── 故障设备 ──

/** 修复状态 */
export type RepairStatus = '待处理' | '已修复' | '已报废' | '已退役'

/** 故障设备记录 */
export interface FaultDeviceRecord {
  id: string
  repairStatus: RepairStatus
  deviceName: string
  deviceCode: string
  category: string
  spec: string
  attachment: string
  faultDesc: string
  reporter: string
  phone: string
  reportDate: string
  repairDate: string
}

// ── 退役/报废审核 ──

/** 退役报废类型 */
export type RetireType = '退役' | '报废'

/** 退役报废审核记录 */
export interface RetireAuditRecord {
  id: string
  type: RetireType
  auditStatus: AuditStatus
  cost: number
  deviceName: string
  deviceCode: string
  category: string
  spec: string
  attachment: string
  desc: string
  applicant: string
  phone: string
  applyDate: string
  auditDate: string
}
