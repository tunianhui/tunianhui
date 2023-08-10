import {Random} from 'mockjs'
import {getRangeDates, get7Days, get30Days} from '@/libs/util'
// import fetch from '@/libs/fetch'

const setData = data =>
  new Promise((resolve, reject) => {
    resolve(data)
  })

export function getInfo(data = {}) {
  return setData({
    flag: true,
    data: {
      rate: Random.float(1, 100, 2, 2),
      governCount: Random.integer(10, 10000),
      disposeCount: Random.integer(10, 10000),
      governRate: Random.float(1, 100, 2, 2) + '%',
      computeCount: Random.integer(0, 1000000),
      computeRate: Random.float(1, 100, 2, 2) + '%',
      storeCount: Random.integer(1, 100000000000000000000),
      storeRate: Random.float(1, 100, 2, 2) + '%'
    }
  })
}

export function getProjectData(data = {}) {
  return setData({
    flag: true,
    data: Array.from({length: 10}, d => ({
      project_name: Random.name(),
      business_field_name: Random.name(),
      loader: Random.name(),
      compute_count: Random.integer(1, 1000000),
      compute_score: Random.integer(1, 100),
      compute_optimize_count: Random.integer(1, 1000000),
      store_count: Random.integer(1, 1000000000),
      store_score: Random.integer(1, 100),
      store_optimize_count: Random.integer(1, 1000000000)
    }))
  })
}

export function getTrendList(data = {}) {
  const dates = getRangeDates(data.startDate, data.endDate)
  return setData({
    flag: true,
    data: dates.map(date => ({
      date,
      count: Random.float(1, 1000, 2, 2),
      rate: Random.float(1, 10, 2, 2)
    }))
  })
}

export function getProjectTrendList(data = {}) {
  const daysMap = {
    7: get7Days(),
    30: get30Days()
  }
  return setData({
    flag: true,
    data: daysMap[data.recent].map(date => ({
      date,
      score: Random.float(1, 100, 2, 2),
      count: Random.float(1, 100, 2, 2)
    }))
  })
}

export function getStoreList(data = {}) {
  return setData({
    flag: true,
    data: Array.from({length: 10}, (d, i) => ({
      rank: i + 1,
      leader: Random.name(),
      score: Random.float(0, 100, 2, 2),
      optimize_count: Random.float(0, 10000000),
      count: Random.integer(0, 10000000)
    }))
  })
}

export function getComputeList(data = {}) {
  return setData({
    flag: true,
    data: Array.from({length: 10}, (d, i) => ({
      rank: i + 1,
      leader: Random.name(),
      score: Random.float(0, 100, 2, 2),
      optimize_count: Random.float(0, 10000000),
      count: Random.integer(0, 10000000)
    }))
  })
}
