import type { WorkflowNode, WorkflowEdge } from '@/types/workflow'

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