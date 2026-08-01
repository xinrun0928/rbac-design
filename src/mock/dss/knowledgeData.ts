import type { KnowledgeItem, KnowledgeCategory, KnowledgeAuditRecord, KnowledgeMaintainPlan, KnowledgeRecord, ExpireKnowledge } from '@/types/dss'

/** 知识维护列表Mock数据 */
export const mockKnowledgeList: KnowledgeItem[] = [
  {
    title: '2024 年 XX 省高速公路危化品运输车辆泄漏事故应急处置复盘案例',
    code: 'JT-LS-2024-001',
    type: '历史案例',
    attachmentCount: 5,
    status: '已提审',
    auditResult: '待审核',
    createTime: '2025-09-11 13:30',
    lastModifier: '张三',
    lastModifyTime: '2025-09-20 13:30',
    version: 'V1.12',
    versionReason: '补充 2024 年事故处置复盘细节，更新现场指挥调度流程完善案例库数据，迭代至 V1.12 版本提交审核。'
  },
  {
    title: '《XX 市道路运输行业突发事件应急预案管理办法（2024 征求意见稿）》',
    code: 'XX交运函〔2024〕28号',
    type: '政策法规',
    attachmentCount: 1,
    status: '已提审',
    auditResult: '不通过',
    createTime: '2025-09-11 13:30',
    lastModifier: '李四',
    lastModifyTime: '2025-09-10 13:30',
    version: 'V2.0',
    versionReason: '根据初审反馈意见，修订预案适用范围、应急响应流程部分内容，形成 V2.0 征求意见稿。'
  },
  {
    title: '《交通运输突发事件应急管理规定（2021 修订）》',
    code: '交通运输部令2021年第13号',
    type: '政策法规',
    attachmentCount: 4,
    status: '已发布',
    auditResult: '已通过',
    createTime: '2025-09-11 13:30',
    lastModifier: '王五',
    lastModifyTime: '2025-09-25 13:30',
    version: 'V1.0',
    versionReason: '首次入库发布交通运输部 2021 年修订版正式法规，为系统提供基础政策依据。'
  },
  {
    title: '道路运输突发事件现场应急处置要点与风险管控技术指南',
    code: 'JT-ZJ-2024-012',
    type: '专家知识',
    attachmentCount: 2,
    status: '已撤回',
    auditResult: '已通过',
    createTime: '2025-09-11 13:30',
    lastModifier: '赵六',
    lastModifyTime: '2025-08-15 13:30',
    version: 'V3.0',
    versionReason: '结合最新行业应急处置标准与多起道路运输事故处置经验，升级为 V3.0 版本。'
  },
  {
    title: '交通运输行业重特大事故应急指挥决策体系构建与实操手册',
    code: 'JT-ZJ-2024-005',
    type: '专家知识',
    attachmentCount: 10,
    status: '草稿',
    auditResult: '-',
    createTime: '2025-09-11 13:30',
    lastModifier: '张三',
    lastModifyTime: '2025-08-30 13:30',
    version: 'V1.12',
    versionReason: '持续补充广东地区交通重特大事故指挥调度典型案例，优化决策指引，迭代至 V1.12 草稿版。'
  },
  {
    title: 'XX 市交通运输行业应急救援队伍与装备资源台账（2024 版）',
    code: 'JT-YJZY-2024-009',
    type: '应急资源',
    attachmentCount: 1,
    status: '已发布',
    auditResult: '已通过',
    createTime: '2025-09-11 13:30',
    lastModifier: '李四',
    lastModifyTime: '2024-12-05 13:30',
    version: 'V1.12',
    versionReason: '更新 2024 年度 XX 市交通运输行业应急救援队伍、装备匹配规则，形成 V1.12 正式发布版。'
  }
]

/** 知识分类Mock数据 */
export const mockKnowledgeCategory: KnowledgeCategory[] = [
  {
    id: 1,
    name: '历史案例',
    status: '启用',
    lastModifyTime: '2025-09-13 13:30',
    lastOperator: '张三',
    totalCount: 923
  },
  {
    id: 2,
    name: '政策法规',
    status: '启用',
    lastModifyTime: '2025-09-13 13:30',
    lastOperator: '张三',
    totalCount: 700,
    children: [
      { id: 21, name: '法律', status: '启用', lastModifyTime: '2025-09-13 13:30', lastOperator: '张三', totalCount: 100 },
      { id: 22, name: '行政法规', status: '启用', lastModifyTime: '2025-09-13 13:30', lastOperator: '张三', totalCount: 100 },
      { id: 23, name: '国务院部门规章', status: '启用', lastModifyTime: '2025-09-13 13:30', lastOperator: '张三', totalCount: 100 },
      { id: 24, name: '行政法规', status: '启用', lastModifyTime: '2025-09-13 13:30', lastOperator: '张三', totalCount: 100 },
      { id: 25, name: '地方性法规', status: '启用', lastModifyTime: '2025-09-13 13:30', lastOperator: '张三', totalCount: 100 },
      { id: 26, name: '地方政府规章', status: '启用', lastModifyTime: '2025-09-13 13:30', lastOperator: '张三', totalCount: 100 },
      { id: 27, name: '司法解释', status: '停用', lastModifyTime: '2025-09-13 13:30', lastOperator: '张三', totalCount: 100 }
    ]
  },
  {
    id: 3,
    name: '专家知识',
    status: '启用',
    lastModifyTime: '2025-09-13 13:30',
    lastOperator: '张三',
    totalCount: 800
  },
  {
    id: 4,
    name: '标准规范',
    status: '启用',
    lastModifyTime: '2025-09-13 13:30',
    lastOperator: '张三',
    totalCount: 800
  }
]

/** 审核审批Mock数据 */
export const mockAuditRecords: KnowledgeAuditRecord[] = [
  {
    name: '广州市发展和改革委员会关于简易修改广州市轨道交通领域自主创新产品评定及推广应用实施办法的通知',
    code: '穗发改规字〔2026〕4号',
    type: '政策法规',
    source: '常规录入',
    auditStatus: '待审核',
    handler: '张三',
    applyTime: '2025-10-15 13:00',
    auditor: '李四'
  },
  {
    name: '2024 年 XX 省高速公路危化品运输车辆泄漏事故应急处置复盘案例',
    code: 'JT-LS-2024-001',
    type: '历史案例',
    source: '知识维护与更新',
    auditStatus: '已通过',
    handler: '张三',
    applyTime: '2023-09-01 13:00',
    auditor: '李四'
  },
  {
    name: '公路工程行业标准编写导则',
    code: 'JTG 1003-2023',
    type: '标准规范',
    source: '常规录入',
    auditStatus: '未通过',
    handler: '张三',
    applyTime: '2023-09-01 13:00',
    auditor: '李四'
  }
]

/** 知识维护与更新计划Mock数据 */
export const mockMaintainPlans: KnowledgeMaintainPlan[] = [
  {
    name: '《交通运输行业安全管理标准规范月度更新计划》',
    relatedType: '标准规范',
    cycle: '每月1次',
    enabled: '已启用',
    creator: '张三',
    lastModifier: '张三',
    lastModifyTime: '2025-10-11'
  },
  {
    name: '《道路运输事故典型案例每周复盘更新计划》',
    relatedType: '历史案例',
    cycle: '每周1次',
    enabled: '未启用',
    creator: '李四',
    lastModifier: '李四',
    lastModifyTime: '2025-10-11'
  },
  {
    name: '《交通运输行业政策法规月度更新计划》',
    relatedType: '政策法规',
    cycle: '每月1次',
    enabled: '已启用',
    creator: '王五',
    lastModifier: '王五',
    lastModifyTime: '2025-10-11'
  },
  {
    name: '《交通运输应急处置专家知识库月度更新计划》',
    relatedType: '专家知识',
    cycle: '每月1次',
    enabled: '已启用',
    creator: '张三',
    lastModifier: '张三',
    lastModifyTime: '2025-10-11'
  },
  {
    name: '《水路/公路运输突发事件历史案例月度更新计划》',
    relatedType: '历史案例',
    cycle: '每月1次',
    enabled: '已启用',
    creator: '张三',
    lastModifier: '张三',
    lastModifyTime: '2025-10-11'
  },
  {
    name: '《交通运输工程建设标准规范月度更新计划》',
    relatedType: '标准规范',
    cycle: '每月1次',
    enabled: '未启用',
    creator: '张三',
    lastModifier: '张三',
    lastModifyTime: '2025-10-11'
  }
]

/** 知识维护更新记录Mock数据 */
export const mockKnowledgeRecords: KnowledgeRecord[] = [
  {
    execStatus: '执行中',
    taskName: '广东省交通运输指挥调度地方标准规范2025年三季度维护更新',
    relatedType: '标准规范',
    executor: '张三',
    executorPhone: '13598695485',
    progress: '4/5',
    needRevision: 1,
    newCount: 2,
    removedCount: 1,
    expectDate: '2025-09-11',
    actualDate: '-'
  },
  {
    execStatus: '待执行',
    taskName: '2025年广东省道路运输突发事件指挥调度典型案例库补充更新',
    relatedType: '历史案例',
    executor: '李四',
    executorPhone: '18856945265',
    progress: '0/5',
    needRevision: 0,
    newCount: 0,
    removedCount: 0,
    expectDate: '2025-09-11',
    actualDate: '-'
  },
  {
    execStatus: '已完成',
    taskName: '广东省交通运输指挥调度相关政策法规 2025年合规梳理与更新',
    relatedType: '政策法规',
    executor: '王五',
    executorPhone: '19065559238',
    progress: '5/5',
    needRevision: 1,
    newCount: 1,
    removedCount: 1,
    expectDate: '2025-09-11',
    actualDate: '2025-10-11'
  },
  {
    execStatus: '已完成',
    taskName: '广东省交通指挥调度专家知识库（应急处置模块）2025 年更新维护',
    relatedType: '专家知识',
    executor: '张三',
    executorPhone: '13598695485',
    progress: '5/5',
    needRevision: 0,
    newCount: 1,
    removedCount: 0,
    expectDate: '2025-09-11',
    actualDate: '2025-10-11'
  },
  {
    execStatus: '已完成',
    taskName: '广东省近年高速公路/水路运输突发事件指挥调度复盘案例更新',
    relatedType: '历史案例',
    executor: '张三',
    executorPhone: '13598695485',
    progress: '5/5',
    needRevision: 0,
    newCount: 2,
    removedCount: 1,
    expectDate: '2025-09-11',
    actualDate: '2025-10-11'
  },
  {
    execStatus: '已完成',
    taskName: '广东省交通运输运行监测与应急指挥系统配套标准规范维护更新',
    relatedType: '标准规范',
    executor: '李四',
    executorPhone: '18856945265',
    progress: '5/5',
    needRevision: 0,
    newCount: 1,
    removedCount: 1,
    expectDate: '2025-09-11',
    actualDate: '2025-10-11'
  }
]

/** 过期知识处理Mock数据 */
export const mockExpireKnowledge: ExpireKnowledge[] = [
  {
    handleStatus: '待处理',
    name: '2020 年 XX 市高速公路危化品运输事故指挥调度处置复盘案例',
    code: 'JT-LS-2020-012',
    type: '历史案例',
    validPeriod: '2020-10-01 至 2025-09-30',
    source: '系统识别',
    applicant: '-',
    applyDate: '2025-09-11',
    attachments: [],
    handler: '-',
    handleResult: '-',
    handleDesc: '-',
    handleDate: '-'
  },
  {
    handleStatus: '待处理',
    name: '广东省道路运输突发事件应急预案管理办法（2019 版）',
    code: '粤交应急〔2019〕45 号',
    type: '政策法规',
    validPeriod: '2019-06-01 至 2023-12-31',
    source: '系统识别',
    applicant: '-',
    applyDate: '2025-09-11',
    attachments: [],
    handler: '李四',
    handleResult: '作废处理',
    handleDesc: '该文件已被 2023 年修订版《广东省交通运输突发事件应急预案管理办法》替代，旧版已不再适用，予以作废。',
    handleDate: '2025-09-11'
  },
  {
    handleStatus: '已处理',
    name: '《广东省交通运输运行监测与应急指挥系统技术规范（2020 版）》',
    code: 'DB44/T 2568-2020',
    type: '标准规范',
    validPeriod: '2020-08-01 至 2024-05-31',
    source: '手动申请',
    applicant: '王五（19065559238）',
    applyDate: '2025-09-11',
    attachments: [],
    handler: '张三',
    handleResult: '下架归档',
    handleDesc: '该标准已被 DB44/T 2568-2024 新版替代，旧版技术要求与现行系统建设规范不符，予以下架归档，不再作为业务依据。',
    handleDate: '2025-09-11'
  },
  {
    handleStatus: '已处理',
    name: '2021 年 XX 省干线公路拥堵事件指挥调度处置复盘案例',
    code: 'JT-LS-2021-023',
    type: '历史案例',
    validPeriod: '2021-07-01 至 2025-06-30',
    source: '手动申请',
    applicant: '张三（13598695485）',
    applyDate: '2025-09-11',
    attachments: [],
    handler: '张三',
    handleResult: '继续留存',
    handleDesc: '该案例处置经验已被新版《高速公路拥堵事件应急处置指南》吸收，因案例仍具独立指导价值，作为历史资料归档。',
    handleDate: '2025-09-11'
  },
  {
    handleStatus: '已处理',
    name: '广东省交通运输行业应急指挥平台建设管理规范（2021 版）',
    code: '粤交科技〔2021〕32 号',
    type: '政策法规',
    validPeriod: '2021-09-01 至 2024-08-31',
    source: '系统识别',
    applicant: '-',
    applyDate: '2025-09-11',
    attachments: [],
    handler: '李四',
    handleResult: '作废处理',
    handleDesc: '该文件已被 2024 年发布的《广东省交通运输运行监测与应急指挥系统建设技术要求》替代，旧版平台建设规范已失效，予以作废。',
    handleDate: '2025-09-11'
  },
  {
    handleStatus: '已处理',
    name: '广东省交通指挥调度早期应急处置技术要点（2021 版）',
    code: 'JT-ZJ-2021-007',
    type: '专家知识',
    validPeriod: '2021-11-01 至 2024-10-31',
    source: '系统识别',
    applicant: '-',
    applyDate: '2025-09-11',
    attachments: [],
    handler: '王五',
    handleResult: '更新替代',
    handleDesc: '该专家知识内容已被 2024 版《交通运输突发事件现场应急处置指南》覆盖，旧版已过期，替换为新版专家知识。',
    handleDate: '2025-09-11'
  }
]
