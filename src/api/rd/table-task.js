import fetch from '@/libs/fetch'

// 示例
export function example(data = {}) {
  return fetch({
    url: '',
    method: 'post',
    data
  })
}
// 表分层
export function queryTableLevelList(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/queryTableLevelList',
    method: 'post',
    data
  })
}

// 库
export function queryDataSourceDb(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/queryDataSourceDb',
    method: 'post',
    data
  })
}

// 维度
export function queryLabelDim(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/queryLabelDim',
    method: 'post',
    data
  })
}

// 度量
export function queryLabelMeasure(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/queryLabelMeasure',
    method: 'post',
    data
  })
}

