import type { RouteRecordRaw } from 'vue-router'

/**
 * 辅助决策子系统路由 (DECISION)
 * 路径前缀: /decision
 * 包含: 知识管理、辅助决策工具、用户反馈管理、基础管理
 */
const dssRoutes: RouteRecordRaw = {
  path: '/decision',
  component: () => import('@/views/decision/DecisionLayout.vue'),
  meta: { title: '辅助决策', subsystem: 'DECISION' },
  children: [
    // 首页
    { path: 'home', name: 'DecisionHome', component: () => import('@/views/decision/DecisionHome.vue'), meta: { title: '首页' } },
    // 知识管理
    { path: 'knowledge/input', name: 'DecisionKnowledgeInput', component: () => import('@/views/decision/knowledge/Input.vue'), meta: { title: '知识录入' } },
    { path: 'knowledge/audit', name: 'DecisionKnowledgeAudit', component: () => import('@/views/decision/knowledge/Audit.vue'), meta: { title: '审核审批' } },
    { path: 'knowledge/category', name: 'DecisionKnowledgeCategory', component: () => import('@/views/decision/knowledge/Category.vue'), meta: { title: '知识分类' } },
    { path: 'knowledge/maintain', name: 'DecisionKnowledgeMaintain', component: () => import('@/views/decision/knowledge/Maintain.vue'), meta: { title: '知识维护与更新' } },
    { path: 'knowledge/record', name: 'DecisionKnowledgeRecord', component: () => import('@/views/decision/knowledge/Record.vue'), meta: { title: '维护更新记录' } },
    { path: 'knowledge/expire', name: 'DecisionKnowledgeExpire', component: () => import('@/views/decision/knowledge/Expire.vue'), meta: { title: '过期知识处理' } },
    // 辅助决策工具
    { path: 'tool/policy', name: 'DecisionToolPolicy', component: () => import('@/views/decision/tool/Policy.vue'), meta: { title: '政策法规查询' } },
    { path: 'tool/ai', name: 'DecisionToolAI', component: () => import('@/views/decision/tool/AI.vue'), meta: { title: '交通智慧大模型' } },
    // 用户反馈管理
    { path: 'feedback/list', name: 'DecisionFeedbackList', component: () => import('@/views/decision/feedback/List.vue'), meta: { title: '用户反馈' } },
    // 基础管理
    { path: 'basic/management', name: 'DecisionBasicManagement', component: () => import('@/views/decision/basic/BasicManagement.vue'), meta: { title: '基础管理' } },
  ]
}

export default dssRoutes
