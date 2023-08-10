import fetch from '@/libs/fetch'

// 表权限列表-已生效
export function getPermissionTableList(data = {}) {
  return fetch({
    url: '/authority/table/list',
    method: 'post',
    data
  })
}

// 表权限列表-已失效
export function getPermissionTableListInvalid(data = {}) {
  return fetch({
    url: '/authority/table/expire/list',
    method: 'post',
    data
  })
}

// 表权限列表-申请记录
export function getPermissionTableListRecord(data = {}) {
  return fetch({
    url: '/authority/table/apply/list',
    method: 'post',
    data
  })
}

// 表权限列表-详情
export function getPermissionTableDetail(data = {}) {
  return fetch({
    url: '/authority/table/queryById',
    method: 'post',
    data
  })
}

// 表类型列表
export function getTableTypeList(data = {}) {
  return fetch({
    url: '/authority/table/getTableType',
    method: 'post',
    data
  })
}

// 权限交还
export function returnTable(data = {}) {
  return fetch({
    url: '/authority/table/delete',
    method: 'post',
    data
  })
}

// 权限续期
export function renewalTable(data = {}) {
  return fetch({
    url: '/authority/table/renewal',
    method: 'post',
    data
  })
}

export function getTableData(data = {}) {
  return fetch({
    url: '/asset/permission/list',
    method: 'post',
    data
  })
}

export function getRecall(data = {}) {
  return fetch({
    url: '/asset/permission/recall',
    method: 'post',
    data
  })
}

// 申请权限
export function authoritySubmit(data = {}) {
  return fetch({
    url: '/authority/submit',
    method: 'post',
    data
  })
}

// 逻辑表权限列表
export function getLogicTable(data = {}) {
  return fetch({
    url: '/authority/table/logic/list',
    method: 'post',
    data
  })
}

// 逻辑表明细
export function getLogicTableDetail(data = {}) {
  return fetch({
    url: '/authority/table/logic/queryById',
    method: 'post',
    data
  })
}

// 逻辑表权限交还  type 0 逻辑表 1 物理表 2 权限表
export function returnLogicTableAuthority(data = {}) {
  return fetch({
    url: '/authority/table/logic/delete',
    method: 'post',
    data
  })
}

// 物理表权限列表
export function getPhysicsTable(data = {}) {
  return fetch({
    url: '/authority/table/physics/list',
    method: 'post',
    data
  })
}

// 物理表明细
export function getPhysicsTableDetail(data = {}) {
  return fetch({
    url: '/authority/table/physics/queryById',
    method: 'post',
    data
  })
}

// 物理表权限列表
export function getDataSourceTable(data = {}) {
  return fetch({
    url: '/authority/datasource/list',
    method: 'post',
    data
  })
}
// 逻辑表下拉
export function getLogicTables(data = {}) {
  return fetch({
    url: '/authority/getTables',
    method: 'post',
    data
  })
}

// 逻辑表申请页中的表格 获取权限字段
export function getLogicColumns(data = {}) {
  return fetch({
    url: '/authority/getColumns',
    method: 'post',
    data
  })
}

// 账号列表
export function getAccountList(data = {}) {
  return fetch({
    url: '/plan/commonDict/getBusinessProject',
    method: 'post',
    data
  })
}

export function getAllBusinessProject(data = {}) {
  return fetch({
    url: '/plan/commonDict/getAllBusinessProject',
    method: 'post',
    data
  })
}

