/**
 * 农历计算工具
 * 基于 lunar npm 包实现公历→农历转换
 */
import { toLunar, formatLunar } from 'lunar'

// 农历月份名称
const LUNAR_MONTH_CN = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月']

// 农历日期名称
const LUNAR_DAY_CN = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
]

// 天干
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
// 地支
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
// 生肖
const SHENG_XIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']

/**
 * 公历日期转农历
 * @param date 公历日期
 */
export function solarToLunar(date: Date): {
  year: number
  month: number
  day: number
  isLeapMonth: boolean
  monthCn: string
  dayCn: string
  yearCn: string
  zodiac: string
} {
  const result = toLunar(date, { timezone: 'Asia/Shanghai' })
  const lunar = result.lunar

  // 天干地支纪年
  const ganIndex = (lunar.year - 4) % 10
  const zhiIndex = (lunar.year - 4) % 12
  const yearCn = TIAN_GAN[ganIndex] + DI_ZHI[zhiIndex]
  const zodiac = SHENG_XIAO[zhiIndex]

  // 月份名称
  const monthCn = (lunar.isLeapMonth ? '闰' : '') + LUNAR_MONTH_CN[lunar.month - 1]
  const dayCn = LUNAR_DAY_CN[lunar.day - 1]

  return {
    year: lunar.year,
    month: lunar.month,
    day: lunar.day,
    isLeapMonth: lunar.isLeapMonth,
    monthCn,
    dayCn,
    yearCn,
    zodiac
  }
}

/**
 * 格式化农历为中文字符串（月+日）
 * @param date 公历日期
 * @returns 如 "正月初一"
 */
export function formatLunarDate(date: Date): string {
  const lunar = solarToLunar(date)
  return `${lunar.monthCn}${lunar.dayCn}`
}
