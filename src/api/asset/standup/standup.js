import fetch from '@/libs/fetch'

// 全表查询
export function listAll(data = {}) {
  return fetch({
    url: '/standard/listAll',
    method: 'post',
    data
  })
}
// 下拉选项
export function getSelectName(data = {}) {
  return fetch({
    url: '/standard/getSelectName',
    method: 'post',
    data
  })
}
// 业务域表-增
export function saveBusinessDomain(data = {}) {
  return fetch({
    url: '/standard/saveBusinessDomain',
    method: 'post',
    data
  })
}
// 业务域表-删
export function delBusinessDomain(data = {}) {
  return fetch({
    url: '/standard/delBusinessDomain',
    method: 'post',
    data
  })
}
// 业务域表-改
export function editBusinessDomain(data = {}) {
  return fetch({
    url: '/standard/editBusinessDomain',
    method: 'post',
    data
  })
}
// 业务域表-查
export function listBusinessDomain(data = {}) {
  return fetch({
    url: '/standard/listBusinessDomain',
    method: 'post',
    data
  })
}

// 术语组表-增
export function saveTermGroup(data = {}) {
  return fetch({
    url: '/standard/saveTermGroup',
    method: 'post',
    data
  })
}
// 术语组表-删
export function delTermGroup(data = {}) {
  return fetch({
    url: '/standard/delTermGroup',
    method: 'post',
    data
  })
}
// 术语组表-改
export function editTermGroup(data = {}) {
  return fetch({
    url: '/standard/editTermGroup',
    method: 'post',
    data
  })
}
// 术语组表-查
export function listTermGroup(data = {}) {
  return fetch({
    url: '/standard/listTermGroup',
    method: 'post',
    data
  })
}

// 术语表-增
export function saveTerm(data = {}) {
  return fetch({
    url: '/standard/saveTerm',
    method: 'post',
    data
  })
}
// 术语表-删
export function delTerm(data = {}) {
  return fetch({
    url: '/standard/delTerm',
    method: 'post',
    data
  })
}
// 术语表-改
export function editTerm(data = {}) {
  return fetch({
    url: '/standard/editTerm',
    method: 'post',
    data
  })
}
// 术语表-查
export function listTerm(data = {}) {
  return fetch({
    url: '/standard/listTerm',
    method: 'post',
    data
  })
}

// 单位表-增
export function saveUnit(data = {}) {
  return fetch({
    url: '/standard/saveUnit',
    method: 'post',
    data
  })
}
// 单位表-删
export function delUnit(data = {}) {
  return fetch({
    url: '/standard/delUnit',
    method: 'post',
    data
  })
}
// 单位表-改
export function editUnit(data = {}) {
  return fetch({
    url: '/standard/editUnit',
    method: 'post',
    data
  })
}
// 单位表-查
export function listUnit(data = {}) {
  return fetch({
    url: '/standard/listUnit',
    method: 'post',
    data
  })
}

// 维度组表-增
export function saveDimGroup(data = {}) {
  return fetch({
    url: '/standard/saveDimGroup',
    method: 'post',
    data
  })
}
// 维度组表-删
export function delDimGroup(data = {}) {
  return fetch({
    url: '/standard/delDimGroup',
    method: 'post',
    data
  })
}
// 维度组表-改
export function editDimGroup(data = {}) {
  return fetch({
    url: '/standard/editDimGroup',
    method: 'post',
    data
  })
}
// 维度组表-查
export function listDimGroup(data = {}) {
  return fetch({
    url: '/standard/listDimGroup',
    method: 'post',
    data
  })
}

// 维度表-增
export function saveDim(data = {}) {
  return fetch({
    url: '/standard/saveDim',
    method: 'post',
    data
  })
}
// 维度表-删
export function delDim(data = {}) {
  return fetch({
    url: '/standard/delDim',
    method: 'post',
    data
  })
}
// 维度表-改
export function editDim(data = {}) {
  return fetch({
    url: '/standard/editDim',
    method: 'post',
    data
  })
}
// 维度表-查
export function listDim(data = {}) {
  return fetch({
    url: '/standard/listDim',
    method: 'post',
    data
  })
}

// 指标表-增
export function saveIndex(data = {}) {
  return fetch({
    url: '/standard/saveIndex',
    method: 'post',
    data
  })
}
// 指标表-删
export function delIndex(data = {}) {
  return fetch({
    url: '/standard/delIndex',
    method: 'post',
    data
  })
}
// 指标表-改
export function editIndex(data = {}) {
  return fetch({
    url: '/standard/editIndex',
    method: 'post',
    data
  })
}
// 指标表-查
export function listIndex(data = {}) {
  return fetch({
    url: '/standard/listIndex',
    method: 'post',
    data
  })
}

// 约束条件表-增
export function saveCondition(data = {}) {
  return fetch({
    url: '/standard/saveCondition',
    method: 'post',
    data
  })
}
// 约束条件表-删
export function delCondition(data = {}) {
  return fetch({
    url: '/standard/delCondition',
    method: 'post',
    data
  })
}
// 约束条件表-改
export function editCondition(data = {}) {
  return fetch({
    url: '/standard/editCondition',
    method: 'post',
    data
  })
}
// 约束条件表-查
export function listCondition(data = {}) {
  return fetch({
    url: '/standard/listCondition',
    method: 'post',
    data
  })
}

// 表类型-增
export function saveTabletype(data = {}) {
  return fetch({
    url: '/standard/saveTabletype',
    method: 'post',
    data
  })
}
// 表类型-删
export function delTabletype(data = {}) {
  return fetch({
    url: '/standard/delTabletype',
    method: 'post',
    data
  })
}
// 表类型-改
export function editTabletype(data = {}) {
  return fetch({
    url: '/standard/editTabletype',
    method: 'post',
    data
  })
}
// 表类型-查
export function listTabletype(data = {}) {
  return fetch({
    url: '/standard/listTabletype',
    method: 'post',
    data
  })
}

// 数据层级-增
export function saveDatalevel(data = {}) {
  return fetch({
    url: '/standard/saveDatalevel',
    method: 'post',
    data
  })
}
// 数据层级-删
export function delDatalevel(data = {}) {
  return fetch({
    url: '/standard/delDatalevel',
    method: 'post',
    data
  })
}
// 数据层级-改
export function editDatalevel(data = {}) {
  return fetch({
    url: '/standard/editDatalevel',
    method: 'post',
    data
  })
}
// 数据层级-查
export function listDatalevel(data = {}) {
  return fetch({
    url: '/standard/listDatalevel',
    method: 'post',
    data
  })
}

// 数据层级-查
export function saveDynamicForm(data = {}) {
  return fetch({
    url: '/dynamicForm/save',
    method: 'post',
    data
  })
}
