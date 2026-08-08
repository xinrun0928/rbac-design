/**
 * 工作流编排设计器 - 类型定义（BPMN 规范扩展）
 */

/** 节点类型枚举（参考 BPMN 2.0 元素精简集） */
export type NodeType =
  // ----- 事件（Event）-----
  | 'start' // 开始事件（圆）
  | 'end' // 结束事件（圆粗边）
  | 'message-intermediate' // 中间消息事件（双圆）
  | 'timer-intermediate' // 中间定时事件（双圆+时钟）
  | 'error-end' // 错误结束事件（粗边+闪电）
  // ----- 任务（Task）-----
  | 'user-task' // 用户任务
  | 'manual-task' // 人工任务
  | 'service-task' // 服务任务
  | 'script-task' // 脚本任务
  | 'receive-task' // 接收任务
  // ----- 网关（Gateway）-----
  | 'parallel-gateway' // 并行网关（菱形+）
  | 'exclusive-gateway' // 排他网关（菱形×）
  | 'inclusive-gateway' // 包容网关（菱形○）
  | 'event-gateway' // 事件网关（菱形五边形）

/** 节点大类（用于面板分组 / 渲染分类） */
export type NodeCategory = 'event' | 'task' | 'gateway'

/** 节点定义（BPMN 风格） */
export interface WorkflowNode {
  /** 唯一标识（建议 BPMN 风格 id） */
  id: string
  /** 节点类型 */
  type: NodeType
  /** 显示文本（BPMN: name） */
  label: string
  /** 画布 X 坐标（视口坐标系） */
  x: number
  /** 画布 Y 坐标（视口坐标系） */
  y: number
  /** 节点宽度 */
  width: number
  /** 节点高度 */
  height: number
  /** 节点描述 */
  desc?: string
  /** BPMN: 文档说明（documentation） */
  documentation?: string
  /** 是否异步执行（BPMN: async） */
  async?: boolean
  /** 是否为多实例（BPMN: multi-instance） */
  multiInstance?: boolean
  /** 任务专属：执行人表达式（CAMUNDA: assignee） */
  assignee?: string
  /** 任务专属：候选人 */
  candidateGroups?: string
  /** 任务专属：表单 key */
  formKey?: string
  /** 服务任务：调用表达式 */
  expression?: string
  /** 组合 ID（仅多选组合时使用，渲染时显示虚线包围框） */
  groupId?: string
}

/** 连线定义（BPMN 风格） */
export interface WorkflowEdge {
  /** 唯一标识 */
  id: string
  /** 起点节点 ID */
  sourceId: string
  /** 终点节点 ID */
  targetId: string
  /** 连线标签（BPMN: name） */
  label?: string
  /** 条件表达式（BPMN: conditionExpression） */
  condition?: string
  /** 是否默认流（BPMN: default）—— 仅排他网关出口有 */
  isDefault?: boolean
}

/** 组件库面板 - 拖拽项 */
export interface PaletteItem {
  /** 唯一 key */
  key: NodeType
  /** 显示标签 */
  label: string
  /** 节点类型 */
  type: NodeType
  /** 描述（鼠标 hover 显示） */
  desc: string
  /** SVG path d（图标，24×24 viewBox） */
  iconPath: string
  /** 描边颜色 */
  color: string
}

/** 组件库分类 */
export interface PaletteCategory {
  /** 分类 key */
  key: NodeCategory
  /** 分类标题 */
  title: string
  /** 分类下的节点项 */
  items: PaletteItem[]
}

/** 视口状态 */
export interface Viewport {
  /** 缩放比例（0.2 ~ 3） */
  zoom: number
  /** 画布内容 X 偏移 */
  x: number
  /** 画布内容 Y 偏移 */
  y: number
}

/** 校验问题 */
export interface ValidationIssue {
  /** 严重级别：error 阻断发布；warning 提示 */
  severity: 'error' | 'warning'
  /** 关联元素 id（节点或连线） */
  targetId?: string
  /** 关联元素类型 */
  targetType?: 'node' | 'edge'
  /** 简要说明 */
  message: string
}