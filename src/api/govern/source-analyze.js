import {Random} from 'mockjs'
import {getRangeDates} from '@/libs/util'
import fetch from '@/libs/fetch'

const setData = data =>
  new Promise((resolve, reject) => {
    resolve(data)
  })

const getInfo = _ =>
  setData({
    flag: true,
    data: {
      score: Random.float(0, 100, 2, 2),
      consume: Random.integer(0, 1000000),
      radio: Random.float(0, 100, 2, 2) + '%',
      // trend: Random.pick(['top', 'bottom']),
      rise: Random.boolean()
    }
  })

const getList = _ =>
  setData({
    flag: true,
    data: {
      emphasis: Array.from({length: 10}, d => ({
        projectName: Random.word(10, 20),
        projectId: Random.id(),
        leader: Random.name(),
        score: Random.float(0, 100, 2, 2)
      })),
      manager: Array.from({length: 10}, d => ({
        leader: Random.name(),
        consume: Random.integer(0, 1000000),
        score: Random.float(0, 100, 2, 2)
      }))
    }
  })

const getTrend = data => {
  const {startDate, endDate} = data
  const dates = getRangeDates(startDate, endDate)
  const res = dates.map(date => {
    const actual = Random.integer(0, 100)
    return {
      date,
      actual,
      mean: actual - Random.integer(-5, 5)
    }
  })
  return setData({
    flag: true,
    data: res
  })
}

export function getOverview(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/overview',
  //   method: 'post',
  //   data
  // })
  return setData({
    flag: true,
    data: {
      source: 3,
      task: 915,
      table: 2644,
      project: 35,
      developer: 9,
      reflowTable: 0
    }
  })
}

export function getComputeInfo(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/computeInfo',
  //   method: 'post',
  //   data
  // })
  return getInfo()
}

export function getStoreInfo(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeInfo',
  //   method: 'post',
  //   data
  // })
  return getInfo()
}

export function getComputeList(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/computeList',
  //   method: 'post',
  //   data
  // })
  return getList()
}

export function getStoreList(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeList',
  //   method: 'post',
  //   data
  // })
  return getList()
}

export function getComputeTrend(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/computeTrend',
  //   method: 'post',
  //   data
  // })
  console.log(getTrend(data), 'getTrend(data)s')
  return getTrend(data)
}

export function getStoreTrend(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/storeTrend',
  //   method: 'post',
  //   data
  // })
  return getTrend(data)
}

export function getProjectAnalyzeData(data = {}) {
  // return fetch({
  //   url: '/govern/sourceAnalyze/projectAnalyze',
  //   method: 'post',
  //   data
  // })
  return setData({
    flag: true,
    data: Array.from({length: 10}, d => ({
      project_name: Random.name(),
      business_field_name: Random.name(),
      task_count: Random.integer(1, 100),
      table_count: Random.integer(1, 100),
      store_count: Random.integer(1, 100000),
      compute_count: Random.integer(1, 1000000000),
      compute_score: Random.integer(1, 100)
    }))
  })
}

//获取全局指标
export function getGlobalMessage(data = {}) {
  return fetch({
    url: '/resGover/resMgt/getGlobalMessage',
    method: 'get',
       params: data
  })
}

//资源分析页面查询存储健康分和计算健康分
export function getTotalHealthScore(data = {}) {
  return fetch({
    url: '/resGover/resMgt/getTotalHealthScore',
    method: 'get',
       params: data
  })
}

//重点关注项目
export function getImportProjectAndPerson(data = {}) {
  return fetch({
    url: '/resGover/resMgt/getImportProjectAndPerson',
    method: 'get',
       params: data
  })
}

//趋势存储查询
export function getTrendstorage(data = {}) {
  return fetch({
    url: '/resGover/resMgt/getTrend',
    method: 'get',
       params: data
  })
}

//项目查询接口
export function getProjectDetail(data = {}) {
  return fetch({
    url: '/resGover/resMgt/getProjectDetail',
    method: 'get',
       params: data
  })
}

//时间范围
export function getDictList(data= {}) {
  return fetch({
    url: '/resGover/dict/getDictList',
    method: 'get',
       params: data
  })
}

//hdfs趋势查询
export function getHdfsTrend(data = {}) {
  return fetch({
    url: '/resGover/trace/getHdfsTrend',
    method: 'get',
       params: data
  })
}

//yarn趋势查询接口
export function getYarnTrend(data = {}) {
  return fetch({
    url: '/resGover/trace/getYarnTrend',
    method: 'get',
       params: data
  })
}