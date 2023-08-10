// import {
//   Random
// } from 'mockjs'
// import {
//   getRangeDates
// } from '@/libs/util'
import fetch from '@/libs/fetch'

// const setData = data =>
//   new Promise((resolve, reject) => {
//     resolve(data)
//   })

// const getTreeList = data =>
//   setData({
//     flag: true,
//     data: Array.from({
//       length: JSON.stringify(data) !== '{}' ? data.length : 15
//     }, d => ({
//       id: Random.id(),
//       label: JSON.stringify(data) !== '{}' ? Random.pick(data) : Random.name(),
//       type: 0,
//       children: Array.from({
//         length: JSON.stringify(data) !== '{}' ? data.length : 15
//       }, d => ({
//         id: Random.id(),
//         label: JSON.stringify(data) !== '{}' ? Random.pick(data) : Random.name(),
//         type: 1
//       }))
//     }))
//   })

// export function getTreeData(data = {}) {
//   return getTreeList(data)
// }

// 标准定义--树
export function getTreeData(data = {}) {
  return fetch({
    url: '/standardManagement/listTree',
    method: 'post',
    data
  })
}

// 业务板块
export function getListBusiness(data = {}) {
  return fetch({
    url: '/plan/planBusiness/listBusiness',
    method: 'post',
    data
  })
}

// 标准依据
export function getListBasis(data = {}) {
  return fetch({
    url: '/standardManagement/listBasis',
    method: 'post',
    data
  })
}

// 代码标准规则
export function getListCodeRule(data = {}) {
  return fetch({
    url: '/standardManagement/listCodeRule',
    method: 'post',
    data
  })
}

// 引用代码
export function getListCodeQuote(data = {}) {
  return fetch({
    url: '/standardManagement/listCodeQuote',
    method: 'post',
    data
  })
}

// 标准归属部门
export function getListdepartment(data = {}) {
  return fetch({
    url: '/standardManagement/listdepartment',
    method: 'post',
    data
  })
}

// 标准定义保存
export function saveStandard(data = {}) {
  return fetch({
    url: '/standardManagement/save',
    method: 'post',
    data
  })
}

// 标准定义修改
export function editStandard(data = {}) {
  return fetch({
    url: '/standardManagement/edit',
    method: 'post',
    data
  })
}

// 标准定义删除
export function deleteStandard(data = {}) {
  return fetch({
    url: '/standardManagement/delete',
    method: 'post',
    data
  })
}

// 版本号格式校验
export function getValidVersion(data = {}) {
  return fetch({
    url: '/standardManagement/validVersion',
    method: 'post',
    data
  })
}

// 生成版本号
export function getGenerateVersion(data = {}) {
  return fetch({
    url: '/standardManagement/generateVersion',
    method: 'post',
    data
  })
}

// 标准分页列表
export function getCriterionListPage(data = {}) {
  return fetch({
    url: '/standardManagement/listPage',
    method: 'post',
    data
  })
}

// 批量删除
export function batchDel(data = {}) {
  return fetch({
    url: '/standardManagement/batchDelete',
    method: 'post',
    data
  })
}

// 批量发布
export function batchRelease(data = {}) {
  return fetch({
    url: '/standardManagement/release',
    method: 'post',
    data
  })
}

// 值域
export function getRangeList(data = {}) {
  return fetch({
    url: '/dataDictionary/listAll',
    method: 'post',
    data
  })
}
