export interface DeptItem {
  deptId: number
  deptCode: string
  deptName: string
  parentId: number
  leader: string
  phone: string
  email: string
  fax: string
  displayOrder: number
  status: number
  children?: DeptItem[]
}

export const deptData: DeptItem[] = [
  {
    deptId: 1,
    deptCode: 'DEPT_GD_TRANSPORT',
    deptName: '广东省交通运输厅',
    parentId: 0,
    leader: '陈志远',
    phone: '020-83730001',
    email: 'chenzy@gd.gov.cn',
    fax: '020-83730002',
    displayOrder: 1,
    status: 1101,
    children: [
      {
        deptId: 11,
        deptCode: 'DEPT_DUTY_OFFICE',
        deptName: '厅总值班室',
        parentId: 1,
        leader: '赵国庆',
        phone: '020-83730101',
        email: 'zhaogq@gd.gov.cn',
        fax: '020-83730100',
        displayOrder: 1,
        status: 1101,
        children: [
          {
            deptId: 111,
            deptCode: 'DEPT_DUTY_DAY',
            deptName: '日班值班组',
            parentId: 11,
            leader: '孙晓峰',
            phone: '020-83730102',
            email: 'sunxf@gd.gov.cn',
            fax: '',
            displayOrder: 1,
            status: 1101,
            children: [
              {
                deptId: 1111,
                deptCode: 'DEPT_DUTY_DAY_A',
                deptName: 'A班',
                parentId: 111,
                leader: '张三',
                phone: '020-83730111',
                email: 'zhangsan@gd.gov.cn',
                fax: '',
                displayOrder: 1,
                status: 1101
              },
              {
                deptId: 1112,
                deptCode: 'DEPT_DUTY_DAY_B',
                deptName: 'B班',
                parentId: 111,
                leader: '李四',
                phone: '020-83730112',
                email: 'lisi@gd.gov.cn',
                fax: '',
                displayOrder: 2,
                status: 1101
              },
              {
                deptId: 1113,
                deptCode: 'DEPT_DUTY_DAY_C',
                deptName: 'C班',
                parentId: 111,
                leader: '王五',
                phone: '020-83730113',
                email: 'wangwu@gd.gov.cn',
                fax: '',
                displayOrder: 3,
                status: 1101
              }
            ]
          },
          {
            deptId: 112,
            deptCode: 'DEPT_DUTY_NIGHT',
            deptName: '夜班值班组',
            parentId: 11,
            leader: '李婷',
            phone: '020-83730103',
            email: 'liting@gd.gov.cn',
            fax: '',
            displayOrder: 2,
            status: 1101,
            children: [
              {
                deptId: 1121,
                deptCode: 'DEPT_DUTY_NIGHT_A',
                deptName: 'A班',
                parentId: 112,
                leader: '赵六',
                phone: '020-83730121',
                email: 'zhaoliu@gd.gov.cn',
                fax: '',
                displayOrder: 1,
                status: 1101
              },
              {
                deptId: 1122,
                deptCode: 'DEPT_DUTY_NIGHT_B',
                deptName: 'B班',
                parentId: 112,
                leader: '钱七',
                phone: '020-83730122',
                email: 'qianqi@gd.gov.cn',
                fax: '',
                displayOrder: 2,
                status: 1101
              }
            ]
          }
        ]
      },
      {
        deptId: 12,
        deptCode: 'DEPT_TECH',
        deptName: '科技处',
        parentId: 1,
        leader: '周文博',
        phone: '020-83730201',
        email: 'zhouwb@gd.gov.cn',
        fax: '020-83730200',
        displayOrder: 2,
        status: 1101,
        children: [
          {
            deptId: 121,
            deptCode: 'DEPT_TECH_RESEARCH',
            deptName: '科研管理科',
            parentId: 12,
            leader: '吴思远',
            phone: '020-83730202',
            email: 'wusy@gd.gov.cn',
            fax: '',
            displayOrder: 1,
            status: 1101,
            children: [
              {
                deptId: 1211,
                deptCode: 'DEPT_TECH_RESEARCH_PROJECT',
                deptName: '项目管理组',
                parentId: 121,
                leader: '孙八',
                phone: '020-83730211',
                email: 'sunba@gd.gov.cn',
                fax: '',
                displayOrder: 1,
                status: 1101
              },
              {
                deptId: 1212,
                deptCode: 'DEPT_TECH_RESEARCH_EVAL',
                deptName: '评审验收组',
                parentId: 121,
                leader: '周九',
                phone: '020-83730212',
                email: 'zhoujiu@gd.gov.cn',
                fax: '',
                displayOrder: 2,
                status: 1101
              }
            ]
          },
          {
            deptId: 122,
            deptCode: 'DEPT_TECH_PROMOTE',
            deptName: '技术推广科',
            parentId: 12,
            leader: '郑雅文',
            phone: '020-83730203',
            email: 'zhengyw@gd.gov.cn',
            fax: '',
            displayOrder: 2,
            status: 1101
          }
        ]
      },
      {
        deptId: 13,
        deptCode: 'DEPT_ROAD_ADMIN',
        deptName: '路政处',
        parentId: 1,
        leader: '黄志强',
        phone: '020-83730301',
        email: 'huangzq@gd.gov.cn',
        fax: '020-83730300',
        displayOrder: 3,
        status: 1101,
        children: [
          {
            deptId: 131,
            deptCode: 'DEPT_ROAD_SUPERVISION',
            deptName: '路政执法监督科',
            parentId: 13,
            leader: '林美玲',
            phone: '020-83730302',
            email: 'linml@gd.gov.cn',
            fax: '',
            displayOrder: 1,
            status: 1101,
            children: [
              {
                deptId: 1311,
                deptCode: 'DEPT_ROAD_SUPERVISIONUrban',
                deptName: '城区执法队',
                parentId: 131,
                leader: '吴十',
                phone: '020-83730311',
                email: 'wushi@gd.gov.cn',
                fax: '',
                displayOrder: 1,
                status: 1101
              },
              {
                deptId: 1312,
                deptCode: 'DEPT_ROAD_SUPERVISION_HIGHWAY',
                deptName: '高速执法队',
                parentId: 131,
                leader: '郑十一',
                phone: '020-83730312',
                email: 'zheng11@gd.gov.cn',
                fax: '',
                displayOrder: 2,
                status: 1101
              }
            ]
          },
          {
            deptId: 132,
            deptCode: 'DEPT_ROAD_PERMIT',
            deptName: '行政许可科',
            parentId: 13,
            leader: '何建华',
            phone: '020-83730303',
            email: 'hejh@gd.gov.cn',
            fax: '',
            displayOrder: 2,
            status: 1101
          }
        ]
      },
      {
        deptId: 14,
        deptCode: 'DEPT_CONSTRUCTION',
        deptName: '基建处',
        parentId: 1,
        leader: '杨明辉',
        phone: '020-83730401',
        email: 'yangmh@gd.gov.cn',
        fax: '020-83730400',
        displayOrder: 4,
        status: 1101,
        children: [
          {
            deptId: 141,
            deptCode: 'DEPT_CONSTRUCTION_QUALITY',
            deptName: '工程质量监督科',
            parentId: 14,
            leader: '朱晓燕',
            phone: '020-83730402',
            email: 'zhuxy@gd.gov.cn',
            fax: '',
            displayOrder: 1,
            status: 1101,
            children: [
              {
                deptId: 1411,
                deptCode: 'DEPT_CONSTRUCTION_QUALITY_ROAD',
                deptName: '公路工程监督组',
                parentId: 141,
                leader: '冯十二',
                phone: '020-83730411',
                email: 'feng12@gd.gov.cn',
                fax: '',
                displayOrder: 1,
                status: 1101
              },
              {
                deptId: 1412,
                deptCode: 'DEPT_CONSTRUCTION_QUALITY_BRIDGE',
                deptName: '桥梁工程监督组',
                parentId: 141,
                leader: '陈十三',
                phone: '020-83730412',
                email: 'chen13@gd.gov.cn',
                fax: '',
                displayOrder: 2,
                status: 1101
              }
            ]
          },
          {
            deptId: 142,
            deptCode: 'DEPT_CONSTRUCTION_PROJECT',
            deptName: '项目管理科',
            parentId: 14,
            leader: '马俊杰',
            phone: '020-83730403',
            email: 'majj@gd.gov.cn',
            fax: '',
            displayOrder: 2,
            status: 1101
          }
        ]
      },
      {
        deptId: 15,
        deptCode: 'DEPT_GENERAL',
        deptName: '综合处',
        parentId: 1,
        leader: '张伟明',
        phone: '020-83730004',
        email: 'zhangwm@gd.gov.cn',
        fax: '020-83730005',
        displayOrder: 5,
        status: 1101,
        children: [
          {
            deptId: 151,
            deptCode: 'DEPT_GENERAL_OFFICE',
            deptName: '办公室',
            parentId: 15,
            leader: '王芳',
            phone: '020-83730501',
            email: 'wangf@gd.gov.cn',
            fax: '',
            displayOrder: 1,
            status: 1101,
            children: [
              {
                deptId: 1511,
                deptCode: 'DEPT_GENERAL_OFFICE_DOC',
                deptName: '文书档案组',
                parentId: 151,
                leader: '林十四',
                phone: '020-83730511',
                email: 'lin14@gd.gov.cn',
                fax: '',
                displayOrder: 1,
                status: 1101
              },
              {
                deptId: 1512,
                deptCode: 'DEPT_GENERAL_OFFICE_LOGISTICS',
                deptName: '后勤保障组',
                parentId: 151,
                leader: '黄十五',
                phone: '020-83730512',
                email: 'huang15@gd.gov.cn',
                fax: '',
                displayOrder: 2,
                status: 1101
              }
            ]
          },
          {
            deptId: 152,
            deptCode: 'DEPT_GENERAL_HR',
            deptName: '人事科',
            parentId: 15,
            leader: '刘洋',
            phone: '020-83730502',
            email: 'liuy@gd.gov.cn',
            fax: '',
            displayOrder: 2,
            status: 1101,
            children: [
              {
                deptId: 1521,
                deptCode: 'DEPT_GENERAL_HR_RECRUIT',
                deptName: '招聘调配组',
                parentId: 152,
                leader: '许十六',
                phone: '020-83730521',
                email: 'xu16@gd.gov.cn',
                fax: '',
                displayOrder: 1,
                status: 1101
              },
              {
                deptId: 1522,
                deptCode: 'DEPT_GENERAL_HR_SALARY',
                deptName: '薪酬考核组',
                parentId: 152,
                leader: '宋十七',
                phone: '020-83730522',
                email: 'song17@gd.gov.cn',
                fax: '',
                displayOrder: 2,
                status: 1101
              }
            ]
          },
          {
            deptId: 153,
            deptCode: 'DEPT_GENERAL_FINANCE',
            deptName: '财务科',
            parentId: 15,
            leader: '陈静',
            phone: '020-83730503',
            email: 'chenj@gd.gov.cn',
            fax: '',
            displayOrder: 3,
            status: 1101,
            children: [
              {
                deptId: 1531,
                deptCode: 'DEPT_GENERAL_FINANCE_BUDGET',
                deptName: '预算管理组',
                parentId: 153,
                leader: '韩十八',
                phone: '020-83730531',
                email: 'han18@gd.gov.cn',
                fax: '',
                displayOrder: 1,
                status: 1101
              },
              {
                deptId: 1532,
                deptCode: 'DEPT_GENERAL_FINANCE_AUDIT',
                deptName: '审计监督组',
                parentId: 153,
                leader: '唐十九',
                phone: '020-83730532',
                email: 'tang19@gd.gov.cn',
                fax: '',
                displayOrder: 2,
                status: 1101
              }
            ]
          }
        ]
      }
    ]
  }
]

/** 构建部门树 */
export function buildDeptTree(data: DeptItem[], parentId: number = 0): DeptItem[] {
  return data
    .filter(item => item.parentId === parentId)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(item => {
      const children = buildDeptTree(data, item.deptId)
      const result: DeptItem = { ...item }
      if (children.length > 0) {
        result.children = children
      }
      return result
    })
}

/** 扁平化部门数据 */
export function flattenDeptData(data: DeptItem[]): DeptItem[] {
  const result: DeptItem[] = []
  function traverse(items: DeptItem[]) {
    for (const item of items) {
      result.push(item)
      if (item.children) {
        traverse(item.children)
      }
    }
  }
  traverse(data)
  return result
}
