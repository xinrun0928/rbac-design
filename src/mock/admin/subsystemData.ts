import type { Subsystem } from '@/types/admin/subsystem'

export const mockSubsystemData: Subsystem[] = [
  {
    subsysId: 1,
    subsysCode: 'EMERGENCY_WATCH',
    subsysName: '值守管理子系统',
    subsysShortName: '值守',
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
    subsysId: 2,
    subsysCode: 'EMERGENCY_PLAN',
    subsysName: '预案管理子系统',
    subsysShortName: '预案',
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
    subsysId: 3,
    subsysCode: 'EMERGENCY_EVENT',
    subsysName: '事件管理子系统',
    subsysShortName: '事件',
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
    subsysId: 4,
    subsysCode: 'EMERGENCY_DISPATCH',
    subsysName: '指挥智能调度子系统',
    subsysShortName: '调度',
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
    subsysId: 5,
    subsysCode: 'EMERGENCY_MATERIAL',
    subsysName: '厅级物资管理子系统',
    subsysShortName: '物资',
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
    subsysId: 6,
    subsysCode: 'ASSIST_DECISION',
    subsysName: '辅助决策子系统',
    subsysShortName: '决策',
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
    subsysId: 7,
    subsysCode: 'DATA_FUSION',
    subsysName: '数据融合子系统',
    subsysShortName: '融合',
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
    subsysId: 8,
    subsysCode: 'COMPREHENSIVE_DISPLAY',
    subsysName: '综合展示子系统',
    subsysShortName: '展示',
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
    subsysId: 99,
    subsysCode: 'SYSTEM',
    subsysName: '后台管理子系统',
    subsysShortName: '系统',
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
