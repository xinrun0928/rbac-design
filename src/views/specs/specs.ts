import type { Component } from 'vue'
import {
  Notebook,
  Warning,
  Coin,
  Connection,
  DataAnalysis,
  Lock,
  Promotion,
  Message,
  SetUp
} from '@element-plus/icons-vue'
import errorHandlingMd from '../../../docs/后端开发规范/异常处理规范.md?raw'
import apiDesignMd from '../../../docs/后端开发规范/接口设计规范.md?raw'
import databaseDesignMd from '../../../docs/后端开发规范/数据库设计规范.md?raw'
import metricsMd from '../../../docs/后端开发规范/数据度量规范.md?raw'
import signingMd from '../../../docs/后端开发规范/数据签名设计规范.md?raw'
import loggingMd from '../../../docs/后端开发规范/日志规范.md?raw'
import interServiceMd from '../../../docs/后端开发规范/服务间通信规范.md?raw'
import messageQueueMd from '../../../docs/后端开发规范/消息队列规范.md?raw'
import systemArchMd from '../../../docs/微服务架构设计/系统架构设计说明书.md?raw'

/** 文档元数据 */
export interface SpecMeta {
  /** 文档版本 */
  version?: string
  /** 编制日期 */
  date?: string
  /** 适用版本 */
  applies?: string
  /** 文档状态 */
  status?: string
}

/** 规范条目 */
export interface SpecItem {
  /** 路由 key */
  key: string
  /** 显示标题 */
  title: string
  /** 来源文件名 */
  file: string
  /** Markdown 原文 */
  raw: string
  /** 提炼的元数据（从文首 blockquote 解析） */
  meta: SpecMeta
  /** 剔除标题与元数据后的正文 */
  body: string
  /** 所属文档分类 */
  category: SpecCategoryKey
}

/** 文档分类 key */
export type SpecCategoryKey = 'backend' | 'architecture'

/** 文档分类 */
export interface SpecCategory {
  /** 分类 key */
  key: SpecCategoryKey
  /** 分类标题 */
  title: string
  /** 分类图标 */
  icon: Component
  /** 分类内文档 */
  items: SpecItem[]
}

/** 图标 映射 */
export const specIconMap: Record<string, Component> = {
  logging: Notebook,
  'error-handling': Warning,
  'database-design': Coin,
  'api-design': Connection,
  metrics: DataAnalysis,
  signing: Lock,
  'inter-service': Promotion,
  'message-queue': Message,
  'system-architecture': SetUp
}

/** 根据 key 获取图标 */
export function specIcon(key: string): Component {
  return specIconMap[key] || Notebook
}

const META_KEYS: Record<string, keyof SpecMeta> = {
  文档版本: 'version',
  编制日期: 'date',
  适用版本: 'applies',
  文档状态: 'status'
}

/**
 * 从规范原文中剥离第一行标题与头部元数据 blockquote，
 * 返回元数据对象和纯正文。
 */
function parseSpec(raw: string): { meta: SpecMeta; body: string } {
  const lines = raw.split('\n')
  const meta: SpecMeta = {}
  let i = 0

  // 跳过第一行 H1 标题
  i += 1

  // 解析头部 blockquote 元数据，并跳过空行与分隔线
  while (i < lines.length) {
    const line = lines[i].trim()
    if (!line) {
      i++
      continue
    }
    if (line.startsWith('>')) {
      const m = line.match(/^>\s*\*\*([^*]+)\*\*\s*:?\s*(.*)$/)
      if (m && META_KEYS[m[1]]) {
        meta[META_KEYS[m[1]]] = m[2].trim()
      }
      i++
      continue
    }
    if (line === '---' || line.startsWith('--- ')) {
      i++
      continue
    }
    break
  }

  return { meta, body: lines.slice(i).join('\n').trimStart() }
}

/** 构建规范条目（自动解析元数据与正文） */
function buildSpec(
  key: string,
  title: string,
  file: string,
  raw: string,
  category: SpecCategoryKey
): SpecItem {
  const { meta, body } = parseSpec(raw)
  return { key, title, file, raw, meta, body, category }
}

/** 全部规范清单 */
export const specList: SpecItem[] = [
  buildSpec('api-design', '接口设计规范', '接口设计规范', apiDesignMd, 'backend'),
  buildSpec('error-handling', '异常处理规范', '异常处理规范', errorHandlingMd, 'backend'),
  buildSpec('logging', '日志规范', '日志规范', loggingMd, 'backend'),
  buildSpec('database-design', '数据库设计规范', '数据库设计规范', databaseDesignMd, 'backend'),
  buildSpec('inter-service', '服务间通信规范', '服务间通信规范', interServiceMd, 'backend'),
  buildSpec('message-queue', '消息队列规范', '消息队列规范', messageQueueMd, 'backend'),
  buildSpec('metrics', '数据度量规范', '数据度量规范', metricsMd, 'backend'),
  buildSpec('signing', '数据签名设计规范', '数据签名设计规范', signingMd, 'backend'),
  buildSpec(
    'system-architecture',
    '系统架构设计说明书',
    '系统架构设计说明书',
    systemArchMd,
    'architecture'
  )
]

/** 文档分类（用于侧边导航分组） */
export const specCategories: SpecCategory[] = [
  {
    key: 'backend',
    title: '后端开发规范',
    icon: Notebook,
    items: specList.filter((s) => s.category === 'backend')
  },
  {
    key: 'architecture',
    title: '微服务架构设计',
    icon: SetUp,
    items: specList.filter((s) => s.category === 'architecture')
  }
]

/** 分类条目标题 */
export const categoryTitleMap: Record<string, string> = {
  backend: '后端开发规范',
  architecture: '微服务架构设计'
}

/** 根据 key 查找规范 */
export function getSpecByKey(key: string): SpecItem | undefined {
  return specList.find((spec) => spec.key === key)
}