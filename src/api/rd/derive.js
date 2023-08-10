import fetch from '@/libs/fetch'

// 选择原子指标
export function queryAtomicIndex(data = {}) {
  return fetch({
    url: '/developTask/developModelDeriveIndex/queryAtomicIndex',
    method: 'post',
    data
  })
}

// 统计粒度接口
export function queryDimension(data = {}) {
  return fetch({
    url: '/developTask/developModelDeriveIndex/queryDimension',
    method: 'post',
    data
  })
}
export function queryDimension1(data = {}) {
  return fetch({
    url: '/developTask/developModelSummaryLogic/queryDimension',
    method: 'post',
    data
  })
}

// 统计周期接口
export function queryCycle(data = {}) {
  return fetch({
    url: '/developTask/developModelDeriveIndex/queryCycle',
    method: 'post',
    data
  })
}

// 绑定业务限定接口
export function queryCondition(data = {}) {
  return fetch({
    url: '/developTask/developModelDeriveIndex/queryCondition',
    method: 'post',
    data
  })
}

// 保存接口
export function save(data = {}) {
  return fetch({
    url: '/developTask/developModelDeriveIndex/save',
    method: 'post',
    data
  })
}

// 批量发布接口
export function deriveIndexBatchPublish(data = {}) {
  return fetch({
    url: '/developTask/developModelDeriveIndex/deriveIndexBatchPublish',
    method: 'post',
    data
  })
}

// 单个发布接口
export function deriveIndexPublish(data = {}) {
  return fetch({
    url: '/developTask/developModelDeriveIndex/deriveIndexPublish',
    method: 'post',
    data
  })
}

// 删除接口
export function del(data = {}) {
  return fetch({
    url: '/developTask/developModelDeriveIndex/del',
    method: 'post',
    data
  })
}

// 修改接口
export function edit(data = {}) {
  return fetch({
    url: '/developTask/developModelDeriveIndex/edit',
    method: 'post',
    data
  })
}

// 已生成派生指标接口
export function queryDeriveIndex(data = {}) {
  return fetch({
    url: '/developTask/developModelDeriveIndex/queryDeriveIndex',
    method: 'post',
    data
  })
}

// 已生成派生指标接口
export function offLine(data = {}) {
  return fetch({
    url: '/developTask/developModelDeriveIndex/offLine',
    method: 'post',
    data
  })
}

// 新生成派生指标删除接口
export function delDerivative(data = {}) {
  return fetch({
    url: '/developTask/developModelDeriveIndex/delDerivative',
    method: 'post',
    data
  })
}

// 单个派生指标联合属性查询
export function queryUnionAttrInfo(data = {}) {
  return fetch({
    url: '/developTask/developModelDeriveIndex/queryUnionAttrInfo',
    method: 'post',
    data
  })
}

// 单个派生指标联合属性查询
export function queryUnionAttrInfoByDimIds(data = {}) {
  return fetch({
    url: '/developTask/developModelDeriveIndex/queryUnionAttrInfoByDimIds',
    method: 'post',
    data
  })
}
