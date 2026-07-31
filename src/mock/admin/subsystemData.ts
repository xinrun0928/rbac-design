import type { Subsystem } from '@/types/admin/subsystem'

export const mockSubsystemData: Subsystem[] = [
  {
    subsystemId: 1,
    subsystemCode: 'EMERGENCY_WATCH',
    subsystemName: '值守管理子系统',
    subsystemShortName: '值守',
    pathPrefix: '/duty',
    tablePrefix: 'duty_',
    displayOrder: 1,
    isHidden: false,
    status: 1101,
    remark: '值班、排班、交接班等',
    createTime: '2026-05-31 11:59:20',
    // 前端扩展字段
    icon: 'Monitor',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    subsystemId: 2,
    subsystemCode: 'EMERGENCY_PLAN',
    subsystemName: '预案管理子系统',
    subsystemShortName: '预案',
    pathPrefix: '/plan',
    tablePrefix: 'plan_',
    displayOrder: 2,
    isHidden: false,
    status: 1101,
    remark: '预案编制、演练、复盘',
    createTime: '2026-05-31 11:59:20',
    // 前端扩展字段
    icon: 'Document',
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    subsystemId: 3,
    subsystemCode: 'EMERGENCY_EVENT',
    subsystemName: '事件管理子系统',
    subsystemShortName: '事件',
    pathPrefix: '/event',
    tablePrefix: 'event_',
    displayOrder: 3,
    isHidden: false,
    status: 1101,
    remark: '事件接报、响应、处置、评估',
    createTime: '2026-05-31 11:59:20',
    // 前端扩展字段
    icon: 'Warning',
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    subsystemId: 4,
    subsystemCode: 'EMERGENCY_DISPATCH',
    subsystemName: '指挥智能调度子系统',
    subsystemShortName: '调度',
    pathPrefix: '/dispatch',
    tablePrefix: 'dispatch_',
    displayOrder: 4,
    isHidden: false,
    status: 1101,
    remark: '资源调度、任务下达、指令分发',
    createTime: '2026-05-31 11:59:20',
    // 前端扩展字段
    icon: 'Connection',
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    subsystemId: 5,
    subsystemCode: 'EMERGENCY_MATERIAL',
    subsystemName: '厅级物资管理子系统',
    subsystemShortName: '物资',
    pathPrefix: '/resource',
    tablePrefix: 'resource_',
    displayOrder: 5,
    isHidden: false,
    status: 1101,
    remark: '物资库存、调度、盘点',
    createTime: '2026-05-31 11:59:20',
    // 前端扩展字段
    icon: 'Box',
    color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    subsystemId: 6,
    subsystemCode: 'ASSIST_DECISION',
    subsystemName: '辅助决策子系统',
    subsystemShortName: '决策',
    pathPrefix: '/dss',
    tablePrefix: 'dss_',
    displayOrder: 6,
    isHidden: false,
    status: 1101,
    remark: '态势分析、辅助决策、预案推荐',
    createTime: '2026-05-31 11:59:20',
    // 前端扩展字段
    icon: 'DataAnalysis',
    color: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
  },
  {
    subsystemId: 7,
    subsystemCode: 'DATA_FUSION',
    subsystemName: '数据融合子系统',
    subsystemShortName: '融合',
    pathPrefix: '/fusion',
    tablePrefix: 'fusion_',
    displayOrder: 7,
    isHidden: false,
    status: 1101,
    remark: '多源数据接入、清洗、融合',
    createTime: '2026-05-31 11:59:20',
    // 前端扩展字段
    icon: 'Upload',
    color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  },
  {
    subsystemId: 8,
    subsystemCode: 'COMPREHENSIVE_DISPLAY',
    subsystemName: '综合展示子系统',
    subsystemShortName: '展示',
    pathPrefix: '/display',
    tablePrefix: '',
    displayOrder: 8,
    isHidden: false,
    status: 1101,
    remark: '大屏展示、数据可视化',
    createTime: '2026-05-31 11:59:20',
    // 前端扩展字段
    icon: 'Odometer',
    color: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'
  },
  {
    subsystemId: 10,
    subsystemCode: 'FLOOD_INSPECTION',
    subsystemName: '汛期巡查子系统',
    subsystemShortName: '巡查',
    pathPrefix: '/inspection',
    tablePrefix: 'inspection_',
    displayOrder: 9,
    isHidden: false,
    status: 1101,
    remark: '汛期巡查、隐患上报、整改跟踪',
    createTime: '2026-05-31 11:59:20',
    // 前端扩展字段
    icon: 'View',
    color: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)'
  },
  {
    subsystemId: 99,
    subsystemCode: 'SYSTEM',
    subsystemName: '后台管理子系统',
    subsystemShortName: '系统',
    pathPrefix: '/admin',
    tablePrefix: 'sys_,org_,app_,mq_',
    displayOrder: 10,
    isHidden: false,
    status: 1101,
    remark: '用户管理、菜单管理、角色管理等',
    createTime: '2026-05-31 11:59:20',
    // 前端扩展字段
    icon: 'Setting',
    color: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)'
  }
]
