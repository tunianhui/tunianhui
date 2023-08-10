import {Random} from 'mockjs'
import {get7Days, get30Days} from '@/libs/util'
import fetch from '@/libs/fetch'

const setData = data =>
  new Promise((resolve, reject) => {
    resolve(data)
  })

export function getStoreScore(data = {}) {
  return setData({
    flag: true,
    data: {
      score: Random.float(0, 100, 2, 2),
      // score: 60,
      detail: {
        count: Random.integer(1, 10000),
        itemCount: Random.integer(1, 10000),
        pendingCount: Random.integer(1, 10000)
      },
      list: Array.from({length: 10}, d => ({
        name: Random.cword(2, 5),
        score: Random.float(0, 100, 2, 2),
        store_count: Random.integer(1, 10000000),
        table_count: Random.integer(10, 1000)
      }))
    }
  })
}

export function getProjectData(data = {}) {
  return setData({
    flag: true,
    data: Array.from({length: 10}, d => ({
      project_name: Random.name(),
      business_field_name: Random.name(),
      manager: Random.cname(),
      store_count: Random.integer(1, 100000000),
      rate: Random.float(0, 0, 2, 2) + '%',
      pending_count: Random.integer(1, 1000)
    }))
  })
}

export function getTrendList(data = {}) {
  const daysMap = {
    7: get7Days(),
    30: get30Days()
  }
  return setData({
    flag: true,
    data: daysMap[data.recent].map(date => ({
      date,
      consume: Random.float(1, 100, 2, 2),
      score: Random.float(1, 100, 2, 2)
    }))
  })
}

export function getScoreList(data = {}) {
  return setData({
    flag: true,
    data: Array.from({length: 10}, (d, i) => ({
      rank: i + 1,
      table_name: `n_` + Random.integer(),
      project_name: Random.word(),
      leader: Random.name(),
      score: Random.float(0, 100, 2, 2),
      consume: Random.integer(1, 10000),
      rate: Random.float(0, 100, 2, 2) + '%'
    }))
  })
}

export function getConsumeList(data = {}) {
  return setData({
    flag: true,
    data: Array.from({length: 10}, (d, i) => ({
      rank: i + 1,
      node_name: `n_` + Random.integer(),
      project_name: Random.word(),
      leader: Random.name(),
      task_type: Random.pick(['SHELL', 'SQL', 'MAX_COMPUTE_MR']),
      score: Random.float(0, 100, 2, 2),
      consume: Random.integer(1, 10000),
      rate: Random.float(0, 100, 2, 2) + '%'
    }))
  })
}


//存储分数明细查询接口
export function getStoScoreDetail(data = {}) {
  return fetch({
    url: '/resGover/governAnalysis/getStoScoreDetail',
    method: 'get',
    params: data
  })
}

//治理分析存储健康分
export function getTotalHealthScore(data = {}) {
  return fetch({
    // url: '/resGover/itemMgt/getTotalHealthScore',
    url: '/resGover/resMgt/getTotalHealthScore',
    method: 'get',
    params: data
  })
}

// 计算分数明细查询接口
export function getComScoreDetail(data = {}) {
  return fetch({
    url: '/resGover/governAnalysis/getComScoreDetail',
    method: 'get',
    params: data
  })
}

// 项目治理明细
export function getProjectDetail(data = {}) {
  return fetch({
    // url: '/resGover/ResMgt/getProjectDetail',
    url: '/resGover/resMgt/getProjectDetail',
    method: 'get',
    params: data
  })
}

// 按钮趋势查询(计算)
export function getComTrend(data = {}) {
  return fetch({
    url: '/resGover/governAnalysis/getComTrend',
    method: 'get',
    params: data
  })
}

//按钮趋势查询(存储)	
export function getStoTrend(data = {}) {
  return fetch({
    url: '/resGover/governAnalysis/getStoTrend',
    method: 'get',
    params: data
  })
}

export function getStoandComTrend(data = {}) {
  return fetch({
    url: '/resGover/governAnalysis/getStoandComTrend',
    method: 'get',
    params: data
  })
}
