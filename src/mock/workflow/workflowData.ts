import type { WorkflowNode, WorkflowEdge, WorkflowItem } from '@/types/workflow'

/**
 * 工作流列表 Mock 数据
 */
export const mockWorkflowList: WorkflowItem[] = [
  {
    id: 1,
    name: '隐患上报流程',
    code: 'WF001',
    scenario: '隐患排查',
    type: '上报',
    version: 'v1.0',
    versionDesc: '初始版本',
    isLatest: true,
    publishStatus: 'published',
    useStatus: 'enabled',
    allowEdit: true,
    allowDelete: true,
    updateTime: '2026-04-01 08:50'
  },
  {
    id: 2,
    name: '事故处置流程',
    code: 'WF002',
    scenario: '事故管理',
    type: '处置',
    version: 'v2.1',
    versionDesc: '优化处置环节',
    isLatest: true,
    publishStatus: 'published',
    useStatus: 'enabled',
    allowEdit: true,
    allowDelete: true,
    updateTime: '2026-04-01 08:55'
  },
  {
    id: 3,
    name: '应急演练流程',
    code: 'WF003',
    scenario: '应急演练',
    type: '审批',
    version: 'v1.3',
    versionDesc: '增加演练评估环节',
    isLatest: true,
    publishStatus: 'published',
    useStatus: 'enabled',
    allowEdit: true,
    allowDelete: true,
    updateTime: '2026-04-01 09:00'
  },
  {
    id: 4,
    name: '设备巡检流程',
    code: 'WF004',
    scenario: '设备管理',
    type: '巡检',
    version: 'v1.0',
    versionDesc: '初始版本',
    isLatest: true,
    publishStatus: 'published',
    useStatus: 'enabled',
    allowEdit: true,
    allowDelete: true,
    updateTime: '2026-04-01 09:05'
  },
  {
    id: 5,
    name: '风险评估流程',
    code: 'WF005',
    scenario: '风险管理',
    type: '审批',
    version: 'v2.0',
    versionDesc: '重构评估模型',
    isLatest: true,
    publishStatus: 'unpublished',
    useStatus: 'enabled',
    allowEdit: true,
    allowDelete: true,
    updateTime: '2026-04-01 09:10'
  },
  {
    id: 6,
    name: '视频巡查流程',
    code: 'WF006',
    scenario: '视频监控',
    type: '巡检',
    version: 'v1.2',
    versionDesc: '增加异常标记',
    isLatest: true,
    publishStatus: 'published',
    useStatus: 'enabled',
    allowEdit: true,
    allowDelete: true,
    updateTime: '2026-04-01 09:15'
  },
  {
    id: 7,
    name: '收费站检查流程',
    code: 'WF007',
    scenario: '收费站管理',
    type: '巡检',
    version: 'v1.1',
    versionDesc: '优化检查项',
    isLatest: true,
    publishStatus: 'published',
    useStatus: 'enabled',
    allowEdit: true,
    allowDelete: true,
    updateTime: '2026-04-01 09:20'
  },
  {
    id: 8,
    name: '服务区检查流程',
    code: 'WF008',
    scenario: '服务区管理',
    type: '巡检',
    version: 'v1.0',
    versionDesc: '初始版本',
    isLatest: true,
    publishStatus: 'published',
    useStatus: 'enabled',
    allowEdit: true,
    allowDelete: true,
    updateTime: '2026-04-01 09:25'
  },
  {
    id: 9,
    name: '桥梁巡检流程',
    code: 'WF009',
    scenario: '桥梁管理',
    type: '巡检',
    version: 'v2.2',
    versionDesc: '增加结构检测',
    isLatest: true,
    publishStatus: 'published',
    useStatus: 'enabled',
    allowEdit: true,
    allowDelete: true,
    updateTime: '2026-04-01 09:30'
  },
  {
    id: 10,
    name: '隧道巡检流程',
    code: 'WF010',
    scenario: '隧道管理',
    type: '巡检',
    version: 'v1.5',
    versionDesc: '增加照明检测',
    isLatest: true,
    publishStatus: 'published',
    useStatus: 'enabled',
    allowEdit: true,
    allowDelete: true,
    updateTime: '2026-04-01 09:35'
  }
]

/**
 * 工作流编排设计器 - 示例数据
 *
 * 视觉布局（视口坐标系）：
 *
 *   [开始] ──> [用户任务] ──> [排他网关] ──> [脚本任务] ──> [结束]
 *                                  │  (条件通过)
 *                                  └──> [服务任务] ──> [消息事件] ──> [定时事件] ──> [结束]
 *
 * 展示：
 *  - 多类型节点（事件/任务/网关）
 *  - 多结束分支
 *  - 排他网关 + 条件表达式
 *  - 默认流
 */
export const demoNodes: WorkflowNode[] = [
  // ----- 主流程 -----
  {
    id: 'node-start',
    type: 'start',
    label: '受理申请',
    x: 100,
    y: 280,
    width: 72,
    height: 72,
    desc: '流程起始节点'
  },
  {
    id: 'node-user-task',
    type: 'user-task',
    label: '初审',
    x: 260,
    y: 280,
    width: 140,
    height: 72,
    desc: '工作人员初审',
    assignee: '${currentUser}',
    candidateGroups: 'audit-group',
    formKey: 'audit_form_v1'
  },
  {
    id: 'node-exclusive',
    type: 'exclusive-gateway',
    label: '是否通过',
    x: 480,
    y: 280,
    width: 72,
    height: 72,
    desc: '根据初审结果决定分支'
  },
  // ----- 通过分支 -----
  {
    id: 'node-script',
    type: 'script-task',
    label: '写入档案',
    x: 640,
    y: 200,
    width: 140,
    height: 72,
    desc: '脚本任务',
    expression: '${archiveSvc.write(auditResult)}'
  },
  {
    id: 'node-end-success',
    type: 'end',
    label: '通过',
    x: 860,
    y: 200,
    width: 72,
    height: 72,
    desc: '流程结束（成功）'
  },
  // ----- 不通过分支 -----
  {
    id: 'node-service',
    type: 'service-task',
    label: '通知申请人',
    x: 640,
    y: 360,
    width: 140,
    height: 72,
    desc: '发送短信 / 站内信',
    expression: '${notifyService.sendSms(applicant.phone, "您的申请未通过")}'
  },
  {
    id: 'node-message',
    type: 'message-intermediate',
    label: '等待申诉',
    x: 860,
    y: 360,
    width: 72,
    height: 72,
    desc: '等待申诉消息（最长 7 天）'
  },
  {
    id: 'node-timer',
    type: 'timer-intermediate',
    label: '7 天后',
    x: 1000,
    y: 360,
    width: 72,
    height: 72,
    desc: '超时自动流转'
  },
  {
    id: 'node-end-reject',
    type: 'end',
    label: '驳回',
    x: 1140,
    y: 360,
    width: 72,
    height: 72,
    desc: '流程结束（驳回）'
  }
]

export const demoEdges: WorkflowEdge[] = [
  // 主流程
  { id: 'edge-1', sourceId: 'node-start',      targetId: 'node-user-task',  label: '' },
  { id: 'edge-2', sourceId: 'node-user-task',  targetId: 'node-exclusive',  label: '' },

  // 通过分支
  {
    id: 'edge-3',
    sourceId: 'node-exclusive',
    targetId: 'node-script',
    label: '通过',
    condition: '${auditResult == "PASS"}'
  },
  { id: 'edge-4', sourceId: 'node-script',      targetId: 'node-end-success', label: '' },

  // 不通过分支（默认流）
  {
    id: 'edge-5',
    sourceId: 'node-exclusive',
    targetId: 'node-service',
    label: '驳回',
    isDefault: true
  },
  { id: 'edge-6', sourceId: 'node-service',    targetId: 'node-message',     label: '' },
  { id: 'edge-7', sourceId: 'node-message',    targetId: 'node-timer',       label: '' },
  { id: 'edge-8', sourceId: 'node-timer',      targetId: 'node-end-reject',  label: '' }
]