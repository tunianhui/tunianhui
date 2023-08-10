import fetch from '@/libs/fetch'

export function getOverview(data = {}) {
  return fetch({
    url: '/govern/sourceAnalyze/overview',
    method: 'post',
    data
  })
}

export function getComputeInfo(data = {}) {
  return fetch({
    url: '/govern/sourceAnalyze/computeInfo',
    method: 'post',
    data
  })
}

export function getStoreInfo(data = {}) {
  return fetch({
    url: '/govern/sourceAnalyze/storeInfo',
    method: 'post',
    data
  })
}

export function getComputeList(data = {}) {
  return fetch({
    url: '/govern/sourceAnalyze/computeList',
    method: 'post',
    data
  })
}

export function getStoreList(data = {}) {
  return fetch({
    url: '/govern/sourceAnalyze/storeList',
    method: 'post',
    data
  })
}

export function getComputeTrend(data = {}) {
  return fetch({
    url: '/govern/sourceAnalyze/computeTrend',
    method: 'post',
    data
  })
}

export function getStoreTrend(data = {}) {
  return fetch({
    url: '/govern/sourceAnalyze/storeTrend',
    method: 'post',
    data
  })
}

export function getProjectAnalyzeData(data = {}) {
  return fetch({
    url: '/govern/sourceAnalyze/projectAnalyze',
    method: 'post',
    data
  })
}
