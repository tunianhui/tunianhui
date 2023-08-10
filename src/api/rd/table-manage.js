import fetch from '@/libs/fetch'

// 示例
export function example(data = {}) {
  return fetch({
    url: '',
    method: 'post',
    data
  })
}
// 树节点列表
export function list(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/list',
    method: 'post',
    data
  })
}
// 新建文件夹
export function saveFolder(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/saveFolder',
    method: 'post',
    data
  })
}
// 删除-文件夹/文件
export function del(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/del',
    method: 'post',
    data
  })
}
// 移动-文件夹/文件
export function moveWorkOrderOrFolder(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/moveWorkOrderOrFolder',
    method: 'post',
    data
  })
}
// 文件夹重命名
export function renameFolder(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/renameFolder',
    method: 'post',
    data
  })
}
// 批量导入
export function execlImport(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/execlImport',
    method: 'post',
    data
  })
}
// 模板下载
export function downTemplate(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/downTemplate',
    method: 'get',
    data
  })
}
// 查询-明细展示、编辑回填使用
export function queryById(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/queryById',
    method: 'post',
    data
  })
}
// 新建表保存
export function createTableSave(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/createTableSave',
    method: 'post',
    data
  })
}
// 新建表编辑
export function createTableEdit(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/createTableEdit',
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
// 数据源类型
export function queryDataSourceTypeList(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/queryDataSourceTypeList',
    method: 'post',
    data
  })
}
// 数据源
export function queryDataSource(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/queryDataSource',
    method: 'post',
    data
  })
}
// 数据库
export function queryDataSourceDb(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/queryDataSourceDb',
    method: 'post',
    data
  })
}
// 主题域归属
export function queryDataField(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/queryDataField',
    method: 'post',
    data
  })
}
// 建表sql解析
export function createTableSqlParser(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/createTableSqlParser',
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
// 数据类型-hive,mysql,tidb,clickhouse
export function queryDataType(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/queryDataType',
    method: 'post',
    data
  })
}
// 批量导出
export function execlExport(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/execlExport',
    method: 'post',
    data,
    responseType: 'blob'
  })
}
// 修改表保存
export function modifyTableSave(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/modifyTableSave',
    method: 'post',
    data,
  })
}
// 修改表编辑
export function modifyTableEdit(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/modifyTableEdit',
    method: 'post',
    data,
  })
}
// 表--修改表使用
export function queryMetaTableList(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/queryMetaTableList',
    method: 'post',
    data,
  })
}
// 表信息--修改表使用
export function queryMetaTableInfo(data = {}) {
  return fetch({
    url: '/developTask/developModelWorkOrder/queryMetaTableInfo',
    method: 'post',
    data,
  })
}
