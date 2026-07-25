import type {
  OnlineUser,
  ServerMonitorData,
  CacheMonitorData,
  CacheEntry
} from '@/types/admin/monitor'

// ─── 在线用户 ───────────────────────────────────────
const browsers = ['Chrome 120.0', 'Chrome 119.0', 'Firefox 121.0', 'Edge 120.0', 'Safari 17.2', 'Chrome 118.0', 'Edge 119.0', 'Firefox 120.0']
const osList = ['Windows 10', 'Windows 11', 'macOS 14.2', 'macOS 13.6', 'Ubuntu 22.04', 'Windows 10', 'macOS 14.1', 'CentOS 8']
const locations = ['广东省广州市', '广东省深圳市', '北京市朝阳区', '上海市浦东新区', '广东省佛山市', '广东省东莞市', '浙江省杭州市', '江苏省南京市']
const depts = ['应急指挥中心', '信息科', '办公室', '救援协调处', '监测预警处', '应急保障处', '政策法规处', '宣传教育处']
const hosts = ['192.168.1.', '10.0.0.', '172.16.0.', '192.168.2.', '10.10.1.']
const names = ['admin', 'zhangsan', 'lisi', 'wangwu', 'zhaoliu', 'sunqi', 'zhouba', 'wujiu', 'zhengshi', 'liuyi',
  'chenming', 'yangfang', 'huanglei', 'humin', 'linna', 'xubin', 'majun', 'luoxin', 'heping', 'gaofei',
  'songdan', 'dengxiao', 'caowen', 'panjie', 'xiezhen', 'jiangtao', 'hanmei', 'fengyan', 'dengli', 'pengfei']

export const onlineUserData: OnlineUser[] = names.map((name, i) => ({
  sessionId: `sess_${String(i + 1).padStart(4, '0')}_${Math.random().toString(36).slice(2, 10)}`,
  loginName: name,
  deptName: depts[i % depts.length],
  host: hosts[i % hosts.length] + (100 + i),
  loginLocation: locations[i % locations.length],
  browser: browsers[i % browsers.length],
  os: osList[i % osList.length],
  loginTime: `2026-07-${String(23 - (i % 5)).padStart(2, '0')} ${String(8 + (i % 12)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`
}))

// ─── 服务监控 ───────────────────────────────────────
export const serverMonitorData: ServerMonitorData = {
  cpu: {
    coreNum: 8,
    userUsage: 32.5,
    sysUsage: 12.8,
    idleRate: 54.7
  },
  memory: {
    total: 32,
    used: 18.6,
    free: 13.4,
    usageRate: 58.1
  },
  server: {
    name: 'emergency-prod-01',
    os: 'CentOS Linux 8.5.2111',
    ip: '192.168.1.100',
    arch: 'amd64'
  },
  jvm: {
    name: 'Java HotSpot(TM) 64-Bit Server VM',
    version: '17.0.9',
    startTime: '2026-07-01 08:00:00',
    runTime: '22天 4小时 36分钟',
    home: '/usr/lib/jvm/java-17-openjdk-17.0.9',
    projectPath: '/opt/emergency-platform',
    runArgs: '-Xms4g -Xmx8g -XX:+UseG1GC -XX:MaxGCPauseMillis=200'
  },
  disks: [
    { path: '/', fsType: 'ext4', type: 'local', total: 200, free: 86.5, used: 113.5, usageRate: 56.8 },
    { path: '/opt', fsType: 'ext4', type: 'local', total: 500, free: 210.3, used: 289.7, usageRate: 57.9 },
    { path: '/data', fsType: 'xfs', type: 'local', total: 1000, free: 456.2, used: 543.8, usageRate: 54.4 },
    { path: '/boot', fsType: 'ext4', type: 'local', total: 1, free: 0.6, used: 0.4, usageRate: 40.0 },
    { path: '/home', fsType: 'ext4', type: 'local', total: 100, free: 72.1, used: 27.9, usageRate: 27.9 }
  ]
}

// ─── 缓存监控 ───────────────────────────────────────
export const cacheMonitorData: CacheMonitorData = {
  info: {
    version: '7.2.4',
    mode: 'standalone',
    port: 6379,
    clients: 42,
    runDays: 128,
    usedMemory: '256.80MB',
    usedCpu: '12.5%',
    memoryConfig: 'maxmemory 1gb',
    aofEnabled: true,
    rdbSuccess: true,
    keyCount: 15823,
    netInput: '1.25 GB',
    netOutput: '3.68 GB'
  },
  commandStats: [
    { name: 'get', value: 35820 },
    { name: 'set', value: 18450 },
    { name: 'del', value: 5620 },
    { name: 'expire', value: 8930 },
    { name: 'hget', value: 12300 },
    { name: 'hset', value: 7650 },
    { name: 'lpush', value: 3200 },
    { name: 'lrange', value: 4580 },
    { name: 'sadd', value: 2100 },
    { name: 'keys', value: 890 },
    { name: 'scan', value: 1560 },
    { name: 'mget', value: 6740 }
  ],
  memory: {
    usedMemory: '256.80MB',
    usedMemoryPeak: '512.30MB',
    memFragmentationRatio: 1.12,
    aofBuffer: '0B',
    inputBuffer: '2.40KB',
    outputBuffer: '18.60KB'
  }
}

// ─── 缓存列表 ───────────────────────────────────────
const cacheNames = [
  'sys_config', 'sys_dict', 'user_token', 'user_info', 'dept_tree',
  'menu_list', 'role_perms', 'online_users', 'area_list', 'msg_template'
]

export const cacheNameList = cacheNames

function randomKey(name: string, i: number): string {
  return `${name}:${String(i + 1).padStart(4, '0')}`
}

export const cacheListData: CacheEntry[] = (() => {
  const entries: CacheEntry[] = []
  cacheNames.forEach(name => {
    for (let i = 0; i < 8; i++) {
      const isMap = i % 3 === 0
      entries.push({
        cacheName: name,
        key: randomKey(name, i),
        value: isMap
          ? JSON.stringify({
              configId: String(1000 + i),
              configKey: `${name}.key${i + 1}`,
              configValue: `value_${Math.random().toString(36).slice(2, 8)}`,
              createTime: '2026-07-15 10:00:00',
              updateTime: '2026-07-20 14:30:00',
              remark: `${name}配置项${i + 1}`
            })
          : `cached_value_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`,
        dataType: isMap ? 'map' : 'string',
        remark: `${name}的缓存数据${i + 1}`
      })
    }
  })
  return entries
})()
