import type { FeedbackItem } from '@/types/dss'

/** 用户反馈Mock数据 */
export const mockFeedbackList: FeedbackItem[] = [
  {
    id: 'FK-JT-2025001',
    userName: '陈杰',
    phone: '13800138001',
    relatedKnowledge: '《广东省道路运输突发事件应急预案管理办法（2019 版）》（粤交应急〔2019〕45 号）',
    feedbackType: '版本过期',
    content: '查询《广东省道路运输突发事件应急预案管理办法》，系统显示 2019 版，无最新 2023 修订版内容',
    handleStatus: '已处理',
    handleMethod: '更新版本',
    handlePlan: '已更新 2023 版法规至系统，同步下架过期版本',
    handler: '张三（13598695485）',
    handleTime: '2025-09-11'
  },
  {
    id: 'FK-JT-2025002',
    userName: '林枫',
    phone: '13900139002',
    relatedKnowledge: '《广东省交通运输运行监测与应急指挥系统技术规范》（DB44/T 2568-2024）',
    feedbackType: '内容错误',
    content: '查询 DB44/T 2568-2024 应急指挥系统规范，部分技术参数与官方发布文件不一致',
    handleStatus: '已处理',
    handleMethod: '修正内容',
    handlePlan: '正在核对官方标准原文，修正错误数据',
    handler: '李四（18856945265）',
    handleTime: '2025-09-11'
  },
  {
    id: 'FK-JT-2025003',
    userName: '黄敏',
    phone: '13900139003',
    relatedKnowledge: '《广东省高速公路交通运行监测与调度管理规范》（DB44/T 2701-2024）',
    feedbackType: '信息缺失',
    content: '未查询到《广东省高速公路交通运行监测与调度管理规范》全文内容，仅显示目录',
    handleStatus: '待处理',
    handleMethod: '-',
    handlePlan: '-',
    handler: '王五（19065559238）',
    handleTime: '2025-09-11'
  },
  {
    id: 'FK-JT-2025004',
    userName: '周勇',
    phone: '13900139004',
    relatedKnowledge: '《广东省交通运输指挥调度数据共享与交换规范》（DB44/T 2415-2023）',
    feedbackType: '系统故障',
    content: '搜索「广东交通指挥调度数据共享规范」，系统无响应、无法加载结果',
    handleStatus: '已处理',
    handleMethod: '系统功能修复',
    handlePlan: '修复搜索接口故障，已可正常查询',
    handler: '张三（13598695485）',
    handleTime: '2025-09-11'
  },
  {
    id: 'FK-JT-2025005',
    userName: '吴瑞',
    phone: '13900139005',
    relatedKnowledge: '广东省交通运输行业 DB44/T 系列地方标准（含应急指挥、运行监控类规范）',
    feedbackType: '优化建议',
    content: '希望增加「广东地方标准（DB44/T）」分类筛选，快速定位交通指挥调度类标准',
    handleStatus: '已处理',
    handleMethod: '优化建议采纳',
    handlePlan: '已新增 DB44/T 分类筛选功能，优化查询体验',
    handler: '张三（13598695485）',
    handleTime: '2025-09-11'
  },
  {
    id: 'FK-JT-2025006',
    userName: '郑合',
    phone: '13900139006',
    relatedKnowledge: '广东省水路运输突发事件应急指挥调度相关法规标准（待补充）',
    feedbackType: '其他',
    content: '建议补充水路运输应急指挥调度相关法规标准，完善行业覆盖',
    handleStatus: '待处理',
    handleMethod: '-',
    handlePlan: '-',
    handler: '李四（18856945265）',
    handleTime: '2025-09-11'
  }
]
