import type { RouteRecordRaw } from 'vue-router'

/**
 * 应急预案管理子系统路由 (EMERGENCY_PLAN)
 * 路径前缀: /plan
 * 包含: 预案编制、演练、复盘
 */
const planRoutes: RouteRecordRaw = {
  path: '/plan',
  component: () => import('@/views/plan/PlanLayout.vue'),
  meta: { title: '应急预案管理', subsystem: 'EMERGENCY_PLAN' },
  children: [
    // 应急预案库
    { path: 'library/category', name: 'PlanLibraryCategory', component: () => import('@/views/plan/library/Category.vue'), meta: { title: '分类层级管理' } },
    { path: 'library/audit', name: 'PlanLibraryAudit', component: () => import('@/views/plan/library/Audit.vue'), meta: { title: '预案审核' } },
    { path: 'library/template', name: 'PlanLibraryTemplate', component: () => import('@/views/plan/library/Template.vue'), meta: { title: '模板管理' } },
    { path: 'library/scenario', name: 'PlanLibraryScenario', component: () => import('@/views/plan/library/Scenario.vue'), meta: { title: '场景管理' } },
    // 应急预案生成
    { path: 'generate/module', name: 'PlanGenerateModule', component: () => import('@/views/plan/generate/Module.vue'), meta: { title: '预案模块生成与调整' } },
    { path: 'generate/sample', name: 'PlanGenerateSample', component: () => import('@/views/plan/generate/Sample.vue'), meta: { title: '情景样本库' } },
    { path: 'generate/storage', name: 'PlanGenerateStorage', component: () => import('@/views/plan/generate/Storage.vue'), meta: { title: '规范存储与管理' } },
    { path: 'generate/indicator', name: 'PlanGenerateIndicator', component: () => import('@/views/plan/generate/Indicator.vue'), meta: { title: '评估指标提示词' } },
    { path: 'generate/chapter', name: 'PlanGenerateChapter', component: () => import('@/views/plan/generate/Chapter.vue'), meta: { title: '内容章节提示词' } },
    // 应急模拟演练
    { path: 'drill/design', name: 'PlanDrillDesign', component: () => import('@/views/plan/drill/Design.vue'), meta: { title: '演练设计管理' } },
    { path: 'drill/control', name: 'PlanDrillControl', component: () => import('@/views/plan/drill/Control.vue'), meta: { title: '演练过程控制' } },
    { path: 'drill/task', name: 'PlanDrillTask', component: () => import('@/views/plan/drill/Task.vue'), meta: { title: '演练响应任务' } },
    { path: 'drill/group', name: 'PlanDrillGroup', component: () => import('@/views/plan/drill/Group.vue'), meta: { title: '小组管理' } },
    // 模型微调
    { path: 'model/tune', name: 'PlanModelTune', component: () => import('@/views/plan/model/ModelTune.vue'), meta: { title: '模型微调' } },
    // 应急响应启动
    { path: 'response/start', name: 'PlanResponseStart', component: () => import('@/views/plan/response/ResponseStart.vue'), meta: { title: '应急响应启动' } },
    // 维度定义
    { path: 'dimension', name: 'PlanDimension', component: () => import('@/views/plan/dimension/Dimension.vue'), meta: { title: '维度定义' } },
    // 规范接口接入
    { path: 'interface', name: 'PlanInterface', component: () => import('@/views/plan/interface/Interface.vue'), meta: { title: '规范接口接入' } },
    // 操作日志
    { path: 'log', name: 'PlanLog', component: () => import('@/views/plan/log/PlanLog.vue'), meta: { title: '操作日志' } },
  ]
}

export default planRoutes
