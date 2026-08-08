import type { NodeType, PaletteCategory, PaletteItem } from '@/types/workflow'

/**
 * 节点默认尺寸与默认标签（单一事实来源）
 * - 事件/网关：72×72 小方块
 * - 任务：140×72 横向矩形
 */
export const nodeDefaults: Record<NodeType, { width: number; height: number; label: string }> = {
  // ----- 事件 -----
  start:                     { width: 72,  height: 72, label: '开始' },
  end:                       { width: 72,  height: 72, label: '结束' },
  'message-intermediate':    { width: 72,  height: 72, label: '消息事件' },
  'timer-intermediate':      { width: 72,  height: 72, label: '定时事件' },
  'error-end':               { width: 72,  height: 72, label: '错误结束' },
  // ----- 任务 -----
  'user-task':               { width: 140, height: 72, label: '用户任务' },
  'manual-task':             { width: 140, height: 72, label: '人工任务' },
  'service-task':            { width: 140, height: 72, label: '服务任务' },
  'script-task':             { width: 140, height: 72, label: '脚本任务' },
  'receive-task':            { width: 140, height: 72, label: '接收任务' },
  // ----- 网关 -----
  'parallel-gateway':        { width: 72,  height: 72, label: '并行网关' },
  'exclusive-gateway':       { width: 72,  height: 72, label: '排他网关' },
  'inclusive-gateway':       { width: 72,  height: 72, label: '包容网关' },
  'event-gateway':           { width: 72,  height: 72, label: '事件网关' }
}

/**
 * 节点渲染元数据（颜色 + 图标 path）
 * - color：描边/图标主色
 * - bg: 容器底色（任务为实心，事件为透明）
 * - iconPath: 24×24 viewBox 内的 SVG path d（不含 M0 0），用于 WfNode 内部图标
 * - useStroke: true 时图标用当前色描边（事件类节点）；false 时填充（任务类）
 */
interface NodeMeta {
  color: string
  bg: string
  iconPath: string
  useStroke?: boolean
  /** 网关内的内嵌图标（+ / × / ○ / 五边形） */
  gatewayIcon?: 'plus' | 'cross' | 'circle' | 'pentagon'
  /** 圆形事件是否画双圆（中间事件） */
  doubleCircle?: boolean
  /** 圆形事件是否画粗边（结束） */
  thickBorder?: boolean
}

export const nodeMeta: Record<NodeType, NodeMeta> = {
  // ----- 事件 -----
  start: {
    color: '#52c41a',
    bg: 'rgba(82, 196, 26, 0.15)',
    // 圆形节点本身只是外圈，里面不嵌图标
    iconPath: '',
    thickBorder: false
  },
  end: {
    color: '#f5222d',
    bg: 'rgba(245, 34, 45, 0.15)',
    // 结束：中心实心圆点（BPMN 标准 end 标识，24×24 坐标系下，半径 4）
    iconPath: 'M12 8a4 4 0 100 8 4 4 0 000-8z',
    thickBorder: true
  },
  'message-intermediate': {
    color: '#1677ff',
    bg: 'rgba(22, 119, 255, 0.12)',
    // 信封（24×24, stroke）
    iconPath: 'M4 6h16v12H4V6zm0 0l8 6 8-6',
    useStroke: true,
    doubleCircle: true
  },
  'timer-intermediate': {
    color: '#1677ff',
    bg: 'rgba(22, 119, 255, 0.12)',
    // 时钟（fill）
    iconPath: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-13h2v6.5l4.5 2.7-1 1.6-5.5-3.3V7z',
    doubleCircle: true
  },
  'error-end': {
    color: '#f5222d',
    bg: 'rgba(245, 34, 45, 0.15)',
    // 闪电
    iconPath: 'M13 2L4 14h6l-1 8 10-12h-6z',
    thickBorder: true
  },
  // ----- 任务 -----
  'user-task': {
    color: '#ffffff',
    bg: '#2b6fd6',
    // 人头（白填充）
    iconPath: 'M12 4a4 4 0 100 8 4 4 0 000-8zm0 10c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z'
  },
  'manual-task': {
    color: '#ffffff',
    bg: '#2b6fd6',
    // 三横线（人工/手动作业）
    iconPath: 'M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z'
  },
  'service-task': {
    color: '#ffffff',
    bg: '#2b6fd6',
    // 齿轮（白填充）
    iconPath: 'M19.4 13l1.5-1-2-3.5-1.8.7-1.1-.6-.4-1.9h-4l-.4 1.9-1.1.6-1.8-.7-2 3.5 1.5 1-.2 1.4.2 1.4-1.5 1 2 3.5 1.8-.7 1.1.6.4 1.9h4l.4-1.9 1.1-.6 1.8.7 2-3.5-1.5-1 .2-1.4-.2-1.4zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z'
  },
  'script-task': {
    color: '#ffffff',
    bg: '#2b6fd6',
    // 代码 </>（白填充）
    iconPath: 'M9 4l-6 8 6 8h2L5 12l6-8h-2zm4 0l6 8-6 8h2l6-8-6-8h-2z'
  },
  'receive-task': {
    color: '#ffffff',
    bg: '#2b6fd6',
    // 邮件 + 箭头
    iconPath: 'M2 5h20v4l-10 6L2 9V5zm0 6v8h20v-8l-10 6L2 11z'
  },
  // ----- 网关 -----
  'parallel-gateway': {
    color: '#ffffff',
    bg: '#f9c440',
    iconPath: '',
    gatewayIcon: 'plus'
  },
  'exclusive-gateway': {
    color: '#ffffff',
    bg: '#fa8c16',
    iconPath: '',
    gatewayIcon: 'cross'
  },
  'inclusive-gateway': {
    color: '#ffffff',
    bg: '#722ed1',
    iconPath: '',
    gatewayIcon: 'circle'
  },
  'event-gateway': {
    color: '#ffffff',
    bg: '#13c2c2',
    iconPath: '',
    gatewayIcon: 'pentagon'
  }
}

/**
 * 节点类型 BPMN 大类（用于面板分组 + 默认图标分类）
 */
export function getCategory(type: NodeType): 'event' | 'task' | 'gateway' {
  if (type === 'start' || type === 'end' || type === 'message-intermediate' ||
      type === 'timer-intermediate' || type === 'error-end') return 'event'
  if (type === 'user-task' || type === 'manual-task' || type === 'service-task' ||
      type === 'script-task' || type === 'receive-task') return 'task'
  return 'gateway'
}

/**
 * 面板展示图标（24×24 viewBox 内的路径，与 nodeMeta 一致但可能简化）
 * 给 WfPalette / WfPropertiesPanel 中的预览使用
 */
export const paletteCategories: PaletteCategory[] = [
  {
    key: 'event',
    title: '事件',
    items: [
      { key: 'start',                  type: 'start',                  label: '开始',     desc: '流程入口',         iconPath: '', color: nodeMeta.start.color },
      { key: 'end',                    type: 'end',                    label: '结束',     desc: '流程出口',         iconPath: '', color: nodeMeta.end.color },
      { key: 'message-intermediate',   type: 'message-intermediate',   label: '消息',     desc: '中间消息事件',     iconPath: nodeMeta['message-intermediate'].iconPath, color: nodeMeta['message-intermediate'].color },
      { key: 'timer-intermediate',     type: 'timer-intermediate',     label: '定时',     desc: '中间定时事件',     iconPath: nodeMeta['timer-intermediate'].iconPath,   color: nodeMeta['timer-intermediate'].color },
      { key: 'error-end',              type: 'error-end',              label: '错误结束', desc: '抛出错误终止',     iconPath: nodeMeta['error-end'].iconPath,           color: nodeMeta['error-end'].color }
    ]
  },
  {
    key: 'task',
    title: '任务',
    items: [
      { key: 'user-task',    type: 'user-task',    label: '用户',  desc: '需人员操作的任务',     iconPath: nodeMeta['user-task'].iconPath,    color: nodeMeta['user-task'].color },
      { key: 'manual-task',  type: 'manual-task',  label: '人工',  desc: '脱离系统流转的任务',   iconPath: nodeMeta['manual-task'].iconPath,  color: nodeMeta['manual-task'].color },
      { key: 'service-task', type: 'service-task', label: '服务',  desc: '自动调用服务',         iconPath: nodeMeta['service-task'].iconPath, color: nodeMeta['service-task'].color },
      { key: 'script-task',  type: 'script-task',  label: '脚本',  desc: '执行脚本',             iconPath: nodeMeta['script-task'].iconPath,  color: nodeMeta['script-task'].color },
      { key: 'receive-task', type: 'receive-task', label: '接收',  desc: '等待消息',             iconPath: nodeMeta['receive-task'].iconPath, color: nodeMeta['receive-task'].color }
    ]
  },
  {
    key: 'gateway',
    title: '网关',
    items: [
      // 网关在面板里用「菱形 + 内部符号」渲染；iconPath 留空
      { key: 'parallel-gateway',  type: 'parallel-gateway',  label: '并行', desc: '所有出口同时流转',     iconPath: '', color: nodeMeta['parallel-gateway'].bg },
      { key: 'exclusive-gateway', type: 'exclusive-gateway', label: '排他', desc: '按条件选一',           iconPath: '', color: nodeMeta['exclusive-gateway'].bg },
      { key: 'inclusive-gateway', type: 'inclusive-gateway', label: '包容', desc: '满足条件的全部流转',   iconPath: '', color: nodeMeta['inclusive-gateway'].bg },
      { key: 'event-gateway',     type: 'event-gateway',     label: '事件', desc: '基于事件触发',         iconPath: '', color: nodeMeta['event-gateway'].bg }
    ]
  }
]

/** 类型 → PaletteItem 快速查询 */
export const paletteItemByType: Record<NodeType, PaletteItem> = (() => {
  const map = {} as Record<NodeType, PaletteItem>
  for (const cat of paletteCategories) {
    for (const item of cat.items) {
      map[item.type] = item
    }
  }
  return map
})()