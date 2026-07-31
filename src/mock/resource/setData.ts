import type { EquipmentSet, EquipmentSetItem } from '@/types/resource/set'

/** 套组装备明细 */
interface SetSeed {
  /** 套组名称 */
  setName: string
  /** 套组装备 */
  items: Array<Pick<EquipmentSetItem, 'equipmentName' | 'category' | 'unit' | 'quantity'>>
  /** 启用状态: 1-已启用 0-未启用 */
  status: number
  /** 创建人 */
  createBy: string
  /** 备注 */
  remark: string
}

/** 设备物资类别 */
const categories = {
  drone: '应急处装备及配套物资/搜救设备',
  power: '应急处装备及配套物资/发电设备',
  comm: '应急处装备及配套物资/通信设备',
  other: '应急处装备及配套物资/其他',
  fire: '消防器材',
  water: '应急处装备及配套物资/水域救援设备',
  medical: '应急处装备及配套物资/医疗救援设备'
}

const seeds: SetSeed[] = [
  {
    setName: '无人机侦查套组',
    items: [
      { equipmentName: '大疆 Mavic3 Pro', category: categories.drone, unit: '台', quantity: 1 },
      { equipmentName: '户外移动电源', category: categories.power, unit: '个', quantity: 2 },
      { equipmentName: '备用电池包', category: categories.drone, unit: '块', quantity: 4 },
      { equipmentName: '内存卡', category: categories.other, unit: '张', quantity: 3 }
    ],
    status: 1,
    createBy: '张三',
    remark: '适用于灾情侦察、空中巡查作业'
  },
  {
    setName: '班组通信指挥套组',
    items: [
      { equipmentName: '摩托罗拉 GP328D 对讲机', category: categories.comm, unit: '台', quantity: 4 },
      { equipmentName: '对讲机充电底座', category: categories.comm, unit: '个', quantity: 1 },
      { equipmentName: '备用电池', category: categories.comm, unit: '块', quantity: 4 },
      { equipmentName: '通信耳机', category: categories.comm, unit: '副', quantity: 4 }
    ],
    status: 0,
    createBy: '张三',
    remark: '面向班组一级的通信指挥保障'
  },
  {
    setName: '夜间搜救照明套组',
    items: [
      { equipmentName: '强光探照灯', category: categories.other, unit: '盏', quantity: 2 },
      { equipmentName: '头戴式探照灯', category: categories.other, unit: '个', quantity: 3 },
      { equipmentName: '户外移动电源', category: categories.power, unit: '个', quantity: 1 },
      { equipmentName: '备用电池包', category: categories.other, unit: '块', quantity: 3 }
    ],
    status: 1,
    createBy: '李四',
    remark: '夜间搜救、现场照明专用'
  },
  {
    setName: '野外供电保障套组',
    items: [
      { equipmentName: '户外移动电源', category: categories.power, unit: '个', quantity: 3 },
      { equipmentName: '快充充电线套装', category: categories.power, unit: '套', quantity: 3 },
      { equipmentName: '电源防护箱', category: categories.power, unit: '个', quantity: 1 }
    ],
    status: 1,
    createBy: '张三',
    remark: '野外作业电力保障'
  },
  {
    setName: '应急通信备份套组',
    items: [
      { equipmentName: '备用对讲机', category: categories.comm, unit: '台', quantity: 2 },
      { equipmentName: '便携式信号放大器', category: categories.comm, unit: '台', quantity: 1 },
      { equipmentName: '应急充电电源', category: categories.power, unit: '个', quantity: 1 }
    ],
    status: 1,
    createBy: '王五',
    remark: '主通信链路中断时的应急备份'
  },
  {
    setName: '水域救援套组',
    items: [
      { equipmentName: '救生衣', category: categories.water, unit: '件', quantity: 10 },
      { equipmentName: '救生圈', category: categories.water, unit: '个', quantity: 6 },
      { equipmentName: '水域救援绳索', category: categories.water, unit: '根', quantity: 4 },
      { equipmentName: '防水强光手电', category: categories.water, unit: '支', quantity: 6 }
    ],
    status: 1,
    createBy: '李四',
    remark: '洪涝、溺水等水域险情救援'
  },
  {
    setName: '森林灭火套组',
    items: [
      { equipmentName: '背负式灭火水枪', category: categories.fire, unit: '台', quantity: 4 },
      { equipmentName: '风力灭火机', category: categories.fire, unit: '台', quantity: 2 },
      { equipmentName: '防火服', category: categories.fire, unit: '套', quantity: 6 },
      { equipmentName: '灭火弹', category: categories.fire, unit: '枚', quantity: 20 }
    ],
    status: 1,
    createBy: '赵六',
    remark: '森林火灾早期处置'
  },
  {
    setName: '地震救援破拆套组',
    items: [
      { equipmentName: '液压破拆工具组', category: categories.other, unit: '套', quantity: 1 },
      { equipmentName: '无齿锯', category: categories.other, unit: '台', quantity: 2 },
      { equipmentName: '液压千斤顶', category: categories.other, unit: '台', quantity: 2 },
      { equipmentName: '救援撬棍', category: categories.other, unit: '根', quantity: 4 }
    ],
    status: 1,
    createBy: '孙七',
    remark: '地震、坍塌现场破拆救援'
  },
  {
    setName: '防汛排涝套组',
    items: [
      { equipmentName: '移动式排水泵', category: categories.water, unit: '台', quantity: 2 },
      { equipmentName: '水带', category: categories.water, unit: '盘', quantity: 8 },
      { equipmentName: '编织袋', category: categories.water, unit: '个', quantity: 500 },
      { equipmentName: '铁锹', category: categories.other, unit: '把', quantity: 10 }
    ],
    status: 1,
    createBy: '张三',
    remark: '城市内涝、堤防抢险排涝'
  },
  {
    setName: '高空作业救援套组',
    items: [
      { equipmentName: '全身式安全吊带', category: categories.other, unit: '套', quantity: 4 },
      { equipmentName: '动力绳', category: categories.other, unit: '根', quantity: 4 },
      { equipmentName: '下降器', category: categories.other, unit: '个', quantity: 4 },
      { equipmentName: '安全头盔', category: categories.other, unit: '顶', quantity: 4 }
    ],
    status: 0,
    createBy: '李四',
    remark: '高层建筑、山岳等高空救援'
  },
  {
    setName: '危化品处置套组',
    items: [
      { equipmentName: '化学防护服', category: categories.other, unit: '套', quantity: 4 },
      { equipmentName: '空气呼吸器', category: categories.other, unit: '台', quantity: 4 },
      { equipmentName: '防毒面具', category: categories.other, unit: '个', quantity: 6 },
      { equipmentName: '气体检测仪', category: categories.other, unit: '台', quantity: 2 }
    ],
    status: 1,
    createBy: '王五',
    remark: '危化品泄漏、中毒事故处置'
  },
  {
    setName: '医疗急救套组',
    items: [
      { equipmentName: '急救箱', category: categories.medical, unit: '个', quantity: 6 },
      { equipmentName: '自动体外除颤仪', category: categories.medical, unit: '台', quantity: 1 },
      { equipmentName: '折叠担架', category: categories.medical, unit: '副', quantity: 2 },
      { equipmentName: '氧气瓶', category: categories.medical, unit: '瓶', quantity: 2 }
    ],
    status: 1,
    createBy: '赵六',
    remark: '现场医疗急救保障'
  },
  {
    setName: '应急照明指挥套组',
    items: [
      { equipmentName: '移动照明灯塔', category: categories.other, unit: '台', quantity: 1 },
      { equipmentName: '应急照明灯', category: categories.other, unit: '盏', quantity: 6 },
      { equipmentName: '发电机', category: categories.power, unit: '台', quantity: 1 },
      { equipmentName: '电缆盘', category: categories.other, unit: '个', quantity: 2 }
    ],
    status: 1,
    createBy: '孙七',
    remark: '夜间现场指挥部照明保障'
  },
  {
    setName: '水域搜救打捞套组',
    items: [
      { equipmentName: '冲锋舟', category: categories.water, unit: '艘', quantity: 1 },
      { equipmentName: '船外机', category: categories.water, unit: '台', quantity: 1 },
      { equipmentName: '救援伸缩杆', category: categories.water, unit: '根', quantity: 2 },
      { equipmentName: '水下探照灯', category: categories.water, unit: '个', quantity: 2 }
    ],
    status: 0,
    createBy: '张三',
    remark: '水面搜救与水下打捞作业'
  },
  {
    setName: '雪灾救援套组',
    items: [
      { equipmentName: '除雪铲', category: categories.other, unit: '把', quantity: 10 },
      { equipmentName: '融雪剂', category: categories.other, unit: '袋', quantity: 20 },
      { equipmentName: '防滑链', category: categories.other, unit: '副', quantity: 8 },
      { equipmentName: '便携式取暖器', category: categories.other, unit: '台', quantity: 4 }
    ],
    status: 1,
    createBy: '李四',
    remark: '雨雪冰冻灾害道路抢险'
  },
  {
    setName: '交通事故救援套组',
    items: [
      { equipmentName: '液压剪扩器', category: categories.other, unit: '台', quantity: 1 },
      { equipmentName: '顶撑设备', category: categories.other, unit: '套', quantity: 1 },
      { equipmentName: '破拆斧', category: categories.other, unit: '把', quantity: 4 },
      { equipmentName: '警示锥桶', category: categories.other, unit: '个', quantity: 12 }
    ],
    status: 1,
    createBy: '王五',
    remark: '道路交通事故车辆破拆救援'
  },
  {
    setName: '应急发电供电套组',
    items: [
      { equipmentName: '柴油发电机组', category: categories.power, unit: '台', quantity: 2 },
      { equipmentName: '移动电缆盘', category: categories.power, unit: '个', quantity: 4 },
      { equipmentName: '备用油桶', category: categories.power, unit: '个', quantity: 2 },
      { equipmentName: '电压稳压器', category: categories.power, unit: '台', quantity: 1 }
    ],
    status: 1,
    createBy: '赵六',
    remark: '灾区应急电力保障'
  },
  {
    setName: '生命探测搜救套组',
    items: [
      { equipmentName: '音频生命探测仪', category: categories.other, unit: '台', quantity: 1 },
      { equipmentName: '雷达生命探测仪', category: categories.other, unit: '台', quantity: 1 },
      { equipmentName: '红外热成像仪', category: categories.other, unit: '台', quantity: 2 },
      { equipmentName: '搜救犬用装备包', category: categories.other, unit: '套', quantity: 2 }
    ],
    status: 0,
    createBy: '孙七',
    remark: '建筑坍塌掩埋人员搜寻'
  },
  {
    setName: '地质灾害救援套组',
    items: [
      { equipmentName: '便携式土方支护', category: categories.other, unit: '套', quantity: 2 },
      { equipmentName: '多功能救援锹', category: categories.other, unit: '把', quantity: 8 },
      { equipmentName: '手动破拆工具', category: categories.other, unit: '套', quantity: 2 },
      { equipmentName: '地质罗盘仪', category: categories.other, unit: '台', quantity: 2 }
    ],
    status: 1,
    createBy: '张三',
    remark: '山体滑坡、泥石流等地质灾害处置'
  },
  {
    setName: '野外生存保障套组',
    items: [
      { equipmentName: '双人帐篷', category: categories.other, unit: '顶', quantity: 4 },
      { equipmentName: '睡袋', category: categories.other, unit: '个', quantity: 8 },
      { equipmentName: '便携炉具', category: categories.other, unit: '套', quantity: 4 },
      { equipmentName: '净水器', category: categories.other, unit: '台', quantity: 2 }
    ],
    status: 1,
    createBy: '李四',
    remark: '野外驻训、长周期作业后勤保障'
  },
  {
    setName: '应急物资运输套组',
    items: [
      { equipmentName: '折叠式搬运车', category: categories.other, unit: '台', quantity: 2 },
      { equipmentName: '防雨篷布', category: categories.other, unit: '块', quantity: 6 },
      { equipmentName: '捆绑带', category: categories.other, unit: '条', quantity: 12 },
      { equipmentName: '周转箱', category: categories.other, unit: '个', quantity: 20 }
    ],
    status: 1,
    createBy: '王五',
    remark: '应急物资快速装卸与转运'
  },
  {
    setName: '消防救援破拆套组',
    items: [
      { equipmentName: '消防水枪', category: categories.fire, unit: '支', quantity: 4 },
      { equipmentName: '消防水带', category: categories.fire, unit: '盘', quantity: 6 },
      { equipmentName: '消火栓扳手', category: categories.fire, unit: '把', quantity: 4 },
      { equipmentName: '消防斧', category: categories.fire, unit: '把', quantity: 4 }
    ],
    status: 1,
    createBy: '赵六',
    remark: '初期火灾扑救与门窗破拆'
  },
  {
    setName: '疫情处置防护套组',
    items: [
      { equipmentName: '防护服', category: categories.medical, unit: '套', quantity: 20 },
      { equipmentName: 'N95口罩', category: categories.medical, unit: '个', quantity: 100 },
      { equipmentName: '护目镜', category: categories.medical, unit: '副', quantity: 20 },
      { equipmentName: '消毒喷雾器', category: categories.medical, unit: '台', quantity: 4 }
    ],
    status: 1,
    createBy: '孙七',
    remark: '公共卫生事件现场防护与消杀'
  },
  {
    setName: '事故现场勘查套组',
    items: [
      { equipmentName: '激光测距仪', category: categories.other, unit: '台', quantity: 2 },
      { equipmentName: '现场勘查箱', category: categories.other, unit: '个', quantity: 2 },
      { equipmentName: '警戒带', category: categories.other, unit: '卷', quantity: 6 },
      { equipmentName: '便携式记录仪', category: categories.other, unit: '台', quantity: 4 }
    ],
    status: 0,
    createBy: '张三',
    remark: '生产安全事故现场勘查取证'
  }
]

/** 根据明细生成关联装备描述 */
function buildEquipmentDesc(items: EquipmentSetItem[]): string {
  return items.map(item => `${item.equipmentName}*${item.quantity}`).join('、')
}

/** 装备套组 Mock 数据 */
export const equipmentSetData: EquipmentSet[] = seeds.map((seed, i) => {
  const items: EquipmentSetItem[] = seed.items.map(item => ({ ...item }))
  const createDate = new Date(2025, 0, 1 + (i % 10))
  const updateDate = new Date(2026, 0, 1 + (i % 15))
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  return {
    setId: `SET${String(i + 1).padStart(4, '0')}`,
    setName: seed.setName,
    equipmentDesc: buildEquipmentDesc(items),
    equipmentItems: items,
    status: seed.status,
    createBy: seed.createBy,
    createTime: fmt(createDate),
    updateTime: `${fmt(updateDate)} ${String(8 + (i % 12)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`,
    remark: seed.remark
  }
})
