export interface AreaItem {
  areaId: number
  areaName: string
  areaCode: string
  parentId: number
  level: number
  children?: AreaItem[]
}

export const areaData: AreaItem[] = [
  {
    areaId: 1,
    areaName: '广东省',
    areaCode: '440000',
    parentId: 0,
    level: 1,
    children: [
      {
        areaId: 11,
        areaName: '广州市',
        areaCode: '440100',
        parentId: 1,
        level: 2,
        children: [
          { areaId: 111, areaName: '天河区', areaCode: '440106', parentId: 11, level: 3 },
          { areaId: 112, areaName: '越秀区', areaCode: '440104', parentId: 11, level: 3 },
          { areaId: 113, areaName: '海珠区', areaCode: '440105', parentId: 11, level: 3 },
          { areaId: 114, areaName: '荔湾区', areaCode: '440103', parentId: 11, level: 3 },
          { areaId: 115, areaName: '白云区', areaCode: '440111', parentId: 11, level: 3 },
          { areaId: 116, areaName: '番禺区', areaCode: '440113', parentId: 11, level: 3 },
          { areaId: 117, areaName: '花都区', areaCode: '440114', parentId: 11, level: 3 },
          { areaId: 118, areaName: '增城区', areaCode: '440118', parentId: 11, level: 3 },
          { areaId: 119, areaName: '从化区', areaCode: '440117', parentId: 11, level: 3 },
          { areaId: 120, areaName: '黄埔区', areaCode: '440112', parentId: 11, level: 3 },
          { areaId: 121, areaName: '南沙区', areaCode: '440115', parentId: 11, level: 3 }
        ]
      },
      {
        areaId: 12,
        areaName: '深圳市',
        areaCode: '440300',
        parentId: 1,
        level: 2,
        children: [
          { areaId: 121, areaName: '福田区', areaCode: '440304', parentId: 12, level: 3 },
          { areaId: 122, areaName: '罗湖区', areaCode: '440303', parentId: 12, level: 3 },
          { areaId: 123, areaName: '南山区', areaCode: '440305', parentId: 12, level: 3 },
          { areaId: 124, areaName: '宝安区', areaCode: '440306', parentId: 12, level: 3 },
          { areaId: 125, areaName: '龙岗区', areaCode: '440307', parentId: 12, level: 3 },
          { areaId: 126, areaName: '龙华区', areaCode: '440309', parentId: 12, level: 3 },
          { areaId: 127, areaName: '坪山区', areaCode: '440310', parentId: 12, level: 3 },
          { areaId: 128, areaName: '光明区', areaCode: '440311', parentId: 12, level: 3 }
        ]
      },
      {
        areaId: 13,
        areaName: '珠海市',
        areaCode: '440400',
        parentId: 1,
        level: 2,
        children: [
          { areaId: 131, areaName: '香洲区', areaCode: '440402', parentId: 13, level: 3 },
          { areaId: 132, areaName: '斗门区', areaCode: '440403', parentId: 13, level: 3 },
          { areaId: 133, areaName: '金湾区', areaCode: '440404', parentId: 13, level: 3 }
        ]
      },
      {
        areaId: 14,
        areaName: '汕头市',
        areaCode: '440500',
        parentId: 1,
        level: 2,
        children: [
          { areaId: 141, areaName: '龙湖区', areaCode: '440507', parentId: 14, level: 3 },
          { areaId: 142, areaName: '金平区', areaCode: '440511', parentId: 14, level: 3 },
          { areaId: 143, areaName: '濠江区', areaCode: '440512', parentId: 14, level: 3 },
          { areaId: 144, areaName: '潮阳区', areaCode: '440513', parentId: 14, level: 3 },
          { areaId: 145, areaName: '潮南区', areaCode: '440514', parentId: 14, level: 3 },
          { areaId: 146, areaName: '澄海区', areaCode: '440515', parentId: 14, level: 3 }
        ]
      },
      {
        areaId: 15,
        areaName: '佛山市',
        areaCode: '440600',
        parentId: 1,
        level: 2,
        children: [
          { areaId: 151, areaName: '禅城区', areaCode: '440604', parentId: 15, level: 3 },
          { areaId: 152, areaName: '南海区', areaCode: '440605', parentId: 15, level: 3 },
          { areaId: 153, areaName: '顺德区', areaCode: '440606', parentId: 15, level: 3 },
          { areaId: 154, areaName: '三水区', areaCode: '440607', parentId: 15, level: 3 },
          { areaId: 155, areaName: '高明区', areaCode: '440608', parentId: 15, level: 3 }
        ]
      },
      {
        areaId: 16,
        areaName: '韶关市',
        areaCode: '440200',
        parentId: 1,
        level: 2,
        children: [
          { areaId: 161, areaName: '武江区', areaCode: '440203', parentId: 16, level: 3 },
          { areaId: 162, areaName: '浈江区', areaCode: '440204', parentId: 16, level: 3 },
          { areaId: 163, areaName: '曲江区', areaCode: '440205', parentId: 16, level: 3 }
        ]
      },
      {
        areaId: 17,
        areaName: '湛江市',
        areaCode: '440800',
        parentId: 1,
        level: 2,
        children: [
          { areaId: 171, areaName: '赤坎区', areaCode: '440802', parentId: 17, level: 3 },
          { areaId: 172, areaName: '霞山区', areaCode: '440803', parentId: 17, level: 3 },
          { areaId: 173, areaName: '坡头区', areaCode: '440804', parentId: 17, level: 3 },
          { areaId: 174, areaName: '麻章区', areaCode: '440811', parentId: 17, level: 3 }
        ]
      },
      {
        areaId: 18,
        areaName: '茂名市',
        areaCode: '440900',
        parentId: 1,
        level: 2,
        children: [
          { areaId: 181, areaName: '茂南区', areaCode: '440902', parentId: 18, level: 3 },
          { areaId: 182, areaName: '电白区', areaCode: '440904', parentId: 18, level: 3 }
        ]
      },
      {
        areaId: 19,
        areaName: '肇庆市',
        areaCode: '441200',
        parentId: 1,
        level: 2,
        children: [
          { areaId: 191, areaName: '端州区', areaCode: '441202', parentId: 19, level: 3 },
          { areaId: 192, areaName: '鼎湖区', areaCode: '441203', parentId: 19, level: 3 },
          { areaId: 193, areaName: '高要区', areaCode: '441204', parentId: 19, level: 3 }
        ]
      },
      {
        areaId: 20,
        areaName: '惠州市',
        areaCode: '441300',
        parentId: 1,
        level: 2,
        children: [
          { areaId: 201, areaName: '惠城区', areaCode: '441302', parentId: 20, level: 3 },
          { areaId: 202, areaName: '惠阳区', areaCode: '441303', parentId: 20, level: 3 }
        ]
      },
      {
        areaId: 21,
        areaName: '梅州市',
        areaCode: '441400',
        parentId: 1,
        level: 2,
        children: [
          { areaId: 211, areaName: '梅江区', areaCode: '441402', parentId: 21, level: 3 },
          { areaId: 212, areaName: '梅县区', areaCode: '441403', parentId: 21, level: 3 }
        ]
      },
      {
        areaId: 22,
        areaName: '汕尾市',
        areaCode: '441500',
        parentId: 1,
        level: 2,
        children: [
          { areaId: 221, areaName: '城区', areaCode: '441502', parentId: 22, level: 3 }
        ]
      },
      {
        areaId: 23,
        areaName: '河源市',
        areaCode: '441600',
        parentId: 1,
        level: 2,
        children: [
          { areaId: 231, areaName: '源城区', areaCode: '441602', parentId: 23, level: 3 }
        ]
      },
      {
        areaId: 24,
        areaName: '阳江市',
        areaCode: '441700',
        parentId: 1,
        level: 2,
        children: [
          { areaId: 241, areaName: '江城区', areaCode: '441702', parentId: 24, level: 3 },
          { areaId: 242, areaName: '阳东区', areaCode: '441704', parentId: 24, level: 3 }
        ]
      },
      {
        areaId: 25,
        areaName: '清远市',
        areaCode: '441800',
        parentId: 1,
        level: 2,
        children: [
          { areaId: 251, areaName: '清城区', areaCode: '441802', parentId: 25, level: 3 },
          { areaId: 252, areaName: '清新区', areaCode: '441803', parentId: 25, level: 3 }
        ]
      },
      {
        areaId: 26,
        areaName: '东莞市',
        areaCode: '441900',
        parentId: 1,
        level: 2,
        children: [
          { areaId: 261, areaName: '莞城街道', areaCode: '441900001', parentId: 26, level: 3 },
          { areaId: 262, areaName: '南城街道', areaCode: '441900002', parentId: 26, level: 3 },
          { areaId: 263, areaName: '东城街道', areaCode: '441900003', parentId: 26, level: 3 }
        ]
      },
      {
        areaId: 27,
        areaName: '中山市',
        areaCode: '442000',
        parentId: 1,
        level: 2,
        children: [
          { areaId: 271, areaName: '石岐街道', areaCode: '442000001', parentId: 27, level: 3 },
          { areaId: 272, areaName: '东区街道', areaCode: '442000002', parentId: 27, level: 3 }
        ]
      },
      {
        areaId: 28,
        areaName: '潮州市',
        areaCode: '445100',
        parentId: 1,
        level: 2,
        children: [
          { areaId: 281, areaName: '湘桥区', areaCode: '445102', parentId: 28, level: 3 },
          { areaId: 282, areaName: '潮安区', areaCode: '445103', parentId: 28, level: 3 }
        ]
      },
      {
        areaId: 29,
        areaName: '揭阳市',
        areaCode: '445200',
        parentId: 1,
        level: 2,
        children: [
          { areaId: 291, areaName: '榕城区', areaCode: '445202', parentId: 29, level: 3 },
          { areaId: 292, areaName: '揭东区', areaCode: '445203', parentId: 29, level: 3 }
        ]
      },
      {
        areaId: 30,
        areaName: '云浮市',
        areaCode: '445300',
        parentId: 1,
        level: 2,
        children: [
          { areaId: 301, areaName: '云城区', areaCode: '445302', parentId: 30, level: 3 },
          { areaId: 302, areaName: '云安区', areaCode: '445303', parentId: 30, level: 3 }
        ]
      }
    ]
  }
]
