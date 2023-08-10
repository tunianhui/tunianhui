import {Random} from 'mockjs'
import {getRangeDates} from '@/libs/util'

const setData = data =>
  new Promise((resolve, reject) => {
    resolve(data)
  })

const getTrend = data => {
  const {startDate, endDate} = data
  const dates = getRangeDates(startDate, endDate)
  const res = dates.map(date => {
    const actual = Random.integer(0, 200)
    return {
      date,
      ruleCount: actual - Random.integer(0, actual),
      tableTotal: actual,
      strong:
        actual -
        (actual - Random.integer(0, actual - Random.integer(0, actual))),
      errorCount:
        actual -
        (actual - Random.integer(0, actual - Random.integer(0, actual)))
    }
  })
  return setData({
    flag: true,
    data: res
  })
}

const getInfo = _ =>
  setData({
    flag: true,
    data: {
      table: Random.float(0, 10, 2, 2),
      tableCount: Random.integer(0, 10),
      tableCountChange: Random.float(0, 100, 2, 2) + '%',
      strongErrorCount: Random.integer(0, 10),
      strongErrorCountChange: Random.float(0, 100, 2, 2) + '%',
      weakErrorCount: Random.integer(0, 10),
      weakErrorCountChange: Random.float(0, 100, 2, 2) + '%'
      // trend: Random.pick(['top', 'bottom']),
    }
  })
const dates = getRangeDates('2020-12-18', '2020-12-18')
const getList = data =>
  setData({
    flag: true,
    // data: {
    //   emphasis: Array.from({length: 10}, d => ({
    //     projectName: Random.word(10, 20),
    //     projectId: Random.id(),
    //     leader: Random.name(),
    //     score: Random.float(0, 100, 2, 2)
    //   })),
    //   manager: Array.from({length: 10}, d => ({
    //     leader: Random.name(),
    //     consume: Random.integer(0, 1000000),
    //     score: Random.float(0, 100, 2, 2)
    //   }))
    // }
    data: Array.from(
      {
        length: JSON.stringify(data) !== '{}' ? data : 15
      },
      d => ({
        tableName: Random.word(10, 20),
        tableType: Random.pick([16, 17, 18, 100]),
        ownerName: Random.name(),
        business: Random.word(),
        projectName: Random.word(10, 20),
        date: dates[0],
        ruleCount: Random.float(0, 10, 0, 0),
        enabled: Random.pick([true, false]),
        tableDesc: Random.word(10, 20),
        id: Random.id(),
        storageType: Random.word(10, 20),
        use: Random.pick(['仅实时', '仅离线', '实时和离线']),
        partition: Random.pick(["ds='20201225'", "ds='20201125'"]),
        partitionId: Random.float(100000, 999999, 0, 0),
        templateType: Random.pick([
          '表行数,上一周期比较',
          '表分区数',
          '表/分区大小1天波动监测',
          '字段唯一值个数期望校验',
          ' 字段汇总值1,7,30天波动检测'
        ]),
        rulesName: Random.word(10, 20),
        rulesAttr: Random.pick(['强', '弱']),
        checkResult: Random.pick([false, true])
      })
    )
  })

const getTreeList = data =>
  setData({
    flag: true,
    data: Array.from(
      {
        length: JSON.stringify(data) !== '{}' ? data.length : 15
      },
      d => ({
        id: Random.id(),
        label: JSON.stringify(data) !== '{}' ? Random.pick(data) : Random.name()
      })
    )
  })

// 总览信息
export function getIndicatorsData(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeTrend',
  //   method: 'post',
  //   data
  // })
  return getInfo()
}

// 应用规则趋势条形
export function getAppTrendData(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeTrend',
  //   method: 'post',
  //   data
  // })
  return getTrend(data)
}

// 弱规则
export function getWeakTrendData(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeTrend',
  //   method: 'post',
  //   data
  // })
  return getTrend(data)
}

// 强规则
export function getStrongTrendData(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeTrend',
  //   method: 'post',
  //   data
  // })
  return getTrend(data)
}

// 应用规则趋势面积
export function getAppTrendBarData(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeTrend',
  //   method: 'post',
  //   data
  // })
  return getTrend(data)
}

// 应用规则弱趋势面积
export function getWeakTrendBarData(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeTrend',
  //   method: 'post',
  //   data
  // })
  return getTrend(data)
}

// 数据表规则列表
export function getDataRulesList(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeTrend',
  //   method: 'post',
  //   data
  // })
  return getList(data)
}

// 开启校验
export function openCheckRule(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeTrend',
  //   method: 'post',
  //   data
  // })
  return setData({
    flag: true,
    msg: '成功'
  })
}

// 关闭校验
export function closeCheckRule(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeTrend',
  //   method: 'post',
  //   data
  // })
  return setData({
    flag: true,
    msg: '成功'
  })
}

// 删除规则
export function delCheckRule(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeTrend',
  //   method: 'post',
  //   data
  // })
  return setData({
    flag: true,
    msg: '成功'
  })
}

// 负责人列表
export function getOwnerNameList(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeTrend',
  //   method: 'post',
  //   data
  // })
  return getTreeList(data)
}

// 业务板块
export function getBusinessList(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeTrend',
  //   method: 'post',
  //   data
  // })
  return getTreeList(data)
}

// 所属项目
export function getProjectList(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeTrend',
  //   method: 'post',
  //   data
  // })
  return getTreeList(data)
}

// 表类型
export function getTableTypeList(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeTrend',
  //   method: 'post',
  //   data
  // })
  return getTreeList(data)
}

// 数据表
export function getTableDataList(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeTrend',
  //   method: 'post',
  //   data
  // })
  return getTreeList(data)
}

// 用途
export function getUseList(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeTrend',
  //   method: 'post',
  //   data
  // })
  return getTreeList(data)
}

// 存储类型
export function getStorageTypeList(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeTrend',
  //   method: 'post',
  //   data
  // })
  return getTreeList(data)
}

// 实时元表列表
export function getRealTimeList(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeTrend',
  //   method: 'post',
  //   data
  // })
  return getList(data)
}

// 数据表校验记录列表

export function getDataTableCheckList(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeTrend',
  //   method: 'post',
  //   data
  // })
  return getList(1)
}

// 数据源校验记录列表

export function getDataSourceCheckList(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeTrend',
  //   method: 'post',
  //   data
  // })
  return getList(8)
}

// 实时元校验记录列表

export function getRealCheckList(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeTrend',
  //   method: 'post',
  //   data
  // })
  return getList(8)
}
