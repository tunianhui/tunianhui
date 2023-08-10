import fetch from '@/libs/fetch'

// 业务限定-删除
export function delLimit(data = {}) {
  return fetch({
    url: '/developTask/developModelBusCondition/del',
    method: 'post',
    data
  })
}

// 业务限定-下线
export function offLine(data = {}) {
  return fetch({
    url: '/developTask/developModelBusCondition/offLine',
    method: 'post',
    data
  })
}

// 业务限定-查询
export function queryLimit(data = {}) {
  return fetch({
    url: '/developTask/developModelBusCondition/queryById',
    method: 'post',
    data
  })
}

// 业务限定-列表接口
export function queryConditionInfo(data = {}) {
  return fetch({
    url: '/developTask/developModelBusCondition/queryConditionInfo',
    method: 'post',
    data
  })
}

// 业务限定-编辑发布
// export function conditionPublish(data = {}) {
//   return fetch({
//     url: '/developTask/developModelBusCondition/busConditionPublish',
//     method: 'post',
//     data
//   })
// }

export function edit(data = {}) {
  return fetch({
    url: '/developTask/developModelBusCondition/edit',
    method: 'post',
    data
  })
}

export function busConditionPublish(data = {}) {
  return fetch({
    url: '/developTask/developModelBusCondition/busConditionPublish',
    method: 'post',
    data
  })
}

export function save(data = {}) {
  return fetch({
    url: '/developTask/developModelBusCondition/save',
    method: 'post',
    data
  })
}

// 主要来源字段接口
export function queryFactLogicAndRelatonInfo(data = {}) {
  return fetch({
    url: '/developTask/developModelBusCondition/queryFactLogicAndRelatonInfo',
    method: 'post',
    data
  })
}

// 来源表模型接口
export function getSourceTableModelInfo(data = {}) {
  return fetch({
    url: '/developTask/developModelBusCondition/getSourceTableModelInfo',
    method: 'post',
    data
  })
}

// 来源表模型-选择事实接口
export function getSourceTableModelInfoFact(data = {}) {
  return fetch({
    url: '/developTask/developModelBusCondition/getSourceTableModelInfoFact',
    method: 'post',
    data
  })
}

// 来源表模型-选择维度接口
export function getSourceTableModelInfoDim(data = {}) {
  return fetch({
    url: '/developTask/developModelBusCondition/getSourceTableModelInfoDim',
    method: 'post',
    data
  })
}

// 计算逻辑校验
export function filterVerification(data = {}) {
  return fetch({
    url: '/developTask/developModelBusCondition/filterVerification',
    method: 'post',
    data
  })
}
