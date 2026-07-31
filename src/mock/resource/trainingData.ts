import type { EquipmentTraining, TrainingCategory, TrainingResourceType } from '@/types/resource/training'

interface TrainingSeed {
  courseName: string
  courseCode: string
  category: TrainingCategory
  equipmentCategory: string
  equipmentModel: string
  resourceTypeList: TrainingResourceType[]
  status: number
  createBy: string
  remark: string
}

const seeds: TrainingSeed[] = [
  {
    courseName: '大疆 Mavic3 Pro 无人机操作培训课程包',
    courseCode: 'PEIX-202510-001',
    category: '应急装备及配套物资',
    equipmentCategory: '应急装备及配套物资/搜救设备',
    equipmentModel: '大疆 Mavic3 Pro',
    resourceTypeList: ['操作手册', '演示视频', '安全注意事项', '事故案例'],
    status: 1,
    createBy: '张三',
    remark: '适用于灾情侦察、空中巡查作业'
  },
  {
    courseName: '数字对讲机操作与维保培训课程包',
    courseCode: 'PEIX-202510-002',
    category: '应急装备及配套物资',
    equipmentCategory: '应急装备及配套物资/通信设备',
    equipmentModel: '摩托罗拉 GP328D+',
    resourceTypeList: ['操作手册', '演示视频', '维保要点', '干扰处理案例'],
    status: 1,
    createBy: '李四',
    remark: '面向班组一级的通信指挥保障'
  },
  {
    courseName: '户外移动电源操作培训课程包',
    courseCode: 'PEIX-202510-003',
    category: '应急装备及配套物资',
    equipmentCategory: '应急装备及配套物资/发电设备',
    equipmentModel: '大疆户外电源 / 正浩 EcoFlow',
    resourceTypeList: ['操作手册', '演示视频', '安全注意事项'],
    status: 1,
    createBy: '张三',
    remark: '野外作业电力保障'
  },
  {
    courseName: '救生衣与救生圈使用培训课程包',
    courseCode: 'PEIX-202510-004',
    category: '应急装备及配套物资',
    equipmentCategory: '应急装备及配套物资/水域救援设备',
    equipmentModel: '成人救生衣 / 专业救生圈',
    resourceTypeList: ['操作手册', '演示视频', '安全注意事项', '事故案例'],
    status: 1,
    createBy: '王五',
    remark: '洪涝、溺水等水域救援使用'
  },
  {
    courseName: '液压破拆工具组操作培训课程包',
    courseCode: 'PEIX-202510-005',
    category: '应急装备及配套物资',
    equipmentCategory: '应急装备及配套物资/其他',
    equipmentModel: '液压破拆工具组',
    resourceTypeList: ['操作手册', '演示视频', '安全注意事项', '事故案例'],
    status: 1,
    createBy: '赵六',
    remark: '地震、坍塌现场破拆救援'
  },
  {
    courseName: '消防水枪与水带操作培训课程包',
    courseCode: 'PEIX-202510-006',
    category: '应急装备及配套物资',
    equipmentCategory: '消防器材',
    equipmentModel: '消防水枪 / 消防水带',
    resourceTypeList: ['操作手册', '演示视频', '安全注意事项'],
    status: 0,
    createBy: '孙七',
    remark: '初期火灾扑救操作训练'
  },
  {
    courseName: '便携式对讲机操作培训课程包',
    courseCode: 'PEIX-202510-007',
    category: '应急装备及配套物资',
    equipmentCategory: '应急装备及配套物资/通信设备',
    equipmentModel: '科立讯 PT560',
    resourceTypeList: ['操作手册', '维保要点', '故障排查指南'],
    status: 1,
    createBy: '张三',
    remark: '应急现场近距离通信保障'
  },
  {
    courseName: '强光探照灯操作培训课程包',
    courseCode: 'PEIX-202510-008',
    category: '应急装备及配套物资',
    equipmentCategory: '应急装备及配套物资/其他',
    equipmentModel: '强光探照灯 / 头戴式探照灯',
    resourceTypeList: ['操作手册', '演示视频', '安全注意事项'],
    status: 1,
    createBy: '李四',
    remark: '夜间搜救、现场照明使用'
  },
  {
    courseName: '应急帐篷搭建培训课程包',
    courseCode: 'PEIX-202510-009',
    category: '基本生活保障物资',
    equipmentCategory: '基本生活保障物资/住宿物资',
    equipmentModel: '双人帐篷 / 折叠帐篷',
    resourceTypeList: ['操作手册', '演示视频', '安全注意事项'],
    status: 1,
    createBy: '王五',
    remark: '野外驻训、灾民安置'
  },
  {
    courseName: '应急食品保障使用培训课程包',
    courseCode: 'PEIX-202510-010',
    category: '基本生活保障物资',
    equipmentCategory: '基本生活保障物资/生活物资',
    equipmentModel: '压缩干粮 / 应急饮用水',
    resourceTypeList: ['操作手册', '安全注意事项'],
    status: 1,
    createBy: '赵六',
    remark: '灾区应急食品供应'
  },
  {
    courseName: '应急棉被与保暖物资使用培训课程包',
    courseCode: 'PEIX-202510-011',
    category: '基本生活保障物资',
    equipmentCategory: '基本生活保障物资/生活物资',
    equipmentModel: '应急棉被 / 羽绒服',
    resourceTypeList: ['操作手册', '安全注意事项'],
    status: 0,
    createBy: '孙七',
    remark: '寒冷地区灾民保暖保障'
  },
  {
    courseName: '柴油发电机组操作培训课程包',
    courseCode: 'PEIX-202510-012',
    category: '应急装备及配套物资',
    equipmentCategory: '应急装备及配套物资/发电设备',
    equipmentModel: '柴油发电机组 5KW',
    resourceTypeList: ['操作手册', '演示视频', '维保要点', '安全注意事项'],
    status: 1,
    createBy: '张三',
    remark: '灾区应急电力保障'
  },
  {
    courseName: '挖掘机应急操作培训课程包',
    courseCode: 'PEIX-202510-013',
    category: '工程材料与机械加工',
    equipmentCategory: '工程材料与机械加工/工程机械',
    equipmentModel: '小型挖掘机',
    resourceTypeList: ['操作手册', '演示视频', '安全注意事项', '事故案例'],
    status: 1,
    createBy: '李四',
    remark: '道路抢险、土方作业'
  },
  {
    courseName: '移动式排水泵操作培训课程包',
    courseCode: 'PEIX-202510-014',
    category: '应急装备及配套物资',
    equipmentCategory: '应急装备及配套物资/水域救援设备',
    equipmentModel: '移动式排水泵',
    resourceTypeList: ['操作手册', '演示视频', '维保要点'],
    status: 1,
    createBy: '王五',
    remark: '城市内涝、堤防抢险排涝'
  },
  {
    courseName: '化学防护服穿戴培训课程包',
    courseCode: 'PEIX-202510-015',
    category: '应急装备及配套物资',
    equipmentCategory: '应急装备及配套物资/其他',
    equipmentModel: '化学防护服 / 空气呼吸器',
    resourceTypeList: ['操作手册', '演示视频', '安全注意事项', '事故案例'],
    status: 1,
    createBy: '赵六',
    remark: '危化品泄漏、中毒事故处置'
  },
  {
    courseName: '安全头盔与吊带使用培训课程包',
    courseCode: 'PEIX-202510-016',
    category: '应急装备及配套物资',
    equipmentCategory: '应急装备及配套物资/其他',
    equipmentModel: '安全头盔 / 全身式安全吊带',
    resourceTypeList: ['操作手册', '演示视频', '安全注意事项'],
    status: 0,
    createBy: '孙七',
    remark: '高空作业救援防护'
  },
  {
    courseName: '急救箱使用培训课程包',
    courseCode: 'PEIX-202510-017',
    category: '应急装备及配套物资',
    equipmentCategory: '应急装备及配套物资/医疗救援设备',
    equipmentModel: '急救箱 / 自动体外除颤仪',
    resourceTypeList: ['操作手册', '演示视频', '安全注意事项'],
    status: 1,
    createBy: '张三',
    remark: '现场医疗急救保障'
  },
  {
    courseName: '救生抛投器操作培训课程包',
    courseCode: 'PEIX-202510-018',
    category: '应急装备及配套物资',
    equipmentCategory: '应急装备及配套物资/水域救援设备',
    equipmentModel: '救生抛投器',
    resourceTypeList: ['操作手册', '演示视频', '安全注意事项', '事故案例'],
    status: 1,
    createBy: '李四',
    remark: '水域远距离救援抛投'
  },
  {
    courseName: '除雪铲与融雪剂使用培训课程包',
    courseCode: 'PEIX-202510-019',
    category: '工程材料与机械加工',
    equipmentCategory: '工程材料与机械加工/应急物资',
    equipmentModel: '除雪铲 / 融雪剂',
    resourceTypeList: ['操作手册', '安全注意事项'],
    status: 1,
    createBy: '王五',
    remark: '雨雪冰冻灾害道路抢险'
  },
  {
    courseName: '便携式土方支护操作培训课程包',
    courseCode: 'PEIX-202510-020',
    category: '工程材料与机械加工',
    equipmentCategory: '工程材料与机械加工/工程机械',
    equipmentModel: '便携式土方支护设备',
    resourceTypeList: ['操作手册', '演示视频', '安全注意事项'],
    status: 0,
    createBy: '赵六',
    remark: '山体滑坡、泥石流等地质灾害处置'
  }
]

function buildResourceTypes(list: TrainingResourceType[]): string {
  return list.join('、')
}

function formatDate(base: Date, offsetDays: number, withTime = false): string {
  const d = new Date(base)
  d.setDate(d.getDate() + offsetDays)
  const pad = (n: number) => String(n).padStart(2, '0')
  const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  if (!withTime) return dateStr
  return `${dateStr} ${pad(8 + (offsetDays % 12))}:${pad(offsetDays % 60)}`
}

export const equipmentTrainingData: EquipmentTraining[] = seeds.map((seed, i) => {
  const createDate = new Date(2025, 9, 1 + (i % 10))
  const updateDate = new Date(2025, 10, 1 + (i % 15))
  return {
    courseId: `TRN${String(i + 1).padStart(4, '0')}`,
    courseName: seed.courseName,
    courseCode: seed.courseCode,
    category: seed.category,
    equipmentCategory: seed.equipmentCategory,
    equipmentModel: seed.equipmentModel,
    resourceTypes: buildResourceTypes(seed.resourceTypeList),
    resourceTypeList: [...seed.resourceTypeList],
    attachmentCount: seed.resourceTypeList.length,
    status: seed.status,
    createBy: seed.createBy,
    createTime: formatDate(createDate, i % 10),
    updateTime: formatDate(updateDate, i % 15, true),
    remark: seed.remark
  }
})

import type { EquipmentAssessmentRecord, AssessmentStatus } from '@/types/resource/training'

interface AssessmentSeed {
  taskName: string
  templateName: string
  assessors: string[]
  startDate: string
  endDate: string
  progress: number
  status: AssessmentStatus
  createBy: string
  remark: string
}

const assessmentSeeds: AssessmentSeed[] = [
  {
    taskName: '大疆 Mavic3 操作考核',
    templateName: '大疆 Mavic3 操作考核模板',
    assessors: ['陈飞', '林晓', '张伟'],
    startDate: '2025-10-10',
    endDate: '2025-10-17',
    progress: 100,
    status: 'completed',
    createBy: '张三',
    remark: '无人机操作规范考核'
  },
  {
    taskName: '对讲机操作考核',
    templateName: '通讯设备操作考核模板',
    assessors: ['张伟', '李娜', '王浩'],
    startDate: '2025-10-12',
    endDate: '2025-10-19',
    progress: 70,
    status: 'in_progress',
    createBy: '李四',
    remark: '通信设备日常操作考核'
  },
  {
    taskName: '强光手电使用考核',
    templateName: '照明设备操作考核模板',
    assessors: ['陈飞', '赵阳'],
    startDate: '2025-10-15',
    endDate: '2025-10-22',
    progress: 0,
    status: 'not_started',
    createBy: '王五',
    remark: '照明设备使用规范考核'
  },
  {
    taskName: '卫星电话操作考核',
    templateName: '卫星通信设备考核模板',
    assessors: ['陈飞', '张伟'],
    startDate: '2025-10-18',
    endDate: '2025-10-25',
    progress: 50,
    status: 'in_progress',
    createBy: '赵六',
    remark: '卫星通信设备应急操作考核'
  },
  {
    taskName: '旧款对讲机操作考核',
    templateName: '通讯设备基础考核模板',
    assessors: ['李娜', '王浩'],
    startDate: '2025-10-08',
    endDate: '2025-10-15',
    progress: 100,
    status: 'completed',
    createBy: '孙七',
    remark: '旧型号对讲机基础操作考核'
  },
  {
    taskName: '应急装备综合考核',
    templateName: '综合装备考核模板',
    assessors: ['陈飞', '林晓', '张伟', '李娜'],
    startDate: '2025-10-20',
    endDate: '2025-10-27',
    progress: 0,
    status: 'not_started',
    createBy: '张三',
    remark: '多种装备综合操作能力考核'
  }
]

export const equipmentAssessmentData: EquipmentAssessmentRecord[] = assessmentSeeds.map((seed, i) => ({
  taskId: `AST${String(i + 1).padStart(4, '0')}`,
  taskName: seed.taskName,
  templateId: `TPL${String(i + 1).padStart(4, '0')}`,
  templateName: seed.templateName,
  assessors: seed.assessors,
  startDate: seed.startDate,
  endDate: seed.endDate,
  progress: seed.progress,
  status: seed.status,
  createBy: seed.createBy,
  createTime: `${seed.startDate} 09:00:00`,
  remark: seed.remark
}))
