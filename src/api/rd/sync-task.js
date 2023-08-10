import fetch from '@/libs/fetch'

// 树列表
export function getTreeData(data = {}) {
  return fetch({
    url: '/developTask/developModelSyncTask/list',
    method: 'post',
    data
  })
}

// 新建文件夹
export function saveFolder(data = {}) {
  return fetch({
    url: '/developTask/developModelSyncTask/saveFolder',
    method: 'post',
    data
  })
}

// 删除文件夹
export function delFolder(data = {}) {
  return fetch({
    url: '/developTask/developModelSyncTask/deleteFuncOrFolder',
    method: 'post',
    data
  })
}

// 数据源列表
export function getMetaDataSource(data = {}) {
  return fetch({
    url: '/developTask/developModelSyncTask/getMetaDataSource',
    method: 'post',
    data
  })
}

// 数据源--对应所有表
export function getDataSourceTable(data = {}) {
  return fetch({
    url: '/developTask/developModelSyncTask/getDataSourceTable',
    method: 'post',
    data
  })
}

// 表--对应所有字段
export function getTableColumnInfo(data = {}) {
  return fetch({
    url: '/developTask/developModelSyncTask/getTableColumnInfo',
    method: 'post',
    data
  })
}

// 任务信息查询
export function queryMetaSyncInfo(data = {}) {
  return fetch({
    url: '/developTask/developModelSyncTask/queryMetaSyncInfo',
    method: 'post',
    data
  })
}

// 新建保存任务
export function saveTask(data = {}) {
  return fetch({
    url: '/developTask/developModelSyncTask/saveTask',
    method: 'post',
    data
  })
}

// 编辑任务
export function editTask(data = {}) {
  return fetch({
    url: '/developTask/developModelSyncTask/editTask',
    method: 'post',
    data
  })
}

// 移动文件
export function moveFuncOrFolder(data = {}) {
  return fetch({
    url: '/developTask/developModelSyncTask/moveFuncOrFolder',
    method: 'post',
    data
  })
}

// 重命名
export function renameFileOrFolder(data = {}) {
  return fetch({
    url: '/developTask/developModelSyncTask/renameFileOrFolder',
    method: 'post',
    data
  })
}
