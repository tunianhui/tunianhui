import fetch from '@/libs/fetch'

// 数据源列表
export function getTableList(data = {}) {
  return fetch({
    url: '/plan/planDatasource/list',
    method: 'post',
    data
  })
}
// 新增数据源
export function addDataSource(data = {}, type) {
  return fetch({
    url: '/plan/planDatasource/save',
    method: 'post',
    type,
    data
  })
}
// 修改数据源
export function editDataSource(data = {}, type) {
  return fetch({
    url: '/plan/planDatasource/edit',
    method: 'post',
    type,
    data
  })
}
// 批量删除
export function batchDelDataSource(data = {}) {
  return fetch({
    url: '/plan/planDatasource/batchDel',
    method: 'post',
    data
  })
}
// 删除当前数据源
export function delDataSource(data = {}) {
  return fetch({
    url: '/plan/planDatasource/del',
    method: 'post',
    data
  })
}
// 获取项目列表
export function getProjectList(data = {}) {
  return fetch({
    url: '/plan/planProject/list',
    method: 'post',
    data
  })
}
// 测试连接
export function getTestConnection(data = {}) {
  return fetch({
    url: '/plan/planDatasource/dataSourceContectTest',
    method: 'post',
    data
  })
}
