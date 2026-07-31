import type {
  InventorySummary, InventoryDetail, DeviceRecord, IoRecord,
  MaintenanceRecord, InsuranceRecord, MaterialDetailInfo, IoRecordSimple,
  ApplyRecord, CheckRecord, AuditRecord,
  WarehouseRecord, SafetyWarningRecord, FaultWarningRecord,
  ExamTaskRecord, MaintenanceTaskRecord, FaultDeviceRecord, RetireAuditRecord
} from '@/types/resource/warehouse'

/** 品类汇总 Mock 数据 */
export const inventorySummaryData: InventorySummary[] = [
  {
    id: 'IS001',
    name: '大疆mavic3pro',
    type: '应急处装备及配套物资/搜救设备',
    spec: '大疆mavic3pro套装',
    stockQuantity: '1/5',
    unit: '台',
    maintenanceStatus: '待维保',
    pendingCount: 2,
    location: '808室',
    department: '公路运营管理处',
    lastMaintenanceDate: '2025-09-11',
    nextMaintenanceDate: '2025-10-11',
    category: '应急装备及配套物资'
  },
  {
    id: 'IS002',
    name: '户外电源',
    type: '应急处装备及配套物资/发电设备',
    spec: '220V3000瓦',
    stockQuantity: '1/1',
    unit: '台',
    maintenanceStatus: '待维保',
    pendingCount: 1,
    location: '808室',
    department: '综合运输处',
    lastMaintenanceDate: '2025-09-11',
    nextMaintenanceDate: '2025-10-11',
    category: '应急装备及配套物资'
  },
  {
    id: 'IS003',
    name: '内存卡',
    type: '应急处装备及配套物资/其他',
    spec: '512GB，读190MB/s',
    stockQuantity: '4/4',
    unit: '张',
    maintenanceStatus: '已维保',
    location: '808室',
    department: '厅科技处',
    lastMaintenanceDate: '2025-09-11',
    nextMaintenanceDate: '2025-10-11',
    category: '应急装备及配套物资'
  },
  {
    id: 'IS004',
    name: '户外场地灯',
    type: '应急处装备及配套物资/照明设备',
    spec: '五档调节/流明500-1000lm/续航5-10h(含)',
    stockQuantity: '1/2',
    unit: '个',
    maintenanceStatus: '已维保',
    location: '808室',
    department: '广东省公路事务中心',
    lastMaintenanceDate: '2025-09-11',
    nextMaintenanceDate: '2025-10-11',
    category: '应急装备及配套物资'
  },
  {
    id: 'IS005',
    name: '6平米充气帐篷',
    type: '基本上生活保障物资/帐篷',
    spec: '充气帐篷3*2（6平米）',
    stockQuantity: '7/10',
    unit: '个',
    maintenanceStatus: '已维保',
    location: '808室',
    department: '厅科技处',
    lastMaintenanceDate: '2025-09-11',
    nextMaintenanceDate: '2025-10-11',
    category: '基本生活保障物资'
  },
  {
    id: 'IS006',
    name: '读卡器',
    type: '应急处装备及配套物资/其他',
    spec: '-',
    stockQuantity: '1/1',
    unit: '个',
    maintenanceStatus: '已维保',
    location: '808室',
    department: '厅科技处',
    lastMaintenanceDate: '2025-09-11',
    nextMaintenanceDate: '2025-10-11',
    category: '应急装备及配套物资'
  }
]

/** 物资明细 Mock 数据 */
export const inventoryDetailData: InventoryDetail[] = [
  {
    id: 'ID001',
    name: '大疆mavic3pro',
    code: 'WRJ-20240103873',
    serialNumber: '1A43D2P0087654',
    category: '应急处装备及配套物资/搜救设备',
    spec: '大疆mavic3pro套装',
    unit: '台',
    insurance: '2024/11/14-2027/11/14',
    maintenanceStatus: '待维保',
    pendingCount: 2,
    location: '808室',
    department: '公路运营管理处',
    lastMaintenanceDate: '2025-09-11',
    nextMaintenanceDate: '2025-10-11'
  },
  {
    id: 'ID002',
    name: '大疆mavic3pro',
    code: 'WRJ-20240103902',
    serialNumber: '1A43D2P0091230',
    category: '应急处装备及配套物资/发电设备',
    spec: '大疆mavic3pro套装',
    unit: '台',
    insurance: '2023/04/29-2026/04/29',
    insuranceExpiring: true,
    maintenanceStatus: '待维保',
    pendingCount: 1,
    location: '808室',
    department: '综合运输处',
    lastMaintenanceDate: '2025-09-11',
    nextMaintenanceDate: '2025-10-11'
  },
  {
    id: 'ID003',
    name: '大疆mavic3pro',
    code: 'WRJ-20220619128',
    serialNumber: '1A43D2P0056789',
    category: '应急处装备及配套物资/其他',
    spec: '大疆mavic3pro套装',
    unit: '张',
    insurance: '2023/04/01-2026/04/01',
    insuranceExpired: true,
    maintenanceStatus: '已维保',
    location: '808室',
    department: '厅科技处',
    lastMaintenanceDate: '2025-09-11',
    nextMaintenanceDate: '2025-10-11'
  },
  {
    id: 'ID004',
    name: '户外电源',
    code: 'DY-30442494',
    serialNumber: 'DY240300456789',
    category: '应急处装备及配套物资/照明设备',
    spec: '大疆 五档调节/流明500-1000lm/续航5-10h(含)',
    unit: '个',
    insurance: '2024/11/14-2027/11/14',
    maintenanceStatus: '已维保',
    location: '808室',
    department: '广东省公路事务中心',
    lastMaintenanceDate: '2025-09-11',
    nextMaintenanceDate: '2025-10-11'
  },
  {
    id: 'ID005',
    name: '户外电源',
    code: 'DY-30442494',
    serialNumber: 'DY240300456790',
    category: '应急处装备及配套物资/照明设备',
    spec: '大疆 五档调节/流明500-1000lm/续航5-10h(含)',
    unit: '个',
    insurance: '2024/11/14-2027/11/14',
    maintenanceStatus: '已维保',
    location: '808室',
    department: '厅科技处',
    lastMaintenanceDate: '2025-09-11',
    nextMaintenanceDate: '2025-10-11'
  },
  {
    id: 'ID006',
    name: '6平米帐篷',
    code: 'ZP-12364913',
    serialNumber: '-',
    category: '基本上生活保障物资/帐篷',
    spec: '充气帐篷3*2（6平米）',
    unit: '个',
    insurance: '2024/11/14-2027/11/14',
    maintenanceStatus: '已维保',
    location: '808室',
    department: '厅科技处',
    lastMaintenanceDate: '2025-09-11',
    nextMaintenanceDate: '2025-10-11'
  }
]

/** 设备详情 - 设备/物资清单 */
export const deviceRecordData: DeviceRecord[] = [
  { code: 'WRJ-20240103873', inDate: '2025-09-11', useCount: 3, status: '在库', maintenanceStatus: '待维保', lastMaintenanceDate: '2025-09-11', nextMaintenanceDate: '2025-10-11', purchaseDate: '2024-09-11', validityPeriod: '2023-01-10至2026-01-10' },
  { code: 'WRJ-20240103902', inDate: '2025-09-11', useCount: 1, status: '维修', maintenanceStatus: '待维保', lastMaintenanceDate: '2025-09-11', nextMaintenanceDate: '2025-10-11', purchaseDate: '2024-09-11', validityPeriod: '2023-01-10至2026-01-10' },
  { code: 'WRJ-20220619128', inDate: '2023-06-19', useCount: 5, status: '在用', maintenanceStatus: '已维保', lastMaintenanceDate: '2025-09-11', nextMaintenanceDate: '2025-10-11', purchaseDate: '2024-09-11', validityPeriod: '2023-01-10至2026-01-10' },
  { code: 'WRJ-20220619293', inDate: '2023-06-19', useCount: 2, status: '在库', maintenanceStatus: '已维保', lastMaintenanceDate: '2025-09-11', nextMaintenanceDate: '2025-10-11', purchaseDate: '2024-09-11', validityPeriod: '2023-01-10至2026-01-10' },
  { code: 'WRJ-20220619341', inDate: '2023-06-19', useCount: 1, status: '在库', maintenanceStatus: '已维保', lastMaintenanceDate: '2025-09-11', nextMaintenanceDate: '2025-10-11', purchaseDate: '2024-09-11', validityPeriod: '2023-01-10至2026-01-10' },
  { code: 'WRJ-20220619345', inDate: '2023-06-19', useCount: 1, status: '报废', maintenanceStatus: '-', lastMaintenanceDate: '2025-09-11', nextMaintenanceDate: '2025-10-11', purchaseDate: '2024-09-11', validityPeriod: '2023-01-10至2026-01-10' }
]

/** 设备详情 - 出入库记录 */
export const ioRecordData: IoRecord[] = [
  {
    date: '2025-09-11',
    time: '17:30',
    type: '入库/采购',
    typeColor: 'success',
    quantity: 4,
    operator: '张三',
    phone: '13500392839',
    remark: '为保证应急装备充足，购入多旋翼无人机4台。',
    attachment: '多旋翼无人机采购单.pdf',
    codes: ['WRJ-20220619128', 'WRJ-20220619129'],
    hasMore: true
  },
  {
    date: '2025-09-11',
    time: '08:30',
    type: '出库/报废',
    typeColor: 'danger',
    quantity: 1,
    operator: '张三',
    phone: '13500392839',
    remark: '执行任务时意外情况导致无人机损坏。',
    codes: ['WRJ-20220619293']
  }
]

/** 物资名称选项 */
export const materialNameOptions = [
  '大疆mavic3pro', '户外电源', '内存卡', '户外场地灯',
  '6平米充气帐篷', '读卡器', '对讲机', '救生衣'
]

/** 型号规格选项 */
export const specOptions = [
  '大疆mavic3pro套装', '220V3000瓦', '512GB，读190MB/s',
  '五档调节/流明500-1000lm/续航5-10h(含)', '充气帐篷3*2（6平米）', '-'
]

/** 单位选项 */
export const unitOptions = ['台', '张', '个', '套', '箱', '把']

/** 保险选项 */
export const insuranceOptions = [
  'PICC人保-装备综合险-2024001',
  '平安保险-设备财产险-2024002',
  '太平洋保险-物资运输险-2024003',
  '中国人寿-设备意外险-2024004',
  '太平保险-仓储物资险-2024005'
]

/** 存放位置选项 */
export const locationOptions = ['808室', '809室', '810室', '仓库A', '仓库B']

/** 授权对象类型选项 */
export const targetObjectTypeOptions = ['用户', '角色', '部门', '组织']

/** 权限角色选项 */
export const roleOptions = ['管理员', '操作员', '查看者', '审计员']

/** 装备范围选项 */
export const scopeOptions = [
  '全部装备', '搜救设备', '发电设备', '照明设备', '帐篷', '内存卡'
]

/** 维保记录 Mock 数据 */
export const maintenanceRecordData: MaintenanceRecord[] = [
  { date: '2025-09-11', code: 'wb4169916355', status: '待维保', result: '-', maintainer: '张三' },
  { date: '2025-09-11', code: 'wb4169916355', status: '已完成', result: '正常', maintainer: '张三' },
  { date: '2023-06-19', code: 'wb4169916355', status: '已完成', result: '存在故障', maintainer: '张三' },
  { date: '2023-06-19', code: 'wb4169916355', status: '已完成', result: '正常', maintainer: '李四' },
  { date: '2023-06-19', code: 'wb4169916355', status: '已完成', result: '正常', maintainer: '李四' },
  { date: '2023-06-19', code: 'wb4169916355', status: '已完成', result: '正常', maintainer: '李四' }
]

/** 保险续期记录 Mock 数据 */
export const insuranceRecordData: InsuranceRecord[] = [
  { period: '2024-01-01/2026-06-01', registerDate: '2023-09-11', policyCode: 'wb4169916355', status: '即将过期', maintainer: '张三', remark: '-' },
  { period: '2024-01-01/2026-06-01', registerDate: '2025-09-11', policyCode: 'wb4169916355', status: '已过期', maintainer: '张三', remark: '-' },
  { period: '2024-01-01/2026-06-01', registerDate: '2023-06-19', policyCode: 'wb4169916355', status: '已过期', maintainer: '张三', remark: '-' },
  { period: '2024-01-01/2026-06-01', registerDate: '2023-06-19', policyCode: 'wb4169916355', status: '已过期', maintainer: '李四', remark: '-' }
]

/** 物资明细详情信息 */
export const materialDetailInfoData: MaterialDetailInfo = {
  name: '大疆mavic3',
  type: '应急处装备及配套物资/搜救设备',
  spec: '大疆mavic3pro套装',
  maintenanceStatus: '待维保',
  code: 'WRJ-20240103873',
  serialNumber: '1A43D2P0087654',
  location: '广东省交通运输厅 808室',
  insurance: '2024-01-01/2026-06-01',
  insuranceExpiring: true,
  insuranceLink: '保险续期>>',
  attachments: [
    { name: '设备图.png', type: 'image' },
    { name: '采购发票.pdf', type: 'pdf' },
    { name: '使用说明书.pdf', type: 'pdf' }
  ],
  usageHours: '138小时'
}

/** 物资明细出入库记录 Mock 数据 */
export const ioRecordSimpleData: IoRecordSimple[] = [
  {
    date: '2025-09-11',
    time: '17:30',
    type: '入库',
    typeColor: 'success',
    operator: '张三',
    phone: '13500392839',
    remark: '为保证应急装备充足，购入多旋翼无人机4台。',
    attachment: '使用记录.pdf'
  },
  {
    date: '2025-09-11',
    time: '08:30',
    type: '出库',
    typeColor: 'danger',
    operator: '张三',
    phone: '13500392839',
    remark: '执行任务时意外情况导致无人机损坏。',
    borrowLocation: '广东省广州市越秀区北京路'
  },
  {
    date: '2025-05-20',
    time: '12:30',
    type: '入库',
    typeColor: 'success',
    operator: '张三',
    phone: '13500392839',
    remark: 'XXX部门归还原调出的无人机。',
    attachment: '使用记录.pdf'
  },
  {
    date: '2025-05-01',
    time: '12:30',
    type: '出库',
    typeColor: 'danger',
    operator: '张三',
    phone: '13500392839',
    remark: 'XXX部门借调无人机。',
    borrowLocation: '广东省广州市越秀区北京路'
  }
]

// ── 新增页面数据 ──

/** 调用申请 Mock 数据 */
export const applyRecordData: ApplyRecord[] = [
  { id: 'A001', applyResult: '通过', returnStatus: '待归还', returnTotal: 2, returnCurrent: 1, materialName: '大疆mavic3 pro', consumeType: '非消耗类', spec: '大疆mavic3pro套装', applyCode: 'DY251015-01', applyCount: 2, category: '应急处装备及配套物资/搜救设备', applicant: '张三', phone: '13574623728', applyDept: '科技处', applyTime: '2025-10-15 13:00', auditor: '李四', outTime: '2025-10-15 13:00', returnTime: '-' },
  { id: 'A002', applyResult: '不通过', returnStatus: '-', materialName: '大疆户外电源', consumeType: '非消耗类', spec: '220V3000瓦', applyCode: 'DY251015-01', applyCount: 1, category: '应急处装备及配套物资/发电设备', applicant: '张三', phone: '13574623728', applyDept: '科技处', applyTime: '2023-09-01 13:00', auditor: '李四', outTime: '2023-09-01 13:00', returnTime: '-' },
  { id: 'A003', applyResult: '待审核', returnStatus: '-', materialName: '内存卡', consumeType: '非消耗类', spec: '512GB，读190MB/S', applyCode: 'DY251015-01', applyCount: 2, category: '应急处装备及配套物资/其他', applicant: '张三', phone: '13574623728', applyDept: '科技处', applyTime: '2023-09-01 13:00', auditor: '李四', outTime: '2023-09-01 13:00', returnTime: '-' },
  { id: 'A004', applyResult: '通过', returnStatus: '无需归还', materialName: '5号电池', consumeType: '消耗类', spec: '6个/板', applyCode: 'CK230901-14', applyCount: 3, category: '应急处装备及配套物资/搜救设备', applicant: '张三', phone: '13574623728', applyDept: '科技处', applyTime: '2025-10-15 13:00', auditor: '李四', outTime: '2025-10-15 13:00', returnTime: '2025-10-15 13:00' },
  { id: 'A005', applyResult: '通过', returnStatus: '已归还', materialName: '调出应急通信车', consumeType: '非消耗类', spec: '台', applyCode: 'CK230901-10', applyCount: 1, category: '应急处装备及配套物资/发电设备', applicant: '张三', phone: '13574623728', applyDept: '科技处', applyTime: '2025-10-15 13:00', auditor: '李四', outTime: '2025-10-15 13:00', returnTime: '-' },
  { id: 'A006', applyResult: '通过', returnStatus: '无需归还', materialName: '一次性雨衣', consumeType: '消耗类', spec: '成人款', applyCode: 'CK230901-07', applyCount: 5, category: '应急处装备及配套物资/其他', applicant: '张三', phone: '13574623728', applyDept: '科技处', applyTime: '2025-10-15 13:00', auditor: '李四', outTime: '2025-10-15 13:00', returnTime: '2025-10-15 13:00' }
]

/** 库存盘点 Mock 数据 */
export const checkRecordData: CheckRecord[] = [
  { id: 'C001', title: '应急搜救装备库存盘点', checkDate: '2025-10-15', checkCode: 'PD20251016007', remark: '涵盖无人机、探照灯、内存卡等库存装备，核对数量与完好性', checkType: '库存装备盘点', result: '盘盈', attachment: '盘点单.pdf' },
  { id: 'C002', title: '外派任务装备出库盘点', checkDate: '2025-10-15', checkCode: 'PD20251016006', remark: '盘点库外部暑／执行任务中的装备，核查损耗与归还状态', checkType: '库外装备盘点', result: '正常', attachment: '盘点单.pdf' },
  { id: 'C003', title: '应急物资专项盘点', checkDate: '2025-10-15', checkCode: 'PD20251016005', remark: '针对重点应急物资（充电宝、帐篷）开展专项检查，清理临期与破损物资', checkType: '自定义盘点', result: '盘亏', attachment: '盘点单.pdf' },
  { id: 'C004', title: '日常储备装备盘点', checkDate: '2025-10-15', checkCode: 'PD20251016004', remark: '盘点仓库储备的常规应急装备，更新库存台账，补充缺失物资', checkType: '库存装备盘点', result: '正常', attachment: '盘点单.pdf' },
  { id: 'C005', title: '年度装备全面盘点', checkDate: '2025-10-15', checkCode: 'PD20251016003', remark: '涵盖全品类应急装备，包含数量核对、故障排查、退役／报废设备清理', checkType: '库存装备盘点', result: '正常', attachment: '盘点单.pdf' }
]

/** 调用审核 Mock 数据 */
export const auditRecordData: AuditRecord[] = [
  { id: 'AU001', auditItem: '调用审核', isUrgent: false, applyCode: 'RK230901-05', status: '待审核', handler: '张三', applyTime: '2025-10-15 13:00', auditor: '李四' },
  { id: 'AU002', auditItem: '调用审核', isUrgent: true, applyCode: 'RK230901-05', status: '待审核', handler: '张三', applyTime: '2025-10-15 13:00', auditor: '李四' },
  { id: 'AU003', auditItem: '归还审核', isUrgent: false, applyCode: 'CK230901-14', status: '已通过', handler: '张三', applyTime: '2023-09-01 13:00', auditor: '李四' },
  { id: 'AU004', auditItem: '调用审核', isUrgent: false, applyCode: 'PD20251016007', status: '未通过', handler: '张三', applyTime: '2023-09-01 13:00', auditor: '李四' }
]

/** 仓库查询 Mock 数据 */
export const warehouseRecordData: WarehouseRecord[] = [
  { id: 'W001', name: '广东省交通运输厅808室', warningStatus: '无预警', address: '广东省广州市越秀区白云路27号', department: 'XXX部门', manager: '张三', phone: '13728394873' },
  { id: 'W002', name: '广东省交通运输厅809室', warningStatus: '装备库存预警！', address: '广东省广州市越秀区白云路27号', department: 'XXX部门', manager: '张三', phone: '13728394873' }
]

/** 安全库存预警 Mock 数据 */
export const safetyWarningRecordData: SafetyWarningRecord[] = [
  { id: 'SW001', materialName: '大疆mavic3', category: '应急处置装备/搜救设备', stockQuantity: 1, idealQuantity: 2, supplyStatus: '待补充', handleStatus: '待处理', warningDate: '2025-09-11', clearDate: '-', handler: '-', handleRemark: '-', attachments: [] },
  { id: 'SW002', materialName: '户外电源', category: '后勤保障装备/发电装备', stockQuantity: 1, idealQuantity: 2, supplyStatus: '已补充', warningDate: '2025-09-11', clearDate: '2025-10-11', handler: '张三', handleRemark: '已购买3台户外电源并完成入库', attachments: ['采购单.pdf', '入库单.pdf'] },
  { id: 'SW003', materialName: '卫星电话', category: '后勤保障装备/通信设备', stockQuantity: 2, idealQuantity: 5, supplyStatus: '已补充', warningDate: '2025-09-11', clearDate: '2025-10-11', handler: '张三', handleRemark: '已购买5台卫星电话完成入库', attachments: ['卫星电话采购单.pdf', '入库单.pdf'] },
  { id: 'SW004', materialName: '头盔', category: '应急物资/人员防护物资', stockQuantity: 10, idealQuantity: 20, supplyStatus: '已补充', warningDate: '2025-09-11', clearDate: '2025-10-11', handler: '张三', handleRemark: '已购买10个头盔并完成入库', attachments: ['头盔采购单.pdf', '头盔入库单.pdf'] }
]

/** 故障/报废预警 Mock 数据 */
export const faultWarningRecordData: FaultWarningRecord[] = [
  { id: 'FW001', materialName: '应急机械化桥', category: '应急处置装备/桥梁装备', warningType: '故障预警', faultCount: 12, deviceCode: 'YJQ-20240103832', useLife: '2023-09-11至2025-09-11', expireDuration: '3天', handleStatus: '待处理', warningDate: '2025-09-11', handleDate: '-', handler: '-', handleRemark: '-', attachments: [] },
  { id: 'FW002', materialName: '汽车起重机', category: '工程机械装备/起重装备', warningType: '报废预警', faultCount: 13, deviceCode: 'QZJ-20240102398', useLife: '2023-09-11至2025-09-11', expireDuration: '2个月', handleStatus: '报废出库', warningDate: '2025-09-11', handleDate: '2025-10-11', handler: '张三', handleRemark: '-', attachments: [] },
  { id: 'FW003', materialName: '固定翼无人机', category: '应急物资/人员防护物资', warningType: '故障预警', faultCount: 3, deviceCode: 'WRJ-20240103873', useLife: '2023-09-11至2025-09-11', expireDuration: '1年', handleStatus: '维保续期', warningDate: '2025-09-11', handleDate: '2025-10-11', handler: '张三', handleRemark: '维修后可继续使用', attachments: ['无人机维保单.pdf', '入库单.pdf'] }
]

// ── 装备操作考核任务 Mock 数据 ──

export const examTaskRecordData: ExamTaskRecord[] = [
  { id: 'ET001', taskName: '大疆 Mavic3 操作考核', taskStatus: '已完成', startDate: '2025-10-10', endDate: '2025-10-17', score: 100, qualified: '合格' },
  { id: 'ET002', taskName: '对讲机操作考核', taskStatus: '进行中', startDate: '2025-10-12', endDate: '2025-10-19', score: 70, qualified: '合格' },
  { id: 'ET003', taskName: '强光手电使用考核', taskStatus: '未开始', startDate: '2025-10-15', endDate: '2025-10-22', score: 0, qualified: '不合格' },
  { id: 'ET004', taskName: '卫星电话操作考核', taskStatus: '进行中', startDate: '2025-10-18', endDate: '2025-10-25', score: 50, qualified: '不合格' },
  { id: 'ET005', taskName: '旧款对讲机操作考核', taskStatus: '已完成', startDate: '2025-10-08', endDate: '2025-10-15', score: 100, qualified: '合格' },
  { id: 'ET006', taskName: '应急装备综合考核', taskStatus: '未开始', startDate: '2025-10-20', endDate: '2025-10-27', score: 0, qualified: '不合格' }
]

// ── 维保记录 Mock 数据 ──

export const maintenanceTaskRecordData: MaintenanceTaskRecord[] = [
  { id: 'MT001', status: '待维保', overdueDays: 3, taskName: '搜救设备维保', executor: '张三', phone: '13598695485', cost: null, expectDate: '2025-09-11', actualDate: '-' },
  { id: 'MT002', status: '待维保', taskName: '户外发电设备维保', executor: '李四', phone: '18856945265', cost: null, expectDate: '2025-09-11', actualDate: '-' },
  { id: 'MT003', status: '已完成', taskName: '设备内存卡维保', executor: '王五', phone: '19065559238', cost: 100.00, expectDate: '2025-09-11', actualDate: '2025-10-11' },
  { id: 'MT004', status: '已完成', taskName: '户外照明设备维保', executor: '张三', phone: '13598695485', cost: 160.00, expectDate: '2025-09-11', actualDate: '2025-10-11' },
  { id: 'MT005', status: '已完成', taskName: '帐篷物资维保', executor: '张三', phone: '13598695485', cost: 0.00, expectDate: '2025-09-11', actualDate: '2025-10-11' },
  { id: 'MT006', status: '已完成', taskName: '饮用水有效期维保', executor: '李四', phone: '18856945265', cost: 0.00, expectDate: '2025-09-11', actualDate: '2025-10-11' }
]

// ── 故障设备 Mock 数据 ──

export const faultDeviceRecordData: FaultDeviceRecord[] = [
  { id: 'FD001', repairStatus: '待处理', deviceName: '大疆mavic3pro', deviceCode: 'WRJ-20240103873', category: '应急处装备及配套物资/搜救设备', spec: '大疆mavic3pro套装', attachment: '', faultDesc: '云台异常，图传卡顿', reporter: '张三', phone: '13598695485', reportDate: '2025-09-11', repairDate: '2025-09-11' },
  { id: 'FD002', repairStatus: '待处理', deviceName: '大疆户外电源', deviceCode: 'DY-20240103902', category: '应急处装备及配套物资/发电设备', spec: '220V3000瓦', attachment: '', faultDesc: '充电故障，输出异常', reporter: '李四', phone: '18856945265', reportDate: '2025-09-11', repairDate: '2025-09-11' },
  { id: 'FD003', repairStatus: '已修复', deviceName: '大疆air3', deviceCode: 'WRJ-20220619128', category: '应急处装备及配套物资/搜救设备', spec: '大疆air3套装', attachment: '', faultDesc: '续航不足，机身异响', reporter: '王五', phone: '19065559238', reportDate: '2025-09-11', repairDate: '2025-09-11' },
  { id: 'FD004', repairStatus: '已退役', deviceName: '探照灯', deviceCode: 'D-20220619293', category: '应急处装备及配套物资/照明设备', spec: '五档调节/流明500-1000lm/续航5-10h(含)', attachment: '', faultDesc: '亮度衰减，开关故障', reporter: '张三', phone: '13598695485', reportDate: '2025-09-11', repairDate: '2025-09-11' },
  { id: 'FD005', repairStatus: '已报废', deviceName: '对讲机', deviceCode: 'PH-20220341', category: '应急处装备及配套物资/搜救设备', spec: '使用范围1-5公里/电池容量1000-2000mAh', attachment: '', faultDesc: '信号差，通话杂音', reporter: '张三', phone: '13598695485', reportDate: '2025-09-11', repairDate: '2025-09-11' },
  { id: 'FD006', repairStatus: '已修复', deviceName: '对讲机', deviceCode: 'PH-202209851', category: '应急处装备及配套物资/搜救设备', spec: '使用范围1-5公里/电池容量1000-2000mAh', attachment: '', faultDesc: '按键故障，无法开机', reporter: '李四', phone: '18856945265', reportDate: '2025-09-11', repairDate: '2025-09-11' }
]

// ── 退役/报废审核 Mock 数据 ──

export const retireAuditRecordData: RetireAuditRecord[] = [
  { id: 'RA001', type: '退役', auditStatus: '待审核', cost: 1000, deviceName: '大疆mavic3pro', deviceCode: 'WRJ-20240103873', category: '应急处装备及配套物资/搜救设备', spec: '大疆mavic3pro套装', attachment: '', desc: '性能完好，设备更新退役', applicant: '张三', phone: '13598695485', applyDate: '2025-09-11', auditDate: '2025-09-11' },
  { id: 'RA002', type: '报废', auditStatus: '待审核', cost: 200, deviceName: '大疆户外电源', deviceCode: 'DY-20240103902', category: '应急处装备及配套物资/发电设备', spec: '220V3000瓦', attachment: '', desc: '电池故障，无法修复报废', applicant: '李四', phone: '18856945265', applyDate: '2025-09-11', auditDate: '2025-09-11' },
  { id: 'RA003', type: '退役', auditStatus: '已通过', cost: 923, deviceName: '大疆air3', deviceCode: 'WRJ-20220619128', category: '应急处装备及配套物资/搜救设备', spec: '大疆air3套装', attachment: '', desc: '功能正常，换型退役', applicant: '王五', phone: '19065559238', applyDate: '2025-09-11', auditDate: '2025-09-11' },
  { id: 'RA004', type: '退役', auditStatus: '未通过', cost: 50, deviceName: '探照灯', deviceCode: 'D-20220619293', category: '应急处装备及配套物资/照明设备', spec: '五档调节/流明500-1000lm/续航5-10h(含)', attachment: '', desc: '完好可用，换型退役', applicant: '张三', phone: '13598695485', applyDate: '2025-09-11', auditDate: '2025-09-11' },
  { id: 'RA005', type: '报废', auditStatus: '已通过', cost: 60, deviceName: '对讲机', deviceCode: 'PH-20220341', category: '应急处装备及配套物资/搜救设备', spec: '使用范围1-5公里/电池容量1000-2000mAh', attachment: '', desc: '信号模块损坏，报废', applicant: '张三', phone: '13598695485', applyDate: '2025-09-11', auditDate: '2025-09-11' },
  { id: 'RA006', type: '报废', auditStatus: '已通过', cost: 60, deviceName: '对讲机', deviceCode: 'PH-202209851', category: '应急处装备及配套物资/搜救设备', spec: '使用范围1-5公里/电池容量1000-2000mAh', attachment: '', desc: '按键失灵，无维修价值报废', applicant: '李四', phone: '18856945265', applyDate: '2025-09-11', auditDate: '2025-09-11' }
]
