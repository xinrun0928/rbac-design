import type { QuestionBankItem } from '@/types/resource/template'

/** 题库 Mock 数据 */
export const mockQuestionBankData: QuestionBankItem[] = [
  {
    questionId: 'QB001',
    content: '无人机起飞前应重点检查哪项部件是否安装牢固？',
    options: [
      { content: '螺旋桨', isCorrect: true },
      { content: '机身贴纸', isCorrect: false },
      { content: '电池外壳颜色', isCorrect: false },
      { content: '遥控器外壳', isCorrect: false }
    ]
  },
  {
    questionId: 'QB002',
    content: '使用自动体外除颤仪（AED）时应如何放置电极片？',
    options: [
      { content: '保持电极片紧贴患者皮肤', isCorrect: true },
      { content: '隔着衣物直接放置', isCorrect: false },
      { content: '两片电极片相互重叠', isCorrect: false },
      { content: '随意粘贴在任意位置', isCorrect: false }
    ]
  },
  {
    questionId: 'QB003',
    content: '应急场景下使用对讲机通信，应优先采用哪种信道？',
    options: [
      { content: '加密信道', isCorrect: true },
      { content: '公共广播信道', isCorrect: false },
      { content: '娱乐频道', isCorrect: false },
      { content: '无需指定信道', isCorrect: false }
    ]
  },
  {
    questionId: 'QB004',
    content: '使用干粉灭火器前，需确认压力表指针处于哪个区域？',
    options: [
      { content: '绿区', isCorrect: true },
      { content: '红区', isCorrect: false },
      { content: '黄区', isCorrect: false },
      { content: '无需查看压力表', isCorrect: false }
    ]
  },
  {
    questionId: 'QB005',
    content: '启动应急发电机前，应重点确认哪项内容？',
    options: [
      { content: '燃油箱液位是否充足', isCorrect: true },
      { content: '机身颜色是否统一', isCorrect: false },
      { content: '铭牌型号是否清晰', isCorrect: false },
      { content: '排气管是否沾灰', isCorrect: false }
    ]
  },
  {
    questionId: 'QB006',
    content: '穿着救生衣后，必须检查哪项带扣是否系牢？',
    options: [
      { content: '裆带', isCorrect: true },
      { content: '装饰绳', isCorrect: false },
      { content: '标签条', isCorrect: false },
      { content: '提手环', isCorrect: false }
    ]
  },
  {
    questionId: 'QB007',
    content: '应急照明灯使用前应检查哪项内容？',
    options: [
      { content: '电池电量是否充足', isCorrect: true },
      { content: '灯罩透光颜色', isCorrect: false },
      { content: '外壳油漆是否脱落', isCorrect: false },
      { content: '包装盒是否完好', isCorrect: false }
    ]
  },
  {
    questionId: 'QB008',
    content: '使用救援绳索前，应重点检查绳体的哪个方面？',
    options: [
      { content: '有无磨损、断裂', isCorrect: true },
      { content: '颜色是否鲜艳', isCorrect: false },
      { content: '长度标注是否清晰', isCorrect: false },
      { content: '缠绕圈数是否美观', isCorrect: false }
    ]
  },
  {
    questionId: 'QB009',
    content: '使用生命探测仪进行废墟搜救时，应优先探测什么信号？',
    options: [
      { content: '生命体征信号', isCorrect: true },
      { content: '金属探测信号', isCorrect: false },
      { content: '电磁干扰信号', isCorrect: false },
      { content: '天气变化信号', isCorrect: false }
    ]
  },
  {
    questionId: 'QB010',
    content: '操作液压破拆工具作业时，应佩戴哪类防护装备？',
    options: [
      { content: '防护头盔、护目镜和手套', isCorrect: true },
      { content: '普通遮阳帽', isCorrect: false },
      { content: '仅穿长袖衬衫', isCorrect: false },
      { content: '不需要任何防护', isCorrect: false }
    ]
  }
]
